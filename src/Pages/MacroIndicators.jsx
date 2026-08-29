import { useState } from "react";
import { macroIndicators } from "../data/marketData";

const indicatorLabels = {
  inflation: "Inflation (CPI)",
  gdpGrowth: "GDP Growth",
  unemployment: "Unemployment",
  repoRate: "Repo Rate",
  reverseRepoRate: "Reverse Repo Rate",
  tenYearYield: "10Y Govt Bond Yield",
  consumerConfidence: "Consumer Confidence",
  industrialProduction: "Industrial Production",
  cpi: "CPI Inflation",
  wpi: "WPI Inflation",
  fedFundsRate: "Fed Funds Rate",
};

const trendIcons = { up: "▲", down: "▼", stable: "◆" };
const trendColors = { up: "var(--color-positive)", down: "var(--color-negative)", stable: "var(--color-warning)" };

function MacroIndicators() {
  const [country, setCountry] = useState("india");
  const data = macroIndicators[country];

  return (
    <div className="macro-indicators">

      <div className="page-heading">
        <div>
          <p className="small-label">MACROECONOMIC DATA</p>
          <h2>Macroeconomic Indicators</h2>
          <p className="sub-text">{country === "india" ? "India" : "United States"} · Key Economic Metrics</p>
        </div>
        <select className="flux-select" value={country} onChange={(e) => setCountry(e.target.value)}>
          <option value="india">India 🇮🇳</option>
          <option value="us">United States 🇺🇸</option>
        </select>
      </div>

      <div className="macro-grid">
        {Object.entries(data).map(([key, item]) => (
          <div key={key} className="macro-card">
            <div className="macro-card-header">
              <span className="macro-label">{indicatorLabels[key] || key}</span>
              <span className="macro-trend" style={{ color: trendColors[item.trend] }}>
                {trendIcons[item.trend]}
              </span>
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

    </div>
  );
}

export default MacroIndicators;
