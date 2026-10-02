---
title: 'Story 1.8: Sanity setup'
type: 'feature'
created: '2026-10-02'
status: 'done'
baseline_commit: 'c96b8e04c8968d5d97eac6b4f3763dff89ea2919'
route: 'dispatch'
review_loop_iteration: 0
context: ['{project-root}/AGENTS.md']
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** News stories and open roles must come from Sanity (chosen 2026-09-28), but real reads were never proven (the spike used a fake project ID). Stories 3.7, 6.1, 6.2, 6.5, 6.6 and 6.3 are blocked until a working, free, cached connection exists.

**Approach:** A server-only Sanity client and one tagged, cached fetch helper in `src/lib/sanity/*`; a webhook route that checks Sanity's signature and revalidates the `post` / `job` tags; a separate `studio/` package (schemas with field-level EN/VI) deployed to `<name>.sanity.studio`, so the Next.js build carries no Studio code. Contract: `_bmad-output/specs/andy/spec-1-8-sanity-setup/SPEC.md` (CAP-1…CAP-8).

## Boundaries & Constraints

**Always:**
- Free plan only (10,000 documents per dataset, 250k API + 1M CDN requests per month, public datasets, 20 users). Webhooks must be available on Free — confirm in sanity.io/manage; if not, say so before relying on them.
- Reads: `useCdn: true`, `perspective: "published"`, no token; cached with Next.js fetch tags (`cache: "force-cache"`, `next: { tags }`), never `force-dynamic`. Tag names: `post` and `job` (News, Home, Products `#updates` and Careers all read through them).
- Revalidation: `revalidateTag(tag, "max")` (Next.js 16 two-argument form) for the published document's type only.
- Config: `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` are checked in `next.config.ts`, so `next build`, `next dev` and `next start` stop with a clear message naming the missing variable. `SANITY_REVALIDATE_SECRET` is server-only (never `NEXT_PUBLIC_*`, never logged); when it is missing, the webhook rejects every call.
- Webhook: POST only; the raw body is checked against the `sanity-webhook-signature` header with Sanity's own `@sanity/webhook` library; a bad or missing signature → 401, an unknown document type → 400 and nothing revalidated.
- Studio in `studio/` with its own `package.json` and lockfile (not an npm workspace); the root app installs only `@sanity/client` and `@sanity/webhook`.
- Schemas `post` and `job` keep EN and VI in one document (field-level). No application or CV fields (T1). Seed content titles start with `[Placeholder]`.
- Account steps are the lead's (see Design Notes); secrets never appear in source, logs or chat.

**Never:** pages, GROQ queries for pages, image URL builder, generated types (Stories 3.7, 6.x); editor workflow (6.3); draft mode / visual editing; a `/studio` route in the Next app unless hosting on sanity.studio fails; storing anything private in Sanity.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| Read | `sanityFetch({ query, tags: ["post"] })` | runs on the server with CDN, published perspective, `force-cache`, the given tags | Sanity error is thrown with context, not swallowed |
| Missing config | build without `NEXT_PUBLIC_SANITY_PROJECT_ID` or `_DATASET` | build stops: "Missing NEXT_PUBLIC_SANITY_PROJECT_ID …" | N/A |
| Webhook OK | signed POST, body `{ "_type": "post" }` | 200, `revalidateTag("post", "max")` | N/A |
| Bad signature | wrong or missing `sanity-webhook-signature` | 401, nothing revalidated | no secret or body in logs |
| No secret configured | `SANITY_REVALIDATE_SECRET` unset | 500 "not configured", nothing revalidated | logged once without values |
| Unknown type | signed body `{ "_type": "page" }` or bad JSON | 400, nothing revalidated | N/A |
| Draft read | `*[_id == "drafts.<id>"]` with the public client | empty result | N/A |

**Decisions (lead, 2026-10-02):**
- The free Sanity project exists: project ID `1khn3hf4` (public value; it goes in `.env.example` and `studio/sanity.cli.ts`).
- The lead does the account steps now, while the code is built; the PR waits for the real-read proof.
- Dataset `production`. Studio host `xiontech-landing` (`https://xiontech-landing.sanity.studio`).
- Spec size about 2,850 tokens: kept in full (lead).

</frozen-after-approval>

## Code Map

