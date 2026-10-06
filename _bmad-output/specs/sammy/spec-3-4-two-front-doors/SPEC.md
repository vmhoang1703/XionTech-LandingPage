---
id: SPEC-3-4-two-front-doors
owner: Sammy
build_day: 2026-10-05
depends_on: ["3.1"]
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

# Story 3.4: Two front doors

## Why

Opportunity (FR-13): Quân, arriving from a referral, needs a clear outsourcing door right under the hero, and school buyers need the products door beside it. Two big doors split the two audiences before any scrolling. Must-have with no slice.

## Capabilities

- **CAP-1**
  - **intent:** A visitor sees two doors directly under the hero.
  - **success:** "Products for schools" and "Your software delivery team" sit directly under the hero, overlapping its bottom by 104px (80px at 900px and below), and stack into one column at 900px and below (FR-13).
- **CAP-2**
  - **intent:** Each door is one simple link.
  - **success:** The Products door is one link to `/products` and the Services door is one link to `/services`; badges and chips inside are text, with no interactive element inside either link (AC-A11Y-4).
- **CAP-3**
  - **intent:** Each door shows what lies behind it.
  - **success:** The Products door is the light gradient panel with the PXP, LXP, SXP and IoT badges, its line and the chips "PXP · Parents", "LXP · Students", "SXP · Staff", "IoT · Campus"; the Services door is the navy panel labelled "Outsourcing services" with its line and the chips Product Engineering, AI-Driven Analytics, Staffing, Low-code, Cloud and "+3 more" (UX-DR16).

## Constraints

- If Andy's 3.7 lines (news, capture) are already in `src/app/page.tsx`, insert your section above them; keep them and keep the capture band last (FR-14, 3.7 CAP-4).
- Story 3.1 must be merged first (the overlap is measured on the hero bottom).
- Definition of Done (CLAUDE.md): unit tests with 100% changed-line and 80% branch coverage, an `@smoke` Playwright test, lint, typecheck, format check, build, local Sonar gate (LOCAL ONLY) and bmad-code-review must pass.
- Next.js 16 App Router; Server Components by default, `"use client"` only for state, effects or browser APIs; read `node_modules/next/dist/docs/` before using a Next.js API.
- Use the Tailwind v4 tokens from Story 1.1 (`@theme` in `src/app/globals.css`); no new hard-coded colours, sizes or breakpoints.
- Port the prototype markup, copy and look; do not redesign. The UX spines win over the prototype on any conflict.
- Routes have no `/en` or `/vi` prefix (locale routing, Story 1.2, is after demo); Demo day is English only, but every string is kept in a form that can be translated later (no copy baked into logic).
- Every visible fact is real or starts with `[Placeholder]` (NFR-7).
- Sammy owns `src/app/page.tsx`, `src/app/services/*`, `src/app/about/*`, `src/components/home/*` and the footer; do not edit Andy's files (`src/app/layout.tsx`, `@theme` in `globals.css`, `src/components/layout/*`, `src/lib/sanity/*`, `src/app/api/*`, and the products, news, careers, privacy, not-found and demo pages).

## Non-goals

- Products and Services pages behind the doors (Stories 4.1 to 4.3, 5.1 and 5.2).
- Scroll reveal (Story 1.1 remainder, after demo).
- VI copy (Story 1.2, after demo).

## Success signal

- On https://xiontech-dev.vercel.app the two doors overlap the Home hero bottom; clicking anywhere on a door opens `/products` or `/services`, and keyboard Tab stops once per door.
