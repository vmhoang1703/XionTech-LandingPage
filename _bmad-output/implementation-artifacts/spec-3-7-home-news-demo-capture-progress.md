# Build ledger — spec: C:/XionTech/LandingPage-3-7/_bmad-output/implementation-artifacts/spec-3-7-home-news-demo-capture.md

Task 1: dispatched (model sonnet, base 08327be, report C:/Users/DELL/AppData/Local/Temp/claude/C--XionTech-LandingPage/f753fe58-8a41-440f-be5a-fbd7a1607dc9/scratchpad/task1-report.md)
Task 1: red — npx vitest run studio/schemas/schemas.test.ts — 2 failed | 9 passed (Missing field "category"/"app" in post)
Task 1: green — npx vitest run studio/schemas/schemas.test.ts — 11 passed (11)
Task 1: complete (commits 08327be..a6de3c1, diff verified)
Task 2: dispatched (model sonnet, base a6de3c1, report C:/Users/DELL/AppData/Local/Temp/claude/C--XionTech-LandingPage/f753fe58-8a41-440f-be5a-fbd7a1607dc9/scratchpad/task2-report.md)
Task 3: dispatched (model sonnet, base a6de3c1, report C:/Users/DELL/AppData/Local/Temp/claude/C--XionTech-LandingPage/f753fe58-8a41-440f-be5a-fbd7a1607dc9/scratchpad/task2-report.md) — batched with Task 2: categoryTag reads the labels from the copy module
Task 2: red — npx vitest run src/lib/news — test file failed to load (module ./latest-posts missing); then expected '18 SEPT 2026' to be '18 SEP 2026' (en-GB)
Task 2: green — npx vitest run src/lib/news — Test Files 1 passed, Tests 13 passed (13)
Task 2: minor — src/lib/news/latest-posts.ts:47 categoryLabels[category] on a plain object; a category like "toString" reads an inherited member (schema list makes it unlikely)
Task 2: complete (commits a6de3c1..e183e5a, diff verified)
Task 3: no-red (copy-only module; its strings are asserted by Task 2, 4 and 5 tests)
Task 3: complete (commits a6de3c1..e183e5a, diff verified)
Task 4: dispatched (model sonnet, base e183e5a, report C:/Users/DELL/AppData/Local/Temp/claude/C--XionTech-LandingPage/f753fe58-8a41-440f-be5a-fbd7a1607dc9/scratchpad/task4-report.md)
Task 4: red — npx vitest run src/components/news/news-card.test.tsx — FAIL, module "./news-card" not found
Task 4: green — npx vitest run src/components/news/news-card.test.tsx — Test Files 1 passed, Tests 3 passed
Task 4: minor — src/components/news/news-card.tsx:3 the card imports helpers from latest-posts.ts, which pulls the server-only Sanity client; a client island (6.1 filters) cannot import the card directly
Task 4: complete (commits e183e5a..9edc88e, diff verified)
Task 5: dispatched (model sonnet, base 9edc88e, report C:/Users/DELL/AppData/Local/Temp/claude/C--XionTech-LandingPage/f753fe58-8a41-440f-be5a-fbd7a1607dc9/scratchpad/task5-report.md)
Task 5: red — npx vitest run src/components/news/home-news.test.tsx — failed, ./home-news could not be resolved
Task 5: green — npx vitest run src/components/news/home-news.test.tsx — Test Files 1 passed, Tests 3 passed
Task 5: complete (commits 9edc88e..3da1c94, diff verified)
Task 6: dispatched (model sonnet, base 3da1c94, report C:/Users/DELL/AppData/Local/Temp/claude/C--XionTech-LandingPage/f753fe58-8a41-440f-be5a-fbd7a1607dc9/scratchpad/task6-report.md)
Task 6: no-red (CSS only; jsdom does not compute layout or styles — looks are UX rows checked in the browser walk, pending controller)
Task 6: complete (commits 3da1c94..10beb69, diff verified)
Task 7: dispatched (model sonnet, base 10beb69, report C:/Users/DELL/AppData/Local/Temp/claude/C--XionTech-LandingPage/f753fe58-8a41-440f-be5a-fbd7a1607dc9/scratchpad/task7-report.md)
Task 7: red — npx vitest run src/app/page.test.tsx — new test failed: surfaces [paper, navy, amber] vs expected [navy, mist, amber]
Task 7: green — npx vitest run src/app/page.test.tsx — Tests 6 passed (6)
Task 7: fix round 1/5 (controller: rhythm test checked only the last 3 sections; now checks every section after the hero — a1735aa; vitest page.test.tsx 6 passed)
Task 7: complete (commits 10beb69..a1735aa, diff verified)
Task 8: dispatched (model sonnet, base a1735aa, report C:/Users/DELL/AppData/Local/Temp/claude/C--XionTech-LandingPage/f753fe58-8a41-440f-be5a-fbd7a1607dc9/scratchpad/task8-report.md)
Task 8: no-red (docs only: decision A9, Sanity post-merge step, AI-log entry)
Task 8: complete (commits a1735aa..e11b3ce, diff verified)
Task 7: fix round 2/5 (controller: full npm test failed — src/app/no-js.test.tsx could not resolve server-only via HomeNews; stubbed HomeNews and asserted news before capture — b5bbd4f; vitest no-js + page 7 passed)
Task 7: complete (commits 10beb69..b5bbd4f, diff verified)
Acceptance: verification — npm run lint && npm run typecheck && npm run format:check — exit 0 — All matched files use Prettier code style!
Acceptance: verification — npm test — exit 0 — Test Files 51 passed (51), Tests 780 passed (780)
Acceptance: verification — npm run test:coverage && npm run coverage:diff — exit 0 — diff-cover Total 17 lines, Missing 0, Coverage 100%; C1 ok: 5 changed file(s) with branch coverage >= 80% vs origin/develop
Acceptance: BLOCKED — npm run build, npm run test:smoke and the browser walk not run: Turbopack rejects the worktree's node_modules junction; pending (controller)
Acceptance: evidence — spec-3-7-home-news-demo-capture-evidence/verification.txt — 3651 bytes — sha256 6b72f710d71e — the three declared commands, run once each, exit 0
Acceptance: evidence — spec-3-7-home-news-demo-capture-evidence/observed.md — 1517 bytes — sha256 aeabcb44aed2 — surface not walked in a browser; what jsdom tests observed instead
Acceptance: verification — npm run lint && npm run typecheck && npm run format:check — exit 0 — All matched files use Prettier code style! (after review patches 312fe79)
Acceptance: verification — npm test — exit 0 — Test Files 51 passed (51), Tests 781 passed (781)
Acceptance: verification — npm run test:coverage && npm run coverage:diff — exit 0 — diff-cover Total 17 lines, Missing 0, Coverage 100%; C1 ok: 5 changed file(s) with branch coverage >= 80% vs origin/develop
Acceptance: BLOCKED — npm run build, npm run test:smoke and the browser walk not run: Turbopack rejects the worktree's node_modules junction; pending (controller)
Acceptance: evidence — spec-3-7-home-news-demo-capture-evidence/verification-after-review.txt — 3697 bytes — sha256 64bbcd6ee5c6 — the three declared commands after the review patches, exit 0
Acceptance: evidence — spec-3-7-home-news-demo-capture-evidence/observed.md — 1517 bytes — sha256 aeabcb44aed2 — surface not walked in a browser; jsdom observations (unchanged by the patches)
