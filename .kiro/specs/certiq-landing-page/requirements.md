# Requirements Document

## Introduction

Certiq is an AI-powered CV and Resume Builder platform. This document specifies the requirements for the Certiq marketing landing page — a premium, theme-aware single-page website built with Next.js (App Router) inside a Turborepo monorepo that also houses a NestJS backend, styled with Tailwind CSS, animated with Framer Motion, and written in TypeScript.

The landing page communicates Certiq's value proposition through fourteen sequentially arranged sections, a luxury minimalist visual language delivered in two first-class themes (a cinematic dark theme and a clean editorial light theme), cinematic motion, and responsive layout. All interactive product surfaces on the page (resume builder, certificate uploader, ATS analyzer, live preview, template selector) are visual demonstrations only; they render mock data and simulated interactions, and do not connect to a real backend, authentication service, or file storage.

This specification defines:

- Global design system (color, surfaces, effects, tokens) across both themes.
- Typography rules and scale.
- Animation and motion behavior.
- Theme system covering detection, persistence, toggling, and transitions between `dark` and `light` modes.
- Behavior and content for each of the 14 sections.
- Responsive breakpoints and adaptation rules.
- Performance budgets.
- Accessibility conformance targets in both themes.
- Tech stack and architecture constraints.

## Glossary

