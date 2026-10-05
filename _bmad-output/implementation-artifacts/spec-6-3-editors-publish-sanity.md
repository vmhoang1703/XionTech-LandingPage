---
title: 'Story 6.3 Editors publish stories and roles without a developer'
type: 'feature'
created: '2026-10-05'
status: 'in-progress'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: 'edf34e09510fc3210f1f93686da35434a636db48'
context:
  - '{project-root}/AGENTS.md'
  - '{project-root}/docs/sanity.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Editors can already publish stories and roles, but nothing proves the path end to end, the Careers "Life at XionTech" frames are fixed `[Placeholder]` captions in code, and there is nowhere to upload product clips (SPEC `_bmad-output/specs/andy/spec-6-3-editors-publish-sanity/SPEC.md`, CAP-1 to CAP-5).

**Approach:** Add two Studio content types and wire them through the existing tagged fetch and webhook: a single "Careers photos" document with three fixed slots (team, office, event: photo, required alt text, caption) shown in the Careers `#life` frames, and four product documents (PXP, LXP, SXP, IoT) with an mp4 clip field that no page shows yet. Then prove CAP-1 and CAP-2 on the dev site with `[Test]` documents only, and check CAP-5 by hand in Studio.

Lead decisions (2026-10-05, the lead said "start to build" on these defaults): D1 one singleton document with three slots; D3 clips are upload only (Story 4.4 shows them after demo); D6 no consented team photos yet, so every slot stays a `[Placeholder]` frame until the lead uploads one. A9 (real posts) and A11 (API reads skip the CDN; never `force-dynamic`, `no-store` or a time-based `revalidate`) apply.

## Boundaries & Constraints

**Always:** reads go through `sanityFetch` with a tag; the webhook stays signed and only accepts known types; an empty or failed photo read shows the `[Placeholder]` frame, never a broken image and never a page error; every published image has alt text; `[Test]` documents only for the live proof, deleted afterwards.

**Never:** touch the real job, the three real posts or their slugs; show clips on any page; store personal data other than consented photos (datasets are public); add a second fetch path, a new npm dependency or Vercel image optimization (images are `unoptimized`, resized by Sanity URL parameters).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| No photos document | Sanity has no `careersPhotos` | three `[Placeholder]` frames as today | N/A |
| Some slots filled | team photo with alt, office empty | team frame shows the photo (alt text, caption), office and event keep `[Placeholder]` | N/A |
| Photo without alt | Studio publish | Studio blocks publish: "Describe the photo for screen readers." | validation |
| Sanity read fails | fetch throws | three `[Placeholder]` frames; one log line naming the step | logged, page renders |
| Photo published | webhook `_type: careersPhotos` | tag `careersPhotos` revalidated, `/careers` shows it | 400 for unknown types stays |
| Clip uploaded | product doc with mp4 | stored and readable by GROQ; no page changes | N/A |

</frozen-after-approval>

## Code Map

- `src/lib/sanity/client.ts` -- `SanityTag` union (`post`, `job`); add `careersPhotos`, `product`.
- `src/app/api/revalidate/route.ts` -- `ALLOWED_TYPES`; webhook revalidates `revalidateTag(type, "max")`.
- `studio/schemas/{post,job,localized}.ts`, `index.ts`, `schemas.test.ts` -- schema style and tests to follow.
- `studio/sanity.config.ts` -- default `structureTool()`; becomes a custom structure with the two singletons.
- `src/components/careers/life-frames.tsx`, `src/content/careers.ts` (`careersLife.frames`), `careers.test.tsx` -- current fixed frames; `src/app/careers/page.tsx` renders `<LifeFrames />`.
- `src/lib/careers/open-roles.ts` -- GROQ + `sanityFetch` pattern; `src/components/news/home-news.tsx` -- the log-and-fallback pattern.
- `next.config.ts` -- no `images` config yet; external `src` needs `remotePatterns`.
- `docs/sanity.md` -- editor and webhook steps (filter today `_type in ["post", "job"]`).

## Tasks & Acceptance

**Execution:**
- [x] `studio/schemas/careers-photos.ts`, `studio/schemas/product.ts`, `index.ts`, `schemas.test.ts` -- the two types with titles, descriptions and validation (alt required when a photo is set; clip accepts `video/mp4`) -- CAP-3, CAP-4.
  - red: `schemas.test.ts` -- the new types and their fields and validation are missing.
