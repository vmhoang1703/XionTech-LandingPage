---
title: 'Story 6.6: Job page and application with CV upload'
type: 'feature'
created: '2026-10-04'
status: 'done'
baseline_commit: '5973d9b340c9392ad401f4f200f9b45a9ac4147e'
route: 'dispatch'
review_loop_iteration: 0
context: ['{project-root}/AGENTS.md']
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Role cards on `/careers` link to `/careers/<slug>`, which is the Not found page today. Nam (Flow 4) cannot read a role or apply. Contract: `_bmad-output/specs/andy/spec-6-6-job-page-cv-upload/SPEC.md` (CAP-1…CAP-6), decisions T1, T2, T3, T4, A4, A8, D1, D3.

**Approach:** A Server Component page `src/app/careers/[slug]/page.tsx` that ports `job.html` (amber hero with chips, role details, "Apply for this role" form card) from this story's own GROQ query through `sanityFetch` (tag `job`); unknown or closed slug → `notFound()`. A client form validates with rules shared with the server, uploads the CV straight from the browser to a private Vercel Blob store (`@vercel/blob` client upload, token from `POST /api/careers/cv-upload`), then posts the application as JSON to `POST /api/careers/apply`, which repeats every check, applies the Story 2.3 honeypot and rate limits, and sends one mail with the Story 2.3 Gmail sender to `CONTACT_INBOX`.

## Boundaries & Constraints

**Always:**
- Reuse, never copy: `isValidEmail`, `EMAIL_MAX_LENGTH`, `TEXT_MAX_LENGTH`, `MESSAGE_MAX_LENGTH`, `LENGTH_ERROR` (`contact-rules.ts`); `getDeliveryConfig`, `checkRateLimits`, the Gmail transport (`delivery.ts`); `postSubmission` (`post-submission.ts`, made endpoint- and field-aware with defaults so contact and capture callers do not change); the 2.2 field, error, announce, focus and `form-ok` patterns.
- Error wording exactly as SPEC CAP-2; success, consent and "Sending..." exactly as CAP-3 and CAP-5.
- CV: `.pdf`, `.doc`, `.docx`, MIME `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`, 1 byte to 5 × 1024 × 1024 bytes. Checked on choose, on submit, by the Blob signed upload token (`allowedContentTypes`, `maximumSizeInBytes`) and again by the apply route on the stored blob (`get` metadata).
- The blob path is `cv/application.<ext>` with a random suffix: no file name, name or email in any path or URL. Store access `private`. Nothing goes to Sanity.
- Blob auth is OIDC (controller note 2026-10-04): `BLOB_STORE_ID` and `BLOB_WEBHOOK_PUBLIC_KEY` are server-only, read and checked per request like the five mail variables (`docs/contact-delivery.md` explains why not at build), never logged. The OIDC token comes from the `x-vercel-oidc-token` request header on Vercel and from `VERCEL_OIDC_TOKEN` (written by `vercel link` / `vercel env pull`) locally, so it is not checked as an env var; a missing token fails the Blob call (502). There is no `BLOB_READ_WRITE_TOKEN`. Log lines name step and error class only.
- Applications share the contact rate limits (prefix `contact`, about 5 per 10 minutes per IP and email; `contact-ip`, about 20 per hour per IP). Token requests get their own IP limit (about 5 per hour, A10).
- When the apply route does not send the mail after its rate limits passed, it deletes the uploaded CV (before them it deletes nothing; A10 narrowed after the full review); a delete failure is logged (error class only) and never changes the answer; a sent application keeps its CV (A10, lead 2026-10-04).
- Page is a Server Component; only the form is `"use client"`. No capture band. No `/en` `/vi`. Strings in one place for later translation. Brand "XionTech".

**Never:** applicant data or CVs in Sanity, a public blob, a server action, a CV passing through a function body, `force-dynamic`, a second mail sender, Open Graph or per-role SEO metadata (Story 7.1), a shared breadcrumb component (1.6), Vietnamese copy (1.2), editing Amber's planning docs, a redesign.

