/**
 * PostCSS configuration for the Certiq landing page.
 *
 * `apps/web/package.json` sets `"type": "module"`, so this file is treated as
 * an ES module and must use `export default` (Requirement 21.10).
 */
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
