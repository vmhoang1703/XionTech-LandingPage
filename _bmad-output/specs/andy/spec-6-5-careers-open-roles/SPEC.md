---
id: SPEC-6-5-careers-open-roles
owner: Andy
build_day: 2026-10-04
depends_on: ["1.8"]
companions:
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/DESIGN.md
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/EXPERIENCE.md
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/mockups/site-v3/careers.html
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/mockups/site-v3/css/site.css
  - ../../../../docs/spikes/cms-spike.md
  - ../../decisions-2026-10-01.md
sources:
  - ../../../planning-artifacts/epics.md
  - ../../../planning-artifacts/prds/prd-XionTech-LandingPage-2026-09-28/prd.md
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# Story 6.5 Careers page and open roles

## Why

Opportunity. Nam, a QA engineer (Flow 4), wants to see the culture and the open roles, pick one and read it in full. Roles and photos come from Sanity so editors can change them without a developer. Design reference: `careers.html` hero, `#cul-h`, `#ben-h`, `#roles` (`.roles`, `.role`), `#life`.

## Capabilities

- **CAP-1**
  - **intent:** `/careers` presents culture, benefits, open roles and Life at XionTechs under an amber hero.
  - **success:** Amber hero "Build what schools use every day." with "See open roles" (to `#roles`) and "Life at XionTechs" (to `#life`), then culture, four benefits (Innovative workspace, Growth opportunities, Engaging work, Meaningful impact), open roles and Life at XionTechs. No email capture band and no talent-network sign-up (FR-31, FR-33 exception).
- **CAP-2**
  - **intent:** Each open role in Sanity is shown as a card that opens its job page.
  - **success:** Each card shows job title, then team, location, work type and "View and apply"; the whole card is one link to `/careers/[slug]` with nothing interactive inside (FR-32, AC-A11Y-4).
- **CAP-3**
  - **intent:** With no open roles, the page says so honestly.
  - **success:** With zero roles, "No open roles right now." shows and no invented role appears.
- **CAP-4**
  - **intent:** Team and office photos from Sanity fill the Life at XionTechs frames.
  - **success:** Photos show in the three `#life` frames; a missing photo shows a placeholder frame with a `[Placeholder]` caption.

## Constraints

- Story 1.8 (Sanity setup) must be merged first. Reads run on the server with the Sanity client and the one tagged fetch helper from Story 1.8 (`src/lib/sanity/*`, Andy owns it), with `useCdn: true` and tag-based caching, never `force-dynamic` (`cms-spike.md`). This story writes its own GROQ queries for open roles and `#life` photos, in its own files; there is no content access module (T2).
- Demo day may show sample roles whose titles start with `[Placeholder]` (FR-32). Sanity free plan: 10,000 documents, 250k API and 1M CDN requests per month.
- Demo-day Sanity content for this page (sample roles, `#life` photos) is entered by the Demo-day editor, Hoang Vu (Andy), who needs a Sanity account invited to the project (free plan: 20 users) (A5).
- This page reads public content only. Job applications and CVs go to a private Vercel Blob store in Story 6.6, never to Sanity (free datasets are public) (T1).
- Andy owns `src/app/careers/page.tsx`, its sections and `src/app/careers/[slug]/*`, the Story 6.6 job page, which depends on this story (T3).
- Next.js 16 App Router, Server Components by default. Read `node_modules/next/dist/docs/` before using a Next.js API.
- Tailwind v4 tokens from Story 1.1. Port the prototype, do not redesign.
- Route has no `/en` or `/vi` prefix (Story 1.2 is after demo); keep copy in a form that can be translated later.
- Definition of Done from `CLAUDE.md`: 100% changed-line and 80% branch coverage, smoke, lint, typecheck, build, local Sonar gate, `bmad-code-review`.

## Non-goals

- Job page, application form and CV upload to the private Vercel Blob store (Story 6.6, T1).
- Editor workflow and webhook revalidation proof in the Studio (Story 6.3).
- Vietnamese copy (Story 1.2, after demo).

## Success signal

- On https://xiontech-dev.vercel.app/careers, a reviewer clicks "See open roles", sees `[Placeholder]` sample role cards from Sanity, clicks one card to reach `/careers/[slug]`, and sees `#life` photos or `[Placeholder]` frames.

## Assumptions

- T1 "Sanity holds job posts only" is read as: no applications or CVs in Sanity; public `#life` photos may still come from Sanity (CAP-4).

## Open Questions

- Story 1.8 defines only `post` and `job` schemas. Who adds the schema for Life at XionTechs photos: Story 1.8 (Andy) or this story?
