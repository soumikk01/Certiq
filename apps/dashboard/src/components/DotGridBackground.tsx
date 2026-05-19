"use client";

/**
 * DotGridBackground — interactive dot grid with cursor-follow glow.
 * Uses CSS variables for theme-aware dot colors.
 */

import { useEffect, useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";

export function DotGridBackground(): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const mouseX = useMotionValue(-400);
  const mouseY = useMotionValue(-400);

  const smoothX = useSpring(mouseX, { stiffness: 100, damping: 18, mass: 0.5 });
  const smoothY = useSpring(mouseY, { stiffness: 100, damping: 18, mass: 0.5 });

  const maskImage = useMotionTemplate`radial-gradient(250px circle at ${smoothX}px ${smoothY}px, white, transparent)`;

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
      setIsHovering(true);
    }

    function handleMouseLeave() {
      setIsHovering(false);
      mouseX.set(-400);
      mouseY.set(-400);
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Base dot grid — uses theme variable */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, var(--dot-color) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Glowing dots — only visible when cursor is on screen */}
      {isHovering && (
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, var(--dot-glow) 1.2px, transparent 1.2px)",
            backgroundSize: "24px 24px",
            maskImage,
            WebkitMaskImage: maskImage,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </div>
  );
}
