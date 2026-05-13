"use client";

/**
 * Section 2 — HeroSection
 *
 * Two-column split layout with headline, subtext, CTAs, and floating glass cards.
 *
 * Requirements: 5.1–5.10, 2.4, 3.7, 3.8
 */

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useReducedMotionSafe, useInViewReveal, fadeUp, staggerContainer, staggerChild, floatY } from "@/lib/motion";
import { AccentGlow } from "@/components/effects/AccentGlow";

const FLOATING_CARDS = [
  { id: "resume", label: "Resume Preview", icon: "📄" },
  { id: "template", label: "Template Selector", icon: "🎨" },
  { id: "ai", label: "AI Suggestions", icon: "✨" },
  { id: "cert", label: "Certificate Upload", icon: "🏆" },
  { id: "pdf", label: "PDF Export", icon: "📥" },
] as const;

export function HeroSection(): JSX.Element {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInViewReveal(ref, 0.1);
  const { disableFloat, disableHoverScale, reduced } = useReducedMotionSafe();
  const [allFailed, setAllFailed] = useState(false);

  // Mouse-follow parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  function handleMouseMove(e: React.MouseEvent) {
    if (reduced) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
    mouseX.set(x);
    mouseY.set(y);
  }

  return (
    <section
      ref={ref}
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16 px-4 sm:px-6 lg:px-8"
      onMouseMove={handleMouseMove}
    >
      {/* Accent glow background */}
      <AccentGlow className="top-1/4 right-0 translate-x-1/4" size="60%" />

      <motion.div
        className="mx-auto max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "show" : "hidden"}
      >
        {/* Content column */}
        <motion.div variants={staggerChild} className="flex flex-col gap-6 z-10">
          <h1
            className="font-serif text-text-headline font-normal leading-[0.9] tracking-[-0.04em]"
            style={{ fontSize: "clamp(64px, 9vw, 120px)" }}
          >
            Build resumes that feel premium.
          </h1>
          <p className="text-text-body font-sans text-lg sm:text-xl max-w-lg">
            Certiq is a cinematic resume builder with premium templates, AI-assisted editing, ATS scoring, and verifiable certificate storage.
          </p>
          <div className="flex flex-wrap gap-4 mt-2">
            <a
              href="#builder"
              className="inline-flex items-center justify-center rounded-full bg-accent text-[#0F172A] font-sans font-medium text-base min-h-[44px] px-6 py-3 hover:shadow-[0_0_24px_rgba(217,255,63,0.45)] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
            >
              Start Building
            </a>
            <a
              href="#templates"
              className="inline-flex items-center justify-center rounded-full border border-border-card bg-surface-card-1 backdrop-blur-md text-text-headline font-sans font-medium text-base min-h-[44px] px-6 py-3 hover:bg-surface-card-2 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
            >
              Explore Templates
            </a>
          </div>
        </motion.div>

        {/* Visual column — floating cards */}
        {!allFailed && (
          <motion.div
            variants={staggerChild}
            className="relative h-[400px] sm:h-[500px] lg:h-[600px] order-last lg:order-none"
          >
            {FLOATING_CARDS.map((card, i) => {
              const positions = [
                "top-[5%] left-[10%]",
                "top-[15%] right-[5%]",
                "top-[45%] left-[5%]",
                "bottom-[20%] right-[10%]",
                "bottom-[5%] left-[30%]",
              ];

              return (
                <motion.div
                  key={card.id}
                  className={`absolute ${positions[i]} w-36 sm:w-44 rounded-xl border border-border-card bg-surface-card-1 backdrop-blur-[16px] p-4 shadow-[var(--shadow-glass)]`}
                  style={{ x: springX, y: springY }}
                  variants={floatY}
                  animate={disableFloat ? "hidden" : "float"}
                  whileHover={disableHoverScale ? {} : { scale: 1.05 }}
                  transition={{ delay: i * 0.15 }}
                >
                  <span className="text-2xl" aria-hidden="true">{card.icon}</span>
                  <p className="text-text-headline font-sans text-xs mt-2">{card.label}</p>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
