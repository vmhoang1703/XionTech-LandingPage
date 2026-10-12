---
title: 'Products: roadmap scroll tour; What we build removed'
type: 'feature'
created: '2026-10-12'
status: 'in-progress'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: 'b9cd7d97c9ca2f7304b13b0828db73c65fc23b47'
context:
  - '{project-root}/AGENTS.md'
  - '{project-root}/docs/ux-checks.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** On `/products` the "What we build" section (four app cards and their dialogs) repeats what the roadmap now tells. The roadmap plays once on its own instead of letting the visitor walk through it.

**Approach (decisions, Sammy 2026-10-12):**
- **Remove "What we build"** (`#apps`, the cards and their dialogs). The roadmap takes over:
  - the app anchors `#pxp`, `#sxp`, `#ai-tutor` and `#iot` move to their roadmap stops, so footer, Home and About links and deep links land on the right stop;
  - the stop modal drops its "Open … details" hand-over, since it already shows "Made for" and the features.
- **Pinned scroll tour** on wide screens, replacing the timed draw-in:
  - the roadmap stays on screen (sticky, native scroll) while scrolling moves stop by stop;
  - the road draws up to the active stop, its pin takes the amber selected style, and its card is emphasised;
  - after stop 6 the page continues to the demo band.

## Boundaries & Constraints

**Always:**
- **Native scroll only:** no wheel or touch interception and no scroll snapping. Each stop gets an equal share of a tall scroll track; the active stop follows the scroll position.
- **Reduced motion and no JS:** no pinning and no extra scroll length. The roadmap shows complete and static, with every card visible and no pin selected.
- **Phones** (below 1100px): keep the per-stop reveal as it is, with no pinning. The anchors still land on their stops.
- **Deep links and anchors:** `/products#sxp` (and the others) scroll to the point in the tour where that stop is active, with its card fully in view below the header. Every card stays clickable and opens its modal. A click selects that stop, as it does today.
- **The sticky roadmap fits the viewport below the header** at every wide size (it scales down to fit), and causes no sideways scroll.
- **No hiding before JS** (`contrast.test.ts`); no opacity on text; DESIGN.md tokens only; no weight 700. The card emphasis uses border, shadow and transform only.
- **Unused code goes:** the showcase, the app dialogs, the opener, the store links and their CSS and tests. Keep the content the modal and the roadmap still use (`productDetails`, `productsShowcase.madeFor` and `featuresHeading`).

**Never:** no new dependency; no 3D; no scroll-jacking; no change to the copy or the demo band.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| HAPPY_PATH | Scroll down through the roadmap at 1280×800 | Roadmap pinned; stops 1→6 become active in turn; road drawn up to the active stop; then the page moves on | N/A |
| SCROLL_BACK | Scroll up | Active stop and road go back in step | N/A |
| DEEP_LINK | Open `/products#ai-tutor` | Stop 4 active, its card fully in view | N/A |
| CLICK | Click a card mid-tour | Modal opens; that stop is selected | N/A |
| REDUCED | `prefers-reduced-motion: reduce` | Static, complete roadmap; no pinning | N/A |
| NARROW | 390px | Per-stop reveal as today; no pinning; no sideways scroll | N/A |

</frozen-after-approval>

## Code Map

- `src/app/products/page.tsx` -- drop `ProductShowcase`; order becomes `JourneySection` → `CaptureBand demo navy`.
- `src/components/products/product-showcase.tsx`, `product-showcase.test.tsx`, `product-detail.tsx`, `use-hydrated.ts` -- the "What we build" cards and the `dialog#pd-{anchor}` app dialogs. Delete them if nothing else imports them; `use-hydrated` is used only by `product-detail`.
- `src/components/products/map/open-app-dialog.ts` and its test -- only the modal's hand-over uses it; delete.
- `src/content/product-links.ts` -- the store and web links, used only by the showcase; delete. Content: keep `productDetails`, `productsShowcase.madeFor` and `featuresHeading`; drop the unused `productsShowcase` keys.
- `src/components/products/roadmap/road-stop-dialog.tsx` and its test -- remove the "Open … details" button (`StopApp`) and the last stop's hand-over (`AllApps` becomes plain, non-interactive app chips).
- `src/components/products/journey/road-map.tsx` -- the roadmap. Wide layout is an absolutely positioned 1400×820 stage (`W`, `H`, `POINTS`, `ROAD`, mask `.rm-draw` with `pathLength 1`). Phases are `static`/`armed`/`on` with the timed draw-in. Narrow layout uses per-stop `data-in`. The selected state is `data-selected`, with `choose()`. `delayOf(i)` is the share of the route for stop `i`.
- `src/app/globals.css` -- the "Products roadmap (2D)" block holds the draw-in rules; the "Showcase cards" and `.pdetail` blocks go.
- `src/content/site-footer.ts` (footer links `/products#sxp`, `#ai-tutor`, `#pxp`) and `src/content/services.test.ts:27` (asserts they are `APPS` anchors). Also `home.ts` and `about.ts` links.
- `e2e/products.spec.ts` -- the smoke test (anchors), the keyboard-dialog test (the showcase), the hand-over test and the deep link.
- `e2e/a11y.spec.ts:234` -- expects 4 closed `dialog.pdetail`.

