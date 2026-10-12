# Build ledger — spec: D:/XionTech-LandingPage/_bmad-output/implementation-artifacts/spec-products-roadmap-draw-in.md

Task 1: dispatched (model sonnet, base 069fb36, report C:/Users/SONNGU~1/AppData/Local/Temp/claude/d--XionTech-LandingPage/1c6e4bbb-fba5-43bd-96d5-acf2d6db5914/scratchpad/d1-report.md)
Task 1: red — npx vitest run src/app/type-scale.test.ts — failed on hard-coded weight 700 (and 600 outside b/strong)
Task 1: green — npx vitest run src/app/type-scale.test.ts src/lib/design src/content — 199 passed; lint, typecheck, format clean
Task 1: review — pass — 0 critical, 0 important, 1 minor (lock file checked by controller: no three/motion entries)
Task 1: minor — src/content/products.test.ts:4-9 trimmed to the intro assertion until task 2
Task 1: complete (commits 069fb36..2b72900, diff verified)
Task 2: dispatched (model sonnet, base f10f3a8, report C:/Users/SONNGU~1/AppData/Local/Temp/claude/d--XionTech-LandingPage/1c6e4bbb-fba5-43bd-96d5-acf2d6db5914/scratchpad/d2-report.md)
Task 3: dispatched (model sonnet, base f10f3a8, report C:/Users/SONNGU~1/AppData/Local/Temp/claude/d--XionTech-LandingPage/1c6e4bbb-fba5-43bd-96d5-acf2d6db5914/scratchpad/d2-report.md)
Task 2: red — npx vitest run src/content/products.test.ts — with campus removed from laneOf: "campus: expected undefined to be defined" and the known-lane check failed
Task 2: green — npx vitest run src/content/products.test.ts — 8 passed
Task 3: red — npx vitest run src/components/products/roadmap/road-stop-dialog.test.tsx — with the coordinate check broken: "stays open on a click inside the box" / "closes on a click outside the box" failed
Task 3: green — npx vitest run src/components/products — map and roadmap 21 passed; products and content 72 passed
Task 2: review — pass — batched with task 3: 0 critical, 0 important, 4 minor
Task 3: review — pass — batched with task 2
Task 3: minor — open-app-dialog.test.ts:41-51, road-stop-dialog.test.tsx:105-115 prototype stubs replaced per test but not restored to the originals
Task 3: minor — road-stop-dialog.test.tsx:275-279 hand-over from the last stop checks one button with a hard-coded pd-iot; backdrop boundaries untested
Task 2: minor — src/content/products.test.ts:357-362 IoT stop asserted via features[1], not a literal
Task 2: complete (commits f10f3a8..14f29b2, diff verified)
Task 3: complete (commits 14f29b2..f033900, diff verified)
Task 4: dispatched (model opus, base 2fce5e0, report C:/Users/SONNGU~1/AppData/Local/Temp/claude/d--XionTech-LandingPage/1c6e4bbb-fba5-43bd-96d5-acf2d6db5914/scratchpad/d4-report.md)
Task 4: fix round 1/5 (narrow per-stop observers with data-in and constant delays; focused card never dimmed; mask region widened with round caps)
Task 4: fix round 2/5 (layout switch mid-reveal sets on and shows all stops; round cap only when not armed)
Task 4: red — npx vitest run src/components/products/journey/road-map.test.tsx — 8 of 9 failed (reveal did not exist)
Task 4: green — npx vitest run src/components/products src/lib/design src/app/type-scale.test.ts — 211 passed
Task 4: review — fail — 0 critical, 2 important (narrow single observer stuck/out of sight; dimmed focus ring), 3 minor (mask crop, caps, e2e at 390)
Task 4: review — fail — re-review of 393a81f: 3 of 3 closed; 1 new important (narrow-to-wide switch left armed), 1 minor (round-cap dot)
Task 4: review — pass — re-review of 95b8d6e: 2 of 2 closed; 214 passed
Task 4: minor — road draws linear (UX row updated: pins pop as the road reaches them); FlowReveal phase logic duplicated (possible Sonar CPD)
Task 4: complete (commits 2fce5e0..95b8d6e, diff verified)
Task 5: dispatched (model sonnet, base 0aba122, report C:/Users/SONNGU~1/AppData/Local/Temp/claude/d--XionTech-LandingPage/1c6e4bbb-fba5-43bd-96d5-acf2d6db5914/scratchpad/d5-report.md)
Task 5: red — npx vitest run src/app/products — 4 of 5 failed (old audience-flow page test)
Task 5: green — npx vitest run src/app/products 5 passed; npx playwright test e2e/products.spec.ts --project=a11y 8 passed; npm run test:smoke 15 passed
Task 5: review — pass — 0 critical, 0 important, 2 minor
Task 5: minor — e2e/products.spec.ts:63 roadmap asserted by count, not toBeVisible; :72 expects armed before scroll at 1280x500 (possible race)
Task 5: minor — road-map.tsx class rm-end-start has no CSS rule (excluded in page.test)
Task 5: complete (commits 0aba122..d1935ed, diff verified)
Task 4: fix round 3/5 (reveal by clip-path wipe and scale, no opacity: axe contrast passes; .rm-open 25px tall; rm-end-start removed; frozen intent renegotiated by Sammy: wipe, hidden until revealed)
Task 5: fix round 1/5 (e2e checks the wipe opens via elementFromPoint; toBeVisible; armed asserted before scroll at 1280x400)
Task 4: review — pass — re-review of d82d84c with 05f748d: 4 of 4 closed, 2 minor (stacked comments on .rm-open; armed pin scale 0 — confirm with live axe)
Task 5: review — pass — included in the round-3 re-review
Acceptance: verification — npm run lint && npm run typecheck && npm run format:check — exit 0 — clean
Acceptance: verification — npm test — exit 0 — Test Files 88 passed (88); Tests 1280 passed (1280)
Acceptance: verification — npm run test:coverage && npm run coverage:diff — exit 0 — Total 127 lines, Missing 0, Coverage 100%; products/journey branches 97.91%
Acceptance: verification — npm run test:smoke — exit 0 — 15 passed (11.6s)
Acceptance: verification — npm run build — exit 0 — ○ /products static
Acceptance: verification — npx playwright test --project=a11y — exit 1 — 48 passed, 1 failed: / color-contrast .w-more-trigger (known Home flake, deferred)
Acceptance: verification — npx playwright test --project=a11y — exit 0 — 49 passed (1.2m) (re-capture)
Acceptance: manual — wide walk — observed: armed at load, on after scroll-in, 6 of 6 cards shown after the draw, CLS 0.0000; card opens modal, Next → Attendance recorded, Esc closes with focus on "1. Student arrives"; hand-over opens #pd-sxp
Acceptance: manual — load states — observed: tall viewport at load → on (no replay); reduced motion → static, 6 of 6 shown
Acceptance: manual — narrow walk 390 — observed: armed at load with no stop shown, stops mark in as they scroll in (1-2, then 3-5, then 6); no sideways scroll; faint light seams where the narrow bends join
Acceptance: evidence — spec-products-roadmap-draw-in-evidence/verification.txt — 22138 bytes — sha256 cb8cbde0c49d — verification.txt
Acceptance: evidence — spec-products-roadmap-draw-in-evidence/walk.mjs — 5208 bytes — sha256 6893227adb70 — walk.mjs
Acceptance: evidence — spec-products-roadmap-draw-in-evidence/walk-output.txt — 553 bytes — sha256 f1732b1f8e13 — walk-output.txt
Acceptance: evidence — spec-products-roadmap-draw-in-evidence/wide-400ms.png — 66798 bytes — sha256 bd5533a2c606 — wide-400ms.png
Acceptance: evidence — spec-products-roadmap-draw-in-evidence/wide-1200ms.png — 139383 bytes — sha256 0453cb48b9e0 — wide-1200ms.png
Acceptance: evidence — spec-products-roadmap-draw-in-evidence/wide-3000ms.png — 168822 bytes — sha256 cbc8c2c1501a — wide-3000ms.png
Acceptance: evidence — spec-products-roadmap-draw-in-evidence/reduced.png — 207291 bytes — sha256 b1e8a143b951 — reduced.png
Acceptance: evidence — spec-products-roadmap-draw-in-evidence/narrow-step-1.png — 84465 bytes — sha256 7acbf4a4e7dd — narrow-step-1.png
Acceptance: evidence — spec-products-roadmap-draw-in-evidence/narrow-step-2.png — 91443 bytes — sha256 bae7c009d426 — narrow-step-2.png
Acceptance: evidence — spec-products-roadmap-draw-in-evidence/narrow-step-3.png — 85181 bytes — sha256 df71edb549e8 — narrow-step-3.png
Acceptance: evidence — spec-products-roadmap-draw-in-evidence/narrow-step-4.png — 86881 bytes — sha256 0a1b7f2b9b6a — narrow-step-4.png
