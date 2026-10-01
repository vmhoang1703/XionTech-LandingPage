---
title: 'Story 1.3: Desktop header, mega menus and skip link'
type: 'feature'
created: '2026-10-01'
status: 'done'
baseline_commit: 'f2b8eb2cef604e5ba7e3bd47fcc38483ae222e6e'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/AGENTS.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Pages have no header: no way to reach a product, a service or Book a demo, and no skip link. Every later page story assumes a shared header in the root layout (contract: `_bmad-output/specs/andy/spec-1-3-desktop-header/SPEC.md`, CAP-1 to CAP-6).

**Approach:** Port the prototype header (`site.js` `#site-header`, `site.css` lines 37–98) as a server-rendered `SiteHeader` with one client `SiteNav` for menu state, mounted in the root layout above a layout-owned `<main id="main">`. Decisions T9 (focus ring 2px) and T10 (no footer mount, CAP-7 deferred) apply.

## Boundaries & Constraints

**Always:**
- Above 1080px: sticky glass header, 72px, logo left, nav middle, tools right. Nav: Products, Services (mega triggers, `<button>`, text only, no caret), News `/news`, About `/about`, Careers `/careers`; all 40px high.
- Every visible string and every product/service row lives in one data module, so Story 1.2 can translate labels and a new product is one new row. Product and service names stay English.
- Products mega: PXP, LXP, SXP, IoT Device Management with name, value line and "for" line (exact strings from the prototype; SXP "for" line is "Staff, Teachers, Leaders"), links `/products#pxp|#lxp|#sxp|#iot`, footer "More products are on the way." + "All products" → `/products`.
- Services mega: the 8 services → `/services#product-engineering|#ai-analytics|#co-creation|#staffing|#custom-apps|#low-code|#ai-solutions|#cloud`; footer "Our 4-D process: Discovery, Design, Development, Deployment." + "See the process" → `/services#process`.
- Book a demo (`.btn .btn-primary .btn-sm`) → `/demo#form`, shown above 640px only. The EN/VI slot stays empty for Story 1.2.
- Skip link "Skip to content" → `#main`, first focusable element, amber pill (`--radius-full`) when focused; `main#main` has `tabIndex={-1}` so it receives focus.
- The root layout owns the one `<main id="main">`; page files never render `<main>`.
- Logo: `public/logo.png` (copy of the UX brand input `imports/xiontechs-logo.png`, 250×46), 32px high (26px at ≤640px), link `/` with `aria-label="XionTechs home"`, image alt "XionTechs, Get IT Done".
- `globals.css`: focus ring `outline` 2px (T9); `scroll-padding-top` = header height so hash targets are not hidden under the sticky header.
- Brand tokens only; UX docs win over the prototype where they differ.

**Never:** hover opening, the 150ms close delay, mega fade/drop animation (after demo); mobile menu, menu button, Book a demo as menu item (Story 1.4); EN/VI switch (1.2); breadcrumbs (1.6); mounting the footer (T10); new npm dependencies; icons or carets in the nav.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Open | click Products (closed) | Products panel shown, its trigger `aria-expanded="true"` | N/A |
| Toggle | click Products (open) | panel hidden, `aria-expanded="false"` | N/A |
| Switch | Products open, click Services | Products closes, Services opens | N/A |
| Escape | menu open, focus inside it | menu closes, focus on its trigger | Escape with no menu open does nothing |
| Outside | menu open, pointer down outside the nav | menu closes, focus not moved | N/A |
| Navigate | link inside a menu activated, or pathname changes | menu closes | N/A |
| Current | pathname `/news/x`, `/careers/x`, `/about` | parent item has `aria-current="page"`, navy bold, 2px amber underline | `/`, `/demo`, unknown paths mark nothing |
| Current mega | pathname `/products` or `/services` | that trigger has `aria-current="page"` and the current style | N/A |
| Closed panel | menu closed | panel not rendered visible and not in the tab order | N/A |

</frozen-after-approval>

## Code Map

