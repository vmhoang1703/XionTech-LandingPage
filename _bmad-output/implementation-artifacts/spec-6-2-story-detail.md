---
title: 'Story 6.2 Story detail page'
type: 'feature'
created: '2026-10-05'
status: 'done'
route: 'oneshot'
review_loop_iteration: 1
context:
  - '{project-root}/AGENTS.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Every "Read story" link on Home and News opens the Not found page, because `/news/[slug]` does not exist (SPEC `_bmad-output/specs/andy/spec-6-2-story-detail/SPEC.md`, CAP-1 to CAP-4).

**Approach:** A server-rendered `/news/[slug]` page from Sanity: light hero with crumbs Home / News / title, H1, mono date and category tag; a decorative 16:9 photo frame; the body; "See <app>" to `/products#<app>` for a product story; "Back to News". Own title and meta description per story; no capture band. An unknown or incomplete slug renders the Story 1.7 Not found page with HTTP 404.

Lead decisions that override the SPEC: A11 (`useCdn: false`; never `force-dynamic`, `no-store` or a time-based `revalidate`) and A9 (real posts, no `[Placeholder]` titles, no sample note). A story shows only when it passes Home's filter (slug, English title, date). An unknown slug must not cost a Sanity request: the page checks it against the cached post list first (the security note from the #39 review).

</frozen-after-approval>

## UX checks

Sources: SPEC CAP-1..4, `EXPERIENCE.md` (News story row, capture band rule, dates in mono), `DESIGN.md` (category tag, buttons), mockup `news-story.html` + `site.css` (`.story-body`, `.story-media`), T9 focus ring.

| Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| --- | --- | --- | --- | --- | --- | --- |
| Hero | page load | — | light hero; crumbs Home / News / story title (Home and News links, title current); H1 story title; mono date `4 OCT 2026` and the category tag (amber "PRODUCT · PXP" for product) | — | CAP-1, CAP-2, mockup | ✅ Chrome 1280 (prod build): crumbs Home / News / title (links Home, News; title `aria-current`), H1, mono date "4 OCT 2026", amber "PRODUCT · PXP" (`walk-output.txt`, `story-1280.png`) |
| Body | page load | — | 16:9 frame, then the story paragraphs (a block styled as a heading shows as H2), 720px reading column | — | CAP-1, mockup `.story-body` | ✅ Chrome: 16:9 frame (672 x 378), 4 paragraphs in a 720px column; the H2 path by unit test (`page.test.tsx` "renders crumbs, H1, mono date and tag…"); no body: the excerpt shows ("shows the excerpt when the story has no body text") |
| Links | product story | mouse, keyboard | "See PXP" goes to `/products#pxp`; "Back to News" goes to `/news`; glass buttons with arrows | — | CAP-1, mockup | ✅ Chrome: "See PXP" lands `/products#pxp` and "Back to News" lands `/news`, each by click and by Enter |
| Links | other story | — | only "Back to News" | — | developer choice (no product to link) | ✅ Chrome: the Company story shows only "Back to News" |
| Links | Tab | keyboard | 2px focus ring on crumbs and buttons | — | T9 | ✅ Chrome Tab: solid 2px ring on the News crumb and on "See PXP" |
| Read story | click on Home and News | mouse | opens the story page | — | CAP-1, Success signal | ✅ Chrome: News and Home "Read story" open the PXP story |
| Page | page load | — | no email capture band; tab title "<story title> \| XionTech" | — | CAP-1, CAP-3, EXPERIENCE.md | ✅ Chrome: no capture band; tab title "PXP: the school day, in a parent's pocket \| XionTech" |
| Unknown slug | open `/news/no-such-story` | — | Story 1.7 Not found page, HTTP 404 | — | CAP-4 | ✅ Chrome: 404 with "We couldn't find that page."; smoke: 404 with the Not found page's `not-found-title` H1 |
| Page | width 390px | — | one column, no sideways scroll | — | EXPERIENCE.md Responsive | ✅ Chrome: no sideways scroll (`story-390.png`) |

