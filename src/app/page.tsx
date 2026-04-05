import Navbar from "@/components/Navbar";
import ServicesSection from "@/components/ServicesSection";
import ReadingsSection from "@/components/ReadingsSection";
import StatsSection from "@/components/StatsSection";
import JournalSection from "@/components/JournalSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import AstroChat from "@/components/AstroChat";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <ServicesSection />
        <ReadingsSection />
        <StatsSection />
        <JournalSection />
        <NewsletterSection />
      </main>
      <Footer />

      {/* Sentinel: IntersectionObserver in AstroChat watches this element.
          When it enters the viewport (user reached very bottom), chat opens. */}
      <div id="page-end" style={{ height: 1 }} aria-hidden="true" />

      {/* Chat overlay — client component, mounts after hydration */}
      <AstroChat />
    </>
  );
}
