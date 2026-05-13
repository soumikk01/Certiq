# Implementation Plan: Certiq Landing Page

## Overview

Convert the feature design into a series of prompts for a code-generation LLM that will implement each step with incremental progress. Make sure that each prompt builds on the previous prompts, and ends with wiring things together. There should be no hanging or orphaned code that isn't integrated into a previous step. Focus ONLY on tasks that involve writing, modifying, or testing code.

This plan scaffolds a Turborepo monorepo (pnpm workspaces) with a NestJS `/health` API, a Next.js App Router landing page, and three shared packages (`ui`, `tsconfig`, `eslint-config`). It then builds the two-theme design system on top of CSS variables, wires Tailwind and `next/font`, implements the motion vocabulary (Framer Motion + GSAP) with a reduced-motion gate, composes all 14 sections from mock data modules, and validates behavior with example tests, property-based tests for all 15 correctness properties, a11y tests, and Playwright/Lighthouse integration tests.

Implementation language for all tasks: **TypeScript** (frontend, backend, shared packages, and all tests).

## Tasks

- [x] 1. Scaffold Turborepo monorepo root
  - [x] 1.1 Initialize root `package.json`, `pnpm-workspace.yaml`, `.npmrc`, `.gitignore`, `.editorconfig`
    - Declare workspaces `apps/*` and `packages/*`
    - Pin pnpm version and set `engines`
    - Add root `devDependencies`: `turbo`, `typescript`, `prettier`
    - _Requirements: 21.1, 21.2_
  - [x] 1.2 Configure `turbo.json` with `build`, `dev`, `lint`, `test` pipelines
    - Declare `^build` dependency wiring so `packages/ui` builds before `apps/web`
    - Declare `outputs` for `.next/**`, `dist/**`
    - _Requirements: 21.1, 21.17_
  - [x] 1.3 Create root `README.md` documenting workspace structure and commands
    - Document `pnpm install`, `turbo run dev`, `turbo run build`, `turbo run lint`
    - _Requirements: 21.20_

- [x] 2. Scaffold shared packages
  - [x] 2.1 Create `packages/tsconfig` with `tsconfig.base.json`, `tsconfig.nextjs.json`, `tsconfig.nestjs.json`
    - Enable `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`
    - _Requirements: 21.7, 21.9_
  - [x] 2.2 Create `packages/eslint-config` with shared flat configs (`base`, `next`, `nest`)
    - Include `@typescript-eslint`, `eslint-plugin-react`, `eslint-plugin-jsx-a11y`
    - Add `no-restricted-imports` rule that blocks `apps/web` from importing `apps/api`
    - _Requirements: 21.8_
  - [x] 2.3 Create `packages/ui` workspace skeleton
    - Configure `package.json` exports, `tsconfig.json` extending `packages/tsconfig`, build via `tsup` or `tsc`
    - Export empty index for later primitives
    - _Requirements: 21.6_

- [ ] 3. Scaffold `apps/api` (NestJS) with health endpoint
  - [x] 3.1 Bootstrap NestJS app in `apps/api` using `packages/tsconfig/tsconfig.nestjs.json`
    - Standard `main.ts`, `app.module.ts`, `app.controller.ts`, `app.service.ts`
    - _Requirements: 21.3, 21.5, 21.9, 21.19_
  - [x] 3.2 Implement `GET /health` returning `{ status: "ok" }` with HTTP 200
    - Add `HealthController` and `HealthModule`, wire into `AppModule`
    - _Requirements: 21.5_
  - [ ] 3.3* Unit test for `HealthController` returning `{ status: "ok" }`
    - Use NestJS `Test.createTestingModule` + Vitest
    - _Requirements: 21.5_
  - [x] 3.4* E2E smoke test that boots the app and asserts `GET /health` returns 200 with the exact body
    - _Requirements: 21.5_

- [x] 4. Scaffold `apps/web` (Next.js 14+ App Router)
  - [x] 4.1 Bootstrap Next.js app in `apps/web` using `packages/tsconfig/tsconfig.nextjs.json`
    - Create `app/layout.tsx`, `app/page.tsx`, `app/globals.css` stubs
    - Configure `next.config.ts` with `reactStrictMode`, image formats `['image/avif','image/webp']`
    - _Requirements: 21.3, 21.4, 21.9, 21.18, 19.4_
  - [x] 4.2 Install Tailwind CSS, PostCSS, and autoprefixer; create `tailwind.config.ts` and `postcss.config.js`
    - Configure `darkMode: ['attribute', '[data-theme="dark"]']`
    - Leave color bindings empty (filled in task 5.4)
    - _Requirements: 21.10, 21.16_
  - [x] 4.3 Wire ESLint for `apps/web` to extend `packages/eslint-config/next`
    - _Requirements: 21.8_
  - [x] 4.4 Add `lib/cn.ts` classnames helper
    - _Requirements: 21.9_

