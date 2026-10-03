---
title: 'Story 1.7: Not found page'
type: 'feature'
created: '2026-10-03'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context:
  - '{project-root}/AGENTS.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** A visitor on a broken or mistyped link reaches a dead end (FR-9).

**Approach:** Add `src/app/not-found.tsx` (Next.js 16 convention, real 404) with the static navy hero from the prototype: label "404", H1 "We couldn't find that page." (highlight on "that page"), lede, primary "Go to Home" and glass Products, Services, News links. Copy lives in `src/content/not-found.ts`. No capture band. Spec: `_bmad-output/specs/andy/spec-1-7-not-found-page/SPEC.md` (CAP-1 to CAP-3).

</frozen-after-approval>

## Implementation Notes

- Files: `src/content/not-found.ts`, `src/app/not-found.tsx`, `src/app/not-found.test.tsx`, `e2e/not-found.spec.ts` (`@smoke`: unknown path is 404 and shows the copy).
- Reuse `.hero-navy`, `.wrap`, `.label`, `.hl`, `.lede`, `.btn-primary`, `.btn-glass` from `globals.css`; Phosphor `ArrowRightIcon` from `/ssr` as in `home-hero.tsx`. Header and footer come from the root layout (decision T10, PR #22); not edited here.
- The root layout already wraps `main`, so the page renders one section and one H1 only.
- No aurora or strands (Story 1.6), no VI text (Story 1.2).

## UX checks

| Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| ---- | --------------- | ----- | ------------------ | ------ | ------ | ------- |
| Response | open an unknown path | any | HTTP 404 | - | CAP-1 | e2e not-found.spec |
| Hero | page loads | any | navy gradient hero, min height 70dvh, content vertically centred | - | mockup 404.html, DESIGN.md hero-navy | hand (code) |
| Label | page loads | any | "404" with amber rule | - | CAP-1, DESIGN.md label | not-found.test |
| H1 | page loads | any | "We couldn't find that page."; "that page" has the amber highlight mark; one H1 | - | CAP-1, CAP-3 | not-found.test |
| Lede | page loads | any | "The link may be old or mistyped. These pages can help." | - | CAP-1 | not-found.test |
| Go to Home | page loads | any | one amber primary button with arrow, links to `/` | - | CAP-2 | not-found.test |
| Go to Home | hover | mouse | stronger amber glow | - | DESIGN.md btn-primary | hand (shared `.btn` style) |
| Go to Home | Tab to it, Enter | keyboard | visible focus ring; goes to `/` | - | EXPERIENCE.md Accessibility Floor | hand (shared `.btn` style) |
| Products, Services, News | page loads | any | three glass buttons linking `/products`, `/services`, `/news` | - | CAP-2 | not-found.test |
| Glass buttons | hover | mouse | border turns heading colour | - | DESIGN.md btn-glass | hand (shared `.btn-glass`) |
| Glass buttons | tap | touch, pen | go to the route; no hover-only behaviour | - | EXPERIENCE.md Responsive | hand (links) |
| Buttons row | width 640px or less | any | buttons wrap, no sideways scroll | - | EXPERIENCE.md Responsive | hand (flex-wrap) |
| Header and footer | page loads | any | site header above, footer below | - | CAP-3, T10 | layout.test (root layout) |
| Capture band | page loads | any | not present | - | CAP-3, EXPERIENCE.md line 74 | not-found.test |
| Motion | page loads | any | static, no aurora or strands | - | Non-goals (Story 1.6) | hand (code) |

Tests: RED `npx vitest run src/app/not-found.test.tsx` failed (module `./not-found` missing); GREEN after code: 4 tests pass. Lint, prettier and tsc clean for touched files (tsc shows only `LayoutProps` errors from missing generated types in this worktree, not from this change). Full suite, coverage, smoke and build left to the controller.

## Review Triage Log

- Dead links to /products, /services, /news: false for this story. The spec requires them; the routes belong to other stories.
- No page title or noindex: medium, patched (metadata added, mockup has title and noindex, test added).
- e2e asserts an escaped apostrophe: low, patched (asserts "that page" instead).
- Unit test proxies for main/band, copy repeated in tests, no axe, nested paths: low, rejected (tests say what they prove; extra checks add more than a simple fix).
- Contact link on the page: false, not in the spec (CAP-2 says exactly four links).

## Full Review (before PR, 2026-10-03)

Five layers (Blind Hunter, Edge Case Hunter, Verification Gap, Acceptance Auditor, Security Auditor). No Critical or Important findings, so nothing was patched.

| # | Finding (source) | Verdict | Route | Evidence |
|---|---|---|---|---|
| 1 | Acceptance: header and footer on the 404 page not visible in the diff | maybe-false | evidence | Browser walk on the built branch: 1 header, 1 footer, 0 capture bands, status 404, at 1280px and 390px (`spec-1-7-not-found-page-evidence/walk-output.txt`). |
| 2 | No UX checks table in the diff (Blind) | false | reject | The table is in this spec; the controller excluded `_bmad-output` from the review diff. |
| 3 | `/products`, `/services`, `/news` links lead to 404 today (Blind, Edge) | low | reject | Same links as the header; the page stories build those routes (plan C). |
| 4 | e2e test matches copy, not the page itself; noindex not checked end to end; band absence checked by one string (Blind, Edge) | low | defer | Smoke still proves the 404 status and the copy. |
| 5 | `min-h-[70dvh]` untested at 320px and short screens (Edge) | low | defer | Walk at 390px shows no sideways scroll. |
| 6 | Test names, content typing, icon `aria-hidden`, label class (Blind, Edge) | low | defer | Cosmetic test and typing points. |
| 7 | Verification Gap and Security | — | — | No gaps; clean. |
