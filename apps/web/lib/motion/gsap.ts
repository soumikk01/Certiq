"use client";

/**
 * GSAP + ScrollTrigger utilities for the Certiq landing page.
 *
 * Lazily registers ScrollTrigger and self-kills timelines when
 * `prefers-reduced-motion` is active.
 *
 * Requirements: 3.1, 3.8
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

/** Register ScrollTrigger plugin (idempotent). */
export function ensureScrollTrigger(): void {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
}

/**
 * Returns true if the user prefers reduced motion.
 * Safe to call only in browser context.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Hook that creates a GSAP timeline with ScrollTrigger, automatically
 * killing it on unmount or when reduced motion is detected.
 *
 * @param factory - Function that receives the timeline and trigger element,
 *   and should add tweens/ScrollTrigger config to the timeline.
 * @param deps - Dependency array for re-creating the timeline.
 */
export function useScrollTimeline(
  factory: (tl: gsap.core.Timeline, el: HTMLElement) => void,
  deps: unknown[] = [],
) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) return;

    ensureScrollTrigger();

    const tl = gsap.timeline();
    factory(tl, el);

    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}

export { gsap, ScrollTrigger };
