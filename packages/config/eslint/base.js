// @ts-check
/**
 * @certiq/eslint-config/base
 *
 * Shared ESLint flat-config baseline for every TypeScript workspace in the
 * Certiq monorepo. Consumers (`next`, `nest`) extend this array and append
 * environment-specific rules. See Requirement 21.8.
 *
 * Flat config reference:
 *   https://eslint.org/docs/latest/use/configure/configuration-files-new
 */

import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import unusedImports from "eslint-plugin-unused-imports";
import prettier from "eslint-config-prettier";
import globals from "globals";

/** @type {import("eslint").Linter.Config[]} */
const config = [
  {
    // Global ignore patterns applied to every consumer of this config.
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "**/.turbo/**",
      "**/coverage/**",
      "**/build/**",
      "**/out/**",
      "**/*.min.js",
    ],
  },

  // ESLint recommended JS rules as the floor.
  js.configs.recommended,

  // TypeScript source files.
  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.es2022,
        ...globals.node,
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "unused-imports": unusedImports,
    },
    rules: {
      // Baseline TypeScript recommendations (non type-checked for speed; apps
      // can layer the type-checked preset on top if they need it).
      ...tsPlugin.configs.recommended.rules,

      // Prefer the unused-imports plugin's variants so auto-fix can prune
      // imports while still surfacing unused locals.
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],

      // Minor ergonomic defaults shared by every workspace.
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/ban-ts-comment": [
        "error",
        {
          "ts-expect-error": "allow-with-description",
          "ts-ignore": true,
          "ts-nocheck": true,
          "ts-check": false,
          minimumDescriptionLength: 5,
        },
      ],

      /**
       * Placeholder `no-restricted-imports` rule. Environment-specific configs
       * (`next.js`, `nest.js`) extend this entry with the patterns relevant to
       * their runtime (e.g. blocking `apps/api` imports from the web app).
       */
      "no-restricted-imports": [
        "error",
        {
          paths: [],
          patterns: [],
        },
      ],
    },
  },

  // Plain JavaScript/ESM tooling files (config files, scripts).
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.es2022,
        ...globals.node,
      },
    },
    plugins: {
      "unused-imports": unusedImports,
    },
    rules: {
      "unused-imports/no-unused-imports": "error",
    },
  },

  // Disable stylistic rules that conflict with Prettier formatting. Must stay
  // last so it overrides anything above.
  prettier,
];

export default config;
