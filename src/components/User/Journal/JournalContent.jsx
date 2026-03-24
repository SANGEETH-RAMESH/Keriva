import { useEffect, useRef, useState } from "react";

import { getJournal } from '../../../services/userService';

const POSTS = [
  {
    title: "Best Time to Visit Kerala in 2026",
    desc: "Planning your Kerala trip? Here's a month-by-month guide to weather, festivals, and the best...",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  },
  {
    title: "7 Days in Kerala: A Complete Itinerary",
    desc: "From the cultural streets of Kochi to the serene backwaters of Alleppey — the perfect week in...",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80",
  },
  {
    title: "Luxury Travel in Kerala: What to Expect",
    desc: "Kerala's luxury scene is intimate, nature-forward, and deeply personal. Here's what sets ...",
    image: "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=800&q=80",
  },
  {
    title: "Hidden Waterfalls You Must Visit",
    desc: "Beyond the tourist trail lie Kerala's secret cascades — pristine, powerful, and surrounded...",
    image: "https://images.unsplash.com/photo-1591017403286-fd8493524e1e?w=800&q=80",
  },
  {
    title: "Kerala Cuisine Guide for First-Time Visitors",
    desc: "From banana leaf sadhya to fresh seafood — a culinary journey through Kerala's extraordinary...",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&q=80",
  },
  {
    title: "Ayurveda in Kerala: What You Should Know",
    desc: "Kerala is the birthplace of Ayurveda. Here's how to find authentic treatments and what to expe...",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
  },
];

const DELAYS = [
  "delay-75",
  "delay-150",
  "delay-300",
  "delay-75",
  "delay-150",
  "delay-300",
];

function useReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = "delay-0", className = "" }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${delay} ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        } ${className}`}
    >
      {children}
    </div>
  );
}

function PostCard({ post, delay }) {
  const [ref, visible] = useReveal(0.1);
  return (
    <div
      ref={ref}
      className={`flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group ${delay} ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        } transition-all duration-700 ease-out`}
    >
      {/* Image */}
      <div className="overflow-hidden" style={{ aspectRatio: "16/10" }}>
        <img
          src={post.image}
          alt={post.title}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${visible ? "scale-100" : "scale-110"
            }`}
        />
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col flex-1 gap-3">
        <h3
          className="text-[#1e2e23] font-bold text-xl leading-snug"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          {post.title}
        </h3>
        <p className="text-[#6b7c72] text-sm font-light leading-relaxed flex-1">
          {post.desc}
        </p>
        <span className="text-[#2d6a4f] text-sm font-medium mt-1 group-hover:underline inline-flex items-center gap-1">
          Read More →
        </span>
      </div>
    </div>
  );
}

export default function JournalContent() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [posts, setPosts] = useState([]);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) setSubscribed(true);
  };

  useEffect(() => {
    console.log("USE EFFECT TRIGGERED");
    const fetchJournal = async () => {
      try {
        const response = await getJournal();
        const { journal } = response.data;
        console.log(journal, "Journal")
        setPosts(journal);
      } catch (error) {
        console.log(error);
      }
    }
    fetchJournal();
  }, [])

  return (
    <div>

      {/* ── HEADER ── */}
      <section className="bg-white pt-28 pb-14 px-6 text-center">
        <Reveal delay="delay-100">
          <h1
            className="text-[#1e2e23] font-bold tracking-tight mb-4"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(38px, 6vw, 68px)",
            }}
          >
            The Kerala Journal
          </h1>
          <p className="text-[#6b7c72] text-base font-light">
            Stories, guides, and inspiration for your Kerala journey.
          </p>
        </Reveal>
      </section>

      {/* ── BLOG GRID ── */}
      <section className="bg-white px-6 pb-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {posts.map((post, i) => (
            <PostCard key={post._id} post={post} delay={DELAYS[i % DELAYS.length]}/>
          ))}
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="bg-[#f4f1eb] py-24 px-6">
        <Reveal delay="delay-100">
          <div className="max-w-xl mx-auto text-center">
            <h2
              className="text-[#1e2e23] font-bold mb-4"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(28px, 4vw, 44px)",
              }}
            >
              Get Kerala Travel Inspiration
            </h2>
            <p className="text-[#6b7c72] text-sm font-light mb-10">
              Curated stories and travel ideas delivered to your inbox.
            </p>

            {subscribed ? (
              <p className="text-[#2d6a4f] font-medium text-base">
                ✓ You're subscribed! Watch your inbox for Kerala stories.
              </p>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="flex items-center gap-3 bg-white rounded-full px-2 py-2 shadow-sm border border-gray-200 max-w-md mx-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="flex-1 bg-transparent text-sm text-[#2a2a2a] placeholder-[#aaa] outline-none px-3 font-light"
                />
                <button
                  type="submit"
                  className="bg-[#2d6a4f] hover:bg-[#235c42] text-white text-sm font-semibold px-6 py-3 rounded-full transition-all duration-200 hover:-translate-y-px hover:shadow-lg whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </section>

    </div>
  );
}