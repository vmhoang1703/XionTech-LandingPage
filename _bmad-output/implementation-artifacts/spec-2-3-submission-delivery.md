---
title: 'Story 2.3: Submission delivery and spam protection'
type: 'feature'
created: '2026-10-02'
status: 'done'
baseline_commit: '07a04398619879014153e488afb11dc07fe1a9c9'
route: 'dispatch'
review_loop_iteration: 1
context: ['{project-root}/AGENTS.md']
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The `/demo` form (Story 2.2) validates in the browser but sends nothing. On Demo day 2026-10-09 every demo and project request must reach the contact inbox, a visitor must see that it is sending and that it arrived, a failure must never lose what they typed, and bots must not flood the inbox. Contract: `_bmad-output/specs/andy/spec-2-3-submission-delivery/SPEC.md` (CAP-1…CAP-6).

**Approach:** A `POST /api/contact` route handler runs, in order, the honeypot, the shared rules from `contact-rules.ts`, a rate limit in Upstash Redis and a send through Gmail SMTP (nodemailer). The client form posts JSON with `fetch`, shows "Sending...", then the thank-you panel, or keeps every value and shows a retryable error.

## Boundaries & Constraints

**Always:**
- Lead decisions (T4, 2026-10-02): mail sender = Gmail SMTP with an App Password (nodemailer); rate-limit store = Upstash Redis free via the Vercel Marketplace integration (`@upstash/ratelimit`, `Ratelimit.slidingWindow(5, "10 m")`).
- Server-only env, never `NEXT_PUBLIC_*`, never in source: `CONTACT_INBOX` (the lead's company email in every environment, set by the lead; the address is never written in the repo), `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `KV_REST_API_URL`, `KV_REST_API_TOKEN` (names the Vercel Upstash integration adds). Checked on each request like `src/app/api/revalidate/route.ts`: a missing one → 500 and one log line naming the variable, never a value.
- Same rules and wording on server and client (`contact-rules.ts`). Server field errors come back as `{ errors: { field: text } }` and show inline exactly like client errors.
- Rate-limit key = IP (`ipAddress` from `@vercel/functions`) plus the lower-cased email, SHA-256-hashed before it reaches Upstash (no personal data in the store).
- Logs and URLs never contain personal data (NFR-3). The mail body is plain text; Reply-To is the visitor's email.
- Strings for sending, success and errors live in `contact-strings.ts` (translatable).
- Name every free-tier limit in `docs/contact-delivery.md` and the PR (T4).

**Never:** the prototype suffix "Prototype: nothing was sent."; in-process counters or caches; storing Submissions anywhere but the inbox (A4: kept with no time limit, in the inbox); Sanity for submissions; the capture band (2.4); job applications (6.6); no-JS submit (7.2); a server action (queued per client; a route handler returns status codes).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| Valid send | valid demo or project JSON | 200 `{ ok: true }`; one mail to `CONTACT_INBOX` | N/A |
| Honeypot filled | `website` field not empty | 200 `{ ok: true }`, no mail, no rate-limit call | none (silent) |
| Bypassed client | missing name, bad email, message > 2,000, past date, bad date format, over-length field | 400 `{ errors }` with the client wording | no mail |
| Over limit | 6th send for the same IP + email in 10 min | 429 `{ error: "rate" }`; same IP with another email still passes | no mail |
| Mail fails | SMTP error | 502 `{ error: "send" }` | logged without personal data |
| Not configured | a required env missing | 500 `{ error: "send" }` | one log line naming the variable |
| Bad body | not JSON, unknown `type` | 400 `{ error: "send" }` | no mail |
| Store down | Upstash unreachable or erroring | mail is sent anyway (fail open), 200 | one log line "rate limit unavailable" |
| Client timeout | no answer in 15 s | form keeps values, shows the send error | retry by pressing "Send request" again |

**Decisions (lead, 2026-10-02):**
- Send-failure message (502, 500, 400 without field errors, timeout): "We could not send your request. Please try again." Rate-limit message (429): "You have sent several requests in a short time. Please try again in a few minutes." Retry is the same "Send request" button.
- Upstash down or unreachable: fail open — send the mail, log "rate limit unavailable" (no personal data).
- Spec size about 3,300 tokens: kept in full (lead).
- 2026-10-03: the contact inbox is the lead's company email in Development, Preview and Production. vinni.tran@newxion.com (the lead's manager) receives no form mail. This replaces D1's production target.
- 2026-10-03, after the step-4 review (lead): (1) add a second rate limit on the IP alone, 20 sends per hour (SHA-256 of the IP), next to the IP + email limit; same fail-open rule. (2) The Gmail and inbox variables exist for Production and Preview (all preview branches; the lead first chose `develop` only, then kept all previews the same day because previews are for checking deployments and the UI and the shared limits cover them). (3) Accepted deviations: a role over 200 characters gets 400 `{ error: "send" }` (no field slot), and the inputs carry `maxLength` (200; email 254). (4) `AGENTS.md` gets Gmail SMTP and Upstash rows in this PR.

