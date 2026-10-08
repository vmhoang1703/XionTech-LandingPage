---
title: 'E-A4 Home contact form, plain email bands, "Summit reached" success'
type: 'feature'
created: '2026-10-08'
status: 'done'
baseline_commit: '2bc2965b7a8c1c8536614fa241b08a34fe50b3b5'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/AGENTS.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** A visitor on Home can only leave an email in an amber band and must go to `/demo` to write to us. The email bands sit in amber boxes with corner rings, and every form thanks the visitor with a plain check icon. Source: `_bmad-output/specs/andy/spec-enh-a4-forms-bands/SPEC.md` (Tier 1, CAP-1 to CAP-4).

**Approach:** Port the prototype's Home `#contact` section (`index.html:241-268`, `css/site.css:572-592`, `js/site.js:590-603`) as the last Home section, posting a new `general` type to `/api/contact`. Add the summit-and-flag success to the Demo, Home and job forms, and give `CaptureBand` an optional `look` prop for the plain bands.

Decisions (lead, 2026-10-08, from the brief and the plan README): Q3 `/api/contact` gets a third type `general`, delivered and rate-limited like the others (D1, D3, T4). Q4 newsletter after the demo (Tier 2 out). Q13 keep the consent line in every email band. Q2 the prototype wins over `DESIGN.md`. E-A1, E-A2 and E-A7 are merged; this branch is on `origin/develop`. Copy is the prototype's, with "XionTech" spelling.

## Boundaries & Constraints

**Always:**
- Same phone rule on client and server: empty, or `^\+?[0-9(][0-9\s().-]{6,24}$` with 7 to 15 digits (after trim).
- `general` fields: name (required, at most 200), email (same rule as today), phone (optional), message (required, at most 2,000, CRLF counts as one). No organisation, role, product, service or date. Organisation is required only for `demo` and `project`.
- `CaptureBand` stays backward compatible: `kind` accepts `"demo" | "project"` as today; `look` is optional and defaults to today's amber look with rings.
- Plain looks (`white`, `page`, `navy`): no corner rings, amber `btn-primary` button (prototype), the consent line stays.
- Success panels: `role="status"`, focus moves to the panel, the summit SVG is `aria-hidden`; the flag rises once; with `prefers-reduced-motion: reduce` it shows without moving.
- `<HomeContact />` replaces `CaptureBand` as the last child of `src/app/page.tsx`; the rest of the order stays as it is (E-S1 owns it).
- No real mail in tests or walks: browser checks intercept `POST /api/contact`.

**Never:**
- No "Prototype: nothing was sent" text anywhere in `src`.
- No newsletter type, no Products page change (E-A5), no Services band removal (E-S2), no change to `home-news.tsx` (E-A6).
- No new dependency.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Home send, no phone | name, valid email, message, phone empty | client posts `type: "general"`; route 200; "Summit reached. Thanks — we've received your message." in place | N/A |
| Phone too short | phone `12` | client: phone error, focus on phone, no POST; server: 400 `{errors:{phone}}` | error text "Please enter a valid phone number, for example (+1) 469 322 9899." |
| Phone formats | `(+1) 469 322 9899`, `+84 908.107-552` | accepted | N/A |
| Phone 16 digits / letters | `+1234567890123456`, `12345ab` | rejected | phone error |
| Empty message (general) | message blank | client and server: message error "Please tell us a little about your project." | field error |
| General with org field | body includes `org` | ignored, not mailed | N/A |
| Unknown type | `type: "newsletter"` | 400 `{error:"send"}` | as today |
| Mail | valid general | subject `Contact message: <name>` (CR/LF stripped); text has Name, Email, Phone, Message; no service or organisation rows | send failure → 502 as today |
| Demo and project | existing bodies | unchanged results | unchanged |

</frozen-after-approval>

## Code Map

