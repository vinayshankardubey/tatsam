"use client";

import { useEffect, useRef, useState } from "react";

// The nine core readings every serious numerologist computes from name + DOB.
// We surface them as a sample tile-row — the reading is mock but the framework
// (Pythagorean + Chaldean) is the real classical one.
const CORE_NUMBERS: Array<{
  short: string;
  label: string;
  value: number;
  master?: boolean;
}> = [
  { short: "LP",  label: "Life Path",     value: 7 },
  { short: "Exp", label: "Expression",    value: 3 },
  { short: "SU",  label: "Soul Urge",     value: 9 },
  { short: "Per", label: "Personality",   value: 5 },
  { short: "BD",  label: "Birth Day",     value: 14 },
  { short: "PY",  label: "Personal Year", value: 22, master: true },
];

export function FeaturesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative py-14 lg:py-20 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="relative mb-12 lg:mb-20">
          <div className="grid lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center text-sm font-mono text-muted-foreground mb-6">
                What you can ask
              </span>
              <h2
                className={`text-6xl md:text-7xl lg:text-[128px] font-display tracking-tight leading-[0.9] transition-all duration-1000 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                Ancient scripture,
                <br />
                <span className="text-muted-foreground">answering you.</span>
              </h2>
            </div>
            <div className="lg:col-span-5 lg:pb-4">
              <p
                className={`text-xl text-muted-foreground leading-relaxed transition-all duration-1000 delay-200 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                Write a question in your own words. Tatsam consults the
                classical sources — the Gita, the Upanishads, the jyotish and
                ank-shastra samhitas — and returns a grounded, cited answer.
              </p>
            </div>
          </div>
        </div>

        {/* Numerology feature card */}
        <div
          className={`relative bg-brown text-ivory border border-ivory/10 min-h-[540px] overflow-hidden group transition-all duration-700 flex ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          {/* Left: copy + sample reading */}
          <div className="relative flex-1 p-8 lg:p-14">
            <div className="relative z-10 max-w-2xl">
              {/* Eyebrow with classical badge */}
              <div className="flex items-center gap-3 mb-7">
                <span className="font-display text-gold text-base">
                  अङ्कशास्त्र
                </span>
                <span className="h-px w-8 bg-gold/40" />
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ivory/60">
                  Numerology · Pythagorean &amp; Chaldean
                </span>
              </div>

              {/* Title */}
              <h3 className="text-4xl lg:text-5xl font-display text-ivory leading-[1.05] group-hover:translate-x-1 transition-transform duration-500">
                Life &amp; Number
              </h3>

              {/* Lede */}
              <p className="text-lg text-ivory/75 leading-relaxed mt-5 max-w-xl">
                Every name and every date carries a vibration. Tatsam reads
                the nine core numbers — Life Path, Expression, Soul Urge,
                Personality, Birth Day, Personal Year and the master
                vibrations — through both the Pythagorean and Chaldean
                traditions, with the verse and rule it drew on.
              </p>

              {/* Sample reading row */}
              <div className="mt-9">
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ivory/45">
                    A sample reading
                  </span>
                  <span className="h-px flex-1 bg-ivory/10" />
                  <span className="font-mono text-[10px] text-ivory/45">
                    Vinay D. · 14 Mar 1990
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                  {CORE_NUMBERS.map((n) => (
                    <NumberChip key={n.short} {...n} />
                  ))}
                </div>

                {/* Highlighted callout — the master vibration */}
                <div className="mt-7 rounded-xl border border-gold/25 bg-gold/[0.06] p-5">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold">
                      Personal Year
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-ivory/45">
                      Master Number · 22
                    </span>
                  </div>
                  <p className="font-display text-lg text-ivory mt-1.5 leading-snug">
                    The Master Builder &mdash; year of laying foundations that
                    outlast you.
                  </p>
                  <p className="text-sm text-ivory/55 mt-1.5">
                    Cited from Faith Javane &amp; Dusty Bunker · cross-checked
                    against the Chaldean reduction.
                  </p>
                </div>
              </div>

              {/* Stat strip */}
              <div className="mt-9 pt-7 border-t border-ivory/10 flex items-baseline gap-8 flex-wrap">
                <div>
                  <span className="block text-3xl lg:text-4xl font-display text-ivory">
                    9
                  </span>
                  <span className="block text-[11px] font-mono text-ivory/55 mt-1 tracking-wider">
                    core numbers
                  </span>
                </div>
                <div>
                  <span className="block text-3xl lg:text-4xl font-display text-ivory">
                    2
                  </span>
                  <span className="block text-[11px] font-mono text-ivory/55 mt-1 tracking-wider">
                    classical traditions
                  </span>
                </div>
                <div>
                  <span className="block text-3xl lg:text-4xl font-display text-ivory">
                    ✓
                  </span>
                  <span className="block text-[11px] font-mono text-ivory/55 mt-1 tracking-wider">
                    every rule cited
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: mirrored decorative image, full height */}
          <div className="hidden lg:block relative w-[36%] shrink-0 overflow-hidden">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Upscaled%20Image%20%2812%29-ng3RrNnsPMJ5CrtOjcPTmhHg01W11q.png"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover object-center opacity-80"
              style={{ transform: "scaleX(-1)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brown via-brown/55 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────

function NumberChip({
  short,
  label,
  value,
  master,
}: {
  short: string;
  label: string;
  value: number;
  master?: boolean;
}) {
  return (
    <div
      className={`relative rounded-lg p-3 text-center border transition-colors ${
        master
          ? "border-gold/40 bg-gold/[0.08]"
          : "border-ivory/10 bg-ivory/[0.03] hover:border-ivory/25"
      }`}
    >
      {master ? (
        <span className="absolute top-1.5 right-1.5 text-[7px] font-mono uppercase tracking-wider text-gold/85">
          M
        </span>
      ) : null}
      <span
        className={`block font-display leading-none ${
          master ? "text-3xl text-gold" : "text-3xl text-ivory"
        }`}
      >
        {value}
      </span>
      <span className="block font-mono text-[9px] uppercase tracking-wider text-ivory/50 mt-2">
        {short}
      </span>
      <span className="block text-[10px] text-ivory/40 mt-0.5 truncate">
        {label}
      </span>
    </div>
  );
}