</frozen-after-approval>

## Code Map

- `src/lib/contact/contact-rules.ts` -- framework-free; `validateContact(type, values, today)` (:33), `CONTACT_ERRORS` (:9), `MESSAGE_MAX_LENGTH` (:17), email check (:19-27), date compare is a plain string `<` (:42), message CRLF normalised (:46). Add caps and a date-format check here so the client gets them too.
- `src/components/contact/contact-form.tsx` -- client form; uncontrolled `FormData` (`readValues` :89); exports `ContactSubmission` (:55); `onValidSubmit` prop (:61-63, :144) called at :204 — replace with the internal send; submit button :378-381; live region :385; errors inline with `aria-invalid`/`aria-describedby`, focus first invalid (:201); `localToday()` (:192, :340).
- `src/components/contact/contact-strings.ts` -- `form.submit` (:44), consent (:45), `errors: CONTACT_ERRORS` (:49). No sending/success/failure strings yet.
- `src/app/demo/page.tsx` -- renders `<ContactForm />` in `#form.form-card` (:75-77); no change expected.
- `src/app/api/revalidate/route.ts` + `route.test.ts` -- pattern: env read per request, 500 + `console.error` naming the variable, plain status codes; tests `// @vitest-environment node`, `vi.hoisted` + `vi.mock`, `new Request(...)`, `vi.stubEnv`.
- `src/components/contact/contact-form.test.tsx` -- Testing Library `fireEvent` only, no jest-dom, no user-event.
- Mockup: `mockups/site-v3/demo.html:64` (`.form-ok` panel, check-circle icon, `role="status"`), `css/site.css:349-353`, `js/site.js:239` (button disabled + "Sending...").
- `e2e/smoke.spec.ts` + `playwright.config.ts` -- request-only smoke on port 3100; no env block, so smoke must pass without the new secrets.
- Next.js 16 docs read: `01-app/03-api-reference/03-file-conventions/route.md` (`request.json()`, `Response.json`), `02-route-segment-config/maxDuration.md`, `02-guides/upgrading/version-15.md:601-612` (`request.ip` removed; `ipAddress` from `@vercel/functions`).
- Versions (npm, 2026-10-02): `nodemailer` 10.0.13, `@upstash/ratelimit` 2.2.0, `@upstash/redis` 1.39.0, `@vercel/functions` 3.9.9.

## Tasks & Acceptance

**Execution:**
- [x] `package.json` -- add `nodemailer`, `@upstash/ratelimit`, `@upstash/redis`, `@vercel/functions` pinned exactly (and `@types/nodemailer` if nodemailer ships no types) -- sender, store, client IP.
- [x] `src/lib/contact/contact-rules.ts` -- caps: name, org and role 200 characters, email 254, with error "Please keep this under 200 characters." / "Please enter a valid email address."; a date that is not `YYYY-MM-DD` gets the date error -- deferred-work 2.2 item; client and server share it.
  - red: `src/lib/contact/contact-rules.test.ts` -- a 201-character name, a 255-character email and the date "2026-1-5" are rejected with that wording.
