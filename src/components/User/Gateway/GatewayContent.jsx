import { useEffect, useState, useRef } from "react";

const FLOORS = [
  {
    icon: "🍽️",
    level: "Ground Floor",
    name: "Kerala Cuisine & Heritage",
    desc: "An authentic Kerala restaurant showcasing regional cuisine, alongside a curated heritage souvenir space featuring local artisans.",
  },
  {
    icon: "🤖",
    level: "Second Floor",
    name: "AI Travel Planning Lounge",
    desc: "A futuristic space where travelers use AI-assisted tools to design their perfect Kerala itinerary with expert guidance.",
  },
  {
    icon: "🥽",
    level: "Third Floor",
    name: "VR Theatre & Performance Stage",
    desc: "An immersive VR theatre bringing Kerala's landscapes to life, plus a stage for traditional Kathakali and Mohiniyattam performances.",
  },
];

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = "delay-0" }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${delay} ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {children}
    </div>
  );
}

export default function GatewayContent() {
  return (
    <div>

      {/* ── HERO ── */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-16 pt-28 pb-20 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Text */}
          <Reveal delay="delay-100">
            <div>
              <p className="text-[#2d6a4f] text-xs font-medium tracking-[0.14em] uppercase mb-4 font-sans">
                Experience Center
              </p>
              <h1 className="text-[#1e2e23] font-bold leading-tight mb-5 text-4xl lg:text-6xl" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                The Kerivaa<br />Experience Center
              </h1>
              <p className="text-[#2d6a4f] text-xl italic mb-5" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                Gateway to Kerala
              </p>
              <p className="text-[#6b7c72] text-sm font-light leading-relaxed max-w-sm font-sans">
                A 3-story landmark tourism building in Kochi — where technology meets
                tradition, and every visitor begins their Kerala story.
              </p>
            </div>
          </Reveal>

          {/* Image */}
          <Reveal delay="delay-200">
            <div className="rounded-2xl overflow-hidden shadow-2xl bg-[#e8f0ec] group" style={{ aspectRatio: "4/3" }}>
              <img
                className="w-full h-full object-cover block transition-transform duration-700 ease-out group-hover:scale-105"
                src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80"
                alt="The Kerivaa Experience Center"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FLOOR CARDS ── */}
      <section className="bg-[#f4f1eb] py-20 px-6">
        <div className="max-w-2xl mx-auto flex flex-col gap-5">
          {FLOORS.map((floor, i) => (
            <Reveal key={floor.level} delay={`delay-${(i + 1) * 100}`}>
              <div className="bg-white rounded-2xl p-7 flex items-start gap-6 border border-[#2d6a4f]/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-default">
                <div className="flex-shrink-0 w-13 h-13 rounded-xl bg-[#e8f0ec] flex items-center justify-center text-2xl" style={{ width: 52, height: 52, minWidth: 52 }}>
                  {floor.icon}
                </div>
                <div>
                  <p className="text-[#2d6a4f] text-[10px] font-semibold tracking-[0.14em] uppercase mb-1.5 font-sans">
                    {floor.level}
                  </p>
                  <h3 className="text-[#1e2e23] font-bold text-xl mb-2 leading-snug" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                    {floor.name}
                  </h3>
                  <p className="text-[#6b7c72] text-sm font-light leading-relaxed font-sans">
                    {floor.desc}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-white py-24 px-6 text-center">
        <Reveal delay="delay-100">
          <h2 className="text-[#1e2e23] font-bold mb-5 text-4xl lg:text-5xl" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            Be Part of the Movement
          </h2>
          <p className="text-[#6b7c72] text-base font-light leading-relaxed max-w-lg mx-auto mb-10 font-sans">
            The Kerivaa Experience Center is more than a building. It's a vision for the
            future of Kerala tourism.
          </p>
          <a
            href="/contact"
            className="inline-block bg-[#2d6a4f] text-white font-semibold tracking-wide px-12 py-4 rounded-full transition-all duration-200 hover:bg-[#235c42] hover:-translate-y-0.5 hover:shadow-xl"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 17 }}
          >
            Get Involved
          </a>
        </Reveal>
      </section>

    </div>
  );
}