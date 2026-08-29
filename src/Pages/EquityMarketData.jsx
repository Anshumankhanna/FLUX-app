import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { companyProfile, stockPriceHistory, performanceMetrics } from "../data/companyData";

function EquityMarketData() {
  const company = companyProfile;
  const perf = performanceMetrics;

  const metrics = [
    { label: "CURRENT PRICE",  value: `₹${company.stockPrice.toLocaleString("en-IN")}` },
    { label: "PREVIOUS CLOSE", value: `₹${company.previousClose.toLocaleString("en-IN")}` },
    { label: "DAILY CHANGE",   value: `${perf.dailyChange >= 0 ? "+" : ""}${perf.dailyChange}%`, positive: perf.dailyChange >= 0 },
    { label: "1M PERFORMANCE", value: `${perf.oneMonth >= 0 ? "+" : ""}${perf.oneMonth}%`, positive: perf.oneMonth >= 0 },
    { label: "3M PERFORMANCE", value: `${perf.threeMonth >= 0 ? "+" : ""}${perf.threeMonth}%`, positive: perf.threeMonth >= 0 },
    { label: "1Y PERFORMANCE", value: `${perf.oneYear >= 0 ? "+" : ""}${perf.oneYear}%`, positive: perf.oneYear >= 0 },
    { label: "MARKET CAP",     value: company.marketCap },
    { label: "BETA",           value: company.beta },
    { label: "VOLATILITY",     value: `${company.volatility}%` },
    { label: "TRADING VOLUME", value: company.tradingVolume },
  ];

  return (
    <div className="equity-market">
      <div className="page-heading">
        <div>
          <p className="small-label">EQUITY MARKET</p>
          <h2>Market Data — {company.ticker}</h2>
          <p className="sub-text">{company.name} · {company.exchange}</p>
        </div>
        <div className="ticker-badge">{company.ticker}</div>
      </div>

      {/* CHART */}
      <div className="flux-card eq-chart-card">
        <div className="card-header-flex">
          <div>
            <span className="card-label">PRICE HISTORY</span>
            <h3 className="card-title">Stock Price Trend</h3>
          </div>
          <span className="chart-change positive">+{perf.oneYear}% (1Y)</span>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={stockPriceHistory} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="eqAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1a3a8a" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#1a3a8a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" stroke="#3d3a4a" tick={{ fill: "#5f5b68", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis stroke="#3d3a4a" tick={{ fill: "#5f5b68", fontSize: 10 }} axisLine={false} tickLine={false} domain={["auto", "auto"]} />
            <Tooltip contentStyle={{ background: "#1a1825", border: "1px solid #292632", borderRadius: "8px", color: "#fff", fontSize: "12px" }} />
            <Area type="monotone" dataKey="price" stroke="#1a3a8a" strokeWidth={2.5} fill="url(#eqAreaGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* METRICS GRID */}
      <div className="eq-metrics-grid">
        {metrics.map((m) => (
          <div key={m.label} className="eq-metric-card">
            <span>{m.label}</span>
            <strong className={m.positive !== undefined ? (m.positive ? "positive" : "negative") : ""}>{m.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EquityMarketData;
