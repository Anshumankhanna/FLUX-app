import { useState, useRef, useEffect, createContext, useContext } from "react";
import { BrowserRouter, Routes, Route, NavLink, useLocation, Navigate, useNavigate } from "react-router-dom";

import ExecutiveDashboard from "./Pages/ExecutiveDashboard";
import CompanyProfile from "./Pages/CompanyProfile";
import FinancialStatements from "./Pages/FinancialStatements";
import MacroInterestPage from "./Pages/MacroInterestPage";
import AccountsReceivable from "./Pages/AccountsReceivable";
import AccountsPayable from "./Pages/AccountsPayable";
import CashLiquidity from "./Pages/CashLiquidity";
import InventoryWorkingCapital from "./Pages/InventoryWorkingCapital";
import DebtFinancing from "./Pages/DebtFinancing";
import FinancialRatios from "./Pages/FinancialRatios";
import CashFlowForecast from "./Pages/CashFlowForecast";
import EquityFXMarket from "./Pages/EquityFXMarket";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import UserProfilePage from "./Pages/UserProfilePage";

/* Analytics pages — not in sidebar nav but accessible via direct links */
import StressTest from "./Pages/StressTest";
// import RiskAlerts from "./Pages/RiskAlerts"; // merged into Executive Dashboard
import AIExplanation from "./Pages/AIExplanation";

/* ─── User context ─── */
export const UserContext = createContext(null);
export function useUser() { return useContext(UserContext); }

/* ─── Consistent avatar colour from initials ─── */
const AVATAR_COLORS = [
  "#1a3a8a", "#0d9488", "#f59e0b", "#3b82f6",
  "#e11d48", "#14b8a6", "#f97316", "#6366f1",
];
function avatarColor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}
function initials(name) {
  const parts = name.trim().split(/\s+/);
  return parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : parts[0][0].toUpperCase();
}


/* ─── Inline SVG Logo ─── */
function FluxLogo({ size = 36, showText = true }) {
  return (
    <div className="flex items-center gap-[11px]">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width={size} height={size} style={{ borderRadius: 9, flexShrink: 0 }}>
        <rect width="40" height="40" rx="9" fill="url(#logoGrad)" />
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#0d9488" />
            <stop offset="100%" stopColor="#115e59" />
          </linearGradient>
        </defs>
        {/* Stylized F */}
        <path d="M11 8h14v4.5H16v4h8v4.5h-8v11H11V8z" fill="white" opacity="0.95" />
        {/* Trend arrow */}
        <path d="M14 30 L22 22 L25 25 L33 15" stroke="rgba(255,255,255,0.55)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <polygon points="33,15 28.5,15.5 32.5,19" fill="rgba(255,255,255,0.55)" />
      </svg>
      {showText && (
        <span className="hidden md:inline text-[20px] font-bold tracking-[3px] font-heading text-text-primary" style={{ fontStyle: "italic" }}>
          FL<span style={{ color: "#0d9488" }}>U</span>X
        </span>
      )}
    </div>
  );
}


/* ─── Ticker mock data ─── */
const TICKERS = [
  { exchange: "NSE", company: "RELIANCE" },
  { exchange: "BSE", company: "RELIANCE" },
  { exchange: "NSE", company: "TCS" },
  { exchange: "BSE", company: "TCS" },
  { exchange: "NSE", company: "INFOSYS" },
  { exchange: "NSE", company: "HDFCBANK" },
  { exchange: "BSE", company: "HDFCBANK" },
  { exchange: "NSE", company: "ICICIBANK" },
  { exchange: "NSE", company: "HINDUNILVR" },
  { exchange: "NSE", company: "SBIN" },
  { exchange: "NSE", company: "BHARTIARTL" },
  { exchange: "NSE", company: "ITC" },
  { exchange: "BSE", company: "ITC" },
  { exchange: "NSE", company: "KOTAKBANK" },
  { exchange: "NSE", company: "LT" },
  { exchange: "NSE", company: "AXISBANK" },
  { exchange: "NSE", company: "WIPRO" },
  { exchange: "NSE", company: "MARUTI" },
  { exchange: "NSE", company: "TATAMOTORS" },
  { exchange: "NSE", company: "SUNPHARMA" },
];