- [x] 5. Implement the design-token layer (CSS variables + Tailwind)
  - [x] 5.1 Author `app/globals.css` with `:root[data-theme="dark"]` and `:root[data-theme="light"]` blocks
    - Declare all Background_Palette, Text_Headline, Text_Body, Text_Muted, Card_Surface, Card_Border, shadow, Accent, glow custom properties per Requirement 1
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 21.10, 22.8_
  - [x] 5.2 Implement the global noise/grid overlay layer in `globals.css`
    - Dark-theme opacity 3–8%, light-theme opacity 2–5%, no tiling seams
    - _Requirements: 1.7_
  - [x] 5.3 Implement `lib/tokens.ts` with `DesignToken`, `ThemeTokens`, `TOKENS`, `resolveToken(token, theme)`
    - Mirror the CSS-variable map one-to-one
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 21.10_
  - [x] 5.4 Bind every token in `tailwind.config.ts` via `rgb(var(--token) / <alpha-value>)`
    - Expose `bg.1/2/3`, `text.headline/body/muted`, `surface.card.1/2`, `border.card`, `accent`, `accent.alt`
    - _Requirements: 21.10, 21.16, 22.8_
  - [ ] 5.5* Example unit test asserting `globals.css` declarations match `TOKENS` map for both themes
    - Parse the stylesheet string in Node, compare to `TOKENS`
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  - [ ] 5.6* Write property test for Property 2: design token consistency
    - **Property 2: Design token map resolves consistently across JS, CSS variables, and Tailwind in both themes**
    - **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 21.10, 22.8**
  - [ ] 5.7* Write property test for Property 3: background gradient luminance bounds
    - **Property 3: Background gradients are built from the Active_Theme palette within luminance bounds**
    - **Validates: Requirements 1.5, 1.6**

- [ ] 6. Implement contrast utilities and WCAG property test
  - [x] 6.1 Implement `lib/contrast.ts` with `relativeLuminance(hex)` and `contrastRatio(a, b)`
    - Pure functions, no DOM access
    - _Requirements: 20.2, 20.3, 20.4_
  - [x] 6.2* Write property test for Property 12: contrast ratios meet WCAG 2.1 AA
    - **Property 12: Contrast ratios meet WCAG 2.1 AA for every token × background × theme combination**
    - **Validates: Requirements 20.2, 20.3, 20.4, 22.9**

- [x] 7. Implement typography loading (next/font)
  - [x] 7.1 Load `Instrument_Serif` and `Inter` via `next/font/google` in `app/layout.tsx`
    - `display: "swap"`, `preload: true`, Latin subset, expose as `--font-serif` and `--font-sans`
    - _Requirements: 2.1, 2.2, 2.10_
  - [x] 7.2 Bind font CSS variables in `tailwind.config.ts` `theme.fontFamily.{serif,sans}` with approved alternates and system fallbacks
    - _Requirements: 2.1, 2.2_
  - [ ] 7.3* Unit test that `<html>` exposes both font variables and Tailwind resolves them to the declared stacks
    - _Requirements: 2.1, 2.2, 2.10_
  - [ ] 7.4* Write property test for Property 6: typography roles
    - **Property 6: Typography roles map to the correct font family, text token, and numeric bands**
    - **Validates: Requirements 2.3, 2.5, 2.6, 2.7, 2.8, 2.9, 2.12**

- [x] 8. Implement the theme system
  - [x] 8.1 Implement `lib/theme/types.ts` with `Theme = "dark" | "light"` and the `certiq-theme` storage key
    - _Requirements: 22.1, 22.3_
  - [x] 8.2 Implement `resolveInitialTheme(input)`, `persistTheme(t)`, `readPersistedTheme()` with `try/catch` guards around `localStorage`
    - _Requirements: 22.1, 22.2, 22.3_
  - [ ] 8.3* Write property test for Property 1: initial theme resolution + persistence round-trip
    - **Property 1: Initial theme resolution follows precedence and round-trips through persistence**
    - **Validates: Requirements 22.1, 22.2, 22.3**
  - [x] 8.4 Implement `head-theme-script.ts` exporting the pre-hydration inline script string
    - Reads `localStorage` then `matchMedia('(prefers-color-scheme: dark)')` then defaults to `"dark"`; sets `document.documentElement.dataset.theme`
    - _Requirements: 22.2, 22.4, 22.8_
  - [x] 8.5 Implement `ThemeProvider`, `useTheme` hook, and `toggle()` in `lib/theme/ThemeProvider.tsx`
    - Apply `transition-duration` 150–400ms on theme-dependent properties; set `0` when `prefers-reduced-motion`
    - _Requirements: 22.5, 22.6, 22.7_
  - [x] 8.6 Inject the inline script into `<head>` of `app/layout.tsx` and render `<html data-theme="dark">` as the SSR default
    - _Requirements: 22.4, 22.8_

