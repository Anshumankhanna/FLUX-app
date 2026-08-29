import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { fxRates } from "../data/marketData";
import { companyProfile, stockPriceHistory } from "../data/companyData";

function CurrencyMarketData() {
  const [selectedPair, setSelectedPair] = useState(0);
  const rate = fxRates[selectedPair];

  return (
    <div className="currency-market-data">

      {/* HEADER */}
      <div className="page-heading">
        <div>
          <p className="small-label">MARKET DATA</p>
          <h2>Currency Market Data</h2>
          <p className="sub-text">{rate.pair} · Foreign Exchange Overview</p>
        </div>
        <select className="flux-select" value={selectedPair} onChange={(e) => setSelectedPair(Number(e.target.value))}>
          {fxRates.map((r, i) => <option key={r.pair} value={i}>{r.pair}</option>)}
        </select>
      </div>


      {/* ALL FX PAIRS */}
      <div className="currency-summary-grid">
        {fxRates.map((r, i) => (
          <div
            key={r.pair}
            className={`market-data-card ${i === selectedPair ? "selected" : ""}`}
            onClick={() => setSelectedPair(i)}
          >
            <span>{r.pair}</span>
            <h3>{r.current.toFixed(r.current < 1 ? 3 : 2)}</h3>
            <p className={r.dailyChange >= 0 ? "positive" : "negative"}>
              {r.dailyChange >= 0 ? "+" : ""}{r.dailyChange}% Today
            </p>
          </div>
        ))}
      </div>


      {/* FX CHART */}
      <div className="market-chart-grid">

        <div className="market-chart-card flux-card">
          <div className="card-header-flex">
            <div>
              <span className="card-label">FOREIGN EXCHANGE</span>
              <h3 className="card-title">{rate.pair}</h3>
            </div>
            <span className={`chart-change ${rate.dailyChange >= 0 ? "positive" : "negative"}`}>
              {rate.dailyChange >= 0 ? "+" : ""}{rate.dailyChange}%
            </span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={rate.history} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="fxGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1a3a8a" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#1a3a8a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#3d3a4a" tick={{ fill: "#5f5b68", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis stroke="#3d3a4a" tick={{ fill: "#5f5b68", fontSize: 10 }} axisLine={false} tickLine={false} domain={["auto", "auto"]} />
              <Tooltip contentStyle={{ background: "#1a1825", border: "1px solid #292632", borderRadius: "8px", color: "#fff", fontSize: "12px" }} />
              <Area type="monotone" dataKey="rate" stroke="#1a3a8a" strokeWidth={2.5} fill="url(#fxGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="market-chart-card flux-card">
          <div className="card-header-flex">
            <div>
              <span className="card-label">EQUITY</span>
              <h3 className="card-title">{companyProfile.ticker}</h3>
            </div>
            <span className="chart-change positive">+{companyProfile.stockPriceChange}%</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={stockPriceHistory} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#43d597" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#43d597" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#3d3a4a" tick={{ fill: "#5f5b68", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis stroke="#3d3a4a" tick={{ fill: "#5f5b68", fontSize: 10 }} axisLine={false} tickLine={false} domain={["auto", "auto"]} />
              <Tooltip contentStyle={{ background: "#1a1825", border: "1px solid #292632", borderRadius: "8px", color: "#fff", fontSize: "12px" }} />
              <Area type="monotone" dataKey="price" stroke="#43d597" strokeWidth={2.5} fill="url(#eqGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

      </div>


      {/* ANALYSIS */}
      <div className="market-analysis-card flux-card">
        <div>
          <span className="card-label">CURRENCY ANALYSIS</span>
          <h3 className="card-title">{rate.pair} Market Overview</h3>
        </div>
        <div className="analysis-grid">
          <AnalysisItem label="CURRENT RATE" value={rate.current.toFixed(rate.current < 1 ? 3 : 2)} />
          <AnalysisItem label="PREVIOUS RATE" value={rate.previous.toFixed(rate.previous < 1 ? 3 : 2)} />
          <AnalysisItem label="DAILY CHANGE" value={`${rate.dailyChange >= 0 ? "+" : ""}${rate.dailyChange}%`} positive={rate.dailyChange >= 0} />
          <AnalysisItem label="HISTORICAL TREND" value={rate.trend} positive={rate.trend === "Bullish"} />
          <AnalysisItem label="VOLATILITY" value={`${rate.volatility}%`} />
        </div>
      </div>

    </div>
  );
}


function AnalysisItem({ label, value, positive }) {
  return (
    <div className="analysis-item">
      <span>{label}</span>
      <strong className={positive !== undefined ? (positive ? "positive" : "") : ""}>{value}</strong>
    </div>
  );
}


export default CurrencyMarketData;