- `src/components/layout/nav-data.ts` (new) -- labels, products, services, mega footers, `currentSection(pathname)`; plain data + one pure function.
- `src/components/layout/site-nav.tsx` (new, `"use client"`) -- nav items, triggers, both panels, open state, Escape / outside pointer / navigation close; `usePathname` from `next/navigation`.
- `src/components/layout/site-header.tsx` (new, Server Component) -- skip link, `<header>`, logo (`next/image`), `<SiteNav/>`, tools slot.
- `src/app/layout.tsx` -- render `<SiteHeader/>` then `<main id="main" tabIndex={-1} className="flex flex-1 flex-col">{children}</main>` inside `<body>`; fonts and metadata unchanged.
- `src/app/page.tsx` -- outer `<main>` becomes `<div>` (classes kept).
- `src/app/globals.css` -- `:focus-visible` outline 2px (line ~274); `.skip:focus` radius → `--radius-full`; `html { scroll-padding-top: var(--spacing-header-height) }`; reuse `--z-index-header` (50), `--z-index-skip-link`, `.wrap`, `.btn*`, `--color-border`, `--radius-lg`, type tokens `text-ui`, `text-title-sm`, `text-label-sm`.
- Tests: `src/app/layout.test.tsx`, `src/app/page.test.tsx`, `src/app/no-js.test.tsx` mock `next/navigation` (`usePathname`); `src/lib/design/contrast.test.ts` pins the T9/skip rules.
- Reference only: prototype `mockups/site-v3/js/site.js` lines 12–47 and 105–117, `css/site.css` 37–98, 428–433, 528–547; DESIGN.md "Site header"; EXPERIENCE.md nav rules.
- Do not touch: `scripts/`, `_bmad*`, `e2e/`, config files, `src/components/layout/site-footer.tsx`.

## Tasks & Acceptance

**Execution:**
- [x] `src/components/layout/nav-data.ts` -- data module + `currentSection` -- one string source (SPEC constraint)
  - red: `src/components/layout/nav-data.test.ts` -- `currentSection` maps `/news/x`→news, `/careers/x`→careers, `/products`→products, `/`→none; 4 products and 8 service anchors in order
- [x] `src/components/layout/site-nav.tsx` -- client nav per the I/O Matrix -- CAP-1 to CAP-4
  - red: `src/components/layout/site-nav.test.tsx` -- every I/O Matrix row
- [x] `src/components/layout/site-header.tsx` + `public/logo.png` -- header shell -- CAP-1, CAP-5, CAP-6
  - red: `src/components/layout/site-header.test.tsx` -- skip link is the first link and targets `#main`; logo link `/`; Book a demo → `/demo#form`
- [x] `src/app/layout.tsx`, `src/app/page.tsx` + their tests and `no-js.test.tsx` -- mount header, layout-owned main -- CAP-5
  - red: `src/app/layout.test.tsx` -- header renders before `main#main` with `tabindex="-1"` wrapping the page
- [x] `src/app/globals.css` -- T9 2px ring, pill skip link, `scroll-padding-top` -- T9, CAP-5
  - red: `src/lib/design/contrast.test.ts` -- `:focus-visible` outline width is 2px and `.skip:focus` uses `--radius-full`

**Acceptance Criteria:**
- Given a viewport wider than 1080px, when any page loads, then the sticky glass header shows logo, the five nav items and Book a demo; at 1080px and below the nav items are hidden (Story 1.4 adds the menu), and at 640px and below Book a demo is hidden.
- Given a keyboard user on any page, when they press Tab once, then "Skip to content" shows as an amber pill, and activating it moves focus to `main`.
- Given JavaScript is off, when a page is server-rendered, then the header and page content render with both panels closed and no client script in the markup.

## Design Notes

