/**
 * Framer Motion variants for the Certiq landing page.
 *
 * All decorative motion uses only `opacity` and `transform` (translate, scale).
 * Durations lie in [400, 1200] ms. Easing is a premium ease-out cubic-bezier.
 *
 * Requirements: 3.2, 3.3, 3.4, 3.9
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

/** Scale-in entrance: scale 0.96→1 with opacity 0→1. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: EASE_PREMIUM },
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

/** Continuous float: y oscillates between -6 and 6 px, 6s period. */
export const floatY: Variants = {
  float: {
    y: [0, -6, 0, 6, 0],
    transition: {
      duration: 6,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "loop",
    },
  },
};

/** Accordion height animation for expand/collapse. */
export const accordionHeight: Variants = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.4, ease: EASE_PREMIUM },
  },
  expanded: {
    height: "auto",
    opacity: 1,
    transition: { duration: 0.4, ease: EASE_PREMIUM },
  },
};
