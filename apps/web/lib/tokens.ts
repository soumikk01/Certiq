/**
 * Design token map — mirrors the CSS custom-property contract one-to-one.
 *
 * This module is a pure, side-effect-free representation of the two-theme
 * palette declared in `app/globals.css`. It exists so that:
 *   - Property-based tests can validate CSS ↔ JS consistency.
 *   - Non-CSS contexts (SVG fills, canvas, programmatic tinting) can resolve
 *     canonical token values without parsing stylesheets.
 *
 * Implements Requirements 1.1, 1.2, 1.3, 1.4, 21.10.
 */

import type { Theme } from "./theme/types";

// ---------------------------------------------------------------------------
// Token key type — every addressable design token in the system.
// ---------------------------------------------------------------------------

export type DesignToken =
  | "bg.1"
  | "bg.2"
  | "bg.3"
  | "text.headline"
  | "text.body"
  | "text.muted"
  | "surface.card.1"
  | "surface.card.2"
  | "border.card"
  | "shadow.glass"
  | "accent"
  | "accent.alt";

// ---------------------------------------------------------------------------
// Structured token interface — groups tokens by semantic role.
// ---------------------------------------------------------------------------

export interface ThemeTokens {
  background: { 1: string; 2: string; 3: string };
  text: { headline: string; body: string; muted: string };
  accent: { primary: string; alt: string };
  surface: { card1: string; card2: string };
  border: { card: string };
  shadow: { glass: string };
  glow: {
    accentOpacityHover: [number, number];
    accentOpacityAmbient: [number, number];
  };
  overlay: { noiseOpacity: [number, number] };
}

// ---------------------------------------------------------------------------
// Dark theme tokens (Requirement 1 — dark values)
// ---------------------------------------------------------------------------

const DARK_TOKENS: ThemeTokens = {
  background: {
    1: "#0F172A",
    2: "#111827",
    3: "#1E293B",
  },
  text: {
    headline: "#FFFFFF",
    body: "#CBD5E1",
    muted: "#94A3B8",
  },
  accent: {
    primary: "#D9FF3F",
    alt: "#C7FF00",
  },
  surface: {
    card1: "rgba(255,255,255,0.04)",
    card2: "rgba(255,255,255,0.08)",
  },
  border: {
    card: "rgba(255,255,255,0.08)",
  },
  shadow: {
    glass: "0 16px 40px rgba(0,0,0,0.40)",
  },
  glow: {
    accentOpacityHover: [0.30, 0.60],
    accentOpacityAmbient: [0.10, 0.25],
  },
  overlay: {
    noiseOpacity: [0.03, 0.08],
  },
};

// ---------------------------------------------------------------------------
// Light theme tokens (Requirement 1 — light values)
// ---------------------------------------------------------------------------

const LIGHT_TOKENS: ThemeTokens = {
  background: {
    1: "#FFFFFF",
    2: "#F8FAFC",
    3: "#EEF2F7",
  },
  text: {
    headline: "#111111",
    body: "#64748B",
    muted: "#94A3B8",
  },
  accent: {
    primary: "#D9FF3F",
    alt: "#C7FF00",
  },
  surface: {
    card1: "rgba(255,255,255,0.72)",
    card2: "rgba(255,255,255,0.88)",
  },
  border: {
    card: "rgba(15,23,42,0.10)",
  },
  shadow: {
    glass: "0 16px 40px rgba(15,23,42,0.10)",
  },
  glow: {
    accentOpacityHover: [0.30, 0.60],
    accentOpacityAmbient: [0.08, 0.18],
  },
  overlay: {
    noiseOpacity: [0.02, 0.05],
  },
};

// ---------------------------------------------------------------------------
// Combined token map keyed by theme.
// ---------------------------------------------------------------------------

export const TOKENS: Record<Theme, ThemeTokens> = {
  dark: DARK_TOKENS,
  light: LIGHT_TOKENS,
};

// ---------------------------------------------------------------------------
// resolveToken — maps a DesignToken key to its canonical string value.
// ---------------------------------------------------------------------------

/**
 * Resolve a design token to its canonical value for the given theme.
 *
 * This is a pure function with no side effects. It mirrors the CSS custom
 * property declarations in `globals.css` so that non-CSS consumers (tests,
 * SVG fills, canvas rendering) can obtain the same values.
 */
export function resolveToken(token: DesignToken, theme: Theme): string {
  const t = TOKENS[theme];

  switch (token) {
    case "bg.1":
      return t.background[1];
    case "bg.2":
      return t.background[2];
    case "bg.3":
      return t.background[3];
    case "text.headline":
      return t.text.headline;
    case "text.body":
      return t.text.body;
    case "text.muted":
      return t.text.muted;
    case "surface.card.1":
      return t.surface.card1;
    case "surface.card.2":
      return t.surface.card2;
    case "border.card":
      return t.border.card;
    case "shadow.glass":
      return t.shadow.glass;
    case "accent":
      return t.accent.primary;
    case "accent.alt":
      return t.accent.alt;
  }
}