- Breakpoints: tokens are 640/1080 with "at or below" meaning, so use `min-[1081px]:` for the nav and `max-[640px]:` for hiding Book a demo (Tailwind `lg:`/`sm:` would be off by one).
- Open state: one `useState<"products" | "services" | null>`. Close on navigation without `setState` inside a `useEffect` body (React 19 lint rule): e.g. remember the pathname the menu was opened on and treat a different pathname as closed. Outside-pointer and Escape listeners are attached only while a menu is open.
- Closed panels use the `hidden` attribute (out of the tab order and the accessibility tree); triggers get `aria-expanded` and `aria-controls`.
- Prototype values with no token (mega shadow `0 30px 70px -24px rgb(22 54 99 / 0.3)`, 16px item radius, glass `blur(16px) saturate(170%)` over page at 78%) are kept as literals in one place.
- Without JavaScript the mega triggers do nothing; products and services stay reachable from the footer link columns (Story 1.5).
- Read `node_modules/next/dist/docs/` for `Link`, `Image` and `usePathname` before use.

## Verification

**Commands:**
- `npm run lint && npm run typecheck && npm run format:check` -- expected: exit 0
- `npm run test:coverage && npm run coverage:diff` -- expected: exit 0, 100% changed lines, C1 ok
- `npm run build && npm run test:smoke` -- expected: exit 0

**Manual checks (if no CLI):**
- `npm run dev`, Chrome at 1280px: first Tab shows the amber skip-link pill and Enter focuses `main`; click Products opens it, Escape closes it with focus back on Products; open Services then click outside closes it; "See the process" goes to `/services#process`; Book a demo goes to `/demo#form`; at 1000px the nav items are gone; at 600px Book a demo is gone.

## Implementation Notes

## Spec Change Log

## Review Triage Log