**Decisions (2026-10-04, recorded as A10 in `decisions-2026-10-01.md`):**
- Q1-A (lead): the apply route reads the CV from the private store (`get`, `access: "private"`) and attaches it to the application mail; the apply route's `maxDuration` is 30 s.
- Q2-A (lead): `studio/schemas/job.ts` gains `responsibilities` and `requirements` (EN/VI lists of short strings), with schema tests; the job `preview` stays. "About the role" shows the plain text of `description.en`. Post-merge lead step: switch to `develop` and pull, `cd studio && npx sanity deploy`, fill both lists on the sample role (`docs/sanity.md`).
- Q3-A (controller): `npm install @vercel/blob@2.8.0` (exact pin) in this worktree; only this branch's `package.json` and `package-lock.json` change; the shared `node_modules` (junction to the main checkout) gains the package. Run `npm audit --omit=dev` and record the result.
- Q4 (controller): no change in this story; `/privacy` already marks the deletion request as `[Placeholder]` (owner Amber, A4).
- Spec size: keep the full spec (lead).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| Open role | published `job`, `closed != true`, slug matches | page renders, 200 | N/A |
| Unknown / closed slug | no match, or `closed: true` | Not found page, 404 | N/A |
| Wrong CV chosen | `.png`, or 6 MB `.pdf`, or 0 bytes | CV error at once, `aria-invalid` | form not sent |
| Upload fails | Blob or token route error, or 60 s timeout | send error above the button, every value and the file kept | retry re-uploads |
| Apply after upload fails | apply route 400 / 429 / 502 / network | same as above; the retry uploads the CV again. The route deleted the CV only for a closed role, a wrong stored CV or a 502 after the rate limits; a 429, field errors or missing config delete nothing (A10, narrowed after the full review) | N/A |
| Honeypot filled | `website` not empty | 200 `{ ok: true }`, no mail, no rate-limit call | N/A |
| Bad body | not an object, missing `slug`/`cv` strings, phone > 200, CV path not `cv/<name>` ending `.pdf`, `.doc` or `.docx` | 400 `{ error: "send" }` | N/A |
| Config missing | a mail variable, `BLOB_STORE_ID` or `BLOB_WEBHOOK_PUBLIC_KEY` unset | 500 `{ error: "send" }`, one log line naming the variable | N/A |
| Field errors | empty name, bad email, note > 2,000 | 400 `{ errors }` in client wording | N/A |
| Role gone | slug no longer open at send | 400 `{ error: "send" }` | N/A |
| Stored CV wrong | blob missing, size > 5 MiB, MIME not allowed or not matching the extension | 400 `{ errors: { cv } }` | N/A |
| Rate limited | 6th send in 10 min, same IP and email | 429 `{ error: "rate" }`, rate message | N/A |
| Upload limit used up | 6th CV token in 1 h, same IP | token route 200 `{ error: "rate", presignedUrlPayload: null }`; the SDK throws "Missing presignedUrlPayload"; rate message, values kept (A10, after the full review) | N/A |
| Mail fails | SMTP error / timeout, or the CV cannot be read for the attachment | 502 `{ error: "send" }` | log class and code only |

</frozen-after-approval>

## Code Map

