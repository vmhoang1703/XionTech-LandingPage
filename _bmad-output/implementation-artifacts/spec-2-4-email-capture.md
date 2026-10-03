---
title: 'Story 2.4: Email capture band (demo, project)'
type: 'feature'
created: '2026-10-03'
status: 'done'
baseline_commit: 'dc9f34943c87b755ce0ef914630cbdfbc0317bd9'
route: 'dispatch'
review_loop_iteration: 0
context: ['{project-root}/AGENTS.md']
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Most pages must end with a band where a visitor leaves only a work email and lands on the `/demo` contact form already started. Nothing like it exists; Stories 3.7, 5.4, 6.1 and 6.4 place it. Contract: `_bmad-output/specs/andy/spec-2-4-email-capture/SPEC.md` (CAP-1…CAP-9).

**Approach:** One client component `CaptureBand` (kind `demo` | `project`) ported from the prototype. A valid email is posted to the existing `POST /api/contact` as `{ type: "capture", kind, email, website }`, mailed by the Story 2.3 sender, then stored in session storage and the visitor is sent to `/demo#form` or `/demo#project`, where the form reads it once.

## Boundaries & Constraints

**Always:**
- Port the prototype (`mockups/site-v3/index.html:141-153`, `services.html:127-139`, `css/site.css:307-321,441,464-465,481,485`, `js/site.js:208-227`); texts per kind exactly as the prototype; do not redesign. Amber band uses `btn-navy`; the white row has a 1.5px navy border; focus shows a 3px ring in the scoped `--color-focus`.
- Email rule and wording from `contact-rules.ts` ("Please enter a valid email address."); `aria-invalid`, `aria-describedby`, focus back to the field, error clears on typing.
- While sending: button disabled, "Sending..."; a failure keeps the email and shows the 2.3 send or rate-limit message inline; retry is the same button.
- The email never appears in a URL (no query, no hash) or a log line. Session storage key is read once on `/demo`, removed, and never overwrites a typed value; if storage throws, the visitor still lands on the right tab with no prefill and no error.
- `/demo#project` selects the Outsourcing tab and scrolls to the form (`/demo#form` already scrolls).
- Strings live in `contact-strings.ts` (translatable).

**Never:** a modal; kinds other than `demo` and `project`; placing the band on `/demo`, Not found, `/privacy`, `/news/[slug]`, `/careers`, `/careers/[slug]`; a second mail sender or route; personal data in the mail subject.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| Valid demo capture | email `lan@school.edu.vn`, kind demo | POST `{type:"capture",kind:"demo",email,website:""}` → 200; key stored; navigate to `/demo#form`; Work email prefilled; key removed | N/A |
| Valid project capture | kind project | same, navigate to `/demo#project`; Outsourcing tab; scrolled to the form | N/A |
| Invalid email | `lan@school` or empty | no request; inline error, `aria-invalid`, focus on the field | clears on typing |
| Send fails / times out | 502, 500, network, 15 s | stay on the band; email kept; inline send message; button enabled | retry |
| Rate limited | 429 | inline rate-limit message; email kept | retry later |
| Honeypot filled | `website` not empty | server 200, no mail; client navigates as for success | none (silent) |
| Storage blocked | `sessionStorage.setItem` throws | still navigates; no prefill; no error | swallowed (no log of the email) |
| Typed before prefill | `#f-email` not empty on arrival | value kept; key removed | N/A |
| Server capture parse | `type:"capture"` with bad kind or bad email | 400 `{error:"send"}` / 400 `{errors:{email}}` | no mail |

**Decisions (lead, 2026-10-03):**
- The capture send uses the same guards as the contact form: the hidden honeypot and both rate limits (IP + email 5 per 10 minutes, IP 20 per hour) through the same route.
- The demo band is placed on the current Home placeholder now (Story 3.7 keeps or moves it), so the browser walk and the success signal work on the dev site.
- Spec size about 2,900 tokens: kept in full.

</frozen-after-approval>

## Code Map

