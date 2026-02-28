import Image from "next/image";
import Link from "next/link";

/* Stitch divider — morni's repeated tick marks between sections */
function StitchDivider({ label }: { label?: string }) {
  return (
    <div className="stitch-divider">
      <div className="stitch-divider__mark">
        {[0,1,2,3].map(i=><span key={i}/>)}
      </div>
      <span className="stitch-divider__mark">
        {[0,1,2,3,4,5].map(i=><span key={i}/>)}
      </span>
      {label && <span className="stitch-divider__text">{label}</span>}
      <span className="stitch-divider__mark">
        {[0,1,2,3,4,5].map(i=><span key={i}/>)}
      </span>
      <div className="stitch-divider__mark">
        {[0,1,2,3].map(i=><span key={i}/>)}
      </div>
    </div>
  );
}

const serviceCards = [
  {
    num: "01",
    icon: "✦",
    title: "Birth Chart Reading",
    desc: "Your natal chart decoded — planetary positions, houses, yogas, and your life's karmic map laid bare by a certified Jyotish expert.",
    link: "#readings",
  },
  {
    num: "02",
    icon: "☽",
    title: "Lunar Guidance",
    desc: "Track the Moon through 12 signs and harness each phase for intention setting, release, and manifestation — tailored to your chart.",
    link: "#readings",
  },
  {
    num: "03",
    icon: "🪐",
    title: "Predictive Astrology",
    desc: "Navigate Saturn, Jupiter, and Rahu-Ketu transits with clarity. Understand dasha and antardasha periods that govern pivotal life chapters.",
    link: "#readings",
  },
];

export default function ServicesSection() {
  return (
    <section className="section services mesh-bg watermark-bg" id="services">
      <div className="container">

        {/* Morni-style 3-column intro layout: left-text | center-image | right-text */}
        <div className="services__intro">
          <div className="services__intro-left">
            <p className="label label--gold" style={{ marginBottom: 14 }}>
              ✦ What We Offer
            </p>
            <h2 className="services__intro-headline">
              Co-Create Your<br />Cosmic Journey
            </h2>
            <p className="services__intro-sub">
              Discover, connect, and co-create directly
              with Vedic masters and AI planetary intelligence
            </p>
            <Link href="#readings" className="btn--paren">
              What is a cosmic reading?
            </Link>
          </div>

          {/* Center image — dashed border like morni */}
          <div className="services__intro-img">
            <Image
              src="/assets/birth-chart.png"
              alt="Astrologer with birth chart"
              fill
              style={{ objectFit: "cover" }}
              sizes="320px"
            />
            <span className="services__intro-img-caption">your reading awaits</span>
          </div>

          <div className="services__intro-right">
            <p>
              Here, you collaborate with master Vedic astrologers who draw from a living
              library of ancient Jyotish texts, planetary transits, dasha cycles, and yogas
              to bring your cosmic blueprint to life.
            </p>
            <br />
            <p>
              From birth to now — every planetary placement is a conversation. Think of it
              as sowing the seeds of self-knowledge — nurtured by celestial wisdom — into
              your own cosmic sanctuary.
            </p>
            <div style={{ marginTop: 28 }}>
              <Link href="#readings" className="btn btn--primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>

        {/* Stitch divider like morni's tick pattern */}
        <StitchDivider />

        {/* 3-tile grid */}
        <div className="services__grid">
          {serviceCards.map((s) => (
            <div key={s.num} className="service-tile">
              <span className="service-tile__num">[{s.num}]</span>
              <span className="service-tile__icon">{s.icon}</span>
              <h3 className="service-tile__title">{s.title}</h3>
              <p className="service-tile__desc">{s.desc}</p>
              <span className="service-tile__link">Explore →</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
