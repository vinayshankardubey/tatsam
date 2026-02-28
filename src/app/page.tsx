import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TickerSection from "@/components/TickerSection";
import ServicesSection from "@/components/ServicesSection";
import ReadingsSection from "@/components/ReadingsSection";
import ZodiacSection from "@/components/ZodiacSection";
import BrandSection from "@/components/BrandSection";
import StatsSection from "@/components/StatsSection";
import JournalSection from "@/components/JournalSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <TickerSection />
        <ServicesSection />
        <ReadingsSection />
        <ZodiacSection />
        <BrandSection />
        <StatsSection />
        <JournalSection />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
