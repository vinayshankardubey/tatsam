// Tatsam tools — each is a focused corner of the ancient corpus the seeker
// can step into. Clicking a tool opens the Ask chat scoped to its scripture.
//
// When Vertex AI is wired, use `systemScope` as the retrieval/filter instruction
// and `introMessage` as the first assistant turn. `starterPrompts` seed the
// empty state.

export type ToolCategory = "oracle" | "chart" | "counsel" | "daily";

export type TatsamTool = {
  id: string;
  name: string;
  /** Sanskrit/Hindi subtitle — displayed small under the name. */
  sanskrit?: string;
  category: ToolCategory;
  /** One-line hook for the tile. */
  tagline: string;
  /** Longer description for the tile / chat intro. */
  description: string;
  /** Short glyph shown on the tile (Devanagari letter, symbol, etc.). */
  glyph: string;
  /** Primary scripture source. */
  source: string;
  /** 3–5 prompts the seeker can tap in the empty state. */
  starterPrompts: string[];
  /** First assistant turn shown when the chat opens. */
  introMessage: string;
  /** Retrieval scope / system prompt hint for the answer engine. */
  systemScope: string;
  /** If set, the tile links to an existing page instead of the Ask chat. */
  href?: string;
};

export const CATEGORY_LABEL: Record<ToolCategory, string> = {
  oracle:  "Oracles",
  chart:   "Chart & numbers",
  counsel: "Counsel from the texts",
  daily:   "Daily rhythm",
};

export const CATEGORY_HINT: Record<ToolCategory, string> = {
  oracle:  "Pose a question, receive a passage drawn from scripture.",
  chart:   "Cast your chart, read your numbers, time your life.",
  counsel: "Ask the classical texts as you would a wise elder.",
  daily:   "Today, through the eyes of the old calendar.",
};