- `src/lib/contact/contact-rules.ts` -- `ContactType` (+`general`), new `RequestKind = "demo" | "project"`, `ContactField` (+`phone`), `CONTACT_ERRORS.phone`, `MESSAGE_REQUIRED_ERROR`, new `isValidPhone`, `PHONE_MAX_LENGTH = 25`; `validateContact` org only for demo/project, phone + required message only for general.
- `src/lib/contact/submission.ts` -- `CaptureSubmission.kind: RequestKind`; new `GeneralSubmission`; `readGeneral`; `parseSubmission` accepts `general`; `ValidSubmission` union grows.
- `src/lib/contact/delivery.ts` -- `SUBJECTS` keyed by `ContactType`; `mailText`/`mailSubject` general branch. Rate limit untouched.
- `src/app/api/contact/route.ts` -- no change expected (types flow through); add route tests.
- `src/components/contact/post-submission.ts` -- `FIELD_ORDER` stays the Demo form's fields; export its element type `DemoFormField` so `contact-form.tsx` does not need a phone id.
- `src/components/contact/contact-form.tsx` -- tabs typed `RequestKind`; field maps typed `DemoFormField`; pass `phone: ""` to `validateContact`; success panel uses `<SummitMark />`.
- `src/components/contact/contact-strings.ts` -- `form.successHeading` "Summit reached. Thank you!"; new `home` block (prototype copy, `index.html:245-264`).
- `src/components/contact/summit-mark.tsx` (new) -- the prototype SVG (`viewBox 0 0 120 80`, paths `sm-range`, `sm-pole`, `sm-flag`) in `<div className="summit" aria-hidden="true">`.
- `src/components/contact/home-contact.tsx` (new, server) -- `section.sec.surface-amber.contact#contact` with intro, contact links from `src/content/offices.ts` (Plano mailto + tel, HCMC tel; city = office name before the first comma) and the client form.
- `src/components/contact/home-contact-form.tsx` (new, client) -- follows `contact-form.tsx` patterns: `noValidate`, field errors with `aria-invalid`/`aria-describedby`, live-region summary, focus first invalid, honeypot `website`, send/rate alerts, "Sending..." disabled button, success in place with focus.
- `src/components/contact/capture-band.tsx` -- `kind: RequestKind`; `look?: "amber" | "white" | "page" | "navy"`.
- `src/components/careers/job-application-form.tsx`, `src/content/job.ts` -- `<SummitMark />`, heading "Summit reached. Thank you!".
- `src/app/page.tsx` -- `<HomeContact />` last, drop `CaptureBand` import.
- `src/app/about/page.tsx` -- `look="white"`; `src/app/news/page.tsx` -- `look="page"` (one line each).
- `src/app/globals.css` -- new `/* E-A4 */` blocks: `.capture-plain`, look backgrounds, plain `.cap-row`, `.summit` + `flagUp` + reduced motion, Home `.contact` gradient/grid/links/button (no glow, no lift). Replace the `.form-ok svg` check-icon rule.
- Tests to update: `src/app/page.test.tsx`, `src/app/no-js.test.tsx` (Home now has the contact heading), `capture-band.test.tsx`, `contact-form.test.tsx`, `job-application-form.test.tsx`, `contact-rules.test.ts`, `submission.test.ts`, `delivery.test.ts`, `route.test.ts`, about/news page tests if they assert classes.
- e2e (not run here): `e2e/smoke.spec.ts:11` → "Have something you want to build?"; `e2e/a11y.spec.ts:278` → Home contact form `#contact input[type=email]`.
- `docs/contact-delivery.md` -- add the `general` type.

## Tasks & Acceptance

**Execution:**
- [x] `src/lib/contact/contact-rules.ts` -- general type, phone rule, required message, org scope -- one rule for client and server
  - red: `src/lib/contact/contact-rules.test.ts` -- phone `12` and empty general message give errors; general without org has no org error
- [x] `src/lib/contact/submission.ts`, `src/lib/contact/delivery.ts` -- parse and mail `general` -- CAP-2
  - red: `src/lib/contact/submission.test.ts`, `delivery.test.ts`, `src/app/api/contact/route.test.ts` -- a general body is accepted, phone `12` returns 400 with a phone error, mail subject/text as in the matrix
- [x] `src/components/contact/summit-mark.tsx`, `contact-form.tsx`, `job-application-form.tsx`, `contact-strings.ts`, `src/content/job.ts`, `globals.css` -- summit success -- CAP-3
  - red: `contact-form.test.tsx`, `job-application-form.test.tsx` -- success shows "Summit reached. Thank you!" with an `aria-hidden` summit
