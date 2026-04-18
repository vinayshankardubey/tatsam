"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, Check, Zap } from "lucide-react";

const plans = [
  {
    name: "Darshan",
    description: "A first glimpse into your chart",
    price: { monthly: 499, annual: 499 },
    features: [
      "Janma Kundli snapshot",
      "Life Path & Destiny number",
      "Current dasha at a glance",
      "8-page PDF report",
      "Email delivery in 48hr",
    ],
    cta: "Begin reading",
    highlight: false,
  },
  {
    name: "Signature",
    description: "The full Tatsam reading",
    price: { monthly: 2499, annual: 2499 },
    features: [
      "Detailed Janma Kundli & Navamsa",
      "Full numerology: 9 core numbers",
      "Year-ahead dasha forecast",
      "Career, relationships, finance",
      "Personalised remedies & muhurats",
      "40-page bound PDF",
      "20-min voice note from your acharya",
    ],
    cta: "Book Signature",
    highlight: true,
  },
  {
    name: "Legacy",
    description: "For lifelong seekers & families",
    price: { monthly: null, annual: null },
    features: [
      "Everything in Signature",
      "60-min live call with your acharya",
      "Compatibility report for partner",
      "Child-name & muhurat consulting",
      "Annual renewal & check-in",
      "Priority acharya access",
      "Heirloom printed keepsake",
      "Private WhatsApp line",
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
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-8">
              <span className="w-12 h-px bg-foreground/30" />
              Pricing
            </span>
            <h2 className={`text-6xl md:text-7xl lg:text-[128px] font-display tracking-tight leading-[0.9] transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}>
              Choose your
              <br />
              <span className="text-stroke">reading.</span>
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
              Human-read, never AI-generated
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#C9A35A]" />
              Unlimited follow-up questions
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#C9A35A]" />
              Refund if you&rsquo;re not served well
            </span>
          </div>
          <a href="#" className="text-sm underline underline-offset-4 hover:text-foreground transition-colors">
            Compare all readings
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
