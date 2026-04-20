"use client";

import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";

const footerLinks = {
  "What you can ask": [
    { name: "Life & dharma",             href: "#features" },
    { name: "Chart & numbers",           href: "#features" },
    { name: "Relationships",             href: "#features" },
    { name: "Timing & practice",         href: "#features" },
  ],
  Journal: [
    { name: "Wisdom library",  href: "#" },
    { name: "Daily panchang",  href: "#" },
    { name: "Seeker stories",  href: "#" },
    { name: "Source index",    href: "#integrations" },
  ],
  Tatsam: [
    { name: "How we answer",   href: "#developers" },
    { name: "Sources we read", href: "#integrations" },
    { name: "Gift a seat",     href: "#", badge: "New" },
    { name: "Contact us",      href: "#" },
  ],
  Trust: [
    { name: "Privacy",          href: "#security" },
    { name: "No-training pledge", href: "#security" },
    { name: "Terms of service", href: "#" },
  ],
};

const socialLinks = [
  { name: "Instagram", href: "#" },
  { name: "YouTube",   href: "#" },
  { name: "WhatsApp",  href: "#" },
];

function AnimatedWaveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      ctx.clearRect(0, 0, width, height);

      ctx.strokeStyle = "rgba(100, 200, 150, 0.3)";
      ctx.lineWidth = 1;

      for (let wave = 0; wave < 3; wave++) {
        ctx.beginPath();
        for (let x = 0; x <= width; x += 5) {
          const y =
            height * 0.5 +
            Math.sin(x * 0.01 + time + wave * 0.5) * 30 +
            Math.sin(x * 0.02 + time * 1.5 + wave) * 20;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      time += 0.02;
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}

export function FooterSection() {
  return (
    <footer className="relative bg-brown text-ivory pb-20 lg:pb-0">
      {/* Panoramic banner image */}
      <div className="relative w-full h-[340px] md:h-[420px] overflow-hidden">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Upscaled%20Image%20%2810%29-UnDKstODkIENp5xqTYUEpt0Sm8tNOw.png"
          alt="Bioluminescent landscape"
          className="w-full h-full object-cover object-center"
        />
        {/* Gradient fade to brown at bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-brown" />
        {/* Subtle brown vignette on sides */}
        <div className="absolute inset-0 bg-gradient-to-r from-brown/40 via-transparent to-brown/40" />
      </div>

      {/* Footer content — brown background, ivory text */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Main Footer */}
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-12 lg:gap-8">
            {/* Brand Column */}
            <div className="col-span-2">
              <a href="#" className="inline-flex items-center gap-2 mb-6">
                <span className="text-2xl font-display text-ivory">Tatsam</span>
                <span className="text-xs text-ivory/40 font-mono">तत्सम्</span>
              </a>

              <p className="text-ivory/60 leading-relaxed mb-8 max-w-xs text-sm">
                Ask your questions and receive grounded answers from the classical corpus — the Gita, the Upanishads, the jyotish samhitas. Scripture, read with care.
              </p>

              {/* Social Links */}
              <div className="flex gap-6">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-sm text-ivory/50 hover:text-ivory transition-colors flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                ))}
              </div>
            </div>

            {/* Link Columns */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="text-sm font-medium text-ivory mb-6">{title}</h3>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-sm text-ivory/50 hover:text-ivory transition-colors inline-flex items-center gap-2"
                      >
                        {link.name}
                        {"badge" in link && link.badge && (
                          <span className="text-xs px-2 py-0.5 bg-gold text-brown rounded-full">
                            {link.badge}
                          </span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-ivory/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-ivory/40">
            &copy; 2026 Tatsam. Crafted with reverence in India.
          </p>

          <div className="flex items-center gap-4 text-sm text-ivory/40">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold" />
              Answering questions now
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
