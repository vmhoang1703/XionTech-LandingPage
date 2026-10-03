---
id: SPEC-3-3-stats-band
owner: Sammy
build_day: 2026-10-05
depends_on: ["3.1"]
companions:
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/EXPERIENCE.md
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/DESIGN.md
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/mockups/site-v3/index.html
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/mockups/site-v3/css/site.css
  - ../../decisions-2026-10-01.md
sources:
  - ../../../planning-artifacts/epics.md
  - ../../../planning-artifacts/prds/prd-XionTech-LandingPage-2026-09-28/prd.md
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# Story 3.3: Stats band inside the hero

## Why

Opportunity (FR-12): Quân judges the team fast and should see experience and coverage without scrolling. The figures were confirmed by the business on 2026-09-28. The band is built once and reused on Services (5.2) and About (6.4).

## Capabilities

- **CAP-1**
  - **intent:** A visitor sees five confirmed figures at the bottom of the Home hero.
  - **success:** The label "Experience you can count on" sits at the bottom of the hero above: 25+ Years of leadership experience in software; 24/7 Global coverage across time zones; 20+ Technology stacks we work in; 8 Service offerings, from idea to operation; 2 Offices: Ho Chi Minh City and Plano (FR-12, captions from the prototype).
- **CAP-2**
  - **intent:** The band is one shared component that other pages feed with their own figures.
  - **success:** Figures and captions are passed in as data; on navy the suffix uses `{colors.amber}` and on light `{colors.amber-text}` (UX-DR13); a figure can be marked `[Placeholder]` through its data (A2); Stories 5.2 and 6.4 can reuse it unchanged.
- **CAP-3**
  - **intent:** Every visitor and screen reader gets the final values.
  - **success:** The band shows final figures on load in all layouts, and screen readers read only the final values.
- **CAP-4**
  - **intent:** The band fits every screen width.
  - **success:** It shows 5 columns above 1080px, 3 columns at 1080px and below, and 2 columns at 640px and below.

## Constraints

- If Andy's 3.7 lines (news, capture) are already in `src/app/page.tsx`, insert your section above them; keep them and keep the capture band last (FR-14, 3.7 CAP-4).
- Story 3.1 must be merged first.
- The shared component lives where Stories 5.2 and 6.4 can import it, not inside a Home-only file.
- Definition of Done (CLAUDE.md): unit tests with 100% changed-line and 80% branch coverage, an `@smoke` Playwright test, lint, typecheck, format check, build, local Sonar gate (LOCAL ONLY) and bmad-code-review must pass.
- Next.js 16 App Router; Server Components by default, `"use client"` only for state, effects or browser APIs; read `node_modules/next/dist/docs/` before using a Next.js API.
- Use the Tailwind v4 tokens from Story 1.1 (`@theme` in `src/app/globals.css`); no new hard-coded colours, sizes or breakpoints.
- Port the prototype markup, copy and look; do not redesign. The UX spines win over the prototype on any conflict.
- Routes have no `/en` or `/vi` prefix (locale routing, Story 1.2, is after demo); Demo day is English only, but every string is kept in a form that can be translated later (no copy baked into logic).
- Every visible fact is real or starts with `[Placeholder]` (NFR-7).
- Sammy owns `src/app/page.tsx`, `src/app/services/*`, `src/app/about/*`, `src/components/home/*` and the footer; do not edit Andy's files (`src/app/layout.tsx`, `@theme` in `globals.css`, `src/components/layout/*`, `src/lib/sanity/*`, `src/app/api/*`, and the products, news, careers, privacy, not-found and demo pages).

## Non-goals

- Count-up animation at 60% visible over 1.4s, with "24/7" not counting (after demo).
- Using the band on Services (Story 5.2) and About (Story 6.4), including the About "4 School products" variant (PRD open question 12; unconfirmed, owner Amber, ships `[Placeholder]` if not confirmed, A2).
- VI captions such as "Kinh nghiệm bạn có thể tin cậy" (Story 1.2, after demo).

## Success signal

- On https://xiontech-dev.vercel.app the Home hero ends with the five figures in 5 columns on desktop, 3 at tablet width and 2 on a phone.
