import { useState } from "react";

function RiskAlerts() {
  const alerts = [
    { id: 1, type: "Liquidity Risk", severity: "critical", msg: "Cash coverage ratio projected to drop below 1.0x in Oct 2026.", date: "Today" },
    { id: 2, type: "Currency Exposure", severity: "warning", msg: "USD payable obligations increased by 15% amid FX volatility.", date: "Yesterday" },
    { id: 3, type: "Interest Rate Risk", severity: "warning", msg: "Central bank signaled potential 50bps rate hike. 35% floating debt exposed.", date: "Aug 15" },
    { id: 4, type: "Receivables Delay", severity: "watch", msg: "Customer ABC Logistics payments delayed beyond 45 days.", date: "Aug 14" },
    { id: 5, type: "Inventory Build-up", severity: "healthy", msg: "Inventory turnover improved to 4.2x (was 3.8x).", date: "Aug 10" },
  ];

  return (
    <div className="risk-alerts">
      <div className="page-heading">
        <div>
          <p className="small-label">INTELLIGENCE</p>
          <h2>Risk & Early Warning</h2>
          <p className="sub-text">Automated anomaly detection and alerts</p>
        </div>
      </div>

      <div className="ra-grid">
        <div className="flux-card ra-main">
          <span className="card-label">SYSTEM ALERTS</span>
          <h3 className="card-title">Recent Notifications</h3>
          
          <div className="ra-list">
            {alerts.map(a => (
              <div key={a.id} className={`ra-item border-${a.severity}`}>
                <div className="ra-item-header">
                  <strong>{a.type}</strong>
                  <span className={`status-badge ${a.severity}`}>{a.severity}</span>
                </div>
                <p>{a.msg}</p>
                <small>{a.date}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="ra-sidebar">
          <div className="flux-card">
            <span className="card-label">RISK SUMMARY</span>
            <div className="ra-summary-item">
              <span>Critical</span>
              <strong className="negative">1</strong>
            </div>
            <div className="ra-summary-item">
              <span>Warning</span>
              <strong className="warning">2</strong>
            </div>
            <div className="ra-summary-item">
              <span>Watch</span>
              <strong className="watch">1</strong>
            </div>
            <div className="ra-summary-item">
              <span>Healthy</span>
              <strong className="positive">1</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RiskAlerts;
