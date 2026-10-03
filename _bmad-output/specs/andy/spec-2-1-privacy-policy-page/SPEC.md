---
id: SPEC-2-1-privacy-policy-page
owner: Andy
build_day: 2026-10-01
depends_on: ["1.1"]
companions:
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/EXPERIENCE.md
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/mockups/site-v3/privacy.html
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/mockups/site-v3/css/site.css
  - ../../decisions-2026-10-01.md
sources:
  - ../../../planning-artifacts/epics.md
  - ../../../planning-artifacts/prds/prd-XionTech-LandingPage-2026-09-28/prd.md
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# Story 2.1: Privacy policy page

## Why

Mandate (FR-41, NFR-3, Vietnam PDPD Decree 13/2023): the Demo-day forms collect real personal data, so Lan must be able to read how XionTechs uses it, and every consent line and the footer need a real target. The legal text does not exist yet, so the page ships as a clearly marked placeholder outline.

## Capabilities

- **CAP-1**
  - **intent:** A visitor can open the privacy policy at `/privacy`.
  - **success:** `/privacy` shows breadcrumbs (Home / Privacy policy), the H1 "Privacy policy." and, in order, the H2 sections "Who we are and how to reach us", "What we collect", "How we use it", "Who we share it with", "Transfers outside Vietnam", "How long we keep it", "Cookies and analytics", "Your rights" (FR-41, PDPD).
- **CAP-2**
  - **intent:** The cookies section is in place and clearly marked as temporary.
  - **success:** "Cookies and analytics" shows temporary text that starts with `[Placeholder]`, filled in later (A3). The final text lists the essential first-party locale cookie (what it stores and why) and states that no non-essential cookies are set without consent (FR-41, NFR-3).
- **CAP-3**
  - **intent:** Unverified policy text is impossible to mistake for the real policy.
  - **success:** The lede, the outline note and every unverified paragraph start with `[Placeholder]`; `grep -rn "\[Placeholder\]"` finds each one (NFR-7).
- **CAP-4**
  - **intent:** The page stays a plain reading page.
  - **success:** There is no email capture band on `/privacy` (FR-33 exception) and exactly one H1.
- **CAP-5**
  - **intent:** The footer link reaches the policy.
  - **success:** Following the footer "Privacy policy" link (Story 1.5) opens `/privacy`.
- **CAP-6**
  - **intent:** The policy says how long personal data is kept.
  - **success:** "How long we keep it" states that contact and capture submissions, job applications and CVs are kept with no time limit (A4).

## Constraints

- Story 1.1 tokens must be merged first.
- No form may go live at public launch while this text is `[Placeholder]` (FR-41); Demo day may show placeholders (PRD open question 16).
- Definition of Done (CLAUDE.md): unit tests with 100% changed-line and 80% branch coverage, an `@smoke` Playwright test, lint, typecheck, format check, build, local Sonar gate (LOCAL ONLY) and bmad-code-review must pass.
- Next.js 16 App Router; Server Components by default, `"use client"` only for state, effects or browser APIs; read `node_modules/next/dist/docs/` before using a Next.js API.
- Use the Tailwind v4 tokens from Story 1.1 (`@theme` in `src/app/globals.css`); no new hard-coded colours, sizes or breakpoints.
- Port the prototype markup, copy and look; do not redesign. The UX spines win over the prototype on any conflict.
- Routes have no `/en` or `/vi` prefix (locale routing, Story 1.2, is after demo); Demo day is English only, but every string is kept in a form that can be translated later (no copy baked into logic).
- Every visible fact is real or starts with `[Placeholder]` (NFR-7).
- Sammy owns `src/components/home/*`, page-level `src/app/**/page.tsx` and page sections; do not edit Andy's files (`src/app/layout.tsx`, `@theme` in `globals.css`, `src/components/layout/*`, `src/lib/sanity/*`, `src/app/api/*`).

## Non-goals

- Real legal policy text and its owner (PRD open question 4; launch gate Story 7.5).
- Final cookie text; the locale cookie itself is set by Story 1.2, after demo (A3).
- VI policy text (Story 1.2 and VI copy, after demo).
- Consent banner and cookie consent logic (Story 2.5, after demo).
- Shared breadcrumbs component and aurora hero background (Story 1.6, after demo).
- Consent lines in the forms that link here (Stories 2.2, 2.4, 6.6).

## Success signal

- On https://xiontech-dev.vercel.app the footer "Privacy policy" link opens `/privacy` with the eight sections, each unverified paragraph (the cookie text included) tagged `[Placeholder]`, "How long we keep it" saying data is kept with no time limit, and no capture band.

## Assumptions

- The A4 retention sentence is a decided fact, so it is not tagged `[Placeholder]`; the rest of "How long we keep it" stays `[Placeholder]` until the real policy text exists.

## Open Questions

- (A4, owner Amber) How does a person ask for their data to be deleted? Until answered, that part of "Your rights" stays `[Placeholder]` (CAP-3).
