/**
 * Motion utilities barrel for the Certiq landing page.
 *
 * Re-exports variants, hooks, and GSAP utilities.
 * All consumers must be "use client" components.
 */

export {
  EASE_PREMIUM,
  fadeUp,
  scaleIn,
  staggerContainer,
  staggerChild,
  floatY,
  accordionHeight,
} from "./variants";

export { useReducedMotionSafe, useInViewReveal } from "./hooks";
export type { ReducedMotionFlags } from "./hooks";

export {
  ensureScrollTrigger,
  prefersReducedMotion,
  useScrollTimeline,
  gsap,
  ScrollTrigger,
} from "./gsap";
