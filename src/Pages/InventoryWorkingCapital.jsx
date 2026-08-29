import { useState, useCallback, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { inventoryData } from "../data/internalData";
import { formatCr } from "../engine/financialEngine";

const PIE_COLORS = ["#1a3a8a", "#43d597", "#f5a623", "#5bb5f5"];
const ITEM_CATEGORIES = ["Raw Materials", "Work in Progress", "Finished Goods", "Stores & Spares", "Consumables", "Packing Material"];

const emptyItem = {
  itemName: "", category: "Raw Materials", sku: "", quantity: "", unit: "units",
  unitCost: "", reorderLevel: "", leadTimeDays: "", location: "", status: "Active",
};

function InventoryWorkingCapital({ isLoading = false }) {
  /* ─── Inventory items state (user-managed) ─── */
  const [items, setItems] = useState([
    { id: "INV001", itemName: "Crude Oil",          category: "Raw Materials",    sku: "RM-001", quantity: 12000, unit: "barrels", unitCost: 6500,  reorderLevel: 3000, leadTimeDays: 14, location: "Jamnagar",  status: "Active" },
    { id: "INV002", itemName: "Polyester Chips",    category: "Raw Materials",    sku: "RM-002", quantity: 4500,  unit: "MT",     unitCost: 850,   reorderLevel: 1000, leadTimeDays: 7,  location: "Nagothane", status: "Active" },
    { id: "INV003", itemName: "Finished PET Resin", category: "Finished Goods",  sku: "FG-001", quantity: 2200,  unit: "MT",     unitCost: 1200,  reorderLevel: 500,  leadTimeDays: 0,  location: "Warehouse", status: "Active" },
    { id: "INV004", itemName: "WIP Fibre",          category: "Work in Progress", sku: "WIP-01", quantity: 1800,  unit: "MT",     unitCost: 980,   reorderLevel: 0,    leadTimeDays: 0,  location: "Plant 2",   status: "Active" },
    { id: "INV005", itemName: "Spare Parts - A",    category: "Stores & Spares",  sku: "SS-001", quantity: 840,   unit: "units",  unitCost: 12000, reorderLevel: 200,  leadTimeDays: 21, location: "Stores",    status: "Active" },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyItem);
  const [formErr, setFormErr] = useState("");

  /* ─── Category pie derived from items ─── */
  const [pieCategories, setPieCategories] = useState(inventoryData.categories);

  /* ─── Summary derived from items ─── */
  const totalValue   = useMemo(() => items.reduce((s, it) => s + Number(it.quantity) * Number(it.unitCost), 0), [items]);
  const categoryMap  = useMemo(() => {
    const map = {};
    items.forEach(it => {
      const val = Number(it.quantity) * Number(it.unitCost);
      map[it.category] = (map[it.category] || 0) + val;
    });
    return map;
  }, [items]);

  /* ─── Recompute pie when items change ─── */
  const derivedPie = useMemo(() => {
    const total = Object.values(categoryMap).reduce((s, v) => s + v, 0) || 1;
    return Object.entries(categoryMap).map(([name, value]) => ({
      name, value, pct: ((value / total) * 100).toFixed(1),
    }));
  }, [categoryMap]);

  const lowStockCount = useMemo(() => items.filter(it => Number(it.quantity) <= Number(it.reorderLevel)).length, [items]);

  /* ─── Add item handler ─── */
  const handleAdd = useCallback((e) => {
    e.preventDefault();
    setFormErr("");
    if (!form.itemName.trim()) { setFormErr("Item name is required."); return; }
    if (!form.sku.trim())      { setFormErr("SKU is required."); return; }
    if (!form.quantity || isNaN(Number(form.quantity)) || Number(form.quantity) < 0) { setFormErr("Enter a valid quantity."); return; }
    if (!form.unitCost || isNaN(Number(form.unitCost)) || Number(form.unitCost) < 0) { setFormErr("Enter a valid unit cost."); return; }
    const newItem = {
      ...form,
      id: `INV${Date.now()}`,
      quantity: Number(form.quantity),
      unitCost: Number(form.unitCost),
      reorderLevel: Number(form.reorderLevel) || 0,
      leadTimeDays: Number(form.leadTimeDays) || 0,
    };
    setItems(prev => [newItem, ...prev]);
    setForm(emptyItem);
    setShowForm(false);
  }, [form]);

  const handleRemove = useCallback((id) => setItems(prev => prev.filter(it => it.id !== id)), []);

  /* ─── Summary cards from live item data ─── */
  const summaryCards = [
    { label: "TOTAL INVENTORY VALUE",    value: formatCr(totalValue) },
    { label: "TOTAL ITEMS",              value: `${items.length}` },
    { label: "LOW STOCK / REORDER",      value: `${lowStockCount}`, warning: lowStockCount > 0 },
    { label: "CATEGORIES",               value: `${Object.keys(categoryMap).length}` },
    { label: "WORKING CAPITAL TIED",     value: formatCr(inventoryData.workingCapitalTied) },
  ];

  return (
    <div className="inventory-wc">
      <div className="page-heading">
        <div>
          <p className="small-label">OPERATIONS</p>
          <h2>Inventory &amp; Working Capital</h2>
          <p className="sub-text">Live Inventory Items &amp; Working Capital Analysis</p>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="inv-summary-grid">
        {summaryCards.map((c) => (
          <div key={c.label} className="inv-summary-card">
            <span>{c.label}</span>
            <h3 className={c.warning ? "warning" : ""}>{c.value}</h3>
          </div>
        ))}
      </div>

      {/* PIE CHART — derived from live items */}
      <div className="inv-two-col">
        <div className="flux-card">
          <span className="card-label">INVENTORY BREAKDOWN</span>
          <h3 className="card-title">By Category (Live)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={derivedPie} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" strokeWidth={0}>
                {derivedPie.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip
                contentStyle={{ background: "#1a1825", border: "1px solid #292632", borderRadius: "8px", color: "#fff", fontSize: "12px" }}
                formatter={(v) => [formatCr(v)]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="inv-legend">
            {derivedPie.map((cat, i) => (
              <div key={cat.name} className="inv-legend-item">
                <span className="inv-dot" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}></span>
                <span>{cat.name}</span>
                <strong>{cat.pct}%</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Working Capital stats */}
        <div className="flux-card">
          <span className="card-label">WORKING CAPITAL</span>
          <h3 className="card-title">Key Metrics</h3>
          <div className="inv-wc-stats">
            {[
              { label: "Inventory Turnover",       value: `${inventoryData.turnover}×` },
              { label: "Days Inventory Outstanding", value: `${inventoryData.daysOutstanding} days` },
              { label: "Slow-Moving Stock",         value: `${inventoryData.slowMovingPct}%`, cls: "warning" },
              { label: "Live Total Value",          value: formatCr(totalValue), cls: "positive" },
              { label: "Items Below Reorder Level", value: `${lowStockCount}`, cls: lowStockCount > 0 ? "negative" : "positive" },
            ].map(row => (
              <div key={row.label} className="inv-wc-row">
                <span>{row.label}</span>
                <strong className={row.cls || ""}>{row.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── INVENTORY ITEMS TABLE + ADD FORM ─── */}
      <div className="flux-card">
        <div className="inv-table-header">
          <div>
            <span className="card-label">INVENTORY ITEMS</span>
            <h3 className="card-title">Item Register</h3>
          </div>
          <button className="flux-btn" id="toggle-add-item" onClick={() => setShowForm(v => !v)}>
            {showForm ? "− Cancel" : "+ Add Item"}
          </button>
        </div>

        {showForm && (
          <form className="inv-add-form" onSubmit={handleAdd} id="add-inventory-item-form">
            <div className="inv-form-grid">
              <div className="inv-form-field">
                <label htmlFor="inv-item-name">Item Name</label>
                <input id="inv-item-name" type="text" placeholder="e.g. Crude Oil"
                  value={form.itemName} onChange={e => setForm(p => ({ ...p, itemName: e.target.value }))} />
              </div>
              <div className="inv-form-field">
                <label htmlFor="inv-sku">SKU</label>
                <input id="inv-sku" type="text" placeholder="e.g. RM-006"
                  value={form.sku} onChange={e => setForm(p => ({ ...p, sku: e.target.value }))} />
              </div>
              <div className="inv-form-field">
                <label htmlFor="inv-category">Category</label>
                <select id="inv-category" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                  {ITEM_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="inv-form-field">
                <label htmlFor="inv-quantity">Quantity</label>
                <input id="inv-quantity" type="number" placeholder="e.g. 1000" min="0"
                  value={form.quantity} onChange={e => setForm(p => ({ ...p, quantity: e.target.value }))} />
              </div>
              <div className="inv-form-field">
                <label htmlFor="inv-unit">Unit</label>
                <select id="inv-unit" value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))}>
                  {["units", "MT", "barrels", "kg", "litres", "boxes", "pallets"].map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
              <div className="inv-form-field">
                <label htmlFor="inv-unit-cost">Unit Cost (₹)</label>
                <input id="inv-unit-cost" type="number" placeholder="e.g. 6500" min="0"
                  value={form.unitCost} onChange={e => setForm(p => ({ ...p, unitCost: e.target.value }))} />
              </div>
              <div className="inv-form-field">
                <label htmlFor="inv-reorder">Reorder Level</label>
                <input id="inv-reorder" type="number" placeholder="e.g. 300" min="0"
                  value={form.reorderLevel} onChange={e => setForm(p => ({ ...p, reorderLevel: e.target.value }))} />
              </div>
              <div className="inv-form-field">
                <label htmlFor="inv-lead-time">Lead Time (days)</label>
                <input id="inv-lead-time" type="number" placeholder="e.g. 14" min="0"
                  value={form.leadTimeDays} onChange={e => setForm(p => ({ ...p, leadTimeDays: e.target.value }))} />
              </div>
              <div className="inv-form-field">
                <label htmlFor="inv-location">Storage Location</label>
                <input id="inv-location" type="text" placeholder="e.g. Jamnagar"
                  value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} />
              </div>
              <div className="inv-form-field">
                <label htmlFor="inv-status">Status</label>
                <select id="inv-status" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Obsolete">Obsolete</option>
                </select>
              </div>
            </div>
            {formErr && <p className="inv-form-error">{formErr}</p>}
            <button type="submit" className="flux-btn" id="submit-inventory-item">Add to Register</button>
          </form>
        )}

        <table className="flux-table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Qty</th>
              <th>Unit</th>
              <th>Unit Cost</th>
              <th>Total Value</th>
              <th>Reorder Lvl</th>
              <th>Lead Time</th>
              <th>Location</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => {
              const totalVal   = Number(row.quantity) * Number(row.unitCost);
              const belowReorder = Number(row.quantity) <= Number(row.reorderLevel);
              return (
                <tr key={row.id}>
                  <td>{row.itemName}</td>
                  <td style={{ fontFamily: "monospace", fontSize: 11 }}>{row.sku}</td>
                  <td>{row.category}</td>
                  <td className={belowReorder ? "negative" : ""}>{Number(row.quantity).toLocaleString("en-IN")}</td>
                  <td>{row.unit}</td>
                  <td>₹{Number(row.unitCost).toLocaleString("en-IN")}</td>
                  <td>{formatCr(totalVal)}</td>
                  <td>{row.reorderLevel || "—"}</td>
                  <td>{row.leadTimeDays ? `${row.leadTimeDays}d` : "—"}</td>
                  <td>{row.location || "—"}</td>
                  <td>
                    <span className={`status-badge ${row.status === "Active" ? "healthy" : row.status === "Obsolete" ? "critical" : "pending"}`}>
                      {row.status}
                    </span>
                  </td>
                  <td>
                    <button className="inv-remove-btn" onClick={() => handleRemove(row.id)} title="Remove item">×</button>
                  </td>
                </tr>
              );
            })}
            {items.length === 0 && (
              <tr><td colSpan={12} style={{ textAlign: "center", color: "var(--color-text-faint)", padding: 24 }}>No items. Add one above.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InventoryWorkingCapital;
