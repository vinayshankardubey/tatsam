import Link from "next/link";
import { getCurrentUser, getCurrentProfile } from "@/lib/supabase/current-user";
import {
  lifePathNumber,
  expressionNumber,
  soulUrgeNumber,
  personalityNumber,
  birthDayNumber,
  personalYearNumber,
  personalMonthNumber,
  personalDayNumber,
  LIFE_PATH_MEANING,
  EXPRESSION_MEANING,
  SOUL_URGE_MEANING,
  PERSONALITY_MEANING,
  BIRTH_DAY_MEANING,
  PERSONAL_YEAR_THEME,
} from "@/lib/numerology";

export default async function NumerologyPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const p = await getCurrentProfile();
  const complete = !!(p?.full_name && p?.dob);

  if (!complete) {
    return (
      <div className="max-w-2xl space-y-6">
        <div>
          <p className="text-xs font-mono text-brown/50 uppercase tracking-[0.2em] mb-2">
            Numerology
          </p>
          <h1 className="text-3xl md:text-4xl font-display text-brown">
            We need your name and date of birth.
          </h1>
          <p className="mt-3 text-brown/60 max-w-lg">
            Numerology reads the letters of your full name and the digits of
            your date of birth. Both are required.
          </p>
        </div>
        <Link
          href="/dashboard/profile"
          className="inline-flex items-center h-11 px-6 rounded-full bg-maroon text-ivory hover:bg-maroon/90"
        >
          Complete profile
        </Link>
      </div>
    );
  }

  const now = new Date();
  const year = now.getFullYear();
  const lifePath = lifePathNumber(p.dob);
  const expression = expressionNumber(p.full_name);
  const soul = soulUrgeNumber(p.full_name);
  const personality = personalityNumber(p.full_name);
  const birthDay = birthDayNumber(p.dob);
  const personalYear = personalYearNumber(p.dob, year);
  const personalMonth = personalMonthNumber(p.dob, now);
  const personalDay = personalDayNumber(p.dob, now);
  const lpMeaning = lifePath ? LIFE_PATH_MEANING[lifePath] : null;
  const yearTheme = personalYear ? PERSONAL_YEAR_THEME[personalYear] : null;

  // Year cycle visualisation — 9-year wheel, highlight current.
  const cycleStart = personalYear ?? 1;
  const wheel = Array.from({ length: 9 }, (_, i) => {
    const offset = i;
    const num = ((cycleStart + offset - 1) % 9) + 1;
    return { year: year + offset, num };
  });

  return (
    <div className="space-y-12">
      {/* Header */}
      <section className="rounded-2xl bg-gradient-to-br from-gold/15 to-ivory border border-gold/30 p-6 md:p-10">
        <p className="text-xs font-mono text-brown/60 uppercase tracking-[0.2em] mb-2">
          Your numbers
        </p>
        <h1 className="text-3xl md:text-5xl font-display text-brown leading-tight">
          {p.full_name}&rsquo;s numerology.
        </h1>
        <p className="mt-3 text-brown/70 max-w-xl">
          Calculated from the Pythagorean system, honouring master numbers 11,
          22, and 33.
        </p>
      </section>

      {/* Core numbers grid */}
      <section>
        <p className="text-xs font-mono text-brown/50 uppercase tracking-wider mb-4">
          Your core five
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <CoreNumber label="Life Path"   value={lifePath}    tone="maroon" keyword={lpMeaning?.keyword} />
          <CoreNumber label="Expression"  value={expression}                keyword="The destiny number" />
          <CoreNumber label="Soul Urge"   value={soul}                      keyword="The heart&rsquo;s number" />
          <CoreNumber label="Personality" value={personality}               keyword="The outer number" />
          <CoreNumber label="Birth Day"   value={birthDay}    tone="gold"   keyword="The day you arrived" />
        </div>
      </section>

      {/* Deep meaning cards */}
      <section className="grid md:grid-cols-2 gap-4">
        {lifePath && lpMeaning ? (
          <DeepCard
            badge={`Life Path · ${lifePath}`}
            title={lpMeaning.keyword}
            body={lpMeaning.blurb}
          />
        ) : null}
        {expression != null ? (
          <DeepCard
            badge={`Expression · ${expression}`}
            title="Who you are becoming"
            body={EXPRESSION_MEANING[expression] ?? ""}
          />
        ) : null}
        {soul != null ? (
          <DeepCard
            badge={`Soul Urge · ${soul}`}
            title="What your heart wants"
            body={SOUL_URGE_MEANING[soul] ?? ""}
          />
        ) : null}
        {personality != null ? (
          <DeepCard
            badge={`Personality · ${personality}`}
            title="How others meet you"
            body={PERSONALITY_MEANING[personality] ?? ""}
          />
        ) : null}
        {birthDay != null ? (
          <DeepCard
            badge={`Birth Day · ${birthDay}`}
            title="The day you were born"
            body={BIRTH_DAY_MEANING[birthDay] ?? ""}
          />
        ) : null}
      </section>

      {/* Personal year / month / day */}
      <section>
        <p className="text-xs font-mono text-brown/50 uppercase tracking-wider mb-4">
          Your personal cycle
        </p>
        <div className="grid md:grid-cols-3 gap-3">
          <CycleCard label={`Year · ${year}`}         value={personalYear}  accent={yearTheme?.keyword} />
          <CycleCard label={`Month · ${now.toLocaleDateString("en-IN", { month: "long" })}`} value={personalMonth} />
          <CycleCard label="Today"                     value={personalDay} />
        </div>
        {yearTheme ? (
          <div className="mt-4 rounded-xl bg-white border border-gold/30 p-5 md:p-6">
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

      {/* 9-year wheel */}
      <section>
        <p className="text-xs font-mono text-brown/50 uppercase tracking-wider mb-4">
          Your 9-year cycle — the decade ahead
        </p>
        <div className="grid grid-cols-3 md:grid-cols-9 gap-2">
          {wheel.map((y, idx) => {
            const isNow = idx === 0;
            return (
              <div
                key={y.year}
                className={`rounded-xl p-4 text-center border ${
                  isNow
                    ? "bg-maroon text-ivory border-maroon"
                    : "bg-white border-gold/30 text-brown"
                }`}
              >
                <p
                  className={`text-[10px] font-mono uppercase tracking-wider ${
                    isNow ? "text-ivory/80" : "text-brown/50"
                  }`}
                >
                  {y.year}
                </p>
                <p className="text-3xl font-display leading-none mt-1">
                  {y.num}
                </p>
                {isNow ? (
                  <p className="mt-2 text-[10px] font-mono uppercase tracking-wider text-ivory/80">
                    You are here
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-[11px] font-mono text-brown/45">
          Numerology moves through a 9-year wheel. The year 2026 carries your
          personal number {personalYear ?? "—"}; a new cycle begins in{" "}
          {year + (9 - ((personalYear ?? 1) - 1)) % 9}.
        </p>
      </section>

      {/* CTA */}
      <section className="rounded-2xl bg-white border border-gold/30 p-6 md:p-8 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-brown font-display text-lg">
            Want the full 30-page numerology report?
          </p>
          <p className="text-brown/60 text-sm mt-1">
            Hand-interpreted by an acharya — including name compatibility,
            lucky windows, and remedies.
          </p>
        </div>
        <Link
          href="/dashboard/book?plan=signature"
          className="inline-flex items-center h-11 px-6 rounded-full bg-maroon text-ivory hover:bg-maroon/90"
        >
          Book Signature
        </Link>
      </section>
    </div>
  );
}

function CoreNumber({
  label,
  value,
  keyword,
  tone,
}: {
  label: string;
  value: number | null;
  keyword?: string;
  tone?: "maroon" | "gold";
}) {
  const color =
    tone === "maroon" ? "text-maroon" : tone === "gold" ? "text-gold" : "text-brown";
  return (
    <div className="rounded-xl bg-white border border-gold/30 p-5">
      <p className="text-[10px] font-mono text-brown/50 uppercase tracking-wider">
        {label}
      </p>
      <p className={`text-5xl font-display leading-none mt-2 ${color}`}>
        {value ?? "—"}
      </p>
      {keyword ? (
        <p className="text-xs text-brown/55 mt-2">{keyword}</p>
      ) : null}
    </div>
  );
}

function DeepCard({
  badge,
  title,
  body,
}: {
  badge: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl bg-white border border-gold/30 p-6">
      <p className="text-[10px] font-mono text-brown/55 uppercase tracking-wider mb-2">
        {badge}
      </p>
      <p className="text-lg font-display text-brown mb-2">{title}</p>
      <p className="text-sm text-brown/70 leading-relaxed">{body}</p>
    </div>
  );
}

function CycleCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number | null;
  accent?: string;
}) {
  return (
    <div className="rounded-xl bg-white border border-gold/30 p-5">
      <p className="text-[10px] font-mono text-brown/50 uppercase tracking-wider">
        {label}
      </p>
      <div className="flex items-baseline gap-3 mt-2">
        <span className="text-4xl font-display text-brown leading-none">
          {value ?? "—"}
        </span>
        {accent ? (
          <span className="text-sm text-brown/55">{accent}</span>
        ) : null}
      </div>
    </div>
  );
}
