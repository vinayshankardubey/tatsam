import Link from "next/link";

export const metadata = {
  title: "Sources we read — the classical corpus behind Tatsam",
  description:
    "Tatsam answers are retrieved from a curated library of classical Sanskrit texts — the principal Upanishads, the Gita, the Ramcharitmanas, jyotish samhitas, and more.",
};

type Source = {
  name: string;
  sanskrit?: string;
  note: string;
  era?: string;
};

const GROUPS: Array<{
  label: string;
  sanskrit?: string;
  hint: string;
  sources: Source[];
}> = [
  {
    label: "Darshana & Vedanta",
    sanskrit: "दर्शन",
    hint: "The philosophical ground — what it means to be, to know, to act.",
    sources: [
      {
        name: "Bhagavad Gita",
        sanskrit: "भगवद्‌गीता",
        note: "18 chapters · 700 verses. Krishna to Arjuna on dharma, karma, bhakti, jnana, yoga.",
        era: "c. 200 BCE",
      },
      {
        name: "Principal Upanishads",
        sanskrit: "उपनिषद्",
        note: "Isha, Kena, Katha, Prashna, Mundaka, Mandukya, Taittiriya, Aitareya, Chandogya, Brihadaranyaka, Svetasvatara.",
        era: "c. 800–400 BCE",
      },
      {
        name: "Yoga Sutras of Patanjali",
        sanskrit: "योगसूत्र",
        note: "196 sutras across four padas. The canonical statement of yoga as a discipline.",
        era: "c. 400 CE",
      },
      {
        name: "Brahma Sutras",
        sanskrit: "ब्रह्मसूत्र",
        note: "Vedanta's systematizing text. Read alongside the Shankara and Ramanuja bhashyas.",
        era: "c. 200 BCE",
      },
    ],
  },
  {
    label: "Itihasa & Bhakti",
    sanskrit: "इतिहास",
    hint: "Narrative literature — history taught through story, song, and devotion.",
    sources: [
      {
        name: "Ramcharitmanas",
        sanskrit: "रामचरितमानस",
        note: "Tulsidas's Avadhi retelling of the Ramayana. The Shri Ram Shalaka is drawn from this text.",
        era: "1574 CE",
      },
      {
        name: "Valmiki Ramayana",
        sanskrit: "रामायण",
        note: "The original epic. 24,000 slokas, seven kandas.",
        era: "c. 500 BCE",
      },
      {
        name: "Mahabharata (core)",
        sanskrit: "महाभारत",
        note: "The eighteen parvans. We draw especially from Shanti Parva and Anushasana Parva for niti.",
        era: "c. 400 BCE",
      },
      {
        name: "Srimad Bhagavatam",
        sanskrit: "श्रीमद्भागवतम्",
        note: "Twelve cantos on Krishna bhakti, cosmology, and the avatars.",
        era: "c. 900 CE",
      },
    ],
  },
  {
    label: "Jyotish",
    sanskrit: "ज्योतिष",
    hint: "The science of time and chart — how the sky speaks into a life.",
    sources: [
      {
        name: "Brihat Parashara Hora Shastra",
        sanskrit: "बृहत्पाराशरहोराशास्त्र",
        note: "Parashara's foundational text on natal astrology. Houses, dashas, yogas.",
        era: "c. 600 CE",
      },
      {
        name: "Brihat Jataka",
        sanskrit: "बृहज्जातक",
        note: "Varahamihira's concise companion to Parashara. Famous for its yoga definitions.",
        era: "c. 550 CE",
      },
      {
        name: "Phaladipika",
        sanskrit: "फलदीपिका",
        note: "Mantreswara's encyclopedic treatment of predictive techniques and periods.",
        era: "c. 1300 CE",
      },
      {
        name: "Jaimini Sutras",
        sanskrit: "जैमिनीसूत्र",
        note: "The chara-dasha school — an alternative lens for timing events.",
        era: "c. 300 BCE",
      },
    ],
  },
  {
    label: "Niti & Practice",
    sanskrit: "नीति",
    hint: "Ethics, policy, and the art of living — advice that survived 2,000 years.",
    sources: [
      {
        name: "Chanakya Niti",
        sanskrit: "चाणक्यनीति",
        note: "Seventeen chapters on conduct, governance, wealth, and discernment.",
        era: "c. 300 BCE",
      },
      {
        name: "Hitopadesha",
        sanskrit: "हितोपदेश",
        note: "Narayana's frame-tale companion to the Panchatantra — teaching niti through story.",
        era: "c. 1200 CE",
      },
      {
        name: "Vidura Niti",
        sanskrit: "विदुरनीति",
        note: "Vidura's counsel to Dhritarashtra from the Mahabharata — compact, severe, timeless.",
        era: "c. 400 BCE",
      },
      {
        name: "Thirukkural",
        sanskrit: "திருக்குறள்",
        note: "Thiruvalluvar's Tamil ethical classic. 1,330 couplets on virtue, wealth, and love.",
        era: "c. 500 CE",
      },
    ],
  },
];

