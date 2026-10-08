---
title: 'E-A5 Products: hero diagram, four showcase cards and detail dialogs'
type: 'feature'
created: '2026-10-08'
status: 'done'
baseline_commit: '2bc2965b7a8c1c8536614fa241b08a34fe50b3b5'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/AGENTS.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `/products` still shows the amber "Four apps. One connected school." hero, a sub-nav and three long app sections (no AI Tutor), so the header menu and news links to `/products#ai-tutor` land nowhere (E-A2 review, deferred-work). The prototype (`_bmad-output/prototype-enhancement/prototype/products.html`) shows the four apps side by side, each one click from its details. Planned spec: `_bmad-output/specs/andy/spec-enh-a5-products/SPEC.md` (ENH-014, ENH-018, ENH-038, ENH-087, ENH-089, ENH-090).

**Approach:** Replace the page with the prototype's Tier 1 sections: CAP-1 hero "Built apart. Better together." with the four-app diagram and a Pause motion button that shares the Home silk's stored choice; CAP-2 "What we build." with four showcase cards; CAP-3 one native `<dialog>` per app; CAP-4 remove the old sections; CAP-5 the demo `CaptureBand`; CAP-6 the new page title.

Decisions (lead, 2026-10-08): Tier 1 only; Demo day 2026-10-16. Q1 rename (names from `src/content/apps.ts`). Q2 prototype wins over DESIGN.md. Q11: the AI Tutor live address is NOT published; its "View prototype" is a disabled label (decision A6). Q14: "A day at school" and "Product updates" stay Tier 2 (the spec marks them Tier 2). Soft dependency E-A4: use the current `CaptureBand` look (amber) until E-A4 merges. Decision L1 (media first in the markup) no longer applies to the cards.

## Boundaries & Constraints

**Always:**
- Card ids `pxp`, `sxp`, `iot`, `ai-tutor` (from `apps.ts` `anchor`), in `APPS` order; each lands below the header with `--spacing-anchor-offset`.
- Names, badges and taglines from `apps.ts`. Feature titles and "Made for" lines copied from `products.html`; every feature description is `[Placeholder] One or two lines on how this works for the people who use it.` (none matches the 2026-09-28 copy word for word).
- Every stand-in address (`PLACEHOLDER_HREF`) renders as a disabled label (`aria-disabled="true"`, not a link) whose text starts `[Placeholder]`; a real address renders a link with `target="_blank"`, `rel="noopener noreferrer"` and a name ending "(opens in a new tab)" (A6).
- Motion setting: one `localStorage` key `xt-motion` (`"off"`/`"on"`), read and written inside try/catch. No saved value → follow `prefers-reduced-motion`. Home `hero-silk.tsx` reads and writes the same key; no other change there.
- Without JavaScript the features are on the page (a `<details>` fallback shown only under `@media (scripting: none)`), and the expand and pause buttons are hidden.
- `e2e/a11y.spec.ts` change stays small (swap the PXP tab-panel check for a closed-dialog check).

**Never:**
- A day at school, Product updates, the page-long background flow (Tier 2). Publishing `xt-ai-tutor-demo.azurewebsites.net`. Editing `CaptureBand` (E-A4 owns it). Editing `src/components/home/*` other than the motion key in `hero-silk.tsx`. Removing design tokens from `@theme` (`--spacing-anchor-offset-subnav`, `--z-index-subnav` stay; token tests list them).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Open detail | click / Enter on "Open Staff Hub details" | `showModal()`; dialog named "Staff Hub" | N/A |
| Close | X, Esc, or click on the backdrop | dialog closes; focus on the same expand button | click inside the dialog box (incl. padding) does not close |
| Stored pause | `xt-motion` = `off` | hero glows paused, button "Play motion"; Home silk starts paused | N/A |
| No stored value | reduced motion on | starts paused | N/A |
| Storage blocked | `localStorage` throws | falls back to reduced-motion; click still toggles for this visit | no error shown |
| No JS | scripting none | features in a `<details>` per card; no expand or pause button | N/A |

