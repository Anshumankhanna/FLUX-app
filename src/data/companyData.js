// =============================================
//  MOCK COMPANY DATA
// =============================================

export const companyProfile = {
  name: "Reliance Industries Limited",
  ticker: "RELIANCE",
  exchange: "NSE",
  sector: "Energy & Petrochemicals",
  industry: "Conglomerate",
  marketCap: "₹19.8L Cr",
  marketCapValue: 1980000,
  country: "India",
  fiscalYear: "FY2025",
  reportingCurrency: "INR",
  stockPrice: 2845.60,
  stockPriceChange: +2.45,
  previousClose: 2777.56,
  sharesOutstanding: "6.77B",
  beta: 0.82,
  volatility: 22.14,
  tradingVolume: "12.4M",
  founded: "1966",
  ceo: "Mukesh Ambani",
  headquarters: "Mumbai, Maharashtra",
  employees: "236,000+",
  website: "www.ril.com",
};


// =============================================
//  INCOME STATEMENT
// =============================================

export const incomeStatement = {
  years: ["FY2025", "FY2024", "FY2023"],
  data: {
    revenue:           [902000, 832000, 780000],
    costOfRevenue:     [612000, 572000, 541000],
    grossProfit:       [290000, 260000, 239000],
    operatingExpenses: [148000, 138000, 131000],
    ebitda:            [184000, 168000, 152000],
    depreciation:      [42000, 38000, 35000],
    ebit:              [142000, 130000, 117000],
    interestExpense:   [11000, 11300, 12100],
    otherIncome:       [8500, 7200, 6800],
    profitBeforeTax:   [139500, 125900, 111700],
    taxExpense:        [35000, 31000, 28000],
    netIncome:         [104500, 94900, 83700],
  },
};


// =============================================
//  BALANCE SHEET
// =============================================

export const balanceSheet = {
  years: ["FY2025", "FY2024", "FY2023"],
  data: {
    cashAndEquivalents: [42000, 38000, 35000],
    accountsReceivable: [84000, 78000, 72000],
    inventory:          [68000, 62000, 58000],
    otherCurrentAssets: [25000, 22000, 20000],
    currentAssets:      [219000, 200000, 185000],
    ppe:                [520000, 480000, 445000],
    intangibles:        [95000, 88000, 82000],
    otherNonCurrent:    [120000, 110000, 102000],
    totalAssets:        [954000, 878000, 814000],
    accountsPayable:    [98000, 90000, 84000],
    shortTermDebt:      [45000, 42000, 40000],
    otherCurrentLiab:   [38000, 35000, 32000],
    currentLiabilities: [181000, 167000, 156000],
    longTermDebt:       [185000, 195000, 210000],
    otherNonCurrentLiab:[62000, 58000, 55000],
    totalLiabilities:   [428000, 420000, 421000],
    totalEquity:        [526000, 458000, 393000],
    totalDebt:          [230000, 237000, 250000],
  },
};


// =============================================
//  CASH FLOW
// =============================================

export const cashFlowStatement = {
  years: ["FY2025", "FY2024", "FY2023"],
  data: {
    operatingCashFlow: [152000, 138000, 125000],
    capitalExpenditure: [-85000, -78000, -72000],
    freeCashFlow:       [67000, 60000, 53000],
    investingCashFlow:  [-92000, -85000, -78000],
    financingCashFlow:  [-58000, -50000, -45000],
    dividendsPaid:      [-18000, -16000, -14000],
    debtRepayment:      [-25000, -22000, -20000],
    netCashChange:      [4000, 3000, 2000],
  },
};


// =============================================
//  STOCK PRICE HISTORY (monthly, 12 months)
// =============================================

export const stockPriceHistory = [
  { month: "Sep'24", price: 2410 },
  { month: "Oct'24", price: 2380 },
  { month: "Nov'24", price: 2520 },
  { month: "Dec'24", price: 2490 },
  { month: "Jan'25", price: 2580 },
  { month: "Feb'25", price: 2545 },
  { month: "Mar'25", price: 2620 },
  { month: "Apr'25", price: 2710 },
  { month: "May'25", price: 2685 },
  { month: "Jun'25", price: 2750 },
  { month: "Jul'25", price: 2790 },
  { month: "Aug'25", price: 2845 },
];


