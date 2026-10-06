---
id: SPEC-3-1-dark-home-hero
owner: Sammy
build_day: 2026-10-03
depends_on: ["1.1"]
companions:
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/EXPERIENCE.md
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/DESIGN.md
  - ../../../prototype-enhancement/prototype/index.html
  - ../../../prototype-enhancement/prototype/css/site.css
sources:
  - ../../../planning-artifacts/epics.md
  - ../../../planning-artifacts/prds/prd-XionTech-LandingPage-2026-09-28/prd.md
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# Story 3.1: Dark Home hero with one CTA

## Why

Opportunity (FR-11, FR-10 layout): Lan arrives from search and must know in seconds what XionTechs makes for schools. The dark hero gives one headline, real product screens and one obvious next step; it is the frame the silk (3.2), stats (3.3) and doors (3.4) attach to.

## Capabilities

- **CAP-1**
  - **intent:** A visitor sees the dark Home hero with the headline and sub line.
  - **success:** Home `/` opens with a `hero-silk` hero filling `100dvh` minus the header, the label "EdTech products · Software services", the H1 "Every school community, connected." with the highlight mark on "connected", and the sub line "PXP for parents, LXP for learners, SXP for staff. And the engineering team behind them, ready to build yours." (FR-11, UX-DR3).
- **CAP-2**
  - **intent:** A visitor has exactly one obvious next step.
  - **success:** Counting buttons and button-styled links in the hero finds exactly one primary CTA, "Explore our products", linking to `/products`, and nothing else apart from the motion toggle (FR-11).
- **CAP-3**
  - **intent:** The device column never shows a broken image.
  - **success:** A tablet frame and a phone frame render; each shows a real product screen or, when the asset is missing, an empty media frame, never a broken image (UX-DR17).
- **CAP-4**
  - **intent:** The hero is readable without WebGL or JavaScript.
  - **success:** With JavaScript or WebGL off, the static navy and amber glow fallback shows and all hero text is readable (FR-10 fallback).
- **CAP-5**
  - **intent:** The hero works on small screens.
  - **success:** At 900px and below text and devices stack to one column and the devices are at most 560px wide.

## Constraints

- Story 1.1 tokens must be merged first.
- The hero stays a Server Component so text and CTA render without JavaScript; Story 3.2 adds the canvas and toggle as a client island.
- Definition of Done (CLAUDE.md): unit tests with 100% changed-line and 80% branch coverage, an `@smoke` Playwright test, lint, typecheck, format check, build, local Sonar gate (LOCAL ONLY) and bmad-code-review must pass.
- Next.js 16 App Router; Server Components by default, `"use client"` only for state, effects or browser APIs; read `node_modules/next/dist/docs/` before using a Next.js API.
- Use the Tailwind v4 tokens from Story 1.1 (`@theme` in `src/app/globals.css`); no new hard-coded colours, sizes or breakpoints.
- Port the prototype markup, copy and look; do not redesign. The UX spines win over the prototype on any conflict.
- Routes have no `/en` or `/vi` prefix (locale routing, Story 1.2, is after demo); Demo day is English only, but every string is kept in a form that can be translated later (no copy baked into logic).
- Every visible fact is real or starts with `[Placeholder]` (NFR-7).
- Sammy owns `src/app/page.tsx`, `src/app/services/*`, `src/app/about/*`, `src/components/home/*` and the footer; do not edit Andy's files (`src/app/layout.tsx`, `@theme` in `globals.css`, `src/components/layout/*`, `src/lib/sanity/*`, `src/app/api/*`, and the products, news, careers, privacy, not-found and demo pages).

## Non-goals

- Silk animation and motion toggle (Story 3.2).
- Stats band inside the hero (Story 3.3).
- Real product screens and clips, device float and tilt (Story 4.4, after demo).
- Highlight-mark draw-in animation and scroll reveal (Story 1.6 and Story 1.1 remainder, after demo).
- VI copy "Khám phá sản phẩm" etc. (Story 1.2, after demo).

## Success signal

- On https://xiontech-dev.vercel.app the Home hero shows the headline, one "Explore our products" button that opens `/products`, and two empty device frames; with JavaScript off the text still reads on the static glow.

## Assumptions

- Device frames ship empty on Demo day because product media is Story 4.4 (after demo).
