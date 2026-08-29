// =============================================
//  STRESS TEST SCENARIOS
// =============================================

export const stressScenarios = {

  // BUSINESS SHOCKS
  business: [
    { id: "rev-10",    name: "Revenue −10%",         category: "Business", param: "revenue",     delta: -0.10, icon: "📉" },
    { id: "rev-20",    name: "Revenue −20%",         category: "Business", param: "revenue",     delta: -0.20, icon: "📉" },
    { id: "opcost+10", name: "Operating Costs +10%", category: "Business", param: "opCosts",     delta: +0.10, icon: "💸" },
    { id: "capex+20",  name: "CAPEX +20%",           category: "Business", param: "capex",       delta: +0.20, icon: "🏗️" },
  ],

  // FINANCIAL SHOCKS
  financial: [
    { id: "ir+1",      name: "Interest Rate +1%",            category: "Financial", param: "interestRate", delta: +1.0,  icon: "🏦" },
    { id: "ir+2",      name: "Interest Rate +2%",            category: "Financial", param: "interestRate", delta: +2.0,  icon: "🏦" },
    { id: "delay30",   name: "Customer Payments Delayed 30d", category: "Financial", param: "arDelay",     delta: 30,    icon: "⏳" },
    { id: "accel-pay", name: "Supplier Payments Accelerated", category: "Financial", param: "apAccel",     delta: -15,   icon: "⚡" },
  ],

  // MARKET SHOCKS
  market: [
    { id: "usd+5",     name: "USD/INR +5%",          category: "Market", param: "fxUsdInr",      delta: +0.05, icon: "💱" },
    { id: "usd-5",     name: "USD/INR −5%",          category: "Market", param: "fxUsdInr",      delta: -0.05, icon: "💱" },
    { id: "equity-15", name: "Equity Market −15%",   category: "Market", param: "equityMarket",  delta: -0.15, icon: "📊" },
    { id: "comm+20",   name: "Commodity Price +20%",  category: "Market", param: "commodity",     delta: +0.20, icon: "🛢️" },
  ],

  // COMBINED SCENARIOS
  combined: [
    {
      id: "global-recession",
      name: "Global Recession",
      category: "Combined",
      icon: "🌍",
      description: "Simultaneous revenue decline, interest rate increase, and currency depreciation",
      shocks: [
        { param: "revenue",      delta: -0.15 },
        { param: "interestRate", delta: +1.5 },
        { param: "fxUsdInr",    delta: +0.08 },
        { param: "equityMarket", delta: -0.20 },
        { param: "commodity",    delta: +0.15 },
      ],
    },
    {
      id: "supply-chain-crisis",
      name: "Supply Chain Crisis",
      category: "Combined",
      icon: "🚢",
      description: "Inventory buildup, delayed collections, and commodity price surge",
      shocks: [
        { param: "commodity",    delta: +0.30 },
        { param: "arDelay",      delta: 45 },
        { param: "opCosts",      delta: +0.12 },
        { param: "revenue",      delta: -0.05 },
      ],
    },
    {
      id: "tight-monetary",
      name: "Tight Monetary Policy",
      category: "Combined",
      icon: "🔒",
      description: "Aggressive rate hikes with currency appreciation",
      shocks: [
        { param: "interestRate", delta: +2.5 },
        { param: "fxUsdInr",    delta: -0.03 },
        { param: "revenue",      delta: -0.05 },
      ],
    },
  ],
};


// MOCK AI EXPLANATIONS
export const aiExplanations = {
  "rev-10": {
    chain: "Revenue −10% → EBITDA −₹8.2 Cr → Cash −₹6.4 Cr → Liquidity Coverage 1.18×",
    explanation: "The company's liquidity deteriorates primarily because the 10% revenue decline reduces operating cash generation while fixed debt obligations remain unchanged. The EBITDA contraction of ₹8.2 Cr directly impacts free cash flow, pushing the liquidity coverage ratio from 1.42× to 1.18×. While still above the minimum threshold, this leaves limited buffer for unexpected expenses. Management should focus on accelerating receivable collections and evaluating discretionary spending to preserve cash.",
    severity: "warning",
    recommendations: [
      "Accelerate receivable collections — focus on ₹8.4 Cr overdue invoices",
      "Review and defer non-critical CAPEX projects",
      "Negotiate extended payment terms with top 3 suppliers",
      "Activate available credit lines as a precautionary measure",
    ],
  },
  "rev-20": {
    chain: "Revenue −20% → EBITDA −₹16.8 Cr → Cash −₹14.2 Cr → Liquidity Coverage 0.92×",
    explanation: "A 20% revenue decline represents a severe stress scenario that pushes liquidity coverage below the 1.0× threshold. Operating cash flow becomes insufficient to cover near-term obligations without drawing on credit lines. The interest coverage ratio drops to 2.8× from 4.2×, approaching covenant risk levels. This scenario requires immediate management attention and pre-emptive action.",
    severity: "critical",
    recommendations: [
      "Immediately draw on available credit lines (₹15,000 Cr available)",
      "Implement emergency cost reduction program targeting ₹5,000 Cr savings",
      "Engage with lenders proactively regarding covenant waivers",
      "Suspend dividend payments and share buyback programs",
      "Accelerate asset monetization plans",
    ],
  },
  "ir+2": {
    chain: "Interest Rate +2% → Additional Cost ₹12.1 Cr → Net Income −₹9.4 Cr",
    explanation: "With 35% of debt on floating rates (₹8,050 Cr), a 200 basis point increase adds approximately ₹12.1 Cr to annual interest expense. This directly reduces net income and free cash flow. The interest coverage ratio drops from 4.2× to 3.6×, still comfortable but trending toward caution zone. Fixed-rate debt is unaffected, demonstrating the value of the current 65/35 fixed-floating mix.",
    severity: "warning",
    recommendations: [
      "Consider interest rate swaps to convert floating to fixed on near-term maturities",
      "Prioritize repayment of highest-rate floating instruments",
      "Review debt maturity profile — refinance before rate peaks",
    ],
  },
  "global-recession": {
    chain: "Combined Shocks → Cash −₹28 Cr → Coverage 0.72× → Runway drops to 4.2 months",
    explanation: "The Global Recession scenario simultaneously stresses revenue (-15%), interest rates (+150bps), currency (USD/INR +8%), equity markets (-20%), and commodity prices (+15%). The compounding effect is severe: operating income drops significantly while debt servicing costs rise. Currency depreciation increases the INR value of USD-denominated debt by approximately ₹2,800 Cr. The combined cash impact of ₹28 Cr pushes liquidity coverage well below 1.0×, indicating the company cannot meet obligations from operational cash flow alone.",
    severity: "critical",
    recommendations: [
      "Activate comprehensive crisis management protocol",
      "Draw all available credit lines immediately",
      "Implement across-the-board cost reduction of 15-20%",
      "Hedge all unhedged foreign currency exposures",
      "Engage with board for emergency capital raising options",
      "Communicate proactively with rating agencies and key creditors",
    ],
  },
};
