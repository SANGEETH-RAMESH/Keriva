import React, { useEffect, useState } from 'react';

export default function AnimatedKOverlay({ onComplete }) {
    const [phase, setPhase] = useState("drawing");

    useEffect(() => {
        const holdTimer = setTimeout(() => setPhase("exiting"), 2500);
        const doneTimer = setTimeout(() => onComplete?.(), 3300);
        return () => {
            clearTimeout(holdTimer);
            clearTimeout(doneTimer);
        };
    }, [onComplete]);

    const isExiting = phase === "exiting";

    const kPath = "M 5 15 L 40 15 L 40 45 L 70 15 L 105 15 L 70 50 L 105 85 L 70 85 L 40 55 L 40 85 L 5 85 Z";

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                    "linear-gradient(135deg, #2a1310 0%, #000000 50%, #0a0a1a 100%)",
                clipPath: isExiting ? "inset(0 0 100% 0)" : "inset(0 0 0% 0)",
                transition: isExiting
                    ? "clip-path 0.8s cubic-bezier(0.76, 0, 0.24, 1)"
                    : "none",
                pointerEvents: isExiting ? "none" : "all",
            }}
        >
            <style>{`
                .k-path {
                    stroke-dasharray: 500;
                    stroke-dashoffset: 500;
                    animation: drawK 2s ease-in-out forwards;
                }
                .k-fill-inner {
                    opacity: 0;
                    animation: showFill 0.01s ease 2s forwards;
                }
                @keyframes drawK {
                    to { stroke-dashoffset: 0; }
                }
                @keyframes showFill {
                    to { opacity: 1; }
                }
            `}</style>

            <svg
                viewBox="0 0 110 100"
                style={{
                    width: "clamp(9rem, 18vw, 15rem)",
                    height: "clamp(9rem, 18vw, 15rem)",
                    transform: isExiting ? "scale(0.92)" : "scale(1)",
                    transition: "transform 0.5s ease",
                }}
                strokeLinecap="square"
                strokeLinejoin="miter"
            >
                <path
                    className="k-fill-inner"
                    d={kPath}
                    fill="white"
                    stroke="none"
                />

                <path
                    className="k-path"
                    d={kPath}
                    fill="none"
                    stroke="white"
                    strokeWidth="0.8"
                />
            </svg>
        </div>
    );
}