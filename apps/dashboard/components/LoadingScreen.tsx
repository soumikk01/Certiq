"use client";

/**
 * LoadingScreen — premium logo-drawing animation centered on screen.
 *
 * Animation sequence:
 * 1. The "C" arc draws itself (stroke-dashoffset animation)
 * 2. The circle fills in with the accent gradient
 * 3. The checkmark draws itself inside the circle
 * 4. Pulsing glow ring
 * 5. "Certiq" wordmark fades in below
 *
 * Background: frosted glass full-screen overlay.
 */

import { motion } from "framer-motion";

export function LoadingScreen(): JSX.Element {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-bg-1/90 backdrop-blur-2xl">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="absolute w-[320px] h-[320px] rounded-full blur-[100px] opacity-25"
        style={{
          background: "radial-gradient(circle, rgba(217,255,63,0.6) 0%, rgba(199,255,0,0) 65%)",
        }}
      />

      <div className="relative flex flex-col items-center gap-8">
        {/* Pulsing glow ring */}
        <motion.div
          className="absolute w-[140px] h-[140px] rounded-full border border-accent/20"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.3, 0, 0.3],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.6,
          }}
        />

        {/* Second pulse ring (offset) */}
        <motion.div
          className="absolute w-[140px] h-[140px] rounded-full border border-accent/15"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{
            scale: [1, 1.6, 1],
            opacity: [0.2, 0, 0.2],
          }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2.0,
          }}
        />

        {/* Logo container */}
        <motion.div
          className="relative"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <svg
            width="120"
            height="120"
            viewBox="0 0 32 32"
            fill="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="loadingGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#D9FF3F" />
                <stop offset="100%" stopColor="#C7FF00" />
              </linearGradient>
            </defs>

            {/* Step 1: "C" arc draws itself */}
            <motion.path
              d="M22 11.5A7 7 0 1 0 22 20.5"
              stroke="url(#loadingGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                pathLength: { duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 },
                opacity: { duration: 0.15, delay: 0.3 },
              }}
            />

            {/* Step 2: Circle fills in */}
            <motion.circle
              cx="22.5"
              cy="16"
              r="2"
              fill="url(#loadingGrad)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.5,
                delay: 1.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ transformOrigin: "22.5px 16px" }}
            />

            {/* Step 3: Checkmark draws */}
            <motion.path
              d="M21.2 16.1L22.1 17L23.8 15.3"
              stroke="rgb(var(--bg-1))"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                pathLength: { duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 1.6 },
                opacity: { duration: 0.1, delay: 1.6 },
              }}
            />
          </svg>
        </motion.div>

        {/* Wordmark */}
        <motion.span
          className="font-serif text-text-headline text-2xl font-normal tracking-tight"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.9, ease: [0.22, 1, 0.36, 1] }}
        >
          Certiq
        </motion.span>

        {/* Subtitle */}
        <motion.p
          className="text-text-muted font-sans text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 2.2 }}
        >
          Loading your workspace...
        </motion.p>
      </div>
    </div>
  );
}
