import Link from "next/link";
import { requireRole } from "@/lib/supabase/require-role";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  type Reading,
  type Profile,
  PLAN_META,
  STATUS_LABEL,
} from "@/lib/supabase/types";
import { AssignAcharyaSelect } from "./assign-select";

type Row = Reading & {
  seeker: Pick<Profile, "id" | "full_name" | "email"> | null;
};

export default async function AdminReadingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; plan?: string; q?: string }>;
}) {
  await requireRole("admin");
  const admin = createAdminClient();
  const { status, plan, q } = await searchParams;
  const search = (q ?? "").trim();

  let query = admin
    .from("readings")
    .select("*, seeker:profiles!readings_seeker_profile_fk(id, full_name, email)")
    .order("created_at", { ascending: false });

  if (status && ["pending", "in_review", "delivered", "cancelled"].includes(status)) {
    query = query.eq("status", status);
  }
  if (plan && ["darshan", "signature", "legacy"].includes(plan)) {
    query = query.eq("plan", plan);
  }

  const [{ data: rows }, { data: acharyasRaw }] = await Promise.all([
    query,
    admin
      .from("profiles")
      .select("id, full_name")
      .eq("role", "acharya")
      .order("full_name", { ascending: true }),
  ]);

  let list = (rows ?? []) as Row[];
  if (search) {
    const needle = search.toLowerCase();
    list = list.filter((r) => {
      const hay = [
        r.seeker?.email ?? "",
        r.seeker?.full_name ?? "",
        r.acharya_name ?? "",
        r.seeker_note ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(needle);
    });
  }
  const acharyas = (acharyasRaw ?? []) as { id: string; full_name: string | null }[];

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs font-mono text-brown/50 uppercase tracking-[0.2em] mb-3">
            Readings
          </p>
          <h1 className="text-3xl md:text-4xl font-display text-brown">
            All readings ({list.length})
          </h1>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <form method="get" className="flex items-center gap-1 bg-white border border-gold/30 rounded-full px-3 h-9">
            {status ? <input type="hidden" name="status" value={status} /> : null}
            {plan ? <input type="hidden" name="plan" value={plan} /> : null}
            <input
              type="search"
              name="q"
              defaultValue={search}
              placeholder="Search seeker, acharya, note…"
              className="w-56 bg-transparent text-sm text-brown placeholder:text-brown/40 focus:outline-none"
            />
            {search ? (
              <a
                href={`/admin/readings${statusPlanQuery({ status, plan })}`}
                className="text-xs text-brown/50 hover:text-maroon"
              >
                clear
              </a>
            ) : null}
          </form>
          <FilterGroup
            label="Status"
            current={status}
            options={[
              { value: undefined, label: "All" },
              { value: "pending", label: "Pending" },
              { value: "in_review", label: "In review" },
              { value: "delivered", label: "Delivered" },
              { value: "cancelled", label: "Cancelled" },
            ]}
            param="status"
          />
          <FilterGroup
            label="Plan"
            current={plan}
            options={[
              { value: undefined, label: "All" },
              { value: "darshan", label: "Darshan" },
              { value: "signature", label: "Signature" },
              { value: "legacy", label: "Legacy" },
            ]}
            param="plan"
          />
        </div>
      </div>

      <div className="rounded-xl bg-white border border-gold/30 overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead className="bg-amber/10 text-brown/60 text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left font-mono font-normal px-5 py-3">Seeker</th>
              <th className="text-left font-mono font-normal px-5 py-3">Plan</th>
              <th className="text-left font-mono font-normal px-5 py-3">Status</th>
              <th className="text-left font-mono font-normal px-5 py-3">Acharya</th>
              <th className="text-left font-mono font-normal px-5 py-3">Requested</th>
              <th className="text-right font-mono font-normal px-5 py-3">₹</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-brown/55">
                  No readings match these filters.
                </td>
              </tr>
            ) : (
              list.map((r) => (
                <tr key={r.id} className="border-t border-gold/20 hover:bg-amber/5">
                  <td className="px-5 py-3">
                    <p className="text-brown">
                      {r.seeker?.full_name ?? r.seeker?.email ?? "—"}
                    </p>
                    <p className="text-xs text-brown/50">{r.seeker?.email}</p>
                  </td>
                  <td className="px-5 py-3 text-brown">{PLAN_META[r.plan].label}</td>
                  <td className="px-5 py-3">
                    <StatusPill status={r.status} />
                  </td>
                  <td className="px-5 py-3">
                    <AssignAcharyaSelect
                      readingId={r.id}
                      currentAcharyaId={r.acharya_id}
                      acharyas={acharyas}
                    />
                  </td>
                  <td className="px-5 py-3 text-brown/70 font-mono text-xs">
                    {formatDate(r.created_at)}
                  </td>
                  <td className="px-5 py-3 text-right text-brown/70">
                    {r.price_inr ? `₹${r.price_inr}` : "—"}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      href={`/astrologer/readings/${r.id}`}
                      className="text-maroon hover:underline text-sm"
                    >
                      Open
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function statusPlanQuery(params: { status?: string; plan?: string }) {
  const u = new URLSearchParams();
  if (params.status) u.set("status", params.status);
  if (params.plan) u.set("plan", params.plan);
  const s = u.toString();
  return s ? `?${s}` : "";
}

function FilterGroup({
  label,
  options,
  current,
  param,
}: {
  label: string;
  current: string | undefined;
  options: { value: string | undefined; label: string }[];
  param: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-mono text-brown/55">{label}</span>
      <div className="flex items-center gap-1 bg-white border border-gold/30 rounded-full p-1">
        {options.map((o) => {
          const active = (o.value ?? "") === (current ?? "");
          const url = new URLSearchParams();
          if (o.value) url.set(param, o.value);
          return (
            <Link
              key={o.label}
              href={`/admin/readings${url.toString() ? `?${url.toString()}` : ""}`}
              className={`text-xs px-3 h-7 inline-flex items-center rounded-full ${
                active ? "bg-maroon text-ivory" : "text-brown/70 hover:text-brown"
              }`}
            >
              {o.label}
            </Link>
          );
        })}
      </div>
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
    month: "short",
    year: "numeric",
  });
}
