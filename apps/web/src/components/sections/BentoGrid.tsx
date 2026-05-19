"use client";

/**
 * Section 9 — BentoGrid
 *
 * Asymmetrical grid with ≥6 tiles, hover glow, responsive reflow.
 *
 * Requirements: 12.1–12.6
 */

import { useRef } from "react";
import { motion } from "framer-motion";
import { BENTO_TILES } from "@/data/bento";
import { useReducedMotionSafe, useInViewReveal, staggerContainer, staggerChild } from "@/lib/motion";
import { SectionWrapper, GlassCard } from "@certiq/ui";

function getSpanClasses(span: string): string {
  switch (span) {
    case "2x1":
      return "md:col-span-2";
    case "1x2":
      return "md:row-span-2";
    case "2x2":
      return "md:col-span-2 md:row-span-2";
    default:
      return "";
  }
}

export function BentoGrid(): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInViewReveal(ref, 0.2);
  const { reduced } = useReducedMotionSafe();

  return (
    <SectionWrapper
      id="bento"
      eyebrow="The whole workspace"
      heading="Small features. Large impact."
      description="Everything you'd expect from a serious resume tool, and a few things you didn't know to ask for."
    >
      <motion.div
        ref={ref}
        className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[180px]"
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "show" : "hidden"}
      >
        {BENTO_TILES.map((tile) => (
          <motion.div
            key={tile.id}
            variants={staggerChild}
            className={getSpanClasses(tile.span)}
          >
            <GlassCard
              interactive
              className="h-full p-6 flex flex-col justify-between hover:shadow-[0_0_30px_rgba(217,255,63,0.25)]"
            >
              <h3 className="text-text-headline font-sans text-base font-medium">
                {tile.title}
              </h3>
              <p className="text-text-muted font-sans text-sm mt-2">
                {tile.description}
              </p>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
