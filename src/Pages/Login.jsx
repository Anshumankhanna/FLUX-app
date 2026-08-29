import { useState } from "react";

function Login({ onLogin, onNavigateSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary relative overflow-hidden">
      <div className="absolute rounded-full blur-[100px] opacity-30 w-[500px] h-[500px] bg-[rgba(13,148,136,0.25)] top-[-150px] right-[-100px] animate-float"></div>
      <div className="absolute rounded-full blur-[100px] opacity-30 w-[400px] h-[400px] bg-[rgba(26,58,138,0.2)] bottom-[-100px] left-[-80px] animate-float-reverse"></div>

      <div className="bg-[rgba(255,255,255,0.92)] backdrop-blur-[24px] border border-border-primary rounded-xl p-[48px_44px] w-[420px] max-w-[90vw] text-center animate-scale-in shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-center gap-[11px] mb-[32px]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="42" height="42" style={{ borderRadius: 10, flexShrink: 0 }}>
            <rect width="40" height="40" rx="10" fill="url(#loginLogoGrad)" />
            <defs>
              <linearGradient id="loginLogoGrad" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="#0d9488" />
                <stop offset="100%" stopColor="#115e59" />
              </linearGradient>
            </defs>
            <path d="M11 8h14v4.5H16v4h8v4.5h-8v11H11V8z" fill="white" opacity="0.95" />
            <path d="M14 30 L22 22 L25 25 L33 15" stroke="rgba(255,255,255,0.55)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <polygon points="33,15 28.5,15.5 32.5,19" fill="rgba(255,255,255,0.55)" />
          </svg>
          <span className="text-[24px] font-bold tracking-[3px] font-heading text-text-primary" style={{ fontStyle: "italic" }}>
            FL<span style={{ color: "#0d9488" }}>U</span>X
          </span>
        </div>

        <h1 className="text-[26px] font-bold font-heading mb-[8px] text-text-primary">Welcome Back</h1>
        <p className="text-text-dim text-[13px] mb-[36px]">CFO Financial Intelligence Platform</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-[20px] text-left">
            <label htmlFor="login-email" className="block text-[11px] text-text-dim tracking-[0.5px] mb-[8px] font-medium">Email</label>
            <input
              id="login-email"
              type="email"
              placeholder="cfo@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-[13px_16px] bg-bg-input border border-border-primary rounded-sm text-text-primary text-[14px] outline-none transition-normal focus:border-accent-purple focus:shadow-[0_0_0_3px_rgba(26,58,138,0.1)] placeholder:text-text-faint"
            />
          </div>

          <div className="mb-[20px] text-left">
            <label htmlFor="login-password" className="block text-[11px] text-text-dim tracking-[0.5px] mb-[8px] font-medium">Password</label>
            <input
              id="login-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-[13px_16px] bg-bg-input border border-border-primary rounded-sm text-text-primary text-[14px] outline-none transition-normal focus:border-accent-purple focus:shadow-[0_0_0_3px_rgba(26,58,138,0.1)] placeholder:text-text-faint"
            />
          </div>

          <button type="submit" className="w-full p-[14px] bg-[image:var(--background-image-accent-gradient)] text-white border-none rounded-sm text-[14px] font-semibold cursor-pointer transition-normal mt-[8px] tracking-[0.5px] hover:not(:disabled):shadow-[0_0_24px_rgba(13,148,136,0.3)] hover:not(:disabled):-translate-y-px disabled:opacity-70 disabled:cursor-wait" id="login-submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="mt-[24px] text-[12px] text-text-muted">
          Don&apos;t have an account?{" "}
          <button className="bg-transparent border-none text-accent-purple-light font-semibold cursor-pointer outline-none transition-normal hover:text-accent-purple hover:underline p-0" id="goto-signup" onClick={onNavigateSignup}>
            Sign Up
          </button>
        </p>

        <p className="mt-[28px] text-text-faint text-[10px] tracking-[0.5px]">Powered by AWS · Secured by Cognito</p>
      </div>
    </div>
  );
}

export default Login;
