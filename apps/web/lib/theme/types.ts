/**
 * Theme system — shared types and constants.
 *
 * Implements the foundation for the two-theme design system described in
 * Requirement 22 of the Certiq Landing Page spec:
 *   - 22.1: Exactly two Active_Theme values are supported: `dark` and `light`.
 *   - 22.2: The initial theme is resolved from persisted storage, then the OS
 *           `prefers-color-scheme`, and finally defaults to `dark`.
 *   - 22.3: The user's chosen theme is persisted in `localStorage` under a
 *           stable key and restored in preference to OS preference on revisit.
 *
 * This module intentionally has no side effects and performs no DOM, storage,
 * or `window` access. It is safe to import from both server and client code.
 */

/**
 * The set of supported Active_Theme values.
 *
 * Per Requirement 22.1, the landing page supports exactly these two values.
 */
export type Theme = "dark" | "light";

/**
 * Stable `localStorage` key used to persist the user's Active_Theme choice.
 *
 * Per Requirement 22.3, the persisted value under this key takes precedence
 * over the OS `prefers-color-scheme` media query on subsequent visits.
 */
export const THEME_STORAGE_KEY = "certiq-theme" as const;

/**
 * The exhaustive, ordered list of supported themes.
 *
 * Useful for iteration (e.g., generating token maps per theme) and for runtime
 * membership checks via {@link isTheme}.
 */
export const THEMES: readonly Theme[] = ["dark", "light"] as const;

/**
 * Narrowing type guard: returns `true` only when `value` is one of the
 * supported {@link Theme} string literals.
 *
 * Use this when reading untrusted inputs (for example, values pulled from
 * `localStorage`) before applying them as the Active_Theme.
 */
export function isTheme(value: unknown): value is Theme {
  return value === "dark" || value === "light";
}
