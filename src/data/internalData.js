// =============================================
//  MOCK INTERNAL COMPANY DATA
// =============================================


// ACCOUNTS RECEIVABLE
export const accountsReceivable = [
  { id: "AR001", customer: "Tata Motors Ltd",      invoice: "INV-2025-001", amount: 2000, currency: "INR", dueDate: "2025-08-20", status: "pending",  daysOverdue: 0 },
  { id: "AR002", customer: "Infosys Technologies", invoice: "INV-2025-002", amount: 4500, currency: "INR", dueDate: "2025-08-25", status: "pending",  daysOverdue: 0 },
  { id: "AR003", customer: "Mahindra & Mahindra",  invoice: "INV-2025-003", amount: 1500, currency: "INR", dueDate: "2025-08-10", status: "overdue",  daysOverdue: 7 },
  { id: "AR004", customer: "Wipro Limited",         invoice: "INV-2025-004", amount: 3200, currency: "INR", dueDate: "2025-07-28", status: "overdue",  daysOverdue: 20 },
  { id: "AR005", customer: "HCL Technologies",      invoice: "INV-2025-005", amount: 1800, currency: "INR", dueDate: "2025-08-15", status: "pending",  daysOverdue: 0 },
  { id: "AR006", customer: "Bharti Airtel",          invoice: "INV-2025-006", amount: 5200, currency: "INR", dueDate: "2025-07-05", status: "paid",    daysOverdue: 0 },
  { id: "AR007", customer: "Adani Enterprises",      invoice: "INV-2025-007", amount: 2800, currency: "INR", dueDate: "2025-09-01", status: "pending",  daysOverdue: 0 },
  { id: "AR008", customer: "HDFC Bank",              invoice: "INV-2025-008", amount: 3600, currency: "INR", dueDate: "2025-06-20", status: "overdue",  daysOverdue: 58 },
  { id: "AR009", customer: "Larsen & Toubro",        invoice: "INV-2025-009", amount: 4100, currency: "INR", dueDate: "2025-08-30", status: "pending",  daysOverdue: 0 },
  { id: "AR010", customer: "ITC Limited",            invoice: "INV-2025-010", amount: 1200, currency: "USD", dueDate: "2025-08-18", status: "pending",  daysOverdue: 0 },
];


// ACCOUNTS PAYABLE
export const accountsPayable = [
  { id: "AP001", supplier: "Saudi Aramco",         invoice: "SUP-2025-001", amount: 8500, currency: "USD", dueDate: "2025-08-22", status: "pending" },
  { id: "AP002", supplier: "BASF Chemicals",       invoice: "SUP-2025-002", amount: 3200, currency: "EUR", dueDate: "2025-08-18", status: "pending" },
  { id: "AP003", supplier: "Siemens Energy",       invoice: "SUP-2025-003", amount: 2100, currency: "EUR", dueDate: "2025-08-25", status: "pending" },
  { id: "AP004", supplier: "Indian Oil Corp",      invoice: "SUP-2025-004", amount: 6400, currency: "INR", dueDate: "2025-08-15", status: "overdue" },
  { id: "AP005", supplier: "Bharat Petroleum",     invoice: "SUP-2025-005", amount: 4800, currency: "INR", dueDate: "2025-08-28", status: "pending" },
  { id: "AP006", supplier: "TechnipFMC",           invoice: "SUP-2025-006", amount: 1500, currency: "GBP", dueDate: "2025-09-05", status: "pending" },
  { id: "AP007", supplier: "ONGC",                 invoice: "SUP-2025-007", amount: 5100, currency: "INR", dueDate: "2025-07-30", status: "paid" },
  { id: "AP008", supplier: "Schlumberger",          invoice: "SUP-2025-008", amount: 2900, currency: "USD", dueDate: "2025-08-20", status: "pending" },
];


// INVENTORY DATA
export const inventoryData = {
  totalValue: 68000,          // ₹ Cr
  turnover: 5.8,              // times
  daysOutstanding: 63,        // days
  slowMovingPct: 12.5,        // %
  workingCapitalTied: 42000,  // ₹ Cr
  categories: [
    { name: "Raw Materials",     value: 28000, pct: 41.2 },
    { name: "Work in Progress",  value: 18000, pct: 26.5 },
    { name: "Finished Goods",    value: 15000, pct: 22.1 },
    { name: "Stores & Spares",   value: 7000,  pct: 10.3 },
  ],
};


// DEBT & FINANCING
export const debtFinancing = [
  { id: "DEBT001", name: "Term Loan A",       amount: 5500,  rate: 8.25, type: "Fixed",    maturity: "2028-03-15", currency: "INR", repaymentSchedule: "Quarterly" },
  { id: "DEBT002", name: "Term Loan B",       amount: 4200,  rate: 7.90, type: "Floating", maturity: "2027-09-30", currency: "INR", repaymentSchedule: "Semi-Annual" },
  { id: "DEBT003", name: "USD Bond 2026",     amount: 2000,  rate: 5.50, type: "Fixed",    maturity: "2026-06-15", currency: "USD", repaymentSchedule: "Annual" },
  { id: "DEBT004", name: "ECB Facility",      amount: 1800,  rate: 6.10, type: "Floating", maturity: "2029-12-31", currency: "EUR", repaymentSchedule: "Quarterly" },
  { id: "DEBT005", name: "NCD Series I",      amount: 3500,  rate: 8.50, type: "Fixed",    maturity: "2026-12-20", currency: "INR", repaymentSchedule: "Annual" },
  { id: "DEBT006", name: "Working Capital",   amount: 2800,  rate: 9.00, type: "Floating", maturity: "2025-12-31", currency: "INR", repaymentSchedule: "Monthly" },
  { id: "DEBT007", name: "GBP Loan",          amount: 1200,  rate: 5.80, type: "Fixed",    maturity: "2028-06-30", currency: "GBP", repaymentSchedule: "Semi-Annual" },
  { id: "DEBT008", name: "Term Loan C",       amount: 3000,  rate: 8.00, type: "Fixed",    maturity: "2030-03-31", currency: "INR", repaymentSchedule: "Quarterly" },
];


// CASH & LIQUIDITY
export const cashLiquidity = {
  totalCash: 42000,
  bankDeposits: 28000,
  liquidInvestments: 11000,
  cashInHand: 3000,
  availableCreditLines: 15000,
  availableLiquidity: 57000,
  thirtyDayObligations: 40140,
  liquidityCoverage: 1.42,
  cashRunway: 8.5,
  monthlyBurn: 6700,
  breakdown: [
    { name: "Bank Deposits", value: 28000 },
    { name: "Liquid Investments", value: 11000 },
    { name: "Cash in Hand", value: 3000 },
  ],
  monthlyProjection: [
    { month: "Aug'25", cash: 42000 },
    { month: "Sep'25", cash: 38500 },
    { month: "Oct'25", cash: 35200 },
    { month: "Nov'25", cash: 32800 },
    { month: "Dec'25", cash: 29500 },
    { month: "Jan'26", cash: 27100 },
    { month: "Feb'26", cash: 25800 },
  ],
};
