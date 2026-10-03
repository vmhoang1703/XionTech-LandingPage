---
title: 'Story 2.1: Privacy policy page'
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

**Problem:** The footer "Privacy policy" link and every future consent line need a real target at `/privacy`. The legal text does not exist yet (FR-41, NFR-3, PDPD Decree 13/2023).

**Approach:** Build `/privacy` as a plain reading page (Server Component) from the contract `_bmad-output/specs/andy/spec-2-1-privacy-policy-page/SPEC.md` (CAP-1 to CAP-6): breadcrumbs, one H1, a `[Placeholder]` lede and outline note, eight H2 sections in order, no capture band. All copy lives in `src/content/privacy.ts`. Unverified text starts with `[Placeholder]`; only the A4 retention sentence is a decided fact. The text reflects the lead decisions: no time limit on Submissions (A4), form mail to the company inbox through Gmail SMTP, hashed rate-limit counters in Upstash (2.3), capture-band email kept in session storage only until `/demo` reads it (2.4).

</frozen-after-approval>

## Implementation Notes

- Footer: `SiteFooter` is mounted in `src/app/layout.tsx` and already links to `/privacy` (`site-footer.test.tsx`), so CAP-5 is checked by that test plus the `@smoke` GET `/privacy`.
- Not done on purpose: aurora background and shared breadcrumbs (Story 1.6, after demo). Breadcrumb markup copies `/demo`.
- Open (A4, Amber): how a person asks for deletion. "Your rights" stays `[Placeholder]`.

### UX checks

| Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| ---- | --------------- | ----- | ------------------ | ------ | ------ | ------- |
| Page | open `/privacy` | any | header and footer show; no capture band; one H1 "Privacy policy." | — | CAP-1, CAP-4, EXPERIENCE.md Email capture | page.test "one H1", "no capture band" |
| Breadcrumbs | read | any | "Home / Privacy policy"; "Home" is a link to `/` | — | CAP-1, mockup privacy.html | page.test "breadcrumbs" |
| Breadcrumb "Home" | hover | mouse | text turns heading colour | — | DESIGN.md breadcrumbs (`.crumbs a:hover`) | ✅ Chrome 1280: rgb(74,91,120) → rgb(22,54,99) |
| Breadcrumb "Home" | Tab, then Enter | keyboard | focus ring 2px visible; opens `/` | — | T9, EXPERIENCE.md Accessibility Floor | ✅ Chrome 1280: Tab ×9 reaches it, `:focus-visible`, solid 2px ring; Enter opens `/` |
| Lede and outline note | read | any | both start with `[Placeholder]` | — | CAP-3, NFR-7 | page.test "placeholder" |
| Sections | read top to bottom | any | eight H2 in the CAP-1 order | — | CAP-1 | page.test "eight sections" |
| "How long we keep it" | read | any | says submissions, applications and CVs are kept with no time limit | — | CAP-6, A4 | page.test "retention" |
| "Cookies and analytics" | read | any | text starts with `[Placeholder]` | — | CAP-2, A3 | page.test "placeholder" |
| Text column | width 1280px and 375px | any | 720px reading column, centred; no sideways scroll at 375px | — | mockup `.story-body`, Responsive & Platform | ✅ Chrome: 720px `.wrap` box (672px text + padding), 280px each side at 1280; no sideways scroll at 720, 390, 375 |
| Footer "Privacy policy" | click or Enter | mouse, keyboard | opens `/privacy` | — | CAP-5 | ✅ Chrome 1280 click and Enter; site-footer.test "privacy link" |
| Footer "Privacy policy" | tap | touch | opens `/privacy` | — | CAP-5 | ✅ Chrome 390 touch tap |
| Footer "Privacy policy" | tap | pen | opens `/privacy` | — | CAP-5 | not checked (no pen device) |

## Verification

**Commands:**
- `npx vitest run src/app/privacy` -- expected: pass
- `npx eslint`, `npx prettier --check`, `npx tsc --noEmit` on touched files -- expected: clean

