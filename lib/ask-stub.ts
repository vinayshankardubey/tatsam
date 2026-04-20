/**
 * Stub scripture-grounded response generator. Returns a plausible answer with
 * a citation so the chat UI can be exercised before Gemini/Vertex is wired.
 *
 * Swap `generateAnswer` for a Vertex AI call when ready. Keep the return
 * shape (content + citation) the same so the UI stays stable.
 */

export type Citation = {
  source: string;
  ref: string;
  passage?: string;
};

const BUCKETS: Array<{
  match: (q: string) => boolean;
  reply: (q: string) => { content: string; citation: Citation };
}> = [
  {
    match: (q) => /\b(job|career|work|role|promotion|resign|quit|offer)\b/i.test(q),
    reply: () => ({
      content: `The Gita's answer here is unsentimental: don't measure the decision by the outcome, measure it by whether the action belongs to your dharma. "Karmaṇy-evādhikāras te, mā phaleṣu kadācana" — you have a right to action, not to its fruits. Read the offer (or the resignation) the same way: is this the work you are suited to, and would you do it even if the reward were average? If yes, move. If you are chasing the fruit, pause.

A practical companion: journal for nine days about who you are when the work is boring. That's the real role you're negotiating.`,
      citation: { source: "Bhagavad Gita", ref: "2.47", passage: "Karmaṇy-evādhikāras te…" },
    }),
  },
  {
    match: (q) => /\b(love|marry|marriage|partner|relationship|divorce|break(?:-|\s)?up|fiance)\b/i.test(q),
    reply: () => ({
      content: `Vivaha in the classical texts is neither destiny nor romance — it is a samskara, a shaped commitment between two people and their lineages. Brihat Samhita frames compatibility as resonance of temperament (vasya), auspiciousness (tara) and support (yoni), but the final call rests with your own steadiness.

If you are asking about someone specific: share both birth details and I'll do a Guna Milan cross-read alongside the verses.`,
      citation: { source: "Brihat Samhita", ref: "Vivaha Adhyaya" },
    }),
  },
  {
    match: (q) => /\b(money|finance|wealth|debt|business|investment|save)\b/i.test(q),
    reply: () => ({
      content: `The Isha Upanishad opens with a radical line — tena tyaktena bhuñjīthā — "enjoy by letting go." Classical jyotish puts money under the 2nd, 5th, 9th and 11th houses, but the ancient money teaching is inner: abundance arrives when grasping loosens.

Practically: look at your 2nd house lord's current state (I can check if you share your chart) and pair it with one week of tracking expenses without judgement.`,
      citation: { source: "Isha Upanishad", ref: "Verse 1" },
    }),
  },
  {
    match: (q) => /\b(anxious|anxiety|fear|afraid|worried|depress|sad|low)\b/i.test(q),
    reply: () => ({
      content: `The Yoga Sutras name five obstacles (kleshas) at the root of the mind's turbulence: avidya (not-seeing), asmita (mistaken self), raga (clinging), dvesha (aversion), and abhinivesha (the quiet fear of ending). Your anxiety is usually one of these, wearing a day's costume.

Patanjali's antidote is not advice — it is practice. Start with pratipaksha bhavana: when a dark thought arrives, place its opposite beside it, gently. Not to argue, just to let them sit together.`,
      citation: { source: "Yoga Sutras of Patanjali", ref: "2.33" },
    }),
  },
  {
    match: (q) => /\b(purpose|dharma|life ?path|calling|meaning)\b/i.test(q),
    reply: () => ({
      content: `Krishna tells Arjuna: śreyān sva-dharmo viguṇaḥ para-dharmāt sv-anuṣṭhitāt — one's own dharma, even imperfectly done, is better than another's done well. Purpose isn't found; it is recognised. It usually shows up as the thing you would do even if no one paid or praised you.

Your chart's 10th house and the position of Surya tell part of this story; your Life Path number tells another. If you share your details, I can read both together.`,
      citation: { source: "Bhagavad Gita", ref: "3.35" },
    }),
  },
  {
    match: (q) => /\b(time|timing|muhurat|when|auspicious|start|launch|begin)\b/i.test(q),
    reply: () => ({
      content: `Muhurta Chintamani treats time as a living field — some windows open, some close. The classical rules combine tithi, nakshatra, vara (weekday), yoga and karana. For a beginning that needs to endure, pick a Shukla-paksha tithi (waxing moon), a benefic nakshatra like Rohini or Pushya, and avoid Rahu Kaal.

Tell me what you're timing and I'll narrow a window against today's panchanga.`,
      citation: { source: "Muhurta Chintamani", ref: "Tithi Adhyaya" },
    }),
  },
  {
    match: (q) => /\b(chart|kundli|horoscope|sign|moon|lagna|nakshatra|dasha)\b/i.test(q),
    reply: () => ({
      content: `A kundli has four coordinates: the date, time, and place of birth, plus the Lagna rising at that moment. Brihat Parashara Hora — the foundational text — reads them as a single woven map: the rashis show the field, the planets the players, the dashas the seasons.

Share your birth details and I'll walk the chart with you, citing which classical sutra each reading draws from.`,
      citation: { source: "Brihat Parashara Hora Shastra", ref: "Ch. 3 — Rashi Adhyaya" },
    }),
  },
];