- [x] 9. Implement the motion system
  - [x] 9.1 Install Framer Motion and GSAP (+ ScrollTrigger) and configure SSR-safe imports
    - _Requirements: 3.1, 21.11_
  - [x] 9.2 Implement `lib/motion/variants.ts` with `EASE_PREMIUM`, `fadeUp`, `scaleIn`, `staggerContainer`, `staggerChild`, `floatY`, `accordionHeight`
    - Durations in [400, 1200] ms; only `opacity`/`transform` animated
    - _Requirements: 3.2, 3.3, 3.4, 3.9_
  - [x] 9.3 Implement `useReducedMotionSafe()` returning `{ reduced, disableParallax, disableFloat, disableHoverScale, instantEntrance, hideParticles }`
    - _Requirements: 3.8, 20.11, 22.7_
  - [x] 9.4 Implement `useInViewReveal(ref, threshold)` using Framer Motion's `useInView`
    - _Requirements: 3.4_
  - [x] 9.5 Implement GSAP utilities in `lib/motion/gsap.ts` that register `ScrollTrigger` and self-kill when `prefers-reduced-motion` is set
    - _Requirements: 3.1, 3.8_
  - [ ] 9.6* Write property test for Property 7: motion variants use only transform/opacity with durations and easings in spec
    - **Property 7: Motion variants use only transform/opacity with durations and easings in spec**
    - **Validates: Requirements 3.2, 3.3, 3.4, 3.9**
  - [ ] 9.7* Write property test for Property 8: reduced-motion gates disable gated motion and shorten entrances to ≤ 150 ms
    - **Property 8: Reduced-motion mode disables gated motion and converts entrances to ≤150 ms opacity transitions**
    - **Validates: Requirements 3.8, 6.11, 11.8, 16.7, 20.11, 22.7**
  - [ ] 9.8* Write property test for Property 9: per-section animation bands
    - **Property 9: Per-section animation parameters lie in their specified numeric bands**
    - **Validates: Requirements 3.5, 3.6, 3.7, 4.2, 4.7, 4.8, 5.8, 5.10, 6.1, 6.2, 6.5, 7.3, 8.3, 9.3, 9.4, 9.6, 10.2, 10.3, 11.3, 11.4, 12.4, 13.3, 14.4, 15.3, 15.5, 16.3, 16.4, 16.8, 17.5**

- [x] 10. Implement shared UI primitives in `packages/ui`
  - [x] 10.1 Implement `Button` with `variant: "primary" | "secondary"` and `asChild` prop
    - Pill radius ≥ half height, min height 44 px, Primary uses Accent_Color bg + `#0F172A` text + Accent_Glow on hover, Secondary uses glass + Card_Border
    - _Requirements: 1.9, 1.11, 3.6, 18.5_
  - [x] 10.2 Implement `GlassCard` with `tint: "default" | "strong"` and `interactive?`
    - Apply backdrop blur 12–24 px, Card_Surface, Card_Border, theme-tuned drop shadow
    - _Requirements: 1.4, 1.8_
  - [x] 10.3 Implement `SectionWrapper` with `id`, `eyebrow`, `heading`, `description`, `align`
    - Enforce ≥ 96 px desktop / ≥ 64 px mobile vertical padding
    - _Requirements: 2.7, 2.8, 2.11_
  - [x] 10.4 Implement `ThemeToggle` (44×44 button, `aria-pressed`, theme-aware `aria-label`, Enter/Space operable)
    - _Requirements: 22.5, 22.6, 20.4_
  - [x] 10.5 Implement `Accordion` (controlled, multi-open) with `<button aria-expanded aria-controls>` triggers and keyboard Enter/Space
    - _Requirements: 15.3, 15.4, 15.5, 15.6, 20.8_
  - [x] 10.6 Implement `ProgressIndicator` (linear + circular variants) accepting `value: 0–100` and `animate?: boolean`
    - _Requirements: 11.2, 11.3, 11.4_
  - [x] 10.7 Implement `Badge`, `Chip`, `Tooltip`, and `Avatar` (with initials fallback on image error)
    - _Requirements: 10.4, 11.5, 13.6_
  - [x] 10.8 Implement focus-ring composition in shared CSS (2 px Accent outline + 2 px offset; add `rgba(15,23,42,0.2)` halo when `data-theme="light"` and contrast < 3:1)
    - _Requirements: 20.4, 4.10_
  - [ ] 10.9* Write property test for Property 4: Glass_Effect, Accent_Glow, and focus-ring band compliance
    - **Property 4: Glass_Effect, Accent_Glow, and focus-ring parameters stay within theme-specific bands**
    - **Validates: Requirements 1.8, 1.9, 1.10, 1.11, 5.10, 6.1, 6.2, 20.4**
  - [ ] 10.10* Write property test for Property 5: saturated-color discipline across rendered sections
    - **Property 5: Saturated-color discipline holds across the page**
    - **Validates: Requirements 1.12, 1.13, 22.10**

