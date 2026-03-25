import { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import KeralaLanding from "./ScrollingImage";
import ShapeYourJourney from "./ShapeYourJourney";
import WhyChooseUs from "./ChooseUs";
import WhatTravelersSay from "./WhatTravelSay";
import Footer from "../common/Footer";
import Navbar from "../common/Navbar";
import BoardArca from "./JourneyTimeline";
import ScrollVideoSection from "./Hero";
import InfiniteMarquee from "./DistrictLoading";
import ScrollSequence from "./ScrollSequence";


const SECTIONS = [
  { id: "syj", bg: "#F7FE3D" },
  { id: "wcu", bg: "#ffffff" },
  { id: "wts", bg: "#eef2ef" },
  { id: "footer", bg: "#1e2e23" },
];

export default function LandingPage() {
  const heroRef = useRef(null);
  const syjRef = useRef(null);
  const wcuRef = useRef(null);
  const wtsRef = useRef(null);
  const footerRef = useRef(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const scrollVideoRef = useRef(null);

  const [pastHero, setPastHero] = useState(false);
  const [navBg, setNavBg] = useState("transparent");

  const scrollToForm = () => {
    const top = syjRef.current?.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const scrollToNext = () => {
    const top = syjRef.current?.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top, behavior: "smooth" });
  };

  useEffect(() => {
    const refs = [
      { ref: syjRef, bg: "#F7FE3D" },
      { ref: wcuRef, bg: "#ffffff" },
      { ref: wtsRef, bg: "#eef2ef" },
      { ref: footerRef, bg: "#1e2e23" },
    ];

    const handleScroll = () => {
      if (!heroRef.current) return;

      const heroBottom = heroRef.current.getBoundingClientRect().bottom;
      const isHero = heroBottom > 0;
      setPastHero(!isHero);

      // ── Reset videoProgress when section scrolls out of view ──
      if (scrollVideoRef.current) {
        const rect = scrollVideoRef.current.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        if (!inView) setVideoProgress(0);  // ← reset so navbar shows again
      }

      if (isHero) {
        setNavBg("transparent");
        return;
      }

      let activeBg = "#ffffff";
      for (const { ref, bg } of refs) {
        if (!ref.current) continue;
        const top = ref.current.getBoundingClientRect().top;
        if (top <= 1) activeBg = bg;
      }
      setNavBg(activeBg);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{ margin: 0, padding: 0 }}>
      <Navbar onStartDesigning={scrollToForm} pastHero={pastHero} navBg={navBg} hidden={videoProgress > 0.05} />
      <div ref={syjRef}>
        <ScrollSequence />
      </div>
      {/* <div ref={heroRef}>
        <BoardArca onScrollDown={scrollToNext} />
      </div> */}

      <div style={{
        height: "150px",
        marginTop: "-150px",
        background: "linear-gradient(to bottom, transparent, #F7F3ED)",
        position: "relative",
        zIndex: 20,
        pointerEvents: "none",
      }} />

      <div ref={syjRef}>
        <ShapeYourJourney />
      </div>

      <div ref={scrollVideoRef}>
        <ScrollVideoSection onProgressChange={setVideoProgress} />
      </div>

      <div ref={wcuRef}>
        <WhyChooseUs />
      </div>

      {/* 2. INSERT THE MARQUEE HERE */}
      {/* <InfiniteMarquee /> */}

      <div ref={wtsRef}>
        <WhatTravelersSay />
      </div>

      <div ref={footerRef} >
        <Footer />
      </div>
    </div>
  );
}