- [x] `src/components/contact/home-contact.tsx`, `home-contact-form.tsx`, `contact-strings.ts`, `globals.css`, `src/app/page.tsx` -- Home `#contact` -- CAP-1
  - red: `src/components/contact/home-contact-form.test.tsx` -- no-phone send posts `general` and shows "Summit reached."; phone `12` blocks the POST
- [x] `src/components/contact/capture-band.tsx`, `globals.css`, `about/page.tsx`, `news/page.tsx` -- `look` prop -- CAP-4
  - red: `capture-band.test.tsx` -- `look="navy"` renders `surface-navy capture-plain` and a primary button; no look keeps `surface-amber`
- [x] `e2e/smoke.spec.ts`, `e2e/a11y.spec.ts`, `docs/contact-delivery.md` -- follow the Home change; document `general`

**Acceptance Criteria:**
- Given Home, when it renders, then the last section is `#contact` with "Have something you want to build?", the email link `vinni.tran@newxion.com`, the Plano and Ho Chi Minh City phone links, and no capture band.
- Given a 320px screen, when Home is shown, then the page has no sideways scroll.
- Given `grep -r "Prototype: nothing was sent" src`, then it finds nothing.

## UX checks

| Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| ---- | --------------- | ----- | ------------------ | ------ | ------ | ------- |
| Home contact | page load | — | last section; amber gradient from light grey to amber; intro left, white form card right | — | CAP-1, `css/site.css:574-575` | walk (observed-walk.txt, home-contact-success-1280.png); `page.test.tsx` |
| Home contact | width ≤ 900px | — | one column, intro above card | — | `site.css:590` | walk2: 900px one 852px column, intro above card |
| Home contact | width 320px | — | no sideways scroll | — | CAP-1, ENH-026 | walk: scrollWidth 320 = clientWidth |
| Contact links | email and two phones | mouse, keyboard | underlined navy links, 44px tall targets, icons hidden from AT | — | `site.css:578-581` | walk: 44px each; walk2: icons aria-hidden |
| Phone field | empty | — | placeholder "(+1) 469 322 9899", label ends "(optional)" | — | CAP-1 | walk; `home-contact-form.test.tsx` |
| Submit button | hover | mouse | background amber-deep; no glow, no lift | — | CAP-1, `site.css:585-586` | walk: hover rgb(240,179,0), shadow none, transform none |
| Home form | submit empty | mouse, keyboard (Enter) | name, email, message errors shown and announced; focus on name | — | AC, CAP-1 | walk (click), walk2 (Enter, live region text) |
| Home form | phone "12" | keyboard | phone error, no request sent | — | Success signal | walk: 0 posts; `home-contact-form.test.tsx` |
| Home form | type in a field with an error | keyboard | its error clears | — | `site.js:597` | walk2: name error cleared, email error stays |
| Home form | sending | any | button disabled, "Sending..." | until reply | contact-form pattern | walk2 |
| Home form | 429 / failure | any | alert above button; focus back on button | — | contact-form pattern | walk2 (429); `home-contact-form.test.tsx` (500) |
| Success (Home, Demo, job) | sent | any | summit with flag above "Summit reached." heading; panel focused | — | CAP-3 | walk (Home, Demo); `job-application-form.test.tsx` (job) |
| Summit flag | sent | — | flag rises once | 0.9s after 0.2s | `site.css:1286` | walk2: flagUp 0.9s, delay 0.2s, 1 iteration |
| Summit flag | reduced motion | — | flag shown, no movement | — | CAP-3 | walk: animation-name none |
| Capture band | `look` white / page / navy | — | no rings; paper / page blue / navy background; amber button; consent line stays | — | CAP-4, Q13 | walk (white, page); `capture-band.test.tsx` (navy classes) |
| Capture band | navy, field focused | keyboard | 3px focus ring on the row | — | `site.css:295` | pending: no page uses navy until E-A5; E-A5 checks it |
| Capture band | no `look` | — | unchanged amber with rings, navy button | — | backward compatible | `capture-band.test.tsx` |

## Implementation Notes

- Task 1: the prototype phone regex (`js/site.js:593`) rejects its own placeholder "(+1) 469 322 9899", because `+` is not allowed after the first character. The body class is `[0-9\s().+-]`; the 7-15 digit count still bounds it. Same rule on client and server.

## Spec Change Log

## Review Triage Log

Full review on 2026-10-08: blind-hunter, edge-case-hunter, verification-gap, acceptance-auditor, security-auditor (all sonnet), plus task-review minors from the ledger.

