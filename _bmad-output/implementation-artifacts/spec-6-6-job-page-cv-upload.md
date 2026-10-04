---
title: 'Story 6.6: Job page and application with CV upload'
type: 'feature'
created: '2026-10-04'
status: 'in-progress'
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
- Applications share the contact rate limits (prefix `contact`, about 5 per 10 minutes per IP and email; `contact-ip`, about 20 per hour per IP). Token requests get their own IP limit.
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
| Apply after upload fails | apply route 502 / network | same as above; retry reuses the uploaded blob for the same file | N/A |
| Honeypot filled | `website` not empty | 200 `{ ok: true }`, no mail, no rate-limit call | N/A |
| Bad body | not an object, missing `slug`/`cv` strings, phone > 200, CV path not `cv/<name>` ending `.pdf`, `.doc` or `.docx` | 400 `{ error: "send" }` | N/A |
| Config missing | a mail variable, `BLOB_STORE_ID` or `BLOB_WEBHOOK_PUBLIC_KEY` unset | 500 `{ error: "send" }`, one log line naming the variable | N/A |
| Field errors | empty name, bad email, note > 2,000 | 400 `{ errors }` in client wording | N/A |
| Role gone | slug no longer open at send | 400 `{ error: "send" }` | N/A |
| Stored CV wrong | blob missing, size > 5 MiB, MIME not allowed or not matching the extension | 400 `{ errors: { cv } }` | N/A |
| Rate limited | 6th send in 10 min, same IP and email | 429 `{ error: "rate" }`, rate message | N/A |
| Mail fails | SMTP error / timeout, or the CV cannot be read for the attachment | 502 `{ error: "send" }` | log class and code only |

</frozen-after-approval>

## Code Map

- `src/lib/contact/contact-rules.ts` -- shared rules and limits; import, do not change.
- `src/lib/contact/delivery.ts` -- `getDeliveryConfig()` (5 vars, per request), `checkRateLimits(ip, email)`, private `askLimit(prefix, tokens, window, key)`, `ipRateLimitKey`, `sendContactMail(config, submission)` with `mailText`/`mailSubject` over `ValidSubmission`. Extend: application mail text and subject ("Job application: <role title>", CR/LF removed), the CV as an attachment (Q1-A), `checkUploadLimit(ip)` (prefix `cv-upload`, about 10 per hour per IP, fails open like the others).
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
- [x] `src/app/api/careers/cv-upload/route.ts` + test -- only `blob.generate-client-token`; config → 500; upload limit → 429; pathname must be `cv/application.<ext>`; token: `allowedContentTypes`, `maximumSizeInBytes`, `addRandomSuffix: true`, `validUntil` 10 min -- CAP-4.
  - red: `route.test.ts` -- other event type 400; wrong path 400; token options asserted on a mocked `handleUploadPresigned` / `issueSignedToken`.
- [x] `src/app/api/careers/apply/route.ts` + test -- matrix steps in order: bad, honeypot, config, field errors, role (`getOpenRole`), rate, CV (`get` metadata), send -- CAP-4.
  - red: `route.test.ts` -- one test per matrix row, Blob and Gmail mocked.
- [ ] `src/components/contact/post-submission.ts` + test -- optional endpoint and field list -- reuse.
  - red: `post-submission.test.ts` -- a given endpoint is called and its field errors are read.
- [ ] `src/content/job.ts` -- page and form strings, metadata -- CAP-1…CAP-5.
- [ ] `src/components/careers/job-application-form.tsx` + test -- client form, CV check on change, upload then apply, states, file reuse on retry, 60 s upload timeout -- CAP-2, CAP-3, CAP-5.
  - red: `job-application-form.test.tsx` -- wrong CV flagged on change; submit errors focus first and announce; sending state; success panel; failure keeps values and file.
- [ ] `src/components/careers/job-details.tsx`, `job-hero.tsx` + tests -- hero with crumbs and chips; details with hidden empty sections and "All open roles" → `/careers#roles` -- CAP-1.
- [ ] `src/app/careers/[slug]/page.tsx` + test -- await params, `getOpenRole`, `notFound()` when null, sections, no capture band -- CAP-1, CAP-6.
  - red: `page.test.tsx` -- null role calls `notFound`; open role renders H1, crumbs, form.
