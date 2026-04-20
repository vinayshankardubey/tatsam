"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, Check, Zap } from "lucide-react";

const plans = [
  {
    name: "Darshan",
    description: "For curious seekers",
    price: { monthly: 0, annual: 0 },
    features: [
      "5 questions a month",
      "Daily panchang & moon phase",
      "Your sun sign, life path, numbers",
      "Cosmic calendar",
      "Citations on every answer",
    ],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Signature",
    description: "Unlimited access to the scriptures",
    price: { monthly: 499, annual: 499 },
    features: [
      "Unlimited questions",
      "Saved sessions & thread history",
      "Sanskrit + English citations",
      "Detailed kundli & numerology tools",
      "Guna Milan compatibility",
      "Personal muhurat finder",
      "Export your answers as PDF",
    ],
    cta: "Go Signature",
    highlight: true,
  },
  {
    name: "Legacy",
    description: "For lifelong seekers & families",
    price: { monthly: null, annual: null },
    features: [
      "Everything in Signature",
      "Extended context across family charts",
      "Private corpus: add your own teacher's notes",
      "Annual review with citations index",
      "Priority answer latency",
      "Bound keepsake of your top questions",
    ],
    cta: "Request Legacy",
    highlight: false,
  },
];

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);
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
    <section id="pricing" ref={sectionRef} className="relative py-32 lg:py-40">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header - Dramatic offset */}
        <div className="grid lg:grid-cols-12 gap-8 mb-20">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center text-sm font-mono text-muted-foreground mb-8">
              Pricing
            </span>
            <h2 className={`text-6xl md:text-7xl lg:text-[128px] font-display tracking-tight leading-[0.9] transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}>
              Ask as much
              <br />
              <span className="text-stroke">as you need.</span>
            </h2>
          </div>
          
          <div className="lg:col-span-5 relative p-0 h-96 lg:h-auto">
            {/* Whale image */}
            <div className={`absolute inset-0 pointer-events-none transition-all duration-1000 delay-100 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}>
              <img
                src="/images/whale.png"
                alt="Organic whale"
                className="w-full h-full object-contain object-center"
              />
            </div>

          </div>
        </div>

       
        {/* Bottom note with icons */}
        <div className={`mt-20 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 pt-12 border-t border-foreground/10 transition-all duration-1000 delay-500 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}>
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#C9A35A]" />
              Scripture-grounded, cited answers
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#C9A35A]" />
              Your data is never used for training
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#C9A35A]" />
              Cancel anytime, download your history
            </span>
          </div>
          <a href="#" className="text-sm underline underline-offset-4 hover:text-foreground transition-colors">
            Compare every plan
          </a>
        </div>
      </div>

      <style jsx>{`
        .text-stroke {
          -webkit-text-stroke: 1.5px currentColor;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </section>
  );
}
