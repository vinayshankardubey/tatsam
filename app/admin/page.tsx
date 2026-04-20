import Link from "next/link";
import { requireRole } from "@/lib/supabase/require-role";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  type Reading,
  type Profile,
  PLAN_META,
  STATUS_LABEL,
} from "@/lib/supabase/types";
import { ReadingsOverTimeChart, PlanBreakdownChart } from "./readings-chart";
import { timeAgo } from "@/lib/reading-helpers";

const RANGES = { "7": 7, "30": 30, "90": 90 } as const;
type Range = keyof typeof RANGES;

export default async function AdminOverviewPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  await requireRole("admin");
  const admin = createAdminClient();
  const { range } = await searchParams;
  const days = RANGES[(range as Range) ?? "30"] ?? 30;

  const [{ data: profiles }, { data: readings }, { data: acharyaStats }] =
    await Promise.all([
      admin.from("profiles").select("*").order("created_at", { ascending: false }),
      admin.from("readings").select("*").order("created_at", { ascending: false }),
      admin
        .from("profiles")
        .select("id, full_name, role")
        .eq("role", "acharya"),
    ]);

  const ps = (profiles ?? []) as Profile[];
  const rs = (readings ?? []) as Reading[];
  const acharyas = (acharyaStats ?? []) as Pick<Profile, "id" | "full_name" | "role">[];

  const seekers = ps.filter((p) => p.role === "seeker").length;
  const totalReadings = rs.length;
  const delivered = rs.filter((r) => r.status === "delivered");
  const revenue = rs
    .filter((r) => r.status === "delivered")
    .reduce((acc, r) => acc + (r.price_inr ?? 0), 0);

  // Avg time-to-deliver across all delivered readings (hours).
  const avgDeliverHours = (() => {
    const hs = delivered
      .filter((r) => r.delivered_at)
      .map(
        (r) =>
          (new Date(r.delivered_at!).getTime() - new Date(r.created_at).getTime()) /
          3_600_000,
      );
    if (hs.length === 0) return null;
    return Math.round(hs.reduce((a, b) => a + b, 0) / hs.length);
  })();

  // Status funnel
  const funnel = {
    pending: rs.filter((r) => r.status === "pending").length,
    in_review: rs.filter((r) => r.status === "in_review").length,
    delivered: delivered.length,
    cancelled: rs.filter((r) => r.status === "cancelled").length,
  };

  // Readings per day over selected range.
  const bucket: Array<{ date: string; count: number }> = [];
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    bucket.push({ date: d.toISOString().slice(0, 10), count: 0 });
  }
  const dayIdx = new Map(bucket.map((d, i) => [d.date, i]));
  for (const r of rs) {
    const key = r.created_at.slice(0, 10);
    const i = dayIdx.get(key);
    if (i !== undefined) bucket[i].count += 1;
  }

  // Plan mix (overall, not range-bound — more stable signal)
  const planMix = (["darshan", "signature", "legacy"] as const).map((p) => ({
    name: PLAN_META[p].label,
    value: rs.filter((r) => r.plan === p).length,
  }));

  // Acharya leaderboard
  const acharyaPerf = acharyas
    .map((a) => {
      const assigned = rs.filter((r) => r.acharya_id === a.id);
      const deliveredByA = assigned.filter((r) => r.status === "delivered").length;
      const rev = assigned
        .filter((r) => r.status === "delivered")
        .reduce((acc, r) => acc + (r.price_inr ?? 0), 0);
      return {
        id: a.id,
        name: a.full_name ?? "—",
        assigned: assigned.length,
        delivered: deliveredByA,
        revenue: rev,
      };
    })
    .sort((a, b) => b.delivered - a.delivered);

  return (
    <div className="space-y-14">
      <section className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <p className="text-xs font-mono text-brown/50 uppercase tracking-[0.2em] mb-3">
            Overview
          </p>
          <h1 className="text-4xl md:text-5xl font-display text-brown leading-tight">
            Tatsam at a glance.
          </h1>
        </div>

        <RangeToggle current={String(days)} />
      </section>

      {/* Stat cards */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Stat label="Seekers" value={seekers.toLocaleString("en-IN")} tone="brown" />
        <Stat label="Readings" value={totalReadings.toLocaleString("en-IN")} tone="maroon" />
        <Stat label="Delivered" value={delivered.length.toLocaleString("en-IN")} tone="gold" />
        <Stat
          label="Revenue (delivered)"
          value={`₹${revenue.toLocaleString("en-IN")}`}
          tone="amber"
        />
        <Stat
          label="Avg time to deliver"
          value={avgDeliverHours == null ? "—" : hoursPretty(avgDeliverHours)}
          tone="brown"
        />
      </section>

      {/* Charts */}
      <section className="grid lg:grid-cols-[2fr_1fr] gap-4">
        <ReadingsOverTimeChart data={bucket} rangeLabel={`${days} days`} />
        <PlanBreakdownChart data={planMix} />
      </section>

      {/* Status funnel */}
      <section>
        <p className="text-xs font-mono text-brown/50 uppercase tracking-wider mb-4">
          Status funnel
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <FunnelCell label={STATUS_LABEL.pending} value={funnel.pending} total={totalReadings} />
          <FunnelCell label={STATUS_LABEL.in_review} value={funnel.in_review} total={totalReadings} />
          <FunnelCell label={STATUS_LABEL.delivered} value={funnel.delivered} total={totalReadings} />
          <FunnelCell label={STATUS_LABEL.cancelled} value={funnel.cancelled} total={totalReadings} />
        </div>
      </section>

      {/* Acharya performance */}
      <section>
        <div className="flex items-end justify-between mb-4">
          <p className="text-xs font-mono text-brown/50 uppercase tracking-wider">
            Acharya performance
          </p>
          <Link href="/admin/users" className="text-sm text-maroon hover:underline">
            Manage users →
          </Link>
        </div>
        <div className="rounded-xl bg-white border border-gold/30 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-amber/10 text-brown/60 text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left font-mono font-normal px-5 py-3">Acharya</th>
                <th className="text-right font-mono font-normal px-5 py-3">Assigned</th>
                <th className="text-right font-mono font-normal px-5 py-3">Delivered</th>
                <th className="text-right font-mono font-normal px-5 py-3">Conversion</th>
                <th className="text-right font-mono font-normal px-5 py-3">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {acharyaPerf.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-6 text-center text-brown/55">
                    No acharyas yet.
                  </td>
                </tr>
              ) : (
                acharyaPerf.map((a) => (
                  <tr key={a.id} className="border-t border-gold/20">
                    <td className="px-5 py-3 text-brown">{a.name}</td>
                    <td className="px-5 py-3 text-right text-brown/70">{a.assigned}</td>
                    <td className="px-5 py-3 text-right text-brown/70">{a.delivered}</td>
                    <td className="px-5 py-3 text-right text-brown/70">
                      {a.assigned
                        ? `${Math.round((a.delivered / a.assigned) * 100)}%`
                        : "—"}
                    </td>
                    <td className="px-5 py-3 text-right text-brown/70">
                      {a.revenue ? `₹${a.revenue.toLocaleString("en-IN")}` : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Recent readings shortcut */}
      <section>
        <div className="flex items-end justify-between mb-4">
          <p className="text-xs font-mono text-brown/50 uppercase tracking-wider">
            Recent readings
          </p>
          <Link href="/admin/readings" className="text-sm text-maroon hover:underline">
            All readings →
          </Link>
        </div>
        <div className="grid gap-3">
          {rs.slice(0, 5).map((r) => (
            <Link
              key={r.id}
              href={`/astrologer/readings/${r.id}`}
              className="flex items-center justify-between gap-4 p-4 rounded-xl bg-white border border-gold/30 hover:border-maroon/50 transition-colors"
            >
              <div className="min-w-0">
                <p className="text-brown">
                  {PLAN_META[r.plan].label} · {r.acharya_name ?? "Unassigned"}
                </p>
                <p className="text-xs text-brown/55">
                  {STATUS_LABEL[r.status]} · {timeAgo(r.created_at)}
                </p>
              </div>
              <span className="text-brown/40">→</span>
            </Link>
          ))}
          {rs.length === 0 ? (
            <div className="rounded-xl bg-white border border-gold/30 p-10 text-center text-brown/55">
              No readings yet.
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function RangeToggle({ current }: { current: string }) {
  const options: Array<{ value: Range; label: string }> = [
    { value: "7", label: "7d" },
    { value: "30", label: "30d" },
    { value: "90", label: "90d" },
  ];
  return (
    <div className="flex items-center gap-1 bg-white border border-gold/30 rounded-full p-1">
      {options.map((o) => {
        const active = current === String(RANGES[o.value]);
        return (
          <Link
            key={o.value}
            href={`/admin?range=${o.value}`}
            className={`text-xs px-3 h-7 inline-flex items-center rounded-full ${
              active ? "bg-maroon text-ivory" : "text-brown/70 hover:text-brown"
            }`}
          >
            {o.label}
          </Link>
        );
      })}
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

function FunnelCell({ label, value, total }: { label: string; value: number; total: number }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="rounded-xl bg-white border border-gold/30 p-5">
      <p className="text-[10px] font-mono text-brown/50 uppercase tracking-wider">
        {label}
      </p>
      <div className="flex items-baseline gap-2 mt-1">
        <span className="text-3xl font-display text-brown">{value}</span>
        <span className="text-xs text-brown/50">{pct}%</span>
      </div>
      <div className="mt-3 h-1.5 rounded-full bg-gold/20 overflow-hidden">
        <div
          className="h-full bg-maroon"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
