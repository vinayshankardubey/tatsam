import Image from "next/image";
import Link from "next/link";

const readings = [
  {
    id: "natal",
    badge: "Most Popular",
    meta: "90-min deep dive",
    title: "Full Natal Chart Reading",
    desc: "Planetary positions, houses, yogas, and your life's karmic map — decoded by a Jyotish expert.",
    price: "₹2,499",
    priceSub: "/ session",
    image: "/assets/birth-chart.png",
  },
  {
    id: "consult",
    badge: "Live Session",
    meta: "60-min personalised",
    title: "Live Astrologer Session",
    desc: "One-on-one with a verified Vedic master. Ask about career, relationships, health, or purpose.",
    price: "₹1,999",
    priceSub: "/ session",
    image: "/assets/consultation.png",
  },
  {
    id: "daily",
    badge: "Daily",
    meta: "Auto-delivered",
    title: "Daily Horoscope Report",
    desc: "Personalised daily forecast based on your natal chart — far beyond Sun-sign horoscopes.",
    price: "₹299",
    priceSub: "/ month",
    image: "/assets/horoscope-card.png",
  },
];

export default function ReadingsSection() {
  return (
    <section className="section section-light readings" id="readings">
      <div className="container">
        <div className="readings__header">
          <div>
            <p className="label label--gold" style={{ marginBottom: 12 }}>
              ✦ Choose Your Path
            </p>
            <h2 className="heading-lg readings__title">
              Browse From<br />Existing Readings
            </h2>
          </div>
          <Link href="#" className="btn btn--outline readings__view-btn">
            View All Readings
          </Link>
        </div>

        <div className="readings__grid">
          {readings.map((r) => (
            <div key={r.id} className="reading-card reading-card--light">
              <div className="reading-card__img-wrap">
                <Image
                  src={r.image}
                  alt={r.title}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <span className="reading-card__badge">{r.badge}</span>
              </div>

              <div className="reading-card__body">
                <p className="reading-card__meta">{r.meta}</p>
                <h3 className="reading-card__title">{r.title}</h3>
                <p className="reading-card__desc">{r.desc}</p>
                <div className="reading-card__footer">
                  <div className="reading-card__price">
                    {r.price}<sub>{r.priceSub}</sub>
                  </div>
                  <button className="reading-card__arrow" aria-label="Book now">→</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
