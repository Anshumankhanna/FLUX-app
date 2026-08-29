import { useState, useCallback } from "react";
import { accountsPayable as seedData } from "../data/internalData";
import { formatCr } from "../engine/financialEngine";

/* ─── Calculate days overdue ─── */
function calcDaysOverdue(dueDateStr, status) {
  if (status === "paid") return 0;
  const due = new Date(dueDateStr);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  const diff = Math.floor((now - due) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

const emptyInvoice = {
  invoiceId: "", supplier: "", amount: "", currency: "INR",
  status: "pending", dueDate: "",
};

function AccountsPayable() {
  const [invoices, setInvoices] = useState(
    seedData.map(d => ({ ...d, daysOverdue: calcDaysOverdue(d.dueDate, d.status) }))
  );
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyInvoice);
  const [formErr, setFormErr] = useState("");

  /* ─── Derived values ─── */
  const unpaid       = invoices.filter(d => d.status !== "paid");
  const totalPayable = unpaid.reduce((s, d) => s + Number(d.amount), 0);
  const usdPayable   = unpaid.filter(d => d.currency === "USD").reduce((s, d) => s + Number(d.amount), 0);
  const overdueList  = invoices.filter(d => d.status === "overdue");
  const overdueAmt   = overdueList.reduce((s, d) => s + Number(d.amount), 0);
  const upcomingWeek = unpaid.filter(d => {
    const due  = new Date(d.dueDate);
    const now  = new Date();
    const diff = (due - now) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7;
  }).length;

  const summaryCards = [
    { label: "TOTAL PAYABLE",     value: formatCr(totalPayable), sub: `${unpaid.length} pending invoices` },
    { label: "USD OBLIGATIONS",   value: formatCr(usdPayable),   sub: "USD currency exposure" },
    { label: "OVERDUE AMOUNT",    value: formatCr(overdueAmt),   sub: `${overdueList.length} overdue`, negative: overdueList.length > 0 },
    { label: "DUE THIS WEEK",     value: upcomingWeek,           sub: "Invoices due ≤ 7 days", negative: upcomingWeek > 0 },
  ];

  /* ─── Add payable invoice ─── */
  const handleAdd = useCallback((e) => {
    e.preventDefault();
    setFormErr("");
    if (!form.invoiceId.trim()) { setFormErr("Invoice ID is required."); return; }
    if (!form.supplier.trim())  { setFormErr("Supplier name is required."); return; }
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) { setFormErr("Enter a valid amount."); return; }
    if (!form.dueDate) { setFormErr("Due date is required."); return; }
    const days = calcDaysOverdue(form.dueDate, form.status);
    const newRow = {
      id: `AP${Date.now()}`,
      supplier: form.supplier.trim(),
      invoice: form.invoiceId.trim(),
      amount: Number(form.amount),
      currency: form.currency,
      dueDate: form.dueDate,
      status: form.status,
      daysOverdue: days,
    };
    setInvoices(prev => [newRow, ...prev]);
    setForm(emptyInvoice);
    setShowForm(false);
  }, [form]);

  const handleRemove = useCallback((id) => {
    setInvoices(prev => prev.filter(d => d.id !== id));
  }, []);

  return (
    <div className="accounts-payable">
      <div className="page-heading">
        <div>
          <p className="small-label">OPERATIONS</p>
          <h2>Accounts Payable</h2>
          <p className="sub-text">Supplier Invoices &amp; Obligations</p>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="ap-summary-grid">
        {summaryCards.map((c) => (
          <div key={c.label} className="ap-summary-card">
            <span>{c.label}</span>
            <h3 className={c.negative ? "negative" : ""}>{c.value}</h3>
            <p>{c.sub}</p>
          </div>
        ))}
      </div>

      {/* TABLE + FORM */}
      <div className="flux-card">
        <div className="ap-table-header">
          <div>
            <span className="card-label">SUPPLIER INVOICES</span>
            <h3 className="card-title">Outstanding Payables</h3>
          </div>
          <button
            className="flux-btn"
            id="toggle-add-invoice-ap"
            onClick={() => setShowForm(v => !v)}
          >
            {showForm ? "− Cancel" : "+ Add Invoice"}
          </button>
        </div>

        {/* ADD INVOICE FORM */}
        {showForm && (
          <form className="ap-invoice-form" onSubmit={handleAdd} id="add-invoice-form-ap">
            <div className="ap-form-grid">
              <div className="ap-form-field">
                <label htmlFor="ap-invoice-id">Invoice ID</label>
                <input id="ap-invoice-id" type="text" placeholder="e.g. SUP-2026-009"
                  value={form.invoiceId} onChange={e => setForm(p => ({ ...p, invoiceId: e.target.value }))} />
              </div>
              <div className="ap-form-field">
                <label htmlFor="ap-supplier">Supplier Name</label>
                <input id="ap-supplier" type="text" placeholder="e.g. Saudi Aramco"
                  value={form.supplier} onChange={e => setForm(p => ({ ...p, supplier: e.target.value }))} />
              </div>
              <div className="ap-form-field">
                <label htmlFor="ap-amount">Amount (₹ Cr)</label>
                <input id="ap-amount" type="number" placeholder="e.g. 1200" min="0"
                  value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} />
              </div>
              <div className="ap-form-field">
                <label htmlFor="ap-currency">Currency</label>
                <select id="ap-currency" value={form.currency} onChange={e => setForm(p => ({ ...p, currency: e.target.value }))}>
                  <option value="INR">INR — Indian Rupee</option>
                  <option value="USD">USD — US Dollar</option>
                </select>
              </div>
              <div className="ap-form-field">
                <label htmlFor="ap-status">Status</label>
                <select id="ap-status" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                  <option value="pending">Pending</option>
                  <option value="overdue">Overdue</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              <div className="ap-form-field">
                <label htmlFor="ap-due-date">Due Date</label>
                <input id="ap-due-date" type="date"
                  value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} />
              </div>
            </div>
            {formErr && <p className="ap-form-error">{formErr}</p>}
            <button type="submit" className="flux-btn" id="submit-invoice-ap">Add Invoice</button>
          </form>
        )}

        <table className="flux-table">
          <thead>
            <tr>
              <th>Supplier</th>
              <th>Invoice</th>
              <th>Amount</th>
              <th>Currency</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Days Overdue</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((row) => (
              <tr key={row.id}>
                <td>{row.supplier}</td>
                <td style={{ fontFamily: "monospace", fontSize: 12 }}>{row.invoice}</td>
                <td>{formatCr(Number(row.amount))}</td>
                <td><span className={row.currency !== "INR" ? "warning" : ""}>{row.currency}</span></td>
                <td>{new Date(row.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                <td><span className={`status-badge ${row.status}`}>{row.status}</span></td>
                <td className={row.daysOverdue > 0 ? "negative" : ""}>
                  {row.daysOverdue > 0 ? row.daysOverdue : "—"}
                </td>
                <td>
                  <button className="ap-remove-btn" onClick={() => handleRemove(row.id)} title="Remove invoice">×</button>
                </td>
              </tr>
            ))}
            {invoices.length === 0 && (
              <tr><td colSpan={8} style={{ textAlign: "center", color: "var(--color-text-faint)", padding: 24 }}>No invoices. Add one above.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AccountsPayable;
