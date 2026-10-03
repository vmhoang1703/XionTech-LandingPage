---
id: SPEC-3-2-silk-motion-toggle
owner: Sammy
build_day: 2026-10-04
depends_on: ["3.1"]
companions:
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/EXPERIENCE.md
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/DESIGN.md
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/mockups/site-v3/index.html
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/mockups/site-v3/js/site.js
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/mockups/site-v3/css/site.css
sources:
  - ../../../planning-artifacts/epics.md
  - ../../../planning-artifacts/prds/prd-XionTech-LandingPage-2026-09-28/prd.md
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# Story 3.2: Continuous silk animation and motion toggle

## Why

Vision plus mandate (FR-10, NFR-2, WCAG 2.2.2): Amber chose the moving silk for Demo day because the site becomes the real company site, but Lan, who finds motion distracting, must be able to stop it and the page must stay fast (NFR-4, SM-C3).

## Capabilities

- **CAP-1**
  - **intent:** A visitor sees the silk cloth move slowly and continuously behind the Home hero.
  - **success:** With motion allowed and the hero on screen, the silk ripples continuously at the prototype time scale 0.35 (ported shader from `site.js`) and the canvas is `aria-hidden` (FR-10, NFR-2).
- **CAP-2**
  - **intent:** A visitor finds a discreet control to stop the motion.
  - **success:** At the hero's top right a 36px round icon button sits at 70% opacity with its text label visually hidden (UX-DR12: ink 50% fill, white 30% border); its accessible name is always "Pause motion" or "Play motion".
- **CAP-3**
  - **intent:** The control explains itself on hover or focus.
  - **success:** On pointer hover or keyboard focus the text label slides out.
- **CAP-4**
  - **intent:** A visitor can pause and restart the silk.
  - **success:** Pressing the toggle pauses the silk and switches the icon and accessible name to "Play motion" (no `aria-pressed`); pressing again resumes it and restores "Pause motion".
- **CAP-5**
  - **intent:** Visitors who prefer reduced motion start with a still background.
  - **success:** With `prefers-reduced-motion: reduce` (and no saved choice, which never exists on Demo day) Home loads with the silk paused and no transition (NFR-2).
- **CAP-6**
  - **intent:** The hero never breaks when WebGL is missing or lost.
  - **success:** With no JavaScript, no WebGL, or after `webglcontextlost`, the toggle is hidden and the static navy and amber glow fallback shows (FR-10).
- **CAP-7**
  - **intent:** The silk only runs while someone can see it.
  - **success:** When the hero scrolls off screen or the tab is hidden (`visibilitychange`) the animation pauses, and it resumes only if the visitor has not paused it (NFR-2, NFR-4).
- **CAP-8**
  - **intent:** The silk does not slow the first view.
  - **success:** In a mobile Lighthouse run the silk loads after first paint and is not the LCP element `[ASSUMPTION]` (NFR-4).

## Constraints

- Story 3.1 must be merged first.
- Only the canvas and toggle are a client component; hero text stays server-rendered.
- If the silk pushes Lighthouse or Core Web Vitals below target, motion is reduced, not the targets (SM-C3).
- Definition of Done (CLAUDE.md): unit tests with 100% changed-line and 80% branch coverage, an `@smoke` Playwright test, lint, typecheck, format check, build, local Sonar gate (LOCAL ONLY) and bmad-code-review must pass.
- Next.js 16 App Router; Server Components by default, `"use client"` only for state, effects or browser APIs; read `node_modules/next/dist/docs/` before using a Next.js API.
- Use the Tailwind v4 tokens from Story 1.1 (`@theme` in `src/app/globals.css`); no new hard-coded colours, sizes or breakpoints.
- Port the prototype markup, copy and look; do not redesign. The UX spines win over the prototype on any conflict.
- Routes have no `/en` or `/vi` prefix (locale routing, Story 1.2, is after demo); Demo day is English only, but every string is kept in a form that can be translated later (no copy baked into logic).
- Every visible fact is real or starts with `[Placeholder]` (NFR-7).
- Sammy owns `src/app/page.tsx`, `src/app/services/*`, `src/app/about/*`, `src/components/home/*` and the footer; do not edit Andy's files (`src/app/layout.tsx`, `@theme` in `globals.css`, `src/components/layout/*`, `src/lib/sanity/*`, `src/app/api/*`, and the products, news, careers, privacy, not-found and demo pages).

## Non-goals

- Remembering the Play or Pause choice and a saved choice winning over `prefers-reduced-motion` (after demo, rest of this story).
- VI accessible names "Tạm dừng chuyển động" / "Chạy chuyển động" (Story 1.2, after demo); names stay translatable.
- Hero content and fallback layout (Story 3.1); stats band (Story 3.3).
- Inner page hero aurora and strand ribbon (Story 1.6, after demo).

## Success signal

- On https://xiontech-dev.vercel.app the Home silk moves; pressing the top-right button stops it and the name reads "Play motion"; with reduced motion turned on in the OS the silk starts still.

## Assumptions

- Without a saved choice on Demo day, every visit starts from the reduced-motion rule alone.
