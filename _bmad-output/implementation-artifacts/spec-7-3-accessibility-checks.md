---
title: 'Story 7.3 Accessibility checks on every page'
type: 'feature'
created: '2026-10-05'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context:
  - '{project-root}/AGENTS.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** WCAG 2.2 AA on every page is a hard floor (NFR-1), but nothing re-checks it: a page could lose a focus ring, a label or contrast and every test would stay green (SPEC `_bmad-output/specs/andy/spec-7-3-accessibility-checks/SPEC.md`, CAP-1 to CAP-5).

**Approach:** A local Playwright project `a11y` (`npm run test:a11y`, apart from `@smoke`, Chrome, against the production build) that runs axe-core (WCAG 2.0 to 2.2 A/AA tags) on the 11 English page types and fails on any serious or critical violation; checks one H1 per page and alt text on every image; proves keyboard rules (a visible focus ring on paper, mist, amber and navy surfaces incl. the navy capture field; no focus inside closed mega or mobile menus, the inactive contact form tab or inactive PXP phone screens) and form error rules (`aria-invalid`, `aria-describedby`, an announced error) on the contact form, the capture band and the job form. The existing Story 1.1 contrast table gains the missing surface pairs (CAP-2) instead of a second test. A first scan on 2026-10-05 found 0 serious or critical violations on all 11 pages, so no page fix is planned; any failure found while writing the tests is fixed here and named in the PR (CAP-5).

</frozen-after-approval>

## UX checks

Sources: SPEC CAP-1 to CAP-4, AC-A11Y-1 to 5, T9 (2px ring), `EXPERIENCE.md` accessibility rules.

| Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| --- | --- | --- | --- | --- | --- | --- |
| Every page (11) | load | — | axe: 0 serious or critical; exactly one H1; every `img` has alt (empty when decorative) | — | CAP-1, CAP-4 | ✅ `npm run test:a11y` (Chrome, prod build): the 9 fixed pages plus the first story and first job page (the run fails if either list is empty); 0 serious or critical axe violations, one H1, alt on every image, no control nested in a link or button, no positive tabindex (`a11y-output.txt`) |
| Focus ring | Tab onto a control on paper, mist, amber and navy surfaces, incl. the navy capture field | keyboard | a visible ring (outline 2px, not transparent) | — | CAP-3, AC-A11Y-2, T9 | ✅ `test:a11y`: every Tab stop on Home, Products, Services, News, Demo and About (walked until focus wraps) has a 2px outline, a tile ::after outline or the capture row's solid 3px ring; one test proves stops on paper, mist, amber and navy. Ring contrast comes from the token table (CAP-2), not measured on the page |
| Closed menus, inactive tab, inactive PXP screens | Tab through the page | keyboard | focus never lands inside them | — | CAP-3, AC-A11Y-3 | ✅ `test:a11y`: no Tab stop inside a `[hidden]`, `inert` or `aria-hidden` part on those pages and at 390px; the mega menus, the mobile menu, the inactive contact tab and the inactive PXP panels exist and carry `hidden`. Menus opened and closed again are not walked |
| Contact form, capture band, job form | submit empty | keyboard | invalid fields get `aria-invalid` and `aria-describedby`; the error is in a live region or alert | — | CAP-3, AC-A11Y-5 | ✅ `test:a11y`: Enter on an empty field sets `aria-invalid`; every `aria-describedby` id resolves and holds error text; a live region or alert has text. One field per form |

## Implementation Notes
- First scan (2026-10-05): axe found 0 serious or critical violations on all 11 page types, so no page fix was planned.
- Fix found by the keyboard test (CAP-5): Chrome gives a date field's calendar button its own Tab stop, which showed no ring on `/demo`. `globals.css`: `.field input[type="date"]:focus-within` gets the 2px ring.
- CAP-2: the Story 1.1 contrast table gains `navy`, `error` and `focus` on `amber-deep`, and `amber-tint` and `white` on `navy-glow` (all pass); no second test.
- New: `e2e/a11y.spec.ts`, Playwright project `a11y` (Chrome) and `npm run test:a11y`; kept apart from `@smoke`.
- Local caveat: `.next/cache/fetch-cache` survives local builds and the webhook does not reach a laptop, so a local build can serve old Sanity data (it listed the closed sample job). Clear it before `test:a11y` (`rm -rf .next/cache/fetch-cache`). The detail tests now require a 200, so a stale link fails loudly.
- Checks: lint, typecheck, format pass; `npm run test:coverage -- --maxWorkers=3` 1135 passed (only CSS changed in `src/`, which the coverage report does not count, so diff-cover has nothing to measure); `npm run test:smoke` 15 passed; `npm run test:a11y` 21 passed.
- Review round (5 layers less Security, which had no runtime path): the suite now fails instead of skipping when no story or job link exists, walks each page until focus wraps (by element position), checks Tab order against page order, 24 x 24px targets (inline text links exempt, a checkbox measured by its label), nested controls, positive tabindex, `inert`/`aria-hidden` parts, the 390px mobile menu, and non-empty described error text.
- Fixes found by the new target check (CAP-5): the breadcrumb links (19px tall) and the `/demo` office contact links (18px) get a 24px minimum height, like the footer links. Checked at 1280 and 390: no layout change, no sideways scroll.
- After the fixes: `npm run test:a11y` 23 passed; lint, typecheck, format pass; 1135 unit tests; smoke 15.

## Review Triage Log

| # | Finding | Verdict | Route |
| --- | --- | --- | --- |
| 1 | Detail and job-form tests skip when no link exists (all layers) | medium | patch: fail instead |
| 2 | Surface coverage depends on test order (all layers) | medium | patch: one self-contained test |
| 3 | Tab walk can stop early on a repeated label; limit not asserted (Blind, Edge) | medium | patch: wrap detected by element position |
| 4 | Tab order, 24px targets and nested controls only implied by axe (Acceptance) | medium | patch: explicit checks; two real fixes |
| 5 | Closed-part check only `[hidden]`; mobile menu never walked (Blind, Edge, Acceptance) | medium | patch: `inert`/`aria-hidden`, a 390px walk, existence check |
| 6 | Described error element not checked for text (Verification Gap, Edge) | medium | patch |
| 8 | Round 2: walk end not asserted; `li` links exempt from 24px; 390px walk thin; `firstDetail` fallback to "" (Blind, Edge, Acceptance) | medium | patch; the 390px walk found the squashed mobile capture field (fixed) |
| 7 | Ring contrast not measured on the page; `incomplete` axe results ignored; one field per form; opened menus not scanned; Chrome needed; local Sanity cache | low | deferred in `deferred-work.md` |
- Round 2 (4 layers): the walk now fails unless focus leaves the page or wraps within 150 presses; the inline-link exemption covers only links in `p` and `small` (not list links); the label box counts only for checkboxes and radios; the 390px walk runs the full keyboard rules; `firstDetail` throws on a missing href.
- Fix found by the 390px walk (CAP-5): in the stacked mobile capture row, `flex: 1` squashed the email field to 20px tall; `flex: none` keeps its 50px (checked in a 390px screenshot).
- After round 2: `npm run test:a11y` 23 passed.
