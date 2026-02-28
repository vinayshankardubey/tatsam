import Link from "next/link";

/* Pixel Eye Icon — morni's signature cross-stitch motif */
function PixelEye() {
  const grid = [
    [0,0,0,1,1,1,1,1,0,0,0],
    [0,0,1,0,0,0,0,0,1,0,0],
    [0,1,0,0,1,0,1,0,0,1,0],
    [1,0,0,0,0,1,0,0,0,0,1],
    [1,0,1,0,1,1,1,0,1,0,1],
    [1,0,0,0,0,1,0,0,0,0,1],
    [0,1,0,0,1,0,1,0,0,1,0],
    [0,0,1,0,0,0,0,0,1,0,0],
    [0,0,0,1,1,1,1,1,0,0,0],
  ];
  return (
    <div className="pixel-icon" aria-hidden="true">
      {grid.map((row, r) => (
        <div key={r} className="pixel-icon__row">
          {row.map((cell, c) => (
            <div key={c} className={`pixel-icon__cell${cell === 0 ? " pixel-icon__cell--off" : ""}`} />
          ))}
        </div>
      ))}
    </div>
  );
}

const STARS = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  w: Math.random() * 2 + 0.8,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  d: `${Math.random() * 4 + 2}s`,
  dl: `${Math.random() * 5}s`,
  op: Math.random() * 0.5 + 0.2,
}));

export default function HeroSection() {
  return (
    <section className="hero mesh-bg" id="home">
      {/* Aurora blobs */}
      <div className="hero__blobs" aria-hidden="true">
        <div className="hero__blob" />
        <div className="hero__blob" />
        <div className="hero__blob" />
      </div>

      {/* Side constellation watermarks — morni's botanical silhouette effect */}
      <div className="watermark-side watermark-side--left"  aria-hidden="true" />
      <div className="watermark-side watermark-side--right" aria-hidden="true" />

      {/* Star field */}
      <div className="hero__stars-layer" aria-hidden="true">
        {STARS.map((s) => (
          <span
            key={s.id}
            className="h-star"
            style={{
              width: s.w,
              height: s.w,
              top: s.top,
              left: s.left,
              opacity: s.op,
              ["--d" as string]: s.d,
              ["--dl" as string]: s.dl,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="hero__content">
        <div className="hero__icon">
          <PixelEye />
        </div>

        <p className="hero__label label label--gold">
          Ancient Wisdom · Modern Clarity
        </p>

        <h1 className="hero__headline">
          <em>Know Your Stars</em>
          Know Yourself
        </h1>

        <p className="hero__body">
          Forget generic horoscopes. Your cosmic story is unique.
          Tatsam connects you with master Vedic astrologers — where
          timeless planetary wisdom meets your life&apos;s journey.
        </p>

        <div className="hero__ctas">
          <Link href="#readings" className="btn btn--primary">
            Begin Your Reading
          </Link>
          <Link href="#zodiac" className="btn--paren">
            What is a birth chart?
          </Link>
        </div>
      </div>

      <div className="hero__scroll" aria-hidden="true">
        <div className="hero__scroll-line" />
        <span>Scroll</span>
      </div>
    </section>
  );
}
