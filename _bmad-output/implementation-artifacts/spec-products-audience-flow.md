---
title: 'Products page as an audience flow through a 3D campus'
type: 'feature'
created: '2026-10-09'
status: 'in-progress'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: '17707ca36cf5b88e15671161f19cfc46b5c5a9a2'
context:
  - '{project-root}/AGENTS.md'
  - '{project-root}/docs/ux-checks.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The Products page is a static hero diagram ("Built apart.") followed by four cards. It does not show how each person in a school uses XionTech, and it has none of the motion Sammy wants for this page.

**Approach:** Replace the hero with a scroll-driven **audience flow** in four chapters, in this order: Parent (Parent Hub) → Teacher and staff (Staff Hub) → Student (AI Tutor) → Campus (IoT).
- A sticky three.js **low-poly campus** sits beside the chapters.
- As the visitor scrolls, the camera moves to each chapter's place on campus (gate, staff room, classroom, rooftop and plant room), the sky moves from morning to afternoon, and a beacon rises over the active place.
- The four app cards and their dialogs stay below the flow, restyled, followed by the demo band.
- Decisions (Sammy, 2026-10-09): one flow per audience; low-poly campus; flow first, cards after; one PR.

## Boundaries & Constraints

**Always:**
- **Copy:** real or `[Placeholder]`.
  - Chapter names, "Made for" lines, taglines and step titles come from `apps.ts` and `productDetails`.
  - Step descriptions use `FEATURE_PLACEHOLDER`.
  - The H1 stays "Built apart. Better together."
  - The brand is written "XionTech".
- **Anchors:** `#pxp`, `#sxp`, `#iot` and `#ai-tutor` stay on the cards, and each chapter links to its card.
- **No-JS and reduced motion:** without JS, every chapter and step is visible, there is no canvas, and nothing is hidden by CSS before JS runs (`contrast.test.ts`). Under reduced motion, or when the visitor pauses, the scene draws one still frame per chapter with no camera tween, and the chapters read as a plain list.
- **Pause control:** a Pause/Play motion button, because the idle beacon pulse runs longer than 5s. It uses `readMotionPaused` / `saveMotionPaused`.
- **Scene behaviour:**
  - It stops rendering when off screen, when the tab is hidden, and on `webglcontextlost`.
  - Without WebGL it falls back to a still SVG campus.
  - The canvas is `aria-hidden`.
- **Loading:** three.js is loaded with a dynamic import only on `/products`, after the section nears the viewport.
- **Look:** DESIGN.md tokens and `--ease-brand`. Amber-decor is never used for text, fill or stroke.
- **Responsive:**
  - ≥ 1024px: canvas sticky on the right, chapters on the left.
  - Below 1024px: canvas sticky at the top at 40dvh, chapters under it.
  - 390px: no sideways scroll.

**Never:**
- No GSAP, no scroll-jacking or pinning that blocks native scroll, and no OrbitControls.
- No loaded 3D models or textures: the campus is built from primitives in code.
- No new route, no Sanity schema, no `#updates` section.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| HAPPY_PATH | Scroll through `#flow` | Active chapter follows scroll; camera, sky and beacon tween; chapter dot marks progress | N/A |
| REDUCED | `prefers-reduced-motion` or paused | Still frame per chapter, no tween, no pulse | N/A |
| NO_WEBGL | `getContext('webgl2')` null | SVG campus fallback, flow still works | No error thrown |
| CONTEXT_LOST | `webglcontextlost` | Stop the loop; show the fallback | Logged with `console.warn` |
| DEEP_LINK | `/products#ai-tutor` | Lands on the AI Tutor card heading below the header | N/A |
| FAST_SCROLL | Jump from top to bottom | Scene shows the Campus chapter; no stale tween | Each new target cancels the running tween |

</frozen-after-approval>

## Code Map

- `src/app/products/page.tsx` -- order becomes `AudienceFlow` → `ProductShowcase` → `CaptureBand demo navy`.
- `src/components/products/products-hero.tsx`, `eco-motion.tsx` (+ tests) -- removed; the H1 and lede move into the flow intro.
- `src/app/globals.css` -- reduced-motion selector `*:not(.eco-bg[data-motion="on"] i)` (about line 325) goes back to `*`; eco CSS (about lines 3366-3700) removed; new `/* Products flow */` block.
- `src/lib/design/contrast.test.ts:496` -- the locked selector list is updated to match.
- `src/content/products.ts` -- adds `audienceFlow` (intro + 4 chapters built from `appById` and `productDetails`); `productsHero` is removed.
- `src/content/apps.ts` -- source for names, anchors, taglines and badges; not changed.
- `src/lib/motion/motion-preference.ts` -- reused for pause and reduced motion.
- `src/components/home/hero-silk.tsx` -- pattern to copy: WebGL check, IntersectionObserver, `visibilitychange`, context lost, toggle shown only once WebGL works.
- `src/components/products/use-hydrated.ts` -- reuse.
- `src/components/products/product-showcase.tsx`, `product-detail.tsx` -- kept; the restyle is CSS only.
- `e2e/products.spec.ts`, `e2e/a11y.spec.ts` (STATIC_PAGES, KEYBOARD_PAGES) -- keep passing; update the hero-specific asserts.
- `src/content/site-footer.ts`, `home.ts`, `about.ts`, `not-found.ts` -- link to `/products` and anchors; must keep working.

