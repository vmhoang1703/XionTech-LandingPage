---
title: 'Story 1.4: Mobile menu'
type: 'feature'
created: '2026-10-04'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context:
  - '{project-root}/AGENTS.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** At 1080px and below the Story 1.3 desktop nav is hidden, so phones and tablets have no navigation and phones have no Book a demo (contract: `_bmad-output/specs/andy/spec-1-4-mobile-menu/SPEC.md`, CAP-1 to CAP-8; decision T6).

**Approach:** Port the prototype `#burger` / `#menu` / `.menu-cta` as one `"use client"` `MobileMenu` (Menu pill + paper panel under the header) placed in the server `SiteHeader` tools area after Book a demo. The panel lists the five top-level links from `nav-data.ts`, with Book a demo first at 640px and below; Escape, focus trap over the header's visible controls, scroll lock, and close on link, navigation and growing above 1080px. Desktop nav behaviour and its tests stay unchanged.

</frozen-after-approval>

## Implementation Notes

**Plan (2026-10-04).**

- `src/components/layout/nav-data.ts` -- add `LABELS.menu = "Menu"` and `NAV_LINKS` (section, href, label for Products, Services, News, About, Careers → `/products`, `/services`, `/news`, `/about`, `/careers`), so the menu reads the same data module as the 1.3 header (CAP-7). The desktop nav is not rewired to it (keep 1.3 code unchanged).
- `src/components/layout/site-nav.tsx` -- only `export` the existing `itemClass`, so menu items share the 1.3 pill, hover and current-page style (prototype uses the same `.menu>a` rules at every width).
- `src/components/layout/mobile-menu.tsx` (new, client) -- Menu button (`aria-controls="mobile-menu"`, `aria-expanded`, `min-[1081px]:hidden`) and `<nav id="mobile-menu" aria-label="Main" hidden={!open}>`. Open state remembers the pathname it opened on (same pattern as `SiteNav`), so a navigation closes it without `setState` in an effect. Listeners (keydown for Escape and Tab, `matchMedia("(min-width: 1081px)")` change) and `document.documentElement.style.overflow = "hidden"` exist only while open, and are removed on close or unmount.
- `src/components/layout/site-header.tsx` -- render `<MobileMenu />` after Book a demo in the tools area. The EN/VI slot stays empty before Book a demo (Story 1.2).
- Panel: `absolute inset-x-0 top-full`, the header (sticky) is its containing block; paper background, `px-6 pt-4 pb-6`, bottom border, `max-h-[calc(100dvh-var(--spacing-header-height))] overflow-auto`, flex column, z layer `--z-index-mobile-menu` (60). Menu CTA: `.btn .btn-primary` → `/demo#form`, `justify-center mb-2.5`, shown only at 640px and below.
- Breakpoints as in 1.3: `max-[640px]:` and `min-[1081px]:` (inclusive max-width meaning).

**Decisions (choices a user would not notice as a gap):**

- Focus trap = every visible focusable element inside the `<header>`: logo link, header Book a demo (641–1080px only), Menu button and the open panel. This is the "header bar controls" of CAP-3 and EXPERIENCE.md, and picks up the EN/VI switch automatically when Story 1.2 adds it. Visible = `getClientRects().length > 0` (CSS-hidden elements have no boxes).
- Opening does not move focus; focus stays on the Menu button (disclosure pattern, as the prototype). Tab moves into the panel next.
- No close on outside tap: not in SPEC CAP-8 or the prototype.
- Mobile Products and Services are plain links (SPEC non-goal: inline mega content after demo).

**Build (2026-10-04).**

