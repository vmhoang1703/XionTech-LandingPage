---
title: 'Products roadmap: draw-in animation and tests'
type: 'feature'
created: '2026-10-12'
status: 'in-progress'
route: 'dispatch'
review_loop_iteration: 0
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
  - a roadmap already 30% in view at load goes straight to `on`, with no replay;
  - otherwise it is `armed` until 30% visible, then `on`, once.
- **Armed state:** dims, never hides. Cards and pins at opacity ≥ 0.35 and offset. The road is masked, not `display`/`visibility`/`opacity: 0` (`contrast.test.ts`).
- **Order:** the pins and cards appear in road order; each delay follows its position along the road.
- **Reduced motion:** no movement at all (the global rule, plus `static`).
- **Content and links unchanged:** the content, the cards, the modal, the anchors `#pxp`/`#sxp`/`#ai-tutor`/`#iot` and the narrow layout (one bend per card) stay as they are. The animation works on both layouts.
- **No weight 700 in CSS** (`type-scale.test.ts`). DESIGN.md tokens only.

**Never:** no loop or continuous motion (so no Pause button); no new dependency; no 3D; no change to the copy.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| HAPPY_PATH | Scroll the roadmap into view | Road draws Start→Finish, pins then cards appear in order, all visible by ~2.5s | N/A |
| ALREADY_VISIBLE | Roadmap ≥30% in view at load | Shown fully at once, no replay | N/A |
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
- [ ] `src/components/products/journey/road-map.tsx` + `globals.css` -- the draw-in: phases on `.rm` (`data-reveal`), a mask path drawing the wide road (pathLength 1, dashoffset), per-stop `--delay` from road position; the narrow bends reveal top to bottom with clip-path; the armed CSS only under `[data-reveal="armed"]`; transitions only under `[data-reveal="on"]`.
  - red: `src/components/products/journey/road-map.test.tsx` -- static without JS and under reduced motion; armed then on after 30% intersection; already visible at load → on; delays increase in road order; six cards, each opens the modal; CSS rules hide nothing without the attribute.
- [ ] `src/app/products/page.test.tsx`, `e2e/products.spec.ts` -- page order `#map` → `#apps` → navy band; only defined classes. E2E (`@a11y` and `@smoke` as before):
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
| Road | Scroll into view at 1280px | Mouse wheel, touch, keyboard | Road draws from Start to Finish | ~1.6s `--ease-brand` | Sammy 2026-10-12 |  |
| Pins | Road reaches a pin | — | Pin pops in (scale and fade) | 300ms, delayed by road position | Sammy 2026-10-12 |  |
| Cards | After its pin | — | Card slides in from its side (up for above, down for below) | 400ms after the pin | Sammy 2026-10-12 |  |
| Already visible | Load with the roadmap in view | — | Shown complete, no replay | Instant | FlowReveal pattern |  |
| Reduced motion | Load with reduced motion | — | Complete roadmap, nothing moves | Static | DESIGN.md:451 |  |
| Narrow | 390px, scroll down | Touch | Bends, pins and cards reveal in order; no sideways scroll | Same timings | Spec |  |
| Card | Hover, focus, activate | Mouse, keyboard, touch | Border and shadow on hover; focus ring; the modal opens | Instant | Quick dev |  |
| Modal | Next, Previous, Esc, backdrop | Mouse, keyboard | Moves along the road; closes; focus back on the card | Instant | `road-stop-dialog.tsx` |  |
| App hand-over | "Open … details" | Mouse, keyboard | The app's dialog opens | Instant | `product-detail.tsx` |  |

## Implementation Notes

## Spec Change Log

## Review Triage Log

## Verification

**Commands:**
- `npm run lint && npm run typecheck && npm run format:check` -- expected: clean
- `npm test` -- expected: all pass
- `npm run test:coverage && npm run coverage:diff` -- expected: 100% changed lines; changed files ≥ 80% branches
- `npm run test:smoke` -- expected: all pass
- `npm run build` -- expected: success
- `npx playwright test --project=a11y` -- expected: all pass