- [x] 11. Implement shared effect components
  - [x] 11.1 Implement `NoiseOverlay` (full-viewport fixed layer honoring theme opacity bands)
    - _Requirements: 1.7_
  - [x] 11.2 Implement `AccentGlow` radial-gradient component with theme-aware opacity
    - _Requirements: 1.10, 5.10, 6.2, 16.3_
  - [x] 11.3 Implement `ParticleField` with count clamp [6, 24] and individual opacity 10–40% (hidden under reduced motion)
    - _Requirements: 16.4, 16.7, 20.11_
  - [x] 11.4 Implement `ScrollParallax` wrapper applying 5–30% parallax translation via GSAP ScrollTrigger
    - _Requirements: 3.5_

- [x] 12. Implement mock data modules in `apps/web/data`
  - [x] 12.1 Implement `data/templates.ts` with 6 `Template` entries (executive, minimal, developer, student, creative, ats-professional), each `name.length ≤ 30`, `category.length ≤ 25`
    - _Requirements: 8.1, 8.2, 21.13_
  - [x] 12.2 Implement `data/testimonials.ts` with ≥ 6 `Testimonial` entries (quote, name, profession, company, optional avatarUrl)
    - _Requirements: 13.1, 21.13_
  - [x] 12.3 Implement `data/pricing.ts` with exactly three tiers (`free`, `pro`, `team`), each `features.length ≥ 4`; `highlighted === true` only for `pro`
    - _Requirements: 14.1, 14.2, 14.3, 21.13_
  - [x] 12.4 Implement `data/faq.ts` with ≥ 6 `FaqItem` entries
    - _Requirements: 15.1, 21.13_
  - [x] 12.5 Implement `data/features.ts` with exactly six `FeatureTile`s using the specified titles (ATS Friendly, One Click PDF Export, AI Writing Assistant, Certificate Storage, Shareable Resume Links, Modern Templates)
    - _Requirements: 7.1, 7.2, 21.13_
  - [x] 12.6 Implement `data/bento.ts` with ≥ 6 tiles, at least two with `span !== "1x1"`, each exposing a `render` mini-UI component
    - _Requirements: 12.1, 12.2, 21.13_
  - [x] 12.7 Implement `data/ats.ts` with integer `score ∈ [60, 95]`, strength 0–100, ≥ 3 keyword chips, ≥ 3 suggestions with `text.length ∈ [20, 120]`
    - _Requirements: 11.2, 11.5, 21.13_
  - [x] 12.8 Implement `data/builder.ts` with 7 `BuilderSection`s (profile, skills, education, projects, certifications, experience, theme) and ≥ 3 `previewThemes`
    - _Requirements: 9.2, 9.6, 21.13_
  - [x] 12.9 Implement `data/certificates.ts` with ≥ 3 certificates, at least one `verified === true`, each `tiltDeg ∈ [-3, 3]`
    - _Requirements: 10.2, 10.4, 21.13_
  - [x] 12.10 Implement `data/footer.ts` with logo mark, ≥ 3 link column groups (Product, Company, Legal), ≥ 3 social channels
    - _Requirements: 17.1, 17.2, 17.3, 21.13_
  - [ ] 12.11* Write property test for Property 14: data module structural and content invariants
    - **Property 14: Data modules honor their structural and content invariants**
    - **Validates: Requirements 7.1, 7.2, 8.1, 8.2, 8.7, 10.2, 10.4, 11.2, 11.5, 12.1, 12.2, 13.1, 14.1, 14.2, 15.1, 17.2, 17.3, 17.4**

- [x] 13. Set up the test toolchain
  - [x] 13.1 Install and configure Vitest with jsdom, React Testing Library, and `@testing-library/jest-dom`
    - Shared `vitest.config.ts`, path aliases, setup file
    - _Requirements: 21.17_
  - [x] 13.2 Install and configure `fast-check` with a shared `__fixtures__/regressions/` folder and deterministic seed logging
    - _Requirements: 21.17_
  - [x] 13.3 Install and configure Playwright (`@playwright/test`) with Chromium project, desktop and mobile viewports
    - _Requirements: 19.1, 19.2, 19.3_
  - [x] 13.4 Install and configure `@axe-core/playwright` for a11y sweeps in both themes
    - _Requirements: 20.1, 20.3_

- [x] 14. Build root layout and video-mount gate
  - [x] 14.1 Finalize `app/layout.tsx`: fonts, inline theme script, `ThemeProvider`, `<NoiseOverlay />`, `<html lang="en" data-theme="dark">`
    - _Requirements: 1.7, 2.10, 22.4, 22.8_
  - [x] 14.2 Implement `useShouldMountVideoHero()` returning `true` iff `HeroSection` is visible AND `scrollY >= 200`
    - _Requirements: 19.8_

