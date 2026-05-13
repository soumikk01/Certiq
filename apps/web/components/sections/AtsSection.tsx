"use client";

/**
 * Section 8 — AtsSection
 *
 * Glass panel with score indicator, keyword chips, strength meter, suggestions.
 *
 * Requirements: 11.1–11.8
 */

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ATS_MOCK } from "@/data/ats";
import { useReducedMotionSafe, useInViewReveal, fadeUp } from "@/lib/motion";
import { SectionWrapper, ProgressIndicator, Chip, GlassCard } from "@certiq/ui";

export function AtsSection(): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInViewReveal(ref, 0.3);
  const { reduced } = useReducedMotionSafe();
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !reduced) {
      setAnimated(true);
    } else if (isInView && reduced) {
      setAnimated(true);
    }
  }, [isInView, reduced]);

  return (
    <SectionWrapper
      id="ats"
      eyebrow="ATS Intelligence"
      heading="Past the robots. Into the room."
      description="Certiq scores your resume against the same parsers recruiters use, surfaces missing keywords in plain English, and rewrites weak bullets on request."
    >
      <motion.div
        ref={ref}
        className="w-full max-w-4xl"
        {...(reduced ? {} : { variants: fadeUp, initial: "hidden" })}
        animate={isInView ? "show" : "hidden"}
      >
        <GlassCard tint="strong" className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Score + Strength */}
            <div className="flex flex-col items-center gap-6">
              <div className="text-center">
                <p className="text-text-muted font-sans text-xs uppercase tracking-wider mb-3">ATS Score</p>
                <ProgressIndicator
                  value={animated ? ATS_MOCK.score : 0}
                  variant="circular"
                  animate={!reduced}
                  label="ATS compatibility score"
                />
              </div>
              <div className="w-full">
                <p className="text-text-muted font-sans text-xs uppercase tracking-wider mb-2">Strength</p>
                <ProgressIndicator
                  value={animated ? ATS_MOCK.strength : 0}
                  variant="linear"
                  animate={!reduced}
                  label="Resume strength meter"
                />
                <p className="text-text-body font-sans text-xs mt-1">{ATS_MOCK.strength}%</p>
              </div>
            </div>

            {/* Right: Keywords + Suggestions */}
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-text-muted font-sans text-xs uppercase tracking-wider mb-3">Keywords</p>
                <div className="flex flex-wrap gap-2">
                  {ATS_MOCK.keywords.map((kw) => (
                    <Chip key={kw.term} label={kw.term} active={kw.matched} />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-text-muted font-sans text-xs uppercase tracking-wider mb-3">Suggestions</p>
                <ul className="space-y-2">
                  {ATS_MOCK.suggestions.map((sug) => (
                    <li key={sug.id} className="text-text-body font-sans text-sm flex gap-2">
                      <span className="text-accent shrink-0">→</span>
                      {sug.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </SectionWrapper>
  );
}
