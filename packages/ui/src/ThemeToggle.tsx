"use client";

import { useState, useEffect } from "react";

export interface ThemeToggleProps {
  theme: "dark" | "light";
  onToggle: () => void;
  className?: string;
}

/**
 * 44×44 theme toggle button with aria-pressed and theme-aware aria-label.
 *
 * Both icons are always rendered; visibility is toggled via CSS to avoid
 * hydration mismatch when the inline theme script sets a different theme
 * before React hydrates.
 *
 * Requirements: 22.5, 22.6, 20.4
 */
export function ThemeToggle({ theme, onToggle, className = "" }: ThemeToggleProps): JSX.Element {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Before mount, render a neutral placeholder to avoid hydration mismatch
  const isDark = mounted ? theme === "dark" : true;

  return (
    <button
      type="button"
      onClick={onToggle}
      // eslint-disable-next-line jsx-a11y/aria-proptypes
      aria-pressed={isDark ? "true" : "false"}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`inline-flex items-center justify-center w-11 h-11 rounded-full border border-border-card bg-surface-card-1 backdrop-blur-md transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${className}`.trim()}
      suppressHydrationWarning
    >
      {isDark ? (
        <svg
          width="20"
          height="20"
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
      ) : (
        <svg
          width="20"
          height="20"
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
    </button>
  );
}