- 1 (acceptance-auditor, blind-hunter, edge-case-hunter, verification-gap, Task 1 minor) `nav-data.ts` currentSection prefix match without segment boundary — low: `/newsletter`, `/aboutus` (Not found pages) get a wrong `aria-current`, contradicting "unknown paths mark nothing" — patch P1
- 2 (blind-hunter, edge-case-hunter, verification-gap, Task 1 minor) currentSection lowercases and its comment claims trailing-slash removal — low: `/News` is marked current though routes are case-sensitive; the comment misleads — patch P1 (same matcher)
- 3 (blind-hunter, Task 1 minor) currentSection returns loose `string` — low: `section === menu` comparisons in `site-nav.tsx` are not type-checked; a one-line union type fixes it — patch P1
- 4 (blind-hunter, edge-case-hunter, Task 2 minor) nav `aria-label="Primary"`, logo `aria-label` and alt outside the data module — low: Story 1.2 would miss them when translating — patch P2 (hrefs are routes, not strings: false for that part)
- 5 (blind-hunter) logo `aria-label` hides the image alt — low, rejected: the spec's Always list requires both strings and the prototype does the same; the fix would edit this spec
- 6 (blind-hunter, edge-case-hunter) a menu stays open when keyboard focus Tabs out of it — medium: the open panel covers the page top, so the newly focused control can sit under it (WCAG 2.2 AA 2.4.11) — patch P3
- 7 (edge-case-hunter, Task 2 minor) Escape moves focus to the trigger even when focus is outside the nav — low: only reachable through finding 6 — patch P3 (same root cause)
- 8 (edge-case-hunter) open menu persists through a resize to 1080px or below — low, rejected: unlikely in everyday use; the fix adds a media-query listener
- 9 (edge-case-hunter) same-path hash or query navigation outside the menu keeps it open — low, rejected: clicks outside the nav already close it; the fix adds hash tracking
- 10 (blind-hunter, edge-case-hunter) after the skip link, `main` gets the global 2px focus outline around the whole content — low: every keyboard user of the skip link sees it; one CSS rule — patch P4
- 11 (edge-case-hunter) unfocused `.skip` has no `top` — false: `left: -999px` keeps it off-screen in this left-to-right site (EN/VI); nothing is exposed
- 12 (blind-hunter, controller, Task 2 minor) mega names not Unbounded 600, "for" lines not Lexend Exa uppercase 0.14em, nav items lack the mist pill on hover/open and the prototype current style — medium: visible mismatch with the approved prototype and DESIGN.md title-sm / label-sm — patch P5
- 13 (controller) `next/image` `priority` is deprecated in Next.js 16 (docs: use `loading="eager"` or `fetchPriority="high"`) — low: AGENTS.md says heed deprecations — patch P6
- 14 (blind-hunter, edge-case-hunter, Task 4 minor) `layout.test.tsx` "places children inside body" asserts only `toBeDefined()` — low: a test that cannot fail — patch P7
- 15 (blind-hunter, Task 4 minor) `layout.test.tsx` walks `html.props.children.props.children` — low, rejected: RootLayout renders `<html>`, so walking props is the practical way; the alternative adds a test harness
- 16 (blind-hunter, Task 5 minor) no test pins `html { scroll-padding-top }` — low: a later edit could hide `#process` under the header silently; one assertion with the existing helper — patch P7
- 17 (blind-hunter, Task 3 minor) no test for the 1081px / 640px breakpoints — low, rejected: jsdom cannot evaluate media queries; Chrome evidence covers both (browser-check.json at1000/at600)
- 18 (blind-hunter) `it.each` titles have the wrong argument order — false: titles read "marks /news/x as current on News", the intended wording
- 19 (blind-hunter) Services panel may overflow just above 1081px — false: at 1081px the content starts 24px from the left (44px at 1280px, where the panel ends at 985px), so the panel ends near 965px
- 20 (blind-hunter) `verification.txt` has ANSI codes and "6 files fully covered" vs 3 listed — false: it is the tools' real output, which the evidence contract requires; the summary line counts fully covered files that the table omits
- 21 (blind-hunter, edge-case-hunter) the JavaScript-off criterion is proven only by the server-render unit test, not in a browser — low: evidence gap, not a code defect — handled in Re-verify with a JavaScript-disabled Chrome check
- 22 (blind-hunter) ledger has an absolute identity path and `<scratchpad>` report paths — false: the ledger contract requires the absolute spec path; report paths are abbreviated on purpose so no machine path is committed
- 23 (blind-hunter) ledger line numbers do not match the final files — false: rows are append-only history of the code at review time
- 24 (blind-hunter) no navigation at 1080px and below, and linked pages are Not found — rejected, out of scope by intent: SPEC non-goals give the mobile menu to Story 1.4 and the pages to their stories
- 25 (blind-hunter) Spec Change Log and Review Triage Log are empty — false: this step fills the triage log; the change log is only for loopbacks
- 26 (edge-case-hunter) Code Map says `page.test.tsx` mocks `next/navigation` but the diff does not touch it — rejected: the fix edits this build's spec
- 27 (Task 2 minor) full-span test checks the class only — low, rejected: jsdom cannot lay out a grid; Chrome evidence shows `footerSpan 1/-1`
- 28 (Task 3 minor) "skip link first" test uses `getAllByRole("link")[0]` — low, rejected: an earlier hidden link is hypothetical; a stricter check adds complexity
- 29 (acceptance-auditor) prototype strings and Tailwind tokens unverifiable from the diff — false: the controller compared all 15 strings with `site.js` (ledger, Task 1 review row) and every token exists in `globals.css` (Task 5 review, verification-gap)
- security-auditor: clean. verification-gap: no gaps.
- 30 (patch re-review) `closeOnFocusOut` ignores a null `relatedTarget` — low, rejected: that happens only when focus leaves the page (browser chrome); closing a menu because the window lost focus is not wanted, and clicks are covered by the pointer handler
- 31 (patch re-review) `hover:text-navy` was removed from nav items — false: the prototype `.menu>a:hover` changes only the background (mist), not the text colour
- Re-audit of the re-captured evidence: compliant, all 9 artifacts match their recorded bytes and hashes.
- Follow-up after done (2026-10-01, commit cdc7c8d): the UX quality loop (`docs/ux-quality.md`, branch `feature/ux-quality-loop`) measured the header against the prototype with `npm run ux:parity` and fixed background colour, gaps, nav item line-height, the mega value line and the skip-link text; the UX critic added the hand cursor on buttons and hover fades. Light review (edge-case layer, 35 lines): 12 findings — 8 false (`--ease-brand` and `--color-page` exist; reduced motion computes `transition-duration: 0s`; Chrome computes `cursor: pointer`; the prototype fades the same way; current-page style changes on navigation, not hover; the skip link now matches the prototype; 278px free at 1081px), 4 low rejected (roles and `aria-disabled` buttons the site does not use, focus-ring colour fade between two dark navies, a prototype value with no token).

