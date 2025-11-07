// ===== tiny helpers =====
const $  = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const els = {
  ticker: $('#ticker'),
  open:   $('#open'),
  status: $('#status'),
  tabs:   $$('.tab'),
  pOverview:   $('#panel-overview'),
  pStatements: $('#panel-statements'),
  pRatios:     $('#panel-ratios'),
  ov:  $('#ov'),
  inc: $('#inc'),
  bal: $('#bal'),
  cf:  $('#cf'),
  rt:  $('#rt'),
  recent: $('#recent'),
};
const fmtNum = (n) => (n==null ? '—' : Number(n).toLocaleString());
const fmtBill= (n) => (n==null ? '—' : (Math.abs(n)>=1e9 ? (n/1e9).toFixed(1)+'B' : fmtNum(n)));

function makeTable(columns, rows) {
  const thead = `<thead><tr><th>Metric</th>${columns.map(c=>`<th>${c}</th>`).join('')}</tr></thead>`;
  const tbody = rows.map(([name, vals])=>`<tr><td>${name}</td>${vals.map(v=>`<td>${v}</td>`).join('')}</tr>`).join('');
  return `<table>${thead}<tbody>${tbody}</tbody></table>`;
}

// ===== Phase 1 sample data (enough to exercise UI) =====
const DATA = {
  AAPL: {
    profile: { ticker:'AAPL', companyName:'Apple Inc.', sector:'Technology', industry:'Consumer Electronics', price: 229.2, marketCap: 3_600_000_000_000, },
    years: ['2024','2023','2022','2021'],
    income: {
      2024:{ revenue:383_300_000_000, grossProfit:170_780_000_000, operatingIncome:114_300_000_000, netIncome: 97_000_000_000, eps:6.1 },
      2023:{ revenue:383_000_000_000, grossProfit:169_000_000_000, operatingIncome:114_000_000_000, netIncome: 97_000_000_000, eps:6.0 },
      2022:{ revenue:394_300_000_000, grossProfit:170_800_000_000, operatingIncome:119_400_000_000, netIncome: 99_800_000_000, eps:6.1 },
      2021:{ revenue:365_800_000_000, grossProfit:152_800_000_000, operatingIncome:108_900_000_000, netIncome: 94_700_000_000, eps:5.6 },
    },
    balance: {
      2024:{ cash:29_965_000_000, assets:352_000_000_000, liabilities:290_000_000_000, debt: 108_000_000_000, equity: 62_000_000_000, currAssets: 143_000_000_000, currLiab: 145_000_000_000 },
      2023:{ cash:29_965_000_000, assets:352_755_000_000, liabilities:290_437_000_000, debt: 109_000_000_000, equity: 62_318_000_000, currAssets: 143_566_000_000, currLiab: 145_308_000_000 },
      2022:{ cash:23_646_000_000, assets:352_755_000_000, liabilities:302_083_000_000, debt: 120_000_000_000, equity: 50_672_000_000, currAssets: 135_405_000_000, currLiab: 153_982_000_000 },
      2021:{ cash:34_940_000_000, assets:351_002_000_000, liabilities:287_912_000_000, debt: 124_000_000_000, equity: 63_090_000_000, currAssets: 134_836_000_000, currLiab: 125_481_000_000 },
    },
    cashflow: {
      2024:{ opCF: 110_000_000_000, invCF: -10_000_000_000, finCF: -100_000_000_000, capex: -10_700_000_000, freeCF:  99_300_000_000 },
      2023:{ opCF:   1_100_000_000, invCF:  -5_000_000_000, finCF:   -1_000_000_000, capex: -10_500_000_000, freeCF: -9_400_000_000 },
      2022:{ opCF: 122_151_000_000, invCF: -22_835_000_000, finCF: -111_557_000_000, capex: -10_708_000_000, freeCF: 111_443_000_000 },
      2021:{ opCF: 104_038_000_000, invCF: -14_545_000_000, finCF:  -93_353_000_000, capex:  -11_085_000_000, freeCF:  92_953_000_000 },
    },
    ratios: {
      2024:{ roe:1.56, roa:0.28, debtToEquity:1.74, assetTurnover:1.10, pe:29.4, ps:7.4 },
      2023:{ roe:1.55, roa:0.27, debtToEquity:1.75, assetTurnover:1.09, pe:28.4, ps:7.2 },
      2022:{ roe:1.97, roa:0.30, debtToEquity:2.37, assetTurnover:1.12, pe:24.7, ps:6.4 },
      2021:{ roe:1.50, roa:0.27, debtToEquity:1.96, assetTurnover:1.04, pe:28.7, ps:7.2 },
    }
  },

  MSFT: {
    profile: { ticker:'MSFT', companyName:'Microsoft Corporation', sector:'Technology', industry:'Software', price: 418.1, marketCap: 3_300_000_000_000, },
    years: ['2024','2023','2022','2021'],
    income: {
      2024:{ revenue:245_000_000_000, grossProfit:171_000_000_000, operatingIncome:103_000_000_000, netIncome:89_000_000_000, eps:11.6 },
      2023:{ revenue:212_000_000_000, grossProfit:146_000_000_000, operatingIncome: 83_000_000_000, netIncome:72_000_000_000, eps: 9.7 },
      2022:{ revenue:198_000_000_000, grossProfit:134_000_000_000, operatingIncome: 83_000_000_000, netIncome:72_000_000_000, eps: 9.2 },
      2021:{ revenue:168_000_000_000, grossProfit:115_000_000_000, operatingIncome: 70_000_000_000, netIncome:61_000_000_000, eps: 8.1 },
    },
    balance: {
      2024:{ cash:81_000_000_000, assets:500_000_000_000, liabilities:210_000_000_000, debt:58_000_000_000, equity:290_000_000_000, currAssets: 190_000_000_000, currLiab: 110_000_000_000 },
      2023:{ cash:81_000_000_000, assets:470_000_000_000, liabilities:205_000_000_000, debt:59_000_000_000, equity:265_000_000_000, currAssets: 170_000_000_000, currLiab: 104_000_000_000 },
      2022:{ cash:104_000_000_000, assets:430_000_000_000, liabilities:198_000_000_000, debt:59_000_000_000, equity:232_000_000_000, currAssets: 169_000_000_000, currLiab: 95_000_000_000 },
      2021:{ cash:130_000_000_000, assets:340_000_000_000, liabilities:191_000_000_000, debt:82_000_000_000, equity:149_000_000_000, currAssets: 174_000_000_000, currLiab: 88_000_000_000 },
    },
    cashflow: {
      2024:{ opCF:  97_000_000_000, invCF: -33_000_000_000, finCF: -65_000_000_000, capex:-32_000_000_000, freeCF: 65_000_000_000 },
      2023:{ opCF:  87_000_000_000, invCF: -22_000_000_000, finCF: -63_000_000_000, capex:-26_000_000_000, freeCF: 61_000_000_000 },
      2022:{ opCF:  89_000_000_000, invCF: -25_000_000_000, finCF: -62_000_000_000, capex:-24_000_000_000, freeCF: 65_000_000_000 },
      2021:{ opCF:  76_000_000_000, invCF: -23_000_000_000, finCF: -52_000_000_000, capex:-22_000_000_000, freeCF: 54_000_000_000 },
    },
    ratios: {
      2024:{ roe:0.31, roa:0.19, debtToEquity:0.20, assetTurnover:0.49, pe:36.1, ps:14.4 },
      2023:{ roe:0.27, roa:0.17, debtToEquity:0.22, assetTurnover:0.45, pe:34.0, ps:12.6 },
      2022:{ roe:0.31, roa:0.20, debtToEquity:0.25, assetTurnover:0.46, pe:29.4, ps:11.3 },
      2021:{ roe:0.41, roa:0.18, debtToEquity:0.55, assetTurnover:0.49, pe:35.5, ps:12.4 },
    }
  }
};

