// =============================================
//  API SERVICE STUBS
// =============================================
//  These return mock data but are structured for
//  future API integration (Alpha Vantage, FRED,
//  Twelve Data, AWS Lambda, AWS Bedrock)
// =============================================

import { companyProfile, incomeStatement, balanceSheet, cashFlowStatement, stockPriceHistory, performanceMetrics } from "../data/companyData";
import { fxRates, macroIndicators, interestRateData } from "../data/marketData";
import { accountsReceivable, accountsPayable, inventoryData, debtFinancing, cashLiquidity } from "../data/internalData";
import { stressScenarios, aiExplanations } from "../data/stressScenarios";
import { runStressScenario, calculateFinancialRatios, calculateHealthScore, calculateRiskAlerts, generateCashFlowForecast } from "../engine/financialEngine";


// Simulate API delay
const delay = (ms = 300) => new Promise(res => setTimeout(res, ms));


// ---- Company Profile ----
export async function fetchCompanyProfile(ticker = "RELIANCE") {
  await delay();
  return companyProfile;
}


// ---- Financial Statements ----
export async function fetchFinancialStatements(ticker, year) {
  await delay();
  return { incomeStatement, balanceSheet, cashFlowStatement };
}


// ---- FX Rates ----
export async function fetchFXRates(baseCurrency = "INR") {
  await delay();
  return fxRates;
}


// ---- Equity / Market Data ----
export async function fetchEquityData(ticker) {
  await delay();
  return {
    ...companyProfile,
    history: stockPriceHistory,
    performance: performanceMetrics,
  };
}


// ---- Macroeconomic Indicators ----
export async function fetchMacroIndicators(country = "india") {
  await delay();
  return macroIndicators[country] || macroIndicators.india;
}


// ---- Interest Rate / Debt Environment ----
export async function fetchInterestRateData() {
  await delay();
  return interestRateData;
}


// ---- Internal Data ----
export async function fetchAccountsReceivable() {
  await delay();
  return accountsReceivable;
}

export async function fetchAccountsPayable() {
  await delay();
  return accountsPayable;
}

export async function fetchInventoryData() {
  await delay();
  return inventoryData;
}

export async function fetchDebtFinancing() {
  await delay();
  return debtFinancing;
}

export async function fetchCashLiquidity() {
  await delay();
  return cashLiquidity;
}


// ---- Stress Test Engine (calls AWS Lambda in prod) ----
export async function runStressTest(scenarioId) {
  await delay(500);
  const allScenarios = [
    ...stressScenarios.business,
    ...stressScenarios.financial,
    ...stressScenarios.market,
  ];

  const scenario = allScenarios.find(s => s.id === scenarioId);
  if (!scenario) {
    // Check combined
    const combined = stressScenarios.combined.find(s => s.id === scenarioId);
    if (combined) {
      return runStressScenario(incomeStatement, balanceSheet, cashFlowStatement, combined.shocks);
    }
    return null;
  }

  return runStressScenario(incomeStatement, balanceSheet, cashFlowStatement, [{ param: scenario.param, delta: scenario.delta }]);
}


// ---- AI Explanation (calls AWS Bedrock in prod) ----
export async function getAIExplanation(scenarioId) {
  await delay(800);
  return aiExplanations[scenarioId] || {
    chain: "Scenario applied → Financial metrics recalculated",
    explanation: "The selected stress scenario impacts the company's financial position. The data engine has recalculated all metrics based on the adjusted parameters. Review the detailed comparison table for specific impacts on each financial metric.",
    severity: "watch",
    recommendations: [
      "Review the stressed metrics in detail",
      "Compare with historical stress periods",
      "Discuss with treasury team for mitigation strategies",
    ],
  };
}


// ---- Aggregated Dashboard Data ----
export async function fetchDashboardData() {
  await delay();

  const ratios = calculateFinancialRatios(incomeStatement, balanceSheet, cashFlowStatement);
  const healthScore = calculateHealthScore(ratios);
  const alerts = calculateRiskAlerts(ratios, cashLiquidity, debtFinancing, fxRates);
  const forecast = generateCashFlowForecast(cashLiquidity.totalCash, 12500, 10800, 6);

  return {
    healthScore,
    ratios,
    alerts,
    forecast,
    cashLiquidity,
    companyProfile,
    topRisk: alerts.find(a => a.severity === "critical" || a.severity === "warning"),
    actionItems: [
      { text: "₹8,400 Cr receivables overdue — escalate collections", priority: "high" },
      { text: "USD exposure at ₹3,200 Cr — review hedging strategy", priority: "high" },
      { text: "₹5,500 Cr debt maturing in 12 months — begin refinancing", priority: "medium" },
    ],
  };
}