</frozen-after-approval>

## Code Map

- `src/app/products/page.tsx` + `page.test.tsx` -- compose: `ProductsHero`, `ProductShowcase`, `<CaptureBand kind="demo" />` (its default demo copy is already "See it working at your school.").
- `src/content/products.ts` -- rewrite: `productsMeta` (title "School Apps: Parent Hub, Staff Hub, IoT & AI Tutor | XionTech" from `apps.ts`), `productsHero` (h1 lines, lede, diagram label, eyebrows, motion labels), `productsShowcase` (heading, lede, expand/close label builders), `productDetails` keyed by `AppId` (audience `parents|school|students`, madeFor, media `phone|browser`, feature ids + titles), placeholder strings. Drop `productsSubnav`, `pxpSection`, `productsSxp`, `productsIot`.
- `src/content/product-links.ts` -- keep `PLACEHOLDER_HREF`, `productLinks` (stores); `webAppLinks` keyed by anchor `sxp` / `iot` / `ai-tutor`: `{ label, href }`; labels `[Placeholder] staffhub.xiontechs.com`, `[Placeholder] iot.xiontechs.com`, `[Placeholder] AI Tutor prototype address`.
- `src/lib/motion/motion-preference.ts` (new) -- `MOTION_KEY`, `readMotionPaused()`, `saveMotionPaused(paused)`.
- `src/components/home/hero-silk.tsx` -- init `setPaused(readMotionPaused())`; click saves. Its test gets one stored-value case.
- `src/components/products/products-hero.tsx` (rewrite, server) + `eco-motion.tsx` (new client: `.eco-bg` glows with `data-motion`, Pause/Play button rendered after mount).
- `src/components/products/product-showcase.tsx` (new, server: section, cards, frames, no-JS `<details>`) + `product-detail.tsx` (new client: expand button + `<dialog>`; `ProductLink` for A6 labels/links).
- Delete `products-subnav.tsx`, `pxp-section.tsx`, `pxp-story-phone.tsx`, `products-web-apps.tsx` and their tests.
- `src/app/globals.css` -- add `.eco-*`, `.pshows`, `.pshow`, `.ps-*`, `.pc-expand`, `.pc-kick`, `.pmedia`, `.pm-*`, `.pdetail`, `.pd-*`, `.store-btn`, `.pd-nojs` (ported from prototype `site.css` 848-898, 948-975, 1631-1679). Remove orphans: `.subnav*`, `.products-anchor`, `.pxp-phone`, `.story-phone*`, `.ptabs*`, `.store-row`, `.feature-list*`, `.web-app-*`, `.badge-lg`, `.sec-head-center*`, `.split-media-first`, `.bar-url*`, `.browser-media*`. Keep `.browser`, `.home-media`, `.badge`, `.b-*` (Home uses them).
- `e2e/products.spec.ts` -- smoke: H1, four card ids, no `href="#updates"`, no `id="lxp"`. `e2e/a11y.spec.ts` -- the `/products` closed-part check becomes "four closed dialogs".

## Tasks & Acceptance

**Execution:**
- [x] `src/lib/motion/motion-preference.ts` -- read/save with try/catch, reduced-motion fallback -- shared setting
  - red: `motion-preference.test.ts` -- stored `off` reads paused; throwing storage falls back
- [x] `src/components/home/hero-silk.tsx` -- use the shared setting -- CAP-1
  - red: `hero-silk.test.tsx` -- stored `off` starts paused; click saves `on`
- [x] `src/content/products.ts`, `product-links.ts` -- new copy and links -- CAP-1..3, CAP-6
- [x] `src/components/products/eco-motion.tsx`, `products-hero.tsx` -- hero + diagram + pause -- CAP-1
  - red: `products-hero.test.tsx` -- four diagram links in order pxp, ai-tutor, sxp, iot; pause toggles `data-motion` and storage