- `docs/spikes/cms-spike.md` -- versions seen in the spike (next-sanity 13.3.4, sanity 6.16.0, styled-components 6.5.3), free-plan limits (line 51), open work 1–8 (lines 81–98), 14 audit findings incl. 3 high from Studio deps (line 42).
- `_bmad-output/specs/decisions-2026-10-01.md` -- T1 (no CVs in Sanity), T2 (client + one tagged helper; pages write their own GROQ), T7 (clear high findings or record why), A5 (lead is the Demo-day editor).
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/revalidateTag.md` -- `revalidateTag(tag, "max")`; one-argument form deprecated. `.../04-functions/fetch.md` -- caching is opt-in; `cache: "force-cache"` + `next: { tags }`. `.../03-file-conventions/route.md` lines 560–575 -- webhook route: `POST(request)`, `await request.text()`, `new Response(…, { status })`. `cacheTag` / `'use cache'` need `cacheComponents`, which this repo does not enable — do not use them.
- `node_modules/next/dist/docs/01-app/02-guides/environment-variables.md` -- `.env*` load from the project root; `NEXT_PUBLIC_*` inlined at build; `.env.test` for tests.
- `next.config.ts` -- empty `{}`; add the config check here.
- `vitest.config.mts` -- jsdom, includes `src/**/*.test.{ts,tsx}`; route tests need `// @vitest-environment node`.
- `playwright.config.ts` -- smoke builds with `npm run build` (needs the two public variables in `.env.local`).
- `.gitignore` lines 16–18 -- `.env*` ignored except `.env.example` (does not exist yet).
- README "Live URLs" -- prod `https://xion-tech-landing-page.vercel.app`, dev `https://xiontech-dev.vercel.app`; preview pattern seen on PR #13: `https://xion-tech-landing-page-*-vmhoang1703s-projects.vercel.app`.

## Tasks & Acceptance

**Execution:**
- [x] `package.json` -- add `@sanity/client` and `@sanity/webhook`, pinned exactly -- the only Sanity code in the Next build.
- [x] `src/lib/sanity/config.ts` + `next.config.ts` -- read and check `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET` (fixed API version); `next.config.ts` calls the check so build/dev/start stop with the variable's name -- CAP-2.
  - red: `src/lib/sanity/config.test.ts` -- each missing variable throws a message naming it; both present return the config.
- [x] `src/lib/sanity/client.ts` -- `sanityFetch<T>({ query, params, tags })`: server-only client (`useCdn: true`, `perspective: "published"`, no token) with `cache: "force-cache"` and `next: { tags }` -- CAP-1, CAP-4, CAP-7.
  - red: `src/lib/sanity/client.test.ts` -- the client is created with CDN + published perspective and no token, and a fetch passes the query, params, `force-cache` and tags.
- [x] `src/app/api/revalidate/route.ts` -- POST webhook: verify the signature with `@sanity/webhook` and `SANITY_REVALIDATE_SECRET`; revalidate `post` or `job` with `"max"`; 401 / 400 / 500 cases from the matrix; no values in logs -- CAP-4.
  - red: `src/app/api/revalidate/route.test.ts` -- every matrix webhook row (valid, bad signature, missing secret, unknown type, bad JSON).
- [x] `studio/` -- separate package: `package.json` (sanity, styled-components pinned), `sanity.config.ts`, `sanity.cli.ts` (project ID, dataset, studio host `xiontech-landing`), schemas `post` (title, slug, publishedAt, excerpt, body; EN/VI fields) and `job` (title, location, type, description; EN/VI fields), README with deploy steps -- CAP-5, CAP-6.
  - red: `studio/schemas/schemas.test.ts` (run by the root Vitest) -- both schemas exist with EN and VI fields and no application/CV field.
- [x] `vitest.config.mts`, `eslint.config.mjs`, `tsconfig.json`, `.prettierignore` -- include the studio schema test; keep `studio/` out of the Next type-check and build where needed -- the Next build must not see Studio code.
- [x] `.env.example` -- the three variable names with the public project ID and dataset filled in once known, the secret left blank -- teammates copy it to `.env.local`.
- [x] `scripts/sanity-check.mjs` + `package.json` script `sanity:check` -- reads one `post` and one `job` with the public client, and a `drafts.` ID, and prints what it got (no secrets) -- the CAP-1 / CAP-7 proof against the real project.
- [x] `docs/sanity.md` -- the account steps (Design Notes), CORS list, webhook settings, free-plan limits and what forces a paid plan, the `npm audit` result for root and `studio/` (CAP-8, T7).

**Acceptance Criteria:**
- Given the real project with one `[Placeholder]` post and job, when `npm run sanity:check` runs, then it prints both documents and an empty draft read (CAP-1, CAP-7).
- Given `npm run build`, then the build output contains no `sanity` or `styled-components` package (CAP-6), and root `npm audit` shows no high finding from Sanity packages; `studio/` findings are listed in `docs/sanity.md` (CAP-8).

## UX checks