export default function SourcesPage() {
  return (
    <div className="max-w-[1100px] mx-auto px-5 lg:px-8 py-12 lg:py-20">
      {/* Hero */}
      <section className="mb-14">
        <p className="text-xs font-mono text-brown/55 uppercase tracking-[0.2em] mb-3">
          Sources
        </p>
        <h1 className="text-4xl md:text-6xl font-display text-brown leading-[1.05]">
          The corpus we read from.
        </h1>
        <p className="mt-5 text-brown/70 text-lg leading-relaxed max-w-2xl">
          Tatsam retrieves only from classical texts — no blogs, no forums, no
          open web. Below is the current reading list, grouped by tradition. It
          grows carefully, one text at a time.
        </p>
      </section>

      {/* Groups */}
      {GROUPS.map((g) => (
        <section key={g.label} className="mb-14">
          <div className="mb-5">
            <p className="text-xs font-mono text-brown/55 uppercase tracking-wider">
              {g.label}
              {g.sanskrit ? (
                <span className="ml-2 text-brown/35 normal-case">{g.sanskrit}</span>
              ) : null}
            </p>
            <h2 className="mt-1 text-xl md:text-2xl font-display text-brown">
              {g.hint}
            </h2>
          </div>
          <div className="grid gap-3 md:gap-4 md:grid-cols-2">
            {g.sources.map((s) => (
              <article
                key={s.name}
                className="rounded-2xl bg-white border border-gold/30 p-5 md:p-6 hover:border-maroon/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-1">
                  <h3 className="font-display text-lg text-brown leading-tight">
                    {s.name}
                  </h3>
                  {s.era ? (
                    <span className="shrink-0 text-[10px] font-mono text-brown/45 uppercase tracking-wider mt-1">
                      {s.era}
                    </span>
                  ) : null}
                </div>
                {s.sanskrit ? (
                  <p className="text-xs font-mono text-brown/55 mb-2">
                    {s.sanskrit}
                  </p>
                ) : null}
                <p className="text-sm text-brown/70 leading-relaxed">{s.note}</p>
              </article>
            ))}
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="rounded-2xl bg-gradient-to-br from-amber/25 via-ivory to-gold/15 border border-gold/30 p-8 md:p-10 flex items-center justify-between gap-5 flex-wrap">
        <div className="min-w-0">
          <p className="font-display text-2xl text-brown">
            Want a particular source weighted?
          </p>
          <p className="text-brown/65 mt-1">
            Each Tatsam tool scopes answers to a single classical text — choose
            yours.
          </p>
        </div>
        <Link
          href="/tatsam"
          className="inline-flex items-center h-11 px-6 rounded-full bg-maroon text-ivory hover:bg-maroon/90 shrink-0"
        >
          Explore the tools →
        </Link>
      </section>
    </div>
  );
}
