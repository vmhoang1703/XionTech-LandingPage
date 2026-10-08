---
title: 'E-A3 a simpler header: six plain links, no mega menus, no Book a demo'
type: 'feature'
created: '2026-10-08'
baseline_commit: '2bc2965b7a8c1c8536614fa241b08a34fe50b3b5'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context:
  - '{project-root}/AGENTS.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The header still has the Products and Services mega menus, a Book a demo button, a bottom border, pill hovers and a "Menu" text pill. The prototype header (`prototype-enhancement/prototype/js/site.js:12-29`, `css/site.css:91-114, 505-511, 618-624`) is six plain links on the right with an underline hover and a hamburger icon. Planned spec: `_bmad-output/specs/andy/spec-enh-a3-header/SPEC.md` (ENH-002 header part, ENH-085).

**Approach:** Home, Products, Services, News, About, Careers as plain links in `NAV_LINKS`; Home is current only on exactly `/`. Remove the mega menus and their data, the Book a demo button (header and mobile menu) and the header border. Underline-only hover, 30px gap, no side padding above 1080px. The mobile button is a Phosphor `List`/`X` icon, 44px, name "Menu".

Decisions (lead, 2026-10-08): Q8 yes — no Book a demo in the header or the mobile menu. Q10 — no EN/VI switch before the demo. Q14 Tier 1 only; Demo day 2026-10-16. Decision T11 (hover-opened mega menus) no longer applies; the PR says so. Weights stay as E-A1 set them (all links 500, `--text-ui` weight); the prototype's 450 for non-current links was rejected in E-A1. App names stay in `apps.ts`; the header no longer shows them.

</frozen-after-approval>

## Implementation Notes

Files: `nav-data.ts` (+test), `site-nav.tsx` (+test), `mobile-menu.tsx` (+test), `site-header.tsx` (+test), `e2e/a11y.spec.ts` (hidden-part list only). Header styles stay as Tailwind classes in the components; no `globals.css` block is needed. `SERVICES` stays (contact form, `services.test.ts` use it). `PRODUCTS`, `PRODUCTS_FOOTER`, `SERVICES_FOOTER`, `Product`, `MegaFooter` and `LABELS.bookDemo` go (nothing else uses them). The mobile menu's "focus the #part on this page" branch only served `/demo#form`; it goes with that link.

Not touched (other owners or optional tools): `--z-index-mega-menu` token (checked in `contrast.test.ts`), `scripts/ux/surfaces/header.json` (still names `#mega-products`; optional `ux:parity` tool) → deferred-work.md.

UX checks (`docs/ux-checks.md`), written before coding.

| # | Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Desktop nav | load at 1280px | none | logo left; Home, Products, Services, News, About, Careers on the right; no Book a demo; no header bottom border | static | site.js:16-23, ENH-002 || yes: browser 1280 (/, /news, /demo, 404, /products): six links, nav ends 24px from the wrap edge, border 0px, no Book a demo |
| 2 | Nav link | hover | mouse | navy text, 2px amber underline exactly under the word, no pill background | 250ms | site.css:97, 618-624 || yes: browser hover News: navy, inset amber 2px, no background, box 41px = text 41px |
| 3 | Nav spacing | load at 1280px | none | 30px between words, links 44px tall | static | site.css:96, 621-622 || yes: browser gaps 30/30/30/30/30, height 44 |
| 4 | Current link | `/` and `/news/x` | none | Home current only on `/`; News current on `/news/x`; one current link; none on `/demo` and the 404 | static | CAP-1 || yes: site-nav.test (9 paths) + browser |
| 5 | Nav link | Tab | keyboard | Tab goes skip link, logo, then six links in order; 2px focus ring | static | T9, CAP-3 || yes: browser Tab: skip, logo, Home…Careers, all 2px solid |
| 6 | Menu button | load at 390px and 800px | none | list icon, 44x44, no border; no desktop nav | static | site.css:111, 508 || yes: browser 390 and 800: 44x44, border 0, list icon, desktop nav hidden |
| 7 | Menu button | click / tap | mouse, touch | panel opens with the six links; icon becomes a cross; button underlined while open | instant | site.js:166, site.css:112 || yes: mobile-menu.test + browser: x icon, underline, six links, Home current |
| 8 | Mobile menu | choose a link; Escape; widen past 1080px | touch, keyboard, resize | menu closes; Escape returns focus to Menu | instant | T6 || yes: mobile-menu.test + browser: News link closes, Escape → Menu, widen to 1200 closes |
| 9 | Mobile menu | Tab while open | keyboard | focus cycles logo, Menu, the six links | static | EXPERIENCE.md "Mobile menu" || yes: browser 390 and 800 (real header): Home…Careers, logo, Menu, Home |