## Review Triage Log

Light review, one Blind Hunter layer (12 findings).

- patch (fixed): `aria-label="Policy"` moved into `src/content/privacy.ts`; Verification command pointed at a test file that does not exist.
- false: "language cookie" is invented. It is named in SPEC CAP-2 and EXPERIENCE.md (locale cookie). "No time limit" is decision A4. SPEC.md exists in the spec folder.
- defer: `[Placeholder]` meta description (copied from the mockup; real text comes with 7.1); missing policy topics and fuller rights list (legal owner, Story 7.5); `aria-current` and `aria-hidden` on breadcrumbs (same markup as `/demo`, Story 1.6 shared component); e2e `<form` scope (low).

Full `bmad-code-review` on 2026-10-03, 5 layers (Blind Hunter, Edge Case Hunter, Verification Gap, Acceptance Auditor, Security). Security: clean. Acceptance: CAP-1 to CAP-6 met.

- patch (fixed): the walk forced focus with `crumb.focus()`, so Tab reach was not proven; it now tabs until the breadcrumb is active and checks `:focus-visible`. The footer click / Enter row had only an href test; the walk now clicks and presses Enter. The 720 / 375 width readings came from an unsaved script; `walk.mjs` now makes them. `walk.mjs` checks `OUT` and the response, reads `BASE_URL`, and finds the breadcrumb by role. The pen row was ticked but not walked; split into touch (checked) and pen (not checked).
- patch (fixed): "What we collect" said the capture email stays only in session storage, against the retention sentence; it now says the email is sent to the company inbox, and the browser keeps it only until `/demo` reads it.
- false: "Sanity is missing from the share list". Decision T1: applications and CVs are never stored in Sanity.
- defer (Minor, `deferred-work.md`): name Vietnam's Personal Data Protection Law 2025 next to Decree 13/2023 in the `[Placeholder]` lede (legal owner to confirm); a `[Placeholder]` "Last updated" line and outline rows for legal basis, security and children's data (7.5); re-check "private CV storage" if 6.6 drops CV upload; one band marker in every test; paragraph text as React key; exact CAP-6 wording to confirm with Amber.
- reject: meta title capitals (follows the site title style); type sizes use the nearest Story 1.1 tokens (allowed by the token rule); brand "XionTech" follows AGENTS.md (the footer's "XionTechs" is a separate follow-up).

## Acceptance Evidence

Walked on 2026-10-03 in Chrome (Playwright, `channel: "chrome"`) on `npm run dev` in the main checkout at 2fcf021 (Turbopack rejects the worktree's `node_modules` link). Script `walk.mjs`, output `walk-output.txt`.

**Commands**

- `npm run lint && npm run typecheck && npm run format:check` -- exit 0 -- clean
- `npm test` -- exit 0 -- 30 files, 599 passed
- `npm run test:coverage && npm run coverage:diff` -- exit 0 -- "Coverage: 100%", "C1 ok: 2 changed file(s)"
- `npm run build && npm run test:smoke` -- exit 0 -- `/privacy` static; "6 passed (21.6s)" (at 687d673; later commits change copy and evidence only)

**Observed**

- 1280 and 390: status 200, title "Privacy Policy | XionTech", one H1, eight H2 in CAP-1 order, 11 of 12 paragraphs start with `[Placeholder]`, header and footer, no capture band, no sideways scroll.
- Breadcrumb "Home": hover changes colour; Tab ×9 from the top reaches it with `:focus-visible` and a solid 2px ring; Enter opens `/`.
- Footer "Privacy policy": click and Enter at 1280, touch tap at 390, all open `/privacy`.
- Text column: 720px `.wrap` box (672px text), 280px each side at 1280; no sideways scroll at 720 and 375.

**Artifacts**

- `privacy-1280.png`, `privacy-390.png` (full page), `privacy-720.png`, `privacy-375.png` (first screen), `walk.mjs`, `walk-output.txt`

**Not captured**

- Pen input, a screen reader.

