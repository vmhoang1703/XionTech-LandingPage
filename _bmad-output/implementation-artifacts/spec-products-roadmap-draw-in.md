---
title: 'Products roadmap: draw-in animation and tests'
type: 'feature'
created: '2026-10-12'
status: 'in-review'
route: 'dispatch'
review_loop_iteration: 1
baseline_commit: '05715566d6b554837d9fd1ef04ee3cb6edd25e76'
context:
  - '{project-root}/AGENTS.md'
  - '{project-root}/docs/ux-checks.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The 2D winding roadmap on `/products` (quick dev, branch `feature/products-journey-board`) is static, has no tests, and the branch still carries files from earlier explorations. The products page test fails, and so does the type-scale test (weight 700).

**Approach:**
- Add one **draw-in** animation. When the roadmap first scrolls into view, the road draws itself from Start to Finish, each pin pops in as the road reaches it, and each card slides in just after its pin. It plays once, in about 2.5s.
- Bring the branch up to standard:
  - remove the unused exploration code and dependencies;
  - test the roadmap, the stop modal, the badge, the dialog opener and the content;
  - update the page and e2e tests.
- Decision (Sammy, 2026-10-12): only the draw-in; no bus, no hover pulse, no flowing line.

## Boundaries & Constraints

**Always:**
- **Phases:** the reveal follows the `FlowReveal` pattern (`src/components/sections/flow-reveal.tsx`):
  - server HTML, no JS and reduced motion stay `static`, fully drawn;
  - a roadmap already in view at load plays the draw-in about 0.3s after load (decision, Sammy 2026-10-12: at common desktop sizes the roadmap is 33–70% in view at load, so "no replay" meant desktop never animated);
  - otherwise it is `armed` until 30% visible, then `on`, once.
  - **Phones** (decision, Sammy 2026-10-12, after the 30% rule got stuck on short screens): below 1100px each stop's bend, pin and card reveal as that stop scrolls in (25% of the stop), with short fixed delays; the roadmap stays `armed` while stops mark `data-in`.
- **Armed state** (decision, Sammy 2026-10-12, after axe failed on dimmed text): waiting cards are wiped out of view with `clip-path` and offset, and wipe in from their side; pins pop by scale. No opacity on text, and never `display`/`visibility`/`opacity: 0` (`contrast.test.ts`). The road is masked. Everything stays fully visible without JS, under reduced motion and once revealed.
- **Order:** the pins and cards appear in road order; each delay follows its position along the road.
- **Reduced motion:** no movement at all (the global rule, plus `static`).
- **Content and links unchanged:** the content, the cards, the modal, the anchors `#pxp`/`#sxp`/`#ai-tutor`/`#iot` and the narrow layout (one bend per card) stay as they are. The animation works on both layouts.
- **No weight 700 in CSS** (`type-scale.test.ts`). DESIGN.md tokens only.

**Never:** no loop or continuous motion (so no Pause button); no new dependency; no 3D; no change to the copy.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| HAPPY_PATH | Scroll the roadmap into view | Road draws Start→Finish, pins then cards appear in order, all visible by ~2.5s | N/A |
| ALREADY_VISIBLE | Roadmap in view at load | Draw-in plays about 0.3s after load (phones: stops in view play the same way) | N/A |
| REDUCED | `prefers-reduced-motion: reduce` | Static and fully drawn, no animation | N/A |
| NO_JS | JavaScript off | Static and fully drawn | N/A |
| NARROW | Width < 1100px | Bends, pins and cards reveal in order down the page | N/A |

</frozen-after-approval>

## Code Map

