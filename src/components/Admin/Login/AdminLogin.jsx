import { useEffect, useState } from "react";
import logo from "../../../assets/logo.png";
import { adminLogin } from "../../../services/adminService";
import { loginSuccess } from "../../../redux/adminAuthSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("CRCS@1729");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(email, password, "eeeee")
    if (!email || !password) { setError("Please fill in all fields."); return; }
    try {
      setError("");
      setLoading(true);
      const response = await adminLogin({ email, password });
      const { message, accessToken, refreshToken, admin } = response.data;
      if (message == 'Login Successfull') {
        dispatch(loginSuccess({
          accessToken,
          refreshToken,
          isLoggedIn: true
        }))
        showToast("Welcome back, Admin! Redirecting…");
        await new Promise((r) => setTimeout(r, 1800));
        setLoading(false);
        navigate('/admin/');
      }
    } catch (error) {
      console.log(error.response.data.message, "Message");
      setError(error.response.data.message)
    }

    // navigate("/admin/dashboard");
  };


  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(""), 5000);
    return () => clearTimeout(timer);
  }, [error]);

  return (
    <div className="min-h-screen flex bg-white font-sans overflow-hidden">

      {/* ── Left Panel ── */}
      <div className="hidden lg:flex flex-1 flex-col justify-center items-center px-14 py-16 bg-[#f4f8f5] border-r border-[#e4ede7] relative overflow-hidden">

        {/* Blob decorations */}
        <div className="absolute -top-16 -right-16 w-80 h-80 rounded-[60%_40%_70%_30%/50%_60%_40%_50%] bg-[rgba(45,106,79,0.07)] animate-pulse pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-52 h-52 rounded-[40%_60%_30%_70%/60%_40%_70%_30%] bg-[rgba(45,106,79,0.05)] pointer-events-none" />
        <div className="absolute top-[42%] right-[12%] w-28 h-28 rounded-[50%_30%_60%_40%] bg-[rgba(168,213,181,0.2)] pointer-events-none" />

        <div className="relative z-10 max-w-md w-full">

          {/* Logo */}
          <img
            src={logo}
            alt="Kerivaa"
            className="w-44 mb-10 [mix-blend-mode:multiply]"
          />

          {/* Tagline */}
          <h2 className="font-['Cormorant_Garamond',Georgia,serif] text-[clamp(2rem,3.2vw,3.6rem)] font-light text-[#1a2e23] leading-[1.15] tracking-[-0.02em] mb-4">
            Design{" "}
            <em className="italic text-[#2d6a4f]">Kerala</em>
            <br />from the inside.
          </h2>

          <p className="text-sm font-light text-[#6b8f78] leading-[1.75] tracking-[0.01em] mb-12">
            Manage experiences, journeys, and traveller stories —
            all from a single control centre built for the Kerivaa team.
          </p>

          {/* Stats */}
          <div className="flex gap-9 pt-7 border-t border-[#d4e6da]">
            {[
              { num: "14", label: "Destinations" },
              { num: "230+", label: "Experiences" },
              { num: "98%", label: "Satisfaction" },
            ].map(({ num, label }) => (
              <div key={label}>
                <div className="font-['Cormorant_Garamond',Georgia,serif] text-[32px] font-medium text-[#2d6a4f] leading-none tracking-[-0.02em]">
                  {num}
                </div>
                <div className="text-[10px] font-normal tracking-[0.14em] uppercase text-[#8aab95] mt-1">
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* Coordinates */}
          <p className="mt-11 text-[10px] tracking-[0.18em] uppercase text-[#b8cfc0]">
            10.8505° N · 76.2711° E · Kerala, India
          </p>
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="w-full lg:w-[480px] flex flex-col justify-center items-center px-6 sm:px-12 py-14 bg-white">
        <div className="w-full max-w-[360px] animate-[fadeUp_0.65s_ease_both]">

          {/* Logo — mobile only */}
          <img
            src={logo}
            alt="Kerivaa"
            className="w-36 mb-7 [mix-blend-mode:multiply] lg:hidden"
          />

          {/* Green accent bar */}
          <div className="w-10 h-0.5 bg-[#2d6a4f] rounded-full mb-7" />

          {/* Heading */}
          <h1 className="font-['Cormorant_Garamond',Georgia,serif] text-[38px] font-light text-[#1a2e23] tracking-[-0.01em] leading-[1.1] mb-1.5">
            Welcome<br />
            <em className="italic text-[#2d6a4f]">back.</em>
          </h1>
          <p className="text-[13px] font-light text-[#8aab95] tracking-[0.02em] mb-9">
            Sign in to your admin workspace
          </p>

          <form onSubmit={handleSubmit} autoComplete="off" noValidate>

            {/* Email */}
            <div className="mb-5">
              <label className={`block text-[10px] font-medium tracking-[0.16em] uppercase mb-2 transition-colors duration-200 ${focused === "email" ? "text-[#2d6a4f]" : "text-[#8aab95]"}`}>
                Email address
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="admin@kerivaa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  autoComplete="username"
                  className="w-full bg-[#f8fbf9] border-[1.5px] border-[#d4e6da] rounded-[10px] py-3 pl-4 pr-11 text-sm font-light text-[#1a2e23] placeholder-[#b8cfc0] outline-none transition-all duration-200 focus:border-[#2d6a4f] focus:bg-white focus:shadow-[0_0_0_3px_rgba(45,106,79,0.1)] tracking-[0.02em]"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#b8cfc0] flex items-center pointer-events-none">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Password */}
            <div className="mb-2">
              <label className={`block text-[10px] font-medium tracking-[0.16em] uppercase mb-2 transition-colors duration-200 ${focused === "password" ? "text-[#2d6a4f]" : "text-[#8aab95]"}`}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  autoComplete="current-password"
                  className="w-full bg-[#f8fbf9] border-[1.5px] border-[#d4e6da] rounded-[10px] py-3 pl-4 pr-11 text-sm font-light text-[#1a2e23] placeholder-[#b8cfc0] outline-none transition-all duration-200 focus:border-[#2d6a4f] focus:bg-white focus:shadow-[0_0_0_3px_rgba(45,106,79,0.1)] tracking-[0.02em]"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3.5 top-1/2 cursor-pointer -translate-y-1/2 text-[#b8cfc0] hover:text-[#2d6a4f] transition-colors duration-200 flex items-center"
                >
                  {showPw ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-xs text-red-600 mt-2 tracking-[0.01em]">{error}</p>
            )}

            {/* Forgot */}
            <button
              type="button"
              className="block ml-auto mt-2 mb-6 text-xs font-light text-[#8aab95] hover:text-[#2d6a4f] transition-colors duration-200 tracking-[0.02em] bg-transparent border-none cursor-pointer"
            >
              Forgot password?
            </button>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#2d6a4f] hover:bg-[#235540] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer rounded-[10px] text-xs font-medium tracking-[0.16em] uppercase text-white transition-all duration-200 hover:shadow-[0_6px_22px_rgba(45,106,79,0.25)] hover:-translate-y-px active:translate-y-0 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating…
                </>
              ) : (
                "Sign In"
              )}
            </button>

          </form>

          <p className="mt-8 text-center text-[11px] font-light text-[#b8cfc0] tracking-[0.08em]">
            Kerivaa Admin · Travel &amp; Explore Kerala
          </p>

        </div>
      </div>
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-[12px] shadow-lg text-sm font-medium tracking-[0.01em] animate-[fadeUp_0.4s_ease_both] transition-all
    ${toast.type === "success"
            ? "bg-[#2d6a4f] text-white shadow-[0_8px_24px_rgba(45,106,79,0.3)]"
            : "bg-red-600 text-white"
          }`}
        >
          {toast.type === "success" && (
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
          )}
          {toast.message}
        </div>
      )}
    </div>
  );
}