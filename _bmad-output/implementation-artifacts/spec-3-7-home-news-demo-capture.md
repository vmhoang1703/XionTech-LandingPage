---
title: 'Story 3.7: Home latest news, demo capture and section rhythm'
type: 'feature'
created: '2026-10-04'
status: 'done'
baseline_commit: '5973d9b340c9392ad401f4f200f9b45a9ac4147e'
route: 'dispatch'
review_loop_iteration: 0
context: ['{project-root}/AGENTS.md', '{project-root}/CLAUDE.md']
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Home ends at the 4-D band and the demo capture; it has no "latest news", so Lan (Flow 1) cannot see that the company is active. Contract: `_bmad-output/specs/andy/spec-3-7-home-news-demo-capture/SPEC.md` (CAP-1 to CAP-5; FR-14, FR-33, UX-DR3, UX-DR22, NFR-7).

**Approach:** A server-rendered mist section "Latest from XionTech." between `<HomeProcess />` and the existing `<CaptureBand kind="demo" />`: the three newest Sanity `post`s as news cards (16:10 empty media frame, mono date, category tag, title, excerpt, "Read story" to `/news/[slug]`), a `[Placeholder]` sample note, and "See all news" to `/news`. The story writes its own GROQ query on the 1.8 `sanityFetch` helper (tag `post`, T2). The news card is a reusable component Story 6.1 will import.

## Boundaries & Constraints

