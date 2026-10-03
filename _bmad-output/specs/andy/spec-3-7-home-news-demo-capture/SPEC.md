---
id: SPEC-3-7-home-news-demo-capture
owner: Andy
build_day: 2026-10-06
depends_on: ["2.4", "1.8"]
companions:
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/DESIGN.md
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/EXPERIENCE.md
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/mockups/site-v3/index.html
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/mockups/site-v3/css/site.css
  - ../../../../docs/spikes/cms-spike.md
  - ../../decisions-2026-10-01.md
sources:
  - ../../../planning-artifacts/epics.md
  - ../../../planning-artifacts/prds/prd-XionTech-LandingPage-2026-09-28/prd.md
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# Story 3.7 Latest news, demo capture and Home section rhythm

## Why

Opportunity. Lan, finishing the Home page (Flow 1), should see that the company is active and be able to ask for a demo at once. This story closes Home with the latest news from Sanity and the amber demo capture, and fixes the page colour rhythm. Design reference: `index.html` news (`#news-h`, `.news-grid`, "See all news") and capture (`#cap-h`).

## Capabilities

- **CAP-1**
  - **intent:** "Latest from XionTechs." shows the three newest stories from Sanity as news cards.
  - **success:** Each card shows mono date, category tag (product stories append the app name), title, excerpt and "Read story" linking to `/news/[slug]`. With fewer than three stories only those show, with no empty slots (FR-14, UX-DR22).
- **CAP-2**
  - **intent:** With no stories, Home stays clean.
  - **success:** With zero stories the news grid is hidden and "See all news" stays.
- **CAP-3**
  - **intent:** Sample content is clearly marked.
  - **success:** Sample stories and the sample note start with `[Placeholder]` (NFR-7).
- **CAP-4**
  - **intent:** Home ends with the demo capture.
  - **success:** The amber demo capture "See it working at your school." from Story 2.4 is the last section before the footer (FR-33).
- **CAP-5**
  - **intent:** Home keeps its colour rhythm.
  - **success:** After the dark hero every section is light (doors, products mist with linen, services paper, news mist) except the navy 4-D band and the one amber capture band (UX-DR3).

## Constraints

- Stories 2.4 (capture band) and 1.8 (Sanity setup) must be merged first.
- Stories are read on the server with the Sanity client and the one tagged fetch helper from Story 1.8 (`src/lib/sanity/*`, Andy owns that folder), with `useCdn: true` and tag-based caching, never `force-dynamic` (`cms-spike.md`). This story writes its own GROQ query for the three newest stories, in its own files; there is no shared content access module, and Stories 6.1 and 6.2 write their own queries (T2).
- The `[Placeholder]` sample stories are entered in Sanity by the Demo-day editor, Hoang Vu (Andy), who needs a Sanity account invited to the project (free plan: 20 users) (A5).
- Sammy owns `src/app/page.tsx` and `src/components/home/*`.
- Next.js 16 App Router, Server Components by default. Read `node_modules/next/dist/docs/` before using a Next.js API.
- Tailwind v4 tokens from Story 1.1. Port the prototype, do not redesign.
- Route has no `/en` or `/vi` prefix (Story 1.2 is after demo); keep copy in a form that can be translated later.
- Definition of Done from `CLAUDE.md`: 100% changed-line and 80% branch coverage, smoke, lint, typecheck, build, local Sonar gate, `bmad-code-review`.

## Non-goals

- The capture component itself and its redirect and prefill (Story 2.4).
- News page and story detail page (Stories 6.1, 6.2); editor publishing flow (Story 6.3).
- Hero, silk, stats, doors, bento, services and 4-D sections (Stories 3.1 to 3.6).
- Vietnamese copy (Story 1.2, after demo).

## Success signal

- On https://xiontech-dev.vercel.app/, a reviewer scrolls to the end of Home, sees three `[Placeholder]` stories from Sanity whose "Read story" opens `/news/[slug]`, then the amber "See it working at your school." band, and every band after the hero is light except the navy 4-D and the amber capture.