- `src/lib/contact/contact-rules.ts` -- `isValidEmail` (:38-43) is not exported; `CONTACT_ERRORS.email` (:11); `EMAIL_MAX_LENGTH` (:21). Export the email check for the band.
- `src/lib/contact/submission.ts` -- `parseSubmission` (:95-127): non-object → bad; `type` must be demo|project (:102); honeypot (:103). Add a `capture` branch before the demo/project readers.
- `src/lib/contact/delivery.ts` -- `SUBJECTS` (:14-17) keyed by type, `mailText` (:117-139), `sendContactMail` (:145-164, subject `${SUBJECTS[type]}: ${org}`, Reply-To email), `checkRateLimits` (:107-115).
- `src/app/api/contact/route.ts` -- order parse → honeypot → config → field errors → rate → send (:49-74); should need no change if the parser and mailer handle capture.
- `src/components/contact/contact-form.tsx` -- `postSubmission` (:148-170, fetch + 15 s abort, sent/rate/send/errors) to share with the band; hash → tab via `useSyncExternalStore` (:67-83, :191-195); `#f-email` (:354-366) uncontrolled; no scroll for `#project`; `ContactSubmission` type (:55) imported by the server modules.
- `src/components/contact/contact-strings.ts` -- `form.email`, `sending`, `sendError`, `rateError`, `consent` (project wording), `privacyLink`.
- `src/app/globals.css` -- no `.capture`/`.cap-*`; `.surface-amber` (:401-408) and its token scope (:473-486, `--color-focus` navy); `.btn-navy` (:534-542); no `.btn:disabled` style; `.consent` (:862-872); `.form-alert` (:880-886); breakpoints sm 640 / md 900 (:195-197), media idiom `@media (width < --theme(--breakpoint-sm))` (:627); `scroll-padding-top` (:226).
- `src/app/page.tsx` -- Home placeholder (H1 + `[Placeholder]` text; `page.test.tsx` asserts it). Only `/` and `/demo` exist.
- Next.js 16 docs: `use-router.md:44,118-120` (`router.push`, scroll), `link.md:687-702,894` (hash scroll); `layout-router.js:130-166` (hash target lookup, missing target is a no-op). Read browser-only state after mount (`preventing-flash-before-hydration.md`).
- Tests: `contact-form.test.tsx` patterns (fetch stub, `reply`, `pendingFetch`, hash via `history.replaceState`); `next/navigation` mocked as `usePathname` only today.

## Tasks & Acceptance

**Execution:**
- [x] `src/lib/contact/contact-rules.ts` -- export the email check (`isValidEmail`) unchanged -- the band and the server share one rule.
  - red: `src/lib/contact/contact-rules.test.ts` -- `isValidEmail` is exported and accepts `ana@gmail.com`, rejects `ana@school`.
- [x] `src/lib/contact/submission.ts` + `delivery.ts` -- `type: "capture"` with `kind` demo|project and `email` (honeypot first, then email check → `{errors:{email}}`, unknown kind → bad); mail subject "Demo capture" / "Project capture" (no personal data), body with kind and email, Reply-To the email -- CAP-4.
  - red: `submission.test.ts` + `delivery.test.ts` + `src/app/api/contact/route.test.ts` -- capture parse rows of the matrix; capture mail options; route sends one mail for a valid capture and none for a filled honeypot.
- [x] `src/components/contact/post-submission.ts` + `contact-form.tsx` -- move `postSubmission` out of the form unchanged so the band reuses it; the form imports it -- shared send behaviour.
  - red: `src/components/contact/post-submission.test.ts` -- 200 → sent, 429 → rate, 400 with errors → errors, other → send, abort at 15 s → send.
- [x] `src/components/contact/capture-band.tsx` + `contact-strings.ts` -- client band per the prototype (kinds, texts, consent + Privacy link, hidden honeypot, validation, Sending..., inline failure, session storage write in try/catch, `router.push` to `/demo#form` or `/demo#project`) -- CAP-1…CAP-4, CAP-7.
  - red: `src/components/contact/capture-band.test.tsx` -- each band matrix row (`next/navigation` and `sessionStorage` mocked).
- [x] `src/components/contact/contact-form.tsx` -- on mount read the key once (try/catch), fill `#f-email` only if empty, remove the key; on `#project` scroll the form into view -- CAP-6, CAP-7.
  - red: `contact-form.test.tsx` -- prefill when empty, keep a typed value, key removed, storage throwing is silent, scroll called for `#project`.
