import { useState, useRef, useEffect } from "react";

import { getAdminContactInfo, sendContact } from "../../../services/userService";

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
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

const LOCATION_ICON = (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);

const EMAIL_ICON = (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M2 7l10 7 10-7" />
  </svg>
);

const WHATSAPP_ICON = (
  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.417A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.946 7.946 0 01-4.073-1.118l-.29-.173-3.007.856.844-3.093-.19-.302A7.948 7.948 0 014 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z" />
  </svg>
);

const PHONE_ICON = (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.02 1.18 2 2 0 012 .02h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </svg>
);

const inputClass =
  "w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-[#2a2a2a] placeholder-gray-400 font-light outline-none focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/10 transition-all duration-200 bg-white";

export default function ContactContent() {
  const [form, setForm] = useState({
    name: "", email: "", country: "", phone: "",
    month: "", budget: "", message: "",
  });
  const [sent, setSent] = useState(false);
  const [contactInfoData, setContactInfoData] = useState(null);
  const [toast, setToast] = useState(null);

  function Toast({ toast, onClose }) {
    useEffect(() => {
      if (!toast) return;
      const t = setTimeout(onClose, 4000);
      return () => clearTimeout(t);
    }, [toast]);

    if (!toast) return null;

    const isSuccess = toast.type === "success";
    return (
      <div className={`fixed top-20 right-6 z-[9999] flex items-center gap-3 px-5 py-4 rounded-xl shadow-lg border transition-all duration-300
  ${isSuccess ? "bg-white border-[#2d6a4f]/20 text-[#1e2e23]" : "bg-white border-red-200 text-red-700"}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
        ${isSuccess ? "bg-[#e8f0ec] text-[#2d6a4f]" : "bg-red-50 text-red-500"}`}>
          {isSuccess ? "✓" : "✕"}
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 15 }}>
            {isSuccess ? "Message Sent!" : "Something went wrong"}
          </p>
          <p className="text-xs font-light text-[#6b7c72] mt-0.5">{toast.message}</p>
        </div>
        <button onClick={onClose} className="ml-2 text-gray-300 hover:text-gray-500 text-lg leading-none cursor-pointer border-none bg-transparent">×</button>
      </div>
    );
  }

  const contactInfo = contactInfoData
    ? [
      {
        icon: LOCATION_ICON,
        label: "Office Location",
        value: contactInfoData.location,
        link: null,
      },
      {
        icon: EMAIL_ICON,
        label: "Email",
        value: contactInfoData.email,
        link: `mailto:${contactInfoData.email}`,
      },
      {
        icon: WHATSAPP_ICON,
        label: "WhatsApp",
        value: "Chat with us",
        link: `https://wa.me/${contactInfoData.whatsapp}`,
      },
      {
        icon: PHONE_ICON,
        label: "Call Us",
        value: contactInfoData.phone,
        link: `tel:${contactInfoData.phone.replace(/\s/g, "")}`,
      },
    ]
    : [];

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await getAdminContactInfo();
        const { contact } = response.data;
        setContactInfoData(contact)
      } catch (error) {
        console.log(error);
      }
    }
    fetchContactInfo()
  }, [])

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault(); // ← moved to top
    try {
      const response = await sendContact(form);
      const { message } = response.data;
      if (message === "Contact Created") {
        setSent(true);
        setToast({ type: "success", message: "We'll be in touch within 24 hours." });
      }
    } catch (error) {
      setToast({ type: "error", message: "Please try again or contact us directly." });
    }
  };

  return (
    <div className="bg-white pt-24 pb-0">
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* ── HEADER ── */}
      <div className="text-center px-6 pb-14">
        <Reveal delay="delay-100">
          <h1
            className="text-[#1e2e23] font-bold tracking-tight mb-4"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(36px, 6vw, 68px)" }}
          >
            Let's Talk About Your Kerala
          </h1>
          <p className="text-[#6b7c72] text-base font-light">
            Share your ideas, and we'll start designing your perfect trip.
          </p>
        </Reveal>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-5xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

        {/* ── FORM ── */}
        <Reveal delay="delay-100">
          {sent ? (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#e8f0ec] flex items-center justify-center text-[#2d6a4f] text-2xl">✓</div>
              <h3
                className="text-[#1e2e23] font-bold text-2xl"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                Message Sent!
              </h3>
              <p className="text-[#6b7c72] text-sm font-light">We'll be in touch within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Name */}
              <input
                className={inputClass}
                type="text" name="name" placeholder="Name"
                value={form.name} onChange={handleChange} required
              />
              {/* Email */}
              <input
                className={inputClass}
                type="email" name="email" placeholder="Email"
                value={form.email} onChange={handleChange} required
              />
              {/* Country + Phone */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  className={inputClass}
                  type="text" name="country" placeholder="Country"
                  value={form.country} onChange={handleChange}
                />
                <input
                  className={inputClass}
                  type="tel" name="phone" placeholder="Phone"
                  value={form.phone} onChange={handleChange}
                />
              </div>
              {/* Month + Budget */}
              <div className="grid grid-cols-2 gap-4">
                <select
                  className={inputClass}
                  name="month" value={form.month} onChange={handleChange}
                >
                  <option value="">Travel Month</option>
                  {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <select
                  className={inputClass}
                  name="budget" value={form.budget} onChange={handleChange}
                >
                  <option value="">Budget Level</option>
                  <option value="budget">Budget (Under ₹30,000)</option>
                  <option value="mid">Mid-Range (₹30,000–₹70,000)</option>
                  <option value="premium">Premium (₹70,000–₹1,50,000)</option>
                  <option value="luxury">Luxury (₹1,50,000+)</option>
                </select>
              </div>
              {/* Message */}
              <textarea
                className={`${inputClass} resize-none`}
                name="message" placeholder="Tell us about your dream Kerala trip..."
                rows={5} value={form.message} onChange={handleChange}
              />
              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-[#2d6a4f] hover:bg-[#235c42] text-white font-semibold text-sm tracking-wide py-4 rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#2d6a4f]/25 cursor-pointer border-none"
              >
                Send Message
              </button>
            </form>
          )}
        </Reveal>

        {/* ── RIGHT SIDE ── */}
        <div className="flex flex-col gap-6">

          {/* Contact Info Items */}
          {contactInfo.map((item, i) => (
            <Reveal key={item.label} delay={`delay-${(i + 1) * 100}`}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#e8f0ec] flex items-center justify-center text-[#2d6a4f] flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-[#1e2e23] font-semibold text-sm mb-0.5"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 17 }}>
                    {item.label}
                  </p>
                  {item.link ? (
                    <a
                      href={item.link}
                      className="text-[#2d6a4f] text-sm font-light hover:underline"
                      target={item.link.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-[#6b7c72] text-sm font-light">{item.value}</p>
                  )}
                </div>
              </div>
            </Reveal>
          ))}

          {/* Free Consultation Card */}
          <Reveal delay="delay-500">
            <div className="mt-2 bg-[#f4f1eb] rounded-2xl p-7 border border-[#e0d9cc]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#2d6a4f]">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <h3
                  className="text-[#1e2e23] font-bold text-lg"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  Free Consultation
                </h3>
              </div>
              <p className="text-[#6b7c72] text-sm font-light leading-relaxed mb-5">
                Schedule a free 15-minute call with a Kerivaa travel expert.
              </p>
              <button className="bg-[#2d6a4f] hover:bg-[#235c42] text-white text-sm font-semibold px-6 py-3 rounded-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer border-none">
                Schedule a Call
              </button>
            </div>
          </Reveal>

        </div>
      </div>
    </div>
  );
}