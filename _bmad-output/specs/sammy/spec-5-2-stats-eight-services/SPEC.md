---
id: SPEC-5-2-stats-eight-services
owner: Sammy
build_day: 2026-10-06
depends_on: ["3.3", "5.1"]
companions:
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/DESIGN.md
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/EXPERIENCE.md
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/mockups/site-v3/services.html
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/mockups/site-v3/css/site.css
sources:
  - ../../../planning-artifacts/epics.md
  - ../../../planning-artifacts/prds/prd-XionTech-LandingPage-2026-09-28/prd.md
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# Story 5.2 Stats and eight services with anchors

## Why

Opportunity. Quân follows a service link from Home or the Services mega menu and must land on that service with its heading visible, so he reads the right description at once. Design reference: `services.html` key facts stats and `#all-h` with the eight service anchors.

## Capabilities

- **CAP-1**
  - **intent:** Services shows the shared stats band on a paper surface.
  - **success:** The section reuses the Story 3.3 component with the same five figures (25+, 24/7, 20+, 8, 2) and the light-surface suffix colour `{colors.amber-text}` (FR-12 reuse).
- **CAP-2**
  - **intent:** "Eight services, one team." shows all eight services, each one an anchor target.
  - **success:** Each service shows its description and tags and carries its id: `#product-engineering`, `#ai-analytics`, `#co-creation`, `#staffing`, `#custom-apps`, `#low-code`, `#ai-solutions`, `#cloud`. The cards are not links (FR-21).
- **CAP-3**
  - **intent:** Following a link to any service anchor lands the heading in view.
  - **success:** For each of the eight anchors, the service heading is fully visible below the sticky header (AC-NAV-5, FR-6), checked by a Playwright test or a scripted check of `scroll-margin-top`.

## Constraints

- Stories 3.3 (stats component) and 5.1 (the `/services` page) must be merged first. Epics list only 3.3; the build plan adds 5.1; the union is used.
- Demo-day slice reuses the static final figures of the 3.3 slice.
- Sammy owns `src/app/services/page.tsx` and its sections. Andy owns `src/app/layout.tsx`, `globals.css` `@theme` (the anchor offset token), `src/components/layout/*`.
- Next.js 16 App Router, Server Components. Read `node_modules/next/dist/docs/` before using a Next.js API.
- Tailwind v4 tokens from Story 1.1. Port the prototype, do not redesign.
- Route has no `/en` or `/vi` prefix (Story 1.2 is after demo); keep copy in a form that can be translated later.
- Definition of Done from `CLAUDE.md`: 100% changed-line and 80% branch coverage, smoke, lint, typecheck, build, local Sonar gate, `bmad-code-review`.

## Non-goals

- Stats count-up animation (Story 3.3, after demo).
- Three ways to work with us and industries (Story 5.3, after demo).
- 4-D process at `#process` and project capture (Story 5.4).
- Vietnamese copy (Story 1.2, after demo).

## Success signal

- On https://xiontech-dev.vercel.app/services#low-code (and each of the other seven anchors), the service heading shows fully below the sticky header, and the stats band above shows the five figures.
