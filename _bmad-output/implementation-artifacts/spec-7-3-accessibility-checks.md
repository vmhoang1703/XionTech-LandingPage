---
title: 'Story 7.3 Accessibility checks on every page'
type: 'feature'
created: '2026-10-05'
status: 'in-review'
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
| Every page (11) | load | — | axe: 0 serious or critical; exactly one H1; every `img` has alt (empty when decorative) | — | CAP-1, CAP-4 | ✅ `npm run test:a11y` (Chrome, prod build): 11 page types, 0 serious or critical axe violations (incl. target-size and nested-interactive), one H1, alt on every image; the story and job pages must answer 200 (`a11y-output.txt`) |
| Focus ring | Tab onto a control on paper, mist, amber and navy surfaces, incl. the navy capture field | keyboard | a visible ring (outline 2px, not transparent) | — | CAP-3, AC-A11Y-2, T9 | ✅ `test:a11y` keyboard: every Tab stop on Home, Products, Services, News, Demo and About shows a 2px outline (or the capture row's 3px ring, or a tile's ::after ring); stops seen on paper, mist, amber and navy |
| Closed menus, inactive tab, inactive PXP screens | Tab through the page | keyboard | focus never lands inside them | — | CAP-3, AC-A11Y-3 | ✅ `test:a11y` keyboard: no Tab stop inside a `[hidden]` part on those six pages |
| Contact form, capture band, job form | submit empty | keyboard | invalid fields get `aria-invalid` and `aria-describedby`; the error is in a live region or alert | — | CAP-3, AC-A11Y-5 | ✅ `test:a11y` form errors: Enter on an empty field sets `aria-invalid`, a resolvable `aria-describedby` and announced text |

## Implementation Notes
- First scan (2026-10-05): axe found 0 serious or critical violations on all 11 page types, so no page fix was planned.
- Fix found by the keyboard test (CAP-5): Chrome gives a date field's calendar button its own Tab stop, which showed no ring on `/demo`. `globals.css`: `.field input[type="date"]:focus-within` gets the 2px ring.
- CAP-2: the Story 1.1 contrast table gains `navy`, `error` and `focus` on `amber-deep`, and `amber-tint` and `white` on `navy-glow` (all pass); no second test.
- New: `e2e/a11y.spec.ts`, Playwright project `a11y` (Chrome) and `npm run test:a11y`; kept apart from `@smoke`.
- Local caveat: `.next/cache/fetch-cache` survives local builds and the webhook does not reach a laptop, so a local build can serve old Sanity data (it listed the closed sample job). Clear it before `test:a11y` (`rm -rf .next/cache/fetch-cache`). The detail tests now require a 200, so a stale link fails loudly.
- Checks: lint, typecheck, format pass; `npm run test:coverage -- --maxWorkers=3` 1135 passed (no `src/` lines changed, so diff-cover has nothing to measure); `npm run test:smoke` 15 passed; `npm run test:a11y` 21 passed.