const FALLBACK = {
  content: `I sat with your question and drew a few lines from the classical corpus. The ancient texts rarely answer a question directly — they return it, polished.

A few ways in, depending on where your question is rooted:
• Dharma and action → Bhagavad Gita, Chapters 2–3
• Inner state and practice → Yoga Sutras, Book 1
• Timing and muhurat → Muhurta Chintamani
• Chart-specific → Brihat Parashara Hora

Rephrase with a little more context — your chart, or the specific situation — and I'll return a sharper citation.`,
  citation: { source: "Classical corpus", ref: "multi-source" } as Citation,
};

/**
 * Generate a plausible scripture-grounded answer. Deterministic per question
 * (no randomness) — swap with a Vertex AI call when ready.
 *
 * When `toolId` is supplied, answers are scoped to that tool's source. For the
 * stub, we just pin the citation to the tool's primary source and keep the
 * body generic-ish. The real Vertex call will honour the tool's `systemScope`.
 */
export function generateAnswer(
  question: string,
  toolId?: string | null,
): { content: string; citation: Citation } {
  const q = question.trim();

  if (toolId) {
    const tooled = generateToolAnswer(q, toolId);
    if (tooled) return tooled;
  }

  for (const bucket of BUCKETS) {
    if (bucket.match(q)) return bucket.reply(q);
  }
  return FALLBACK;
}

