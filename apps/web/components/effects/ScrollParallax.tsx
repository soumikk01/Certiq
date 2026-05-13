"use client";

/**
 * ScrollParallax — wrapper applying 5–30% parallax translation via GSAP ScrollTrigger.
 *
 * Requirement: 3.5
 */

import { type ReactNode, useRef, useEffect } from "react";
import { prefersReducedMotion, ensureScrollTrigger, gsap, ScrollTrigger } from "@/lib/motion/gsap";

export interface ScrollParallaxProps {
  children: ReactNode;
  speed?: number; // 0.05 to 0.30
  className?: string;
}

export function ScrollParallax({
  children,
  speed = 0.15,
  className = "",
}: ScrollParallaxProps): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    ensureScrollTrigger();

    const clampedSpeed = Math.max(0.05, Math.min(0.3, speed));
    const distance = 100 * clampedSpeed;

    const tween = gsap.to(el, {
      y: -distance,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === el) st.kill();
      });
    };
  }, [speed]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
