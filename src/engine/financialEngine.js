// =============================================
//  FINANCIAL CALCULATION ENGINE
// =============================================
//  All values in ₹ Crore unless otherwise noted
// =============================================


/**
 * Calculate all financial ratios from statement data
 */
export function calculateFinancialRatios(income, balance, cashFlow) {
  const fy = 0; // latest year index

  const revenue         = income.data.revenue[fy];
  const grossProfit     = income.data.grossProfit[fy];
  const ebitda          = income.data.ebitda[fy];
  const ebit            = income.data.ebit[fy];
  const netIncome       = income.data.netIncome[fy];
  const interestExpense = income.data.interestExpense[fy];

  const currentAssets      = balance.data.currentAssets[fy];
  const currentLiabilities = balance.data.currentLiabilities[fy];
  const cash               = balance.data.cashAndEquivalents[fy];
  const inventory          = balance.data.inventory[fy];
  const ar                 = balance.data.accountsReceivable[fy];
  const ap                 = balance.data.accountsPayable?.[fy] || 98000;
  const totalDebt          = balance.data.totalDebt[fy];
  const totalEquity        = balance.data.totalEquity[fy];
  const totalAssets        = balance.data.totalAssets[fy];

  const costOfRevenue = income.data.costOfRevenue[fy];

  // LIQUIDITY RATIOS
  const currentRatio = currentAssets / currentLiabilities;
  const quickRatio   = (currentAssets - inventory) / currentLiabilities;
  const cashRatio    = cash / currentLiabilities;

  // LEVERAGE RATIOS
  const debtToEquity    = totalDebt / totalEquity;
  const debtToEbitda    = totalDebt / ebitda;
  const interestCoverage = ebit / interestExpense;

  // PROFITABILITY RATIOS
  const grossMargin  = (grossProfit / revenue) * 100;
  const ebitdaMargin = (ebitda / revenue) * 100;
  const netMargin    = (netIncome / revenue) * 100;
  const roe          = (netIncome / totalEquity) * 100;
  const roa          = (netIncome / totalAssets) * 100;

  // WORKING CAPITAL RATIOS
  const dso = (ar / revenue) * 365;
  const dpo = (ap / costOfRevenue) * 365;
  const inventoryDays = (inventory / costOfRevenue) * 365;
  const ccc = dso + inventoryDays - dpo;

  return {
    liquidity: {
      currentRatio:  round(currentRatio, 2),
      quickRatio:    round(quickRatio, 2),
      cashRatio:     round(cashRatio, 2),
    },
    leverage: {
      debtToEquity:     round(debtToEquity, 2),
      debtToEbitda:     round(debtToEbitda, 2),
      interestCoverage: round(interestCoverage, 2),
    },
    profitability: {
      grossMargin:  round(grossMargin, 1),
      ebitdaMargin: round(ebitdaMargin, 1),
      netMargin:    round(netMargin, 1),
      roe:          round(roe, 1),
      roa:          round(roa, 1),
    },
    workingCapital: {
      dso:           round(dso, 0),
      dpo:           round(dpo, 0),
      inventoryDays: round(inventoryDays, 0),
      ccc:           round(ccc, 0),
    },
  };
}


/**
 * Run a stress scenario on the base financial data
 * Returns stressed metrics vs base case
 */
