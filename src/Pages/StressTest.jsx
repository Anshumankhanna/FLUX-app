import { useState, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { stressScenarios } from "../data/stressScenarios";
import { incomeStatement, balanceSheet, cashFlowStatement } from "../data/companyData";
import { runStressScenario, formatCr } from "../engine/financialEngine";


/* =============================================
   STRESS-TEST FIELD CONFIG
============================================= */

const STRESS_FIELDS = [
  { key: "revenueChange",       label: "Revenue Change",         unit: "%",    min: -10, max: 10,  step: 0.5, icon: "📈", description: "Shift in total revenue" },
  { key: "inventoryChange",     label: "Inventory Change",       unit: "Days", min: -15, max: 15,  step: 1,   icon: "📦", description: "Days of inventory held" },
  { key: "operationalCostChange", label: "Operational Cost Change", unit: "%", min: -5,  max: 5,   step: 0.25, icon: "⚙️", description: "Change in operating expenses" },
  { key: "capexChange",         label: "CapEx Change",           unit: "%",    min: -10, max: 10,  step: 0.5, icon: "🏗️", description: "Capital expenditure shift" },
  { key: "interestRateChange",  label: "Interest Rate Change",   unit: "%",    min: -2,  max: 2,   step: 0.1, icon: "🏦", description: "Benchmark rate movement" },
  { key: "fxRateChange",        label: "FX Rate Change",         unit: "%",    min: -5,  max: 5,   step: 0.25, icon: "💱", description: "Foreign exchange impact" },
  { key: "receivableDelay",     label: "Receivable Delay",       unit: "Days", min: -15, max: 15,  step: 1,   icon: "🕐", description: "Shift in collection period" },
];

const API_ENDPOINT = "https://api.gateway.example.com/v1/stress-test";

const buildInitialValues = () =>
  STRESS_FIELDS.reduce((acc, f) => ({ ...acc, [f.key]: 0 }), {});


/* =============================================
   SLIDER ROW COMPONENT
============================================= */

function SliderRow({ field, value, onChange }) {
  const percentage = ((value - field.min) / (field.max - field.min)) * 100;
  const isPositive = value > 0;
  const isNegative = value < 0;
  const isNeutral  = value === 0;

  const displayValue = value > 0 ? `+${value}` : `${value}`;

  return (
    <div className={`st-slider-row ${isNeutral ? "" : isPositive ? "positive-glow" : "negative-glow"}`} id={`slider-${field.key}`}>

      <div className="st-slider-header">
        <div className="st-slider-meta">
          <span className="st-slider-icon">{field.icon}</span>
          <div>
            <span className="st-slider-label">{field.label}</span>
            <span className="st-slider-desc">{field.description}</span>
          </div>
        </div>

        <div className="st-slider-value-group">
          <span className={`st-slider-value ${isPositive ? "positive" : isNegative ? "negative" : ""}`}>
            {displayValue}
          </span>
          <span className="st-slider-unit">{field.unit}</span>
          {!isNeutral && (
            <button
              className="st-reset-btn"
              onClick={() => onChange(field.key, 0)}
              title="Reset to 0"
              type="button"
            >
              ↺
            </button>
          )}
        </div>
      </div>

      <div className="st-slider-track-wrapper">
        <span className="st-slider-bound">{field.min}{field.unit}</span>
        <div className="st-slider-container">
          <input
            type="range"
            id={`input-${field.key}`}
            min={field.min}
            max={field.max}
            step={field.step}
            value={value}
            onChange={(e) => onChange(field.key, parseFloat(e.target.value))}
            className="st-range-input"
            style={{ "--fill-percent": `${percentage}%` }}
          />
          {/* Zero-line marker */}
          <div
            className="st-zero-marker"
            style={{ left: `${((0 - field.min) / (field.max - field.min)) * 100}%` }}
          />
        </div>
        <span className="st-slider-bound">+{field.max}{field.unit}</span>
      </div>

    </div>
  );
}


/* =============================================
   MAIN COMPONENT
============================================= */

function StressTest() {
  /* — Existing scenario-card state — */
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [results, setResults] = useState(null);
  const [activeCategory, setActiveCategory] = useState("custom");

  /* — Custom form state — */
  const [formValues, setFormValues] = useState(buildInitialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // null | "success" | "error"
  const [apiResponse, setApiResponse] = useState(null);

  const allSingle = {
    business: stressScenarios.business,
    financial: stressScenarios.financial,
    market: stressScenarios.market,
  };


  /* — Custom form handlers — */
  const handleSliderChange = useCallback((key, value) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
    setSubmitStatus(null);
  }, []);

  const handleResetAll = () => {
    setFormValues(buildInitialValues());
    setSubmitStatus(null);
    setApiResponse(null);
  };

  const hasChanges = Object.values(formValues).some((v) => v !== 0);

  const buildPayload = () => ({
    timestamp: new Date().toISOString(),
    scenario: "custom",
    parameters: {
      revenueChange:         { value: formValues.revenueChange,         unit: "percent" },
      inventoryChange:       { value: formValues.inventoryChange,       unit: "days" },
      operationalCostChange: { value: formValues.operationalCostChange, unit: "percent" },
      capexChange:           { value: formValues.capexChange,           unit: "percent" },
      interestRateChange:    { value: formValues.interestRateChange,    unit: "percent" },
      fxRateChange:          { value: formValues.fxRateChange,          unit: "percent" },
      receivableDelay:       { value: formValues.receivableDelay,       unit: "days" },
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = buildPayload();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setApiResponse(null);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }

      const data = await response.json();
      setApiResponse(data);
      setSubmitStatus("success");
      console.log("✅ Stress test submitted successfully:", data);
    } catch (err) {
      console.error("❌ Stress test submission failed:", err);
      setSubmitStatus("error");
      /* Show user-friendly alert on network-level failures */
      if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
        // Expected: placeholder endpoint is unreachable
        console.info("ℹ️ This is expected when using the placeholder API endpoint.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  /* — Existing scenario-card handlers — */
  const handleRunScenario = (scenario) => {
    setSelectedScenario(scenario);

    let shocks;
    if (scenario.shocks) {
      shocks = scenario.shocks;
    } else {
      shocks = [{ param: scenario.param, delta: scenario.delta }];
    }

    const result = runStressScenario(incomeStatement, balanceSheet, cashFlowStatement, shocks);
    setResults(result);
  };

  const comparisonData = results ? [
    { metric: "Revenue",       Base: results.base.revenue,          Stressed: results.stressed.revenue },
    { metric: "EBITDA",        Base: results.base.ebitda,           Stressed: results.stressed.ebitda },
    { metric: "Net Income",    Base: results.base.netIncome,        Stressed: results.stressed.netIncome },
    { metric: "FCF",           Base: results.base.freeCashFlow,     Stressed: results.stressed.freeCashFlow },
    { metric: "Cash",          Base: results.base.cash,             Stressed: results.stressed.cash },
  ] : [];

  const impactRows = results ? [
    { label: "Revenue",           base: results.base.revenue,          stressed: results.stressed.revenue,          delta: results.delta.revenue },
    { label: "EBITDA",            base: results.base.ebitda,           stressed: results.stressed.ebitda,           delta: results.delta.ebitda },
    { label: "Net Income",        base: results.base.netIncome,        stressed: results.stressed.netIncome,        delta: results.delta.netIncome },
    { label: "Free Cash Flow",    base: results.base.freeCashFlow,     stressed: results.stressed.freeCashFlow,     delta: results.delta.freeCashFlow },
    { label: "Cash Position",     base: results.base.cash,             stressed: results.stressed.cash,             delta: results.delta.cash },
    { label: "Interest Expense",  base: results.base.interestExpense,  stressed: results.stressed.interestExpense,  delta: results.delta.interestExpense },
    { label: "Interest Coverage", base: results.base.interestCoverage + "×", stressed: results.stressed.interestCoverage + "×", delta: null, isRatio: true },
    { label: "Liquidity Coverage", base: results.base.liquidityCoverage + "×", stressed: results.stressed.liquidityCoverage + "×", delta: null, isRatio: true },
    { label: "Cash Runway",       base: results.base.cashRunway + " mo", stressed: results.stressed.cashRunway + " mo", delta: null, isRatio: true },
  ] : [];


  /* — Tab categories — */
  const categories = [
    { key: "custom",   label: "⚡ Custom Stress Test" },
    { key: "business", label: "Business Shocks" },
    { key: "financial",label: "Financial Shocks" },
    { key: "market",   label: "Market Shocks" },
    { key: "combined", label: "Combined Scenarios" },
  ];


  return (
    <div className="stress-test">
      <div className="page-heading">
        <div>
          <p className="small-label">ANALYTICS</p>
          <h2>Stress Scenario Engine</h2>
          <p className="sub-text">Model financial impact of adverse scenarios</p>
        </div>
      </div>


      {/* ── CATEGORY TABS ── */}
      <div className="st-category-tabs">
        {categories.map((cat) => (
          <button
            key={cat.key}
            className={`st-cat-tab ${activeCategory === cat.key ? "active" : ""}`}
            onClick={() => setActiveCategory(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>


      {/* ══════════════════════════════════════════
          CUSTOM STRESS-TEST FORM
      ══════════════════════════════════════════ */}
      {activeCategory === "custom" && (
        <form className="st-custom-form animate-fade-in" onSubmit={handleSubmit} id="stress-test-form">

          {/* Form header */}
          <div className="st-form-header">
            <div>
              <h3 className="st-form-title">Configure Scenario Parameters</h3>
              <p className="st-form-subtitle">
                Adjust the sliders to define your custom stress scenario. Each parameter is bounded by its maximum stress limit.
              </p>
            </div>
            {hasChanges && (
              <button className="st-reset-all-btn" type="button" onClick={handleResetAll}>
                ↺ Reset All
              </button>
            )}
          </div>

          {/* Slider grid */}
          <div className="st-slider-grid">
            {STRESS_FIELDS.map((field) => (
              <SliderRow
                key={field.key}
                field={field}
                value={formValues[field.key]}
                onChange={handleSliderChange}
              />
            ))}
          </div>

          {/* Payload preview */}
          <details className="st-payload-preview">
            <summary>
              <span className="st-preview-icon">{ }</span>
              Preview JSON Payload
            </summary>
            <pre className="st-payload-code">
              {JSON.stringify(buildPayload(), null, 2)}
            </pre>
          </details>

          {/* Submit area */}
          <div className="st-submit-area">
            <button
              type="submit"
              className={`flux-btn st-submit-btn ${isSubmitting ? "submitting" : ""}`}
              disabled={isSubmitting}
              id="run-stress-test-btn"
            >
              {isSubmitting ? (
                <>
                  <span className="st-spinner" />
                  Running Stress Test…
                </>
              ) : (
                <>⚡ Run Stress Test</>
              )}
            </button>

            {submitStatus === "success" && (
              <div className="st-status-msg success animate-fade-in">
                <span>✓</span> Stress test submitted successfully
              </div>
            )}

            {submitStatus === "error" && (
              <div className="st-status-msg error animate-fade-in">
                <span>✕</span> Submission failed — the API endpoint is unreachable.
                <span className="st-status-hint">This is expected with the placeholder endpoint. Check console for details.</span>
              </div>
            )}
          </div>

        </form>
      )}


      {/* ══════════════════════════════════════════
          PRE-BUILT SCENARIO CARDS (Existing)
      ══════════════════════════════════════════ */}
      {activeCategory !== "custom" && (
        <>
          <div className="st-scenario-grid">
            {activeCategory !== "combined" && allSingle[activeCategory]?.map((s) => (
              <button key={s.id} className={`st-scenario-card ${selectedScenario?.id === s.id ? "selected" : ""}`} onClick={() => handleRunScenario(s)}>
                <span className="st-icon">{s.icon}</span>
                <span className="st-name">{s.name}</span>
              </button>
            ))}
            {activeCategory === "combined" && stressScenarios.combined.map((s) => (
              <button key={s.id} className={`st-scenario-card combined ${selectedScenario?.id === s.id ? "selected" : ""}`} onClick={() => handleRunScenario(s)}>
                <span className="st-icon">{s.icon}</span>
                <div>
                  <span className="st-name">{s.name}</span>
                  <p className="st-desc">{s.description}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Results */}
          {results && (
            <div className="st-results animate-fade-in-up">
              <h3 className="st-results-title">
                {selectedScenario?.icon} {selectedScenario?.name} — Impact Analysis
              </h3>

              <div className="flux-card st-chart-card">
                <span className="card-label">BASE vs STRESSED</span>
                <h3 className="card-title">Financial Metrics Comparison</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={comparisonData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                    <XAxis dataKey="metric" stroke="#3d3a4a" tick={{ fill: "#8e8a9b", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis stroke="#3d3a4a" tick={{ fill: "#5f5b68", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "#1a1825", border: "1px solid #292632", borderRadius: "8px", color: "#fff", fontSize: "12px" }} formatter={(v) => [formatCr(v)]} />
                    <Legend wrapperStyle={{ fontSize: "11px", color: "#8e8a9b" }} />
                    <Bar dataKey="Base" fill="#1a3a8a" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Stressed" fill="#ed7474" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flux-card">
                <span className="card-label">DETAILED IMPACT</span>
                <h3 className="card-title">Before vs After Comparison</h3>
                <table className="flux-table">
                  <thead>
                    <tr>
                      <th>Metric</th>
                      <th>Base Case</th>
                      <th>Stressed</th>
                      <th>Impact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {impactRows.map((row) => (
                      <tr key={row.label}>
                        <td>{row.label}</td>
                        <td>{row.isRatio ? row.base : formatCr(row.base)}</td>
                        <td className={!row.isRatio && row.delta < 0 ? "negative" : !row.isRatio && row.delta > 0 && row.label === "Interest Expense" ? "negative" : ""}>{row.isRatio ? row.stressed : formatCr(row.stressed)}</td>
                        <td className={row.delta !== null ? (row.delta < 0 ? "negative" : row.label === "Interest Expense" && row.delta > 0 ? "negative" : "positive") : ""}>
                          {row.delta !== null ? `${row.delta >= 0 ? "+" : ""}${formatCr(row.delta)}` : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
}

export default StressTest;
