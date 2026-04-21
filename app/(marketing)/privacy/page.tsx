import Link from "next/link";

export const metadata = {
  title: "Privacy — Tatsam",
  description:
    "What Tatsam collects, why we collect it, how long we keep it, and the rights you have over your data.",
};

const UPDATED = "21 April 2026";

export default function PrivacyPage() {
  return (
    <div className="max-w-[820px] mx-auto px-5 lg:px-8 py-12 lg:py-20">
      {/* Hero */}
      <p className="text-xs font-mono text-brown/55 uppercase tracking-[0.2em] mb-3">
        Privacy policy
      </p>
      <h1 className="text-4xl md:text-5xl font-display text-brown leading-[1.05]">
        What we collect, why, and for how long.
      </h1>
      <p className="mt-4 text-sm font-mono text-brown/45">
        Last updated: {UPDATED}
      </p>

      {/* TL;DR */}
      <section className="mt-10 rounded-2xl bg-amber/15 border border-gold/30 p-6 md:p-8">
        <p className="text-xs font-mono text-brown/55 uppercase tracking-wider mb-2">
          The short version
        </p>
        <p className="text-brown/80 leading-relaxed">
          We store only what&rsquo;s needed to sign you in, remember your chart,
          and return your past answers. We do not train models on your
          questions. We do not sell your data. You can export or delete
          everything any time. The detailed policy follows, in plain
          language.
        </p>
      </section>

      <div className="mt-12 space-y-10 text-brown/85 leading-relaxed">
        <Section title="1. Who runs Tatsam">
          <p>
            Tatsam is operated by Tatsam Labs, India. Privacy queries go to{" "}
            <a
              href="mailto:privacy@tatsam.co"
              className="text-maroon hover:underline"
            >
              privacy@tatsam.co
            </a>
            .
          </p>
        </Section>

        <Section title="2. What we collect">
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Account basics</strong> — your email, verified via
              one-time code. A name and phone if you choose to add them.
            </li>
            <li>
              <strong>Birth details</strong> — date, time, and place of birth,
              used only to compute your chart. Stored encrypted at rest.
            </li>
            <li>
              <strong>Your conversations with Tatsam</strong> — the questions
              you ask, the answers returned, and the citations they carry.
              Kept so you can re-read them later.
            </li>
            <li>
              <strong>Minimal usage telemetry</strong> — device and browser
              type, a session identifier, and which pages you open. No
              third-party ad pixels.
            </li>
          </ul>
        </Section>

        <Section title="3. Why we collect it">
          <ul className="list-disc pl-6 space-y-2">
            <li>To let you sign in.</li>
            <li>To cast your kundli and personalise the panchang.</li>
            <li>To return the answer you asked for, with a citation you can verify.</li>
            <li>To keep the product working, catch abuse, and fix bugs.</li>
          </ul>
        </Section>

        <Section title="4. What we do not do">
          <ul className="list-disc pl-6 space-y-2">
            <li>
              We do not use your conversations to train any model. See our{" "}
              <Link href="/pledge" className="text-maroon hover:underline">
                no-training pledge
              </Link>{" "}
              for the specifics.
            </li>
            <li>We do not sell data. There is no advertising business here.</li>
            <li>
              We do not share your chart or questions with third parties outside
              what is strictly necessary to serve your own answer (generation
              vendor, email delivery, hosting). Each sub-processor is listed in
              our DPA and audited annually.
            </li>
          </ul>
        </Section>

        <Section title="5. How long we keep it">
          <p>
            Account and chart data live as long as your account does. Delete
            your account and we delete all of it within 30 days — including
            backups. Short-lived logs (auth, errors) are rotated within 90
            days.
          </p>
        </Section>

        <Section title="6. Your rights">
          <ul className="list-disc pl-6 space-y-2">
            <li>Access — request a copy of everything we hold on you.</li>
            <li>Correction — fix anything that is wrong.</li>
            <li>Deletion — erase your account and its data.</li>
            <li>Portability — export your conversations as JSON.</li>
            <li>Withdraw consent — any time, for anything you opted into.</li>
          </ul>
          <p>
            Write to{" "}
            <a
              href="mailto:privacy@tatsam.co"
              className="text-maroon hover:underline"
            >
              privacy@tatsam.co
            </a>{" "}
            and we&rsquo;ll act within 30 days.
          </p>
        </Section>

        <Section title="7. Cookies">
          <p>
            We set a single, httpOnly session cookie so you stay signed in.
            That&rsquo;s it. No analytics cookies, no tracking pixels, no
            third-party cookies.
          </p>
        </Section>

        <Section title="8. Children">
          <p>
            Tatsam is not intended for users under 18. If you believe a minor
            has created an account, write to us and we will remove it.
          </p>
        </Section>

        <Section title="9. Changes to this policy">
          <p>
            When this policy changes in a way that affects you, we&rsquo;ll
            tell you before it takes effect — by email and in-app banner. The
            current version is always at this URL, dated at the top.
          </p>
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display text-xl md:text-2xl text-brown mb-3">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
