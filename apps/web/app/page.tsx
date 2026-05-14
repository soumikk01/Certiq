"use client";

/**
 * Landing page — composes all sections in documented order.
 *
 * The VideoHero has been replaced by the interactive DocumentStage
 * embedded directly within HeroSection.
 */

import { Navbar } from "@/components/sections/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { TemplateShowcase } from "@/components/sections/TemplateShowcase";
import { BuilderDemo } from "@/components/sections/BuilderDemo";
import { CertificateStorageSection } from "@/components/sections/CertificateStorageSection";
import { AtsSection } from "@/components/sections/AtsSection";
import { BentoGrid } from "@/components/sections/BentoGrid";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { FinalCta } from "@/components/sections/FinalCta";
import { Footer } from "@/components/sections/Footer";

export default function HomePage(): JSX.Element {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <TrustStrip />
        <TemplateShowcase />
        <BuilderDemo />
        <CertificateStorageSection />
        <AtsSection />
        <BentoGrid />
        <TestimonialsSection />
        <PricingSection />
        <FaqSection />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
