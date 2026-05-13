"use client";

/**
 * Section 5 — TemplateShowcase
 *
 * Gallery of six template cards with single-selection, hover scale, and responsive layouts.
 *
 * Requirements: 8.1–8.9
 */

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { TEMPLATES } from "@/data/templates";
import { useReducedMotionSafe, useInViewReveal, fadeUp } from "@/lib/motion";
import { SectionWrapper } from "@certiq/ui";

export function TemplateShowcase(): JSX.Element {
  const [selected, setSelected] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInViewReveal(ref, 0.2);
  const { disableHoverScale, reduced } = useReducedMotionSafe();

  function handleSelect(id: string) {
    setSelected((prev) => (prev === id ? null : id));
  }

  return (
    <SectionWrapper
      id="templates"
      eyebrow="Templates"
      heading="Designed like magazines. Built for offers."
      description="Six meticulously crafted layouts shaped by typography obsessives and hiring managers. Pick your voice; keep your content."
    >
      <motion.div
        ref={ref}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
        variants={fadeUp}
        initial="hidden"
        animate={isInView ? "show" : "hidden"}
      >
        {TEMPLATES.map((template) => {
          const isSelected = selected === template.id;
          return (
            <motion.button
              key={template.id}
              type="button"
              onClick={() => handleSelect(template.id)}
              className={`relative rounded-xl border overflow-hidden bg-surface-card-1 backdrop-blur-[16px] p-1 text-left transition-all duration-200 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${
                isSelected
                  ? "border-accent border-2 shadow-[0_0_20px_rgba(217,255,63,0.3)]"
                  : "border-border-card"
              }`}
              whileHover={disableHoverScale ? {} : { scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              aria-pressed={isSelected}
            >
              <div className="aspect-[3/4] rounded-lg bg-bg-3 flex items-center justify-center">
                <span className="text-text-muted font-sans text-xs">{template.name}</span>
              </div>
              <div className="p-3">
                <p className="text-text-headline font-sans text-sm font-medium">{template.name}</p>
                <p className="text-text-muted font-sans text-xs">{template.category}</p>
              </div>
            </motion.button>
          );
        })}
      </motion.div>
    </SectionWrapper>
  );
}
