"use client";

/**
 * Section 2 — HeroSection (Premium Interactive)
 *
 * Full-viewport hero with a two-column layout:
 *  - Left: bold headline, subtext, CTAs
 *  - Right: DocumentStage — cinematic interactive resume + certificate stack
 *
 * Replaces the previous floating-cards visual with a living document system
 * that responds to cursor movement and drag interactions.
 *
 * Requirements: 5.1–5.10, 2.4, 3.7, 3.8
 */

import { useRef } from "react";
import { motion } from "framer-motion";
import {
  useReducedMotionSafe,
  useInViewReveal,
  staggerContainer,
  staggerChild,
  EASE_PREMIUM,
} from "@/lib/motion";
import { AccentGlow } from "@/components/effects/AccentGlow";
import { DocumentStage } from "@/components/hero/DocumentStage";

export function HeroSection(): JSX.Element {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInViewReveal(ref, 0.1);
  const { reduced } = useReducedMotionSafe();

  return (
    <section
      ref={ref}
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16 px-4 sm:px-6 lg:px-8"
    >
      {/* Subtle ambient glow — positioned behind the document stage */}
      <AccentGlow className="top-[15%] right-[-5%]" size="55%" />
      <AccentGlow className="bottom-[10%] left-[-8%]" size="40%" opacity="0.08" />

      {/* Soft radial gradient backdrop for premium depth */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 65% 45%, rgba(217,255,63,0.04) 0%, transparent 60%)",
        }}
      />

      <motion.div
        className="mx-auto max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center"
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "show" : "hidden"}
      >
        {/* ── Content column ── */}
        <motion.div variants={staggerChild} className="flex flex-col gap-6 z-10">
          <motion.p
            className="font-sans text-xs sm:text-sm tracking-[0.2em] uppercase text-text-muted"
            variants={{
              hidden: { opacity: 0, y: 12 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, ease: EASE_PREMIUM },
              },
            }}
          >
            AI Resume &amp; Certificate Platform
          </motion.p>

          <h1
            className="font-serif text-text-headline font-normal leading-[0.92] tracking-[-0.03em]"
            style={{ fontSize: "clamp(48px, 7vw, 96px)" }}
          >
            Build your
            <br />
            <span className="relative inline-block">
              identity.
              {/* Accent underline */}
              <span
                aria-hidden="true"
                className="absolute left-0 -bottom-1 w-full h-[3px] rounded-full bg-accent opacity-80"
              />
            </span>
          </h1>

          <p className="text-text-body font-sans text-base sm:text-lg max-w-md leading-relaxed">
            Certiq turns your career into a living document system — AI-generated
            resumes, verifiable certificates, and templates that recruiters
            actually pause on.
          </p>

          <div className="flex flex-wrap gap-4 mt-2">
            <a
              href="#builder"
              className="inline-flex items-center justify-center rounded-full bg-accent text-[#0F172A] font-sans font-medium text-base min-h-[44px] px-7 py-3 hover:shadow-[0_0_28px_rgba(217,255,63,0.5)] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
            >
              Generate Resume
            </a>
            <a
              href="#templates"
              className="inline-flex items-center justify-center rounded-full border border-border-card bg-surface-card-1 backdrop-blur-md text-text-headline font-sans font-medium text-base min-h-[44px] px-7 py-3 hover:bg-surface-card-2 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
            >
              View Templates
            </a>
          </div>

          {/* Trust micro-indicators */}
          <div className="flex items-center gap-4 mt-4 text-text-muted font-sans text-xs">
            <span className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-accent">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Verified credentials
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-accent">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              AI-powered
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-accent">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="21" x2="9" y2="9" />
              </svg>
              ATS-optimized
            </span>
          </div>
        </motion.div>

        {/* ── Visual column — Interactive Document Stage ── */}
        <motion.div
          variants={staggerChild}
          className="relative order-first lg:order-last"
        >
          <DocumentStage />
        </motion.div>
      </motion.div>
    </section>
  );
}