- [x] `src/app/globals.css` -- `.capture` band, `.cap-grid` (1 column ≤ 900px), `.cap-form`, `.cap-row` (white pill, 1.5px navy border on amber, 3px focus-within ring in `--color-focus`, column ≤ 640px), `.cap-form .err`, consent link, `.btn:disabled` -- CAP-5, CAP-8.
  - red: `src/lib/design/contrast.test.ts` -- the new rules exist with the token values; error colour on amber meets 4.5:1.
- [x] `src/app/page.tsx` + `e2e/smoke.spec.ts` -- render `<CaptureBand kind="demo" />` on an amber surface after the Home placeholder text (lead decision); smoke checks `/` contains "See it working at your school." -- browser walk and success signal.
  - red: `src/app/page.test.tsx` -- Home renders the demo band heading and "Book a demo" button.
- [x] `docs/contact-delivery.md` -- capture mails (subject, fields, same guards) -- docs.

**Acceptance Criteria:**
- Given a page with the demo band, when a visitor submits a valid work email, then one capture mail reaches the contact inbox and the visitor lands on `/demo#form` with the email prefilled and no email in the address bar.
- Given the project band, when the visitor submits, then `/demo#project` opens the Outsourcing tab scrolled to the form with the email prefilled.
- Given the build, then no page in CAP-9's list renders the band.

## UX checks

| Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| ---- | --------------- | ----- | ------------------ | ------ | ------ | ------- |
| Band | 1280px | — | H2 + lede left, form right; amber band; white pill row with 1.5px navy border; navy button | — | `index.html:141-153`, `site.css:307-321,481` || ✅ Chrome 1280 (border computes 1px at 1x) |
| Band | ≤ 900px / ≤ 640px | — | one column / field above button, button full width | — | `site.css:441,464-465` || ✅ Chrome 900 + 390 |
| Field | focus | keyboard (Tab) | 3px navy ring around the row | at once | `site.css:318`, UX-DR4 || ✅ Chrome |
| Submit | invalid email | mouse, keyboard (Enter), touch | inline "Please enter a valid email address.", announced; focus on the field | at once | EXPERIENCE.md:142 || ✅ Chrome: Enter at 1280 (message, role=alert, aria-invalid, focus); touch tap at 390 (message only); click not walked |
| Field | typing after an error | keyboard | error disappears | at once | `site.js:216` || ✅ Chrome |
| Submit | valid email | mouse, keyboard, touch | button disabled, "Sending..." | until the answer | EXPERIENCE.md:209 || ✅ Chrome: Sending... + disabled observed for click; Enter and touch tap observed landing only |
| Submit | 200 (demo / project) | — | `/demo#form` Product demo tab / `/demo#project` Outsourcing tab scrolled to the form; Work email filled; URL has no email | after the answer | CAP-6 || ✅ Chrome (project via client push) |
| Submit | 502 / 429 / timeout | — | inline send or rate message in the band; email kept; button enabled | at once / 15 s | CAP-4 || ✅ Chrome (timeout 15.3 s) |
| Consent | look | — | kind's consent line + underlined "Privacy policy" → `/privacy` | — | CAP-2 || ✅ Chrome |
| `/demo` | arrive with a typed value | keyboard | the typed value stays | — | CAP-7 || ✅ unit test only (not observable in a browser) |

## Implementation Notes

- Task 1: `isValidEmail` is exported unchanged; it does not trim and does not check `EMAIL_MAX_LENGTH` (254). Server (task 2) and band (task 4) must both trim first, then require `isValidEmail` and length ≤ 254, so they always agree.
- Task 2: `submission.ts` exports `CaptureSubmission` (`{ type: "capture", kind, email }`) and `ValidSubmission` (the union the route mails); order type → honeypot → kind (bad) → trimmed email with `isValidEmail` and ≤ 254 (`{ errors: { email } }`). Mail subject "Demo capture" / "Project capture", body `Kind` + `Email`, Reply-To the email. `route.ts` unchanged. The band (task 4) posts `{ type: "capture", kind, email, website }`.
- Task 3: `post-submission.ts` exports `postSubmission(payload): Promise<SendResult>` (`sent` | `rate` | `send` | `errors` with `ContactErrors`), `SendResult`, `FIELD_ORDER`, `SEND_TIMEOUT_MS` (15 000).
- Session storage key for the prefill: `xt-capture-email` (tasks 4 and 5 share it; export it from one module, e.g. `src/components/contact/capture-storage.ts`, or from the band).
- Task 4: `CaptureBand({ kind })` renders its own `<section class="capture surface-amber" aria-labelledby="cap-h">` (task 7 must not wrap it in another amber section); `capture-storage.ts` exports `CAPTURE_EMAIL_KEY` ("xt-capture-email"); send and rate messages use `small.err` in `.cap-form` (task 6 styles both); focus returns to the submit button after a send or rate failure (as in the contact form).

