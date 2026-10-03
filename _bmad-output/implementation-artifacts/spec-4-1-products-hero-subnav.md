---
title: 'Story 4.1: Products hero and sticky sub-nav'
type: 'feature'
created: '2026-10-03'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context: ['{project-root}/AGENTS.md']
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `/products` does not exist. Visitors need the amber hero (breadcrumbs, H1 "Four apps. One connected school.", lede, empty device frames, navy "Book a demo" to `/demo#form`), a sticky sub-nav of glass pills to `#pxp`, `#lxp`, `#sxp`, `#iot` that scrolls sideways at 640px and below, and anchor targets that land fully below the header and sub-nav (FR-6, FR-15, UX-DR18, AC-NAV-5). Contract: `_bmad-output/specs/andy/spec-4-1-products-hero-subnav/SPEC.md` (CAP-1 to CAP-4), decision T5 (no `#updates` link on Demo day).

**Approach:** Server Components `src/components/products/products-hero.tsx` and `products-subnav.tsx`, composed by `src/app/products/page.tsx`. Copy lives in `src/content/products.ts`. The hero reuses Story 1.1's `.hero-amber .page-hero .split .crumbs .lede .hl .btn-navy` and the Home hero's device-frame classes. `globals.css` gets a Products block (`.subnav`, `.products-anchor` with `scroll-margin-top: var(--spacing-anchor-offset-subnav)`) and `scroll-behavior: smooth` on `html` (the existing reduced-motion rule turns it off). Each of the four anchor ids gets a heading-only stub section that Stories 4.2 and 4.3 replace.

</frozen-after-approval>

## UX checks

Sources: story spec CAP-1 to CAP-4, decision T5, prototype `products.html` / `site.css` (`.subnav`), `DESIGN.md`. Checked by the unit tests in `src/app/products/page.test.tsx` or by hand (to do in the PR walk).

| Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| ---- | --------------- | ----- | ------------------ | ------ | ------ | ------- |
| Hero | page load | — | amber gradient hero under the header | static | CAP-1 | test: renders the amber hero |
| Breadcrumbs | read | — | "Home / Products"; Home is a link to `/` | static | CAP-1 | test: renders the amber hero |
| H1 | read | — | "Four apps. One connected school."; amber bar under "connected" | static | CAP-1, DESIGN.md highlight-mark | test: H1 with the highlight |
| Lede | read | — | one sentence on the shared source of truth | static | CAP-1 | test: renders the amber hero |
| Book a demo | read | — | one navy pill button with an arrow; no "Product updates" button | static | CAP-1, T5 | test: one navy Book a demo |
| Book a demo | click or Enter | mouse, keyboard | opens `/demo` at the form (`#form`) | instant | CAP-1, FR-15 | ✅ Chrome 1280: click and Enter land on `/demo#form`, form top at 72px (below the header); test (href) |
| Book a demo | hover | mouse | darker navy | 0.3s | DESIGN.md button | ✅ Chrome 1280: rgb(22,54,99) → rgb(15,39,72); background 0.3s (the 0.35s is the lift: transform, box-shadow) |
| Book a demo | Tab | keyboard | visible navy focus ring on amber | instant | EXPERIENCE.md Focus ring | ✅ Chrome 1280: reached by Tab, `:focus-visible`, solid 2px navy ring |
| Device frames | page load | — | tablet and phone frames, empty, with a `[Placeholder]` caption; no broken image | static | CAP-1, UX-DR17 | test: empty device frames |
| Hero | 1280px / 899px | — | text left, frames right / one column | static | 1.1 `.split` | ✅ Chrome: 1280 text x 44–612, frames from x 668; 899 frames below the text, no sideways scroll |
| Sub-nav | page scrolls | any | stays below the header, glass background, visible all the time | — | CAP-2, UX-DR18 | ✅ Chrome 1280: after the LXP, SXP and IoT jumps it is stuck at 72–133px under the header; after PXP (first section) it is still in flow at 82–144px |
| Sub-nav | read | — | pills PXP, LXP, SXP, IoT in that order; no "Updates" pill | static | CAP-2, T5 | test: sub-nav pills in order |
| Pill | hover | mouse | navy fill, white text | 0.3s | prototype `.subnav a:hover` | ✅ Chrome 1280: navy fill, white text, 0.3s (fixed in review: was instant) |
| Pill | Tab then Enter | keyboard | focus ring; the page jumps to that section | smooth | CAP-2, CAP-3 | ✅ Chrome 1280: Tab reaches LXP with a 2px ring; Enter scrolls smoothly (scrollY 0 → 55 → 424 → 710 → 801 → 881), hash `#lxp` |
| Pill | tap | touch, pen | page scrolls to that section | smooth | CAP-3 | ✅ touch: Chrome 390 tap on SXP; pen: not checked |
| Section heading | after a pill link, the mega menu link or a `/products#lxp` URL | any | heading fully visible below header and sub-nav (144px offset) | smooth | CAP-3, AC-NAV-5 | ✅ Chrome 1280, stub sections: pill Enter and click, direct `/products#lxp`, the mega menu LXP link and the Home bento SXP card from `/` all put the section at 144px and its heading at 224px (fixed in review: was 216px, header counted twice); test: anchor class. Recheck `#iot` when 4.2/4.3 add content |
| Scrolling | reduced motion on | any | jump with no smooth scroll | — | CAP-3 | ✅ Chrome 1280 reduced motion: `scroll-behavior: auto`, jump complete at 50ms |
| Sub-nav | width 640px or less | touch | scrolls sideways; no pill wraps or is cut | — | CAP-4 | partly: Chrome 390 and 300 show `overflow-x: auto` and all four pills fit, 40px high (no wrap, none cut), no page sideways scroll. Sideways scroll itself is not reachable with four pills; recheck when Story 4.5 adds the Updates pill |
| Page | any width | — | no link points at `#updates` | — | T5 | test: no Updates link |