/* ─── Ticker Search Component ─── */
function TickerSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("NSE:RELIANCE");
  const ref = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = TICKERS.filter(t => {
    const label = `${t.exchange}:${t.company}`;
    return label.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div className="relative" ref={ref} id="ticker-search">
      <div
        className="flex items-center gap-[8px] bg-bg-card border border-border-primary rounded-lg px-[14px] py-[8px] cursor-pointer transition-normal hover:border-accent-purple-light focus-within:border-accent-purple-light focus-within:shadow-[0_0_0_3px_rgba(26,58,138,0.12)]"
        style={{ minWidth: 220 }}
        onClick={() => setOpen(true)}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-dim shrink-0">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          id="ticker-search-input"
          type="text"
          value={open ? query : selected}
          placeholder="Search ticker…"
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => { setOpen(true); setQuery(""); }}
          className="bg-transparent border-none outline-none text-[13px] font-medium text-text-primary w-full font-heading tracking-[0.5px] placeholder:text-text-dim"
        />
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-dim shrink-0" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {open && (
        <div className="absolute top-[calc(100%+6px)] left-0 w-full min-w-[260px] bg-bg-card border border-border-primary rounded-lg shadow-[0_16px_48px_rgba(0,0,0,0.15),0_0_0_1px_rgba(0,0,0,0.04)] z-[200] animate-[fadeIn_0.12s_ease-out] overflow-hidden" style={{ backdropFilter: 'blur(16px)' }}>
          <div className="max-h-[280px] overflow-y-auto py-[4px]">
            {filtered.length === 0 && (
              <div className="px-[16px] py-[14px] text-[12px] text-text-dim text-center">No tickers found</div>
            )}
            {filtered.map((t, i) => {
              const label = `${t.exchange}:${t.company}`;
              const isSelected = label === selected;
              return (
                <button
                  key={`${label}-${i}`}
                  id={`ticker-option-${i}`}
                  className={`w-full text-left px-[16px] py-[10px] text-[13px] font-medium cursor-pointer border-none transition-fast flex items-center gap-[10px] ${
                    isSelected
                      ? 'bg-accent-purple-bg text-accent-purple-light'
                      : 'bg-transparent text-text-secondary hover:bg-bg-card-hover hover:text-text-primary'
                  }`}
                  onClick={() => { setSelected(label); setQuery(""); setOpen(false); }}
                >
                  <span className="text-[10px] font-bold tracking-[0.8px] px-[6px] py-[2px] rounded bg-[rgba(13,148,136,0.1)] text-[#0d9488] shrink-0">{t.exchange}</span>
                  <span className="font-heading tracking-[0.3px]">{t.company}</span>
                  {isSelected && <span className="ml-auto text-accent-purple-light">✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}


/* ─── Nav config ─── */
const navSections = [
  {
    title: "OVERVIEW",
    items: [
      { path: "/", label: "Executive Dashboard", icon: "⬡" },
      { path: "/profile", label: "Company Profile", icon: "▣" },
    ],
  },
  {
    title: "FINANCIAL DATA",
    items: [
      { path: "/financials", label: "Financial Statements", icon: "▤" },
      { path: "/ratios", label: "Financial Ratios", icon: "◉" },
      { path: "/markets", label: "Equity & FX Markets", icon: "◈" },
      { path: "/macro", label: "Macro & Interest Rates", icon: "◎" },
    ],
  },
  {
    title: "OPERATIONS",
    items: [
      { path: "/receivables", label: "Accounts Receivable", icon: "▸" },
      { path: "/payables", label: "Accounts Payable", icon: "◂" },
      { path: "/cash", label: "Cash & Liquidity", icon: "◐" },
      { path: "/inventory", label: "Inventory & WC", icon: "◧" },
      { path: "/debt", label: "Debt & Financing", icon: "◫" },
      { path: "/forecast", label: "Cash Flow Forecast", icon: "◮" },
    ],
  },
];

const pageTitles = {
  "/": "Executive Dashboard",
  "/profile": "Company Profile",
  "/financials": "Financial Statements",
  "/ratios": "Financial Ratios",
  "/markets": "Equity & FX Markets",
  "/macro": "Macro & Interest Rates",
  "/receivables": "Accounts Receivable",
  "/payables": "Accounts Payable",
  "/cash": "Cash & Liquidity",
  "/inventory": "Inventory & Working Capital",
  "/debt": "Debt & Financing",
  "/forecast": "Cash Flow Forecast",
  "/user-profile": "My Profile",
};


/* ─── Avatar + Dropdown ─── */
function AvatarMenu({ onLogout }) {
  const user = useUser();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  /* close on outside click */
  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const color = avatarColor(user.name);
  const inits = initials(user.name);

  return (
    <div className="relative" ref={ref}>
      <button
        className="w-[38px] h-[38px] rounded-full border-2 border-border-primary flex items-center justify-center font-bold text-[13px] font-heading text-white cursor-pointer transition-normal select-none outline-none hover:scale-105 hover:border-accent-purple-light hover:shadow-[0_0_14px_rgba(26,58,138,0.25)]"
        id="user-avatar-btn"
        onClick={() => setOpen(v => !v)}
        style={{ background: color }}
        title={user.name}
      >
        {inits}
      </button>

      {open && (
        <div className="absolute top-[calc(100%+10px)] right-0 w-[230px] bg-bg-card border border-border-primary rounded-md shadow-[0_16px_40px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.05)] p-[10px] z-[100] animate-[fadeIn_0.15s_ease-out]">
          <div className="flex items-center gap-[10px] px-[6px] pt-[8px] pb-[10px]">
            <span className="w-[34px] h-[34px] rounded-full flex items-center justify-center font-bold text-[12px] font-heading text-white shrink-0" style={{ background: color }}>{inits}</span>
            <div className="overflow-hidden">
              <p className="text-[13px] font-semibold text-text-primary leading-tight">{user.name}</p>
              <p className="text-[11px] text-text-dim whitespace-nowrap overflow-hidden text-ellipsis max-w-[140px]">{user.email}</p>
            </div>
          </div>
          <hr className="border-none h-px bg-border-subtle my-[6px]" />
          <button
            className="w-full border-none bg-transparent text-text-muted px-[12px] py-[9px] rounded-sm flex items-center gap-[10px] text-[12px] font-medium cursor-pointer transition-fast text-left hover:bg-bg-card-hover hover:text-text-primary"
            id="goto-profile"
            onClick={() => { navigate("/user-profile"); setOpen(false); }}
          >
            <span>👤</span> My Profile
          </button>
          <button
            className="w-full border-none bg-transparent text-negative px-[12px] py-[9px] rounded-sm flex items-center gap-[10px] text-[12px] font-medium cursor-pointer transition-fast text-left hover:bg-[rgba(240,68,56,0.08)] hover:text-negative"
            id="logout-btn"
            onClick={() => { setOpen(false); onLogout(); }}
          >
            <span>↩</span> Logout
          </button>
        </div>
      )}
    </div>
  );
}


/* ─── Layout ─── */
function AppLayout({ onLogout }) {
  const user = useUser();
  const location = useLocation();
  const currentTitle = pageTitles[location.pathname] || "FLUX";

  /* Collapsible nav sections — auto-expand section with active route */
  const [expandedSections, setExpandedSections] = useState(() => {
    const initial = {};
    navSections.forEach((section) => {
      const hasActive = section.items.some(item =>
        item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path)
      );
      initial[section.title] = hasActive;
    });
    return initial;
  });

  /* Keep the active route's section expanded on navigation */
  useEffect(() => {
    setExpandedSections(prev => {
      const next = { ...prev };
      navSections.forEach((section) => {
        const hasActive = section.items.some(item =>
          item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path)
        );
        if (hasActive) next[section.title] = true;
      });
      return next;
    });
  }, [location.pathname]);

  const toggleSection = (title) => {
    setExpandedSections(prev => ({ ...prev, [title]: !prev[title] }));
  };

  /* Refs to measure max-height for each section */
  const sectionRefs = useRef({});

  return (
    <div className="flex min-h-screen bg-bg-primary">

      {/* SIDEBAR */}
      <aside className="w-[64px] md:w-[220px] lg:w-[250px] min-h-screen bg-bg-secondary border-r border-border-primary py-5 px-2 md:px-[14px] fixed left-0 top-0 bottom-0 z-10 flex flex-col overflow-y-auto shadow-[1px_0_6px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-center md:justify-start px-0 md:px-[10px] pb-[20px] pt-[5px] shrink-0">
          <FluxLogo size={36} />
        </div>

        <nav className="flex-1 overflow-y-auto pb-[60px]">
          {navSections.map((section) => {
            const isExpanded = expandedSections[section.title] !== false;
            return (
              <div key={section.title} className="mb-2">
                {/* Section header — clickable dropdown toggle */}
                <div
                  className="nav-section-header hidden md:flex"
                  onClick={() => toggleSection(section.title)}
                >
                  <span className="section-title">{section.title}</span>
                  <span className={`section-chevron ${isExpanded ? "expanded" : ""}`}>▸</span>
                </div>

                {/* Items container with collapse animation */}
                <div
                  ref={el => { sectionRefs.current[section.title] = el; }}
                  className={`nav-section-items ${isExpanded ? "expanded" : "collapsed"} hidden md:block`}
                  style={{
                    maxHeight: isExpanded
                      ? `${section.items.length * 48}px`
                      : "0px",
                  }}
                >
                  {section.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === "/"}
                      className={({ isActive }) => `w-full border-none bg-transparent text-text-muted p-3 md:px-[12px] md:py-[11px] mb-[2px] rounded-sm text-left cursor-pointer text-[12px] font-medium tracking-[0.2px] flex items-center justify-center md:justify-start gap-[10px] transition-normal hover:bg-bg-card-hover hover:text-text-primary ${isActive ? "bg-accent-purple-bg !text-accent-purple-light shadow-[inset_3px_0_0_var(--color-accent-purple)] font-semibold" : ""}`}
                    >
                      <span className="text-[16px] md:text-[14px] w-[20px] text-center shrink-0">{item.icon}</span>
                      <span className="hidden md:block whitespace-nowrap overflow-hidden text-ellipsis">{item.label}</span>
                    </NavLink>
                  ))}
                </div>

                {/* Mobile: always show items (no dropdown on collapsed sidebar) */}
                <div className="md:hidden">
                  {section.items.map((item) => (
                    <NavLink
                      key={item.path + "-mobile"}
                      to={item.path}
                      end={item.path === "/"}
                      className={({ isActive }) => `w-full border-none bg-transparent text-text-muted p-3 mb-[2px] rounded-sm text-left cursor-pointer text-[12px] font-medium flex items-center justify-center transition-normal hover:bg-bg-card-hover hover:text-text-primary ${isActive ? "bg-accent-purple-bg !text-accent-purple-light shadow-[inset_3px_0_0_var(--color-accent-purple)] font-semibold" : ""}`}
                    >
                      <span className="text-[16px] w-[20px] text-center shrink-0">{item.icon}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="fixed bottom-0 left-0 w-[64px] md:w-[220px] lg:w-[250px] px-2 py-3 md:px-[25px] md:py-[16px] bg-[linear-gradient(transparent,var(--color-bg-secondary)_40%)]">
          <div className="text-[0px] md:text-[11px] text-text-dim flex items-center justify-center md:justify-start gap-[8px]">
            <span className="w-[7px] h-[7px] bg-positive rounded-full shadow-[0_0_8px_var(--color-positive)] animate-pulse-slow"></span>
            <span className="hidden md:inline">Market Data Live</span>
          </div>
        </div>
      </aside>


      {/* MAIN */}
      <main className="ml-[64px] md:ml-[220px] lg:ml-[250px] w-[calc(100%-64px)] md:w-[calc(100%-220px)] lg:w-[calc(100%-250px)] min-h-screen">

        {/* TOP BAR */}
        <header className="h-[80px] border-b border-border-primary px-[20px] md:px-[35px] py-[14px] md:py-[16px] flex justify-between items-center bg-bg-overlay backdrop-blur-[12px] sticky top-0 z-[5]">
          <div>
            <div className="text-text-label text-[11px] mb-[4px] tracking-[0.5px]">Financial Intelligence</div>
            <h1 className="text-[20px] md:text-[22px] font-semibold font-heading text-text-primary">{currentTitle}</h1>
          </div>

          <div className="flex items-center gap-[8px] md:gap-[16px]">
            <div className="hidden md:block">
              <TickerSearch />
            </div>
            <div className="flex flex-col items-end gap-[2px]">
              <span className="text-[13px] font-semibold text-text-primary tracking-[0.2px]">{user.name}</span>
              <span className="text-[10px] text-text-dim tracking-[0.4px]">{user.role}</span>
            </div>
            <AvatarMenu onLogout={onLogout} />
          </div>
        </header>


        {/* PAGE CONTENT */}
        <section className="p-[16px] md:p-[20px] lg:p-[30px_35px] max-w-[1500px] animate-fade-in" key={location.pathname}>
          <Routes>
            <Route path="/" element={<ExecutiveDashboard />} />
            <Route path="/profile" element={<CompanyProfile />} />
            <Route path="/financials" element={<FinancialStatements />} />
            <Route path="/ratios" element={<FinancialRatios />} />
            <Route path="/markets" element={<EquityFXMarket />} />
            <Route path="/macro" element={<MacroInterestPage />} />
            <Route path="/receivables" element={<AccountsReceivable />} />
            <Route path="/payables" element={<AccountsPayable />} />
            <Route path="/cash" element={<CashLiquidity />} />
            <Route path="/inventory" element={<InventoryWorkingCapital />} />
            <Route path="/debt" element={<DebtFinancing />} />
            <Route path="/forecast" element={<CashFlowForecast />} />
            <Route path="/stress-test" element={<StressTest />} />
            <Route path="/ai-insight" element={<AIExplanation />} />
            <Route path="/user-profile" element={<UserProfilePage onLogout={onLogout} />} />
            {/* Legacy aliases */}
            <Route path="/currency" element={<Navigate to="/markets" replace />} />
            <Route path="/equity" element={<Navigate to="/markets" replace />} />
            <Route path="/interest" element={<Navigate to="/macro" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </section>

      </main>

    </div>
  );
}


/* ─── Root App ─── */
function App() {
  const [authMode, setAuthMode] = useState("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData || { name: "CFO User", email: "cfo@company.com", role: "Chief Financial Officer", phone: "", department: "Finance", joined: "Jan 2022" });
    setIsLoggedIn(true);
  };

  const handleSignUp = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    if (authMode === "signup") {
      return (
        <SignUp
          onSignUp={handleSignUp}
          onNavigateLogin={() => setAuthMode("login")}
        />
      );
    }
    return (
      <Login
        onLogin={handleLogin}
        onNavigateSignup={() => setAuthMode("signup")}
      />
    );
  }

  return (
    <UserContext.Provider value={user}>
      <BrowserRouter>
        <AppLayout onLogout={() => { setIsLoggedIn(false); setUser(null); setAuthMode("login"); }} />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;