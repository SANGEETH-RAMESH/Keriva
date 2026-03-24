import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getLanding } from '../../../services/userService';

const WINDOW_SIZE = 6;

const PATH_POSITIONS = [
    { tx: 0.08, ty: 0.62 },
    { tx: 0.28, ty: 0.72 },
    { tx: 0.46, ty: 0.78 },
    { tx: 0.60, ty: 0.72 },
    { tx: 0.74, ty: 0.64 },
    { tx: 0.90, ty: 0.58 },
];

function parseTitle(title = "") {
    const parts = title.trim().split(" ");
    if (parts.length === 1) return { titleLight: "", titleBold: parts[0] };
    const titleBold = parts[parts.length - 1];
    const titleLight = parts.slice(0, parts.length - 1).join(" ");
    return { titleLight, titleBold };
}

function mapLandingToStations(landingData) {
    return landingData
        .filter(item => item.isActive)
        .sort((a, b) => Number(a.order) - Number(b.order))
        .map((item, index) => {
            const { titleLight, titleBold } = parseTitle(item.title);
            const slotIndex = index % PATH_POSITIONS.length;
            return {
                id: item._id,
                name: item.location,
                date: item.title,
                tx: PATH_POSITIONS[slotIndex].tx,
                ty: PATH_POSITIONS[slotIndex].ty,
                titleLight,
                titleBold,
                centerImage: item.image,
            };
        });
}

