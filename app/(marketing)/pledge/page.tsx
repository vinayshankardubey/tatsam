import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export const metadata = {
  title: "No-training pledge — Tatsam",
  description:
    "We do not use your questions, answers, or chart to train any machine learning model. Ours, theirs, or anyone's.",
};

export default function PledgePage() {
  return (
    <div className="max-w-[820px] mx-auto px-5 lg:px-8 py-12 lg:py-20">
      <div className="inline-flex items-center gap-2 mb-6 text-xs font-mono text-brown/55 uppercase tracking-[0.2em]">
        <ShieldCheck className="w-4 h-4 text-gold" />
        <span>Our pledge to you</span>
      </div>

      <h1 className="text-4xl md:text-6xl font-display text-brown leading-[1.05]">
        Your questions are not
        <br />
        <span className="text-brown/55">training data.</span>
      </h1>

      <div className="mt-10 space-y-6 text-brown/80 text-lg leading-relaxed">
        <p>
          Most AI products today survive by turning what you type into training
          material. Every question, every confession, every half-written
          thought becomes a gradient update somewhere. That bargain is not one
          we are willing to make.
        </p>
        <p>
          Tatsam runs on a third-party model for generation, but{" "}
          <strong className="text-brown font-semibold">
            no Tatsam user&rsquo;s question or answer
          </strong>{" "}
          is sent into any training pipeline. The vendor agreement we operate
          under opts us out of data retention beyond what is strictly needed
          for the model to return your answer in real time.
        </p>
        <p>
          This also means we do not use your chats to &ldquo;improve the
          product&rdquo; behind your back. If a research effort ever benefits
          from real conversations, we will ask explicitly, on a per-user basis,
          with plain-language consent — and you will always be able to say no
          without losing the product.
        </p>
      </div>

      <section className="mt-14 rounded-2xl bg-white border border-gold/30 p-6 md:p-8">
        <p className="text-xs font-mono text-brown/55 uppercase tracking-wider mb-2">
          What we commit to
        </p>
        <h2 className="font-display text-2xl text-brown mb-5">
          The specific promises.
        </h2>
        <ul className="grid gap-3">
          {[
            "Your questions and answers are not used to train any model, ours or a third party's.",
            "Your birth details, chart, and profile stay inside your account. They are not sold, shared, or pooled.",
            "We do not use dark-pattern consent. Opt-ins are one clear check, never pre-ticked.",
            "If our retention practices change, we will tell you before the change takes effect — not after.",
            "You can export everything we hold about you, and you can delete it permanently, any time.",
          ].map((c) => (
            <li key={c} className="flex gap-3 text-brown/75 leading-relaxed">
              <span className="text-maroon mt-1">◆</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-10 text-sm text-brown/60">
        For the full policy, see{" "}
        <Link href="/privacy" className="text-maroon hover:underline">
          Privacy
        </Link>
        . For our data-processing commitments and vendor agreements, write to
        us at{" "}
        <a
          href="mailto:privacy@tatsam.co"
          className="text-maroon hover:underline"
        >
          privacy@tatsam.co
        </a>
        .
      </p>
    </div>
  );
}