No UI in this story (no page, component or style changes), so no UX checks table — per `docs/ux-checks.md` this rule covers UI stories only.

## Implementation Notes

## Spec Change Log

- 2026-10-02, step 4 review (Security Auditor): Design Notes step 2 gave `http://localhost:3000` CORS credentials, so any page on that port could act as a logged-in editor. Amended: credentials only for `http://localhost:3333` (local Studio); `localhost:3000` without credentials. Known-bad state avoided: credentialed CORS for an origin that never needs a login. KEEP: every other origin and account step unchanged. Applied as a docs patch to task 9 (no code re-derived).

## Review Triage Log

Step 4 full review, 2026-10-02 (Blind Hunter, Edge Case Hunter, Verification Gap, Acceptance Auditor, Security Auditor; task-review minors included).

| # | Finding (source) | Verdict | Route | Evidence |
|---|---|---|---|---|
| 1 | `docs/sanity.md` gives `http://localhost:3000` CORS credentials (Security) | medium | patch | The site reads server-side with no token; only the local Studio (`:3333`) needs credentials. Docs and Design Notes amended (Spec Change Log). |
| 2 | Docs say `sanity:check` prints "an empty draft read"; without `SANITY_DRAFT_PROBE_ID` it prints "not proven" (Acceptance, Edge, task 9 minor) | low | patch | `docs/sanity.md:23` reworded; direct correction. |
| 3 | Script API version `2025-01-01` vs client `2025-02-19`, under a "Same settings" comment (Blind, Edge, Verification Gap) | low | patch | `scripts/sanity-check.mjs:5` now `2025-02-19`. |
| 4 | No test fails if the `next.config.ts` env check is removed (Verification Gap, Blind) | medium | patch | Added `src/lib/sanity/next-config.test.ts`; it fails with the check line deleted. |
| 5 | Signed webhook deliveries can be replayed; `@sanity/webhook` never checks timestamp age (Security, Edge, Blind) | medium | defer | Confirmed in `node_modules/@sanity/webhook/dist/index.mjs` (only `>= 2021`). Needs a captured delivery (project member or leak); outcome is cache churn only. A freshness window must allow Sanity's retries, which keep the first timestamp — not settled here. Lead's rule until Demo day: defer. |
| 6 | `main()` of `sanity-check.mjs` untested (Verification Gap) | low | defer | Manual proof tool; filed by the reviewer as defer. |
| 7 | `studio/` is outside root lint and typecheck; it has no tsconfig (Edge, Blind, Acceptance) | low | defer | Deliberate in task 6 so the Next build never sees Studio code; a studio typecheck script can come later. |
| 8 | Probe id typo or non-draft id gives a wrong "proven" / "readable" (Blind, Edge) | low | reject | The lead runs it once with an id copied from the Studio; a guard adds a branch for an unlikely case. |
| 9 | Draft probe uses `raw` perspective, no CDN, not the public client (Acceptance) | false | reject | The published perspective hides drafts by design, so it would always pass; raw with no token is the real privacy test. |
| 10 | `main()` guard may never run on Windows (Edge) | false | reject | The script ran on this Windows machine and printed its output (`verification.txt`). |
| 11 | `server-only` not in `package.json` (Blind) | false | reject | Next.js provides it; typecheck and build pass. |
| 12 | Whitespace-only env var passes the check (Edge) | low | reject | Unlikely; fix adds trimming logic. |
| 13 | `--env-file-if-exists` needs Node >= 22.9 (Edge) | low | reject | `.nvmrc` is `22` (current 22.x has it). |
| 14 | Fresh clone / CI build fails without `.env.local` (Blind) | false | reject | That is the spec's fail-fast rule (CAP-2); README/docs say copy `.env.example`. |
| 15 | Content stays stale if the webhook fails; no time-based fallback (Blind) | low | reject | Tags-only is the spec decision; Free-plan webhook confirmation is the lead's open account step. |
| 16 | Schemas lack validation, previews, job slug/date (Blind) | low | reject | Spec fields only; 6.x stories add what their pages need. |
| 17 | Schema test regex `cv` may match future names (Blind, Verification Gap) | low | reject | No current false match. |
| 18 | Studio React 19.3.0 vs root 19.2.8 (Blind) | false | reject | Separate packages, never bundled together. |
| 19 | Studio audit 14 findings, 4 high (Security, Blind) | low | reject | Accepted under T7 in `docs/sanity.md`, recheck 2026-10-12; root audit 0. |
| 20 | Project ID repeated in 5 files (Blind) | low | reject | Public constant; `studio/` is a separate package. |
| 21 | No ai-log entry (Blind) | false | reject | Step 5 writes it. |
| 22 | CAP-6 build-output check not reproducible from the transcript; `@sanity/client` in server chunks unexplained (Acceptance) | — | evidence | Re-captured with the exact command and the expected `@sanity/client` note. |
| 23 | Real read and webhook 200 not observed (Acceptance) | — | evidence | Honest `Acceptance: BLOCKED` rows; waits on the lead's account steps. |
| 24 | Vercel secret Sensitive flag, body size, no API tokens, CORS wildcard (Security, Blind) | maybe-false | reject | Account settings, not code; listed for the lead. |

