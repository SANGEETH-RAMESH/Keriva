import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../../services/userService";

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
        <div style={{
          fontSize: "13px", fontWeight: 600,
          color: isError ? '#c53030' : darkGreen,
          letterSpacing: "0.01em",
        }}>
          {isError ? 'No Email' : 'Email sent!'}
        </div>
        <div style={{
          fontSize: "12px",
          color: isError ? "rgba(197,48,48,0.7)" : "rgba(26,46,34,0.5)",
          marginTop: "2px", letterSpacing: "0.01em",
        }}>
          {message}
        </div>
      </div>
      <button onClick={onClose} style={{
        background: "none", border: "none", cursor: "pointer",
        color: isError ? "rgba(229,62,62,0.4)" : "rgba(45,106,79,0.4)",
        fontSize: "16px", lineHeight: 1, padding: "2px",
      }}>✕</button>
    </div>
  );
}

export default function ForgotPasswordPage({ onClose, onBack }) {
  const [email, setEmail] = useState("");
  const [focused, setFocused] = useState(false);
  const [btnHover, setBtnHover] = useState(false);
  const [backHover, setBackHover] = useState(false);
  const [loginHover, setLoginHover] = useState(false);
  const [toast, setToast] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast("Please enter your email address.", 'error');
      return;
    }
    try {
      setLoading(true);
      console.log(email, 'Emaill')
      const response = await forgotPassword(email);
      console.log(response, 'Response')
      if (response.data.message == 'Password reset link send to email') {
        await new Promise(r => setTimeout(r, 1000));
        setSubmitted(true);
        showToast("Check your inbox for the reset link.");
      }
    } catch (error) {
      const msg = error?.response?.data?.message;
      if (msg === 'User Not Found') {
        showToast("No account found with this email.", 'error');
      } else {
        showToast("Something went wrong. Please try again.", 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    background: "transparent",
    border: "none",
    borderBottom: `1px solid ${focused ? green : "rgba(45,106,79,0.25)"}`,
    padding: "10px 0",
    fontFamily: font,
    fontSize: "17px",
    fontWeight: 400,
    color: darkGreen,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.3s",
    letterSpacing: "0.02em",
  };

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

      <button
        onClick={onClose || onBack || (() => navigate('/login'))}
        onMouseEnter={() => setBackHover(true)}
        onMouseLeave={() => setBackHover(false)}
        style={{
          position: "absolute", top: "32px", left: "48px",
          background: "none", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", gap: "8px",
          fontFamily: font, fontSize: "13px", letterSpacing: "0.25em",
          color: backHover ? green : "rgba(45,106,79,0.6)",
          textTransform: "uppercase", padding: 0, transition: "color 0.2s",
        }}
      >
        <span style={{ fontSize: "18px", lineHeight: 1 }}>←</span> Back
      </button>

      <div style={{
        position: "absolute", top: "30px",
        left: "50%", transform: "translateX(-50%)",
        fontSize: "22px", fontWeight: 700,
        color: green, letterSpacing: "0.05em",
      }}>
        Kerivaa
      </div>

      <div style={{ width: "100%", maxWidth: "420px", padding: "0 32px" }}>

        {!submitted ? (
          <>
            <div style={{
              fontSize: "10px", letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: "rgba(45,106,79,0.45)", marginBottom: "14px",
            }}>
              Account recovery
            </div>

            <h1 style={{
              fontSize: "clamp(38px, 5vw, 54px)",
              fontWeight: 700, lineHeight: 1.05,
              color: darkGreen, margin: "0 0 10px 0",
              letterSpacing: "-0.02em",
            }}>
              Forgot your<br />
              <span style={{ fontStyle: "italic", fontWeight: 300, color: green }}>
                password?
              </span>
            </h1>

            <p style={{
              fontSize: "15px", fontWeight: 300,
              color: "rgba(26,46,34,0.5)",
              margin: "0 0 48px 0",
              letterSpacing: "0.02em", lineHeight: 1.6,
            }}>
              Enter your email and we'll send you a link to reset it.
            </p>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "44px" }}>
                <label style={{
                  fontFamily: font, fontSize: "10px", letterSpacing: "0.35em",
                  textTransform: "uppercase", color: "rgba(45,106,79,0.55)",
                  display: "block", marginBottom: "4px",
                }}>
                  Email address
                </label>
                <input
                  style={inputStyle}
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                onMouseEnter={() => setBtnHover(true)}
                onMouseLeave={() => setBtnHover(false)}
                style={{
                  width: "100%", fontFamily: font,
                  fontSize: "16px", fontWeight: 600, letterSpacing: "0.06em",
                  background: loading ? "rgba(45,106,79,0.6)" : btnHover ? "#40916c" : green,
                  color: "#fff", border: "none",
                  padding: "16px 0", cursor: loading ? "not-allowed" : "pointer",
                  borderRadius: "999px",
                  transform: btnHover && !loading ? "translateY(-2px)" : "translateY(0)",
                  transition: "background 0.3s, transform 0.2s, box-shadow 0.2s",
                  boxShadow: btnHover && !loading
                    ? "0 8px 28px rgba(45,106,79,0.35)"
                    : "0 4px 16px rgba(45,106,79,0.2)",
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
                    Sending…
                  </>
                ) : "Send Reset Link"}
              </button>

              <p style={{
                textAlign: "center", marginTop: "28px",
                fontSize: "14px", fontWeight: 300,
                color: "rgba(26,46,34,0.45)", letterSpacing: "0.02em",
              }}>
                Remember your password?{" "}
                <span
                  onClick={() => navigate('/login')}
                  onMouseEnter={() => setLoginHover(true)}
                  onMouseLeave={() => setLoginHover(false)}
                  style={{
                    color: loginHover ? "#40916c" : green,
                    cursor: "pointer", fontStyle: "italic",
                    transition: "color 0.2s",
                  }}
                >
                  Sign in
                </span>
              </p>
            </form>
          </>
        ) : (
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: "64px", height: "64px", borderRadius: "50%",
              background: "rgba(45,106,79,0.08)",
              border: `1px solid rgba(45,106,79,0.2)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 28px",
              fontSize: "28px",
            }}>
              🌿
            </div>

            <div style={{
              fontSize: "10px", letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: "rgba(45,106,79,0.45)", marginBottom: "14px",
            }}>
              Check your inbox
            </div>

            <h1 style={{
              fontSize: "clamp(32px, 4.5vw, 48px)",
              fontWeight: 700, lineHeight: 1.05,
              color: darkGreen, margin: "0 0 16px 0",
              letterSpacing: "-0.02em",
            }}>
              Reset link<br />
              <span style={{ fontStyle: "italic", fontWeight: 300, color: green }}>
                on its way.
              </span>
            </h1>

            <p style={{
              fontSize: "15px", fontWeight: 300,
              color: "rgba(26,46,34,0.5)",
              margin: "0 0 12px 0",
              letterSpacing: "0.02em", lineHeight: 1.6,
            }}>
              We've sent a password reset link to
            </p>
            <p style={{
              fontSize: "15px", fontWeight: 600,
              color: darkGreen, marginBottom: "48px",
              letterSpacing: "0.02em",
            }}>
              {email}
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
                boxShadow: btnHover
                  ? "0 8px 28px rgba(45,106,79,0.35)"
                  : "0 4px 16px rgba(45,106,79,0.2)",
              }}
            >
              Back to Sign In
            </button>

            <p style={{
              textAlign: "center", marginTop: "20px",
              fontSize: "13px", fontWeight: 300,
              color: "rgba(26,46,34,0.4)", letterSpacing: "0.02em",
            }}>
              Didn't receive it?{" "}
              <span
                onClick={() => { setSubmitted(false); setEmail(""); }}
                onMouseEnter={() => setLoginHover(true)}
                onMouseLeave={() => setLoginHover(false)}
                style={{
                  color: loginHover ? "#40916c" : green,
                  cursor: "pointer", fontStyle: "italic",
                  transition: "color 0.2s",
                }}
              >
                Try again
              </span>
            </p>
          </div>
        )}
      </div>

      <div style={{
        position: "absolute", bottom: "32px",
        left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column",
        alignItems: "center", gap: "8px", opacity: 0.3,
      }}>
        <span style={{ fontSize: "9px", letterSpacing: "0.35em", color: green, textTransform: "uppercase" }}>
          Kerala awaits
        </span>
        <div style={{ width: "1px", height: "32px", background: green }} />
      </div>

    </div>
  );
}