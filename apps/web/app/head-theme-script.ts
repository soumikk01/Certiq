/**
 * Pre-hydration inline script for theme resolution.
 *
 * This string is injected into `<head>` via a `<script>` tag in the root
 * layout so that `document.documentElement.dataset.theme` is set *before*
 * the first paint, eliminating FOUC (flash of unstyled content).
 *
 * Resolution order (Requirements 22.2, 22.4):
 *   1. `localStorage.getItem("certiq-theme")` — if "dark" or "light", use it.
 *   2. `window.matchMedia("(prefers-color-scheme: dark)").matches` — dark/light.
 *   3. Fall back to "dark" if matchMedia is unsupported or inconclusive.
 *
 * The entire body is wrapped in try/catch so that storage errors (e.g. Safari
 * private mode, disabled cookies) never break the page (Requirement 22.8).
 */
export const HEAD_THEME_SCRIPT: string = `try{var t=localStorage.getItem("certiq-theme");if(t==="dark"||t==="light"){document.documentElement.dataset.theme=t}else{document.documentElement.dataset.theme=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":window.matchMedia?"light":"dark"}}catch(e){document.documentElement.dataset.theme="dark"}`;
