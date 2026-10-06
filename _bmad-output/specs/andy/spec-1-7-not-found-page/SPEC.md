---
id: SPEC-1-7-not-found-page
owner: Andy
build_day: 2026-10-04
depends_on: ["1.1"]
companions:
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/EXPERIENCE.md
  - ../../../prototype-enhancement/prototype/404.html
  - ../../../prototype-enhancement/prototype/css/site.css
sources:
  - ../../../planning-artifacts/epics.md
  - ../../../planning-artifacts/prds/prd-XionTech-LandingPage-2026-09-28/prd.md
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# Story 1.7: Not found page

## Why

Pain (FR-9): a visitor on a broken or mistyped link must not reach a dead end. A short message and four recovery links keep the visit going. Demo-day must-have.

## Capabilities

- **CAP-1**
  - **intent:** A visitor on an unknown path gets a clear Not found page with a 404 status.
  - **success:** Requesting any unknown path returns HTTP 404 `[ASSUMPTION]` (FR-9) and shows the navy hero with the label "404", the H1 "We couldn't find that page." and the lede "The link may be old or mistyped. These pages can help."
- **CAP-2**
  - **intent:** The visitor can recover with one main action and three other routes.
  - **success:** The page has exactly one primary button "Go to Home" to `/`, plus glass links Products (`/products`), Services (`/services`) and News (`/news`) (FR-9).
- **CAP-3**
  - **intent:** The page keeps the site frame and stays simple.
  - **success:** Header and footer are present, there is exactly one H1, and there is no email capture band (FR-33 exception).

## Constraints

- Story 1.1 tokens must be merged first; the header/footer check passes only once Stories 1.3 and 1.5 are merged. If the footer is not yet mounted in `src/app/layout.tsx` on `develop` when this story is built (PR #15 and Andy's mount PR, decision T10), skip the footer check and record it for the mount PR.
- Use the Next.js 16 not-found convention so the status is a real 404, not a 200 page.
- Definition of Done (CLAUDE.md): unit tests with 100% changed-line and 80% branch coverage, an `@smoke` Playwright test, lint, typecheck, format check, build, local Sonar gate (LOCAL ONLY) and bmad-code-review must pass.
- Next.js 16 App Router; Server Components by default, `"use client"` only for state, effects or browser APIs; read `node_modules/next/dist/docs/` before using a Next.js API.
- Use the Tailwind v4 tokens from Story 1.1 (`@theme` in `src/app/globals.css`); no new hard-coded colours, sizes or breakpoints.
- Port the prototype markup, copy and look; do not redesign. The UX spines win over the prototype on any conflict.
- Routes have no `/en` or `/vi` prefix (locale routing, Story 1.2, is after demo); Demo day is English only, but every string is kept in a form that can be translated later (no copy baked into logic).
- Every visible fact is real or starts with `[Placeholder]` (NFR-7).
- Andy owns this story's files. Sammy owns `src/app/page.tsx`, `src/app/services/*`, `src/app/about/*`, `src/components/home/*` and the footer (`src/components/layout/site-footer.tsx`); do not edit those.

## Non-goals

- Aurora and strand ribbon background and the highlight-mark draw-in (Story 1.6, after demo); the static navy hero is used.
- VI text "Không tìm thấy trang này." and links in the current locale (Story 1.2, after demo).
- Not found for unknown or closed job roles (Story 6.6) and news slugs (Story 6.2), which reuse this page.
- Header (Story 1.3) and footer (Story 1.5).

## Success signal

- On https://xiontech-dev.vercel.app/does-not-exist the response is 404, the page shows "We couldn't find that page." with Go to Home, Products, Services and News, and no capture band.

## Assumptions

- The highlight on "that page" from the prototype is rendered as a static mark until Story 1.6.