Tests first: `npx vitest run src/components/layout` -- 18 failed, 62 passed (red); after the code -- 80 passed (green). Commit 74ed412.

Surprise: the mobile menu's "focus the #part on this page" branch only served the removed `/demo#form` link, so it went with it (and its test).

## Review Triage Log

Full `bmad-code-review`, 4 layers (blind hunter, edge-case hunter, verification gap, acceptance auditor), 2026-10-08.

- patch (medium): `data-icon` attributes on the Phosphor icons existed only for tests (CLAUDE.md hygiene) → removed; the test now tells the icons apart by their rendered SVG (blind, acceptance).
- patch (medium): the Menu button's `ml-auto` (keeps it at the right edge below 1081px) had no assertion → added (verification gap).
- defer (low): `scripts/ux/surfaces/header.json` still targets the mega menus (edge, blind, acceptance) → deferred-work.md.
- defer (low): `--z-index-mega-menu` token now unused (all layers) → deferred-work.md; `globals.css` and `contrast.test.ts` are shared with parallel tasks.
- defer (low): `products.ts:121` comment names the removed mega menu (edge, acceptance) → E-A5's file, deferred-work.md.
- defer (low): `EXPERIENCE.md`, PRD/epics AC-NAV-2/3, `docs/ux-checks.md` examples describe the old header (blind) → Amber's docs, deferred-work.md.
- rejected (false): "AC-NAV-2 change has no recorded decision" → decision Q8 is in the frozen intent; ai-log entry added.
- rejected (false): mobile panel underline spans the full row → the prototype's `.menu.mobile-open` stretches links with 14px padding too (site.css:510, 96).
- rejected (false): duplicate `./nav-data` import may fail lint → `npm run lint` passes.
- rejected (false): commit message claims all mega-menu data is gone → the removed exports are gone; leftovers are deferred above.
- rejected (low): padding regex misses `pr-`/`ps-` and checks one link; no e2e for header layout; no Home same-page focus test; `max-[641px]:gap-3` untested; stale test name "maps unknown paths to empty string" (pre-existing); old ai-log text about `#form` focus (history) → browser check covers the layout; low value.
- rejected (low): no real-header trap test at 800px → browser check at 800px shows logo, Menu and the six links in the cycle.
- note: the PR must say decision T11 (hover-opened mega menus) no longer applies (acceptance).

## Verification

**Commands:**
- `npm run lint && npm run typecheck && npx prettier --check src e2e studio` -- expected: clean
- `npm test` -- expected: all pass
- `npm run test:coverage && npm run coverage:diff` -- expected: 100% changed lines, C1 >= 80%
- `npm run build` -- expected: success

**Manual checks:**
- `next start --port 3203`, Playwright (Chrome): rows 1-9 at 1280px, 800px and 390px.

## Acceptance Evidence

Captured after the review patches, 2026-10-08.

- `npm run lint`, `npm run typecheck`, `npx prettier --check src e2e studio` -- exit 0
- `npm test` -- 80 files, 1159 passed
- `npm run test:coverage && npm run coverage:diff` -- diff coverage 100% (6 lines, 0 missing); C1 ok, 4 changed files >= 80%
- `npm run build` -- compiled, 16 static pages
- Browser: `next start --port 3203`, Playwright (Chrome) at 1280px, 800px and 390px -- rows 1-9 above. The review patches changed only the icon attributes and a test, so the browser check was not repeated.

Artifacts in `spec-enh-a3-header-evidence/`: `verification.txt`, `browser-check.txt`, `header-1280.png`, `hover-1280.png`, `closed-390.png`, `open-390.png`, `closed-800.png`, `open-800.png`.
