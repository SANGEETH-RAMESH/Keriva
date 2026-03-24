export default function WhyChooseUs() {
  const features = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" />
        </svg>
      ),
      title: "Hyper-Personalized Planning",
      description: "We design Kerala around you.",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
      title: "Local Roots, Global Standards",
      description: "Authentic experiences with world-class execution.",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      ),
      title: "End-to-End Care",
      description: "From arrival to departure, we handle everything.",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&display=swap');

        .wcu-section {
          background: #ffffff;
          padding: 80px 24px 100px;
          font-family: system-ui, -apple-system, Arial, Helvetica, sans-serif;
        }

        .wcu-inner {
          max-width: 900px;
          margin: 0 auto;
        }

        .wcu-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 48px 32px;
        }

        @media (max-width: 680px) {
          .wcu-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }

        .wcu-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0;
        }

        .wcu-icon-wrap {
          width: 80px;
          height: 80px;
          background: #f0f7f3;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          transition: background 0.25s, transform 0.25s;
        }

        .wcu-card:hover .wcu-icon-wrap {
          background: #e3f2eb;
          transform: translateY(-3px);
        }

        .wcu-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 22px;
          font-weight: 700;
          color: #111;
          line-height: 1.25;
          margin-bottom: 12px;
          letter-spacing: -0.01em;
        }

        .wcu-desc {
          font-size: 15px;
          font-weight: 300;
          color: #777;
          line-height: 1.6;
          max-width: 220px;
          margin: 0 auto;
        }
      `}</style>

      <section className="wcu-section">
        <div className="wcu-inner">
          <div className="wcu-grid">
            {features.map(({ icon, title, description }) => (
              <div key={title} className="wcu-card">
                <div className="wcu-icon-wrap">{icon}</div>
                <h3 className="wcu-title">{title}</h3>
                <p className="wcu-desc">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}