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
- [ ] `studio/schemas/job.ts` + `studio/schemas/schemas.test.ts` -- add `slug` (source `title.en`, required), `team` (localized string), `closed` (boolean, initial false) -- Q1-B.
  - red: `studio/schemas/schemas.test.ts` -- job has `slug`, `team` (EN/VI) and `closed` fields.
- [ ] `src/lib/careers/open-roles.ts` + test -- GROQ `*[_type == "job" && closed != true && defined(slug.current) && defined(title.en)] | order(title.en asc)`, projected to `{ slug, title, team, location, type }`; `getOpenRoles()` calls `sanityFetch` with tags `["job"]`; `roleMeta()` maps type values to labels (`full-time` → "Full-time") and joins present parts with " · " -- CAP-2, CAP-3.
  - red: `src/lib/careers/open-roles.test.ts` -- fetch gets tag `job` and the closed/slug filter; meta omits missing parts and unknown types; a thrown fetch error propagates.
- [ ] `src/content/careers.ts` -- metadata, hero, culture (3 bullets + `[Placeholder]` photo frame), 4 benefits, roles heading + empty text + "View and apply", life heading + 3 frame captions ("[Placeholder] Team photo", "[Placeholder] Office photo", "[Placeholder] Event photo") -- CAP-1, CAP-4.
- [ ] `src/components/careers/careers-hero.tsx`, `culture.tsx`, `benefits.tsx`, `open-roles.tsx`, `life-frames.tsx` + tests -- Server Components; `OpenRoles` takes `roles` as a prop and renders cards or the empty panel -- CAP-1…CAP-4.
  - red: component tests -- each card is one link to `/careers/<slug>` with no nested link or button; `[]` shows "No open roles right now."; three `#life` frames with `[Placeholder]` captions; hero buttons point to `#roles` and `#life`.
- [ ] `src/app/careers/page.tsx` + test -- async page: `metadata`, `await getOpenRoles()`, sections in mockup order, no capture band -- CAP-1.
  - red: `src/app/careers/page.test.tsx` -- renders the H1, `#roles`, `#life` and no capture band.
- [ ] `src/app/globals.css` -- port `.roles`, `.role`, `.role-main`, `.roles-empty`, `.illo`, `.link-arrow`, life grid; hover only in `@media (hover: hover)`; no transition under reduced motion.
- [ ] `e2e/careers.spec.ts` -- `@smoke`: `GET /careers` is 200 with the H1, `id="roles"` and `id="life"`.

**Acceptance Criteria:**
- Given `/careers`, when it loads, then the amber hero reads "Build what schools use every day." with "See open roles" → `#roles` and "Life at XionTech" → `#life`, then culture, four benefits (Innovative workspace, Growth opportunities, Engaging work, Meaningful impact), open roles and Life at XionTech, and no capture band.
- Given the controller runs `npm run build && npm run test:smoke` in the main checkout, then `/careers` returns 200 -- pending (controller).

## UX checks

Sources: `EXPERIENCE.md` (Component Patterns › Role card, Spotlight card, Media frame, Button, Focus ring; States; Responsive; Motion), `DESIGN.md` (Role card, Open roles panel, Placeholder frame, Button, section surfaces line 443), SPEC CAP IDs, lead decisions 2026-10-03.

| Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| --- | --- | --- | --- | --- | --- | --- |
| Hero | page load | — | amber hero, breadcrumbs Home / Careers, H1 "Build what schools use every day." with "every day" highlighted, lede, amber strand ribbon | ribbon 5s, then still | CAP-1, DESIGN.md 443, Story 1.6 HeroArt | |
| Hero "See open roles" | click / Enter | mouse, keyboard | goes to `#roles`; navy pill with arrow | — | CAP-1, DESIGN.md Button | |
| Hero "Life at XionTech" | click / Enter | mouse, keyboard | goes to `#life`; glass pill | — | CAP-1, brand rule (AGENTS.md) | |
| Hero buttons | hover | mouse | lift 2px | 0.35s | DESIGN.md Button | |
| Hero buttons | press | mouse, touch | 1px down, scale 0.98 | — | DESIGN.md Button | |
| Culture | page load | — | paper surface; H2 "A culture that goes beyond employment."; 3 check bullets; dashed "[Placeholder] Photo" frame on the right | — | CAP-1, Q3, DESIGN.md Placeholder frame | |
| Culture | width 900px or less | — | text and photo frame stack in one column | — | EXPERIENCE.md Responsive | |
| Benefits | page load | — | mist linen surface; "Why you'll grow here."; 4 cards with icons; variants feature (1st) and navy (3rd) | — | CAP-1, mockup | |
| Benefits | width 1080px / 640px | — | 4 → 2 → 1 columns | — | EXPERIENCE.md Responsive (services grid) | |
| Role card | roles open | — | glass card: title in display face, then team · location · work type in muted text, "View and apply" with arrow on the right | — | CAP-2, DESIGN.md Role card | |
| Role card | click anywhere on the card | mouse, touch, pen | opens `/careers/<slug>` | — | CAP-2, EXPERIENCE.md Role card | |
| Role card | Tab, then Enter | keyboard | one tab stop per card; 2px focus ring around the card; Enter opens the job page | — | AC-A11Y-2, AC-A11Y-4, T9 | |
| Role card | screen reader | — | one link whose name holds title, meta and "View and apply"; no nested link or button | — | AC-A11Y-4 | |
| Role card | hover | mouse | lifts 2px with shadow; arrow moves 4px right | 0.3–0.5s | DESIGN.md Role card, mockup `.link-arrow` | |
| Role card | hover | touch, pen | no lift (hover-capable devices only) | — | EXPERIENCE.md pointer effects | |
| Role card | pointer-following amber glow | mouse | not shown | — | pending: no shared spotlight glow exists in the codebase yet; no story owns it | |
| Role card | width 640px or less | — | "View and apply" stacks under the title | — | DESIGN.md Role card | |
| Open roles panel | no open roles | — | dashed panel "No open roles right now."; no card | — | CAP-3, EXPERIENCE.md States, DESIGN.md Open roles panel | |
| Open roles | a role is closed or has no slug | — | that role does not appear | — | CAP-3, Q1-B | |
| Life frames | page load | — | mist surface; H2 "Life at XionTech."; three 4:3 dashed frames captioned "[Placeholder] Team photo", "[Placeholder] Office photo", "[Placeholder] Event photo"; not clickable | — | CAP-4, Q2-B, EXPERIENCE.md Media frame | |
| Life frames | width 900px / 640px | — | 3 → 2 → 1 columns | — | EXPERIENCE.md Responsive (news grid) | |
| Page | scroll to the end | — | footer follows Life at XionTech; no email capture band | — | CAP-1, EXPERIENCE.md capture band rule | |
| Page | reduced motion | — | no lift or arrow transition; ribbon drawn once, still | — | EXPERIENCE.md Motion | |
| Page | contrast | — | muted meta text and amber-hero text meet 4.5:1 | — | AC-A11Y-1 | |

## Implementation Notes

## Spec Change Log

## Review Triage Log

## Design Notes

- The mockup's "[Placeholder] Sample roles. Real roles are published through Sanity." note and the `#life` lede "Click a frame to add a real team photo." are prototype tooling (EXPERIENCE.md: prototype-only tooling is not part of the product), so they are left out. Sample roles already carry `[Placeholder]` titles.
- `OpenRoles` gets roles as a prop and the page does the fetch, so component tests need no Sanity mock.

## Verification

**Commands:**
- `npm run lint && npm run typecheck && npm run format:check` -- expected: no errors
- `npm test` -- expected: all pass
- `npm run test:coverage && npm run coverage:diff` -- expected: 100% changed lines, branches ≥ 80% on changed files
- `npm run build && npm run test:smoke` -- pending (controller, main checkout)

**Manual checks:**
- Browser walk of `/careers` at 1280px, 900px and 390px; keyboard through the hero buttons and role cards; every UX row above -- pending (controller).