- [x] `src/lib/contact/submission.ts` -- `parseSubmission(body: unknown, serverToday)` → `{ ok, submission } | { ok: false, errors } | { ok: false, bad: true }`: checks `type`, reads only that tab's fields, honeypot flag, runs `validateContact` with a server "today" one day before the UTC date (a visitor's local today is never rejected in any time zone); select values must be in their option lists -- CAP-3, CAP-4.
  - red: `src/lib/contact/submission.test.ts` -- each bypassed-client row of the matrix, unknown type, non-object body, honeypot, the time-zone edge.
- [x] `src/lib/contact/delivery.ts` -- `getDeliveryConfig()` (throws naming the missing variable), `rateLimitKey(ip, email)` (SHA-256 hex), `checkRateLimit(key)` (Upstash sliding window 5 / 10 min, prefix `contact`; an Upstash error returns "allowed" and logs "rate limit unavailable"), `sendContactMail(config, submission)` (nodemailer `service: "gmail"`, plain-text body with every field, subject "Product demo request: <org>" / "Outsourcing project request: <org>" with CR/LF removed, Reply-To = visitor email) -- CAP-5, CAP-6.
  - red: `src/lib/contact/delivery.test.ts` -- missing variable named; key has no raw email; mail options carry inbox, subject, Reply-To and fields (nodemailer and Upstash mocked).
- [x] `src/app/api/contact/route.ts` -- POST: parse (400) → honeypot (200, nothing else) → config (500) → validate (400 `{ errors }`) → rate limit (429) → send (502 on failure) → 200; `maxDuration = 10`; logs name only the step and error class -- matrix.
  - red: `src/app/api/contact/route.test.ts` -- every matrix server row, and that no log line contains the visitor's email.
- [x] `src/components/contact/contact-strings.ts` + `contact-form.tsx` -- hidden honeypot input `name="website"` (`tabindex="-1"`, `aria-hidden="true"`, `autocomplete="off"`, visually hidden); on valid submit post JSON with a 15 s `AbortController`; button disabled with "Sending..."; 200 → form replaced by `role="status"` panel "Thank you!" / "We will be in touch soon."; 400 `{ errors }` → inline errors + focus as for client errors; 429 / other / timeout → message above the button, values kept, button enabled again; `onValidSubmit` prop removed -- CAP-1, CAP-2, CAP-4.
  - red: `src/components/contact/contact-form.test.tsx` -- sending state, success panel, server errors inline, each failure keeps values and shows its message (fetch mocked).
- [x] `src/app/globals.css` -- `.form-ok` panel (centred, check-circle icon in navy) and `.form-alert` (error colour on paper, above the button) with tokens -- mockup `css/site.css:349-353`.
- [x] `e2e/smoke.spec.ts` -- `@smoke` POST `/api/contact` with the honeypot filled returns 200 (needs no secrets).
- [x] `.env.example` + `docs/contact-delivery.md` -- the five variable names (values blank); lead account steps (Design Notes); free limits: Gmail about 500 recipients per rolling 24 h (third-party sources; Google states no consumer number), Upstash 500K commands/month, 256 MB, 10 GB bandwidth, 1 database; what forces paid.

**Acceptance Criteria:**
- Given the lead's env in Vercel, when a reviewer sends a Product demo request on https://xiontech-dev.vercel.app/demo, then the mail arrives at the contact inbox with every field and Reply-To set to the visitor.
- Given five sends with one email in 10 minutes, when a sixth is sent, then the form shows the rate-limit message, keeps every value, and nothing is sent.
- Given any request, then no URL, query string, hash, log line or Upstash key contains the visitor's name or email.

## UX checks

| Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| ---- | --------------- | ----- | ------------------ | ------ | ------ | ------- |
| Submit | valid submit | mouse, keyboard (Enter), touch | button disabled, reads "Sending...", icon kept | at once, until the answer | EXPERIENCE.md:210, `site.js:239` || ✅ Chrome 1280 + 390 (click, Enter; touch not used) |
| Form | 200 | — | form and tabs replaced by panel: check-circle icon, "Thank you!", "We will be in touch soon."; focus moves to the panel, so a screen reader reads it (`role="status"`). The mockup keeps the tabs; they are hidden here because their panels are gone (decided in task 6 review) | at once | EXPERIENCE.md:112, `demo.html:64` || ✅ Chrome 1280 + 390 (focus on panel; screen reader not used) |
| Form | 400 with field errors | — | same inline errors, red border and live-region announcement as client errors; focus on the first invalid field | at once | SPEC CAP-3 || ✅ Chrome 1280 + 390 |
| Form | send failure / timeout | — | message above the button in error colour (`role="alert"`, announced at once); every typed value kept; button enabled, reads "Send request", and has focus again | at once / after 15 s | EXPERIENCE.md:210 || ✅ Chrome 1280 + 390 (timeout 15.2 s) |
| Form | 429 | — | rate-limit message above the button; values kept; button enabled | at once | SPEC CAP-5 || ✅ Chrome 1280 + 390 |
| Form | retry after failure | mouse, keyboard | message cleared, "Sending..." again | at once | EXPERIENCE.md:210 || ✅ Chrome 1280 + 390 |
| Honeypot | Tab through the form | keyboard | focus never reaches it; not visible; not read by a screen reader | — | SPEC CAP-4 || ✅ Chrome (never reached by Tab; 1x1; aria-hidden; screen reader not used) |
| Panel | 390px and 1280px | — | panel fits the card, no sideways scroll | — | DESIGN (card) || ✅ Chrome 1280 + 390 |

## Implementation Notes

- Task 2: `ContactValues` has no `role`, and role is optional with no error slot in the form, so the role cap (200) is enforced in `parseSubmission` (task 3: over-length role → bad body, 400 `{ error: "send" }`) and by `maxLength` on the inputs (task 6: name, org, role 200; email 254). `isValidDate` also rejects impossible dates such as 2026-02-30.
- Task 3: `parseSubmission(body, now: Date)` returns `{ ok: true, submission }`, `{ ok: false, errors }`, `{ ok: false, bad: true }` or `{ ok: false, honeypot: true }` (a fourth shape for the honeypot). Route order (task 5): `bad` → 400 `{ error: "send" }`; `honeypot` → 200 `{ ok: true }`; then config; then `errors` → 400 `{ errors }`. The products list is capped at the number of options (4).
- Task 6 must keep the `ContactSubmission` type export in `contact-form.tsx`: `submission.ts` imports it.
- Task 4: `getDeliveryConfig()` checks all five variables and throws `Error("<NAME> is not set")`, returning `{ inbox, gmailUser, gmailAppPassword }`; `rateLimitKey(ip | undefined, email)`; `checkRateLimit(key)` → `true` when allowed, never throws (fail open); `sendContactMail` throws on SMTP failure (route → 502). `secure: true` sits next to `service: "gmail"` because `sonarjs/no-clear-text-protocols` requires it (no runtime change). `ephemeralCache: false`, so no in-process cache.
- Task 4 fix: Upstash `timeout: 3000` (a timeout logs "rate limit unavailable" and allows); SMTP connection, greeting and socket timeouts 5000 ms each; the log line carries the error class only. A worst-case slow path can pass the route's `maxDuration = 10`; the platform then ends the call and the client shows the send error with values kept, the same as a 502.
- Step 4 patches: `delivery.ts` exports `checkRateLimits(ip, email)` (IP + email limit 5 per 10 minutes, then the IP-only limit 20 per hour; a store failure on the first check skips the second, one log line) and `rateLimitKey` / `ipRateLimitKey` (SHA-256 hex). The old `checkRateLimit(key)` is gone. The 502 log line adds the nodemailer error code (EAUTH, ETIMEDOUT...).

## Spec Change Log

