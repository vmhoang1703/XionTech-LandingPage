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
| Breadcrumb "Home" | hover | mouse | text turns heading colour | — | DESIGN.md breadcrumbs (`.crumbs a:hover`) | hand |
| Breadcrumb "Home" | Tab, then Enter | keyboard | focus ring 2px visible; opens `/` | — | T9, EXPERIENCE.md Accessibility Floor | hand |
| Lede and outline note | read | any | both start with `[Placeholder]` | — | CAP-3, NFR-7 | page.test "placeholder" |
| Sections | read top to bottom | any | eight H2 in the CAP-1 order | — | CAP-1 | page.test "eight sections" |
| "How long we keep it" | read | any | says submissions, applications and CVs are kept with no time limit | — | CAP-6, A4 | page.test "retention" |
| "Cookies and analytics" | read | any | text starts with `[Placeholder]` | — | CAP-2, A3 | page.test "placeholder" |
| Text column | width 1280px and 375px | any | 720px reading column, centred; no sideways scroll at 375px | — | mockup `.story-body`, Responsive & Platform | hand |
| Footer "Privacy policy" | click or Enter | mouse, keyboard | opens `/privacy` | — | CAP-5 | site-footer.test "privacy link"; smoke |
| Footer "Privacy policy" | tap | touch, pen | opens `/privacy` | — | CAP-5 | hand |

## Verification

**Commands:**
- `npx vitest run src/app/privacy` -- expected: pass
- `npx eslint`, `npx prettier --check`, `npx tsc --noEmit` on touched files -- expected: clean

## Review Triage Log

Light review, one Blind Hunter layer (12 findings).

- patch (fixed): `aria-label="Policy"` moved into `src/content/privacy.ts`; Verification command pointed at a test file that does not exist.
- false: "language cookie" is invented. It is named in SPEC CAP-2 and EXPERIENCE.md (locale cookie). "No time limit" is decision A4. SPEC.md exists in the spec folder.
- defer: `[Placeholder]` meta description (copied from the mockup; real text comes with 7.1); missing policy topics and fuller rights list (legal owner, Story 7.5); `aria-current` and `aria-hidden` on breadcrumbs (same markup as `/demo`, Story 1.6 shared component); e2e `<form` scope (low); UX rows marked "hand" are checked before the PR.
