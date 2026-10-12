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