export const TATSAM_TOOLS: TatsamTool[] = [
  // ── Oracles ──────────────────────────────────────────────────
  {
    id: "shri-ram-shalaka",
    name: "Shri Ram Shalaka",
    sanskrit: "श्री राम शलाका प्रश्नावली",
    category: "oracle",
    tagline: "Nine letters, one answer — Tulsidas's classical oracle.",
    description:
      "The timeless Ram Shalaka from Goswami Tulsidas's Ramcharitmanas. Hold your question with Shri Ram in mind, and a letter of the Shalaka is drawn. The chaupai that falls is your counsel.",
    glyph: "राम",
    source: "Ramcharitmanas",
    starterPrompts: [
      "Will the path I am walking lead me where I hope?",
      "Should I forgive and close this chapter?",
      "Is the person I am thinking of right for me?",
      "Is this the right time to begin what I have in mind?",
    ],
    introMessage:
      "नमस्कार। Hold a clear yes/no question in your heart with Shri Ramchandra ji in mind. I will draw a letter from the Shalaka and read you the chaupai that falls — with a gentle interpretation in plain words.",
    systemScope:
      "Use ONLY Tulsidas's Ramcharitmanas. From the seeker's question, deterministically select one of the 9 Shalaka letters, return the associated chaupai in Awadhi + transliteration + a 2-3 line plain-English reading.",
  },
  {
    id: "gita-shalaka",
    name: "Gita Shalaka",
    sanskrit: "गीता शलाका",
    category: "oracle",
    tagline: "Open the Bhagavad Gita. Read the verse that meets you.",
    description:
      "Your question is placed against the 700 verses of the Bhagavad Gita. One verse is drawn as counsel, with Krishna's teaching rendered in plain English.",
    glyph: "गी",
    source: "Bhagavad Gita",
    starterPrompts: [
      "I am at a crossroads at work. What should I consider?",
      "Tell me how to live through something difficult right now.",
      "What does the Gita say about letting go of results?",
      "Should I continue this relationship?",
    ],
    introMessage:
      "Ask your question clearly. I will draw one verse from the Bhagavad Gita — the Sanskrit, its transliteration, and the teaching it holds for you today.",
    systemScope:
      "Use ONLY Bhagavad Gita verses. Return chapter.verse, Sanskrit line, transliteration, plain English meaning, and a 2-line application to the seeker's question.",
  },
  {
    id: "hanuman-chalisa",
    name: "Hanuman Chalisa",
    sanskrit: "श्री हनुमान चालीसा",
    category: "oracle",
    tagline: "For courage, dissolving obstacles, protection.",
    description:
      "The 40 verses of Tulsidas's Hanuman Chalisa as an oracle. When you need strength, clarity of action, or to move past fear, a chaupai is drawn to anchor you.",
    glyph: "हनु",
    source: "Hanuman Chalisa",
    starterPrompts: [
      "I need strength for something I am avoiding.",
      "What obstacle am I being asked to remove?",
      "How do I serve better without losing myself?",
      "Give me a chaupai for today.",
    ],
    introMessage:
      "Jai Shri Hanuman. Tell me what you are carrying today — I'll draw a chaupai from the Chalisa and read it as strength for you.",
    systemScope:
      "Use ONLY the 40 chaupais + 2 dohas of the Hanuman Chalisa. Return the chaupai number, Awadhi lines, transliteration, meaning, and a line on how it addresses the seeker's concern.",
  },
  {
    id: "durga-saptashati",
    name: "Durga Saptashati",
    sanskrit: "देवी महात्म्य",
    category: "oracle",
    tagline: "The Devi's blessing, when you need it most.",
    description:
      "From the Markandeya Purana's Devi Mahatmya, 700 verses praising Durga. An oracle for protection, courage, and grace in hard moments.",
    glyph: "दुर्गा",
    source: "Devi Mahatmya",
    starterPrompts: [
      "I need protection from something heavy.",
      "Help me stand in my own strength today.",
      "What does the Devi say to me right now?",
    ],
    introMessage:
      "Ma's blessings. Place your question in Her hands — I will read you a verse from the Saptashati and what it asks of you.",
    systemScope:
      "Use ONLY the Durga Saptashati (Devi Mahatmya). Return Adhyaya.Shloka, Sanskrit, transliteration, meaning, and its guidance for the seeker.",
  },
  {
    id: "vishnu-sahasranama",
    name: "Vishnu Sahasranama",
    sanskrit: "विष्णु सहस्रनाम",
    category: "oracle",
    tagline: "One of the thousand names, as guidance for today.",
    description:
      "From the Anushasana Parva of the Mahabharata, Bhishma's recitation to Yudhishthira. A single name from the thousand is offered to meditate on.",
    glyph: "विष्णु",
    source: "Mahabharata · Anushasana Parva",
    starterPrompts: [
      "Offer me a name of Vishnu to sit with today.",
      "What quality of the Lord is being asked of me?",
    ],
    introMessage:
      "Om Namo Bhagavate Vasudevaya. Tell me what you would like to reflect on and I will offer one of the thousand names as a contemplation.",
    systemScope:
      "Use ONLY the Vishnu Sahasranama. Return the name, its transliteration, its meaning per Shankaracharya's bhashya when appropriate, and a short contemplation for the seeker.",
  },

  // ── Chart & numbers ──────────────────────────────────────────
  {
    id: "kundli",
    name: "Kundli",
    sanskrit: "जन्म कुंडली",
    category: "chart",
    tagline: "Your birth chart, read by Brihat Parashara Hora.",
    description:
      "The foundational jyotish system — Lagna, houses, planets, dashas, yogas, nakshatras — cast from your date, time and place of birth.",
    glyph: "ज्यो",
    source: "Brihat Parashara Hora Shastra",
    href: "/dashboard/kundli",
    starterPrompts: [],
    introMessage: "",
    systemScope: "",
  },
  {
    id: "numerology",
    name: "Numerology",
    sanskrit: "अंक शास्त्र",
    category: "chart",
    tagline: "Chaldean + Pythagorean — the shape of your name and date.",
    description:
      "Your Life Path, Expression, Soul Urge, Personality and Personal Year — read through both classical numerology systems.",
    glyph: "९",
    source: "Pythagorean & Chaldean traditions",
    href: "/dashboard/numerology",
    starterPrompts: [],
    introMessage: "",
    systemScope: "",
  },
  {
    id: "compatibility",
    name: "Compatibility",
    sanskrit: "गुण मिलान",
    category: "chart",
    tagline: "Sun sign + life path for the person you're thinking of.",
    description:
      "A playful first look at compatibility with someone, drawing on sign elements and life-path resonance. For the full Vedic Guna Milan — book a Signature reading.",
    glyph: "♥",
    source: "Brihat Samhita · Numerology",
    href: "/dashboard/compatibility",
    starterPrompts: [],
    introMessage: "",
    systemScope: "",
  },
  {
    id: "muhurat",
    name: "Muhurat finder",
    sanskrit: "मुहूर्त",
    category: "chart",
    tagline: "An auspicious window, tuned to your chart and the sky.",
    description:
      "From Muhurta Chintamani: the combination of tithi, nakshatra, vara and yoga for what you are planning — a launch, an engagement, a house-warming.",
    glyph: "मु",
    source: "Muhurta Chintamani",
    starterPrompts: [
      "A good muhurat for signing a new lease next month.",
      "When should we hold our engagement ceremony?",
      "The best day to start a new venture in the next 30 days.",
    ],
    introMessage:
      "Tell me what you are planning, the city you are in, and any date range. I will cross the classical rules — tithi, nakshatra, vara, yoga — against your window and suggest the openings.",
    systemScope:
      "Use Muhurta Chintamani + Brihat Samhita muhurat sections. Return 1–3 candidate windows with the tithi/nakshatra/vara/yoga combination and a one-line reason.",
  },

  // ── Counsel ──────────────────────────────────────────────────
  {
    id: "upanishad-counsel",
    name: "Upanishadic counsel",
    sanskrit: "उपनिषद् विचार",
    category: "counsel",
    tagline: "The inner questions: Atman, Brahman, moksha.",
    description:
      "Ask the foundational Upanishads — Isha, Kena, Katha, Mundaka, Taittiriya, Chandogya, Brihadaranyaka — about the deepest questions of self and reality.",
    glyph: "उप",
    source: "Principal Upanishads",
    starterPrompts: [
      "What is the Upanishadic teaching on death?",
      "How does one know the Self?",
      "What does 'tat tvam asi' actually mean for me?",
      "The Katha Upanishad on choosing shreyas over preyas.",
    ],
    introMessage:
      "The rishis spoke across centuries about the same few things. Ask your question — I will return with the Upanishad that answers it.",
    systemScope:
      "Use ONLY the ten principal Upanishads. Return passage, Sanskrit, transliteration, Shankaracharya's reading when relevant, and a plain-English application.",
  },
  {
    id: "yoga-sutras",
    name: "Yoga Sutras",
    sanskrit: "योग सूत्र",
    category: "counsel",
    tagline: "Patanjali on the mind, its turbulence, and its quieting.",
    description:
      "196 terse sutras — a complete manual for the mind. Ask about anxiety, distraction, purpose, or practice.",
    glyph: "यो",
    source: "Patanjali Yoga Sutras",
    starterPrompts: [
      "Why do I keep coming back to the same worry?",
      "Patanjali's view on dealing with a difficult person.",
      "What does the Yoga Sutra say about starting a practice?",
    ],
    introMessage:
      "Patanjali doesn't give advice — he gives method. Tell me what is on your mind and I'll draw the sutra that addresses it.",
    systemScope:
      "Use ONLY Patanjali's Yoga Sutras. Return Pada.Sutra, Sanskrit, transliteration, Vyasa bhashya where relevant, and a practical takeaway.",
  },
  {
    id: "chanakya-niti",
    name: "Chanakya Niti",
    sanskrit: "चाणक्य नीति",
    category: "counsel",
    tagline: "Pragmatic, sharp, sometimes uncomfortable — practical wisdom.",
    description:
      "From the Arthashastra's author — counsel on money, friendship, work, enemies, and the real world. Not always gentle, but reliably useful.",
    glyph: "चा",
    source: "Chanakya Niti",
    starterPrompts: [
      "Chanakya's advice on handling a difficult colleague.",
      "What does he say about money and its keepers?",
      "A verse on when to stay silent.",
    ],
    introMessage:
      "Ask Chanakya directly. He rarely softens, but he is rarely wrong. What are you navigating?",
    systemScope:
      "Use ONLY Chanakya Niti. Return Adhyaya.Shloka, Sanskrit, transliteration, meaning, and a single-sentence application.",
  },
  {
    id: "vidur-niti",
    name: "Vidur Niti",
    sanskrit: "विदुर नीति",
    category: "counsel",
    tagline: "The Mahabharata's quiet master, on dharma in public life.",
    description:
      "Vidura to Dhritarashtra in the Udyoga Parva — ethical counsel for those in power, and those who must live next to it.",
    glyph: "वि",
    source: "Mahabharata · Udyoga Parva",
    starterPrompts: [
      "Vidura's test of a worthy person.",
      "How should one speak to someone in power?",
      "On the handling of wealth and duty.",
    ],
    introMessage:
      "Vidura is the voice of clarity in a turbulent court. Ask him your question of ethics, leadership, or speech.",
    systemScope:
      "Use ONLY Vidur Niti (Mahabharata Udyoga Parva). Return Shloka reference, Sanskrit, transliteration, meaning, and a contemporary application.",
  },

  // ── Daily ────────────────────────────────────────────────────
  {
    id: "panchang",
    name: "Today's Panchang",
    sanskrit: "पंचांग",
    category: "daily",
    tagline: "Tithi, Nakshatra, Yoga, Rahu Kaal — the five limbs of time.",
    description:
      "A full classical almanac for the day: auspicious windows, lunar position, weekday deity, lucky rhythm.",
    glyph: "पं",
    source: "Classical panchang",
    href: "/dashboard/panchang",
    starterPrompts: [],
    introMessage: "",
    systemScope: "",
  },
  {
    id: "cosmos",
    name: "Cosmic calendar",
    sanskrit: "सं 2026",
    category: "daily",
    tagline: "Festivals, eclipses, retrogrades — the year ahead.",
    description:
      "Upcoming sky events across the year: Akshaya Tritiya, Guru Purnima, Diwali, Mercury retrogrades, solstices, eclipses.",
    glyph: "★",
    source: "Vedic calendar",
    href: "/dashboard/cosmos",
    starterPrompts: [],
    introMessage: "",
    systemScope: "",
  },
  {
    id: "horoscope",
    name: "Today's horoscope",
    sanskrit: "राशिफल",
    category: "daily",
    tagline: "A single line for your sign — new every morning.",
    description:
      "A short, grounded reflection for your sun sign, stable through the day. For contemplation, not prescription.",
    glyph: "♈",
    source: "Classical rashi tradition",
    href: "/dashboard/horoscope",
    starterPrompts: [],
    introMessage: "",
    systemScope: "",
  },
];

export function findTool(id: string | undefined | null): TatsamTool | null {
  if (!id) return null;
  return TATSAM_TOOLS.find((t) => t.id === id) ?? null;
}
