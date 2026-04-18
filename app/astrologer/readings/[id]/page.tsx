import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/supabase/require-role";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  type Reading,
  type Profile,
  type ReadingEvent,
  type ReadingRemedy,
  type ReadingMessage,
  PLAN_META,
  STATUS_LABEL,
  REMEDY_LABEL,
  EVENT_LABEL,
} from "@/lib/supabase/types";
import {
  lifePathNumber,
  expressionNumber,
  soulUrgeNumber,
  LIFE_PATH_MEANING,
} from "@/lib/numerology";
import { sunSignFromDob } from "@/lib/astro";
import { ReadingControls } from "./reading-controls";
import { AcharyaMessages } from "./acharya-messages";

export default async function AstrologerReadingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { profile } = await requireRole("acharya");
  const admin = createAdminClient();

  const [{ data: reading }, { data: events }, { data: remedies }, { data: messages }] =
    await Promise.all([
      admin
        .from("readings")
        .select("*, seeker:profiles!readings_user_id_fkey(id, full_name, email, phone, dob, tob, birth_place, language)")
        .eq("id", id)
        .maybeSingle(),
      admin.from("reading_events").select("*").eq("reading_id", id).order("created_at", { ascending: false }),
      admin.from("reading_remedies").select("*").eq("reading_id", id).order("sort_order", { ascending: true }),
      admin.from("reading_messages").select("*").eq("reading_id", id).order("created_at", { ascending: true }),
    ]);

  if (!reading) notFound();
  const r = reading as Reading & { seeker: Profile | null };
  const ev = (events ?? []) as ReadingEvent[];
  const rem = (remedies ?? []) as ReadingRemedy[];
  const msg = (messages ?? []) as ReadingMessage[];

  // Acharyas only see their own; admins see all.
  if (profile.role === "acharya" && r.acharya_id && r.acharya_id !== profile.id) {
    return (
      <div className="text-center py-20">
        <p className="text-brown/60 mb-4">This reading is assigned to another acharya.</p>
        <Link href="/astrologer" className="text-maroon underline underline-offset-4">
          Back to queue
        </Link>
      </div>
    );
  }

  const seeker = r.seeker;
  const lifePath = lifePathNumber(seeker?.dob);
  const expression = expressionNumber(seeker?.full_name);
  const soul = soulUrgeNumber(seeker?.full_name);
  const sign = sunSignFromDob(seeker?.dob);
  const meaning = lifePath ? LIFE_PATH_MEANING[lifePath] : null;

  return (
    <div className="space-y-12">
      <Link
        href="/astrologer"
        className="inline-flex items-center gap-2 text-sm text-brown/60 hover:text-maroon"
      >
        ← Back to queue
      </Link>

      {/* Header */}
      <section className="flex items-start justify-between gap-6 flex-wrap">
        <div>
          <p className="text-xs font-mono text-brown/50 uppercase tracking-[0.2em] mb-3">
            {PLAN_META[r.plan].label} reading
          </p>
          <h1 className="text-3xl md:text-4xl font-display text-brown">
            {seeker?.full_name ?? seeker?.email ?? "Seeker"}
          </h1>
          <p className="text-sm text-brown/60 mt-2">
            {seeker?.email}
            {seeker?.phone ? ` • ${seeker.phone}` : ""}
          </p>
          <div className="mt-4">
            <StatusPill status={r.status} />
          </div>
        </div>

        {r.report_url ? (
          <a
            href={r.report_url}
            target="_blank"
            rel="noopener noreferrer"
            className="h-10 px-5 rounded-full bg-gold/20 text-brown border border-gold/40 text-sm inline-flex items-center"
          >
            View uploaded report ↗
          </a>
        ) : null}
      </section>

      {/* Birth snapshot */}
      <section className="grid md:grid-cols-2 gap-4">
        <div className="rounded-xl bg-white border border-gold/30 p-6">
          <p className="text-xs font-mono text-brown/50 uppercase tracking-wider mb-3">
            Birth details
          </p>
          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <Label>Date of birth</Label>
            <Val>{seeker?.dob ?? "—"}</Val>
            <Label>Time of birth</Label>
            <Val>{seeker?.tob ?? "—"}</Val>
            <Label>Place of birth</Label>
            <Val>{seeker?.birth_place ?? "—"}</Val>
            <Label>Language</Label>
            <Val>{seeker?.language === "hi" ? "हिन्दी" : "English"}</Val>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-amber/15 to-ivory border border-gold/30 p-6">
          <p className="text-xs font-mono text-brown/50 uppercase tracking-wider mb-3">
            Quick numerology &amp; sun sign
          </p>
          <div className="grid grid-cols-4 gap-3 text-center">
            <Num label="Sun" value={sign ? sign.symbol : "—"} sub={sign?.name ?? ""} />
            <Num label="Life Path" value={lifePath ?? "—"} sub={meaning?.keyword ?? ""} />
            <Num label="Expression" value={expression ?? "—"} sub="" />
            <Num label="Soul urge" value={soul ?? "—"} sub="" />
          </div>
          <p className="mt-4 text-[11px] text-brown/45 font-mono">
            Indicative only. Cast the precise kundli and nakshatra yourself.
          </p>
        </div>
      </section>

      {/* Seeker note */}
      {r.seeker_note ? (
        <section className="rounded-xl bg-white border border-gold/30 p-6">
          <p className="text-xs font-mono text-brown/50 uppercase tracking-wider mb-2">
            What the seeker asked about
          </p>
          <p className="text-brown whitespace-pre-wrap">{r.seeker_note}</p>
        </section>
      ) : null}

      {/* Controls: status, summary, report URL, remedies */}
      <ReadingControls reading={r} remedies={rem} />

      {/* Timeline */}
      <section>
        <h2 className="text-xs font-mono text-brown/50 uppercase tracking-wider mb-4">
          Timeline
        </h2>
        <ol className="relative border-l-2 border-gold/30 pl-6 space-y-4">
          {ev.map((e) => (
            <li key={e.id}>
              <span className="absolute -left-[9px] w-3 h-3 rounded-full bg-maroon ring-4 ring-ivory" />
              <p className="text-sm text-brown font-medium">{EVENT_LABEL[e.kind]}</p>
              <p className="text-xs text-brown/55 font-mono">
                {new Date(e.created_at).toLocaleString("en-IN")}
              </p>
            </li>
          ))}
          {ev.length === 0 ? (
            <li className="text-sm text-brown/50">No activity yet.</li>
          ) : null}
        </ol>
      </section>

      {/* Messages thread (acharya side) */}
      <section>
        <h2 className="text-xs font-mono text-brown/50 uppercase tracking-wider mb-4">
          Conversation
        </h2>
        <AcharyaMessages readingId={r.id} myUserId={profile.id} messages={msg} />
      </section>
    </div>
  );
}

function StatusPill({ status }: { status: Reading["status"] }) {
  const tone =
    status === "delivered"
      ? "bg-[#E9F3EC] text-[#2F6A3E]"
      : status === "cancelled"
        ? "bg-maroon/10 text-maroon"
        : status === "in_review"
          ? "bg-gold/20 text-brown"
          : "bg-amber/25 text-brown";
  return (
    <span className={`text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded ${tone}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <span className="text-brown/50">{children}</span>;
}
function Val({ children }: { children: React.ReactNode }) {
  return <span className="text-brown font-mono">{children}</span>;
}
function Num({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub: string;
}) {
  return (
    <div className="rounded-lg bg-white/70 p-3">
      <p className="text-[9px] font-mono text-brown/50 uppercase tracking-wider">
        {label}
      </p>
      <p className="text-2xl font-display text-brown leading-none mt-1">{value}</p>
      {sub ? <p className="text-[10px] text-brown/55 mt-1">{sub}</p> : null}
    </div>
  );
}

