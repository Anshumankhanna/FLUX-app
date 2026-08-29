import { useState, useCallback } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { interestRateData, macroIndicators } from "../data/marketData";
import { formatCr } from "../engine/financialEngine";

const PIE_COLORS = ["#1a3a8a", "#43d597"];

const indicatorLabels = {
  inflation: "Inflation (CPI)", gdpGrowth: "GDP Growth", unemployment: "Unemployment",
  repoRate: "Repo Rate", reverseRepoRate: "Reverse Repo Rate", tenYearYield: "10Y Bond Yield",
  consumerConfidence: "Consumer Confidence", industrialProduction: "Industrial Production",
  cpi: "CPI Inflation", wpi: "WPI Inflation", fedFundsRate: "Fed Funds Rate",
};
const trendIcons  = { up: "▲", down: "▼", stable: "◆" };
const trendColors = { up: "var(--color-positive)", down: "var(--color-negative)", stable: "var(--color-warning)" };

/* ─── Empty pie input ─── */
const emptyPie = { fixed: "", floating: "" };

function MacroInterestPage() {
  const [country, setCountry] = useState("india");
  const [activeTab, setActiveTab] = useState("macro");
  const macroData = macroIndicators[country];
  const ir = interestRateData;

  /* ─── Fixed vs Floating — user-controlled inputs ─── */
  const [pieInputs, setPieInputs] = useState({ fixed: ir.fixedDebtPct, floating: ir.floatingDebtPct });
  const [pieState,  setPieState]  = useState({ fixed: ir.fixedDebtPct, floating: ir.floatingDebtPct });
  const [pieError,  setPieError]  = useState("");

  const handleApplyPie = useCallback((e) => {
    e.preventDefault();
    const f = Number(pieInputs.fixed);
    const fl = Number(pieInputs.floating);
    if (isNaN(f) || isNaN(fl) || f < 0 || fl < 0) { setPieError("Values must be positive numbers."); return; }
    if (Math.abs(f + fl - 100) > 0.1) { setPieError("Fixed + Floating must equal 100%."); return; }
    setPieError("");
    setPieState({ fixed: f, floating: fl });
  }, [pieInputs]);

  const fixedFloatingData = [
    { name: "Fixed",    value: pieState.fixed },
    { name: "Floating", value: pieState.floating },
  ];

  /* ─── Rate summary cards ─── */
  const rateCards = [
    { label: "CENTRAL BANK POLICY RATE", value: ir.centralBankRate?.value, trend: ir.centralBankRate?.trend ?? "stable", suffix: "%" },
    { label: "BOND YIELDS",              value: ir.bondYield?.value,        trend: ir.bondYield?.trend ?? "stable",       suffix: "%" },
    { label: "COMPANY DEBT COST",        value: ir.companyDebtCost,         trend: "stable",                              suffix: "%" },
    { label: "DEBT MATURITY",            value: ir.debtMaturity,            trend: "stable",                              suffix: " yrs avg" },
  ];

  return (
    <div className="mip-page">

      {/* PAGE HEADING */}
      <div className="page-heading">
        <div>
          <p className="small-label">MACRO · RATES · DEBT</p>
          <h2>Macro &amp; Interest Rates</h2>
          <p className="sub-text">Macroeconomic Indicators · Central Bank Rates · Debt Profile</p>
        </div>
        {activeTab === "macro" && (
          <select className="flux-select" value={country} onChange={(e) => setCountry(e.target.value)} id="macro-country-select">
            <option value="india">India 🇮🇳</option>
            <option value="us">United States 🇺🇸</option>
          </select>
        )}
      </div>

      {/* TABS */}
      <div className="mip-tabs">
        <button id="tab-macro"    className={`mip-tab ${activeTab === "macro" ? "active" : ""}`}    onClick={() => setActiveTab("macro")}>◎ Macro Indicators</button>
        <button id="tab-interest" className={`mip-tab ${activeTab === "interest" ? "active" : ""}`} onClick={() => setActiveTab("interest")}>◇ Interest &amp; Rates</button>
      </div>

      {/* ══════════ MACRO TAB ══════════ */}
      {activeTab === "macro" && (
        <div className="macro-grid">
          {Object.entries(macroData).map(([key, item]) => (
            <div key={key} className="macro-card">
              <div className="macro-card-header">
                <span className="macro-label">{indicatorLabels[key] || key}</span>
                <span className="macro-trend" style={{ color: trendColors[item.trend] }}>{trendIcons[item.trend]}</span>
              </div>
              <h3 className="macro-value">{item.value}{item.unit === "%" ? "%" : ""}</h3>
              {item.unit !== "%" && <span className="macro-unit">{item.unit}</span>}
              <div className="macro-footer">
                <span>Previous: {item.previous}{item.unit === "%" ? "%" : ` ${item.unit}`}</span>
                <span className={item.trend === "up" && key !== "unemployment" ? "positive" : item.trend === "down" && key !== "unemployment" ? "negative" : ""}>
                  {item.trend === "up" ? "↑" : item.trend === "down" ? "↓" : "→"} {item.trend}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ══════════ INTEREST & RATES TAB ══════════ */}
      {activeTab === "interest" && (
        <>
          {/* Rate summary cards */}
          <div className="ir-rate-grid">
            {rateCards.map((card) => (
              <div key={card.label} className="ir-rate-card">
                <span>{card.label}</span>
                <h3>{card.value != null ? <>{card.value}<span className="text-[0.6em] text-text-dim ml-[2px] font-normal font-body">{card.suffix}</span></> : <span className="ir-pending">—</span>}</h3>
                <p className={card.trend === "up" ? "negative" : card.trend === "down" ? "positive" : "watch"}>
                  {card.trend === "up" ? "▲ Rising" : card.trend === "down" ? "▼ Falling" : "◆ Stable"}
                </p>
              </div>
            ))}
          </div>

          {/* Pie + Debt stats */}
          <div className="mip-two-col">

            {/* Fixed vs Floating — with user input form */}
            <div className="flux-card mip-pie-card">
              <span className="card-label">COMPANY DEBT PROFILE</span>
              <h3 className="card-title">Fixed vs Floating</h3>

              {/* User input form */}
              <form className="mip-pie-form" onSubmit={handleApplyPie} id="pie-input-form">
                <div className="mip-pie-inputs">
                  <div className="mip-pie-field">
                    <label htmlFor="pie-fixed">Fixed Rate (%)</label>
                    <input
                      id="pie-fixed"
                      type="number"
                      min="0" max="100" step="0.1"
                      value={pieInputs.fixed}
                      onChange={(e) => setPieInputs(p => ({ ...p, fixed: e.target.value }))}
                      placeholder="e.g. 65"
                    />
                  </div>
                  <div className="mip-pie-field">
                    <label htmlFor="pie-floating">Floating Rate (%)</label>
                    <input
                      id="pie-floating"
                      type="number"
                      min="0" max="100" step="0.1"
                      value={pieInputs.floating}
                      onChange={(e) => setPieInputs(p => ({ ...p, floating: e.target.value }))}
                      placeholder="e.g. 35"
                    />
                  </div>
                  <button type="submit" className="flux-btn mip-pie-btn" id="apply-pie">Apply</button>
                </div>
                {pieError && <p className="mip-pie-error">{pieError}</p>}
              </form>

              <div className="ir-pie-container">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={fixedFloatingData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" strokeWidth={0}>
                      {fixedFloatingData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: "#1a1825", border: "1px solid #292632", borderRadius: "8px", color: "#fff", fontSize: "12px" }}
                      formatter={(v) => [`${v}%`]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="ir-pie-legend">
                  <div><span style={{ background: PIE_COLORS[0] }}></span> Fixed ({pieState.fixed}%)</div>
                  <div><span style={{ background: PIE_COLORS[1] }}></span> Floating ({pieState.floating}%)</div>
                </div>
              </div>

              <div className="ir-debt-stats">
                <div><span>Total Debt</span><strong>{formatCr(ir.totalDebt)}</strong></div>
                <div><span>Avg Cost of Debt</span><strong>{ir.companyDebtCost}%</strong></div>
                <div><span>Annual Interest</span><strong>{formatCr(ir.annualInterestExpense)}</strong></div>
              </div>
            </div>

            {/* Rate environment summary */}
            <div className="flux-card mip-rate-env">
              <span className="card-label">RATE ENVIRONMENT</span>
              <h3 className="card-title">Key Rates Overview</h3>
              <div className="mip-rate-list">
                {[
                  { label: "RBI Repo Rate",      value: `${ir.centralBankRate?.value}%`,  trend: ir.centralBankRate?.trend },
                  { label: "Reverse Repo Rate",  value: `${ir.reverseRepo?.value}%`,      trend: ir.reverseRepo?.trend },
                  { label: "Bond Yield (10Y)",   value: `${ir.bondYield?.value}%`,        trend: ir.bondYield?.trend },
                  { label: "Company Debt Cost",  value: `${ir.companyDebtCost}%`,         trend: "stable" },
                  { label: "Debt Maturity",      value: `${ir.debtMaturity} yrs avg`,     trend: "stable" },
                  { label: "Fixed Debt %",       value: `${pieState.fixed}%`,             trend: "stable" },
                  { label: "Floating Debt %",    value: `${pieState.floating}%`,          trend: "stable" },
                ].map((row) => (
                  <div key={row.label} className="mip-rate-row">
                    <span>{row.label}</span>
                    <strong>
                      <span className={row.trend === "up" ? "negative" : row.trend === "down" ? "positive" : "watch"} style={{ marginRight: 6, fontSize: 10 }}>
                        {row.trend === "up" ? "▲" : row.trend === "down" ? "▼" : "◆"}
                      </span>
                      {row.value}
                    </strong>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </>
      )}

    </div>
  );
}

export default MacroInterestPage;
