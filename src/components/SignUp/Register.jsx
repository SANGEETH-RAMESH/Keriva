import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "../../services/userService";

const font = "'Cormorant Garamond', Georgia, serif";
const green = "#2d6a4f";
const darkGreen = "#1a2e22";
const strengthColors = ["#e74c3c", "#e67e22", "#f1c40f", "#2d6a4f"];

function Toast({ message, onClose }) {
  return (
    <div style={{
      position: "fixed", top: "32px", left: "50%",
      transform: "translateX(-50%)",
      zIndex: 999,
      display: "flex", alignItems: "center", gap: "12px",
      background: "#fff",
      border: `1px solid rgba(45,106,79,0.2)`,
      borderLeft: `4px solid ${green}`,
      borderRadius: "10px",
      padding: "14px 20px",
      boxShadow: "0 8px 32px rgba(45,106,79,0.12)",
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
      <span style={{ fontSize: "20px" }}>🌿</span>
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: "13px", fontWeight: 600,
          color: darkGreen, letterSpacing: "0.01em",
        }}>
          Account created!
        </div>
        <div style={{
          fontSize: "12px", color: "rgba(26,46,34,0.5)",
          marginTop: "2px", letterSpacing: "0.01em",
        }}>
          {message}
        </div>
      </div>
      <button
        onClick={onClose}
        style={{
          background: "none", border: "none", cursor: "pointer",
          color: "rgba(45,106,79,0.4)", fontSize: "16px",
          lineHeight: 1, padding: "2px",
        }}
      >
        ✕
      </button>
    </div>
  );
}

