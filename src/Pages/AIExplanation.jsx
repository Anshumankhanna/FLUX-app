import { useState } from "react";

function AIExplanation() {
  return (
    <div className="ai-insight">
      <div className="page-heading">
        <div>
          <p className="small-label">INTELLIGENCE</p>
          <h2>AI Financial Insights</h2>
          <p className="sub-text">AWS Bedrock-powered generative insights</p>
        </div>
      </div>

      <div className="flux-card ai-chat-card">
        <div className="ai-header">
          <span className="ai-icon">✦</span>
          <h3>Flux AI Co-Pilot</h3>
        </div>

        <div className="ai-content">
          <div className="ai-message system">
            <p><strong>CFO Summary for Q3</strong></p>
            <p>Based on the latest data, Reliance's liquidity is robust (Current Ratio: 2.1x), but operating margins are feeling pressure from an 8% YoY increase in SG&A. The +2% interest rate shock scenario indicates manageable risk due to a strong fixed-rate debt profile (75%), adding only ₹156 Cr to annual interest expenses.</p>
            <p><em>Recommendation:</em> Consider accelerating receivables collection to offset rising raw material costs.</p>
          </div>

          <div className="ai-message user">
            <p>How does the recent USD appreciation affect our Accounts Payable?</p>
          </div>

          <div className="ai-message system">
            <p><strong>FX Exposure Analysis</strong></p>
            <p>You currently have ₹142,500 Cr equivalent in USD payables. A 5% appreciation in USD/INR will increase our INR payout obligations by ~₹7,125 Cr.</p>
            <p>Since we only have ~₹10,500 Cr in USD receivables naturally hedging this, we have a net unhedged exposure. <em>Consider entering forward contracts for the remaining balance.</em></p>
          </div>
        </div>

        <div className="ai-input-box">
          <input type="text" placeholder="Ask AI about your financial data..." />
          <button className="flux-btn">Ask</button>
        </div>
      </div>
    </div>
  );
}

export default AIExplanation;
