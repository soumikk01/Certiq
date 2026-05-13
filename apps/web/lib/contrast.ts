/**
 * WCAG 2.1 color contrast helpers for Certiq.
 *
 * Pure, dependency-free, DOM-free implementations of the sRGB relative
 * luminance and contrast-ratio formulas described in WCAG 2.1. These power
 * both the runtime focus-ring halo decision in light theme and the contrast
 * property tests that iterate every token × background × theme combination.
 *
 * @see Requirements 20.2, 20.3, 20.4
 * @see https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 * @see https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
 */

/** Parsed 8-bit sRGB channel triple. The alpha channel, if present, is ignored. */
export interface RGB {
  readonly r: number;
  readonly g: number;
  readonly b: number;
}

/** WCAG 2.1 AA contrast threshold for normal-size text. */
const AA_NORMAL_RATIO = 4.5;

/** WCAG 2.1 AA contrast threshold for large text and non-text UI components. */
const AA_LARGE_RATIO = 3;

/** Match `#rgb`, `#rgba`, `#rrggbb`, or `#rrggbbaa` (case-insensitive). */
const HEX_PATTERN = /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

function hexPairToByte(pair: string): number {
  const byte = Number.parseInt(pair, 16);
  // `Number.parseInt` returns NaN on invalid input; the regex above already
  // guards against this, but the explicit check keeps the function safe if
  // it is ever called in isolation.
  if (Number.isNaN(byte)) {
    throw new Error(`Invalid hex byte: "${pair}"`);
  }
  return byte;
}

/**
 * Parse a CSS-style hex color string into an 8-bit sRGB triple.
 *
 * Accepts `#rgb`, `#rgba`, `#rrggbb`, and `#rrggbbaa`. The alpha channel, when
 * present, is validated but discarded — WCAG contrast is defined over opaque
 * colors, and callers composite transparent colors before passing them in.
 *
 * @throws {Error} when `hex` is not a string or does not match a supported form.
 */
export function parseHex(hex: string): RGB {
  if (typeof hex !== "string") {
    throw new Error(`Invalid hex color: expected string, received ${typeof hex}`);
  }

  if (!HEX_PATTERN.test(hex)) {
    throw new Error(`Invalid hex color: "${hex}"`);
  }

  const body = hex.slice(1);
  let rPair: string;
  let gPair: string;
  let bPair: string;

  if (body.length === 3 || body.length === 4) {
    // Short form: duplicate each nibble (e.g. "a" -> "aa").
    const r = body.charAt(0);
    const g = body.charAt(1);
    const b = body.charAt(2);
    rPair = `${r}${r}`;
    gPair = `${g}${g}`;
    bPair = `${b}${b}`;
  } else {
    // Long form: consume pairs directly.
    rPair = body.slice(0, 2);
    gPair = body.slice(2, 4);
    bPair = body.slice(4, 6);
  }

  return {
    r: hexPairToByte(rPair),
    g: hexPairToByte(gPair),
    b: hexPairToByte(bPair),
  };
}

function channelToLinear(channel: number): number {
  const srgb = channel / 255;
  return srgb <= 0.03928 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4);
}

/**
 * Compute the WCAG 2.1 relative luminance of a hex color.
 *
 * The channel is converted from 8-bit sRGB to a linear value using the
 * piecewise transfer function, then the three linearized channels are
 * combined with the standard ITU-R BT.709 coefficients.
 *
 * @returns a value in the closed interval `[0, 1]`.
 */
export function relativeLuminance(hex: string): number {
  const { r, g, b } = parseHex(hex);
  const rL = channelToLinear(r);
  const gL = channelToLinear(g);
  const bL = channelToLinear(b);
  return 0.2126 * rL + 0.7152 * gL + 0.0722 * bL;
}

/**
 * Compute the WCAG 2.1 contrast ratio between two hex colors.
 *
 * The formula is `(L_lighter + 0.05) / (L_darker + 0.05)`. The result is
 * clamped to be at least `1` (identical colors) to guard against minor
 * floating-point noise producing a value slightly below `1`.
 *
 * @returns a value in the closed interval `[1, 21]`.
 */
export function contrastRatio(a: string, b: string): number {
  const lumA = relativeLuminance(a);
  const lumB = relativeLuminance(b);
  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);
  const ratio = (lighter + 0.05) / (darker + 0.05);
  return ratio < 1 ? 1 : ratio;
}

/**
 * Check whether a foreground/background pair meets WCAG 2.1 Level AA contrast.
 *
 * @param a - first color (foreground or background; order is irrelevant).
 * @param b - second color.
 * @param large - when `true`, evaluate against the 3:1 threshold used for
 *   large text (≥ 18.66 px bold or ≥ 24 px regular) and non-text UI
 *   components. Defaults to `false` (4.5:1 threshold for normal text).
 */
export function meetsContrastAA(a: string, b: string, large?: boolean): boolean {
  const threshold = large === true ? AA_LARGE_RATIO : AA_NORMAL_RATIO;
  return contrastRatio(a, b) >= threshold;
}
