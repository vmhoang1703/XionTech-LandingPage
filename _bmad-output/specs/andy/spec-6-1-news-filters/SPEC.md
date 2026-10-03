---
id: SPEC-6-1-news-filters
owner: Andy
build_day: 2026-10-06
depends_on: ["1.8", "2.4", "3.7"]
companions:
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/DESIGN.md
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/EXPERIENCE.md
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/mockups/site-v3/news.html
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/mockups/site-v3/css/site.css
  - ../../../../docs/spikes/cms-spike.md
  - ../../decisions-2026-10-01.md
sources:
  - ../../../planning-artifacts/epics.md
  - ../../../planning-artifacts/prds/prd-XionTech-LandingPage-2026-09-28/prd.md
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# Story 6.1 News page with category filters

## Why

Opportunity. Nam, looking for team stories (Flow 4), wants to filter news by category instantly and read only what interests him. The list is server-rendered from Sanity. Design reference: `news.html` hero, `.filters`, `#newsGrid`, `#newsCount`, `#newsEmpty`, amber demo capture.

## Capabilities

- **CAP-1**
  - **intent:** `/news` renders on the server with a hero, filter chips and a story grid.
  - **success:** Server HTML holds a light hero with H1 "What we've been up to.", then chips All, Product, Company, Schools, Team, then a story grid whose first card is a wide feature (FR-25, FR-45, UX-DR22).
- **CAP-2**
  - **intent:** A visitor filters stories by category without a reload.
  - **success:** Pressing Team shows only Team stories with no reload; Team has `aria-pressed="true"` and the others `false`; the result count is announced in a live region; pressing the active chip does nothing.
- **CAP-3**
  - **intent:** The announced count reads naturally in English.
  - **success:** EN uses plural forms: "Showing 1 story", "Showing N stories".
- **CAP-4**
  - **intent:** An empty category offers a way back.
  - **success:** A category with no stories shows "No stories in this category yet." with a "Show all" button that resets to All.
- **CAP-5**
  - **intent:** `/news` ends with the demo capture and shows Sanity content.
  - **success:** The amber demo capture "See it working at your school." from Story 2.4 is shown, with no newsletter sign-up; on Demo day the stories come from Sanity with titles starting `[Placeholder]` (FR-33).

## Constraints

- Stories 1.8 (Sanity), 2.4 (capture band) and 3.7 (news card) must be merged first. The build plan lists only 1.8; epics add 3.7 and 2.4; the union is used.
- Reads use the Sanity client and the one tagged fetch helper from Story 1.8 (`src/lib/sanity/*`, Andy owns it), with `useCdn: true` and tag-based caching, never `force-dynamic` (`cms-spike.md`). This story writes its own GROQ query for the news list, in its own files; there is no content access module (T2).
- The `[Placeholder]` sample stories are entered in Sanity by the Demo-day editor, Hoang Vu (Andy), who needs a Sanity account invited to the project (free plan: 20 users) (A5).
- Sammy owns `src/app/news/page.tsx` and its sections. The chip filter is the only client part; the full list is in the server HTML.
- Next.js 16 App Router. Read `node_modules/next/dist/docs/` before using a Next.js API.
- Tailwind v4 tokens from Story 1.1. Port the prototype, do not redesign.
- Route has no `/en` or `/vi` prefix (Story 1.2 is after demo); keep copy, including the count strings, in a form that can be translated later.
- Definition of Done from `CLAUDE.md`: 100% changed-line and 80% branch coverage, smoke, lint, typecheck, build, local Sonar gate, `bmad-code-review`.

## Non-goals

- VI count string "Đang hiển thị N tin" and all Vietnamese copy (Story 1.2, after demo; Demo day is English only).
- Story detail page (Story 6.2); editor publishing flow (Story 6.3).
- Newsletter or subscribe capture (FR-35, removed).

## Success signal

- On https://xiontech-dev.vercel.app/news, a reviewer presses Team and sees only Team stories with "Showing N stories" announced, presses an empty category and uses "Show all" to reset, and sees the amber demo capture at the end.