- [x] `src/components/products/product-detail.tsx`, `product-showcase.tsx` -- cards and dialogs -- CAP-2, CAP-3
  - red: `product-showcase.test.tsx` -- four articles with ids; expand calls showModal; Esc/X/backdrop close and refocus; disabled labels; placeholders; real href link
- [x] `src/app/products/page.tsx`, delete old components, `globals.css`, e2e specs -- CAP-4, CAP-5
  - red: `page.test.tsx` -- no sub-nav, no tablist, capture band present, metadata title

**Acceptance Criteria:**
- Given `/products#ai-tutor`, when the page loads, then the AI Tutor card heading shows below the header.
- Given a card's expand button focused, when Enter, Tab ×N, Esc, then the dialog opens, focus stays inside, it closes and focus returns to that button.
- Given the hero, when "Pause motion" is clicked, then glows stop, the label reads "Play motion", and Home's silk starts paused next visit.
- Given the page source, then it contains no "Four apps. One", no sub-nav, no `xt-ai-tutor-demo` address.

## UX checks

| Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| ---- | --------------- | ----- | ------------------ | ------ | ------ | ------- |
| Hero | load | — | H1 "Built apart. / Better / together." navy weight 300, lede below; no button, no breadcrumb | — | CAP-1, products.html | hand (screenshots) |
| Hero diagram | load ≥900px | — | X tile centre, four navy cards at corners (Parent Hub TL, AI Tutor TR, Staff Hub BL, IoT BR), two crossing lines | — | CAP-1 | hand (screenshots) |
| Hero diagram | width <900px | — | diagram under the copy, centred; no sideways scroll at 320px | — | CAP-1, Responsive | browser-check.txt / hand |
| Diagram card | hover / focus | mouse, keyboard | lifts 4px; focus ring navy 2px | 0.35s | site.css eco-card | browser-check.txt / hand |
| Diagram card | click / Enter | mouse, touch, keyboard | jumps to its showcase card | — | CAP-1 | browser-check.txt / hand |
| Glows | load, no saved choice | — | three blurred glows drift slowly | 34-38s loop | CAP-1 | hand (screenshots) |
| Pause motion | click / Enter / tap | any | glows stop; icon Play; label "Play motion" | — | CAP-1, Motion toggle | browser-check.txt / hand |
| Pause motion | hover / focus | mouse, keyboard | label slides out beside the 44px navy button | 0.3s | site.css motion-toggle | browser-check.txt / hand |
| Pause motion | stored `off`, or no value + reduced motion | — | starts paused | — | CAP-1, Motion | browser-check.txt / hand |
| Pause motion | no JS | — | button hidden; glows static only under reduced motion | — | CAP-1 | browser-check.txt / hand |
| Showcase | ≥860px / <860px | — | two columns / one column of white cards | — | CAP-2 | hand (screenshots) |
| Card | load | — | badge + full name top left, tagline H3, 44px expand button top right; phone (Parent Hub) or browser frame centred | — | CAP-2 | hand (screenshots) |
| Expand button | hover | mouse | navy fill, white icon | 0.2s | site.css ps-head | browser-check.txt / hand |
| Expand button | click / Enter / Space | any | detail dialog opens with backdrop; page does not scroll behind | — | CAP-3 | browser-check.txt / hand |
| Dialog | Tab / Shift+Tab | keyboard | focus stays in the dialog | — | CAP-3 | browser-check.txt / hand |
| Dialog | Esc, X, click on backdrop | keyboard, mouse, touch | closes; focus back on the expand button | — | CAP-3 | browser-check.txt / hand |
| Dialog | click inside the box (padding too) | mouse | stays open | — | CAP-3 | browser-check.txt / hand |
| Dialog | load | — | name, tagline, "Made for …", larger screenshot frame, "Features" grid, `[Placeholder]` descriptions | — | CAP-3, ENH-089 | product-showcase.test.tsx + dialog.png |
| Dialog buttons | Parent Hub / others | — | two disabled store labels / one disabled "[Placeholder] View prototype"; not links; not-allowed cursor | — | CAP-3, A6, Q11 | product-showcase.test.tsx (disabled labels) + browser-check.txt |
| Dialog | width <760px | — | media above copy, one column | — | site.css pd-intro | browser-check.txt / hand |
| Card fallback | no JS | — | "Features" `<details>` in each card; no expand button | — | CAP-3 | product-showcase.test.tsx (noscript) + browser-check.txt |
| Last band | load | — | "See it working at your school." capture band (current amber look until E-A4) | — | CAP-5 | hand (screenshots) |
| Reduced motion | any | — | glows still, dialog opens with no animation, cards no lift | — | Motion | browser-check.txt / hand |

