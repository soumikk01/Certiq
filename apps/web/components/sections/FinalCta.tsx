"use client";

/**
 * Section 13 — FinalCta
 *
 * Headline with staggered reveal, gradient + accent glow, particles, CTA buttons.
 *
 * Requirements: 16.1–16.8
 */

import { useRef } from "react";
import { motion } from "framer-motion";
import { useReducedMotionSafe, useInViewReveal, staggerContainer, EASE_PREMIUM } from "@/lib/motion";
import { AccentGlow } from "@/components/effects/AccentGlow";
import { ParticleField } from "@/components/effects/ParticleField";

const HEADLINE = "Create your premium resume today.";

export function FinalCta(): JSX.Element {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInViewReveal(ref, 0.3);
  const { reduced } = useReducedMotionSafe();

  const words = HEADLINE.split(" ");

  return (
    <section
      ref={ref}
      id="final-cta"
      className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Gradient background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20"
        style={{
          background: "linear-gradient(135deg, rgb(var(--bg-1)) 0%, rgb(var(--bg-3)) 50%, rgb(var(--bg-2)) 100%)",
        }}
      />

      {/* Accent glow focal point */}
      <AccentGlow className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" size="50%" opacity="0.3" />

      {/* Particles */}
      <ParticleField count={16} />

      <div className="relative mx-auto max-w-4xl text-center flex flex-col items-center gap-8">
        {/* Staggered headline */}
        <motion.h2
          className="font-serif text-text-headline font-normal text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-tight"
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
        >
          {words.map((word, i) => (
            <motion.span
              key={i}
              className="inline-block mr-[0.25em]"
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: EASE_PREMIUM, delay: i * 0.08 },
                },
              }}
            >
              {word}
            </motion.span>
          ))}
        </motion.h2>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5, ease: EASE_PREMIUM }}
        >
          <a
            href="#builder"
            className="inline-flex items-center justify-center rounded-full bg-accent text-[#0F172A] font-sans font-medium text-base min-h-[44px] px-8 py-3 hover:shadow-[0_0_24px_rgba(217,255,63,0.45)] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          >
            Start Building
          </a>
          <a
            href="#templates"
            className="inline-flex items-center justify-center rounded-full border border-border-card bg-surface-card-1 backdrop-blur-md text-text-headline font-sans font-medium text-base min-h-[44px] px-8 py-3 hover:bg-surface-card-2 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          >
            Explore Templates
          </a>
        </motion.div>
      </div>
    </section>
  );
}
