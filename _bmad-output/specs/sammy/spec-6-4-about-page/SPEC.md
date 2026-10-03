---
id: SPEC-6-4-about-page
owner: Sammy
build_day: 2026-10-07
depends_on: ["2.4", "3.3", "5.1"]
companions:
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/DESIGN.md
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/EXPERIENCE.md
  - ../../../prototype-enhancement/prototype/about.html
  - ../../../prototype-enhancement/prototype/css/site.css
  - ../../decisions-2026-10-01.md
sources:
  - ../../../planning-artifacts/epics.md
  - ../../../planning-artifacts/prds/prd-XionTech-LandingPage-2026-09-28/prd.md
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# Story 6.4 About page

## Why

Opportunity. Quân checks who is behind the services and wants the company story, values, FAQ and offices on one page, so he trusts the team before he starts a project. The footer links "Core values" and "FAQ" land here. Design reference: `about.html` hero, key facts stats, `#story-h`, `#values`, `#faq`, `#off-h`, amber capture.

## Capabilities

- **CAP-1**
  - **intent:** `/about` presents the company in a fixed section order.
  - **success:** Navy hero "Tech made simple. Solutions made powerful.", then stats, story "Two strengths, one team.", values, FAQ, offices and a capture band (FR-28).
- **CAP-2**
  - **intent:** The FAQ answers nine common questions as a disclosure list.
  - **success:** From the footer "FAQ" link, the `#faq` heading lands fully visible (AC-NAV-5); nine questions use native `<details>`/`<summary>`; mouse, Enter or Space open and close each; several can be open at once (FR-46, UX-DR27).
- **CAP-3**
  - **intent:** The data-security answer is honestly marked.
  - **success:** The answer to "How do you keep our data secure?" starts with `[Placeholder]`.
- **CAP-4**
  - **intent:** The six core values show in the office-banner wording.
  - **success:** From the footer "Core values" link, the `#values` heading lands fully visible (AC-NAV-5); a 3 x 2 grid shows Startup Spirit, Client Centricity, Integrity First, Innovation Driven, "Get IT Done" Attitude (featured amber cell), People-Centered Culture (UX-DR23).
- **CAP-5**
  - **intent:** The page names no people.
  - **success:** No leadership section (no photos, names or titles) and no names from the old site (FR-29).
- **CAP-6**
  - **intent:** The navy offices section shows each office with its live time.
  - **success:** Each office card shows live local time from the Story 5.1 clock module, the address and a `tel:` link (FR-30, UX-DR19).
- **CAP-7**
  - **intent:** Stats and capture use the About wording.
  - **success:** The stats band's fourth figure is "4 School products ready to demo", marked `[Placeholder]` unless Amber confirms it by the build day (A2); the amber demo capture reads "See our apps in action." with "Leave your work email and we'll arrange a walkthrough of PXP, LXP and SXP." and "Book a demo".

## Constraints

- Stories 2.4 (capture band), 3.3 (stats component) and 5.1 (clock module) must be merged first. The build plan lists 3.3 and 5.1; epics add 2.4; the union is used.
- Stats use the static figures of the 3.3 slice. Office addresses and phone numbers are the verified ones in EXPERIENCE.md (also used by the Story 1.5 footer).
- Sammy owns `src/app/about/page.tsx` and its sections. Andy owns `src/app/layout.tsx`, `globals.css` `@theme`, `src/components/layout/*`.
- Next.js 16 App Router, Server Components by default. Read `node_modules/next/dist/docs/` before using a Next.js API.
- Tailwind v4 tokens from Story 1.1. Port the prototype, do not redesign.
- Route has no `/en` or `/vi` prefix (Story 1.2 is after demo); keep copy in a form that can be translated later.
- Definition of Done from `CLAUDE.md`: 100% changed-line and 80% branch coverage, smoke, lint, typecheck, build, local Sonar gate, `bmad-code-review`.

## Non-goals

- FAQPage structured data (after demo).
- Vietnamese FAQ and all Vietnamese copy, including `/vi/about` (Story 1.2, after demo).
- Leadership section (FR-29, removed 2026-09-29).
- Stats count-up (Story 3.3, after demo).

## Success signal

- On https://xiontech-dev.vercel.app/, a reviewer clicks the footer "FAQ" and "Core values" links and lands on `/about#faq` and `/about#values` with the headings visible, opens two FAQ answers at once with the keyboard, and sees both office cards showing live times.

## Open Questions

- (A2, owner Amber) Confirm the fourth About stat "4 School products ready to demo" (replacing "8 Service offerings") by build day 2026-10-07; without confirmation it ships marked `[Placeholder]`.