const TOOL_REPLIES: Record<string, (q: string) => { content: string; citation: Citation }> = {
  "shri-ram-shalaka": (q) => {
    // 9 Shalaka letters. Pick deterministically from the question.
    const letters = ["स", "ह", "न", "स्", "ज", "क", "अ", "त्", "त"];
    const idx = Math.abs(q.length + q.charCodeAt(0)) % letters.length;
    const letter = letters[idx];
    return {
      content: `श्रीराम जी की कृपा से तुम्हारे प्रश्न पर शलाका का "${letter}" अक्षर आया है।

The chaupai that falls from this letter is a gentle green light — the path you hold in mind is agreeable to dharma, but it asks patience and restraint. Act with steady devotion (bhakti), not rush. When in doubt, recall: "सिय राममय सब जग जानी, करहुं प्रनाम जोरि जुग पानी" — every face you meet is Ram's; bow, then act.

(Full chaupai delivered in Awadhi + transliteration when Gemini is connected.)`,
      citation: { source: "Ramcharitmanas", ref: `Shalaka letter: ${letter}` },
    };
  },
  "gita-shalaka": () => ({
    content: `The verse drawn for your question is Gita 2.47 — "karmaṇy-evādhikāras te, mā phaleṣu kadācana" — you have a right to action, not to its fruits. Read your situation by this rule: is the action itself worthy, regardless of its reward? If yes, move. If the only thing pulling you forward is the reward, pause.`,
    citation: { source: "Bhagavad Gita", ref: "2.47" },
  }),
  "hanuman-chalisa": () => ({
    content: `The chaupai drawn is "भूत पिशाच निकट नहीं आवे, महाबीर जब नाम सुनावे" — where Hanuman's name is remembered, fear cannot settle. Whatever is weighing on you today, keep his name on your breath for the next 40 minutes. That's the remedy Tulsidas gives.`,
    citation: { source: "Hanuman Chalisa", ref: "Chaupai 23" },
  }),
  "durga-saptashati": () => ({
    content: `"Ya devi sarva-bhuteshu shakti-rupena samsthita" — the Devi lives as shakti in every being, you included. Your question is met with her blessing of courage (shakti). Don't seek permission for the next step; she has already given it.`,
    citation: { source: "Devi Mahatmya", ref: "5.14 (Narayani Stuti)" },
  }),
  "vishnu-sahasranama": () => ({
    content: `The name offered to you is **Achyutah** — "the one who never slips, never falls." Meditate on this today: there is a part of you that cannot be lost, even when outer things fail. Let that part lead your response.`,
    citation: { source: "Vishnu Sahasranama", ref: "Name 100 — Achyutah" },
  }),
  "upanishad-counsel": () => ({
    content: `The Katha Upanishad distinguishes two roads: shreyas (the good) and preyas (the pleasant). Your question sits at their crossroads. The rishis say the wise always choose shreyas, even when it is harder. Not because pleasure is bad, but because what pleases passes; what is good, remains.`,
    citation: { source: "Katha Upanishad", ref: "1.2.2" },
  }),
  "yoga-sutras": () => ({
    content: `Patanjali's answer: "pratipaksha-bhavanam" — when a disturbing thought arrives, place its opposite gently beside it. Don't fight the thought; simply let the counter-thought keep it company. Over a few days, the weight shifts.`,
    citation: { source: "Yoga Sutras", ref: "2.33" },
  }),
  "chanakya-niti": () => ({
    content: `Chanakya would say: "यस्य नास्ति स्वयं प्रज्ञा, शास्त्रं तस्य करोति किम्" — for the one without their own discernment, scripture itself is useless. Read your own signal first. The answer is not external.`,
    citation: { source: "Chanakya Niti", ref: "10.10" },
  }),
  "vidur-niti": () => ({
    content: `Vidura to Dhritarashtra: a wise person is known by eight marks — prajna (insight), kulinata (lineage), indriya-samyama (self-control), shastra-jnana (learning), parakrama (valour), measured speech, giving generously, and gratitude. Ask yourself which one your situation is testing today.`,
    citation: { source: "Vidur Niti", ref: "Udyoga Parva 33.44" },
  }),
  "muhurat": () => ({
    content: `Given your window, the openings look strongest where a Shukla-paksha tithi coincides with a benefic nakshatra (Rohini, Mrigashira, Pushya, Hasta, Chitra, Swati, Anuradha, Shravana, Revati). I'll refine to specific date-times when you share the exact window and city — once Vertex is connected.`,
    citation: { source: "Muhurta Chintamani", ref: "Muhurta selection rules" },
  }),
};

function generateToolAnswer(
  question: string,
  toolId: string,
): { content: string; citation: Citation } | null {
  const reply = TOOL_REPLIES[toolId];
  return reply ? reply(question) : null;
}

export const STARTER_PROMPTS = [
  "Should I take the role I was offered, or wait?",
  "I feel anxious about a decision I need to make this week.",
  "Tell me what my chart says about money this year.",
  "When is an auspicious time to begin something new?",
  "What is the Gita's view on commitment vs freedom?",
];
