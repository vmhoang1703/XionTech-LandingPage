---
title: 'Story 6.5: Careers page and open roles'
type: 'feature'
created: '2026-10-03'
status: 'draft'
route: 'dispatch'
review_loop_iteration: 0
context: ['{project-root}/AGENTS.md']
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** There is no `/careers` page. Nam, a QA engineer (Flow 4), cannot see the culture, the benefits or the open roles, and editors cannot publish roles or team photos without a developer. Contract: `_bmad-output/specs/andy/spec-6-5-careers-open-roles/SPEC.md` (CAP-1…CAP-4).

**Approach:** A Server Component page at `src/app/careers/page.tsx` that ports `careers.html` (amber hero, `#cul-h`, `#ben-h`, `#roles`, `#life`) with static copy in `src/content/careers.ts`, and reads open roles and `#life` photos with this story's own GROQ queries through the Story 1.8 `sanityFetch` helper (T2). Role cards link to `/careers/[slug]` (Story 6.6).

## Boundaries & Constraints

**Always:**
- Reads on the server only, through `sanityFetch` (`useCdn: true`, published perspective, `force-cache` + tags); never `force-dynamic`, no second client.
- Every role card is one `<a>` to `/careers/<slug>` with title, then team · location · work type, then "View and apply"; nothing interactive inside (FR-32, AC-A11Y-4).
- Zero roles → "No open roles right now." and no invented role (CAP-3). A missing `#life` photo → placeholder frame with a `[Placeholder]` caption (CAP-4).
- No email capture band, no talent-network sign-up on this page (FR-31, FR-33 exception).
- Copy in `src/content/careers.ts` (translatable later); English only; no `/en` `/vi` prefix. Brand in copy, titles and alt text is "XionTech" (AGENTS.md), so the mockup's "Life at XionTechs" ships as "Life at XionTech".
- Port the prototype with the Story 1.1 tokens and the existing `globals.css` classes (`hero-amber`, `page-hero`, `crumbs`, `list-check`, `svc-grid`, `spot`); add only the classes the page needs (`.roles`, `.role`, `.illo`, life grid).

**Never:** the job page, application form or CV upload (Story 6.6, T1); anything private in Sanity; editor workflow or webhook proof in the Studio (Story 6.3); Vietnamese copy (Story 1.2); a redesign of the prototype.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| Roles published | 3 published `job` docs with slug | 3 cards, each one link to `/careers/<slug>`, sorted by title | N/A |
| No roles | query returns `[]` | "No open roles right now." panel, no card | N/A |
| Role without slug or title | doc missing `slug.current` or `title.en` | that doc is skipped (no dead link) | N/A |
| Role without team/location/type | missing meta field | the missing part is left out of the meta line, no stray " · " | N/A |
| Photos | 3 photos with image URL and alt | 3 images in the `#life` frames | N/A |
| Fewer photos | 0–2 photos | remaining frames show the placeholder frame with a `[Placeholder]` caption | N/A |
| Sanity error | `sanityFetch` throws | error propagates (Next.js error page); not swallowed | logged by Next.js with the tag context |

</frozen-after-approval>

## Open Questions

1. **The `job` schema has no `slug` and no `team` field** (`studio/schemas/job.ts`), but CAP-2 needs both (card meta "Engineering · Ho Chi Minh City · Full-time" and the link to `/careers/[slug]`). The one seeded role (`[Placeholder] Sample job`) has neither. Options:
   - **A — add them here:** `slug` (type `slug`, source `title.en`) and `team` (localized string) in `studio/schemas/job.ts` + schema test. The lead then runs `cd studio && npx sanity deploy` and fills slug and team on the sample roles. "Open" = published; closing a role = unpublish or delete (no `closed` field; Story 6.6 assumes a "closed" state, so it would read "not published" as closed).
   - **B — A plus a `closed` boolean** now, so 6.6 and 6.3 have an explicit state; the query filters `closed != true`.
   - **C — no schema change:** slug from `_id`, no team on the card. Departs from CAP-2 and the mockup; URLs are unreadable ids.
