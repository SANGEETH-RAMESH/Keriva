import { useEffect, useRef, useState, useCallback } from "react";
import therealkerala from '../../../assets/therealkerala.mp4';

const ScrollVideoSection = ({ onProgressChange }) => {
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [dims, setDims] = useState({ vw: 1440, vh: 900 });

  const updateDims = useCallback(() => {
    setDims({ vw: window.innerWidth, vh: window.innerHeight });
  }, []);

  useEffect(() => {
    updateDims();
    window.addEventListener("resize", updateDims);
    return () => window.removeEventListener("resize", updateDims);
  }, [updateDims]);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionH = sectionRef.current.offsetHeight;
      const vh = window.innerHeight;
      const scrolled = -rect.top;
      const total = sectionH - vh;
      const raw = Math.min(Math.max(scrolled / total, 0), 1);
      setScrollProgress(raw);
      onProgressChange?.(raw); 
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const ease = (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const p = ease(scrollProgress);
  const { vw, vh } = dims;

  const textOpacity   = Math.max(0, 1 - p / 0.4);
  const textTranslate = p * 40;

  // ── Natural (start) state ──────────────────────────────────────────
  // Video sits on the RIGHT side, but is defined by its CENTER so both
  // edges can expand symmetrically.
  const padH       = vw * 0.06;
  const naturalW   = vw * 0.58;
  const naturalH   = naturalW * (10 / 16);

  // Place it flush-right with 6vw padding — same visual as before
  const naturalRight  = vw - padH;              // right edge start
  const naturalLeft   = naturalRight - naturalW; // left edge start
  const naturalCenterX = (naturalLeft + naturalRight) / 2; // center X of video

  const naturalTop    = (vh - naturalH) / 2;
  const naturalCenterY = naturalTop + naturalH / 2; // center Y of video

  // ── Animated state ────────────────────────────────────────────────
  // Both edges expand outward from the video's own center point.
  // Target center stays fixed at naturalCenterX during expansion,
  // then we also slide it to vw/2 so it ends up perfectly centered fullscreen.
  const targetCenterX = naturalCenterX + (vw / 2 - naturalCenterX) * p;
  
  const targetCenterY = vh / 2; // keep vertically centered always

  const frameWidth  = naturalW + (vw - naturalW) * p;
  const frameHeight = naturalH + (vh - naturalH) * p;

  const frameLeft = targetCenterX - frameWidth  / 2;
  const frameTop  = targetCenterY - frameHeight / 2;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f5f3ef; font-family: 'DM Sans', sans-serif; color: #1a1a1a; overflow-x: hidden; }
      `}</style>

      <div style={{ background: "#f5f3ef" }}>

        

        {/* ── Scroll Video Section ── */}
        <section ref={sectionRef} style={{ position: "relative", height: "300vh" }}>
          <div
            style={{
              position: "sticky",
              top: 0,
              height: "100vh",
              overflow: "hidden",
            }}
          >
            {/* Left overlay text */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "6vw",
                transform: `translateY(calc(-50% + ${textTranslate}px))`,
                maxWidth: 340,
                zIndex: 10,
                pointerEvents: "none",
                opacity: textOpacity,
              }}
            >
              <p
                style={{
                  fontFamily: "'DM Serif Display', Georgia, serif",
                  fontSize: "clamp(18px, 2.2vw, 28px)",
                  lineHeight: 1.45,
                  fontWeight: 400,
                  color: "#3a3a3a",
                  fontStyle: "italic",
                }}
              >
                Our name,{" "}
                <span style={{ color: "#1a1a1a", fontStyle: "normal" }}>
                  ZettaJoule
                </span>
                , reflects our commitment to being part of the solution for
                meeting this tremendous need by providing clean, reliable heat
                and power.
              </p>
            </div>

            {/* Animated video frame — expands symmetrically from its own center */}
            <div
              style={{
                position: "absolute",
                overflow: "hidden",
                willChange: "left, top, width, height",
                left:   `${frameLeft}px`,
                top:    `${frameTop}px`,
                width:  `${frameWidth}px`,
                height: `${frameHeight}px`,
              }}
            >
              <video
                autoPlay
                muted
                loop
                playsInline
                src={therealkerala}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ScrollVideoSection;