## Design Notes

**Account steps (the lead, in this order):**
1. sanity.io → create a free project "XionTech Landing Page", dataset `production`, public. Send me only the project ID (it is public).
2. Manage → API → CORS origins (no credentials unless marked): `http://localhost:3333` (credentials, local Studio), `http://localhost:3000`, `https://xion-tech-landing-page.vercel.app`, `https://xiontech-dev.vercel.app`, `https://xion-tech-landing-page-*-vmhoang1703s-projects.vercel.app` (no credentials).
3. `cd studio && npm install && npx sanity login && npx sanity deploy` → host `xiontech-landing`; create one `[Placeholder]` post and one `[Placeholder]` job; publish.
4. Copy `SANITY_REVALIDATE_SECRET` from `.env.local` (I generate it there; it is never shown in chat). Manage → API → Webhooks: URL `https://xiontech-dev.vercel.app/api/revalidate` (and the production URL), filter `_type in ["post", "job"]`, projection `{_type}`, trigger on create/update/delete, POST, secret = that value.
5. Vercel → Settings → Environment Variables (Preview and Production): `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET` = `production`, `SANITY_REVALIDATE_SECRET`. Do this before merging: the build stops without the first two.

The check lives in `next.config.ts` because Next.js has no built-in build-time env validation, and `instrumentation.ts` runs only at server start.

## Verification

**Commands:**
- `npm run lint && npm run typecheck && npm run format:check` -- expected: no errors
- `npm test` -- expected: all pass
- `npm run test:coverage && npm run coverage:diff` -- expected: 100% changed lines, branches ≥ 80%
- `npm run build && npm run test:smoke` -- expected: build passes with `.env.local`; smoke 2 passed
- `npm run sanity:check` -- expected: one post, one job, empty draft read (after the account steps)
- `npm audit --omit=dev` -- expected: no high finding from Sanity packages

**Manual checks:**
- Build output: search `.next` for `styled-components` / `sanity` Studio chunks -- expected: none.
- Publish a change in the Studio; the webhook delivery in sanity.io/manage shows 200.

## Acceptance Evidence

Re-captured after the step 4 review patches on 2026-10-02.

**Commands**

- `npm run lint && npm run typecheck && npm run format:check` -- exit 0 -- "All matched files use Prettier code style!"
- `npm test` -- exit 0 -- "Tests  318 passed (318)"
- `npm run test:coverage && npm run coverage:diff` -- exit 0 -- "Coverage: 100%", "C1 ok: 3 changed file(s) with branch coverage >= 80% vs origin/develop."
- `npm run build && npm run test:smoke` -- exit 0 -- "2 passed (15.1s)"
- `npm run sanity:check` -- exit 1 before seeding ("FAIL: no post found"); exit 0 after the lead seeded content -- "post: f73f46b0-… [Placeholder] First news post", "job: ce53ceb1-… [Placeholder] Sample job"
- `SANITY_DRAFT_PROBE_ID=drafts.146fcc83-053f-42ff-96e0-406edac7de06 npm run sanity:check` -- exit 0 -- "draft privacy: proven (draft … not readable without a token)"
- `npm audit --omit=dev` -- exit 0 -- "found 0 vulnerabilities"

**Observed**

- Webhook delivery after merge (#14): the first attempt got 401 "Invalid signature" (the webhook held the variable name, not its value); after the lead fixed the secret, attempt `atm-3K8SNs6H0mRHsux0zVQmfXus5CZ` on 2026-10-02T10:41:03Z got 200 `{"revalidated":"post"}` -- sanity.io/manage attempts log, pasted by the lead
- No Studio code in the build: `grep -rlE 'styled-components|@sanity/ui|sanity/structure|sanity/desk' .next --exclude-dir=cache --exclude-dir=dev` prints "files: 0" -- transcript in `verification.txt`. `@sanity/client` is allowed on the server and is not bundled yet, because no page imports `sanityFetch`.

**Artifacts**

- spec-1-8-sanity-setup-evidence/verification.txt -- 5609 bytes -- sha256 faeb6bc3a688 -- transcript of every command above and the build-output search

**Not captured**

Nothing.