2. **Who adds the Life at XionTech photo schema** (the SPEC's own open question; Story 1.8 has only `post` and `job`; Story 6.3 CAP-3 is "editor manages team and office photos" but 6.3 is first on the cut list). Options:
   - **A — this story:** a `lifePhoto` document (image with hotspot, required alt text, caption, order 1–3) in `studio/schemas/`, a new fetch tag `life` (adds to `SanityTag` in `src/lib/sanity/client.ts` and to `ALLOWED_TYPES` in `src/app/api/revalidate/route.ts`, both Story 1.8 code), `images.remotePatterns` for `https://cdn.sanity.io/images/1khn3hf4/production/**` in `next.config.ts`. Lead steps after merge: `npx sanity deploy`, change the webhook filter in sanity.io/manage to `_type in ["post", "job", "lifePhoto"]`, upload real photos. Bigger footprint; touches shared 1.8 files.
   - **B — Story 6.3 adds it:** this story ships the three `#life` frames as `[Placeholder]` frames only (no photo query). CAP-4 photos come only if 6.3 is built; if 6.3 is cut, Demo day shows placeholders.
   - **C — photos in the repo** (`public/careers/*`), not Sanity. Editors would need a developer to change them; departs from CAP-4 and T1's "Sanity holds … Life at XionTechs photos".
3. **The culture section's right-hand photo** (`.illo`, "[Placeholder] Photo") is not in CAP-4's three frames. Plan: ship it as a static `[Placeholder]` frame (as the mockup does). Say if it should also come from Sanity.

## Code Map

- `src/lib/sanity/client.ts` -- `sanityFetch<T>({ query, params, tags })`, `SanityTag = "post" | "job"`; reuse, do not add a second client.
- `src/app/api/revalidate/route.ts` -- `ALLOWED_TYPES` derived from `SanityTag`; only changes under Q2-A.
- `studio/schemas/job.ts`, `studio/schemas/index.ts`, `studio/schemas/localized.ts`, `studio/schemas/schemas.test.ts` -- job fields today: `title`/`location`/`description` (localized), `type` (full-time, part-time, contract, internship). Schema test asserts EN/VI pairs and no CV field.
- `src/app/products/page.tsx`, `src/components/products/products-hero.tsx`, `src/content/products.ts` -- pattern to copy: page + `metadata`, hero with `hero-amber page-hero`, `crumbs`, `.hl`, `btn btn-navy`, Phosphor `@phosphor-icons/react/ssr` icons, copy in `src/content/*`.
- `src/app/globals.css` -- `hero-amber` (253, 428, 475), `list-check` (640), `spot` (1408), `svc-grid` (1624); no `.roles`/`.role`/`.illo` yet. Port from mockup `css/site.css`.
- `_bmad-output/planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/mockups/site-v3/careers.html` -- markup to port (hero CTAs `#roles` navy + `#life` glass; three culture bullets; four benefits with icons cpu, graduation-cap, sparkle, heart; `.roles` list; three 4:3 `#life` frames "Team photo", "Office photo", "Event photo", 1200 × 900).
- `e2e/products.spec.ts` -- pattern for the new `@smoke` test (`request.get`, status 200, HTML contains).
- `src/app/layout.tsx` -- header and footer are already mounted; the page renders only `<main>` content.

## Tasks & Acceptance

Final task list is written after the Open Questions are answered. Expected shape:

**Execution:**
- [ ] `src/content/careers.ts` -- hero, culture, benefits, roles and life copy; "XionTech" brand.
- [ ] `src/lib/careers/queries.ts` (+ test) -- GROQ for open roles (and `#life` photos under Q2-A) through `sanityFetch` with tags; map docs to card props, skip docs without slug/title -- CAP-2, CAP-3, CAP-4.
  - red: `src/lib/careers/queries.test.ts` -- query uses tag `job`; docs without slug are dropped; meta line omits missing parts.
- [ ] `src/components/careers/*` -- `CareersHero`, `RoleCards` (empty state), `LifeFrames` (photo or `[Placeholder]` frame) -- CAP-1…CAP-4.
  - red: component tests -- one link per card to `/careers/<slug>` with no nested interactive element; zero roles shows "No open roles right now."; missing photo shows `[Placeholder]` caption.
- [ ] `src/app/careers/page.tsx` (+ test) -- Server Component, `metadata`, sections in mockup order, no capture band -- CAP-1.
- [ ] `src/app/globals.css` -- `.roles`, `.role`, `.illo`, life frame styles ported from `site.css`.
- [ ] Schema / tag / config tasks per Q1 and Q2 answers.
- [ ] `e2e/careers.spec.ts` -- `@smoke`: `/careers` returns 200 with the H1 and `id="roles"` / `id="life"`.

**Acceptance Criteria:**
- Given `/careers`, when it loads, then the amber hero reads "Build what schools use every day." with "See open roles" → `#roles` and "Life at XionTech" → `#life`, followed by culture, four benefits, open roles and Life at XionTech, and no capture band.
- Given the controller runs `npm run build && npm run test:smoke` in the main checkout, then `/careers` returns 200 (pending, controller).

## Implementation Notes

## Spec Change Log

## Review Triage Log

## Verification

**Commands:**
- `npm run lint && npm run typecheck && npm run format:check` -- expected: no errors
- `npm test` -- expected: all pass
- `npm run test:coverage && npm run coverage:diff` -- expected: 100% changed lines, branches ≥ 80% on changed files
- `npm run build && npm run test:smoke` -- pending (controller, main checkout)

**Manual checks:**
- Browser walk of `/careers` at 1280px and 390px, keyboard through hero CTAs and role cards -- pending (controller).