## Spec Change Log

## Review Triage Log

Step 4 full review, 2026-10-03 — rows 16-18 added when the Edge Case Hunter reported after the first triage (Blind Hunter, Edge Case Hunter, Verification Gap, Acceptance Auditor, Security Auditor; task-review minors included).

| # | Finding (source) | Verdict | Route | Evidence |
|---|---|---|---|---|
| 1 | A press before hydration or with JS off does a native GET and puts `?email=` in the URL (Verification Gap); same idiom in the contact form | medium | patch | `capture-band.tsx` and `contact-form.tsx` forms have no `method`; breaks CAP-7 / NFR-3. Fix: `method="post"` on both (similar check). |
| 2 | Prototype rules `.capture::before` ring, `.cap-grid h2 { max-width: 15ch }`, `.cap-grid .lede { margin-top: 14px }` not ported (Acceptance) | medium | patch | The spec says port, do not redesign; `site.css:308,310,311`. Screenshot shows the lede touching the heading. |
| 3 | Ledger says timeout 15.4 s; `walk-output.txt` says 15.2 s; UX Checked column empty (Acceptance) | - | evidence | Controller error from the first walk; ledger corrected; the Checked column is filled at step 5. |
| 4 | Email rule `!isValidEmail || length > 254` in three places (Blind) | low | defer | `contact-rules.ts:58`, `submission.ts:113`, `capture-band.tsx:65`; one helper later. |
| 5 | Email stays in session storage if `/demo` is never reached (Blind) | low | defer | Only `/demo` removes the key; same tab session only. |
| 6 | No automated test runs band → client push → `/demo` prefill together (Verification Gap) | medium | defer | Covered by the browser walk (evidence); needs a Playwright browser project the repo does not have. |
| 7 | Back after a successful capture may show the band stuck on Sending... (Blind) | maybe-false | defer | Client navigation remounts Home without Activity; settle in a browser. |
| 8 | `.btn:disabled` does not stop hover glow/background (Blind, task 6 minor) | low | defer | Visual only while sending. |
| 9 | Second submit before re-render could post twice (Verification Gap) | low | reject | `setStatus("sending")` runs before the await and the button is disabled; a browser blocks Enter on a disabled default button. |
| 10 | Band copy not marked `[Placeholder]` (Blind) | false | reject | Copy is the approved prototype text (UX spine); it describes a real service. |
| 11 | Project consent says "your details" (Blind) | false | reject | CAP-2 sets this wording. |
| 12 | `/privacy` returns 404 (Blind) | low | reject | Known since Story 2.2 (deferred-work); Story 2.1 (Andy, Sun 04/10) builds it. |
| 13 | Prefill writes the DOM outside React state (Blind) | false | reject | The form is uncontrolled and reads values with FormData at submit; no state to lose. |
| 14 | Project band unused; capture mail has only kind and email; contrast of muted text on amber unchecked; test cleanup; smoke reads text twice (Blind) | low | reject | Spec scope (page stories place bands; CAP-4 mail); cosmetic test nits. |
| 15 | Fail-open limiter and IP header trust (Security, unverifiable) | maybe-false | reject | Lead decisions from Story 2.3; production runs on Vercel. |
| 16 | A late 200 after the visitor left Home still stores the email and pushes to /demo (Edge) | medium | patch | `capture-band.tsx:78-82` has no unmount guard. Fix: ignore results after unmount. |
| 17 | Band media queries use `<=` while the file's layout uses `<`; at exactly 900px the band stacks on a desktop layout (Edge) | false | reject | First routed as patch (cb665a5) without checking the contract; CAP-8 ("at 640px and below") and EXPERIENCE.md ("≤ 900px") require `<=`, and `globals.css:320` uses `<=`. The walk showed two columns at 900px; reverted. |
| 18 | Two bands on one page would duplicate ids (Edge) | low | reject | One band per page by design (FR-33); `useId` adds complexity. |

## Design Notes

