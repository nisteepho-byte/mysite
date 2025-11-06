<script>
// -------- Minimal client for Financial Modeling Prep (FMP) --------
// Put your key here:
const FMP_KEY = "YOUR_FMP_KEY"; // <-- paste your key
const FMP = "https://financialmodelingprep.com/api/v3";

function needKey() {
  return !FMP_KEY || FMP_KEY === "YOUR_FMP_KEY";
}

async function j(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status}: ${url}`);
  return r.json();
}

async function profile(tk) {
  const [p] = await j(`${FMP}/profile/${tk}?apikey=${FMP_KEY}`);
  return p; // {companyName, industry, sector, image, price, ...}
}

async function quote(tk) {
  const [q] = await j(`${FMP}/quote/${tk}?apikey=${FMP_KEY}`);
  return q; // {price, marketCap, changesPercentage, ...}
}

async function income(tk, limit=4) {
  return j(`${FMP}/income-statement/${tk}?period=annual&limit=${limit}&apikey=${FMP_KEY}`);
}
async function balance(tk, limit=4) {
  return j(`${FMP}/balance-sheet-statement/${tk}?period=annual&limit=${limit}&apikey=${FMP_KEY}`);
}
async function cashflow(tk, limit=4) {
  return j(`${FMP}/cash-flow-statement/${tk}?period=annual&limit=${limit}&apikey=${FMP_KEY}`);
}
async function keyMetrics(tk, limit=2) {
  return j(`${FMP}/key-metrics/${tk}?period=annual&limit=${limit}&apikey=${FMP_KEY}`); // sharesOutstanding, etc.
}

function fmtB(n) { return (n/1e9).toFixed(1) + "B"; }
function pct(n)  { return (n*100).toFixed(1) + "%"; }
function ylab(iso) { return (iso||"").slice(0,4); }

window.__FMP = { needKey, profile, quote, income, balance, cashflow, keyMetrics, fmtB, pct, ylab };
</script>
