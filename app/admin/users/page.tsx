import { requireRole } from "@/lib/supabase/require-role";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Profile } from "@/lib/supabase/types";
import { RoleSelect } from "./role-select";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; role?: string }>;
}) {
  await requireRole("admin");
  const admin = createAdminClient();
  const { q, role } = await searchParams;
  const search = (q ?? "").trim();

  let query = admin.from("profiles").select("*").order("created_at", { ascending: false });
  if (role && ["seeker", "acharya", "admin"].includes(role)) {
    query = query.eq("role", role);
  }
  const { data } = await query;

  let users = (data ?? []) as Profile[];
  if (search) {
    const needle = search.toLowerCase();
    users = users.filter((u) =>
      [u.email, u.full_name, u.phone, u.birth_place].some((v) =>
        (v ?? "").toLowerCase().includes(needle),
      ),
    );
  }
  const counts = {
    seeker: users.filter((u) => u.role === "seeker").length,
    acharya: users.filter((u) => u.role === "acharya").length,
    admin: users.filter((u) => u.role === "admin").length,
  };

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <p className="text-xs font-mono text-brown/50 uppercase tracking-[0.2em] mb-3">
            Users
          </p>
          <h1 className="text-3xl md:text-4xl font-display text-brown">
            {users.length} {search || role ? "matching" : "total"}
          </h1>
          <p className="text-sm text-brown/60 mt-2">
            {counts.seeker} seekers · {counts.acharya} acharyas · {counts.admin} admins
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <form method="get" className="flex items-center gap-1 bg-white border border-gold/30 rounded-full px-3 h-9">
            {role ? <input type="hidden" name="role" value={role} /> : null}
            <input
              type="search"
              name="q"
              defaultValue={search}
              placeholder="Search email, name, phone, place…"
              className="w-64 bg-transparent text-sm text-brown placeholder:text-brown/40 focus:outline-none"
            />
            {search ? (
              <a
                href={`/admin/users${role ? `?role=${role}` : ""}`}
                className="text-xs text-brown/50 hover:text-maroon"
              >
                clear
              </a>
            ) : null}
          </form>

          <div className="flex items-center gap-1 bg-white border border-gold/30 rounded-full p-1">
            {(["all", "seeker", "acharya", "admin"] as const).map((r) => {
              const active = (r === "all" && !role) || r === role;
              const url = new URLSearchParams();
              if (r !== "all") url.set("role", r);
              if (search) url.set("q", search);
              return (
                <a
                  key={r}
                  href={`/admin/users${url.toString() ? `?${url.toString()}` : ""}`}
                  className={`text-xs px-3 h-7 inline-flex items-center rounded-full capitalize ${
                    active ? "bg-maroon text-ivory" : "text-brown/70 hover:text-brown"
                  }`}
                >
                  {r}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white border border-gold/30 overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead className="bg-amber/10 text-brown/60 text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left font-mono font-normal px-5 py-3">Name</th>
              <th className="text-left font-mono font-normal px-5 py-3">Email</th>
              <th className="text-left font-mono font-normal px-5 py-3">DOB</th>
              <th className="text-left font-mono font-normal px-5 py-3">Joined</th>
              <th className="text-left font-mono font-normal px-5 py-3">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-gold/20 hover:bg-amber/5">
                <td className="px-5 py-3 text-brown">{u.full_name ?? "—"}</td>
                <td className="px-5 py-3 text-brown/70">{u.email}</td>
                <td className="px-5 py-3 text-brown/70 font-mono text-xs">
                  {u.dob ?? "—"}
                </td>
                <td className="px-5 py-3 text-brown/70 font-mono text-xs">
                  {formatDate(u.created_at)}
                </td>
                <td className="px-5 py-3">
                  <RoleSelect userId={u.id} currentRole={u.role} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
