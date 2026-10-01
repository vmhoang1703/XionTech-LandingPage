---
id: SPEC-7-3-accessibility-checks
owner: Andy
build_day: 2026-10-07
depends_on: ["all Demo-day page stories (Epics 1 to 6)"]
companions:
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/EXPERIENCE.md
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/DESIGN.md
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/mockups/site-v3/index.html
sources:
  - ../../../planning-artifacts/epics.md
  - ../../../planning-artifacts/prds/prd-XionTech-LandingPage-2026-09-28/prd.md
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# Story 7.3: Accessibility checks on every page (Demo-day slice)

## Why

Hà uses a screen reader or keyboard and must be able to use the whole site. WCAG 2.2 AA on every page is a hard floor (NFR-1) for a real public company site, and the AC-A11Y criteria from the prototype review must be proven on the built pages, not assumed, before Demo day 2026-10-09.

## Capabilities

- **CAP-1**
  - **intent:** Automated checks find no serious accessibility problem on any page.
  - **success:** A local axe-core run on all 11 English page types (Home, Products, Services, News, one news story, About, Careers, one job page, Book a demo, Privacy policy, Not found) reports zero serious or critical violations, including colour contrast (AC-A11Y-1, SM-7).
- **CAP-2**
  - **intent:** The colour tokens cannot drift below contrast.
  - **success:** A design-token contrast unit test checks every text and icon token pair used on paper, mist, amber and navy: at least 4.5:1, or 3:1 for large text and icons; amber text on light surfaces uses `#8A6700`; `#C99700` is never paired as text (AC-A11Y-1).
- **CAP-3**
  - **intent:** Keyboard and screen-reader rules are proven by tests.
  - **success:** Playwright keyboard tests prove a visible focus ring on paper, mist, amber and navy, including the navy capture field (AC-A11Y-2); no focus into closed mega or mobile menus, the inactive contact form tab or inactive PXP phone screens (AC-A11Y-3); no interactive element nested in a link (AC-A11Y-4); invalid fields on the contact form, capture band and job form get `aria-invalid`, `aria-describedby` and announced errors (AC-A11Y-5).
- **CAP-4**
  - **intent:** Every page has a sound structure.
  - **success:** Each page has exactly one H1, tab order follows reading order, touch targets are at least 24 x 24px, and images have English alt text or empty alt when decorative (NFR-1).
- **CAP-5**
  - **intent:** Every serious problem is fixed before Demo day.
  - **success:** The final run, after the last Demo-day page is merged, passes CAP-1 to CAP-4; each fix is made here or in the owning page story and named in the PR.

## Constraints

- Checks each page as it is merged; the final run follows Sammy's last page (planned 2026-10-07).
- No CI yet (PRD open question 20): axe and keyboard suites run locally before release. Free tools only (axe-core with Playwright), as devDependencies, kept apart from the `@smoke` project.
- Story 1.1 already checks amber contrast (AC-A11Y-1); CAP-2 extends that test to all surface pairs instead of adding a second one.
- Fixes keep the design (the spines win over the prototype). Fixes in Sammy's files are agreed with Sammy.
- Definition of Done from `CLAUDE.md` (100% changed lines, 80% branches, smoke, lint, local Sonar gate, `bmad-code-review`).

## Non-goals

- Vietnamese pages: the VI axe run, VI alt text and the 320px VI check (no horizontal scroll, no truncated buttons): after demo, with Story 1.2.
- Lighthouse scores and performance: Story 7.4.
- A CI pipeline for these checks: open item after demo.

## Success signal

- A reviewer runs the axe and keyboard suites locally against a production build of `develop` and gets zero serious or critical violations on all 11 English pages; on https://xiontech-dev.vercel.app they can tab through Home and see a focus ring on every surface, including the navy capture field.

## Assumptions

- The token contrast test and the per-page checks (H1, tab order, targets, alt) are in the Demo-day slice, because the slice defers only the Vietnamese parts.
