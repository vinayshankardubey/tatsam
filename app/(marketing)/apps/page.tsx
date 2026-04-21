import Link from "next/link";
import Image from "next/image";
import { Bell, ArrowRight, Clock, Check } from "lucide-react";

export const metadata = {
  title: "Tatsam apps — coming soon",
  description:
    "Native Tatsam apps for iPhone and Android are on the way. Sign up to be notified the moment they launch.",
};

const BENEFITS = [
  "Ask on the go — every answer still cited to a classical source.",
  "Your kundli, panchang, and reading history offline in your pocket.",
  "Push notifications for important sky events — only what matters.",
  "Fingerprint / Face ID sign-in. No passwords, ever.",
];

export default function AppsPage() {
  return (
    <div className="max-w-[900px] mx-auto px-5 lg:px-8 py-12 lg:py-20">
      {/* Hero */}
      <section className="mb-12 lg:mb-16">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-brown/60 uppercase tracking-[0.2em] bg-amber/15 border border-gold/30 rounded-full px-2.5 py-1">
          <Clock className="w-3 h-3 text-gold" />
          Coming soon
        </span>
        <h1 className="mt-5 text-4xl md:text-6xl font-display text-brown leading-[1.05]">
          Tatsam on your phone —
          <br />
          <span className="text-brown/55">without losing the care.</span>
        </h1>
        <p className="mt-5 text-brown/75 text-base md:text-lg leading-relaxed max-w-2xl">
          We are building native iOS and Android apps. Same scripture-grounded
          answers, same no-training pledge, same clean citation — now in your
          pocket. Sign up and we&rsquo;ll email you the day each app lands.
        </p>
      </section>

      {/* Platform cards */}
      <section className="grid md:grid-cols-2 gap-4 mb-14">
        <PlatformCard
          badgeSrc="/badges/app-store.svg"
          badgeAlt="Download on the App Store"
          badgeWidth={164}
          title="Tatsam for iPhone"
          subtitle="iOS 16 and newer"
          eta="Q3 2026"
        />
        <PlatformCard
          badgeSrc="/badges/google-play.svg"
          badgeAlt="Get it on Google Play"
          badgeWidth={180}
          title="Tatsam for Android"
          subtitle="Android 10 and newer"
          eta="Q4 2026"
        />
      </section>

      {/* Benefits */}
      <section className="mb-14 rounded-2xl bg-white border border-gold/30 p-6 md:p-8">
        <p className="text-xs font-mono text-brown/55 uppercase tracking-wider mb-2">
          What the apps add
        </p>
        <h2 className="font-display text-2xl text-brown mb-4">
          The web, but quieter, and with you everywhere.
        </h2>
        <ul className="grid md:grid-cols-2 gap-3">
          {BENEFITS.map((b) => (
            <li key={b} className="flex gap-3 text-brown/75 text-sm leading-relaxed">
              <span className="shrink-0 mt-1 w-4 h-4 rounded-full bg-gold/20 text-gold flex items-center justify-center">
                <Check className="w-2.5 h-2.5" strokeWidth={3} />
              </span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Waitlist */}
      <section className="rounded-2xl bg-gradient-to-br from-amber/25 via-ivory to-gold/15 border border-gold/30 p-7 md:p-10">
        <div className="flex items-start gap-4 flex-wrap">
          <span className="shrink-0 w-11 h-11 rounded-full bg-maroon/10 text-maroon flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-xl md:text-2xl text-brown leading-tight">
              Be first to download.
            </p>
            <p className="text-brown/65 mt-1 text-sm md:text-base leading-relaxed">
              No marketing spam. A single email when each app is live.
            </p>
            <a
              href="mailto:apps@tatsam.co?subject=Notify%20me%20when%20Tatsam%20apps%20launch&body=Please%20notify%20me%20when%20the%20Tatsam%20iOS%20and%2For%20Android%20apps%20launch.%20Thanks!"
              className="mt-5 inline-flex items-center gap-2 h-11 px-6 rounded-full bg-maroon text-ivory hover:bg-maroon/90 transition-colors"
            >
              Notify me
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Back to web */}
      <section className="mt-12 text-center">
        <p className="text-sm text-brown/60">
          In the meantime — Tatsam works beautifully in the browser.
        </p>
        <Link
          href="/dashboard/ask"
          className="inline-flex items-center mt-3 text-maroon hover:underline"
        >
          Ask a question now →
        </Link>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────

function PlatformCard({
  badgeSrc,
  badgeAlt,
  badgeWidth,
  title,
  subtitle,
  eta,
}: {
  badgeSrc: string;
  badgeAlt: string;
  badgeWidth: number;
  title: string;
  subtitle: string;
  eta: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-gold/30 p-6 md:p-7 flex flex-col">
      <span className="absolute top-4 right-4 inline-flex items-center gap-1 text-[10px] font-mono text-brown/55 uppercase tracking-wider bg-amber/20 border border-gold/30 rounded-full px-2 py-0.5">
        ETA {eta}
      </span>

      <h3 className="font-display text-xl text-brown leading-tight pr-20">
        {title}
      </h3>
      <p className="text-xs font-mono text-brown/55 mt-1">{subtitle}</p>
      <p className="mt-4 text-sm text-brown/65 leading-relaxed">
        We are hand-porting the Tatsam interface to feel native on your
        device — with offline chart access, biometric sign-in, and tasteful
        notifications only for cosmic events that matter.
      </p>

      <div className="mt-6 pt-5 border-t border-gold/20 flex items-center justify-between gap-3 flex-wrap">
        <Image
          src={badgeSrc}
          alt={badgeAlt}
          width={badgeWidth}
          height={54}
          className="h-12 w-auto opacity-90"
        />
        <span className="text-[10px] font-mono text-brown/45 uppercase tracking-wider">
          Link live at launch
        </span>
      </div>
    </div>
  );
}