## Implementation Notes

- Reuse: `getAllPosts` (`src/lib/news/all-posts.ts`, cached under tag `post`) to check the slug; `newsDate`, `categoryTag`, `LatestPost`; `sanityFetch` with `params`; the `hero-light page-hero`, `crumbs`, `meta`, `cat`, `btn btn-glass`, `home-media` (frame look) classes; the careers job page pattern (no `loading.tsx`, `notFound()`).
- New: `src/lib/news/post.ts` (`getPost(slug)`, own GROQ query, T2), `src/app/news/[slug]/page.tsx` with `generateMetadata`, copy in `src/content/news.ts`, `.story-body` / `.story-media` CSS, a `@smoke` e2e for the 404.
- My choices: no `generateStaticParams` (pages render on first visit and stay cached by tag, like the job page); the body is plain paragraphs and H2s from the blocks (`pt::text`), with no links or images yet; a non-product story has no product link; the description is the excerpt, else the News description.
- Red first: `npx vitest run src/lib/news/post.test.ts "src/app/news/[slug]"` failed (no `post`, no `page`), then passed after the code (49 news tests).
- Checks: lint, typecheck, format pass; `npm run test:coverage -- --maxWorkers=3` 1033 passed; diff coverage 100% (21 lines), C1 ok; build passes (`/news/[slug]` renders on demand); smoke 12 passed incl. the `/news/no-such-story` 404.
- The walk script first read the old page after a client-side navigation; it now waits for the URL and the story H1, and checks focus with real Tab presses.
- After the review: the "See <app>" link shows only for a Product story (Sanity keeps a hidden app value when the category changes); with no body text the excerpt shows; a `@smoke` test opens the first story linked from `/news` and expects 200 with its H1; the 404 smoke checks the Not found page's H1 id. Smoke 13 passed.
- Checks after the fixes: lint, typecheck, format pass; `npm run test:coverage -- --maxWorkers=3` 1035 passed; diff coverage 100%, C1 ok; build passes; smoke 13 passed (the real-story test now also checks that `/news` answers 200). Blocks of only spaces count as empty.

## Review Triage Log

Full `bmad-code-review`, 5 layers, 2026-10-05. Security clean (unknown slugs cost no Sanity request; `/news/[slug]` is `ƒ` in the build, so nothing is stored per unknown path).

| # | Finding | Verdict | Evidence / action |
| --- | --- | --- | --- |
| 1 | "See <app>" shows for a non-product story with a leftover app (Acceptance, Edge, Verification Gap) | medium | patch: link only when `category === "product"`; test "shows no product link when the category is not Product…" |
| 2 | A story with no body text renders an almost blank page (Blind Hunter) | medium | patch: the excerpt shows; tests for both empty cases |
| 3 | UX rows marked ✅ for keyboard and crumbs that the walk had not checked (all layers) | medium | patch: the walk now presses Enter on both buttons and measures the crumb focus ring; rows updated |
| 4 | No automated check opens a real story (Verification Gap) | medium | patch: `@smoke` test for the first story on `/news` |
| 5 | `/careers/[slug]` still costs one Sanity request per unknown slug (Security, similar check) | low | deferred: copy the list-first check into `getOpenRole` (its tests read the first fetch call) |
| 6 | Other Minor points: `productAnchor("")`, crumb separators read aloud, lists/quotes/h3+ flattened, empty `<time>`, no Open Graph tags, `getPost` called twice, duplicated crumb copy, no branded error page, hand-typed slug encoding, empty photo frame with no `[Placeholder]` caption | low | deferred in `deferred-work.md` |

Second full round, 5 layers, on the fixes (132 lines). Security clean. Patched: the real-story smoke now fails when `/news` itself fails (it skipped before); blocks or an excerpt of only spaces count as empty; the spec records the checks run after the fixes. One Edge Case layer on those last 29 lines asked for this round-2 entry and the removal of the fixed whitespace item from the deferred lists. Other points are Minor.