- `src/lib/contact/contact-rules.ts` -- shared rules and limits; import, do not change.
- `src/lib/contact/delivery.ts` -- `getDeliveryConfig()` (5 vars, per request), `checkRateLimits(ip, email)`, private `askLimit(prefix, tokens, window, key)`, `ipRateLimitKey`, `sendContactMail(config, submission)` with `mailText`/`mailSubject` over `ValidSubmission`. Extend: application mail text and subject ("Job application: <role title>", CR/LF removed), the CV as an attachment (Q1-A), `checkUploadLimit(ip)` (prefix `cv-upload`, about 5 per hour per IP (A10), fails open like the others).
- `src/lib/contact/submission.ts` -- `ValidSubmission` union; add the application member type only if the mail code needs it.
- `src/app/api/contact/route.ts` -- order of steps, status bodies, `readBody`, `readConfig`, `logSendFailed`, `ipAddress` from `@vercel/functions`; copy the order, move shared helpers into a lib module if a second route needs them (Sonar duplication).
- `src/components/contact/post-submission.ts` -- `postSubmission(payload)` with fixed endpoint and `FIELD_ORDER`; add optional endpoint and fields.
- `src/components/contact/contact-form.tsx` -- the 2.2 pattern: `invalidProps`, `fieldClass`, `fieldError`, live announce region keyed by count, focus first invalid, `form-ok` panel focused on success, `form-alert` focused button on failure, honeypot `website` input.
- `src/lib/sanity/client.ts` -- `sanityFetch({ query, params, tags: ["job"] })`; reuse, do not change.
- `src/lib/careers/open-roles.ts` -- `OpenRole`, `TYPE_LABELS` Map, `roleMeta`; add `getOpenRole(slug)` (same open filter plus `slug.current == $slug`, `[0]`) and a type-label export for the chips.
- `studio/schemas/job.ts`, `localized.ts`, `schemas.test.ts` -- Q2-A adds two list fields (needs a `localized` list kind); test keeps "no CV field".
- `src/app/careers/page.tsx`, `src/components/careers/careers-hero.tsx`, `src/content/careers.ts` -- page/hero/content pattern (`hero-amber page-hero`, `HeroArt tone="amber"`, `crumbs`).
- `src/app/not-found.tsx` -- Story 1.7 page; `notFound()` from `next/navigation` renders it with 404 when no `loading.tsx` streams first.
- `src/app/globals.css` -- has `.chips`, `.chip`, `.form-card`, `.fgrid2`, `.field`, `.err`, `.help`, `.form-ok`, `.form-alert`, `.consent`, `.list-check`, `.link-arrow`, `.split`; missing `.job-body` rules and file-field rules (mockup `css/site.css` 578–582).
- Mockup `mockups/site-v3/job.html` and `js/site.js` 287–305 (prototype CV check).
- `e2e/smoke.spec.ts`, `e2e/careers.spec.ts` -- `@smoke` patterns (honeypot needs no secrets).
- `.env.example`, `docs/contact-delivery.md` -- add the Blob variable, the routes, the steps and the free limits.
- Next.js 16: `params` is a Promise; type with `PageProps<'/careers/[slug]'>` (run `npx next typegen` if missing).

## Tasks & Acceptance

**Execution:**
- [x] `package.json`, `package-lock.json` -- add `@vercel/blob@2.8.0` (pinned, as the other runtime deps) -- T1 (Q3-A).
- [x] `studio/schemas/localized.ts`, `job.ts`, `schemas.test.ts` -- `responsibilities`, `requirements` EN/VI string lists -- CAP-1 (Q2-A).
  - red: `schemas.test.ts` -- job has both list fields with EN/VI string arrays.
- [x] `src/lib/careers/open-roles.ts` + test -- `getOpenRole(slug)` returning `{ slug, title, team, location, type, about, responsibilities, requirements }` or `null` -- CAP-1, CAP-6.
  - red: `open-roles.test.ts` -- query has the open filter, `$slug` param, `pt::text(description.en)`, tag `job`; `[]`/null gives null.
- [x] `src/lib/careers/application-rules.ts` + test -- `JOB_ERRORS`, `CV_MAX_BYTES`, `CV_TYPES` (ext → MIME), `cvError({ name, size })`, `storedCvError({ pathname, size, contentType })`, `validateApplication(values)` -- CAP-2, CAP-4.
  - red: `application-rules.test.ts` -- matrix rows for fields and CV (ext case-insensitive, 0 bytes, exactly 5 MiB passes, +1 byte fails, MIME mismatch).
- [x] `src/lib/careers/application.ts` + test -- `parseApplication(body)` → ok / errors / bad / honeypot, like `parseSubmission` -- CAP-4.
  - red: `application.test.ts` -- bad-body, honeypot-first, long phone, bad CV path, field errors.
- [x] `src/lib/contact/delivery.ts` + test -- application mail (subject, body lines, Reply-To applicant, CV attachment, Q1-A), `checkUploadLimit` -- CAP-4, T4.
  - red: `delivery.test.ts` -- application subject strips CR/LF; body names role, page path, CV path; upload limit uses prefix `cv-upload` and fails open.
- [x] `src/app/api/careers/cv-upload/route.ts` + test -- only `blob.generate-client-token`; config → 500; upload limit → 200 with no presigned URL (after the full review; was 429); pathname must be `cv/application.<ext>`; token: `allowedContentTypes`, `maximumSizeInBytes`, `addRandomSuffix: true`, `validUntil` 10 min -- CAP-4.
  - red: `route.test.ts` -- other event type 400; wrong path 400; token options asserted on a mocked `handleUploadPresigned` / `issueSignedToken`.
