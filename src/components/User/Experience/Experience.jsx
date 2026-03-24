import { useEffect, useRef, useState } from "react";

import { getExperience } from '../../../services/userService';


const CARD_DELAYS = [
  "delay-100",
  "delay-200",
  "delay-300",
  "delay-[400ms]",
  "delay-500",
  "delay-[600ms]",
];

export default function Experience() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [experiences,setExperiences] = useState([])

  useEffect(() => {
    const fetchExperience = async() => {
      try {
        const response = await getExperience();
        console.log(response.data);
        const {experiences} = response.data;
        setExperiences(experiences)
      } catch (error) {
        console.log(error)
      }
    }
    fetchExperience();
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-white px-6 pt-32 pb-24">
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <h2
          className={`text-center font-semibold tracking-tight mb-3 text-4xl lg:text-6xl transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          Signature Kerala Narratives
        </h2>

        {/* Sub */}
        <p
          className={`text-center text-sm font-light text-[#888] mb-14 transition-all duration-700 ease-out delay-150 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
        >
          These are journeys we frequently design. Every one is customizable.
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {experiences.map((exp, i) => {
  const badge = exp.duration && exp.price
    ? `${exp.duration} | Starting from ₹${exp.price}`
    : null;

  return (
    <div
      key={exp._id}
      className={`flex flex-col rounded-sm overflow-hidden bg-white transition-all duration-[650ms] ease-out ${CARD_DELAYS[i]} ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-9"
      }`}
    >
      {/* Image */}
      <div className="relative w-full overflow-hidden rounded-sm group" style={{ aspectRatio: "4/3" }}>
        <img
          src={exp.image}
          alt={exp.title}
          loading="lazy"
          className={`w-full h-full object-cover block transition-transform duration-[1100ms] ease-out group-hover:scale-105 ${
            visible ? "scale-100" : "scale-110"
          }`}
        />

        {badge && (
          <span className="absolute bottom-3 left-3 bg-black/55 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded tracking-wide">
            {badge}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="pt-5 pb-2 px-1 flex flex-col gap-2 flex-1">
        <div className="text-[#111] font-semibold text-xl leading-tight tracking-tight">
          {exp.title}
        </div>

        <div className="text-[#777] text-[13px] font-light leading-relaxed mb-3">
          {exp.desc}
        </div>

        <button className="self-start mt-auto bg-[#2d6a4f] hover:bg-[#235840] text-white text-[13px] font-semibold px-5 py-2.5 rounded-full transition-all duration-200">
          Customize This Journey
        </button>
      </div>
    </div>
  );
})}
        </div>

      </div>
    </section>
  );
}