## Implementation Notes

- No-JS mechanism differs from the frozen wording "`@media (scripting: none)`": the repo test "no JavaScript: CSS hides no content" (`src/lib/design/contrast.test.ts`) fails any CSS `display: none` rule, so the `<details>` sits in `<noscript>` and the expand button carries `hidden` until hydration (`use-hydrated.ts`, shared by the hero and the dialog). Visible result is what the spec asks for. Lead to confirm (listed in the report).
- `webAppLinks` is keyed by app id (`staff-hub`, `iot`, `ai-tutor`), not by anchor, so `webAppLinks[app.id]` type-checks after the `parent-hub` branch.
- Controller implemented tasks 3-6 itself (one coherent prototype port); only tasks 1-2 went to an implementer subagent. Per-task reviews were self-checks; the step-04 five-layer review is the independent check.

## Spec Change Log

## Review Triage Log

Full review, 5 layers (blind hunter, edge case hunter, verification gap, acceptance auditor, security auditor), one pass.

| # | Layer | Finding | Verdict | Route / evidence |
| - | ----- | ------- | ------- | ---------------- |
| 1 | edge, blind | No-JS `<details>` rendered visible, then `hidden` after hydration: layout shift and a flash for every JS visitor | medium | patch: moved into `<noscript>` (React emits it only in server HTML); tests updated (0974cd1) |
| 2 | verification-gap | Under reduced motion the Play button changes `data-motion` but the global `animation: none !important` keeps the glows still | medium | defer: known limit in Design Notes; overriding the base-layer `!important` needs a design call (deferred-work.md) |
| 3 | edge | Reduced-motion visitor without JS sees drifting glows (no CSS rule) | false | `globals.css` base layer `@media (prefers-reduced-motion: reduce) { * { animation: none !important } }` stops them; the browser check with `reducedMotion: reduce` confirmed |
| 4 | blind | Comment "clockwise from the top left" is wrong (order is TL, TR, BL, BR) | low | patch: comment and test name fixed (direct correction) |
| 5 | blind | `productsShowcase.apps` unused | low | patch: removed |
| 6 | blind | `aria-disabled` span has no role and no focus | low | reject: decision A6 asks for a disabled label, same pattern as the old store buttons and URL pills |
| 7 | blind | Media and features rendered twice per card (card and dialog) | low | reject: by design (dialog shows a larger copy); no ids inside, so no duplicate ids |
| 8 | blind, edge | Motion state not synced across tabs / OS setting change | low | reject: re-read on every render; cross-tab sync is not asked for and adds a listener |
| 9 | blind | `!paused` from the render closure on double click | false | each click re-renders before the next event; React flushes discrete events synchronously |
| 10 | blind, edge | Backdrop: drag-select released outside closes; zero-coordinate synthetic click | low | reject: rare, the fix adds pointer tracking; keyboard clicks target controls, not the dialog |
| 11 | blind, edge | `FOCUSABLE` lacks input/select/textarea/summary; Shift+Tab when the dialog itself has focus | low | reject: the dialogs hold only buttons and links; showModal focuses the close button |
| 12 | blind, edge | Breadcrumb and hero "Book a demo" removed | false | spec CAP-1: "no button or breadcrumb" |
| 13 | blind | e2e magic number `top >= 60`; smoke depends on "Built apart." | low | reject: header is 72px; the copy is the spec's H1 |
| 14 | blind | Hero lede copy unconfirmed; same placeholder text for all features | false | lede copied from products.html (Q2 prototype wins); placeholder text is ENH-089 |
| 15 | verification-gap | `--spacing-anchor-offset-subnav` now unused | low | reject: spec Never keeps the token (token test lists it) |
| 16 | verification-gap | Footer and Home bento still link `/products#lxp` | low | defer: pre-existing, Sammy's files (deferred-work.md) |
| 17 | edge | Scrollbar disappears when the dialog opens (sideways shift) | low | reject: `scrollbar-gutter` on html changes every page |
| 18 | edge | Spec claims `@media (scripting: none)` and anchor keys `sxp` | low | reject: fix edits this spec; code note: noscript replaces the media query, keys are app ids |
| 19 | security | clean | — | — |
| 20 | acceptance | No-JS uses `<noscript>`, not `@media (scripting: none)` (frozen wording) | medium | intent conflict with the repo's no-CSS-hiding test; same visible result; recorded in Implementation Notes and raised to the lead |
| 21 | acceptance | `webAppLinks` keyed by app id, not anchor (Code Map) | low | reject: fix is a spec edit; noted in Implementation Notes |
| 22 | acceptance | New `use-hydrated.ts` not in Code Map | low | reject: two callers, covered by component tests |
| 23 | acceptance | Coverage claim not checkable from the diff | false | `verification.txt` holds the real `coverage:diff` output: 100%, C1 ok |