export function runStressScenario(income, balance, cashFlow, shocks) {
  const fy = 0;

  // Clone base values
  let revenue         = income.data.revenue[fy];
  let opExpenses      = income.data.operatingExpenses[fy];
  let costOfRevenue   = income.data.costOfRevenue[fy];
  let interestExpense = income.data.interestExpense[fy];
  let capex           = Math.abs(cashFlow.data.capitalExpenditure[fy]);
  let cash            = balance.data.cashAndEquivalents[fy];
  let totalDebt       = balance.data.totalDebt[fy];
  let ar              = balance.data.accountsReceivable[fy];

  const floatingDebtPct = 0.35;
  const floatingDebt = totalDebt * floatingDebtPct;

  // Apply each shock
  for (const shock of shocks) {
    switch (shock.param) {
      case "revenue":
        revenue = revenue * (1 + shock.delta);
        break;
      case "opCosts":
        opExpenses = opExpenses * (1 + shock.delta);
        costOfRevenue = costOfRevenue * (1 + shock.delta);
        break;
      case "capex":
        capex = capex * (1 + shock.delta);
        break;
      case "interestRate":
        interestExpense = interestExpense + (floatingDebt * shock.delta / 100);
        break;
      case "arDelay":
        // Delay increases AR, reducing available cash
        const dailyRevenue = revenue / 365;
        const additionalAR = dailyRevenue * shock.delta;
        ar = ar + additionalAR;
        cash = cash - additionalAR;
        break;
      case "apAccel":
        // Accelerated payments reduce cash
        const dailyCost = costOfRevenue / 365;
        cash = cash - Math.abs(dailyCost * shock.delta);
        break;
      case "fxUsdInr":
        // Impact on USD-denominated debt
        const usdDebt = totalDebt * 0.15; // assume 15% USD debt
        const fxImpact = usdDebt * shock.delta;
        totalDebt = totalDebt + fxImpact;
        interestExpense = interestExpense * (1 + shock.delta * 0.15);
        break;
      case "equityMarket":
        // Market decline affects investment portfolio
        const liquidInvestments = 11000;
        cash = cash + (liquidInvestments * shock.delta);
        break;
      case "commodity":
        // Commodity price increase affects COGS
        costOfRevenue = costOfRevenue * (1 + shock.delta * 0.4);
        break;
    }
  }

  // Recalculate stressed metrics
  const stressedGrossProfit = revenue - costOfRevenue;
  const stressedEbitda = revenue - costOfRevenue - opExpenses;
  const stressedEbit = stressedEbitda - income.data.depreciation[fy];
  const stressedNetIncome = stressedEbit - interestExpense - (income.data.taxExpense[fy] * (stressedEbit / income.data.ebit[fy]));
  const stressedFCF = stressedEbitda - capex;
  const stressedInterestCoverage = stressedEbit / interestExpense;
  const stressedLiquidityCoverage = (cash + 15000) / balance.data.currentLiabilities[fy];
  const stressedCashRunway = cash / (opExpenses / 12);

  // Base case values
  const baseEbitda = income.data.ebitda[fy];
  const baseNetIncome = income.data.netIncome[fy];
  const baseFCF = cashFlow.data.freeCashFlow[fy];
  const baseCash = balance.data.cashAndEquivalents[fy];
  const baseInterestCoverage = income.data.ebit[fy] / income.data.interestExpense[fy];
  const baseLiquidityCoverage = 1.42;
  const baseCashRunway = 8.5;

  return {
    base: {
      revenue:           income.data.revenue[fy],
      ebitda:            baseEbitda,
      netIncome:         baseNetIncome,
      freeCashFlow:      baseFCF,
      cash:              baseCash,
      interestExpense:   income.data.interestExpense[fy],
      interestCoverage:  round(baseInterestCoverage, 2),
      liquidityCoverage: baseLiquidityCoverage,
      cashRunway:        baseCashRunway,
      totalDebt:         balance.data.totalDebt[fy],
    },
    stressed: {
      revenue:           round(revenue, 0),
      ebitda:            round(stressedEbitda, 0),
      netIncome:         round(stressedNetIncome, 0),
      freeCashFlow:      round(stressedFCF, 0),
      cash:              round(cash, 0),
      interestExpense:   round(interestExpense, 0),
      interestCoverage:  round(stressedInterestCoverage, 2),
      liquidityCoverage: round(stressedLiquidityCoverage, 2),
      cashRunway:        round(stressedCashRunway, 1),
      totalDebt:         round(totalDebt, 0),
    },
    delta: {
      revenue:           round(revenue - income.data.revenue[fy], 0),
      ebitda:            round(stressedEbitda - baseEbitda, 0),
      netIncome:         round(stressedNetIncome - baseNetIncome, 0),
      freeCashFlow:      round(stressedFCF - baseFCF, 0),
      cash:              round(cash - baseCash, 0),
      interestExpense:   round(interestExpense - income.data.interestExpense[fy], 0),
    },
  };
}


/**
 * Calculate health score (0-100)
 */
export function calculateHealthScore(ratios) {
  let score = 0;

  // Liquidity (25 pts)
  if (ratios.liquidity.currentRatio >= 2.0) score += 25;
  else if (ratios.liquidity.currentRatio >= 1.5) score += 20;
  else if (ratios.liquidity.currentRatio >= 1.0) score += 12;
  else score += 5;

  // Leverage (25 pts)
  if (ratios.leverage.debtToEquity <= 0.5) score += 25;
  else if (ratios.leverage.debtToEquity <= 1.0) score += 20;
  else if (ratios.leverage.debtToEquity <= 1.5) score += 12;
  else score += 5;

  // Profitability (25 pts)
  if (ratios.profitability.netMargin >= 15) score += 25;
  else if (ratios.profitability.netMargin >= 10) score += 20;
  else if (ratios.profitability.netMargin >= 5) score += 12;
  else score += 5;

  // Working Capital Efficiency (25 pts)
  if (ratios.workingCapital.ccc <= 30) score += 25;
  else if (ratios.workingCapital.ccc <= 60) score += 20;
  else if (ratios.workingCapital.ccc <= 90) score += 12;
  else score += 5;

  return score;
}


/**
 * Calculate risk alerts from financial data
 */
