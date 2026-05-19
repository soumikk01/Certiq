"use client";

/**
 * Section 12 — FaqSection
 *
 * ≥6 glass accordion items (multi-open) with chevron rotation and keyboard a11y.
 *
 * Requirements: 15.1–15.6, 20.8
 */

import { useRef } from "react";
import { motion } from "framer-motion";
import { FAQ_ITEMS } from "@/data/faq";
import { useReducedMotionSafe, useInViewReveal, fadeUp } from "@/lib/motion";
import { SectionWrapper, Accordion } from "@certiq/ui";

export function FaqSection(): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInViewReveal(ref, 0.2);
  const { reduced } = useReducedMotionSafe();

  const items = FAQ_ITEMS.map((faq) => ({
    id: faq.id,
    question: faq.question,
    answer: faq.answer,
  }));

  return (
    <SectionWrapper
      id="faq"
      eyebrow="Questions, answered"
      heading="You probably wanted to ask."
      description="The honest answers we give anyone considering Certiq. No sales voice."
    >
      <motion.div
        ref={ref}
        className="w-full max-w-3xl"
        variants={fadeUp}
        initial="hidden"
        animate={isInView ? "show" : "hidden"}
      >
        <Accordion items={items} />
      </motion.div>
    </SectionWrapper>
  );
}
