import { Link } from "react-router-dom";


export default function Footer() {
  const quickLinks = [
    { name: "Experiences", path: "/experience" },
    { name: "Explore Kerala", path: "/explore-kerala" },
    { name: "Gateway", path: "/gateway" },
    { name: "Journal", path: "/journal" },
    { name: "Contact", path: "/contact" },
  ];
  const socials = ["Instagram", "Facebook", "YouTube"];

  return (
    <footer className="bg-[#1e2e23] text-[#c8d5cc] px-6 md:px-12 pt-16">

      {/* Top Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-14">

        {/* Brand */}
        <div>
          <div
            className="text-white text-[28px] font-bold mb-4 tracking-[0.01em]"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Kerivaa
          </div>
          <p className="text-[#8aab96] text-sm font-light leading-relaxed max-w-[220px]">
            Design Your Kerala. Hyper-personalized travel experiences crafted around you.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <div className="text-[#8aab96] text-[11px] font-semibold tracking-[0.12em] uppercase mb-5">
            Quick Links
          </div>
          <ul className="flex flex-col gap-3 list-none">
            {quickLinks.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className="text-[#c8d5cc] text-[15px] font-light no-underline hover:text-white transition-colors duration-200"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <div className="text-[#8aab96] text-[11px] font-semibold tracking-[0.12em] uppercase mb-5">
            Contact
          </div>
          {["Kochi, Kerala, India", "hello@kerivaa.com", "+91 98765 43210"].map((item) => (
            <div key={item} className="text-[#c8d5cc] text-[15px] font-light mb-3 leading-relaxed">
              {item}
            </div>
          ))}
        </div>

        {/* Follow Us */}
        <div>
          <div className="text-[#8aab96] text-[11px] font-semibold tracking-[0.12em] uppercase mb-5">
            Follow Us
          </div>
          <div className="flex gap-5 flex-wrap">
            {socials.map((s) => (
              <a
                key={s}
                href="#"
                className="text-[#c8d5cc] text-[15px] font-light no-underline hover:text-white transition-colors duration-200"
              >
                {s}
              </a>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-6 flex flex-wrap justify-between items-center gap-3">
        <span className="text-[#6a8a76] text-[13px] font-light">
          © 2026 Kerivaa. All rights reserved.
        </span>
        <div className="flex gap-6">
          {["Privacy Policy", "Terms of Use"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-[#6a8a76] text-[13px] font-light no-underline hover:text-[#c8d5cc] transition-colors duration-200"
            >
              {item}
            </a>
          ))}
        </div>
      </div>

    </footer>
  );
}