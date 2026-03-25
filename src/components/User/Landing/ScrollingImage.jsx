import { useEffect, useRef, useState } from "react";
import keralaVideo from '../../../assets/new.mp4';

const SCENES = [
  {
    eyebrow: "Alleppey Backwaters",
    title: ["Where", "Time", "Floats"],
    italic: 1,
    sub: "Drift through emerald canals aboard a traditional kettuvallam — Kerala's iconic houseboat.",
  },
  {
    eyebrow: "Athirappilly Falls",
    title: ["The", "Roar", "of Eden"],
    italic: 1,
    sub: "India's widest waterfall cascades 80 feet through the ancient Sholayar rainforest.",
  },
  {
    eyebrow: "Munnar Highlands",
    title: ["Endless", "Green", "Horizons"],
    italic: 1,
    sub: "Mist-kissed hills carpeted with the world's finest tea at 1,600 metres above the sea.",
  },
];

export default function KeralaLanding({ onStartDesigning, onMenuOpen }) {
  const sceneTimerRef = useRef(null);

  const [activeScene, setActiveScene] = useState(0);
  const [btnPrimaryHover, setBtnPrimaryHover] = useState(false);
  const [btnSecondaryHover, setBtnSecondaryHover] = useState(false);

  useEffect(() => {
    sceneTimerRef.current = setInterval(() => {
      setActiveScene(prev => (prev + 1) % SCENES.length);
    }, 4000);
    return () => clearInterval(sceneTimerRef.current);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&display=swap');
        html, body { margin: 0; padding: 0; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-h1   { animation: fadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.2s  both; }
        .hero-sub1 { animation: fadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.45s both; }
        .hero-sub2 { animation: fadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.6s  both; }
        .hero-btns { animation: fadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.78s both; }
      `}</style>

      <div style={{
        position: "relative",
        height: "100vh",
        background: "#000",
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        color: "#fff",
        overflow: "hidden",
      }}>

        <video
          src={keralaVideo}
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />

        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.65) 100%)",
        }} />

        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          zIndex: 2, textAlign: "center", padding: "0 24px",
        }}>
          <h1 className="hero-h1" style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(58px, 9vw, 118px)", fontWeight: 700,
            lineHeight: 1.0, color: "#fff",
            textShadow: "0 2px 40px rgba(0,0,0,0.4)",
            margin: "0 0 24px 0", letterSpacing: "-0.02em",
          }}>
            Design Your<br />Kerala.
          </h1>

          <p className="hero-sub1" style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(16px, 1.6vw, 20px)", fontWeight: 400,
            color: "rgba(255,255,255,0.88)", letterSpacing: "0.02em",
            margin: "0 0 6px 0",
          }}>
            Not the one in brochures.
          </p>
          <p className="hero-sub2" style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(16px, 1.6vw, 20px)", fontStyle: "italic",
            fontWeight: 400, color: "rgba(255,255,255,0.88)",
            letterSpacing: "0.02em", margin: "0 0 48px 0",
          }}>
            The one you've been imagining.
          </p>

          <div className="hero-btns" style={{
            display: "flex", gap: "14px",
            justifyContent: "center", alignItems: "center", flexWrap: "wrap",
          }}>
            <button
              onClick={onStartDesigning}
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "16px", fontWeight: 600, letterSpacing: "0.03em",
                background: btnPrimaryHover ? "#40916c" : "#2d6a4f",
                color: "#fff", border: "none",
                padding: "14px 34px", cursor: "pointer", borderRadius: "999px",
                transform: btnPrimaryHover ? "translateY(-2px)" : "translateY(0)",
                transition: "background 0.3s, transform 0.2s",
                boxShadow: "0 4px 20px rgba(45,106,79,0.4)",
              }}
              onMouseEnter={() => setBtnPrimaryHover(true)}
              onMouseLeave={() => setBtnPrimaryHover(false)}
            >
              Start Designing
            </button>
            <button
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "16px", fontWeight: 600, letterSpacing: "0.03em",
                background: "transparent", color: "#fff",
                border: `2px solid ${btnSecondaryHover ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.65)"}`,
                padding: "14px 34px", cursor: "pointer", borderRadius: "999px",
                transform: btnSecondaryHover ? "translateY(-2px)" : "translateY(0)",
                transition: "border-color 0.3s, transform 0.2s",
              }}
              onMouseEnter={() => setBtnSecondaryHover(true)}
              onMouseLeave={() => setBtnSecondaryHover(false)}
            >
              Explore Experiences
            </button>
          </div>
        </div>

        {SCENES.map((s, i) => (
          <div key={i} style={{
            position: "absolute", bottom: "10vh", left: "56px", zIndex: 2,
            opacity: activeScene === i ? 1 : 0,
            transform: activeScene === i ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.75s ease, transform 0.75s ease",
            pointerEvents: "none",
          }}>
            <div style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "11px", letterSpacing: "0.45em",
              color: "rgba(255,255,255,0.5)", textTransform: "uppercase",
              marginBottom: "10px",
            }}>{s.eyebrow}</div>
            <p style={{
              fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 300,
              lineHeight: 1.05, color: "rgba(255,255,255,0.7)",
              textShadow: "0 2px 20px rgba(0,0,0,0.4)", margin: 0,
            }}>
              {s.title.map((word, wi) => (
                <span key={wi}>
                  <span style={wi === s.italic
                    ? { fontStyle: "italic", color: "rgba(255,255,255,0.6)" }
                    : {}}>
                    {word}
                  </span>
                  {wi < s.title.length - 1 && <br />}
                </span>
              ))}
            </p>
            <p style={{
              marginTop: "10px", fontSize: "13px", fontWeight: 300,
              letterSpacing: "0.03em", color: "rgba(255,255,255,0.45)",
              maxWidth: "320px", lineHeight: 1.7,
            }}>{s.sub}</p>
          </div>
        ))}

        <div style={{
          position: "absolute", right: "40px", bottom: "90px",
          display: "flex", flexDirection: "column", gap: "12px",
          alignItems: "center", zIndex: 2,
        }}>
          {SCENES.map((_, i) => (
            <div key={i} style={{
              width: "5px", height: "5px", borderRadius: "50%",
              background: activeScene === i ? "#fff" : "rgba(255,255,255,0.28)",
              transform: activeScene === i ? "scale(1.7)" : "scale(1)",
              transition: "background 0.4s, transform 0.4s",
            }} />
          ))}
        </div>

      </div>
    </>
  );
}