- [x] `src/app/api/careers/apply/route.ts` + test -- matrix steps in order: bad, honeypot, config, field errors, rate, role (`getOpenRole`) (rate before role after the full review), CV (`get` metadata), send -- CAP-4.
  - red: `route.test.ts` -- one test per matrix row, Blob and Gmail mocked.
- [x] `src/components/contact/post-submission.ts` + test -- optional endpoint and field list -- reuse.
  - red: `post-submission.test.ts` -- a given endpoint is called and its field errors are read.
- [x] `src/content/job.ts` -- page and form strings, metadata -- CAP-1…CAP-5.
- [x] `src/components/careers/job-application-form.tsx` + test -- client form, CV check on change, upload then apply, states, file reuse on retry, 60 s upload timeout -- CAP-2, CAP-3, CAP-5.
  - red: `job-application-form.test.tsx` -- wrong CV flagged on change; submit errors focus first and announce; sending state; success panel; failure keeps values and file.
- [x] `src/components/careers/job-details.tsx`, `job-hero.tsx` + tests -- hero with crumbs and chips; details with hidden empty sections and "All open roles" → `/careers#roles` -- CAP-1.
- [x] `src/app/careers/[slug]/page.tsx` + test -- await params, `getOpenRole`, `notFound()` when null, sections, no capture band -- CAP-1, CAP-6.
  - red: `page.test.tsx` -- null role calls `notFound`; open role renders H1, crumbs, form.
- [x] `src/app/globals.css` -- port `.job-body` and file-field rules.
- [x] `e2e/job.spec.ts` -- `@smoke`: `/careers/no-such-role` is 404; honeypot POST to `/api/careers/apply` is 200.
- [x] `.env.example`, `docs/contact-delivery.md` -- `BLOB_STORE_ID`, `BLOB_WEBHOOK_PUBLIC_KEY`, `VERCEL_OIDC_TOKEN` (local), routes, lead steps, Blob free limits.

**Acceptance Criteria:**
- Given `/careers/placeholder-sample-job`, when it loads, then the amber hero shows crumbs Home / Careers / title, the H1 title and chips, the details sit left of the form card above 900px and above it at 900px and below, and there is no capture band.
- Given the controller runs `npm run build && npm run test:smoke` in the main checkout, then `/careers/no-such-role` returns 404 and the honeypot POST returns 200.

## UX checks

Sources: `EXPERIENCE.md` (Job page, Job application fields, State Patterns › Job application, Responsive 900px, Flow 4, capture band rule), `DESIGN.md` (File field, Contact form card, Button, Focus ring, section surfaces line 444), SPEC CAP IDs, decisions T1, T9.

| Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| --- | --- | --- | --- | --- | --- | --- |
| Hero | page load | — | amber hero, crumbs Home / Careers / job title (current not a link), H1 job title, chips team, location, work type | ribbon 5s, then still | CAP-1, DESIGN.md 444 | partly: Chrome 1280 (prod build): crumbs Home / Careers / title (current not a link), H1, chip (`walk-output.txt`); amber gradient seen in `job-1280.png`; ribbon timing not checked |
| Hero chips | a part is empty | — | that chip is not shown | — | CAP-1, I/O "Missing meta part" (6.5) | ✅ Chrome: the sample role has only a team, so only the Engineering chip shows |
| Details | page load | — | paper surface; "About the role" paragraphs; "What you'll do" and "What you bring" check lists | — | CAP-1 | partly: paper surface ✅; the sample role has no description or lists yet, so the paragraphs and lists are shown by unit tests only (`job.test.tsx`); walk again after the lead fills them |
| Details | a list is empty | — | its heading is not shown | — | CAP-1, content rule (no invented content) | ✅ Chrome: no list headings for the empty sample role |
| "All open roles" | click / Enter | mouse, keyboard | arrow-left link goes to `/careers#roles` | — | CAP-1 | partly: Chrome: href `/careers#roles`, click lands `/careers#roles`, focus ring 2px; Enter not pressed |
| Layout | width above 900px / 900px or less | — | form card beside details / below details | — | CAP-1, EXPERIENCE.md Responsive | fail: at exactly 900px the form is still beside the details (shared `.split` switches below 900px; deferred in `deferred-work.md`). Beside at 1280, below at 899, 640 and 390; no sideways scroll at 390 after the file-input fix |
| Form card | page load | — | paper card, 28px radius, H2 "Apply for this role", fields Full name, Email, Phone (optional), CV with help "PDF or Word, up to 5 MB.", Cover note (optional), "Send application" | — | CAP-2, DESIGN.md Contact form | ✅ Chrome: 28px radius, H2, five labels, help text, "Send application" |
| Phone | focus | touch | telephone keypad | — | CAP-2 | ✅ Chrome: `type="tel"` (keypad on touch devices; no real phone used) |
| CV field | choose `.png` or a 6 MB PDF | mouse, touch, keyboard | error "Please upload your CV as a PDF or Word file, up to 5 MB." and red border at once; announced | on change | CAP-2, DESIGN.md File field | ✅ Chrome: error text, red border rgb(179, 38, 30), `aria-invalid`, announced in the live region |
| CV field | choose a valid PDF after an error | mouse, touch | error and red border gone | on change | CAP-2 | ✅ Chrome: error and red border gone |
| Submit | empty name, bad email, no CV, note over 2,000 | mouse, keyboard | each field's error text, `aria-invalid`, `aria-describedby`; errors announced; focus on the first invalid field | — | CAP-2, AC-A11Y-5 | ✅ Chrome: four errors, `aria-invalid` and `aria-describedby` on each, focus on Full name |
| Submit | sending | mouse, keyboard | button disabled, reads "Sending..." | until done | CAP-3 | ✅ Chrome: disabled, "Sending..." |
| Submit | success | — | form replaced by "Thank you!" and "We've received your application and will be in touch if it's a match." in a `role="status"` panel with focus | — | CAP-3 | unit test (`job-application-form.test.tsx`); real send after merge on the dev site (lead) |
| Submit | upload or send fails | — | error with retry above the button; every value and the chosen CV kept | — | CAP-3 | ✅ Chrome: upload failure (token route 500) shows the send error above the button, focus on the submit button (as in Story 2.2); values and the CV kept; apply-route 502 by unit test |
| Submit | rate limited | — | rate message above the button; values kept | — | CAP-4 | ✅ Chrome: upload limit used up (token route 200, no presigned URL, real Blob SDK) shows the rate message, values kept; apply-route 429 by unit test |
| Consent | page load | — | "We only use your details and CV to consider your application." then "Privacy policy" → `/privacy` | — | CAP-5 | ✅ Chrome: exact text, link `/privacy` |
| Fields, buttons, links | Tab | keyboard | 2px focus ring | — | T9 | partly: Chrome: solid 2px ring on a field and a link; the button ring not measured |
| Button | hover / press | mouse, touch | lift 2px / 1px down, scale 0.98 | 0.35s | DESIGN.md Button | ✅ Chrome: hover translateY(-2px), press translateY(1px) scale(0.98), 0.35s |
| Unknown or closed slug | open the URL | — | Story 1.7 Not found page, HTTP 404 | — | CAP-6 | ✅ Chrome and smoke: `/careers/no-such-role` 404 with the Not found page; closed role by unit test |
| Page | scroll to the end | — | no email capture band before the footer | — | CAP-1, EXPERIENCE.md capture rule | ✅ Chrome: no capture band |
| Page | reduced motion | — | no lift transition; ribbon still | — | EXPERIENCE.md Motion | partly: Chrome: button transition 0s; the ribbon not checked |

## Implementation Notes

