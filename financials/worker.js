export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (url.pathname !== "/api/financials") {
      return json({error:"Not found"}, 404);
    }
    const ticker = (url.searchParams.get("ticker") || "").toUpperCase().trim();
    if (!ticker) return cors(json({error:"ticker required"}, 400));

    const API_KEY = env.API_KEY; // set via wrangler secrets
    const base = "https://financialmodelingprep.com/api/v3";

    try {
      // Company profile (for name/sector/industry/price/mktcap)
      const prof = await get(`${base}/profile/${ticker}?apikey=${API_KEY}`);
      const p = Array.isArray(prof) ? prof[0] : null;

      // Income statements (limit 6 years)
      const inc = await get(`${base}/income-statement/${ticker}?period=annual&limit=6&apikey=${API_KEY}`);

      // Balance sheets
      const bal = await get(`${base}/balance-sheet-statement/${ticker}?period=annual&limit=6&apikey=${API_KEY}`);

      // Cash flows
      const cf  = await get(`${base}/cash-flow-statement/${ticker}?period=annual&limit=6&apikey=${API_KEY}`);

      // Ratios
      const rt  = await get(`${base}/ratios/${ticker}?period=annual&limit=6&apikey=${API_KEY}`);

      if (!p || !Array.isArray(inc) || !inc.length) {
        return cors(json({error:`no data for ${ticker}`}, 404));
      }

      // Normalize by year (most APIs return latest-first)
      const years = [...new Set(inc.map(r => (r.calendarYear || (r.date||"").slice(0,4))))].sort((a,b)=>b-a);

      const mapYear = (arr, pick) => {
        const out = {};
        (arr||[]).forEach(r=>{
          const y = (r.calendarYear || (r.date||"").slice(0,4));
          if (!y) return;
          out[y] = pick(r);
        });
        return out;
      };

      const data = {
        overview: {
          ticker,
          companyName: p.companyName || p.company || "",
          sector: p.sector || "",
          industry: p.industry || "",
          price: num(p.price),
          marketCap: num(p.mktCap || p.marketCap),
          revenue: num(inc[0]?.revenue),
          netMargin: (inc[0]?.revenue && inc[0]?.netIncome) ? ((inc[0].netIncome / inc[0].revenue) * 100).toFixed(1) + "%" : null
        },
        years,
        income: mapYear(inc, r => ({
          revenue: num(r.revenue),
          grossProfit: num(r.grossProfit),
          operatingIncome: num(r.operatingIncome),
          netIncome: num(r.netIncome),
          eps: num(r.eps || r.epsdiluted || r.epsDiluted)
        })),
        balance: mapYear(bal, r => ({
          cash: num(r.cashAndCashEquivalents),
          assets: num(r.totalAssets),
          liabilities: num(r.totalLiabilities),
          debt: num(r.totalDebt),
          equity: num(r.totalStockholdersEquity || r.totalShareholderEquity),
          currAssets: num(r.totalCurrentAssets),
          currLiab: num(r.totalCurrentLiabilities)
        })),
        cashflow: mapYear(cf, r => ({
          opCF: num(r.netCashProvidedByOperatingActivities || r.operatingCashFlow),
          invCF: num(r.netCashUsedForInvestingActivites || r.netCashUsedForInvestingActivities),
          finCF: num(r.netCashUsedProvidedByFinancingActivities),
          capex: num(r.capitalExpenditure) != null ? num(r.capitalExpenditure) : (num(r.investmentsInPropertyPlantAndEquipment)),
          freeCF: num(r.freeCashFlow)
        })),
        ratios: mapYear(rt, r => ({
          roe: num(r.returnOnEquity) ?? null,
          roa: num(r.returnOnAssets) ?? null,
          debtToEquity: num(r.debtEquityRatio) ?? null,
          assetTurnover: num(r.assetTurnover) ?? null,
          pe: num(r.priceEarningsRatio) ?? null,
          ps: num(r.priceToSalesRatio) ?? null
        }))
      };

      return cors(json(data));
    } catch (e) {
      return cors(json({error: e.message || "fetch error"}, 500));
    }

    async function get(u) {
      const r = await fetch(u, { cf: { cacheTtl: 300, cacheEverything: true }});
      if (!r.ok) throw new Error(`Upstream ${r.status}`);
      return r.json();
    }
    function num(v){ const n = Number(v); return Number.isFinite(n) ? n : null; }
    function json(obj, status=200){ return new Response(JSON.stringify(obj), {status, headers:{'content-type':'application/json'}}); }
    function cors(resp){
      resp.headers.set('access-control-allow-origin','*');
      resp.headers.set('access-control-allow-methods','GET,OPTIONS');
      resp.headers.set('access-control-allow-headers','Content-Type');
      return resp;
    }
  }
};
