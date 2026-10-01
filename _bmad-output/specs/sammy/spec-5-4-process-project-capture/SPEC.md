---
id: SPEC-5-4-process-project-capture
owner: Sammy
build_day: 2026-10-06
depends_on: ["3.6", "2.4", "5.1"]
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

# Story 5.4 4-D process at #process and project capture

## Why

Opportunity. Quân, ready to start (Flow 2), follows "See our 4-D process" and then starts a project from the same page, without searching. This story places two finished components on `/services`. Design reference: `services.html#process` and the amber capture (`data-mode="project"`, "Tell us what you're building.").

## Capabilities

- **CAP-1**
  - **intent:** The Story 3.6 4-D component sits on a navy band at `#process`, and the links to it land correctly.
  - **success:** Following "See our 4-D process" (hero) or "See the process" (Services mega menu) lands the heading fully visible (AC-NAV-5, FR-6); above 1080px the "You receive" rows align across the four cards (AC-UI-2, FR-23).
- **CAP-2**
  - **intent:** The amber project capture lets Quân start a project with only his work email.
  - **success:** Submitting a valid work email in "Tell us what you're building." opens `/demo#project` on the Outsourcing project tab, scrolled to the form, with the email prefilled (AC-FORM-2, FR-34).
- **CAP-3**
  - **intent:** The Services page keeps its colour rhythm.
  - **success:** `/services` has the navy hero, the navy 4-D band and exactly one amber band (the capture).

## Constraints

- Stories 3.6 (4-D component), 2.4 (capture band) and 5.1 (the `/services` page) must be merged first. The build plan lists 3.6 and 2.4; epics add 5.1; the union is used.
- This story only places the components. Capture validation, sending states, session-storage prefill and the redirect belong to Story 2.4 (Andy); the component animation belongs to Story 3.6.
- Sammy owns `src/app/services/page.tsx` and its sections. Andy owns `src/app/layout.tsx`, `globals.css` `@theme`, `src/components/layout/*`.
- Next.js 16 App Router, Server Components by default. Read `node_modules/next/dist/docs/` before using a Next.js API.
- Tailwind v4 tokens from Story 1.1. Port the prototype, do not redesign.
- Route has no `/en` or `/vi` prefix (Story 1.2 is after demo); keep copy in a form that can be translated later.
- Definition of Done from `CLAUDE.md`: 100% changed-line and 80% branch coverage, smoke, lint, typecheck, build, local Sonar gate, `bmad-code-review`.

## Non-goals

- The travelling dot in the 4-D flow (Story 3.6 slice, after demo).
- Capture component behaviour, `/demo` form and Submission delivery (Stories 2.2, 2.3, 2.4).
- Three ways to work and industries (Story 5.3, after demo).
- Vietnamese copy (Story 1.2, after demo).

## Success signal

- On https://xiontech-dev.vercel.app/services, a reviewer clicks "See our 4-D process", sees the `#process` heading below the header with aligned "You receive" rows, then enters a work email in the amber capture and lands on `/demo#project`, Outsourcing tab, email filled in.
