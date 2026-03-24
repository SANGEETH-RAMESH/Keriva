import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { createTravel } from "../../../services/userService";

const INTERESTS = [
  {
    label: "Nature & Hills",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 20l5-8 4 5 3-4 6 7H3z" />
      </svg>
    ),
  },
  {
    label: "Beaches & Relaxation",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 17c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
        <path d="M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
      </svg>
    ),
  },
  {
    label: "Adventure & Trekking",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="12" x2="15" y2="14" />
      </svg>
    ),
  },
  {
    label: "Luxury & Private Tours",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" />
      </svg>
    ),
  },
  {
    label: "Culture & Heritage",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 10v11M12 10v11M16 10v11" />
      </svg>
    ),
  },
  {
    label: "Ayurveda & Wellness",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z" />
        <path d="M12 8v4M10 10h4" />
      </svg>
    ),
  },
  {
    label: "Family Trip",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="5" r="2" />
        <circle cx="15" cy="5" r="2" />
        <path d="M6 20v-5a3 3 0 013-3h6a3 3 0 013 3v5" />
        <line x1="9" y1="12" x2="9" y2="20" />
        <line x1="15" y1="12" x2="15" y2="20" />
      </svg>
    ),
  },
  {
    label: "Honeymoon",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
    ),
  },
  {
    label: "Friends Getaway",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    label: "Food & Culinary Trail",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 2v7c0 1.66 1.34 3 3 3s3-1.34 3-3V2" />
        <line x1="6" y1="12" x2="6" y2="22" />
        <line x1="21" y1="2" x2="21" y2="22" />
        <path d="M18 2c0 0 3 3 3 7s-3 5-3 5" />
      </svg>
    ),
  },
];

const BUDGETS = ["Comfortable", "Premium", "Luxury", "Ultra Luxury"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DURATIONS = ["3–4 Days", "5–6 Days", "7–8 Days", "9–10 Days", "11–14 Days", "15+ Days"];

// Inline error message component
function FieldError({ message }) {
  if (!message) return null;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "6px",
      marginTop: "6px",
      padding: "6px 10px",
      background: "rgba(192,57,43,0.06)",
      border: "1px solid rgba(192,57,43,0.2)",
      borderRadius: "6px",
      fontSize: "12px",
      color: "#c0392b",
      letterSpacing: "0.01em",
    }}>
      <span style={{ fontSize: "13px", flexShrink: 0 }}>⚠</span>
      {message}
    </div>
  );
}