**Always:** Server Component only, no `"use client"`. Read through `sanityFetch` with `tags: ["post"]`; never `force-dynamic`, never a second client. Copy lives in one module so it can be translated later; brand "XionTech" (heading reads "Latest from XionTech.", brand rule overrides the mockup's "XionTechs"). Port the prototype `.ncard`, `.meta`, `.cat`, `.sample` rules into `globals.css` with tokens; reuse `.sec`, `.surface-mist`, `.sec-head`, `.spot`, `.news-grid`, `.link-arrow`, `.home-media`. Cards are static (spotlight glow and lift are after demo, as in 3.5). In `src/app/page.tsx` add only the import and the render line.

**Decisions (lead, 2026-10-04):** A9 — add `category` (Product/Company/Schools/Team, required) and `app` (PXP/LXP/SXP/IoT, shown only for Product) to `studio/schemas/post.ts` in this PR, with schema tests; keep the existing post `preview`; record A9 in `_bmad-output/specs/decisions-2026-10-01.md` (A8 table style; Specs 3.7, 6.1, 6.3). Post-merge lead step: switch to `develop` and pull, `cd studio && npx sanity deploy`, then set a category on each sample post (`docs/sanity.md`). Until then cards show no tag. Spec size: keep the full spec (over 1600 tokens, mostly the UX checks table).

**Never:** Change the capture band (2.4) or Sammy's Home sections 3.1–3.6. No News page, story page, filters or editor flow (6.1–6.3). No Vietnamese copy. No invented stories in code: stories come only from Sanity.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Three or more stories | ≥3 published posts with slug, `title.en`, `publishedAt` | 3 newest cards, newest first; sample note shown | N/A |
| Fewer than three | 1–2 posts | only those cards, no empty slots | N/A |
| No stories | 0 posts | no grid, no sample note; heading and "See all news" stay | N/A |
| Product story | `category: product`, `app: PXP` | amber tag "Product · PXP" | no `app` → "Product" |
| Other category | `team` / `schools` / `company` | mist tag "Team" / "Schools" / "Company" | missing or unknown category → no tag |
| Missing excerpt | `excerpt.en` empty | card without the excerpt paragraph | N/A |
| Sanity fails | fetch throws | error propagates (same as Careers, 6.5) | `sanityFetch` wraps it with the tags |

</frozen-after-approval>

## Code Map

- `src/app/page.tsx` (Sammy) -- Home; insert `<HomeNews />` after `<HomeProcess />`, before `<CaptureBand kind="demo" />`.
- `src/app/page.test.tsx` (Sammy) -- renders `<Home />` synchronously; must mock `@/components/news/home-news` (async component cannot render in jsdom) and keep its 5 tests green.
- `src/lib/sanity/client.ts` -- `sanityFetch<T>({ query, tags })`, `SanityTag = "post" | "job"`. Reuse, do not edit.
- `src/lib/careers/open-roles.ts` + `.test.ts` -- pattern to copy: query constant, fetch function, mocked `sanityFetch` test with `// @vitest-environment node`.
- `src/components/careers/open-roles.tsx` -- section/`sec-head`/`link-arrow` + `ArrowRightIcon` from `@phosphor-icons/react/ssr` pattern.
- `studio/schemas/post.ts`, `studio/schemas/schemas.test.ts` -- post fields; job `type` list field is the list-field pattern.
- `src/app/globals.css` -- `.news-grid` and `.link-arrow` (Story 6.5, ~line 1704–1800), `.spot` and `.sec-head` (~1380–1425), `.home-media` empty frame (~1154), `.surface-*` (~374). Add news card rules near the 6.5 block.
- Prototype: `mockups/site-v3/index.html` lines 132–138, `js/site.js` lines 80–87 (card markup, category labels), `css/site.css` lines 287–304, 446, 456.

## Tasks & Acceptance

**Execution:**
- [x] `studio/schemas/post.ts` -- add `category` and `app` (A9) -- tag source.
  - red: `studio/schemas/schemas.test.ts` -- post has a required `category` with the four values and an `app` with the four apps, hidden unless category is product
- [x] `src/lib/news/latest-posts.ts` -- `getLatestPosts()`: posts with `defined(slug.current) && defined(title.en) && defined(publishedAt)`, `order(publishedAt desc)[0...3]`, flat projection (slug, title, excerpt, publishedAt, category, app), tag `post`; `newsDate(iso)` → `18 SEP 2026` in `Asia/Ho_Chi_Minh`; `categoryTag(post)` → label or null -- CAP-1 data.
  - red: `src/lib/news/latest-posts.test.ts` -- query filter, order, limit, projection and tag; date format; tag labels incl. product app and unknown category
- [x] `src/content/news.ts` -- heading, sample note `[Placeholder] Sample stories. Replace with real news before launch.`, "See all news", "Read story", category labels -- one copy module.
- [x] `src/components/news/news-card.tsx` -- `article.spot.ncard`: `aria-hidden` 16:10 empty frame, `<time dateTime>` mono date, `.cat` (`.cat.product` amber), `h3` title, excerpt, "Read story" `Link` to `/news/{slug}` with the title in an `sr-only` suffix -- CAP-1.
  - red: `src/components/news/news-card.test.tsx` -- date, tag, title, excerpt and link href/name; product tag amber class; no tag/excerpt when missing
- [x] `src/components/news/home-news.tsx` -- async section `sec surface-mist`, `aria-labelledby="news-h"`, H2, sample note and grid only when stories exist, "See all news" to `/news` always -- CAP-1..3.
  - red: `src/components/news/home-news.test.tsx` -- 3, 1 and 0 stories; note starts `[Placeholder]`
- [x] `src/app/globals.css` -- port `.ncard`, `.ncard .frame`, `.meta`, `.cat`, `.cat.product`, `.sample` with tokens.
- [x] `src/app/page.tsx`, `src/app/page.test.tsx` -- add the render line; mock `HomeNews`; test order process → news → capture last, and the surface rhythm -- CAP-4, CAP-5.
  - red: `src/app/page.test.tsx` -- news section sits between the 4-D band and the capture band
- [x] `_bmad-output/specs/decisions-2026-10-01.md`, `docs/sanity.md`, `docs/ai-log.md` -- record A9 (2026-10-04) and the post-merge deploy step; one AI-log entry.

**Acceptance Criteria:**
- Given Home, when it renders, then the sections after the hero are doors, products (mist, linen), services (paper), 4-D (navy), news (mist), capture (amber, last before the footer).
- Given the news section, when inspected, then the server HTML holds the cards (no client fetch).

## UX checks

Sources: SPEC CAP-1..5; `EXPERIENCE.md` News card, States (Home news), Responsive, Spotlight card; `DESIGN.md` News card, Category tag, Media frame, Typography (mono dates), Home surfaces line 438; epic-3 context (3.5 static cards).

| Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| --- | --- | --- | --- | --- | --- | --- |
| News section | page load | — | mist band after the navy 4-D, before the amber capture; H2 "Latest from XionTech." | — | CAP-4, CAP-5, DESIGN.md 438, brand rule | ✅ Chrome 1280 (pre-merge walk): mist gradient, after the 4-D process and before the capture band; H2 "Latest from XionTech."; "See all news" → `/news` |
| Sample note | stories exist | — | small italic muted "[Placeholder] Sample stories…" under H2 | — | CAP-3 | removed on 2026-10-04 (lead): the 3 published posts are real, written only from confirmed facts, so the note would be false |
| News grid | ≥3 stories | — | 3 cards, newest first | — | CAP-1 | test `home-news.test.tsx` (3 cards), `latest-posts.test.ts` (order desc, [0...3]) |
| News grid | 1–2 stories | — | only those cards, no empty slots | — | CAP-1 | test `home-news.test.tsx` (1 story) |
| News grid | 0 stories | — | no grid, no note; "See all news" stays | — | CAP-2, EXPERIENCE.md States | test `home-news.test.tsx` (0 stories) |
| News card | page load | — | 16:10 empty frame (faint navy grid), mono date `18 SEP 2026`, tag, title 1.08rem, excerpt, "Read story →"; 24px radius | — | DESIGN.md News card, Media frame | ✅ dev site 2026-10-04: 24px radius, 16:10 frame, mono date "4 OCT 2026", tag, title, excerpt (`walk-dev-output.txt`) |
| Category tag | product story | — | amber pill, navy text, "PRODUCT · PXP" | — | DESIGN.md Category tag | ✅ dev site: "PRODUCT · PXP" tag on the PXP post |
| Category tag | other story | — | mist pill, navy text, e.g. "TEAM" | — | DESIGN.md Category tag | ✅ dev site screenshot `home-news-dev-1280.png`: "COMPANY" mist pill on the offices post; colour by class (unit test) |
| Read story | click / Enter | mouse, keyboard, touch | opens `/news/[slug]` (Not found until 6.2) | — | EXPERIENCE.md News card | ✅ dev site: click opens `/news/pxp-the-school-day-in-a-parents-pocket` (Not found until 6.2) |
| Read story, See all news | focus | keyboard | 2px focus ring | — | T9 | ✅ dev site: Tab reaches Read story, `:focus-visible`, solid 2px ring |
| Read story, See all news | hover | mouse | arrow moves 4px right | 0.3s | prototype `.link-arrow:hover` | ✅ dev site: arrow moves 4px (x 156 → 160) |
| News card | hover | mouse | no glow, no lift (after demo) | — | epic-3 context (3.5 slice) | partly: dev site shows no card shadow on hover; the lift was not measured (the page scrolled between the two readings) |
| News grid | width 900px or less | — | 2 columns | — | EXPERIENCE.md Responsive | ✅ dev site: 2 columns at 900 |
| News grid | width 640px or less | — | 1 column | — | EXPERIENCE.md Responsive | ✅ dev site: 1 column at 640 and 390, no sideways scroll |
| Capture band | page load | — | "See it working at your school." last before footer | — | CAP-4 | test `page.test.tsx` (capture last), `no-js.test.tsx` (news before capture in server HTML) |

## Implementation Notes

- 2026-10-04: Tasks 2 and 3 were one dispatch (`categoryTag` reads the labels from the copy module). Per-task reviews were skipped on the controller's instruction (one review layer in this build; the full `bmad-code-review` runs before the PR); the controller checked each diff.
- `newsDate` uses `en-US` `formatToParts`: `en-GB` gives "SEPT".
- `HomeNews` is stubbed in `page.test.tsx` and `no-js.test.tsx`: `server-only` is not installed outside the Next.js compiler, and an async component cannot render to static markup. `home-news.test.tsx` renders the awaited component.
- Matrix row "Sanity fails" had no test; added `lets a failed fetch reach the caller` (8959229).
- The news card frame reuses `.home-media` (empty media frame) with a 16:10 ratio; "See all news" gets 32px only after a grid (`.news-grid + .link-arrow`).

## Spec Change Log

## Review Triage Log

Review on 2026-10-04: one layer (Edge Case Hunter), on the controller's instruction; Blind Hunter, Verification Gap, Acceptance Auditor and Security Auditor skipped here and covered by the full `bmad-code-review` before the PR. The two task `minor` rows from the ledger are included.

| # | Finding | Verdict | Route | Evidence |
| --- | --- | --- | --- | --- |
| 1 | `categoryTag` reads inherited keys ("toString") (Edge; also ledger Task 2 minor) | low | patch | `categoryLabels` is a plain object, so `categoryLabels["toString"]` is a function and the card would render it; an own-key lookup is a direct correction. |
| 2 | Invalid `publishedAt` string makes `formatToParts` throw and Home fail (Edge) | low | reject | Only the Studio writes posts and its `datetime` input always stores ISO; reaching it needs a hand-made API write. The fix adds a guard branch. |
| 3 | Future `publishedAt` shows a scheduled story now (Edge) | low | reject | Only published documents are read (`perspective: published`); the spec has no scheduling. A `now()` filter in a tag-cached query would also stay stale until the next publish. |
| 4 | Empty-string title or slug passes `defined()` (Edge) | low | reject | The Studio unsets a cleared string field rather than storing `""`, and the post slug is generated from the title; the extra filters add complexity for a case editors do not meet. |
| 5 | Hand-typed slug with "/", "?", "#" breaks the Read story path (Edge) | low | patch | The post slug has no validation and can be typed; `encodeURIComponent` is a direct correction and a no-op for normal slugs. |
| 6 | "See all news" opens Not found until `/news` exists (Edge) | false | reject | Intended: CAP-2 keeps the link; Story 6.1 builds `/news` next (and 6.2 the story page, EXPERIENCE.md says Read story shows Not found until then). |
| 7 | News card pulls the server-only Sanity client through `latest-posts.ts`, so a 6.1 client island cannot import it (Edge claim; also ledger Task 4 minor) | maybe-false | defer | True if 6.1 imports the card into a client component; 6.1 says the chip filter is the only client part and the list is server HTML, so the server page can render the cards. Settled when 6.1 is built. |

Patch re-review (task reviewer, sonnet): pass, 0 Critical, 0 Important; its Minor (other slug links) became the similar-check entry in `deferred-work.md` (`open-roles.tsx:26`).

## Design Notes

- Async `HomeNews` fetches by itself so `page.tsx` gets only an import and a render line (SPEC ownership constraint); tests call `await HomeNews()` and render the result.
- Dates use `Asia/Ho_Chi_Minh` because the Demo-day editor publishes from HCMC; UTC would show the day before for early-morning posts.
- The sample note hides with the grid: with no stories it would describe nothing.
- The card frame is decorative (`aria-hidden`), no text: DESIGN.md "Media frame" empty state; there is no image field yet.

## Verification

**Commands:**
- `npm run lint && npm run typecheck && npm run format:check` -- expected: exit 0
- `npm test` -- expected: all pass
- `npm run test:coverage && npm run coverage:diff` -- expected: 100% changed lines, branches ≥ 80% on changed files
- `npm run build`, `npm run test:smoke`, browser walk -- done in the main checkout: build passes, smoke 8 passed; walk of the empty state (card rows after merge) -- (controller; Turbopack rejects the worktree junction)

## Acceptance Evidence

Captured after the step-04 review patches on 2026-10-04.

**Commands**

- `npm run lint && npm run typecheck && npm run format:check` -- exit 0 -- All matched files use Prettier code style!
- `npm test` -- exit 0 -- Test Files 51 passed (51), Tests 781 passed (781)
- `npm run test:coverage && npm run coverage:diff` -- exit 0 -- diff-cover 17 lines, 0 missing, 100%; C1 ok: 5 changed files with branch coverage >= 80% (project branches 97.82%)

**Observed**

- Home news section in jsdom: 3 / 1 / 0 stories, sample note, "See all news", card date `18 SEP 2026`, tag, "Read story" to `/news/<encoded slug>`; section rhythm [doors, mist + linen, paper, navy, mist, amber] -- `home-news.test.tsx`, `news-card.test.tsx`, `page.test.tsx`, `no-js.test.tsx`

**Artifacts**

- spec-3-7-home-news-demo-capture-evidence/verification-after-review.txt -- 3697 bytes -- sha256 64bbcd6ee5c6 -- the three declared commands after the review patches
- spec-3-7-home-news-demo-capture-evidence/observed.md -- 1517 bytes -- sha256 aeabcb44aed2 -- what was and was not observed
- spec-3-7-home-news-demo-capture-evidence/verification.txt -- 3651 bytes -- sha256 6b72f710d71e -- the same commands before the review patches (history)

**Not captured**

- `npm run build`, `npm run test:smoke` and the browser walk (UX rows for looks, hover, focus, 900px / 640px): Turbopack rejects the worktree's `node_modules` junction; pending (controller).

Full `bmad-code-review` on 2026-10-04 after rebasing onto `develop` (0e60f7e), 5 layers. Security: clean. Acceptance: CAP-1 to CAP-5 logic met.

- patch (lead decisions, 2026-10-04, A9): Home no longer fails with the news fetch: `HomeNews` logs a failed fetch ("Home news: could not load the latest posts from Sanity") and shows its no-stories state, and `newsDate` returns "" for an unreadable date. This replaces this spec's "Sanity error propagates" row for Home (the Home page is prerendered, so a Sanity outage would have failed the build). The Studio now requires the post `slug` and `publishedAt`.
- patch (docs): the post-merge steps now name slug, Published at, category, a `[Placeholder]` title and 3 posts; the only published post had no slug or date, so Home showed 0 cards.
- patch (test): the news tests now check that every class has a CSS rule (`undefinedClasses`), like the other Home sections.
- defer (Minor, `deferred-work.md`): hard-coded font sizes next to the `--text-*` tokens; no excerpt line clamp; schema values and labels in two places; the fixed sample note will also label real stories; a weak `aria-hidden` query; no static-HTML test of real cards; the `.sec-head ~ .link-arrow` hover reaches other sections; `epic-3-context.md` mixes after-demo items; ANSI codes in the verification files; pre-rebase commit hashes in this spec.

Second full review of the fixes (2026-10-04, 5 layers): no Critical; Security clean; Verification Gap found every fix guarded by a test.

- patch (docs only): `docs/sanity.md` now says how to recover after an outage (re-publish a post or redeploy; the empty news section is cached until then), and that a post also needs an English title; the schema test name no longer claims slug and date alone are enough.
- follow-up for the lead (similar check): `/careers` (Story 6.5) still lets a Sanity error fail the page and the build; the same guard could be applied there.
- defer (Minor): an optional time-based refresh for Home so news recovers by itself; the empty `<time>` for an unreadable date; the console spy restore in the failure test; the frozen I/O row still reads "error propagates" (overridden by A9 as noted above); `docs/sanity.md` step 3 still says one post; a shared validation-rule helper.

After merge (2026-10-04): the lead deployed the Studio and the controller published 3 posts written only from confirmed facts (A7 product copy, verified offices; no invented events or numbers). The card rows were walked on https://xiontech-dev.vercel.app (`walk-dev-output.txt`). The first webhook refresh cached 0 cards because the Sanity CDN still returned the old result; a second save showed 3. Follow-up PR: the client reads past the CDN, and the sample note is removed.