export function calculateRiskAlerts(ratios, cashData, debtData, fxData) {
  const alerts = [];

  // Liquidity Risk
  if (cashData.liquidityCoverage < 1.0) {
    alerts.push({
      id: "liq-critical",
      type: "Liquidity Risk",
      severity: "critical",
      icon: "🔴",
      message: `Liquidity coverage at ${cashData.liquidityCoverage}× — below minimum 1.0× threshold`,
      detail: `Projected cash balance falls below minimum threshold in ${Math.round(cashData.cashRunway * 30)} days.`,
      action: "Activate credit lines and review near-term obligations",
    });
  } else if (cashData.liquidityCoverage < 1.5) {
    alerts.push({
      id: "liq-warning",
      type: "Liquidity Risk",
      severity: "warning",
      icon: "🟠",
      message: `Liquidity coverage at ${cashData.liquidityCoverage}× — approaching caution zone`,
      detail: `Cash runway of ${cashData.cashRunway} months may be insufficient under stress.`,
      action: "Monitor daily cash positions and prepare contingency plans",
    });
  }

  // FX Risk
  const usdExposure = debtData.filter(d => d.currency === "USD")
    .reduce((sum, d) => sum + d.amount, 0);
  if (usdExposure > 3000) {
    alerts.push({
      id: "fx-warning",
      type: "FX Risk",
      severity: "warning",
      icon: "🟠",
      message: `USD liability of ₹${usdExposure.toLocaleString()} Cr exceeds defined exposure limit`,
      detail: "A 5% USD/INR depreciation would add ₹" + Math.round(usdExposure * 0.05).toLocaleString() + " Cr to obligations.",
      action: "Review FX hedging strategy and consider forward contracts",
    });
  }

  // Interest Coverage
  if (ratios.leverage.interestCoverage < 2) {
    alerts.push({
      id: "ic-critical",
      type: "Interest Coverage",
      severity: "critical",
      icon: "🔴",
      message: `Interest coverage ratio at ${ratios.leverage.interestCoverage}× — below safe threshold of 2×`,
      detail: "Debt servicing capability is critically low.",
      action: "Prioritize debt reduction and explore refinancing options",
    });
  } else if (ratios.leverage.interestCoverage < 4) {
    alerts.push({
      id: "ic-watch",
      type: "Interest Coverage",
      severity: "watch",
      icon: "🟡",
      message: `Interest coverage ratio at ${ratios.leverage.interestCoverage}× — monitor closely`,
      detail: "Stress scenarios could push coverage below safe levels.",
      action: "Run stress tests on interest rate sensitivity",
    });
  }

  // AR Aging Risk
  alerts.push({
    id: "ar-warning",
    type: "Receivables Risk",
    severity: "warning",
    icon: "🟠",
    message: "₹8,400 Cr in receivables with ₹4,700 Cr overdue",
    detail: "Overdue receivables represent 56% of total outstanding — cash flow impact is significant.",
    action: "Escalate collections on overdue invoices, review credit terms",
  });

  // Debt Maturity
  alerts.push({
    id: "debt-watch",
    type: "Debt Maturity",
    severity: "watch",
    icon: "🟡",
    message: "₹5,500 Cr debt maturing within 12 months",
    detail: "Working Capital facility (₹2,800 Cr) and NCD Series I (₹3,500 Cr) due for refinancing.",
    action: "Begin refinancing discussions with lenders",
  });

  // Healthy indicators
  if (ratios.profitability.netMargin > 10) {
    alerts.push({
      id: "profit-healthy",
      type: "Profitability",
      severity: "healthy",
      icon: "🟢",
      message: `Net margin at ${ratios.profitability.netMargin}% — strong profitability`,
      detail: "Margins are healthy and trending positively year-over-year.",
      action: "Continue current strategy",
    });
  }

  return alerts;
}


/**
 * Generate cash flow forecast (monthly projection)
 */
export function generateCashFlowForecast(baseCash, monthlyInflows, monthlyOutflows, months = 6) {
  const forecast = [];
  let runningCash = baseCash;

  for (let i = 0; i < months; i++) {
    const month = getMonthLabel(i);
    const inflow = monthlyInflows * (1 + (Math.random() - 0.5) * 0.1);
    const outflow = monthlyOutflows * (1 + (Math.random() - 0.5) * 0.08);
    const receivables = monthlyInflows * 0.3 * (1 + (Math.random() - 0.5) * 0.2);
    const payables = monthlyOutflows * 0.25 * (1 + (Math.random() - 0.5) * 0.15);
    const debtPayment = i % 3 === 0 ? 2500 : 800;

    const netFlow = inflow - outflow - debtPayment + receivables - payables;
    runningCash = runningCash + netFlow;

    forecast.push({
      month,
      inflow: round(inflow, 0),
      outflow: round(outflow, 0),
      receivables: round(receivables, 0),
      payables: round(payables, 0),
      debtPayment: round(debtPayment, 0),
      netFlow: round(netFlow, 0),
      cashPosition: round(runningCash, 0),
      warning: runningCash < 25000,
    });
  }

  return forecast;
}


// =============================================
//  HELPERS
// =============================================

function round(value, decimals) {
  return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
}

function getMonthLabel(offset) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = new Date();
  const futureMonth = new Date(now.getFullYear(), now.getMonth() + offset + 1, 1);
  return months[futureMonth.getMonth()] + "'" + String(futureMonth.getFullYear()).slice(-2);
}


/**
 * Format number in Indian Cr notation
 */
export function formatCr(value) {
  if (Math.abs(value) >= 100000) {
    return "₹" + (value / 100000).toFixed(1) + "L Cr";
  }
  return "₹" + value.toLocaleString("en-IN") + " Cr";
}

export function formatPct(value) {
  const sign = value >= 0 ? "+" : "";
  return sign + value.toFixed(1) + "%";
}
