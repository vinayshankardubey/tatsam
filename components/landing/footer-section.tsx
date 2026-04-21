"use client";

import { Instagram, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

type FooterLink = { name: string; href: string };

const footerLinks: Record<string, FooterLink[]> = {
  Tatsam: [
    { name: "How we answer",   href: "/how-we-answer" },
    { name: "Sources we read", href: "/sources" },
    { name: "Daily panchang",  href: "/panchang" },
    { name: "Explore tools",   href: "/tatsam" },
  ],
  Trust: [
    { name: "Privacy",            href: "/privacy" },
    { name: "No-training pledge", href: "/pledge" },
    { name: "Terms of service",   href: "/terms" },
  ],
};

const socials: Array<{
  name: string;
  href: string;
  Icon: React.ComponentType<{ className?: string }>;
}> = [
  { name: "Instagram", href: "https://instagram.com/tatsam.co", Icon: Instagram },
  { name: "YouTube",   href: "https://youtube.com/@tatsam",     Icon: Youtube },
  { name: "WhatsApp",  href: "https://wa.me/919810000000",      Icon: WhatsAppGlyph },
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
          <div className="grid grid-cols-2 md:grid-cols-5 gap-12 lg:gap-10">
            {/* Brand Column */}
            <div className="col-span-2">
              <Link href="/" className="inline-flex items-center gap-2 mb-6">
                <span className="text-2xl font-display text-ivory">Tatsam</span>
                <span className="text-xs text-ivory/40 font-mono">तत्सम्</span>
              </Link>

              <p className="text-ivory/60 leading-relaxed mb-6 max-w-xs text-sm">
                Ask your questions and receive grounded answers from the
                classical corpus — the Gita, the Upanishads, the jyotish
                samhitas. Scripture, read with care.
              </p>

              {/* App badges — brand-style images, both route to /apps. */}
              <p className="text-[10px] font-mono text-ivory/35 uppercase tracking-[0.2em] mb-3">
                Get the app · coming soon
              </p>
              <div className="flex flex-wrap gap-2.5">
                <Link
                  href="/apps"
                  aria-label="Tatsam for iPhone — coming soon"
                  className="inline-block hover:opacity-90 transition-opacity"
                >
                  <Image
                    src="/badges/app-store.svg"
                    alt="Download on the App Store"
                    width={164}
                    height={54}
                    className="h-12 w-auto"
                    priority={false}
                  />
                </Link>
                <Link
                  href="/apps"
                  aria-label="Tatsam for Android — coming soon"
                  className="inline-block hover:opacity-90 transition-opacity"
                >
                  <Image
                    src="/badges/google-play.svg"
                    alt="Get it on Google Play"
                    width={180}
                    height={54}
                    className="h-12 w-auto"
                    priority={false}
                  />
                </Link>
              </div>
            </div>

            {/* Link Columns — text lists */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="text-sm font-medium text-ivory mb-6">{title}</h3>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-ivory/50 hover:text-ivory transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Reach column — contact link + horizontal social icon row */}
            <div>
              <h3 className="text-sm font-medium text-ivory mb-6">Reach</h3>
              <ul className="space-y-4 mb-5">
                <li>
                  <Link
                    href="/contact"
                    className="text-sm text-ivory/50 hover:text-ivory transition-colors"
                  >
                    Contact us
                  </Link>
                </li>
              </ul>
              <div className="flex items-center gap-2.5">
                {socials.map(({ name, href, Icon }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    title={name}
                    className="w-10 h-10 rounded-full border border-ivory/20 bg-ivory/5 text-ivory/70 hover:text-ivory hover:bg-ivory/10 hover:border-ivory/35 transition-colors flex items-center justify-center"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
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

/**
 * WhatsApp glyph — lucide-react doesn't ship one, so we inline a small
 * silhouette (phone with the speech curl) that sits next to the Instagram
 * and YouTube lucide marks in the social row.
 */
function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.95L2 22l5.25-1.38a9.86 9.86 0 0 0 4.78 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.83 9.83 0 0 0 12.04 2zm0 18.15h-.01a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.41a8.2 8.2 0 0 1 2.41 5.84c0 4.55-3.7 8.23-8.24 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.4-.12-.56.13-.16.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23a7.5 7.5 0 0 1-1.38-1.72c-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.76-1.85-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07s.89 2.4 1.02 2.56c.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.08.15-1.18-.06-.1-.22-.17-.47-.29z" />
    </svg>
  );
}
