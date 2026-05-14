"use client";

/**
 * Theme system for the Certiq Dashboard.
 *
 * Supports three modes: dark, light, system.
 * Shares the same localStorage key as the landing page so preference syncs.
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

type Theme = "dark" | "light";
type ThemePreference = "dark" | "light" | "system";

const STORAGE_KEY = "certiq-theme";

function isThemePreference(v: unknown): v is ThemePreference {
  return v === "dark" || v === "light" || v === "system";
}

function getSystemDark(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function resolveTheme(pref: ThemePreference, systemDark: boolean): Theme {
  if (pref === "system") return systemDark ? "dark" : "light";
  return pref;
}

function readStored(): ThemePreference | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return isThemePreference(v) ? v : null;
  } catch {
    return null;
  }
}

interface ThemeContextValue {
  theme: Theme;
  preference: ThemePreference;
  setPreference: (p: ThemePreference) => void;
  cycle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function DashboardThemeProvider({ children }: { children: ReactNode }): JSX.Element {
  const [preference, setPreferenceState] = useState<ThemePreference>("dark");
  const [systemDark, setSystemDark] = useState(true);

  useEffect(() => {
    const stored = readStored();
    const osDark = getSystemDark();
    setSystemDark(osDark);

    if (stored) {
      setPreferenceState(stored);
      document.documentElement.dataset.theme = resolveTheme(stored, osDark);
    } else {
      document.documentElement.dataset.theme = osDark ? "dark" : "light";
      setPreferenceState("system");
    }
  }, []);

  // Listen for OS changes
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    function onChange(e: MediaQueryListEvent) {
      setSystemDark(e.matches);
      const stored = readStored();
      if (!stored || stored === "system") {
        document.documentElement.dataset.theme = e.matches ? "dark" : "light";
      }
    }
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const theme: Theme = resolveTheme(preference, systemDark);

  const setPreference = useCallback((p: ThemePreference) => {
    setPreferenceState(p);
    try { localStorage.setItem(STORAGE_KEY, p); } catch {}
    const applied = resolveTheme(p, getSystemDark());
    document.documentElement.dataset.theme = applied;
  }, []);

  const cycle = useCallback(() => {
    const order: ThemePreference[] = ["dark", "light", "system"];
    const idx = order.indexOf(preference);
    const next = order[(idx + 1) % order.length]!;
    setPreference(next);
  }, [preference, setPreference]);

  const value = useMemo(
    () => ({ theme, preference, setPreference, cycle }),
    [theme, preference, setPreference, cycle],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useDashboardTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useDashboardTheme must be used within DashboardThemeProvider");
  return ctx;
}
