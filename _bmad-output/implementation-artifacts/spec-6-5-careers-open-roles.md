---
title: 'Story 6.5: Careers page and open roles'
type: 'feature'
created: '2026-10-03'
status: 'done'
baseline_commit: '8964d3c710d3da64d3458afe3052538b2ae3f93e'
route: 'dispatch'
review_loop_iteration: 0
context: ['{project-root}/AGENTS.md']
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** There is no `/careers` page. Nam, a QA engineer (Flow 4), cannot see the culture, the benefits or the open roles, and editors cannot publish roles without a developer. Contract: `_bmad-output/specs/andy/spec-6-5-careers-open-roles/SPEC.md` (CAP-1…CAP-4).

**Approach:** A Server Component page `src/app/careers/page.tsx` that ports `careers.html` (amber hero, `#cul-h`, `#ben-h`, `#roles`, `#life`) with copy in `src/content/careers.ts`. Open roles come from this story's own GROQ query through the Story 1.8 `sanityFetch` helper with tag `job` (T2). The `job` schema gains `slug`, `team` and `closed`. Role cards link to `/careers/[slug]` (Story 6.6).

## Boundaries & Constraints

**Always:**
- Reads on the server only, through `sanityFetch` (`useCdn: true`, published perspective, `force-cache`, tag `job`); never `force-dynamic`, no second client, no new tag.
- An open role = a published `job` with `closed != true` (lead, 2026-10-03, Q1-B).
- Every role card is one `<a>` to `/careers/<slug>`: title, then team · location · work type, then "View and apply"; nothing interactive inside (FR-32, AC-A11Y-4).
- Zero roles → open roles panel "No open roles right now." and no invented role (CAP-3).
- No email capture band, no talent-network sign-up (FR-31, FR-33 exception).
- Copy in `src/content/careers.ts`, English only, no `/en` `/vi` prefix. Brand is "XionTech" in copy, titles and alt text (AGENTS.md): the mockup's "Life at XionTechs" ships as "Life at XionTech" (decided).
- Port the prototype with Story 1.1 tokens and existing `globals.css` classes; add only `.roles`, `.role`, `.role-main`, `.roles-empty`, `.illo`, `.news-grid` (if missing), `.link-arrow`.
- Schema stays EN/VI field-level and has no application or CV field (T1).

**Never:** Life at XionTech photo schema, photo query, new fetch tag, webhook filter change or `next.config.ts` image host (Story 6.3, lead Q2-B); the job page, form or CV upload (Story 6.6); anything private in Sanity; Vietnamese copy (Story 1.2); a redesign.

**Decisions (lead, 2026-10-03):**
- Q1-B: add `slug` (type `slug`, source `title.en`, required), `team` (localized string) and `closed` (boolean, initial false) to `studio/schemas/job.ts`.
- Q2-B: the three `#life` frames ship as fixed placeholder frames with `[Placeholder]` captions; Story 6.3 adds the photo schema and query.
- Q3: the culture photo is a fixed `[Placeholder]` frame, as in the mockup.
- Post-merge lead steps: `cd studio && npx sanity deploy`; in the Studio fill slug and team on `[Placeholder] Sample job` and publish.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| Roles published | 3 open `job` docs with slug | 3 cards, sorted by title, each one link to `/careers/<slug>` | N/A |
| Closed role | `closed: true` | not shown | N/A |
| No roles | query returns `[]` | "No open roles right now." panel, no card | N/A |
| Role without slug or title | missing `slug.current` or `title.en` | not shown (no dead link) | N/A |
| Missing meta part | no team, location or known type | that part left out, no stray " · " | N/A |
| Sanity error | `sanityFetch` throws | error propagates to Next.js; not swallowed | message carries the `job` tag |

</frozen-after-approval>

## Code Map

