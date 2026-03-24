import { useState, useEffect, useRef } from "react";

import { getExploreKerala } from '../../../services/userService';

function useFadeIn(options = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.12, ...options }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, visible];
}



export default function ExploreKerala() {
  const [hoveredPlace, setHoveredPlace] = useState(null);
  const [hoveredExp, setHoveredExp] = useState(null);

  const [historyRef, historyVis] = useFadeIn();
  const [regionsRef, regionsVis] = useFadeIn();
  const [placesRef, placesVis] = useFadeIn();
  const [expRef, expVis] = useFadeIn();
  const [cultureRef, cultureVis] = useFadeIn();
  const [tipsRef, tipsVis] = useFadeIn();
  const [ctaRef, ctaVis] = useFadeIn();
  const [data, setData] = useState([]);

  const regions = data.filter(item => item.type === "region" && item.is_active);
  const places = data.filter(item => item.type === "place" && item.is_active);
  const experiences = data.filter(item => item.type === "experience" && item.is_active);
  const tips = data.filter(item => item.type === "tip" && item.is_active);
  console.log("PLACES:", places);

  const hero = data.find(item => item.type === "hero" && item.is_active);
  const history = data.find(item => item.type === "history" && item.is_active);

  useEffect(() => {
    const fetchExploreKerala = async () => {
      try {
        const response = await getExploreKerala();
        console.log(response.data, "Exploree ")
        const { explorekerala } = response.data;
        setData(explorekerala)
      } catch (error) {
        console.log(error);
      }
    }
    fetchExploreKerala();
  }, [])

  const font = "'Cormorant Garamond', Georgia, serif";
  const body = "system-ui, -apple-system, Arial, Helvetica, sans-serif";

  return (
    <>
      <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap');
  
  .explore-kerala-root * { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes heroFadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes heroSubFadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .hero-title {
    animation: heroFadeUp 0.75s cubic-bezier(0.22,1,0.36,1) 0.1s both;
  }
  .hero-sub {
    animation: heroSubFadeUp 0.75s cubic-bezier(0.22,1,0.36,1) 0.35s both;
  }

  .fade-up {
    opacity: 0;
    transform: translateY(32px);
    transition: opacity 0.65s cubic-bezier(0.22,1,0.36,1), transform 0.65s cubic-bezier(0.22,1,0.36,1);
  }
  .fade-up.visible {
    opacity: 1;
    transform: translateY(0);
  }

 .stagger-child {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.55s cubic-bezier(0.22,1,0.36,1),
              transform 0.55s cubic-bezier(0.22,1,0.36,1);
}

.stagger-parent.visible .stagger-child {
  opacity: 1;
  transform: translateY(0);
}
`}</style>

      <div className="explore-kerala-root" style={{ background: "#f9f7f4", paddingTop: 64 }}>

        {/* Hero */}
        <section style={{
          textAlign: "center",
          padding: "72px 24px 64px",
          background: "#f0ece4",
          width: "100%",
        }}>
          <h1 className="hero-title" style={{
            fontFamily: font, fontSize: "clamp(36px, 6vw, 56px)",
            fontWeight: 700, color: "#1a2e1f", letterSpacing: "-0.01em",
            marginBottom: 16,
          }}>{hero?.title}</h1>
          <p className="hero-sub" style={{
            lineHeight: 1.7, maxWidth: 420, margin: "0 auto",
          }}>
            {hero?.description}
          </p>
        </section>

        {/* History */}
        <section ref={historyRef} className={`fade-up${historyVis ? " visible" : ""}`} style={{ padding: "72px 48px", maxWidth: 860, margin: "0 auto" }}>
          <h2 style={{
            fontFamily: font, fontSize: 32, fontWeight: 700,
            color: "#1a2e1f", marginBottom: 20,
          }}>{history?.title}</h2>
          <p style={{
            fontFamily: body, fontSize: 15, color: "#4a5e50",
            lineHeight: 1.8,
          }}>
            {history?.description}
          </p>
        </section>

        {/* Regions */}
        <section ref={regionsRef} className={`fade-up${regionsVis ? " visible" : ""}`} style={{ padding: "64px 48px", background: "#edf2ee" }}>
          <h2 style={{
            fontFamily: font, fontSize: 36, fontWeight: 700,
            color: "#1a2e1f", textAlign: "center", marginBottom: 48,
          }}>Regions of Kerala</h2>
          <div className={`stagger-parent${regionsVis ? " visible" : ""}`} style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 28, maxWidth: 960, margin: "0 auto",
          }}>
            {regions.map((r) => (
              <div key={r._id} className="stagger-child" style={{
                background: "#fff", borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
              }}>
                <img
                  src={r.image} alt={r.title}
                  style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }}
                />
                <div style={{ padding: "18px 20px 22px" }}>
                  <div style={{
                    fontFamily: font, fontSize: 20, fontWeight: 700,
                    color: "#1a2e1f", marginBottom: 8,
                  }}>{r.title}</div>
                  <div style={{
                    fontFamily: body, fontSize: 13, color: "#6a7c6e", lineHeight: 1.6,
                  }}>{r.description}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Top Places */}
        <section ref={placesRef} className={`fade-up${placesVis ? " visible" : ""}`} style={{ padding: "72px 48px", textAlign: "center" }}>
          <h2 style={{
            fontFamily: font, fontSize: 36, fontWeight: 700,
            color: "#1a2e1f", marginBottom: 36,
          }}>Top Places to Visit</h2>
          <div className={`stagger-parent${placesVis ? " visible" : ""}`} style={{
            display: "flex", flexWrap: "wrap",
            gap: 12, justifyContent: "center",
            maxWidth: 700, margin: "0 auto",
          }}>
            {places.map((p) => (
              <button
                key={p._id}
                className="stagger-child"
                onMouseEnter={() => setHoveredPlace(p)}
                onMouseLeave={() => setHoveredPlace(null)}
                style={{
                  fontFamily: body, fontSize: 13, fontWeight: 500,
                  padding: "8px 18px",
                  borderRadius: 999,
                  border: "1.5px solid",
                  borderColor: hoveredPlace === p ? "#2d6a4f" : "#c8d5cc",
                  background: hoveredPlace === p ? "#2d6a4f" : "#fff",
                  color: hoveredPlace === p ? "#fff" : "#3a5c44",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex", alignItems: "center", gap: 6,
                }}
              >
                <span style={{
                  width: 7, height: 7, borderRadius: "50%",
                  background: hoveredPlace === p ? "#fff" : "#2d6a4f",
                  display: "inline-block", flexShrink: 0,
                  transition: "background 0.2s",
                }} />
                {p.title}
              </button>
            ))}
          </div>
        </section>

        {/* Experiences */}
        <section ref={expRef} className={`fade-up${expVis ? " visible" : ""}`} style={{ padding: "64px 48px", background: "#f0ece4" }}>
          <h2 style={{
            fontFamily: font, fontSize: 36, fontWeight: 700,
            color: "#1a2e1f", textAlign: "center", marginBottom: 40,
          }}>Experiences</h2>
          <div className={`stagger-parent${expVis ? " visible" : ""}`} style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 16, maxWidth: 860, margin: "0 auto",
          }}>
            {experiences.map((e) => (
              <div
                key={e._id}
                className="stagger-child"
                onMouseEnter={() => setHoveredExp(e)}
                onMouseLeave={() => setHoveredExp(null)}
                style={{
                  background: hoveredExp === e ? "#2d6a4f" : "#fff",
                  borderRadius: 10,
                  padding: "24px 20px",
                  textAlign: "center",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                  cursor: "pointer",
                  transition: "background 0.25s, transform 0.2s",
                  transform: hoveredExp === e ? "translateY(-3px)" : "none",
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: hoveredExp === e ? "rgba(255,255,255,0.2)" : "#edf2ee",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 12px",
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={hoveredExp === e ? "#fff" : "#2d6a4f"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div style={{
                  fontFamily: font, fontSize: 16, fontWeight: 600,
                  color: hoveredExp === e ? "#fff" : "#1a2e1f",
                  transition: "color 0.25s",
                }}>{e.title}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Living Culture */}
        <section ref={cultureRef} className={`fade-up${cultureVis ? " visible" : ""}`} style={{ padding: "80px 48px" }}>
          <div style={{
            maxWidth: 900, margin: "0 auto",
            display: "flex", gap: 56, alignItems: "center",
            flexWrap: "wrap",
          }}>
            <div style={{ flex: "0 0 300px" }}>
              <img
                src="https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=500&q=80"
                alt="Kathakali dancer"
                style={{
                  width: "100%", borderRadius: 12,
                  boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
                  display: "block",
                }}
              />
            </div>
            <div style={{ flex: "1 1 280px" }}>
              <h2 style={{
                fontFamily: font, fontSize: 34, fontWeight: 700,
                color: "#1a2e1f", marginBottom: 20,
              }}>A Living Culture</h2>
              <p style={{
                fontFamily: body, fontSize: 15, color: "#4a5e50",
                lineHeight: 1.8,
              }}>
                From the dramatic art of Kathakali to the rhythmic boat races of Alleppey,
                Kerala's cultural heritage is alive, vibrant, and deeply moving. Every festival,
                every dance, every meal tells a story.
              </p>
            </div>
          </div>
        </section>

        {/* Tips */}
        <section ref={tipsRef} className={`fade-up${tipsVis ? " visible" : ""}`} style={{ padding: "56px 48px", background: "#edf2ee" }}>
          <div style={{
            maxWidth: 860, margin: "0 auto",
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 40,
          }}>
            {[
              {
                icon: "☀", title: "Best Time to Visit",
                text: "October to March offers the most pleasant weather. June to September is monsoon season — dramatic, green, and perfect for Ayurveda retreats. April–May is warm but ideal for hill stations like Munnar.",
              },
              {
                icon: "✈", title: "Travel Tips",
                text: "Most nationalities can get an e-Visa for India. Currency is Indian Rupee (INR). Kerala is one of India's safest states. Dress modestly at temples. English is widely spoken. Kerivaa handles all logistics for you.",
              },
            ].map((tip) => (
              <div key={tip.title}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 18 }}>{tip.icon}</span>
                  <span style={{
                    fontFamily: body, fontSize: 13, fontWeight: 600,
                    letterSpacing: "0.08em", textTransform: "uppercase",
                    color: "#2d6a4f",
                  }}>{tip.title}</span>
                </div>
                <p style={{
                  fontFamily: body, fontSize: 14, color: "#4a5e50", lineHeight: 1.75,
                }}>{tip.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{
          textAlign: "center", padding: "80px 24px",
          background: "#f9f7f4",
        }}>
          <h2 style={{
            fontFamily: font, fontSize: "clamp(28px, 4vw, 40px)",
            fontWeight: 700, color: "#1a2e1f", marginBottom: 28,
          }}>Ready to Experience Kerala?</h2>
          <button style={{
            background: "#2d6a4f",
            border: "none", borderRadius: 999,
            padding: "14px 36px",
            fontFamily: body, fontSize: 14, fontWeight: 600,
            color: "#fff", cursor: "pointer",
            letterSpacing: "0.03em",
            boxShadow: "0 4px 20px rgba(45,106,79,0.3)",
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 28px rgba(45,106,79,0.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(45,106,79,0.3)"; }}
          >
            Design Your Personalized Kerala
          </button>
        </section>

      </div>
    </>
  );
}