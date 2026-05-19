"use client";

import { useState, useEffect } from "react";

export interface ThemeToggleProps {
  /** Current applied theme */
  theme: "dark" | "light";
  /** Current preference mode */
  preference?: "dark" | "light" | "system";
  /** Called to cycle to next mode */
  onToggle: () => void;
  className?: string;
}

/**
 * Theme toggle button — cycles through dark → light → system.
 *
 * Shows:
 *   - Sun icon when in dark mode (click to switch to light)
 *   - Moon icon when in light mode (click to switch to system)
 *   - Monitor icon when in system mode (click to switch to dark)
 */
export function ThemeToggle({
  theme,
  preference = theme,
  onToggle,
  className = "",
}: ThemeToggleProps): JSX.Element {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Before mount, render neutral to avoid hydration mismatch
  const currentPref = mounted ? preference : "dark";

  const label =
    currentPref === "dark"
      ? "Switch to light mode"
      : currentPref === "light"
        ? "Switch to system mode"
        : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={label}
      title={`Theme: ${currentPref}`}
      className={`inline-flex items-center justify-center w-11 h-11 rounded-full border border-border-card bg-surface-card-1 backdrop-blur-md transition-colors duration-200 hover:bg-surface-card-2 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${className}`.trim()}
      suppressHydrationWarning
    >
      {currentPref === "dark" && (
        /* Sun icon — indicates clicking will switch to light */
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-text-headline"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      )}
      {currentPref === "light" && (
        /* Moon icon — indicates clicking will switch to system */
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-text-headline"
          aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
      {currentPref === "system" && (
        /* Monitor icon — indicates system/auto mode */
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-text-headline"
          aria-hidden="true"
        >
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      )}
    </button>
  );
}