The band posts through the same route so the honeypot, both rate limits, the config check and the log rules of Story 2.3 apply unchanged. The prefill is read after mount (never during render) so the server HTML and the first client render match.

## Verification

**Commands:**
- `npm run lint && npm run typecheck && npm run format:check` -- expected: no errors
- `npm test` -- expected: all pass
- `npm run test:coverage && npm run coverage:diff` -- expected: 100% changed lines, branches ≥ 80%
- `npm run build && npm run test:smoke` -- expected: build passes; smoke passes
- `npm audit --omit=dev` -- expected: 0 vulnerabilities

**Manual checks:**
- Walk the UX checks on `npm run dev` at 1280px, 900px and 390px with `/api/contact` intercepted in the browser (no real mail).
- After merge: one real capture on the dev site reaches the inbox and lands prefilled.

## Acceptance Evidence

Re-captured after the step-4 patches (cb665a5, ca73c72) and the evidence re-audit on 2026-10-03; each command ran in the foreground (two background runs were stopped by Claude Code for low memory).

**Commands**

- `npm run lint && npm run typecheck && npm run format:check` -- exit 0 -- clean
- `npm test` -- exit 0 -- "Tests  572 passed (572)"
- `npm run test:coverage && npm run coverage:diff` -- exit 0 -- "Coverage: 100%", "C1 ok: 9 changed file(s) with branch coverage >= 80% vs origin/develop."
- `npm run build && npm run test:smoke` -- exit 0 -- "3 passed (25.5s)"
- `npm audit --omit=dev` -- exit 0 -- "found 0 vulnerabilities"

**Observed**

- In Chrome on `npm run dev` at 1280px, 900px and 390px with `/api/contact` intercepted (no mail) -- `walk-output.txt`: band look and layout, focus ring; invalid email by Enter at 1280 (message, role=alert, aria-invalid, aria-describedby, focus on the field, no request) and by touch tap at 390 (message only; click not walked); error clears on typing; Sending... with the button disabled (click); valid submit by click lands on `/demo#form` with Work email filled, storage cleared and no email in the URL (URL checked on this path only); valid submit by Enter and by touch tap land on `/demo#form` with Work email filled; the project path (`router.push("/demo#project")`) opens the Outsourcing tab scrolled to the form; 502 / 429 / timeout (15.3 s) show their message with the email kept and the button enabled; consent line with an underlined "Privacy policy" link to `/privacy`; full-width button at 390px; no band on `/demo`.
- The row border computes to 1px in Chrome at 1x (the rule is 1.5px; Chrome rounds it, as with the focus ring in Story 1.1).
- Not observable in a browser: a value typed on `/demo` before the prefill runs; `contact-form.test.tsx` covers it.
- Both forms post with `method="post"` (tests in `capture-band.test.tsx` and `contact-form.test.tsx`).

**Artifacts**

- spec-2-4-email-capture-evidence/verification.txt -- 4196 bytes -- sha256 01ce27ed8a64 -- every Verification command after the step-4 patches, run one at a time in the foreground
- spec-2-4-email-capture-evidence/walk-output.txt -- 2163 bytes -- sha256 02c433c63358 -- UX walk observations L1-L9 and CAP-9, incl. keyboard and touch submit, link target and underline, full-width button
- spec-2-4-email-capture-evidence/walk.mjs -- 8483 bytes -- sha256 e85d926af9df -- the walk script
- spec-2-4-email-capture-evidence/band-1280.png -- 141606 bytes -- sha256 ce2c481d30ce -- demo band on Home at 1280px, with the ported ring
- spec-2-4-email-capture-evidence/band-900.png -- 132732 bytes -- sha256 b9a8127e2d71 -- band at 900px, one column
- spec-2-4-email-capture-evidence/band-390.png -- 93520 bytes -- sha256 2c409e05ec96 -- band at 390px, field above a full-width button
- spec-2-4-email-capture-evidence/band-error-1280.png -- 143090 bytes -- sha256 7b1efe820cde -- invalid email error
- spec-2-4-email-capture-evidence/band-failure-1280.png -- 145966 bytes -- sha256 72ed16a3a36a -- send failure message, email kept
- spec-2-4-email-capture-evidence/demo-prefilled-1280.png -- 380911 bytes -- sha256 8bc159a2ae34 -- /demo#form with Work email prefilled

**Not captured**

- A real capture mail on the dev site after merge (lead).
- A screen-reader pass.
