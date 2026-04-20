// Approximate Vedic panchang helpers. Not observatory-precise — a living
// acharya casts the exact panchang for any muhurat that matters. These give
// the dashboard enough real Vedic texture for a premium feel.

export const TITHI_NAMES = [
  "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
  "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
  "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima",
  "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
  "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
  "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Amavasya",
];

export const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashirsha",
  "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha",
  "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati",
  "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha",
  "Uttara Ashadha", "Shravana", "Dhanishtha", "Shatabhisha",
  "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
];

export const YOGAS = [
  "Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana",
  "Atiganda", "Sukarma", "Dhriti", "Shula", "Ganda",
  "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra",
  "Siddhi", "Vyatipata", "Variyan", "Parigha", "Shiva",
  "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma",
  "Indra", "Vaidhriti",
];

const LUNAR_MONTH = 29.530588853;
const SIDEREAL_MONTH = 27.321661;

// Reference new moon (UTC) used as epoch for phase calculation.
const NEW_MOON_EPOCH = new Date("2000-01-06T18:14:00Z").getTime();
const NAKSHATRA_EPOCH = new Date("2000-01-01T00:00:00Z").getTime();

export function moonPhase(date: Date = new Date()): number {
  const days = (date.getTime() - NEW_MOON_EPOCH) / 86_400_000;
  const phase = (((days % LUNAR_MONTH) + LUNAR_MONTH) % LUNAR_MONTH) / LUNAR_MONTH;
  return phase; // 0 = new moon, 0.5 = full moon
}

export function tithi(date: Date = new Date()): { index: number; name: string; paksha: "Shukla" | "Krishna" } {
  const index = Math.min(29, Math.floor(moonPhase(date) * 30));
  return {
    index: index + 1,
    name: TITHI_NAMES[index],
    paksha: index < 15 ? "Shukla" : "Krishna",
  };
}

export function nakshatra(date: Date = new Date()): { index: number; name: string } {
  const days = (date.getTime() - NAKSHATRA_EPOCH) / 86_400_000;
  const fraction = (((days % SIDEREAL_MONTH) + SIDEREAL_MONTH) % SIDEREAL_MONTH) / SIDEREAL_MONTH;
  const index = Math.min(26, Math.floor(fraction * 27));
  return { index: index + 1, name: NAKSHATRAS[index] };
}

/**
 * Yoga is a function of sun+moon longitudes. Approximation: use date-indexed
 * slot through the 27-yoga cycle.
 */
export function yoga(date: Date = new Date()): { index: number; name: string } {
  const days = Math.floor((date.getTime() - NAKSHATRA_EPOCH) / 86_400_000);
  const index = ((days % 27) + 27) % 27;
  return { index: index + 1, name: YOGAS[index] };
}

// ─────────────────────────────────────────────────────────────
// Weekday lucky data (classical Vedic associations)
// ─────────────────────────────────────────────────────────────
export type WeekdayInfo = {
  name: string;
  sanskrit: string;
  planet: string;
  color: string;
  gemstone: string;
  mantra: string;
  direction: string;
  luckyNumber: number;
};

export const WEEKDAY: Record<number, WeekdayInfo> = {
  0: { name: "Sunday",    sanskrit: "Ravivar",    planet: "Surya (Sun)",     color: "Crimson &amp; Saffron",  gemstone: "Ruby",             mantra: "Om Suryaya Namah",     direction: "East",        luckyNumber: 1 },
  1: { name: "Monday",    sanskrit: "Somvar",     planet: "Chandra (Moon)",  color: "Pearl white &amp; Silver", gemstone: "Pearl",         mantra: "Om Chandraya Namah",   direction: "North-West",  luckyNumber: 2 },
  2: { name: "Tuesday",   sanskrit: "Mangalvar",  planet: "Mangal (Mars)",   color: "Coral red",              gemstone: "Red Coral",       mantra: "Om Mangalaya Namah",   direction: "South",       luckyNumber: 9 },
  3: { name: "Wednesday", sanskrit: "Budhvar",    planet: "Budh (Mercury)",  color: "Emerald green",          gemstone: "Emerald",         mantra: "Om Budhaya Namah",     direction: "North",       luckyNumber: 5 },
  4: { name: "Thursday",  sanskrit: "Guruvar",    planet: "Guru (Jupiter)",  color: "Turmeric yellow",        gemstone: "Yellow Sapphire", mantra: "Om Brihaspataye Namah",direction: "North-East",  luckyNumber: 3 },
  5: { name: "Friday",    sanskrit: "Shukravar",  planet: "Shukra (Venus)",  color: "Rose &amp; Ivory",           gemstone: "Diamond",       mantra: "Om Shukraya Namah",    direction: "South-East",  luckyNumber: 6 },
  6: { name: "Saturday",  sanskrit: "Shanivar",   planet: "Shani (Saturn)",  color: "Deep indigo &amp; Black",  gemstone: "Blue Sapphire",   mantra: "Om Shanicharaya Namah",direction: "West",        luckyNumber: 8 },
};

