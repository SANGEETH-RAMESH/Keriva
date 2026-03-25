import React, { useEffect, useState } from "react";
import lighthouse from '../../../assets/lighthouse.png'

export default function HeroAnimation() {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Automatically trigger the animation 800ms after the page loads
    const timer = setTimeout(() => {
      setIsAnimating(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleReplay = () => {
    setIsAnimating(false);
    setTimeout(() => setIsAnimating(true), 100);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-white font-sans">
      
      {/* ========================================================= */}
      {/* LAYER 1: The Background Image (Shrinks behind the text)   */}
      {/* ========================================================= */}
      <div
        className={`absolute inset-0 transition-transform duration-[2500ms] ease-out origin-center ${
          isAnimating ? "scale-100" : "scale-[1.2]"
        }`}
      >
        {/* We add a sky-blue background color because your lighthouse image has a transparent background */}
        <div
          className="w-full h-full bg-sky-100 bg-no-repeat"
          style={{
            backgroundImage: lighthouse,
            /* 'cover' zooms in to fill the screen. If the lighthouse looks too zoomed in, change this to 'contain' */
            backgroundSize: "cover", 
            backgroundPosition: "center 20%", 
          }}
        />
      </div>

      {/* ========================================================= */}
      {/* LAYER 2: The SVG Mask (Fades in to create the text hole)  */}
      {/* ========================================================= */}
      <svg
        className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-[2000ms] ease-in-out ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <mask id="text-mask">
            {/* White area: Means the overlay will be VISIBLE here */}
            <rect width="100%" height="100%" fill="white" />
            
            {/* Black area: Means the overlay will be TRANSPARENT here (the cutout) */}
            <text
              x="50%"
              y="48%"
              dominantBaseline="middle"
              textAnchor="middle"
              fill="black"
              className="font-black"
              style={{
                fontSize: "18vw", // Scales dynamically with screen width
                fontFamily: "system-ui, sans-serif",
                letterSpacing: "-0.02em",
              }}
            >
              KERIVA
            </text>
            
            {/* Optional sub-text cutout, similar to the "Real Estate" text in the video */}
            <text
              x="50%"
              y="68%"
              dominantBaseline="middle"
              textAnchor="middle"
              fill="black"
              className="font-light uppercase"
              style={{
                fontSize: "3vw",
                fontFamily: "system-ui, sans-serif",
                letterSpacing: "0.3em",
              }}
            >
              Project
            </text>
          </mask>
        </defs>

        {/* The solid white overlay covering everything EXCEPT the text mask */}
        <rect width="100%" height="100%" fill="white" mask="url(#text-mask)" />
      </svg>

      {/* ========================================================= */}
      {/* LAYER 3: Bottom Clouds/Fog Gradient (Volumetric effect)   */}
      {/* ========================================================= */}
      <div
        className={`absolute bottom-0 left-0 w-full h-1/2 pointer-events-none transition-opacity duration-[3000ms] ease-in-out ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background: "linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.7) 30%, rgba(255,255,255,0) 100%)",
        }}
      />

      {/* ========================================================= */}
      {/* LAYER 4: The Initial Intro Text (Fades out)               */}
      {/* ========================================================= */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-1000 ${
          isAnimating ? "opacity-0" : "opacity-100"
        }`}
      >
        <h1 className="text-5xl md:text-7xl font-bold text-slate-800 tracking-tight mb-4 drop-shadow-lg text-center">
          Find Your Guiding Light
        </h1>
        <p className="text-lg md:text-2xl text-slate-800 font-medium drop-shadow-md text-center">
          Expert navigation. A clear path forward.
        </p>
      </div>

      {/* Replay Button for development testing */}
      <button
        onClick={handleReplay}
        className="absolute top-4 right-4 z-50 px-4 py-2 bg-slate-100/50 hover:bg-slate-200 text-slate-800 text-sm rounded-full backdrop-blur transition-colors"
      >
        Replay Animation
      </button>
    </div>
  );
}