"use client";

/**
 * ThemeProvider — React context for the Certiq theme system.
 *
 * Supports three modes:
 *   - "dark": always dark theme
 *   - "light": always light theme
 *   - "system": follows OS prefers-color-scheme (auto-updates on change)
 *
 * The applied theme on the DOM is always "dark" or "light".
 * The preference (stored in localStorage) can be "dark", "light", or "system".
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

import { type Theme, type ThemePreference, THEME_STORAGE_KEY, isTheme, isThemePreference } from "./types";
import { resolveTheme, persistTheme, readPersistedPreference } from "./resolve";

interface ThemeContextValue {
  /** The currently applied theme ("dark" or "light") */
  theme: Theme;
  /** The user's preference ("dark", "light", or "system") */
  preference: ThemePreference;
  /** Set a specific preference */
  setPreference: (p: ThemePreference) => void;
  /** Cycle through: dark → light → system → dark */
  cycle: () => void;
  /** Legacy toggle (dark ↔ light, ignores system) */
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Get the OS color scheme preference */
function getSystemPrefersDark(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function ThemeProvider({ children }: { children: ReactNode }): JSX.Element {
  // Start with "dark" to match SSR output and avoid hydration mismatch.
  const [preference, setPreferenceState] = useState<ThemePreference>("dark");
  const [systemDark, setSystemDark] = useState(true);

  // After mount, sync with actual state
  useEffect(() => {
    const stored = readPersistedPreference();
    const osDark = getSystemPrefersDark();
    setSystemDark(osDark);

    if (stored) {
      setPreferenceState(stored);
      const applied = resolveTheme(stored, osDark);
      document.documentElement.dataset.theme = applied;
    } else {
      // No stored preference — check what the head script set
      const current = document.documentElement.dataset.theme;
      if (isTheme(current)) {
        setPreferenceState(current);
      }
    }
  }, []);

  // Listen for OS color scheme changes (for "system" mode)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");

    function onChange(e: MediaQueryListEvent) {
      setSystemDark(e.matches);
      // If preference is "system", update the applied theme
      const stored = readPersistedPreference();
      if (stored === "system" || (!stored && preference === "system")) {
        const applied = e.matches ? "dark" : "light";
        document.documentElement.dataset.theme = applied;
      }
    }

    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [preference]);

  // Compute the applied theme
  const theme: Theme = resolveTheme(preference, systemDark);

  const setPreference = useCallback((p: ThemePreference) => {
    setPreferenceState(p);
    persistTheme(p);
    const osDark = getSystemPrefersDark();
    const applied = resolveTheme(p, osDark);
    document.documentElement.dataset.theme = applied;
  }, []);

  const cycle = useCallback(() => {
    const order: ThemePreference[] = ["dark", "light", "system"];
    const currentIdx = order.indexOf(preference);
    const next = order[(currentIdx + 1) % order.length]!;
    setPreference(next);
  }, [preference, setPreference]);

  const toggle = useCallback(() => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setPreference(next);
  }, [theme, setPreference]);

  // Sync with external changes (other tabs)
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === THEME_STORAGE_KEY && isThemePreference(e.newValue)) {
        setPreferenceState(e.newValue);
        const applied = resolveTheme(e.newValue, getSystemPrefersDark());
        document.documentElement.dataset.theme = applied;
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Apply transition duration for smooth theme switching
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const html = document.documentElement;

    function applyTransition() {
      html.style.setProperty(
        "--theme-transition-duration",
        mq.matches ? "0ms" : "200ms",
      );
    }

    applyTransition();
    mq.addEventListener("change", applyTransition);
    return () => mq.removeEventListener("change", applyTransition);
  }, []);

  const value = useMemo(
    () => ({ theme, preference, setPreference, cycle, toggle }),
    [theme, preference, setPreference, cycle, toggle],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Access the theme context.
 * Must be used within a ThemeProvider.
 */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
