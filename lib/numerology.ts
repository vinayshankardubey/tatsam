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

/** Birth day number — the day of the month you were born, reduced (keeps master). */
export function birthDayNumber(dobIso: string | null | undefined): number | null {
  if (!dobIso) return null;
  const parts = dobIso.split("-");
  if (parts.length !== 3) return null;
  const d = parseInt(parts[2], 10);
  if (!Number.isFinite(d)) return null;
  return reduce(d);
}

/**
 * Personal year number for a given calendar year — a 9-year cycle keyed to your
 * birth month/day. Mixes DOB's month+day digits with the target year's digits
 * and reduces to a single digit (master numbers preserved).
 */
export function personalYearNumber(
  dobIso: string | null | undefined,
  year: number,
): number | null {
  if (!dobIso) return null;
  const parts = dobIso.split("-");
  if (parts.length !== 3) return null;
  const [, mm, dd] = parts;
  const digits = `${mm}${dd}${year}`.split("").map(Number);
  const sum = digits.reduce((a, b) => a + b, 0);
  return reduce(sum);
}

/** Personal month number — reduce (personal_year_number + current_month). */
export function personalMonthNumber(
  dobIso: string | null | undefined,
  date: Date = new Date(),
): number | null {
  const py = personalYearNumber(dobIso, date.getFullYear());
  if (py == null) return null;
  return reduce(py + (date.getMonth() + 1));
}

/** Personal day number — reduce (personal_month + current_day). */
export function personalDayNumber(
  dobIso: string | null | undefined,
  date: Date = new Date(),
): number | null {
  const pm = personalMonthNumber(dobIso, date);
  if (pm == null) return null;
  return reduce(pm + date.getDate());
}

export const EXPRESSION_MEANING: Record<number, string> = {
  1: "You express as a leader — direct, original, slightly impatient with the ordinary.",
  2: "You express as a bridge-builder — diplomatic, receptive, attuned to the room.",
  3: "You express as a communicator — playful, persuasive, an instinct for the word that lands.",
  4: "You express as a builder — reliable, methodical, loved by those who depend on you.",
  5: "You express as an adventurer — versatile, witty, hard to pin down and that&rsquo;s the point.",
  6: "You express as a caretaker — responsible, warm, often the emotional centre of gravity.",
  7: "You express as a thinker — analytical, private, a quiet depth others feel before they name it.",
  8: "You express as an executive — ambitious, authoritative, good with scale and money.",
  9: "You express as a humanitarian — generous, idealistic, drawn to causes bigger than you.",
  11: "You express as an illuminator — visionary, intuitive, a channel when you let yourself be.",
  22: "You express as a master builder — dreams rendered into lasting institutions.",
  33: "You express as a master teacher — leadership through love, rarely chosen lightly.",
};

export const SOUL_URGE_MEANING: Record<number, string> = {
  1: "Your heart wants independence and self-authorship. You&rsquo;d rather be lonely than managed.",
  2: "Your heart wants harmony and partnership. The right company is what home means to you.",
  3: "Your heart wants creative expression and joy. A day without some play feels off.",
  4: "Your heart wants order, loyalty, and something solid to stand on.",
  5: "Your heart wants freedom, travel, and stories. Routine drains you faster than you admit.",
  6: "Your heart wants to love and be needed by the ones who matter most.",
  7: "Your heart wants truth and solitude. You&rsquo;re looking for what&rsquo;s underneath everything.",
  8: "Your heart wants mastery and material sufficiency — earned, not inherited.",
  9: "Your heart wants to serve something bigger and to leave a mark you can forgive.",
  11: "Your heart wants to uplift — quietly, relentlessly, often without asking.",
  22: "Your heart wants to build the thing no one else quite sees yet.",
  33: "Your heart wants pure devotional service — a rare and demanding calling.",
};

