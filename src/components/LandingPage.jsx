import { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import KeralaLanding from "./ScrollingImage";
import { useDispatch } from "react-redux";
import { logout } from "../redux/userAuthSlice";
import ShapeYourJourney from "./ShapeYourJourney";

export default function LandingPage() {
  const syjRef = useRef(null);
  const [showNav, setShowNav] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("userAccessToken"));
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowNav(entry.isIntersecting),
      { threshold: 0.05 }
    );
    if (syjRef.current) observer.observe(syjRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onStorage = () => setIsLoggedIn(!!localStorage.getItem("userAccessToken"));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleLogout = () => {
    dispatch(logout({ isLoggedIn: false }))
    setIsLoggedIn(false);
    navigate("/");
  };

  const scrollToForm = () => {
    const top = syjRef.current?.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div style={{ margin: 0, padding: 0 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&display=swap');

        .kerivaa-drawer {
          position: fixed;
          top: 0; left: 0;
          width: 320px; height: 100vh;
          background: #eef2ef;
          z-index: 200;
          transform: translateX(-100%);
          transition: transform 0.45s cubic-bezier(0.77, 0, 0.175, 1);
          display: flex; flex-direction: column;
          padding: 48px 40px;
          box-shadow: 4px 0 32px rgba(0,0,0,0.08);
        }
        .kerivaa-drawer.open { transform: translateX(0); }

        .kerivaa-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.25);
          z-index: 150; opacity: 0; pointer-events: none;
          transition: opacity 0.4s ease;
        }
        .kerivaa-overlay.open { opacity: 1; pointer-events: auto; }

        .kerivaa-nav-item {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 22px; font-weight: 500;
          letter-spacing: 0.02em; color: #1a1a18;
          cursor: pointer; padding: 14px 0;
          border-bottom: 1px solid rgba(0,0,0,0.07);
          transition: color 0.2s, padding-left 0.2s;
          display: block !important; margin: 0 !important;
        }
        .kerivaa-nav-item:first-child {
          color: #2d6a4f; background: rgba(45,106,79,0.08);
          border-radius: 8px; padding: 14px 16px;
          border-bottom: none; margin-bottom: 8px !important;
        }
        .kerivaa-nav-item:hover { color: #2d6a4f; padding-left: 8px; }
        .kerivaa-nav-item:first-child:hover { padding-left: 16px; }

        .hamburger-bar {
          width: 24px; height: 2px;
          background: currentColor; border-radius: 2px;
          transition: transform 0.3s ease, opacity 0.3s ease;
          display: block;
        }

        .kerivaa-login-btn {
          background: none;
          border: 1.5px solid #2d6a4f;
          border-radius: 6px; cursor: pointer;
          padding: 6px 20px;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 15px; font-weight: 600;
          color: #2d6a4f; letter-spacing: 0.04em;
          transition: background 0.2s, color 0.2s;
        }
        .kerivaa-login-btn:hover { background: #2d6a4f; color: #fff; }

        .kerivaa-register-btn {
          background: #2d6a4f;
          border: 1.5px solid #2d6a4f;
          border-radius: 6px; cursor: pointer;
          padding: 6px 20px;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 15px; font-weight: 600;
          color: #fff; letter-spacing: 0.04em;
          transition: background 0.2s, color 0.2s;
        }
        .kerivaa-register-btn:hover { background: #235840; border-color: #235840; }

        .kerivaa-logout-btn {
          background: none;
          border: 1.5px solid rgba(45,106,79,0.4);
          border-radius: 6px; cursor: pointer;
          padding: 6px 20px;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 15px; font-weight: 600;
          color: rgba(45,106,79,0.7); letter-spacing: 0.04em;
          transition: background 0.2s, color 0.2s, border-color 0.2s;
        }
        .kerivaa-logout-btn:hover {
          background: rgba(192,57,43,0.07);
          border-color: #c0392b;
          color: #c0392b;
        }
      `}</style>

      <div
        className={`kerivaa-overlay${menuOpen ? " open" : ""}`}
        onClick={() => setMenuOpen(false)}
      />

      <div className={`kerivaa-drawer${menuOpen ? " open" : ""}`}>
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: "40px",
        }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "22px", fontWeight: 700,
            color: "#2d6a4f", letterSpacing: "0.04em",
          }}>Kerivaa</span>
          <button
            onClick={() => setMenuOpen(false)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: "24px", color: "#555", lineHeight: 1, padding: "4px",
            }}
          >✕</button>
        </div>

        <nav style={{ display: "flex", flexDirection: "column" }}>
          {["Home", "Experiences", "Explore Kerala", "About", "Gateway", "Journal", "Contact"].map((item) => (
            <span key={item} className="kerivaa-nav-item" onClick={() => setMenuOpen(false)}>
              {item}
            </span>
          ))}
        </nav>

        <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
          {isLoggedIn ? (
            <button
              className="kerivaa-logout-btn"
              onClick={() => { handleLogout(); setMenuOpen(false); }}
            >
              Logout
            </button>
          ) : (
            <>
              <button
                className="kerivaa-register-btn"
                onClick={() => { navigate("/signup"); setMenuOpen(false); }}
              >
                Register
              </button>
              <button
                className="kerivaa-login-btn"
                onClick={() => { navigate("/login"); setMenuOpen(false); }}
              >
                Login
              </button>
            </>
          )}
        </div>

        <div style={{
          marginTop: "auto",
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "13px", fontStyle: "italic",
          color: "#aaa", letterSpacing: "0.03em",
        }}>
          Design your Kerala.
        </div>
      </div>

      <nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0,
          zIndex: 100, height: "64px",
          background: "#eef2ef", borderBottom: "1px solid #d4ddd6",
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          padding: "0 48px",
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          opacity: showNav ? 1 : 0,
          pointerEvents: showNav ? "auto" : "none",
          transform: showNav ? "translateY(0)" : "translateY(-8px)",
          transition: "opacity 0.35s ease, transform 0.35s ease",
        }}
      >
        <span style={{ fontSize: "22px", fontWeight: 700, color: "#2d6a4f", letterSpacing: "0.04em" }}>
          Kerivaa
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {isLoggedIn ? (
            <button className="kerivaa-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <>
              <button className="kerivaa-login-btn" onClick={() => navigate("/login")}>
                Login
              </button>
              <button className="kerivaa-register-btn" onClick={() => navigate("/signup")}>
                Register
              </button>
            </>
          )}

          <button
            onClick={() => setMenuOpen(true)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              display: "flex", flexDirection: "column",
              gap: "5px", padding: "4px", color: "#2d6a4f",
            }}
          >
            {[0, 1, 2].map((i) => (
              <span key={i} className="hamburger-bar" />
            ))}
          </button>
        </div>
      </nav>

      <KeralaLanding onStartDesigning={scrollToForm} onMenuOpen={() => setMenuOpen(true)} />

      <div ref={syjRef} style={{ position: "relative", zIndex: 10, background: "#fff" }}>
        <ShapeYourJourney />
      </div>
    </div>
  );
}