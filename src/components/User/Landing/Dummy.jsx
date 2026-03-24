import { useEffect, useRef, useState } from "react";
import picture6 from '../../../assets/picture6.jpeg'
import picture5 from '../../../assets/picture5.png'
import picture4 from '../../../assets/picture4.png'
import picture3 from '../../../assets/picture3.png'
import picture2 from '../../../assets/picture2.png'
import picture1 from '../../../assets/picture1.png'

const LAYERS = [
    { id: "layer6", src: picture6, scrollSpeed: 0.05, zIndex: 1, label: "Picture 6 – distant haze" },
    { id: "layer5", src: picture5, scrollSpeed: 0.1,  zIndex: 2, label: "Picture 5" },
    { id: "layer4", src: picture4, scrollSpeed: 0.18, zIndex: 3, label: "Picture 4" },
    { id: "layer3", src: picture3, scrollSpeed: 0.28, zIndex: 4, label: "Picture 3" },
    { id: "layer2", src: picture2, scrollSpeed: 0.42, zIndex: 5, label: "Picture 2" },
    { id: "layer1", src: picture1, scrollSpeed: 0.65, zIndex: 6, label: "Picture 1 – foreground" },
];

export default function NatureParallax() {
    const [scroll, setScroll] = useState(0);
    const [vh, setVh] = useState(800);

    useEffect(() => {
        setVh(window.innerHeight);
        const handleScroll = () => setScroll(window.scrollY);
        const handleResize = () => setVh(window.innerHeight);
        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const getTransform = (layer) => `translateY(-${scroll * layer.scrollSpeed}px)`;

    // Rise starts at 30% scroll of one viewport height, completes by 100vh scrolled
    const riseStart  = vh * 0.3;
    const riseEnd    = vh * 1.0;
    const rawProgress = Math.max(0, scroll - riseStart);
    const progress   = Math.min(rawProgress / (riseEnd - riseStart), 1); // 0 → 1

    // Panel starts at bottom of screen (translateY = 100vh) and rises to 0
    const panelY = vh * (1 - progress);

    return (
        <div style={{ fontFamily: "'Georgia', serif", minHeight: "300vh", backgroundColor: "#000" }}>

            {/* ── HERO (sticky parallax) ── */}
            <div
                style={{
                    position: "sticky",
                    top: 0,
                    height: "100vh",
                    overflow: "hidden",
                    backgroundColor: "#000",
                    zIndex: 1,
                }}
            >
                {LAYERS.map((layer) => (
                    <div
                        key={layer.id}
                        style={{
                            position: "absolute",
                            bottom: "0%",
                            left: 0,
                            width: "100%",
                            height: "110%",
                            zIndex: layer.zIndex,
                            transform: getTransform(layer),
                            transition: "transform 0.08s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                            willChange: "transform",
                        }}
                    >
                        <img
                            src={layer.src}
                            alt={layer.label}
                            style={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                width: "100%",
                                height: "auto",
                                display: "block",
                                mixBlendMode: "screen",
                            }}
                        />
                    </div>
                ))}
            </div>

            {/* ── RISING BLACK PANEL (fixed, above hero) ── */}
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100vh",
                    zIndex: 100,
                    backgroundColor: "#000",
                    transform: `translateY(${panelY}px)`,
                    willChange: "transform",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    // Hide completely when not yet rising (avoid it blocking click/hover)
                    pointerEvents: progress > 0 ? "auto" : "none",
                }}
            >
                <h2 style={{
                    fontFamily: "'Georgia', serif",
                    fontSize: "clamp(2rem, 5vw, 4rem)",
                    fontWeight: 300,
                    letterSpacing: "0.15em",
                    margin: 0,
                    opacity: Math.min(progress * 3, 1),
                }}>
                    Into the Dark
                </h2>
                <p style={{
                    marginTop: "1.5rem",
                    fontSize: "clamp(0.9rem, 2vw, 1.2rem)",
                    letterSpacing: "0.08em",
                    color: "#888",
                    opacity: Math.min(progress * 3, 1),
                }}>
                    Scroll further to explore
                </p>
            </div>

            {/* ── REAL CONTENT SECTION (below the fold) ── */}
            <div
                style={{
                    position: "relative",
                    zIndex: 0,
                    backgroundColor: "#000",
                    color: "#fff",
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
                    letterSpacing: "0.06em",
                    fontFamily: "'Georgia', serif",
                    fontWeight: 300,
                }}
            >
                Your main content lives here.
            </div>
        </div>
    );
}