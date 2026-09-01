import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchDashboardData } from "../services/api";
// import CompanySearch from "./CompanySearchPage";
import { formatCr } from "../engine/financialEngine";

function ExecutiveDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDashboardData().then(setData);
  }, []);

  if (!data) return <div className="text-center p-[60px] text-text-dim text-[14px]">Loading dashboard...</div>;

  const { healthScore, ratios, alerts, forecast, cashLiquidity: cash, companyProfile: company, topRisk, actionItems } = data;

  const scoreColor = healthScore >= 70 ? "var(--color-positive)" : healthScore >= 50 ? "var(--color-warning)" : "var(--color-negative)";
  const scoreLabel = healthScore >= 70 ? "Healthy" : healthScore >= 50 ? "Moderate" : "At Risk";

  return (
    <div className="w-full">

      {/* COMPANY HEADER */}
      <div className="page-heading">
        <div>
          <p className="small-label">EXECUTIVE OVERVIEW</p>
          <h2>{company.name}</h2>
          <p className="sub-text">{company.ticker} · {company.exchange} · {company.sector}</p>
        </div>
        <div className="flex items-center gap-[14px]">
          <span className="bg-[rgba(67,213,151,0.12)] text-positive px-[12px] py-[5px] rounded-[20px] text-[10px] font-bold tracking-[1px] animate-pulse-slow">● LIVE</span>
          <span className="text-text-dim text-[12px]">{new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
        </div>
      </div>


      {/* 5 KEY QUESTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-[14px] mb-[24px]">

        {/* Q1: Financial Health */}
        <div className="bg-bg-card border border-border-primary rounded-lg p-[22px_20px] transition-normal animate-[fadeInUp_0.5s_ease_both] hover:border-accent-purple-light hover:shadow-glow hover:-translate-y-[2px]" style={{ animationDelay: '0s' }}>
          <span className="block text-[9px] text-text-label tracking-[1.2px] font-semibold mb-[8px]">FINANCIAL HEALTH</span>
          <h3 className="text-[14px] font-semibold font-heading mb-[16px] text-text-secondary">How healthy are we?</h3>
          <div className="relative w-[100px] h-[100px] mx-auto mb-[10px]">
            <svg viewBox="0 0 120 120" className="w-full h-full">
              <circle cx="60" cy="60" r="52" fill="none" stroke="#e2e5ea" strokeWidth="8" />
              <circle cx="60" cy="60" r="52" fill="none" stroke={scoreColor} strokeWidth="8"
                strokeDasharray={`${healthScore * 3.27} 327`}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
                style={{ transition: "stroke-dasharray 1s ease" }}
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center" style={{ color: scoreColor }}>
              <strong className="block text-[28px] font-bold font-heading">{healthScore}</strong>
              <small className="text-[12px] text-text-dim">/100</small>
            </div>
          </div>
          <span className="block text-center text-[11px] font-semibold tracking-[0.5px]" style={{ color: scoreColor }}>{scoreLabel}</span>
        </div>


        {/* Q2: Liquidity */}
        <div className="bg-bg-card border border-border-primary rounded-lg p-[22px_20px] transition-normal animate-[fadeInUp_0.5s_ease_both] hover:border-accent-purple-light hover:shadow-glow hover:-translate-y-[2px]" style={{ animationDelay: '0.05s' }}>
          <span className="block text-[9px] text-text-label tracking-[1.2px] font-semibold mb-[8px]">LIQUIDITY POSITION</span>
          <h3 className="text-[14px] font-semibold font-heading mb-[16px] text-text-secondary">How much liquidity?</h3>
          <div className="text-[28px] font-bold font-heading text-positive mb-[16px]">{formatCr(cash.totalCash)}</div>
          <div className="flex flex-col gap-[8px]">
            <div className="flex justify-between items-center"><span className="text-[11px] text-text-dim">Available</span><strong className="text-[13px] text-text-secondary">{formatCr(cash.availableLiquidity)}</strong></div>
            <div className="flex justify-between items-center"><span className="text-[11px] text-text-dim">Coverage</span><strong className="text-[13px] text-text-secondary">{cash.liquidityCoverage}<span className="text-text-dim font-normal ml-[2px]">×</span></strong></div>
            <div className="flex justify-between items-center"><span className="text-[11px] text-text-dim">Runway</span><strong className="text-[13px] text-text-secondary">{cash.cashRunway} <span className="text-text-dim font-normal">mo</span></strong></div>
          </div>
        </div>


        {/* Q3: Biggest Risk */}
        <div className="bg-bg-card border border-border-primary rounded-lg p-[22px_20px] transition-normal animate-[fadeInUp_0.5s_ease_both] hover:border-accent-purple-light hover:shadow-glow hover:-translate-y-[2px]" style={{ animationDelay: '0.1s' }}>
          <span className="block text-[9px] text-text-label tracking-[1.2px] font-semibold mb-[8px]">TOP RISK</span>
          <h3 className="text-[14px] font-semibold font-heading mb-[16px] text-text-secondary">Biggest current risk?</h3>
          {topRisk && (
            <>
              <div className="text-[32px] mb-[8px]">{topRisk.icon}</div>
              <div className="text-[14px] font-semibold text-warning mb-[6px]">{topRisk.type}</div>
              <p className="text-[11px] text-text-muted leading-[1.5]">{topRisk.message}</p>
            </>
          )}
        </div>


        {/* Q4: Stress Outlook */}
        <div className="bg-bg-card border border-border-primary rounded-lg p-[22px_20px] transition-normal animate-[fadeInUp_0.5s_ease_both] hover:border-accent-purple-light hover:shadow-glow hover:-translate-y-[2px]" style={{ animationDelay: '0.15s' }}>
          <span className="block text-[9px] text-text-label tracking-[1.2px] font-semibold mb-[8px]">STRESS OUTLOOK</span>
          <h3 className="text-[14px] font-semibold font-heading mb-[16px] text-text-secondary">If conditions worsen?</h3>
          <div className="flex items-start gap-[10px] bg-[rgba(237,116,116,0.06)] border border-[rgba(237,116,116,0.15)] rounded-sm p-[12px] mb-[14px]">
            <span className="text-[20px] shrink-0">⚠️</span>
            <p className="text-[11px] text-text-muted leading-[1.5]">Liquidity falls below threshold in <strong className="text-negative">27 days</strong> under recession scenario</p>
          </div>
          <span className="flux-btn text-white text-[11px] px-[14px] py-[7px] inline-block opacity-60 cursor-default">Stress Test</span>
        </div>


        {/* Q5: Action Items */}
        <div className="bg-bg-card border border-border-primary rounded-lg p-[22px_20px] transition-normal animate-[fadeInUp_0.5s_ease_both] hover:border-accent-purple-light hover:shadow-glow hover:-translate-y-[2px]" style={{ animationDelay: '0.2s' }}>
          <span className="block text-[9px] text-text-label tracking-[1.2px] font-semibold mb-[8px]">MANAGEMENT ACTION</span>
          <h3 className="text-[14px] font-semibold font-heading mb-[16px] text-text-secondary">What to investigate?</h3>
          <ul className="list-none">
            {actionItems.map((item, i) => (
              <li key={i} className="text-[11px] text-text-muted py-[8px] border-b border-border-subtle flex items-start gap-[8px] leading-[1.5] last:border-none">
                <span className={`w-[6px] h-[6px] rounded-full shrink-0 mt-[5px] ${item.priority === 'high' ? 'bg-negative' : 'bg-warning'}`}></span>
                {item.text}
              </li>
            ))}
          </ul>
        </div>

      </div>
 

      {/* RATIO HIGHLIGHTS */}
      <div className="bg-bg-card border border-border-primary rounded-lg p-[18px_22px] mb-[24px] animate-[fadeIn_0.5s_ease_both] delay-300">
        <div className="text-[9px] text-text-label tracking-[1.5px] font-semibold mb-[14px]">KEY RATIOS</div>
        <div className="flex flex-wrap xl:flex-nowrap gap-[12px] xl:gap-0">
          <RatioChip label="Current Ratio" value={ratios.liquidity.currentRatio} suffix="×" good={ratios.liquidity.currentRatio >= 1.5} />
          <RatioChip label="Debt/Equity" value={ratios.leverage.debtToEquity} suffix="×" good={ratios.leverage.debtToEquity <= 1.0} />
          <RatioChip label="Net Margin" value={ratios.profitability.netMargin} suffix="%" good={ratios.profitability.netMargin >= 10} />
          <RatioChip label="Interest Coverage" value={ratios.leverage.interestCoverage} suffix="×" good={ratios.leverage.interestCoverage >= 4} />
          <RatioChip label="ROE" value={ratios.profitability.roe} suffix="%" good={ratios.profitability.roe >= 15} />
          <RatioChip label="Cash Cycle" value={ratios.workingCapital.ccc} suffix=" days" good={ratios.workingCapital.ccc <= 60} isLast={true} />
        </div>
      </div>

      {/* FULL RISK ALERTS — merged from Risk Alerts page */}
      <div className="mb-[24px] animate-[fadeIn_0.5s_ease_both] delay-400">
        <div className="page-heading" style={{ marginBottom: 0 }}>
          <div>
            <p className="small-label">INTELLIGENCE</p>
            <h2 style={{ fontSize: 18 }}>Risk &amp; Early Warning</h2>
            <p className="sub-text">Automated anomaly detection and alerts</p>
          </div>
        </div>

        <div className="ra-grid">
          <div className="flux-card ra-main">
            <span className="card-label">SYSTEM ALERTS</span>
            <h3 className="card-title">Recent Notifications</h3>

            <div className="ra-list">
              {(alerts || []).map(a => (
                <div key={a.id} className={`ra-item border-${a.severity}`}>
                  <div className="ra-item-header">
                    <strong>{a.type}</strong>
                    <span className={`status-badge ${a.severity}`}>{a.severity}</span>
                  </div>
                  <p>{a.message}</p>
                  <small>{a.date || "Recent"}</small>
                </div>
              ))}
            </div>
          </div>

          <div className="ra-sidebar">
            <div className="flux-card">
              <span className="card-label">RISK SUMMARY</span>
              <div className="ra-summary-item">
                <span>Critical</span>
                <strong className="negative">{(alerts || []).filter(a => a.severity === "critical").length}</strong>
              </div>
              <div className="ra-summary-item">
                <span>Warning</span>
                <strong className="warning">{(alerts || []).filter(a => a.severity === "warning").length}</strong>
              </div>
              <div className="ra-summary-item">
                <span>Watch</span>
                <strong className="watch">{(alerts || []).filter(a => a.severity === "watch").length}</strong>
              </div>
              <div className="ra-summary-item">
                <span>Healthy</span>
                <strong className="positive">{(alerts || []).filter(a => a.severity === "healthy").length}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* QUICK LINKS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px] animate-[fadeIn_0.5s_ease_both] delay-500">
        <Link to="/stress-test" className="flex items-center gap-[12px] p-[18px_20px] cursor-pointer text-[13px] font-medium flux-card hover:border-accent-purple-light hover:bg-accent-purple-bg hover:text-accent-purple-light hover:-translate-y-[2px]">
          <span className="text-[18px] w-[36px] h-[36px] flex items-center justify-center bg-accent-purple-bg rounded-sm text-accent-purple-light">⚡</span>
          <span>Stress Test</span>
        </Link>
        <Link to="/ai-insight" className="flex items-center gap-[12px] p-[18px_20px] cursor-pointer text-[13px] font-medium flux-card hover:border-accent-purple-light hover:bg-accent-purple-bg hover:text-accent-purple-light hover:-translate-y-[2px]">
          <span className="text-[18px] w-[36px] h-[36px] flex items-center justify-center bg-accent-purple-bg rounded-sm text-accent-purple-light">✦</span>
          <span>AI Recommendation</span>
        </Link>
      </div>

    </div>
  );
}


function RatioChip({ label, value, suffix, good, isLast }) {
  return (
    <div className={`flex-1 min-w-[calc(50%-8px)] xl:min-w-0 xl:px-[18px] ${!isLast ? 'xl:border-r xl:border-border-primary' : ''} first:xl:pl-0`}>
      <span className="block text-[10px] text-text-dim mb-[6px]">{label}</span>
      <strong className={`text-[18px] font-semibold font-heading ${good ? "positive" : "warning"}`}>
        {value}
        <span className="text-[12px] text-text-dim ml-[2px] font-medium font-body">{suffix}</span>
      </strong>
    </div>
  );
}

export default ExecutiveDashboard;