export default function ShapeYourJourney() {
  const [selected, setSelected] = useState([]);
  const [budget, setBudget] = useState(null);
  const [dream, setDream] = useState("");
  const [month, setMonth] = useState("");
  const [duration, setDuration] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [country, setCountry] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const toggle = (label) =>
    setSelected((p) =>
      p.includes(label) ? p.filter((l) => l !== label) : [...p, label]
    );

  // Clear error on field change
  const clearError = (field) => {
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  function Toast({ message, type }) {
    if (!toast) return null;
    return (
      <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-lg text-sm font-medium transition-all duration-300
      ${type === "success" ? "bg-[#2d6a4f] text-white" : "bg-red-600 text-white"}`}>
        <span>{type === "success" ? "✓" : "✕"}</span>
        {message}
      </div>
    );
  }

  const validate = () => {
    const e = {};
    if (!dream.trim()) e.dream = "Please describe your dream journey";
    if (selected.length === 0) e.selected = "Select at least one interest";
    if (!budget) e.budget = "Please choose a travel style";
    if (!month) e.month = "Select a travel month";
    if (!duration) e.duration = "Select trip duration";
    if (!name.trim()) e.name = "Name is required";
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Enter a valid email address";
    if (!whatsapp.match(/^\+?[\d\s\-]{8,15}$/)) e.whatsapp = "Enter a valid WhatsApp number";
    if (!country.trim()) e.country = "Country is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };


  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleClick = async () => {

    const isValid = validate();
    if (!isValid) {

      setTimeout(() => {
        const el = document.querySelector(".syj-field-error");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);

      setTimeout(() => {
        setErrors({});
      }, 5000);

      return;
    }

    try {
      const data = { selected, budget, dream, month, duration, name, whatsapp, country };
      const response = await createTravel(data);
      if (response.data.message == "Journey Created") {
        showToast("Your journey has been submitted! We'll be in touch soon.");
        setSubmitted(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const inputBorder = (field) => errors[field] ? "1px solid #e0aaaa" : "1px solid #e0e0e0";
  const inputBg = (field) => errors[field] ? "#fff8f8" : "#fff";

  return (
    <>
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-lg text-sm font-medium
        ${toast.type === "success" ? "bg-[#2d6a4f] text-white" : "bg-red-600 text-white"}`}>
          <span className="text-base">{toast.type === "success" ? "✓" : "✕"}</span>
          {toast.message}
        </div>
      )}
      <style>{`
        .syj * { box-sizing: border-box; margin: 0; padding: 0; }
        .syj {
          font-family: system-ui, -apple-system, Arial, Helvetica, sans-serif;
          background: #F7F3ED;
          color: #1a1a18;
          padding: 90px 24px 120px;
        }
        .syj-inner { max-width: 720px; margin: 0 auto; }
        .syj-h1 { font-size: clamp(38px, 5.5vw, 60px); font-weight: 700; text-align: center; letter-spacing: -0.02em; line-height: 1.05; color: #111; margin-bottom: 14px; }
        .syj-sub1 { text-align: center; font-size: 16px; font-weight: 400; color: #555; margin-bottom: 5px; }
        .syj-sub2 { text-align: center; font-size: 14px; font-weight: 300; color: #888; margin-bottom: 64px; }
        .syj-section { margin-bottom: 40px; }
        .syj-field-label { font-size: 14px; font-weight: 600; color: #1a1a18; margin-bottom: 14px; display: block; }
        .syj-textarea { width: 100%; min-height: 110px; border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px 18px; font-family: system-ui, -apple-system, Arial, sans-serif; font-size: 16px; font-weight: 300; color: #1a1a18; resize: vertical; outline: none; transition: border-color 0.2s; line-height: 1.6; }
        .syj-textarea.has-error { border-color: #e0aaaa; background: #fff8f8; }
        .syj-textarea::placeholder { color: #c0bdb7; font-style: italic; }
        .syj-textarea:focus { border-color: #2d6a4f; }
        .syj-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
        @media (max-width: 580px) { .syj-grid { grid-template-columns: repeat(2, 1fr); } }
        .syj-card { border: 1px solid #e0e0e0; border-radius: 8px; padding: 18px 8px 14px; text-align: center; cursor: pointer; background: #fff; transition: border-color 0.2s, background 0.2s, box-shadow 0.2s, transform 0.15s; user-select: none; display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .syj-card:hover { border-color: #b0b0b0; box-shadow: 0 2px 10px rgba(0,0,0,0.07); transform: translateY(-1px); }
        .syj-card.active { border-color: #2d6a4f; background: #f4faf7; }
        .syj-grid.has-error .syj-card { border-color: #e0aaaa; }
        .syj-grid.has-error .syj-card.active { border-color: #2d6a4f; background: #f4faf7; }
        .syj-card-icon { color: #555; display: flex; align-items: center; justify-content: center; }
        .syj-card.active .syj-card-icon { color: #2d6a4f; }
        .syj-card-label { font-size: 11px; font-weight: 500; color: #555; line-height: 1.3; letter-spacing: 0.01em; }
        .syj-card.active .syj-card-label { color: #2d6a4f; }
        .syj-pill-row { display: flex; gap: 10px; flex-wrap: wrap; }
        .syj-pill { font-family: system-ui, -apple-system, Arial, sans-serif; font-size: 15px; font-weight: 500; border: 1.5px solid #ccc; border-radius: 999px; padding: 9px 22px; cursor: pointer; background: transparent; color: #333; transition: all 0.2s; }
        .syj-pill:hover { border-color: #888; color: #111; transform: translateY(-1px); }
        .syj-pill.active { border-color: #111; color: #111; font-weight: 700; }
        .syj-pill-row.has-error .syj-pill:not(.active) { border-color: #e0aaaa; }
        .syj-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        @media (max-width: 480px) { .syj-two-col { grid-template-columns: 1fr; } }
        .syj-select { width: 100%; font-family: system-ui, -apple-system, Arial, sans-serif; font-size: 15px; font-weight: 300; color: #333; background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='7' viewBox='0 0 11 7'%3E%3Cpath d='M1 1l4.5 4.5L10 1' stroke='%23999' stroke-width='1.4' fill='none' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat right 14px center; border: 1px solid #e0e0e0; border-radius: 8px; padding: 13px 16px; outline: none; appearance: none; cursor: pointer; transition: border-color 0.2s; }
        .syj-select.has-error { border-color: #e0aaaa; background-color: #fff8f8; }
        .syj-select:focus { border-color: #2d6a4f; }
        .syj-contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media (max-width: 480px) { .syj-contact-grid { grid-template-columns: 1fr; } }
        .syj-input { width: 100%; font-family: system-ui, -apple-system, Arial, sans-serif; font-size: 15px; font-weight: 300; color: #1a1a18; background: #fff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 13px 16px; outline: none; transition: border-color 0.2s, background 0.2s; }
        .syj-input::placeholder { color: #c0bdb7; }
        .syj-input:focus { border-color: #2d6a4f; background: #fff; }
        .syj-input.has-error { border-color: #e0aaaa; background: #fff8f8; }
        .syj-cta { width: 100%; font-family: system-ui, -apple-system, Arial, sans-serif; font-size: 17px; font-weight: 600; letter-spacing: 0.04em; background: #2d6a4f; color: #fff; border: none; border-radius: 999px; padding: 18px 40px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: background 0.25s, transform 0.2s; }
        .syj-cta:hover { background: #3a8a66; transform: translateY(-2px); }
        .syj-arrow { font-size: 18px; transition: transform 0.2s; }
        .syj-cta:hover .syj-arrow { transform: translateX(4px); }
        .syj-success { text-align: center; padding: 80px 0; }
        .syj-success-h { font-size: clamp(32px,5vw,50px); font-weight: 700; letter-spacing: -0.02em; margin-bottom: 14px; }
        .syj-success-p { font-size: 17px; font-style: italic; color: #888; font-weight: 300; line-height: 1.6; }
        .syj-field-error { display: flex; align-items: center; gap: 6px; margin-top: 6px; padding: 6px 10px; background: rgba(192,57,43,0.06); border: 1px solid rgba(192,57,43,0.2); border-radius: 6px; font-size: 12px; color: #c0392b; letter-spacing: 0.01em; }
      `}</style>

      <div className="syj">
        <div className="syj-inner">
          {submitted ? (
            <div className="syj-success">
              <div style={{ fontSize: 48, marginBottom: 24 }}>🌿</div>
              <h2 className="syj-success-h">Your Kerala is taking shape.</h2>
              <p className="syj-success-p">
                Our curators will craft something quiet and intentional — just for you.
              </p>
            </div>
          ) : (
            <>
              <h1 className="syj-h1">Shape Your Journey</h1>
              <p className="syj-sub1">Every traveler carries a quiet version of Kerala in their mind.</p>
              <p className="syj-sub2">Tell us yours — we'll shape it with intention.</p>

              {/* Dream */}
              <div className="syj-section">
                <span className="syj-field-label">Describe your dream</span>
                <textarea
                  className={`syj-textarea${errors.dream ? " has-error" : ""}`}
                  placeholder="I imagine waking to mist over tea gardens, spending afternoons on quiet water, and evenings with nothing but the sound of rain..."
                  value={dream}
                  onChange={(e) => { setDream(e.target.value); clearError("dream"); }}
                />
                {errors.dream && (
                  <div className="syj-field-error">
                    <span>⚠</span> {errors.dream}
                  </div>
                )}
              </div>

              {/* Interests */}
              <div className="syj-section">
                <span className="syj-field-label">What draws you?</span>
                <div className={`syj-grid${errors.selected ? " has-error" : ""}`}>
                  {INTERESTS.map(({ label, icon }) => (
                    <div
                      key={label}
                      className={`syj-card${selected.includes(label) ? " active" : ""}`}
                      onClick={() => { toggle(label); clearError("selected"); }}
                    >
                      <div className="syj-card-icon">{icon}</div>
                      <div className="syj-card-label">{label}</div>
                    </div>
                  ))}
                </div>
                {errors.selected && (
                  <div className="syj-field-error">
                    <span>⚠</span> {errors.selected}
                  </div>
                )}
              </div>

              {/* Budget */}
              <div className="syj-section">
                <span className="syj-field-label">How would you like to travel?</span>
                <div className={`syj-pill-row${errors.budget ? " has-error" : ""}`}>
                  {BUDGETS.map((b) => (
                    <button
                      key={b}
                      className={`syj-pill${budget === b ? " active" : ""}`}
                      onClick={() => { setBudget(b); clearError("budget"); }}
                    >
                      {b}
                    </button>
                  ))}
                </div>
                {errors.budget && (
                  <div className="syj-field-error">
                    <span>⚠</span> {errors.budget}
                  </div>
                )}
              </div>

              {/* Month + Duration */}
              <div className="syj-section">
                <div className="syj-two-col">
                  <div>
                    <span className="syj-field-label">When are you thinking?</span>
                    <select
                      className={`syj-select${errors.month ? " has-error" : ""}`}
                      value={month}
                      onChange={(e) => { setMonth(e.target.value); clearError("month"); }}
                    >
                      <option value="">Select month</option>
                      {MONTHS.map((m) => <option key={m}>{m}</option>)}
                    </select>
                    {errors.month && (
                      <div className="syj-field-error">
                        <span>⚠</span> {errors.month}
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="syj-field-label">How long?</span>
                    <select
                      className={`syj-select${errors.duration ? " has-error" : ""}`}
                      value={duration}
                      onChange={(e) => { setDuration(e.target.value); clearError("duration"); }}
                    >
                      <option value="">Select duration</option>
                      {DURATIONS.map((d) => <option key={d}>{d}</option>)}
                    </select>
                    {errors.duration && (
                      <div className="syj-field-error">
                        <span>⚠</span> {errors.duration}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="syj-section">
                <span className="syj-field-label" style={{ fontWeight: 400, fontSize: 18 }}>
                  Where should we send your journey?
                </span>
                <div style={{ height: 12 }} />
                <div className="syj-contact-grid">

                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <input
                      className={`syj-input${errors.name ? " has-error" : ""}`}
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => { setName(e.target.value); clearError("name"); }}
                    />
                    {errors.name && (
                      <div className="syj-field-error">
                        <span>⚠</span> {errors.name}
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <input
                      className={`syj-input${errors.email ? " has-error" : ""}`}
                      placeholder="Email"
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); clearError("email"); }}
                    />
                    {errors.email && (
                      <div className="syj-field-error">
                        <span>⚠</span> {errors.email}
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <input
                      className={`syj-input${errors.whatsapp ? " has-error" : ""}`}
                      placeholder="WhatsApp Number"
                      value={whatsapp}
                      onChange={(e) => { setWhatsapp(e.target.value); clearError("whatsapp"); }}
                    />
                    {errors.whatsapp && (
                      <div className="syj-field-error">
                        <span>⚠</span> {errors.whatsapp}
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <input
                      className={`syj-input${errors.country ? " has-error" : ""}`}
                      placeholder="Country"
                      value={country}
                      onChange={(e) => { setCountry(e.target.value); clearError("country"); }}
                    />
                    {errors.country && (
                      <div className="syj-field-error">
                        <span>⚠</span> {errors.country}
                      </div>
                    )}
                  </div>

                </div>
              </div>

              <button className="syj-cta" onClick={handleClick}>
                Design My Kerala <span className="syj-arrow">→</span>
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}