import Link from "next/link";

export const metadata = {
  title: "How Tatsam answers — scripture, read with care",
  description:
    "The four steps behind every answer: you ask, we retrieve from classical sources, we interpret them in the traditional way, and we cite the verse so you can read it yourself.",
};

const STEPS = [
  {
    n: "01",
    title: "You ask, in your own words.",
    body: "No form. No dropdowns. Ask the way you would ask a person — in English, in Hindi, in anything between. Tatsam understands life questions, chart questions, decisions, and the softer ones that don't fit a box.",
  },
  {
    n: "02",
    title: "We retrieve only from the corpus.",
    body: "Your question is matched against a curated library of classical Sanskrit sources — the Gita, the principal Upanishads, Ramcharitmanas, Brihat Parashara Hora, Patanjali's Yoga Sutras, Chanakya Niti, and more. Nothing from the open internet. Nothing self-generated without grounding.",
  },
  {
    n: "03",
    title: "We interpret in the classical way.",
    body: "Retrieved passages are read through the traditional Bhashya lens — same commentaries your acharya would turn to. The goal is not to sound mystical; the goal is to say what the text says, clearly.",
  },
  {
    n: "04",
    title: "You get a citation you can verify.",
    body: "Every answer carries the source and the chapter-and-verse it drew from. If a claim cannot be cited, we say so. You are always one tap away from reading the original Sanskrit — or a faithful translation.",
  },
];

const NOT_DOING = [
  "We don't predict the lottery, death, or marriage dates.",
  "We don't moralize, shame, or dispense generic self-help.",
  "We don't replace your acharya, your doctor, or your therapist.",
  "We don't use your questions to train models. Not ours, not anyone's.",
];

export default function HowWeAnswerPage() {
  return (
    <div className="max-w-[900px] mx-auto px-5 lg:px-8 py-12 lg:py-20">
      {/* Hero */}
      <section className="mb-14">
        <p className="text-xs font-mono text-brown/55 uppercase tracking-[0.2em] mb-3">
          How we answer
        </p>
        <h1 className="text-4xl md:text-6xl font-display text-brown leading-[1.05]">
          Scripture, read with care —
          <br />
          <span className="text-brown/55">and cited, every time.</span>
        </h1>
        <p className="mt-5 text-brown/70 text-lg leading-relaxed max-w-2xl">
          Tatsam is not a chatbot that sounds spiritual. It is a retrieval layer
          over the classical Indian corpus, interpreted in the traditional way,
          with citations attached to everything. Here is how it works.
        </p>
      </section>

      {/* Steps */}
      <section className="mb-16">
        <ol className="space-y-8">
          {STEPS.map((s) => (
            <li
              key={s.n}
              className="rounded-2xl bg-white border border-gold/30 p-6 md:p-8 flex gap-5 md:gap-7"
            >
              <span className="shrink-0 font-mono text-maroon text-base md:text-lg pt-1">
                {s.n}
              </span>
              <div className="min-w-0">
                <h2 className="font-display text-xl md:text-2xl text-brown leading-tight">
                  {s.title}
                </h2>
                <p className="mt-2 text-brown/70 leading-relaxed">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* What Tatsam is not */}
      <section className="mb-16 rounded-2xl bg-amber/15 border border-gold/30 p-6 md:p-8">
        <p className="text-xs font-mono text-brown/55 uppercase tracking-wider mb-2">
          What we do not do
        </p>
        <h2 className="font-display text-2xl text-brown mb-4">
          Honest about our limits.
        </h2>
        <ul className="grid gap-2.5">
          {NOT_DOING.map((l) => (
            <li key={l} className="flex gap-3 text-brown/75">
              <span className="text-maroon mt-1">✕</span>
              <span>{l}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      <section className="rounded-2xl bg-gradient-to-br from-amber/25 via-ivory to-gold/15 border border-gold/30 p-8 md:p-10 flex items-center justify-between gap-5 flex-wrap">
        <div className="min-w-0">
          <p className="font-display text-2xl text-brown">
            Have a question in mind?
          </p>
          <p className="text-brown/65 mt-1">
            Ask it in your own words. You&rsquo;ll get a grounded answer with a
            citation — usually within seconds.
          </p>
        </div>
        <Link
          href="/dashboard/ask"
          className="inline-flex items-center h-11 px-6 rounded-full bg-maroon text-ivory hover:bg-maroon/90 shrink-0"
        >
          Ask Tatsam →
        </Link>
      </section>
    </div>
  );
}
