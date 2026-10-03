---
id: SPEC-3-6-4d-process-flow
owner: Sammy
build_day: 2026-10-05
depends_on: ["1.1"]
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

# Story 3.6: 4-D process flow component

## Why

Opportunity (FR-23, FR-14): Quân decides whether this team is organised by seeing the four delivery steps and what he receives at each. The flow is built once here and reused at `/services#process` (Story 5.4).

## Capabilities

- **CAP-1**
  - **intent:** A visitor sees the 4-D process as one ordered flow on Home's navy band.
  - **success:** Under "How we work" / "From your request to launch, in four steps." one shared component renders an ordered list: "Your request", 01 Discovery, 02 Design, 03 Development, 04 Deployment, "Launch", each step with its line and "You receive" text from the prototype (FR-23, UX-DR14).
- **CAP-2**
  - **intent:** The flow lights up once when it comes into view.
  - **success:** When the flow is 30% visible the amber track fills over 2.4s and steps enter at 0.3s, 0.85s, 1.4s and 1.95s, once only (FR-23).
- **CAP-3**
  - **intent:** Every visitor can read the whole flow without the animation.
  - **success:** Under `prefers-reduced-motion: reduce` the full track and all steps show at once; without JavaScript all steps are visible.
- **CAP-4**
  - **intent:** A visitor can compare what each step delivers at a glance.
  - **success:** Above 1080px the "You receive" rows align on one line across all four cards in EN (AC-UI-2).
- **CAP-5**
  - **intent:** The flow works on smaller screens.
  - **success:** At 1080px and below the track and end nodes hide and steps show in 2 columns; at 640px and below in 1 column.

## Constraints

- Story 1.1 tokens must be merged first.
- One shared component, importable by Story 5.4 for `/services#process`; step content passed as data.
- Definition of Done (CLAUDE.md): unit tests with 100% changed-line and 80% branch coverage, an `@smoke` Playwright test, lint, typecheck, format check, build, local Sonar gate (LOCAL ONLY) and bmad-code-review must pass.
- Next.js 16 App Router; Server Components by default, `"use client"` only for state, effects or browser APIs; read `node_modules/next/dist/docs/` before using a Next.js API.
- Use the Tailwind v4 tokens from Story 1.1 (`@theme` in `src/app/globals.css`); no new hard-coded colours, sizes or breakpoints.
- Port the prototype markup, copy and look; do not redesign. The UX spines win over the prototype on any conflict.
- Routes have no `/en` or `/vi` prefix (locale routing, Story 1.2, is after demo); Demo day is English only, but every string is kept in a form that can be translated later (no copy baked into logic).
- Every visible fact is real or starts with `[Placeholder]` (NFR-7).
- Sammy owns `src/app/page.tsx`, `src/app/services/*`, `src/app/about/*`, `src/components/home/*` and the footer; do not edit Andy's files (`src/app/layout.tsx`, `@theme` in `globals.css`, `src/components/layout/*`, `src/lib/sanity/*`, `src/app/api/*`, and the products, news, careers, privacy, not-found and demo pages).

## Non-goals

- The amber dot that travels once and rests at Launch (after demo).
- Placement at `/services#process` (Story 5.4).
- VI copy and the AC-UI-2 alignment check in VI (Story 1.2, after demo).
- Scroll reveal for the section head (Story 1.1 remainder, after demo).

## Success signal

- On https://xiontech-dev.vercel.app scrolling Home to the navy band fills the amber track and brings in steps 01 to 04 in turn; on desktop the "You receive" rows line up.

## Assumptions

- AC-UI-2 is checked in EN only on Demo day; the VI check waits for VI copy.
