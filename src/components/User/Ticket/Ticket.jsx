import { useState, useEffect, useRef } from "react";
import csk from '../../../assets/csk.mp4'

const AD_CONFIG = {
  adsToShow: 3,
  rotateInterval: 3000,
  ads: [
    [
      {
        type: "video",
        src: csk,
        fallbackBg: "#1a1a2e",
      },
    ],

    [
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
        fallbackBg: "#f5f0e8",
        // tag: "Sponsored · Hotels",
        // headline: "STAY CLOSE\nTO THE SHOW",
        dark: false,
      },
    ],

    [
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80",
        fallbackBg: "#c9a84c",
        accent: true,
      },
    ],

    [
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
        fallbackBg: "#2e1a1a",
        tag: "Sponsored · Food & Drinks",
        headline: "FUEL YOUR\nNIGHT",
        body: "Festival food passes · All-access dining",
      },
    ],
  ],
};

const barHeights = [40, 28, 46, 22, 36, 46, 26, 38, 46, 30, 22, 40];

const clipPaths = [
  "polygon(0 0, 100% 0, 96% 100%, 4% 100%)",
  "polygon(4% 0, 96% 0, 100% 100%, 0 100%)",
  "polygon(0 0, 100% 0, 96% 100%, 4% 100%)",
  "polygon(4% 0, 96% 0, 100% 100%, 0 100%)",
];

const keyframes = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&display=swap');

  @keyframes dotBounce {
    0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
    40% { transform: scale(1.2); opacity: 1; }
  }
  @keyframes progressFill {
    0%   { width: 0%; }   60%  { width: 70%; }
    85%  { width: 88%; }  100% { width: 100%; }
  }
  @keyframes shimmer {
    0% { transform: translateX(-100%); } 100% { transform: translateX(100%); }
  }
  @keyframes barExit {
    to { opacity: 0; transform: scaleY(0.85); }
  }
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes adFadeIn {
    from { opacity: 0; transform: scale(1.04); }
    to   { opacity: 1; transform: scale(1); }
  }

  .dot1 { animation: dotBounce 1.2s ease-in-out infinite; }
  .dot2 { animation: dotBounce 1.2s ease-in-out 0.2s infinite; }
  .dot3 { animation: dotBounce 1.2s ease-in-out 0.4s infinite; }
  .progress-line   { animation: progressFill 1s ease-in-out forwards; }
  .shimmer-overlay { animation: shimmer 1.5s ease-in-out infinite; }
  .bar-exit-anim   { animation: barExit 0.35s ease forwards; }
  .label-fade      { animation: fadeSlideIn 0.4s ease forwards; }
  .ad-enter        { animation: adFadeIn 0.45s ease forwards; }

  .panel-base {
    width: 100%; border-radius: 3px; overflow: hidden;
    position: relative; max-height: 0; opacity: 0;
    transform: translateY(-20px) scaleY(0.8);
    transform-origin: top center;
    transition:
      max-height 0.5s cubic-bezier(0.34,1.2,0.64,1),
      opacity 0.4s ease,
      transform 0.45s cubic-bezier(0.34,1.56,0.64,1);
  }
  .panel-visible {
    max-height: 200px !important; opacity: 1 !important;
    transform: translateY(0) scaleY(1) !important;
  }
  .panel-ad0.panel-visible { transition-delay: 0.54s; }
  .panel-ad1.panel-visible { transition-delay: 0.36s; }
  .panel-ad2.panel-visible { transition-delay: 0.18s; }
  .panel-ad3.panel-visible { transition-delay: 0.08s; }
  .panel-ticket.panel-visible { transition-delay: 0s; }
  .panel-ticket.solo-visible {
    max-height: 20px !important; opacity: 1 !important;
    transform: translateY(0) scaleY(1) !important; transition-delay: 0s;
  }
  .pip { transition: width 0.3s ease, background 0.3s ease; cursor: pointer; }

  .mute-btn {
   position: absolute; top: 10px; right: 14px; z-index: 20;
    width: 30px; height: 30px; border-radius: 50%;
    background: rgba(0,0,0,0.5); border: 1.5px solid rgba(255,255,255,0.25);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: background 0.2s, transform 0.15s;
    backdrop-filter: blur(6px); outline: none; padding: 0;
  }
  .mute-btn:hover { background: rgba(0,0,0,0.75); transform: scale(1.12); }
