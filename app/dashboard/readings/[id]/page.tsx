import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/current-user";
import {
  type Reading,
  type ReadingEvent,
  type ReadingRemedy,
  type ReadingMessage,
  PLAN_META,
  STATUS_LABEL,
  REMEDY_LABEL,
  EVENT_LABEL,
} from "@/lib/supabase/types";
import { MessageThread } from "./message-thread";
import { STAGE_ORDER, STAGE_LABEL, stageIndex, timeAgo } from "@/lib/reading-helpers";

export default async function ReadingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return null;
  const supabase = await createClient();

  const [{ data: reading }, { data: events }, { data: remedies }, { data: messages }] =
    await Promise.all([
      supabase.from("readings").select("*").eq("id", id).maybeSingle(),
      supabase
        .from("reading_events")
        .select("*")
        .eq("reading_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from("reading_remedies")
        .select("*")
        .eq("reading_id", id)
        .order("sort_order", { ascending: true }),
      supabase
        .from("reading_messages")
        .select("*")
        .eq("reading_id", id)
        .order("created_at", { ascending: true }),
    ]);

  if (!reading) notFound();
  const r = reading as Reading;
  const ev = (events ?? []) as ReadingEvent[];
  const rem = (remedies ?? []) as ReadingRemedy[];
  const msg = (messages ?? []) as ReadingMessage[];

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-brown/60 hover:text-maroon mb-8"
      >
        ← Back to dashboard
      </Link>

      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-6 flex-wrap">
        <div>
          <p className="text-xs font-mono text-brown/50 uppercase tracking-[0.2em] mb-3">
            Reading
          </p>
          <h1 className="text-3xl md:text-4xl font-display text-brown">
            {PLAN_META[r.plan].label}
          </h1>
          <div className="mt-4 flex items-center gap-3 flex-wrap">
            <StatusPill status={r.status} />
            <span className="text-sm text-brown/60">
              Requested {timeAgo(r.created_at)}
            </span>
            {r.delivered_at ? (
              <span className="text-sm text-brown/60">
                • Delivered {timeAgo(r.delivered_at)}
              </span>
            ) : null}
          </div>
        </div>

        {/* Report download CTA */}
        {r.report_url ? (
          <a
            href={r.report_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-maroon text-ivory text-sm hover:bg-maroon/90"
          >
            Download report (PDF) ↗
          </a>
        ) : null}
      </div>

      {/* Stage tracker */}
      {r.status !== "cancelled" ? (
        <section className="mb-12 rounded-xl bg-white border border-gold/30 p-5 md:p-6">
          <div className="flex items-center gap-2">
            {STAGE_ORDER.map((s, i) => {
              const active = stageIndex(r.status);
              const done = i < active;
              const here = i === active;
              return (
                <div key={s} className="flex items-center gap-2 flex-1">
                  <span
                    className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-mono shrink-0 ${
                      done
                        ? "bg-gold text-ivory"
                        : here
                          ? "bg-maroon text-ivory"
                          : "bg-gold/15 text-brown/50"
                    }`}
                  >
                    {done ? "✓" : i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs font-mono uppercase tracking-wider ${
                        here ? "text-brown" : done ? "text-brown/60" : "text-brown/40"
                      }`}
                    >
                      {STAGE_LABEL[s]}
                    </p>
                  </div>
                  {i < STAGE_ORDER.length - 1 ? (
                    <span
                      className={`flex-1 h-0.5 ${
                        done || here ? "bg-gold" : "bg-gold/20"
                      }`}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      {/* Summary from acharya */}
      {r.acharya_summary ? (
        <section className="mb-10 rounded-xl bg-gradient-to-br from-amber/15 to-ivory border border-gold/30 p-6 md:p-8">
          <p className="text-xs font-mono text-brown/50 uppercase tracking-wider mb-2">
            A note from your acharya
          </p>
          <p className="text-brown leading-relaxed whitespace-pre-wrap">
            {r.acharya_summary}
          </p>
          {r.acharya_name ? (
            <p className="mt-4 text-sm text-brown/60">— {r.acharya_name}</p>
          ) : null}
        </section>
      ) : null}

      {/* Details grid */}
      <section className="mb-12">
        <h2 className="text-sm font-mono text-brown/50 uppercase tracking-wider mb-4">
          Details
        </h2>
        <div className="grid gap-1 rounded-xl bg-white border border-gold/30 px-6 divide-y divide-gold/20">
          <Row label="Plan">
            {PLAN_META[r.plan].label}
            {r.price_inr != null ? ` · ₹${r.price_inr}` : " · Custom pricing"}
          </Row>
          <Row label="Assigned acharya">
            {r.acharya_name ?? (
              <span className="text-brown/50">
                Will be assigned within 24 hours
              </span>
            )}
          </Row>
          {r.seeker_note ? (
            <Row label="Your note to the acharya">
              <span className="whitespace-pre-wrap">{r.seeker_note}</span>
            </Row>
          ) : null}
          <Row label="Report">
            {r.report_url ? (
              <a
                href={r.report_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-maroon underline underline-offset-4 hover:no-underline"
              >
                Download PDF
              </a>
            ) : (
              <span className="text-brown/50">Not yet delivered</span>
            )}
          </Row>
        </div>
      </section>

      {/* Remedies */}
      {rem.length > 0 ? (
        <section className="mb-12">
          <h2 className="text-sm font-mono text-brown/50 uppercase tracking-wider mb-4">
            Prescribed remedies
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {rem.map((re) => (
              <div
                key={re.id}
                className="rounded-xl bg-white border border-gold/30 p-5"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-brown/50 uppercase tracking-wider">
                    {REMEDY_LABEL[re.category]}
                  </span>
                  <span className="text-gold text-sm" aria-hidden>◆</span>
                </div>
                <h3 className="text-base font-medium text-brown">{re.title}</h3>
                {re.detail ? (
                  <p className="mt-2 text-sm text-brown/65 whitespace-pre-wrap">
                    {re.detail}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Timeline */}
      <section className="mb-12">
        <h2 className="text-sm font-mono text-brown/50 uppercase tracking-wider mb-4">
          Timeline
        </h2>
        <ol className="relative border-l-2 border-gold/30 pl-6 space-y-6">
          {ev.length === 0 ? (
            <li className="text-sm text-brown/50">No activity yet.</li>
          ) : (
            ev.map((e) => (
              <li key={e.id} className="relative">
                <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-maroon ring-4 ring-ivory" />
                <p className="text-sm text-brown font-medium">
                  {EVENT_LABEL[e.kind]}
                </p>
                <p className="text-xs text-brown/55 font-mono">
                  {formatDateTime(e.created_at)}
                </p>
                {describeEvent(e) ? (
                  <p className="text-sm text-brown/70 mt-1">{describeEvent(e)}</p>
                ) : null}
              </li>
            ))
          )}
        </ol>
      </section>

      {/* Messages */}
      <section>
        <h2 className="text-sm font-mono text-brown/50 uppercase tracking-wider mb-4">
          Conversation with your acharya
        </h2>
        <MessageThread
          readingId={r.id}
          myUserId={user.id}
          acharyaId={r.acharya_id}
          acharyaName={r.acharya_name}
          initialMessages={msg}
        />
      </section>

      {r.status === "pending" ? (
        <div className="mt-10 rounded-xl bg-amber/10 border border-gold/30 p-6 text-sm text-brown/70">
          Your request has reached us. An acharya will be assigned shortly and
          you&rsquo;ll hear back over email once your reading is underway.
        </div>
      ) : null}
    </div>
  );
}

function describeEvent(e: ReadingEvent): string | null {
  const p = e.payload ?? {};
  if (e.kind === "status_change" && p.from && p.to) {
    return `${STATUS_LABEL[p.from as Reading["status"]]} → ${STATUS_LABEL[
      p.to as Reading["status"]
    ]}`;
  }
  if (e.kind === "report_uploaded" && typeof p.url === "string") {
    return "Your report is now ready to download.";
  }
  if (e.kind === "assigned") return "An acharya has taken up your reading.";
  return null;
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[160px_1fr] gap-4 py-4">
      <span className="text-xs font-mono text-brown/50 uppercase tracking-wider pt-1">
        {label}
      </span>
      <div className="text-brown">{children}</div>
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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
