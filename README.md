# Certiq

Certiq is a Turborepo monorepo housing the Certiq landing page (Next.js App Router) and its companion API (NestJS), along with a set of shared packages for UI, TypeScript configuration, and ESLint configuration.

## Workspace structure

```
certiq/
├── apps/
│   ├── web/                 # Next.js 14+ App Router landing page (Frontend_App)
│   └── api/                 # NestJS API (Backend_App) exposing GET /health
├── packages/
│   ├── ui/                  # Shared React UI primitives (Button, GlassCard, SectionWrapper, …)
│   ├── tsconfig/            # Shared TypeScript base configs (base, nextjs, nestjs)
│   └── eslint-config/       # Shared flat ESLint configs (base, next, nest)
├── turbo.json               # Turborepo pipeline definitions (build, dev, lint, test)
├── pnpm-workspace.yaml      # pnpm workspace manifest (apps/* and packages/*)
└── package.json             # Root manifest with devDependencies: turbo, typescript, prettier
```

### Apps

| Workspace  | Path        | Stack                        | Purpose                                                                 |
| ---------- | ----------- | ---------------------------- | ----------------------------------------------------------------------- |
| `web`      | `apps/web`  | Next.js (App Router), Tailwind, Framer Motion, GSAP | Certiq landing page. Implements the 14 sections defined in the spec.    |
| `api`      | `apps/api`  | NestJS, TypeScript (strict)  | Backend service. Exposes `GET /health` returning `{ "status": "ok" }`.  |

The landing page does not connect to the API; all content in scope is static/mock data.

### Packages

| Package                  | Path                   | Purpose                                                                 |
| ------------------------ | ---------------------- | ----------------------------------------------------------------------- |
| `@certiq/ui`             | `packages/ui`          | Reusable UI primitives (buttons, cards, badges, section wrappers).      |
| `@certiq/tsconfig`       | `packages/tsconfig`    | Base TypeScript configs (`tsconfig.base.json`, `tsconfig.nextjs.json`, `tsconfig.nestjs.json`) extended by both apps. |
| `@certiq/eslint-config`  | `packages/eslint-config` | Shared flat ESLint configs (`base`, `next`, `nest`) used across apps.  |

## Prerequisites

- **Node.js** 20 or newer
- **pnpm** (pinned via `packageManager` in root `package.json`; Corepack is recommended)

Enable Corepack once to pick up the pinned pnpm version automatically:

```bash
corepack enable
```

## Getting started

Install dependencies for every workspace:

```bash
pnpm install
```

## Commands

All commands are run from the repository root and orchestrated by Turborepo. Turbo resolves the task graph across workspaces, so `packages/ui` builds before `apps/web` automatically.

| Command                | Description                                                                 |
| ---------------------- | --------------------------------------------------------------------------- |
| `pnpm install`         | Install dependencies for every workspace.                                   |
| `turbo run dev`        | Run all dev servers in parallel (Next.js for `apps/web`, Nest for `apps/api`). |
| `turbo run build`      | Build every workspace in dependency order.                                  |
| `turbo run lint`       | Lint every workspace using the shared ESLint configs.                       |
| `turbo run test`       | Run the test suite for every workspace (Vitest, Playwright where wired).    |

### Scoping to a single workspace

Turbo's `--filter` flag targets a single app or package:

```bash
turbo run dev   --filter=web
turbo run build --filter=api
turbo run lint  --filter=@certiq/ui
```

## Development notes

- **TypeScript**: both apps run in `strict` mode via `@certiq/tsconfig`.
- **Tailwind**: `apps/web` binds every design token through CSS custom properties driven by the `data-theme` attribute on `<html>`.
- **Theming**: initial `data-theme` is set server-side to avoid a flash of incorrect theme.
- **Cross-app imports**: `apps/web` is explicitly prevented from importing `apps/api` via an ESLint `no-restricted-imports` rule.

## License

See [LICENSE](./LICENSE).
