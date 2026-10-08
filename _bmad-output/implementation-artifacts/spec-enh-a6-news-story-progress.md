# Build ledger — spec: C:/XionTech/LandingPage/.claude/worktrees/agent-a8802006149b16f20/_bmad-output/implementation-artifacts/spec-enh-a6-news-story.md

Task 1: dispatched (model sonnet, base 2bc2965, report C:/Users/DELL/AppData/Local/Temp/claude/C--XionTech-LandingPage/808b5cd7-3cd9-431c-baa7-6087ec30dbc4/scratchpad/a6-task1-report.md)
Task 1: red — npx vitest run src/lib/news/audience.test.ts src/lib/news/latest-posts.test.ts — audience module missing; expected '31 JUL 2026' to be '31 Jul 2026' (2 failed | 17 passed)
Task 1: green — npx vitest run src/lib/news src/components/news src/app/news studio — 12 files, 114 tests pass; npm test 1203/1203
Task 1: review — pass — 0 Critical, 0 Important, 2 Minor
Task 1: minor — src/app/globals.css:2388,2399 `.cat`/`.cat.product` dead until task 2 removes it
Task 1: minor — studio/schemas/post.ts:50-53 `app` settable on any audience; only product posts read it (spec-mandated)
Task 1: complete (commits 2bc2965..fb5c693, diff verified)
Task 2: dispatched (model opus, base fb5c693, report C:/Users/DELL/AppData/Local/Temp/claude/C--XionTech-LandingPage/808b5cd7-3cd9-431c-baa7-6087ec30dbc4/scratchpad/a6-task2-report.md)
Task 2: red — npx vitest run src/components/news/news-filters.test.tsx -t "pressing Parents" — expect(leads()).toEqual(["p1"]) failed: no cell had s-lead
Task 2: green — npm test — 1211/1211 pass; lint, typecheck, prettier clean
Task 2: review — pass — 0 Critical, 0 Important, 3 Minor (controller checked: every var(--…) added is defined; only next/font vars come from layout)
Task 2: minor — src/components/news/news-card.tsx:78 card title is a span, no h3 (prototype); heading navigation lost on News
Task 2: minor — src/app/globals.css:560-564 second @media (width <= 900px) block holds only .news-grid
Task 2: minor — src/components/news/news-card.test.tsx no test for aria-labelledby when audience and date are both missing
Task 2: complete (commits fb5c693..fb3025f, diff verified)
Task 3: dispatched (model opus, base fb3025f, report C:/Users/DELL/AppData/Local/Temp/claude/C--XionTech-LandingPage/808b5cd7-3cd9-431c-baa7-6087ec30dbc4/scratchpad/a6-task3-report.md)
Task 3: red — npx vitest run "src/app/news/[slug]/page.test.tsx" — Unable to find img "Parents at the school gate"
Task 3: green — npm test — 1214/1214 pass; lint, typecheck, prettier clean
Task 3: review — pass — 0 Critical, 0 Important, 2 Minor (+ warning: 3rd Home card not hidden at 641-1000px, contrast.test bans display:none)
Task 3: minor — src/app/news/[slug]/page.test.tsx:171-181 class-check allow list now only sr-only
Task 3: minor — src/app/globals.css:2879-2883 moved 900px .news-grid rule (churn)
Task 3: minor — Home 3rd card wraps to a second row at 641-1000px instead of hiding (prototype hides it)
Task 3: complete (commits fb3025f..336c7f8, diff verified)
Acceptance: verification — npm run lint && npm run typecheck && npx prettier --check src e2e studio — exit 0 — all clean
Acceptance: verification — npm test — exit 0 — Test Files 81 passed (81), Tests 1214 passed (1214)
Acceptance: verification — npm run test:coverage && npm run coverage:diff — exit 0 — diff coverage 100% (38 lines, 0 missing); news components 100% branch
Acceptance: verification — npm run build — exit 0 — /news static, /news/[slug] dynamic
Acceptance: manual — next start :3206 + Playwright Chrome — observed: News H1 "Catch up with us", no crumbs, chips 44px, Parents → 1 Parents card with s-lead, Students → empty text + Show all → focus on All, 1280 three squares no lead (3 stories), 900 lead + 2, 390 one column; Home lede shown, 3 cards; story page Back to News, pill Parents, date "4 Oct 2026", no breadcrumb, no band; no Sanity post has an image yet so the photo was not seen live
Acceptance: evidence — spec-enh-a6-news-story-evidence/verification.txt — 5573 bytes — sha256 fb470caed51b — command output
Acceptance: evidence — spec-enh-a6-news-story-evidence/browser-check.txt — 2953 bytes — sha256 e4ed908cb51d — browser measurements
Acceptance: evidence — spec-enh-a6-news-story-evidence/news-1280.png — 493483 bytes — sha256 b2301b4d7bbd — News at 1280
Acceptance: evidence — spec-enh-a6-news-story-evidence/news-900.png — 464422 bytes — sha256 e112a9582739 — News at 900 with lead
Acceptance: evidence — spec-enh-a6-news-story-evidence/news-390.png — 378807 bytes — sha256 2a92040861d1 — News at 390
Acceptance: evidence — spec-enh-a6-news-story-evidence/news-parents.png — 232957 bytes — sha256 5eb494a9f5c7 — Parents filter
Acceptance: evidence — spec-enh-a6-news-story-evidence/news-empty-Students.png — 410802 bytes — sha256 c444128f6013 — empty filter
Acceptance: evidence — spec-enh-a6-news-story-evidence/home-news-1280.png — 113094 bytes — sha256 5cf02705fa46 — Home row
Acceptance: evidence — spec-enh-a6-news-story-evidence/home-news-390.png — 110859 bytes — sha256 a266dbe1ef2a — Home row phone
Acceptance: evidence — spec-enh-a6-news-story-evidence/story-1280.png — 189922 bytes — sha256 7c56d154d2ad — story page
Acceptance: evidence — spec-enh-a6-news-story-evidence/story-390.png — 171692 bytes — sha256 7c2a3ef2edde — story page phone
Acceptance: verification — npm run lint; npm run typecheck; npx prettier --check src e2e studio; npm test; npm run test:coverage; npm run coverage:diff; npm run build (after review patches 5bd9e17) — exit 0 each — Tests 1214 passed (1214); Coverage: 100%, Missing: 0 lines
Acceptance: manual — next start :3206 + Playwright Chrome after patches — observed: Home row and News cards look the same with the h3 title (white title on dark fade), hover shows Read story (opacity 1), focus outline solid
Acceptance: evidence — spec-enh-a6-news-story-evidence/verification-after-review.txt — 5573 bytes — sha256 9233e89d2081 — after review patches
Acceptance: evidence — spec-enh-a6-news-story-evidence/browser-check-after-review.txt — 2953 bytes — sha256 e4ed908cb51d — after review patches
Acceptance: evidence — spec-enh-a6-news-story-evidence/home-news-1280.png — 113094 bytes — sha256 5cf02705fa46 — after review patches
Acceptance: evidence — spec-enh-a6-news-story-evidence/news-1280.png — 493483 bytes — sha256 b2301b4d7bbd — after review patches
Acceptance: evidence — spec-enh-a6-news-story-evidence/story-1280.png — 189922 bytes — sha256 7c56d154d2ad — after review patches
