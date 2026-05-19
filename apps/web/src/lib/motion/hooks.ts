"use client";

/**
 * Motion hooks for the Certiq landing page.
 *
 * - useReducedMotionSafe(): returns flags for gating motion features.
 * - useInViewReveal(): triggers reveal animation when element enters viewport.
 *
 * Requirements: 3.4, 3.8, 20.11, 22.7
 */

import { useReducedMotion, useInView } from "framer-motion";
import { useMemo, type RefObject } from "react";

export interface ReducedMotionFlags {
  reduced: boolean;
  disableParallax: boolean;
  disableFloat: boolean;
  disableHoverScale: boolean;
  instantEntrance: boolean;
  hideParticles: boolean;
}

/**
 * Returns a set of flags indicating which motion features should be disabled
 * based on the user's `prefers-reduced-motion` setting.
 */
export function useReducedMotionSafe(): ReducedMotionFlags {
  const reduced = useReducedMotion() ?? false;

  return useMemo(
    () => ({
      reduced,
      disableParallax: reduced,
      disableFloat: reduced,
      disableHoverScale: reduced,
      instantEntrance: reduced,
      hideParticles: reduced,
    }),
    [reduced],
  );
}

/**
 * Returns `true` once the referenced element enters the viewport at the
 * given intersection threshold. Fires only once (no re-hide on scroll out).
 */
export function useInViewReveal(
  ref: RefObject<Element | null>,
  threshold = 0.25,
): boolean {
  const isInView = useInView(ref, {
    once: true,
    amount: threshold,
  });

  return isInView;
}
