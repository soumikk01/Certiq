/**
 * Motion utilities barrel for the Certiq landing page.
 *
 * Re-exports variants and hooks.
 * All consumers must be "use client" components.
 */

export {
  EASE_PREMIUM,
  fadeUp,
  staggerContainer,
  staggerChild,
} from "./variants";

export { useReducedMotionSafe, useInViewReveal } from "./hooks";
export type { ReducedMotionFlags } from "./hooks";
