---
title: 'Story 1.6 (motion part): inner hero aurora, strand ribbon and highlight draw-in'
type: 'feature'
created: '2026-10-04'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context: ['{project-root}/AGENTS.md']
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Inner page heroes (`hero-light`, `hero-navy`, `hero-amber`) are static, while the prototype gives them the same kind of motion as the Home silk: a drifting aurora glow and a flowing strand ribbon, plus a highlight mark that draws in. Source: `epics.md` Story 1.6 ACs 3 and 4 (FR-8, NFR-2, UX-DR9, UX-DR11): "aurora and the strand ribbon move, stop within 5s and hold the frame, and the ribbon pauses off screen; all background art is `aria-hidden`" and "one phrase gets the mark, drawn in over 1.2s after 0.5s, static under reduced motion". Breadcrumbs and anchor landing (the rest of 1.6) are out of scope.

**Approach:** One shared client component `src/components/sections/hero-art.tsx` (`<HeroArt tone="light" | "navy" | "amber" />`) renders an `aria-hidden` aurora layer and an `aria-hidden` strand canvas; the drawing is ported from the prototype `site.js` into `src/components/sections/strands.ts`. CSS (aurora per tone, 5s drift held at the end, strand canvas placement, `.hl::after` draw-in) goes in a Shared hero motion section of `globals.css` `@layer components`; `@theme` untouched; 1.1's global reduced-motion rule stops every animation. Applied now to Andy's `/demo` hero (his OK given via Son Nguyen, 2026-10-04) so his later pages reuse it in one line. Committed on the 3.2 branch (PR #23) at Son Nguyen's request.

</frozen-after-approval>

## UX checks

Sources: `epics.md` Story 1.6 ACs, `EXPERIENCE.md` Motion (Inner page hero background, Highlight mark), prototype `site.css` (`.aurora`, `.strands`, `.hl::after`, v3 "stop within 5s" override) and `site.js` strand ribbon. Checked by the walk in `spec-1-6-inner-hero-motion-evidence/`.

| Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| ---- | --------------- | ----- | ------------------ | ------ | ------ | ------- |
| Aurora (`/demo`, navy) | page load | — | blurred amber glow top right and blue glow bottom left behind the hero, drifting | 5s, then holds | Story 1.6 AC 3, prototype `.hero-navy .aurora` |  ✅ walk: blur 70px, `hero-drift` 5s forwards, z −2; running at 1–2s, finished at 5000ms |
| Strand ribbon | page load | — | ~54 thin pale-blue strands with amber accent strands flowing across the hero, moving | ≤ 5s, then holds the frame | Story 1.6 AC 3, prototype `canvas.strands` |  ✅ walk + unit tests: canvas pixels change between 1s and 2s; 54 strokes, accent every ninth |
| Strand ribbon | after 5s | — | the frame is still (no further change) | after 5s | Story 1.6 AC 3 |  ✅ walk + unit test: canvas unchanged between 6s and 7.5s; aurora finished@5000 |
| Background art | accessibility | — | aurora and canvas `aria-hidden`; nothing focusable; no change to reading order | static | Story 1.6 AC 3 |  ✅ walk + unit test: both `aria-hidden`, 0 focusable |
| Highlight mark | page load | — | the amber bar under "school" draws in from the left | 1.2s after 0.5s | Story 1.6 AC 4, prototype `.hl::after` swipe |  ✅ walk: `hl-draw` 1.2s, delay 0.5s; scaleX < 1 soon after load, 1 after 2s |
| All motion | `prefers-reduced-motion: reduce` | — | aurora still, ribbon drawn once and still, highlight fully drawn at once | static | Story 1.6 AC 3–4, NFR-2 |  ✅ walk + unit test: 0 aurora animations, highlight animation none; ribbon drawn 4 times at load (same frame), 0 draws in the next 2s |
| Hero | JavaScript off | — | aurora shows (CSS), no ribbon, all text readable | static | NFR-2 |  ✅ walk (JS off): aurora visible, canvas undrawn (300×150), H1 readable; `demo-no-js-1280.png` |
| Strand ribbon | hero off screen, then back | — | no drawing while off screen; on return the current (held) frame is painted, also after a resize while away | instant | Story 1.6 AC 3 | ✅ unit tests (no draw off screen; held frame t=9 on return; repaint after an off-screen resize) + walk: hero fully off screen, resized, back → repainted (old code: not repainted) |
| `/demo` | 1280px / 390px | — | text and form unchanged above the art; no sideways scroll | static | CAP of Story 2.2 unchanged |  ✅ walk: no sideways scroll at 1280 / 390; screenshots |

## Implementation Notes

- New: `src/components/sections/strands.ts` (ribbon drawing, ported from `site.js`; canvas colours written out like the silk shader), `src/components/sections/hero-art.tsx` (client: aurora + canvas, 5s then hold, off-screen skip, one still frame under reduced motion), a Shared hero motion section in `globals.css` `@layer components` (`.page-hero` stacking context, `.aurora` per tone with a 5s held drift, `.strands`, `.hl::after` draw-in). Applied to Andy's `src/app/demo/page.tsx` with one line.
- The `.hl` draw-in is global, so the Home hero's "connected" draws in too (Story 1.6 AC 4 applies to every hero highlight).
- Test first: `npx vitest run src/components/sections` failed (no modules), then 9 passed; `/demo` test 1 failed, then passed.
- A first draft guarded `ctx.setTransform?.()` only because the test's fake context lacked the method — test-only logic in production code; the fake now has it and the guard is gone.
- The walk's first reduced-motion check reported motion. Tracing every resize, clear and stroke showed 4 draws at load (same frame) and none after; the changing pixel read was the canvas read back before its first paint. The walk now counts draw calls. The first `/demo` check compared a screenshot strip that the form card covers; it now reads the canvas pixels and the aurora's `getAnimations()`.

## Review Triage Log

Full `bmad-code-review` (4 layers: Blind Hunter, Edge Case Hunter, Verification Gap, Acceptance Auditor), 2026-10-04:

- Ribbon never redrawn when the hero comes back on screen: a run that ended off screen kept a mid-run frame, and a resize while off screen left it blank (all 4 layers) — high, patched test-first: the observer repaints when the hero becomes visible again; two unit tests and a walk line (hero fully off screen, resize, back). The same walk on the old code fails.
- Observer read `entries[0]` instead of the newest entry — low, patched (`entries.at(-1)`).
- `.page-hero` stacking rules applied to every inner hero, clipping anything past its edges — medium, patched: scoped to `.page-hero:has(> .aurora)`.
- `/demo` test restored mocks at the end of the test body — low, patched (`afterEach`, null check on the hero).
- Light-tone accent `rgba(230,173,0)` is not DESIGN.md amber-decor (201,151,0) — real, the prototype's own value; the comment now says so. Pending Amber (only the light tone uses it; no page uses that tone yet).
- "Pauses off screen" skips drawing but the 5s clock keeps running — accepted reading: no work off screen, and the held frame is shown on return; recorded here.
- Reduced motion read once, no `change` listener — low, rejected: the ribbon stops within 5s anyway.
- `size()` runs twice at mount; no devicePixelRatio change listener — low, rejected: no visible harm (4 identical draws at load, measured).
- Highlight draw-in also runs on the Home hero — false: intended (Story 1.6 AC 4 covers every hero highlight; Implementation Notes).
- `hero-light` / `hero-amber` aurora unused on a page — low, rejected: shared styles for Andy's later pages; `/demo` is the only inner hero today.
- No spec or UX checks for the scope change — false: this build spec and its UX checks table (outside `src/`, so not in the reviewed diff).
- `hl-draw` relies on an implicit `to` — low, rejected: the walk shows the mark at full scale after 2s.