- [x] 15. Build Section 1 — Navbar
  - [x] 15.1 Implement `Navbar` with fixed glass container, logo + "Certiq" wordmark, center links, Login + Get Started buttons, `ThemeToggle`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_
  - [x] 15.2 Implement scroll compaction (backdrop opacity +10 pp OR padding -4 to -12 px above 24 px scroll)
    - _Requirements: 4.7_
  - [x] 15.3 Implement smooth-scroll to anchors (600–1000 ms) on center-link activation
    - _Requirements: 4.8_
  - [x] 15.4 Implement mobile overlay menu that collapses links, buttons, and `ThemeToggle` behind a menu icon
    - _Requirements: 4.9, 22.5_
  - [x] 15.5 Apply Navbar `nav` landmark with accessible name and focus rings on every interactive element
    - _Requirements: 4.10, 20.9_
  - [ ] 15.6* Unit test exact labels "Templates", "Features", "Pricing", "Resume Builder", "FAQ", "Login", "Get Started"
    - _Requirements: 4.4, 4.5_
  - [ ] 15.7* Write property test for Property 15: Navbar compaction and mobile overlay
    - **Property 15: Navbar compaction responds to scroll within the declared bands**
    - **Validates: Requirements 4.6, 4.7, 4.9, 18.5**

- [x] 16. Build Section 2 — HeroSection
  - [x] 16.1 Implement two-column split layout with headline "Build resumes that feel premium.", subtext, and two CTA buttons
    - Headline uses Headline_Serif, `clamp(64px, 9vw, 120px)`, `line-height: 0.9`, `letter-spacing: -0.04em`, `font-weight: 400`
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 2.4_
  - [x] 16.2 Implement ≥ 5 floating glass cards (resume preview, template selector, AI popup, certificate upload tile, PDF export modal) with Framer Motion float 4–10 px amplitude / 4–8 s period
    - _Requirements: 5.5, 5.7, 5.8_
  - [x] 16.3 Implement mouse-follow translation 4–12 px on floating cards (disabled under reduced motion)
    - _Requirements: 3.7, 3.8_
  - [x] 16.4 Implement ambient radial Accent_Glow behind visual composition (10–25% dark, 8–18% light)
    - _Requirements: 5.10_
  - [x] 16.5 Implement asset-failure fallback that hides the visual column and expands the content column when all card assets fail
    - _Requirements: 5.6_
  - [x] 16.6 Stack columns vertically at Mobile_Breakpoint with visual below text
    - _Requirements: 5.9_
  - [ ] 16.7* Unit test for exact headline text and single `<h1>` in the document
    - _Requirements: 5.2, 20.10_

- [x] 17. Build Section 3 — VideoHero
  - [x] 17.1 Implement `VideoHero` glass container (corner radius 20–32 px, shadow blur 40–120 px, Accent_Glow 8–18%)
    - _Requirements: 6.1, 6.2_
  - [x] 17.2 Render `<video>` with `autoplay`, `muted`, `loop`, `playsinline`, and sources AV1/VP9/H.264 ≤ 6 MB primary variant
    - _Requirements: 6.3, 6.4, 6.9_
  - [x] 17.3 Wire lazy mount through `useShouldMountVideoHero()` (no network request until hero visible AND scrollY ≥ 200)
    - _Requirements: 19.8_
  - [x] 17.4 Implement IntersectionObserver play/pause (play ≥ 25%, pause < 10%) and `document.visibilitychange` pause
    - _Requirements: 6.6, 6.7_
  - [x] 17.5 Implement 8 s `loadstart`→`canplay` timer and swap to poster fallback on timeout/error, preserving glass container
    - _Requirements: 6.8_
  - [x] 17.6 Implement scale-in entrance from 0.94–0.98 → 1.0 over 600–1000 ms at 25% intersection (disabled under reduced motion)
    - _Requirements: 6.5, 6.11_
  - [x] 17.7 Render visually hidden text alternative describing the depicted flow
    - _Requirements: 6.10, 20.7_
  - [ ] 17.8* Unit test video attributes (`autoplay`, `muted`, `loop`, `playsinline`) and poster fallback rendering
    - _Requirements: 6.3, 6.8_
  - [ ] 17.9* Write property test for Property 11: video lifecycle gate
    - **Property 11: Video lifecycle gate controls mount, play, and pause**
    - **Validates: Requirements 6.6, 6.7, 6.8, 19.8**

- [x] 18. Build Section 4 — TrustStrip
  - [x] 18.1 Implement `TrustStrip` server component rendering six glass tiles from `data/features.ts`
    - _Requirements: 7.1, 7.2, 7.8_
  - [x] 18.2 Implement desktop row, tablet 3×2 grid, and mobile scroll-snap row layouts
    - _Requirements: 7.4, 7.5, 7.7_
  - [x] 18.3 Implement `ResizeObserver`-based overflow fallback to scroll-snap row at Tablet_Breakpoint
    - _Requirements: 7.6_
  - [x] 18.4 Implement hover Accent_Glow border and 2–6 px lift on Desktop_Breakpoint
    - _Requirements: 7.3_
  - [ ] 18.5* Unit test the six exact tile titles
    - _Requirements: 7.1_