export const PERSONALITY_MEANING: Record<number, string> = {
  1: "Others meet you as confident, sharp, and a little remote. You lead from a distance.",
  2: "Others meet you as gentle, tactful, easy to trust. You rarely push.",
  3: "Others meet you as bright, funny, expressive. Rooms notice you arrive.",
  4: "Others meet you as steady and dependable. The one who shows up.",
  5: "Others meet you as charming and hard to pin down. They feel you might leave.",
  6: "Others meet you as warm, welcoming, a little maternal — of whatever gender.",
  7: "Others meet you as mysterious and self-contained. Some want in; some won&rsquo;t dare.",
  8: "Others meet you as competent and in control. You read as someone in charge.",
  9: "Others meet you as wise, slightly removed, a traveller passing through.",
  11: "Others meet you as luminous — unusually sensitive, unusually bright.",
  22: "Others meet you as formidable. You don&rsquo;t need to prove anything.",
  33: "Others meet you as unmistakably loving. A presence.",
};

export const BIRTH_DAY_MEANING: Record<number, string> = {
  1: "Independent streak from day one. Born to start things.",
  2: "Cooperative and peace-seeking. The mediator of your circles.",
  3: "Creative, expressive, drawn to beauty and play.",
  4: "Practical, patient, a natural builder.",
  5: "Restless, curious, an early traveller of the mind.",
  6: "Nurturing, responsible, often the family&rsquo;s emotional centre.",
  7: "Introspective, analytical, a seeker since childhood.",
  8: "Driven, material-competent, aims for the top.",
  9: "Compassionate, artistic, a wider-than-personal worldview.",
  11: "A master vibration. High sensitivity, high potential.",
  22: "A master vibration. Capable of building things that last.",
  33: "Rare master vibration. A life of loving service.",
};

/**
 * Very coarse life-path compatibility — classical numerology rule-of-thumb
 * pairings. Returns a score 0..100 and a one-line note. For casual play,
 * not a substitute for Guna Milan.
 */
