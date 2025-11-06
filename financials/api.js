// -------- Minimal client for Financial Modeling Prep (FMP) --------
// Put your key here:
const FMP_KEY = "YOUR_FMP_KEY"; // <-- paste your real key

const FMP = "https://financialmodelingprep.com/api/v3";

function needKey() {
  return !FMP_KEY || FMP_KEY === "YOUR_FMP_KEY";
}

async function j(url) {
  const r = await fetch(url);
  if (!r.ok) {
    const txt = await r.text().catch(()=>"");
    throw new Error(`HTTP ${r.status} on ${url}\n${txt}`);
  }
  return r.json();
}

async function profile(tk) {
  const [p] = await j(`${FMP}/profile/${encodeURIComponent(tk)}?apikey=${FMP_KEY}`);
  return p || null;
}
async function quote(tk) {
  const [q] = await j(`${FMP}/quote/${encodeURIComponent(tk)}?apikey=${FMP_KEY}`);
  return q || null;
}
async function income(tk, limit=4) {
  return j(`${FMP}/income-statement/${encodeURIComponent(tk)}?period=annual&limit=${limit}&apikey=${FMP_KEY}`);
}
async function balance(tk, limit=4) {
  return j(`${FMP}/balance-sheet-statement/${encodeURIComponent(tk)}?period=annual&limit=${limit}&apikey=${FMP_KEY}`);
}
async function cashflow(tk, limit=4) {
  return j(`${FMP}/cash-flow-statement/${encodeURIComponent(tk)}?period=annual&limit=${limit}&apikey=${FMP_KEY}`);
}
async function keyMetrics(tk, limit=2) {
  return j(`${FMP}/key-metrics/${encodeURIComponent(tk)}?period=annual&limit=${limit}&apikey=${FMP_KEY}`);
}

function fmtB(n) { return (n/1e9).toFixed(1) + "B"; }
function pct(n)  { return (n*100).toFixed(1) + "%"; }
function ylab(iso) { return (iso||"").slice(0,4); }

window.__FMP = { needKey, profile, quote, income, balance, cashflow, keyMetrics, fmtB, pct, ylab };
