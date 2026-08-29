import { useState, useCallback } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { interestRateData } from "../data/marketData";
import { formatCr } from "../engine/financialEngine";

const PIE_COLORS = ["#1a3a8a", "#43d597"];

/* ─── Backend placeholder skeleton ─── */
function Skeleton({ width = "100%", height = 20, style = {} }) {
  return <div className="skeleton" style={{ width, height, ...style }} />;
}

function InterestRateDebt({ isLoading = false }) {
  const ir = interestRateData;

  /* ─── Fixed vs Floating state — backend can push { fixed, floating } ─── */
  const [pieState, setPieState] = useState({
    fixed:    ir.fixedDebtPct,
    floating: ir.floatingDebtPct,
  });

  /**
   * handleFixedFloatingPie
   * Backend handler — call this with { fixed: number, floating: number }
   * to update the Fixed vs Floating pie chart dynamically.
   */
  const handleFixedFloatingPie = useCallback((newData) => {
    setPieState({ fixed: newData.fixed, floating: newData.floating });
  }, []);

  const fixedFloatingData = [
    { name: "Fixed",    value: pieState.fixed },
    { name: "Floating", value: pieState.floating },
  ];

  /* ─── Summary cards: Central Bank Policy Rate, Bond Yields, Company Debt Cost, Debt Maturity ─── */
  const rateCards = [
    {
      label:   "CENTRAL BANK POLICY RATE",
      value:   ir.centralBankRate?.value ?? null,
      trend:   ir.centralBankRate?.trend ?? "neutral",
      suffix:  "%",
      key:     "ir.centralBankRate",
    },
    {
      label:   "BOND YIELDS",
      value:   ir.bondYield?.value ?? null,
      trend:   ir.bondYield?.trend ?? "neutral",
      suffix:  "%",
      key:     "ir.bondYields",
    },
    {
      label:   "COMPANY DEBT COST",
      value:   ir.companyDebtCost ?? null,
      trend:   "neutral",
      suffix:  "%",
      key:     "ir.companyDebtCost",
    },
    {
      label:   "DEBT MATURITY",
      value:   ir.debtMaturity ?? null,
      trend:   "neutral",
      suffix:  ir.debtMaturity ? " yrs avg" : "",
      key:     "ir.debtMaturity",
    },
  ];

  const floatingDebt         = ir.totalDebt * (pieState.floating / 100);
  const additionalCost2pct   = floatingDebt * 2 / 100;

  return (
    <div className="interest-rate-debt">

      <div className="page-heading">
        <div>
          <p className="small-label">INTEREST RATE ENVIRONMENT</p>
          <h2>Interest Rates &amp; Debt</h2>
          <p className="sub-text">Central Bank Rates · Bond Yields · Company Debt Profile</p>
        </div>
      </div>

      {/* ─── RATE SUMMARY CARDS ─── */}
      <div className="ir-rate-grid">
        {rateCards.map((card) => (
          <div key={card.label} className="ir-rate-card" data-backend-key={card.key}>
            <span>{card.label}</span>
            {isLoading ? (
              <Skeleton height={32} style={{ margin: "8px 0" }} />
            ) : card.value !== null ? (
              <h3>{card.value}{card.suffix && <span className="text-[0.6em] text-text-dim ml-[2px] font-normal font-body">{card.suffix}</span>}</h3>
            ) : (
              <h3 className="ir-pending">—</h3>
            )}
            <p className={
              card.trend === "up" ? "negative" :
              card.trend === "down" ? "positive" : "watch"
            }>
              {card.trend === "up" ? "▲ Rising" : card.trend === "down" ? "▼ Falling" : "◆ Stable"}
            </p>
          </div>
        ))}
      </div>

      {/* ─── COMPANY DEBT PROFILE — Fixed vs Floating pie chart ─── */}
      <div className="ir-two-col">

        <div className="flux-card ir-debt-profile" data-backend-key="ir.fixedFloatingPie">
          <span className="card-label">COMPANY DEBT PROFILE</span>
          <h3 className="card-title">Fixed vs Floating</h3>

          {isLoading ? (
            <Skeleton height={200} style={{ marginTop: 12 }} />
          ) : (
            <div className="ir-pie-container">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={fixedFloatingData}
                    cx="50%" cy="50%"
                    innerRadius={55} outerRadius={80}
                    dataKey="value"
                    strokeWidth={0}
                  >
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
          )}

          <div className="ir-debt-stats">
            <div data-backend-key="ir.totalDebt">
              <span>Total Debt</span>
              {isLoading ? <Skeleton width={80} height={16} /> : <strong>{formatCr(ir.totalDebt)}</strong>}
            </div>
            <div data-backend-key="ir.avgCostOfDebt">
              <span>Avg Cost of Debt</span>
              {isLoading ? <Skeleton width={60} height={16} /> : <strong>{ir.companyDebtCost}%</strong>}
            </div>
            <div data-backend-key="ir.annualInterest">
              <span>Annual Interest</span>
              {isLoading ? <Skeleton width={80} height={16} /> : <strong>{formatCr(ir.annualInterestExpense)}</strong>}
            </div>
          </div>
        </div>

        {/* ─── STRESS PREVIEW ─── */}
        <div className="flux-card ir-stress-preview" data-backend-key="ir.stressPreview">
          <span className="card-label">STRESS PREVIEW</span>
          <h3 className="card-title">Interest Rate +2% Scenario</h3>
          {isLoading ? (
            <Skeleton height={140} style={{ marginTop: 12 }} />
          ) : (
            <div className="ir-stress-chain">
              <div className="chain-item">
                <span>Current Interest Expense</span>
                <strong>{formatCr(ir.annualInterestExpense)}</strong>
              </div>
              <div className="chain-arrow">→</div>
              <div className="chain-item">
                <span>Rate Increase</span>
                <strong className="warning">+2.0%</strong>
              </div>
              <div className="chain-arrow">→</div>
              <div className="chain-item">
                <span>Additional Annual Cost</span>
                <strong className="negative">{formatCr(Math.round(additionalCost2pct))}</strong>
              </div>
              <div className="chain-arrow">→</div>
              <div className="chain-item">
                <span>New Interest Expense</span>
                <strong>{formatCr(ir.annualInterestExpense + Math.round(additionalCost2pct))}</strong>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

export default InterestRateDebt;
