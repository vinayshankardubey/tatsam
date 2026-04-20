import { requireRole } from "@/lib/supabase/require-role";
import {
  DashboardSidebar,
  type NavGroup,
  type MobileTab,
} from "@/components/dashboard/sidebar";

export default async function AstrologerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireRole("acharya");

  const fullName = profile.full_name ?? "Acharya";
  const userInitial = (fullName.trim()[0] ?? "A").toUpperCase();

  const groups: NavGroup[] = [
    {
      label: "Your practice",
      items: [
        { href: "/astrologer", label: "Queue", icon: "inbox", exact: true },
      ],
    },
    {
      label: "Also yours",
      items: [
        { href: "/dashboard", label: "Seeker view", icon: "user" },
        ...(profile.role === "admin"
          ? [{ href: "/admin", label: "Admin console", icon: "layout-dashboard" as const }]
          : []),
      ],
    },
  ];

  const mobileTabs: MobileTab[] = [
    { href: "/astrologer",         label: "Queue",  icon: "inbox", exact: true },
    { href: "/dashboard",          label: "Chart",  icon: "sparkles" },
    { href: "/dashboard/profile",  label: "Me",     icon: "user", isProfile: true },
  ];

  return (
    <div className="min-h-screen bg-ivory text-brown">
      <DashboardSidebar
        badge="Acharya"
        groups={groups}
        mobileTabs={mobileTabs}
        userLabel={fullName}
        userEmail={profile.email}
        userInitial={userInitial}
      />

      <main className="lg:pl-[240px] pb-24 lg:pb-0">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-10 py-8 lg:py-14">
          {children}
        </div>
      </main>
    </div>
  );
}
