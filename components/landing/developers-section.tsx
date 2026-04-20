"use client";

import { useState, useEffect, useRef } from "react";

const features = [
  {
    title: "Cited, always",
    description: "Every answer names the text, chapter, and verse it drew from — so you can read it yourself.",
  },
  {
    title: "Cross-scriptural",
    description: "Gita, Upanishads, Yoga Sutras, jyotish samhitas — read together, not in isolation.",
  },
  {
    title: "Plain English",
    description: "Sanskrit kept as reference, never as a wall. You get the thought in your own language.",
  },
  {
    title: "No fear-selling",
    description: "We won't weaponise dread to sell remedies. Clarity, not alarm.",
  },
];

export function DevelopersSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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
    <section id="developers" ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">

      {/* Image — absolute, bottom-right, behind all content */}
      <div
        className={`absolute bottom-0 right-0 w-[55%] h-[85%] pointer-events-none transition-all duration-1000 delay-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Upscaled%20Image%20%2813%29-OQ2DiR3ElVsUg8kTvTL1kC5A3Q6maM.png"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-left-top"
        />
        {/* Fade left edge */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        {/* Fade top edge */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-transparent" />
      </div>

      {/* All text content sits on top */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header — Full width */}
        <div
          className={`mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="inline-flex items-center text-sm font-mono text-muted-foreground mb-6">
            How we answer
          </span>
          <h2 className="text-4xl md:text-6xl lg:text-[128px] font-display tracking-tight leading-[1.02] lg:leading-[0.9]">
            Real scripture.
            <br />
            <span className="text-muted-foreground">Living guidance.</span>
          </h2>
        </div>

        {/* Description + Features — full width on mobile, half on desktop so it
            doesn't collide with the background image */}
        <div
          className={`lg:max-w-[50%] transition-all duration-700 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-lg lg:text-xl text-muted-foreground mb-10 lg:mb-12 leading-relaxed lg:max-w-md">
            Your question is matched to passages across hundreds of classical texts — the Bhagavad Gita, the Upanishads, the jyotish samhitas — and answered in plain English, with every citation intact.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`transition-all duration-500 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${index * 50 + 200}ms` }}
              >
                <h3 className="font-medium mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
