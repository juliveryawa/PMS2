import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ROLES = [
  { key: "admin",      label: "Admin",      desc: "Full access",   icon: "🛡" },
  { key: "technician", label: "Technician", desc: "Tasks & logs",  icon: "🔧" },
  { key: "viewer",     label: "Viewer",     desc: "Read only",     icon: "👁" },
];

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [showPw, setShowPw]       = useState(false);
  const [remember, setRemember]   = useState(false);
  const [role, setRole]           = useState("admin");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      const { token, user } = res.data;

      // Store token
      if (remember) {
        localStorage.setItem("pms_token", token);
      } else {
        sessionStorage.setItem("pms_token", token);
      }

      // Redirect based on role
      if (user.role === "admin")      navigate("/dashboard");
      else if (user.role === "technician") navigate("/tasks");
      else                            navigate("/reports");

    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-4xl flex rounded-2xl overflow-hidden shadow-xl">

        {/* ── Left panel ── */}
        <div className="hidden md:flex w-5/12 bg-[#0f2744] flex-col justify-between p-10">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#2980B9] rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="font-bold text-white text-lg tracking-wide">PMS</span>
          </div>

          {/* Hero */}
          <div>
            <h1 className="text-white text-2xl font-bold leading-snug mb-3">
              Keep your IT infrastructure running smoothly.
            </h1>
            <p className="text-[#93b5d8] text-sm leading-relaxed">
              Manage assets, schedule maintenance, and track issues all in one place.
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-8">
            {[["8", "Modules"], ["3", "Roles"], ["24/7", "Monitoring"]].map(([num, lbl]) => (
              <div key={lbl}>
                <div className="text-white text-xl font-bold">{num}</div>
                <div className="text-[#93b5d8] text-xs mt-0.5">{lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right panel (form) ── */}
        <div className="flex-1 bg-white flex flex-col justify-center p-10">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Welcome back</h2>
            <p className="text-sm text-gray-500">Sign in to your account to continue</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Email address
              </label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="M2 7l10 7 10-7"/>
                </svg>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:outline-none focus:border-[#2980B9] focus:ring-2 focus:ring-blue-100 transition"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Password
              </label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-14 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:outline-none focus:border-[#2980B9] focus:ring-2 focus:ring-blue-100 transition"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
                >
                  {showPw ? "hide" : "show"}
                </button>
              </div>
            </div>

            {/* Remember me + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="accent-[#2980B9] w-3.5 h-3.5"
                />
                Remember me
              </label>
              <button type="button" className="text-sm text-[#2980B9] hover:underline">
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#0f2744] hover:bg-[#1a3a5c] text-white text-sm font-semibold rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Role quick-select */}
          <div className="flex items-center gap-3 my-5 text-xs text-gray-400">
            <span className="flex-1 h-px bg-gray-100" />
            or sign in as
            <span className="flex-1 h-px bg-gray-100" />
          </div>

          <div className="grid grid-cols-3 gap-2">
            {ROLES.map(({ key, label, desc, icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setRole(key)}
                className={`p-2.5 rounded-lg border text-center transition text-sm
                  ${role === key
                    ? "border-[#2980B9] bg-blue-50"
                    : "border-gray-200 bg-gray-50 hover:border-[#2980B9]"
                  }`}
              >
                <span className="text-base">{icon}</span>
                <span className="block font-semibold text-gray-700 text-xs mt-0.5">{label}</span>
                <span className="block text-gray-400 text-[10px]">{desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}