## Acceptance Evidence

Re-captured in step-04 after the review patches (commit 6011653) on 2026-10-01. The step-03 set stays in the ledger as history.

**Commands**

- `npm run lint && npm run typecheck && npm run format:check` -- exit 1, then exit 0 -- first run: Prettier flagged `src/app/globals.css` (CRLF in the working copy only; the committed file was LF); re-run: All matched files use Prettier code style!
- `npm run test:coverage && npm run coverage:diff` -- exit 0 -- Tests 189 passed (189); Coverage: 100%; C1 ok: 5 changed file(s)
- `npm run build && npm run test:smoke` -- exit 0 -- ✓ Compiled successfully; 1 passed

**Observed**

- `npm run dev` in real Chrome at 1280px: first Tab shows the amber skip-link pill (2px navy ring); Enter focuses `main#main`, which shows no outline -- browser-check-2.json, skip-link-2.png
- Products opens as a 660px two-column panel; names in Unbounded 600, "for" lines in Lexend Exa uppercase 0.14em; the open trigger has the mist pill; Escape closes it with focus on Products; Tab out of the panel closes it -- browser-check-2.json, products-open-2.png
- Opening Services closes Products; a click outside closes it; "See the process" → `/services#process` and Book a demo → `/demo#form` with the panel closed -- browser-check-2.json, services-open-2.png
- Hovered nav items show the mist pill (40px, radius 9999px); on `/about`, About is bold navy with an inset 2px amber underline -- browser-check-2.json
- At 1000px the nav is hidden; at 600px the nav and Book a demo are hidden and the logo is 26px -- browser-check-2.json, header-600-2.png
- With JavaScript disabled, the header, skip link, `main#main` and page text render and both panels stay closed -- browser-check-2.json, no-js.png

**Artifacts**

- [verification-2.txt](spec-1-3-desktop-header-evidence/verification-2.txt) -- 3298 bytes -- sha256 78c18f4047f8 -- real shell-traced output of the Verification commands after the review patches
- [browser-check-2.json](spec-1-3-desktop-header-evidence/browser-check-2.json) -- 2104 bytes -- sha256 5f0a941c487f -- Chrome states after the patches, incl. Tab-out, hover pill, mega fonts, JavaScript-off
- [skip-link-2.png](spec-1-3-desktop-header-evidence/skip-link-2.png) -- 11215 bytes -- sha256 37cff100c0f4 -- focused skip link, amber pill
- [products-open-2.png](spec-1-3-desktop-header-evidence/products-open-2.png) -- 86646 bytes -- sha256 d831578490f2 -- Products open: Unbounded names, uppercase for-lines, open trigger pill
- [services-open-2.png](spec-1-3-desktop-header-evidence/services-open-2.png) -- 83369 bytes -- sha256 691db0d3c035 -- Services open
- [header-600-2.png](spec-1-3-desktop-header-evidence/header-600-2.png) -- 5546 bytes -- sha256 26725eb7f853 -- header at 600px: no nav, no Book a demo
- [no-js.png](spec-1-3-desktop-header-evidence/no-js.png) -- 23245 bytes -- sha256 2c47e4820c75 -- JavaScript disabled: header and content render, panels closed
- [observed.md](spec-1-3-desktop-header-evidence/observed.md) -- 3706 bytes -- sha256 d139bc1410f9 -- how the surface was reached and what was seen, both runs

**Not captured**

- `/services` and `/demo` show Not found until their stories land; the header links were checked to reach those URLs only.
