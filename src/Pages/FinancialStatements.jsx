import { useState } from "react";
import { incomeStatement, balanceSheet, cashFlowStatement } from "../data/companyData";
import { formatCr } from "../engine/financialEngine";

/* ─── Backend placeholder skeleton ─── */
function Skeleton({ width = "100%", height = 20, style = {} }) {
  return <div className="skeleton" style={{ width, height, ...style }} />;
}

function FinancialStatements({ isLoading = false }) {
  const [activeTab, setActiveTab] = useState("income");
  const [yearIdx, setYearIdx] = useState(0);
  const years = incomeStatement.years;

  const tabs = [
    { id: "income",   label: "Income Statement" },
    { id: "balance",  label: "Balance Sheet" },
    { id: "cashflow", label: "Cash Flow" },
  ];

  /* ─── Income Statement rows (EBIT, OpEx, COGS now included as cards too) ─── */
  const incomeRows = [
    { label: "Revenue",             key: "revenue" },
    { label: "Cost of Revenue (COGS)", key: "costOfRevenue" },
    { label: "Gross Profit",        key: "grossProfit" },
    { label: "Operating Expenses",  key: "operatingExpenses" },
    { label: "EBITDA",              key: "ebitda" },
    { label: "Depreciation",        key: "depreciation" },
    { label: "EBIT",                key: "ebit" },
    { label: "Interest Expense",    key: "interestExpense" },
    { label: "Profit Before Tax",   key: "profitBeforeTax" },
    { label: "Tax Expense",         key: "taxExpense" },
    { label: "Net Income",          key: "netIncome" },
  ];

  /* ─── Balance Sheet rows — PP&E removed ─── */
  const balanceRows = [
    { label: "Cash & Equivalents",  key: "cashAndEquivalents",  section: "Assets" },
    { label: "Receivables",         key: "accountsReceivable",  section: "Assets" },
    { label: "Inventory",           key: "inventory",            section: "Assets" },
    { label: "Current Assets",      key: "currentAssets",        section: "Assets",      highlight: true },
    { label: "Total Assets",        key: "totalAssets",          section: "Assets",      highlight: true },
    { label: "Accounts Payable",    key: "accountsPayable",      section: "Liabilities" },
    { label: "Current Liabilities", key: "currentLiabilities",   section: "Liabilities", highlight: true },
    { label: "Long-Term Debt",      key: "longTermDebt",         section: "Liabilities" },
    { label: "Total Liabilities",   key: "totalLiabilities",     section: "Liabilities", highlight: true },
    { label: "Total Equity",        key: "totalEquity",          section: "Equity",      highlight: true },
    { label: "Total Debt",          key: "totalDebt",            section: "Debt",        highlight: true },
  ];

  /* ─── Cash Flow rows — Debt Repayment & Net Cash Change removed ─── */
  const cashflowRows = [
    { label: "Operating Cash Flow",  key: "operatingCashFlow" },
    { label: "Capital Expenditure",  key: "capitalExpenditure" },
    { label: "Free Cash Flow",       key: "freeCashFlow",       highlight: true },
    { label: "Investing Cash Flow",  key: "investingCashFlow" },
    { label: "Financing Cash Flow",  key: "financingCashFlow" },
    { label: "Dividends Paid",       key: "dividendsPaid" },
  ];

  const getDataSource = () => {
    if (activeTab === "income")  return { data: incomeStatement.data,     rows: incomeRows };
    if (activeTab === "balance") return { data: balanceSheet.data,        rows: balanceRows };
    return                              { data: cashFlowStatement.data,   rows: cashflowRows };
  };

  const { data, rows } = getDataSource();

  const getChange = (values) => {
    if (!values || !values[1]) return null;
    return ((values[0] - values[1]) / Math.abs(values[1]) * 100).toFixed(1);
  };

  /* ─── Summary cards per tab ─── */
  const summaryCards = activeTab === "income"
    ? [
      { title: "Revenue",            value: formatCr(data.revenue[0]),           change: getChange(data.revenue),            key: "fs.income.revenue" },
      { title: "EBITDA",             value: formatCr(data.ebitda[0]),            change: getChange(data.ebitda),             key: "fs.income.ebitda" },
      { title: "EBIT",               value: formatCr(data.ebit[0]),              change: getChange(data.ebit),               key: "fs.income.ebit" },
      { title: "Operating Expenses", value: formatCr(data.operatingExpenses[0]), change: getChange(data.operatingExpenses),  key: "fs.income.operatingExpenses" },
      { title: "COGS",               value: formatCr(data.costOfRevenue[0]),     change: getChange(data.costOfRevenue),      key: "fs.income.cogs" },
      { title: "Net Income",         value: formatCr(data.netIncome[0]),         change: getChange(data.netIncome),          key: "fs.income.netIncome" },
    ]
    : activeTab === "balance"
    ? [
      { title: "Total Assets",        value: formatCr(balanceSheet.data.totalAssets[0]),        change: getChange(balanceSheet.data.totalAssets),        key: "fs.balance.totalAssets" },
      { title: "Total Equity",        value: formatCr(balanceSheet.data.totalEquity[0]),        change: getChange(balanceSheet.data.totalEquity),        key: "fs.balance.totalEquity" },
      { title: "Total Debt",          value: formatCr(balanceSheet.data.totalDebt[0]),          change: getChange(balanceSheet.data.totalDebt),          key: "fs.balance.totalDebt" },
      { title: "Current Assets",      value: formatCr(balanceSheet.data.currentAssets[0]),     change: getChange(balanceSheet.data.currentAssets),      key: "fs.balance.currentAssets" },
      { title: "Current Liabilities", value: formatCr(balanceSheet.data.currentLiabilities[0]), change: getChange(balanceSheet.data.currentLiabilities), key: "fs.balance.currentLiabilities" },
      { title: "Receivables",         value: formatCr(balanceSheet.data.accountsReceivable[0]), change: getChange(balanceSheet.data.accountsReceivable), key: "fs.balance.receivables" },
    ]
    : [
      { title: "Operating CF",   value: formatCr(cashFlowStatement.data.operatingCashFlow[0]), change: getChange(cashFlowStatement.data.operatingCashFlow), key: "fs.cf.operatingCF" },
      { title: "Free Cash Flow", value: formatCr(cashFlowStatement.data.freeCashFlow[0]),     change: getChange(cashFlowStatement.data.freeCashFlow),     key: "fs.cf.freeCashFlow" },
      { title: "CAPEX",          value: formatCr(Math.abs(cashFlowStatement.data.capitalExpenditure[0])), change: getChange(cashFlowStatement.data.capitalExpenditure), key: "fs.cf.capex" },
      { title: "Dividends Paid", value: formatCr(Math.abs(cashFlowStatement.data.dividendsPaid[0])),     change: getChange(cashFlowStatement.data.dividendsPaid),     key: "fs.cf.dividends" },
    ];

  return (
    <div className="financial-statements">

      {/* HEADER */}
      <div className="page-heading">
        <div>
          <p className="small-label">FINANCIAL ANALYSIS</p>
          <h2>Financial Statements</h2>
          <p className="sub-text">Reliance Industries · {years[yearIdx]}</p>
        </div>
        <select
          className="flux-select"
          value={yearIdx}
          onChange={(e) => setYearIdx(Number(e.target.value))}
          id="fs-year-select"
        >
          {years.map((y, i) => <option key={y} value={i}>{y}</option>)}
        </select>
      </div>


      {/* TABS */}
      <div className="fs-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            id={`fs-tab-${tab.id}`}
            className={`fs-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>


      {/* SUMMARY CARDS */}
      <div className="financial-grid">
        {summaryCards.map((card) => (
          <div key={card.title} className="financial-card" data-backend-key={card.key}>
            <div className="financial-card-top">
              <span>{card.title}</span>
            </div>
            {isLoading ? (
              <>
                <Skeleton height={24} style={{ marginBottom: 8 }} />
                <Skeleton width={80} height={14} />
              </>
            ) : (
              <>
                <h3>{card.value}</h3>
                <p className={Number(card.change) >= 0 ? "positive" : "negative"}>
                  {Number(card.change) >= 0 ? "+" : ""}{card.change}% vs previous year
                </p>
              </>
            )}
          </div>
        ))}
      </div>


      {/* TABLE */}
      <div className="statement-card flux-card" data-backend-key={`fs.table.${activeTab}`}>
        <div className="card-header-row">
          <div>
            <span className="card-label">{activeTab.toUpperCase().replace("CASHFLOW", "CASH FLOW")}</span>
            <h3 className="card-title">Detailed Breakdown</h3>
          </div>
        </div>

        <table className="flux-table">
          <thead>
            <tr>
              <th>Metric</th>
              {years.map((y) => <th key={y}>{y}</th>)}
              <th>YoY Change</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const values = data[row.key];
              if (!values) return null;
              const change = getChange(values);
              return (
                <tr key={row.key} className={row.highlight ? "highlight-row" : ""} data-backend-key={`fs.row.${row.key}`}>
                  <td>{row.label}</td>
                  {values.map((v, i) => <td key={i}>{formatCr(Math.abs(v))}</td>)}
                  <td className={Number(change) >= 0 ? "positive" : "negative"}>
                    {change !== null ? `${Number(change) >= 0 ? "+" : ""}${change}%` : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default FinancialStatements;