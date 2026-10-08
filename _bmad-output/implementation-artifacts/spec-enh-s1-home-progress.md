# Build ledger — spec: D:/XionTech-LandingPage/_bmad-output/implementation-artifacts/spec-enh-s1-home.md

Task 1: dispatched (model sonnet, base c8cb49c, report C:/Users/SONNGU~1/AppData/Local/Temp/s1-task1-report.md)
Task 1: red — npx vitest run src/components/sections/process-flow.test.tsx — 1 failed (old short step 03 copy)
Task 1: green — npx vitest run src/components src/content src/app — 645 passed
Task 1: review — pass — 0 critical, 0 important, 1 minor
Task 1: minor — src/content/services.ts:110 Services title duplicates Home's string (intended until E-S2)
Task 1: complete (commits c8cb49c..3224d63, diff verified)
Task 2: dispatched (model sonnet, base 3224d63, report C:/Users/SONNGU~1/AppData/Local/Temp/s1-task2-report.md)
Task 2: no-red (pure move of aboutValues to values.ts plus heading copy; covered by existing about tests, 30 passed)
Task 2: review — pass — 0 critical, 0 important, 2 minor
Task 2: minor — src/content/values.ts aboutValues/AboutValue names kept though shared (rename in E-S3)
Task 2: minor — src/content/values.ts homeValuesHeading untested until Home uses it (Task 5)
Task 2: complete (commits 3224d63..e778b84, diff verified)
Task 3: dispatched (model sonnet, base e778b84, report C:/Users/SONNGU~1/AppData/Local/Temp/s1-task3-report.md)
Task 3: red — npx vitest run src/components/home/home-hero.test.tsx — 6 failed (new H1 region not found)
Task 3: green — npx vitest run src/components/home src/content — 58 passed
Task 3: review — pass — 0 critical, 0 important, 2 minor
Task 3: minor — src/components/home/home-hero.test.tsx:170 "no label" check only catches .label + h1
Task 3: minor — src/app/globals.css E-S1 block: redundant padding-left reset at <=560px
Task 3: complete (commits e778b84..a988e8b, diff verified)
Task 4: dispatched (model sonnet, base a988e8b, report C:/Users/SONNGU~1/AppData/Local/Temp/s1-task4-report.md)
Task 4: red — npx vitest run src/components/home/capabilities.test.tsx — failed (./capabilities did not exist)
Task 4: green — npx vitest run src/components/home/capabilities.test.tsx — 9 passed
Task 4: fix round 1/5 (removed :focus-within open; trigger pointer-events none when open at <=640px; Enter toggle test)
Task 4: fix round 2/5 (removed pointer-events none on the open trigger; guard test)
Task 4: review — pass — 0 critical, 0 important, 0 minor; 0 of 2 open (re-review after fix round 2)
Task 4: minor — src/components/home/more-industries.tsx list aria-hidden; button aria-label replaces visible "+3" (label-in-name)
Task 4: minor — src/app/globals.css .w-more:hover at <=640px may jump layout on sticky-hover touch devices
Task 4: complete (commits a988e8b..adffa4c, diff verified)
Task 5: dispatched (model sonnet, base adffa4c, report C:/Users/SONNGU~1/AppData/Local/Temp/s1-task5-report.md)
Task 5: red — npx vitest run src/components/home/home-process.test.tsx src/components/home/home-values.test.tsx — failed (region "How we approach." not found; home-values module missing)
Task 5: green — same command — 6 passed
Task 5: review — pass — 0 critical, 0 important, 2 minor
Task 5: minor — src/components/home/home-values.test.tsx:17 heading id asserted only as not About's
Task 5: minor — src/app/globals.css unlayered transparent background on .home-values/.home-process pending Task 6 wrapper
Task 5: complete (commits adffa4c..3a67875, diff verified)
Task 6: dispatched (model opus, base 3a67875, report C:/Users/SONNGU~1/AppData/Local/Temp/s1-task6-report.md)
Task 6: red — npx vitest run src/app/page.test.tsx — 4 of 7 failed (no metadata, old order, no Capabilities, bento present)
Task 6: green — npx vitest run src/app/page.test.tsx — 7 passed
Task 6: fix round 1/5 (light door colours inside hero; industries list readable without JS, hidden after hydration; .hl::after content none)
Task 6: review — pass — 0 critical, 0 important, 3 minor (task commit + fix round 1)
Task 6: minor — src/components/home/more-industries.tsx:20-27 server-open list collapses on hydration (layout shift; scripting:none alternative)
Task 6: minor — src/components/home/more-industries.tsx:26-27,45 with mouse hover a second click cannot hide the list until the pointer leaves
Task 6: minor — src/app/page.test.tsx, home-hero.test.tsx visual results (navy to doors middle, readable door) rest on CSS-text tests and the walk
Task 6: complete (commits 3a67875..89db4eb, diff verified)
Task 7: dispatched (model sonnet, base 89db4eb, report C:/Users/SONNGU~1/AppData/Local/Temp/s1-task7-report.md)
Task 7: no-red (tests only: assertions updated to the new Home; npm test 1145 passed, test:smoke 15 passed)
Task 7: review — pass — 0 critical, 0 important, 1 minor
Task 7: minor — e2e/home-hero.spec.ts:19-21, src/app/no-js.test.tsx:42 "How we approach." checked as a raw-HTML substring
Task 7: complete (commits 89db4eb..7a42764, diff verified)
Acceptance: verification — npm run lint && npm run typecheck && npm run format:check — exit 0 — All matched files use Prettier code style!
Acceptance: verification — npm test — exit 0 — Test Files 75 passed (75), Tests 1145 passed (1145)
Acceptance: verification — npm run test:coverage && npm run coverage:diff — exit 0 — Coverage: 100%; C1 ok: 33 changed file(s) with branch coverage >= 80%
Acceptance: verification — npm run test:smoke — exit 0 — 15 passed
Acceptance: verification — npm run build — exit 0 — Generating static pages (15/15)
Acceptance: evidence — spec-enh-s1-home-evidence/verification.txt — 7344 bytes — sha256 f036ff204663 — transcript of the five declared commands, all exit 0
Acceptance: evidence — spec-enh-s1-home-evidence/reflow-test.txt — 191 bytes — sha256 71f63d545e8b — npx playwright test --project=a11y -g "Home at 390px": 1 passed
Acceptance: evidence — spec-enh-s1-home-evidence/walk-output.txt — 3272 bytes — sha256 d92a8bb2a9eb — walk.mjs output on the production build: every UX line
Acceptance: evidence — spec-enh-s1-home-evidence/home-1280-top.png — 352767 bytes — sha256 5637396d1758 — hero at 1280: H1, Get in touch, five figures, doors starting
Acceptance: evidence — spec-enh-s1-home-evidence/home-1280-doors-edge.png — 275671 bytes — sha256 0fb8b17b6f36 — doors side by side; navy ends at their middle; light card readable
Acceptance: evidence — spec-enh-s1-home-evidence/home-1280-industries-open.png — 32336 bytes — sha256 3497ff8b3c62 — +3 opened by click: Healthcare, Logistics, Private Equity
Acceptance: evidence — spec-enh-s1-home-evidence/home-1280-process-head.png — 52446 bytes — sha256 e106d4d8dbf9 — How we approach. light, See how we work on the heading row
Acceptance: evidence — spec-enh-s1-home-evidence/home-1280-full.png — 1439528 bytes — sha256 2b0b20e90685 — whole Home at 1280
Acceptance: evidence — spec-enh-s1-home-evidence/home-390-full.png — 1165754 bytes — sha256 892e6f1dce2f — whole Home at 390, one column, no sideways scroll
Acceptance: evidence — spec-enh-s1-home-evidence/home-390-industries-tapped.png — 30490 bytes — sha256 9944dd103b81 — +3 opened by a real touch tap at 390
Acceptance: evidence — spec-enh-s1-home-evidence/home-nojs-industries.png — 32336 bytes — sha256 3497ff8b3c62 — JavaScript off: industries visible (same pixels as the opened state)
Acceptance: evidence — spec-enh-s1-home-evidence/observed.md — 2920 bytes — sha256 cb6ae9f6257e — per-surface observations
Acceptance: manual — walk / at 1280 and 390 on a production build (next start -p 3005, Chrome) — observed: every UX line as in observed.md; mouse second click leaves the list shown while hovering, touch second tap hides it; /about shows 6 values; /services keeps its title with the new 03 copy
Task 6: fix round 2/5 (step-04 review patches: +3 click/focus-out/Escape clear the hover reveal, typed icon map, "+3" in the accessible name, browser test for doors and reveal, stronger hero/values tests, redundant reset removed)
Task 6: review — pass — 0 critical, 0 important, 1 minor; 0 of 8 patch findings open
Task 6: minor — src/components/home/more-industries.tsx Escape only with focus inside the reveal (deferred)
Acceptance: verification — npm run lint && npm run typecheck && npm run format:check — exit 0 — All matched files use Prettier code style!
Acceptance: verification — npm test — exit 0 — Test Files 75 passed (75), Tests 1148 passed (1148)
Acceptance: verification — npm run test:coverage && npm run coverage:diff — exit 0 — Coverage: 100%; C1 ok: 38 changed file(s) with branch coverage >= 80%
Acceptance: verification — npm run test:smoke — exit 0 — 15 passed
Acceptance: verification — npm run build — exit 0 — Generating static pages (15/15)
Acceptance: evidence — spec-enh-s1-home-evidence/verification.txt — 7240 bytes — sha256 634130e549aa — transcript of the five declared commands after the review patches, all exit 0
Acceptance: evidence — spec-enh-s1-home-evidence/browser-tests.txt — 342 bytes — sha256 016c75c47d12 — npx playwright test --project=a11y -g "Home at 390px|doors straddle": 2 passed
Acceptance: evidence — spec-enh-s1-home-evidence/walk-output.txt — 3535 bytes — sha256 e77022986891 — walk.mjs on the patched production build: every UX line
Acceptance: evidence — spec-enh-s1-home-evidence/walk.mjs — 12546 bytes — sha256 6f5e541f50d5 — the walk script that produced the screenshots and walk-output.txt
Acceptance: evidence — spec-enh-s1-home-evidence/home-1280-top.png — 325780 bytes — sha256 f726f328cd01 — hero at 1280
Acceptance: evidence — spec-enh-s1-home-evidence/home-1280-doors-edge.png — 277674 bytes — sha256 e579b5c649c8 — doors side by side, navy ends at their middle, light card readable
Acceptance: evidence — spec-enh-s1-home-evidence/home-1280-industries-open.png — 32336 bytes — sha256 3497ff8b3c62 — +3 opened by click
Acceptance: evidence — spec-enh-s1-home-evidence/home-1280-process-head.png — 63086 bytes — sha256 152292030ca9 — How we approach. with See how we work at the right of the heading row
Acceptance: evidence — spec-enh-s1-home-evidence/home-1280-full.png — 1440290 bytes — sha256 fab3cbb7651d — whole Home at 1280
Acceptance: evidence — spec-enh-s1-home-evidence/home-390-full.png — 1164532 bytes — sha256 8f05065553e6 — whole Home at 390
Acceptance: evidence — spec-enh-s1-home-evidence/home-390-industries-tapped.png — 30490 bytes — sha256 9944dd103b81 — +3 opened by a real touch tap (hasTouch context)
Acceptance: evidence — spec-enh-s1-home-evidence/home-nojs-industries.png — 32336 bytes — sha256 3497ff8b3c62 — JavaScript off: industries visible
Acceptance: evidence — spec-enh-s1-home-evidence/observed.md — 3191 bytes — sha256 64b702666238 — per-surface observations matching walk-output.txt
Acceptance: manual — walk / at 1280, 768 and 390 (touch context) on the patched production build (next start -p 3005, Chrome) — observed: light layer starts at 1013 = door middle; doors 2 columns, lower halves hit their links; +3 hides on second click, Tab away, Escape and second touch tap; See how we work right of the heading block, aligned to the row bottom; /about 6 values; /services title kept with new 03 copy
Acceptance: evidence — spec-enh-s1-home-evidence/verification.txt — 7237 bytes — sha256 b53893f94f61 — transcript of the five declared commands after the review patches, all exit 0 (line endings normalised to LF to match the committed blob; supersedes the row above)
