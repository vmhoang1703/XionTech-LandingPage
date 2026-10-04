---
title: 'Story 6.1 News page with category filters'
type: 'feature'
created: '2026-10-04'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context:
  - '{project-root}/AGENTS.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `/news` does not exist: the header, Home's "See all news" and the Not found page link to it, and visitors cannot read or filter the stories (SPEC `_bmad-output/specs/andy/spec-6-1-news-filters/SPEC.md`, CAP-1 to CAP-5).

**Approach:** A server-rendered `/news` page: light hero (crumbs Home / News, H1 "What we've been up to." with "up to" highlighted, lede), a stories section with filter chips All, Product, Company, Schools, Team and every published story as the Story 3.7 `NewsCard` (the first one a wide feature card), a live result count and an empty panel with "Show all", then the Story 2.4 demo capture band. The chip filter is the only client part; it shows and hides the server-rendered cards without a reload.

Lead decisions that override the SPEC: A11 (the Sanity client reads with `useCdn: false`; never `force-dynamic`, `no-store` or a time-based `revalidate`), A9 (the posts are real: no `[Placeholder]` titles and no sample note). The list uses Home's filter: `defined(slug.current) && defined(title.en) && defined(publishedAt)`, newest first.

</frozen-after-approval>

## UX checks

Sources: SPEC CAP-1..5, `EXPERIENCE.md` (News row, Filter chips, News empty state, Responsive 900/640), `DESIGN.md` (News card, Filter chips, pills), mockup `news.html` + `site.css` (`.filters`, `.ncard.big`, `.news-empty`), T9 focus ring.

| Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| --- | --- | --- | --- | --- | --- | --- |
| Hero | page load | — | light hero, crumbs Home / News (News not a link), H1 "What we've been up to." with "up to" highlighted, lede | — | CAP-1, mockup | ✅ Chrome 1280 (prod build): crumbs Home / News (only Home a link), H1 with "up to" highlighted, lede (`walk-output.txt`) |
| Chips | page load | — | All, Product, Company, Schools, Team in one group "Filter stories"; All `aria-pressed="true"`, the rest `false`; pills, active navy with white text | — | CAP-1, DESIGN.md Filter chips | ✅ Chrome: group "Filter stories", All pressed, others not; active navy rgb(22, 54, 99) with white text, 999px pills; pending: Amber — DESIGN.md says inactive chips are mist, the mockup has them transparent (kept until she decides) |
| Grid | page load | — | every published story as a news card, newest first; the first card is a wide feature (2 columns, frame left, larger title) | — | CAP-1, DESIGN.md News card | ✅ Chrome: 3 real stories newest first, the first `spot ncard big` (788px wide, frame left, 24px title), 3 columns; `news-1280.png` |
| Chip | press Team | mouse, touch, keyboard | only Team cards shown, no reload; Team pressed, others not | instant | CAP-2 | partly: Chrome with Product (no Team stories exist yet): only the 2 product stories, URL unchanged; mouse, Enter on Product, Space on Company; no touch device; the Team path by unit tests (`news-filters.test.tsx`, `page.test.tsx`) |
| Chip | press the active chip | mouse, keyboard | nothing changes | — | CAP-2 | ✅ Chrome: Company again changes nothing |
| Count | after a filter | screen reader | live region reads "Showing 1 story" / "Showing N stories" | on press | CAP-2, CAP-3 | partly: Chrome DOM read of the polite live region: "Showing 2 stories", "Showing 1 story", "Showing 0 stories"; no screen reader used |
| Empty | category with no stories | mouse, keyboard | "No stories in this category yet." and a "Show all" button; Show all resets to All and its count | — | CAP-4 | ✅ Chrome: Team shows the dashed panel and Show all; Show all returns to All (3 cards) with focus on All; `news-empty-1280.png` |
| Chips, Show all, Read story | Tab | keyboard | 2px focus ring | — | T9 | ✅ Chrome: solid 2px ring on a chip, Show all and Read story |
| Grid | width 900px or less / 640px or less | — | 2 columns with the feature card full width / 1 column; no sideways scroll | — | EXPERIENCE.md Responsive | ✅ Chrome: 2 columns at 900 with the feature full width, 1 column at 640 and 390, no sideways scroll; `news-390.png` |
| Capture band | page end | — | amber "See it working at your school." demo capture, no newsletter | — | CAP-5 | ✅ Chrome: "See it working at your school.", no newsletter |
| Page | no JavaScript | — | every story visible in the server HTML | — | CAP-1 | ✅ Chrome with JavaScript off: 3 cards and 5 chips in the HTML |
| Page | Sanity fails | — | page still renders with the empty panel (no "Show all"); error logged | — | lead decision for Home (A9), applied here | unit test (`page.test.tsx` "keeps the page up when the fetch fails") |

