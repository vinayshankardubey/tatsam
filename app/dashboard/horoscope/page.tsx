import Link from "next/link";
import { getCurrentUser, getCurrentProfile } from "@/lib/supabase/current-user";
import { sunSignFromDob, SIGN_BLURBS } from "@/lib/astro";
import { reflectionFor } from "@/lib/horoscope";

const ALL_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

const SIGN_SYMBOLS: Record<string, string> = {
  Aries: "♈", Taurus: "♉", Gemini: "♊", Cancer: "♋",
  Leo: "♌", Virgo: "♍", Libra: "♎", Scorpio: "♏",
  Sagittarius: "♐", Capricorn: "♑", Aquarius: "♒", Pisces: "♓",
};

export default async function HoroscopePage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const p = await getCurrentProfile();
  const sign = sunSignFromDob(p?.dob);
  const now = new Date();

  // Seven days of reflections for the user's sign
  const week: Array<{ date: Date; label: string; text: string | null }> = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const label =
      i === 0
        ? "Today"
        : i === 1
          ? "Tomorrow"
          : d.toLocaleDateString("en-IN", { weekday: "long" });
    week.push({
      date: d,
      label,
      text: reflectionFor(sign?.name, d),
    });
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <section className="rounded-2xl bg-gradient-to-br from-gold/15 to-ivory border border-gold/30 p-6 md:p-10">
        <p className="text-xs font-mono text-brown/60 uppercase tracking-[0.2em] mb-2">
          Horoscope
        </p>
        {sign ? (
          <>
            <h1 className="text-4xl md:text-5xl font-display text-brown leading-tight flex items-center gap-4 flex-wrap">
              <span>For {sign.name}</span>
              <span className="text-gold text-5xl md:text-6xl" aria-hidden>
                {sign.symbol}
              </span>
            </h1>
            <p className="mt-3 text-brown/70 max-w-xl">
              {sign.sanskrit} · ruled by {sign.ruler} · {sign.element} element
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl md:text-4xl font-display text-brown leading-tight">
              Daily reflections.
            </h1>
            <p className="mt-3 text-brown/70 max-w-xl">
              Add your date of birth in the profile to see reflections crafted
              for your sign.
            </p>
            <Link
              href="/dashboard/profile"
              className="inline-flex mt-5 h-10 px-5 rounded-full bg-maroon text-ivory items-center hover:bg-maroon/90"
            >
              Complete profile
            </Link>
          </>
        )}
      </section>

      {/* Today's line — big */}
      {sign && week[0].text ? (
        <section className="rounded-2xl bg-white border border-gold/30 p-6 md:p-10">
          <p className="text-[10px] font-mono text-brown/50 uppercase tracking-wider mb-3">
            A line for today
          </p>
          <p className="text-2xl md:text-3xl font-display text-brown leading-snug">
            {week[0].text}
          </p>
          <p className="mt-6 text-sm text-brown/60 leading-relaxed max-w-xl">
            {SIGN_BLURBS[sign.name]}
          </p>
        </section>
      ) : null}

      {/* Next six days */}
      {sign ? (
        <section>
          <p className="text-xs font-mono text-brown/50 uppercase tracking-wider mb-4">
            The week ahead
          </p>
          <ol className="relative border-l-2 border-gold/30 pl-6 space-y-6">
            {week.slice(1).map((d) => (
              <li key={d.date.toISOString()} className="relative">
                <span className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-gold ring-4 ring-ivory" />
                <p className="text-[10px] font-mono text-brown/50 uppercase tracking-wider">
                  {d.label} ·{" "}
                  {d.date.toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}
                </p>
                <p className="mt-1 text-lg text-brown leading-snug">{d.text}</p>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {/* Explore all signs */}
      <section>
        <div className="mb-5">
          <p className="text-xs font-mono text-brown/50 uppercase tracking-wider mb-2">
            Other signs, today
          </p>
          <h2 className="text-2xl md:text-3xl font-display text-brown">
            A line for each of the twelve
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {ALL_SIGNS.map((s) => {
            const line = reflectionFor(s, now);
            const mine = sign?.name === s;
            return (
              <div
                key={s}
                className={`rounded-xl p-5 border ${
                  mine ? "border-maroon/40 bg-amber/10" : "border-gold/30 bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-base font-display text-brown">{s}</p>
                  <span className="text-xl text-gold" aria-hidden>
                    {SIGN_SYMBOLS[s]}
                  </span>
                </div>
                <p className="text-sm text-brown/70 leading-relaxed">{line}</p>
                {mine ? (
                  <p className="mt-2 text-[10px] font-mono text-maroon uppercase tracking-wider">
                    Your sign
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
