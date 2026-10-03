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
| Book a demo | click or Enter | mouse, keyboard | opens `/demo` at the form (`#form`) | instant | CAP-1, FR-15 | test (href); hand for the jump |
| Book a demo | hover | mouse | darker navy | 0.3s | DESIGN.md button | hand |
| Book a demo | Tab | keyboard | visible navy focus ring on amber | instant | EXPERIENCE.md Focus ring | hand |
| Device frames | page load | — | tablet and phone frames, empty, with a `[Placeholder]` caption; no broken image | static | CAP-1, UX-DR17 | test: empty device frames |
| Hero | 1280px / 899px | — | text left, frames right / one column | static | 1.1 `.split` | hand |
| Sub-nav | page scrolls | any | stays below the header, glass background, visible all the time | — | CAP-2, UX-DR18 | hand |
| Sub-nav | read | — | pills PXP, LXP, SXP, IoT in that order; no "Updates" pill | static | CAP-2, T5 | test: sub-nav pills in order |
| Pill | hover | mouse | navy fill, white text | 0.3s | prototype `.subnav a:hover` | hand |
| Pill | Tab then Enter | keyboard | focus ring; the page jumps to that section | smooth | CAP-2, CAP-3 | hand |
| Pill | tap | touch, pen | page scrolls to that section | smooth | CAP-3 | hand |
| Section heading | after a pill link, the mega menu link or a `/products#lxp` URL | any | heading fully visible below header and sub-nav (144px offset) | smooth | CAP-3, AC-NAV-5 | test: anchor class; hand for the pixels |
| Scrolling | reduced motion on | any | jump with no smooth scroll | — | CAP-3 | hand (global reduced-motion rule) |
| Sub-nav | width 640px or less | touch | scrolls sideways; no pill wraps or is cut | — | CAP-4 | hand |
| Page | any width | — | no link points at `#updates` | — | T5 | test: no Updates link |

## Implementation Notes

- Test first: `npx vitest run src/app/products` failed with "no tests" (page and components missing), then 7 passed.
- The hero reuses the Home hero's `.home-devices`, `.home-device-*` and `.home-media` classes (Sammy's Home block in `globals.css`) rather than copying them. If Home renames them, change them here. Story 4.4 puts real media in both.
- Prototype's aurora and strand canvas are skipped (Story 1.6, after demo). The hero H1 and `.btn-navy` come from Story 1.1.
- `scroll-behavior: smooth` is on `html` for the whole site, not only `/products`; the existing reduced-motion rule sets it back to `auto`.
- `tsc --noEmit` reports 5 `LayoutProps` errors in `src/app/layout*.tsx` and `no-js.test.tsx`: the generated Next types (`.next/types`) are missing in this fresh worktree; none are in the changed files.

## Review Triage Log

One layer (Blind Hunter, 9 kB, 4 findings floor):

- Sections list repeated the sub-nav ids by hand — low, patched: `productsSections` is derived from `productsSubnav.items`.
- No `:focus-visible` style on pills — low, patched: it shares the hover fill.
- `scroll-behavior: smooth` has no reduced-motion guard — false: the existing global `prefers-reduced-motion` rule sets `scroll-behavior: auto !important`.
- Stub headings lack `[Placeholder]` — rejected: they are the real product names; Stories 4.2 and 4.3 replace the stubs.
- Breadcrumb `/` not `aria-hidden`, no active-pill state, no scroll cue, `-webkit-backdrop-filter`, canonical/OG, 62-char title, no smoke for `/products` — low, rejected or out of scope: same pattern as `/demo`; in-view highlight is a spec non-goal; Tailwind/Lightning CSS prefixes at build; no harm found.
- `/demo#form` route — false: `src/app/demo/page.tsx` has `id="form"`.
- `#iot` cannot reach the top, 144px offset hard-coded — maybe-false: settles when Stories 4.2/4.3 add content; the offset is the 1.1 token.
