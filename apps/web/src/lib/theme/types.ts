/**
 * Theme system — shared types and constants.
 *
 * Supports three preference modes:
 *   - "dark": always dark
 *   - "light": always light
 *   - "system": follows OS prefers-color-scheme
 *
 * The applied theme (what's set on the DOM) is always "dark" or "light".
 * The preference (what's stored) can be "dark", "light", or "system".
 */

/** The applied theme on the DOM — always one of these two. */
export type Theme = "dark" | "light";

/** The user's preference — includes "system" for OS-following mode. */
export type ThemePreference = "dark" | "light" | "system";

/** Stable localStorage key for the user's theme preference. */
export const THEME_STORAGE_KEY = "certiq-theme" as const;

/** All supported preferences. */
export const THEME_PREFERENCES: readonly ThemePreference[] = ["dark", "light", "system"] as const;

/** Type guard for applied theme. */
export function isTheme(value: unknown): value is Theme {
  return value === "dark" || value === "light";
}

/** Type guard for theme preference (includes "system"). */
export function isThemePreference(value: unknown): value is ThemePreference {
  return value === "dark" || value === "light" || value === "system";
}