- [x] 19. Build Section 5 — TemplateShowcase
  - [x] 19.1 Implement gallery of six cards from `data/templates.ts` with preview image, name, category
    - _Requirements: 8.1, 8.2, 8.7_
  - [x] 19.2 Implement single-selection state machine (at most one selected; selecting another clears previous)
    - _Requirements: 8.5, 8.8_
  - [x] 19.3 Implement hover scale 1.03–1.06 with shadow-blur/offset increase over 150–300 ms
    - _Requirements: 8.3_
  - [x] 19.4 Implement selected-state 2 px Accent_Color border + Accent_Glow
    - _Requirements: 8.4_
  - [x] 19.5 Implement responsive layouts: multi-column grid (tablet), scroll-snap carousel (mobile), all-visible desktop grid
    - _Requirements: 8.6, 8.9_

- [x] 20. Build Section 6 — BuilderDemo
  - [x] 20.1 Implement two-column BuilderDemo with 7-section form (Profile, Skills, Education, Projects, Certifications, Experience, Theme Switcher)
    - _Requirements: 9.1, 9.2_
  - [x] 20.2 Wire live preview that updates within 200 ms of any keystroke (no persistence)
    - _Requirements: 9.3, 9.7_
  - [x] 20.3 Implement Autosaved badge pulsing with Accent_Glow at 3–8 s interval
    - _Requirements: 9.4_
  - [x] 20.4 Implement floating "AI suggestions" popup anchored to active form section with ≥ 1 sample suggestion
    - _Requirements: 9.5_
  - [x] 20.5 Implement preview theme switcher with ≥ 3 themes transitioning within 400 ms
    - _Requirements: 9.6_
  - [x] 20.6 Implement mobile stacked layout with scaled-thumbnail preview
    - _Requirements: 9.8_
  - [ ] 20.7* Unit test that edits propagate to preview within 200 ms
    - _Requirements: 9.3_

- [x] 21. Build Section 7 — CertificateStorageSection
  - [x] 21.1 Implement ≥ 3 floating glass certificate cards with tilt in `[-3°, 3°]`
    - _Requirements: 10.2_
  - [x] 21.2 Implement GSAP ScrollTrigger upload choreography (drop-zone → storage stack) over 800–1400 ms on section entry
    - _Requirements: 10.1, 10.3_
  - [x] 21.3 Render "Verified" Accent_Color badge on at least one card
    - _Requirements: 10.4_
  - [x] 21.4 Render adjacent Body_Sans explanatory paragraph in Text_Body
    - _Requirements: 10.5_

- [x] 22. Build Section 8 — AtsSection
  - [x] 22.1 Implement glass panel containing score indicator, keyword match list, strength meter, suggestions list
    - _Requirements: 11.1, 11.6_
  - [x] 22.2 Animate progress fills from 0 to mock value over 800–1600 ms once when ≥ 30% visible (skip under reduced motion)
    - Accent_Color fill at opacity 0.3–0.6 with glow
    - _Requirements: 11.3, 11.4, 11.8_
  - [x] 22.3 Render keyword chips (matched/missing) and suggestions list (20–120 char each)
    - _Requirements: 11.5_
  - [ ] 22.4* Unit test that rendered score is an integer in `[60, 95]`
    - _Requirements: 11.2_

- [x] 23. Build Section 9 — BentoGrid
  - [x] 23.1 Implement asymmetrical grid consuming `data/bento.ts` (≥ 6 tiles, ≥ 3 columns, ≥ 2 spanning tiles)
    - _Requirements: 12.1, 12.2, 12.3_
  - [x] 23.2 Implement hover Accent_Glow 20–40% on desktop tiles
    - _Requirements: 12.4_
  - [x] 23.3 Implement tablet 2-column and mobile 1-column reflow
    - _Requirements: 12.5, 12.6_

- [ ] 24. Checkpoint — verify sections 1–9
  - Ensure all tests pass, ask the user if questions arise.

- [x] 25. Build Section 10 — TestimonialsSection
  - [x] 25.1 Implement ≥ 6 glass testimonial cards with avatar, quote, name, profession, company
    - _Requirements: 13.1, 13.2_
  - [x] 25.2 Implement staggered fade-in with per-card delay 60–140 ms
    - _Requirements: 13.3_
  - [x] 25.3 Implement marquee with pause-on-hover when content exceeds viewport width
    - _Requirements: 13.4_
  - [x] 25.4 Implement static vertical-stack fallback when marquee initialization fails
    - _Requirements: 13.5_
  - [x] 25.5 Implement avatar `onError` → initials badge on Accent_Color tint
    - _Requirements: 13.6_

- [x] 26. Build Section 11 — PricingSection
  - [x] 26.1 Render three tiers (Free, Pro, Team) from `data/pricing.ts` with price, description, ≥ 4 features, CTA
    - _Requirements: 14.1, 14.2_
  - [x] 26.2 Highlight Pro with Accent_Color border, Accent_Glow, scale 1.03–1.08 on desktop
    - _Requirements: 14.3, 14.4_
  - [x] 26.3 Stack vertically at Mobile_Breakpoint with Pro first
    - _Requirements: 14.5_

