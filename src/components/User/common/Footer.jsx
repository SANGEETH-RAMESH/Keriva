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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&display=swap');

        .footer-root {
          background: #1e2e23;
          color: #c8d5cc;
          padding: 64px 48px 0;
          font-family: system-ui, -apple-system, Arial, sans-serif;
        }

        @media (max-width: 768px) {
          .footer-root { padding: 48px 24px 0; }
        }

        .footer-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 40px;
          padding-bottom: 56px;
        }

        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr; gap: 32px; }
        }

        .footer-label {
          color: #8aab96;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 20px;
        }

        .footer-link {
          display: block;
          color: #c8d5cc;
          font-size: 15px;
          font-weight: 300;
          text-decoration: none;
          margin-bottom: 12px;
          transition: color 0.2s;
        }
        .footer-link:hover { color: #ffffff; }

        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.1);
          padding: 24px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }

        .footer-legal-link {
          color: #6a8a76;
          font-size: 13px;
          font-weight: 300;
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-legal-link:hover { color: #c8d5cc; }
      `}</style>

      <footer className="footer-root">

        {/* Top Grid */}
        <div className="footer-grid">

          {/* Brand */}
          <div>
            <div style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              color: "#ffffff",
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: "0.01em",
              marginBottom: 16,
            }}>
              Kerivaa
            </div>
            <p style={{
              color: "#8aab96",
              fontSize: 14,
              fontWeight: 300,
              lineHeight: 1.7,
              maxWidth: 220,
              margin: 0,
            }}>
              Design Your Kerala. Hyper-personalized travel experiences crafted around you.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <div className="footer-label">Quick Links</div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="footer-link">{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="footer-label">Contact</div>
            {["Kochi, Kerala, India", "hello@kerivaa.com", "+91 98765 43210"].map((item) => (
              <div key={item} style={{
                color: "#c8d5cc",
                fontSize: 15,
                fontWeight: 300,
                marginBottom: 12,
                lineHeight: 1.6,
              }}>
                {item}
              </div>
            ))}
          </div>

          {/* Follow Us */}
          <div>
            <div className="footer-label">Follow Us</div>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              {socials.map((s) => (
                <a key={s} href="#" className="footer-link" style={{ marginBottom: 0 }}>{s}</a>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <span style={{ color: "#6a8a76", fontSize: 13, fontWeight: 300 }}>
            © 2026 Kerivaa. All rights reserved.
          </span>
          <div style={{ display: "flex", gap: 24 }}>
            {["Privacy Policy", "Terms of Use"].map((item) => (
              <a key={item} href="#" className="footer-legal-link">{item}</a>
            ))}
          </div>
        </div>

      </footer>
    </>
  );
}