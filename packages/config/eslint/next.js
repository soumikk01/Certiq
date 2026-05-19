// @ts-check
/**
 * @certiq/eslint-config/next
 *
 * Flat ESLint configuration for `apps/web` (Next.js 14+ App Router).
 * Extends the shared base with React, React Hooks, and jsx-a11y rules, and
 * layers `next/core-web-vitals` via `@eslint/eslintrc`'s FlatCompat since the
 * upstream `eslint-config-next` still ships in the legacy format.
 *
 * Also hardens `no-restricted-imports` so `apps/web` cannot reach into the
 * NestJS server code under `apps/api` (see Requirement 21.8).
 */

import path from "node:path";
import { fileURLToPath } from "node:url";

import { FlatCompat } from "@eslint/eslintrc";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import globals from "globals";

import baseConfig from "./base.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/** @type {import("eslint").Linter.Config[]} */
const config = [
  ...baseConfig,

  // Pull in Next.js Core Web Vitals rules. FlatCompat converts the legacy
  // `extends` string into flat-config entries.
  ...compat.extends("next/core-web-vitals"),

  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "jsx-a11y": jsxA11yPlugin,
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      // React + Hooks recommended rules.
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,

      // jsx-a11y recommended rules to back the accessibility requirements.
      ...jsxA11yPlugin.configs.recommended.rules,

      // Next.js + modern React no longer need the scope import.
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "react/prop-types": "off",

      /**
       * Block the Next.js app from importing server-only NestJS code. The
       * monorepo exposes the API exclusively over HTTP, so any direct import
       * of `apps/api/**` or the `@certiq/api` package from the web app is a
       * layering violation (Requirement 21.8).
       */
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@certiq/api",
              message:
                "apps/web must not import from @certiq/api directly. Call the NestJS service over HTTP instead.",
            },
          ],
          patterns: [
            {
              group: ["**/apps/api/**", "apps/api/**", "@certiq/api/*"],
              message:
                "apps/web must not import from apps/api. Call the NestJS service over HTTP instead.",
            },
          ],
        },
      ],
    },
  },
];

export default config;
