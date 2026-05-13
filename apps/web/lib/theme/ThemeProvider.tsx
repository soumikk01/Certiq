"use client";

/**
 * ThemeProvider — React context for the Certiq two-theme system.
 *
 * Provides `useTheme()` hook with `theme`, `setTheme`, and `toggle`.
 * Applies transition-duration on theme-dependent properties (150–400 ms)
 * and sets it to 0 when `prefers-reduced-motion` is active.
 *
 * The initial state is always "dark" (the SSR default) to avoid hydration
 * mismatch. After mount, it syncs with the actual `data-theme` attribute
 * which may have been set by the inline head script.
 *
 * Requirements: 22.5, 22.6, 22.7
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { type Theme, THEME_STORAGE_KEY, isTheme } from "./types";
import { persistTheme } from "./resolve";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }): JSX.Element {
  // Always start with "dark" to match SSR output and avoid hydration mismatch.
  const [theme, setThemeState] = useState<Theme>("dark");

  // After mount, sync with the actual DOM theme (set by the inline head script).
  useEffect(() => {
    const val = document.documentElement.dataset.theme;
    if (isTheme(val) && val !== "dark") {
      setThemeState(val);
    }
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    document.documentElement.dataset.theme = t;
    persistTheme(t);
  }, []);

  const toggle = useCallback(() => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    setTheme(next);
  }, [setTheme]);

  // Sync with external changes (e.g. other tabs via storage event)
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === THEME_STORAGE_KEY && isTheme(e.newValue)) {
        setThemeState(e.newValue);
        document.documentElement.dataset.theme = e.newValue;
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Apply transition class for smooth theme switching
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const html = document.documentElement;

    function applyTransition() {
      if (mq.matches) {
        html.style.setProperty("--theme-transition-duration", "0ms");
      } else {
        html.style.setProperty("--theme-transition-duration", "200ms");
      }
    }

    applyTransition();
    mq.addEventListener("change", applyTransition);
    return () => mq.removeEventListener("change", applyTransition);
  }, []);

  const value = useMemo(() => ({ theme, setTheme, toggle }), [theme, setTheme, toggle]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Access the current theme, setTheme, and toggle functions.
 * Must be used within a ThemeProvider.
 */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
