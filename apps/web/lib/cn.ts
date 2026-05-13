/**
 * Classnames helper for Certiq.
 *
 * A lightweight, dependency-free implementation that mirrors `clsx` semantics:
 * - strings and numbers are included when truthy
 * - booleans, `null`, and `undefined` are skipped
 * - arrays are flattened recursively
 * - plain objects include keys whose values are truthy
 *
 * Multiple arguments are joined with a single space.
 *
 * @example
 * cn('px-4', isActive && 'bg-accent', { 'opacity-50': disabled });
 *
 * @see Requirements 21.9
 */

export type ClassValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | ClassValue[]
  | Record<string, unknown>;

function appendClass(result: string[], value: ClassValue): void {
  if (value === null || value === undefined || value === false || value === true) {
    return;
  }

  if (typeof value === "string") {
    if (value.length > 0) {
      result.push(value);
    }
    return;
  }

  if (typeof value === "number") {
    // Exclude 0 and NaN to match `clsx`'s truthy-value behavior.
    if (value !== 0 && !Number.isNaN(value)) {
      result.push(String(value));
    }
    return;
  }

  if (Array.isArray(value)) {
    for (const entry of value) {
      appendClass(result, entry);
    }
    return;
  }

  if (typeof value === "object") {
    for (const key of Object.keys(value)) {
      if ((value as Record<string, unknown>)[key]) {
        result.push(key);
      }
    }
  }
}

/**
 * Join a list of class values into a single className string.
 *
 * Falsy values are filtered out, arrays are flattened, and object keys are
 * included when their associated value is truthy.
 */
export function cn(...args: ClassValue[]): string {
  const classes: string[] = [];
  for (const arg of args) {
    appendClass(classes, arg);
  }
  return classes.join(" ");
}

export default cn;
