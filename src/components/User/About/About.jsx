import { useEffect, useState, useRef } from "react";
import { getAbout } from '../../../services/userService'

const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "Experiences", path: "/experience" },
  { name: "Explore Kerala", path: "/explore-kerala" },
  { name: "About", path: "/about" },
  { name: "Gateway", path: "/gateway" },
  { name: "Journal", path: "/journal" },
  { name: "Contact", path: "/contact" },
];

const WAY_CARDS = [
  { icon: "🤍", title: "Deep Personalization", desc: "Every journey is built from scratch based on your unique desires." },
  { icon: "🤝", title: "Local Partnerships", desc: "We work with Kerala's finest hosts, guides, and artisans." },
  { icon: "🧭", title: "Seamless Planning", desc: "From first message to farewell, every detail is handled." },
  { icon: "📖", title: "Thoughtful Storytelling", desc: "We weave narrative into travel — every stop has meaning." },
];

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = "" }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${delay} ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-9"
        }`}
    >
      {children}
    </div>
  );
}

export default function About() {

  const [aboutData, setAboutData] = useState([]);


  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await getAbout();
        const { about } = response.data;
        const activeData = about.filter(item => item.is_active);
        setAboutData(activeData)
      } catch (error) {
        console.log(error);
      }
    }
    fetchAbout()
  }, []);


  const hero = aboutData.find(item => item.section === "hero");
  console.log(hero, 'ehyy')
  const wayCards = aboutData.filter(item => item.section === "way_card");

  const visions = aboutData.filter(item => item.section === "vision");

  return (
    <>
      {/* Hero */}
      <section className="min-h-[52vh] bg-[#f4f1eb] flex items-center justify-center text-center px-6 pt-32 pb-20">
        <div className="max-w-2xl">
          <Reveal delay="delay-100">
            <p className="text-[#2d6a4f] text-[11px] font-medium tracking-[0.16em] uppercase mb-5 font-sans">
              {hero?.subtitle}
            </p>
          </Reveal>
          <Reveal delay="delay-200">
            <h1 className="font-serif text-[clamp(40px,7vw,76px)] font-bold leading-[1.05] text-[#1e2e23] mb-6">
              {hero?.title}
            </h1>
          </Reveal>
          <Reveal delay="delay-300">
            <p className="font-sans text-base font-light leading-[1.75] text-[#6b7c72] max-w-xl mx-auto">
              {hero?.body}
            </p>
            <div className="w-12 h-0.5 bg-[#2d6a4f] rounded-full mx-auto mt-10" />
          </Reveal>
        </div>
      </section>

      {/* The Kerivaa Way */}
      <section className="py-24 px-6 bg-white">
        <Reveal>
          <h2 className="font-serif text-[clamp(28px,5vw,44px)] font-bold text-center text-[#1e2e23] mb-14">
            The Kerivaa Way of Travel
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {wayCards.map((card, i) => (
            <Reveal key={card._id} delay={`delay-[${(i + 1) * 100}ms]`}>
              <div className="bg-[#f9faf9] rounded-2xl p-8 flex gap-5 items-start border border-[#2d6a4f]/10 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(45,106,79,0.1)] transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-[#e8f0ec] flex items-center justify-center text-xl flex-shrink-0">
                  {card.subtitle}
                </div>
                <div>
                  <div className="font-serif text-[19px] font-semibold text-[#1e2e23] mb-2">
                    {card.title}
                  </div>
                  <div className="font-sans text-sm font-light leading-[1.65] text-[#6b7c72]">
                    {card.body}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Vision */}
      <section className="bg-[#e8f0ec] py-24 px-6">
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-10">
          {visions.map((item, i) => (
            <Reveal key={item._id} delay={`delay-[${(i + 1) * 100}ms]`}>
              <div>
                <h3 className="font-serif text-[26px] font-bold text-[#1e2e23] mb-4 flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#2d6a4f] flex-shrink-0" />
                  {item.title}
                </h3>

                <p className="font-sans text-[15px] font-light leading-[1.75] text-[#6b7c72]">
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}