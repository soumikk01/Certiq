import type { Config } from "tailwindcss";

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