// =============================================
//  PERFORMANCE METRICS
// =============================================

export const performanceMetrics = {
  dailyChange: +2.45,
  oneMonth: +4.82,
  threeMonth: +8.36,
  oneYear: +18.05,
  ytd: +14.22,
};


// =============================================
//  COMPANIES DICTIONARY FOR AUTO-SEARCH
// =============================================

export const companiesData = {
  RELIANCE: {
    companyProfile,
    incomeStatement,
    balanceSheet,
    cashFlowStatement,
    stockPriceHistory,
    performanceMetrics,
  },
  TATAMOTORS: {
    companyProfile: {
      name: "Tata Motors Limited",
      ticker: "TATAMOTORS",
      exchange: "NSE",
      sector: "Consumer Cyclical",
      industry: "Auto Manufacturers",
      marketCap: "₹3.1L Cr",
      marketCapValue: 310000,
      country: "India",
      fiscalYear: "FY2025",
      reportingCurrency: "INR",
      stockPrice: 945.50,
      stockPriceChange: +1.85,
      previousClose: 928.32,
      sharesOutstanding: "3.32B",
      beta: 1.15,
      volatility: 28.32,
      tradingVolume: "8.2M",
      founded: "1945",
      ceo: "Guenter Butschek",
      headquarters: "Mumbai, Maharashtra",
      employees: "75,000+",
      website: "www.tatamotors.com",
    },
    incomeStatement: {
      years: ["FY2025", "FY2024", "FY2023"],
      data: {
        revenue:           [380000, 345000, 310000],
        costOfRevenue:     [295000, 270000, 245000],
        grossProfit:       [85000, 75000, 65000],
        operatingExpenses: [53000, 48000, 42000],
        ebitda:            [48000, 42000, 37000],
        depreciation:      [16000, 15000, 14000],
        ebit:              [32000, 27000, 23000],
        interestExpense:   [6500, 6800, 7200],
        otherIncome:       [2800, 2500, 2100],
        profitBeforeTax:   [28300, 22700, 17900],
        taxExpense:        [7300, 4700, 2900],
        netIncome:         [21000, 18000, 15000],
      }
    },
    balanceSheet: {
      years: ["FY2025", "FY2024", "FY2023"],
      data: {
        cashAndEquivalents: [22000, 19000, 17000],
        accountsReceivable: [42000, 39000, 36000],
        inventory:          [52000, 48000, 45000],
        otherCurrentAssets: [12000, 11000, 10000],
        currentAssets:      [128000, 117000, 108000],
        ppe:                [165000, 155000, 145000],
        intangibles:        [15000, 13000, 11000],
        otherNonCurrent:    [32000, 30000, 26000],
        totalAssets:        [340000, 315000, 290000],
        accountsPayable:    [64000, 59000, 55000],
        shortTermDebt:      [25000, 28000, 30000],
        otherCurrentLiab:   [16000, 15000, 13000],
        currentLiabilities: [105000, 102000, 98000],
        longTermDebt:       [95000, 105000, 110000],
        otherNonCurrentLiab:[20000, 18000, 17000],
        totalLiabilities:   [220000, 225000, 225000],
        totalEquity:        [120000, 90000, 65000],
        totalDebt:          [120000, 133000, 140000],
      }
    },
    cashFlowStatement: {
      years: ["FY2025", "FY2024", "FY2023"],
      data: {
        operatingCashFlow: [39000, 34000, 30000],
        capitalExpenditure: [-24000, -22000, -20000],
        freeCashFlow:       [15000, 12000, 10000],
        investingCashFlow:  [-26000, -24000, -21000],
        financingCashFlow:  [-10000, -7000, -7000],
        dividendsPaid:      [-2500, -2000, -1500],
        debtRepayment:      [-8000, -5000, -6000],
        netCashChange:      [3000, 3000, 2000],
      }
    },
    stockPriceHistory: [
      { month: "Sep'24", price: 810 },
      { month: "Oct'24", price: 830 },
      { month: "Nov'24", price: 820 },
      { month: "Dec'24", price: 860 },
      { month: "Jan'25", price: 890 },
      { month: "Feb'25", price: 875 },
      { month: "Mar'25", price: 910 },
      { month: "Apr'25", price: 920 },
      { month: "May'25", price: 905 },
      { month: "Jun'25", price: 930 },
      { month: "Jul'25", price: 935 },
      { month: "Aug'25", price: 945.50 },
    ],
    performanceMetrics: {
      dailyChange: +1.85,
      oneMonth: +2.15,
      threeMonth: +4.42,
      oneYear: +22.80,
      ytd: +16.30,
    }
  },
  INFY: {
    companyProfile: {
      name: "Infosys Limited",
      ticker: "INFY",
      exchange: "NSE",
      sector: "Technology",
      industry: "IT Consulting & Software",
      marketCap: "₹6.3L Cr",
      marketCapValue: 630000,
      country: "India",
      fiscalYear: "FY2025",
      reportingCurrency: "INR",
      stockPrice: 1520.40,
      stockPriceChange: -0.65,
      previousClose: 1530.35,
      sharesOutstanding: "4.15B",
      beta: 0.95,
      volatility: 19.45,
      tradingVolume: "4.8M",
      founded: "1981",
      ceo: "Salil Parekh",
      headquarters: "Bengaluru, Karnataka",
      employees: "317,000+",
      website: "www.infosys.com",
    },
    incomeStatement: {
      years: ["FY2025", "FY2024", "FY2023"],
      data: {
        revenue:           [162000, 153000, 140000],
        costOfRevenue:     [105000, 99000, 91000],
        grossProfit:       [57000, 54000, 49000],
        operatingExpenses: [19000, 18500, 18000],
        ebitda:            [44000, 41000, 37000],
        depreciation:      [6000, 6000, 6000],
        ebit:              [38000, 35000, 31000],
        interestExpense:   [1200, 1000, 800],
        otherIncome:       [3200, 2800, 2400],
        profitBeforeTax:   [40000, 36800, 32600],
        taxExpense:        [13000, 11800, 10600],
        netIncome:         [27000, 25000, 22000],
      }
    },
    balanceSheet: {
      years: ["FY2025", "FY2024", "FY2023"],
      data: {
        cashAndEquivalents: [18000, 16000, 14000],
        accountsReceivable: [31000, 29000, 27000],
        inventory:          [1200, 1100, 1000],
        otherCurrentAssets: [9800, 8900, 8000],
        currentAssets:      [60000, 55000, 50000],
        ppe:                [38000, 36000, 34000],
        intangibles:        [22000, 21000, 19000],
        otherNonCurrent:    [22000, 20000, 17000],
        totalAssets:        [142000, 132000, 120000],
        accountsPayable:    [18000, 17000, 16000],
        shortTermDebt:      [1200, 1000, 800],
        otherCurrentLiab:   [6800, 6000, 5200],
        currentLiabilities: [26000, 24000, 22000],
        longTermDebt:       [2400, 2000, 1800],
        otherNonCurrentLiab:[1600, 4000, 4200],
        totalLiabilities:   [30000, 30000, 28000],
        totalEquity:        [112000, 102000, 92000],
        totalDebt:          [3600, 3000, 2600],
      }
    },
    cashFlowStatement: {
      years: ["FY2025", "FY2024", "FY2023"],
      data: {
        operatingCashFlow: [35000, 32000, 28000],
        capitalExpenditure: [-8000, -7500, -7000],
        freeCashFlow:       [27000, 24500, 21000],
        investingCashFlow:  [-11000, -10000, -9000],
        financingCashFlow:  [-21000, -19000, -17000],
        dividendsPaid:      [-14000, -13000, -11500],
        debtRepayment:      [-1200, -1000, -800],
        netCashChange:      [3000, 3000, 2000],
      }
    },
    stockPriceHistory: [
      { month: "Sep'24", price: 1440 },
      { month: "Oct'24", price: 1410 },
      { month: "Nov'24", price: 1460 },
      { month: "Dec'24", price: 1485 },
      { month: "Jan'25", price: 1530 },
      { month: "Feb'25", price: 1515 },
      { month: "Mar'25", price: 1540 },
      { month: "Apr'25", price: 1555 },
      { month: "May'25", price: 1535 },
      { month: "Jun'25", price: 1565 },
      { month: "Jul'25", price: 1545 },
      { month: "Aug'25", price: 1520.40 },
    ],
    performanceMetrics: {
      dailyChange: -0.65,
      oneMonth: +1.10,
      threeMonth: +3.25,
      oneYear: +12.40,
      ytd: +8.50,
    }
  },
  HDFCBANK: {
    companyProfile: {
      name: "HDFC Bank Limited",
      ticker: "HDFCBANK",
      exchange: "NSE",
      sector: "Financial Services",
      industry: "Private Bank",
      marketCap: "₹12.4L Cr",
      marketCapValue: 1240000,
      country: "India",
      fiscalYear: "FY2025",
      reportingCurrency: "INR",
      stockPrice: 1650.00,
      stockPriceChange: +0.42,
      previousClose: 1643.10,
      sharesOutstanding: "7.52B",
      beta: 0.98,
      volatility: 18.25,
      tradingVolume: "14.2M",
      founded: "1994",
      ceo: "Sashidhar Jagdishan",
      headquarters: "Mumbai, Maharashtra",
      employees: "173,000+",
      website: "www.hdfcbank.com",
    },
    incomeStatement: {
      years: ["FY2025", "FY2024", "FY2023"],
      data: {
        revenue:           [205000, 185000, 165000],
        costOfRevenue:     [75000, 68000, 62000],
        grossProfit:       [130000, 117000, 103000],
        operatingExpenses: [32000, 29000, 26000],
        ebitda:            [98000, 88000, 77000],
        depreciation:      [10000, 9000, 8000],
        ebit:              [88000, 79000, 69000],
        interestExpense:   [3500, 3200, 2800],
        otherIncome:       [12000, 10500, 9200],
        profitBeforeTax:   [96500, 86300, 75400],
        taxExpense:        [32500, 28300, 24400],
        netIncome:         [64000, 58000, 51000],
      }
    },
    balanceSheet: {
      years: ["FY2025", "FY2024", "FY2023"],
      data: {
        cashAndEquivalents: [92000, 82000, 74000],
        accountsReceivable: [154000, 138000, 122000],
        inventory:          [0, 0, 0],
        otherCurrentAssets: [74000, 60000, 54000],
        currentAssets:      [320000, 280000, 250000],
        ppe:                [280000, 260000, 240000],
        intangibles:        [114000, 110000, 98000],
        otherNonCurrent:    [1830000, 1580000, 1392000],
        totalAssets:        [2540000, 2230000, 1980000],
        accountsPayable:    [120000, 110000, 95000],
        shortTermDebt:      [120000, 110000, 95000],
        otherCurrentLiab:   [80000, 70000, 65000],
        currentLiabilities: [320000, 290000, 255000],
        longTermDebt:       [380000, 350000, 310000],
        otherNonCurrentLiab:[1520000, 1310000, 1175000],
        totalLiabilities:   [2220000, 1950000, 1740000],
        totalEquity:        [320000, 280000, 240000],
        totalDebt:          [500000, 460000, 405000],
      }
    },
    cashFlowStatement: {
      years: ["FY2025", "FY2024", "FY2023"],
      data: {
        operatingCashFlow: [88000, 79000, 70000],
        capitalExpenditure: [-14000, -13000, -11000],
        freeCashFlow:       [74000, 66000, 59000],
        investingCashFlow:  [-32000, -29000, -25000],
        financingCashFlow:  [-46000, -42000, -38000],
        dividendsPaid:      [-12000, -10000, -9000],
        debtRepayment:      [-18000, -16000, -14000],
        netCashChange:      [10000, 8000, 7000],
      }
    },
    stockPriceHistory: [
      { month: "Sep'24", price: 1510 },
      { month: "Oct'24", price: 1480 },
      { month: "Nov'24", price: 1540 },
      { month: "Dec'24", price: 1520 },
      { month: "Jan'25", price: 1590 },
      { month: "Feb'25", price: 1575 },
      { month: "Mar'25", price: 1610 },
      { month: "Apr'25", price: 1640 },
      { month: "May'25", price: 1625 },
      { month: "Jun'25", price: 1660 },
      { month: "Jul'25", price: 1635 },
      { month: "Aug'25", price: 1650 },
    ],
    performanceMetrics: {
      dailyChange: +0.42,
      oneMonth: +1.82,
      threeMonth: +4.15,
      oneYear: +14.20,
      ytd: +10.10,
    }
  },
  TCS: {
    companyProfile: {
      name: "Tata Consultancy Services",
      ticker: "TCS",
      exchange: "NSE",
      sector: "Technology",
      industry: "IT Services",
      marketCap: "₹14.1L Cr",
      marketCapValue: 1410000,
      country: "India",
      fiscalYear: "FY2025",
      reportingCurrency: "INR",
      stockPrice: 3850.75,
      stockPriceChange: +1.12,
      previousClose: 3808.10,
      sharesOutstanding: "3.66B",
      beta: 0.78,
      volatility: 16.32,
      tradingVolume: "2.4M",
      founded: "1968",
      ceo: "K. Krithivasan",
      headquarters: "Mumbai, Maharashtra",
      employees: "600,000+",
      website: "www.tcs.com",
    },
    incomeStatement: {
      years: ["FY2025", "FY2024", "FY2023"],
      data: {
        revenue:           [245000, 230000, 212000],
        costOfRevenue:     [142000, 134000, 125000],
        grossProfit:       [103000, 96000, 87000],
        operatingExpenses: [25000, 23000, 21000],
        ebitda:            [78000, 73000, 66000],
        depreciation:      [10000, 10000, 9000],
        ebit:              [68000, 63000, 57000],
        interestExpense:   [1800, 1500, 1200],
        otherIncome:       [4800, 4200, 3600],
        profitBeforeTax:   [71000, 65700, 59400],
        taxExpense:        [23000, 21200, 19200],
        netIncome:         [48000, 44500, 40200],
      }
    },
    balanceSheet: {
      years: ["FY2025", "FY2024", "FY2023"],
      data: {
        cashAndEquivalents: [32000, 28000, 24000],
        accountsReceivable: [48000, 45000, 42000],
        inventory:          [800, 700, 600],
        otherCurrentAssets: [14200, 13300, 12400],
        currentAssets:      [95000, 87000, 79400],
        ppe:                [54000, 52000, 49000],
        intangibles:        [28000, 26000, 24600],
        otherNonCurrent:    [33000, 30000, 27000],
        totalAssets:        [210000, 195000, 180000],
        accountsPayable:    [28000, 26000, 24000],
        shortTermDebt:      [800, 600, 500],
        otherCurrentLiab:   [10200, 9400, 8500],
        currentLiabilities: [39000, 36000, 33000],
        longTermDebt:       [1800, 1500, 1200],
        otherNonCurrentLiab:[4200, 7500, 10800],
        totalLiabilities:   [45000, 45000, 45000],
        totalEquity:        [165000, 150000, 135000],
        totalDebt:          [2600, 2100, 1700],
      }
    },
    cashFlowStatement: {
      years: ["FY2025", "FY2024", "FY2023"],
      data: {
        operatingCashFlow: [58000, 54000, 49000],
        capitalExpenditure: [-12000, -11000, -10000],
        freeCashFlow:       [46000, 43000, 39000],
        investingCashFlow:  [-18000, -16500, -15000],
        financingCashFlow:  [-34000, -32500, -30000],
        dividendsPaid:      [-24000, -22000, -20000],
        debtRepayment:      [-1500, -1200, -1000],
        netCashChange:      [6000, 5000, 4000],
      }
    },
    stockPriceHistory: [
      { month: "Sep'24", price: 3410 },
      { month: "Oct'24", price: 3380 },
      { month: "Nov'24", price: 3520 },
      { month: "Dec'24", price: 3490 },
      { month: "Jan'25", price: 3620 },
      { month: "Feb'25", price: 3585 },
      { month: "Mar'25", price: 3680 },
      { month: "Apr'25", price: 3740 },
      { month: "May'25", price: 3715 },
      { month: "Jun'25", price: 3790 },
      { month: "Jul'25", price: 3810 },
      { month: "Aug'25", price: 3850.75 },
    ],
    performanceMetrics: {
      dailyChange: +1.12,
      oneMonth: +2.42,
      threeMonth: +5.12,
      oneYear: +16.05,
      ytd: +11.22,
    }
  }
};
