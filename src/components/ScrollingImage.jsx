import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import landingPage from '../assets/kerala_panorama_final.jpg';

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

const VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const FRAG = `
  uniform sampler2D uTexture;
  uniform float uProgress;
  uniform int   uScene;
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    float totalOffset = (float(uScene) + uProgress) / 3.0;
    vec2 c = uv - 0.5;
    vec2 z = c + 0.5;
    float drift = uProgress * 0.04;
    float u = z.x / 3.0 + totalOffset - drift;
    float v = z.y;
    vec4 col = texture2D(uTexture, vec2(u, v));
    float grain = fract(sin(dot(uv, vec2(127.1, 311.7)) + uTime * 0.4) * 43758.5453) * 0.028;
    col.rgb += grain - 0.014;
    gl_FragColor = col;
  }
`;

export default function KeralaLanding({ onStartDesigning, onMenuOpen }) {
  const canvasRef = useRef(null);
  const materialRef = useRef(null);
  const clockRef = useRef(new THREE.Clock());
  const rafRef = useRef(null);
  const outerRef = useRef(null);

  const [activeScene, setActiveScene] = useState(0);
  const [progressW, setProgressW] = useState(0);
  const [hideHint, setHideHint] = useState(false);
  const [scrollP, setScrollP] = useState(0);
  const [btnPrimaryHover, setBtnPrimaryHover] = useState(false);
  const [btnSecondaryHover, setBtnSecondaryHover] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const texture = new THREE.TextureLoader().load(landingPage, (t) => {
      t.minFilter = THREE.LinearFilter;
      t.magFilter = THREE.LinearFilter;
    });

    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: {
        uTexture:  { value: texture },
        uProgress: { value: 0 },
        uScene:    { value: 0 },
        uTime:     { value: 0 },
      },
    });
    materialRef.current = mat;
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      mat.uniforms.uTime.value = clockRef.current.getElapsedTime();
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  const handleScroll = useCallback(() => {
    const mat = materialRef.current;
    const outer = outerRef.current;
    if (!mat || !outer) return;

    const scrollRange = outer.offsetHeight - window.innerHeight;
    const p = Math.min(window.scrollY / scrollRange, 1);

    setScrollP(p);
    setProgressW(p * 100);
    setHideHint(window.scrollY > window.innerHeight * 0.05);

    let sceneIdx = 0;
    let transition = 0;

    if (p < 0.2)       { sceneIdx = 0; transition = 0; }
    else if (p < 0.5)  { sceneIdx = 0; transition = (p - 0.2) / 0.3; }
    else if (p < 0.55) { sceneIdx = 1; transition = 0; }
    else if (p < 0.85) { sceneIdx = 1; transition = (p - 0.55) / 0.3; }
    else               { sceneIdx = 2; transition = 0; }

    mat.uniforms.uScene.value    = sceneIdx;
    mat.uniforms.uProgress.value = transition;

    const dominant =
      sceneIdx === 0 && transition > 0.5 ? 1 :
      sceneIdx === 1 && transition > 0.5 ? 2 :
      sceneIdx;
    setActiveScene(dominant);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const heroOpacity = Math.max(0, 1 - scrollP * 4);
  const heroTranslateY = scrollP * -80;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&display=swap');
        html, body { margin: 0; padding: 0; }

        @keyframes scrollLine {
          0%   { top: -100%; }
          100% { top:  100%; }
        }
        .scroll-line::after {
          content: '';
          position: absolute;
          top: -100%; left: 0;
          width: 100%; height: 100%;
          background: rgba(255,255,255,0.7);
          animation: scrollLine 2s ease-in-out infinite;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-h1 {
          animation: fadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.2s both;
        }
        .hero-sub1 {
          animation: fadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.45s both;
        }
        .hero-sub2 {
          animation: fadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.6s both;
        }
        .hero-btns {
          animation: fadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.78s both;
        }
      `}</style>

      <div
        ref={outerRef}
        style={{
          position: "relative",
          height: "300vh",
          background: "#000",
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          color: "#fff",
        }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            width: "100%",
            overflow: "hidden",
          }}
        >
          <canvas
            ref={canvasRef}
            style={{ display: "block", width: "100%", height: "100%" }}
          />

          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.65) 100%)",
          }} />

          <div style={{
            position: "absolute", top: 0, left: 0,
            height: "2px",
            background: "rgba(255,255,255,0.7)",
            width: `${progressW}%`,
            transition: "width 0.1s linear",
            zIndex: 3,
            pointerEvents: "none",
          }} />

          <nav style={{
            position: "absolute", top: 0, left: 0, right: 0, zIndex: 4,
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "28px 48px",
          }}>
            <div style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "22px", fontWeight: 600,
              letterSpacing: "0.05em", color: "#fff",
            }}>Kerivaa</div>
            <div
              onClick={onMenuOpen}
              style={{
                display: "flex", flexDirection: "column", gap: "5px",
                cursor: "pointer", padding: "4px",
              }}
            >
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: "24px", height: "2px",
                  background: "rgba(255,255,255,0.9)",
                  borderRadius: "2px",
                }} />
              ))}
            </div>
          </nav>

          <div style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
            textAlign: "center",
            padding: "0 24px",
            opacity: heroOpacity,
            transform: `translateY(${heroTranslateY}px)`,
            transition: "opacity 0.05s linear, transform 0.05s linear",
            pointerEvents: heroOpacity < 0.1 ? "none" : "auto",
          }}>
            <h1
              className="hero-h1"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(58px, 9vw, 118px)", fontWeight: 700,
                lineHeight: 1.0, color: "#fff",
                textShadow: "0 2px 40px rgba(0,0,0,0.4)",
                margin: "0 0 24px 0", letterSpacing: "-0.02em",
              }}
            >
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
              justifyContent: "center", alignItems: "center",
              flexWrap: "wrap",
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

          <div style={{
            position: "absolute", bottom: "32px",
            left: "50%", transform: "translateX(-50%)",
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: "10px", zIndex: 2,
            opacity: hideHint ? 0 : 1,
            transition: "opacity 0.5s",
            pointerEvents: "none",
          }}>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "9px", letterSpacing: "0.35em",
              color: "rgba(255,255,255,0.4)", textTransform: "uppercase",
            }}>Scroll</span>
            <div className="scroll-line" style={{
              width: "1px", height: "48px",
              background: "rgba(255,255,255,0.2)",
              position: "relative", overflow: "hidden",
            }} />
          </div>
        </div>
      </div>
    </>
  );
}