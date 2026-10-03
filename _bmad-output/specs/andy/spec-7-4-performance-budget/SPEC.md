---
id: SPEC-7-4-performance-budget
owner: Andy
build_day: 2026-10-07
depends_on: ["3.2", "all Demo-day page stories (Epics 1 to 6)"]
companions:
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/EXPERIENCE.md
  - ../../../prototype-enhancement/prototype/index.html
  - ../../decisions-2026-10-01.md
sources:
  - ../../../planning-artifacts/epics.md
  - ../../../planning-artifacts/prds/prd-XionTech-LandingPage-2026-09-28/prd.md
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# Story 7.4: Performance budget (Demo-day slice)

## Why

Hà opens the site on a mid-range phone and gives up if it is slow. The Home hero runs a WebGL silk animation, the heaviest thing on the site, so the performance budget (NFR-4, SM-6, SM-8) must be measured and held on every English page before Demo day 2026-10-09.

## Capabilities

- **CAP-1**
  - **intent:** The team can measure every page the same way, locally.
  - **success:** One local command runs mobile Lighthouse against a production build (`next build` + `next start`) on all 11 English page types (Home, Products, Services, News, one news story, About, Careers, one job page, Book a demo, Privacy policy, Not found) and saves one report per page.
- **CAP-2**
  - **intent:** Nothing blocks first render.
  - **success:** On every page no icon set or third-party script is render-blocking (AC-PERF-1, NFR-4); the Lighthouse render-blocking audit lists none of them.
- **CAP-3**
  - **intent:** Every page meets the Lighthouse score budget.
  - **success:** Each page scores mobile Performance at least 90, Accessibility 100, SEO at least 90 (site-wide metadata; 100 after Story 7.1, T8) and Best Practices at least 95 `[ASSUMPTION]` (SM-6).
- **CAP-4**
  - **intent:** Home stays fast despite the silk.
  - **success:** Home on the mobile profile has LCP at most 2.5s, INP at most 200ms and CLS at most 0.1 `[ASSUMPTION]` (SM-8). If the silk breaks the budget, motion is reduced, not the targets (SM-C3).
- **CAP-5**
  - **intent:** Budget failures are fixed before Demo day.
  - **success:** The final run, after the last Demo-day page is merged, shows every page within CAP-2 to CAP-4; each fix is made here or in the owning page story and named in the PR.

## Constraints

- Runs after Story 3.2 (silk) and checks each page as it is merged; the final run follows the last page story merged: Andy's 6.6 or 6.2, or Sammy's 6.4 (planned 2026-10-07).
- No CI yet (PRD open question 20): the check runs locally before release. Tools must be free, added as devDependencies, with scripts outside `src/`.
- Measure a production build only, never `next dev`.
- Fixes must not change design, content or targets. Fixes go to the owner of each file; fixes in Sammy's files (`src/app/page.tsx`, `src/app/services/*`, `src/app/about/*`, `src/components/home/*`, the footer) are agreed with Sammy.
- Definition of Done from `CLAUDE.md` (100% changed lines, 80% branches, smoke, lint, local Sonar gate, `bmad-code-review`).

## Non-goals

- Vietnamese pages and runs in both locales: after demo (Story 1.2).
- A CI pipeline for Lighthouse: open item after demo.
- Per-page metadata (needed for SEO 100), hreflang and sitemap: Story 7.1, after demo (T8). Accessibility checks beyond Lighthouse: Story 7.3.
- Field (real-user p75) Core Web Vitals collection: needs traffic, and no analytics cookies without consent (FR-42).

## Success signal

- A reviewer runs the command against a production build of `develop` and gets 11 reports, all within budget; the Home report shows LCP at most 2.5s and CLS at most 0.1 with the silk running, and https://xiontech-dev.vercel.app/ loads with no render-blocking icon or third-party script.

## Assumptions

- Lab Lighthouse numbers stand in for mobile p75 field data on Demo day.

## Open Questions

- Lighthouse navigation runs do not measure INP. Use Total Blocking Time as the lab stand-in, or a Lighthouse timespan run with a scripted tap on Home?
