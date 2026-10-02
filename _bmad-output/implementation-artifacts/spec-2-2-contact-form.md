---
title: 'Story 2.2: Two-tab contact form on /demo'
type: 'feature'
created: '2026-10-02'
status: 'in-progress'
baseline_commit: '6c7c29b58d8330181e7ba36a93b03039be636b88'
route: 'dispatch'
review_loop_iteration: 0
context: ['{project-root}/AGENTS.md']
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Lan (booking a demo) and Quân (starting a project) have no way to contact XionTech: `/demo` does not exist. Stories 2.3 (sending) and 2.4 (email capture) build on this form; forms are live on Demo day 2026-10-09.

**Approach:** Port the prototype `demo.html` to a server `/demo` page (navy hero with breadcrumbs, H1, three reassurance items, two offices) and one client form component with two ARIA tabs picked by the URL hash. Client-side validation only, with the rules and wording in one shared module that Story 2.3 reuses on the server. Contract: `_bmad-output/specs/andy/spec-2-2-contact-form/SPEC.md` (CAP-1…CAP-8) and EXPERIENCE.md "Contact form fields" / "Wording to reuse".

## Boundaries & Constraints

**Always:**
- Exact strings from the SPEC / EXPERIENCE.md; every visible string lives in one strings object so it can be translated later (VI submit "Gửi yêu cầu"); service and product names stay English.
- Port the prototype look (`.ftabs`, `#demoForm`, field ids `f-name`…`f-msg`, pills, paper card, navy hero); do not redesign. Invalid border `error-border`, error text `error` on paper (UX-DR21). Tokens from `globals.css` only.
- ARIA tab pattern: `tablist` / `tab` with `aria-selected` and `aria-controls`, one `tabpanel` per request type, roving tabindex, Arrow Left/Right wrap, Home/End, automatic activation.
- Hidden-tab fields are `hidden` (not focusable), never validated, never submitted (AC-A11Y-3).
- Errors: `aria-invalid="true"` + `aria-describedby` to the error text, a polite live region announces the errors, the first invalid field gets focus (AC-A11Y-5). Typing in a field clears its error.
- Today's date (`min` on Preferred date) and the hash-picked tab are set after mount on the client (no hydration mismatch).
- Server Components by default; only the form is a client component. The page renders no `<main>` (layout owns it).

