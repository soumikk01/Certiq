"use client";

/**
 * Landing page — composes all 14 sections in documented order.
 *
 * Requirement: 21.4, 21.12
 */

import { Navbar } from "@/components/sections/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { VideoHero } from "@/components/sections/VideoHero";
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
import { useShouldMountVideoHero } from "@/lib/hooks/useShouldMountVideoHero";

export default function HomePage(): JSX.Element {
  const shouldMountVideo = useShouldMountVideoHero();

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <VideoHero shouldMount={shouldMountVideo} />
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
