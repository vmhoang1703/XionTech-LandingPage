---
title: 'Products page as a clickable 3D journey map'
type: 'feature'
created: '2026-10-12'
status: 'in-progress'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: 'b5d13a29e079af42d209f6070d8715b3d76bc80e'
context:
  - '{project-root}/AGENTS.md'
  - '{project-root}/docs/ux-checks.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Sammy does not like the scroll-by-chapter audience flow (spec-products-audience-flow, unmerged on this branch). He wants a user-journey map like his reference picture: isometric islands joined by dashed roads, where clicking a place opens that app's information.

**Approach:** Replace the audience flow with a **3D isometric journey map** as the Products hero, under "Built apart. Better together." and its lede.
- **Layout:** a central XionTech hub island joined by dashed roads to four app islands: Parent Hub, Staff Hub, AI Tutor and IoT.
  - Small dots travel along the roads.
  - Each island carries low-poly props that suggest its app.
  - A label card beside each island shows the app name and its tagline.
- **Interaction:** hovering or focusing an island lifts it. Clicking it, tapping it, or pressing Enter on it opens that app's **existing** detail dialog.
- **Below the map:** the app cards and the demo band stay as they are.
- Decisions (Sammy, 2026-10-12): 3D isometric with a fixed camera; open the existing dialog; four apps plus the hub; replace the chapter list.

## Boundaries & Constraints

**Always:**
- **Places:** each app island is a real `<button>` laid over the canvas, positioned on the island.
  - It has an accessible name "Open {app} details" and a visible focus ring.
  - Tab follows Parent Hub → Staff Hub → AI Tutor → IoT.
  - Closing the dialog returns focus to the map button that opened it.
- **Dialogs:** use `dialog#pd-{anchor}` from `product-detail.tsx` unchanged (backdrop close, Tab wrap). The cards' own buttons keep working.
- **Copy:** real or `[Placeholder]`. App names, badges and taglines come from `apps.ts`. The hub label is "XionTech". The H1 and lede stay as they are.
- **Below 640px:** the map shows at full width with tappable islands. Under it, a plain list of the four apps, each a button that opens the same dialog. No sideways scroll.
- **No JS:** the list of four apps links to the card anchors `#pxp`, `#sxp`, `#ai-tutor` and `#iot`. Nothing is hidden by CSS before JS runs.
- **Reused guards from the audience flow:**
  - three.js is a dynamic import once the map nears the viewport.
  - DPR is capped at 2.
  - Rendering stops off screen, when the tab is hidden, and on `webglcontextlost`; on context loss the stage is disposed.
  - There is a Pause/Play motion button, through `readMotionPaused` / `saveMotionPaused`.
  - Reduced motion or Pause gives one still frame: no moving dots, no bob, and the lift is instant.
  - Without WebGL a still SVG map shows, with the same buttons.
  - The canvas is `aria-hidden`.
  - Shadows are off below 640px.
- **Look:** DESIGN.md tokens only, never amber-decor `#C99700`.

**Never:** no OrbitControls or free camera; no loaded models or textures; no new content beyond `apps.ts`; no change to the cards, dialogs or demo band; no GSAP.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| HAPPY_PATH | Click the Staff Hub island | Island lifts on hover; Staff Hub dialog opens; Esc closes; focus back on the map button | N/A |
| KEYBOARD | Tab to "Open AI Tutor details", Enter | AI Tutor dialog opens | N/A |
| RESIZE | Viewport changes size | Buttons stay over their islands | Repositioned on resize |
| REDUCED | Reduced motion or paused | Still frame, no moving dots, no animation frames | N/A |
| NO_WEBGL | No `webgl2` | SVG map with the same four buttons; dialogs open | No error thrown |
| CONTEXT_LOST | `webglcontextlost` | Loop stops, stage disposed, SVG map shown | Logged with `console.warn` |

</frozen-after-approval>

## Code Map

- `src/app/products/page.tsx` -- order becomes `JourneyMap` → `ProductShowcase` → `CaptureBand demo navy`.
- `src/components/products/flow/*` -- the audience flow (`audience-flow.tsx`, `flow-progress.tsx`, `campus-scene.ts`, `campus-canvas.tsx` + tests) is removed. Its guard logic is the pattern to copy:
  - lazy loader IntersectionObserver;
  - viewer IntersectionObserver using the latest entry;
  - `visibilitychange`;
  - context lost → dispose;
  - `paused` initial true, then `readMotionPaused`;
  - toggle only once ready;
  - `data-paused`;
  - DPR ≤ 2;
  - shadows decided at load;
  - one reused sky `Color`;
  - the dispose walk.
- `src/components/products/product-detail.tsx` -- `ProductDetail` renders `dialog#pd-{anchor}` (`dialogId`) and its own expand button, and its `onClose` focuses that button. The map opens it with `document.getElementById(\`pd-${anchor}\`).showModal()`, and returns focus to its own button from the dialog's `close` event (after ProductDetail's handler).
- `src/content/products.ts` -- `audienceFlow` and `FlowPlace` are replaced by `journeyMap` (hub label, places in order, open label, list heading, motion labels).
- `src/content/apps.ts` -- names, anchors, taglines and badges; not changed.
- `src/app/globals.css` -- the `/* Products flow */` block is removed and a `/* Products map */` block added. `.pshow:target` stays.
- `e2e/products.spec.ts` -- the flow tests are replaced. Keep the smoke test, the keyboard dialog, the deep link and the anchor tests. `e2e/a11y.spec.ts` lists `/products` in STATIC_PAGES and KEYBOARD_PAGES (24px targets).
- `src/lib/motion/motion-preference.ts` -- reuse.

