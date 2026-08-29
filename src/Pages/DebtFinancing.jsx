import { useState, useCallback } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { debtFinancing } from "../data/internalData";
import { formatCr } from "../engine/financialEngine";

const PIE_COLORS = ["#1a3a8a", "#43d597", "#f5a623", "#5bb5f5"];

/* ─── Backend placeholder skeleton ─── */
function Skeleton({ width = "100%", height = 20, style = {} }) {
  return <div className="skeleton" style={{ width, height, ...style }} />;
}

/* ─── Empty loan template ─── */
const emptyLoan = { name: "", amount: "", rate: "", type: "Fixed", currency: "INR", maturity: "", repaymentSchedule: "Bullet" };

function DebtFinancing({ isLoading = false }) {
  const [loans, setLoans] = useState(debtFinancing);
  const [currencyFilter, setCurrencyFilter] = useState("ALL");
  const [newLoan, setNewLoan] = useState(emptyLoan);
  const [showForm, setShowForm] = useState(false);

  /* ─── Derived totals ─── */
  const totalDebt    = loans.reduce((s, d) => s + Number(d.amount), 0);
  const fixedDebt    = loans.filter(d => d.type === "Fixed").reduce((s, d) => s + Number(d.amount), 0);
  const floatingDebt = loans.filter(d => d.type === "Floating").reduce((s, d) => s + Number(d.amount), 0);
  const avgRate      = totalDebt > 0
    ? (loans.reduce((s, d) => s + Number(d.rate) * Number(d.amount), 0) / totalDebt).toFixed(2)
    : "0.00";

  /* ─── Currency breakdown for pie ─── */
  const currencies = {};
  loans.forEach(d => { currencies[d.currency] = (currencies[d.currency] || 0) + Number(d.amount); });
  const currencyData = Object.entries(currencies).map(([name, value]) => ({ name, value }));

  /* ─── Currency filter options ─── */
  const allCurrencies = ["ALL", ...Array.from(new Set(loans.map(d => d.currency)))];
  const filteredLoans = currencyFilter === "ALL" ? loans : loans.filter(d => d.currency === currencyFilter);

  /* ─── Add Loan form handler ─── */
  const handleAddLoan = useCallback((e) => {
    e.preventDefault();
    const id = `loan-${Date.now()}`;
    setLoans(prev => [...prev, { ...newLoan, id, amount: Number(newLoan.amount), rate: Number(newLoan.rate) }]);
    setNewLoan(emptyLoan);
    setShowForm(false);
  }, [newLoan]);

  const handleRemoveLoan = useCallback((id) => {
    setLoans(prev => prev.filter(d => d.id !== id));
  }, []);

  /* ─── Summary cards: Loan Amount, Interest Rate, Maturity, Repayment Schedule ─── */
  const summaryCards = [
    { label: "TOTAL LOAN AMOUNT",    value: formatCr(totalDebt),                              sub: "Across all instruments",               key: "df.totalLoanAmount" },
    { label: "AVG INTEREST RATE",    value: `${avgRate}%`,                                    sub: "Weighted average",                     key: "df.avgInterestRate" },
    { label: "FIXED RATE",           value: formatCr(fixedDebt),                              sub: `${totalDebt > 0 ? ((fixedDebt/totalDebt)*100).toFixed(0) : 0}% of total`, key: "df.fixedRate" },
    { label: "FLOATING RATE",        value: formatCr(floatingDebt),                           sub: `${totalDebt > 0 ? ((floatingDebt/totalDebt)*100).toFixed(0) : 0}% of total`, key: "df.floatingRate" },
    { label: "MATURITY (NEXT 12M)",  value: loans.filter(d => {
        const mat = new Date(d.maturity);
        const now = new Date();
        const next12 = new Date(now.setFullYear(now.getFullYear() + 1));
        return mat <= next12;
      }).length + " loans",                                                                    sub: "Maturing within 12 months",            key: "df.maturityNext12m" },
    { label: "REPAYMENT SCHEDULES",  value: [...new Set(loans.map(d => d.repaymentSchedule))].join(" / ") || "—", sub: "Types in portfolio", key: "df.repaymentSchedules" },
  ];

  return (
    <div className="debt-financing">
      <div className="page-heading">
        <div>
          <p className="small-label">FINANCING</p>
          <h2>Debt &amp; Financing</h2>
          <p className="sub-text">Loan Portfolio, Interest Rates &amp; Debt Maturity</p>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="df-summary-grid">
        {summaryCards.map((card) => (
          <div key={card.label} className="df-summary-card" data-backend-key={card.key}>
            <span>{card.label}</span>
            {isLoading ? (
              <Skeleton height={24} style={{ margin: "6px 0" }} />
            ) : (
              <h3>{card.value}</h3>
            )}
            <p>{card.sub}</p>
          </div>
        ))}
      </div>

      {/* CURRENCY EXPOSURE PIE */}
      <div className="df-two-col">
        <div className="flux-card" data-backend-key="df.currencyPie">
          <span className="card-label">CURRENCY EXPOSURE</span>
          <h3 className="card-title">Debt by Currency</h3>
          {isLoading ? (
            <Skeleton height={200} style={{ marginTop: 12 }} />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={currencyData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" strokeWidth={0}>
                  {currencyData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "#1a1825", border: "1px solid #292632", borderRadius: "8px", color: "#fff", fontSize: "12px" }}
                  formatter={(v) => [formatCr(v)]}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
          <div className="df-legend">
            {currencyData.map((item, i) => (
              <div key={item.name} className="df-legend-item" data-backend-key={`df.currency.${item.name}`}>
                <span className="df-dot" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}></span>
                <span>{item.name}</span>
                <strong>{formatCr(item.value)}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* ADD LOAN FORM */}
        <div className="flux-card df-add-loan-card">
          <div className="df-add-loan-header">
            <div>
              <span className="card-label">LOAN PORTFOLIO</span>
              <h3 className="card-title">Add New Instrument</h3>
            </div>
            <button
              className="flux-btn"
              id="toggle-add-loan"
              onClick={() => setShowForm(v => !v)}
            >
              {showForm ? "− Cancel" : "+ Add Loan"}
            </button>
          </div>

          {showForm && (
            <form className="df-loan-form" onSubmit={handleAddLoan} id="add-loan-form">
              <div className="df-form-grid">
                <div className="df-form-field">
                  <label htmlFor="loan-name">Instrument Name</label>
                  <input id="loan-name" type="text" placeholder="e.g. Term Loan A" value={newLoan.name} onChange={e => setNewLoan(p => ({...p, name: e.target.value}))} required />
                </div>
                <div className="df-form-field">
                  <label htmlFor="loan-amount">Amount (₹ Cr)</label>
                  <input id="loan-amount" type="number" placeholder="e.g. 500" value={newLoan.amount} onChange={e => setNewLoan(p => ({...p, amount: e.target.value}))} required min="0" />
                </div>
                <div className="df-form-field">
                  <label htmlFor="loan-rate">Interest Rate (%)</label>
                  <input id="loan-rate" type="number" step="0.01" placeholder="e.g. 8.5" value={newLoan.rate} onChange={e => setNewLoan(p => ({...p, rate: e.target.value}))} required min="0" />
                </div>
                <div className="df-form-field">
                  <label htmlFor="loan-type">Type</label>
                  <select id="loan-type" value={newLoan.type} onChange={e => setNewLoan(p => ({...p, type: e.target.value}))}>
                    <option>Fixed</option>
                    <option>Floating</option>
                  </select>
                </div>
                <div className="df-form-field">
                  <label htmlFor="loan-currency">Currency</label>
                  <select id="loan-currency" value={newLoan.currency} onChange={e => setNewLoan(p => ({...p, currency: e.target.value}))}>
                    <option>INR</option>
                    <option>USD</option>
                    <option>EUR</option>
                    <option>GBP</option>
                    <option>JPY</option>
                  </select>
                </div>
                <div className="df-form-field">
                  <label htmlFor="loan-maturity">Maturity Date</label>
                  <input id="loan-maturity" type="date" value={newLoan.maturity} onChange={e => setNewLoan(p => ({...p, maturity: e.target.value}))} required />
                </div>
                <div className="df-form-field">
                  <label htmlFor="loan-repayment">Repayment Schedule</label>
                  <select id="loan-repayment" value={newLoan.repaymentSchedule} onChange={e => setNewLoan(p => ({...p, repaymentSchedule: e.target.value}))}>
                    <option>Bullet</option>
                    <option>Quarterly</option>
                    <option>Semi-Annual</option>
                    <option>Annual</option>
                    <option>Monthly</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="flux-btn" id="submit-loan">Add to Portfolio</button>
            </form>
          )}
        </div>
      </div>

      {/* LOAN PORTFOLIO TABLE */}
      <div className="flux-card" data-backend-key="df.loanTable">
        <div className="df-table-header">
          <div>
            <span className="card-label">LOAN PORTFOLIO</span>
            <h3 className="card-title">Detailed Debt Schedule</h3>
          </div>
          {/* Currency filter */}
          <div className="df-currency-filter">
            <label htmlFor="currency-filter">Filter by Currency</label>
            <select
              id="currency-filter"
              className="flux-select"
              value={currencyFilter}
              onChange={(e) => setCurrencyFilter(e.target.value)}
            >
              {allCurrencies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <table className="flux-table">
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Amount (₹ Cr)</th>
              <th>Rate</th>
              <th>Type</th>
              <th>Currency</th>
              <th>Maturity</th>
              <th>Repayment</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredLoans.map((row) => (
              <tr key={row.id} data-backend-key={`df.loan.${row.id}`}>
                <td>{row.name}</td>
                <td>{formatCr(row.amount)}</td>
                <td>{row.rate}%</td>
                <td><span className={`status-badge ${row.type === "Fixed" ? "healthy" : "pending"}`}>{row.type}</span></td>
                <td className={row.currency !== "INR" ? "warning" : ""}>{row.currency}</td>
                <td>{new Date(row.maturity).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</td>
                <td>{row.repaymentSchedule}</td>
                <td>
                  <button className="df-remove-btn" onClick={() => handleRemoveLoan(row.id)} title="Remove loan">×</button>
                </td>
              </tr>
            ))}
            {filteredLoans.length === 0 && (
              <tr><td colSpan={8} style={{ textAlign: "center", color: "var(--color-text-faint)", padding: 24 }}>No loans match the selected currency filter.</td></tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default DebtFinancing;
