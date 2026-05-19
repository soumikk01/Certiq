"use client";

/**
 * ParticleField — floating particles rendered only on client.
 * Completely avoids hydration mismatch by rendering nothing on server.
 */

import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface ParticleFieldProps {
  count?: number;
  className?: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

export function ParticleField({ count = 12, className = "" }: ParticleFieldProps): JSX.Element | null {
  const reduced = useReducedMotion() ?? false;
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mounted, setMounted] = useState(false);

  // Only generate and show particles after client mount
  useEffect(() => {
    setMounted(true);
    if (reduced) return;
    const clamped = Math.max(6, Math.min(24, count));
    const result: Particle[] = [];
    for (let i = 0; i < clamped; i++) {
      result.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2 + Math.random() * 4,
        opacity: 0.1 + Math.random() * 0.3,
        duration: 4 + Math.random() * 6,
        delay: Math.random() * 3,
      });
    }
    setParticles(result);
  }, [count, reduced]);

  // Render nothing on server and during first render to match SSR output
  if (!mounted || reduced || particles.length === 0) return null;

  return (
    <div aria-hidden="true" className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} suppressHydrationWarning>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-accent"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
