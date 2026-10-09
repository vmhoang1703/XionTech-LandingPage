# Build ledger — spec: D:/XionTech-LandingPage/_bmad-output/implementation-artifacts/spec-enh-s4-footer-offices.md

Task 1: dispatched (model sonnet, base 504e2b6, report C:/Users/SONNGU~1/AppData/Local/Temp/s4-task1-report.md)
Task 1: red — npx vitest run src/content/offices.test.ts — 1 failed (footerOffices undefined)
Task 1: green — npx vitest run src/content/offices.test.ts — 6 passed
Task 1: review — pass — 0 critical, 0 important, 2 minor (WhatsApp label shows the word; hrefs duplicated) — sent to the ladder
Task 1: fix round 1/5 (WhatsApp visible label is the number; footer hrefs derived from plano/hcmc via contactByPrefix)
Task 1: fix round 2/5 (contactByPrefix exported and its throw tested: offices.ts 100% lines and branches)
Task 1: review — pass — 0 critical, 0 important, 0 minor; 0 of 3 open (re-review after fix round 2)
Task 1: complete (commits 504e2b6..dba6c86, diff verified)
Task 2: dispatched (model sonnet, base dba6c86, report C:/Users/SONNGU~1/AppData/Local/Temp/s4-task2-report.md)
Task 2: red — npx vitest run src/components/layout/site-footer.test.tsx — Products and Company tests failed on the old labels and hrefs
Task 2: green — npx vitest run src/components/layout/site-footer.test.tsx src/content — 36 passed
Task 2: review — pass — 0 critical, 0 important, 2 minor
Task 2: minor — src/components/layout/site-footer.test.tsx:147 link-count threshold >15 is loose (18 links now)
Task 2: minor — src/content/services.test.ts:15 #process exclusion hard-coded
Task 2: complete (commits dba6c86..ddc6549, diff verified)
Task 3: dispatched (model sonnet, base ddc6549, report C:/Users/SONNGU~1/AppData/Local/Temp/s4-task3-report.md)
Task 3: red — npx vitest run src/components/layout/site-footer.test.tsx — 2 failed (office order, ridge)
Task 3: green — npx vitest run src/components/layout src/content src/app — 353 passed
Task 3: review — pass — 0 critical, 0 important, 2 minor
Task 3: minor — src/components/layout/site-footer.test.tsx:82-84 city-label not.toMatch partly vacuous ($ anchor)
Task 3: minor — src/components/layout/site-footer.test.tsx:128 pins the Tailwind class "relative"
Task 3: complete (commits ddc6549..cc1156e, diff verified)
Task 4: dispatched (model sonnet, base cc1156e, report C:/Users/SONNGU~1/AppData/Local/Temp/s4-task4-report.md)
Task 4: dispatched (model sonnet, base cc1156e, report C:/Users/SONNGU~1/AppData/Local/Temp/s4-task4-report.md) — re-dispatch: the earlier launch was cancelled by the user before it ran; nothing landed
Task 4: red — npx playwright test --project=a11y -g "footer ridge" — 3 of 4 failed (/careers 1280: last link bottom 190 vs ridge top 134)
Task 4: green — same command — 4 passed; full a11y project 30 passed
Task 4: fix round 1/5 (instant scroll; both rects read in one evaluate)
Task 4: review — pass — 0 critical, 0 important, 0 minor; 0 of 1 open (re-review after fix round 1)
Task 4: minor — e2e/a11y.spec.ts takes the last link in main > :last-child; trailing non-link content is not checked
Task 4: complete (commits cc1156e..17f954d, diff verified)
Acceptance: verification — npm run lint && npm run typecheck && npm run format:check — exit 0 — All matched files use Prettier code style!
Acceptance: verification — npm test — exit 0 — Test Files 83 passed (83), Tests 1237 passed (1237)
Acceptance: verification — npm run test:coverage && npm run coverage:diff — exit 0 — Coverage: 100%; C1 ok: 3 changed file(s) with branch coverage >= 80%
Acceptance: verification — npm run test:smoke — exit 0 — 15 passed
Acceptance: verification — npm run build — exit 0 — compiled successfully
Acceptance: verification — npx playwright test --project=a11y — exit 0 — 30 passed
Acceptance: evidence — spec-enh-s4-footer-offices-evidence/verification.txt — 12033 bytes — sha256 fb4e88026396 — transcript of the six declared commands, all exit 0
Acceptance: evidence — spec-enh-s4-footer-offices-evidence/walk.mjs — 7547 bytes — sha256 ada46e5d8ad2 — the walk that produced walk-output.txt and the screenshots
Acceptance: evidence — spec-enh-s4-footer-offices-evidence/walk-output.txt — 4297 bytes — sha256 906457f717b5 — walk output on the production build: every UX line, nine routes at 1280 and 390
Acceptance: evidence — spec-enh-s4-footer-offices-evidence/footer-1280.png — 136794 bytes — sha256 608efb71a55e — ridge above the footer under the Home contact section
Acceptance: evidence — spec-enh-s4-footer-offices-evidence/footer-1280-full.png — 85689 bytes — sha256 367a7f96c3ff — footer at 1280: five columns, offices with icons
Acceptance: evidence — spec-enh-s4-footer-offices-evidence/footer-390.png — 86716 bytes — sha256 8658e833a49a — footer at 390: one column, 72px ridge
Acceptance: evidence — spec-enh-s4-footer-offices-evidence/careers-end-1280.png — 144825 bytes — sha256 29d39037641c — Careers roles end above the ridge at 1280
Acceptance: evidence — spec-enh-s4-footer-offices-evidence/careers-end-390.png — 60661 bytes — sha256 5149b7665014 — Careers roles end above the ridge at 390
Acceptance: evidence — spec-enh-s4-footer-offices-evidence/observed.md — 2240 bytes — sha256 c0550027b432 — per-surface observations
Acceptance: manual — walk nine routes at 1280 and 390 plus the footer at 900 on a production build (next start -p 3005, Chrome) — observed: ridge 120/72px, columns 5/2/1, every link target, Vietnam first with icons, no Vietnam email, every page's last content above the ridge, About/Demo/Home contact unchanged
Task 3: fix round 1/5 (step-04 review patches: product anchors test, phone digits test, hcmc.tag reuse, explicit icon picker, exact footer assertions, e2e max-bottom on six routes)
Task 3: review — pass — 0 critical, 0 important, 2 minor; 0 of 5 open (patch re-review); controller patch e83d868 removed the untestable fallback
Acceptance: verification — npm run lint && npm run typecheck && npm run format:check — exit 0 — All matched files use Prettier code style!
Acceptance: verification — npm test — exit 0 — Test Files 83 passed (83), Tests 1240 passed (1240)
Acceptance: verification — npm run test:coverage && npm run coverage:diff — exit 0 — Coverage: 100%; C1 ok: 3 changed file(s) with branch coverage >= 80%
Acceptance: verification — npm run test:smoke — exit 0 — 15 passed
Acceptance: verification — npm run build — exit 0 — compiled successfully
Acceptance: verification — npx playwright test --project=a11y — exit 0 — 38 passed (footer ridge on six routes at 1280 and 390 included)
Acceptance: evidence — spec-enh-s4-footer-offices-evidence/verification.txt — 12559 bytes — sha256 f67466f126c1 — transcript of the six declared commands after the review patches, all exit 0
Acceptance: evidence — spec-enh-s4-footer-offices-evidence/walk.mjs — 7547 bytes — sha256 ada46e5d8ad2 — the walk that produced walk-output.txt and the screenshots
Acceptance: evidence — spec-enh-s4-footer-offices-evidence/walk-output.txt — 4297 bytes — sha256 4dc77e087049 — walk on the patched production build: every UX line, nine routes at 1280 and 390
Acceptance: evidence — spec-enh-s4-footer-offices-evidence/footer-1280.png — 136794 bytes — sha256 608efb71a55e — ridge above the footer under the Home contact section
Acceptance: evidence — spec-enh-s4-footer-offices-evidence/footer-1280-full.png — 85689 bytes — sha256 367a7f96c3ff — footer at 1280: five columns, offices with icons
Acceptance: evidence — spec-enh-s4-footer-offices-evidence/footer-390.png — 86710 bytes — sha256 ff88054e030d — footer at 390: one column, 72px ridge
Acceptance: evidence — spec-enh-s4-footer-offices-evidence/careers-end-1280.png — 138957 bytes — sha256 27678f1675f8 — Careers roles end above the ridge at 1280
Acceptance: evidence — spec-enh-s4-footer-offices-evidence/careers-end-390.png — 60661 bytes — sha256 5149b7665014 — Careers roles end above the ridge at 390
Acceptance: evidence — spec-enh-s4-footer-offices-evidence/observed.md — 2240 bytes — sha256 c0550027b432 — per-surface observations
Acceptance: manual — walk nine routes at 1280 and 390 plus the footer at 900 on the patched production build (next start -p 3005, Chrome) — observed: ridge 120/72px, columns 5/2/1, product links land on their cards at 88px, How we work heading visible, Vietnam Delivery Center then US Delivery Center with icons, no Vietnam email, all 19 page-end checks clear the ridge, About/Demo offices unchanged