- [ ] `src/app/globals.css` -- port `.job-body` and file-field rules.
- [ ] `e2e/job.spec.ts` -- `@smoke`: `/careers/no-such-role` is 404; honeypot POST to `/api/careers/apply` is 200.
- [ ] `.env.example`, `docs/contact-delivery.md` -- `BLOB_STORE_ID`, `BLOB_WEBHOOK_PUBLIC_KEY`, `VERCEL_OIDC_TOKEN` (local), routes, lead steps, Blob free limits.

**Acceptance Criteria:**
- Given `/careers/placeholder-sample-job`, when it loads, then the amber hero shows crumbs Home / Careers / title, the H1 title and chips, the details sit left of the form card above 900px and above it at 900px and below, and there is no capture band.
- Given the controller runs `npm run build && npm run test:smoke` in the main checkout, then `/careers/no-such-role` returns 404 and the honeypot POST returns 200.

## UX checks

Sources: `EXPERIENCE.md` (Job page, Job application fields, State Patterns › Job application, Responsive 900px, Flow 4, capture band rule), `DESIGN.md` (File field, Contact form card, Button, Focus ring, section surfaces line 444), SPEC CAP IDs, decisions T1, T9.

| Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| --- | --- | --- | --- | --- | --- | --- |
| Hero | page load | — | amber hero, crumbs Home / Careers / job title (current not a link), H1 job title, chips team, location, work type | ribbon 5s, then still | CAP-1, DESIGN.md 444 | |
| Hero chips | a part is empty | — | that chip is not shown | — | CAP-1, I/O "Missing meta part" (6.5) | |
| Details | page load | — | paper surface; "About the role" paragraphs; "What you'll do" and "What you bring" check lists | — | CAP-1 | |
| Details | a list is empty | — | its heading is not shown | — | CAP-1, content rule (no invented content) | |
| "All open roles" | click / Enter | mouse, keyboard | arrow-left link goes to `/careers#roles` | — | CAP-1 | |
| Layout | width above 900px / 900px or less | — | form card beside details / below details | — | CAP-1, EXPERIENCE.md Responsive | |
| Form card | page load | — | paper card, 28px radius, H2 "Apply for this role", fields Full name, Email, Phone (optional), CV with help "PDF or Word, up to 5 MB.", Cover note (optional), "Send application" | — | CAP-2, DESIGN.md Contact form | |
| Phone | focus | touch | telephone keypad | — | CAP-2 | |
| CV field | choose `.png` or a 6 MB PDF | mouse, touch, keyboard | error "Please upload your CV as a PDF or Word file, up to 5 MB." and red border at once; announced | on change | CAP-2, DESIGN.md File field | |
| CV field | choose a valid PDF after an error | mouse, touch | error and red border gone | on change | CAP-2 | |
| Submit | empty name, bad email, no CV, note over 2,000 | mouse, keyboard | each field's error text, `aria-invalid`, `aria-describedby`; errors announced; focus on the first invalid field | — | CAP-2, AC-A11Y-5 | |
| Submit | sending | mouse, keyboard | button disabled, reads "Sending..." | until done | CAP-3 | |
| Submit | success | — | form replaced by "Thank you!" and "We've received your application and will be in touch if it's a match." in a `role="status"` panel with focus | — | CAP-3 | |
| Submit | upload or send fails | — | error with retry above the button; every value and the chosen CV kept | — | CAP-3 | |
| Submit | rate limited | — | rate message above the button; values kept | — | CAP-4 | |
| Consent | page load | — | "We only use your details and CV to consider your application." then "Privacy policy" → `/privacy` | — | CAP-5 | |
| Fields, buttons, links | Tab | keyboard | 2px focus ring | — | T9 | |
| Button | hover / press | mouse, touch | lift 2px / 1px down, scale 0.98 | 0.35s | DESIGN.md Button | |
| Unknown or closed slug | open the URL | — | Story 1.7 Not found page, HTTP 404 | — | CAP-6 | |
| Page | scroll to the end | — | no email capture band before the footer | — | CAP-1, EXPERIENCE.md capture rule | |
| Page | reduced motion | — | no lift transition; ribbon still | — | EXPERIENCE.md Motion | |

## Implementation Notes

