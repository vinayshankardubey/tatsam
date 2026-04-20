"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
  {
    number: "01",
    title: "Ask",
    subtitle: "in your own words",
    description: "Type a question the way you'd ask a wise friend. Life, love, timing, your chart, your numbers — nothing is too small.",
    code: `/* You */
question: "Should I take the role in Pune, or wait?",
context:  "dob 1994-08-17 · life path 3"`,
  },
  {
    number: "02",
    title: "Consult",
    subtitle: "the ancient texts",
    description: "Tatsam reads your question against the classical corpus — Gita, Upanishads, Brihat Parashara, Yoga Sutras, and more — and draws the passages that speak to it.",
    code: `/* Sources consulted */
gita.2.47      ✓ nishkama karma
brihat.6.12    ✓ career & Saturn
upanishad.IU   ✓ right renunciation`,
  },
  {
    number: "03",
    title: "Receive",
    subtitle: "a grounded answer",
    description: "An answer in plain English, with citations to the verse or chapter it comes from. Kept gentle, never alarming, always practical.",
    code: `/* Answer */
summary:    "Take it — but on one condition..."
source:     Bhagavad Gita, 2.47
practice:   "journal for 9 days before Mar 3"`,
  },
];

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
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

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-brown text-ivory overflow-hidden"
    >
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-gold/[0.06] blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header — titre + image cerisier */}
        <div className="relative mb-0 lg:mb-0 grid lg:grid-cols-2 gap-4 lg:gap-12 items-end">
          {/* Titre colonne gauche */}
          <div className="overflow-hidden pb-0 lg:pb-32">
            <div className={`transition-all duration-1000 ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"}`}>
              <span className="inline-flex items-center text-sm font-mono text-ivory/50 mb-8">
                Process
              </span>
            </div>

            <h2 className={`text-6xl md:text-7xl lg:text-[128px] font-display tracking-tight leading-[0.85] transition-all duration-1000 delay-100 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
            }`}>
              <span className="block text-ivory">Ask.</span>
              <span className="block text-ivory/35">Consult.</span>
              <span className="block text-ivory/15">Receive.</span>
            </h2>
          </div>

          {/* Image cerisier — se colle en bas sur les blocs */}
          <div className={`relative h-[320px] lg:h-[640px] overflow-hidden transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}>
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tree-uAia6REvB137CQyHFCf0za3O6h2zKO.png"
              alt=""
              aria-hidden="true"
              className="absolute bottom-0 left-0 w-full h-full object-contain object-bottom opacity-80"
            />
            {/* Fade sur le bord gauche */}
            <div className="absolute inset-0 bg-gradient-to-r from-brown via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Horizontal Steps Layout */}
        <div className="grid lg:grid-cols-3 gap-4">
          {steps.map((step, index) => (
            <button
              key={step.number}
              type="button"
              onClick={() => setActiveStep(index)}
              className={`relative text-left p-8 lg:p-12 border transition-all duration-500 ${
                activeStep === index
                  ? "bg-ivory/5 border-gold/60"
                  : "bg-ivory/[0.03] border-ivory/20 hover:border-gold/40"
              }`}
            >
              {/* Step number with animated line */}
              <div className="flex items-center gap-4 mb-8">
                <span className={`text-4xl font-display transition-colors duration-300 ${
                  activeStep === index ? "text-gold" : "text-ivory/25"
                }`}>
                  {step.number}
                </span>
                <div className="flex-1 h-px bg-ivory/15 overflow-hidden">
                  {activeStep === index && (
                    <div className="h-full bg-gold/60 animate-progress" />
                  )}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-3xl lg:text-4xl font-display mb-2 text-ivory">
                {step.title}
              </h3>
              <span className="text-xl text-ivory/50 font-display block mb-6">
                {step.subtitle}
              </span>

              {/* Description */}
              <p className={`text-ivory/65 leading-relaxed transition-opacity duration-300 ${
                activeStep === index ? "opacity-100" : "opacity-70"
              }`}>
                {step.description}
              </p>

              {/* Active indicator */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gold transition-transform duration-500 origin-left ${
                activeStep === index ? "scale-x-100" : "scale-x-0"
              }`} />
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-progress {
          animation: progress 6s linear forwards;
        }
      `}</style>
    </section>
  );
}
