import type { Config } from "tailwindcss";

/**
 * Tailwind configuration for the Certiq landing page.
 *
 * Design-token CSS variables (background, text, surface, border, accent) are
 * bound to Tailwind color names via `rgb(var(--token) / <alpha-value>)` for
 * RGB-triple tokens, and plain `var(--token)` for tokens that include alpha or
 * complex values (surface, border). Task 7.2 binds `--font-serif` / `--font-sans`
 * CSS variables to `theme.fontFamily`.
 *
 * `darkMode: ['attribute', '[data-theme="dark"]']` aligns Tailwind's `dark:`
 * variant with the `data-theme` attribute scheme driven by ThemeProvider
 * (Requirements 21.16, 22.8).
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: {
          1: "rgb(var(--bg-1) / <alpha-value>)",
          2: "rgb(var(--bg-2) / <alpha-value>)",
          3: "rgb(var(--bg-3) / <alpha-value>)",
        },
        text: {
          headline: "rgb(var(--text-headline) / <alpha-value>)",
          body: "rgb(var(--text-body) / <alpha-value>)",
          muted: "rgb(var(--text-muted) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          alt: "rgb(var(--accent-alt) / <alpha-value>)",
        },
        surface: {
          card: {
            1: "var(--surface-card-1)",
            2: "var(--surface-card-2)",
          },
        },
        border: {
          card: "var(--border-card)",
        },
      },
      fontFamily: {
        serif: [
          "var(--font-serif)",
          "Instrument Serif",
          "Georgia",
          "Cambria",
          "Times New Roman",
          "serif",
        ],
        sans: [
          "var(--font-sans)",
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