- 2026-10-04: this worktree's `node_modules` is a junction to the main checkout's. Turbopack rejects it, so never run `npm run build`, `npm run dev` or `npm run test:smoke` here (pending, controller). Later the same day the worktree got its own `node_modules`, and build, smoke and the walk ran here. Never run `npm install`, `npm ci` or `npm uninstall` (Task 1 already added `@vercel/blob`; an install here once pruned `vite` from the shared `node_modules`). Run tests with `npx vitest run <file>`. Run `npx next typegen` if `PageProps` types are missing. Commit with Conventional Commits and the trailers `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` and `Claude-Session: https://claude.ai/code/session_0169ynHXpgbJUKDWC3nosnjr`. No push.
- 2026-10-04: task reviews are skipped by the controller's rule for this run (one review layer inside the build); the ledger records each skip.
- 2026-10-04, controller note (env facts): the lead's private Blob store gives `BLOB_STORE_ID` and `BLOB_WEBHOOK_PUBLIC_KEY`, not `BLOB_READ_WRITE_TOKEN`. In `@vercel/blob@2.8.0`, `handleUpload` needs a read-write token (`generateClientTokenFromReadWriteToken`), so the token route uses `handleUploadPresigned` with `issueSignedToken` (OIDC + store id, `operations: ["put"]`, pathname-scoped, `allowedContentTypes`, `maximumSizeInBytes`, `validUntil`) and `urlOptions` (`addRandomSuffix: true`, same limits); its body event is `blob.generate-presigned-url`. The browser uses `uploadPresigned` from `@vercel/blob/client`. The apply route reads the CV with `get(pathname, { access: "private", storeId, useCache: false })` and passes no `token`. Tasks 7 and 8 are reworked in fix rounds; Task 16 documents `BLOB_STORE_ID`, `BLOB_WEBHOOK_PUBLIC_KEY` and `VERCEL_OIDC_TOKEN` (local only).
- 2026-10-04, Task 4: `validateApplication({ name, email, note })` checks the text fields only. A phone over 200 characters (input `maxLength`, no error slot) is a bad body in `parseApplication`; the CV is checked with `cvError` (browser, extension and size) and `storedCvError` (server, on the stored blob).

## Spec Change Log

