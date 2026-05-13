/**
 * Theme resolution and persistence utilities.
 *
 * Implements the theme-resolution logic described in the design document and
 * Requirement 22 of the Certiq Landing Page spec:
 *   - 22.1: Exactly two Active_Theme values: `dark` and `light`.
 *   - 22.2: Initial theme resolved from persisted storage → OS preference → `"dark"`.
 *   - 22.3: User's chosen theme persisted in `localStorage` under THEME_STORAGE_KEY.
 *
 * All `localStorage` access is wrapped in try/catch to handle environments where
 * storage is unavailable (SSR, private browsing quota exceeded, SecurityError, etc.).
 */

import { type Theme, THEME_STORAGE_KEY, isTheme } from "./types";

/**
 * Resolves the initial theme from the provided inputs following the documented
 * precedence chain:
 *
 * 1. If `stored` is a valid Theme, return it.
 * 2. Else if `prefersDark` is `true`, return `"dark"`.
 * 3. Else if `prefersDark` is `false`, return `"light"`.
 * 4. Else (both null/invalid), default to `"dark"`.
 */
export function resolveInitialTheme(input: {
  stored: string | null;
  prefersDark: boolean | null;
}): Theme {
  if (isTheme(input.stored)) {
    return input.stored;
  }

  if (input.prefersDark === true) {
    return "dark";
  }

  if (input.prefersDark === false) {
    return "light";
  }

  return "dark";
}

/**
 * Persists the given theme to `localStorage` under {@link THEME_STORAGE_KEY}.
 *
 * Silently swallows errors (e.g., quota exceeded, SecurityError in sandboxed
 * iframes, or SSR environments where `localStorage` is undefined).
 */
export function persistTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage unavailable — fail silently.
  }
}

/**
 * Reads the persisted theme from `localStorage`.
 *
 * Returns the stored value if it is a valid {@link Theme}, or `null` if:
 * - No value is stored.
 * - The stored value is not a recognized theme.
 * - `localStorage` is unavailable or throws.
 */
export function readPersistedTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(stored) ? stored : null;
  } catch {
    return null;
  }
}
