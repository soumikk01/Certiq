"use client";

/**
 * useShouldMountVideoHero — returns true iff HeroSection is visible AND scrollY >= 200.
 *
 * Requirement: 19.8
 */

import { useState, useEffect } from "react";

export function useShouldMountVideoHero(): boolean {
  const [heroVisible, setHeroVisible] = useState(false);
  const [scrollPast, setScrollPast] = useState(false);

  useEffect(() => {
    const heroEl = document.getElementById("hero");
    if (!heroEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setHeroVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(heroEl);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function onScroll() {
      if (window.scrollY >= 200) {
        setScrollPast(true);
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return heroVisible && scrollPast;
}
