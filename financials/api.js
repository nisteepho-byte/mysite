// financials/api.js
// ---- Financial Modeling Prep client (with localStorage key support) ----

// 1) Key source: localStorage takes precedence.
//    Run in the console once:  localStorage.setItem('FMP_KEY','YOUR_REAL_KEY');
const STORED = (typeof localStorage !== 'undefined') ? localStorage.getItem('FMP_KEY') : null;

// 2) Fallback hard-coded key (optional). Leave as "YOUR_FMP_KEY" if using localStorage only.
const FALLBACK = "YOUR_FMP_KEY";

// Final key:
let FMP_KEY = (STORED && STORED.trim()) ? STORED.trim() : FALLBACK;

export function setFmpKey(k) {
  try {
    if (!k || !k.trim()) throw new Error("Empty key");
    localStorage.setItem('FMP_KEY', k.trim());
    FMP_KEY = k.trim();
    return true;
  } catch (e) {
    return false;
  }
}

export function needKey() {
  return !FMP_KEY || FMP_KEY === "YOUR_FMP_KEY";
}

const FMP = "https://financialmodelingprep.com/api/v3";

async function j(url) {
  const r = await fetch(url);
  if (!r.ok) {
    const txt = await r.text().catch(()=>"");
    throw new Error(`HTTP ${r.status} on ${url}\n${txt}`);
  }
  return r.json();
}

export async function profile(tk) {
  const [p] = await j(`${FMP}/profile/${encodeURIComponent(tk)}?apikey=${FMP_KEY}`);
  return p || null;
}
export async function quote(tk) {
  const [q] = await j(`${FMP}/quote/${encodeURIComponent(tk)}?apikey=${FMP_KEY}`);
  return q || null;
}
export async function income(tk, limit=4) {
  return j(`${FMP}/income-statement/${encodeURIComponent(tk)}?period=annual&limit=${limit}&apikey=${FMP_KEY}`);
}
export async function balance(tk, limit=4) {
  return j(`${FMP}/balance-sheet-statement/${encodeURIComponent(tk)}?period=annual&limit=${limit}&apikey=${FMP_KEY}`);
}
export async function cashflow(tk, limit=4) {
  return j(`${FMP}/cash-flow-statement/${encodeURIComponent(tk)}?period=annual&limit=${limit}&apikey=${FMP_KEY}`);
}
export async function keyMetrics(tk, limit=2) {
  return j(`${FMP}/key-metrics/${encodeURIComponent(tk)}?period=annual&limit=${limit}&apikey=${FMP_KEY}`);
}

// tiny utils
export function fmtB(n) { return (n/1e9).toFixed(1) + "B"; }
export function pct(n)  { return (n*100).toFixed(1) + "%"; }
export function ylab(iso) { return (iso||"").slice(0,4); }

// expose on window too (for non-module pages)
if (typeof window !== 'undefined') {
  window.__FMP = { setFmpKey, needKey, profile, quote, income, balance, cashflow, keyMetrics, fmtB, pct, ylab };
}
