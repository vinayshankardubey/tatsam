import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  DashboardSidebar,
  type NavGroup,
  type MobileTab,
} from "@/components/dashboard/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, role")
    .eq("id", user.id)
    .single();

  const fullName = profile?.full_name ?? "Seeker";
  const userInitial = (fullName.trim()[0] ?? "S").toUpperCase();
  const userEmail = profile?.email ?? user.email ?? "";

  const groups: NavGroup[] = [
    {
      label: "Daily",
      items: [
        { href: "/dashboard",           label: "Today",         icon: "home",     exact: true },
        { href: "/dashboard/panchang",  label: "Panchang",      icon: "calendar" },
        { href: "/dashboard/horoscope", label: "Horoscope",     icon: "feather" },
        { href: "/dashboard/cosmos",    label: "Cosmic events", icon: "star" },
      ],
    },
    {
      label: "Tatsam",
      items: [
        { href: "/tools",                               label: "All of Tatsam",    icon: "compass" },
        { href: "/dashboard/ask?tool=shri-ram-shalaka", label: "Shri Ram Shalaka", icon: "sparkles" },
        { href: "/dashboard/ask?tool=gita-shalaka",     label: "Gita Shalaka",     icon: "feather" },
        { href: "/dashboard/ask?tool=chanakya-niti",    label: "Chanakya Niti",    icon: "feather" },
        { href: "/dashboard/ask",                       label: "Open chat",        icon: "message" },
      ],
    },
    {
      label: "Your sky",
      items: [
        { href: "/dashboard/kundli",        label: "Kundli",        icon: "sparkles" },
        { href: "/dashboard/numerology",    label: "Numerology",    icon: "feather" },
        { href: "/dashboard/compatibility", label: "Compatibility", icon: "heart" },
      ],
    },
    {
      label: "Readings",
      items: [
        { href: "/dashboard/readings", label: "All readings",   icon: "file-text" },
        { href: "/dashboard/book",     label: "Book a reading", icon: "book" },
        { href: "/dashboard/remedies", label: "Remedies",       icon: "star" },
      ],
    },
  ];

  // Admin / acharya shortcuts live in a separate group so the main nav
  // stays seeker-focused.
  if (profile?.role === "admin" || profile?.role === "acharya") {
    const crossRole: NavGroup = { label: "Also yours", items: [] };
    if (profile.role === "admin") {
      crossRole.items.push({
        href: "/admin",
        label: "Admin console",
        icon: "layout-dashboard",
      });
    }
    if (profile.role === "acharya") {
      crossRole.items.push({
        href: "/astrologer",
        label: "Acharya console",
        icon: "user-cog",
      });
    }
    groups.push(crossRole);
  }

  const mobileTabs: MobileTab[] = [
    { href: "/dashboard",          label: "Today",    icon: "home",     exact: true },
    { href: "/dashboard/kundli",   label: "Kundli",   icon: "sparkles" },
    { href: "/tools",              label: "Tatsam",   icon: "compass",  isPrimary: true },
    { href: "/dashboard/readings", label: "Readings", icon: "file-text" },
    { href: "/dashboard/profile",  label: "Me",       icon: "user",     isProfile: true },
  ];

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
        <div className="max-w-[1100px] mx-auto px-6 lg:px-10 py-8 lg:py-14">
          {children}
        </div>
      </main>
    </div>
  );
}
