"use client";

import Image from "next/image";
import { useState } from "react";

const signs = [
  { symbol: "♈", name: "Aries",       dates: "Mar 21–Apr 19", element: "Fire",  ruling: "Mars",          trait: "Bold, pioneering, and fearlessly direct. Aries leads with raw courage and childlike enthusiasm." },
  { symbol: "♉", name: "Taurus",      dates: "Apr 20–May 20", element: "Earth", ruling: "Venus",         trait: "Sensual, grounded, and fiercely loyal. Taurus builds slowly and loves deeply." },
  { symbol: "♊", name: "Gemini",      dates: "May 21–Jun 20", element: "Air",   ruling: "Mercury",       trait: "Curious, quick-witted, and endlessly adaptable. Gemini sees every side of the story." },
  { symbol: "♋", name: "Cancer",      dates: "Jun 21–Jul 22", element: "Water", ruling: "Moon",          trait: "Deeply intuitive, nurturing, and fiercely protective. Cancer feels everything." },
  { symbol: "♌", name: "Leo",         dates: "Jul 23–Aug 22", element: "Fire",  ruling: "Sun",           trait: "Radiant, generous, and born to lead. Leo's presence lights up every room." },
  { symbol: "♍", name: "Virgo",       dates: "Aug 23–Sep 22", element: "Earth", ruling: "Mercury",       trait: "Analytical, devoted, and exceptionally precise. Virgo perfects everything it touches." },
  { symbol: "♎", name: "Libra",       dates: "Sep 23–Oct 22", element: "Air",   ruling: "Venus",         trait: "Harmonious, diplomatic, and justice-seeking. Libra weighs every choice carefully." },
  { symbol: "♏", name: "Scorpio",     dates: "Oct 23–Nov 21", element: "Water", ruling: "Mars / Pluto",  trait: "Magnetic, transformative, and intensely perceptive. Scorpio sees beyond all masks." },
  { symbol: "♐", name: "Sagittarius", dates: "Nov 22–Dec 21", element: "Fire",  ruling: "Jupiter",       trait: "Adventurous, philosophical, and eternally optimistic. Sagittarius chases the horizon." },
  { symbol: "♑", name: "Capricorn",   dates: "Dec 22–Jan 19", element: "Earth", ruling: "Saturn",        trait: "Disciplined, ambitious, and enduringly patient. Capricorn climbs any mountain." },
  { symbol: "♒", name: "Aquarius",    dates: "Jan 20–Feb 18", element: "Air",   ruling: "Saturn / Uranus", trait: "Original, humanitarian, and intellectually limitless. Aquarius is the future." },
  { symbol: "♓", name: "Pisces",      dates: "Feb 19–Mar 20", element: "Water", ruling: "Jupiter / Neptune", trait: "Ethereal, empathic, and boundlessly imaginative. Pisces dissolves all boundaries." },
];

export default function ZodiacSection() {
  const [active, setActive] = useState(0);
  const cur = signs[active];

  return (
    <section className="section zodiac mesh-bg" id="zodiac">
      <div className="container">
        <div className="zodiac__layout">
          {/* Left: signs + detail */}
          <div>
            <p className="label label--gold" style={{ marginBottom: 14 }}>
              ✦ Explore The Cosmos
            </p>
            <h2 className="heading-lg" style={{ marginBottom: 16 }}>
              Your Zodiac,<br />Decoded
            </h2>
            <p className="body-text" style={{ marginBottom: 0 }}>
              Each of the 12 signs carries ancient planetary intelligence.
              Select yours to unveil the cosmic forces shaping your nature.
            </p>

            {/* Sign buttons — dashed style */}
            <div className="zodiac__signs-grid">
              {signs.map((s, i) => (
                <button
                  key={s.name}
                  className={`zodiac-sign-btn${active === i ? " active" : ""}`}
                  onClick={() => setActive(i)}
                  aria-label={s.name}
                >
                  <span className="zodiac-sign-btn__sym">{s.symbol}</span>
                  <span className="zodiac-sign-btn__name">{s.name}</span>
                </button>
              ))}
            </div>

            {/* Detail card — dashed border */}
            <div className="zodiac__detail-card">
              <div className="zodiac__detail-header">
                <span className="zodiac__detail-sym">{cur.symbol}</span>
                <div>
                  <p className="zodiac__detail-name">{cur.name}</p>
                  <p className="zodiac__detail-dates">{cur.dates}</p>
                </div>
              </div>
              <p className="zodiac__detail-trait">{cur.trait}</p>
              <div className="zodiac__chips">
                <span className="zodiac__chip">{cur.element}</span>
                <span className="zodiac__chip">♦ {cur.ruling}</span>
              </div>
            </div>
          </div>

          {/* Right: rotating wheel with orbit rings */}
          <div className="zodiac__wheel-col">
            <div className="zodiac__wheel-wrap">
              <div className="zodiac__ring" />
              <div className="zodiac__ring" />
              <Image
                src="/assets/zodiac-wheel.png"
                alt="Zodiac wheel"
                fill
                style={{ objectFit: "contain" }}
                className="zodiac__wheel-img"
                sizes="(max-width: 768px) 80vw, 40vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
