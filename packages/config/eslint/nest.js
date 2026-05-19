// @ts-check
/**
 * @certiq/eslint-config/nest
 *
 * Flat ESLint configuration for `apps/api` (NestJS). Extends the shared base
 * with Node-oriented globals and a handful of server-friendly rules. No React
 * plugins are registered here.
 */

import globals from "globals";

import baseConfig from "./base.js";

/** @type {import("eslint").Linter.Config[]} */
const config = [
  ...baseConfig,

  {
    files: ["**/*.{ts,js,mts,cts,mjs,cjs}"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2022,
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      // Nest relies heavily on decorator metadata and constructor injection;
      // suppress rules that fight those patterns without adding value.
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-extraneous-class": "off",
      "@typescript-eslint/no-useless-constructor": "off",

      // Server code should surface unexpected console usage but allow explicit
      // diagnostic channels.
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],

      // Keep the baseline `no-restricted-imports` structure available so
      // individual apps can tighten it without redefining the rule.
      "no-restricted-imports": [
        "error",
        {
          paths: [],
          patterns: [],
        },
      ],
    },
  },

  // Test files relax a few rules that are too strict for spec/fixture code.
  {
    files: [
      "**/*.spec.{ts,js}",
      "**/*.test.{ts,js}",
      "**/*.e2e-spec.{ts,js}",
      "**/__tests__/**/*.{ts,js}",
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];

export default config;
