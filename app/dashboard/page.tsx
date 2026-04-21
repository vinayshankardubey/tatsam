import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, getCurrentProfile } from "@/lib/supabase/current-user";
import {
  type Reading,
  PLAN_META,
  STATUS_LABEL,
} from "@/lib/supabase/types";
import { sunSignFromDob, SIGN_BLURBS } from "@/lib/astro";
import { lifePathNumber, LIFE_PATH_MEANING } from "@/lib/numerology";
import {
  STAGE_ORDER,
  STAGE_LABEL,
  stageIndex,
  timeAgo,
  timeOfDayGreeting,
} from "@/lib/reading-helpers";
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
import { reflectionFor } from "@/lib/horoscope";

/**
 * "Today" — the daily-cadence dashboard. Deep chart details live at
 * /dashboard/kundli, the full readings history at /dashboard/readings, the
 * acharya conversations at /dashboard/ask, and profile at /dashboard/profile.
 */
export default async function TodayPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();
  const now = new Date();

  // Profile is cached via getCurrentProfile (layout already fetched it).
  const [p, { data: readings }, { data: repliesRaw }] = await Promise.all([
    getCurrentProfile(),
    supabase
      .from("readings")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("reading_messages")
      .select("reading_id, sender_id")
      .neq("sender_id", user.id),
  ]);
  const profileComplete = !!(p?.full_name && p?.dob && p?.tob && p?.birth_place);
  const firstName = (p?.full_name ?? "").split(" ")[0] || "seeker";

  const readingsList = (readings ?? []) as Reading[];
  const active = readingsList.filter(
    (r) => r.status !== "delivered" && r.status !== "cancelled",
  );
  const latestWithReport = readingsList.find(
    (r) => r.status === "delivered" && r.report_url,
  );

  const replyCounts = new Map<string, number>();
  for (const m of (repliesRaw ?? []) as { reading_id: string }[]) {
    replyCounts.set(m.reading_id, (replyCounts.get(m.reading_id) ?? 0) + 1);
  }
  const totalReplies = Array.from(replyCounts.values()).reduce(
    (a, b) => a + b,
    0,
  );

  // Chart + numerology (light — deeper details live in /dashboard/kundli)
  const sign = sunSignFromDob(p?.dob);
  const lifePath = lifePathNumber(p?.dob);
  const meaning = lifePath ? LIFE_PATH_MEANING[lifePath] : null;

  // Panchang
  const wd = weekdayInfo(now);
  const t = tithi(now);
  const n = nakshatra(now);
  const y = yoga(now);
  const rahu = rahuKaal(now);
  const abhijit = abhijitMuhurat();
  const brahma = brahmaMuhurat();
  const phase = moonPhase(now);
  const phaseInfo = moonPhaseLabel(phase);
  const reflection = reflectionFor(sign?.name, now);
  const events = upcomingEvents(now, 5);

  return (
    <div className="space-y-10 lg:space-y-14">
      {/* ── 1. Hero + Panchang ─────────────────────────────────────── */}
      <section
        id="panchang"
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber/25 via-ivory to-gold/15 border border-gold/30 p-6 md:p-10"
      >
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-24 w-[360px] h-[360px] rounded-full pointer-events-none opacity-40"
          style={{
            background:
              "conic-gradient(from 0deg, rgba(244,184,96,0.6), rgba(201,163,90,0.2), rgba(244,184,96,0.6))",
            filter: "blur(50px)",
          }}
        />
        <div className="relative">
          <p className="text-xs font-mono text-brown/60 uppercase tracking-[0.2em] mb-2">
            {timeOfDayGreeting()}
          </p>
          <h1 className="text-4xl md:text-5xl font-display text-brown leading-tight">
            {p?.full_name ?? "Welcome, seeker"}.
          </h1>
          <p className="mt-3 text-brown/70 max-w-xl">
            {profileComplete
              ? `Namaste, ${firstName}. Today&rsquo;s sky is asking for your attention.`
              : "A few birth details and we can cast your chart with precision. Takes under a minute."}
          </p>

          {/* Panchang strip */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-3">
            <PanchangCell label={formatDateLong(now)} value={wd.sanskrit} hint={wd.planet} />
            <PanchangCell label="Tithi" value={t.name} hint={`${t.paksha} Paksha`} />
            <PanchangCell label="Nakshatra" value={n.name} hint={`#${n.index} of 27`} />
            <PanchangCell label="Yoga" value={y.name} hint={`#${y.index} of 27`} />
            <PanchangCell label="Moon" value={phaseInfo.label} hint={phaseInfo.symbol} />
          </div>
        </div>
      </section>

      {/* ── 2. Nudges: report ready + unread replies ───────────────── */}
      <div className="grid md:grid-cols-2 gap-4">
        {latestWithReport ? (
          <section className="rounded-2xl border border-gold/40 bg-gradient-to-r from-amber/20 to-ivory p-5 flex items-center justify-between gap-4 flex-wrap">
            <div className="min-w-0">
              <p className="text-[10px] font-mono text-brown/55 uppercase tracking-wider mb-1">
                Latest report is ready
              </p>
              <p className="font-display text-brown truncate">
                {PLAN_META[latestWithReport.plan].label}
                {latestWithReport.delivered_at
                  ? ` · ${timeAgo(latestWithReport.delivered_at)}`
                  : ""}
              </p>
            </div>
            <a
              href={latestWithReport.report_url!}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center h-9 px-4 rounded-full bg-maroon text-ivory text-sm hover:bg-maroon/90"
            >
              Open PDF
            </a>
          </section>
        ) : null}

        {totalReplies > 0 ? (
          <section className="rounded-2xl border border-maroon/25 bg-maroon/5 p-5 flex items-center justify-between gap-4 flex-wrap">
            <div className="min-w-0">
              <p className="text-[10px] font-mono text-maroon uppercase tracking-wider mb-1">
                Acharya has replied
              </p>
              <p className="font-display text-brown">
                {totalReplies} new {totalReplies === 1 ? "message" : "messages"} across your threads
              </p>
            </div>
            <Link
              href="/dashboard/ask"
              className="inline-flex items-center h-9 px-4 rounded-full bg-maroon text-ivory text-sm hover:bg-maroon/90"
            >
              Read
            </Link>
          </section>
        ) : null}
      </div>

      {/* ── 3. Birth-details prompt (only until complete) ──────────── */}
      {!profileComplete ? (
        <section className="rounded-2xl border border-gold/40 bg-amber/10 p-6 md:p-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-lg font-display text-brown mb-1">
                Complete your birth details
              </h2>
              <p className="text-sm text-brown/60 max-w-md">
                Date, time, and place of birth are the four coordinates every
                kundli is drawn from.
              </p>
            </div>
            <Link
              href="/dashboard/profile"
              className="inline-flex items-center h-10 px-5 rounded-full bg-maroon text-ivory hover:bg-maroon/90"
            >
              Fill details
            </Link>
          </div>
        </section>
      ) : null}

      {/* ── 4. Today's rhythm + Auspicious windows + Reflection ────── */}
      {profileComplete ? (
        <section id="insights" className="grid lg:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white border border-gold/30 p-6">
            <p className="text-[10px] font-mono text-brown/50 uppercase tracking-wider mb-3">
              {wd.sanskrit} — today&rsquo;s rhythm
            </p>
            <p className="text-lg font-display text-brown mb-4">
              Ruled by {wd.planet}
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <RhythmRow label="Lucky color" value={wd.color} />
              <RhythmRow label="Gemstone" value={wd.gemstone} />
              <RhythmRow label="Direction" value={wd.direction} />
              <RhythmRow label="Number" value={String(wd.luckyNumber)} />
            </div>
            <div className="mt-4 rounded-lg bg-amber/10 border border-gold/25 p-3">
              <p className="text-[10px] font-mono text-brown/50 uppercase tracking-wider">
                Mantra
              </p>
              <p className="text-brown font-display text-sm mt-1">{wd.mantra}</p>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-gold/30 p-6">
            <p className="text-[10px] font-mono text-brown/50 uppercase tracking-wider mb-3">
              Auspicious windows today
            </p>
            <div className="space-y-4">
              <WindowRow
                label="Brahma Muhurat"
                from={brahma.from}
                to={brahma.to}
                note="Pre-dawn silence — best for sadhana or important decisions."
                tone="gold"
              />
              <WindowRow
                label="Abhijit Muhurat"
                from={abhijit.from}
                to={abhijit.to}
                note="Midday ~48 min — universally auspicious."
                tone="gold"
              />
              <WindowRow
                label="Rahu Kaal"
                from={rahu.from}
                to={rahu.to}
                note="Inauspicious — avoid starting anything important."
                tone="maroon"
              />
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-gold/15 to-ivory border border-gold/30 p-6 flex flex-col">
            <p className="text-[10px] font-mono text-brown/50 uppercase tracking-wider mb-3">
              A line for today
            </p>
            {sign ? (
              <p className="text-sm text-brown/60 mb-2">
                For {sign.name} ({sign.sanskrit})
              </p>
            ) : null}
            <p className="text-xl font-display text-brown leading-snug flex-1">
              {reflection ?? "Pause, breathe, begin. The day is already yours."}
            </p>
            <p className="mt-4 text-[11px] font-mono text-brown/45">
              New reflection each morning.
            </p>
          </div>
        </section>
      ) : null}

      {/* ── 5. Chart + Life Path preview (links to /kundli) ────────── */}
      {profileComplete && sign ? (
        <section id="numerology">
          <div className="flex items-end justify-between mb-5 gap-4">
            <div>
              <p className="text-xs font-mono text-brown/50 uppercase tracking-wider mb-2">
                Your chart, at a glance
              </p>
              <h2 className="text-2xl md:text-3xl font-display text-brown">
                {sign.name} · {meaning?.keyword ?? `Life Path ${lifePath ?? ""}`}
              </h2>
            </div>
            <Link
              href="/dashboard/kundli"
              className="text-sm text-maroon hover:underline shrink-0"
            >
              Open kundli →
            </Link>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-amber/20 to-ivory border border-gold/30 p-6">
            <p className="text-brown/80 leading-relaxed">
              {SIGN_BLURBS[sign.name]}
            </p>
            {meaning ? (
              <p className="text-brown/65 mt-4 leading-relaxed">
                <span className="text-gold font-display text-lg mr-1">
                  {lifePath}
                </span>
                — {meaning.blurb}
              </p>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* ── 6. Cosmic calendar ─────────────────────────────────────── */}
      {events.length > 0 ? (
        <section id="cosmos">
          <div className="mb-5">
            <p className="text-xs font-mono text-brown/50 uppercase tracking-wider mb-2">
              The cosmic calendar
            </p>
            <h2 className="text-2xl md:text-3xl font-display text-brown">
              Upcoming sky events
            </h2>
          </div>
          <ol className="relative border-l-2 border-gold/30 pl-6 space-y-5">
            {events.map((e) => (
              <li key={e.date} className="relative">
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
                </div>
                <p className="mt-0.5 text-lg font-display text-brown">{e.title}</p>
                {e.note ? (
                  <p className="text-sm text-brown/65 mt-0.5">{e.note}</p>
                ) : null}
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {/* ── 7. Active readings preview (link to /readings) ─────────── */}
      <section id="remedies">
        <div className="flex items-end justify-between mb-5 gap-4">
          <div>
            <p className="text-xs font-mono text-brown/50 uppercase tracking-wider mb-2">
              Active readings
            </p>
            <h2 className="text-2xl md:text-3xl font-display text-brown">
              In progress
            </h2>
          </div>
          <Link
            href="/dashboard/readings"
            className="text-sm text-maroon hover:underline shrink-0"
          >
            All readings →
          </Link>
        </div>

        {active.length > 0 ? (
          <div className="grid gap-4">
            {active.slice(0, 3).map((r) => (
              <ActiveReadingCard
                key={r.id}
                reading={r}
                replyCount={replyCounts.get(r.id) ?? 0}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-white border border-gold/30 p-8 md:p-10 text-center">
            <p className="text-brown/70 mb-4">
              No active readings. Start with a Darshan snapshot or a full Signature.
            </p>
            <Link
              href="/dashboard/book"
              className="inline-flex items-center h-11 px-6 rounded-full bg-maroon text-ivory hover:bg-maroon/90"
            >
              Book a reading
            </Link>
          </div>
        )}
      </section>

      {/* ── 8. Quick actions ───────────────────────────────────────── */}
      <section>
        <p className="text-xs font-mono text-brown/50 uppercase tracking-wider mb-2">
          Quick actions
        </p>
        <h2 className="text-2xl md:text-3xl font-display text-brown mb-5">
          What would help today?
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          <ActionTile
            title="Book a reading"
            body="Darshan · Signature · Legacy"
            href="/dashboard/book"
            primary
          />
          <ActionTile
            title="Open your kundli"
            body="Sun sign, life path, and more"
            href="/dashboard/kundli"
          />
          <ActionTile
            title="Ask an acharya"
            body="Reply to your threads"
            href="/dashboard/ask"
          />
          <ActionTile
            title="Kundli matching"
            body="Guna Milan for couples"
            href="/dashboard/book?plan=signature"
          />
          <ActionTile
            title="Muhurat finder"
            body="An auspicious time for…"
            href="/dashboard/book?plan=signature"
          />
          <ActionTile
            title="Edit birth details"
            body="Keep your chart accurate"
            href="/dashboard/profile"
          />
        </div>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Presentational helpers
// ─────────────────────────────────────────────────────────────

function PanchangCell({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-lg bg-ivory/60 border border-gold/25 px-3 py-2">
      <p className="text-[9px] font-mono text-brown/50 uppercase tracking-wider">
        {label}
      </p>
      <p className="text-brown font-medium truncate">{value}</p>
      {hint ? <p className="text-[10px] text-brown/55 truncate">{hint}</p> : null}
    </div>
  );
}

function RhythmRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-mono text-brown/50 uppercase tracking-wider">
        {label}
      </p>
      <p className="text-brown font-medium">{value}</p>
    </div>
  );
}

function WindowRow({
  label,
  from,
  to,
  note,
  tone,
}: {
  label: string;
  from: string;
  to: string;
  note: string;
  tone: "gold" | "maroon";
}) {
  const dot = tone === "maroon" ? "bg-maroon" : "bg-gold";
  return (
    <div className="flex items-start gap-3">
      <span className={`mt-2 inline-block w-2 h-2 rounded-full ${dot}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2 flex-wrap">
          <p className="text-sm font-medium text-brown">{label}</p>
          <p className="text-xs font-mono text-brown/70">
            {from} – {to}
          </p>
        </div>
        <p className="text-xs text-brown/55 mt-0.5">{note}</p>
      </div>
    </div>
  );
}

function ActionTile({
  title,
  body,
  href,
  primary,
}: {
  title: string;
  body: string;
  href: string;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group block rounded-xl p-5 border transition-colors ${
        primary
          ? "bg-maroon border-maroon text-ivory hover:bg-maroon/90"
          : "bg-white border-gold/30 text-brown hover:border-maroon/40"
      }`}
    >
      <p
        className={`text-base font-display ${
          primary ? "text-ivory" : "text-brown"
        }`}
      >
        {title}
      </p>
      <p
        className={`text-xs mt-1 ${
          primary ? "text-ivory/75" : "text-brown/55"
        }`}
      >
        {body}
      </p>
      <span
        className={`block mt-4 text-sm transition-transform group-hover:translate-x-1 ${
          primary ? "text-ivory/85" : "text-maroon"
        }`}
      >
        Open →
      </span>
    </Link>
  );
}

function ActiveReadingCard({
  reading: r,
  replyCount,
}: {
  reading: Reading;
  replyCount: number;
}) {
  const activeIdx = stageIndex(r.status);
  return (
    <Link
      href={`/dashboard/readings/${r.id}`}
      className="group block p-5 md:p-6 rounded-xl bg-white border border-gold/30 hover:border-maroon/50 transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-lg font-display text-brown">
              {PLAN_META[r.plan].label} reading
            </span>
            <span className="text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded bg-amber/25 text-brown">
              {STATUS_LABEL[r.status]}
            </span>
            {replyCount > 0 ? (
              <span className="text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded bg-maroon text-ivory">
                {replyCount} {replyCount === 1 ? "reply" : "replies"}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-brown/60 truncate">
            Requested {timeAgo(r.created_at)}
            {r.acharya_name ? ` • ${r.acharya_name}` : ""}
          </p>
        </div>
        <span className="text-brown/40 group-hover:text-maroon transition-colors shrink-0">
          →
        </span>
      </div>
      <div className="mt-5 flex items-center gap-2">
        {STAGE_ORDER.map((s, i) => {
          const done = i < activeIdx;
          const now = i === activeIdx;
          return (
            <div key={s} className="flex items-center gap-2 flex-1">
              <span
                className={`flex-1 h-1.5 rounded-full ${
                  done
                    ? "bg-gold"
                    : now
                      ? "bg-gradient-to-r from-gold to-amber"
                      : "bg-gold/15"
                }`}
              />
              <span
                className={`text-[10px] font-mono uppercase tracking-wider shrink-0 ${
                  now ? "text-brown" : "text-brown/45"
                }`}
              >
                {STAGE_LABEL[s]}
              </span>
            </div>
          );
        })}
      </div>
    </Link>
  );
}
