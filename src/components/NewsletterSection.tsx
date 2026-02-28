"use client";

export default function NewsletterSection() {
  return (
    <section className="section newsletter mesh-bg" id="newsletter">
      <div className="container">
        <div className="newsletter__inner">
          <p className="label label--gold" style={{ marginBottom: 14 }}>
            ✦ Stay Aligned
          </p>
          <h2 className="heading-lg" style={{ marginBottom: 16 }}>
            Sign Up For Your<br />Weekly Cosmic Forecast
          </h2>
          <p className="body-text">
            Weekly planetary transits, lunar guidance, and exclusive reading offers —
            delivered to your inbox. No spam. Just stars.
          </p>

          <form
            className="newsletter__form"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              id="newsletter-email"
              type="email"
              placeholder="Your email address"
              className="newsletter__input"
              autoComplete="email"
              required
            />
            <button type="submit" className="newsletter__submit">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