- 2026-10-03, after the patch re-review: the lead kept the Gmail variables on all Preview branches (Decision 2 amended). The 429 text says "a few minutes" while the IP-only limit can last up to an hour; the text is a frozen lead decision and stays. The task 4 line and Code Map name the old single `checkRateLimit`; the code now has `checkRateLimits(ip, email)` (Implementation Notes).

- 2026-10-03, step 4 review: findings 1-4 were intent gaps; the lead decided them (Decisions). Amended: Decisions, Design Notes step 3. Additive only: every task and its code stay (KEEP all). Known-bad state avoided: one script emptying the Gmail quota; PR previews sending mail. No revert: the new limit is a patch on top of tasks 4 and 5.

## Review Triage Log

Step 4 full review, 2026-10-03 (Blind Hunter, Edge Case Hunter, Verification Gap, Acceptance Auditor, Security Auditor; task-review minors included).

| # | Finding (source) | Verdict | Route | Evidence |
|---|---|---|---|---|
| 1 | A sender who changes the email each time is never limited; ~500 requests empty Gmail's daily quota and real visitors get 502 for up to 24 h (Security, Blind) | high | intent_gap, lead decided | Key is IP + email (`delivery.ts:48`), no IP-only or global cap. Lead: add an IP-only limit, 20 per hour. Additive; all code kept (Spec Change Log). |
| 2 | PR previews are public mail endpoints (Security) | medium | intent_gap, lead decided | Reached `/api/revalidate` on the PR #14 preview without login (401 from the route). Lead first chose Production + Preview on `develop`, then kept all previews: the shared Upstash limits (about 20 sends an hour per IP) cover every deployment. Docs say so. |
| 3 | Role over 200 gives 400 `{ error: "send" }`, not `{ errors }` (Acceptance, Edge) | low | intent_gap, lead accepted | `submission.ts:108`; lead accepted the exception (Decisions). |
| 4 | `maxLength` on inputs is not in a task line (Acceptance) | low | intent_gap, lead accepted | Implementation Notes asked for it; lead accepted (Decisions). |
| 5 | SMTP failures log only "Error": nodemailer keeps `name` and puts the cause in `code` (EAUTH, ETIMEDOUT) (Blind) | medium | patch | `node_modules/nodemailer/dist/cjs/smtp-connection/index.js:868` sets `err.code`. Log the code too (no personal data). |
| 6 | Sliding window is an estimate; the sixth send can pass at a window edge, while the docs say "5 in 10 minutes" (Edge) | low | patch | `@upstash/ratelimit` weights the previous window. Docs reworded; the lead's check says send quickly. |
| 7 | Docs: Development in Vercel cannot hold Sensitive values; no production check after the release (Blind) | low | patch | Docs say Production + Preview(develop) only and add a production check after the release PR. |
| 8 | `AGENTS.md` tech stack not updated (Blind) | low | patch (lead approved) | Decision (4). |
| 9 | Walk line "request URL has no query: true" was a typed value, not an observation (Acceptance) | - | evidence | Controller error; the walk now reads `route.request().url()` and runs L1-L6 at 390px too. |
| 10 | "No log line" for the real send is not in the artifact; the BLOCKED row misses the sixth-send check; task 5 RED was made after the code (Acceptance) | - | evidence | Claim dropped; row rewritten; RED re-run with a verbose reporter. |
| 11 | Config checked per request, not at startup (`CLAUDE.md` guardrail) (Blind, Verification Gap) | medium | defer | Design Notes chose per request so build and smoke need no secrets (same as the 1.8 webhook). A log-only `instrumentation.ts` check is a follow-up. |
| 12 | Client treats any 2xx as sent (Blind, Edge) | low | defer | Needs a proxy or portal answering 200 to a same-origin POST. |
| 13 | Autofill could fill the `website` honeypot; hits are not counted (Blind, Edge, task 6 minor) | maybe-false | defer | Frozen matrix names the field `website`; real autofill behaviour not checked. Medium if true. |
| 14 | A lost response after Gmail accepted the mail leads to a duplicate on retry (Blind, Edge) | low | defer | Needs an idempotency id in Upstash. |
| 15 | Timeouts (3 s + 5 s per SMTP phase, DNS) can pass `maxDuration` 10 (Blind, Edge) | low | defer | Already in Implementation Notes; the visitor sees the send error with values kept. |
| 16 | Screen reader hears nothing while sending; the alert may be cut by the focus move (Blind) | maybe-false | defer | Needs a real screen-reader pass (listed under Not captured). |
| 17 | Form and tabs editable while sending (Blind, Edge) | low | reject | A server date error after a passing client check is near impossible (the server cut-off is a day earlier); the fix adds state. |
| 18 | Focus jumps to the button if the visitor typed elsewhere while sending (Edge, task 6 minor) | low | reject | Same design as the field-error focus; rare. |
| 19 | No environment marker in the subject; all environments share one inbox (Blind) | low | defer | Follows from the lead's inbox decision; a `VERCEL_ENV` subject prefix is a small follow-up. |
| 20 | `delivery.ts` has no `import "server-only"`; the type lives in a client file (Blind) | low | defer | Only the route imports `delivery.ts`; adding it needs test mocks as in Story 1.8. |
| 21 | Whitespace-only env, products duplicates, 5-digit year, no upper date bound, no `Retry-After`, no body-size check, `LENGTH_ERROR` hardcodes 200, constant-only `maxDuration` test (Blind, Edge) | low | reject | Unlikely or cosmetic; each fix adds a guard. Vercel caps function bodies (about 4.5 MB). |
| 22 | `x-real-ip` could be spoofed off Vercel (Security) | maybe-false | reject | On Vercel the platform sets it; off Vercel there is no deployment. |
| 23 | New dependencies not checked for advisories (Security) | false | reject | `npm audit --omit=dev`: 0 vulnerabilities (verification.txt). |
| 24 | Task review minors (tasks 1-9): report text, test comments, contrast-test scope, CSS source order, literal sizes, smoke wording, doc wording | low | reject | Cosmetic; logged in the ledger. |