| # | Source | Finding | Verdict | Evidence | Route |
|---|--------|---------|---------|----------|-------|
| 1 | edge | `PHONE_FORMAT` allows `\s`, so a tab or line break passes and splits the mail body line | medium | `"+1 469\n322 9899"` matched `[0-9\s().+-]`; text goes into `mailText` unchanged | patch (8924915) |
| 2 | gap | Home honeypot `website` not tested hidden or posted | medium | No test typed into it; the `toEqual` body check passes with an empty or renamed input | patch (8924915) |
| 3 | blind | Privacy "What we collect" does not list the new phone number | medium | `privacy.ts:34` listed email, name, organisation, role only | patch (8924915) |
| 4 | blind, edge | `contact-delivery.md` says general runs "the same steps" incl. step 3 and lists no general rules; empty Phone line not documented | low | `readGeneral` returns before the role/select checks | patch (8924915), direct doc correction |
| 5 | auditor | UX checks table has no Checked entries | medium | All 17 rows empty | fixed in the spec: second walk filled every row |
| 6 | auditor | Phone regex differs from the frozen Always rule | low | Recorded in Implementation Notes; the frozen matrix row requires "(+1) 469 322 9899" accepted, which the frozen regex rejects; code follows the matrix | reject (spec-internal; lead told in report) |
| 7 | auditor | Rate limit for `general` not shown | false | `route.ts` calls `checkRateLimits(ipAddress(request), submission.email)` for every parsed type; route unchanged | reject |
| 8 | security | Reply-To CR/LF via email | false | `isValidEmail` uses `/^[^\s@]+@[^\s@]+$/`, so no whitespace or line break passes | reject |
| 9 | edge | Phone 26 chars with `+` passes server, input maxLength 25 | low | Only a direct API call can send it; 7-15 digits still hold | reject |
| 10 | edge | Server 400 with only unknown error keys shows nothing | false | `postSubmission` filters by `fields`; with no known field it returns `send`, which shows the alert | reject |
| 11 | edge | `postSubmission` may reject and leave the form sending | false | `postSubmission` catches every error and returns `{kind:"send"}` | reject |
| 12 | edge | Double Enter sends twice | low | Same pattern as `ContactForm`; the button disables on the next render | reject |
| 13 | edge | Send-failure alert stays while editing | low | Same as `ContactForm`; it clears on the next submit | reject |
| 14 | edge | Empty `<ul>` if offices lose contacts | low | `offices.ts` always has them; guard adds a branch | reject |
| 15 | edge, ledger T2 | Empty phone mails a bare `Phone:` line | low | Harmless; now documented | reject |
| 16 | edge | Textarea has no maxLength | low | Matches the Demo form; the error says the limit | reject |
| 17 | edge | Error colour on paper/page plain bands only from default | false | Those looks use light tokens where `--color-error` is the AA-checked default | reject |
| 18 | edge | `news.spec.ts:13` still expects the demo band heading | false | News keeps `kind="demo"` copy; only the look changed | reject |
| 19 | edge, blind | Home success text differs from Demo/job; "amber button" claim; job headline changed | false | Both copies are the prototype's (`index.html:264`, `job.html:67`); CAP-3 asks for the job form; `btn-primary` is the amber gradient | reject |
| 20 | blind | Home form duplicates `ContactForm` logic | low | Three forms with similar error and focus code | defer |
| 21 | blind | `navy` look unused | false | CAP-4 asks for it; E-A5 Products uses it | reject |
| 22 | blind | `phone: ""` threaded through demo/project callers | low | Two call sites; typed and tested | reject |
| 23 | blind | Raw hex in the contact gradient, 900px literal, prototype line refs in comments | low | Prototype values (`site.css:574`, `:590`); cosmetic | reject |
| 24 | blind | No contrast check on the gradient | false | The lightest stops are lighter than amber, so the on-amber text tokens (AA on amber) gain contrast there | reject |
| 25 | blind | Only Plano email shown; tests use real office data | false | Prototype shows exactly one email and two phones; HCMC email not confirmed (Q7) | reject |
| 26 | blind | Placeholder uses the real Plano number | false | Prototype copy (`index.html:250`), CAP-1 names it | reject |
| 27 | blind | Missing tests: 15-digit bound, `send` failure, e2e submit | low | 16 digits rejected and 7 accepted are tested; `send` failure is tested; e2e submit is not in scope | reject |
| 28 | ledger T1 | CRLF-only message not tested | low | `trim()` covers it | reject |
| 29 | ledger T2 | General tests skip long name/message/phone | low | Covered in `contact-rules.test.ts` | reject |
| 30 | ledger T3, T5 | Flag animation, plain-band CSS not unit-tested | low | Checked in the browser walks | reject |
| 31 | ledger T4 | CSS comment says 320px, rule is below 640px | low | Cosmetic | reject |
| 32 | ledger T4 | Fixed `id="contactForm"` | low | One form per page | reject |

