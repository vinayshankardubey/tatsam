import Image from "next/image";
import Link from "next/link";

/* Morni's "Rooted in Nature / Inspired by Culture" layout:
   Small aside image | Main headline + copy | Big main image */
export default function BrandSection() {
  return (
    <section className="section brand-sec mesh-bg" id="consult">
      <div className="container">
        <div className="brand-sec__layout">

          {/* Aside: small dashed box + decorative symbol */}
          <div className="brand-sec__aside">
            <div className="brand-sec__aside-img">
              <Image
                src="/assets/horoscope-card.png"
                alt="Astrology card"
                width={120}
                height={120}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            </div>
            <div className="brand-sec__deco">✦</div>
          </div>

          {/* Center content */}
          <div className="brand-sec__content">
            <h2 className="brand-sec__headline">
              <span>Rooted in Cosmos</span>
              Inspired by<br />Ancient Wisdom
            </h2>

            <p className="brand-sec__desc">
              What we experience profoundly reflects how the cosmos is aligned.
              At Tatsam, we honour this connection by uniting you with the planetary
              archetypes and techniques that bring your journey to life.
            </p>
            <p className="brand-sec__desc">
              Our ecosystem offers a tapestry of insights — from Vedic birth charts to
              AI-visualised natal maps to live expert sessions. These elements can be combined
              to craft a reading that uniquely tells your cosmic story.
            </p>
            <p className="brand-sec__desc">
              Explore the astrologers, techniques, and planetary cycles that resonate with
              your personal journey.
            </p>

            <div className="brand-sec__btns">
              <Link href="#readings" className="brand-sec__btn">
                Explore Our Astrologers
              </Link>
              <Link href="#zodiac" className="brand-sec__btn">
                Explore Vedic Charts
              </Link>
            </div>
          </div>

          {/* Right: big dashed-border image */}
          <div className="brand-sec__main-img">
            <Image
              src="/assets/consultation.png"
              alt="Cosmic consultation"
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
