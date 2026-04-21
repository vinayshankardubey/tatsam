import type { NavGroup, MobileTab } from "@/components/dashboard/sidebar";
import type { Profile } from "@/lib/supabase/types";

/**
 * Shared navigation model used by every authenticated surface that renders
 * the dashboard sidebar (the /dashboard layout itself, and any public page
 * — like /tatsam — that wants to show the sidebar to signed-in users).
 */
export function buildDashboardNav(profile: Profile | null): {
  groups: NavGroup[];
  mobileTabs: MobileTab[];
} {
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
        { href: "/tatsam",                              label: "All of Tatsam",    icon: "compass" },
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
    { href: "/tatsam",             label: "Tatsam",   icon: "compass",  isPrimary: true },
    { href: "/dashboard/readings", label: "Readings", icon: "file-text" },
    { href: "/dashboard/profile",  label: "Me",       icon: "user",     isProfile: true },
  ];

  return { groups, mobileTabs };
}
