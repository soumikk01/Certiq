// @ts-check
/**
 * ESLint flat config for `apps/web`.
 *
 * Re-exports the shared Next preset from `@certiq/eslint-config/next`
 * (Requirement 21.8).
 */

import next from "@certiq/eslint-config/next";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...next,
  {
    ignores: [".next/**", "node_modules/**", "dist/**", "coverage/**"],
  },
];
