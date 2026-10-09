---
title: 'E-S5 The 404 page is a lost trail'
type: 'feature'
created: '2026-10-09'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
baseline_commit: '61f35590bf7f08c071f30d218b2825f71fdd3b65'
context:
  - '{project-root}/AGENTS.md'
  - '{project-root}/docs/ux-checks.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The 404 page still says "We couldn't find that page." with a "404" label and the shared
hero art. The prototype (`prototype/404.html`; ENH-043, ENH-052; planned spec
`_bmad-output/specs/sammy/spec-enh-s5-not-found/SPEC.md`) turns it into a lost trail that matches the
footer mountain.

**Approach:** Port `404.html`:
- No "404" label. H1 "You’ve wandered off the trail." with the curly apostrophe, no highlight and no
  underline. Lede "The page you were looking for isn’t here. Follow the trail back home, or pick a path
  below." Buttons: primary "Go to Home" → `/`, then glass Products, Services, News.
- Beside the copy (one column at 860px and below): the trail map as an inline SVG (paths, "You are
  here" and "Home" labels from `404.html`), decorative (`aria-hidden`), with the X image
  (`x-mark.webp`, `alt=""`) at "Home". It replaces `HeroArt` on this page only.
- The dotted trail walks and the "here" ring pulses; both stop under reduced motion
  (`site.css:1265-1288`).
- The page still answers HTTP 404, is not indexed, and its title is "Page not found | XionTech".

</frozen-after-approval>

## UX checks

| Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| --- | --- | --- | --- | --- | --- | --- |
| Copy | Load `/does-not-exist` at 1280px | — | No "404" label; H1 "You’ve wandered off the trail." without highlight; prototype lede | Static | ENH-043, ENH-052 |  ✅ walk (no label, no highlight); `not-found.test.tsx`, `e2e/not-found.spec.ts` |
| Buttons | Activate | Mouse, keyboard, touch | "Go to Home" → `/`; Products, Services, News go to their pages; focus rings visible | Instant | `404.html` |  ✅ walk (Go to Home lands on `/`, 2px focus ring); `not-found.test.tsx` |
| Trail map | Load at 1280px / 860px | — | Map beside the copy / below it, max 420px; "You are here" and "Home" labels legible; X at "Home" | Static | ENH-043 |  ✅ walk (beside at 1280, below and 420px at 860, X at Home); `not-found.test.tsx` |
| Trail motion | Load | — | Dotted trail walks, ring pulses | Continuous | `site.css:1271-1275` |  ✅ walk (trail-walk, here-pulse running) |
| Reduced motion | Load with reduced motion | — | Trail and ring do not move | Static | `site.css:1288` |  ✅ walk (animations none, ring hidden); `not-found.test.tsx` |
| Status and title | Request an unknown path | — | HTTP 404; tab title "Page not found \| XionTech"; not indexed | — | Story 1.7 |  ✅ walk (404, title, noindex); `not-found.test.tsx`, `e2e/not-found.spec.ts`, `e2e/job.spec.ts` |
| Width | Load at 390px | — | No sideways scroll; labels still legible | Static | `site.css:1277` |  ✅ walk (no sideways scroll, labels 24px) |

## Implementation Notes

- Built directly (one-shot route). RED: `npx vitest run src/app/not-found.test.tsx` 5 failed | 2 passed (new copy, map, no hero art, title, CSS); GREEN: 7 passed.
- `src/app/not-found.tsx`: navy hero kept for the light text tokens; `HeroArt` removed; `.trail-grid` with the copy and a decorative `figure.trail-map` (inline SVG from `404.html`, X image `public/brand/x-mark.webp`, own logo, byte-identical to the prototype asset). `src/content/not-found.ts`: new copy, title "Page not found | XionTech".
- CSS `/* E-S5 404 */` port of `site.css:1265-1288`. Deviation: the ring fades `stroke-opacity`, not `opacity`, and is hidden under reduced motion with `stroke-opacity: 0`, because `contrast.test.ts` rejects `opacity: 0` / `display: none` hiding rules; the ring is a stroke only, so it looks the same. The ring is centred with `transform-box: fill-box`.
- Not ported: the prototype's `reveal` entrance animation (Tier 2 motion site-wide, as on the other pages).
- `e2e/not-found.spec.ts` and `e2e/job.spec.ts` (unknown job slug) now expect the new H1. The 404 is already in the `@a11y` axe list (`/no-such-page`).
- Noticed, not changed: a 404 response carries two `<meta name="robots" content="noindex">` tags (Next.js adds one for 404s, and the page's `robots` metadata adds the other); harmless.
- Review: full five layers (security clean, verification-gap clean), fixes applied, then a 16-line follow-up with one edge-case layer (clean).
- Evidence: `spec-enh-s5-not-found-evidence/` (verification.txt: lint, 1245 unit tests, diff coverage 100%, 15 smoke, build, 41 a11y; walk.mjs, walk-output.txt, screenshots).


## Review Triage Log

| # | Finding | Verdict | Evidence / route |
| --- | --- | --- | --- |
| 1 | Under reduced motion the still ring stays drawn; the prototype hides it | medium | Hidden with `stroke-opacity: 0`; test covers both rules; patched |
| 2 | Reduced-motion test covered only the trail | low | Regex now pins both rules; patched |
| 3 | `-webkit-mask-image` dropped | low | Added back; patched |
| 4 | Ring origin and X position hard-coded to the viewBox | low | `transform-box: fill-box` for the ring; comment ties `.tm-x` to the viewBox; patched |
| 5 | No `@a11y` coverage of the 404 | false | `/no-such-page` is in `STATIC_PAGES` (axe, one H1, alt text) |
| 6 | Aurora removed although `404.html` keeps one | low | The planned spec says the map replaces `HeroArt` on this page; rejected |
| 7 | `reveal` entrance animation not ported | low | Tier 2 motion site-wide; noted |
| 8 | `>404<` smoke assertion is weak | low | The unit test guards the label; rejected |
| 9 | Hand-kept utility allow-list in the class test | low | Same pattern as other page tests; rejected |
| 10 | E-S3 ENH rows marked Built in this branch | false | Agreed bookkeeping in this branch's first commit; noted in the PR |
| 11 | Security | — | Clean |

## Verification

**Commands:**
- `npm run lint && npm run typecheck && npm run format:check` -- expected: clean
- `npm test` -- expected: all pass
- `npm run test:coverage && npm run coverage:diff` -- expected: 100% changed lines; changed files ≥ 80% branches
- `npm run test:smoke` -- expected: all pass
- `npm run build` -- expected: success
- `npx playwright test --project=a11y` -- expected: all pass
