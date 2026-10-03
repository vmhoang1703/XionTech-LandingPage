---
id: SPEC-1-3-desktop-header
owner: Andy
build_day: 2026-10-02
depends_on: ["1.1", "1.5"]
companions:
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/DESIGN.md
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/EXPERIENCE.md
  - ../../../prototype-enhancement/prototype/js/site.js
  - ../../../prototype-enhancement/prototype/css/site.css
  - ../../decisions-2026-10-01.md
sources:
  - ../../../planning-artifacts/epics.md
  - ../../../planning-artifacts/prds/prd-XionTech-LandingPage-2026-09-28/prd.md
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# Story 1.3: Desktop header, mega menus and skip link

## Why

Quân, a CTO between meetings, must reach any product, any service or Book a demo in one move from every page. The header is on every page, so the whole Demo-day site depends on it (mandate: Demo day 2026-10-09). The design reference is the header template in prototype `js/site.js` (`#site-header`, `.skip`, mega panels, `.head-cta`).

## Capabilities

- **CAP-1**
  - **intent:** Above 1080px every page has a sticky glass header with the main navigation.
  - **success:** Logo links Home; Products, Services, News, About, Careers show as text only (no caret), all 40px high and aligned; the current page has `aria-current="page"` and navy bold text with a 2px amber underline (FR-1, UX-DR6).
- **CAP-2**
  - **intent:** Products and Services open mega menus predictably by click or tap.
  - **success:** A click or tap on a trigger opens its menu and a second one closes it; triggers expose `aria-expanded`; Escape closes and returns focus to the trigger; opening Services closes Products; a click or tap outside closes both; this works on a large touch screen with no hover (FR-1, AC-NAV-3 Escape part).
- **CAP-3**
  - **intent:** The Products mega lists every app by app, not by audience.
  - **success:** It shows PXP (Parents), LXP (Students), SXP (Staff, Teachers, Leaders), IoT Device Management (School staff and facilities) with name, value and "for" line, text only (no badges, icons, arrows), then "More products are on the way." and "All products"; products come from one data list, so a new product is one new row (FR-1).
- **CAP-4**
  - **intent:** The Services mega reaches every service and the process.
  - **success:** All 8 services link to their `/services#...` anchors (`#product-engineering`, `#ai-analytics`, `#co-creation`, `#staffing`, `#custom-apps`, `#low-code`, `#ai-solutions`, `#cloud`); the footer row links "See the process" to `/services#process` (FR-1).
- **CAP-5**
  - **intent:** Keyboard users can skip the header and reach every menu item.
  - **success:** The first Tab shows "Skip to content" as an amber pill; activating it moves focus to `main`; every mega menu item is reachable by keyboard (FR-8, UX-DR9).
- **CAP-6**
  - **intent:** Book a demo is always in the header on wider screens.
  - **success:** Above 640px a Book a demo button sits in the header tools slot and links to `/demo#form` (FR-3, AC-NAV-2 header part).
- **CAP-7**
  - **intent:** Every page shows the site footer.
  - **success:** The root layout renders the Story 1.5 footer (`src/components/layout/site-footer.tsx`) below the main content on every page (T3).
  - **deferred (T10):** not built in this story's PR, because Story 1.5 is not merged yet; Andy mounts the footer in a follow-up PR once 1.5 merges.

## Constraints

- Depends on 1.1 (tokens, fonts, focus ring, buttons) and 1.5 (footer component to mount). Must merge before 1.4.
- Andy owns `src/components/layout/*` except `site-footer.tsx` (Sammy, Story 1.5), and `src/app/layout.tsx`, where he mounts the footer (T3). Header renders on the server; only menu state needs a client component.
- Next.js 16 App Router: read `node_modules/next/dist/docs/` before using `Link` or navigation hooks.
- No `/en` `/vi` prefixes on Demo day; keep every label in one string source so Story 1.2 can translate it. Product and service names stay English.
- Port the prototype header; do not redesign. Links to pages not yet merged show Not found until those stories land.
- Definition of Done per CLAUDE.md (unit tests 100% changed lines, 80% branch, smoke, lint, local Sonar gate, `bmad-code-review`).

## Non-goals

- Mega menu 0.3s fade and drop, and its reduced-motion variant: after demo. (Hover opening was moved into scope by decision T11.)
- Mobile menu, menu button and Book a demo as first menu item at 640px and below: Story 1.4.
- EN/VI switch: Story 1.2 (after demo).
- Breadcrumbs: Story 1.6 (page stories use prototype markup until then). Footer component and content: Story 1.5 (Sammy); this story only mounts it.

## Success signal

- On https://xiontech-dev.vercel.app at desktop width, a reviewer presses Tab once to see the skip link, opens Products by click, presses Escape and sees focus back on Products, opens Services and follows "See the process" to `/services#process`, and Book a demo opens `/demo#form`; the footer shows below the main content (after the T10 follow-up PR).

## Assumptions

- With no EN/VI switch on Demo day, Book a demo sits alone at the right of the tools area; the switch slot is kept for Story 1.2.
