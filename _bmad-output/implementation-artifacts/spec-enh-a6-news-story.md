---
title: 'E-A6 News by audience, full-photo cards, Home news row and story page'
type: 'feature'
created: '2026-10-08'
status: 'done'
baseline_commit: '2bc2965b7a8c1c8536614fa241b08a34fe50b3b5'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/AGENTS.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** News is filtered by the old content categories (Product, Company, Schools, Team) and shows text cards with an empty frame. The prototype (`news.html`, `news-story.html`, Home news row) filters by audience, leads with photos, and has a new story page header. Source: `_bmad-output/specs/andy/spec-enh-a6-news-story/SPEC.md` (Tier 1 only).

**Approach:** Map each post to one audience at read time, add `image` + `alt` to the Sanity `post`, and port the prototype's full-photo card (`scard`), the lead-story layout, the new News hero, the Home news row header and the story page (`art-*`). One shared card for Home and News.

## Decisions (lead, 2026-10-08)

- Tier 1 only; Demo day 2026-10-16. Card motion and the rising hero words are Tier 2 (out).
- Q4: no newsletter. News keeps `<CaptureBand kind="demo" />`. E-A4 (parallel) adds the plain look; until it merges, the current band is the fallback, and the switch to the light blue plain look is a follow-up listed in `deferred-work.md`.
- Q12: keep "newXion" in the sample note as written.
- Audience mapping (the lead confirms it in the PR): `schools`/`students`/`parents`/`company` → itself; `team` → Company; `product` → Parents when the app is Parent Hub, Students when AI Tutor, else Schools (old app values `PXP`, `SXP`, `IoT` read through E-A2's `postApp`). Anything else → no pill, shown only under All.
- Photos: no photo file goes into the repo. Mock stories' Unsplash photos are never used. The prototype's `assets/news/*.jpg` (newsroom photos) are uploaded to Sanity by the lead, with their source; that is a manual step, not code.
- No Studio deploy, no content migration: listed as manual steps.
- Home: only `src/components/news/home-news.tsx` changes (not `src/app/page.tsx`).

## Boundaries & Constraints

**Always:** Port the prototype; "XionTech" in copy; `[Placeholder]` text stays in titles; server-rendered cards (no-JS shows every story, lead decided for 3 columns); Sanity failures still render the page with no stories; touch targets of filter chips at least 44px; `categoryTag`, `categoryLabels`, `newsDate` stay the shared helpers.

**Never:** Edit `CaptureBand`, `src/app/page.tsx`, `_bmad/`; keep E-A2's app ids in `post.app`; no "See {app}" button; no breadcrumb on News or the story page; no new dependency.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Audience | `category: "product", app: "PXP"` | pill "Parents"; under Parents filter | N/A |
| Unknown category | `category: "events"` or null | no pill; only under All | N/A |
| Card with image | `image` url + `alt` | photo fills the card | N/A |
| Card without image | no `image` | the current `home-media` frame | N/A |
| Lead, desktop (3 cols) | 4 shown | first is full-width lead, 3 squares | N/A |
| Lead, desktop | 3 shown | no lead (2 squares would follow, not a full row) | N/A |
| Lead | 1 shown | that one is the lead | N/A |
| Filter empty | Parents with no parent posts | "No stories are available in this category yet." + "Show all" | Show all → All, focus on All |
| Story with image but no alt | `image` set, `alt` empty | no photo block (alt is required) | N/A |
| Sample story | title starts with "[Placeholder]" | sample note under the body | N/A |
| Date | `2026-07-31T…` | "31 Jul 2026" | bad date → "" |

</frozen-after-approval>

## Code Map

- `src/lib/news/latest-posts.ts` -- `LatestPost` type, list query, `newsDate` (drop `.toUpperCase()`), `categoryTag` (returns the audience label; no `category === "product"` test). Add `image`, `alt` to type and queries.
- `src/lib/news/all-posts.ts`, `src/lib/news/post.ts` -- GROQ projections: add `"image": image.asset->url, alt`. Remove `productLink` (only the story page used it).
- `src/lib/news/post-app.ts` -- E-A2's `postApp`; reuse for the product mapping, do not change.
- New `src/lib/news/audience.ts` -- `postAudience(post): Audience | null` with the mapping above.
- `src/content/news.ts` -- `categoryLabels` becomes the four audiences; new hero, sample note, empty text, Home lede; drop breadcrumb and `seeApp` strings.
- `src/components/news/news-card.tsx` -- rewrite as one-link `scard` (pills top, title bottom, "Read story" with ArrowRightIcon). Image via `next/image` `fill unoptimized` like `src/components/careers/life-frames.tsx`; card image `alt=""` (the title names the link).
- `src/components/news/news-filters.tsx` -- audience filters; wraps each card in a grid cell that gets `s-lead`; columns from `matchMedia` (`useSyncExternalStore`, server snapshot 3) so the lead is recalculated on filter change and resize.
- `src/components/news/home-news.tsx` -- `sec-head-row` with heading + lede and "See all news"; `sgrid sgrid-row` grid.
- `src/app/news/page.tsx` -- new hero (no breadcrumb, no HeroArt), `news-bar` with filters + sample note, page wrapper `news-flow` (white with light blue shading), demo band.
- `src/app/news/[slug]/page.tsx` -- `art-hero`: Back to News, pill + date, H1, excerpt as summary, photo 440px when image + alt; `art-body`; sample note; no See-app button.
- `studio/schemas/post.ts` -- `category` list = Schools, Students, Parents, Company; `app` without `hidden`; `image` (hotspot) and `alt` (required when an image is set, same rule as `careers-photos.ts`). `structure.ts` unchanged.
- `src/app/globals.css` -- `/* E-A6 News */` block: port `scard*`, `#newsGrid`/`sgrid*`, `nhead`, `news-bar`, `art-*`; remove now-unused `ncard*`, `.cat*`, `story-body`, `story-media`. Keep `.news-grid` (Careers uses it), `.filters` (min-height 44px), `.news-empty`, `.sample`.
- Tests next to each file; `e2e/news.spec.ts`; `src/test-utils/css-classes` checks every class exists.
- Prototype to port (do not redesign): `_bmad-output/prototype-enhancement/prototype/news.html`, `news-story.html`, `index.html` lines 230-239 (Home news row), `js/site.js` lines 86-137 (card markup `scard`, lead rule `shape()`) and 350-358 (filters), `css/site.css` lines 1010-1080 (`nhead`, `scard*`, `art-*`), 1222-1239 (`#newsGrid`, `sgrid-row`), 268-274 (filters, news-bar, sample). Map prototype tokens to this repo's `@theme` tokens in `globals.css` (e.g. `var(--color-navy)`); the cool page background is prototype `site.js` line 455-462 "cool" palette, done as a static CSS gradient like `.careers-flow`. Use Phosphor `ArrowRightIcon`/`ArrowLeftIcon` from `@phosphor-icons/react/ssr` instead of the prototype's "→" text and `ph` icon font.

## Tasks & Acceptance

**Execution:**
The files are tightly coupled (shared helpers; `undefinedClasses` tests need the CSS in the same commit), so there are three tasks. Each task keeps the whole test suite green when it ends.

- [x] **Data and Studio.** New `src/lib/news/audience.ts` (`postAudience`, type `Audience`); `src/lib/news/latest-posts.ts`, `all-posts.ts`, `post.ts` (image + alt in all three queries and in `LatestPost`; `newsDate` not in capitals; `categoryTag` returns the audience label; remove `productLink`); `src/content/news.ts` `categoryLabels` = schools, students, parents, company (other copy changes belong to tasks 2 and 3); `studio/schemas/post.ts` (audience list, `app` with no `hidden`, `image` with hotspot, `alt` required when an image is set). Update every test these changes break (including card, filters, pages, `schemas.test.ts`) only as far as needed to stay green; tasks 2 and 3 rewrite them. -- CAP-2, CAP-4
  - red: `src/lib/news/audience.test.ts` -- `category: "product", app: "PXP"` maps to `parents`; also `latest-posts.test.ts` -- `newsDate` gives "31 Jul 2026"
- [x] **Card and News page.** `src/components/news/news-card.tsx` (one-link `scard`), `src/components/news/news-filters.tsx` (audience filters, lead rule with `matchMedia` columns, empty state), `src/app/news/page.tsx` (hero, `news-bar` with sample note, `news-flow` wrapper, demo band), News copy in `src/content/news.ts`, the matching `/* E-A6 News */` CSS in `src/app/globals.css` (and removal of `ncard*`/`.cat*` CSS once nothing uses it), tests next to each file, `e2e/news.spec.ts` News test. -- CAP-1, CAP-2, CAP-3, CAP-4, CAP-5, CAP-8, CAP-9
  - red: `src/components/news/news-filters.test.tsx` -- pressing Parents shows only parent stories and the newest of them gets `s-lead` when it is the only one
- [x] **Home row and story page.** `src/components/news/home-news.tsx` (lede, See all on the heading row, `sgrid sgrid-row`), `src/app/news/[slug]/page.tsx` (`art-hero`, photo when image + alt, `art-body`, sample note, no See-app, no breadcrumb), their copy in `src/content/news.ts`, their CSS (and removal of `story-body`/`story-media` CSS), tests, and the story test in `e2e/news.spec.ts`. -- CAP-6, CAP-7
  - red: `src/app/news/[slug]/page.test.tsx` -- a story with image + alt shows an `img` with that alt inside `.art-img`, and no breadcrumb navigation

**Acceptance Criteria:**
- Given News at 1280px, when "Parents" is pressed, then only parent stories show and the newest is the lead if it is alone or a full row follows.
- Given a filter with no stories, then the empty message and "Show all" show; "Show all" returns to All.
- Given a story with image and alt, then its page shows the photo 440px tall with that alt and the excerpt as the summary.
- Given Home, then the news row shows the lede, "See all news" on the heading row (under it at 640px and below) and up to three photo cards.

## UX checks

| # | Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | News hero | load | none | H1 "Catch up with us", sub "Stay informed…press."; no breadcrumb; white with light blue shading | static | CAP-1 | yes: page.test + browser 1280/900/390 |
| 2 | Filters | load | none | All (pressed), Schools, Students, Parents, Company; each at least 44px tall | static | CAP-2, EXPERIENCE Touch targets | yes: browser, all 44px |
| 3 | Filter chip | press a chip | mouse, keyboard, touch | only that audience shows; one chip pressed; count announced | instant | CAP-2, EXPERIENCE Filter chips | yes: news-filters.test + browser (Schools, Parents, Company) |
| 4 | Sample note | load | none | "Stories from the newXion newsroom; those marked [Placeholder] are samples." beside the filters | static | CAP-3, Q12 | yes: page.test + browser |
| 5 | Story card | load | none | full photo (or frame), audience pill and date at the top, title at the bottom on a dark fade | static | CAP-4 | yes: news-card.test + browser (frame; no live photo yet) |
| 6 | Story card | hover or focus | mouse, keyboard | "Read story" shows, card lifts; focus ring visible | 0.35-0.45s | CAP-4, news.html | yes: browser hover opacity 1, focus outline solid |
| 7 | Story card | any | touch | "Read story" always shown | static | CAP-4 | hand: CSS `@media (hover: none)` rule; no touch device used |
| 8 | Story card | click / Enter | mouse, keyboard | opens `/news/{slug}` | — | CAP-4 | yes: news-card.test (href) + e2e story test |
| 9 | Date | load | none | "31 Jul 2026" (not capitals) | static | CAP-4 | yes: latest-posts.test + browser "4 Oct 2026" |
| 10 | Lead | All, 4+ stories, 1280px | none | first card full width, then squares 3 per row | static | CAP-5 | yes: news-filters.test (5 items); live data has 3 stories, so no lead at 1280 (correct) |
| 11 | Lead | resize to 900px / 390px | any | 2 / 1 per row; lead recalculated | on resize | CAP-5 | yes: news-filters.test + browser (900: lead + 2; 390: one column) |
| 12 | Lead | no JavaScript | none | all stories, lead decided for 3 columns | static | CAP-5 | yes: news-filters.test (server snapshot 3 columns) |
| 13 | Empty filter | press an empty audience | mouse, keyboard | "No stories are available in this category yet." + "Show all"; Show all → All, focus on All | instant | CAP-5 | yes: news-filters.test + browser (Students; focus on All) |
| 14 | Home news row | load 1280px / 390px | none | heading + lede "Catch up with what our team is building and shipping."; "See all news" on the heading row / under it | static | CAP-6 | yes: home-news.test + browser (1280 right of heading row; 390 under lede) |
| 15 | Home news cards | load | none | the same photo card, up to 3 | static | CAP-6 | yes: home-news.test + browser (3 cards) |
| 16 | Story page | load | none | "Back to News" top, pill + date, H1, summary; no breadcrumb; no "See app" | static | CAP-7 | yes: page.test + browser |
| 17 | Story photo | image + alt | none | photo 440px tall with alt; none without image | static | CAP-7 | yes: [slug]/page.test only (no Sanity post has a photo yet) |
| 18 | Story sample note | title starts "[Placeholder]" | none | "[Placeholder] Sample story to show the layout…" | static | CAP-7 | yes: [slug]/page.test |
| 19 | Email band | load News | none | demo band (current look until E-A4) | static | CAP-8, Q4 | yes: browser (current demo band; plain look after E-A4, deferred) |
| 20 | Title | load News | none | "News \| XionTech" | static | CAP-9 | yes: browser title |

## Implementation Notes

## Spec Change Log

## Review Triage Log

Full `bmad-code-review` (Blind Hunter, Edge Case Hunter, Verification Gap, Acceptance Auditor), once, plus the task-review minors from the ledger.

| # | Source | Finding | Verdict | Route / evidence |
| --- | --- | --- | --- | --- |
| 1 | blind, task-2 minor | Card title is a span: no heading navigation between stories | medium | patch: title becomes `h3.scard-title` inside the link |
| 2 | blind, edge | `image` hotspot option set but hotspot/crop never read | medium | patch: drop `hotspot: true` |
| 3 | edge, blind | Old `product`/`team` values not in the Studio list; Studio flags old posts | medium | defer: needs a content migration (not allowed here); read-time mapping keeps the site right; manual step for the lead |
| 4 | verification-gap | Photo projection checked only as query text, no live/recorded fetch | medium (unverified live) | defer: no Sanity post has a photo yet; check on preview after upload |
| 5 | blind | Server snapshot 3 columns: lead may change after hydration on phones (layout shift) | low | defer: same as prototype JS; spec asks no-JS default at desktop |
| 6 | task-3 minor, auditor | Home 3rd card wraps alone at 641-1000px (prototype hides it) | low | defer: `contrast.test.ts` forbids `display:none` hiding content |
| 7 | blind | `alt` not localized like title/excerpt | low | defer to Story 1.2 (languages) |
| 8 | edge, auditor, verif | Lead set for 5 stories at 3 cols leaves 1 card alone | false | prototype `shape()` uses the same `n-1 >= cols` rule; spec says "a full row follows" |
| 9 | edge | Duplicate ids if one post rendered twice on a page | false | each page renders a post once (Home row or News grid, never both) |
| 10 | edge | Reduced motion: title still shifts on hover | low | reject: transitions are off, as in the prototype; no animation plays |
| 11 | edge | `[Placeholder]` check misses leading space or lower case | low | reject: titles are trimmed in Studio by editors; marker is exact by rule |
| 12 | blind | Story photo width/height fixed 1800x1200 | false | `object-fit: cover` at 440px height; attributes only reserve space |
| 13 | blind | `sizes` does not match grid | low | reject: images are `unoptimized`, `sizes` has no effect |
| 14 | blind | Empty body shows empty article | low | reject: the excerpt shows as the summary above |
| 15 | blind | Copy: meta description says "team"; empty text says "category"; sample note "newXion" | false | copy is the spec's (CAP-5, Q12); meta description out of CAP-9 scope |
| 16 | blind | Smoke test matches exact markup | low | reject: same style as existing smoke tests |
| 17 | blind | `newsDate` change affects all surfaces | false | intended (CAP-4, shared helper by spec) |
| 18 | blind, auditor | Card shows photo without alt; story hides it | false | spec: card photo is decorative (`alt=""`); story requires alt |
| 19 | auditor | `contrast.test.ts` MAY_HIDE widened | low | reject: hover/focus swaps only, "Read story" is aria-hidden and always shown on touch |
| 20 | task-1 minor | `app` settable on any audience | false | spec-mandated (CAP-2) |
| 21 | task-2 minor | Lone 900px media block | false | task 3 folded it |
| 22 | task-2 minor | No test for labelledby with no audience and no date | low | reject: title-only case covered |
| 23 | task-3 minor | Class allow list only sr-only; CSS rule moved | low | reject: stricter test; no behaviour change |

## Verification

**Commands:**
- `npm run lint && npm run typecheck && npx prettier --check src e2e studio` -- expected: clean
- `npm test` -- expected: all pass
- `npm run test:coverage && npm run coverage:diff` -- expected: 100% changed lines
- `npm run build` -- expected: success

**Manual checks:**
- `next start --port 3206` + Playwright (Chrome): News 1280/900/390, filter Parents and an empty filter, Home news row, one story page.

## Acceptance Evidence

Captured at the end of step-03 on 2026-10-08.

**Commands**

- `npm run lint`, `npm run typecheck`, `npx prettier --check src e2e studio` -- exit 0 -- clean
- `npm test` -- exit 0 -- Tests 1214 passed (1214)
- `npm run test:coverage && npm run coverage:diff` -- exit 0 -- Coverage: 100% (38 changed lines)
- `npm run build` -- exit 0 -- /news static, /news/[slug] dynamic

**Observed**

- News 1280/900/390, filters, empty state, Home row, story page -- `next start --port 3206` + Playwright Chrome, see browser-check.txt

**Artifacts**

- spec-enh-a6-news-story-evidence/verification.txt -- 5573 bytes -- sha256 fb470caed51b -- command output
- spec-enh-a6-news-story-evidence/browser-check.txt -- 2953 bytes -- sha256 e4ed908cb51d -- measurements
- spec-enh-a6-news-story-evidence/news-1280.png, news-900.png, news-390.png, news-parents.png, news-empty-Students.png, home-news-1280.png, home-news-390.png, story-1280.png, story-390.png -- screenshots (hashes in the ledger)

**After review** (patches 5bd9e17): every command re-run, exit 0, Tests 1214 passed, diff coverage 100% -- spec-enh-a6-news-story-evidence/verification-after-review.txt; browser re-check -- browser-check-after-review.txt.

**Not captured**

- A story photo on the live site: no Sanity post has an image yet (unit tests cover it).