## Tasks & Acceptance

**Execution:**
- [x] `src/content/products.ts` -- replace `audienceFlow` with `journeyMap` (hub "XionTech", places parent-hub, staff-hub, ai-tutor, iot with name, tagline, badge and anchor from `apps.ts`, open label, mobile list heading, Pause/Play labels).
  - red: `src/content/products.test.ts` -- places in order with copy equal to `apps.ts`; open label "Open {app} details".
- [ ] `src/components/products/map/journey-scene.ts` -- pure three.js builder: `buildJourney()` returns hub and 4 islands (named by app id, each with props), dashed roads hub→island with travelling dots, lights; `ISO_VIEW` fixed isometric camera that frames all islands for an aspect; `islandAnchor(id)` world point for the button; `tick(dt)` moves dots and bob; `lift(id | null, instant)`.
  - red: `journey-scene.test.ts` -- 4 islands plus hub named; 4 roads each from hub to its island; every anchor projects inside the view for aspects 1 and 0.6; `tick` advances dots; `lift` raises only the chosen island.
- [ ] `src/components/products/map/journey-canvas.tsx` (client) -- the guards listed in the Code Map; projects each `islandAnchor` to the stage and positions four `<button>`s over the islands (on resize and once ready); hover or focus → `lift`; click → open `dialog#pd-{anchor}` and on its `close` focus the button; SVG fallback map with the same buttons at fixed spots; Pause/Play.
  - red: `journey-canvas.test.tsx` -- buttons named and ordered; click opens the dialog (`showModal` called) and focus returns on close; no WebGL → SVG map with buttons, no toggle; paused → no animation frame; hover lifts.
- [ ] `src/components/products/map/journey-map.tsx`, `page.tsx`, `page.test.tsx`, `globals.css`, remove `src/components/products/flow/` -- server section `#map`: H1, lede, stage with `JourneyCanvas`, and the four-app list (links to anchors without JS, buttons that open dialogs with JS); map CSS (stage aspect, button hit areas ≥ 44px, label cards; the four-app list shows at every width — a compact row under the map from 640px, a stacked list below — because `contrast.test.ts` forbids hiding rules).
  - red: `page.test.tsx` -- order `#map` → `#apps` → navy capture band; one H1; four list entries linking to the card anchors; only defined classes.
- [ ] `e2e/products.spec.ts` -- replace the flow tests: the map shows a canvas or the SVG; clicking the Staff Hub island opens its dialog, Esc returns focus to that button; Tab reaches the four map buttons in order; at 390px there is no sideways scroll and the list opens a dialog; reduced motion gives no animation frames; smoke checks the H1, `id="map"` and the four anchors.

**Acceptance Criteria:**
- Given 1280px, when the page loads, then the hub and the four islands with their label cards are all in view inside the stage, with dots moving along the roads (CLS < 0.1).
- Given `/products`, when axe runs (`@a11y`), then there are no WCAG 2.2 AA violations and every map button is a target of at least 24px.
- Given the build, then three.js is not in any page's first-load JS.

## UX checks

| Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| --- | --- | --- | --- | --- | --- | --- |
| Hero | Load `/products` at 1280px | — | H1, lede, isometric map with hub and 4 islands, label cards with name and tagline | Static | Sammy 2026-10-12 |  |
| Roads | Idle | — | Dashed roads hub to island with dots travelling outwards | Continuous | Reference image |  |
| Island hover | Pointer over an island | Mouse, pen | Island lifts, cursor pointer, label card highlighted | 200ms `--ease-brand` | Sammy 2026-10-12 |  |
| Island click | Activate | Mouse, touch, pen | That app's dialog opens | Instant | Sammy 2026-10-12 |  |
| Keyboard | Tab, Enter, Esc | Keyboard | Focus ring on each island button in order; Enter opens; Esc closes and focus returns to the button | Instant | `product-detail.tsx` |  |
| Pause | Activate | Mouse, keyboard, touch | Dots and bob stop; label "Play motion"; persists on reload | Instant | EXPERIENCE.md motion rules |  |
| Reduced motion | Load with reduced motion | — | Still map, no frames; lift instant | Static | DESIGN.md:451 |  |
| No WebGL | WebGL unavailable | — | SVG map with the same buttons; dialogs open | Static | Pattern from the flow |  |
| Mobile | Load at 390px | Touch | Map full width, islands tappable (≥ 44px), list of four apps under it; no sideways scroll | Static | Sammy 2026-10-12 |  |
| Cards | Open a card dialog below | Mouse, keyboard | Unchanged | Instant | `product-detail.tsx` |  |

## Implementation Notes

## Spec Change Log

## Review Triage Log

## Design Notes

**Buttons over the canvas, not raycasting.** Real buttons make the map work with every input and with screen readers. They sit on the islands by projecting each `islandAnchor` with the camera. The SVG fallback uses the same buttons, so behaviour does not depend on WebGL.

**Isometric look:** an orthographic camera at a fixed angle (about 35° down, 45° around), chunky low-poly islands with a navy base, ice-coloured tops and amber road dots, matching the reference picture.

## Verification

**Commands:**
- `npm run lint && npm run typecheck && npm run format:check` -- expected: clean
- `npm test` -- expected: all pass
- `npm run test:coverage && npm run coverage:diff` -- expected: 100% changed lines; changed files ≥ 80% branches
- `npm run test:smoke` -- expected: all pass
- `npm run build` -- expected: success
- `npx playwright test --project=a11y` -- expected: all pass