export function lifePathCompatibility(a: number, b: number): { score: number; note: string } {
  // Master numbers reduce for compatibility comparison.
  const pair = [a, b].map((n) => (n > 9 ? reduceOnce(n) : n)).sort();
  const key = pair.join("-");
  const matrix: Record<string, { score: number; note: string }> = {
    "1-1": { score: 70, note: "Two leaders. Magnetic but ego can spark — share the wheel." },
    "1-2": { score: 80, note: "Classic pair: 1 leads, 2 smooths the edges." },
    "1-3": { score: 85, note: "Playful and generative. Both want to create in the world." },
    "1-4": { score: 55, note: "Different tempos — 1 rushes, 4 plans. Patience rewarded." },
    "1-5": { score: 78, note: "Adventure on tap. Watch commitment." },
    "1-6": { score: 65, note: "6 nurtures; 1 must remember to come home." },
    "1-7": { score: 60, note: "1 acts, 7 reflects. Space is the love language." },
    "1-8": { score: 70, note: "Power couple energy. Money and ambition align." },
    "1-9": { score: 72, note: "Both strong-willed; aim at a shared cause." },
    "2-2": { score: 82, note: "Tender mirror. Comfort yes; ensure decisions get made." },
    "2-3": { score: 80, note: "Warm, social, easy laughter." },
    "2-4": { score: 85, note: "Calm and committed. Builds a real home." },
    "2-5": { score: 55, note: "2 wants nearness, 5 wants movement. Negotiate rhythm." },
    "2-6": { score: 90, note: "Harmony central. Few relationships feel this gentle." },
    "2-7": { score: 75, note: "2&rsquo;s warmth draws out 7&rsquo;s depth." },
    "2-8": { score: 78, note: "2 supports; 8 provides. Clean role alignment." },
    "2-9": { score: 80, note: "Both generous. Tender and service-oriented." },
    "3-3": { score: 78, note: "Creative fireworks. Grown-up moments required." },
    "3-4": { score: 58, note: "3&rsquo;s whimsy vs 4&rsquo;s structure — fertile friction." },
    "3-5": { score: 85, note: "Freedom, wit, travel. Easy rapport." },
    "3-6": { score: 82, note: "Lovely blend of art and care." },
    "3-7": { score: 62, note: "3 shines outward; 7 mines inward. Honour both." },
    "3-8": { score: 65, note: "Creativity meets ambition. Mind the spending." },
    "3-9": { score: 88, note: "Both expansive and warm. A joyful pairing." },
    "4-4": { score: 80, note: "Two builders. Enduring, sometimes quietly dutiful." },
    "4-5": { score: 50, note: "Opposite temperaments. Works if each respects the other&rsquo;s core." },
    "4-6": { score: 88, note: "Foundational and loving. Home on solid ground." },
    "4-7": { score: 80, note: "Thoughtful and private. Both need quiet to love well." },
    "4-8": { score: 92, note: "Disciplined co-builders. Often a lifelong partnership." },
    "4-9": { score: 65, note: "4 wants today; 9 looks ahead. Meet at purpose." },
    "5-5": { score: 75, note: "Dynamic but demands renewed commitment." },
    "5-6": { score: 60, note: "5 travels, 6 tends. Balance of roots and wings." },
    "5-7": { score: 78, note: "Intellectually exciting. Both savour solitude." },
    "5-8": { score: 68, note: "Drive meets drive. Align ambitions clearly." },
    "5-9": { score: 85, note: "Wide horizons, few walls. Great pair for travel." },
    "6-6": { score: 88, note: "Devoted and domestic. Remember to play." },
    "6-7": { score: 70, note: "6 cares, 7 studies. Teach each other softness and depth." },
    "6-8": { score: 80, note: "6 steadies 8&rsquo;s push. Powerful, grounded pair." },
    "6-9": { score: 90, note: "Both caretakers of a bigger circle. Quietly magnificent." },
    "7-7": { score: 85, note: "Twin seekers. Deeply spiritual; can get too private." },
    "7-8": { score: 62, note: "7 wants meaning; 8 wants measurable. Choose the aim." },
    "7-9": { score: 82, note: "Philosopher and humanitarian. Natural mutual respect." },
    "8-8": { score: 78, note: "Two executives. Clear finances; softer at home." },
    "8-9": { score: 72, note: "Ambition + idealism. A worthy combination." },
    "9-9": { score: 90, note: "Expansive, service-oriented, sometimes far-sighted to the point of drift." },
  };
  return matrix[key] ?? { score: 60, note: "An unusual pairing — bring curiosity." };
}

function reduceOnce(n: number): number {
  return String(n).split("").reduce((a, b) => a + Number(b), 0);
}

export const PERSONAL_YEAR_THEME: Record<number, { keyword: string; blurb: string }> = {
  1: { keyword: "Year of beginnings", blurb: "Plant seeds. What you start now defines the 9-year cycle ahead." },
  2: { keyword: "Year of partnership", blurb: "Slow down, listen, cooperate. Relationships open the next door." },
  3: { keyword: "Year of expression",  blurb: "Create, speak, celebrate. Your creative voice asks to be heard." },
  4: { keyword: "Year of foundation",  blurb: "Build discipline and structure. Reward comes from steady hands." },
  5: { keyword: "Year of change",      blurb: "Move, travel, adapt. Expect the unexpected — and let it in." },
  6: { keyword: "Year of responsibility", blurb: "Home, love, service. Those who need you need you now." },
  7: { keyword: "Year of reflection",  blurb: "Study, retreat, go inward. Answers surface when you stop looking." },
  8: { keyword: "Year of abundance",   blurb: "Material harvest. Command authority; handle money with integrity." },
  9: { keyword: "Year of completion",  blurb: "Release what's finished. Make space for the new cycle to arrive." },
  11: { keyword: "Master year of insight",  blurb: "High sensitivity and inspiration. Share what you receive." },
  22: { keyword: "Master year of building", blurb: "Build something that outlives the year. You have the capacity." },
  33: { keyword: "Master year of service",  blurb: "Lead by love. A rare alignment — use it gently." },
};

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
