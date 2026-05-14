"use client";

/**
 * Section 10 — TestimonialsSection
 *
 * ≥6 glass testimonial cards with staggered fade-in, code-generated avatars.
 *
 * Requirements: 13.1–13.6
 */

import { useRef } from "react";
import { motion } from "framer-motion";
import { TESTIMONIALS } from "@/data/testimonials";
import { useReducedMotionSafe, useInViewReveal, staggerContainer, staggerChild } from "@/lib/motion";
import { SectionWrapper, GlassCard } from "@certiq/ui";
import { GeneratedAvatar } from "@/components/previews";

export function TestimonialsSection(): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInViewReveal(ref, 0.15);
  const { reduced } = useReducedMotionSafe();

  return (
    <SectionWrapper
      id="testimonials"
      eyebrow="Notes from users"
      heading="The résumés that got the call."
      description="A sample of the engineers, designers, and operators who stopped tweaking and started interviewing."
    >
      <motion.div
        ref={ref}
        className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "show" : "hidden"}
      >
        {TESTIMONIALS.slice(0, 6).map((testimonial) => (
          <motion.div key={testimonial.id} variants={staggerChild}>
            <GlassCard className="p-6 h-full flex flex-col">
              {/* Star rating */}
              <div className="flex gap-0.5 mb-3" aria-hidden="true">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="rgb(var(--accent))" className="text-accent">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>

              <blockquote className="text-text-body font-sans text-sm leading-relaxed flex-1">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border-card">
                <GeneratedAvatar
                  name={testimonial.name}
                  size={40}
                />
                <div>
                  <p className="text-text-headline font-sans text-sm font-medium">
                    {testimonial.name}
                  </p>
                  <p className="text-text-muted font-sans text-xs">
                    {testimonial.profession}, {testimonial.company}
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