## Implementation Notes

- Test first: `npx vitest run src/app/products` failed with "no tests" (page and components missing), then 7 passed.
- The hero reuses the Home hero's `.home-devices`, `.home-device-*` and `.home-media` classes (Sammy's Home block in `globals.css`) rather than copying them. If Home renames them, change them here. Story 4.4 puts real media in both.
- Prototype's aurora and strand canvas are skipped (Story 1.6, after demo). The hero H1 and `.btn-navy` come from Story 1.1.
- `scroll-behavior: smooth` is on `html` for the whole site, not only `/products`; the existing reduced-motion rule sets it back to `auto`.
- `tsc --noEmit` first reported 5 `LayoutProps` errors because the fresh worktree had no generated Next types; after `npx next typegen`, `npm run typecheck` passes.

## Review Triage Log

One layer (Blind Hunter, 9 kB, 4 findings floor):

- Sections list repeated the sub-nav ids by hand — low, patched: `productsSections` is derived from `productsSubnav.items`.
- No `:focus-visible` style on pills — low, patched: it shares the hover fill.
- `scroll-behavior: smooth` has no reduced-motion guard — false: the existing global `prefers-reduced-motion` rule sets `scroll-behavior: auto !important`.
- Stub headings lack `[Placeholder]` — rejected: they are the real product names; Stories 4.2 and 4.3 replace the stubs.
- Breadcrumb `/` not `aria-hidden`, no active-pill state, no scroll cue, `-webkit-backdrop-filter`, canonical/OG, 62-char title, no smoke for `/products` — low, rejected or out of scope: same pattern as `/demo`; in-view highlight is a spec non-goal; Tailwind/Lightning CSS prefixes at build; no harm found.
- `/demo#form` route — false: `src/app/demo/page.tsx` has `id="form"`.
- `#iot` cannot reach the top, 144px offset hard-coded — maybe-false: settles when Stories 4.2/4.3 add content; the offset is the 1.1 token.

Full `bmad-code-review` on 2026-10-03 after rebasing onto `develop` (bb79ab2), 5 layers (Blind Hunter, Edge Case Hunter, Verification Gap, Acceptance Auditor, Security). Security: clean. Acceptance: CAP-1 to CAP-4 and T5 met.

- patch (fixed): site-wide `scroll-behavior: smooth` made every route change animate the scroll to the top, because Next.js 16 no longer overrides it (`version-16.md`, "Scroll Behavior Override"); `<html data-scroll-behavior="smooth">` in `layout.tsx`, with a test. Walk: `/` → `/privacy` from scrollY 4000 lands at 0 within 50ms.
- patch (fixed): no `@smoke` test for `/products` (SPEC constraint); `e2e/products.spec.ts` added. The earlier "no smoke" rejection is reversed.
- patch (fixed): UX table claimed more than the walk showed: sideways scroll (now "partly"), sub-nav position after PXP, scroll numbers from an older run, the mega menu path (now walked, plus the Home bento card), pen (now "not checked"). `walk.mjs` throws when Tab misses its target, uses `.home-devices`, logs the CTA transition properties.
- patch (fixed): the "no Updates" unit test matched any text with "updates"; now links only.
- defer (Minor, `deferred-work.md`): a browser Playwright project to assert the 144px offset (only the walk checks it; the regression already happened once); recheck `#iot` and section padding (mobile 80px at every width) when 4.2/4.3 replace the stubs; breadcrumb `aria-current` and separator (shared with `/demo`, Story 1.6).
- reject: raw sizes in `.subnav` (prototype port; blur and 88% match DESIGN.md `product-subnav`); pill font `--text-ui` (0.95rem) vs prototype 0.9rem (nearest token).