## Tasks & Acceptance

**Execution:**
- [ ] Remove "What we build" -- page order, delete the showcase, app dialogs, opener, store links, the hand-over in the stop modal, the dead content keys and CSS; update `a11y.spec.ts:234` (no app dialogs), drop the showcase keyboard-dialog and hand-over e2e tests.
  - red: `src/app/products/page.test.tsx` -- sections are `#map` then the navy capture band, with no `#apps` and no `dialog.pdetail`; `road-stop-dialog.test.tsx` -- no "Open … details" button.
- [ ] Anchors on the roadmap -- in `road-map.tsx`, each app stop carries its anchor (`pxp`, `sxp`, `ai-tutor`, `iot`) on a scroll target. On wide screens with the tour, that is a per-stop sentinel in the scroll track; otherwise it is the stop itself. Each has a `scroll-margin-top` that clears the header.
  - red: `road-map.test.tsx` -- each footer anchor exists exactly once inside `#map` and belongs to the stop of that app.
- [ ] Scroll tour (wide) -- replaces the timed draw-in on wide screens:
  - `data-tour="on"` is set by JS only, and not under reduced motion;
  - a scroll track of six steps, with the stage sticky under the header and scaled to fit the viewport;
  - the active stop comes from scroll position (each step's share), sets the selected stop, draws the road to that stop's share (`.rm-draw` dashoffset), and emphasises its card;
  - a click still selects;
  - phones keep the per-stop reveal.
  - red: `road-map.test.tsx` -- server HTML is static with no track height; reduced motion stays static; scrolling a step sets the active and selected stop and the road share; scrolling back goes back; a click selects; no CSS hides content without the attribute.
- [ ] Tests -- update `page.test.tsx` and `e2e/products.spec.ts`:
  - smoke: the H1, `id="map"`, and the four anchors inside the roadmap;
  - `@a11y`:
    - at 1280×800, scrolling makes stops 1→6 active in turn, the roadmap stays pinned (same top while active), and then the demo band follows;
    - scrolling back steps back;
    - `/products#ai-tutor` makes stop 4 active with its card in view;
    - reduced motion is static and complete;
    - 390px: per-stop reveal and no sideways scroll;
    - a card opens the modal, and Next and Esc return focus.

**Acceptance Criteria:**
- Given 1280×800 and 1920×1080, when the visitor scrolls through the roadmap, then the whole stage stays inside the viewport below the header, and each of the six stops becomes active exactly once in order, with CLS < 0.1.
- Given the footer link "For schools" (`/products#sxp`), when followed, then Staff Hub's stop is active and its card is fully visible.
- Given `/products`, when axe runs, then there are no WCAG 2.2 AA violations, and Tab reaches the six cards in road order.

## UX checks

| Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| --- | --- | --- | --- | --- | --- | --- |
| Pin | Scroll into the roadmap at 1280×800 | Mouse wheel, touch, keyboard (Space, PgDn, arrows) | Roadmap sticks below the header; stop 1 is active | Follows scroll | Sammy 2026-10-12 |  |
| Advance | Keep scrolling | Same | Stops 2→6 become active in turn; road draws up to the active stop; the active pin is amber with its halo; the active card is emphasised | Road ~400ms `--ease-brand` per step | Sammy 2026-10-12 |  |
| Back | Scroll up | Same | Active stop and road step back | Same | Spec |  |
| Exit | Past stop 6 | Same | Roadmap releases; the demo band follows | Native | Sammy 2026-10-12 |  |
| Fit | 1280×800, 1440×900, 1920×1080 | — | Whole stage inside the viewport below the header; no sideways scroll | Static | Spec |  |
| Deep link | `/products#sxp`, `#ai-tutor` | Link | That stop active; its card fully visible below the header | Instant | Footer links |  |
| Card | Click mid-tour | Mouse, keyboard, touch | The modal opens; that stop is selected; Esc returns focus | Instant | `road-stop-dialog.tsx` |  |
| Modal | Last stop and app stops | Mouse, keyboard | No "Open … details" button; the app chips are not links | Instant | Sammy 2026-10-12 |  |
| Reduced motion | Load with reduced motion | — | Static, complete roadmap; no pinning; no selected pin | Static | DESIGN.md:451 |  |
| Narrow | 390px | Touch | Per-stop reveal as before; no pinning; no sideways scroll | As before | Spec |  |
| Page | Load `/products` | — | The roadmap, then the navy demo band; no "What we build" | Static | Sammy 2026-10-12 |  |

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