- [x] `studio/sanity.config.ts` -- structure: "Careers photos" (one document, id `careersPhotos`), "Products" (four documents, ids `product-pxp` ... `product-iot`), then News posts and Job openings; no create, duplicate or delete for the singletons -- CAP-3, CAP-4, CAP-5.
- [x] `src/lib/sanity/client.ts`, `src/app/api/revalidate/route.ts` + test -- new tags accepted by the webhook -- CAP-3.
  - red: `route.test.ts` -- a signed `careersPhotos` or `product` body answers 400.
- [x] `src/lib/careers/life-photos.ts` + test -- `getLifePhotos()`: GROQ on `_id == "careersPhotos"`, per slot `url` (`asset->url`), width, height, alt, caption; tag `careersPhotos`; null on failure with one log line -- CAP-3.
  - red: `life-photos.test.ts` -- the function does not exist.
- [x] `src/components/careers/life-frames.tsx`, `src/app/careers/page.tsx`, `src/content/careers.ts`, `next.config.ts` + tests -- a slot with a photo shows `next/image` (`unoptimized`, `?w=800&auto=format`, alt, caption); an empty slot keeps its `[Placeholder]` frame -- CAP-3.
  - red: `careers.test.tsx` -- a photo slot still renders the placeholder.
- [ ] `docs/sanity.md` -- editor guide (publish, unpublish, close a role, photos, clips) and the webhook filter `_type in ["post", "job", "careersPhotos", "product"]` -- CAP-1..5.
- [ ] Live proof (after merge, lead approves each Sanity change): a `[Test]` story and a `[Test]` role published, edited, unpublished or closed on the dev site; CAP-5 checked by hand in Studio; test documents deleted -- CAP-1, CAP-2, CAP-5.

**Acceptance Criteria:**
- Given the Studio, when an editor opens it, then "Careers photos" and the four products open one fixed document each, and News posts and Job openings work as before.
- Given a published team photo, when `/careers` is visited after the webhook, then the team frame shows it with its alt text and caption, and the other frames stay `[Placeholder]`.
- Given the dev site, when the lead publishes and then unpublishes a `[Test]` story and closes a `[Test]` role, then `/news`, Home and `/careers` follow with no deploy.

## UX checks

Sources: SPEC CAP-3, `EXPERIENCE.md` (Careers `#life`, placeholder frame), `DESIGN.md` (media frame), T9.

| Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| --- | --- | --- | --- | --- | --- | --- |
| Life frame | no photo | — | `[Placeholder]` frame with its caption, as today | — | CAP-3, A8 | |
| Life frame | photo set | — | photo fills the 4:3 frame (cover), caption below, alt text on the image | — | CAP-3, DESIGN.md media frame | |
| Life frames | width 640px or less | — | one column, no sideways scroll | — | EXPERIENCE.md Responsive | |
| Studio | open | mouse | "Careers photos" and "Products" open one fixed document each; no "create new" for them | — | CAP-3, CAP-4 | |
| Studio | upload or paste an image | mouse, keyboard | only the selected slot changes | — | CAP-5 (AC-FORM-3) | |

## Design Notes

- Image URL: `asset->url` returns `https://cdn.sanity.io/images/<project>/<dataset>/<file>`; adding `?w=800&auto=format` makes Sanity resize it, so no Vercel image quota is used. `remotePatterns` allows only `cdn.sanity.io/images/1khn3hf4/**`.
- The webhook filter in Sanity Manage is set by hand (the lead); until then new photos show after the next deploy.

## Verification

**Commands:**
- `npm run lint && npm run typecheck && npm run format:check` -- expected: pass
- `npm run test:coverage -- --maxWorkers=3 && npm run coverage:diff` -- expected: all pass, 100% changed lines, C1 ok
- `npm run build && npm run test:smoke` -- expected: pass
- `cd studio && npx sanity schema validate` (or `npx sanity build`) -- expected: no schema errors

**Manual checks:**
- Studio after deploy: singletons as above; CAP-5 upload check. Dev site: the live proof rows.

## Implementation Notes

## Spec Change Log

## Review Triage Log
