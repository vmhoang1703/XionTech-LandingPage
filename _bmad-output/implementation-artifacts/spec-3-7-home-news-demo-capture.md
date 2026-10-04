---
title: 'Story 3.7: Home latest news, demo capture and section rhythm'
type: 'feature'
created: '2026-10-04'
status: 'in-progress'
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
- [ ] `studio/schemas/post.ts` -- add `category` and `app` (A9) -- tag source.
  - red: `studio/schemas/schemas.test.ts` -- post has a required `category` with the four values and an `app` with the four apps, hidden unless category is product
- [ ] `src/lib/news/latest-posts.ts` -- `getLatestPosts()`: posts with `defined(slug.current) && defined(title.en) && defined(publishedAt)`, `order(publishedAt desc)[0...3]`, flat projection (slug, title, excerpt, publishedAt, category, app), tag `post`; `newsDate(iso)` → `18 SEP 2026` in `Asia/Ho_Chi_Minh`; `categoryTag(post)` → label or null -- CAP-1 data.
  - red: `src/lib/news/latest-posts.test.ts` -- query filter, order, limit, projection and tag; date format; tag labels incl. product app and unknown category
- [ ] `src/content/news.ts` -- heading, sample note `[Placeholder] Sample stories. Replace with real news before launch.`, "See all news", "Read story", category labels -- one copy module.
- [ ] `src/components/news/news-card.tsx` -- `article.spot.ncard`: `aria-hidden` 16:10 empty frame, `<time dateTime>` mono date, `.cat` (`.cat.product` amber), `h3` title, excerpt, "Read story" `Link` to `/news/{slug}` with the title in an `sr-only` suffix -- CAP-1.
  - red: `src/components/news/news-card.test.tsx` -- date, tag, title, excerpt and link href/name; product tag amber class; no tag/excerpt when missing
- [ ] `src/components/news/home-news.tsx` -- async section `sec surface-mist`, `aria-labelledby="news-h"`, H2, sample note and grid only when stories exist, "See all news" to `/news` always -- CAP-1..3.
  - red: `src/components/news/home-news.test.tsx` -- 3, 1 and 0 stories; note starts `[Placeholder]`
- [ ] `src/app/globals.css` -- port `.ncard`, `.ncard .frame`, `.meta`, `.cat`, `.cat.product`, `.sample` with tokens.
- [ ] `src/app/page.tsx`, `src/app/page.test.tsx` -- add the render line; mock `HomeNews`; test order process → news → capture last, and the surface rhythm -- CAP-4, CAP-5.
  - red: `src/app/page.test.tsx` -- news section sits between the 4-D band and the capture band
- [ ] `_bmad-output/specs/decisions-2026-10-01.md`, `docs/sanity.md`, `docs/ai-log.md` -- record A9 (2026-10-04) and the post-merge deploy step; one AI-log entry.

**Acceptance Criteria:**
- Given Home, when it renders, then the sections after the hero are doors, products (mist, linen), services (paper), 4-D (navy), news (mist), capture (amber, last before the footer).
- Given the news section, when inspected, then the server HTML holds the cards (no client fetch).

## UX checks

Sources: SPEC CAP-1..5; `EXPERIENCE.md` News card, States (Home news), Responsive, Spotlight card; `DESIGN.md` News card, Category tag, Media frame, Typography (mono dates), Home surfaces line 438; epic-3 context (3.5 static cards).

| Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| --- | --- | --- | --- | --- | --- | --- |
| News section | page load | — | mist band after the navy 4-D, before the amber capture; H2 "Latest from XionTech." | — | CAP-4, CAP-5, DESIGN.md 438, brand rule | |
| Sample note | stories exist | — | small italic muted "[Placeholder] Sample stories…" under H2 | — | CAP-3 | |
| News grid | ≥3 stories | — | 3 cards, newest first | — | CAP-1 | |
| News grid | 1–2 stories | — | only those cards, no empty slots | — | CAP-1 | |
| News grid | 0 stories | — | no grid, no note; "See all news" stays | — | CAP-2, EXPERIENCE.md States | |
| News card | page load | — | 16:10 empty frame (faint navy grid), mono date `18 SEP 2026`, tag, title 1.08rem, excerpt, "Read story →"; 24px radius | — | DESIGN.md News card, Media frame | |
| Category tag | product story | — | amber pill, navy text, "PRODUCT · PXP" | — | DESIGN.md Category tag | |
| Category tag | other story | — | mist pill, navy text, e.g. "TEAM" | — | DESIGN.md Category tag | |
| Read story | click / Enter | mouse, keyboard, touch | opens `/news/[slug]` (Not found until 6.2) | — | EXPERIENCE.md News card | |
| Read story, See all news | focus | keyboard | 2px focus ring | — | T9 | |
| Read story, See all news | hover | mouse | arrow moves 4px right | 0.3s | prototype `.link-arrow:hover` | |
| News card | hover | mouse | no glow, no lift (after demo) | — | epic-3 context (3.5 slice) | |
| News grid | width 900px or less | — | 2 columns | — | EXPERIENCE.md Responsive | |
| News grid | width 640px or less | — | 1 column | — | EXPERIENCE.md Responsive | |
| Capture band | page load | — | "See it working at your school." last before footer | — | CAP-4 | |

## Implementation Notes

## Spec Change Log

## Review Triage Log

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
- `npm run build`, `npm run test:smoke`, browser walk -- pending (controller; Turbopack rejects the worktree junction)