`;

function IconMuted() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}

function IconUnmuted() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

function AdCreative({ slotIndex, creative, animKey }) {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true); 

  const isVideo  = creative.type === "video";
  const isAccent = !!creative.accent;
  const isDark   = creative.dark !== false;

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = muted;
    }
  }, [muted]);

  useEffect(() => {
    setMuted(true);
  }, [creative.src]);

  const overlayBg     = isAccent ? "rgba(0,0,0,0.18)" : isDark ? "rgba(0,0,0,0.52)" : "rgba(245,240,232,0.58)";
  const headlineColor = isDark || isAccent ? "#fff" : "#0d0d0d";
  const tagColor      = isAccent ? "rgba(0,0,0,0.45)" : isDark ? "rgba(255,255,255,0.5)" : "#c0392b";
  const bodyColor     = isAccent ? "rgba(0,0,0,0.45)" : isDark ? "rgba(255,255,255,0.5)" : "rgba(13,13,13,0.5)";

  return (
    <div
      className="ad-enter"
      key={animKey}
      style={{
        position: "absolute", inset: 0,
        background: creative.fallbackBg,
        clipPath: clipPaths[slotIndex % clipPaths.length],
      }}
    >
      {isVideo ? (
        <video
          ref={videoRef}
          key={creative.src}
          autoPlay loop muted playsInline
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        >
          <source src={creative.src} type="video/mp4" />
        </video>
      ) : (
        <img
          key={creative.src}
          src={creative.src}
          alt=""
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}

      <div style={{ position: "absolute", inset: 0, background: overlayBg }} />

      <div style={{
        position: "relative", zIndex: 2, height: "100%",
        display: "flex", alignItems: "center", padding: "0 40px",
      }}>
        <div>
          {creative.tag && (
            <div style={{ fontSize: 7, letterSpacing: "0.35em", color: tagColor, textTransform: "uppercase", marginBottom: 10 }}>
              {creative.tag}
            </div>
          )}
          {creative.headline && (
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 38, letterSpacing: "0.08em", color: headlineColor, lineHeight: 1, whiteSpace: "pre-line" }}>
              {creative.headline}
            </div>
          )}
          {creative.body && (
            <div style={{ fontSize: 9, color: bodyColor, letterSpacing: "0.18em", marginTop: 8 }}>
              {creative.body}
            </div>
          )}
        </div>
      </div>

      {isVideo && (
        <button
          className="mute-btn"
          onClick={() => setMuted(m => !m)}
          title={muted ? "Unmute" : "Mute"}
        >
          {muted ? <IconMuted /> : <IconUnmuted />}
        </button>
      )}
    </div>
  );
}

function RotatingAdSlot({ slotIndex, creatives, visible }) {
  const [idx, setIdx]         = useState(0);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    if (creatives.length <= 1) return;
    const id = setInterval(() => {
      setIdx(prev => (prev + 1) % creatives.length);
      setAnimKey(k => k + 1);
    }, AD_CONFIG.rotateInterval);
    return () => clearInterval(id);
  }, [creatives]);

  return (
    <div
      className={`panel-base panel-ad${slotIndex}${visible ? " panel-visible" : ""}`}
      style={{ height: 200 }}
    >
      <AdCreative slotIndex={slotIndex} creative={creatives[idx]} animKey={animKey} />

      {creatives.length > 1 && (
        <div style={{
          position: "absolute", bottom: 10, right: 14,
          display: "flex", gap: 5, zIndex: 20,
        }}>
          {creatives.map((_, i) => (
            <div
              key={i}
              className="pip"
              onClick={() => { setIdx(i); setAnimKey(k => k + 1); }}
              style={{
                height: 6, borderRadius: 3,
                width: i === idx ? 18 : 6,
                background: i === idx ? "#c9a84c" : "rgba(255,255,255,0.45)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TicketPage() {
  const [phase, setPhase]           = useState("loading");
  const [adsVisible, setAdsVisible] = useState(false);
  const [labelText, setLabelText]   = useState("Loading");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("bar-exit"), 1000);
    const t2 = setTimeout(() => { setLabelText("Your Ticket");  setPhase("ticket-solo"); }, 1350);
    const t3 = setTimeout(() => { setLabelText("Your Tickets"); setPhase("expanding");   }, 2350);
    const t4 = setTimeout(() => { setAdsVisible(true);          setPhase("done");         }, 2450);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  const showLoading = phase === "loading" || phase === "bar-exit";
  const showPanels  = phase !== "loading" && phase !== "bar-exit";
  const ticketSolo  = phase === "ticket-solo";

  const numAds  = Math.min(AD_CONFIG.adsToShow, AD_CONFIG.ads.length);
  const adSlots = AD_CONFIG.ads.slice(0, numAds);

  return (
    <>
      <style>{keyframes}</style>

      <div style={{
        minHeight: "100vh", background: "#f5f0e8",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        fontFamily: "'DM Mono', monospace", padding: "40px 20px",
        position: "relative",
      }}>

        <div style={{
          position: "fixed", inset: 0, pointerEvents: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='0' y='0' width='1' height='1' fill='%230d0d0d' opacity='0.05'/%3E%3C/svg%3E")`,
        }} />

        <div style={{
          fontFamily: "'Bebas Neue', sans-serif", fontSize: 11,
          letterSpacing: "0.4em", color: "rgba(13,13,13,0.35)",
          textTransform: "uppercase", marginBottom: 18,
          height: 16, display: "flex", alignItems: "center",
        }}>
          <span key={labelText} className="label-fade">{labelText}</span>
        </div>

        <div style={{ width: 600, maxWidth: "100%", position: "relative" }}>

          {showLoading && (
            <div
              className={phase === "bar-exit" ? "bar-exit-anim" : ""}
              style={{
                width: "100%", height: 200, background: "#0d0d0d",
                borderRadius: 4, display: "flex", alignItems: "center",
                justifyContent: "space-between", padding: "0 40px",
                position: "relative", overflow: "hidden",
                boxShadow: "5px 5px 0 #c9a84c",
              }}
            >
              <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(-55deg, transparent, transparent 18px, rgba(255,255,255,0.02) 18px, rgba(255,255,255,0.02) 36px)" }} />
              <div className="shimmer-overlay" style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.07) 50%, transparent 100%)" }} />
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 34, letterSpacing: "0.15em", color: "#c9a84c", position: "relative", zIndex: 1 }}>
                Fetching your ticket
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", position: "relative", zIndex: 1 }}>
                <div className="dot1" style={{ width: 8, height: 8, background: "#c9a84c", borderRadius: "50%" }} />
                <div className="dot2" style={{ width: 8, height: 8, background: "#c9a84c", borderRadius: "50%" }} />
                <div className="dot3" style={{ width: 8, height: 8, background: "#c9a84c", borderRadius: "50%" }} />
              </div>
              <div className="progress-line" style={{ position: "absolute", bottom: 0, left: 0, height: 3, background: "linear-gradient(90deg, #c9a84c, #e8c96a)", borderRadius: "0 2px 2px 0" }} />
            </div>
          )}

          {showPanels && (
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>

              {[...adSlots].reverse().map((creatives, ri) => {
                const slotIndex = numAds - 1 - ri;
                return (
                  <RotatingAdSlot
                    key={slotIndex}
                    slotIndex={slotIndex}
                    creatives={creatives}
                    visible={adsVisible}
                  />
                );
              })}

              <div className={`panel-base panel-ticket${ticketSolo ? " solo-visible" : ""}${adsVisible ? " panel-visible" : ""}`}>
                <div style={{
                  height: 200, background: "#0d0d0d",
                  display: "flex", alignItems: "stretch",
                  clipPath: "polygon(4% 0, 96% 0, 100% 100%, 0 100%)",
                  boxShadow: "4px 4px 0 #c9a84c",
                }}>
                  <div style={{
                    width: 120, flexShrink: 0,
                    borderRight: "2px dashed rgba(255,255,255,0.12)",
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    padding: 16, gap: 2,
                  }}>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 46, color: "#c9a84c", lineHeight: 1 }}>A7</div>
                    <div style={{ fontSize: 7, letterSpacing: "0.35em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>Gate</div>
                    <div style={{ display: "flex", gap: 2, alignItems: "flex-end", marginTop: 10 }}>
                      {barHeights.map((h, i) => (
                        <div key={i} style={{ width: 2, height: h, background: "rgba(255,255,255,0.35)", borderRadius: 1 }} />
                      ))}
                    </div>
                  </div>

                  <div style={{ flex: 1, padding: "22px 28px", display: "flex", flexDirection: "column", justifyContent: "center", minWidth: 0 }}>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 34, letterSpacing: "0.1em", color: "#fff", lineHeight: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      ROCK FEST 2026
                    </div>
                    <div style={{ width: "100%", height: 1, background: "rgba(255,255,255,0.08)", margin: "12px 0" }} />
                    <div style={{ display: "flex" }}>
                      {[
                        { label: "Date",  val: "APR 18, 2026"      },
                        { label: "Venue", val: "Marine Drive Arena" },
                        { label: "Type",  val: "GENERAL ADMISSION"  },
                      ].map(({ label, val }, i) => (
                        <div key={label} style={{
                          display: "flex", flexDirection: "column", flex: 1, minWidth: 0,
                          paddingLeft: i > 0 ? 16 : 0,
                          borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.08)" : "none",
                        }}>
                          <div style={{ fontSize: 6, letterSpacing: "0.35em", color: "#c9a84c", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
                          <div style={{
  fontSize: 9,
  color: "rgba(255,255,255,0.85)",
  letterSpacing: "0.05em",
  whiteSpace: "normal",
  lineHeight: 1.3
}}>
  {val}
</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{
                    width: 110, flexShrink: 0,
                    borderLeft: "2px dashed rgba(255,255,255,0.12)",
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", padding: 16,
                  }}>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 50, color: "#c0392b", lineHeight: 1 }}>B12</div>
                    <div style={{ fontSize: 7, letterSpacing: "0.35em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>Seat</div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </>
  );
}