- `src/components/products/journey/road-map.tsx` -- the roadmap (client): the wide SVG road (`ROAD`, `POINTS`, `W` 1400 × `H` 820), the narrow per-card bends (`BEND`), pins, cards and the modal state. The reveal goes here.
- `src/components/products/journey/journey-section.tsx` -- section `#map`: H1, lede, `.rm-head`, `RoadMap`.
- `src/components/products/roadmap/road-stop-dialog.tsx` -- the stop modal: Previous/Next, close, backdrop, hand-over to the app dialog via `openAppDialog`, and all apps on the last stop. Untested.
- `src/components/products/map/map-badge.tsx`, `open-app-dialog.ts` -- used by the roadmap and the modal. Untested.
- `src/content/products.ts` -- the roadmap uses `dayRoad` and `journeyBoard`, and `journeyMap.intro`.
  - Unused after the cleanup: `journeyMap.places`, `hub`, `openLabel`, `listHeading` and `motion`, plus `dayRoad.tour`.
  - `journeyBoard.timeLabel` is unused too.
- **Unused explorations to delete:**
  - `src/components/products/map/journey-canvas.tsx`, `journey-list.tsx`, `journey-map.tsx`, `journey-scene.ts` and its test;
  - `src/components/products/roadmap/day-roadmap.tsx`, `day-tour.tsx`, `tour-scene.ts`;
  - then the `three`, `@types/three` and `motion` dependencies (no other importer);
  - the CSS blocks `/* Products map */` and `/* Products tour */`;
  - the `AGENTS.md` stack rows: Animation goes back to "Motion (to be added)" and the 3D row is removed.
- `src/components/sections/flow-reveal.tsx` -- the phase pattern to copy. Its armed CSS is about `globals.css:3051`.
- `src/app/globals.css` -- the `/* Products roadmap (2D) */` block, and `.road-dialog*`. Weight 700 is used in `.rm-pin`, `.map-hub` and others; the type-scale test forbids it.
- `src/app/products/page.test.tsx` -- still expects the audience flow. `e2e/products.spec.ts` still describes the flow. `e2e/a11y.spec.ts` lists `/products` in STATIC_PAGES and KEYBOARD_PAGES.

## Tasks & Acceptance

**Execution:**
- [x] Cleanup -- delete the unused exploration files, their CSS blocks, the unused content keys, and the `three`/`@types/three`/`motion` dependencies; restore the `AGENTS.md` rows; replace weight 700 in the roadmap and dialog CSS with the type-scale weights.
  - red: `src/app/type-scale.test.ts` -- currently fails on weight 700 (the existing failing test is the red).