- **Landing_Page**: The complete single-page Certiq marketing site composed of the 14 sections defined in this document.
- **Design_System**: The set of color tokens, surface styles, effects, spacing, and component primitives shared across the Landing_Page.
- **Typography_System**: The font families, type scale, weights, and line-heights applied across the Landing_Page.
- **Motion_System**: The shared Framer Motion and GSAP configuration (durations, easings, variants) that governs animations on the Landing_Page.
- **Navbar**: Section 1 — the top navigation bar.
- **Hero_Section**: Section 2 — the primary above-the-fold split hero.
- **Video_Hero**: Section 3 — the cinematic autoplay product video block.
- **Trust_Strip**: Section 4 — the horizontal bento row of feature pills.
- **Template_Showcase**: Section 5 — the cinematic template gallery.
- **Builder_Demo**: Section 6 — the live editing-and-preview demo.
- **Certificate_Storage_Section**: Section 7 — the certificate upload and attachment demo.
- **ATS_Section**: Section 8 — the ATS optimization dashboard mock.
- **Bento_Grid**: Section 9 — the asymmetrical analytics and feature bento.
- **Testimonials_Section**: Section 10 — the floating customer testimonial cards.
- **Pricing_Section**: Section 11 — the pricing tier comparison.
- **FAQ_Section**: Section 12 — the premium accordion FAQ.
- **Final_CTA**: Section 13 — the closing call-to-action block.
- **Footer**: Section 14 — the minimal site footer.
- **Primary_CTA_Button**: A pill-shaped button filled with the Accent_Color (#D9FF3F) used for primary conversion actions.
- **Secondary_CTA_Button**: A pill-shaped button with a transparent or glass surface and white text used for secondary actions.
- **Accent_Color**: The neon green-yellow brand accent `#D9FF3F` (with `#C7FF00` as an approved alternate for glows). The Accent_Color is the single saturated brand accent in both Active_Theme values.
- **Background_Palette_Dark**: The deep navy/slate gradient palette used when Active_Theme is `dark`, composed of `#0F172A`, `#111827`, and `#1E293B`.
- **Background_Palette_Light**: The editorial off-white gradient palette used when Active_Theme is `light`, composed of `#FFFFFF`, `#F8FAFC`, and `#EEF2F7`, with every stop rendered at HSL saturation less than or equal to 20%.
- **Background_Palette**: The palette matching the Active_Theme; resolves to Background_Palette_Dark when Active_Theme is `dark` and to Background_Palette_Light when Active_Theme is `light`. Used by sections that adapt to the Active_Theme.
- **Headline_Serif**: The editorial serif font stack used for hero headlines, cinematic statements, major section titles, and emotional branding text. Primary family `Instrument Serif`; approved alternates `Canela`, `PP Editorial New`, `Cormorant Garamond`, and `Bodoni Moda`; followed by a serif system fallback (e.g. `ui-serif, Georgia, serif`).
- **Body_Sans**: The clean sans-serif font stack used for navigation, buttons, descriptions, cards, forms, dashboard UI, analytics, labels, eyebrow labels, pricing, FAQ, and footer text. Primary family `Inter`; approved alternates `SF Pro Display`, `General Sans`, and `Suisse Intl`; followed by a sans-serif system fallback (e.g. `ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif`).
- **Text_Headline**: The headline text color token. Dark-mode value `#FFFFFF`. Light-mode value `#111111`. The Landing_Page applies the value matching the Active_Theme at runtime.
- **Text_Body**: The body copy text color token. Dark-mode value `#CBD5E1`. Light-mode value `#64748B`. The Landing_Page applies the value matching the Active_Theme at runtime.
- **Text_Muted**: The muted/caption text color token. Dark-mode value `#94A3B8`. Light-mode value `#94A3B8`. The Landing_Page applies the value matching the Active_Theme at runtime.
- **Card_Surface**: The translucent fill used on glass panels. Dark-mode values are `rgba(255, 255, 255, 0.04)` to `rgba(255, 255, 255, 0.08)` over the Background_Palette_Dark. Light-mode values are `rgba(255, 255, 255, 0.72)` to `rgba(255, 255, 255, 0.88)` over the Background_Palette_Light. The Landing_Page applies the value matching the Active_Theme.
- **Card_Border**: The 1px border used on glass surfaces. Dark-mode value `rgba(255, 255, 255, 0.08)`. Light-mode value between `rgba(15, 23, 42, 0.08)` and `rgba(15, 23, 42, 0.12)`. The Landing_Page applies the value matching the Active_Theme.
- **Glass_Effect**: A visual treatment combining translucent Card_Surface, 1px Card_Border, backdrop blur, and soft drop shadow, with shadow color tuned per Active_Theme as specified in Requirement 1.
- **Accent_Glow**: A radial glow effect using Accent_Color at reduced opacity used for hover states, selected states, and ambient lighting, with opacity and spread ranges tuned per Active_Theme as specified in Requirement 1.
- **Theme**: A named visual mode of the Landing_Page; exactly one of the two values `dark` or `light`.
- **Active_Theme**: The Theme currently applied to the Landing_Page. Drives all theme-dependent CSS variables via a root-level `data-theme` attribute on the `<html>` element.
- **Theme_Toggle**: The user-facing control in the Navbar that switches Active_Theme between `dark` and `light`.
- **Reduced_Motion_Mode**: The user-preference state where `prefers-reduced-motion: reduce` is set by the operating system or browser.
- **Desktop_Breakpoint**: Viewport width ≥ 1024px.
- **Tablet_Breakpoint**: Viewport width ≥ 768px and < 1024px.
- **Mobile_Breakpoint**: Viewport width < 768px.
- **LCP**: Largest Contentful Paint, a Core Web Vital.
- **CLS**: Cumulative Layout Shift, a Core Web Vital.
- **INP**: Interaction to Next Paint, a Core Web Vital.
- **WCAG**: Web Content Accessibility Guidelines, version 2.1, Level AA.
- **ATS**: Applicant Tracking System — automated resume parsing software used by employers.
- **Monorepo**: The Turborepo-managed monorepo that contains all workspace packages including the frontend app, backend app, and shared packages.
- **Frontend_App**: The Next.js (App Router) application located at `apps/web` (or equivalent) that renders the Landing_Page.
- **Backend_App**: The NestJS application located at `apps/api` (or equivalent) that provides the backend API. For the landing page scope, the Backend_App exists as a scaffold with health-check endpoint only; no business logic is required for the landing page itself.
- **Shared_Packages**: Workspace packages under `packages/` (e.g. `packages/ui`, `packages/config`, `packages/tsconfig`) shared between Frontend_App and Backend_App.

## Requirements

### Requirement 1: Global Design System

**User Story:** As a visitor, I want the site to feel consistently premium and cinematic across every section, so that Certiq communicates trust and quality at a glance.

#### Acceptance Criteria

1. THE Design_System SHALL expose the Background_Palette_Dark values `#0F172A`, `#111827`, and `#1E293B` and the Background_Palette_Light values `#FFFFFF`, `#F8FAFC`, and `#EEF2F7` as named tokens usable by every section, and SHALL resolve the Background_Palette alias to whichever palette matches the Active_Theme.
2. THE Design_System SHALL expose Accent_Color `#D9FF3F` and its alternate `#C7FF00` as named tokens shared by both Active_Theme values.
3. THE Design_System SHALL expose Text_Headline, Text_Body, and Text_Muted as named tokens, each with both a dark-mode value (`#FFFFFF`, `#CBD5E1`, and `#94A3B8` respectively) and a light-mode value (`#111111`, `#64748B`, and `#94A3B8` respectively), and SHALL apply the value matching the Active_Theme at runtime.
4. THE Design_System SHALL expose Card_Surface and Card_Border as named tokens with distinct dark-mode and light-mode values as defined in the Glossary, and SHALL apply the value matching the Active_Theme at runtime.
5. WHERE Active_Theme is `dark`, THE Landing_Page SHALL render a cinematic dark background composed of a gradient blending at least two Background_Palette_Dark colors with a minimum of two color stops, and SHALL NOT render a pure black (`#000000`) background or any background whose average luminance exceeds that of `#1E293B`.
6. WHERE Active_Theme is `light`, THE Landing_Page SHALL render a calm editorial light background composed of a gradient blending at least two Background_Palette_Light colors with a minimum of two color stops, and SHALL NOT render a pure white (`#FFFFFF`) background or any background whose average luminance drops below that of `#EEF2F7`.
7. WHERE Active_Theme is `dark`, THE Landing_Page SHALL render a subtle noise or grid texture overlay on the global background at opacity between 3% and 8%, and WHERE Active_Theme is `light`, THE Landing_Page SHALL render the same overlay at opacity between 2% and 5%, in both cases covering 100% of the viewport without visible tiling seams and without reducing text contrast below the thresholds in Requirement 20.
8. THE Design_System SHALL define the Glass_Effect with a backdrop blur between 12px and 24px, a 1px Card_Border, and a drop shadow with blur radius between 20px and 60px and vertical offset between 8px and 24px, where the shadow color is `rgba(0, 0, 0, X)` with X between 0.25 and 0.50 when Active_Theme is `dark` and `rgba(15, 23, 42, X)` with X between 0.06 and 0.14 when Active_Theme is `light`.
9. THE Design_System SHALL define Primary_CTA_Button as a pill-shaped button with border-radius greater than or equal to half the button height, Accent_Color background, `#0F172A` text in both Active_Theme values, minimum height 44px, and an Accent_Glow hover state.
10. THE Design_System SHALL define Accent_Glow as a hover-state box shadow using Accent_Color at opacity between 30% and 60% with blur radius between 16px and 32px and spread between 0px and 4px when Active_Theme is `dark`, and between 0px and 6px when Active_Theme is `light`, applied within 200ms of hover entry in both Active_Theme values.
11. THE Design_System SHALL define Secondary_CTA_Button as a pill-shaped button with border-radius greater than or equal to half the button height, a transparent or Glass_Effect background, Text_Headline text, a 1px Card_Border matching the Active_Theme, and minimum height 44px.
12. WHERE any decorative element uses a color other than Accent_Color or its alternate, THE Design_System SHALL render it with HSL saturation less than or equal to 20% or blend it with a Background_Palette color matching the Active_Theme at opacity greater than or equal to 70%.
13. THE Design_System SHALL render at most one saturated accent color (HSL saturation greater than 20%) visible simultaneously in any viewport in both Active_Theme values, and SHALL NOT render neon grid overlays, scanline effects, or HUD-style framing elements at opacity greater than 8%.

### Requirement 2: Typography System

**User Story:** As a visitor, I want the typography to contrast an elegant editorial serif with a clean modern sans-serif, so that the page feels like a luxury editorial product site in the spirit of Apple, Arc Browser, Linear, and high-end AI startups.

#### Acceptance Criteria

1. THE Typography_System SHALL set Headline_Serif as `Instrument Serif` (primary) with `Canela`, `PP Editorial New`, `Cormorant Garamond`, and `Bodoni Moda` as approved alternates, followed by a serif system fallback.
2. THE Typography_System SHALL set Body_Sans as `Inter` (primary) with `SF Pro Display`, `General Sans`, and `Suisse Intl` as approved alternates, followed by a sans-serif system fallback.
3. THE Typography_System SHALL render Headline_Serif exclusively for hero headlines, cinematic statements, major section titles, and emotional branding text, and SHALL render Body_Sans for navigation, buttons, descriptions, cards, forms, dashboard UI, analytics, labels, eyebrow labels, pricing, FAQ, and footer text.
4. THE Hero_Section headline SHALL use Headline_Serif with `font-size: clamp(64px, 9vw, 120px)`, `line-height: 0.9`, `letter-spacing: -0.04em`, and `font-weight: 400`.
5. THE Typography_System SHALL render major section titles in Headline_Serif at `font-size` between 40px and 96px, `line-height` between 0.9 and 1.1, `letter-spacing` between `-0.04em` and `-0.02em`, and `font-weight` between 300 and 500.
6. THE Typography_System SHALL render body copy in Body_Sans at `font-size` between 18px and 20px, `line-height` 1.6, and `font-weight` between 400 and 500.
7. THE Typography_System SHALL render all headline text in the Text_Headline token, all body and descriptive copy in the Text_Body token, and all captions, eyebrow labels, and supporting subtext in the Text_Muted token.
8. WHERE a section uses a sub-headline above a main heading, THE Typography_System SHALL render it in Body_Sans at `font-size` between 12px and 14px, uppercase, with `letter-spacing` between `0.08em` and `0.16em`, in the Text_Muted token.
9. THE Typography_System SHALL NOT apply bold weights greater than 600 to Headline_Serif and SHALL NOT apply Headline_Serif to navigation, buttons, form fields, data tables, analytics numbers, pricing values, FAQ questions, or footer text.
10. THE Landing_Page SHALL load Headline_Serif and Body_Sans using `next/font` with `font-display: swap` and an additional non-blocking loading strategy such as preloading the primary families and subsetting unused glyphs.
11. THE Typography_System SHALL maintain a spacious editorial vertical rhythm with section vertical padding of at least 96px on Desktop_Breakpoint and at least 64px on Mobile_Breakpoint.
12. THE Typography_System SHALL center-align Hero_Section and Final_CTA headlines and SHALL constrain body paragraph line length to between 50 and 80 characters per line on Desktop_Breakpoint.

### Requirement 3: Motion and Animation Behavior

**User Story:** As a visitor, I want animations to feel slow, smooth, and cinematic like Apple or Rivian product pages, so that the site feels premium rather than flashy.

#### Acceptance Criteria

1. THE Landing_Page SHALL use Framer Motion for component-level animations and GSAP for scroll-driven timelines.
2. THE Motion_System SHALL define default transition durations between 400ms and 1200ms, and SHALL NOT use durations below 200ms for decorative motion.
3. THE Motion_System SHALL use cubic-bezier easings in the family of `cubic-bezier(0.22, 1, 0.36, 1)` or equivalent "premium ease-out" curves, and SHALL NOT use linear easing for decorative motion.
4. WHEN a section enters the viewport, THE Landing_Page SHALL trigger a fade-in reveal combined with a vertical translation between 12px and 40px.
5. WHEN the user scrolls, THE Landing_Page SHALL apply parallax translation to designated floating elements at a rate between 5% and 30% of scroll distance.
6. WHEN the user hovers a Primary_CTA_Button or a template card, THE Landing_Page SHALL scale the element between 1.02 and 1.05 and apply an Accent_Glow.
7. WHEN the user moves the pointer across the Hero_Section or Video_Hero, THE Landing_Page SHALL apply a subtle mouse-follow translation to floating UI cards between 4px and 12px.
8. IF the user has Reduced_Motion_Mode enabled, THEN THE Landing_Page SHALL disable parallax, mouse-follow, auto-playing looping motion, and scale-on-hover, and SHALL replace entrance animations with instant opacity transitions under 150ms.
9. THE Landing_Page SHALL use `transform` and `opacity` for animated properties, and SHALL NOT animate `width`, `height`, `top`, or `left` for decorative motion.

### Requirement 4: Navbar

**User Story:** As a visitor, I want a floating glass navigation bar, so that I can reach any section or sign up without losing the cinematic feeling.

#### Acceptance Criteria

1. THE Navbar SHALL render fixed to the top of the viewport with a floating inset of at least 12px from the top edge on Desktop_Breakpoint.
2. THE Navbar SHALL render a Glass_Effect background with backdrop blur between 16px and 24px.
3. THE Navbar SHALL render a logo mark and the wordmark "Certiq" on the left.
4. THE Navbar SHALL render the navigation links "Templates", "Features", "Pricing", "Resume Builder", and "FAQ" in the center on Desktop_Breakpoint.
5. THE Navbar SHALL render a "Login" Secondary_CTA_Button and a "Get Started" Primary_CTA_Button on the right on Desktop_Breakpoint.
6. THE Navbar SHALL render the Theme_Toggle on the right side adjacent to the "Login" Secondary_CTA_Button on Desktop_Breakpoint, and SHALL render the Theme_Toggle inside the overlay menu at Mobile_Breakpoint, with a minimum 44×44px tap target in both breakpoints.
7. WHEN the user scrolls the Landing_Page more than 24px from the top, THE Navbar SHALL increase its backdrop opacity by at least 10 percentage points and reduce its vertical padding by between 4px and 12px, and THE Navbar MAY apply either change independently of the other.
8. WHEN the user clicks a center navigation link, THE Navbar SHALL smooth-scroll the Landing_Page to the corresponding section with a duration between 600ms and 1000ms.
9. WHILE the viewport is at Mobile_Breakpoint, THE Navbar SHALL collapse the center links and right buttons behind a menu icon that expands an overlay menu on activation.
10. THE Navbar SHALL apply a visible focus ring meeting Requirement 20 to every interactive element.

### Requirement 5: Hero Section

**User Story:** As a visitor, I want a dramatic split hero that introduces Certiq's value proposition, so that I immediately understand what the product does and feel invited to try it.

#### Acceptance Criteria

1. THE Hero_Section SHALL render a two-column split layout on Desktop_Breakpoint, with content on the left and a visual composition on the right.
2. THE Hero_Section SHALL render the headline "Build resumes that feel premium." in Headline_Serif with `font-size: clamp(64px, 9vw, 120px)`, `line-height: 0.9`, `letter-spacing: -0.04em`, `font-weight: 400`, and the Text_Headline token, following the typography rules in Requirement 2.
3. THE Hero_Section SHALL render supporting subtext describing AI resume generation, ATS optimization, templates, certificate attachment, and PDF export in 2 to 4 sentences in Body_Sans at `font-size` between 18px and 20px, `line-height` 1.6, `font-weight` between 400 and 500, in the Text_Body token, using the example copy "AI-powered resume builder with cinematic templates, ATS optimization, certificate storage, and elegant PDF export." as a reference tone and length.
4. THE Hero_Section SHALL render a "Create Resume" Primary_CTA_Button and a "Watch Demo" Secondary_CTA_Button grouped horizontally below the subtext.
5. THE Hero_Section SHALL render at least five layered floating visual cards on the right column, including a resume preview, a template selector, an AI assistant popup, a certificate upload tile, and a PDF export modal.
6. IF none of the floating visual cards can be rendered due to asset loading failures, THEN THE Hero_Section SHALL hide the visual column entirely and expand the content column to occupy the available width.
7. THE Hero_Section SHALL apply the Glass_Effect and an Accent_Glow to the floating visual cards.
8. WHEN the Hero_Section is visible, THE Motion_System SHALL animate the floating cards with continuous subtle vertical float between 4px and 10px amplitude and period between 4s and 8s.
9. WHILE the viewport is at Mobile_Breakpoint, THE Hero_Section SHALL stack the content and visual columns vertically, with the visual below the text.
10. WHERE Active_Theme is `dark`, THE Hero_Section SHALL render an ambient radial Accent_Glow behind the visual composition at an opacity between 10% and 25%, and WHERE Active_Theme is `light`, THE Hero_Section SHALL render the same ambient radial Accent_Glow at an opacity between 8% and 18%.

### Requirement 6: Video Hero Section

**User Story:** As a visitor, I want to see the product in motion in a cinematic container, so that I can understand the experience before signing up.

#### Acceptance Criteria

1. THE Video_Hero SHALL render a single video element inside a rounded glass container with corner radius between 20px and 32px.
2. THE Video_Hero SHALL apply a drop shadow with blur between 40px and 120px and an Accent_Glow at opacity between 8% and 18%.
3. THE Video_Hero SHALL autoplay the video muted, looped, and with `playsinline` enabled.
4. THE Video_Hero SHALL depict floating resume cards, cursor interactions, live editing, template switching, certificate upload, AI generation, and PDF export.
5. WHEN at least 25% of the Video_Hero intersects the viewport, THE Motion_System SHALL apply a scale-in entrance from between 0.94 and 0.98 to 1.0 with a duration between 600ms and 1000ms.
6. WHILE less than 10% of the Video_Hero intersects the viewport, THE Landing_Page SHALL pause the video to conserve resources.
7. WHILE the browser tab containing the Landing_Page is not active, THE Landing_Page SHALL pause the Video_Hero video.
8. IF the video source emits a load error or does not reach a playable state within 8 seconds of request start, THEN THE Video_Hero SHALL render a static poster image depicting the product flow described in criterion 4 and preserve the glass container with its corner radius, drop shadow, and Accent_Glow.
9. THE Video_Hero SHALL serve the video in a modern codec (AV1, VP9, or H.264) with a file size less than or equal to 6MB for the primary variant.
10. THE Video_Hero SHALL render a text alternative describing the depicted product flow for assistive technology as specified in Requirement 20.
11. WHERE the user's system indicates a reduced motion preference, THE Motion_System SHALL render the Video_Hero at final scale 1.0 with no scale-in entrance animation.

### Requirement 7: Trust and Features Strip

**User Story:** As a visitor, I want a horizontal overview of what Certiq does, so that I can quickly scan the core capabilities.

#### Acceptance Criteria

1. THE Trust_Strip SHALL render six horizontal bento tiles labeled "ATS Friendly", "One Click PDF Export", "AI Writing Assistant", "Certificate Storage", "Shareable Resume Links", and "Modern Templates".
2. THE Trust_Strip SHALL render each tile with the Glass_Effect, an icon, a title, and a one-line description.
3. WHEN the user hovers a tile on Desktop_Breakpoint, THE Trust_Strip SHALL apply an Accent_Glow border and lift the tile vertically between 2px and 6px.
4. WHILE the viewport is at Desktop_Breakpoint, THE Trust_Strip SHALL render the tiles in a horizontal row of six tiles.
5. WHILE the viewport is at Tablet_Breakpoint, THE Trust_Strip SHALL render the tiles in a 3-by-2 grid.
6. IF a 3-by-2 grid cannot fit the available Tablet_Breakpoint width without overflow, THEN THE Trust_Strip SHALL fall back to a horizontally scrollable row with scroll snap.
7. WHILE the viewport is at Mobile_Breakpoint, THE Trust_Strip SHALL render the tiles as a horizontally scrollable row with scroll snap.
8. THE Trust_Strip SHALL render icons in Text_Headline or Accent_Color at a consistent stroke weight, and SHALL render tile titles and descriptions in Body_Sans using the Text_Headline and Text_Body tokens respectively.

### Requirement 8: Template Showcase

**User Story:** As a visitor, I want to browse a cinematic gallery of resume templates, so that I can see the visual range Certiq offers.

#### Acceptance Criteria

1. THE Template_Showcase SHALL render exactly six template cards labeled "Executive", "Minimal", "Developer", "Student", "Creative", and "ATS Professional".
2. THE Template_Showcase SHALL render each card with a visible resume preview image, a template name of at most 30 characters, and a category label of at most 25 characters.
3. WHEN the user hovers a template card on Desktop_Breakpoint, THE Template_Showcase SHALL scale the card between 1.03 and 1.06 and increase the drop shadow's blur radius and vertical offset relative to the card's default (non-hovered) shadow, completing the transition within 150 to 300 milliseconds.
4. WHEN a template card is selected, THE Template_Showcase SHALL render a 2px border in Accent_Color and an Accent_Glow around the card.
5. THE Template_Showcase SHALL allow at most one card to be in the selected state at any time, and WHEN a user selects a card while another card is already selected, THE Template_Showcase SHALL remove the selected state from the previously selected card before applying it to the newly selected card.
6. WHILE the viewport is at Mobile_Breakpoint, THE Template_Showcase SHALL render the cards in a horizontally scrollable carousel with scroll snap aligned to the start of each card.
7. THE Template_Showcase SHALL render a section heading of at most 80 characters and a one-paragraph description of at most 400 characters above the gallery.
8. WHEN the Template_Showcase initially loads, THE Template_Showcase SHALL render all cards in an unselected state.
9. WHILE the viewport width is between Mobile_Breakpoint and Desktop_Breakpoint (768px to 1023px inclusive), THE Template_Showcase SHALL render the cards in a multi-column grid layout with all cards visible without horizontal scrolling.

### Requirement 9: Live Builder Demo

**User Story:** As a visitor, I want to see the resume builder in action with a live preview, so that I believe editing is smooth and instant.

#### Acceptance Criteria

1. THE Builder_Demo SHALL render a two-column split with an editing form on the left and a live preview on the right at Desktop_Breakpoint.
2. THE Builder_Demo editing form SHALL render sections for Profile, Skills, Education, Projects, Certifications, Experience, and a Theme Switcher.
3. WHEN the user edits a visible field in the editing form, THE Builder_Demo SHALL update the live preview within 200ms of the keystroke.
4. THE Builder_Demo SHALL render an "Autosaved" badge that pulses with an Accent_Glow at an interval between 3s and 8s.
5. THE Builder_Demo SHALL render a floating "AI suggestions" popup anchored to the active form section with at least one example suggestion.
6. THE Builder_Demo theme switcher SHALL offer at least three preview themes, and WHEN a theme is selected, THE Builder_Demo SHALL transition the preview styling within 400ms using the Motion_System.
7. THE Builder_Demo SHALL use mock data only and SHALL NOT persist any user-entered content to a backend or to browser storage beyond the current page session.
8. WHILE the viewport is at Mobile_Breakpoint, THE Builder_Demo SHALL stack the editing form above the live preview and reduce the preview to a scaled thumbnail.

### Requirement 10: Certificate Storage Section

**User Story:** As a visitor, I want to see how certificates are stored and attached to resumes, so that I understand the credential management feature.

#### Acceptance Criteria

1. THE Certificate_Storage_Section SHALL render a visual flow depicting certificate image upload, credential link storage, attachment to a resume, and a verification badge.
2. THE Certificate_Storage_Section SHALL render at least three floating certificate cards with the Glass_Effect and a subtle tilt between -3deg and +3deg.
3. WHEN the Certificate_Storage_Section enters the viewport, THE Motion_System SHALL play an upload animation depicting a certificate tile moving from a drop zone into a storage stack over a duration between 800ms and 1400ms.
4. THE Certificate_Storage_Section SHALL render a "Verified" badge in Accent_Color on at least one certificate card.
5. THE Certificate_Storage_Section SHALL render a short explanatory paragraph in Body_Sans using the Text_Body token adjacent to the visual flow.
6. THE Certificate_Storage_Section SHALL use mock data and illustrative imagery only.

### Requirement 11: ATS Optimization Section

**User Story:** As a visitor, I want to see an ATS score and optimization suggestions, so that I trust Certiq will help my resume pass automated screening.

#### Acceptance Criteria

1. THE ATS_Section SHALL render a panel containing an ATS score indicator, a keyword match list, a resume strength meter, and an AI suggestions list, with all four elements visible without scrolling within the panel on a 1440px wide viewport.
2. THE ATS_Section SHALL render the ATS score as a circular or linear progress indicator displaying an integer mock value between 60 and 95 inclusive, with the numeric value shown as text adjacent to or within the indicator.
3. WHEN at least 30% of the ATS_Section bounding box is within the viewport, THE Motion_System SHALL animate the progress indicator fill from 0 to its mock value exactly once per page load over a duration between 800ms and 1600ms using an ease-out curve.
4. THE ATS_Section SHALL render each progress bar with a fill in Accent_Color at an opacity between 0.3 and 0.6 and a glow effect implemented as a drop shadow or blur in Accent_Color.
5. THE ATS_Section SHALL render at least three keyword chips and at least three AI suggestion rows using mock content, where each keyword chip displays a visual state indicating either matched or missing and each suggestion row displays a short descriptive text between 20 and 120 characters.
6. THE ATS_Section SHALL render the panel with the Glass_Effect and a Card_Border.
7. THE ATS_Section SHALL use mock data only and SHALL NOT invoke any network request for resume parsing.
8. IF the user's system preference indicates reduced motion, THEN THE Motion_System SHALL render the progress indicator at its final mock value without animating the fill transition.

### Requirement 12: Bento Grid

**User Story:** As a visitor, I want an asymmetrical bento overview of secondary features, so that I can explore breadth without a long list.

#### Acceptance Criteria

1. THE Bento_Grid SHALL render an asymmetrical grid containing tiles for analytics, export stats, AI writing, template switching, cloud sync, and mobile preview.
2. WHILE the viewport is at Desktop_Breakpoint, THE Bento_Grid SHALL render at least six tiles across at least three columns, with at least two tiles spanning two columns or two rows.
3. THE Bento_Grid SHALL apply the Glass_Effect and Card_Border to every tile.
4. WHEN the user hovers a tile on Desktop_Breakpoint, THE Bento_Grid SHALL apply an Accent_Glow at opacity between 20% and 40%.
5. WHILE the viewport is at Tablet_Breakpoint, THE Bento_Grid SHALL reflow into a two-column layout.
6. WHILE the viewport is at Mobile_Breakpoint, THE Bento_Grid SHALL reflow into a single-column stack.
7. THE Bento_Grid SHALL render decorative content (charts, icons, mini UI) using mock data only.

### Requirement 13: Testimonials Section

**User Story:** As a visitor, I want to see testimonials from professionals, so that I trust the product has delivered results.

#### Acceptance Criteria

1. THE Testimonials_Section SHALL render at least six testimonial cards, each containing an avatar, a quote, a person's name, a profession, and a company name.
2. THE Testimonials_Section SHALL render each card with the Glass_Effect and Card_Border.
3. WHEN the Testimonials_Section enters the viewport, THE Motion_System SHALL apply a staggered fade-in with stagger delay between 60ms and 140ms per card.
4. WHERE the Testimonials_Section layout exceeds the viewport width, THE Testimonials_Section SHALL render a horizontally scrollable row or a marquee with pause-on-hover.
5. IF both the scrollable row and marquee rendering modes fail to initialize, THEN THE Testimonials_Section SHALL render a static vertical stack of cards as a fallback layout.
6. THE Testimonials_Section SHALL render avatars using the same aspect ratio and fallback to initials on an Accent_Color tinted background if an image fails to load.

### Requirement 14: Pricing Section

**User Story:** As a visitor, I want to compare pricing tiers, so that I can choose the plan that fits me.

#### Acceptance Criteria

1. THE Pricing_Section SHALL render three pricing tiers labeled "Free", "Pro", and "Team".
2. THE Pricing_Section SHALL render each tier with a price, a short description, a feature list of at least four items, and a Primary_CTA_Button or Secondary_CTA_Button.
3. THE Pricing_Section SHALL highlight the "Pro" tier with an Accent_Color border and an Accent_Glow.
4. THE Pricing_Section SHALL render the "Pro" tier card scaled between 1.03 and 1.08 relative to the adjacent tiers on Desktop_Breakpoint.
5. WHILE the viewport is at Mobile_Breakpoint, THE Pricing_Section SHALL stack the tiers vertically with the "Pro" tier rendered first.
6. THE Pricing_Section SHALL use mock pricing values and SHALL NOT integrate with a real payment provider.

### Requirement 15: FAQ Section

**User Story:** As a visitor, I want to read answers to common questions in an elegant accordion, so that I can resolve doubts without leaving the page.

#### Acceptance Criteria

1. THE FAQ_Section SHALL render at least six question-and-answer items in an accordion.
2. THE FAQ_Section SHALL render each accordion item with the Glass_Effect and Card_Border.
3. WHEN the user activates an accordion item, THE FAQ_Section SHALL expand the answer panel with a height transition between 300ms and 600ms.
4. THE FAQ_Section SHALL allow multiple accordion items to be open simultaneously.
5. THE FAQ_Section SHALL render a chevron indicator on each item and SHALL rotate it 180 degrees when the item is expanded.
6. THE FAQ_Section SHALL expose the accordion through keyboard controls and ARIA attributes as specified in Requirement 20.

### Requirement 16: Final CTA Section

**User Story:** As a visitor, I want a dramatic closing invitation to start, so that I feel compelled to convert after reading the page.

#### Acceptance Criteria

1. THE Final_CTA SHALL render the headline "Create your premium resume today."
2. THE Final_CTA SHALL render a "Start Building" Primary_CTA_Button and an "Explore Templates" Secondary_CTA_Button.
3. THE Final_CTA SHALL render a gradient background blending at least two colors from the Background_Palette matching the Active_Theme with an Accent_Glow focal point whose radius is at least 30% of the section's shorter dimension, where the Accent_Glow opacity is between 20% and 45% when Active_Theme is `dark` and between 14% and 30% when Active_Theme is `light`.
4. THE Final_CTA SHALL render between 6 and 24 floating particles or orbs with individual opacity between 10% and 40%.
5. WHEN the user activates the "Start Building" Primary_CTA_Button by click, tap, or keyboard Enter or Space, THE Final_CTA SHALL navigate the Landing_Page to the Builder_Demo section within 500ms.
6. WHEN the user activates the "Explore Templates" Secondary_CTA_Button by click, tap, or keyboard Enter or Space, THE Final_CTA SHALL navigate the Landing_Page to the Template_Showcase section within 500ms.
7. IF Reduced_Motion_Mode is enabled, THEN THE Final_CTA SHALL hide the floating particles entirely and replace the staggered headline reveal with an opacity transition under 150ms.
8. WHEN the Final_CTA enters the viewport and Reduced_Motion_Mode is not enabled, THE Motion_System SHALL animate the headline with a staggered character or word reveal over a duration between 800ms and 1400ms.

### Requirement 17: Footer

**User Story:** As a visitor, I want a minimal footer with navigation and legal links, so that I can find essentials without clutter.

#### Acceptance Criteria

1. THE Footer SHALL render the Certiq logo mark and wordmark.
2. THE Footer SHALL render at least three grouped link columns covering Product, Company, and Legal.
3. THE Footer SHALL render social icons for at least three channels.
4. THE Footer SHALL render a copyright line containing the current year and the Certiq name.
5. THE Footer SHALL render link text in Body_Sans using the Text_Muted token at rest and SHALL transition link text to the Text_Headline token on hover over a duration between 150ms and 300ms.
6. THE Footer SHALL render on a background one step away from the adjacent section in the Background_Palette matching the Active_Theme, where "one step away" means one shade darker when Active_Theme is `dark` and one shade lighter or cooler when Active_Theme is `light`.

### Requirement 18: Responsive Design

**User Story:** As a visitor on any device, I want the Landing_Page to look composed and premium, so that the cinematic feeling is preserved on phones, tablets, and desktops.

#### Acceptance Criteria

1. THE Landing_Page SHALL define Desktop_Breakpoint at viewport width ≥ 1024px, Tablet_Breakpoint at ≥ 768px and < 1024px, and Mobile_Breakpoint at < 768px.
2. THE Landing_Page SHALL render without horizontal scroll at any viewport width between 320px and 2560px.
3. WHILE the viewport is at Mobile_Breakpoint, THE Landing_Page SHALL use a single-column layout for every section unless Requirement 7, 8, or 12 specifies a scrollable row.
4. WHILE the viewport is at Mobile_Breakpoint, THE Typography_System SHALL reduce section-heading font sizes by between 15% and 35% relative to Desktop_Breakpoint values.
5. THE Landing_Page SHALL maintain minimum tap target size of 44px by 44px on Mobile_Breakpoint for every interactive element.
6. WHILE the viewport is at Tablet_Breakpoint, THE Landing_Page SHALL render two-column splits as two columns or as one column according to the requirement of the section, and SHALL preserve the Glass_Effect.

### Requirement 19: Performance

**User Story:** As a visitor, I want the Landing_Page to load fast and stay smooth, so that the cinematic feeling is not broken by jank.

#### Acceptance Criteria

1. THE Landing_Page SHALL achieve an LCP of 2.5 seconds or less on a simulated 4G connection with a mid-tier mobile device.
2. THE Landing_Page SHALL achieve a CLS of 0.1 or less across the full scroll.
3. THE Landing_Page SHALL achieve an INP of 200ms or less for primary interactions including button clicks, accordion toggles, and template selection.
4. THE Landing_Page SHALL serve images using the Next.js Image component with responsive `sizes` and modern formats (AVIF or WebP) where supported.
5. THE Landing_Page SHALL lazy-load non-critical sections below the Hero_Section using dynamic imports or native `loading="lazy"` for media.
6. THE Landing_Page SHALL maintain 60 frames per second during hero floating motion, scroll parallax, and accordion transitions on a mid-tier 2021 laptop.
7. THE Landing_Page SHALL keep the total initial JavaScript payload at 250KB or less gzipped for the critical path.
8. THE Landing_Page SHALL begin loading the Video_Hero asset only after both the Hero_Section has become visible in the viewport AND the user has scrolled at least 200px from the top.

### Requirement 20: Accessibility

**User Story:** As a visitor using assistive technology, I want the Landing_Page to be fully perceivable and operable, so that I can explore Certiq with the same quality experience.

#### Acceptance Criteria

1. THE Landing_Page SHALL conform to WCAG 2.1 Level AA for color contrast, keyboard operability, and non-text alternatives in both Active_Theme values.
2. THE Landing_Page SHALL maintain a contrast ratio of at least 4.5:1 for Text_Headline, Text_Body, and Text_Muted against the rendered background of every section in both Active_Theme values, and SHALL maintain a contrast ratio of at least 3:1 for large text and non-text UI components against the rendered background in both Active_Theme values.
3. THE Landing_Page SHALL pass contrast audits in both the `dark` and `light` Active_Theme values for every text token and every non-text UI component.
4. THE Landing_Page SHALL render a visible focus indicator with a 2px outline in Accent_Color and a 2px offset on every interactive element, and WHERE Active_Theme is `light` and the Accent_Color outline alone does not reach a 3:1 contrast ratio against the adjacent background, THE Landing_Page MAY render a 1px dark halo in `rgba(15, 23, 42, 0.2)` beneath the Accent_Color outline to preserve the 3:1 contrast ratio.
5. THE Landing_Page SHALL expose a logical tab order following the visual reading order top-to-bottom and left-to-right.
6. THE Landing_Page SHALL provide a descriptive `alt` attribute for every content image and an empty `alt` for purely decorative images.
7. THE Video_Hero SHALL provide a text alternative describing the depicted flow through an adjacent visually hidden description or a captions track.
8. THE FAQ_Section accordion SHALL use `button` elements with `aria-expanded` and `aria-controls` attributes, and SHALL be operable with Enter and Space keys.
9. THE Navbar SHALL use a `nav` landmark with an accessible name, and THE Footer SHALL use a `contentinfo` landmark.
10. THE Landing_Page SHALL expose one `h1` for the Hero_Section and SHALL follow a single-step heading hierarchy thereafter without skipping levels.
11. IF Reduced_Motion_Mode is enabled, THEN THE Motion_System SHALL honor it as specified in Requirement 3.

### Requirement 21: Tech Stack and Architecture

**User Story:** As a developer maintaining the Certiq platform, I want a clean Turborepo monorepo with a Next.js frontend and NestJS backend, so that I can develop, build, and deploy both apps from a single repository with shared tooling.

#### Acceptance Criteria

1. THE Monorepo SHALL use Turborepo as the build orchestrator with a `turbo.json` configuration at the repository root defining at minimum `build`, `dev`, `lint`, and `test` pipeline tasks.
2. THE Monorepo SHALL use a package manager workspace (pnpm workspaces preferred, npm or yarn workspaces acceptable) with a root `package.json` declaring the workspace paths.
3. THE Monorepo SHALL contain at minimum two application workspaces: Frontend_App (Next.js with App Router) and Backend_App (NestJS).
4. THE Frontend_App SHALL be located at `apps/web` and SHALL contain the Landing_Page implementation as specified in Requirements 1–20 and 22.
5. THE Backend_App SHALL be located at `apps/api`, SHALL use NestJS with TypeScript in `strict` mode, and SHALL expose at minimum a `GET /health` endpoint returning HTTP 200 with a JSON body `{ "status": "ok" }`.
6. THE Monorepo SHALL contain a `packages/ui` shared package exposing reusable UI primitives (buttons, cards, badges, section wrappers) importable by Frontend_App.
7. THE Monorepo SHALL contain a `packages/tsconfig` shared package exposing base TypeScript configurations (`tsconfig.base.json`, `tsconfig.nextjs.json`, `tsconfig.nestjs.json`) extended by both apps.
8. THE Monorepo SHALL contain a `packages/eslint-config` (or equivalent) shared package exposing ESLint configurations used by both apps.
9. THE Frontend_App SHALL be implemented in TypeScript with `strict` mode enabled.
10. THE Frontend_App SHALL use Tailwind CSS for styling with design tokens from Requirement 1 defined in the Tailwind configuration, and THE Tailwind configuration SHALL expose both Background_Palette_Dark and Background_Palette_Light, along with all dark-mode and light-mode values of Text_Headline, Text_Body, Text_Muted, Card_Surface, and Card_Border, as first-class tokens.
11. THE Frontend_App SHALL use Framer Motion for component animations and GSAP for scroll timelines as specified in Requirement 3.
12. THE Frontend_App SHALL organize each of the 14 sections as a self-contained reusable component under `components/sections` (or imported from `packages/ui`), and THE architecture SHALL support adding additional sections without structural refactoring.
13. THE Frontend_App SHALL keep all mock content (testimonials, pricing, FAQ, templates, builder sample data) in dedicated data modules separate from component code.
14. THE Frontend_App SHALL NOT connect to the Backend_App for the landing page scope; all landing page data is static/mock.
15. THE Frontend_App SHALL implement theming via CSS custom properties bound to a `data-theme` attribute on `<html>`, with both themes defined in one stylesheet, and server rendering SHALL set the initial `data-theme` to avoid flash.
16. THE Frontend_App SHALL configure Tailwind's dark-mode strategy as `class` or `attribute` aligned with the `data-theme` scheme defined in Requirement 22, and SHALL NOT rely on the `prefers-color-scheme` media query alone at the style layer.
17. THE Monorepo SHALL pass `turbo run build` from the repository root without errors across all workspaces as a precondition for considering implementation complete.
18. THE Frontend_App SHALL pass `next build` and `tsc --noEmit` without errors.
19. THE Backend_App SHALL pass `nest build` (or equivalent NestJS build command) and `tsc --noEmit` without errors.
20. THE Monorepo root SHALL include a `README.md` documenting workspace structure, setup instructions (`pnpm install`), and available Turborepo commands (`turbo run dev`, `turbo run build`, `turbo run lint`).

### Requirement 22: Theme System

**User Story:** As a visitor, I want to switch between a cinematic dark theme and a clean editorial light theme, so that the page matches my preferred reading mode on any device.

#### Acceptance Criteria

1. THE Landing_Page SHALL support exactly two Active_Theme values: `dark` and `light`.
2. WHEN the Landing_Page first loads and no prior user Active_Theme preference exists in persistent storage, THE Landing_Page SHALL set Active_Theme from the operating system's `prefers-color-scheme` media query, and IF `prefers-color-scheme` reports no detectable preference, THEN THE Landing_Page SHALL set Active_Theme to `dark`.
3. THE Landing_Page SHALL persist the user's Active_Theme choice in `localStorage` under a stable key and SHALL restore the persisted value on subsequent visits in preference to the `prefers-color-scheme` value.
4. THE Landing_Page SHALL set the initial `data-theme` attribute on the `<html>` element during server rendering or via an inline script executed before hydration so that no flash of incorrect theme (FOUC or FOIT) is perceivable by the user.
5. THE Navbar SHALL render a Theme_Toggle control with a minimum tap target of 44×44px, an accessible name reflecting the current Active_Theme (for example "Switch to light mode" when Active_Theme is `dark` and "Switch to dark mode" when Active_Theme is `light`), and an `aria-pressed` attribute or equivalent state attribute reflecting the current Active_Theme.
6. WHEN the user activates the Theme_Toggle by mouse click, touch tap, Enter key, or Space key, THE Landing_Page SHALL switch Active_Theme between `dark` and `light` and SHALL transition theme-dependent colors (background, text, borders, shadows, glows) with a duration between 150ms and 400ms.
7. IF Reduced_Motion_Mode is enabled, THEN THE Landing_Page SHALL apply Active_Theme changes instantly without any color transition.
8. THE Landing_Page SHALL expose the Active_Theme to CSS via a root-level attribute on the `<html>` element set to either `data-theme="dark"` or `data-theme="light"`, and SHALL drive all theme-dependent values exclusively through CSS custom properties bound to that attribute.
9. THE Landing_Page SHALL maintain WCAG 2.1 AA contrast thresholds (at least 4.5:1 for normal text and at least 3:1 for large text and non-text UI components) against the rendered background of every section in both Active_Theme values, consistent with Requirement 20.
10. THE Landing_Page SHALL render Accent_Color (`#D9FF3F`) and its alternate (`#C7FF00`) as the single saturated brand accent in both Active_Theme values, and SHALL enforce the rule "at most one saturated accent color visible simultaneously" from Requirement 1 in both Active_Theme values.