export default function Register({ onClose, onBack }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(null);
  const [btnHover, setBtnHover] = useState(false);
  const [linkHover, setLinkHover] = useState(false);
  const [backHover, setBackHover] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const passwordStrength = Math.min(Math.floor(form.password.length / 3), 4);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 4000);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Enter a valid email";
    if (!form.phone.match(/^\+?[\d\s\-]{8,15}$/)) e.phone = "Enter a valid phone number";
    if (form.password.length < 8) e.password = "Password must be at least 8 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const response = await signUp(form);
      console.log(response,'REsponse')
      if (response.data?.user) {
        showToast(`Welcome, ${response.data.user.name || "traveller"}! Your Kerala journey begins.`);
        setTimeout(() => navigate("/login"), 2500);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const inputStyle = (field) => ({
    width: "100%",
    background: "transparent",
    border: "none",
    borderBottom: `1px solid ${errors[field] ? "#c0392b" : focused === field ? green : "rgba(45,106,79,0.25)"}`,
    padding: "10px 0",
    fontFamily: font,
    fontSize: "17px",
    fontWeight: 400,
    color: darkGreen,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.3s",
    letterSpacing: "0.02em",
  });

  const labelStyle = {
    fontFamily: font,
    fontSize: "10px",
    letterSpacing: "0.35em",
    textTransform: "uppercase",
    color: "rgba(45,106,79,0.55)",
    display: "block",
    marginBottom: "4px",
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 300,
      background: "#eef2ef",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: font,
      overflow: "hidden",
    }}>

      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* Decorative blobs */}
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

      {/* Back button */}
      <button
        onClick={onClose || onBack}
        onMouseEnter={() => setBackHover(true)}
        onMouseLeave={() => setBackHover(false)}
        style={{
          position: "absolute", top: "32px", left: "48px",
          background: "none", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", gap: "8px",
          fontFamily: font,
          fontSize: "13px", letterSpacing: "0.25em",
          color: backHover ? green : "rgba(45,106,79,0.6)",
          textTransform: "uppercase",
          padding: 0,
          transition: "color 0.2s",
        }}
      >
        <span style={{ fontSize: "18px", lineHeight: 1 }}>←</span> Back
      </button>

      {/* Logo */}
      <div style={{
        position: "absolute", top: "30px",
        left: "50%", transform: "translateX(-50%)",
        fontSize: "22px", fontWeight: 700,
        color: green, letterSpacing: "0.05em",
      }}>
        Kerivaa
      </div>

      {/* Card */}
      <div style={{ width: "100%", maxWidth: "420px", padding: "0 32px" }}>

        <div style={{
          fontSize: "10px", letterSpacing: "0.4em",
          textTransform: "uppercase",
          color: "rgba(45,106,79,0.45)",
          marginBottom: "14px",
        }}>
          Begin your journey
        </div>

        <h1 style={{
          fontSize: "clamp(38px, 5vw, 54px)",
          fontWeight: 700, lineHeight: 1.05,
          color: darkGreen,
          margin: "0 0 10px 0",
          letterSpacing: "-0.02em",
        }}>
          Create your<br />
          <span style={{ fontStyle: "italic", fontWeight: 300, color: green }}>
            Kerala story.
          </span>
        </h1>

        <p style={{
          fontSize: "15px", fontWeight: 300,
          color: "rgba(26,46,34,0.5)",
          margin: "0 0 40px 0",
          letterSpacing: "0.02em",
          lineHeight: 1.6,
        }}>
          Start designing your perfect journey today.
        </p>

        <form onSubmit={handleSubmit}>

          {/* Name */}
          <div style={{ marginBottom: "28px" }}>
            <label style={labelStyle}>Full Name</label>
            <input
              style={inputStyle("name")}
              type="text"
              placeholder="Arjun Menon"
              value={form.name}
              onChange={e => handleChange("name", e.target.value)}
              onFocus={() => setFocused("name")}
              onBlur={() => setFocused(null)}
            />
            {errors.name && (
              <span style={{ fontSize: "11px", color: "#c0392b", letterSpacing: "0.02em" }}>
                ⚠ {errors.name}
              </span>
            )}
          </div>

          {/* Email */}
          <div style={{ marginBottom: "28px" }}>
            <label style={labelStyle}>Email Address</label>
            <input
              style={inputStyle("email")}
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => handleChange("email", e.target.value)}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
            />
            {errors.email && (
              <span style={{ fontSize: "11px", color: "#c0392b", letterSpacing: "0.02em" }}>
                ⚠ {errors.email}
              </span>
            )}
          </div>

          {/* Phone */}
          <div style={{ marginBottom: "28px" }}>
            <label style={labelStyle}>Phone Number</label>
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-end" }}>
              <select
                defaultValue="+91"
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid rgba(45,106,79,0.25)",
                  padding: "10px 0",
                  fontFamily: font,
                  fontSize: "17px",
                  color: darkGreen,
                  outline: "none",
                  cursor: "pointer",
                  WebkitAppearance: "none",
                  width: "80px",
                  letterSpacing: "0.02em",
                }}
              >
                <option value="+91">🇮🇳 +91</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
                <option value="+971">🇦🇪 +971</option>
                <option value="+65">🇸🇬 +65</option>
                <option value="+61">🇦🇺 +61</option>
              </select>
              <input
                style={{ ...inputStyle("phone"), flex: 1, width: "auto" }}
                type="tel"
                placeholder="98765 43210"
                value={form.phone}
                onChange={e => handleChange("phone", e.target.value)}
                onFocus={() => setFocused("phone")}
                onBlur={() => setFocused(null)}
              />
            </div>
            {errors.phone && (
              <span style={{ fontSize: "11px", color: "#c0392b", letterSpacing: "0.02em" }}>
                ⚠ {errors.phone}
              </span>
            )}
          </div>

          {/* Password */}
          <div style={{ marginBottom: "40px" }}>
            <label style={labelStyle}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                style={{ ...inputStyle("password"), paddingRight: "32px" }}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={e => handleChange("password", e.target.value)}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused(null)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                style={{
                  position: "absolute", right: "0", top: "50%",
                  transform: "translateY(-50%)", background: "none",
                  border: "none", cursor: "pointer", color: "rgba(45,106,79,0.5)",
                  fontSize: "15px", lineHeight: 1, padding: 0,
                }}
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
            {form.password.length > 0 && (
              <div style={{ display: "flex", gap: "4px", marginTop: "8px" }}>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} style={{
                    flex: 1, height: "2px", borderRadius: "2px",
                    background: i <= passwordStrength
                      ? strengthColors[passwordStrength - 1]
                      : "rgba(45,106,79,0.15)",
                    transition: "background 0.3s",
                  }} />
                ))}
              </div>
            )}
            {errors.password && (
              <span style={{ fontSize: "11px", color: "#c0392b", letterSpacing: "0.02em" }}>
                ⚠ {errors.password}
              </span>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
            style={{
              width: "100%",
              fontFamily: font,
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
            Create Account
          </button>

          <p style={{
            textAlign: "center", marginTop: "28px",
            fontSize: "14px", fontWeight: 300,
            color: "rgba(26,46,34,0.45)", letterSpacing: "0.02em",
          }}>
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              onMouseEnter={() => setLinkHover(true)}
              onMouseLeave={() => setLinkHover(false)}
              style={{
                color: linkHover ? "#40916c" : green,
                cursor: "pointer", fontStyle: "italic",
                transition: "color 0.2s",
              }}
            >
              Sign in
            </span>
          </p>

        </form>
      </div>

      {/* Bottom decorative line */}
      <div style={{
        position: "absolute", bottom: "32px",
        left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column",
        alignItems: "center", gap: "8px",
        opacity: 0.3,
      }}>
        <span style={{
          fontSize: "9px", letterSpacing: "0.35em",
          color: green, textTransform: "uppercase",
        }}>
          Kerala awaits
        </span>
        <div style={{ width: "1px", height: "32px", background: green }} />
      </div>

    </div>
  );
}