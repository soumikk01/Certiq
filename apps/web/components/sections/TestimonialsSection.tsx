"use client";

/**
 * Section 10 — TestimonialsSection
 *
 * ≥6 glass testimonial cards with staggered fade-in, marquee, avatar fallback.
 *
 * Requirements: 13.1–13.6
 */

import { useRef } from "react";
import { motion } from "framer-motion";
import { TESTIMONIALS } from "@/data/testimonials";
import { useReducedMotionSafe, useInViewReveal, staggerContainer, staggerChild } from "@/lib/motion";
import { SectionWrapper, GlassCard, Avatar } from "@certiq/ui";

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
              <blockquote className="text-text-body font-sans text-sm leading-relaxed flex-1">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border-card">
                <Avatar
                  src={testimonial.avatarUrl}
                  alt={`${testimonial.name}'s avatar`}
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
