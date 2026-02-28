const stats = [
  { n: "50K+",  l: "Charts Generated" },
  { n: "200+",  l: "Expert Astrologers" },
  { n: "4.9★",  l: "Average Rating" },
  { n: "12",    l: "Zodiac Signs Covered" },
];

export default function StatsSection() {
  return (
    <section className="stats-strip">
      <div className="container">
        <div className="stats-strip__grid">
          {stats.map((s) => (
            <div key={s.l} className="stat-item">
              <p className="stat-item__n">{s.n}</p>
              <p className="stat-item__l">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
