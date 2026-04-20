import Link from "next/link";
import { requireRole } from "@/lib/supabase/require-role";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  type Reading,
  type Profile,
  PLAN_META,
  STATUS_LABEL,
} from "@/lib/supabase/types";
import { ClaimButton } from "./claim-button";
import { timeAgo, timeInState } from "@/lib/reading-helpers";

type ReadingWithSeeker = Reading & { seeker: Pick<Profile, "id" | "full_name" | "email"> | null };

export default async function AstrologerPage() {
  const { profile } = await requireRole("acharya");
  const admin = createAdminClient();

  const [{ data: queue }, { data: mine }, { data: unreadRaw }] = await Promise.all([
    admin
      .from("readings")
      .select("*, seeker:profiles!readings_seeker_profile_fk(id, full_name, email)")
      .is("acharya_id", null)
      .in("status", ["pending"])
      .order("created_at", { ascending: true }),
    admin
      .from("readings")
      .select("*, seeker:profiles!readings_seeker_profile_fk(id, full_name, email)")
      .eq("acharya_id", profile.id)
      .order("created_at", { ascending: false }),
    // Messages from the seeker (not from this acharya) across this acharya's readings.
    admin
      .from("reading_messages")
      .select("reading_id, sender_id, readings!inner(acharya_id)")
      .eq("readings.acharya_id", profile.id)
      .neq("sender_id", profile.id),
  ]);

  const queueList = (queue ?? []) as ReadingWithSeeker[];
  const mineList = (mine ?? []) as ReadingWithSeeker[];

  const active = mineList.filter((r) => r.status !== "delivered" && r.status !== "cancelled");
  const delivered = mineList.filter((r) => r.status === "delivered");

  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
  const deliveredToday = mineList.filter(
    (r) => r.delivered_at && new Date(r.delivered_at) >= todayStart,
  ).length;

  // Avg delivery time (created → delivered) across this acharya's delivered readings.
  const avgDeliverHours = (() => {
    if (delivered.length === 0) return null;
    const hours = delivered
      .filter((r) => r.delivered_at)
      .map(
        (r) =>
          (new Date(r.delivered_at!).getTime() - new Date(r.created_at).getTime()) /
          3_600_000,
      );
    if (hours.length === 0) return null;
    return Math.round(hours.reduce((a, b) => a + b, 0) / hours.length);
  })();

  // Unread messages map
  const unread = new Map<string, number>();
  for (const m of (unreadRaw ?? []) as { reading_id: string }[]) {
    unread.set(m.reading_id, (unread.get(m.reading_id) ?? 0) + 1);
  }

  return (
    <div className="space-y-14">
      <section>
        <p className="text-xs font-mono text-brown/50 uppercase tracking-[0.2em] mb-3">
          Acharya console
        </p>
        <h1 className="text-4xl md:text-5xl font-display text-brown leading-tight">
          Your reading queue.
        </h1>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Stat label="In the open queue" value={String(queueList.length)} tone="maroon" />
        <Stat label="Assigned to you" value={String(active.length)} tone="gold" />
        <Stat label="Delivered by you" value={String(delivered.length)} tone="brown" />
        <Stat label="Delivered today" value={String(deliveredToday)} tone="amber" />
        <Stat
          label="Avg turnaround"
          value={avgDeliverHours == null ? "—" : hoursPretty(avgDeliverHours)}
          tone="brown"
        />
      </section>

      <section>
        <h2 className="text-xs font-mono text-brown/50 uppercase tracking-wider mb-4">
          Open queue — oldest first
        </h2>
        {queueList.length === 0 ? (
          <div className="rounded-xl bg-white border border-gold/30 p-10 text-center text-brown/60">
            No unclaimed readings right now. Beautiful quiet.
          </div>
        ) : (
          <div className="grid gap-3">
            {queueList.map((r) => {
              const waiting = timeInState(r.created_at);
              const ageHours =
                (Date.now() - new Date(r.created_at).getTime()) / 3_600_000;
              const urgent = ageHours >= 24;
              return (
                <div
                  key={r.id}
                  className={`flex items-center justify-between gap-4 p-5 rounded-xl bg-white border ${
                    urgent ? "border-maroon/40" : "border-gold/30"
                  }`}
                >
                  <Link href={`/astrologer/readings/${r.id}`} className="flex-1 min-w-0">
                    <p className="font-display text-lg text-brown flex items-center gap-2 flex-wrap">
                      {PLAN_META[r.plan].label} · {r.seeker?.full_name ?? r.seeker?.email ?? "New seeker"}
                      <span
                        className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded ${
                          urgent
                            ? "bg-maroon text-ivory"
                            : "bg-amber/25 text-brown"
                        }`}
                      >
                        waiting {waiting}
                      </span>
                    </p>
                    <p className="text-xs text-brown/55 mt-0.5 truncate">
                      Requested {timeAgo(r.created_at)}
                      {r.seeker_note ? ` · "${r.seeker_note.slice(0, 80)}${r.seeker_note.length > 80 ? "…" : ""}"` : ""}
                    </p>
                  </Link>
                  <ClaimButton readingId={r.id} />
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xs font-mono text-brown/50 uppercase tracking-wider mb-4">
          Your active readings
        </h2>
        {active.length === 0 ? (
          <div className="rounded-xl bg-white border border-gold/30 p-10 text-center text-brown/60">
            Nothing active. Claim one from the queue above.
          </div>
        ) : (
          <div className="grid gap-3">
            {active.map((r) => {
              const unreadN = unread.get(r.id) ?? 0;
              return (
                <Link
                  key={r.id}
                  href={`/astrologer/readings/${r.id}`}
                  className="flex items-center justify-between gap-4 p-5 rounded-xl bg-white border border-gold/30 hover:border-maroon/50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-display text-lg text-brown flex items-center gap-2 flex-wrap">
                      {PLAN_META[r.plan].label} · {r.seeker?.full_name ?? r.seeker?.email ?? "Seeker"}
                      {unreadN > 0 ? (
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-maroon text-ivory">
                          {unreadN} new {unreadN === 1 ? "message" : "messages"}
                        </span>
                      ) : null}
                    </p>
                    <p className="text-xs text-brown/55 mt-0.5">
                      {STATUS_LABEL[r.status]} · in this state {timeInState(r.updated_at)}
                    </p>
                  </div>
                  <span className="text-brown/40">→</span>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {delivered.length > 0 ? (
        <section>
          <h2 className="text-xs font-mono text-brown/50 uppercase tracking-wider mb-4">
            Delivered by you
          </h2>
          <div className="grid gap-3">
            {delivered.map((r) => (
              <Link
                key={r.id}
                href={`/astrologer/readings/${r.id}`}
                className="flex items-center justify-between gap-4 p-4 rounded-xl bg-white border border-gold/20 hover:border-maroon/40 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-brown">
                    {PLAN_META[r.plan].label} · {r.seeker?.full_name ?? r.seeker?.email ?? "Seeker"}
                  </p>
                  <p className="text-xs text-brown/50">
                    Delivered {r.delivered_at ? timeAgo(r.delivered_at) : "—"}
                  </p>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#2F6A3E]">
                  Delivered
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function hoursPretty(h: number): string {
  if (h < 24) return `${h}h`;
  return `${Math.round(h / 24)}d`;
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "maroon" | "gold" | "brown" | "amber";
}) {
  const color =
    tone === "maroon"
      ? "text-maroon"
      : tone === "gold"
        ? "text-gold"
        : tone === "amber"
          ? "text-[#B8841A]"
          : "text-brown";
  return (
    <div className="rounded-xl bg-white border border-gold/30 p-5">
      <p className="text-xs font-mono text-brown/50 uppercase tracking-wider">
        {label}
      </p>
      <p className={`mt-2 text-3xl md:text-4xl font-display leading-none ${color}`}>
        {value}
      </p>
    </div>
  );
}
