---
id: SPEC-4-2-pxp-story-phone
owner: Andy
build_day: 2026-10-04
depends_on: ["4.1"]
companions:
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/DESIGN.md
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/EXPERIENCE.md
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/mockups/site-v3/products.html
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/mockups/site-v3/css/site.css
  - ../../decisions-2026-10-01.md
sources:
  - ../../../planning-artifacts/epics.md
  - ../../../planning-artifacts/prds/prd-XionTech-LandingPage-2026-09-28/prd.md
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# Story 4.2 PXP story phone

## Why

Opportunity. Hà, a parent on a phone (Flow 3), wants to see what PXP shows a parent before she installs it. The story phone at `/products#pxp` is the climax of that flow: she taps through the school day and then finds the store buttons. Design reference: `products.html#pxp` (`#pxpPhone`, `.ptabs`, feature list, store buttons).

## Capabilities

- **CAP-1**
  - **intent:** The PXP section "The school day, in a parent's pocket." shows a 260px phone holding five screens, with pill tabs Attendance, Grades, Messages, Payments, Events.
  - **success:** The tabs follow the ARIA tab pattern (tablist, tab, tabpanel, `aria-selected`, `aria-controls`); exactly one tab is selected; five screens exist (FR-16, UX-DR18).
- **CAP-2**
  - **intent:** A visitor activates a tab and sees its matching screen.
  - **success:** Given Hà taps Grades, the Grades screen is shown and the other four are not. On Demo day the switch is instant.
- **CAP-3**
  - **intent:** Inactive screens stay out of the keyboard and screen-reader path.
  - **success:** The four inactive screens cannot take focus and are hidden from assistive tech (AC-A11Y-3); a test tabs through the section and never lands inside a hidden screen.
- **CAP-4**
  - **intent:** The visitor sees the four PXP features and can reach the app stores.
  - **success:** App Store and Google Play buttons are always shown and use temporary `[Placeholder]` link values until real ones exist (A1); each has `target="_blank"`, `rel="noopener noreferrer"` and an accessible name ending "(opens in a new tab)" (FR-16).

## Constraints

- Story 4.1 must be merged first: this section sits in `/products` at `#pxp`, under the 4.1 hero and sticky sub-nav.
- Sammy owns the page sections under `src/app/products/`; Andy owns `src/app/layout.tsx`, `globals.css` `@theme`, `src/components/layout/*`.
- Next.js 16 App Router; Server Component by default, the tab switcher is the only client part. Read `node_modules/next/dist/docs/` before using a Next.js API.
- Tailwind v4 tokens from Story 1.1. Port the prototype, do not redesign.
- Route `/products` has no `/en` or `/vi` prefix (Story 1.2 is after demo); keep all copy in a form that can be translated later.
- Content is real or starts with `[Placeholder]` (NFR-7).
- The App Store and Google Play link values are temporary, marked `[Placeholder]` and kept in one place in the code, the same place as the Story 4.3 LXP, SXP and IoT addresses, so they are easy to find and replace (A1).
- Definition of Done from `CLAUDE.md`: unit tests with 100% changed-line and 80% branch coverage, smoke, lint, typecheck, build, local Sonar gate, `bmad-code-review`.

## Non-goals

- The 0.55s crossfade between screens, instant under reduced motion (after demo).
- Products hero, sticky sub-nav, in-view highlight and anchor landing (Story 4.1).
- Real product media and clips in device frames (Story 4.4, after demo).
- `#updates` product stories (Story 4.5, after demo).
- Vietnamese copy and the EN/VI switch (Story 1.2, after demo).

## Success signal

- On https://xiontech-dev.vercel.app/products#pxp, a reviewer taps Grades and sees the Grades screen, tabs through the page without focus entering a hidden screen, and clicks App Store to open a new tab.

## Assumptions

- Phone screen content is ported from the `products.html` prototype screens; no new screen data is invented.
