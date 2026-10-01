---
id: SPEC-1-8-sanity-setup
owner: Andy
build_day: 2026-10-03
depends_on: ["1.1"]
companions:
  - ../../../../docs/spikes/cms-spike.md
  - ../../decisions-2026-10-01.md
sources:
  - ../../../planning-artifacts/epics.md
  - ../../../planning-artifacts/prds/prd-XionTech-LandingPage-2026-09-28/prd.md
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# Story 1.8: Sanity setup

## Why

News stories and open roles must come from a CMS that editors use without a developer (FR-27, FR-32). Sanity was chosen on 2026-09-28, but the spike used a fake project ID, so real reads were never proven. Stories 3.7, 6.1, 6.2, 6.5, 6.6 and 6.3 are blocked until this lands (mandate: Demo day 2026-10-09). It must stay on the free plan.

## Capabilities

- **CAP-1**
  - **intent:** The site reads real content from a free Sanity project on the server.
  - **success:** With one `post` and one `job` document in the project, a server-side read returns both with real content (spike open work 1).
- **CAP-2**
  - **intent:** The Sanity connection is configured by environment and checked at build.
  - **success:** With `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` set locally and on Vercel, the site reads the dataset; with either missing, the build fails with a clear message instead of rendering empty pages.
- **CAP-3**
  - **intent:** Only our own sites can call Sanity from a browser.
  - **success:** Sanity CORS origins list localhost, the production domain, `xiontech-dev.vercel.app` and the preview URLs as exact origins; no wildcard origin has credentials.
- **CAP-4**
  - **intent:** Public reads stay cheap, and a publish shows on the site with no deploy.
  - **success:** Story and role reads go through one tagged fetch helper in `src/lib/sanity/*` with `useCdn: true` and tag-based caching (no `force-dynamic`); a Sanity webhook with a secret revalidates the tags on publish (FR-27); a webhook call without the right secret is rejected.
- **CAP-5**
  - **intent:** One document holds both languages of a story or role.
  - **success:** The `post` and `job` schemas use field-level translation (EN and VI fields in one document).
- **CAP-6**
  - **intent:** Editors have a Studio that does not weigh down the site.
  - **success:** The Studio is deployed free on `<name>.sanity.studio`, and the Next.js build does not include the Studio bundle or `styled-components`; `/studio` is the fallback only if hosting there fails.
- **CAP-7**
  - **intent:** Drafts stay private although the free dataset is public.
  - **success:** Published documents read without a token; a read of a `drafts.` document ID without a token returns nothing.
- **CAP-8**
  - **intent:** The Sanity packages add no unexplained high security findings.
  - **success:** After an upgrade or `overrides`, `npm audit` shows no high finding from the Sanity packages, or the PR records why each remaining one is accepted (T7, spike open work 6).

## Constraints

- Depends on 1.1. Must merge by about day 4.5 so Sammy can start 6.5 and 6.1.
- Free plan only: 10,000 documents per dataset, 250k API and 1M CDN requests per month, public datasets. Name any limit that would force a paid plan.
- Andy owns `src/lib/sanity/*` and `src/app/api/*`. 1.8 provides the client and one tagged fetch helper; each page story writes its own GROQ query with it. There is no content access module story (T2).
- Sanity holds content only (posts, job posts). Job applications and CVs are never stored in Sanity, because free datasets are public; CVs go to a private Vercel Blob store in Story 6.6 (T1).
- Hoang Vu, the Demo-day editor, has a Sanity account invited to the project (A5; free plan allows 20 users).
- The webhook secret is a server-only environment variable, never `NEXT_PUBLIC_*`, never in source or logs. Validate required configuration at startup.
- Next.js 16: read `node_modules/next/dist/docs/` for caching, tags and revalidation before writing code.
- Seed content is real or starts with `[Placeholder]` (news titles and roles are `[Placeholder]` on Demo day).
- Definition of Done per CLAUDE.md (unit tests 100% changed lines, 80% branch, smoke, lint, local Sonar gate, `bmad-code-review`).

## Non-goals

- News, story, careers and job pages, image URL builder, generated types (spike open work 5): Stories 3.7, 6.1, 6.2, 6.5, 6.6.
- Editor publishing workflow and media uploads (AC-FORM-3): Story 6.3.
- Any job application or CV schema: none in Sanity (T1); CV storage is Story 6.6.
- Draft mode and visual editing (spike open work 8).
- Vietnamese content entry: after demo.

## Success signal

- Hoang Vu, the Demo-day editor, publishes a change to the sample `post` in the hosted Studio from his own Sanity account, and within a short time the server read on https://xiontech-dev.vercel.app returns the new text with no redeploy.

## Assumptions

- Field-level translation, because document-level translation doubles the document count against the 10,000 limit (spike left the choice open).
- Studio hosted on `<name>.sanity.studio` (spike named both options without choosing).
- Until pages from 3.7 and 6.x exist, the proof of reads is a server-side test or a minimal check, not a public page.

## Open Questions

- What happens at the Sanity free-plan limit is not on the pricing page; the spike says to check before demo. Who checks?
