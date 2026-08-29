import { useState, useCallback } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { cashLiquidity } from "../data/internalData";
import { formatCr } from "../engine/financialEngine";

/* ─── Backend placeholder skeleton ─── */
function Skeleton({ width = "100%", height = 20, style = {} }) {
  return <div className="skeleton" style={{ width, height, ...style }} />;
}

function CashLiquidity({ isLoading = false }) {
  const cash = cashLiquidity;
  const coverageColor = cash.liquidityCoverage >= 1.5
    ? "var(--color-positive)"
    : cash.liquidityCoverage >= 1.0
    ? "var(--color-warning)"
    : "var(--color-negative)";

  /* ─── State-driven chart data — backend pushes new projection array ─── */
  const [chartData, setChartData] = useState(cash.monthlyProjection);

  /**
   * updateChartData
   * Backend handler — call this with a new array of { month, cash } objects
   * to dynamically update the main cash projection chart.
   */
  const updateChartData = useCallback((newData) => {
    setChartData(newData);
  }, []);

  /* ─── Stress preview calculations ─── */
  const stressCash       = Math.round(cash.totalCash * 0.8);
  const stressLiquidity  = Math.round(cash.availableLiquidity * 0.75);
  const stressCoverage   = (stressLiquidity / cash.thirtyDayObligations).toFixed(2);

  const heroCards = [
    { label: "TOTAL CASH",         value: formatCr(cash.totalCash),            sub: "Across all accounts",    key: "cash.totalCash",         cls: "cl-total-cash" },
    { label: "AVAILABLE LIQUIDITY",value: formatCr(cash.availableLiquidity),   sub: "Including credit lines", key: "cash.availableLiquidity" },
    { label: "30-DAY OBLIGATIONS", value: formatCr(cash.thirtyDayObligations), sub: "Upcoming commitments",   key: "cash.obligations30d" },
    {
      label: "LIQUIDITY COVERAGE",
      value: `${cash.liquidityCoverage}×`,
      sub:   "Available / Obligations",
      key:   "cash.liquidityCoverage",
      style: { color: coverageColor },
    },
    { label: "CASH RUNWAY",        value: `${cash.cashRunway}`, sub: "months at current burn rate", key: "cash.runway" },
  ];

  return (
    <div className="cash-liquidity">

      <div className="page-heading">
        <div>
          <p className="small-label">TREASURY</p>
          <h2>Cash &amp; Liquidity Position</h2>
          <p className="sub-text">Real-time Cash Position &amp; Projections</p>
        </div>
      </div>

      {/* HERO CARDS */}
      <div className="cl-hero-grid">
        {heroCards.map((card) => (
          <div key={card.label} className={`cl-hero-card ${card.cls || ""}`} data-backend-key={card.key}>
            <span>{card.label}</span>
            {isLoading ? (
              <Skeleton height={32} style={{ margin: "8px 0" }} />
            ) : (
              <h2 style={card.style || {}}>
                {card.value}
                {card.label === "CASH RUNWAY" && <small> months</small>}
              </h2>
            )}
            <p>{card.sub}</p>
          </div>
        ))}
      </div>

      {/* STATE-DRIVEN MAIN CHART + STRESS PREVIEW */}
      <div className="cl-two-col">

        <div className="flux-card" data-backend-key="cash.projectionChart">
          <span className="card-label">CASH PROJECTION</span>
          <h3 className="card-title">Monthly Cash Position</h3>
          {isLoading ? (
            <Skeleton height={280} style={{ marginTop: 12 }} />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="cashGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1a3a8a" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1a3a8a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#3d3a4a" tick={{ fill: "#5f5b68", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#3d3a4a" tick={{ fill: "#5f5b68", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#1a1825", border: "1px solid #292632", borderRadius: "8px", color: "#fff", fontSize: "12px" }}
                  formatter={(v) => [formatCr(v), "Cash"]}
                />
                <Area type="monotone" dataKey="cash" stroke="#1a3a8a" strokeWidth={2.5} fill="url(#cashGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* ─── STRESS PREVIEW (replaces Cash Breakdown pie) ─── */}
        <div className="flux-card cl-stress-card" data-backend-key="cash.stressPreview">
          <span className="card-label">STRESS PREVIEW</span>
          <h3 className="card-title">Liquidity Stress Scenario (−20%)</h3>
          <div className="cl-stress-content">
            <div className="cl-stress-row">
              <span>Current Total Cash</span>
              <strong data-backend-key="cash.stressPreview.currentCash">{formatCr(cash.totalCash)}</strong>
            </div>
            <div className="cl-stress-row">
              <span>Stressed Cash (−20%)</span>
              <strong className="warning" data-backend-key="cash.stressPreview.stressedCash">{formatCr(stressCash)}</strong>
            </div>
            <div className="cl-stress-row">
              <span>Stressed Liquidity</span>
              <strong className="negative" data-backend-key="cash.stressPreview.stressedLiquidity">{formatCr(stressLiquidity)}</strong>
            </div>
            <div className="cl-stress-row">
              <span>Stressed Coverage Ratio</span>
              <strong className={Number(stressCoverage) >= 1.0 ? "positive" : "negative"} data-backend-key="cash.stressPreview.stressedCoverage">
                {stressCoverage}×
              </strong>
            </div>
            <div className="cl-stress-row">
              <span>30-Day Obligations</span>
              <strong data-backend-key="cash.stressPreview.obligations">{formatCr(cash.thirtyDayObligations)}</strong>
            </div>
          </div>
          <div className="cl-stress-warning">
            ⚠️ Under stress, coverage drops to <strong>{stressCoverage}×</strong> — {Number(stressCoverage) >= 1.0 ? "within acceptable range." : "below 1.0× threshold."}
          </div>
        </div>

      </div>

    </div>
  );
}

export default CashLiquidity;
