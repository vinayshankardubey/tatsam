import { Navigation } from "@/components/landing/navigation";
import { LandingBottomNav } from "@/components/landing/bottom-nav";
import { getCurrentUser } from "@/lib/supabase/current-user";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { InfrastructureSection } from "@/components/landing/infrastructure-section";
import { MetricsSection } from "@/components/landing/metrics-section";
import { IntegrationsSection } from "@/components/landing/integrations-section";
import { SecuritySection } from "@/components/landing/security-section";
import { DevelopersSection } from "@/components/landing/developers-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { CtaSection } from "@/components/landing/cta-section";
import { FooterSection } from "@/components/landing/footer-section";

export default async function Home() {
  const user = await getCurrentUser();
  const isSignedIn = !!user;
  return (
    <main id="top" className="relative min-h-screen overflow-x-hidden">
      <Navigation isSignedIn={isSignedIn} />
      <HeroSection />
      <FeaturesSection />
      <InfrastructureSection />
      <MetricsSection />
      <IntegrationsSection />
      <SecuritySection />
      <DevelopersSection />
      <TestimonialsSection />
      <PricingSection />
      <FooterSection />
      <LandingBottomNav isSignedIn={isSignedIn} />
    </main>
  );
}