**Never:**
- Sending, success / failure states, server validation, honeypot, rate limit (Story 2.3); prefill from a capture band (2.4); keeping typed hidden-tab values (after demo); Vietnamese strings (1.2); shared breadcrumbs component (1.6); no-JS behaviour (7.2); an email capture band on `/demo`.
- No new runtime dependency except `@phosphor-icons/react` (the icon library chosen in `AGENTS.md`).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| Default tab | `/demo`, no hash or any hash but `#project` | Product demo tab selected | N/A |
| Project tab | `/demo#project` on load, or hash changes to `#project` | Outsourcing project tab selected | N/A |
| Empty submit | required fields empty | three errors, `aria-invalid`, announced, focus on Full name | no submit |
| Bad email | `ana@school` | "Please enter a valid email address." | no submit |
| Free mail | `ana@gmail.com` | accepted | N/A |
| Past date | Preferred date before today (visitor's time zone) | "Please choose today or a later date." | no submit |
| Long message | 2,001 characters | "Please keep your message under 2,000 characters." | no submit |
| Hidden tab | Outsourcing active, Product demo date in the past | not validated, not focusable | N/A |
| Valid | all checks pass | no error shown; values handed to the submit hook (no-op until 2.3) | N/A |

**Decisions (lead, 2026-10-02):**
- Office data lives in a new shared module `src/components/layout/office-data.ts`; Sammy's footer (1.5) imports it.
- Labels follow EXPERIENCE.md: "Role" and "Start timing" (not the prototype's "Your role" / "When do you want to start?").
- A valid submit shows nothing new in 2.2: errors clear and `onValidSubmit` is a no-op until Story 2.3 adds sending.

</frozen-after-approval>

## Code Map

- `_bmad-output/planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/mockups/site-v3/demo.html` (lines 17–64), `css/site.css` (328–348, 356, 440–485), `js/site.js` (190–195 tabs keys, 209 EMAIL regex, 218–240 form) -- source to port; the prototype has no `aria-controls`, no tabpanel and no live region (add them).
- `src/app/globals.css` -- tokens `--color-error` (66), `--color-error-border` (67), `--color-paper` (34), `--color-navy` (15), `--color-field-border` (49), `--color-focus` (51), radius scale (163–171), `--spacing-field-height` (190), breakpoints sm/md/lg (195–197), `.hero-navy` (414/455), `.btn`/`.btn-primary` (485/512). Add form classes here next to `.btn`.
- `src/app/layout.tsx` -- renders `<main id="main">` (54); do not add another.
- `src/components/layout/nav-data.ts` -- `SERVICES` (82): the 8 service names in prototype order for the Service select; `PRODUCTS` (52) names "IoT Device Management" but the pill text is "IoT".
- `src/components/layout/site-nav.test.tsx` -- test style to follow (Testing Library, `vi.mock("next/navigation")`, assertions via `getAttribute`; no jest-dom, no user-event).
- `e2e/smoke.spec.ts` -- one `@smoke` request test on `/`; add `/demo`.
- `scripts/eslint-config.test.mjs` -- tests at lines 23 and 34 pass `60_000` as the timeout.
- Next.js 16 docs read: `node_modules/next/dist/docs/01-app/02-guides/forms.md`, `.../02-components/form.md`, `.../02-guides/preventing-flash-before-hydration.md`. `next/form` does not fit a POST contact form; client values (today, hash) are set after mount.

## Tasks & Acceptance

**Execution:**
- [x] `scripts/eslint-config.test.mjs` -- raise both per-test timeouts from `60_000` to `120_000` -- lead's request; the typed-ESLint test times out in a full `npm test` while the dev server runs.
- [x] `package.json` -- add `@phosphor-icons/react` -- check-circle list icons and the paper-plane submit icon (AGENTS.md icon choice).
- [x] `src/lib/contact/contact-rules.ts` -- shared, framework-free validation: required fields per request type, email check (prototype regex, free mail allowed), date not before a given "today" (YYYY-MM-DD), message ≤ 2,000 characters; returns field → error text; error wording exported from here -- Story 2.3 runs the same rules on the server.
  - red: `src/lib/contact/contact-rules.test.ts` -- each I/O matrix rule returns the right error, and hidden-type fields are ignored.
- [x] `src/components/layout/office-data.ts` -- the two offices (Plano, Texas; Ho Chi Minh City "Vietnam Delivery Center") with address lines, phone, WhatsApp and email exactly as `demo.html` lines 29–32 -- shared with Sammy's footer (Story 1.5).
  - red: `src/components/layout/office-data.test.ts` -- both offices with their tel/mailto/WhatsApp values.
- [x] `src/components/contact/contact-strings.ts` -- every visible string of the hero and form, the select options (school sizes, start timings, services from `SERVICES` + "Not sure yet", product pills PXP/LXP/SXP/IoT) -- one place to translate later.
- [x] `src/components/contact/contact-form.tsx` -- client form: ARIA tabs + tabpanels, hash on mount and on `hashchange`, fields per tab (hidden tab `hidden`), date `min` set after mount, submit validates the active tab, sets `aria-invalid`/`aria-describedby`, writes the errors to a polite live region, focuses the first invalid field; typing clears that field's error; a valid submit calls `onValidSubmit(values)` (a no-op in 2.2).
  - red: `src/components/contact/contact-form.test.tsx` -- `#project` selects Outsourcing; arrow keys move and select tabs; empty submit marks three fields, announces, focuses Full name; past date and long message errors; hidden-tab fields are not focusable and not validated.
- [x] `src/app/demo/page.tsx` -- server page: navy hero (breadcrumbs "Home / Contact", H1, three reassurance items, two offices), paper form card beside it from `md`, stacked below; metadata title; no capture band.
  - red: `src/app/demo/page.test.tsx` -- H1, the three items, both offices, breadcrumbs and the form render; no `<main>` in the page.
- [x] `src/app/globals.css` -- port `.form-card`, `.ftabs`, field, error, pill, consent and breadcrumb styles with tokens; contrast of error text on paper covered in `src/lib/design/contrast.test.ts`.
- [x] `e2e/smoke.spec.ts` -- `@smoke` GET `/demo` returns 200 and contains "Send request".

**Acceptance Criteria:**
- Given a desktop width, when `/demo` loads, then the form card sits beside the hero; below 900px it stacks under it (CAP-1).
- Given the Outsourcing tab is active, when the visitor presses Tab through the form, then focus never lands on a Product demo field (CAP-4).
- Given the form, then the submit reads "Send request" and the consent line reads "We only use your details to respond to this request." followed by a "Privacy policy" link to `/privacy` (CAP-8).

## UX checks

| Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| --- | --- | --- | --- | --- | --- | --- |
| Page | `/demo` at 1280px | — | navy hero left, paper form card right | — | CAP-1, DESIGN.md › contact-form || Chrome (walk.mjs) |
| Page | width under 900px | — | form card stacks under the hero | — | CAP-1 || Chrome (walk.mjs) |
| Hero | load | — | "Home / Contact" breadcrumbs, H1, 3 check items, 2 offices | — | CAP-1, demo.html || Chrome (walk.mjs) |
| Tabs | load `/demo#project` | — | Outsourcing project selected (navy pill) | — | CAP-2 || Chrome (walk.mjs) |
| Tabs | load `/demo` or `/demo#form` | — | Product demo selected | — | CAP-2, EXPERIENCE.md CTA labels || Chrome (walk.mjs) |
| Tabs | Arrow Right / Left, Home, End | keyboard | focus and selection move, wrap | — | CAP-2 (ARIA tab pattern) || Chrome (walk.mjs) |
| Fields | Product demo tab | any | name, email, org, role, products (PXP on), size, date, message | — | CAP-3 || Chrome (walk.mjs) |
| Fields | Outsourcing tab | any | name, email, org, role, service (9 options), start timing, message | — | CAP-3 || Chrome (walk.mjs) |
| Hidden tab | Tab through the form | keyboard | never reaches the other tab's fields | — | CAP-4, AC-A11Y-3 || Chrome (walk.mjs) |
| Submit | empty required fields | mouse | 3 red-bordered fields with error text; screen reader hears them; focus on Full name | — | CAP-5, AC-A11Y-5 || Chrome (walk.mjs) |
| Email | `ana@school`, then `ana@gmail.com` | keyboard | error, then accepted | — | CAP-5 || Chrome (walk.mjs) |
| Date | picker opens | mouse | starts at today; a past date shows its error on submit | — | CAP-6, AC-FORM-1 || Chrome (walk.mjs) |
| Message | 2,001 characters, submit | keyboard | length error | — | CAP-7 || Chrome (walk.mjs) |
| Field | type into an invalid field | keyboard | its error clears | — | demo.html JS || Chrome (walk.mjs) |
| Submit, consent | look | — | "Send request" + paper-plane icon; consent line + underlined "Privacy policy" → `/privacy` | — | CAP-8 || Chrome (walk.mjs) |

## Implementation Notes

## Spec Change Log

## Review Triage Log

## Design Notes

The hash and today's date only exist in the browser: read them in an effect after mount (and on `hashchange`), so the server HTML always shows Product demo and no `min`, and nothing mismatches on hydration. Errors render inline under each field and as one list in a visually hidden `aria-live="polite"` region, so a screen reader hears them once per submit.

## Verification

**Commands:**
- `npm run lint && npm run typecheck && npm run format:check` -- expected: no errors
- `npm test` -- expected: all pass (incl. the raised-timeout eslint-config test)
- `npm run test:coverage && npm run coverage:diff` -- expected: 100% changed lines, branches ≥ 80%
- `npm run build && npm run test:smoke` -- expected: build passes; `/` and `/demo` return 200

**Manual checks:**
- In Chrome on `npm run dev`: walk every UX checks line at 1280px and 390px; tick the Checked column.

## Acceptance Evidence

Captured at the end of step-03 on 2026-10-02.

**Commands**

- `npm run lint && npm run typecheck && npm run format:check` -- exit 0 -- All matched files use Prettier code style!
- `npm test` -- exit 0 -- Tests 281 passed (281)
- `npm run test:coverage && npm run coverage:diff` -- exit 0 -- Coverage: 100% (Missing: 0 lines); C1 ok: 5 changed files with branch coverage >= 80%
- `npm run build && npm run test:smoke` -- exit 0 -- 2 passed (12.5s)

**Observed**

- Every UX checks line as specified at 1280px and 390px -- `/demo` on `npm run dev` in Chrome (Playwright `walk.mjs`); details in observed.md

**Artifacts**

- spec-2-2-contact-form-evidence/verification.txt -- 3774 bytes -- sha256 79036497fc42 -- raw output of the four commands
- spec-2-2-contact-form-evidence/demo-1280.png -- 454320 bytes -- sha256 eb5245a0f5ac -- desktop layout, card beside hero
- spec-2-2-contact-form-evidence/errors-1280.png -- 457805 bytes -- sha256 4b6386521eb6 -- empty submit: three errors, focus on Full name
- spec-2-2-contact-form-evidence/project-1280.png -- 427185 bytes -- sha256 2d1279a77ad8 -- `#project` selects Outsourcing
- spec-2-2-contact-form-evidence/demo-390.png -- 260146 bytes -- sha256 1fa6860bfa95 -- 390px: card stacks under the hero
- spec-2-2-contact-form-evidence/walk-output.txt -- 806 bytes -- sha256 0c529be1211d -- raw output of the UX walk
- spec-2-2-contact-form-evidence/observed.md -- 1457 bytes -- sha256 ed25d1e4172d -- what was seen, step by step

**Not captured**

- A screen-reader run (NVDA/VoiceOver): the live region text was read from the DOM, not heard.

