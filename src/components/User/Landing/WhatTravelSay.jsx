export default function WhatTravelersSay() {
  const testimonials = [
    {
      quote: "Kerivaa didn't give us a package. They gave us Kerala.",
      author: "Emily, UK",
    },
    {
      quote: "It felt personal, not commercial.",
      author: "Daniel, Germany",
    },
    {
      quote: "Perfectly organized. Stress-free.",
      author: "Aisha, UAE",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&display=swap');

        .wts-section {
          background: #eef2ef;
          padding: 80px 24px 100px;
          font-family: system-ui, -apple-system, Arial, Helvetica, sans-serif;
        }

        .wts-inner {
          max-width: 1100px;
          margin: 0 auto;
        }

        .wts-heading {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(36px, 5vw, 52px);
          font-weight: 700;
          color: #111;
          text-align: center;
          margin-bottom: 52px;
          letter-spacing: -0.02em;
        }

        .wts-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        @media (max-width: 720px) {
          .wts-grid {
            grid-template-columns: 1fr;
          }
        }

        .wts-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 36px 32px 32px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .wts-quote-icon {
          color: #aecdbf;
          line-height: 1;
        }

        .wts-quote {
          font-size: 16px;
          font-weight: 400;
          color: #1a1a18;
          line-height: 1.65;
          flex: 1;
        }

        .wts-author {
          font-size: 14px;
          color: #7a9e8e;
          font-weight: 400;
          letter-spacing: 0.01em;
        }
      `}</style>

      <section className="wts-section">
        <div className="wts-inner">
          <h2 className="wts-heading">What Travelers Say</h2>
          <div className="wts-grid">
            {testimonials.map(({ quote, author }) => (
              <div key={author} className="wts-card">
                <div className="wts-quote-icon">
                  <svg width="36" height="28" viewBox="0 0 36 28" fill="none">
                    <path d="M0 28V17.6C0 12.693 1.173 8.88 3.52 6.16 5.907 3.44 9.44 1.6 14.12 0l1.68 3.04C11.987 4.293 9.6 5.92 8.12 7.92 6.64 9.92 5.9 12.373 5.9 15.28H11.2V28H0ZM20.8 28V17.6c0-4.907 1.173-8.72 3.52-11.44C26.707 3.44 30.24 1.6 34.92 0l1.68 3.04c-3.813 1.253-6.2 2.88-7.68 4.88-1.48 2-2.22 4.453-2.22 7.36H31.8V28H20.8Z" fill="currentColor"/>
                  </svg>
                </div>
                <p className="wts-quote">"{quote}"</p>
                <span className="wts-author">— {author}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}