export function weekdayInfo(date: Date = new Date()): WeekdayInfo {
  return WEEKDAY[date.getDay()];
}

// ─────────────────────────────────────────────────────────────
// Rahu Kaal — classical 8-window division of daylight per weekday.
// Using a default daylight span of 06:00 → 18:00 (12 hrs) which is a fair
// approximation for most of India. Order of Rahu slot by weekday (Monday first
// = 2nd slot; classic sequence):
//   Mon→2nd, Tue→7th, Wed→5th, Thu→6th, Fri→4th, Sat→3rd, Sun→8th
// ─────────────────────────────────────────────────────────────
const RAHU_SLOT_BY_WEEKDAY: Record<number, number> = {
  0: 8, // Sun
  1: 2, // Mon
  2: 7, // Tue
  3: 5, // Wed
  4: 6, // Thu
  5: 4, // Fri
  6: 3, // Sat
};

function fmtTime(h: number, m: number): string {
  const hh = String(h).padStart(2, "0");
  const mm = String(Math.round(m)).padStart(2, "0");
  return `${hh}:${mm}`;
}

export function rahuKaal(date: Date = new Date()): { from: string; to: string } {
  const slot = RAHU_SLOT_BY_WEEKDAY[date.getDay()];
  // Each slot is 1.5 hours (90 min) in a 12-hour daylight window starting 06:00.
  const startMin = 6 * 60 + (slot - 1) * 90;
  const endMin = startMin + 90;
  return {
    from: fmtTime(Math.floor(startMin / 60), startMin % 60),
    to: fmtTime(Math.floor(endMin / 60), endMin % 60),
  };
}

/** Abhijit Muhurat — ~48 min midday window. */
export function abhijitMuhurat(): { from: string; to: string } {
  // Midday ± 24 min, treating solar noon as 12:00.
  return { from: "11:36", to: "12:24" };
}

/** Brahma Muhurat — ~96 min before sunrise, duration ~48 min. */
export function brahmaMuhurat(): { from: string; to: string } {
  // Sunrise approximated at 06:00 → 04:24 – 05:12.
  return { from: "04:24", to: "05:12" };
}

// ─────────────────────────────────────────────────────────────
// Formatting helpers
// ─────────────────────────────────────────────────────────────
export function moonPhaseLabel(phase: number): { label: string; symbol: string } {
  // 8 standard phases
  if (phase < 0.03 || phase > 0.97) return { label: "New moon",        symbol: "●" };
  if (phase < 0.22)                   return { label: "Waxing crescent", symbol: "☽" };
  if (phase < 0.28)                   return { label: "First quarter",   symbol: "◐" };
  if (phase < 0.47)                   return { label: "Waxing gibbous",  symbol: "◑" };
  if (phase < 0.53)                   return { label: "Full moon",       symbol: "○" };
  if (phase < 0.72)                   return { label: "Waning gibbous",  symbol: "◐" };
  if (phase < 0.78)                   return { label: "Last quarter",    symbol: "◑" };
  return                                        { label: "Waning crescent", symbol: "☾" };
}

export function formatDateLong(date: Date = new Date()): string {
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
