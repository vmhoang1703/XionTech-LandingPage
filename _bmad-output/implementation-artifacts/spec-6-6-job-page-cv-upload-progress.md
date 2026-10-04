# Build ledger — spec: C:\XionTech\LandingPage-6-6\_bmad-output\implementation-artifacts\spec-6-6-job-page-cv-upload.md

Task 1: dispatched (model haiku, base aabe123, report C:/Users/DELL/AppData/Local/Temp/claude/C--XionTech-LandingPage/f753fe58-8a41-440f-be5a-fbd7a1607dc9/scratchpad/66-t1-report.md)
Task 1: fix round 1/5 (controller: the implementer's npm install pruned the vite/rolldown peer entries from package-lock.json and removed vite from the shared node_modules (vitest could not run); controller restored both files from HEAD and re-ran npm install --save-exact @vercel/blob@2.8.0: +86 lock lines only, vite back; the implementer had not committed)
Task 1: no-red (dependency pin only; no behavior; npm audit --omit=dev — found 0 vulnerabilities; npm audit (all) shows 5 high in dev-only braces chain, not from this package)
Task 1: review — skipped — controller rule for this run: one review layer inside the build; step 4 covers it
Task 1: complete (commits aabe123..d43da92, diff verified)
Task 2: dispatched (model sonnet, base c074d05, report C:/Users/DELL/AppData/Local/Temp/claude/C--XionTech-LandingPage/f753fe58-8a41-440f-be5a-fbd7a1607dc9/scratchpad/66-t2-report.md)
Task 2: red — npx vitest run studio/schemas/schemas.test.ts — 3 failed | 8 passed (Missing field "responsibilities" in job)
Task 2: green — npx vitest run studio/schemas/schemas.test.ts — 11 passed (11)
Task 2: review — skipped — controller rule for this run: one review layer inside the build; step 4 covers it
Task 2: complete (commits a30d632..e8034bc, diff verified)
Task 3: dispatched (model sonnet, base e8034bc, report C:/Users/DELL/AppData/Local/Temp/claude/C--XionTech-LandingPage/f753fe58-8a41-440f-be5a-fbd7a1607dc9/scratchpad/66-t3-report.md)
Task 3: red — npx vitest run src/lib/careers/open-roles.test.ts — 7 failed (TypeError: getOpenRole is not a function)
Task 3: green — npx vitest run src/lib/careers/open-roles.test.ts — 21 passed (21)
Task 3: review — skipped — controller rule for this run: one review layer inside the build; step 4 covers it
Task 3: minor — src/lib/careers/open-roles.ts getOpenRole: `Array.isArray(role)` guard for a `[0]` query that cannot return an array (defensive branch)
Task 3: minor — Code Map's type-label export for chips not added here; assigned to the hero task
Task 3: complete (commits f94337f..466c257, diff verified)
Task 4: dispatched (model sonnet, base 466c257, report C:/Users/DELL/AppData/Local/Temp/claude/C--XionTech-LandingPage/f753fe58-8a41-440f-be5a-fbd7a1607dc9/scratchpad/66-t4-report.md)
Task 4: red — npx vitest run src/lib/careers/application-rules.test.ts — failed: module missing (no tests ran)
Task 4: green — npx vitest run src/lib/careers/application-rules.test.ts — 34 passed (34)
Task 4: review — skipped — controller rule for this run: one review layer inside the build; step 4 covers it
Task 4: fix round 1/5 (controller review: phone has no error slot, a long phone is a bad body per the matrix; validateApplication must not need a cv object because the server only has a blob path; now validates name, email, note only; 31 passed, commit 69da026)
Task 4: complete (commits 377fa42..69da026, diff verified)
Task 5: dispatched (model sonnet, base 69da026, report C:/Users/DELL/AppData/Local/Temp/claude/C--XionTech-LandingPage/f753fe58-8a41-440f-be5a-fbd7a1607dc9/scratchpad/66-t5-report.md)
Task 5: red — npx vitest run src/lib/careers/application.test.ts — failed: module missing (no tests ran)
Task 5: green — npx vitest run src/lib/careers/application.test.ts — 25 passed (25); application.ts 100% lines and branches
Task 5: review — skipped — controller rule for this run: one review layer inside the build; step 4 covers it
Task 5: minor — src/lib/careers/application.ts: `slug` has no length cap (only used as a GROQ param and in the mail; bounded by the route's role lookup)
Task 5: complete (commits 2a8d542..2babaa3, diff verified)
Task 6: dispatched (model sonnet, base 2babaa3, report C:/Users/DELL/AppData/Local/Temp/claude/C--XionTech-LandingPage/f753fe58-8a41-440f-be5a-fbd7a1607dc9/scratchpad/66-t6-report.md)
Task 6: red — npx vitest run src/lib/contact/delivery.test.ts — failed: checkUploadLimit / sendApplicationMail is not a function
Task 6: green — npx vitest run src/lib/contact/delivery.test.ts — 45 passed (45); delivery.ts 100% lines and branches
Task 6: review — skipped — controller rule for this run: one review layer inside the build; step 4 covers it
Task 6: complete (commits 203ab02..32941fa, diff verified)
Task 7: dispatched (model sonnet, base 32941fa, report C:/Users/DELL/AppData/Local/Temp/claude/C--XionTech-LandingPage/f753fe58-8a41-440f-be5a-fbd7a1607dc9/scratchpad/66-t7-report.md)
Task 7: red — npx vitest run src/app/api/careers/cv-upload/route.test.ts src/lib/careers/cv-storage.test.ts — failed: Cannot find module (route and cv-storage missing)
Task 7: green — same command — 2 files, 23 passed; 100% lines, 97% branches
Task 7: review — skipped — controller rule for this run: one review layer inside the build; step 4 covers it
Task 7: minor — src/app/api/careers/cv-upload/route.ts: `readBody` duplicates the contact route's 6-line helper (Sonar duplication watch; Task 8 may extract it)
Task 7: complete (commits e9da119..912435a, diff verified)
Task 8: dispatched (model sonnet, base 912435a, report C:/Users/DELL/AppData/Local/Temp/claude/C--XionTech-LandingPage/f753fe58-8a41-440f-be5a-fbd7a1607dc9/scratchpad/66-t8-report.md)
Task 8: red — npx vitest run src/app/api/careers/apply/route.test.ts — failed: Cannot find module .../apply/route
Task 8: green — npx vitest run src/app/api src/lib --coverage — 16 files, 462 passed; 100% lines and branches on the 4 changed files
Task 8: review — skipped — controller rule for this run: one review layer inside the build; step 4 covers it
Task 8: minor — src/app/api/careers/apply/route.ts readStoredCv: `statusCode !== 200` branch cannot happen without `ifNoneMatch` (defensive)
Task 8: complete (commits 00cecdb..f16a877, diff verified; mid-task course correction to OIDC auth: getBlobConfig, get without token; shared readBody/describeError moved to src/lib/http/route-helpers.ts)
Task 7: fix round 1/5 (controller: the lead's store has no BLOB_READ_WRITE_TOKEN and handleUpload needs one; route reworked to handleUploadPresigned + issueSignedToken with OIDC and BLOB_STORE_ID; getBlobToken removed; 463 passed in src/app/api and src/lib, 100% on the two changed files; commit de771e3)
Task 7: complete (commits 912435a..de771e3, diff verified)
Task 9: dispatched (model sonnet, base de771e3, report C:/Users/DELL/AppData/Local/Temp/claude/C--XionTech-LandingPage/f753fe58-8a41-440f-be5a-fbd7a1607dc9/scratchpad/66-t9-report.md)
Task 9: red — npx vitest run src/components/contact/post-submission.test.ts — 2 failed (custom endpoint not called; custom field errors not read)
Task 9: green — same command — 17 passed (17); npm test 886 passed
Task 9: review — skipped — controller rule for this run: one review layer inside the build; step 4 covers it
Task 9: complete (commits 733b57d..a0b4d2d, diff verified)
Task 10: dispatched (model haiku, base a0b4d2d, report C:/Users/DELL/AppData/Local/Temp/claude/C--XionTech-LandingPage/f753fe58-8a41-440f-be5a-fbd7a1607dc9/scratchpad/66-t10-report.md)
Task 10: no-red (static copy module; its strings are asserted by the form, hero, details and page tests in tasks 11-13)
Task 10: review — skipped — controller rule for this run: one review layer inside the build; step 4 covers it
Task 10: complete (commits 6c68b83..744858e, diff verified)
Task 11: dispatched (model sonnet, base 744858e, report C:/Users/DELL/AppData/Local/Temp/claude/C--XionTech-LandingPage/f753fe58-8a41-440f-be5a-fbd7a1607dc9/scratchpad/66-t11-report.md)
Task 11: red — npx vitest run src/components/careers/job-application-form.test.tsx — failed: component file missing (import error)
Task 11: green — same command with coverage — 25 passed (25); 100% lines, 96.72% branches
Task 11: review — skipped — controller rule for this run: one review layer inside the build; step 4 covers it
Task 11: complete (commits e929fdd..9e1bb0e, diff verified)
Task 12: dispatched (model sonnet, base 9e1bb0e, report C:/Users/DELL/AppData/Local/Temp/claude/C--XionTech-LandingPage/f753fe58-8a41-440f-be5a-fbd7a1607dc9/scratchpad/66-t12-report.md)
Task 14: dispatched (model sonnet, base 6748e63, batched with Task 12: the components' class-guard test needs the CSS; report C:/Users/DELL/AppData/Local/Temp/claude/C--XionTech-LandingPage/f753fe58-8a41-440f-be5a-fbd7a1607dc9/scratchpad/66-t12-report.md)
Task 12: red — npx vitest run src/components/careers src/lib/careers — 6 failed (job-hero / job-details modules missing; roleTypeLabel is not a function)
Task 12: green — same command with coverage on job-hero.tsx, job-details.tsx, open-roles.ts — 129 passed in 7 files; 100% lines and branches
Task 14: no-red (CSS port; the class-guard test `undefinedClasses` in src/components/careers/job.test.tsx failed red with Task 12 and passes with these rules; look checked by the controller's browser walk)
Task 12: review — skipped — controller rule for this run: one review layer inside the build; step 4 covers it
Task 14: review — skipped — same rule
Task 12: minor — src/components/careers/job-details.tsx CheckList: `key={item}` gives duplicate keys if an editor types the same line twice
Task 12: complete (commits 6748e63..1aa3d02, diff verified; section uses `sec surface-paper` because plain `.sec` has no background)
Task 14: complete (commits 6748e63..1aa3d02, diff verified)
Task 13: dispatched (model sonnet, base 1aa3d02, report C:/Users/DELL/AppData/Local/Temp/claude/C--XionTech-LandingPage/f753fe58-8a41-440f-be5a-fbd7a1607dc9/scratchpad/66-t13-report.md)
