---
id: SPEC-6-6-job-page-cv-upload
owner: Andy
build_day: 2026-10-07
depends_on: ["1.7", "1.8", "2.3", "6.5"]
companions:
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/EXPERIENCE.md
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/DESIGN.md
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/mockups/site-v3/job.html
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/mockups/site-v3/css/site.css
  - ../../../../docs/spikes/cms-spike.md
  - ../../decisions-2026-10-01.md
sources:
  - ../../../planning-artifacts/epics.md
  - ../../../planning-artifacts/prds/prd-XionTech-LandingPage-2026-09-28/prd.md
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# Story 6.6: Job page and application with CV upload

## Why

Nam, a QA engineer, should read a role in full and apply with his CV in one short form on the same page (Flow 4). Careers with job pages and CV upload is a Demo-day must-have (scope decided 2026-09-29), and the site becomes the real company site after Demo day, so applications must really reach XionTechs.

## Capabilities

- **CAP-1**
  - **intent:** A visitor reads one open role on its own page.
  - **success:** `/careers/[slug]` for an open role shows breadcrumbs Home / Careers / job title, H1 job title, team, location and work type, "About the role", "What you'll do", "What you bring", and "All open roles" linking `/careers#roles`; the "Apply for this role" form sits beside the details and below them at 900px and below; there is no email capture band (FR-47).
- **CAP-2**
  - **intent:** The form tells the visitor exactly what to fix before sending.
  - **success:** Fields: Full name (required), Email (required, valid), Phone (optional, telephone keypad), CV (required, `.pdf`/`.doc`/`.docx`, up to 5 MB), Cover note (optional, up to 2,000 characters). Missing name, invalid email, missing/wrong/too-large CV or a long note show "Please enter your name.", "Please enter a valid email address.", "Please upload your CV as a PDF or Word file, up to 5 MB.", "Please keep your note under 2,000 characters."; each invalid field gets `aria-invalid="true"` and `aria-describedby` to its error, errors are announced, focus moves to the first invalid field (AC-A11Y-5). A wrong or too-large CV is flagged as soon as it is chosen.
- **CAP-3**
  - **intent:** The visitor always knows what happened to the application.
  - **success:** While sending, the button is disabled and reads "Sending..."; on success the form is replaced by "Thank you!" and "We've received your application and will be in touch if it's a match." in a `role="status"` panel; on failure every value, including the chosen CV, is kept and an error with a retry shows above the button.
- **CAP-4**
  - **intent:** Every valid application reaches XionTechs, the CV stays private, and spam is stopped on the server.
  - **success:** The CV uploads straight from the browser to a private Vercel Blob store, and the server refuses any other file type or a file over 5 MB (T1). The server repeats every other client check, rejects a filled honeypot and applies the FR-38 rate limit (5 per 10 minutes per IP plus email). A valid application is sent by the Story 2.3 mail sender, naming the role and the stored CV (T4). Nothing is stored in Sanity, the CV has no public URL, and no personal data appears in any URL (FR-38, FR-47, NFR-3). An invalid request is rejected with the client wording.
- **CAP-5**
  - **intent:** The visitor sees why the data is collected.
  - **success:** Under the form: "We only use your details and CV to consider your application." ending with a "Privacy policy" link to `/privacy` (FR-40).
- **CAP-6**
  - **intent:** A dead role link never shows a broken page.
  - **success:** An unknown or closed role slug renders the Story 1.7 Not found page with HTTP 404.

## Constraints

- Merged first: 1.7 (Not found), 1.8 (Sanity, `job` schema, tagged fetch helper), 2.3 (server validation, honeypot, rate limit, mail sender), 6.5 (role cards link here). Reuse the 2.3 server module and mail sender and the 2.2 field and error patterns; no second copy.
- Andy owns `src/lib/sanity/*`, `src/app/api/*` and `src/app/careers/[slug]/*` (T3); he also owns Story 6.5, whose role cards link here, so there is no hand-off with Sammy.
- Applications and CVs are never stored in Sanity: free datasets are public (T1). The Blob store token is server-only (never `NEXT_PUBLIC_*`), validated at startup, never logged. Logs must not contain applicant data.
- The free Blob store holds 1 GB on Hobby, about 200 CVs at 5 MB. Applications and CVs are kept with no time limit and the privacy policy (Story 2.1) says so (A4). Name the limit in the PR.
- Job content is read with this story's own GROQ query through the 1.8 tagged fetch helper; there is no content access module (T2). Sample roles start with `[Placeholder]`. Breadcrumbs use the simple prototype markup until Story 1.6.
- Next.js 16: page is a Server Component; only the form is `"use client"`. Read `node_modules/next/dist/docs/` for server actions or route handlers first: server action bodies are capped at 1 MB by default (`serverActions.bodySizeLimit`) and Vercel Function bodies at 4.5 MB, which is why the CV never passes through them (T1).
- No `/en` `/vi` prefixes; all strings in a form that can be translated later. Port `job.html`; do not redesign.
- Definition of Done from `CLAUDE.md` (100% changed lines, 80% branches, smoke, lint, local Sonar gate, `bmad-code-review`).

## Non-goals

- Careers page and role cards: Story 6.5. Editor workflow for adding and closing roles: Story 6.3.
- Vietnamese strings and the VI date or labels: after demo (Story 1.2).
- Shared breadcrumbs component: Story 1.6. Per-page metadata and Open Graph: Story 7.1.

## Success signal

- On https://xiontech-dev.vercel.app a reviewer opens a `[Placeholder]` role from `/careers`, picks a 6 MB file and sees the CV error at once, sends a valid PDF and sees "Thank you!", then the application mail for that role reaches the inbox, its CV is in the private Blob store and does not open from a public URL, and nothing new is in Sanity; `/careers/no-such-role` returns the 404 page.

## Assumptions

- 5 MB means 5 × 1024 × 1024 bytes; the server checks both extension and MIME type (`application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`).
- "Closed" is a state defined by the Story 1.8 `job` schema; this story reads it.
- Applications go to the Story 2.3 contact inbox (server configuration); T4 names only the shared sender.

## Open Questions

- How does the inbox reader open a CV kept in the private Blob store, without the application mail making it public?
- How does an applicant ask for their application and CV to be deleted? Owner: Amber (A4); the privacy policy must say.
