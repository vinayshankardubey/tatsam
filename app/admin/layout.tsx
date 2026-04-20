import { requireRole } from "@/lib/supabase/require-role";
import {
  DashboardSidebar,
  type NavGroup,
  type MobileTab,
} from "@/components/dashboard/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireRole("admin");

  const fullName = profile.full_name ?? "Admin";
  const userInitial = (fullName.trim()[0] ?? "A").toUpperCase();

  const groups: NavGroup[] = [
    {
      label: "Operations",
      items: [
        { href: "/admin",          label: "Overview", icon: "layout-dashboard", exact: true },
        { href: "/admin/readings", label: "Readings", icon: "file-text" },
        { href: "/admin/users",    label: "Users",    icon: "users" },
      ],
    },
    {
      label: "Also yours",
      items: [
        { href: "/astrologer", label: "Acharya view", icon: "user-cog" },
        { href: "/dashboard",  label: "Seeker view",  icon: "user" },
      ],
    },
  ];

  const mobileTabs: MobileTab[] = [
    { href: "/admin",          label: "Overview", icon: "layout-dashboard", exact: true },
    { href: "/admin/readings", label: "Readings", icon: "file-text" },
    { href: "/admin/users",    label: "Users",    icon: "users" },
    { href: "/dashboard/profile", label: "Me",    icon: "user", isProfile: true },
  ];

  return (
    <div className="min-h-screen bg-ivory text-brown">
      <DashboardSidebar
        badge="Admin"
        groups={groups}
        mobileTabs={mobileTabs}
        userLabel={fullName}
        userEmail={profile.email}
        userInitial={userInitial}
      />

      <main className="lg:pl-[240px] pb-24 lg:pb-0">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-8 lg:py-14">
          {children}
        </div>
      </main>
    </div>
  );
}
