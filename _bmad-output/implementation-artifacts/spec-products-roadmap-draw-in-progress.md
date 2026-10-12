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
