---
id: SPEC-6-3-editors-publish-sanity
owner: Andy
build_day: 2026-10-07
depends_on: ["1.8", "3.7"]
companions:
  - ../../../../docs/spikes/cms-spike.md
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/EXPERIENCE.md
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/mockups/site-v3/news-story.html
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/mockups/site-v3/careers.html
  - ../../decisions-2026-10-01.md
sources:
  - ../../../planning-artifacts/epics.md
  - ../../../planning-artifacts/prds/prd-XionTech-LandingPage-2026-09-28/prd.md
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# Story 6.3: Editors publish stories and roles without a developer (Demo-day slice)

## Why

After Demo day the site is the real company site, so news and hiring must stay current without a developer or a deploy. An editor (Hoang Vu on Demo day; non-developers after it) publishes in Sanity Studio and the change reaches the site through the 1.8 webhook and each page's own query on the 1.8 tagged fetch helper. This story proves that path end to end for every content type Demo day uses.

## Capabilities

- **CAP-1**
  - **intent:** An editor publishes news stories without a developer.
  - **success:** An editor creates, edits, publishes or unpublishes a story with English fields in Studio; after the webhook revalidates its tags, the change shows on `/news`, `/news/[slug]` and Home latest news through each page's GROQ query on the 1.8 tagged fetch helper, with no code change and no deploy (FR-27).
- **CAP-2**
  - **intent:** An editor opens and closes roles without a developer.
  - **success:** An editor adds, edits or closes a role in Studio and `/careers` and `/careers/[slug]` update the same way; after the last open role is closed, Careers shows the Open roles panel "No open roles right now." and the closed role's page is Not found (FR-32).
- **CAP-3**
  - **intent:** An editor manages team and office photos.
  - **success:** Photos uploaded or replaced in Studio show in the Careers `#life` frames after revalidation; a missing photo keeps its `[Placeholder]` frame.
- **CAP-4**
  - **intent:** An editor can upload product clips ahead of their display.
  - **success:** Each product has a clip field in Studio; an uploaded clip is stored in the dataset and readable with the 1.8 tagged fetch helper for Story 4.4.
- **CAP-5**
  - **intent:** Media uploads never change the wrong item.
  - **success:** In Studio image fields an upload or paste changes only the item the editor selected, never a previously hovered one (AC-FORM-3); checked by hand in Studio and recorded in the PR, since Studio is Sanity's code and we own only the schema.

## Constraints

- Merged first: 1.8 (Sanity project, Studio location, webhook with secret, tag revalidation, tagged fetch helper) and 3.7 (Home latest news). There is no content access module: each page story writes its own GROQ query with the 1.8 helper (T2). Do not add a second fetch path or `force-dynamic`.
- Andy owns `src/lib/sanity/*` and `src/app/api/*`. Page rendering stays in the page stories (3.7, 6.1, 6.2, 6.5, 6.6); this story only adds schema fields, tags and wiring.
- Studio stays out of the Next.js build if it is hosted on `<name>.sanity.studio` (1.8 assumption).
- Sanity free plan: 10,000 documents per dataset, 100 GB assets, 20 users, 250k API and 1M CDN requests per month; datasets are public, so no private data is entered as content.
- Hoang Vu is the Demo-day editor; his Sanity account is invited to the project (A5).
- Content is real or starts with `[Placeholder]`; Demo-day stories and roles use `[Placeholder]` titles.
- Cut order: if the lead closes the capacity gap by cuts, this story drops first and content is entered through the Studio defaults.
- Definition of Done from `CLAUDE.md` (100% changed lines, 80% branches, smoke, lint, local Sonar gate, `bmad-code-review`).

## Non-goals

- Vietnamese fields: after demo (with Story 1.2).
- Showing product clips in device frames: Story 4.4, after demo. Products `#updates` and every link to it: hidden on Demo day; Story 4.5 adds them back (T5), so no product-update content here.
- Sanity project, Studio hosting, CORS and the webhook itself: Story 1.8.
- Rendering News, story, Careers and job pages: Stories 3.7, 6.1, 6.2, 6.5, 6.6.
- Draft mode and visual editing (spike item 8).

## Success signal

- In a live review, Hoang Vu publishes a new `[Placeholder]` story and closes a role in Studio; without a deploy, the story appears on https://xiontech-dev.vercel.app/news and Home, and the role disappears from `/careers`.

## Assumptions

- Editors after Demo day are non-developers (PRD FR-27 assumption), so schema fields carry clear titles and validation.

## Open Questions

- The epic AC names product clips, but Story 4.4 is after demo. Confirm that on Demo day clips are upload-only and no page shows them (T5 settled `#updates` only).
