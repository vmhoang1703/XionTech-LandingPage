# Build ledger — spec: C:\XionTech\LandingPage\_bmad-output\implementation-artifacts\spec-1-8-sanity-setup.md

Task 1: no-red (dependencies only)
Task 1: review — pass — 0 critical, 0 important, 1 minor
Task 1: minor — .nvmrc:1 says 22 while @sanity/client needs node >=22.12
Task 1: complete (commits 7942c4c..2fd703b, diff verified)
Task 2: dispatched (model sonnet, base 2fd703b, report C:/Users/DELL/AppData/Local/Temp/claude/C--XionTech-LandingPage/f753fe58-8a41-440f-be5a-fbd7a1607dc9/scratchpad/s18-t2-report.md)
Task 2: red — npx vitest run src/lib/sanity/config.test.ts — FAIL: module ./config missing
Task 2: green — npx vitest run src/lib/sanity/config.test.ts — 3 passed
Task 2: review — pass — 0 critical, 0 important, 2 minor
Task 2: minor — src/lib/sanity/config.ts:76 whitespace-only value passes the check
Task 2: minor — src/lib/sanity/config.ts:84 inlining comment may confuse in next.config context
Task 2: complete (commits 2fd703b..adfada5, diff verified)
Task 3: dispatched (model sonnet, base adfada5, report C:/Users/DELL/AppData/Local/Temp/claude/C--XionTech-LandingPage/f753fe58-8a41-440f-be5a-fbd7a1607dc9/scratchpad/s18-t3-report.md)
Task 3: red — npx vitest run src/lib/sanity/client.test.ts — 4 failed (module ./client missing)
Task 3: green — npx vitest run src/lib/sanity — 7 passed
Task 3: review — pass — 0 critical, 0 important, 2 minor
Task 3: minor — src/lib/sanity/client.test.ts:18 server-only guard mocked; only the Next build proves it
Task 3: minor — src/lib/sanity/client.test.ts:88 toEqual on Error, toBe stricter
Task 3: complete (commits adfada5..a5f6cbc, diff verified)
Task 4: dispatched (model opus, base a5f6cbc, report C:/Users/DELL/AppData/Local/Temp/claude/C--XionTech-LandingPage/f753fe58-8a41-440f-be5a-fbd7a1607dc9/scratchpad/s18-t4-report.md)
Task 4: red — npx vitest run src/app/api/revalidate — FAIL: module missing; then 11 failed against an always-200 stub
Task 4: green — npx vitest run src/app/api/revalidate — 11 passed
Task 4: review — pass — 0 critical, 0 important, 2 minor
Task 4: minor — src/app/api/revalidate/route.ts:167 request body read before any size limit (Vercel limits it)
Task 4: minor — src/app/api/revalidate/route.ts:178 revalidateTag 'max' serves one stale view after publish; docs suggest {expire:0} for webhooks — lead to decide
Task 4: complete (commits a5f6cbc..e3ec35c, diff verified)
Task 5: dispatched (model sonnet, base e3ec35c, report C:/Users/DELL/AppData/Local/Temp/claude/C--XionTech-LandingPage/f753fe58-8a41-440f-be5a-fbd7a1607dc9/scratchpad/s18-t5-report.md)
Task 5: red — npx vitest run --config <scratchpad>/vitest.studio.mjs — FAIL: Cannot find module ./job
Task 5: green — same command — 6 passed
Task 5: review — fail — 0 critical, 1 important (root tsconfig includes studio/*.ts that import sanity, installed only in studio/; clean checkouts fail typecheck), 2 minor
Task 5: minor — studio/package.json typescript 7.0.2 and no studio tsconfig
Task 5: minor — studio/schemas/schemas.test.ts CV-name regex is coarse
Task 5: complete (commits e3ec35c..ab80477, diff verified; the important finding is Task 6's scope — tsconfig/eslint/prettier/vitest wiring — and is passed to it verbatim)
Task 6: dispatched (model sonnet, base ab80477, report C:/Users/DELL/AppData/Local/Temp/claude/C--XionTech-LandingPage/f753fe58-8a41-440f-be5a-fbd7a1607dc9/scratchpad/s18-t6-report.md)
Task 6: no-red (tool configuration; proven by typecheck/lint/test/build in a clean copy without studio/node_modules)
Task 6: review — pass — re-review of the Task 5 finding: addressed; 0 open; 2 minor
Task 6: minor — eslint.config.mjs:61 / tsconfig.json:33 studio schema test no longer linted or type-checked by root tools
Task 6: complete (commits ab80477..09d8b3c, diff verified)
Task 7: dispatched (model haiku, base 09d8b3c, report C:/Users/DELL/AppData/Local/Temp/claude/C--XionTech-LandingPage/f753fe58-8a41-440f-be5a-fbd7a1607dc9/scratchpad/s18-t7-report.md)
Task 7: no-red (example env file; no behaviour)
Task 7: review — pass — 0 critical, 0 important, 0 minor
Task 7: complete (commits 09d8b3c..df70a6f, diff verified)
Task 8: dispatched (model sonnet, base df70a6f, report C:/Users/DELL/AppData/Local/Temp/claude/C--XionTech-LandingPage/f753fe58-8a41-440f-be5a-fbd7a1607dc9/scratchpad/s18-t8-report.md)
Task 8: red — npx vitest run scripts/sanity-check.test.mjs — FAIL: ./sanity-check.mjs not found
Task 8: green — npx vitest run scripts/sanity-check.test.mjs — 5 passed
Task 8: review — fail — 0 critical, 1 important (draft check passes when no drafts exist, scripts/sanity-check.mjs:83,45-46), 2 minor
Task 8: minor — scripts/sanity-check.mjs:93-98 main() untested (network)
Task 8: fix round 1/5 (draft privacy proven only with SANITY_DRAFT_PROBE_ID; otherwise 'not proven'; red 4 failed → green 7)
Task 8: review — pass — re-review: important finding addressed; 0 open; 2 minor
Task 8: minor — scripts/sanity-check.mjs:35-38 'proven' cannot confirm the probe draft exists (typo risk)
Task 8: minor — scripts/sanity-check.mjs:54 SANITY_DRAFT_PROBE_ID not checked for drafts. prefix
Task 8: complete (commits 8c696e7~1..bb0f8fa — 8c696e7, bb0f8fa — diff verified)
Task 9: dispatched (model sonnet, base bb0f8fa, report C:/Users/DELL/AppData/Local/Temp/claude/C--XionTech-LandingPage/f753fe58-8a41-440f-be5a-fbd7a1607dc9/scratchpad/s18-t9-report.md)
Task 9: no-red (documentation only)
Task 9: review — pass — 0 critical, 0 important, 2 minor
Task 9: minor — docs/sanity.md:29 setup step 3 says 'empty draft read' but the script prints 'not proven' without a probe id
Task 9: minor — docs/sanity.md:88-90 paid-plan triggers inferred, not marked
Task 9: complete (commits bb0f8fa..037d15d, diff verified)
Acceptance: verification — `npm run lint && npm run typecheck && npm run format:check` — exit 1 — "[warn] studio/schemas/schemas.test.ts"; fixed by Prettier (commit a3ce6d1), re-run exit 0 — "All matched files use Prettier code style!"
Acceptance: verification — `npm test` — exit 0 — "Tests  316 passed (316)"
Acceptance: verification — `npm run test:coverage && npm run coverage:diff` — exit 0 — "Coverage: 100%"; "C1 ok: 3 changed file(s) with branch coverage >= 80% vs origin/develop."
Acceptance: verification — `npm run build && npm run test:smoke` — exit 0 — "2 passed (23.6s)"
Acceptance: verification — `npm run sanity:check` — exit 1 — "FAIL: no post found — publish a [Placeholder] post in the Studio"
Acceptance: verification — `npm audit --omit=dev` — exit 0 — "found 0 vulnerabilities"
Acceptance: manual — .next searched for styled-components / @sanity/ui: 0 files outside .next/cache and .next/dev/cache (2 Turbopack cache .sst files only)
Acceptance: BLOCKED — real read of one post and one job and the draft probe: project 1khn3hf4 has no published content yet (lead's account step 3)
Acceptance: BLOCKED — webhook delivery 200: webhook not created and route not deployed yet (lead's account steps 4–5)
Acceptance: no-surface (server-only Sanity client, webhook API route, separate studio/ package, scripts and docs; no page, component or style renders anything)
Acceptance: evidence — spec-1-8-sanity-setup-evidence/verification.txt — 5019 bytes — sha256 7d6823ad196b
Review: step 4 full review — 24 findings: 4 patch, 3 defer, 15 reject, 2 evidence (triage log in spec); patches in e704307
Acceptance: verification — `npm run lint && npm run typecheck && npm run format:check` — exit 0 — "All matched files use Prettier code style!"
Acceptance: verification — `npm test` — exit 0 — "Tests  318 passed (318)"
Acceptance: verification — `npm run test:coverage && npm run coverage:diff` — exit 0 — "Coverage: 100%"; "C1 ok: 3 changed file(s) with branch coverage >= 80% vs origin/develop."
Acceptance: verification — `npm run build && npm run test:smoke` — exit 0 — "2 passed (15.1s)"
Acceptance: verification — `npm run sanity:check` — exit 1 — "FAIL: no post found — publish a [Placeholder] post in the Studio"
Acceptance: verification — `npm audit --omit=dev` — exit 0 — "found 0 vulnerabilities"
Acceptance: manual — `grep -rlE 'styled-components|@sanity/ui|sanity/structure|sanity/desk' .next --exclude-dir=cache --exclude-dir=dev` — "files: 0" (in verification.txt); `@sanity/client` is allowed in server chunks and is not in the build yet because no page imports `sanityFetch`
Acceptance: BLOCKED — real read of one post and one job and the draft probe: project 1khn3hf4 has no published content yet (lead's account step 3)
Acceptance: BLOCKED — webhook delivery 200: webhook not created and route not deployed yet (lead's account steps 4–5)
Acceptance: no-surface (server-only Sanity client, webhook API route, separate studio/ package, scripts and docs; no page, component or style renders anything)
Acceptance: evidence — spec-1-8-sanity-setup-evidence/verification.txt — 4632 bytes — sha256 e501fdf4788f
Review: patch re-review — pass — 0 critical, 0 important, 1 minor (next-config.test.ts:23 asserts toEqual({}); breaks when a real option is added) — deferred
Review: acceptance re-audit — compliant, 0 unverified-acceptance
Acceptance: evidence rehashed after CRLF→LF (as git stores it); row above updated, content unchanged
Acceptance: verification — `npm run sanity:check` (after seeding) — exit 0 — "post: f73f46b0-18e1-4565-863d-b06282039d3a [Placeholder] First news post"
Acceptance: verification — `SANITY_DRAFT_PROBE_ID=drafts.146fcc83-053f-42ff-96e0-406edac7de06 npm run sanity:check` — exit 0 — "draft privacy: proven (draft drafts.146fcc83-053f-42ff-96e0-406edac7de06 not readable without a token)"; draft id copied by the lead from the Studio URL of an unpublished post
Acceptance: unblocked — real read of post, job and draft probe now observed (supersedes the first BLOCKED row)
Acceptance: evidence — spec-1-8-sanity-setup-evidence/verification.txt — 5609 bytes — sha256 faeb6bc3a688
