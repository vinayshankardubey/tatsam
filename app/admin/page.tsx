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

export default async function AdminOverviewPage() {
  await requireRole("admin");
  const admin = createAdminClient();

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

  // Status funnel
  const funnel = {
    pending: rs.filter((r) => r.status === "pending").length,
    in_review: rs.filter((r) => r.status === "in_review").length,
    delivered: delivered.length,
    cancelled: rs.filter((r) => r.status === "cancelled").length,
  };

  // Readings over the last 30 days
  const days: Array<{ date: string; count: number }> = [];
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    days.push({ date: iso, count: 0 });
  }
  const dayIdx = new Map(days.map((d, i) => [d.date, i]));
  for (const r of rs) {
    const key = r.created_at.slice(0, 10);
    const i = dayIdx.get(key);
    if (i !== undefined) days[i].count += 1;
  }

  // Plan mix
  const planMix = (["darshan", "signature", "legacy"] as const).map((p) => ({
    name: PLAN_META[p].label,
    value: rs.filter((r) => r.plan === p).length,
  }));

  // Acharya leaderboard
  const acharyaPerf = acharyas
    .map((a) => {
      const assigned = rs.filter((r) => r.acharya_id === a.id);
      const deliveredByA = assigned.filter((r) => r.status === "delivered").length;
      return {
        id: a.id,
        name: a.full_name ?? "—",
        assigned: assigned.length,
        delivered: deliveredByA,
      };
    })
    .sort((a, b) => b.delivered - a.delivered);

  return (
    <div className="space-y-14">
      <section>
        <p className="text-xs font-mono text-brown/50 uppercase tracking-[0.2em] mb-3">
          Overview
        </p>
        <h1 className="text-4xl md:text-5xl font-display text-brown leading-tight">
          Tatsam at a glance.
        </h1>
      </section>

      {/* Stat cards */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Seekers" value={seekers.toLocaleString("en-IN")} tone="brown" />
        <Stat label="Readings" value={totalReadings.toLocaleString("en-IN")} tone="maroon" />
        <Stat label="Delivered" value={delivered.length.toLocaleString("en-IN")} tone="gold" />
        <Stat
          label="Revenue (delivered)"
          value={`₹${revenue.toLocaleString("en-IN")}`}
          tone="amber"
        />
      </section>

      {/* Charts */}
      <section className="grid lg:grid-cols-[2fr_1fr] gap-4">
        <ReadingsOverTimeChart data={days} />
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
              </tr>
            </thead>
            <tbody>
              {acharyaPerf.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-6 text-center text-brown/55">
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
              href={`/admin/readings?highlight=${r.id}`}
              className="flex items-center justify-between gap-4 p-4 rounded-xl bg-white border border-gold/30 hover:border-maroon/50 transition-colors"
            >
              <div className="min-w-0">
                <p className="text-brown">
                  {PLAN_META[r.plan].label} · {r.acharya_name ?? "Unassigned"}
                </p>
                <p className="text-xs text-brown/55">
                  {STATUS_LABEL[r.status]} · {formatDate(r.created_at)}
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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
