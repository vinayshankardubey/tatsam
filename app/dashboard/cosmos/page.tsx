import { COSMIC_EVENTS_2026, type CosmicEvent, formatRelativeDay } from "@/lib/cosmic-events";

const KIND_COLOR: Record<CosmicEvent["kind"], { label: string; bg: string; text: string }> = {
  festival:   { label: "Festival",   bg: "bg-amber/25",     text: "text-brown" },
  purnima:    { label: "Purnima",    bg: "bg-gold/20",      text: "text-brown" },
  amavasya:   { label: "Amavasya",   bg: "bg-brown/10",     text: "text-brown" },
  eclipse:    { label: "Eclipse",    bg: "bg-maroon/15",    text: "text-maroon" },
  retrograde: { label: "Retrograde", bg: "bg-maroon/10",    text: "text-maroon" },
  solstice:   { label: "Solstice",   bg: "bg-gold/30",      text: "text-brown" },
  transit:    { label: "Transit",    bg: "bg-gold/15",      text: "text-brown" },
};

export default function CosmosPage() {
  const now = new Date();
  const todayKey = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    .toISOString()
    .slice(0, 10);

  const upcoming = COSMIC_EVENTS_2026.filter((e) => e.date >= todayKey);
  const past = COSMIC_EVENTS_2026.filter((e) => e.date < todayKey).reverse();

  // Group upcoming by month
  const monthGroups = new Map<string, CosmicEvent[]>();
  for (const e of upcoming) {
    const monthKey = new Date(e.date).toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric",
    });
    const arr = monthGroups.get(monthKey) ?? [];
    arr.push(e);
    monthGroups.set(monthKey, arr);
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <section className="rounded-2xl bg-gradient-to-br from-amber/25 via-ivory to-gold/15 border border-gold/30 p-6 md:p-10">
        <p className="text-xs font-mono text-brown/60 uppercase tracking-[0.2em] mb-2">
          Cosmic calendar
        </p>
        <h1 className="text-3xl md:text-5xl font-display text-brown leading-tight">
          The year ahead in the sky.
        </h1>
        <p className="mt-3 text-brown/70 max-w-xl">
          Festivals, eclipses, retrogrades and notable transits of 2026. Mark
          what matters; your acharya will help you time what&rsquo;s yours.
        </p>
      </section>

      {/* Stat summary */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Upcoming events" value={String(upcoming.length)} />
        <Stat
          label="Festivals ahead"
          value={String(upcoming.filter((e) => e.kind === "festival").length)}
        />
        <Stat
          label="Purnimas ahead"
          value={String(upcoming.filter((e) => e.kind === "purnima").length)}
        />
        <Stat
          label="Retrogrades"
          value={String(upcoming.filter((e) => e.kind === "retrograde").length)}
        />
      </section>

      {/* Upcoming grouped by month */}
      {monthGroups.size > 0 ? (
        Array.from(monthGroups.entries()).map(([monthLabel, events]) => (
          <section key={monthLabel}>
            <div className="flex items-baseline justify-between mb-4">
              <p className="text-xs font-mono text-brown/50 uppercase tracking-wider">
                {monthLabel}
              </p>
              <p className="text-xs font-mono text-brown/45">
                {events.length} {events.length === 1 ? "event" : "events"}
              </p>
            </div>
            <ol className="relative border-l-2 border-gold/30 pl-6 space-y-5">
              {events.map((e) => (
                <EventNode key={e.date} event={e} now={now} />
              ))}
            </ol>
          </section>
        ))
      ) : (
        <section className="rounded-xl bg-white border border-gold/30 p-10 text-center text-brown/55">
          No upcoming events on file. The next year&rsquo;s calendar will
          appear here as the cycle turns.
        </section>
      )}

      {/* Past (recent) */}
      {past.length > 0 ? (
        <section>
          <div className="mb-4">
            <p className="text-xs font-mono text-brown/50 uppercase tracking-wider">
              Recently passed
            </p>
          </div>
          <ol className="relative border-l-2 border-gold/20 pl-6 space-y-4">
            {past.slice(0, 5).map((e) => (
              <li key={e.date} className="relative">
                <span className="absolute -left-[29px] top-1.5 w-2.5 h-2.5 rounded-full bg-gold/30 ring-4 ring-ivory" />
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-xs font-mono text-brown/45">
                    {new Date(e.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <KindChip kind={e.kind} />
                </div>
                <p className="mt-0.5 text-brown/65">{e.title}</p>
              </li>
            ))}
          </ol>
        </section>
      ) : null}
    </div>
  );
}

function EventNode({ event: e, now }: { event: CosmicEvent; now: Date }) {
  return (
    <li className="relative">
      <span className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-maroon ring-4 ring-ivory" />
      <div className="flex items-baseline gap-3 flex-wrap">
        <span className="text-[10px] font-mono text-maroon uppercase tracking-wider">
          {formatRelativeDay(e.date, now)}
        </span>
        <span className="text-xs font-mono text-brown/45">
          {new Date(e.date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
        <KindChip kind={e.kind} />
      </div>
      <p className="mt-1 text-lg font-display text-brown">{e.title}</p>
      {e.note ? (
        <p className="text-sm text-brown/65 mt-0.5 leading-relaxed">{e.note}</p>
      ) : null}
    </li>
  );
}

function KindChip({ kind }: { kind: CosmicEvent["kind"] }) {
  const c = KIND_COLOR[kind];
  return (
    <span
      className={`text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded ${c.bg} ${c.text}`}
    >
      {c.label}
    </span>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white border border-gold/30 p-5">
      <p className="text-[10px] font-mono text-brown/50 uppercase tracking-wider">
        {label}
      </p>
      <p className="text-3xl font-display text-brown leading-none mt-2">
        {value}
      </p>
    </div>
  );
}
