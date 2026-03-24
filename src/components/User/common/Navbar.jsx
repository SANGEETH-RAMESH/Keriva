import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/userAuthSlice";
import logo from '../../../assets/logo.png';

const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "Experiences", path: "/experience" },
  { name: "Explore Kerala", path: "/explore-kerala" },
  { name: "About", path: "/about" },
  { name: "Gateway", path: "/gateway" },
  { name: "Journal", path: "/journal" },
  { name: "Contact", path: "/contact" },
];

export default function Navbar({ onStartDesigning, pastHero = false,navBg,hidden  }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("userAccessToken"));
  const [hoveredLink, setHoveredLink] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    const onStorage = () => setIsLoggedIn(!!localStorage.getItem("userAccessToken"));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleNavClick = (path) => { navigate(path); setMenuOpen(false); };

  const handleLogout = () => {
    dispatch(logout({ isLoggedIn: false }));
    setIsLoggedIn(false);
    navigate("/");
    setMenuOpen(false);
  };

  const font = "'Cormorant Garamond', Georgia, serif";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&display=swap');

        /* nb = navbar prefix to avoid global collisions */
        @media (min-width: 769px) {
          .nb-desktop { display: flex !important; }
          .nb-mobile  { display: none  !important; }
        }
        @media (max-width: 768px) {
          .nb-desktop { display: none  !important; }
          .nb-mobile  { display: flex  !important; }
        }

        .nb-link {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 17px; font-weight: 400;
          letter-spacing: 0.02em;
          padding: 12px 0;
          border: none; background: none;
          cursor: pointer; text-align: left; width: 100%;
          color: #2a2a2a;
          border-bottom: 1px solid rgba(45,106,79,0.1);
          transition: color 0.2s, padding-left 0.2s;
        }
        .nb-link:hover, .nb-link.active { color: #2d6a4f; padding-left: 6px; }
        .nb-link:last-of-type { border-bottom: none; }
      `}</style>

      <div
        onClick={() => setMenuOpen(false)}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.32)",
          zIndex: 150,
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transition: "opacity 0.4s ease",
        }}
      />

      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: "fixed", top: 0, left: 0,
          width: "min(300px, 84vw)",
          height: "100dvh",
          background: "#eef2ef",
          zIndex: 200,
          transform: menuOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.45s cubic-bezier(0.77,0,0.175,1)",
          display: "flex", flexDirection: "column",
          padding: "44px 28px 32px",
          boxShadow: "4px 0 32px rgba(0,0,0,0.12)",
          overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <img src={logo} alt="Kerivaa" style={{ height: 48, objectFit: "contain" }} />
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#666", padding: 4 }}
          >✕</button>
        </div>

        <nav style={{ display: "flex", flexDirection: "column" }}>
          {NAV_LINKS.map((item) => (
            <button
              key={item.name}
              className={`nb-link${location.pathname === item.path ? " active" : ""}`}
              onClick={() => handleNavClick(item.path)}
            >
              {item.name}
            </button>
          ))}
        </nav>

        {/* <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 10 }}>
          {isLoggedIn ? (
            <button onClick={handleLogout} style={{
              width: "100%", background: "none",
              border: "1.5px solid rgba(45,106,79,0.4)", borderRadius: 8,
              padding: "11px 0", fontFamily: font, fontSize: 15, fontWeight: 600,
              color: "rgba(45,106,79,0.8)", cursor: "pointer",
            }}>Logout</button>
          ) : (
            <>
              <button onClick={() => { navigate("/signup"); setMenuOpen(false); }} style={{
                width: "100%", background: "#2d6a4f",
                border: "1.5px solid #2d6a4f", borderRadius: 8,
                padding: "11px 0", fontFamily: font, fontSize: 15, fontWeight: 600,
                color: "#fff", cursor: "pointer",
              }}>Register</button>
              <button onClick={() => { navigate("/login"); setMenuOpen(false); }} style={{
                width: "100%", background: "none",
                border: "1.5px solid #2d6a4f", borderRadius: 8,
                padding: "11px 0", fontFamily: font, fontSize: 15, fontWeight: 600,
                color: "#2d6a4f", cursor: "pointer",
              }}>Login</button>
            </>
          )}
        </div> */}

        <p style={{ marginTop: "auto", paddingTop: 24, fontFamily: font, fontSize: 13, fontStyle: "italic", color: "#aaa" }}>
          Design your Kerala.
        </p>
      </div>

      <nav style={{
  position: "fixed", top: 0, left: 0, right: 0,
  zIndex: 100, height: 72,
  display: "flex", alignItems: "center", justifyContent: "space-between",
  padding: "0 clamp(16px, 4vw, 40px)",
  background: pastHero ? "#ffffff" : "transparent",
  boxShadow: pastHero ? "0 1px 0 rgba(0,0,0,0.07)" : "none",
  opacity: hidden ? 0 : 1,                              // ← add this
  pointerEvents: hidden ? "none" : "auto",              // ← add this
  transition: "background 0.4s ease, box-shadow 0.4s ease, opacity 0.3s ease",  // ← add opacity here
}}>

        <div onClick={() => navigate("/")} style={{ cursor: "pointer", display: "flex", alignItems: "center", flexShrink: 0 }}>
          <img src={logo} alt="Kerivaa" style={{ height: 56, objectFit: "contain" }} />
        </div>

        {pastHero && (
          <div className="nb-desktop" style={{
            alignItems: "center", gap: 2,
            position: "absolute", left: "50%", transform: "translateX(-50%)",
          }}>
            {NAV_LINKS.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.path)}
                  onMouseEnter={() => setHoveredLink(item.name)}
                  onMouseLeave={() => setHoveredLink(null)}
                  style={{
                    fontFamily: font, fontSize: 16, fontWeight: 400,
                    letterSpacing: "0.02em", padding: "6px 12px",
                    border: "none", borderRadius: 6, whiteSpace: "nowrap",
                    cursor: "pointer",
                    color: isActive || hoveredLink === item.name ? "#2d6a4f" : "#2a2a2a",
                    background: hoveredLink === item.name ? "rgba(45,106,79,0.07)" : "none",
                    transition: "color 0.2s, background 0.2s",
                  }}
                >
                  {item.name}
                </button>
              );
            })}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>

          {/* {pastHero && (
            <div className="nb-desktop" style={{ alignItems: "center", gap: 10 }}>
              {isLoggedIn ? (
                <button onClick={handleLogout} style={{
                  background: "none", border: "1.5px solid rgba(45,106,79,0.4)",
                  borderRadius: 6, cursor: "pointer", padding: "6px 18px",
                  fontFamily: font, fontSize: 14, fontWeight: 600,
                  color: "rgba(45,106,79,0.8)", letterSpacing: "0.04em",
                }}>Logout</button>
              ) : (
                <>
                  <button onClick={() => navigate("/login")} style={{
                    background: "none", border: "1.5px solid #2d6a4f",
                    borderRadius: 6, cursor: "pointer", padding: "6px 18px",
                    fontFamily: font, fontSize: 14, fontWeight: 600,
                    color: "#2d6a4f", letterSpacing: "0.04em",
                  }}>Login</button>
                  <button onClick={() => navigate("/signup")} style={{
                    background: "#2d6a4f", border: "1.5px solid #2d6a4f",
                    borderRadius: 6, cursor: "pointer", padding: "6px 18px",
                    fontFamily: font, fontSize: 14, fontWeight: 600,
                    color: "#fff", letterSpacing: "0.04em",
                  }}>Register</button>
                </>
              )}
            </div>
          )} */}

         
          {!pastHero ? (
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              style={{
                background: "none", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: 6, minWidth: 36, minHeight: 36,
              }}
            >
              <span style={{ fontSize: 26, lineHeight: 1, color: "#ffffff", fontWeight: 700, userSelect: "none" }}>⋮</span>
            </button>
          ) : (
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="nb-mobile"
              style={{
                background: "none", border: "none", cursor: "pointer",
                flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                gap: 5, padding: 6, minWidth: 36, minHeight: 36,
              }}
            >
              {[0, 1, 2].map((i) => (
                <span key={i} style={{ width: 22, height: 2, borderRadius: 2, display: "block", background: "#2d6a4f" }} />
              ))}
            </button>
          )}
        </div>
      </nav>
    </>
  );
}