## Implementation Notes

- Code to reuse: `NewsCard` (`src/components/news/news-card.tsx`) gets one optional `feature` flag that adds `big`; `newsDate`, `categoryTag`, `LatestPost` from `src/lib/news/latest-posts.ts`; `sanityFetch` with tag `post`; `CaptureBand kind="demo"` (`src/components/contact/capture-band.tsx`); `HeroArt` and the `hero-light page-hero`, `crumbs`, `hl`, `lede` classes as in `src/app/privacy/page.tsx` and `careers-hero.tsx`. Copy goes in `src/content/news.ts`.
- New: `src/lib/news/all-posts.ts` (own GROQ query, T2), `src/app/news/page.tsx`, `src/components/news/news-filters.tsx` (`"use client"`; gets the server-rendered cards with their category and drops the hidden ones from the list), CSS for `.filters`, `.ncard.big`, `.news-empty`, a `@smoke` e2e for `/news`.
- My choices (the user would not notice): the stories section has an `sr-only` H2 "All stories" so card H3s do not skip a level; a failed fetch shows the empty panel without "Show all" (as Home survives a Sanity failure); no list cap; the count is in the server HTML too.
- Red first: `npx vitest run src/lib/news/all-posts.test.ts src/components/news src/app/news` failed (missing `all-posts`, `news-filters`, `page`; the card had no `big` class), then passed (36 tests) after the code.
- The browser walk on the production build found the wide feature card 1002px tall: `grid-row: 1 / span 99` made 99 grid rows. Fixed with four explicit rows (`auto auto auto 1fr`) and `grid-row: 1 / -1`; the frame is now 458px.
- Full suite: `npm run test:coverage` timed out twice in `scripts/eslint-config.test.mjs` (typed ESLint over the project, 120 s limit) under full parallel load; it passes alone in 20 s, and the whole suite passes with `-- --maxWorkers=3` (1020 tests). Not caused by this change.
- Checks: lint, typecheck, format pass; diff coverage 100% (28 lines), C1 ok; build passes (`/news` prerendered); smoke 11 passed incl. `e2e/news.spec.ts`.
- Known risk, same as Home (deferred in `deferred-work.md`): `/news` is prerendered, so a Sanity failure during a build or a tag refresh caches the empty panel until the next post publish or redeploy (A11 rules out a time-based `revalidate`).

## Review Triage Log

Full `bmad-code-review`, 5 layers, 2026-10-04. Security clean.

| # | Finding | Verdict | Evidence / action |
| --- | --- | --- | --- |
| 1 | No test passes real posts through the page into the filter (category wiring) (Verification Gap) | medium | patch: `page.test.tsx` clicks Team and expects only that story and "Showing 1 story" |
| 2 | "press Team" and "Count" rows marked ✅ although Team has no stories and no screen reader was used (Blind Hunter) | medium | patch: both rows now "partly", naming what was checked |
| 3 | Feature "Read story" link stretches over the whole text column (Blind Hunter) | low | measured by hand in Chrome: 322 x 31px at the card bottom; the 3.7 cards on Home do the same; deferred |
| 4 | A Sanity outage at build time caches an empty `/news` (Blind Hunter, Edge) | low | same as Home, already deferred; noted in Implementation Notes |
| 5 | Inactive chips: DESIGN.md mist vs mockup transparent (Acceptance) | low | Chips row marked `pending: Amber` |
| 6 | Other Minor points: no-excerpt feature layout, 26px strip under the frame, hero bottom padding 104 vs 64px, empty panel margin, empty text with no stories, repeat count not re-announced, chips without JavaScript, unknown category, feature follows overall order, 36px chips, copied GROQ projection, test strength, stale `data-c` note | low | deferred in `deferred-work.md`; the `data-c` note is fixed |