- 2026-10-04: this worktree's `node_modules` is a junction to the main checkout's. Turbopack rejects it, so never run `npm run build`, `npm run dev` or `npm run test:smoke` here (pending, controller). Never run `npm install`, `npm ci` or `npm uninstall` (Task 1 already added `@vercel/blob`; an install here once pruned `vite` from the shared `node_modules`). Run tests with `npx vitest run <file>`. Run `npx next typegen` if `PageProps` types are missing. Commit with Conventional Commits and the trailers `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` and `Claude-Session: https://claude.ai/code/session_0169ynHXpgbJUKDWC3nosnjr`. No push.
- 2026-10-04: task reviews are skipped by the controller's rule for this run (one review layer inside the build); the ledger records each skip.
- 2026-10-04, controller note (env facts): the lead's private Blob store gives `BLOB_STORE_ID` and `BLOB_WEBHOOK_PUBLIC_KEY`, not `BLOB_READ_WRITE_TOKEN`. In `@vercel/blob@2.8.0`, `handleUpload` needs a read-write token (`generateClientTokenFromReadWriteToken`), so the token route uses `handleUploadPresigned` with `issueSignedToken` (OIDC + store id, `operations: ["put"]`, pathname-scoped, `allowedContentTypes`, `maximumSizeInBytes`, `validUntil`) and `urlOptions` (`addRandomSuffix: true`, same limits); its body event is `blob.generate-presigned-url`. The browser uses `uploadPresigned` from `@vercel/blob/client`. The apply route reads the CV with `get(pathname, { access: "private", storeId, useCache: false })` and passes no `token`. Tasks 7 and 8 are reworked in fix rounds; Task 16 documents `BLOB_STORE_ID`, `BLOB_WEBHOOK_PUBLIC_KEY` and `VERCEL_OIDC_TOKEN` (local only).
- 2026-10-04, Task 4: `validateApplication({ name, email, note })` checks the text fields only. A phone over 200 characters (input `maxLength`, no error slot) is a bad body in `parseApplication`; the CV is checked with `cvError` (browser, extension and size) and `storedCvError` (server, on the stored blob).

## Spec Change Log

- 2026-10-04 (controller note, env facts; no change to the lead's decisions): Blob auth changed from `BLOB_READ_WRITE_TOKEN` + `handleUpload` to OIDC + `BLOB_STORE_ID` + `BLOB_WEBHOOK_PUBLIC_KEY` with `handleUploadPresigned`, because the lead's store has no read-write token. Amended: frozen Always line on Blob auth, frozen matrix row "Config missing", the CV check line (`get` metadata instead of `head`), tasks 7, 8 and 16 wording, Design Notes. Avoids: routes that fail with "Invalid `BLOB_READ_WRITE_TOKEN`" on every upload. KEEP: private store, path `cv/application.<ext>` + random suffix, two requests per application, every server check.

## Review Triage Log

## Design Notes

- Two requests per application: the browser uploads the CV with a short-lived token (Vercel Function body limit 4.5 MB never applies), then sends a small JSON body with the blob path. The apply route trusts nothing from the upload: it re-reads the stored blob's size and type from `get` before attaching it.
- Retry: the form keeps the uploaded path for the same `File` object, so a mail failure does not upload a second copy. An upload that fails leaves no blob.
- Vercel Blob Hobby (`docs/spikes/cms-spike.md`): 1 GB storage (about 200 CVs at 5 MB, kept with no time limit, A4), 10k simple and 2k advanced operations and 10 GB transfer per month; at the limit the store is locked for 30 days. Name it in the PR. Re-read the pricing page before Demo day.
- Page metadata: one static title and description from `src/content/job.ts` (per-role metadata is Story 7.1).

## Verification

**Commands:**
- `npm run lint && npm run typecheck && npm run format:check` -- expected: no errors
- `npm test` -- expected: all pass
- `npm run test:coverage && npm run coverage:diff` -- expected: 100% changed lines, branches ≥ 80% on changed files
- `npm run build && npm run test:smoke` -- pending (controller, main checkout)

**Manual checks:**
- Browser walk of `/careers/placeholder-sample-job` at 1280, 900, 899, 640 and 390px plus reduced motion; a real upload and mail after the lead creates the private Blob store -- pending (controller).
