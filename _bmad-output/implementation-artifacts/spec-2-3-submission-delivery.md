---
title: 'Story 2.3: Submission delivery and spam protection'
type: 'feature'
created: '2026-10-02'
status: 'in-progress'
baseline_commit: '07a04398619879014153e488afb11dc07fe1a9c9'
route: 'dispatch'
review_loop_iteration: 0
context: ['{project-root}/AGENTS.md']
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The `/demo` form (Story 2.2) validates in the browser but sends nothing. On Demo day 2026-10-09 every demo and project request must reach the contact inbox, a visitor must see that it is sending and that it arrived, a failure must never lose what they typed, and bots must not flood the inbox. Contract: `_bmad-output/specs/andy/spec-2-3-submission-delivery/SPEC.md` (CAP-1…CAP-6).

**Approach:** A `POST /api/contact` route handler runs, in order, the honeypot, the shared rules from `contact-rules.ts`, a rate limit in Upstash Redis and a send through Gmail SMTP (nodemailer). The client form posts JSON with `fetch`, shows "Sending...", then the thank-you panel, or keeps every value and shows a retryable error.

## Boundaries & Constraints

**Always:**
- Lead decisions (T4, 2026-10-02): mail sender = Gmail SMTP with an App Password (nodemailer); rate-limit store = Upstash Redis free via the Vercel Marketplace integration (`@upstash/ratelimit`, `Ratelimit.slidingWindow(5, "10 m")`).
- Server-only env, never `NEXT_PUBLIC_*`, never in source: `CONTACT_INBOX` (vinni.tran@newxion.com, set by the lead), `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `KV_REST_API_URL`, `KV_REST_API_TOKEN` (names the Vercel Upstash integration adds). Checked on each request like `src/app/api/revalidate/route.ts`: a missing one → 500 and one log line naming the variable, never a value.
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
- [ ] `package.json` -- add `nodemailer`, `@upstash/ratelimit`, `@upstash/redis`, `@vercel/functions` pinned exactly (and `@types/nodemailer` if nodemailer ships no types) -- sender, store, client IP.
- [ ] `src/lib/contact/contact-rules.ts` -- caps: name, org and role 200 characters, email 254, with error "Please keep this under 200 characters." / "Please enter a valid email address."; a date that is not `YYYY-MM-DD` gets the date error -- deferred-work 2.2 item; client and server share it.
  - red: `src/lib/contact/contact-rules.test.ts` -- a 201-character name, a 255-character email and the date "2026-1-5" are rejected with that wording.
- [ ] `src/lib/contact/submission.ts` -- `parseSubmission(body: unknown, serverToday)` → `{ ok, submission } | { ok: false, errors } | { ok: false, bad: true }`: checks `type`, reads only that tab's fields, honeypot flag, runs `validateContact` with a server "today" one day before the UTC date (a visitor's local today is never rejected in any time zone); select values must be in their option lists -- CAP-3, CAP-4.
  - red: `src/lib/contact/submission.test.ts` -- each bypassed-client row of the matrix, unknown type, non-object body, honeypot, the time-zone edge.
- [ ] `src/lib/contact/delivery.ts` -- `getDeliveryConfig()` (throws naming the missing variable), `rateLimitKey(ip, email)` (SHA-256 hex), `checkRateLimit(key)` (Upstash sliding window 5 / 10 min, prefix `contact`; an Upstash error returns "allowed" and logs "rate limit unavailable"), `sendContactMail(config, submission)` (nodemailer `service: "gmail"`, plain-text body with every field, subject "Product demo request: <org>" / "Outsourcing project request: <org>" with CR/LF removed, Reply-To = visitor email) -- CAP-5, CAP-6.
  - red: `src/lib/contact/delivery.test.ts` -- missing variable named; key has no raw email; mail options carry inbox, subject, Reply-To and fields (nodemailer and Upstash mocked).
- [ ] `src/app/api/contact/route.ts` -- POST: parse (400) → honeypot (200, nothing else) → config (500) → validate (400 `{ errors }`) → rate limit (429) → send (502 on failure) → 200; `maxDuration = 10`; logs name only the step and error class -- matrix.
  - red: `src/app/api/contact/route.test.ts` -- every matrix server row, and that no log line contains the visitor's email.
- [ ] `src/components/contact/contact-strings.ts` + `contact-form.tsx` -- hidden honeypot input `name="website"` (`tabindex="-1"`, `aria-hidden="true"`, `autocomplete="off"`, visually hidden); on valid submit post JSON with a 15 s `AbortController`; button disabled with "Sending..."; 200 → form replaced by `role="status"` panel "Thank you!" / "We will be in touch soon."; 400 `{ errors }` → inline errors + focus as for client errors; 429 / other / timeout → message above the button, values kept, button enabled again; `onValidSubmit` prop removed -- CAP-1, CAP-2, CAP-4.
  - red: `src/components/contact/contact-form.test.tsx` -- sending state, success panel, server errors inline, each failure keeps values and shows its message (fetch mocked).
- [ ] `src/app/globals.css` -- `.form-ok` panel (centred, check-circle icon in navy) and `.form-alert` (error colour on paper, above the button) with tokens -- mockup `css/site.css:349-353`.
- [ ] `e2e/smoke.spec.ts` -- `@smoke` POST `/api/contact` with the honeypot filled returns 200 (needs no secrets).
- [ ] `.env.example` + `docs/contact-delivery.md` -- the five variable names (values blank); lead account steps (Design Notes); free limits: Gmail about 500 recipients per rolling 24 h (third-party sources; Google states no consumer number), Upstash 500K commands/month, 256 MB, 10 GB bandwidth, 1 database; what forces paid.

**Acceptance Criteria:**
- Given the lead's env in Vercel, when a reviewer sends a Product demo request on https://xiontech-dev.vercel.app/demo, then the mail arrives at the contact inbox with every field and Reply-To set to the visitor.
- Given five sends with one email in 10 minutes, when a sixth is sent, then the form shows the rate-limit message, keeps every value, and nothing is sent.
- Given any request, then no URL, query string, hash, log line or Upstash key contains the visitor's name or email.

## UX checks

| Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| ---- | --------------- | ----- | ------------------ | ------ | ------ | ------- |
| Submit | valid submit | mouse, keyboard (Enter), touch | button disabled, reads "Sending...", icon kept | at once, until the answer | EXPERIENCE.md:210, `site.js:239` | |
| Form | 200 | — | form replaced by panel: check-circle icon, "Thank you!", "We will be in touch soon."; screen reader announces it (`role="status"`) | at once | EXPERIENCE.md:112, `demo.html:64` | |
| Form | 400 with field errors | — | same inline errors, red border and live-region announcement as client errors; focus on the first invalid field | at once | SPEC CAP-3 | |
| Form | send failure / timeout | — | message above the button in error colour; every typed value kept; button enabled, reads "Send request" | at once / after 15 s | EXPERIENCE.md:210 | |
| Form | 429 | — | rate-limit message above the button; values kept; button enabled | at once | SPEC CAP-5 | |
| Form | retry after failure | mouse, keyboard | message cleared, "Sending..." again | at once | EXPERIENCE.md:210 | |
| Honeypot | Tab through the form | keyboard | focus never reaches it; not visible; not read by a screen reader | — | SPEC CAP-4 | |
| Panel | 390px and 1280px | — | panel fits the card, no sideways scroll | — | DESIGN (card) | |

## Implementation Notes

## Spec Change Log

## Review Triage Log

## Design Notes

**Account steps (the lead, before merge):**
1. Gmail used as sender (`GMAIL_USER`): turn on 2-Step Verification, then create an App Password (myaccount.google.com → Security → App passwords). It is shown once; put it only in Vercel and `.env.local` as `GMAIL_APP_PASSWORD`.
2. Vercel → project → Storage → Create → Marketplace → Upstash Redis (free) → connect to `xion-tech-landing-page` for Production and Preview. Check the project now has `KV_REST_API_URL` and `KV_REST_API_TOKEN`.
3. Vercel → Environment Variables (Production and Preview, Sensitive): `CONTACT_INBOX` = vinni.tran@newxion.com, `GMAIL_USER`, `GMAIL_APP_PASSWORD`.
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
