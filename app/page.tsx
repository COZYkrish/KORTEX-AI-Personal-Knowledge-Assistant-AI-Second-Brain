import type { Metadata } from "next";
import { HeroSection } from "@/components/landing/hero-section";
import { ProblemSection } from "@/components/landing/problem-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { KnowledgeGraphDemo } from "@/components/landing/knowledge-graph-demo";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { FinalCTASection } from "@/components/landing/final-cta-section";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { LandingFooter } from "@/components/landing/landing-footer";

export const metadata: Metadata = {
  title: "Kortex AI — Your AI Second Brain",
  description:
    "Upload anything. Remember everything. Understand instantly. Kortex AI is the most advanced AI-powered knowledge assistant ever built.",
};

export default function LandingPage() {
  return (
    <main className="relative bg-[#F0F0F0] overflow-x-hidden">
      <LandingNavbar />
      <HeroSection />
      <ProblemSection />
      <FeaturesSection />
      <KnowledgeGraphDemo />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <FinalCTASection />
      <LandingFooter />
    </main>
  );
}
