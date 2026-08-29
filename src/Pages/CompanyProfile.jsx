import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { companyProfile, stockPriceHistory, performanceMetrics } from "../data/companyData";

/* ─── Reusable skeleton for backend placeholders ─── */
function Skeleton({ width = "100%", height = 20, style = {} }) {
  return <div className="skeleton" style={{ width, height, ...style }} />;
}

function CompanyProfile({ isLoading = false }) {
  const [period, setPeriod] = useState("1Y");
  const company = companyProfile;
  const perf = performanceMetrics;

  const infoFields = [
    { label: "COMPANY NAME",       value: company.name,                                         key: "company.name" },
    { label: "TICKER / EXCHANGE",  value: `${company.ticker} · ${company.exchange}`,            key: "company.tickerExchange" },
    { label: "SECTOR",             value: company.sector,                                        key: "company.sector" },
    { label: "INDUSTRY",           value: company.industry,                                      key: "company.industry" },
    { label: "COUNTRY",            value: company.country,                                       key: "company.country" },
    { label: "FISCAL YEAR",        value: company.fiscalYear,                                    key: "company.fiscalYear" },
    { label: "CURRENCY",           value: company.reportingCurrency,                             key: "company.reportingCurrency" },
    { label: "SHARES OUTSTANDING", value: company.sharesOutstanding,                             key: "company.sharesOutstanding" },
  ];

  return (
    <div className="company-profile">

      {/* PAGE HEADER */}
      <div className="page-heading">
        <div>
          <p className="small-label">COMPANY INFORMATION</p>
          <h2>{isLoading ? <Skeleton width={200} height={28} /> : company.name}</h2>
          <p className="sub-text">{isLoading ? <Skeleton width={120} height={14} style={{ marginTop: 6 }} /> : company.sector}</p>
        </div>

        <div className="stock-box" data-backend-key="company.stockPrice">
          <span>STOCK PRICE</span>
          {isLoading ? (
            <Skeleton width={120} height={28} style={{ margin: "4px 0" }} />
          ) : (
            <strong>₹{company.stockPrice.toLocaleString("en-IN")}</strong>
          )}
          {isLoading ? (
            <Skeleton width={80} height={14} />
          ) : (
            <small className={company.stockPriceChange >= 0 ? "positive" : "negative"}>
              {company.stockPriceChange >= 0 ? "▲" : "▼"} {company.stockPriceChange >= 0 ? "+" : ""}{company.stockPriceChange}%
            </small>
          )}
        </div>
      </div>


      {/* MARKET METRICS */}
      <div className="market-metrics-row">
        <MetricPill label="Market Cap"   value={company.marketCap}               dataKey="company.marketCap"   isLoading={isLoading} />
        <MetricPill label="Beta"         value={company.beta}                     dataKey="company.beta"        isLoading={isLoading} />
        <MetricPill label="Volatility"   value={`${company.volatility}%`}         dataKey="company.volatility"  isLoading={isLoading} />
        <MetricPill label="Volume"       value={company.tradingVolume}            dataKey="company.volume"      isLoading={isLoading} />
        <MetricPill label="1M"           value={`${perf.oneMonth >= 0 ? "+" : ""}${perf.oneMonth}%`}      positive={perf.oneMonth >= 0}    dataKey="company.perf1m"  isLoading={isLoading} />
        <MetricPill label="3M"           value={`${perf.threeMonth >= 0 ? "+" : ""}${perf.threeMonth}%`} positive={perf.threeMonth >= 0}  dataKey="company.perf3m"  isLoading={isLoading} />
        <MetricPill label="1Y"           value={`${perf.oneYear >= 0 ? "+" : ""}${perf.oneYear}%`}       positive={perf.oneYear >= 0}     dataKey="company.perf1y"  isLoading={isLoading} />
      </div>


      {/* COMPANY DETAILS GRID */}
      <div className="info-grid">
        {infoFields.map((field) => (
          <div key={field.label} className="info-card" data-backend-key={field.key}>
            <span>{field.label}</span>
            {isLoading ? <Skeleton height={20} style={{ marginTop: 8 }} /> : <h3>{field.value}</h3>}
          </div>
        ))}
      </div>


      {/* STOCK CHART */}
      <div className="company-chart-card flux-card" data-backend-key="company.stockChart">
        <div className="card-header">
          <div>
            <span className="card-label">MARKET PERFORMANCE</span>
            <h3 className="card-title">Stock Price — {company.ticker}</h3>
          </div>
          <select className="flux-select" value={period} onChange={(e) => setPeriod(e.target.value)} id="stock-period-select">
            <option value="1Y">1 Year</option>
            <option value="6M">6 Months</option>
            <option value="3M">3 Months</option>
          </select>
        </div>

        <div className="chart-container">
          {isLoading ? (
            <Skeleton height={280} />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={stockPriceHistory} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1a3a8a" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1a3a8a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#3d3a4a" tick={{ fill: "#5f5b68", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#3d3a4a" tick={{ fill: "#5f5b68", fontSize: 10 }} axisLine={false} tickLine={false} domain={["auto", "auto"]} />
                <Tooltip
                  contentStyle={{ background: "#1a1825", border: "1px solid #292632", borderRadius: "8px", color: "#fff", fontSize: "12px" }}
                  labelStyle={{ color: "#1a3a8a" }}
                />
                <Area type="monotone" dataKey="price" stroke="#1a3a8a" strokeWidth={2.5} fill="url(#stockGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

    </div>
  );
}


function MetricPill({ label, value, positive, dataKey, isLoading }) {
  let displayValue = value;
  let suffix = "";
  if (typeof value === 'string' && value.endsWith(" Cr")) {
    displayValue = value.replace(" Cr", "");
    suffix = " Cr";
  }

  return (
    <div className="metric-pill" data-backend-key={dataKey}>
      <span>{label}</span>
      {isLoading ? (
        <div className="skeleton" style={{ width: 60, height: 16 }} />
      ) : (
        <strong className={positive !== undefined ? (positive ? "positive" : "negative") : ""}>
          {displayValue}
          {suffix && <span className="text-[0.6em] text-text-dim ml-[2px] font-normal font-body">{suffix}</span>}
        </strong>
      )}
    </div>
  );
}


export default CompanyProfile;