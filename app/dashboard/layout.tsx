import { redirect } from "next/navigation";
import { getCurrentUser, getCurrentProfile } from "@/lib/supabase/current-user";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { buildDashboardNav } from "@/lib/dashboard-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const profile = await getCurrentProfile();

  const fullName = profile?.full_name ?? "Seeker";
  const userInitial = (fullName.trim()[0] ?? "S").toUpperCase();
  const userEmail = profile?.email ?? user.email ?? "";

  const { groups, mobileTabs } = buildDashboardNav(profile);

  return (
    <div className="min-h-screen bg-ivory text-brown">
      <DashboardSidebar
        groups={groups}
        mobileTabs={mobileTabs}
        userLabel={fullName}
        userEmail={userEmail}
        userInitial={userInitial}
      />

      <main className="lg:pl-[240px] pb-24 lg:pb-0">
        <div className="w-full px-6 lg:px-10 py-8 lg:py-14">
          {children}
        </div>
      </main>
    </div>
  );
}
