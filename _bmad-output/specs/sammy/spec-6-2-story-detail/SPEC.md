---
id: SPEC-6-2-story-detail
owner: Sammy
build_day: 2026-10-07
depends_on: ["1.7", "1.8", "6.1"]
companions:
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/DESIGN.md
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/EXPERIENCE.md
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/mockups/site-v3/news-story.html
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/mockups/site-v3/css/site.css
  - ../../../../docs/spikes/cms-spike.md
  - ../../decisions-2026-10-01.md
sources:
  - ../../../planning-artifacts/epics.md
  - ../../../planning-artifacts/prds/prd-XionTech-LandingPage-2026-09-28/prd.md
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# Story 6.2 Story detail page

## Why

Opportunity. Nam opens a Team story and wants a readable page with the date, the category and a way back, so he can finish it and keep browsing. Every "Read story" link on Home and News lands here. Design reference: `news-story.html`.

## Capabilities

- **CAP-1**
  - **intent:** `/news/[slug]` shows one story from Sanity in full.
  - **success:** For an existing slug: breadcrumbs Home / News / story, H1, mono date and category tag, photo, body, a related product link (for example `/products#pxp`) and "Back to News". No email capture band (FR-26, FR-33 exception).
- **CAP-2**
  - **intent:** Dates use the agreed English format.
  - **success:** A story dated 18 September 2026 shows `18 SEP 2026` in mono type.
- **CAP-3**
  - **intent:** Each story has its own page metadata.
  - **success:** Generated metadata gives each story its own title and meta description.
- **CAP-4**
  - **intent:** An unknown story falls back to Not found.
  - **success:** An unknown slug renders the Story 1.7 Not found page with HTTP 404.

## Constraints

- Stories 1.7 (Not found), 1.8 (Sanity) and 6.1 (News page) must be merged first. Epics also list 3.7, only for its content module, which T2 removes; 3.7 still merges first through 6.1.
- Reads use the Sanity client and the one tagged fetch helper from Story 1.8 (`src/lib/sanity/*`, Andy owns it), with `useCdn: true` and tag-based caching, never `force-dynamic` (`cms-spike.md`). This story writes its own GROQ query for one story by slug, in its own files; there is no content access module (T2).
- Breadcrumbs use the simple prototype markup until Story 1.6 (after demo).
- Sammy owns `src/app/news/[slug]/page.tsx`. Next.js 16 App Router, Server Components; use the Metadata API. Read `node_modules/next/dist/docs/` before using a Next.js API (dynamic params and `notFound()` may differ from older versions).
- Tailwind v4 tokens from Story 1.1. Port the prototype, do not redesign.
- Route has no `/en` or `/vi` prefix (Story 1.2 is after demo); keep copy and date formatting in a form that can be translated later.
- Demo-day story titles start with `[Placeholder]` (NFR-7).
- Definition of Done from `CLAUDE.md`: 100% changed-line and 80% branch coverage, smoke, lint, typecheck, build, local Sonar gate, `bmad-code-review`.

## Non-goals

- Per-story Open Graph image (after demo).
- VI date format `18/09/2026` and Vietnamese copy (Story 1.2, after demo).
- Site-wide metadata, hreflang and sitemap (Story 7.1, after demo).

## Success signal

- On https://xiontech-dev.vercel.app/news, a reviewer clicks "Read story", sees breadcrumbs, H1, `DD MMM YYYY` date, tag, photo, body and related product link, clicks "Back to News", and gets the Not found page at `/news/no-such-story`.
