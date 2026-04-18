import { requireRole } from "@/lib/supabase/require-role";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Profile } from "@/lib/supabase/types";
import { RoleSelect } from "./role-select";

export default async function AdminUsersPage() {
  await requireRole("admin");
  const admin = createAdminClient();
  const { data } = await admin
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  const users = (data ?? []) as Profile[];
  const counts = {
    seeker: users.filter((u) => u.role === "seeker").length,
    acharya: users.filter((u) => u.role === "acharya").length,
    admin: users.filter((u) => u.role === "admin").length,
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-mono text-brown/50 uppercase tracking-[0.2em] mb-3">
          Users
        </p>
        <h1 className="text-3xl md:text-4xl font-display text-brown">
          {users.length} total
        </h1>
        <p className="text-sm text-brown/60 mt-2">
          {counts.seeker} seekers · {counts.acharya} acharyas · {counts.admin} admins
        </p>
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