- [x] 27. Build Section 12 — FaqSection
  - [x] 27.1 Render ≥ 6 glass accordion items (multi-open) with chevron indicators rotating 180° when open
    - _Requirements: 15.1, 15.2, 15.4, 15.5_
  - [x] 27.2 Implement height transition 300–600 ms on expand/collapse
    - _Requirements: 15.3_
  - [x] 27.3 Wire keyboard a11y (`aria-expanded`, `aria-controls`, Enter/Space)
    - _Requirements: 15.6, 20.8_
  - [ ] 27.4* Write property test for Property 10: selection and accordion invariants over command sequences
    - **Property 10: State invariants hold under any sequence of user actions**
    - **Validates: Requirements 4.8, 8.5, 8.8, 15.4, 15.5, 16.5, 16.6, 22.1, 22.6**

- [x] 28. Build Section 13 — FinalCta
  - [x] 28.1 Render headline "Create your premium resume today." with staggered char/word reveal over 800–1400 ms
    - _Requirements: 16.1, 16.8_
  - [x] 28.2 Render "Start Building" Primary and "Explore Templates" Secondary CTAs wired to anchor-nav (within 500 ms) to `Builder_Demo` and `Template_Showcase`
    - _Requirements: 16.2, 16.5, 16.6_
  - [x] 28.3 Render gradient background + Accent_Glow focal point (radius ≥ 30% of shorter side, 20–45% dark / 14–30% light)
    - _Requirements: 16.3_
  - [x] 28.4 Render 6–24 particles at 10–40% opacity (hidden under reduced motion, reveal replaced with ≤ 150 ms opacity transition)
    - _Requirements: 16.4, 16.7_

- [x] 29. Build Section 14 — Footer
  - [x] 29.1 Render Footer as `contentinfo` landmark with logo, three link columns (Product/Company/Legal), ≥ 3 social icons, copyright `© {new Date().getFullYear()} Certiq`
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 20.9_
  - [x] 29.2 Render links in Text_Muted → Text_Headline hover transition 150–300 ms
    - _Requirements: 17.5_
  - [x] 29.3 Apply one-step-darker (dark) / one-step-lighter (light) background relative to adjacent section
    - _Requirements: 17.6_

- [x] 30. Compose the landing page and apply performance budgets
  - [x] 30.1 Wire all 14 sections into `app/page.tsx` in the documented order with smooth-scroll anchor IDs
    - _Requirements: 21.4, 21.12_
  - [ ] 30.2 Apply `next/dynamic({ ssr: true, loading: <SkeletonN /> })` to below-the-fold client sections with height-preserving skeletons
    - _Requirements: 19.5, 19.7, 19.2_
  - [ ] 30.3 Replace all image usage with `next/image` + responsive `sizes` + AVIF/WebP
    - _Requirements: 19.4_
  - [ ] 30.4 Enforce no horizontal scroll at widths `[320, 768, 1024, 1440, 2560]` and single-column mobile layouts
    - _Requirements: 18.1, 18.2, 18.3, 18.6_
  - [ ] 30.5 Apply 15–35% section-heading reduction at Mobile_Breakpoint
    - _Requirements: 18.4_
  - [ ] 30.6 Enforce min 44×44 px tap targets across all interactive elements on mobile
    - _Requirements: 18.5, 22.5_

- [ ] 31. Cross-cutting accessibility implementation and tests
  - [ ] 31.1 Ensure single `<h1>` (Hero), monotonic heading levels, proper `<nav>`/`<contentinfo>` landmarks, and top-to-bottom logical tab order across the whole page
    - _Requirements: 20.5, 20.9, 20.10_
  - [ ] 31.2 Ensure every content image has descriptive `alt` and decorative images have `alt=""`
    - _Requirements: 20.6_
  - [ ] 31.3* Write property test for Property 13: a11y and layout invariants across the rendered document
    - **Property 13: Accessibility and layout invariants hold across the document**
    - **Validates: Requirements 4.6, 4.10, 18.2, 18.4, 18.5, 20.5, 20.6, 20.8, 20.10**
  - [ ] 31.4* axe-core Playwright sweep in both themes at desktop and mobile viewports (zero serious/critical)
    - _Requirements: 20.1, 20.2, 20.3_
  - [ ] 31.5* Keyboard traversal test for Tab/Shift-Tab/Enter/Space across accordion and theme toggle
    - _Requirements: 15.6, 20.5, 20.8, 22.5, 22.6_
  - [ ] 31.6* Heading hierarchy test (exactly one `<h1>`, no level jumps > 1)
    - _Requirements: 20.10_

- [ ] 32. Integration and E2E tests
  - [ ] 32.1* Playwright smoke test: page loads, `<html data-theme>` flips on toggle, no FOUC observed
    - _Requirements: 22.4, 22.5, 22.6, 22.8_
  - [ ] 32.2* Playwright E2E for video gate: intercept network and assert no video request before hero visibility AND scrollY ≥ 200
    - _Requirements: 6.6, 6.7, 6.8, 19.8_
  - [ ] 32.3* Playwright horizontal-scroll assertion at `[320, 768, 1024, 1440, 2560]` px
    - _Requirements: 18.1, 18.2_
  - [ ] 32.4* Playwright anchor-nav test verifying Final_CTA buttons scroll to Builder_Demo and Template_Showcase within 500 ms
    - _Requirements: 16.5, 16.6_

