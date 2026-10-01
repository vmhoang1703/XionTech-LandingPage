---
id: SPEC-5-1-services-hero-clocks
owner: Sammy
build_day: 2026-10-05
depends_on: ["1.1"]
companions:
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/DESIGN.md
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/EXPERIENCE.md
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/mockups/site-v3/services.html
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/mockups/site-v3/css/site.css
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/mockups/site-v3/js/site.js
sources:
  - ../../../planning-artifacts/epics.md
  - ../../../planning-artifacts/prds/prd-XionTech-LandingPage-2026-09-28/prd.md
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# Story 5.1 Services hero with live office clocks

## Why

Opportunity. Quân, a CTO checking time-zone overlap (Flow 2), wants the live local time in Ho Chi Minh City and Plano, so he knows when the team is working. This story also starts the `/services` page. Design reference: `services.html` hero (`section.hero-navy`, `.cta-row`, `.clock-strip`); clock logic in `js/site.js` `clocks()`.

## Capabilities

- **CAP-1**
  - **intent:** `/services` opens with a navy hero that offers two next steps.
  - **success:** Navy hero shows breadcrumbs, H1 "Software teams that get IT done.", a primary "Start a project" to `/demo#project` and a glass "See our 4-D process" to `#process` (FR-20).
- **CAP-2**
  - **intent:** The clock strip shows each office's zone before JavaScript runs.
  - **success:** The server HTML contains "Ho Chi Minh City GMT+7" and "Plano US Central".
- **CAP-3**
  - **intent:** With JavaScript, the strip shows live local times from one shared clock module.
  - **success:** Times use IANA zones `Asia/Ho_Chi_Minh` and `America/Chicago` and refresh every 30 seconds; the same module is reused by the About office cards (FR-30, UX-DR19, Story 6.4). A unit test with fake timers proves the 30s refresh and both zones.

## Constraints

- Story 1.1 must be merged first.
- Until Story 5.4 lands, "See our 4-D process" opens Services at the top (no `#process` target yet).
- Breadcrumbs use the simple prototype markup until Story 1.6 (after demo) makes them a shared component.
- Sammy owns `src/app/services/page.tsx` and its sections; Andy owns `src/app/layout.tsx`, `globals.css` `@theme`, `src/components/layout/*`.
- Next.js 16 App Router, Server Components by default; the live clock is the only client part. Read `node_modules/next/dist/docs/` before using a Next.js API.
- Tailwind v4 tokens from Story 1.1. Port the prototype, do not redesign.
- Route has no `/en` or `/vi` prefix (Story 1.2 is after demo); keep copy in a form that can be translated later.
- Definition of Done from `CLAUDE.md`: 100% changed-line and 80% branch coverage, smoke, lint, typecheck, build, local Sonar gate, `bmad-code-review`.

## Non-goals

- Stats and eight services (Story 5.2); three ways to work and industries (Story 5.3, after demo); 4-D process and project capture (Story 5.4).
- About office cards (Story 6.4, reuses the module).
- Shared inner-page hero and breadcrumb component (Story 1.6, after demo).
- Vietnamese copy (Story 1.2, after demo).

## Success signal

- On https://xiontech-dev.vercel.app/services, a reviewer sees the navy hero and both clocks; with JavaScript off the zone labels show; with it on the times match the real local times and change within 30 seconds of a minute turning.
