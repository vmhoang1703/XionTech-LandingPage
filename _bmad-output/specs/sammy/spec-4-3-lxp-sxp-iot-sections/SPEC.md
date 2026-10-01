---
id: SPEC-4-3-lxp-sxp-iot-sections
owner: Sammy
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

# Story 4.3 LXP, SXP and IoT sections

## Why

Opportunity. Lan, a school principal choosing apps for staff and students, needs to compare the three web apps side by side. Each one gets a section with its audience, four features and a browser frame. Design reference: `products.html#lxp`, `#sxp` (navy), `#iot`.

## Capabilities

- **CAP-1**
  - **intent:** `#lxp`, `#sxp` and `#iot` each present one web app with its audience, four features and a browser frame.
  - **success:** Each section shows audience, four features and a browser frame with a mono URL pill; the surfaces are mist with linen, navy, and paper (FR-17, UX-DR17).
- **CAP-2**
  - **intent:** The visitor can open each app's web address.
  - **success:** While unconfirmed, the pill reads `[Placeholder] lxp.xiontechs.com`, `[Placeholder] sxp.xiontechs.com` or `[Placeholder] iot.xiontechs.com` and links to a temporary value (A1); it is a link that opens in a new tab, with an accessible name ending "(opens in a new tab)".
- **CAP-3**
  - **intent:** A missing media asset never looks broken.
  - **success:** With no media asset, the frame shows the empty navy grid media frame and no `<img>` with a broken source.

## Constraints

- Story 4.1 must be merged first: the sections live in `/products` under its hero and sub-nav.
- Sammy owns the page sections under `src/app/products/`; Andy owns `src/app/layout.tsx`, `globals.css` `@theme`, `src/components/layout/*`.
- Next.js 16 App Router, Server Components (no client state needed). Read `node_modules/next/dist/docs/` before using a Next.js API.
- Tailwind v4 tokens from Story 1.1. Port the prototype, do not redesign.
- Route has no `/en` or `/vi` prefix (Story 1.2 is after demo); keep copy in a form that can be translated later.
- Content is real or starts with `[Placeholder]` (NFR-7).
- The LXP, SXP and IoT web addresses are temporary, marked `[Placeholder]` and kept in one place in the code, the same place as the Story 4.2 store links, so they are easy to find and replace (A1).
- Definition of Done from `CLAUDE.md`: 100% changed-line and 80% branch coverage, smoke, lint, typecheck, build, local Sonar gate, `bmad-code-review`.

## Non-goals

- Real product screens or clips in the frames (Story 4.4, after demo). On Demo day every frame is the empty media frame.
- Hero, sub-nav and anchor landing (Story 4.1); PXP story phone (Story 4.2); `#updates` (Story 4.5, after demo).
- Vietnamese copy (Story 1.2, after demo).

## Success signal

- On https://xiontech-dev.vercel.app/products, a reviewer scrolls through `#lxp`, `#sxp` and `#iot`, sees each audience, four features and an empty navy-grid frame, and clicks a URL pill to open a new tab.
