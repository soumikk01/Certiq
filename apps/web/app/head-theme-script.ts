/**
 * Pre-hydration inline script for theme resolution.
 *
 * Injected into <head> to set data-theme before first paint (no FOUC).
 *
 * Resolution order:
 *   1. localStorage "certiq-theme" → "dark" or "light" → use directly
 *   2. localStorage "certiq-theme" → "system" → use OS prefers-color-scheme
 *   3. No stored value → use OS prefers-color-scheme
 *   4. Fallback → "dark"
 */
export const HEAD_THEME_SCRIPT: string = `try{var t=localStorage.getItem("certiq-theme");if(t==="dark"||t==="light"){document.documentElement.dataset.theme=t}else{var d=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.dataset.theme=d?"dark":"light"}}catch(e){document.documentElement.dataset.theme="dark"}`;
