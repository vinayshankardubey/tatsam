import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  type Reading,
  PLAN_META,
  STATUS_LABEL,
} from "@/lib/supabase/types";
import {
  STAGE_ORDER,
  STAGE_LABEL,
  stageIndex,
  timeAgo,
} from "@/lib/reading-helpers";

export default async function ReadingsIndexPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: readings }, { data: repliesRaw }] = await Promise.all([
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

  const list = (readings ?? []) as Reading[];
  const active = list.filter(
    (r) => r.status !== "delivered" && r.status !== "cancelled",
  );
  const delivered = list.filter((r) => r.status === "delivered");
  const cancelled = list.filter((r) => r.status === "cancelled");

  const replyCounts = new Map<string, number>();
  for (const m of (repliesRaw ?? []) as { reading_id: string }[]) {
    replyCounts.set(m.reading_id, (replyCounts.get(m.reading_id) ?? 0) + 1);
  }

  return (
    <div className="space-y-12">
      <section className="flex items-start justify-between gap-6 flex-wrap">
        <div>
          <p className="text-xs font-mono text-brown/50 uppercase tracking-[0.2em] mb-3">
            Your readings
          </p>
          <h1 className="text-4xl md:text-5xl font-display text-brown leading-tight">
            Every chart cast for you.
          </h1>
          <p className="mt-3 text-brown/60 max-w-xl">
            {list.length > 0
              ? `${list.length} reading${list.length === 1 ? "" : "s"} in all.`
              : "Start your first reading whenever you&rsquo;re ready."}
          </p>
        </div>
        <Link
          href="/dashboard/book"
          className="inline-flex items-center h-11 px-6 rounded-full bg-maroon text-ivory hover:bg-maroon/90 shrink-0"
        >
          Book a reading
        </Link>
      </section>

      {active.length > 0 ? (
        <ReadingGroup
          title="In progress"
          readings={active}
          replyCounts={replyCounts}
          showStages
        />
      ) : null}

      {delivered.length > 0 ? (
        <ReadingGroup
          title="Delivered"
          readings={delivered}
          replyCounts={replyCounts}
        />
      ) : null}

      {cancelled.length > 0 ? (
        <ReadingGroup
          title="Cancelled"
          readings={cancelled}
          replyCounts={replyCounts}
        />
      ) : null}

      {list.length === 0 ? (
        <div className="rounded-xl bg-white border border-gold/30 p-10 text-center">
          <p className="text-brown/70 mb-4">
            No readings yet. Pick a plan and a Tatsam acharya will read your
            chart by hand.
          </p>
          <Link
            href="/dashboard/book"
            className="inline-flex items-center h-11 px-6 rounded-full bg-maroon text-ivory hover:bg-maroon/90"
          >
            Book your first reading
          </Link>
        </div>
      ) : null}
    </div>
  );
}

function ReadingGroup({
  title,
  readings,
  replyCounts,
  showStages,
}: {
  title: string;
  readings: Reading[];
  replyCounts: Map<string, number>;
  showStages?: boolean;
}) {
  return (
    <section>
      <p className="text-xs font-mono text-brown/50 uppercase tracking-wider mb-4">
        {title} · {readings.length}
      </p>
      <div className="grid gap-4">
        {readings.map((r) => (
          <ReadingCard
            key={r.id}
            reading={r}
            replyCount={replyCounts.get(r.id) ?? 0}
            showStages={showStages}
          />
        ))}
      </div>
    </section>
  );
}

function ReadingCard({
  reading: r,
  replyCount,
  showStages,
}: {
  reading: Reading;
  replyCount: number;
  showStages?: boolean;
}) {
  const activeIdx = stageIndex(r.status);
  const cancelled = r.status === "cancelled";
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
            <StatusPill status={r.status} />
            {replyCount > 0 ? (
              <span className="text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded bg-maroon text-ivory">
                {replyCount} {replyCount === 1 ? "reply" : "replies"}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-brown/60 truncate">
            Requested {timeAgo(r.created_at)}
            {r.acharya_name ? ` • ${r.acharya_name}` : ""}
            {r.report_url ? " • Report ready" : ""}
          </p>
        </div>
        <span className="text-brown/40 group-hover:text-maroon transition-colors shrink-0">
          →
        </span>
      </div>

      {showStages && !cancelled ? (
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
      ) : null}
    </Link>
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
    <span
      className={`text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded ${tone}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