## Design Notes

- Dialog close on outside click: close only when the click target is the `<dialog>` itself AND the point lies outside its `getBoundingClientRect()` (a keyboard "click" has no point outside, so it never closes by accident).
- The global reduced-motion rule (`animation: none !important`) wins over any "Play" choice for the CSS glows; the stored choice still syncs with Home. Accepted limit.
- Dialog lives inside its `<article>`; `showModal` puts it in the top layer, so layout is unaffected.

## Verification

**Commands:**
- `npm run lint && npm run typecheck && npx prettier --check src e2e studio` -- expected: clean
- `npm test` / `npm run test:coverage && npm run coverage:diff` -- expected: all pass, 100% changed lines
- `npm run build` -- expected: success
- Browser check on `next start --port 3205`: keyboard dialog walk, `#ai-tutor` landing, 390px no sideways scroll.

## Acceptance Evidence

**Commands:** lint, typecheck, prettier check, `npm test`, `npm run test:coverage`, `npm run coverage:diff` (100% of changed lines, C1 ok), `npm run build` — all exit 0 after the review patch ([verification.txt](spec-enh-a5-products-evidence/verification.txt)).

**Manual:** Playwright on `next start --port 3205`: 25 of 25 checks pass ([browser-check.txt](spec-enh-a5-products-evidence/browser-check.txt), [observed.md](spec-enh-a5-products-evidence/observed.md)).

**Artifacts:**
- [verification.txt](spec-enh-a5-products-evidence/verification.txt) — 3043 bytes, sha256 8c2f29d3bdfc: lint, typecheck, prettier, npm test, test:coverage, coverage:diff (100%, C1 ok), build: all exit=0
- [browser-check.txt](spec-enh-a5-products-evidence/browser-check.txt) — 925 bytes, sha256 40b10a05bdaa: 25 PASS lines from the Playwright check on next start :3205
- [observed.md](spec-enh-a5-products-evidence/observed.md) — 1372 bytes, sha256 c8e3193532b8: what was seen on /products per surface
- [desktop-full.png](spec-enh-a5-products-evidence/desktop-full.png) — 779874 bytes, sha256 8e82f7d47c18: full /products at 1280px
- [dialog.png](spec-enh-a5-products-evidence/dialog.png) — 137421 bytes, sha256 9c2dc9e81a4b: Staff Hub dialog open
- [m390-dialog.png](spec-enh-a5-products-evidence/m390-dialog.png) — 67251 bytes, sha256 f20542f21e01: IoT dialog at 390px
- [nojs.png](spec-enh-a5-products-evidence/nojs.png) — 786851 bytes, sha256 18bd3a85043b: JS off: features details visible
