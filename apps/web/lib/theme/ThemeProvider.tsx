"use client";

/**
 * ThemeProvider — React context for the Certiq two-theme system.
 *
 * Provides `useTheme()` hook with `theme`, `setTheme`, and `toggle`.
 * Applies transition-duration on theme-dependent properties (150–400 ms)
 * and sets it to 0 when `prefers-reduced-motion` is active.
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

/**
 * Read the current data-theme attribute from the document.
 * Falls back to "dark" if unavailable.
 */
function getDocumentTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  const val = document.documentElement.dataset.theme;
  return isTheme(val) ? val : "dark";
}

export function ThemeProvider({ children }: { children: ReactNode }): JSX.Element {
  const [theme, setThemeState] = useState<Theme>(getDocumentTheme);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    document.documentElement.dataset.theme = t;
    persistTheme(t);
  }, []);

  const toggle = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

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
