import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../../services/userService";

const font = "'Cormorant Garamond', Georgia, serif";
const green = "#2d6a4f";
const darkGreen = "#1a2e22";

function Toast({ message, type = 'success', onClose }) {
  const isError = type === 'error';
  return (
    <div style={{
      position: "fixed", top: "32px", left: "50%",
      transform: "translateX(-50%)",
      zIndex: 999,
      display: "flex", alignItems: "center", gap: "12px",
      background: "#fff",
      border: `1px solid ${isError ? 'rgba(229,62,62,0.2)' : 'rgba(45,106,79,0.2)'}`,
      borderLeft: `4px solid ${isError ? '#e53e3e' : green}`,
      borderRadius: "10px",
      padding: "14px 20px",
      boxShadow: isError ? "0 8px 32px rgba(229,62,62,0.12)" : "0 8px 32px rgba(45,106,79,0.12)",
      fontFamily: font,
      minWidth: "300px",
      animation: "toastIn 0.4s cubic-bezier(0.22,1,0.36,1)",
    }}>
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-12px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
      <span style={{ fontSize: "20px" }}>{isError ? '⚠️' : '🌿'}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "13px", fontWeight: 600, color: isError ? '#c53030' : darkGreen, letterSpacing: "0.01em" }}>
          {isError ? 'Something went wrong' : 'Password updated!'}
        </div>
        <div style={{ fontSize: "12px", color: isError ? "rgba(197,48,48,0.7)" : "rgba(26,46,34,0.5)", marginTop: "2px", letterSpacing: "0.01em" }}>
          {message}
        </div>
      </div>
      <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: isError ? "rgba(229,62,62,0.4)" : "rgba(45,106,79,0.4)", fontSize: "16px", lineHeight: 1, padding: "2px" }}>✕</button>
    </div>
  );
}

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [focused, setFocused] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [btnHover, setBtnHover] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [success, setSuccess] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const getStrength = (p) => {
    if (!p) return null;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    if (score <= 1) return { label: "Weak", color: "#e53e3e", width: "25%" };
    if (score === 2) return { label: "Fair", color: "#dd6b20", width: "50%" };
    if (score === 3) return { label: "Good", color: "#d69e2e", width: "75%" };
    return { label: "Strong", color: green, width: "100%" };
  };
  const strength = getStrength(password);
  const passwordsMatch = confirmPassword && password === confirmPassword;
  const passwordsMismatch = confirmPassword && password !== confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) return;
    if (password !== confirmPassword) {
      showToast("Passwords do not match.", 'error');
      return;
    }
    if (password.length < 8) {
      showToast("Password must be at least 8 characters.", 'error');
      return;
    }
    try {
      setLoading(true);
      const response = await resetPassword({ token, password }); 
    //   await new Promise(r => setTimeout(r, 1000));
    //   setSuccess(true);
    //   showToast("Your password has been reset successfully.");
    //   setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      const msg = error?.response?.data?.message;
      if (msg === 'Token Expired') {
        showToast("This reset link has expired. Please request a new one.", 'error');
      } else {
        showToast("Something went wrong. Please try again.", 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputWrapStyle = (field) => ({
    position: "relative",
    borderBottom: `1px solid ${focused === field ? green : "rgba(45,106,79,0.25)"}`,
    transition: "border-color 0.3s",
  });

  const inputStyle = {
    width: "100%",
    background: "transparent",
    border: "none",
    padding: "10px 32px 10px 0",
    fontFamily: font,
    fontSize: "17px",
    fontWeight: 400,
    color: darkGreen,
    outline: "none",
    boxSizing: "border-box",
    letterSpacing: "0.02em",
  };

  const eyeBtn = (show, toggle) => (
    <button
      type="button"
      onClick={toggle}
      style={{
        position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)",
        background: "none", border: "none", cursor: "pointer",
        color: "rgba(45,106,79,0.4)", padding: "4px",
        display: "flex", alignItems: "center",
      }}
    >
      {show ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )}
    </button>
  );

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 300,
      background: "#eef2ef",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: font, overflow: "hidden",
    }}>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div style={{
        position: "absolute", top: "-80px", right: "-80px",
        width: "380px", height: "380px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(45,106,79,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-60px", left: "-60px",
        width: "300px", height: "300px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(45,106,79,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{
        position: "absolute", top: "30px",
        left: "50%", transform: "translateX(-50%)",
        fontSize: "22px", fontWeight: 700,
        color: green, letterSpacing: "0.05em",
      }}>
        Kerivaa
      </div>

      <div style={{ width: "100%", maxWidth: "420px", padding: "0 32px" }}>

        {!success ? (
          <>
            <div style={{
              fontSize: "10px", letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: "rgba(45,106,79,0.45)", marginBottom: "14px",
            }}>
              New password
            </div>

            <h1 style={{
              fontSize: "clamp(38px, 5vw, 54px)",
              fontWeight: 700, lineHeight: 1.05,
              color: darkGreen, margin: "0 0 10px 0",
              letterSpacing: "-0.02em",
            }}>
              Reset your<br />
              <span style={{ fontStyle: "italic", fontWeight: 300, color: green }}>
                password.
              </span>
            </h1>

            <p style={{
              fontSize: "15px", fontWeight: 300,
              color: "rgba(26,46,34,0.5)",
              margin: "0 0 48px 0",
              letterSpacing: "0.02em", lineHeight: 1.6,
            }}>
              Choose a strong password to keep your account secure.
            </p>

            <form onSubmit={handleSubmit}>

              <div style={{ marginBottom: "32px" }}>
                <label style={{
                  fontFamily: font, fontSize: "10px", letterSpacing: "0.35em",
                  textTransform: "uppercase", color: "rgba(45,106,79,0.55)",
                  display: "block", marginBottom: "4px",
                }}>
                  New Password
                </label>
                <div style={inputWrapStyle("password")}>
                  <input
                    style={inputStyle}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused(null)}
                    required
                  />
                  {eyeBtn(showPassword, () => setShowPassword(p => !p))}
                </div>

                {password && (
                  <div style={{ marginTop: "10px" }}>
                    <div style={{
                      height: "3px", borderRadius: "99px",
                      background: "rgba(45,106,79,0.12)",
                      overflow: "hidden",
                    }}>
                      <div style={{
                        height: "100%", borderRadius: "99px",
                        width: strength.width,
                        background: strength.color,
                        transition: "width 0.4s ease, background 0.4s ease",
                      }} />
                    </div>
                    <p style={{
                      marginTop: "5px", fontSize: "11px",
                      color: strength.color, letterSpacing: "0.05em",
                      fontWeight: 500,
                    }}>
                      {strength.label}
                    </p>
                  </div>
                )}
              </div>

              <div style={{ marginBottom: "44px" }}>
                <label style={{
                  fontFamily: font, fontSize: "10px", letterSpacing: "0.35em",
                  textTransform: "uppercase", color: "rgba(45,106,79,0.55)",
                  display: "block", marginBottom: "4px",
                }}>
                  Confirm Password
                </label>
                <div style={{
                  ...inputWrapStyle("confirm"),
                  borderBottomColor: passwordsMismatch
                    ? "#e53e3e"
                    : passwordsMatch
                    ? green
                    : focused === "confirm" ? green : "rgba(45,106,79,0.25)",
                }}>
                  <input
                    style={inputStyle}
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    onFocus={() => setFocused("confirm")}
                    onBlur={() => setFocused(null)}
                    required
                  />
                  {eyeBtn(showConfirm, () => setShowConfirm(p => !p))}
                </div>
                {passwordsMismatch && (
                  <p style={{ marginTop: "6px", fontSize: "11px", color: "#e53e3e", letterSpacing: "0.03em" }}>
                    Passwords do not match
                  </p>
                )}
                {passwordsMatch && (
                  <p style={{ marginTop: "6px", fontSize: "11px", color: green, letterSpacing: "0.03em" }}>
                    ✓ Passwords match
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || passwordsMismatch}
                onMouseEnter={() => setBtnHover(true)}
                onMouseLeave={() => setBtnHover(false)}
                style={{
                  width: "100%", fontFamily: font,
                  fontSize: "16px", fontWeight: 600, letterSpacing: "0.06em",
                  background: loading || passwordsMismatch ? "rgba(45,106,79,0.5)" : btnHover ? "#40916c" : green,
                  color: "#fff", border: "none",
                  padding: "16px 0", cursor: loading || passwordsMismatch ? "not-allowed" : "pointer",
                  borderRadius: "999px",
                  transform: btnHover && !loading ? "translateY(-2px)" : "translateY(0)",
                  transition: "background 0.3s, transform 0.2s, box-shadow 0.2s",
                  boxShadow: btnHover && !loading ? "0 8px 28px rgba(45,106,79,0.35)" : "0 4px 16px rgba(45,106,79,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                }}
              >
                {loading ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      style={{ animation: "spin 0.8s linear infinite" }}>
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
                    Updating…
                  </>
                ) : "Reset Password"}
              </button>

            </form>
          </>
        ) : (
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: "64px", height: "64px", borderRadius: "50%",
              background: "rgba(45,106,79,0.08)",
              border: `1px solid rgba(45,106,79,0.2)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 28px", fontSize: "28px",
            }}>
              🌿
            </div>

            <div style={{
              fontSize: "10px", letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: "rgba(45,106,79,0.45)", marginBottom: "14px",
            }}>
              All done
            </div>

            <h1 style={{
              fontSize: "clamp(32px, 4.5vw, 48px)",
              fontWeight: 700, lineHeight: 1.05,
              color: darkGreen, margin: "0 0 16px 0",
              letterSpacing: "-0.02em",
            }}>
              Password<br />
              <span style={{ fontStyle: "italic", fontWeight: 300, color: green }}>
                updated.
              </span>
            </h1>

            <p style={{
              fontSize: "15px", fontWeight: 300,
              color: "rgba(26,46,34,0.5)",
              margin: "0 0 48px 0",
              letterSpacing: "0.02em", lineHeight: 1.6,
            }}>
              Your password has been reset. Redirecting you to sign in…
            </p>

            <button
              onClick={() => navigate('/login')}
              onMouseEnter={() => setBtnHover(true)}
              onMouseLeave={() => setBtnHover(false)}
              style={{
                width: "100%", fontFamily: font,
                fontSize: "16px", fontWeight: 600, letterSpacing: "0.06em",
                background: btnHover ? "#40916c" : green,
                color: "#fff", border: "none",
                padding: "16px 0", cursor: "pointer",
                borderRadius: "999px",
                transform: btnHover ? "translateY(-2px)" : "translateY(0)",
                transition: "background 0.3s, transform 0.2s, box-shadow 0.2s",
                boxShadow: btnHover ? "0 8px 28px rgba(45,106,79,0.35)" : "0 4px 16px rgba(45,106,79,0.2)",
              }}
            >
              Go to Sign In
            </button>
          </div>
        )}
      </div>

      <div style={{
        position: "absolute", bottom: "32px",
        left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column",
        alignItems: "center", gap: "8px", opacity: 0.3,
      }}>
        <span style={{ fontSize: "9px", letterSpacing: "0.35em", color: green, textTransform: "uppercase" }}>Kerala awaits</span>
        <div style={{ width: "1px", height: "32px", background: green }} />
      </div>

    </div>
  );
}