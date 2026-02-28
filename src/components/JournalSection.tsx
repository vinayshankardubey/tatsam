import Image from "next/image";
import Link from "next/link";

const posts = [
  {
    id: "saturn",
    tag: "Saturn & Karma",
    title: "Your Saturn Return: The Cosmic Audit That Changes Everything",
    excerpt: "Occurring around ages 29 and 58, the Saturn Return is astrology's most powerful rite of passage. Why this transit forces a complete life reckoning — and how to navigate it with grace.",
    date: "Feb 22, 2026",
    image: "/assets/birth-chart.png",
    large: true,
  },
  {
    id: "moon",
    tag: "Lunar Wisdom",
    title: "Manifesting With the Moon: A 28-Day Ritual Guide",
    excerpt: "The Moon's phases govern your emotional tides. Align your intentions, relationships, and actions with each lunar cycle.",
    date: "Feb 15, 2026",
    image: "/assets/horoscope-card.png",
    large: false,
  },
  {
    id: "vedic",
    tag: "Vedic Astrology",
    title: "Vedic vs Western Astrology: Which Is Right for You?",
    excerpt: "Two traditions, one cosmos. Understanding fundamental differences in approach, zodiac, and predictive technique.",
    date: "Feb 8, 2026",
    image: "/assets/zodiac-wheel.png",
    large: false,
  },
];

export default function JournalSection() {
  return (
    <section className="section journal mesh-bg" id="journal">
      <div className="container">
        <div className="journal__top">
          <div>
            <p className="label label--gold" style={{ marginBottom: 12 }}>
              ✦ Celestial Insights
            </p>
            <h2 className="heading-lg">
              Journals From<br />The Stars
            </h2>
          </div>
          <Link href="#" className="btn btn--outline">
            More Journals
          </Link>
        </div>

        <div className="journal__grid">
          {posts.map((p) => (
            <article key={p.id} className={`j-card${p.large ? " j-card--lg" : ""}`}>
              <div className="j-card__img">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="j-card__body">
                <span className="j-card__tag">{p.tag}</span>
                <h3 className="j-card__title">{p.title}</h3>
                <p className="j-card__excerpt">{p.excerpt}</p>
                <div className="j-card__foot">
                  <span className="j-card__date">{p.date}</span>
                  <span className="j-card__read">Read more →</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 48 }}>
          <Link href="#" className="btn--paren">
            More journals from us
          </Link>
        </div>
      </div>
    </section>
  );
}
