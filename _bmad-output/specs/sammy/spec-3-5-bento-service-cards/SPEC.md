---
id: SPEC-3-5-bento-service-cards
owner: Sammy
build_day: 2026-10-05
depends_on: ["1.1"]
companions:
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/EXPERIENCE.md
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/DESIGN.md
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/mockups/site-v3/index.html
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/mockups/site-v3/css/site.css
sources:
  - ../../../planning-artifacts/epics.md
  - ../../../planning-artifacts/prds/prd-XionTech-LandingPage-2026-09-28/prd.md
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# Story 3.5: Four-app bento and eight service cards

## Why

Opportunity (FR-14): Lan scans what exists and should reach the details of the one app or service she cares about in one click. Home shows one tile per app and one card per service.

## Capabilities

- **CAP-1**
  - **intent:** A visitor sees the four apps as a bento under "Four apps. One school day."
  - **success:** Above 900px PXP spans 7 columns and 2 rows in amber, SXP spans 5 in navy, LXP spans 3 and IoT spans 2; badges are swapped for contrast on PXP and SXP and the app name sits next to every badge (UX-DR15, UX-DR24).
- **CAP-2**
  - **intent:** Each tile takes the visitor to that app on Products.
  - **success:** Each tile is one stretched link to `/products#pxp`, `#lxp`, `#sxp` or `#iot`; the mini phone inside is not interactive and there is no interactive element inside the link (AC-A11Y-4).
- **CAP-3**
  - **intent:** A visitor sees the eight services under "Eight ways we get IT done for you." and can open each one.
  - **success:** 8 service cards link to `/services#product-engineering`, `#ai-analytics`, `#co-creation`, `#staffing`, `#custom-apps`, `#low-code`, `#ai-solutions`, `#cloud`, laid out in 4, 2 and 1 columns by breakpoint (FR-14).

## Constraints

- Story 1.1 tokens must be merged first.
- Anchor names must match the EXPERIENCE.md service anchor list and the Products section ids (Stories 4.1 to 4.3, 5.2).
- Definition of Done (CLAUDE.md): unit tests with 100% changed-line and 80% branch coverage, an `@smoke` Playwright test, lint, typecheck, format check, build, local Sonar gate (LOCAL ONLY) and bmad-code-review must pass.
- Next.js 16 App Router; Server Components by default, `"use client"` only for state, effects or browser APIs; read `node_modules/next/dist/docs/` before using a Next.js API.
- Use the Tailwind v4 tokens from Story 1.1 (`@theme` in `src/app/globals.css`); no new hard-coded colours, sizes or breakpoints.
- Port the prototype markup, copy and look; do not redesign. The UX spines win over the prototype on any conflict.
- Routes have no `/en` or `/vi` prefix (locale routing, Story 1.2, is after demo); Demo day is English only, but every string is kept in a form that can be translated later (no copy baked into logic).
- Every visible fact is real or starts with `[Placeholder]` (NFR-7).
- Sammy owns `src/app/page.tsx`, `src/app/services/*`, `src/app/about/*`, `src/components/home/*` and the footer; do not edit Andy's files (`src/app/layout.tsx`, `@theme` in `globals.css`, `src/components/layout/*`, `src/lib/sanity/*`, `src/app/api/*`, and the products, news, careers, privacy, not-found and demo pages).

## Non-goals

- Spotlight pointer glow and 4px lift, live immediately after reveal, none on touch (AC-UI-1, after demo).
- Scroll reveal (Story 1.1 remainder, after demo).
- Target sections on Products (Stories 4.2, 4.3) and Services (Story 5.2).
- Real media in the mini phone (Story 4.4, after demo).
- VI copy (Story 1.2, after demo).

## Success signal

- On https://xiontech-dev.vercel.app the Home bento shows the four tiles with PXP large in amber; clicking SXP opens `/products#sxp` and clicking a service card opens its `/services` anchor.

## Assumptions

- The mini phone in the PXP tile shows an empty media frame until Story 4.4 supplies media.
