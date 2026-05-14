/**
 * Theme resolution and persistence utilities.
 *
 * Supports "dark", "light", and "system" preferences.
 * The "system" preference resolves to the OS prefers-color-scheme value.
 */

import { type Theme, type ThemePreference, THEME_STORAGE_KEY, isThemePreference } from "./types";

/**
 * Resolve the applied theme from a preference and OS setting.
 */
export function resolveTheme(preference: ThemePreference, prefersDark: boolean): Theme {
  if (preference === "system") {
    return prefersDark ? "dark" : "light";
  }
  return preference;
}

/**
 * Persists the theme preference to localStorage.
 */
export function persistTheme(preference: ThemePreference): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // Storage unavailable — fail silently.
  }
}

/**
 * Reads the persisted theme preference from localStorage.
 */
export function readPersistedPreference(): ThemePreference | null {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return isThemePreference(stored) ? stored : null;
  } catch {
    return null;
  }
}
