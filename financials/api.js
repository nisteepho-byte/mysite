// financials/api.js
// Minimal Financial Modeling Prep (FMP) client for plain HTML sites.
// Stores your API key in localStorage so you don't hard-code it.

(function () {
  const FMP_BASE = "https://financialmodelingprep.com/api/v3";

  // --- Key handling ---
  let FMP_KEY = (typeof localStorage !== "undefined" && localStorage.getItem("FMP_KEY")) || "";

  function setFmpKey(k) {
    if (!k || !k.trim()) return false;
    FMP_KEY = k.trim();
    try { localStorage.setItem("FMP_KEY", FMP_KEY); } catch {}
    return true;
  }
  function needKey() {
    return !FMP_KEY || FMP_KEY === "YOUR_FMP_KEY";
  }

  // --- Fetch helpers ---
  async function j(url) {
    const r = await fetch(url);
    if (!r.ok) {
      const t = await r.text().catch(() => "");
      throw new Error(`HTTP ${r.status} for ${url}\n${t}`);
    }
    return r.json();
  }
  function q(tk) { return encodeURIComponent((tk || "").trim().toUpperCase()); }

  // --- Endpoints ---
  async function profile(tk) {
    const arr = await j(`${FMP_BASE}/profile/${q(tk)}?apikey=${FMP_KEY}`);
    return Array.isArray(arr) ? arr[0] : null;
  }
  async function quote(tk) {
    const arr = await j(`${FMP_BASE}/quote/${q(tk)}?apikey=${FMP_KEY}`);
    return Array.isArray(arr) ? arr[0] : null;
  }
  async function income(tk, limit = 4) {
    return j(`${FMP_BASE}/income-statement/${q(tk)}?period=annual&limit=${limit}&apikey=${FMP_KEY}`);
  }
  async function balance(tk, limit = 4) {
    return j(`${FMP_BASE}/balance-sheet-statement/${q(tk)}?period=annual&limit=${limit}&apikey=${FMP_KEY}`);
  }
  async function cashflow(tk, limit = 4) {
    return j(`${FMP_BASE}/cash-flow-statement/${q(tk)}?period=annual&limit=${limit}&apikey=${FMP_KEY}`);
  }
  async function keyMetrics(tk, limit = 4) {
    return j(`${FMP_BASE}/key-metrics/${q(tk)}?period=annual&limit=${limit}&apikey=${FMP_KEY}`);
  }

  // --- Tiny formatters ---
  function y(iso) { return (iso || "").slice(0, 4); }
  function b(n) { return typeof n === "number" ? (n / 1e9).toFixed(1) + "B" : "—"; }
  function pct(n) { return typeof n === "number" ? (n * 100).toFixed(1) + "%" : "—"; }
  function com(n) { return typeof n === "number" ? n.toLocaleString() : "—"; }

  // Expose
  window.__FMP = {
    setFmpKey, needKey,
    profile, quote, income, balance, cashflow, keyMetrics,
    y, b, pct, com
  };
})();
