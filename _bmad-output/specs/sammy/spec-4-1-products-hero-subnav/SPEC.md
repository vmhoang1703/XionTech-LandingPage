---
id: SPEC-4-1-products-hero-subnav
owner: Sammy
build_day: 2026-10-04
depends_on: ["1.1"]
companions:
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/EXPERIENCE.md
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/DESIGN.md
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/mockups/site-v3/products.html
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/mockups/site-v3/css/site.css
  - ../../decisions-2026-10-01.md
sources:
  - ../../../planning-artifacts/epics.md
  - ../../../planning-artifacts/prds/prd-XionTech-LandingPage-2026-09-28/prd.md
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# Story 4.1: Products hero and sticky sub-nav

## Why

Pain (FR-15, FR-6): Hà taps PXP in the mobile menu and must land on the PXP heading, not under the header. The Products page needs its amber hero and a sticky sub-nav to jump between the four apps.

## Capabilities

- **CAP-1**
  - **intent:** A visitor arriving at `/products` sees the amber Products hero.
  - **success:** `/products` shows an amber hero with breadcrumbs (Home / Products), the H1 "Four apps. One connected school." (highlight on "connected"), the lede, tablet and phone device frames (empty media frames until Story 4.4) and a navy "Book a demo" button to `/demo#form` (FR-15). The glass "Product updates" link to `#updates` is hidden on Demo day (T5).
- **CAP-2**
  - **intent:** A visitor can jump between apps from a sticky sub-nav.
  - **success:** Under the header a sticky sub-nav of glass pills links PXP, LXP, SXP and IoT to `#pxp`, `#lxp`, `#sxp`, `#iot` and stays visible while scrolling (FR-15, UX-DR18). The "Updates" pill to `#updates` is hidden on Demo day (T5).
- **CAP-3**
  - **intent:** Any link to a Products section lands with its heading fully visible.
  - **success:** Following `#pxp`, `#lxp`, `#sxp` or `#iot` from the sub-nav, the mega menu or another page shows the section heading fully below both the header and the sub-nav, using `{spacing.anchor-offset-subnav}` (AC-NAV-5, FR-6); scrolling is smooth except under reduced motion. `#updates` joins with Story 4.5 (T5).
- **CAP-4**
  - **intent:** The sub-nav works on phones.
  - **success:** At 640px and below the sub-nav scrolls horizontally and no item wraps or truncates.

## Constraints

- Story 1.1 tokens (including `{spacing.anchor-offset-subnav}`) must be merged first.
- This story owns `src/app/products/page.tsx` and the section anchor ids; Stories 4.2 and 4.3 fill the sections.
- Definition of Done (CLAUDE.md): unit tests with 100% changed-line and 80% branch coverage, an `@smoke` Playwright test, lint, typecheck, format check, build, local Sonar gate (LOCAL ONLY) and bmad-code-review must pass.
- Next.js 16 App Router; Server Components by default, `"use client"` only for state, effects or browser APIs; read `node_modules/next/dist/docs/` before using a Next.js API.
- Use the Tailwind v4 tokens from Story 1.1 (`@theme` in `src/app/globals.css`); no new hard-coded colours, sizes or breakpoints.
- Port the prototype markup, copy and look; do not redesign. The UX spines win over the prototype on any conflict.
- Routes have no `/en` or `/vi` prefix (locale routing, Story 1.2, is after demo); Demo day is English only, but every string is kept in a form that can be translated later (no copy baked into logic).
- Every visible fact is real or starts with `[Placeholder]` (NFR-7).
- Sammy owns `src/components/home/*`, page-level `src/app/**/page.tsx` and page sections; do not edit Andy's files (`src/app/layout.tsx`, `@theme` in `globals.css`, `src/components/layout/*`, `src/lib/sanity/*`, `src/app/api/*`).

## Non-goals

- In-view highlight in navy and Updates highlighted at the end of the page (after demo; first in the cut order).
- The hero "Product updates" link and the sub-nav "Updates" pill on Demo day (Story 4.5 adds them back with `#updates`, T5).
- Section content: `#pxp` story phone (Story 4.2); `#lxp`, `#sxp`, `#iot` (Story 4.3); `#updates` and the demo capture (Story 4.5, after demo).
- Real media in the hero device frames (Story 4.4, after demo).
- Aurora and strand ribbon background and highlight-mark draw-in (Story 1.6, after demo).
- VI copy and the VI no-wrap check (Story 1.2, after demo).

## Success signal

- On https://xiontech-dev.vercel.app/products tapping LXP in the sub-nav scrolls to the LXP heading, fully visible below the header and the sticky sub-nav; at phone width the sub-nav scrolls sideways; no link on the page points at `#updates`.

## Assumptions

- The AC-NAV-5 check for each anchor completes once Stories 4.2 and 4.3 merge their sections.
