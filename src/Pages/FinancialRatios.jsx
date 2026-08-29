import { useMemo, useState } from "react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from "recharts";
import { incomeStatement, balanceSheet, cashFlowStatement } from "../data/companyData";
import { calculateFinancialRatios } from "../engine/financialEngine";

/* ─── Backend placeholder skeleton ─── */
function Skeleton({ width = "100%", height = 20, style = {} }) {
  return <div className="skeleton" style={{ width, height, ...style }} />;
}

/* ─── Trend indicator ─── */
function TrendBadge({ trend }) {
  if (!trend || trend === "neutral") return <span className="trend-badge neutral">◆ Stable</span>;
  if (trend === "up")   return <span className="trend-badge up">▲ Rising</span>;
  if (trend === "down") return <span className="trend-badge down">▼ Falling</span>;
  return null;
}

function FinancialRatios({ isLoading = false }) {
  /* ─── Calculated ratios from engine ─── */
  const ratios = useMemo(
    () => calculateFinancialRatios(incomeStatement, balanceSheet, cashFlowStatement),
    []
  );

  /* ─── Placeholder values for Yield/Sector columns (backend will replace) ─── */
  const [yieldData] = useState({
    peRatio:      { value: null, trend: "neutral", key: "ratios.yield.peRatio" },
    pbRatio:      { value: null, trend: "neutral", key: "ratios.yield.pbRatio" },
    divYield:     { value: null, trend: "neutral", key: "ratios.yield.divYield" },
  });

  const [sectorData] = useState({
    peRatio:      { value: null, trend: "neutral", key: "ratios.sector.peRatio" },
    pbRatio:      { value: null, trend: "neutral", key: "ratios.sector.pbRatio" },
    divYield:     { value: null, trend: "neutral", key: "ratios.sector.divYield" },
  });

  /* ─── Core ratio sections ─── */
  const sections = [
    {
      title: "Liquidity Ratios",
      items: [
        { label: "Current Ratio",  value: ratios.liquidity.currentRatio, suffix: "×", good: [1.5, 2.5], benchmark: "1.5× – 2.5×", trend: ratios.liquidity.currentRatio >= 1.5 ? "up" : "down", key: "ratios.liquidity.currentRatio" },
        { label: "Quick Ratio",    value: ratios.liquidity.quickRatio,   suffix: "×", good: [1.0, 2.0], benchmark: "> 1.0×",        trend: ratios.liquidity.quickRatio >= 1.0 ? "up" : "down",   key: "ratios.liquidity.quickRatio" },
        { label: "Cash Ratio",     value: ratios.liquidity.cashRatio,    suffix: "×", good: [0.2, 1.0], benchmark: "> 0.2×",        trend: ratios.liquidity.cashRatio >= 0.2 ? "up" : "down",    key: "ratios.liquidity.cashRatio" },
      ],
    },
    {
      title: "Leverage Ratios",
      items: [
        { label: "Debt/Equity",       value: ratios.leverage.debtToEquity,     suffix: "×", good: [0, 1.0],  benchmark: "< 1.0×", invert: true, trend: ratios.leverage.debtToEquity <= 1.0 ? "down" : "up",       key: "ratios.leverage.debtEquity" },
        { label: "Debt/EBITDA",       value: ratios.leverage.debtToEbitda,     suffix: "×", good: [0, 3.0],  benchmark: "< 3.0×", invert: true, trend: ratios.leverage.debtToEbitda <= 3.0 ? "down" : "up",       key: "ratios.leverage.debtEbitda" },
        { label: "Interest Coverage", value: ratios.leverage.interestCoverage, suffix: "×", good: [4, 100],  benchmark: "> 4.0×",              trend: ratios.leverage.interestCoverage >= 4 ? "up" : "down",    key: "ratios.leverage.interestCoverage" },
      ],
    },
    {
      title: "Profitability Ratios",
      items: [
        { label: "Gross Margin",  value: ratios.profitability.grossMargin,  suffix: "%", good: [30, 100], benchmark: "> 30%",  trend: ratios.profitability.grossMargin >= 30 ? "up" : "down",  key: "ratios.profit.grossMargin" },
        { label: "EBITDA Margin", value: ratios.profitability.ebitdaMargin, suffix: "%", good: [15, 100], benchmark: "> 15%",  trend: ratios.profitability.ebitdaMargin >= 15 ? "up" : "down", key: "ratios.profit.ebitdaMargin" },
        { label: "Net Margin",    value: ratios.profitability.netMargin,    suffix: "%", good: [10, 100], benchmark: "> 10%",  trend: ratios.profitability.netMargin >= 10 ? "up" : "down",    key: "ratios.profit.netMargin" },
        { label: "ROE",           value: ratios.profitability.roe,          suffix: "%", good: [15, 100], benchmark: "> 15%",  trend: ratios.profitability.roe >= 15 ? "up" : "down",          key: "ratios.profit.roe" },
        { label: "ROA",           value: ratios.profitability.roa,          suffix: "%", good: [5, 100],  benchmark: "> 5%",   trend: ratios.profitability.roa >= 5 ? "up" : "down",           key: "ratios.profit.roa" },
      ],
    },
    {
      title: "Working Capital",
      items: [
        { label: "DSO",                  value: ratios.workingCapital.dso,           suffix: " days", good: [0, 45],  benchmark: "< 45 days", invert: true, trend: ratios.workingCapital.dso <= 45 ? "down" : "up",  key: "ratios.wc.dso" },
        { label: "DPO",                  value: ratios.workingCapital.dpo,           suffix: " days", good: [30, 90], benchmark: "30-90 days",               trend: "neutral",                                         key: "ratios.wc.dpo" },
        { label: "Inventory Days",       value: ratios.workingCapital.inventoryDays, suffix: " days", good: [0, 60],  benchmark: "< 60 days", invert: true, trend: ratios.workingCapital.inventoryDays <= 60 ? "down" : "up", key: "ratios.wc.inventoryDays" },
        { label: "Cash Conversion Cycle",value: ratios.workingCapital.ccc,           suffix: " days", good: [0, 60],  benchmark: "< 60 days", invert: true, trend: ratios.workingCapital.ccc <= 60 ? "down" : "up",  key: "ratios.wc.ccc" },
      ],
    },
  ];

  const getStatus = (value, good, invert) => {
    if (invert) return value <= good[1] ? "healthy" : value <= good[1] * 1.5 ? "watch" : "critical";
    return value >= good[0] ? "healthy" : value >= good[0] * 0.7 ? "watch" : "critical";
  };

  /* ─── Radar data — derived dynamically from the card values ─── */
  const radarData = useMemo(() => [
    { metric: "Liquidity",    value: Math.min(ratios.liquidity.currentRatio / 2.5 * 100, 100) },
    { metric: "Solvency",     value: Math.max(Math.min((1 - ratios.leverage.debtToEquity / 2) * 100, 100), 0) },
    { metric: "Profitability",value: Math.min(ratios.profitability.netMargin / 20 * 100, 100) },
    { metric: "Efficiency",   value: Math.max(Math.min((90 - ratios.workingCapital.ccc) / 90 * 100, 100), 0) },
    { metric: "Coverage",     value: Math.min(ratios.leverage.interestCoverage / 15 * 100, 100) },
    { metric: "Returns",      value: Math.min(ratios.profitability.roe / 25 * 100, 100) },
  ], [ratios]);

  /* ─── Yield column cards ─── */
  const yieldCards = [
    { label: "P/E Ratio",       dataKey: yieldData.peRatio.key,  trend: yieldData.peRatio.trend  },
    { label: "P/B Ratio",       dataKey: yieldData.pbRatio.key,  trend: yieldData.pbRatio.trend  },
    { label: "Dividend Yield",  dataKey: yieldData.divYield.key, trend: yieldData.divYield.trend },
  ];

  const sectorCards = [
    { label: "P/E Ratio (Sector)",  dataKey: sectorData.peRatio.key,  trend: sectorData.peRatio.trend  },
    { label: "P/B Ratio (Sector)",  dataKey: sectorData.pbRatio.key,  trend: sectorData.pbRatio.trend  },
    { label: "Div. Yield (Sector)", dataKey: sectorData.divYield.key, trend: sectorData.divYield.trend },
  ];

  return (
    <div className="financial-ratios">
      <div className="page-heading">
        <div>
          <p className="small-label">ANALYTICS</p>
          <h2>Financial Ratios</h2>
          <p className="sub-text">Comprehensive Financial Health Metrics</p>
        </div>
      </div>

      {/* RADAR CHART — data derived dynamically from card values */}
      <div className="flux-card fr-radar-card" data-backend-key="ratios.radarChart">
        <span className="card-label">HEALTH PROFILE</span>
        <h3 className="card-title">Financial Health Radar</h3>
        {isLoading ? (
          <Skeleton height={300} style={{ marginTop: 12 }} />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#24212d" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: "#8e8a9b", fontSize: 11 }} />
              <Radar name="Score" dataKey="value" stroke="#1a3a8a" fill="#1a3a8a" fillOpacity={0.2} strokeWidth={2} />
              <Tooltip
                contentStyle={{ background: "#1a1825", border: "1px solid #292632", borderRadius: "8px", color: "#fff", fontSize: "12px" }}
                formatter={(v) => [`${v.toFixed(1)} / 100`, "Score"]}
              />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ─── YIELD COLUMN ─── */}
      <div className="fr-extra-section">
        <h3 className="fr-section-title">Yield Metrics</h3>
        <div className="fr-ratio-grid">
          {yieldCards.map((card) => (
            <div key={card.label} className="fr-ratio-card fr-placeholder-card" data-backend-key={card.dataKey}>
              <div className="fr-ratio-header">
                <span>{card.label}</span>
                <TrendBadge trend={card.trend} />
              </div>
              {isLoading ? (
                <Skeleton height={24} style={{ margin: "8px 0" }} />
              ) : (
                <h3 className="fr-pending">—</h3>
              )}
              <p className="fr-pending-label">Awaiting backend data</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── SECTOR COLUMN ─── */}
      <div className="fr-extra-section">
        <h3 className="fr-section-title">Sector Comparison</h3>
        <div className="fr-ratio-grid">
          {sectorCards.map((card) => (
            <div key={card.label} className="fr-ratio-card fr-placeholder-card" data-backend-key={card.dataKey}>
              <div className="fr-ratio-header">
                <span>{card.label}</span>
                <TrendBadge trend={card.trend} />
              </div>
              {isLoading ? (
                <Skeleton height={24} style={{ margin: "8px 0" }} />
              ) : (
                <h3 className="fr-pending">—</h3>
              )}
              <p className="fr-pending-label">Awaiting backend data</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── CORE RATIO SECTIONS ─── */}
      {sections.map((section) => (
        <div key={section.title} className="fr-section">
          <h3 className="fr-section-title">{section.title}</h3>
          <div className="fr-ratio-grid">
            {section.items.map((item) => {
              const status = getStatus(item.value, item.good, item.invert);
              return (
                <div
                  key={item.label}
                  className={`fr-ratio-card status-${status}`}
                  data-backend-key={item.key}
                >
                  <div className="fr-ratio-header">
                    <span>{item.label}</span>
                    <div className="fr-header-right">
                      <TrendBadge trend={item.trend} />
                      <span className={`fr-status-dot ${status}`}></span>
                    </div>
                  </div>
                  {isLoading ? (
                    <Skeleton height={28} style={{ margin: "8px 0" }} />
                  ) : (
                    <h3>{item.value}{item.suffix && <span className="text-[0.6em] text-text-dim ml-[2px] font-normal font-body">{item.suffix}</span>}</h3>
                  )}
                  <p>Benchmark: {item.benchmark}</p>
                </div>
              );
            })}
          </div>
        </div>
      ))}

    </div>
  );
}

export default FinancialRatios;