// ===== tabs =====
els.tabs.forEach(a=>{
  a.addEventListener('click', e=>{
    e.preventDefault();
    els.tabs.forEach(x=>x.classList.remove('active'));
    a.classList.add('active');
    const t = a.dataset.tab;
    els.pOverview.classList.toggle('hidden', t!=='overview');
    els.pStatements.classList.toggle('hidden', t!=='statements');
    els.pRatios.classList.toggle('hidden', t!=='ratios');
  });
});

// ===== recent pills =====
function pushRecent(tk, name){
  const key='fin_recent';
  const arr = JSON.parse(localStorage.getItem(key) || '[]').filter(x=>x.tk!==tk);
  arr.unshift({tk,name}); if (arr.length>8) arr.length=8;
  localStorage.setItem(key, JSON.stringify(arr));
  renderRecent();
}
function renderRecent(){
  const arr = JSON.parse(localStorage.getItem('fin_recent') || '[]');
  els.recent.innerHTML = '';
  arr.forEach(({tk,name})=>{
    const a = document.createElement('a');
    a.href='#'; a.className='card'; a.innerHTML = `<h3>${tk}</h3><p class="muted">${name||''}</p>`;
    a.onclick = (e)=>{ e.preventDefault(); els.ticker.value=tk; openTicker(); };
    els.recent.appendChild(a);
  });
}
renderRecent();