## Design Notes

**Account steps (the lead, before merge):**
1. Gmail used as sender (`GMAIL_USER`): turn on 2-Step Verification, then create an App Password (myaccount.google.com → Security → App passwords). It is shown once; put it only in Vercel and `.env.local` as `GMAIL_APP_PASSWORD`.
2. Vercel → project → Storage → Create → Marketplace → Upstash Redis (free) → connect to `xion-tech-landing-page` for Production and Preview. Check the project now has `KV_REST_API_URL` and `KV_REST_API_TOKEN`.
3. Vercel → Environment Variables (Sensitive): `CONTACT_INBOX` = the lead's company email, `GMAIL_USER`, `GMAIL_APP_PASSWORD`, each for Production and Preview (decision 2026-10-03).
4. Copy the same five into `.env.local` for local runs (I never read that file).

Env is checked per request, not in `next.config.ts`: a build check would make every teammate's smoke and build need the Gmail and Upstash secrets.

## Verification

**Commands:**
- `npm run lint && npm run typecheck && npm run format:check` -- expected: no errors
- `npm test` -- expected: all pass
- `npm run test:coverage && npm run coverage:diff` -- expected: 100% changed lines, branches ≥ 80%
- `npm run build && npm run test:smoke` -- expected: build passes; smoke 3 passed
- `npm audit --omit=dev` -- expected: no high finding from the new packages

**Manual checks:**
- Walk the UX checks on `npm run dev` at 1280px and 390px with `/api/contact` answering 200, 400, 429, 502 and a delay (browser request interception).
- After merge: a real Product demo request on the dev site arrives at the inbox; a sixth quick send shows the rate-limit message.

## Acceptance Evidence

Re-captured after the step-4 review patches on 2026-10-03.

**Commands**

