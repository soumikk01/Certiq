/**
 * Framer Motion variants for the Certiq landing page.
 *
 * All decorative motion uses only `opacity` and `transform` (translate, scale).
 * Durations lie in [400, 1200] ms. Easing is a premium ease-out cubic-bezier.
 */

import type { Variants } from "framer-motion";

/** Premium ease-out curve used across all decorative motion. */
export const EASE_PREMIUM = [0.22, 1, 0.36, 1] as const;

/** Section entrance: fade up from y:24 to y:0 with opacity 0→1. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_PREMIUM },
  },
};

/** Stagger container: orchestrates children with staggerChildren delay. */
export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

/** Stagger child: individual child fade-up within a stagger container. */
export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_PREMIUM },
  },
};