- [ ] 33. Performance budgets and bundle analysis
  - [ ] 33.1 Configure Lighthouse CI with budgets LCP ≤ 2.5 s (mobile 4G), CLS ≤ 0.1, INP ≤ 200 ms; fail the build on regression
    - _Requirements: 19.1, 19.2, 19.3, 19.6_
  - [ ] 33.2 Configure `@next/bundle-analyzer` and add a CI assertion enforcing the 250 KB gzipped critical-path JS budget
    - _Requirements: 19.7_
  - [ ] 33.3* Playwright performance spec asserting Lighthouse JSON output is within budgets
    - _Requirements: 19.1, 19.2, 19.3_

- [ ] 34. Final checkpoint — full monorepo green build
  - Run `turbo run build`, `turbo run lint`, `turbo run test` from the repository root and ensure every workspace passes.
  - _Requirements: 21.17, 21.18, 21.19_
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP. The model MUST NOT implement `*` sub-tasks automatically; non-optional sub-tasks MUST be implemented.
- Every task references specific requirement clauses (e.g. `5.10`) rather than just user-story numbers, for traceability.
- Checkpoints (tasks 24 and 34) give the user an opportunity to intervene before larger integration phases.
- Property-based tests cover the 15 correctness properties declared in `design.md`; each property appears in exactly one sub-task, is annotated with its property number, and is co-located with the implementation it validates to surface regressions early.
- Example-based unit tests supplement property tests where copy, labels, or structural shape matters (e.g. exact hero headline, exact tier ids, exact trust-strip titles, exact CTA labels).
- Mock data lives only in `apps/web/data/*.ts`; components never hard-code content strings that belong to that layer (Requirement 21.13).
- `apps/web` never imports from `apps/api`; enforced by ESLint at the workspace boundary (Requirement 21.14).
- All implementation code — frontend, backend, shared packages, tests — is TypeScript in `strict` mode (Requirements 21.9, 21.19).

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "1.3"] },
    { "id": 1, "tasks": ["2.1", "2.2", "2.3"] },
    { "id": 2, "tasks": ["3.1", "4.1"] },
    { "id": 3, "tasks": ["3.2", "4.2", "4.3", "4.4"] },
    { "id": 4, "tasks": ["3.3", "3.4", "5.1", "5.2", "5.3", "6.1", "8.1", "9.1", "13.1", "13.2", "13.3", "13.4"] },
    { "id": 5, "tasks": ["5.4", "5.5", "6.2", "7.1", "8.2", "8.4", "9.2", "9.3", "9.4", "9.5", "12.1", "12.2", "12.3", "12.4", "12.5", "12.6", "12.7", "12.8", "12.9", "12.10"] },
    { "id": 6, "tasks": ["5.6", "5.7", "7.2", "7.4", "8.3", "8.5", "9.6", "9.7", "9.8", "12.11"] },
    { "id": 7, "tasks": ["7.3", "8.6", "10.1", "10.2", "10.3", "10.4", "10.5", "10.6", "10.7", "10.8", "11.1", "11.2", "11.3", "11.4"] },
    { "id": 8, "tasks": ["10.9", "10.10", "14.1", "14.2"] },
    { "id": 9, "tasks": ["15.1", "16.1", "17.1", "18.1", "19.1", "20.1", "21.1", "22.1", "23.1", "25.1", "26.1", "27.1", "28.1", "29.1"] },
    { "id": 10, "tasks": ["15.2", "15.3", "15.4", "15.5", "16.2", "16.3", "16.4", "16.5", "16.6", "17.2", "17.3", "17.4", "17.5", "17.6", "17.7", "18.2", "18.3", "18.4", "19.2", "19.3", "19.4", "19.5", "20.2", "20.3", "20.4", "20.5", "20.6", "21.2", "21.3", "21.4", "22.2", "22.3", "23.2", "23.3", "25.2", "25.3", "25.4", "25.5", "26.2", "26.3", "27.2", "27.3", "28.2", "28.3", "28.4", "29.2", "29.3"] },
    { "id": 11, "tasks": ["15.6", "15.7", "16.7", "17.8", "17.9", "18.5", "20.7", "22.4", "27.4"] },
    { "id": 12, "tasks": ["30.1"] },
    { "id": 13, "tasks": ["30.2", "30.3", "30.4", "30.5", "30.6", "31.1", "31.2"] },
    { "id": 14, "tasks": ["31.3", "31.4", "31.5", "31.6", "32.1", "32.2", "32.3", "32.4", "33.1", "33.2"] },
    { "id": 15, "tasks": ["33.3"] }
  ]
}
```

## Workflow Completion

This workflow is complete. The artifacts (`requirements.md`, `design.md`, `tasks.md`) are ready in `.kiro/specs/certiq-landing-page/`. To begin implementation, open `tasks.md` and click **Start task** next to any task item. Task execution is not part of this workflow.
