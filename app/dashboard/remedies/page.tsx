import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  type Reading,
  type ReadingRemedy,
  type RemedyCategory,
  PLAN_META,
  REMEDY_LABEL,
} from "@/lib/supabase/types";
import { timeAgo } from "@/lib/reading-helpers";
import { weekdayInfo } from "@/lib/panchang";

const CATEGORY_ORDER: RemedyCategory[] = [
  "mantra",
  "practice",
  "gemstone",
  "ritual",
  "charity",
];

type RemedyWithReading = ReadingRemedy & {
  readings: Pick<Reading, "id" | "plan" | "status" | "delivered_at" | "acharya_name"> | null;
};

export default async function RemediesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("reading_remedies")
    .select(
      "*, readings!inner(id, plan, status, delivered_at, acharya_name, user_id)",
    )
    .eq("readings.user_id", user.id)
    .eq("readings.status", "delivered")
    .order("sort_order", { ascending: true });

  const remedies = (data ?? []) as RemedyWithReading[];

  // Group by category
  const byCategory = new Map<RemedyCategory, RemedyWithReading[]>();
  for (const r of remedies) {
    const arr = byCategory.get(r.category) ?? [];
    arr.push(r);
    byCategory.set(r.category, arr);
  }

  const totalByCategory = CATEGORY_ORDER.map((c) => ({
    category: c,
    count: byCategory.get(c)?.length ?? 0,
  }));

  const wd = weekdayInfo(new Date());

  return (
    <div className="space-y-10">
      {/* Header */}
      <section className="rounded-2xl bg-gradient-to-br from-amber/20 via-ivory to-gold/15 border border-gold/30 p-6 md:p-10">
        <p className="text-xs font-mono text-brown/60 uppercase tracking-[0.2em] mb-2">
          Your remedies
        </p>
        <h1 className="text-3xl md:text-5xl font-display text-brown leading-tight">
          Practices prescribed for you.
        </h1>
        <p className="mt-3 text-brown/70 max-w-xl">
          Everything your acharyas have recommended across your delivered
          readings — gathered in one place so nothing slips.
        </p>
      </section>

      {/* Today's suggestion */}
      <section className="rounded-2xl bg-white border border-gold/30 p-5 md:p-6">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-mono text-brown/50 uppercase tracking-wider mb-1">
              A gentle reminder for {wd.name}
            </p>
            <p className="text-lg font-display text-brown">
              Chant {wd.mantra}
            </p>
            <p className="text-sm text-brown/60 mt-1">
              Ruled by {wd.planet}. 108 repetitions in the Brahma Muhurat is
              traditional; any time of quiet works.
            </p>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-amber/25 text-brown">
            Daily practice
          </span>
        </div>
      </section>

      {/* Category summary */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {totalByCategory.map((t) => (
          <div
            key={t.category}
            className="rounded-xl bg-white border border-gold/30 p-4 text-center"
          >
            <p className="text-[10px] font-mono text-brown/50 uppercase tracking-wider">
              {REMEDY_LABEL[t.category]}
            </p>
            <p className="text-3xl font-display text-brown leading-none mt-2">
              {t.count}
            </p>
          </div>
        ))}
      </section>

      {/* Remedy groups */}
      {remedies.length === 0 ? (
        <section className="rounded-xl bg-white border border-gold/30 p-10 text-center">
          <p className="text-brown/70 mb-4">
            No remedies yet. They&rsquo;re assigned by your acharya as part of a
            Signature or Legacy reading.
          </p>
          <Link
            href="/dashboard/book?plan=signature"
            className="inline-flex items-center h-11 px-6 rounded-full bg-maroon text-ivory hover:bg-maroon/90"
          >
            Book Signature
          </Link>
        </section>
      ) : (
        CATEGORY_ORDER.filter((c) => (byCategory.get(c) ?? []).length > 0).map(
          (cat) => (
            <section key={cat}>
              <div className="flex items-baseline justify-between mb-3">
                <p className="text-xs font-mono text-brown/50 uppercase tracking-wider">
                  {REMEDY_LABEL[cat]}
                </p>
                <p className="text-xs font-mono text-brown/45">
                  {byCategory.get(cat)!.length}{" "}
                  {byCategory.get(cat)!.length === 1 ? "item" : "items"}
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {byCategory.get(cat)!.map((re) => (
                  <RemedyCard key={re.id} remedy={re} />
                ))}
              </div>
            </section>
          ),
        )
      )}
    </div>
  );
}

function RemedyCard({ remedy: re }: { remedy: RemedyWithReading }) {
  const reading = re.readings;
  return (
    <div className="rounded-xl bg-white border border-gold/30 p-5">
      <div className="flex items-start justify-between gap-3 mb-2">
        <p className="text-base font-medium text-brown">{re.title}</p>
        <span className="text-gold text-sm shrink-0" aria-hidden>
          ◆
        </span>
      </div>
      {re.detail ? (
        <p className="text-sm text-brown/65 whitespace-pre-wrap leading-relaxed">
          {re.detail}
        </p>
      ) : null}
      {reading ? (
        <Link
          href={`/dashboard/readings/${reading.id}`}
          className="mt-4 inline-flex items-center gap-2 text-xs font-mono text-brown/55 hover:text-maroon"
        >
          From {PLAN_META[reading.plan].label}
          {reading.acharya_name ? ` · ${reading.acharya_name}` : ""}
          {reading.delivered_at
            ? ` · ${timeAgo(reading.delivered_at)}`
            : ""}
          <span>→</span>
        </Link>
      ) : null}
    </div>
  );
}
