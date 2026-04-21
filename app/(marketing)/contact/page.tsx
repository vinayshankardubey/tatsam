import Link from "next/link";
import { Mail, Instagram, Youtube, MessageCircle, Clock } from "lucide-react";

export const metadata = {
  title: "Contact Tatsam",
  description:
    "Questions, corrections to our readings, partnership requests, or feedback on a specific answer — here's how to reach us.",
};

const CHANNELS = [
  {
    icon: Mail,
    name: "Email",
    detail: "hello@tatsam.co",
    href: "mailto:hello@tatsam.co",
    body: "Best for detailed feedback, corrections, and anything not urgent.",
  },
  {
    icon: MessageCircle,
    name: "WhatsApp",
    detail: "+91 98100 00000",
    href: "https://wa.me/919810000000",
    body: "Quick questions about an answer you received. 10–7 IST, Mon–Fri.",
  },
  {
    icon: Instagram,
    name: "Instagram",
    detail: "@tatsam.co",
    href: "https://instagram.com/tatsam.co",
    body: "Daily verses, panchang, and seeker questions answered in public.",
  },
  {
    icon: Youtube,
    name: "YouTube",
    detail: "youtube.com/@tatsam",
    href: "https://youtube.com/@tatsam",
    body: "Longer explorations — one sloka, read carefully, once a week.",
  },
];

export default function ContactPage() {
  return (
    <div className="max-w-[900px] mx-auto px-5 lg:px-8 py-12 lg:py-20">
      {/* Hero */}
      <section className="mb-14">
        <p className="text-xs font-mono text-brown/55 uppercase tracking-[0.2em] mb-3">
          Reach us
        </p>
        <h1 className="text-4xl md:text-6xl font-display text-brown leading-[1.05]">
          Write to us — we read
          <br />
          <span className="text-brown/55">every message.</span>
        </h1>
        <p className="mt-5 text-brown/70 text-lg leading-relaxed max-w-2xl">
          For questions about an answer, a missing source, a translation you
          dispute, partnerships, press, or anything else — pick the channel
          that fits.
        </p>
      </section>

      {/* Channels */}
      <section className="grid md:grid-cols-2 gap-4 mb-14">
        {CHANNELS.map((c) => (
          <a
            key={c.name}
            href={c.href}
            target={c.href.startsWith("http") ? "_blank" : undefined}
            rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="group rounded-2xl bg-white border border-gold/30 p-6 hover:border-maroon/40 transition-colors"
          >
            <div className="flex items-start gap-4">
              <span className="shrink-0 w-11 h-11 rounded-full bg-gradient-to-br from-gold/30 to-amber/20 flex items-center justify-center">
                <c.icon className="w-5 h-5 text-maroon" />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-mono text-brown/50 uppercase tracking-wider">
                  {c.name}
                </p>
                <p className="font-display text-lg text-brown leading-tight mt-0.5">
                  {c.detail}
                </p>
                <p className="text-sm text-brown/60 mt-2 leading-relaxed">
                  {c.body}
                </p>
              </div>
            </div>
          </a>
        ))}
      </section>

      {/* Response time */}
      <section className="rounded-2xl bg-amber/15 border border-gold/30 p-6 md:p-8 flex items-start gap-4">
        <span className="shrink-0 w-10 h-10 rounded-full bg-white border border-gold/40 flex items-center justify-center">
          <Clock className="w-4 h-4 text-gold" />
        </span>
        <div className="min-w-0">
          <p className="font-display text-lg text-brown">Turnaround</p>
          <p className="text-sm text-brown/70 mt-1 leading-relaxed">
            Email within two working days. WhatsApp the same day, IST working
            hours. Corrections to specific answers — we prioritise these, and
            we publish the correction with the verse it pulled.
          </p>
        </div>
      </section>

      {/* Soft CTA back to product */}
      <section className="mt-12 text-center">
        <p className="text-sm text-brown/60">
          Or start where most seekers do —
        </p>
        <Link
          href="/dashboard/ask"
          className="inline-flex items-center mt-3 h-11 px-6 rounded-full bg-maroon text-ivory hover:bg-maroon/90"
        >
          Ask Tatsam a question
        </Link>
      </section>
    </div>
  );
}