- 2026-10-04 (lead decision, A10 part 4, after the review): the apply route deletes the uploaded CV when it does not send the mail, the form uploads on every submit, and the token limit is about 5 per IP per hour. Amended: frozen matrix row "Apply after upload fails", the frozen rate-limit line plus a delete line, Code Map limit, Design Notes retry line, triage row 2. Avoids: orphan CVs from failed or abandoned applications filling the 1 GB store. KEEP: a sent application keeps its CV (A4); delete failures never change the answer.
- 2026-10-04 (lead decision in chat, after the full review's security finding): the apply route checks its rate limits before the role lookup and deletes an unsent CV only after they passed, so deletes and Sanity reads are rate-limited like sends (the limits fail open when Upstash is down, deferred); the token route answers a used-up upload limit with 200 and no presigned URL, so the form can show the rate message. Amended: the delete rows above, and "Config missing" now logs one line again.

- 2026-10-04 (controller note, env facts; no change to the lead's decisions): Blob auth changed from `BLOB_READ_WRITE_TOKEN` + `handleUpload` to OIDC + `BLOB_STORE_ID` + `BLOB_WEBHOOK_PUBLIC_KEY` with `handleUploadPresigned`, because the lead's store has no read-write token. Amended: frozen Always line on Blob auth, frozen matrix row "Config missing", the CV check line (`get` metadata instead of `head`), tasks 7, 8 and 16 wording, Design Notes. Avoids: routes that fail with "Invalid `BLOB_READ_WRITE_TOKEN`" on every upload. KEEP: private store, path `cv/application.<ext>` + random suffix, two requests per application, every server check.

## Review Triage Log

Step 4 on 2026-10-04: one layer (Edge Case Hunter, opus), by the controller's rule for this run (one review layer inside the build; the full 5-layer `bmad-code-review` runs before the PR). Blind Hunter, Verification Gap, Acceptance Auditor and Security Auditor were not run. Task reviews were skipped for the same reason; the ledger's `minor` rows are triaged here too.

| # | Finding (source) | Verdict | Route | Evidence |
|---|---|---|---|---|
| 1 | Apply POST times out at 15 s in the browser while the route may run 30 s; the server still mails and a retry duplicates it (Edge) | medium | patch | `postSubmission` aborts at `SEND_TIMEOUT_MS` (15 s); the apply route does a Sanity lookup, two Upstash calls, a 5 MB Blob read and an SMTP send with the attachment, `maxDuration = 30`. Fix: optional `timeoutMs`, 35 s from the job form. |
| 2 | Uploaded CVs that never reach a successful apply stay in the store; a script can fill the 1 GB Hobby store (about 50 MB per IP per hour at the 10/h token limit) and lock it for 30 days (Edge) | medium | fixed (lead's choice, A10) | Real: nothing deletes `cv/` blobs (A4 keeps applications with no time limit), and the token route is public by design (T1). A fix needs a design choice the spec does not settle (cleanup job, lower token limit, delete on a failed apply). Lead chose option 1 on 2026-10-04: the apply route deletes the CV of every application it does not send (`8de0f23`), the form uploads on every submit (`06718f5`), and the token limit is about 5 per IP per hour (`75a7b3a`). A script that never calls apply can still upload about 25 MB per IP per hour; a cleanup job after Demo day is in `deferred-work.md`. |
| 3 | A 429 from the token route shows the send error, not the rate message (Edge) | low | reject | `uploadPresigned` throws one generic `BlobError("Failed to retrieve the presigned URL")` for any non-2xx, so telling 429 apart needs a pre-check request; 10 token requests an hour per IP is rarely reached by a real applicant. |
| 4 | Token route does not check `KV_REST_API_URL` / `KV_REST_API_TOKEN`; when unset the upload limit fails open (Edge) | low | reject | Only on a misconfigured deployment; the apply route then answers 500 for every application (its `getDeliveryConfig` requires both), so the gap is noticed at once. Matches the contact route's fail-open design. |
| 5 | A role closed in Sanity may still be accepted once from the stale tagged cache (Edge) | low | reject | The webhook revalidates the `job` tag; at worst one application for a just-closed role reaches the lead's inbox. A second, uncached fetch path would break T2's one helper. |
| 6 | Duplicate React keys when an editor repeats a list line, a paragraph, or team equals location (Edge; also Task 12 minor) | low | reject | Server Components render these lists once, so items are never reordered or dropped; the cost is a dev-only warning. Index keys would trip the lint rule against array-index keys. |
| 7 | The 60 s abort does not cover the token request: `@vercel/blob@2.8.0` `retrievePresignedUrlPayload` ignores `abortSignal` (Edge, claim) | low | reject | Confirmed in `node_modules/@vercel/blob/dist/client.js` (the fetch's `signal` is `options.abortSignal`, but `getPresignedUrlPayload` never passes it). The token route is ended by the platform's function timeout, which rejects the fetch, so the form still reaches the send error. A `Promise.race` wrapper adds complexity for a rare case. |
| 8 | At exactly 900px `.split` is still two columns, but the AC says the form is below at 900px and below (Edge, claim) | low | defer | Pre-existing: the shared `.split` from Story 6.5 switches at 900px (already deferred there, `deferred-work.md`). Not changed by this story. |
| 9 | `getOpenRole` guards `Array.isArray` for a `[0]` query (Task 3 minor) | low | reject | Defensive branch; harmless and covered by a test. |
| 10 | Type-label export for the chips missing after Task 3 (Task 3 minor) | false | reject | Added in Task 12 (`roleTypeLabel`, `1aa3d02`). |
| 11 | `slug` has no length cap in `parseApplication` (Task 5 minor) | low | reject | Only used as a GROQ parameter and, after `getOpenRole` finds an open role, in the mail; an unknown slug answers 400. |
| 12 | `readBody` duplicated in the token route (Task 7 minor) | false | reject | Moved to `src/lib/http/route-helpers.ts` in Task 8 (`f16a877`); all three routes import it. |
| 13 | `statusCode !== 200` branch in `readStoredCv` cannot happen without `ifNoneMatch` (Task 8 minor) | low | reject | Defensive; covered by a test. |

Follow-up review on 2026-10-04 of the A10 part 4 change (`4a13c32..f5e5b89`, 224 changed lines in `src/`): one layer (Edge Case Hunter, opus). The full 5-layer `bmad-code-review` before the PR is the controller's.

| # | Finding (source) | Verdict | Route | Evidence |
|---|---|---|---|---|
| F1 | `del` is awaited and the SDK retries with backoff (up to 10 tries), so a slow Blob API can push the route past `maxDuration` and the answer becomes a 504 (Edge, also as a claim) | medium | patch | Confirmed in `requestApi` (`async-retry`, network errors and 5xx retried); an `AbortError` bails. Fixed with `abortSignal: AbortSignal.timeout(3000)` (`466d603`). |
| F2 | The removed log-count assertion for a missing Blob variable (Edge, deletion) | low | patch | Direct test fix: 2 lines for `BLOB_STORE_ID` (config + skipped delete), 1 for `BLOB_WEBHOOK_PUBLIC_KEY`. |
| F3 | A function killed at `maxDuration`, or an apply POST that never arrives, leaves the CV (Edge, also as a claim) | low | reject | Rare; the cleanup job after Demo day in `deferred-work.md` covers every orphan. |
| F4 | A replayed POST with the same CV path after a sent application deletes that CV (Edge) | low | reject | The path has a random suffix known only to the applicant's browser, the button is disabled while sending, and the mailed copy is the record (D3). |
| F5 | A 429 from the token route shows the send error, not the rate message; more likely now at 5 per hour with an upload per submit (Edge) | low | reject | Same as row 3: `uploadPresigned` gives one generic error for any non-2xx. A real applicant needs 6 submits in an hour; the client checks stop most failed submits before the upload. Noted for the lead. |
| F6 | `isCvPath` is case-insensitive, so `CV/x.PDF` passes and gets a pointless delete (Edge) | low | reject | Such a path was never issued, so `get` answers 400 cv and `del` deletes nothing; no harm. |

## Design Notes

- Two requests per application: the browser uploads the CV with a short-lived token (Vercel Function body limit 4.5 MB never applies), then sends a small JSON body with the blob path. The apply route trusts nothing from the upload: it re-reads the stored blob's size and type from `get` before attaching it.
- Retry: the form uploads the CV on every submit, because the apply route may have deleted the CV of an application it did not send (A10). An upload that fails leaves no blob.
- Vercel Blob Hobby (`docs/spikes/cms-spike.md`): 1 GB storage (about 200 CVs at 5 MB, kept with no time limit, A4), 10k simple and 2k advanced operations and 10 GB transfer per month; at the limit the store is locked for 30 days. Name it in the PR. Re-read the pricing page before Demo day.
- Page metadata: one static title and description from `src/content/job.ts` (per-role metadata is Story 7.1).

## Verification

**Commands:**
- `npm run lint && npm run typecheck && npm run format:check` -- expected: no errors
- `npm test` -- expected: all pass
- `npm run test:coverage && npm run coverage:diff` -- expected: 100% changed lines, branches ≥ 80% on changed files
- `npm run build && npm run test:smoke` -- passed 2026-10-04 in this worktree after it got its own `node_modules` (smoke 10 passed, incl. the 404 and the apply honeypot; `smoke-output.txt`).

**Manual checks:**
- Browser walk of `/careers/placeholder-sample-job` at 1280, 900, 899, 640 and 390px plus reduced motion -- done 2026-10-04 on the production build (`walk.mjs`, `walk-output.txt`, `job-1280.png`, `job-form-*.png`). A real upload and mail -- after merge on the dev site (lead).

## Acceptance Evidence

Captured at the end of step-03 on 2026-10-04 re-captured after the review patch, and again after the A10 follow-up (the first full `npm test` of that run timed out once in `scripts/eslint-config.test.mjs` under load; the second run passed).

**Commands**

- `npm run lint && npm run typecheck && npm run format:check` -- exit 0 -- "All matched files use Prettier code style!"
- `npm test` -- exit 0 -- "Test Files 57 passed (57)", "Tests 947 passed (947)"
- `npm run test:coverage && npm run coverage:diff` -- exit 0 -- "Coverage: 100%" (279 lines, 0 missing), "C1 ok: 19 changed file(s) with branch coverage >= 80% vs origin/develop."

**Observed**

- Page, form and both routes in jsdom/node tests: every I/O matrix row has a passing test (apply route `it.each` bad bodies, config per variable, stored CV wrong, rate, mail; form wrong CV, upload and apply failure; page `notFound`) -- `src/app/api/careers/*/route.test.ts`, `src/components/careers/job-application-form.test.tsx`, `src/app/careers/[slug]/page.test.tsx`

**Artifacts**

- spec-6-6-job-page-cv-upload-evidence/verification.txt -- 4288 bytes -- sha256 85d0b0fdd86e -- transcript of the three command runs (before the full reviews)
- spec-6-6-job-page-cv-upload-evidence/verification-after-review.txt -- 877 bytes -- sha256 eb1a9d5730d2 -- lint, typecheck, format, 1008 tests, diff coverage 100% on the code after the full reviews (363c4df); smoke in `smoke-output.txt`
- spec-6-6-job-page-cv-upload-evidence/observed.md -- 1331 bytes -- sha256 c3994b890b4d -- surface not reached; what the tests observed instead

**Not captured**

- `npm run build && npm run test:smoke` -- passed 2026-10-04 in this worktree (smoke 10 passed).
- Browser walk of every UX checks row -- done 2026-10-04 (see the UX checks table). A real upload to the private store and a real mail -- after merge on the dev site (lead).