## Tasks & Acceptance

**Execution:**
- [x] `package.json` -- add `three`, `@types/three` (dev) and `motion` -- the scene and the scroll progress.
- [x] `src/content/products.ts` -- `audienceFlow` intro and 4 chapters (id, audience label, app, madeFor, tagline, steps from features, campus `place`); drop `productsHero` -- one source for copy and scene targets.
  - red: `src/content/products.test.ts` -- chapters in order parent, staff, student, campus; every step title equals a `productDetails` feature; no invented copy.
- [x] `src/components/products/flow/campus-scene.ts` -- pure three.js builder: `buildCampus()` returns a scene with gate, staff room, classroom, rooftop/plant room, ground and paths from primitives; `placeTarget(place)` gives camera position and look-at; `skyAt(progress)` gives the colour; `chapterAt(progress)` maps 0..1 to a chapter -- testable without a renderer.
  - red: `campus-scene.test.ts` -- `chapterAt` boundaries; each place has a distinct target; `skyAt(0)` and `skyAt(1)` differ; the built scene has 4 named places and one beacon.
- [x] `src/components/products/flow/campus-canvas.tsx` (client) -- lazy-imports the scene; renderer with DPR ≤ 2; render loop with IO, visibility and context-lost guards; tweens camera and beacon toward the active chapter (each new target cancels the old one); still frame when paused; SVG fallback without WebGL; Pause/Play button.
  - red: `campus-canvas.test.tsx` -- without WebGL it shows the fallback and no toggle; paused means no animation frame is requested; the toggle saves the preference.
- [x] `src/components/products/flow/audience-flow.tsx` -- server section `#flow`: intro (H1, lede), `ol` of chapters (`h2` audience, app name, madeFor, steps as `h3` + description, "See {app} details" link to its anchor) and the sticky canvas slot; a client `flow-progress.tsx` uses Motion `useScroll` to set `data-active` on the chapter and the scene progress.
  - red: `audience-flow.test.tsx` -- one H1; 4 chapters in order, each linking to its card anchor; all steps visible without JS; only defined classes.
- [x] `src/app/products/page.tsx`, `page.test.tsx`, remove the hero files, update `globals.css` and `contrast.test.ts` -- new order; eco CSS gone; flow CSS added.
  - red: `page.test.tsx` -- order `#flow` → `#apps` → navy capture band.
- [x] `e2e/products.spec.ts` -- smoke: H1 and 4 anchors; a canvas or the fallback is present; scrolling to the Student chapter marks it active; reduced-motion context: no camera tween, all chapters visible.

**Acceptance Criteria:**
- Given a 1280px viewport, when the visitor scrolls from the intro to the Campus chapter, then the active chapter, the camera place and the sky change in that order, with no layout shift (CLS < 0.1).
- Given 390px, when the page loads, then the canvas is sticky at the top, the chapters read below it, and there is no sideways scroll.
- Given `/products`, when axe runs (`@a11y`), then there are no WCAG 2.2 AA violations, and Tab reaches the Pause button, each chapter link and the card buttons in visual order.
- Given the route build, then three.js is not in the shared first-load JS of other routes.

## UX checks

| Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| --- | --- | --- | --- | --- | --- | --- |
| Intro | Load `/products` at 1280px | — | H1 "Built apart. Better together."; lede; campus at morning | Static | `products.ts` || ✅ walk 1280 (H1, lede, morning sky); `audience-flow.test.tsx` |
| Chapters | Scroll down | Mouse wheel, touch, keyboard (Space, PgDn) | Active chapter marked; others dimmed to no less than 70%; native scroll, no jump | Follows scroll | Sammy 2026-10-09 || ✅ walk (active follows scroll, others 0.8, CLS 0); e2e Student active |
| Camera | Chapter changes | Scroll | Camera glides to the chapter's place; beacon rises there | 900ms `--ease-brand` | Sammy 2026-10-09 || ✅ walk screenshots per chapter (camera at gate, staff room, classroom, rooftop); `campus-canvas.test.tsx` tween cancel. Framing too close (see review) |
| Sky | Scroll top → bottom | Scroll | Morning → afternoon colour | Follows scroll | Sammy 2026-10-09 || ✅ walk (morning blue at intro → warm yellow at Campus) |
| Chapter link | Activate "See {app} details" | Mouse, keyboard, touch | Scrolls to the card; heading below the header; focus ring visible | Smooth | Anchors || ✅ walk (focus ring 2px, #ai-tutor heading top 181); e2e deep link |
| Pause | Activate | Mouse, keyboard, touch | Pulse and tweens stop; label "Play motion"; the choice persists on reload | Instant | EXPERIENCE.md motion rules || ✅ walk (Play motion, 0 rAF, persists after reload, chapters un-dim); unit tests |
| Reduced motion | Load with reduced motion | — | Still frames, no tween; chapters as a plain list | Static | DESIGN.md:451 || ✅ walk (0 rAF, all chapters opacity 1); e2e reduced motion |
| No WebGL | WebGL unavailable | — | SVG campus; no toggle; no error | Static | `hero-silk.tsx` pattern || ✅ walk `--disable-webgl` (SVG, no toggle, 0 errors); unit test |
| Off screen | Scroll past `#flow` / hide tab | — | Rendering stops (no rAF) | Instant | EXPERIENCE.md || ✅ walk (0 rAF in 1s past #flow); unit tests |
| Width | 1024px / 390px | — | Side-by-side / canvas sticky on top at 40dvh; no sideways scroll | Static | Spec || ✅ walk (1024 beside 456x708; 390 sticky 358x338, no sideways scroll) |
| Cards | Open a card dialog | Mouse, keyboard | Unchanged dialog behaviour; restyled cards | Instant | `product-detail.tsx` || ✅ walk (dialog opens and closes); e2e keyboard dialog |

## Design Notes

**Motion, not GSAP.** `AGENTS.md` names Motion as the animation library. Its `useScroll` gives the 0..1 progress, the chapter comes from `chapterAt`, and the camera tween runs inside the three.js loop. Native scroll with a sticky canvas avoids the scroll-jacking that ui-ux-pro-max warns about.

**ui-ux-pro-max direction kept:** one moving focus per view; motion that means something (the camera goes where the person in the chapter is); transform and opacity only; reduced motion shows the final readable state. Its suggested palette and fonts (indigo, Comic Neue) are not used, because they clash with DESIGN.md.

## Implementation Notes

## Spec Change Log

## Review Triage Log

## Verification

**Commands:**
- `npm run lint && npm run typecheck && npm run format:check` -- expected: clean
- `npm test` -- expected: all pass
- `npm run test:coverage && npm run coverage:diff` -- expected: 100% changed lines; changed files ≥ 80% branches
- `npm run test:smoke` -- expected: all pass
- `npm run build` -- expected: success; three.js only in the `/products` chunks
- `npx playwright test --project=a11y` -- expected: all pass

## Acceptance Evidence

Captured at the end of step-03 on 2026-10-09.

**Commands**

- `npm run lint && npm run typecheck && npm run format:check` -- exit 0 -- eslint, tsc and prettier clean
- `npm test` -- exit 0 -- Test Files 87 passed (87); Tests 1307 passed (1307)
- `npm run test:coverage && npm run coverage:diff` -- exit 0 -- Total 226 lines, Missing 0, Coverage 100%; `products/flow` branches 93.75%
- `npm run test:smoke` -- exit 0 -- 15 passed (17.9s)
- `npm run build` -- exit 0 -- `/products` static; no page HTML references a chunk containing `WebGLRenderer`
- `npx playwright test --project=a11y` -- exit 0 -- 44 passed (1.1m)
- `npx playwright test e2e/products.spec.ts --project=a11y` -- exit 0 -- 5 passed, after tagging the deep-link and dialog tests `@a11y`

**Observed**

- Walk on a production build (`next start -p 3005`, Chrome), `walk-output.txt`:
  - The active chapter follows scroll: Parent → Teacher and staff → Student → Campus. Inactive chapters are at 0.8 opacity, CLS is 0.
  - Off-screen: 0 animation frames in 1s.
  - Pause shows "Play motion", draws 0 frames, survives a reload and un-dims the chapters. Reduced motion: every chapter at opacity 1, 0 frames.
  - `--disable-webgl` shows the SVG campus, no toggle and 0 page errors.
  - At 1024 the canvas sits beside the chapters (456x708). At 390 it is sticky on top (358x338) with no sideways scroll.
  - The chapter link shows a 2px focus ring and lands on `#ai-tutor` with the heading 181px from the top. The card dialog opens and closes.
- Visual quality, from the screenshots: the camera is too close (the classroom and rooftop fill the frame with one block), the lighting is flat, and the campus does not read as a campus. Motion is only the camera glide and the beacon. Passed to review.

**Artifacts**

- [verification.txt](spec-products-audience-flow-evidence/verification.txt) -- command transcripts
- [walk.mjs](spec-products-audience-flow-evidence/walk.mjs), [walk-output.txt](spec-products-audience-flow-evidence/walk-output.txt) -- the walk and its output
- `flow-1280-intro.png`, `flow-1280-chapter-1..4.png`, `flow-1280-reduced.png`, `flow-1024.png`, `flow-390.png`, `flow-1280-no-webgl.png` -- screenshots (hashes in the ledger)

**Not captured**

- Safari and Firefox (Chrome channel only). Real mobile GPU performance.

