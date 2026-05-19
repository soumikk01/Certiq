/**
 * @certiq/utils — Shared helper functions
 */

/** Format a date to a human-readable string */
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** Truncate a string to a max length with ellipsis */
export function truncate(str: string, max = 80): string {
  return str.length > max ? str.slice(0, max - 3) + '…' : str;
}

/** Type-safe object entries */
export function entries<T extends object>(obj: T) {
  return Object.entries(obj) as [keyof T, T[keyof T]][];
}

/** Pick only truthy values from an object */
export function compact<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v != null && v !== ''),
  ) as Partial<T>;
}

/** Generate a URL-safe slug from a string */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
