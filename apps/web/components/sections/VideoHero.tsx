"use client";

/**
 * Section 3 — VideoHero
 *
 * Glass container with autoplay video, lazy mount, play/pause lifecycle,
 * poster fallback, and scale-in entrance.
 *
 * Requirements: 6.1–6.11, 19.8
 */

import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useReducedMotionSafe, useInViewReveal, scaleIn } from "@/lib/motion";

export interface VideoHeroProps {
  shouldMount: boolean;
}

export function VideoHero({ shouldMount }: VideoHeroProps): JSX.Element | null {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showPoster, setShowPoster] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { reduced } = useReducedMotionSafe();
  const isInView = useInViewReveal(containerRef, 0.25);

  // Mount video only when shouldMount is true
  useEffect(() => {
    if (shouldMount && !mounted) {
      setMounted(true);
    }
  }, [shouldMount, mounted]);

  // 8s load timeout
  useEffect(() => {
    if (!mounted) return;
    const video = videoRef.current;
    if (!video) return;

    let timer: ReturnType<typeof setTimeout> | null = null;

    function onLoadStart() {
      timer = setTimeout(() => {
        setShowPoster(true);
      }, 8000);
    }

    function onCanPlay() {
      if (timer) clearTimeout(timer);
    }

    function onError() {
      setShowPoster(true);
      if (timer) clearTimeout(timer);
    }

    video.addEventListener("loadstart", onLoadStart);
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("error", onError);

    return () => {
      if (timer) clearTimeout(timer);
      video.removeEventListener("loadstart", onLoadStart);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("error", onError);
    };
  }, [mounted]);

  // IntersectionObserver play/pause + visibility change
  useEffect(() => {
    if (!mounted || showPoster) return;
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.intersectionRatio >= 0.25) {
          video.play().catch(() => {});
        } else if (entry.intersectionRatio < 0.1) {
          video.pause();
        }
      },
      { threshold: [0, 0.1, 0.25] },
    );

    observer.observe(video);

    function onVisibilityChange() {
      if (!video) return;
      if (document.hidden) {
        video.pause();
      } else {
        video.play().catch(() => {});
      }
    }

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [mounted, showPoster]);

  if (!shouldMount && !mounted) return null;

  return (
    <section id="video-hero" className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <motion.div
          ref={containerRef}
          className="relative rounded-[24px] overflow-hidden border border-border-card bg-surface-card-1 backdrop-blur-[16px] shadow-[0_20px_80px_rgba(0,0,0,0.3)]"
          variants={scaleIn}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
        >
          {/* Accent glow behind */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10"
            style={{
              background: "radial-gradient(circle at center, rgba(217,255,63,0.12) 0%, transparent 70%)",
            }}
          />

          {mounted && !showPoster ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              className="w-full aspect-video object-cover"
              poster="/video/product-demo-poster.jpg"
            >
              <source src="/video/product-demo.webm" type="video/webm; codecs=av01.0.05M.08" />
              <source src="/video/product-demo.webm" type="video/webm; codecs=vp9" />
              <source src="/video/product-demo.mp4" type="video/mp4" />
            </video>
          ) : (
            <div className="w-full aspect-video bg-bg-2 flex items-center justify-center">
              <div className="text-text-muted font-sans text-sm">
                Product demo preview
              </div>
            </div>
          )}

          {/* Visually hidden text alternative */}
          <span className="sr-only">
            Video demonstration showing the Certiq resume builder workflow: selecting a template, editing content with AI suggestions, and exporting a polished PDF.
          </span>
        </motion.div>
      </div>
    </section>
  );
}