- [x] `src/content/products.test.ts` -- tests for `dayRoad` (6 stops in order; times and copy as in the prototype; IoT stop uses IoT's feature title and tagline, no time) and `journeyBoard` (every stop has a lane; lane apps match `apps.ts`; the last stop is "all").
  - red: `src/content/products.test.ts` -- a lane check over every stop id, observed failing against a deliberately missing lane before adding the real assertion set.
- [x] `src/components/products/map/map-badge.test.tsx`, `open-app-dialog.test.ts`, `src/components/products/roadmap/road-stop-dialog.test.tsx` -- badge text/icon; the opener opens `dialog#pd-{anchor}` and returns focus on close, returns false without the dialog; the modal opens for an index, Previous/Next move, edge buttons are disabled, the close button and backdrop close it, the app section shows Made for and features, "Open … details" hands over to the app dialog, the last stop lists all four apps.
  - red: `road-stop-dialog.test.tsx` -- the backdrop click outside the box closes the dialog (write it against a broken coordinate check first).
- [x] `src/components/products/journey/road-map.tsx` + `globals.css` -- the draw-in: phases on `.rm` (`data-reveal`), a mask path drawing the wide road (pathLength 1, dashoffset), per-stop `--delay` from road position; the narrow bends reveal top to bottom with clip-path; the armed CSS only under `[data-reveal="armed"]`; transitions only under `[data-reveal="on"]`.
  - red: `src/components/products/journey/road-map.test.tsx` -- static without JS and under reduced motion; armed then on after 30% intersection; already visible at load → on; delays increase in road order; six cards, each opens the modal; CSS rules hide nothing without the attribute.
- [x] `src/app/products/page.test.tsx`, `e2e/products.spec.ts` -- page order `#map` → `#apps` → navy band; only defined classes. E2E (`@a11y` and `@smoke` as before):
  - roadmap visible with 6 cards;
  - scroll-in plays and everything is visible after it;
  - reduced motion shows everything at once;
  - a card opens the modal, Next moves, Esc returns focus to the card;
  - "Open … details" opens the app dialog;
  - 390px has no sideways scroll;
  - the `#ai-tutor` deep link still lands on its card.

**Acceptance Criteria:**
- Given 1280px, when the roadmap scrolls into view, then the road is fully drawn and every pin and card is fully visible within 3s, with CLS < 0.1.
- Given `/products`, when axe runs (`@a11y`), then there are no WCAG 2.2 AA violations, and Tab reaches the six cards in road order.
- Given the build, then no page's first-load JS contains three.js, and `three`/`motion` are no longer in `package.json`.

## UX checks

| Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| --- | --- | --- | --- | --- | --- | --- |
| Road | Scroll into view at 1280px | Mouse wheel, touch, keyboard | Road draws from Start to Finish | ~1.6s linear, so each pin pops as the road reaches it (pins and cards use `--ease-brand`) | Sammy 2026-10-12  | ✅ walk wide-400/1200/3000ms: road draws Start→Finish, pins pop as it reaches them |
| Pins | Road reaches a pin | — | Pin pops in (scale) | 300ms, delayed by road position | Sammy 2026-10-12  | ✅ walk screenshots; `road-map.test.tsx` delays in road order |
| Cards | After its pin | — | Card wipes in from its side (up for above, down for below) with a 16px slide | 400ms wipe, starting 120ms after its pin | Sammy 2026-10-12  | ✅ walk: cards wipe in from their side (decision: wipe, not dim); 6 of 6 shown after; e2e scroll-in |
| Already visible | Load with the roadmap in view | — | Draw-in plays right after load | ~0.3s after load | Sammy 2026-10-12 |  |
| Reduced motion | Load with reduced motion | — | Complete roadmap, nothing moves | Static | DESIGN.md:451  | ✅ walk: static, 6 of 6 shown; e2e reduced motion |
| Narrow | 390px, scroll down | Touch | Bends, pins and cards reveal in order; no sideways scroll | Same timings | Spec  | ✅ walk 390: stops reveal as they scroll in; no sideways scroll; e2e 390 |
| Card | Hover, focus, activate | Mouse, keyboard, touch | Border and shadow on hover; focus ring; the modal opens | Instant | Quick dev  | ✅ e2e and walk: modal opens; focus ring (focused card never clipped); 25px title button |
| Modal | Next, Previous, Esc, backdrop | Mouse, keyboard | Moves along the road; closes; focus back on the card | Instant | `road-stop-dialog.tsx`  | ✅ walk: Next, Esc, focus back on the card; `road-stop-dialog.test.tsx` |
| App hand-over | "Open … details" | Mouse, keyboard | The app's dialog opens | Instant | `product-detail.tsx`  | ✅ walk: #pd-sxp opens; e2e hand-over |

## Implementation Notes

## Spec Change Log

- **Task 4 fix round 3 (2026-10-12).** Trigger: axe failed on dimmed (35%) waiting cards. Sammy decided: wipe, hidden until revealed. Amended: the Armed-state line and the Cards UX row. KEEP: static for no JS and reduced motion; the focused card is never clipped.
- **Re-verify (2026-10-12).** Trigger: the walk found desktop never animates (the roadmap is 33–70% in view at load). Sammy decided: play the draw-in on load. Amended: the Phases bullet, the ALREADY_VISIBLE row, the Already-visible UX row.
- **Review (2026-10-12).** Trigger: the acceptance auditor found the phone reveal departs from the 30% phase rule. Sammy decided: per stop on phones. Amended: the Phases bullet. KEEP: one draw-in on wide screens.

## Review Triage Log

| # | Finding | Verdict | Evidence / route |
| --- | --- | --- | --- |
| 1 | Partly visible (<30%) at hydration gets wiped then replays (edge) | medium | `useEffect` arms whenever under 30%; patch: any part in view → on |
| 2 | First IO callback reveals below the threshold (edge) | medium | `isIntersecting` ignores the threshold; patch: check `intersectionRatio` |
| 3 | Printing before scrolling prints an empty roadmap (edge) | medium | Armed clip and mask apply in print; patch: `@media print` shows all |
| 4 | Layout switch replays the 1.6s draw (edge) | low | `showAll` sets `on`; patch: show at once |
| 5 | No e2e that phone stops really appear, or that road and pins are painted (verification-gap) | medium | Only DOM counts at 390px; patch: e2e checks |
| 6 | Stale "dimmed" comment; UX rows say fade / 400ms (blind, auditor) | low | Comment patched; UX rows corrected |
| 7 | Phone reveal departs from the 30% rule (auditor) | medium | Sammy chose per stop; Phases bullet amended |
| 8 | Frozen-intent wipe change approval (auditor) | — | Sammy answered in this session (AskUserQuestion, 2026-10-12); recorded in the Change Log |
| 9 | Reduced motion toggled mid-visit still animates (edge) | false | The global `prefers-reduced-motion` rule sets `transition: none !important` live |
| 10 | Pin delay by x share, not arc length (blind, auditor) | low | The auditor measured ≤ 20ms off; rejected |
| 11 | No IntersectionObserver fallback (blind) | low | Every supported browser has IO; rejected |
| 12 | Wide map taller than viewport/0.3 never reveals (edge) | low | Needs < 205px of viewport height on a ≥ 1100px-wide screen; rejected |
| 13 | Duplicated FlowReveal phase logic (blind, task 4) | low | Possible Sonar CPD; deferred |
| 14 | Faint seams where the phone bends join (walk) | low | Cosmetic; deferred |
| 15 | AI log not updated (blind) | medium | Added in the bookkeeping |
| 16 | Machine paths and evidence blobs; test stubs not restored; magic numbers (blind, minors) | low | Convention or polish; rejected |
| 17 | Lock file consistency (security) | — | Controller grep: no three/motion entries; clean |

## Verification

**Commands:**
- `npm run lint && npm run typecheck && npm run format:check` -- expected: clean
- `npm test` -- expected: all pass
- `npm run test:coverage && npm run coverage:diff` -- expected: 100% changed lines; changed files ≥ 80% branches
- `npm run test:smoke` -- expected: all pass
- `npm run build` -- expected: success
- `npx playwright test --project=a11y` -- expected: all pass

## Acceptance Evidence

Captured at the end of step-03 on 2026-10-12.

**Commands**

- `npm run lint && npm run typecheck && npm run format:check` -- exit 0 -- clean
- `npm test` -- exit 0 -- Test Files 88 passed (88); Tests 1280 passed (1280)
- `npm run test:coverage && npm run coverage:diff` -- exit 0 -- Total 127 lines, Missing 0, Coverage 100%; `products/journey` branches 97.91%
- `npm run test:smoke` -- exit 0 -- 15 passed
- `npm run build` -- exit 0 -- `/products` static
- `npx playwright test --project=a11y` -- exit 0 -- 49 passed (re-capture; the first run had 48 passed and 1 failed on the known Home `.w-more-trigger` flake)

**Observed**

- Walk on a production build (`next start -p 3005`, Chrome), `walk-output.txt`:
  - Wide: armed at load, on after scroll-in, all 6 cards shown after the draw, CLS 0.
  - The modal opens, Next moves, and Esc returns focus to the card. The hand-over opens `#pd-sxp`.
  - Already in view at load → on. Reduced motion → static, all shown.
  - At 390px the stops reveal as they scroll in, with no sideways scroll.
- A cosmetic note: faint light seams where the narrow bends join.

**Artifacts**

- [verification.txt](spec-products-roadmap-draw-in-evidence/verification.txt), [walk.mjs](spec-products-roadmap-draw-in-evidence/walk.mjs), [walk-output.txt](spec-products-roadmap-draw-in-evidence/walk-output.txt)
- `wide-400ms.png`, `wide-1200ms.png`, `wide-3000ms.png`, `reduced.png`, `narrow-step-1..4.png` (hashes in the ledger)

**Not captured**

- Safari and Firefox (Chrome channel only).