function buildCurve(pts) {
    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i], p1 = pts[i + 1];
        const cpx = (p0.x + p1.x) / 2;
        d += ` C ${cpx.toFixed(1)} ${p0.y.toFixed(1)}, ${cpx.toFixed(1)} ${p1.y.toFixed(1)}, ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
    }
    return d;
}

function fillLen(pathEl, target) {
    if (!pathEl) return 0;
    const total = pathEl.getTotalLength();
    let best = 0, bestD = Infinity;
    for (let i = 0; i <= 800; i++) {
        const l = (i / 800) * total;
        const p = pathEl.getPointAtLength(l);
        const d = Math.hypot(p.x - target.x, p.y - target.y);
        if (d < bestD) { bestD = d; best = l; }
    }
    return best;
}

function JourneyPath({ activeSlot, W, H, onDotClick }) {
    const pathRef = useRef(null);
    const [offset, setOffset] = useState(9999);
    const [total, setTotal] = useState(9999);
    const pts = PATH_POSITIONS.map(s => ({ x: s.tx * W, y: s.ty * H }));
    const d = buildCurve(pts);
    const isMobile = W < 768;
    const activeR = isMobile ? 13 : 19;
    const inactiveR = isMobile ? 5 : 7;

    useEffect(() => {
        if (!pathRef.current) return;
        const t = pathRef.current.getTotalLength();
        setTotal(t);
        setOffset(t - fillLen(pathRef.current, pts[activeSlot]));
    }, [activeSlot, W, H]);

    return (
        <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}
            style={{ position: "absolute", inset: 0, overflow: "visible", zIndex: 10 }}>
            <defs>
                <filter id="fp"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                <filter id="fd"><feGaussianBlur stdDeviation="5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            </defs>
            <path d={d} fill="none" stroke="rgba(124,58,237,0.18)" strokeWidth="2.5" strokeLinecap="round" />
            <path ref={pathRef} d={d} fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round"
                strokeDasharray={total} strokeDashoffset={offset} filter="url(#fp)"
                style={{ transition: "stroke-dashoffset 0.75s cubic-bezier(0.4,0,0.2,1)" }} />
            {PATH_POSITIONS.map((pos, slotIdx) => {
                const cx = pos.tx * W, cy = pos.ty * H;
                const isAct = slotIdx === activeSlot;
                const isPast = slotIdx < activeSlot;
                return (
                    <g key={slotIdx} onClick={() => onDotClick(slotIdx)} style={{ cursor: "pointer" }}>
                        {isAct && <>
                            <circle cx={cx} cy={cy} r={activeR + 11} fill="rgba(139,92,246,0.09)" />
                            <circle cx={cx} cy={cy} r={activeR + 3} fill="rgba(139,92,246,0.16)" />
                        </>}
                        <circle cx={cx} cy={cy}
                            r={isAct ? activeR : inactiveR}
                            fill={isAct ? "#7c3aed" : isPast ? "rgba(139,92,246,0.72)" : "rgba(139,92,246,0.38)"}
                            stroke={isAct ? "rgba(255,255,255,0.28)" : "none"}
                            strokeWidth={isAct ? 2.5 : 0}
                            filter={isAct ? "url(#fd)" : undefined}
                            style={{ transition: "r 0.45s ease, fill 0.45s ease" }} />
                        {isAct && (
                            <text x={cx} y={cy + 4} textAnchor="middle"
                                fontSize={isMobile ? "9" : "12"}
                                fill="rgba(255,255,255,0.92)" fontFamily="sans-serif">◉</text>
                        )}
                    </g>
                );
            })}
        </svg>
    );
}

function StationLabels({ stations, windowStart, activeSlot, W, H, dir }) {
    const isMobile = W < 768;

    return (
        <>
            {PATH_POSITIONS.map((pos, slotIdx) => {
                const stationIdx = windowStart + slotIdx;
                if (stationIdx >= stations.length) return null;

                const st = stations[stationIdx];
                const x = pos.tx * W;
                const y = pos.ty * H;
                const isAct = slotIdx === activeSlot;

                if (isMobile && !isAct) return null;

                const labelW = isMobile ? 96 : 136;
                const labelH = isMobile ? 52 : 60;
                const halfW = labelW / 2;
                const leftPos = Math.max(4, Math.min(x - halfW, W - labelW - 4));
                const above = isMobile ? true : slotIdx <= 1;
                const topPos = above ? y - labelH - (isMobile ? 10 : 14) : y + (isMobile ? 14 : 18);

                const slideIn = dir > 0 ? labelW * 0.65 : -labelW * 0.65;
                const slideOut = dir > 0 ? -labelW * 0.65 : labelW * 0.65;

                return (
                    <div
                        key={`clip-${slotIdx}`}
                        style={{
                            position: "absolute",
                            left: leftPos,
                            top: topPos,
                            width: labelW,
                            height: labelH,
                            overflow: "hidden",
                            pointerEvents: "none",
                            zIndex: 15,
                        }}
                    >
                        <AnimatePresence mode="wait" custom={dir}>
                            <motion.div
                                key={`${slotIdx}-${stationIdx}`}
                                initial={{ x: slideIn, opacity: 0 }}
                                animate={{ x: 0, opacity: isAct ? 1 : 0.48 }}
                                exit={{ x: slideOut, opacity: 0 }}
                                transition={{
                                    duration: 0.38,
                                    ease: [0.4, 0, 0.2, 1],
                                    delay: slotIdx * 0.025,
                                }}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    textAlign: "center",
                                    willChange: "transform, opacity",
                                }}
                            >
                                <p style={{
                                    margin: 0,
                                    marginBottom: 3,
                                    fontSize: isMobile ? "0.44rem" : "0.50rem",
                                    fontWeight: 400,
                                    letterSpacing: "0.13em",
                                    textTransform: "uppercase",
                                    color: "rgba(255,255,255,0.65)",
                                    whiteSpace: "nowrap",
                                }}>
                                    {st.date}
                                </p>
                                <p style={{
                                    margin: 0,
                                    fontSize: isAct
                                        ? (isMobile ? "0.74rem" : "0.90rem")
                                        : (isMobile ? "0.62rem" : "0.76rem"),
                                    fontWeight: isAct ? 700 : 500,
                                    color: "#ffffff",
                                    letterSpacing: "-0.01em",
                                    lineHeight: 1.2,
                                    whiteSpace: "normal",
                                    wordBreak: "break-word",
                                    transition: "font-size 0.3s ease",
                                }}>
                                    {st.name}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                );
            })}
        </>
    );
}

export default function BoardArca({ onScrollDown }) {
    const [stations, setStations] = useState([]);
    const [activeIdx, setActiveIdx] = useState(0);
    const [dims, setDims] = useState({ W: 0, H: 0 });
    const [loading, setLoading] = useState(true);
    const rootRef = useRef(null);
    const dirRef = useRef(1);
    const prevIdxRef = useRef(0);
    const isThrottledRef = useRef(false);
    const touchStartYRef = useRef(null);
    const activeIdxRef = useRef(activeIdx);
    const seenLastRef = useRef(false);

    const windowStart = stations.length > 0
        ? Math.max(0, Math.min(activeIdx, stations.length - WINDOW_SIZE))
        : 0;
    const activeSlot = activeIdx - windowStart;
    const active = stations[activeIdx];
    const isMobile = dims.W > 0 && dims.W < 768;

    if (prevIdxRef.current !== activeIdx) {
        dirRef.current = activeIdx > prevIdxRef.current ? 1 : -1;
        prevIdxRef.current = activeIdx;
    }

    useEffect(() => { activeIdxRef.current = activeIdx; }, [activeIdx]);

    // Change the measure useEffect to this:
    useEffect(() => {
        const measure = () => {
            if (rootRef.current) {
                setDims({
                    W: rootRef.current.offsetWidth,
                    H: rootRef.current.offsetHeight,
                });
            }
        };

        // Only add listener, actual measure happens after loading
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, []);

    // Add this separate effect that fires when loading finishes
    useEffect(() => {
        if (!loading && rootRef.current) {
            setDims({
                W: rootRef.current.offsetWidth,
                H: rootRef.current.offsetHeight,
            });
        }
    }, [loading]); // 👈 runs again once loading becomes false

    useEffect(() => {
        if (stations.length > 0 && activeIdx === stations.length - 1) {
            const t = setTimeout(() => { seenLastRef.current = true; }, 950);
            return () => clearTimeout(t);
        } else {
            seenLastRef.current = false;
        }
    }, [activeIdx, stations.length]);

    useEffect(() => {
        const fetchLanding = async () => {
            try {
                setLoading(true);
                const response = await getLanding();
                const { landing } = response.data;
                if (Array.isArray(landing) && landing.length > 0) {
                    setStations(mapLandingToStations(landing));
                }
            } catch (error) {
                console.error("Failed to fetch landing data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLanding();
    }, []);

    const navigate = useCallback((direction) => {
        if (isThrottledRef.current) return;
        isThrottledRef.current = true;
        setTimeout(() => { isThrottledRef.current = false; }, 750);
        setActiveIdx(prev => {
            const next = prev + direction;
            return next < 0 || next >= stations.length ? prev : next;
        });
    }, [stations.length]);

    useEffect(() => {
        const el = rootRef.current;
        if (!el) return;
        const onWheel = (e) => {
            const d = e.deltaY > 0 ? 1 : -1;
            if (d > 0 && activeIdxRef.current >= stations.length - 1) { if (seenLastRef.current) return; e.preventDefault(); return; }
            if (d < 0 && activeIdxRef.current <= 0) return;
            e.preventDefault();
            navigate(d);
        };
        el.addEventListener("wheel", onWheel, { passive: false });
        return () => el.removeEventListener("wheel", onWheel);
    }, [navigate, stations.length]);

    useEffect(() => {
        const el = rootRef.current;
        if (!el) return;
        const onTouchStart = (e) => { touchStartYRef.current = e.touches[0].clientY; };
        const onTouchEnd = (e) => {
            if (touchStartYRef.current === null) return;
            const delta = touchStartYRef.current - e.changedTouches[0].clientY;
            if (Math.abs(delta) > 40) {
                const d = delta > 0 ? 1 : -1;
                if (d > 0 && activeIdxRef.current >= stations.length - 1) { touchStartYRef.current = null; return; }
                navigate(d);
            }
            touchStartYRef.current = null;
        };
        el.addEventListener("touchstart", onTouchStart, { passive: true });
        el.addEventListener("touchend", onTouchEnd, { passive: true });
        return () => {
            el.removeEventListener("touchstart", onTouchStart);
            el.removeEventListener("touchend", onTouchEnd);
        };
    }, [navigate, stations.length]);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "ArrowDown" || e.key === "ArrowRight") navigate(1);
            if (e.key === "ArrowUp" || e.key === "ArrowLeft") navigate(-1);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [navigate]);

    const handleDotClick = (slotIdx) => {
        const realIdx = windowStart + slotIdx;
        if (realIdx >= 0 && realIdx < stations.length) {
            dirRef.current = realIdx > activeIdx ? 1 : -1;
            setActiveIdx(realIdx);
        }
    };

    const activePosX = dims.W > 0 ? PATH_POSITIONS[activeSlot]?.tx * dims.W : 0;
    const activePosY = dims.H > 0 ? PATH_POSITIONS[activeSlot]?.ty * dims.H : 0;
    const dir = dirRef.current;
    const pulseA = isMobile ? 38 : 54;
    const pulseB = isMobile ? 26 : 38;

    // Loading state
    if (loading) {
        return (
            <div style={{
                width: "100%", height: "100vh", background: "#000",
                display: "flex", alignItems: "center", justifyContent: "center",
            }}>
                <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    border: "2.5px solid rgba(139,92,246,0.2)",
                    borderTop: "2.5px solid #8b5cf6",
                    animation: "spin 0.9s linear infinite",
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    // No data state
    if (!active) return null;

    return (
        <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", width: "100%", height: "100vh" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;700;900&display=swap');
                @keyframes pulse-a {
                    0%   { transform: translate(-50%,-50%) scale(1);   opacity: 0.6; }
                    100% { transform: translate(-50%,-50%) scale(2.6); opacity: 0;   }
                }
                @keyframes pulse-b {
                    0%   { transform: translate(-50%,-50%) scale(1);   opacity: 0.35; }
                    100% { transform: translate(-50%,-50%) scale(1.8); opacity: 0;    }
                }
                     @keyframes bounce {
    0%, 100% { transform: translateX(-50%) translateY(0); }
    50%       { transform: translateX(-50%) translateY(6px); }
  }
            `}</style>

            <div ref={rootRef} style={{
                position: "relative", width: "100%", height: "100vh",
                overflow: "hidden", background: "#000", touchAction: "none",
            }}>

                {/* Background image */}
                <AnimatePresence mode="popLayout" custom={dir}>
                    <motion.div key={active.id} custom={dir}
                        variants={{
                            enter: (d) => ({ x: d > 0 ? "100%" : "-100%" }),
                            center: { x: 0 },
                            exit: (d) => ({ x: d > 0 ? "-100%" : "100%" }),
                        }}
                        initial="enter" animate="center" exit="exit"
                        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
                        style={{ position: "absolute", inset: 0, zIndex: 1 }}
                    >
                        <div style={{
                            position: "absolute", inset: 0,
                            backgroundImage: `url(${active.centerImage})`,
                            backgroundSize: "cover", backgroundPosition: "center", opacity: 0.82,
                        }} />
                    </motion.div>
                </AnimatePresence>

                {/* Title */}
                <div style={{
                    position: "absolute", top: isMobile ? "14%" : "12%",
                    left: "50%", transform: "translateX(-50%)", zIndex: 20,
                    display: "flex", alignItems: "baseline", gap: "0.25em",
                    overflow: "hidden", whiteSpace: "nowrap",
                }}>
                    <div style={{ overflow: "hidden" }}>
                        <AnimatePresence mode="wait">
                            <motion.span key={active.titleLight + "-light"}
                                initial={{ y: "100%" }} animate={{ y: "0%" }} exit={{ y: "-100%" }}
                                transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
                                style={{
                                    display: "inline-block",
                                    fontSize: isMobile ? "clamp(1.8rem,10vw,3rem)" : "clamp(2.4rem,8vw,7.5rem)",
                                    fontWeight: 200, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1
                                }}>
                                {active.titleLight}
                            </motion.span>
                        </AnimatePresence>
                    </div>
                    <div style={{ overflow: "hidden" }}>
                        <AnimatePresence mode="wait">
                            <motion.span key={active.titleBold + "-bold"}
                                initial={{ y: "-100%" }} animate={{ y: "0%" }} exit={{ y: "100%" }}
                                transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
                                style={{
                                    display: "inline-block",
                                    fontSize: isMobile ? "clamp(1.8rem,10vw,3rem)" : "clamp(2.4rem,8vw,7.5rem)",
                                    fontWeight: 900, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1
                                }}>
                                {active.titleBold}
                            </motion.span>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Path + Labels */}
                {dims.W > 0 && (
                    <div style={{ position: "absolute", inset: 0, zIndex: 10 }}>
                        <div style={{ pointerEvents: "auto" }}>
                            <JourneyPath activeSlot={activeSlot} W={dims.W} H={dims.H} onDotClick={handleDotClick} />
                        </div>
                        <div style={{ pointerEvents: "none" }}>
                            <StationLabels
                                stations={stations}
                                windowStart={windowStart}
                                activeSlot={activeSlot}
                                W={dims.W}
                                H={dims.H}
                                dir={dir}
                            />
                        </div>
                    </div>
                )}

                {/* Pulse rings */}
                {dims.W > 0 && (
                    <>
                        <div style={{
                            position: "absolute", left: activePosX, top: activePosY,
                            width: pulseA, height: pulseA, borderRadius: "50%",
                            border: "2px solid rgba(139,92,246,0.58)",
                            pointerEvents: "none", zIndex: 16,
                            animation: "pulse-a 2s ease-out infinite",
                            transform: "translate(-50%,-50%)",
                            transition: "left 0.75s cubic-bezier(0.4,0,0.2,1), top 0.75s cubic-bezier(0.4,0,0.2,1)",
                        }} />
                        <div style={{
                            position: "absolute", left: activePosX, top: activePosY,
                            width: pulseB, height: pulseB, borderRadius: "50%",
                            border: "2px solid rgba(139,92,246,0.38)",
                            pointerEvents: "none", zIndex: 16,
                            animation: "pulse-b 2s ease-out infinite 0.4s",
                            transform: "translate(-50%,-50%)",
                            transition: "left 0.75s cubic-bezier(0.4,0,0.2,1), top 0.75s cubic-bezier(0.4,0,0.2,1)",
                        }} />
                    </>
                )}
            </div>
            {onScrollDown && (
                <button
                    onClick={onScrollDown}
                    style={{
                        position: "absolute",
                        bottom: isMobile ? 24 : 36,
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 30,
                        background: "rgba(255,255,255,0.08)",
                        border: "1.5px solid rgba(255,255,255,0.22)",
                        borderRadius: "50%",
                        width: isMobile ? 40 : 48,
                        height: isMobile ? 40 : 48,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backdropFilter: "blur(6px)",
                        animation: "bounce 2s ease-in-out infinite",
                    }}
                    aria-label="Scroll down"
                >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M4 7l5 5 5-5" stroke="rgba(255,255,255,0.85)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            )}
        </div>
    );
}