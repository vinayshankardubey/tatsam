// Upcoming cosmic events — curated calendar. Dates are indicative; the acharya
// confirms exact timings for any muhurat that a seeker is planning around.

export type CosmicEvent = {
  date: string; // YYYY-MM-DD
  title: string;
  kind: "festival" | "transit" | "eclipse" | "retrograde" | "solstice" | "purnima" | "amavasya";
  note?: string;
};

export const COSMIC_EVENTS_2026: CosmicEvent[] = [
  { date: "2026-04-29", title: "Akshaya Tritiya",        kind: "festival", note: "One of the most auspicious days of the year for beginnings." },
  { date: "2026-05-01", title: "Ganga Saptami",          kind: "festival", note: "Worship of Ma Ganga — clarity and spiritual cleansing." },
  { date: "2026-05-15", title: "Buddha Purnima",         kind: "purnima",  note: "Full moon marking the birth of Buddha." },
  { date: "2026-05-26", title: "Ganga Dussehra",         kind: "festival", note: "Ten-fold sins cleansed — excellent for dan (charity)." },
  { date: "2026-05-30", title: "Mercury retrograde begins", kind: "retrograde", note: "Review communications, contracts; revisit old plans." },
  { date: "2026-06-14", title: "Jyeshtha Amavasya",      kind: "amavasya", note: "No-moon night — ancestor offerings (tarpan)." },
  { date: "2026-06-21", title: "Summer Solstice",        kind: "solstice", note: "Sun enters Cancer sign (western); dakshinayana begins." },
  { date: "2026-06-22", title: "Mercury direct",         kind: "retrograde", note: "Retrograde ends — forward motion resumes." },
  { date: "2026-06-29", title: "Jagannath Rath Yatra",   kind: "festival", note: "Sacred journey of Lord Jagannath." },
  { date: "2026-07-09", title: "Guru Purnima",           kind: "purnima",  note: "Honor your teachers, mentors, spiritual guides." },
  { date: "2026-08-09", title: "Raksha Bandhan",         kind: "festival", note: "Bond of protection between siblings." },
  { date: "2026-08-16", title: "Krishna Janmashtami",    kind: "festival", note: "Birth of Lord Krishna — midnight celebrations." },
  { date: "2026-09-18", title: "Ganesh Chaturthi",       kind: "festival", note: "Remover of obstacles — ideal for new beginnings." },
  { date: "2026-10-08", title: "Sharad Purnima",         kind: "purnima",  note: "Fullest moon of the year — amrit bathes the earth." },
  { date: "2026-10-11", title: "Navratri begins",        kind: "festival", note: "Nine nights of devotion to the Devi." },
  { date: "2026-10-20", title: "Dussehra",               kind: "festival", note: "Victory of good over evil." },
  { date: "2026-11-08", title: "Diwali",                 kind: "festival", note: "Festival of lights — Lakshmi puja." },
];

export function upcomingEvents(
  fromDate: Date = new Date(),
  count = 5,
): CosmicEvent[] {
  const today = new Date(
    fromDate.getFullYear(),
    fromDate.getMonth(),
    fromDate.getDate(),
  );
  return COSMIC_EVENTS_2026
    .filter((e) => new Date(e.date) >= today)
    .slice(0, count);
}

export function formatRelativeDay(iso: string, now: Date = new Date()): string {
  const target = new Date(iso);
  const diffDays = Math.round(
    (target.getTime() - new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) /
      86_400_000,
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays < 7) return `In ${diffDays} days`;
  if (diffDays < 30) return `In ${Math.round(diffDays / 7)} weeks`;
  return target.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}
