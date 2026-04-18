// Pythagorean numerology helpers. All calculations are deterministic.
//
// Life Path: reduce DOB digit-sum, honoring master numbers 11/22/33.
// Expression (Destiny): letter values of full name.
// Soul Urge: letter values of vowels only.
// Personality: letter values of consonants only.

const LETTER_VALUES: Record<string, number> = {
  A: 1, J: 1, S: 1,
  B: 2, K: 2, T: 2,
  C: 3, L: 3, U: 3,
  D: 4, M: 4, V: 4,
  E: 5, N: 5, W: 5,
  F: 6, O: 6, X: 6,
  G: 7, P: 7, Y: 7,
  H: 8, Q: 8, Z: 8,
  I: 9, R: 9,
};

const VOWELS = new Set(["A", "E", "I", "O", "U"]);

function reduce(n: number): number {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n)
      .split("")
      .reduce((acc, d) => acc + Number(d), 0);
  }
  return n;
}

function sumLetters(name: string, filter: (ch: string) => boolean): number {
  const letters = name
    .toUpperCase()
    .split("")
    .filter((ch) => /[A-Z]/.test(ch) && filter(ch));
  return reduce(letters.reduce((acc, ch) => acc + (LETTER_VALUES[ch] ?? 0), 0));
}

export function lifePathNumber(dobIso: string | null | undefined): number | null {
  if (!dobIso) return null;
  const digits = dobIso.replace(/\D/g, "");
  if (digits.length < 8) return null;
  const sum = digits.split("").reduce((acc, d) => acc + Number(d), 0);
  return reduce(sum);
}

export function expressionNumber(fullName: string | null | undefined): number | null {
  if (!fullName || !fullName.trim()) return null;
  return sumLetters(fullName, () => true);
}

export function soulUrgeNumber(fullName: string | null | undefined): number | null {
  if (!fullName || !fullName.trim()) return null;
  return sumLetters(fullName, (ch) => VOWELS.has(ch));
}

export function personalityNumber(fullName: string | null | undefined): number | null {
  if (!fullName || !fullName.trim()) return null;
  return sumLetters(fullName, (ch) => !VOWELS.has(ch));
}

export const LIFE_PATH_MEANING: Record<number, { keyword: string; blurb: string }> = {
  1: { keyword: "The Pioneer", blurb: "Independent, driven, born to lead. Your path rewards initiative and clear decisions." },
  2: { keyword: "The Harmoniser", blurb: "Diplomatic, intuitive, relational. You build through listening and patient cooperation." },
  3: { keyword: "The Expressor", blurb: "Creative, magnetic, playful. Your gift is turning feeling into language that moves others." },
  4: { keyword: "The Builder", blurb: "Grounded, disciplined, loyal. You create enduring things through patient, daily effort." },
  5: { keyword: "The Explorer", blurb: "Curious, adaptable, restless. Freedom and variety are not luxuries for you — they are oxygen." },
  6: { keyword: "The Caregiver", blurb: "Responsible, nurturing, devoted. You carry others skillfully, but must learn to receive too." },
  7: { keyword: "The Seeker", blurb: "Analytical, contemplative, private. Your depth grows in solitude; your truth in study." },
  8: { keyword: "The Achiever", blurb: "Powerful, strategic, ambitious. You are meant to handle material and scale — with integrity." },
  9: { keyword: "The Humanitarian", blurb: "Compassionate, artistic, universal. You serve a vision larger than yourself and must learn release." },
  11: { keyword: "The Illuminator (Master)", blurb: "Intuitive, visionary, electric. A master number — high potential, high sensitivity." },
  22: { keyword: "The Architect (Master)", blurb: "You can build structures that outlive you. Practical mysticism at scale." },
  33: { keyword: "The Teacher (Master)", blurb: "The highest path of service through devotion and love. Rare and demanding." },
};