// ===== renderer =====
function renderAll(d){
  // overview
  const p = d.profile;
  els.ov.innerHTML = `
    <div class="card">
      <h2>${p.ticker} — ${p.companyName}</h2>
      <p class="muted">${p.sector} • ${p.industry}</p>
      <div class="row" style="margin-top:8px">
        <span class="pill">Price: <strong>${p.price ?? '—'}</strong></span>
        <span class="pill">MktCap: <strong>${fmtBill(p.marketCap)}</strong></span>
        <span class="pill">Latest Rev: <strong>${fmtBill(d.income[d.years[0]]?.revenue)}</strong></span>
      </div>
    </div>
  `;

  // statements
  const Y = d.years; // newest -> oldest (strings)
  const I = d.income, B = d.balance, C = d.cashflow;

  els.inc.innerHTML = makeTable(Y, [
    ["Revenue",          Y.map(y=>fmtNum(I[y]?.revenue))],
    ["Gross Profit",     Y.map(y=>fmtNum(I[y]?.grossProfit))],
    ["Operating Income", Y.map(y=>fmtNum(I[y]?.operatingIncome))],
    ["Net Income",       Y.map(y=>fmtNum(I[y]?.netIncome))],
    ["EPS",              Y.map(y=>I[y]?.eps!=null ? Number(I[y].eps).toFixed(2) : '—')],
    ["Net Margin",       Y.map(y=>{
      const r=I[y]?.revenue, n=I[y]?.netIncome;
      return (r&&n) ? ((n/r)*100).toFixed(1)+'%' : '—';
    })],
  ]);

  els.bal.innerHTML = makeTable(Y, [
    ["Cash & Equivalents", Y.map(y=>fmtNum(B[y]?.cash))],
    ["Total Assets",       Y.map(y=>fmtNum(B[y]?.assets))],
    ["Total Liabilities",  Y.map(y=>fmtNum(B[y]?.liabilities))],
    ["Total Debt",         Y.map(y=>fmtNum(B[y]?.debt))],
    ["Shareholders' Equity", Y.map(y=>fmtNum(B[y]?.equity))],
    ["Current Ratio",      Y.map(y=>{
      const ca=B[y]?.currAssets, cl=B[y]?.currLiab, cr=(ca&&cl)? ca/cl : null;
      return cr ? cr.toFixed(2) : '—';
    })],
  ]);

  els.cf.innerHTML = makeTable(Y, [
    ["Operating CF", Y.map(y=>fmtNum(C[y]?.opCF))],
    ["Investing CF", Y.map(y=>fmtNum(C[y]?.invCF))],
    ["Financing CF", Y.map(y=>fmtNum(C[y]?.finCF))],
    ["CapEx",        Y.map(y=>fmtNum(C[y]?.capex))],
    ["Free CF",      Y.map(y=>{
      const v=C[y]?.freeCF, op=C[y]?.opCF??0, cap=C[y]?.capex??0;
      return fmtNum(v!=null ? v : (op + cap)); // capex is negative
    })],
  ]);

  // ratios
  const R = d.ratios;
  els.rt.innerHTML = makeTable(Y, [
    ["Operating Margin", Y.map(y=>{
      const rv=I[y]?.revenue, op=I[y]?.operatingIncome;
      return (rv&&op)? ((op/rv)*100).toFixed(1)+'%' : '—';
    })],
    ["Net Margin", Y.map(y=>{
      const rv=I[y]?.revenue, n=I[y]?.netIncome;
      return (rv&&n)? ((n/rv)*100).toFixed(1)+'%' : '—';
    })],
    ["ROE",           Y.map(y=> R[y]?.roe!=null ? (R[y].roe*100).toFixed(1)+'%' : '—')],
    ["ROA",           Y.map(y=> R[y]?.roa!=null ? (R[y].roa*100).toFixed(1)+'%' : '—')],
    ["Debt / Equity", Y.map(y=> R[y]?.debtToEquity!=null ? R[y].debtToEquity.toFixed(2) : '—')],
    ["Asset Turnover",Y.map(y=> R[y]?.assetTurnover!=null ? R[y].assetTurnover.toFixed(2) : '—')],
    ["P/E",           Y.map(y=> R[y]?.pe!=null ? R[y].pe.toFixed(1) : '—')],
    ["P/S",           Y.map(y=> R[y]?.ps!=null ? R[y].ps.toFixed(1) : '—')],
  ]);
}

// ===== actions =====
async function openTicker(){
  const tk = (els.ticker.value||'').trim().toUpperCase();
  if (!tk){ els.status.innerHTML = "<span class='bad'>Enter a ticker.</span>"; return; }
  els.status.textContent = "Loading…";

  // Phase 1: read from local DATA
  const d = DATA[tk];
  if (!d){
    els.status.innerHTML = `<span class="bad">"${tk}" not in sample set (try AAPL or MSFT). Phase 2 will support all tickers.</span>`;
    return;
  }

  renderAll(d);
  els.status.innerHTML = `<span class="ok">Loaded ${tk} ✓</span>`;
  pushRecent(d.profile.ticker, d.profile.companyName);

  // auto-switch to Statements so you see tables immediately
  els.tabs.forEach(x=>x.classList.remove('active'));
  document.querySelector('[data-tab="statements"]').classList.add('active');
  els.pOverview.classList.add('hidden');
  els.pStatements.classList.remove('hidden');
  els.pRatios.classList.add('hidden');
}

els.open.addEventListener('click', openTicker);
els.ticker.addEventListener('keydown', (e)=>{ if (e.key==='Enter') openTicker(); });
