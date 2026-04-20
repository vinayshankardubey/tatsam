import {
  tithi,
  nakshatra,
  yoga,
  rahuKaal,
  abhijitMuhurat,
  brahmaMuhurat,
  weekdayInfo,
  moonPhase,
  moonPhaseLabel,
  formatDateLong,
} from "@/lib/panchang";
import { upcomingEvents, formatRelativeDay } from "@/lib/cosmic-events";

export default async function PanchangPage() {
  const now = new Date();
  const wd = weekdayInfo(now);
  const t = tithi(now);
  const n = nakshatra(now);
  const y = yoga(now);
  const rahu = rahuKaal(now);
  const abhijit = abhijitMuhurat();
  const brahma = brahmaMuhurat();
  const phase = moonPhase(now);
  const phaseInfo = moonPhaseLabel(phase);
  const next7 = upcomingEvents(now, 7);

  // Approximations of "next N days" tithi progression, for a gentle at-a-glance
  // strip. Tithi advances roughly one per day.
  const nextDays: Array<{ date: Date; t: ReturnType<typeof tithi>; n: ReturnType<typeof nakshatra>; wd: ReturnType<typeof weekdayInfo> }> = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    nextDays.push({
      date: d,
      t: tithi(d),
      n: nakshatra(d),
      wd: weekdayInfo(d),
    });
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <section className="rounded-2xl bg-gradient-to-br from-amber/25 via-ivory to-gold/15 border border-gold/30 p-6 md:p-10">
        <p className="text-xs font-mono text-brown/60 uppercase tracking-[0.2em] mb-2">
          Panchang
        </p>
        <h1 className="text-3xl md:text-5xl font-display text-brown leading-tight">
          {formatDateLong(now)}.
        </h1>
        <p className="mt-3 text-brown/70 max-w-xl">
          The five limbs of time: Tithi, Vara, Nakshatra, Yoga, Karana. What
          follows is an indicative almanac — your acharya casts exact values
          for any muhurat that matters.
        </p>
      </section>

      {/* Today's panchang — full */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Tile label="Vara (weekday)" value={wd.sanskrit} hint={wd.planet} />
        <Tile label="Tithi" value={t.name} hint={`${t.paksha} Paksha · ${t.index} of 30`} />
        <Tile label="Nakshatra" value={n.name} hint={`${n.index} of 27`} />
        <Tile label="Yoga" value={y.name} hint={`${y.index} of 27`} />
        <Tile label="Moon phase" value={phaseInfo.label} hint={phaseInfo.symbol} />
        <Tile label="Ruler of the day" value={wd.planet} hint={wd.sanskrit} />
      </section>

      {/* Auspicious + inauspicious windows */}
      <section>
        <p className="text-xs font-mono text-brown/50 uppercase tracking-wider mb-4">
          Windows of the day
        </p>
        <div className="grid lg:grid-cols-3 gap-4">
          <WindowCard
            tone="gold"
            name="Brahma Muhurat"
            from={brahma.from}
            to={brahma.to}
            note="The pre-dawn silence. Best for sadhana, study, writing, and decisions that want clarity."
          />
          <WindowCard
            tone="gold"
            name="Abhijit Muhurat"
            from={abhijit.from}
            to={abhijit.to}
            note="The 48-minute window around solar noon. Universally auspicious for beginnings."
          />
          <WindowCard
            tone="maroon"
            name="Rahu Kaal"
            from={rahu.from}
            to={rahu.to}
            note="Avoid starting anything important — contracts, travel, launches."
          />
        </div>
        <p className="mt-3 text-[11px] font-mono text-brown/45">
          Times assume a standard sunrise around 06:00 IST. Your acharya casts
          exact windows for your coordinates.
        </p>
      </section>

      {/* Today's rhythm — weekday lucky data */}
      <section>
        <p className="text-xs font-mono text-brown/50 uppercase tracking-wider mb-4">
          Today&rsquo;s rhythm — ruled by {wd.planet}
        </p>
        <div className="rounded-xl bg-white border border-gold/30 p-5 md:p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <Row label="Lucky color" value={wd.color} />
            <Row label="Gemstone" value={wd.gemstone} />
            <Row label="Direction" value={wd.direction} />
            <Row label="Number" value={String(wd.luckyNumber)} />
          </div>
          <div className="mt-5 rounded-lg bg-amber/10 border border-gold/25 p-4">
            <p className="text-[10px] font-mono text-brown/50 uppercase tracking-wider mb-1">
              Mantra for {wd.name}
            </p>
            <p className="text-brown font-display text-base">{wd.mantra}</p>
          </div>
        </div>
      </section>

      {/* Next 7 days at a glance */}
      <section>
        <p className="text-xs font-mono text-brown/50 uppercase tracking-wider mb-4">
          Next 7 days at a glance
        </p>
        <div className="rounded-xl bg-white border border-gold/30 overflow-hidden">
          <div className="grid grid-cols-1 divide-y divide-gold/20">
            {nextDays.map((d, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-4 px-5 py-3"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span
                    className={`w-10 shrink-0 text-sm font-mono ${
                      i === 0 ? "text-maroon" : "text-brown/50"
                    }`}
                  >
                    {i === 0 ? "Today" : d.date.toLocaleDateString("en-IN", { weekday: "short" })}
                  </span>
                  <div className="min-w-0">
                    <p className="text-brown">
                      {d.t.name}{" "}
                      <span className="text-brown/50 text-xs font-mono">
                        ({d.t.paksha})
                      </span>
                    </p>
                    <p className="text-xs text-brown/55">
                      {d.n.name} · {d.wd.sanskrit}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono text-brown/45 shrink-0">
                  {d.date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming festivals + cosmic events */}
      {next7.length > 0 ? (
        <section>
          <p className="text-xs font-mono text-brown/50 uppercase tracking-wider mb-4">
            Upcoming festivals &amp; events
          </p>
          <div className="grid gap-3">
            {next7.map((e) => (
              <div
                key={e.date}
                className="flex items-start gap-4 p-4 md:p-5 rounded-xl bg-white border border-gold/30"
              >
                <span className="shrink-0 text-[10px] font-mono text-maroon uppercase tracking-wider pt-1 w-20">
                  {formatRelativeDay(e.date, now)}
                </span>
                <div className="min-w-0">
                  <p className="text-brown font-display text-base">{e.title}</p>
                  {e.note ? (
                    <p className="text-sm text-brown/60 mt-0.5">{e.note}</p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function Tile({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl bg-white border border-gold/30 p-5">
      <p className="text-[10px] font-mono text-brown/50 uppercase tracking-wider">
        {label}
      </p>
      <p className="mt-1 text-xl font-display text-brown">{value}</p>
      {hint ? <p className="text-xs text-brown/55 mt-1">{hint}</p> : null}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-mono text-brown/50 uppercase tracking-wider">
        {label}
      </p>
      <p className="text-brown font-medium mt-0.5">{value}</p>
    </div>
  );
}

function WindowCard({
  tone,
  name,
  from,
  to,
  note,
}: {
  tone: "gold" | "maroon";
  name: string;
  from: string;
  to: string;
  note: string;
}) {
  const accent = tone === "maroon" ? "border-maroon/30 bg-maroon/5" : "border-gold/40 bg-gold/10";
  const dot = tone === "maroon" ? "bg-maroon" : "bg-gold";
  return (
    <div className={`rounded-xl border p-5 ${accent}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className={`inline-block w-2 h-2 rounded-full ${dot}`} />
        <p className="text-sm font-medium text-brown">{name}</p>
      </div>
      <p className="text-2xl font-display text-brown">
        {from} <span className="text-brown/45 mx-2">–</span> {to}
      </p>
      <p className="mt-2 text-sm text-brown/60 leading-relaxed">{note}</p>
    </div>
  );
}
