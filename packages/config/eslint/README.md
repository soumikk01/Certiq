# @certiq/eslint-config

Shared ESLint flat configurations for the Certiq monorepo.

## Entry points

| Export  | Consumer       | Notes                                                                       |
| ------- | -------------- | --------------------------------------------------------------------------- |
| `base`  | all workspaces | TypeScript + unused-imports baseline, Prettier compatibility                |
| `next`  | `apps/web`     | Extends `base`, adds React, React Hooks, jsx-a11y, Next.js core-web-vitals  |
| `nest`  | `apps/api`     | Extends `base`, Node-oriented globals and rule tweaks (no React plugins)    |

All three exports are ESM flat-config arrays and can be spread directly inside
an app's `eslint.config.js`:

```js
// apps/web/eslint.config.js
import next from "@certiq/eslint-config/next";

export default [...next];
```

```js
// apps/api/eslint.config.js
import nest from "@certiq/eslint-config/nest";

export default [...nest];
```

## Layering rules

The `next` config tightens `no-restricted-imports` so `apps/web` cannot import
from `apps/api` or the `@certiq/api` package, enforcing the HTTP boundary
between the Next.js frontend and the NestJS service (Requirement 21.8).

The `base` and `nest` exports expose `no-restricted-imports` with an empty
`paths` / `patterns` shape so consuming apps can extend it further without
redefining the rule from scratch.

## Peer dependencies

Peer dependencies are declared in `package.json`. Install them at the
workspace root (or inside each app) as needed:

- `eslint`
- `@eslint/js`
- `@eslint/eslintrc` (for `FlatCompat` in `next`)
- `@typescript-eslint/eslint-plugin`
- `@typescript-eslint/parser`
- `eslint-plugin-unused-imports`
- `eslint-config-prettier`
- `globals`
- `eslint-plugin-react` (optional, for `next`)
- `eslint-plugin-react-hooks` (optional, for `next`)
- `eslint-plugin-jsx-a11y` (optional, for `next`)
- `eslint-config-next` (optional, for `next`)
