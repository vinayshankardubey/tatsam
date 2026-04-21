import Link from "next/link";
import { getCurrentUser, getCurrentProfile } from "@/lib/supabase/current-user";
import { sunSignFromDob, SIGN_BLURBS } from "@/lib/astro";
import {
  lifePathNumber,
  expressionNumber,
  soulUrgeNumber,
  personalityNumber,
  birthDayNumber,
  personalYearNumber,
  LIFE_PATH_MEANING,
  PERSONAL_YEAR_THEME,
} from "@/lib/numerology";

export default async function KundliPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const p = await getCurrentProfile();
  const complete = !!(p?.full_name && p?.dob && p?.tob && p?.birth_place);

  if (!complete) {
    return (
      <div className="max-w-2xl space-y-6">
        <div>
          <p className="text-xs font-mono text-brown/50 uppercase tracking-[0.2em] mb-2">
            Kundli
          </p>
          <h1 className="text-3xl md:text-4xl font-display text-brown">
            We need your birth details first.
          </h1>
          <p className="mt-3 text-brown/60 max-w-lg">
            A kundli is drawn from four coordinates — your name, date, time, and
            place of birth. Complete them and your chart will unfold here.
          </p>
        </div>
        <Link
          href="/dashboard/profile"
          className="inline-flex items-center h-11 px-6 rounded-full bg-maroon text-ivory hover:bg-maroon/90"
        >
          Complete birth details
        </Link>
      </div>
    );
  }

  const year = new Date().getFullYear();
  const sign = sunSignFromDob(p.dob);
  const lifePath = lifePathNumber(p.dob);
  const expression = expressionNumber(p.full_name);
  const soul = soulUrgeNumber(p.full_name);
  const personality = personalityNumber(p.full_name);
  const birthDay = birthDayNumber(p.dob);
  const personalYear = personalYearNumber(p.dob, year);
  const meaning = lifePath ? LIFE_PATH_MEANING[lifePath] : null;
  const yearTheme = personalYear ? PERSONAL_YEAR_THEME[personalYear] : null;

  return (
    <div className="space-y-14">
      {/* Header */}
      <section>
        <p className="text-xs font-mono text-brown/50 uppercase tracking-[0.2em] mb-3">
          Your Kundli
        </p>
        <h1 className="text-4xl md:text-5xl font-display text-brown leading-tight">
          {p.full_name}&rsquo;s chart.
        </h1>
        <p className="mt-3 text-brown/60 max-w-xl">
          Born {formatBirth(p)}. Precise sidereal calculations and the deep yoga
          analysis arrive with your Signature reading.
        </p>
      </section>

      {/* Sun sign */}
      {sign ? (
        <section className="rounded-2xl bg-gradient-to-br from-amber/25 to-ivory border border-gold/30 p-6 md:p-8">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="min-w-0">
              <p className="text-[10px] font-mono text-brown/50 uppercase tracking-wider mb-2">
                Sun sign (Sayana)
              </p>
              <h2 className="text-3xl md:text-4xl font-display text-brown">
                {sign.name}
              </h2>
              <p className="text-sm text-brown/60 mt-1">
                {sign.sanskrit} · ruled by {sign.ruler} · {sign.element} element
              </p>
              <p className="mt-5 text-brown/70 leading-relaxed max-w-2xl">
                {SIGN_BLURBS[sign.name]}
              </p>
            </div>
            <span className="text-7xl md:text-8xl text-gold" aria-hidden>
              {sign.symbol}
            </span>
          </div>
        </section>
      ) : null}

      {/* Sidereal placeholders — cast by acharya */}
      <section>
        <div className="mb-5">
          <p className="text-xs font-mono text-brown/50 uppercase tracking-wider mb-2">
            Sidereal Kundli
          </p>
          <h2 className="text-2xl md:text-3xl font-display text-brown">
            The deeper layers of your chart
          </h2>
          <p className="mt-2 text-sm text-brown/55 max-w-xl">
            These are cast by your acharya using traditional Vedic calculations
            tied to your exact time and place of birth.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <ChartCard
            label="Moon sign (Janma Rashi)"
            hint="Where the Moon lived at your birth — the emotional ground of who you are."
          />
          <ChartCard
            label="Ascendant (Lagna)"
            hint="The sign rising on the eastern horizon — how you meet the world."
          />
          <ChartCard
            label="Janma Nakshatra"
            hint="One of 27 lunar mansions. Gently colours temperament, career, marriage timing."
          />
          <ChartCard
            label="Navamsa (D9)"
            hint="The harmonic chart — widely used for partnership and deeper destiny."
          />
          <ChartCard
            label="Current Mahadasha"
            hint="The planetary period you are living through. Determines the weather of your years."
          />
          <ChartCard
            label="Key yogas"
            hint="Special planetary combinations — gifts you carry, lessons to integrate."
          />
        </div>
        <p className="mt-4 text-sm text-brown/60">
          Get the full cast in your reading.{" "}
          <Link href="/dashboard/book" className="text-maroon hover:underline">
            Book Signature →
          </Link>
        </p>
      </section>

      {/* Numerology */}
      <section>
        <div className="mb-5">
          <p className="text-xs font-mono text-brown/50 uppercase tracking-wider mb-2">
            Your numbers
          </p>
          <h2 className="text-2xl md:text-3xl font-display text-brown">
            The shape of your name &amp; date
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <NumCard
            label="Life Path"
            value={lifePath}
            caption={meaning?.keyword}
            tone="maroon"
          />
          <NumCard label="Expression" value={expression} caption="Who you become" />
          <NumCard label="Soul Urge" value={soul} caption="What your heart wants" />
          <NumCard
            label="Personality"
            value={personality}
            caption="How others meet you"
          />
          <NumCard label="Birth Day" value={birthDay} caption="The day you were born" />
          <NumCard
            label={`Personal Year ${year}`}
            value={personalYear}
            caption={yearTheme?.keyword}
            tone="gold"
          />
        </div>

        {meaning ? (
          <div className="mt-5 rounded-xl bg-white border border-gold/30 p-5 md:p-6">
            <p className="text-[10px] font-mono text-brown/50 uppercase tracking-wider mb-1">
              Your Life Path · {lifePath}
            </p>
            <p className="text-brown leading-relaxed">
              <span className="font-display text-lg">{meaning.keyword}.</span>{" "}
              {meaning.blurb}
            </p>
          </div>
        ) : null}

        {yearTheme ? (
          <div className="mt-3 rounded-xl bg-amber/10 border border-gold/30 p-5 md:p-6">
            <p className="text-[10px] font-mono text-brown/50 uppercase tracking-wider mb-1">
              Your {year}
            </p>
            <p className="text-brown leading-relaxed">
              <span className="font-display text-lg">{yearTheme.keyword}.</span>{" "}
              {yearTheme.blurb}
            </p>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function formatBirth(p: Profile): string {
  const parts: string[] = [];
  if (p.dob) {
    const d = new Date(p.dob + "T00:00:00");
    parts.push(
      d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    );
  }
  if (p.tob) parts.push(`at ${p.tob}`);
  if (p.birth_place) parts.push(`in ${p.birth_place}`);
  return parts.join(" ");
}

function ChartCard({ label, hint }: { label: string; hint: string }) {
  return (
    <div className="rounded-xl bg-white border border-gold/30 p-5">
      <p className="text-[10px] font-mono text-brown/50 uppercase tracking-wider">
        {label}
      </p>
      <p className="text-brown mt-1 font-display">Cast by your acharya</p>
      <p className="text-sm text-brown/60 mt-2 leading-relaxed">{hint}</p>
    </div>
  );
}

function NumCard({
  label,
  value,
  caption,
  tone,
}: {
  label: string;
  value: number | null;
  caption?: string;
  tone?: "gold" | "maroon";
}) {
  const color =
    tone === "maroon" ? "text-maroon" : tone === "gold" ? "text-gold" : "text-brown";
  return (
    <div className="rounded-xl bg-white border border-gold/30 p-4">
      <p className="text-[10px] font-mono text-brown/50 uppercase tracking-wider">
        {label}
      </p>
      <p className={`text-4xl font-display leading-none mt-2 ${color}`}>
        {value ?? "—"}
      </p>
      {caption ? (
        <p className="text-xs text-brown/55 mt-2 truncate">{caption}</p>
      ) : null}
    </div>
  );
}
