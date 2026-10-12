# Build ledger — spec: D:/XionTech-LandingPage/_bmad-output/implementation-artifacts/spec-products-roadmap-scroll-tour.md

Task 1: dispatched (model sonnet, base 99d473f, report C:/Users/SONNGU~1/AppData/Local/Temp/claude/d--XionTech-LandingPage/1c6e4bbb-fba5-43bd-96d5-acf2d6db5914/scratchpad/s1-report.md)
Task 1: red — npx vitest run src/app/products src/components/products/roadmap — 3 failed (#apps present, dialog.pdetail present, "Open … details" button present)
Task 1: green — npx vitest run src/components/products src/app/products src/content src/lib/design — 230 passed; lint, typecheck, format clean
Task 1: review — pass — 0 critical, 0 important, 1 minor
Task 1: minor — src/app/products/page.tsx:11 long merged comment line
Task 1: complete (commits 99d473f..a841588, diff verified)
Task 2: dispatched (model opus, base f037f19, report C:/Users/SONNGU~1/AppData/Local/Temp/claude/d--XionTech-LandingPage/1c6e4bbb-fba5-43bd-96d5-acf2d6db5914/scratchpad/s2-report.md)
Task 2: red — npx vitest run src/components/products/journey/road-map.test.tsx — sxp: expected length 1 but got 0; no .rm-stop[id] CSS rule
Task 2: green — vitest products/app/content 83 passed; test:smoke 15 passed; e2e products 8 passed; lint, typecheck, format clean
Task 2: review — pass — 0 critical, 0 important, 2 minor
Task 2: minor — road-map.test.tsx:108 duplicate anchor sources; :113-115 undefined === undefined loophole
Task 2: minor — wide #pxp/#iot may land with the card under the header until task 3's sentinel (task 3 must check)
Task 2: complete (commits f037f19..568c8aa, diff verified)
Task 3: dispatched (model opus, base 37ced04, report C:/Users/SONNGU~1/AppData/Local/Temp/claude/d--XionTech-LandingPage/1c6e4bbb-fba5-43bd-96d5-acf2d6db5914/scratchpad/s3-report.md)
Task 3: fix round 1/5 (hash not decoded; text floor 11.5px under zoom; road transition after two frames; CSS.supports fallback to static; title comment; scrollIntoView stub restored)
Task 3: red — npx vitest run src/components/products/journey/road-map.test.tsx — 10 failed (tour missing)
Task 3: green — vitest set 255 passed; test:smoke 15; e2e products 10; a11y 51 after the focus/target fix (6b138f0)
Task 3: review — fail — 0 critical, 2 important (URIError on stray % in hash; zoomed text below 11.5px floor), 5 minor
Task 3: review — pass — re-review of 476d488: 5 of 5 closed; vitest 221, e2e products+a11y 51
Task 3: minor — deep links scroll smoothly through stops (accepted; UX row timing set to smooth); cards look bulkier on short windows due to the text floor
Task 3: complete (commits 37ced04..476d488, diff verified)
Task 4: dispatched (model sonnet, base 6364afe, report C:/Users/SONNGU~1/AppData/Local/Temp/claude/d--XionTech-LandingPage/1c6e4bbb-fba5-43bd-96d5-acf2d6db5914/scratchpad/s4-report.md)
Task 4: red — npx playwright test e2e/products.spec.ts --project=a11y — 10 tour tests failed with data-tour disabled (restored)
Task 4: green — vitest src/app/products 6; products e2e 16; smoke 15; a11y spec 56 passed, 1 failed (/ .w-more-trigger known Home flake)
Task 4: review — pass — 0 critical, 0 important, 3 minor
Task 4: minor — e2e/products.spec.ts:15-17 smoke "inside the roadmap" checks order only; helpers duplicate inline logic; step-order and CLS reads timing-sensitive
Task 4: complete (commits 6364afe..b16f392, diff verified)
Acceptance: verification — npm run lint && npm run typecheck && npm run format:check — exit 0 — clean
Acceptance: verification — npm test — exit 0 — Test Files 86 passed (86); Tests 1282 passed (1282)
Acceptance: verification — npm run test:coverage && npm run coverage:diff — exit 0 — Total 156 lines, Missing 0, Coverage 100%; products/journey branches 98.83%
Acceptance: verification — npm run test:smoke — exit 0 — 15 passed
Acceptance: verification — npm run build — exit 0 — success
Acceptance: verification — npx playwright test --project=a11y — exit 0 — 57 passed (1.1m)
Acceptance: manual — tour 1280x800 — observed: steps 1-6 active and selected in order, stage top 88 throughout, fits, no sideways scroll; past the roadmap the demo band is in view; scrolling back to step 3 restores 3; CLS 0.0001
Acceptance: manual — modal and removal — observed: card 2 opens "Attendance recorded", no details button, selected 2, Esc returns focus; #apps 0, app dialogs 0
Acceptance: manual — fit and deep links — observed: fits at 1440x900, 1920x1080, 1366x768; #sxp→2, #pxp→3, #ai-tutor→4, #iot→5, each card fully visible
Acceptance: manual — reduced and phone — observed: reduced motion no tour, nothing active or selected; 390px no tour, stops reveal as scrolled (all six by 1100), no sideways scroll
Acceptance: evidence — spec-products-roadmap-scroll-tour-evidence/verification.txt — 15629 bytes — sha256 d887b74164d9 — verification.txt
Acceptance: evidence — spec-products-roadmap-scroll-tour-evidence/walk.mjs — 6754 bytes — sha256 02271870c2fe — walk.mjs
Acceptance: evidence — spec-products-roadmap-scroll-tour-evidence/walk-output.txt — 1761 bytes — sha256 0ddca7801c89 — walk-output.txt
Acceptance: evidence — spec-products-roadmap-scroll-tour-evidence/tour-step-1.png — 155759 bytes — sha256 14f938d2ac6a — tour-step-1.png
Acceptance: evidence — spec-products-roadmap-scroll-tour-evidence/tour-step-3.png — 169623 bytes — sha256 d3e46bb0be13 — tour-step-3.png
Acceptance: evidence — spec-products-roadmap-scroll-tour-evidence/tour-step-6.png — 183702 bytes — sha256 05a414f2c726 — tour-step-6.png
Acceptance: evidence — spec-products-roadmap-scroll-tour-evidence/after-tour.png — 236558 bytes — sha256 2a332fb2ec20 — after-tour.png
Acceptance: evidence — spec-products-roadmap-scroll-tour-evidence/deeplink-sxp.png — 164301 bytes — sha256 3fa7e7700605 — deeplink-sxp.png
Acceptance: evidence — spec-products-roadmap-scroll-tour-evidence/reduced.png — 196793 bytes — sha256 657a2223da70 — reduced.png
Acceptance: evidence — spec-products-roadmap-scroll-tour-evidence/phone.png — 103545 bytes — sha256 d592e63b3c79 — phone.png
Review: five layers — patches 6a8bd83, re-review pass (8 of 8 closed)
Acceptance: verification — npm run lint && npm run typecheck && npm run format:check — exit 0 — clean
Acceptance: verification — npm test — exit 0 — Test Files 86 passed (86); Tests 1286 passed (1286)
Acceptance: verification — npm run test:coverage && npm run coverage:diff — exit 0 — Total 164 lines, Missing 0, Coverage 100%; products/journey branches 98.87%
Acceptance: verification — npm run test:smoke — exit 0 — 15 passed
Acceptance: verification — npm run build — exit 0 — success
Acceptance: verification — npx playwright test --project=a11y — exit 0 — 57 passed (1.1m)
Acceptance: manual — final tour 1280x800 — observed: steps 1-6 active and selected in order, stage top 88, fits, no sideways scroll; demo band after; back to step 3 restores; CLS 0.0001; modal without details button; #apps 0
Acceptance: manual — final fit and deep links — observed: fits at 1366x768, 1440x900, 1920x1080; #sxp→2, #pxp→3, #ai-tutor→4, #iot→5 with cards fully visible
Acceptance: manual — final reduced and phone — observed: reduced static, nothing selected; 390px stops reveal as scrolled, no sideways scroll
Acceptance: evidence — spec-products-roadmap-scroll-tour-evidence/verification.txt — 15626 bytes — sha256 5a69950684a4 — verification.txt (final)
Acceptance: evidence — spec-products-roadmap-scroll-tour-evidence/walk.mjs — 6754 bytes — sha256 02271870c2fe — walk.mjs (final)
Acceptance: evidence — spec-products-roadmap-scroll-tour-evidence/walk-output.txt — 1761 bytes — sha256 0ddca7801c89 — walk-output.txt (final)
Acceptance: evidence — spec-products-roadmap-scroll-tour-evidence/tour-step-1.png — 155759 bytes — sha256 14f938d2ac6a — tour-step-1.png (final)
Acceptance: evidence — spec-products-roadmap-scroll-tour-evidence/tour-step-3.png — 169631 bytes — sha256 032ffdd96930 — tour-step-3.png (final)
Acceptance: evidence — spec-products-roadmap-scroll-tour-evidence/tour-step-6.png — 183706 bytes — sha256 fc5a20a7352f — tour-step-6.png (final)
Acceptance: evidence — spec-products-roadmap-scroll-tour-evidence/after-tour.png — 236558 bytes — sha256 2a332fb2ec20 — after-tour.png (final)
Acceptance: evidence — spec-products-roadmap-scroll-tour-evidence/deeplink-sxp.png — 164449 bytes — sha256 5376a6756594 — deeplink-sxp.png (final)
Acceptance: evidence — spec-products-roadmap-scroll-tour-evidence/reduced.png — 196793 bytes — sha256 657a2223da70 — reduced.png (final)
Acceptance: evidence — spec-products-roadmap-scroll-tour-evidence/phone.png — 103545 bytes — sha256 d592e63b3c79 — phone.png (final)