- `npm run lint && npm run typecheck && npm run format:check` -- exit 0 -- clean (docs-only commit d2d92a4 after it: `npx prettier --check docs/contact-delivery.md` clean)
- `npm test` -- exit 0 -- "Tests  464 passed (464)"
- `npm run test:coverage && npm run coverage:diff` -- exit 0 -- "Coverage: 100%", "C1 ok: 6 changed file(s) with branch coverage >= 80% vs origin/develop."
- `npm run build && npm run test:smoke` -- exit 0 -- "3 passed (17.2s)"
- `npm audit --omit=dev` -- exit 0 -- "found 0 vulnerabilities"

**Observed**

- Every UX checks line at 1280px and 390px on `npm run dev`, with `/api/contact` intercepted in the browser -- `walk-output.txt`. The request goes to `http://localhost:3000/api/contact` with no query, hash, name or email. Touch input was not used (mouse click and keyboard Enter only).
- Task 5 RED re-run with a verbose reporter -- `task5-red.txt`: 43 of 45 fail against a 501 stub; the 2 that pass are named.
- One real request through the local route (lead approved; before the step-4 patches) -- `real-send.txt`: 200 `{"ok":true}`. The mail arrived in the lead's company inbox with every field (lead's screenshot, 2026-10-03 11:03); an empty preferred date prints as a bare label.
- Real Upstash with the IP + email limiter settings and throwaway keys -- `rate-limit-proof.txt`: calls 1-5 allowed, call 6 blocked, another key allowed. The IP-only limit (20 per hour) is proven by unit tests only.
- Matrix test audit: every frozen matrix row has a covering test among the 464 that ran.
- After merge of #17, on https://xiontech-dev.vercel.app/demo (lead, 2026-10-03): a real request arrived in the inbox, and repeated sends with one email ended in the rate-limit message with the values kept. A first try right after the merge did nothing because the open tab still ran the Story 2.2 page; a reload fixed it.

**Artifacts**

- spec-2-3-submission-delivery-evidence/verification.txt -- 4068 bytes -- sha256 07e2ce4dcfb3 -- every Verification command after the step-4 patches
- spec-2-3-submission-delivery-evidence/walk-output.txt -- 3642 bytes -- sha256 3d15b136202e -- UX walk L1-L7 at 1280px and 390px, L8 panel fit
- spec-2-3-submission-delivery-evidence/task5-red.txt -- 6417 bytes -- sha256 62911e94b47a -- task 5 RED re-run, verbose: 43 failed, 2 passed (named)
- spec-2-3-submission-delivery-evidence/real-send.txt -- 171 bytes -- sha256 b76f993e331c -- one real request answered 200 (before the step-4 patches)
- spec-2-3-submission-delivery-evidence/rate-limit-proof.txt -- 500 bytes -- sha256 078c517aacae -- real Upstash, IP + email limit: sixth call blocked
- spec-2-3-submission-delivery-evidence/walk.mjs -- 7660 bytes -- sha256 534cbd9adfcd -- the walk script
- spec-2-3-submission-delivery-evidence/sending-1280.png -- 393007 bytes -- sha256 f1f3e36c95cc -- Sending... at 1280px
- spec-2-3-submission-delivery-evidence/sending-390.png -- 86593 bytes -- sha256 01ced4262ce2 -- Sending... at 390px
- spec-2-3-submission-delivery-evidence/success-1280.png -- 368205 bytes -- sha256 231399a44837 -- thank-you panel at 1280px
- spec-2-3-submission-delivery-evidence/success-390.png -- 189769 bytes -- sha256 d2c2b92eecc1 -- thank-you panel at 390px
- spec-2-3-submission-delivery-evidence/failure-1280.png -- 469844 bytes -- sha256 21da45495d4b -- send-failure message at 1280px, values kept
- spec-2-3-submission-delivery-evidence/failure-390.png -- 274434 bytes -- sha256 ba498a07e1e8 -- send-failure message at 390px, values kept

**Not captured**

- After the first release (lead's step 6): a real send on production.
- A screen-reader pass (NVDA/VoiceOver) and touch input.