- `src/lib/sanity/client.ts` -- `sanityFetch<T>({ query, params, tags })`, `SanityTag = "post" | "job"`; reuse, do not change.
- `studio/schemas/job.ts`, `studio/schemas/localized.ts`, `studio/schemas/schemas.test.ts` -- job today: `title`, `location`, `description` (localized), `type` (full-time, part-time, contract, internship). Test checks EN/VI pairs and no CV field; extend it.
- `src/app/products/page.tsx`, `src/components/products/products-hero.tsx`, `src/content/products.ts` -- pattern: `metadata` from content, `hero-amber page-hero`, `crumbs`, `.hl`, `btn btn-navy`, `@phosphor-icons/react/ssr`.
- `src/components/sections/hero-art.tsx` -- `HeroArt tone="amber"`, first child of the hero section (as in `src/app/demo/page.tsx`).
- `src/app/globals.css` -- has `btn-glass` (551), `split` (617), `list-check` (640), `sec-head` (1372), `linen` (1379), `spot` (1408), `svc-grid` / `.svc.feature` / `.svc.navy` (1624–1690); hover lifts sit in `@media (hover: hover)` (1252). No pointer-following glow exists in the codebase.
- Mockup `mockups/site-v3/careers.html` (markup) and `css/site.css` lines 65–67 (`.link-arrow`), 288/446/456 (`.news-grid`), 361–364 (`.illo`), 400 (`.roles-empty`), 572–585 (`.roles`, `.role`).
- `e2e/products.spec.ts` -- pattern for the `@smoke` test.
- `src/app/layout.tsx` -- header and footer are mounted; the page renders only its sections.

## Tasks & Acceptance

**Execution:**
- [x] `studio/schemas/job.ts` + `studio/schemas/schemas.test.ts` -- add `slug` (source `title.en`, required), `team` (localized string), `closed` (boolean, initial false) -- Q1-B.
  - red: `studio/schemas/schemas.test.ts` -- job has `slug`, `team` (EN/VI) and `closed` fields.
- [x] `src/lib/careers/open-roles.ts` + test -- GROQ `*[_type == "job" && closed != true && defined(slug.current) && defined(title.en)] | order(title.en asc)`, projected to `{ slug, title, team, location, type }`; `getOpenRoles()` calls `sanityFetch` with tags `["job"]`; `roleMeta()` maps type values to labels (`full-time` → "Full-time") and joins present parts with " · " -- CAP-2, CAP-3.
  - red: `src/lib/careers/open-roles.test.ts` -- fetch gets tag `job` and the closed/slug filter; meta omits missing parts and unknown types; a thrown fetch error propagates.
- [x] `src/content/careers.ts` -- metadata, hero, culture (3 bullets + `[Placeholder]` photo frame), 4 benefits, roles heading + empty text + "View and apply", life heading + 3 frame captions ("[Placeholder] Team photo", "[Placeholder] Office photo", "[Placeholder] Event photo") -- CAP-1, CAP-4.
- [x] `src/components/careers/careers-hero.tsx`, `culture.tsx`, `benefits.tsx`, `open-roles.tsx`, `life-frames.tsx` + tests -- Server Components; `OpenRoles` takes `roles` as a prop and renders cards or the empty panel -- CAP-1…CAP-4.
  - red: component tests -- each card is one link to `/careers/<slug>` with no nested link or button; `[]` shows "No open roles right now."; three `#life` frames with `[Placeholder]` captions; hero buttons point to `#roles` and `#life`.
- [x] `src/app/careers/page.tsx` + test -- async page: `metadata`, `await getOpenRoles()`, sections in mockup order, no capture band -- CAP-1.
  - red: `src/app/careers/page.test.tsx` -- renders the H1, `#roles`, `#life` and no capture band.
- [x] `src/app/globals.css` -- port `.roles`, `.role`, `.role-main`, `.roles-empty`, `.illo`, `.link-arrow`, life grid; hover only in `@media (hover: hover)`; no transition under reduced motion.
- [x] `e2e/careers.spec.ts` -- `@smoke`: `GET /careers` is 200 with the H1, `id="roles"` and `id="life"`.

**Acceptance Criteria:**
- Given `/careers`, when it loads, then the amber hero reads "Build what schools use every day." with "See open roles" → `#roles` and "Life at XionTech" → `#life`, then culture, four benefits (Innovative workspace, Growth opportunities, Engaging work, Meaningful impact), open roles and Life at XionTech, and no capture band.
- Given the controller runs `npm run build && npm run test:smoke` in the main checkout, then `/careers` returns 200 -- done: build passes, smoke 8 passed (controller).

## UX checks

Sources: `EXPERIENCE.md` (Component Patterns › Role card, Spotlight card, Media frame, Button, Focus ring; States; Responsive; Motion), `DESIGN.md` (Role card, Open roles panel, Placeholder frame, Button, section surfaces line 443), SPEC CAP IDs, lead decisions 2026-10-03.

| Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| --- | --- | --- | --- | --- | --- | --- |
| Hero | page load | — | amber hero, breadcrumbs Home / Careers, H1 "Build what schools use every day." with "every day" highlighted, lede, amber strand ribbon | ribbon 5s, then still | CAP-1, DESIGN.md 443, Story 1.6 HeroArt | ✅ Chrome 1280: amber hero, crumbs Home / Careers, H1 with "every day" highlighted, ribbon svg |
| Hero "See open roles" | click / Enter | mouse, keyboard | goes to `#roles`; navy pill with arrow | — | CAP-1, DESIGN.md Button | ✅ Chrome 1280: navy pill, click goes to `#roles` |
| Hero "Life at XionTech" | click / Enter | mouse, keyboard | goes to `#life`; glass pill | — | CAP-1, brand rule (AGENTS.md) | ✅ Chrome 1280: glass pill, Enter goes to `#life` |
| Hero buttons | hover | mouse | lift 2px | 0.35s | DESIGN.md Button | ✅ Chrome 1280: lifts 2px (transform 0.35s) |
| Hero buttons | press | mouse, touch | 1px down, scale 0.98 | — | DESIGN.md Button | not walked (shared `.btn:active` rule from Story 1.1) |
| Culture | page load | — | paper surface; H2 "A culture that goes beyond employment."; 3 check bullets; dashed "[Placeholder] Photo" frame on the right | — | CAP-1, Q3, DESIGN.md Placeholder frame | ✅ Chrome 1280: paper surface, H2, 3 check bullets, `[Placeholder] Photo` frame |
| Culture | width 900px or less | — | text and photo frame stack in one column | — | EXPERIENCE.md Responsive | ✅ Chrome: stacks below 900px (899 yes, 900 no; the site's shared `.split` switches at 900) |
| Benefits | page load | — | mist linen surface; "Why you'll grow here."; 4 cards with icons; variants feature (1st) and navy (3rd) | — | CAP-1, mockup | ✅ Chrome 1280: mist linen, 4 cards, feature (1st) and navy (3rd) |
| Benefits | width 1080px / 640px | — | 4 → 2 → 1 columns | — | EXPERIENCE.md Responsive (services grid) | ✅ Chrome: 4 columns at 1280/1080, 2 at 900/899/640, 1 at 390 (shared Story 3.5 `.svc-grid`: 1 column below 640) |
| Role card | roles open | — | glass card: title in display face, then team · location · work type in muted text, "View and apply" with arrow on the right | — | CAP-2, DESIGN.md Role card | ✅ dev site 2026-10-04: title in Unbounded, meta "Engineering" (location and type empty in Sanity), "View and apply" with arrow |
| Role card | click anywhere on the card | mouse, touch, pen | opens `/careers/<slug>` | — | CAP-2, EXPERIENCE.md Role card | ✅ dev site: click on the meta text at 1280 and touch tap at 390 open `/careers/placeholder-sample-job` (Not found until Story 6.6); pen not checked |
| Role card | Tab, then Enter | keyboard | one tab stop per card; 2px focus ring around the card; Enter opens the job page | — | AC-A11Y-2, AC-A11Y-4, T9 | ✅ dev site: one tab stop, `:focus-visible`, solid 2px ring with 3px offset; Enter opens the job URL |
| Role card | screen reader | — | one link whose name holds title, meta and "View and apply"; no nested link or button | — | AC-A11Y-4 | test: link name holds title, meta and "View and apply"; no nested link or button |
| Role card | hover | mouse | lifts 2px with shadow; arrow moves 4px right | 0.3–0.5s | DESIGN.md Role card, mockup `.link-arrow` | ✅ dev site 1280: lifts 2px with shadow, arrow moves 4px right |
| Role card | hover | touch, pen | no lift (hover-capable devices only) | — | EXPERIENCE.md pointer effects | ✅ dev site 390 touch: `(hover: hover)` false, no transform |
| Role card | pointer-following amber glow | mouse | not shown | — | pending: no shared spotlight glow exists in the codebase yet; no story owns it | not shown: no glow rule exists (by design until a story owns it) |
| Role card | width 640px or less | — | "View and apply" stacks under the title | — | DESIGN.md Role card | ✅ dev site: stacked at 640 and 390, side by side at 641 |
| Open roles panel | no open roles | — | dashed panel "No open roles right now."; no card | — | CAP-3, EXPERIENCE.md States, DESIGN.md Open roles panel | ✅ Chrome 1280: dashed panel "No open roles right now.", 0 cards |
| Open roles | a role is closed or has no slug | — | that role does not appear | — | CAP-3, Q1-B | test: query filter (closed, slug, title) and projection; the sample role without a slug does not show (walk: 0 cards) |
| Life frames | page load | — | mist surface; H2 "Life at XionTech."; three 4:3 dashed frames captioned "[Placeholder] Team photo", "[Placeholder] Office photo", "[Placeholder] Event photo"; not clickable | — | CAP-4, Q2-B, EXPERIENCE.md Media frame | ✅ Chrome 1280: mist surface, H2, three 4:3 frames with `[Placeholder]` captions, 0 links; caption inside the frame at every width (fixed in review: it was clipped) |
| Life frames | width 900px / 640px | — | 3 → 2 → 1 columns | — | EXPERIENCE.md Responsive (news grid) | ✅ Chrome: 3 columns at 1280/1080, 2 at 900/899, 1 at 640/390 |
| Page | scroll to the end | — | footer follows Life at XionTech; no email capture band | — | CAP-1, EXPERIENCE.md capture band rule | ✅ Chrome 1280: `#life` is the last section, then the footer; no capture band |
| Page | reduced motion | — | no lift or arrow transition; ribbon drawn once, still | — | EXPERIENCE.md Motion | ✅ Chrome reduced motion: button transition 0s, 0 running animations |
| Page | contrast | — | muted meta text and amber-hero text meet 4.5:1 | — | AC-A11Y-1 | ✅ hero lede 6.34:1 on amber; role meta 6.75:1 (dev site) |

## Implementation Notes

- 2026-10-03: task reviews were skipped by the controller's rule for this run (one review layer inside the build); the ledger records each skip.
- 2026-10-03, step 4: added an `undefinedClasses` guard test for all five careers sections (lesson from Stories 3.1, 3.4, 3.5 in `docs/ai-log.md`); it passed on first run, so it is a guard, not a red test.

## Spec Change Log

## Review Triage Log

Step 4 on 2026-10-03: one layer (Edge Case Hunter), by the controller's rule for this run (deadline-speed-first; the full 5-layer `bmad-code-review` runs before the PR). Blind Hunter, Verification Gap, Acceptance Auditor and Security Auditor were not run. Task reviews were also skipped for the same reason.

| # | Finding (source) | Verdict | Route | Evidence |
|---|---|---|---|---|
| 1 | `roleMeta` reads a plain object, so type `constructor` / `toString` prints function text (Edge, also as a claim check) | low | patch | Real: `TYPE_LABELS[type]` returns inherited members; breaks the matrix row "unknown type left out". Fixed with a `Map` lookup and a 3-case test (`6584322`). |
| 2 | Empty `slug.current` passes `defined()` and links to `/careers/` (Edge) | low | reject | The schema marks slug required, and the Studio's slug field never publishes an empty string; a guard adds a branch for an unlikely case. |
| 3 | Hand-typed slug with space, `?`, `#` or `/` breaks the link (Edge) | low | reject | Sanity's slug field slugifies from the title; only a deliberate hand edit gets there; the lead is the only editor. |
| 4 | Empty or whitespace `title.en` gives a card with no title (Edge) | low | reject | Unlikely with one editor; a guard adds complexity. |
| 5 | Two jobs with the same slug give duplicate React keys (Edge) | false | reject | Sanity's `slug` type checks uniqueness per document type by default (`isUnique`), so two published jobs cannot share a slug through the Studio. |
| 6 | A Sanity error fails the build or shows the error page instead of an empty list (Edge) | false | reject | Intended: the frozen matrix row "Sanity error → propagates; not swallowed" (CLAUDE.md: never swallow errors). |
| 7 | Role cards link to `/careers/[slug]`, which does not exist yet (Edge) | false | reject | By design: CAP-2 links to the Story 6.6 job page (T3); until 6.6 merges the link shows the Story 1.7 Not found page, and the only role is a `[Placeholder]`. Merge order is the lead's. |
| 8 | No lift on keyboard focus, only on hover (Edge) | false | reject | DESIGN.md Role card: "Lifts 2px on hover"; keyboard focus shows the 2px focus ring (UX checks row, T9). |
| 9 | Smoke build needs the Sanity env vars and network (Edge) | false | reject | Pre-existing since Story 1.8: `next.config.ts` checks the variables and smoke builds with `.env.local` (spec 1.8 Code Map). |

Patch re-review: not run as a separate subagent (16-line change, one review layer for this run); covered by `npx vitest run src/lib/careers/open-roles.test.ts` (13 passed) and the full re-verification below.

Full `bmad-code-review` on 2026-10-04 after rebasing onto `develop`, 5 layers. Security: clean (one unverifiable item: who can publish in Sanity decides what `/careers` shows — the lead checks Members in sanity.io/manage). Acceptance: CAP-1 to CAP-3 met; CAP-4 met as narrowed by decision A8.

- patch: Life frame captions were clipped (`.illo` min-height 320px inside a 4:3 box about 288px tall); `min-h-0` lets the frame fit. The query projection and the required slug rule are now tested.
- patch (docs): decisions recorded as A8 in `decisions-2026-10-01.md`; UX rows checked from the walk; build and smoke recorded.
- defer (Minor, `deferred-work.md`): role-card rows need a slugged role (after the Studio deploy); the shared `.split` and `.svc-grid` switch 1px off the "900px or less" / "640px or less" wording; the card focus ring follows the card's 24px radius; breadcrumb `aria-current` and separator (shared with other pages, Story 1.6); the culture photo frame has no owner for a real photo; `.news-grid` is shared with Story 6.1.
- open for the lead: the page title says "Software Jobs in Ho Chi Minh City" (from the mockup).

Role-card walk on 2026-10-04 on https://xiontech-dev.vercel.app after the lead deployed the Studio and published the sample role with a slug (`walk-roles.mjs`, `walk-roles-output.txt`, `role-1280.png`, `role-390.png`). Also checked: reduced motion turns the card transition off. The page showed the role on the second request after publishing: the webhook marks the cached page stale and the next request rebuilds it.

## Design Notes

- The mockup's "[Placeholder] Sample roles. Real roles are published through Sanity." note and the `#life` lede "Click a frame to add a real team photo." are prototype tooling (EXPERIENCE.md: prototype-only tooling is not part of the product), so they are left out. Sample roles already carry `[Placeholder]` titles.
- `OpenRoles` gets roles as a prop and the page does the fetch, so component tests need no Sanity mock.

## Verification

**Commands:**
- `npm run lint && npm run typecheck && npm run format:check` -- expected: no errors
- `npm test` -- expected: all pass
- `npm run test:coverage && npm run coverage:diff` -- expected: 100% changed lines, branches ≥ 80% on changed files
- `npm run build && npm run test:smoke` -- exit 0 in the main checkout: "8 passed"

**Manual checks:**
- Browser walk of `/careers` at 1280, 1080, 900, 899, 640 and 390px plus reduced motion -- done (`walk.mjs`, `walk-output.txt`); role-card rows wait for a published role with a slug (decision A8).

## Acceptance Evidence

Re-captured in step 4 on 2026-10-03, after the review patch (`6584322`) and the class guard test (`1b62497`).

**Commands**

- `npm run lint && npm run typecheck && npm run format:check` -- exit 0 -- "All matched files use Prettier code style!"
- `npm test` -- exit 0 -- "Test Files 45 passed (45)", "Tests 711 passed (711)"
- `npm run test:coverage && npm run coverage:diff` -- exit 0 -- "Coverage: 100%", "C1 ok: 9 changed file(s) with branch coverage >= 80% vs origin/develop."

**Observed**

- Page and components in jsdom: H1, `#roles`, `#life`, one link per role to `/careers/<slug>`, empty panel, three `[Placeholder]` frames, no capture band -- `src/app/careers/page.test.tsx`, `src/components/careers/careers.test.tsx`

**Artifacts**

- spec-6-5-careers-open-roles-evidence/verification.txt -- 3925 bytes -- sha256 fb9eabe98d6b -- transcript of the three command runs
- spec-6-5-careers-open-roles-evidence/observed.md -- 921 bytes -- sha256 a19db74e200d -- surface not reached; what the tests observed instead

**Not captured**

- `npm run build && npm run test:smoke` -- exit 0 in the main checkout (Turbopack rejects the worktree's `node_modules` junction): `/careers` built, "8 passed".
- Role-card rows in a browser: wait for the lead's Studio deploy and a slugged role (decision A8).
- The GROQ filter (`closed != true`, `defined(slug.current)`, order by title) against the real dataset -- only the query text is asserted; checked after the lead redeploys the Studio and fills the sample role.