- Files: `src/components/layout/mobile-menu.tsx` (new, client), `mobile-menu.test.tsx` (new), `nav-data.ts` (+`LABELS.menu`, `NAV_LINKS`), `site-nav.tsx` (`itemClass` exported, nothing else), `site-header.tsx` (mounts `<MobileMenu />`), `nav-data.test.ts`, `site-header.test.tsx`.
- RED: `npx vitest run src/components/layout` -- 3 failed (`./mobile-menu` missing, `NAV_LINKS` undefined, `LABELS.menu` undefined, header has no "Menu" button). GREEN after code: 96 passed.
- jsdom has no layout, so `mobile-menu.test.tsx` stubs `getClientRects` from the breakpoint classes at a test width (375, 640, 641, 800) and stubs `matchMedia` to fire the 1081px change.
- Surprise: ESLint `@next/next/no-html-link-for-pages` also checks test files; the test header uses `next/link`.
- Full suite under load: `scripts/eslint-config.test.mjs` timed out once at 120s (typed ESLint, unrelated); alone it passed (3 tests, 37.6s), and the re-run of the whole suite passed.
- Not run here (Turbopack rejects the worktree's `node_modules` junction): `npm run build`, `npm run test:smoke`, browser walk -- pending (controller).

## UX checks

Sources: SPEC CAP-1 to CAP-8, `EXPERIENCE.md` Component Patterns › Mobile menu, Accessibility Floor, Responsive & Platform, AC-NAV-2, AC-NAV-4, AC-A11Y-3; `DESIGN.md` Mobile menu; decision T6. Layout, touch and look rows need a browser; Turbopack rejects this worktree, so they wait for the controller's walk.

| Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| ---- | --------------- | ----- | ------------------ | ------ | ------ | ------- |
| Menu button | width 1080px or less | — | 40px-high pill, text "Menu", no icon, navy text, navy border at 14% | — | CAP-1, DESIGN.md Mobile menu | mobile-menu.test (classes, text); look: pending (controller walk) |
| Menu button | width 1081px or more | — | not shown; desktop nav shown | — | CAP-1 | mobile-menu.test (class `min-[1081px]:hidden`); pending (controller walk) |
| Menu button | closed state | — | `aria-expanded="false"`, `aria-controls` = panel id | — | AC-NAV-4 | mobile-menu.test "renders a closed Menu pill" |
| Menu button | tap | touch, pen | panel opens under the header; `aria-expanded="true"` | — | CAP-1 | mobile-menu.test "opens on click"; touch: pending (controller walk) |
| Menu button | click, then click again | mouse | opens, then closes | — | CAP-1 | mobile-menu.test "toggles closed" |
| Menu button | Enter or Space | keyboard | opens; focus stays on "Menu"; Tab moves into the panel | — | CAP-1, EXPERIENCE.md Interaction Primitives | native `<button>`; pending (controller walk) |
| Panel | open | any | paper panel, full width, under the 72px header, scrolls inside the viewport when taller | — | DESIGN.md Mobile menu | pending (controller walk) |
| Panel | open | any | Products, Services, News, About, Careers link to `/products`, `/services`, `/news`, `/about`, `/careers` | — | CAP-7 | mobile-menu.test "lists the five pages", nav-data.test |
| Panel | open on `/news/x` | any | News marked current (`aria-current="page"`, navy bold, amber underline) | — | DESIGN.md Site header | mobile-menu.test "marks the current section"; look: pending (controller walk) |
| Panel | Escape | keyboard | closes; focus on "Menu" | — | CAP-2, AC-NAV-4 | mobile-menu.test "closes on Escape" |
| Panel | Tab from the last item | keyboard | focus wraps to the logo link | — | CAP-3 | mobile-menu.test focus trap, real site header |
| Panel | Shift+Tab from the logo link | keyboard | focus wraps to the last menu item | — | CAP-3 | mobile-menu.test focus trap, real site header |
| Panel | Tab through, width 641–1080px | keyboard | order: logo, Book a demo, Menu, five links; never the page below | — | CAP-3; pending: CAP-3 and EXPERIENCE.md list logo, EN/VI and Menu only — confirm the header Book a demo (shown 641–1080px) belongs in the trap (Amber) | mobile-menu.test "keeps the header Book a demo in the trap at 800px"; order: pending (controller walk) |
| Page | menu open, swipe or wheel | touch, mouse | background page does not scroll | — | CAP-3 | mobile-menu.test (root `overflow: hidden`); pending (controller walk) |
| Page | menu closed | any | page scrolls again | — | CAP-8 | mobile-menu.test "locks page scroll … releases" |
| Panel | closed, Tab through the page | keyboard | no menu item gets focus | — | CAP-4, AC-A11Y-3 | mobile-menu.test "keeps closed menu items out of reach" (`hidden`) |
| Panel | tap or click a menu link | touch, mouse | goes to the page; menu closed; page scrolls | — | CAP-8, T6 | mobile-menu.test "closes when a menu link is activated"; pending (controller walk) |
| Header links | menu open, tap the logo on Home | touch, mouse | menu closes; page scrolls | — | CAP-8 (review finding) | mobile-menu.test "closes when a header link to the current page" |
| Panel | page changes (back button) | any | menu closed | — | CAP-8 | mobile-menu.test "closes when the pathname changes" |
| Panel | open, window grows above 1080px | any | menu closes; scroll lock released | — | CAP-8, T6 | mobile-menu.test "closes when the viewport grows"; pending (controller walk) |
| Book a demo | width 640px or less, open menu | any | first item, amber primary button style, links `/demo#form`; not in the header bar | — | CAP-5, AC-NAV-2 | mobile-menu.test "shows Book a demo first"; look: pending (controller walk) |
| Book a demo | width 641–1080px | any | in the header next to the EN/VI slot; not in the open menu | — | CAP-6, AC-NAV-2 | mobile-menu.test "leaves Book a demo out"; look: pending (controller walk) |
| Panel | open | reduced motion | opens and closes with no animation | — | EXPERIENCE.md reduced motion | hand (code: no animation; global reduced-motion rule) |
| Header | width 375px, menu open | any | no sideways scroll; logo 26px high | — | Success signal, EXPERIENCE.md Responsive | pending (controller walk) |
| Menu button | Tab to it | keyboard | 2px focus ring visible | — | EXPERIENCE.md Accessibility Floor, T9 | global `:focus-visible`; pending (controller walk) |

## Review Triage Log

One layer (Blind Hunter), 2026-10-04, 11 findings.

- Same-path header links (logo on `/`, header Book a demo on `/demo`) leave the menu open and the page locked -- medium, patched: while open, any link click closes the menu (one document listener; the per-link `onClick` went away). Test added.
- Scroll lock writes `""` on close instead of the earlier value -- low, patched: the earlier `overflow` is restored. Test added.
- Trap tests use a stand-in header only; the 800px order is not proven -- low, patched: two tests render the real `SiteHeader` (wrap at 375px; header Book a demo inside the trap at 800px), and the layout stub now knows the desktop nav's `hidden min-[1081px]:flex`.
- CAP-7 half met: the desktop nav still hardcoded `/news`, `/about`, `/careers` -- low, patched: the desktop links come from `NAV_LINKS` too (same markup; 1.3 tests unchanged and passing).
- Trap includes the header Book a demo, which CAP-3 does not list -- maybe-false: CAP-3 and EXPERIENCE.md list the header bar controls without naming the tablet Book a demo; leaving out a visible control would make Tab skip it. Marked `pending` in the UX row for Amber (docs/ux-checks.md rule).
- Spec still `in-progress`, Checked cells empty, no triage log -- false at review time: this Finalize step fills them.
- No `docs/ai-log.md` entry -- low, patched in the same commit.
- Hiding the root scrollbar shifts the page on 641–1080px windows with classic scrollbars -- low, rejected: the prototype does the same; `scrollbar-gutter: stable` on `html` would change every page.
- `mobile-menu.tsx` imports `itemClass` from `site-nav.tsx` -- low, rejected: one shared class string; a new styles module adds more than it fixes.
- Width not checked when the effect starts -- low, rejected: the Menu button is hidden above 1080px, so the menu cannot open there; a state set in the effect body breaks the React 19 lint rule.
- No e2e / browser test for layout rows; UX probe for the Menu button not added to `scripts/ux/surfaces/header.json` -- low, deferred: Turbopack rejects this worktree, so neither can run here; the probe tools are optional until Demo day (lead, 2026-10-02). Deferred-work entry added.
