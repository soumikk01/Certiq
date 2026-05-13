// @ts-check
/**
 * ESLint flat config for `apps/api`.
 *
 * Re-exports the shared Nest preset from `@certiq/eslint-config/nest`
 * (Requirement 21.8).
 */

import nest from "@certiq/eslint-config/nest";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nest,
  {
    ignores: ["dist/**", "coverage/**", "node_modules/**"],
  },
];
