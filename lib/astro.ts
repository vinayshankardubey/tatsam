// Western/Tropical sun sign from DOB. This is the simplest calc we can do
// inline. Moon sign, ascendant and nakshatra require sidereal astronomy
// (Swiss Ephemeris) and are set by the acharya during the reading.

type Sign = {
  name: string;
  symbol: string;
  sanskrit: string;
  element: "fire" | "earth" | "air" | "water";
  ruler: string;
};

const SIGNS: Sign[] = [
  { name: "Aries",       symbol: "♈", sanskrit: "Mesha",   element: "fire",  ruler: "Mars" },
  { name: "Taurus",      symbol: "♉", sanskrit: "Vrishabha", element: "earth", ruler: "Venus" },
  { name: "Gemini",      symbol: "♊", sanskrit: "Mithuna", element: "air",   ruler: "Mercury" },
  { name: "Cancer",      symbol: "♋", sanskrit: "Karka",   element: "water", ruler: "Moon" },
  { name: "Leo",         symbol: "♌", sanskrit: "Simha",   element: "fire",  ruler: "Sun" },
  { name: "Virgo",       symbol: "♍", sanskrit: "Kanya",   element: "earth", ruler: "Mercury" },
  { name: "Libra",       symbol: "♎", sanskrit: "Tula",    element: "air",   ruler: "Venus" },
  { name: "Scorpio",     symbol: "♏", sanskrit: "Vrischika", element: "water", ruler: "Mars" },
  { name: "Sagittarius", symbol: "♐", sanskrit: "Dhanu",   element: "fire",  ruler: "Jupiter" },
  { name: "Capricorn",   symbol: "♑", sanskrit: "Makara",  element: "earth", ruler: "Saturn" },
  { name: "Aquarius",    symbol: "♒", sanskrit: "Kumbha",  element: "air",   ruler: "Saturn" },
  { name: "Pisces",      symbol: "♓", sanskrit: "Meena",   element: "water", ruler: "Jupiter" },
];

// Sign boundaries (month, day inclusive start). Canonical tropical dates.
const BOUNDARIES: Array<[number, number, number]> = [
  [3, 21, 0],   // Aries
  [4, 20, 1],   // Taurus
  [5, 21, 2],   // Gemini
  [6, 22, 3],   // Cancer
  [7, 23, 4],   // Leo
  [8, 23, 5],   // Virgo
  [9, 23, 6],   // Libra
  [10, 23, 7],  // Scorpio
  [11, 22, 8],  // Sagittarius
  [12, 22, 9],  // Capricorn
  [1, 20, 10],  // Aquarius
  [2, 19, 11],  // Pisces
];

export function sunSignFromDob(dobIso: string | null | undefined): Sign | null {
  if (!dobIso) return null;
  const [y, m, d] = dobIso.split("-").map((v) => parseInt(v, 10));
  if (!y || !m || !d) return null;

  // Walk boundaries; pick the last whose (month, day) is <= DOB in calendar order.
  // Capricorn wraps year-end, so we special-case the Dec 22 → Jan 19 span.
  if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) return SIGNS[9]; // Capricorn
  for (let i = 0; i < BOUNDARIES.length; i++) {
    const [bm, bd, idx] = BOUNDARIES[i];
    const [nbm, nbd] = BOUNDARIES[(i + 1) % BOUNDARIES.length];
    const afterStart = m > bm || (m === bm && d >= bd);
    const beforeEnd = m < nbm || (m === nbm && d < nbd);
    if (afterStart && beforeEnd) return SIGNS[idx];
  }
  return null;
}

/**
 * Sun-sign compatibility — element + polarity heuristic. Same element is
 * harmonious; complementary (fire↔air, earth↔water) is energising; square
 * elements create creative friction. Returns a 0..100 score + a one-line note.
 */
export function signCompatibility(a: string, b: string): { score: number; note: string } {
  const elemA = SIGNS.find((s) => s.name === a)?.element;
  const elemB = SIGNS.find((s) => s.name === b)?.element;
  if (!elemA || !elemB) return { score: 0, note: "—" };

  const same = elemA === elemB;
  const complementary =
    (elemA === "fire" && elemB === "air") ||
    (elemA === "air" && elemB === "fire") ||
    (elemA === "earth" && elemB === "water") ||
    (elemA === "water" && elemB === "earth");
  const tense =
    (elemA === "fire" && elemB === "water") ||
    (elemA === "water" && elemB === "fire") ||
    (elemA === "air" && elemB === "earth") ||
    (elemA === "earth" && elemB === "air");

  if (same) {
    return {
      score: 82,
      note: `Same element — you understand each other&rsquo;s pace and fuel.`,
    };
  }
  if (complementary) {
    return {
      score: 88,
      note: `Complementary elements — ${elemA} and ${elemB} lift each other.`,
    };
  }
  if (tense) {
    return {
      score: 58,
      note: `Squared elements — real friction; real growth if you stay curious.`,
    };
  }
  return { score: 72, note: "A workable blend of temperaments." };
}

export const SIGN_BLURBS: Record<string, string> = {
  Aries: "Initiator and spark. A year begins in you — push, but remember to land.",
  Taurus: "Steady, sensual, patient. You build a beautiful life slowly — then keep it.",
  Gemini: "Quick-witted and curious. You live in the bridge between ideas; don't forget the body.",
  Cancer: "Tender, protective, rooted in memory. Home is a verb for you.",
  Leo: "Warm, generous, centre-stage. Your light serves most when it's shared, not sold.",
  Virgo: "Careful, devoted, precise. The world runs on your quiet corrections.",
  Libra: "Grace, fairness, relationship. You choose beauty — and the pause that makes it possible.",
  Scorpio: "Intense, truthful, transformative. You meet the deep water others avoid.",
  Sagittarius: "Philosophical, far-seeing, restless. Your soul stretches toward meaning, not scenery.",
  Capricorn: "Disciplined, enduring, quietly powerful. You climb because the view from the top is earned.",
  Aquarius: "Original, humane, airy. You think in decades while others think in weeks.",
  Pisces: "Intuitive, porous, merciful. You swim between worlds and carry both with you.",
};
