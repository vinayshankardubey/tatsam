/* Morni's dark navy ticker with marquee text */
const ITEMS = [
  "A star in every soul, where the cosmos finds its voice",
  "✦",
  "A star in every soul, where the cosmos finds its voice",
  "✦",
  "A star in every soul, where the cosmos finds its voice",
  "✦",
  "A star in every soul, where the cosmos finds its voice",
  "✦",
];

export default function TickerSection() {
  const doubled = [...ITEMS, ...ITEMS];
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker__track">
        {doubled.map((item, i) => (
          <span key={i} className="ticker__item">
            {item === "✦" ? (
              <span className="ticker__sep">{item}</span>
            ) : item}
          </span>
        ))}
      </div>
    </div>
  );
}
