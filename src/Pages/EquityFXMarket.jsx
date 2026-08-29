import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { fxRates } from "../data/marketData";
import { companyProfile, stockPriceHistory, performanceMetrics } from "../data/companyData";

/* ─── Backend placeholder skeleton ─── */
function Skeleton({ width = "100%", height = 20, style = {} }) {
  return <div className="skeleton" style={{ width, height, ...style }} />;
}

function EquityFXMarket({ isLoading = false }) {
  const [activeTab, setActiveTab] = useState("equity");
  const [selectedPair, setSelectedPair] = useState(0);

  const company = companyProfile;
  const perf = performanceMetrics;
  const rate = fxRates[selectedPair];

  /* ─── Equity metrics ─── */
  const equityMetrics = [
    { label: "CURRENT PRICE",  value: `₹${company.stockPrice.toLocaleString("en-IN")}`, key: "equity.currentPrice" },
    { label: "PREVIOUS CLOSE", value: `₹${company.previousClose.toLocaleString("en-IN")}`, key: "equity.previousClose" },
    { label: "DAILY CHANGE",   value: `${perf.dailyChange >= 0 ? "+" : ""}${perf.dailyChange}%`, positive: perf.dailyChange >= 0, key: "equity.dailyChange" },
    { label: "1M PERFORMANCE", value: `${perf.oneMonth >= 0 ? "+" : ""}${perf.oneMonth}%`, positive: perf.oneMonth >= 0, key: "equity.perf1m" },
    { label: "3M PERFORMANCE", value: `${perf.threeMonth >= 0 ? "+" : ""}${perf.threeMonth}%`, positive: perf.threeMonth >= 0, key: "equity.perf3m" },
    { label: "1Y PERFORMANCE", value: `${perf.oneYear >= 0 ? "+" : ""}${perf.oneYear}%`, positive: perf.oneYear >= 0, key: "equity.perf1y" },
    { label: "MARKET CAP",     value: company.marketCap, key: "equity.marketCap" },
    { label: "BETA",           value: company.beta, key: "equity.beta" },
    { label: "VOLATILITY",     value: `${company.volatility}%`, key: "equity.volatility" },
    { label: "TRADING VOLUME", value: company.tradingVolume, key: "equity.tradingVolume" },
  ];

  return (
    <div className="efx-page">
      <div className="page-heading">
        <div>
          <p className="small-label">MARKET DATA</p>
          <h2>Equity &amp; FX Markets</h2>
          <p className="sub-text">
            {activeTab === "equity"
              ? `${company.name} · ${company.exchange}`
              : `${rate.pair} · Foreign Exchange Overview`}
          </p>
        </div>
        {activeTab === "fx" && (
          <select
            className="flux-select"
            value={selectedPair}
            onChange={(e) => setSelectedPair(Number(e.target.value))}
            id="fx-pair-select"
          >
            {fxRates.map((r, i) => (
              <option key={r.pair} value={i}>{r.pair}</option>
            ))}
          </select>
        )}
      </div>

      {/* TABS */}
      <div className="efx-tabs">
        <button
          id="tab-equity"
          className={`efx-tab ${activeTab === "equity" ? "active" : ""}`}
          onClick={() => setActiveTab("equity")}
        >
          ◆ Equity Market
        </button>
        <button
          id="tab-fx"
          className={`efx-tab ${activeTab === "fx" ? "active" : ""}`}
          onClick={() => setActiveTab("fx")}
        >
          ◈ Currency / FX
        </button>
      </div>

      {/* ═══════════ EQUITY TAB ═══════════ */}
      {activeTab === "equity" && (
        <>
          {/* Stock chart */}
          <div className="flux-card efx-chart-card" data-backend-key="equity.priceHistory">
            <div className="card-header-flex">
              <div>
                <span className="card-label">PRICE HISTORY</span>
                <h3 className="card-title">Stock Price — {company.ticker}</h3>
              </div>
              <span className="chart-change positive">+{perf.oneYear}% (1Y)</span>
            </div>
            {isLoading ? (
              <Skeleton height={300} />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={stockPriceHistory} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1a3a8a" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#1a3a8a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#3d3a4a" tick={{ fill: "#5f5b68", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#3d3a4a" tick={{ fill: "#5f5b68", fontSize: 10 }} axisLine={false} tickLine={false} domain={["auto", "auto"]} />
                  <Tooltip contentStyle={{ background: "#1a1825", border: "1px solid #292632", borderRadius: "8px", color: "#fff", fontSize: "12px" }} />
                  <Area type="monotone" dataKey="price" stroke="#1a3a8a" strokeWidth={2.5} fill="url(#eqGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Equity metrics grid */}
          <div className="efx-metrics-grid">
            {equityMetrics.map((m) => (
              <div key={m.label} className="efx-metric-card" data-backend-key={m.key}>
                <span>{m.label}</span>
                {isLoading ? (
                  <Skeleton height={22} style={{ marginTop: 8 }} />
                ) : (
                  <strong className={m.positive !== undefined ? (m.positive ? "positive" : "negative") : ""}>
                    {m.value}
                  </strong>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* ═══════════ FX TAB ═══════════ */}
      {activeTab === "fx" && (
        <>
          {/* All FX pairs summary */}
          <div className="efx-fx-pair-grid">
            {fxRates.map((r, i) => (
              <div
                key={r.pair}
                className={`efx-pair-card ${i === selectedPair ? "selected" : ""}`}
                onClick={() => setSelectedPair(i)}
                data-backend-key={`fx.pair.${r.pair}`}
              >
                <span>{r.pair}</span>
                {isLoading ? (
                  <Skeleton height={24} style={{ marginTop: 6 }} />
                ) : (
                  <>
                    <h3>{r.current.toFixed(r.current < 1 ? 3 : 2)}</h3>
                    <p className={r.dailyChange >= 0 ? "positive" : "negative"}>
                      {r.dailyChange >= 0 ? "+" : ""}{r.dailyChange}% Today
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* FX chart */}
          <div className="flux-card efx-chart-card" data-backend-key={`fx.chart.${rate.pair}`}>
            <div className="card-header-flex">
              <div>
                <span className="card-label">FOREIGN EXCHANGE</span>
                <h3 className="card-title">{rate.pair}</h3>
              </div>
              <span className={`chart-change ${rate.dailyChange >= 0 ? "positive" : "negative"}`}>
                {rate.dailyChange >= 0 ? "+" : ""}{rate.dailyChange}%
              </span>
            </div>
            {isLoading ? (
              <Skeleton height={260} />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={rate.history} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fxGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#43d597" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#43d597" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#3d3a4a" tick={{ fill: "#5f5b68", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#3d3a4a" tick={{ fill: "#5f5b68", fontSize: 10 }} axisLine={false} tickLine={false} domain={["auto", "auto"]} />
                  <Tooltip contentStyle={{ background: "#1a1825", border: "1px solid #292632", borderRadius: "8px", color: "#fff", fontSize: "12px" }} />
                  <Area type="monotone" dataKey="rate" stroke="#43d597" strokeWidth={2.5} fill="url(#fxGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* FX analysis */}
          <div className="flux-card efx-analysis-card" data-backend-key={`fx.analysis.${rate.pair}`}>
            <span className="card-label">CURRENCY ANALYSIS</span>
            <h3 className="card-title">{rate.pair} Market Overview</h3>
            <div className="efx-analysis-grid">
              {[
                { label: "CURRENT RATE",    value: rate.current.toFixed(rate.current < 1 ? 3 : 2), key: `fx.currentRate.${rate.pair}` },
                { label: "PREVIOUS RATE",   value: rate.previous.toFixed(rate.previous < 1 ? 3 : 2), key: `fx.previousRate.${rate.pair}` },
                { label: "DAILY CHANGE",    value: `${rate.dailyChange >= 0 ? "+" : ""}${rate.dailyChange}%`, positive: rate.dailyChange >= 0, key: `fx.dailyChange.${rate.pair}` },
                { label: "HISTORICAL TREND", value: rate.trend, positive: rate.trend === "Bullish", key: `fx.trend.${rate.pair}` },
                { label: "VOLATILITY",      value: `${rate.volatility}%`, key: `fx.volatility.${rate.pair}` },
              ].map((item) => (
                <div key={item.label} className="efx-analysis-item" data-backend-key={item.key}>
                  <span>{item.label}</span>
                  {isLoading ? (
                    <Skeleton height={18} style={{ marginTop: 6 }} />
                  ) : (
                    <strong className={item.positive !== undefined ? (item.positive ? "positive" : "") : ""}>
                      {item.value}
                    </strong>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default EquityFXMarket;
