import { useState, useCallback, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { formatCr } from "../engine/financialEngine";

/* ─── Default forecast seed data ─── */
const DEFAULT_SEED = [
  { month: "Aug 2026", inflows: 120, outflows: 90  },
  { month: "Sep 2026", inflows: 135, outflows: 95  },
  { month: "Oct 2026", inflows: 110, outflows: 105 },
  { month: "Nov 2026", inflows: 140, outflows: 100 },
  { month: "Dec 2026", inflows: 155, outflows: 110 },
  { month: "Jan 2027", inflows: 125, outflows: 115 },
];

const MONTH_LABELS = ["Aug 2026", "Sep 2026", "Oct 2026", "Nov 2026", "Dec 2026", "Jan 2027"];

/* ─── Compute running balance from inflows/outflows ─── */
function computeForecast(rows, startingBalance = 420) {
  let balance = startingBalance;
  return rows.map((r) => {
    const net = r.inflows - r.outflows;
    balance = balance + net;
    return { ...r, net, balance };
  });
}

function CashFlowForecast() {
  /* ─── State-driven forecast inputs ─── */
  const [inputs, setInputs] = useState(DEFAULT_SEED);
  const [startingBalance, setStartingBalance] = useState(420);
  const [view, setView] = useState("balance"); // "balance" | "net" | "inflows"

  /* ─── Computed forecast data — re-derives whenever inputs change ─── */
  const forecastData = useMemo(
    () => computeForecast(inputs, startingBalance),
    [inputs, startingBalance]
  );

  /**
   * updateForecast
   * Backend handler — call this with an array of { month, inflows, outflows }
   * and optionally a startingBalance to fully replace the forecast data.
   */
  const updateForecast = useCallback((newInputs, newStartingBalance) => {
    setInputs(newInputs);
    if (newStartingBalance !== undefined) setStartingBalance(newStartingBalance);
  }, []);

  /* ─── Handle input cell changes ─── */
  const handleInputChange = (idx, field, rawValue) => {
    const value = Number(rawValue) || 0;
    setInputs(prev => prev.map((row, i) => i === idx ? { ...row, [field]: value } : row));
  };

  /* ─── Chart series config ─── */
  const seriesMap = {
    balance: { key: "balance",  color: "#43d597", label: "Closing Balance" },
    net:     { key: "net",      color: "#1a3a8a", label: "Net Cash Flow" },
    inflows: { key: "inflows",  color: "#5bb5f5", label: "Inflows" },
  };
  const series = seriesMap[view];
  const gradId = `cfGrad-${view}`;

  return (
    <div className="cf-forecast">
      <div className="page-heading">
        <div>
          <p className="small-label">ANALYTICS</p>
          <h2>Cash Flow Forecast</h2>
          <p className="sub-text">6-Month Rolling Liquidity Projection</p>
        </div>
      </div>

      {/* VIEW SELECTOR + STARTING BALANCE */}
      <div className="cf-controls">
        <div className="cf-view-tabs">
          {Object.entries(seriesMap).map(([key, s]) => (
            <button
              key={key}
              id={`cf-view-${key}`}
              className={`cf-view-tab ${view === key ? "active" : ""}`}
              onClick={() => setView(key)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="cf-starting-balance">
          <label htmlFor="cf-start-balance">Opening Balance (₹ Cr)</label>
          <input
            id="cf-start-balance"
            type="number"
            value={startingBalance}
            onChange={e => setStartingBalance(Number(e.target.value) || 0)}
            min="0"
            data-backend-key="cf.startingBalance"
          />
        </div>
      </div>

      {/* STATE-DRIVEN CHART — updates dynamically with inputs */}
      <div className="flux-card cf-chart-card" data-backend-key="cf.chart">
        <div className="cf-chart-header">
          <div>
            <span className="card-label">PROJECTIONS</span>
            <h3 className="card-title">{series.label} Trend</h3>
          </div>
          <div className="cf-chart-summary">
            <span className="cf-summary-item positive">
              Peak: {formatCr(Math.max(...forecastData.map(d => d[series.key])))}
            </span>
            <span className="cf-summary-item">
              End: {formatCr(forecastData[forecastData.length - 1]?.[series.key] ?? 0)}
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={forecastData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={series.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={series.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" stroke="#3d3a4a" tick={{ fill: "#5f5b68", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis stroke="#3d3a4a" tick={{ fill: "#5f5b68", fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: "#1a1825", border: "1px solid #292632", borderRadius: "8px", color: "#fff", fontSize: "12px" }}
              formatter={(v) => [formatCr(v), series.label]}
            />
            <Area type="monotone" dataKey={series.key} stroke={series.color} strokeWidth={2.5} fill={`url(#${gradId})`} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* INPUT TABLE — editing cells drives chart dynamically */}
      <div className="flux-card" data-backend-key="cf.inputTable">
        <div style={{ marginBottom: 16 }}>
          <span className="card-label">FORECAST INPUTS</span>
          <h3 className="card-title">Monthly Inflows &amp; Outflows</h3>
          <p style={{ fontSize: 11, color: "var(--color-text-dim)", marginTop: 4 }}>
            Edit values below to update the chart in real-time.
          </p>
        </div>
        <table className="flux-table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Expected Inflows (₹ Cr)</th>
              <th>Expected Outflows (₹ Cr)</th>
              <th>Net Change</th>
              <th>Closing Balance</th>
            </tr>
          </thead>
          <tbody>
            {forecastData.map((row, idx) => (
              <tr key={row.month} data-backend-key={`cf.row.${row.month}`}>
                <td>{row.month}</td>
                <td>
                  <input
                    className="cf-input"
                    id={`cf-inflow-${idx}`}
                    type="number"
                    value={inputs[idx].inflows}
                    onChange={e => handleInputChange(idx, "inflows", e.target.value)}
                    min="0"
                  />
                </td>
                <td>
                  <input
                    className="cf-input"
                    id={`cf-outflow-${idx}`}
                    type="number"
                    value={inputs[idx].outflows}
                    onChange={e => handleInputChange(idx, "outflows", e.target.value)}
                    min="0"
                  />
                </td>
                <td className={row.net >= 0 ? "positive" : "negative"}>
                  {row.net >= 0 ? "+" : ""}{formatCr(row.net)}
                </td>
                <td style={{ fontWeight: 600 }} data-backend-key={`cf.balance.${row.month}`}>
                  {formatCr(row.balance)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CashFlowForecast;
