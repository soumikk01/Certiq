"use client";

/**
 * Section 11 — PricingSection
 *
 * Three tiers from data/pricing.ts. Pro highlighted with accent border + scale.
 *
 * Requirements: 14.1–14.5
 */

import { useRef } from "react";
import { motion } from "framer-motion";
import { PRICING_TIERS } from "@/data/pricing";
import { useReducedMotionSafe, useInViewReveal, staggerContainer, staggerChild } from "@/lib/motion";
import { SectionWrapper, GlassCard, Button } from "@certiq/ui";

export function PricingSection(): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInViewReveal(ref, 0.2);
  const { reduced } = useReducedMotionSafe();

  // Sort for mobile: Pro first
  const sortedTiers = [...PRICING_TIERS].sort((a, b) => {
    if (a.highlighted) return -1;
    if (b.highlighted) return 1;
    return 0;
  });

  return (
    <SectionWrapper
      id="pricing"
      eyebrow="Pricing"
      heading="Simple, transparent pricing."
      description="Start free. Upgrade when you're ready for the full experience."
    >
      <motion.div
        ref={ref}
        className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 items-start"
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "show" : "hidden"}
      >
        {/* Desktop: original order. Mobile: Pro first via order classes */}
        {PRICING_TIERS.map((tier) => (
          <motion.div
            key={tier.id}
            variants={staggerChild}
            className={tier.highlighted ? "md:scale-105 order-first md:order-none" : ""}
          >
            <GlassCard
              tint={tier.highlighted ? "strong" : "default"}
              className={`p-6 flex flex-col h-full ${
                tier.highlighted
                  ? "border-accent border-2 shadow-[0_0_30px_rgba(217,255,63,0.2)]"
                  : ""
              }`}
            >
              {tier.highlighted && (
                <span className="inline-block self-start px-2.5 py-0.5 rounded-full bg-accent/20 text-accent text-xs font-sans font-medium mb-3">
                  Most Popular
                </span>
              )}
              <h3 className="text-text-headline font-sans text-xl font-semibold">{tier.name}</h3>
              <p className="text-text-headline font-sans text-3xl font-bold mt-2">{tier.price}</p>
              <p className="text-text-body font-sans text-sm mt-2">{tier.description}</p>
              <ul className="mt-6 space-y-2 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-text-body font-sans text-sm">
                    <span className="text-accent shrink-0 mt-0.5">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Button variant={tier.ctaVariant} className="w-full">
                  {tier.ctaLabel}
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
