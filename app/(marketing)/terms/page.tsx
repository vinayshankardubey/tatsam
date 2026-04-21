export const metadata = {
  title: "Terms of service — Tatsam",
  description:
    "The agreement between you and Tatsam: what the service is, what it is not, and the practical terms of use.",
};

const UPDATED = "21 April 2026";

export default function TermsPage() {
  return (
    <div className="max-w-[820px] mx-auto px-5 lg:px-8 py-12 lg:py-20">
      <p className="text-xs font-mono text-brown/55 uppercase tracking-[0.2em] mb-3">
        Terms of service
      </p>
      <h1 className="text-4xl md:text-5xl font-display text-brown leading-[1.05]">
        The agreement between you and Tatsam.
      </h1>
      <p className="mt-4 text-sm font-mono text-brown/45">
        Last updated: {UPDATED}
      </p>

      <div className="mt-12 space-y-10 text-brown/85 leading-relaxed">
        <Section title="1. Accepting these terms">
          <p>
            By creating an account or using Tatsam, you agree to these terms.
            If you don&rsquo;t agree, please don&rsquo;t use the service.
          </p>
        </Section>

        <Section title="2. What Tatsam is">
          <p>
            Tatsam is a consumer product that lets you ask questions and
            returns answers grounded in classical Indian scripture, with
            citations. It includes tools for kundli, numerology, panchang, and
            scripture-scoped chat.
          </p>
        </Section>

        <Section title="3. What Tatsam is not">
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Not a substitute for a licensed physician, therapist, lawyer, or
              financial advisor. Answers are not medical, legal, or financial
              advice.
            </li>
            <li>
              Not a deterministic oracle. Answers reflect the traditional
              reading of the texts, not a guarantee of outcome.
            </li>
            <li>
              Not a platform for emergencies. If you are in crisis, please
              reach the appropriate local helpline.
            </li>
          </ul>
        </Section>

        <Section title="4. Your account">
          <p>
            You must be at least 18 to create an account. Keep your email
            access secure — anyone with access to your inbox can sign into
            your Tatsam account via the one-time code. You&rsquo;re
            responsible for activity on your account.
          </p>
        </Section>

        <Section title="5. Acceptable use">
          <ul className="list-disc pl-6 space-y-2">
            <li>Don&rsquo;t attempt to extract, scrape, or reverse-engineer the corpus or the system.</li>
            <li>Don&rsquo;t use Tatsam to generate harmful, illegal, or abusive content.</li>
            <li>Don&rsquo;t impersonate another person&rsquo;s birth details to request a chart you don&rsquo;t have the right to.</li>
            <li>Don&rsquo;t resell Tatsam output without citing it honestly as Tatsam-generated.</li>
          </ul>
        </Section>

        <Section title="6. Paid features">
          <p>
            Some Tatsam features (deeper readings, priority windows) are paid.
            Prices are shown in-product in INR, inclusive of applicable taxes
            where required. Refunds are handled in good faith — write to us
            within 7 days if an answer was materially wrong, and we&rsquo;ll
            refund and publish the correction.
          </p>
        </Section>

        <Section title="7. Content you provide">
          <p>
            The questions you ask and the context you share remain yours. You
            grant Tatsam a limited licence to process them for the sole
            purpose of returning your answers and serving your account. We do
            not use them for model training — see our{" "}
            <a href="/pledge" className="text-maroon hover:underline">
              no-training pledge
            </a>
            .
          </p>
        </Section>

        <Section title="8. Content Tatsam returns">
          <p>
            Answers are drawn from classical, publicly-available texts.
            Citations are provided so you can read the original. We believe in
            good-faith accuracy; we do not warrant that every interpretation
            will be correct for every seeker, every time. Read with care.
          </p>
        </Section>

        <Section title="9. Availability and changes">
          <p>
            We aim for high uptime, but Tatsam is provided &ldquo;as is.&rdquo;
            We may add, remove, or change features. If a change materially
            reduces what you&rsquo;ve paid for, we&rsquo;ll refund the
            difference.
          </p>
        </Section>

        <Section title="10. Limitation of liability">
          <p>
            To the fullest extent permitted by law, Tatsam&rsquo;s total
            liability for any claim arising from the service is limited to
            what you paid us in the preceding 12 months, or INR 10,000 —
            whichever is greater.
          </p>
        </Section>

        <Section title="11. Termination">
          <p>
            You can close your account any time from settings. We may suspend
            accounts that violate these terms, with notice where possible.
            Deletion follows the schedule in our{" "}
            <a href="/privacy" className="text-maroon hover:underline">
              privacy policy
            </a>
            .
          </p>
        </Section>

        <Section title="12. Governing law">
          <p>
            These terms are governed by the laws of India. Disputes, if any,
            are subject to the exclusive jurisdiction of the courts of New
            Delhi.
          </p>
        </Section>

        <Section title="13. Contact">
          <p>
            Legal questions:{" "}
            <a
              href="mailto:legal@tatsam.co"
              className="text-maroon hover:underline"
            >
              legal@tatsam.co
            </a>
            . Everything else:{" "}
            <a
              href="mailto:hello@tatsam.co"
              className="text-maroon hover:underline"
            >
              hello@tatsam.co
            </a>
            .
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
