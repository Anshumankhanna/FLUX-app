import { useState, useCallback } from "react";
import { accountsReceivable as seedData } from "../data/internalData";
import { formatCr } from "../engine/financialEngine";

/* ─── Calculate days overdue from a due-date string ─── */
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
  invoiceId: "", customer: "", amount: "", currency: "INR",
  status: "pending", dueDate: "",
};

function AccountsReceivable() {
  const [invoices, setInvoices] = useState(
    seedData.map(d => ({ ...d, daysOverdue: calcDaysOverdue(d.dueDate, d.status) }))
  );
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyInvoice);
  const [formErr, setFormErr] = useState("");

  /* ─── Derived summary ─── */
  const unpaid           = invoices.filter(d => d.status !== "paid");
  const totalOutstanding = unpaid.reduce((s, d) => s + Number(d.amount), 0);
  const overdueList      = invoices.filter(d => d.status === "overdue");
  const overdueAmount    = overdueList.reduce((s, d) => s + Number(d.amount), 0);
  const dso              = totalOutstanding > 0 ? Math.round((totalOutstanding / 902000) * 365) : 0;

  const summaryCards = [
    { label: "TOTAL OUTSTANDING", value: formatCr(totalOutstanding),     sub: `${unpaid.length} invoices` },
    { label: "OVERDUE AMOUNT",    value: formatCr(overdueAmount),         sub: `${overdueList.length} overdue`, negative: true },
    { label: "DSO",               value: `${dso} days`,                  sub: "Days Sales Outstanding" },
    { label: "COLLECTION RATE",   value: `${invoices.length > 0 ? Math.round((invoices.filter(d => d.status === "paid").length / invoices.length) * 100) : 0}%`, sub: "All-time paid", positive: true },
  ];

  /* ─── Add invoice handler ─── */
  const handleAdd = useCallback((e) => {
    e.preventDefault();
    setFormErr("");
    if (!form.invoiceId.trim()) { setFormErr("Invoice ID is required."); return; }
    if (!form.customer.trim()) { setFormErr("Customer name is required."); return; }
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) { setFormErr("Enter a valid amount."); return; }
    if (!form.dueDate) { setFormErr("Due date is required."); return; }
    const days = calcDaysOverdue(form.dueDate, form.status);
    const newRow = {
      id: `AR${Date.now()}`,
      customer: form.customer.trim(),
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
    <div className="accounts-receivable">
      <div className="page-heading">
        <div>
          <p className="small-label">OPERATIONS</p>
          <h2>Accounts Receivable</h2>
          <p className="sub-text">Customer Invoices &amp; Collections</p>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="ar-summary-grid">
        {summaryCards.map((c) => (
          <div key={c.label} className="ar-summary-card">
            <span>{c.label}</span>
            <h3 className={c.positive ? "positive" : c.negative ? "negative" : ""}>{c.value}</h3>
            <p>{c.sub}</p>
          </div>
        ))}
      </div>

      {/* OUTSTANDING RECEIVABLES TABLE + ADD FORM */}
      <div className="flux-card">
        <div className="ar-table-header">
          <div>
            <span className="card-label">INVOICE DETAILS</span>
            <h3 className="card-title">Outstanding Receivables</h3>
          </div>
          <button
            className="flux-btn"
            id="toggle-add-invoice-ar"
            onClick={() => setShowForm(v => !v)}
          >
            {showForm ? "− Cancel" : "+ Add Invoice"}
          </button>
        </div>

        {/* ADD INVOICE FORM */}
        {showForm && (
          <form className="ar-invoice-form" onSubmit={handleAdd} id="add-invoice-form-ar">
            <div className="ar-form-grid">
              <div className="ar-form-field">
                <label htmlFor="ar-invoice-id">Invoice ID</label>
                <input id="ar-invoice-id" type="text" placeholder="e.g. INV-2026-011"
                  value={form.invoiceId} onChange={e => setForm(p => ({ ...p, invoiceId: e.target.value }))} />
              </div>
              <div className="ar-form-field">
                <label htmlFor="ar-customer">Customer Name</label>
                <input id="ar-customer" type="text" placeholder="e.g. Tata Motors Ltd"
                  value={form.customer} onChange={e => setForm(p => ({ ...p, customer: e.target.value }))} />
              </div>
              <div className="ar-form-field">
                <label htmlFor="ar-amount">Amount</label>
                <input id="ar-amount" type="number" placeholder="e.g. 2500" min="0"
                  value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} />
              </div>
              <div className="ar-form-field">
                <label htmlFor="ar-currency">Currency</label>
                <select id="ar-currency" value={form.currency} onChange={e => setForm(p => ({ ...p, currency: e.target.value }))}>
                  <option value="INR">INR — Indian Rupee</option>
                  <option value="USD">USD — US Dollar</option>
                </select>
              </div>
              <div className="ar-form-field">
                <label htmlFor="ar-status">Status</label>
                <select id="ar-status" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                  <option value="pending">Pending</option>
                  <option value="overdue">Overdue</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              <div className="ar-form-field">
                <label htmlFor="ar-due-date">Due Date</label>
                <input id="ar-due-date" type="date"
                  value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} />
              </div>
            </div>
            {formErr && <p className="ar-form-error">{formErr}</p>}
            <button type="submit" className="flux-btn" id="submit-invoice-ar">Add Invoice</button>
          </form>
        )}

        <table className="flux-table">
          <thead>
            <tr>
              <th>Customer</th>
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
                <td>{row.customer}</td>
                <td style={{ fontFamily: "monospace", fontSize: 12 }}>{row.invoice}</td>
                <td>₹{Number(row.amount).toLocaleString("en-IN")}L</td>
                <td>{row.currency}</td>
                <td>{new Date(row.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                <td><span className={`status-badge ${row.status}`}>{row.status}</span></td>
                <td className={row.daysOverdue > 0 ? "negative" : ""}>
                  {row.daysOverdue > 0 ? row.daysOverdue : "—"}
                </td>
                <td>
                  <button className="ar-remove-btn" onClick={() => handleRemove(row.id)} title="Remove invoice">×</button>
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

export default AccountsReceivable;
