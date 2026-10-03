---
id: SPEC-1-4-mobile-menu
owner: Andy
build_day: 2026-10-06
depends_on: ["1.3"]
companions:
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/EXPERIENCE.md
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/DESIGN.md
  - ../../../prototype-enhancement/prototype/js/site.js
  - ../../../prototype-enhancement/prototype/css/site.css
  - ../../decisions-2026-10-01.md
sources:
  - ../../../planning-artifacts/epics.md
  - ../../../planning-artifacts/prds/prd-XionTech-LandingPage-2026-09-28/prd.md
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# Story 1.4: Mobile menu (Demo-day slice)

## Why

Hà, a parent on her phone, must reach PXP and Book a demo on a small screen and close the menu with a tap or the keyboard. Below 1080px the 1.3 desktop nav does not fit, so without this story phones have no navigation at all on Demo day (2026-10-09).

## Capabilities

- **CAP-1**
  - **intent:** At 1080px and below, the nav collapses behind a "Menu" button that opens it.
  - **success:** At 1080px and below the header shows a 40px-high pill button reading "Menu" (no icon), accessible name "Menu", with `aria-controls` pointing at the menu panel and `aria-expanded` matching its state (AC-NAV-4, FR-2, UX-DR7). Above 1080px the button is not shown.
- **CAP-2**
  - **intent:** A keyboard user can close the open menu with Escape.
  - **success:** With the menu open, Escape closes it and focus returns to the Menu button (AC-NAV-4).
- **CAP-3**
  - **intent:** While open, the menu holds scroll and focus.
  - **success:** The background page does not scroll; Tab and Shift+Tab cycle only through the open menu panel plus the header bar controls (logo link, Menu button, and the EN/VI switch once Story 1.2 adds it) (FR-2).
- **CAP-4**
  - **intent:** A closed menu is invisible to keyboard users.
  - **success:** With the menu closed, tabbing through the page never focuses a menu item (AC-A11Y-3).
- **CAP-5**
  - **intent:** On phones, Book a demo is the first thing in the menu.
  - **success:** At 640px and below the open menu's first item is Book a demo in button style linking `/demo#form`, and the header bar does not show Book a demo (AC-NAV-2, FR-3).
- **CAP-6**
  - **intent:** On tablets, Book a demo stays in the header.
  - **success:** Between 641px and 1080px Book a demo sits in the header next to the EN/VI slot and is not repeated in the menu (AC-NAV-2).
- **CAP-7**
  - **intent:** The menu reaches every top-level page.
  - **success:** The open menu lists Products, Services, News, About and Careers as links to `/products`, `/services`, `/news`, `/about`, `/careers`, from the same nav data the 1.3 header uses.
- **CAP-8**
  - **intent:** The menu does not stay open after it has done its job.
  - **success:** Activating any link in the open menu, or growing the viewport above 1080px, closes the menu and releases the scroll lock (T6).

## Constraints

- Story 1.3 (desktop header) must be merged first; extend its header and nav data list, do not fork them.
- Andy owns `src/components/layout/*` (except `site-footer.tsx`, Sammy's, Story 1.5). Header shell stays a Server Component; only the menu state is a `"use client"` component.
- Tokens from Story 1.1: breakpoints 640px and 1080px (inclusive max-width, as in the prototype CSS), mobile menu z layer 60, Menu button style per DESIGN Mobile menu (paper panel under the header, full width, scrolls inside the viewport).
- Port the prototype header (`#burger`, `#menu`, `.menu-cta`); do not redesign. Where the prototype differs, the spines win: its focus trap covers only the button and menu items; the build must also include the logo link (and the EN/VI switch later).
- No `/en` or `/vi` route prefixes (Story 1.2 is after demo); keep every label in a form that can be translated later.
- Definition of Done from `CLAUDE.md`: unit tests at 100% changed lines and 80% branches, `@smoke` passes, lint/typecheck/format, local Sonar gate, `bmad-code-review`. Cover Escape, `aria-expanded`, focus trap, close on link and on resize, and the 640px/1080px cases in tests.

## Non-goals

- Inline single-column mega content inside the menu (expand Products, PXP to `/products#pxp`): after demo.
- The EN/VI switch and AC-NAV-1: Story 1.2, after demo. This story only leaves the slot in the header bar.
- Desktop header, mega menus, hover and skip link: Story 1.3.
- Vietnamese labels: after demo.

## Success signal

- On https://xiontech-dev.vercel.app at 375px width, a reviewer opens the menu, sees Book a demo first, cannot scroll the page or tab out of the menu and header bar, presses Escape and lands back on "Menu", reopens it, taps a menu link and sees the menu closed after the page changes; at 800px Book a demo is in the header and not in the menu.

## Assumptions

- The 1080px and 640px rules are inclusive (`max-width`), as in the prototype CSS.
- No EN/VI switch exists on Demo day; its slot is kept so AC-NAV-1 lands with Story 1.2.
