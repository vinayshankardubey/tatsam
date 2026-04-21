"use client";

import { useEffect, useRef, useState } from "react";

const features = [
  {
    number: "01",
    title: "Life & Number",
    description: "Ask the questions you'd ask a wise elder — about purpose, work, right action. Answers drawn from the Bhagavad Gita, the Upanishads and the Yoga Sutras.",
    stats: { value: "700+", label: "verses of the Gita consulted" },
  },
  {
    number: "02",
    title: "Your chart & your numbers",
    description: "Ask about your janma kundli, dashas, nakshatras, life path and destiny numbers — grounded in Brihat Parashara Hora, Jaimini Sutras and classical numerology.",
    stats: { value: "12", label: "jyotish & numerology traditions" },
  },
  {
    number: "03",
    title: "Relationships & compatibility",
    description: "Guna Milan, Nakshatra matching, numerology pairing — examined through the Vivaha sections of Brihat Samhita and Muhurta Chintamani.",
    stats: { value: "36", label: "koota points in Guna Milan" },
  },
  {
    number: "04",
    title: "Timing & daily practice",
    description: "Ask about muhurat, panchang, remedies, mantras — answers rooted in classical almanacs and the ritual texts, kept gentle and practical.",
    stats: { value: "0", label: "fear-based advice, ever" },
  },
];

export function FeaturesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header - Full width with diagonal layout */}
        <div className="relative mb-24 lg:mb-32">
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
              <p className={`text-xl text-muted-foreground leading-relaxed transition-all duration-1000 delay-200 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}>
                Write a question in your own words. Tatsam consults the classical sources — the Gita, the Upanishads, the astrological samhitas — and returns a grounded, cited answer.
              </p>
            </div>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Large feature card */}
          <div
            className={`lg:col-span-12 relative bg-brown text-ivory border border-ivory/10 min-h-[500px] overflow-hidden group transition-all duration-700 flex ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
            onMouseEnter={() => setActiveFeature(0)}
          >
            {/* Left: text content */}
            <div className="relative flex-1 p-8 lg:p-12 bg-brown">
              <div className="relative z-10">
                <span className="font-mono text-sm text-gold">{features[0].number}</span>
                <h3 className="text-3xl lg:text-4xl font-display mt-4 mb-6 text-ivory group-hover:translate-x-2 transition-transform duration-500">
                  {features[0].title}
                </h3>
                <p className="text-lg text-ivory/70 leading-relaxed max-w-md mb-8">
                  {features[0].description}
                </p>
                <div>
                  <span className="text-5xl lg:text-6xl font-display text-ivory">{features[0].stats.value}</span>
                  <span className="block text-sm text-ivory/55 font-mono mt-2">{features[0].stats.label}</span>
                </div>
              </div>
            </div>

            {/* Right: mirrored image, full height */}
            <div className="hidden lg:block relative w-[42%] shrink-0 overflow-hidden">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Upscaled%20Image%20%2812%29-ng3RrNnsPMJ5CrtOjcPTmhHg01W11q.png"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover object-center opacity-85"
                style={{ transform: "scaleX(-1)" }}
              />
              {/* Fade left edge into the brown card */}
              <div className="absolute inset-0 bg-gradient-to-r from-brown via-brown/40 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