## Verification

**Commands:**
- `npm run lint && npm run typecheck && npx prettier --check src e2e studio` -- expected: clean
- `npm test` -- expected: all pass
- `npm run test:coverage && npm run coverage:diff` -- expected: 100% changed lines
- `npm run build` -- expected: success
- `grep -r "Prototype: nothing was sent" src` -- expected: no output

**Manual checks:**
- `npx next start --port 3204` + Playwright (Chrome): Home send with intercepted `POST /api/contact`, phone "12" error, 320px scroll width, reduced-motion flag, capture looks on About and News.

## Acceptance Evidence

Re-captured after the review patches (8924915) on 2026-10-08.

**Commands**

- `npm run lint` -- exit 0 -- eslint clean
- `npm run typecheck` -- exit 0 -- Types generated successfully
- `npx prettier --check src e2e studio` -- exit 0 -- All matched files use Prettier code style!
- `npm run test:coverage` (includes the full `npm test` suite) -- exit 0 -- 81 files, 1228 passed
- `npm run coverage:diff` -- exit 0 -- 104 lines, 0 missing, 100%; C1 ok for 20 changed files
- `npm run build` -- exit 0 -- Compiled successfully
- `grep -r "Prototype: nothing was sent" src` -- exit 1 -- no match

**Observed**

- `next start --port 3204` + Playwright (Chrome), `POST /api/contact` intercepted: Home ends with `#contact`, no capture band; empty submit marks name, email, message and focuses name, 0 posts; phone "12" shows the phone error, 0 posts; a no-phone send posts `type: "general"`, `phone: ""` and shows "Summit reached. Thanks — we've received your message." with focus on the panel -- spec-enh-a4-forms-bands-evidence/observed-walk.txt
- 320px: scrollWidth 320 = clientWidth; reduced motion: flag `animation-name: none`; button hover amber-deep, no shadow, no transform -- same log
- About band `surface-paper`, News band `hero-light` (#f7f9fd), no rings, amber `btn-primary`, consent kept, 3px focus ring; Demo shows "Summit reached. Thank you!" -- same log

**Artifacts**

- spec-enh-a4-forms-bands-evidence/observed-walk.txt -- 1477 bytes -- sha256 49981f0b4759 -- browser walk log
- spec-enh-a4-forms-bands-evidence/observed-walk2.txt -- 651 bytes -- sha256 04ec753ef0ae -- second walk: 900px, error clearing, Sending..., 429, flag timing, Enter, privacy phone
- spec-enh-a4-forms-bands-evidence/home-contact-success-1280.png -- 106562 bytes -- sha256 2a82d984b6cf -- Home success panel
- spec-enh-a4-forms-bands-evidence/home-contact-320.png -- 105288 bytes -- sha256 1fb9c66ee232 -- Home contact at 320px
- spec-enh-a4-forms-bands-evidence/capture-about.png -- 43374 bytes -- sha256 b4453590ac3c -- About white band
- spec-enh-a4-forms-bands-evidence/capture-news.png -- 47804 bytes -- sha256 d7d6563d3e29 -- News light blue band
- spec-enh-a4-forms-bands-evidence/demo-success.png -- 13804 bytes -- sha256 d315522b02ce -- Demo summit success
- Command outputs `lint.txt`, `typecheck.txt`, `prettier.txt`, `coverage.txt`, `coverage-diff.txt`, `build.txt` in the same folder (hashes in the ledger)

**Not captured**

- The navy look in a browser: no page uses it until E-A5 merges; `capture-band.test.tsx` covers its classes.
- e2e smoke and a11y specs were changed but not run (port 3100 is shared); the lead runs them.
