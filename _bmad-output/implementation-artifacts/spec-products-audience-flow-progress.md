# Build ledger — spec: D:/XionTech-LandingPage/_bmad-output/implementation-artifacts/spec-products-audience-flow.md

Task 1: dispatched (model sonnet, base 63d9c59, report C:/Users/SONNGU~1/AppData/Local/Temp/claude/d--XionTech-LandingPage/1c6e4bbb-fba5-43bd-96d5-acf2d6db5914/scratchpad/t1-report.md)
Task 1: no-red (dependency change, no behaviour; typecheck passes, runtime audit unchanged: next, sharp, source-map-js pre-existing)
Task 1: review — pass — 0 critical, 0 important, 1 minor
Task 1: minor — package.json:52 @types/three is ^0.186.0 while three is pinned 0.186.1 (repo convention for types)
Task 1: complete (commits 63d9c59..f7e6dd2, diff verified)
Task 2: dispatched (model sonnet, base 8f9e8d6, report C:/Users/SONNGU~1/AppData/Local/Temp/claude/d--XionTech-LandingPage/1c6e4bbb-fba5-43bd-96d5-acf2d6db5914/scratchpad/t2-report.md)
Task 2: red — npx vitest run src/content/products.test.ts — TypeError reading 'chapters' (audienceFlow not exported)
Task 2: green — npx vitest run src/content/products.test.ts — 11 passed
Task 2: review — pass — 0 critical, 0 important, 2 minor
Task 2: minor — src/content/products.ts:154 as const does not narrow chapters (chapter() results widened)
Task 2: minor — src/content/products.ts:131,133 appById(app) called twice; products.test.ts:18,49 weak non-empty asserts for lede and audience labels
Task 2: complete (commits 8f9e8d6..2018e9d, diff verified)
Task 3: dispatched (model opus, base 8fa6fce, report C:/Users/SONNGU~1/AppData/Local/Temp/claude/d--XionTech-LandingPage/1c6e4bbb-fba5-43bd-96d5-acf2d6db5914/scratchpad/t3-report.md)
Task 3: red — npx vitest run src/components/products/flow/campus-scene.test.ts — 13 of 16 failed against a wrong-value stub
Task 3: green — npx vitest run src/components/products/flow/campus-scene.test.ts — 16 passed, campus-scene.ts 100% covered
Task 3: review — pass — 0 critical, 0 important, 2 minor
Task 3: minor — src/components/products/flow/campus-scene.ts:131 clamp01(NaN) gives NaN, chapterAt(NaN) undefined (not reachable via Motion useScroll)
Task 3: minor — src/components/products/flow/campus-scene.ts:237 hall position hard-coded to match PLACE_POSITIONS.rooftop
Task 3: complete (commits 8fa6fce..b51b1a7, diff verified)
Task 4: dispatched (model opus, base e283dad, report C:/Users/SONNGU~1/AppData/Local/Temp/claude/d--XionTech-LandingPage/1c6e4bbb-fba5-43bd-96d5-acf2d6db5914/scratchpad/t4-report.md)
Task 4: red — npx vitest run src/components/products/flow/campus-canvas.test.tsx — 14 of 15 failed against a return-null stub
Task 4: green — npx vitest run src/components/products/flow/campus-canvas.test.tsx — 15 passed; 100% lines, 93% branches
Task 4: review — pass — 0 critical, 0 important, 5 minor (warnings resolved: hidden SSR canvas counts as no visible canvas, as in hero-silk; paused sky redraw on scroll fits "still frame per chapter")
Task 4: minor — campus-canvas.tsx:200-205 stage kept in memory after webglcontextlost, no webglcontextrestored recovery
Task 4: minor — campus-canvas.tsx:132-139 setSize clears buffer; paused redraw lands a frame later (possible blank flash on mobile resize); first draw at 300x150
Task 4: minor — campus-canvas.tsx:94 skyAt clones a Color every frame
Task 4: minor — campus-canvas.tsx:118 pageVisible starts true instead of !document.hidden
Task 4: minor — campus-canvas.test.tsx:265-274 tab-hidden test does not assert no new rAF or resume
Task 4: complete (commits e283dad..e2b54fa, diff verified)
Task 5: dispatched (model opus, base 61caceb, report C:/Users/SONNGU~1/AppData/Local/Temp/claude/d--XionTech-LandingPage/1c6e4bbb-fba5-43bd-96d5-acf2d6db5914/scratchpad/t5-report.md)
Task 5: fix round 1/5 (paused un-dims chapters via data-paused + :has rule; renderReady waits for first frame; 15/15 runs)
Task 5: red — npx vitest run src/components/products/flow/audience-flow.test.tsx — 17 of 22 failed against null/zero stubs; class check failed on flow-intro, flow-body and 6 more before CSS
Task 5: green — npx vitest run src/components/products/flow/audience-flow.test.tsx — 22 passed
Task 5: review — fail — 0 critical, 1 important (paused chapters stay dimmed), 3 minor; controller adds confirmed flaky renderReady
Task 5: minor — flow-progress.tsx:29/:394 useMotionValueEvent re-renders FlowProgress each scroll frame (bounded)
Task 5: minor — flow-progress.tsx:363-366 duplicates chapterAt index rule (test pins agreement)
Task 5: minor — audience-flow.tsx:17 / flow-progress.tsx:370 count duplicates children count
Task 5: review — pass — re-review of c11252f: 0 of 2 findings open
Task 5: minor — after webgl fallback (context lost) inactive chapters still dim with no motion control
Task 5: complete (commits 61caceb..c11252f, diff verified)
Task 6: dispatched (model opus, base b8be119, report C:/Users/SONNGU~1/AppData/Local/Temp/claude/d--XionTech-LandingPage/1c6e4bbb-fba5-43bd-96d5-acf2d6db5914/scratchpad/t6-report.md)
Task 6: red — npx vitest run src/app/products/page.test.tsx — expected '' to be 'flow' (old hero first)
Task 6: green — npm test — 87 files, 1307 passed; lint, typecheck, format:check clean
Task 6: review — pass — 0 critical, 0 important, 2 minor
Task 6: minor — src/app/globals.css:3571 .pshow:target navy border is the only card restyle, untested
Task 6: minor — src/app/products/page.test.tsx:70 toggle test only checks the class exists; old "no button link or breadcrumb" assert dropped; SVG fallback letterboxed on tall desktop stage
Task 6: complete (commits b8be119..e48e90f, diff verified)
Task 7: dispatched (model sonnet, base ec26070, report C:/Users/SONNGU~1/AppData/Local/Temp/claude/d--XionTech-LandingPage/1c6e4bbb-fba5-43bd-96d5-acf2d6db5914/scratchpad/t7-report.md)
Task 7: red — npx playwright test --project=a11y — /products keyboard 24px target failed: .flow-link 20px tall (new flow e2e also fails with reduced motion switched off)
Task 7: fix round 1/5 (.flow-link inline-flex min-height 24px)
Task 7: green — npx playwright test --project=a11y — 43 passed, 1 failed (/ .w-more-trigger contrast, untouched home page, passes alone 11/11); npm run test:smoke 15 passed
Task 7: review — pass — 0 critical, 0 important, 3 minor (warning resolved: browser tests tagged @a11y because the smoke project has no browser)
Task 7: minor — e2e/products.spec.ts:83-91,121 rAF counter is page-wide and has no positive control
Task 7: minor — e2e/products.spec.ts:112-117 fixed waitForTimeout sleeps (1.5s)
Task 7: minor — e2e/products.spec.ts:101-107 reduced-motion test requires WebGL; keyboard dialog and #ai-tutor tests are untagged (pre-existing)
Task 7: complete (commits ec26070..9402474, diff verified)
Acceptance: verification — npm run lint && npm run typecheck && npm run format:check — exit 0 — eslint, tsc, prettier clean
Acceptance: verification — npm test — exit 0 — Test Files 87 passed (87); Tests 1307 passed (1307)
Acceptance: verification — npm run test:coverage && npm run coverage:diff — exit 0 — Total 226 lines, Missing 0, Coverage 100%; products/flow branches 93.75%
Acceptance: verification — npm run test:smoke — exit 0 — 15 passed (17.9s)
Acceptance: verification — npm run build — exit 0 — ○ /products static; no page HTML references a chunk containing WebGLRenderer
Acceptance: verification — npx playwright test --project=a11y — exit 0 — 44 passed (1.1m)
Acceptance: manual — walk 1280 scroll — observed: active chapter follows scroll Parent→Teacher and staff→Student→Campus, inactive at 0.8, CLS 0.0000, off-screen 0 rAF in 1s
Acceptance: manual — walk pause/reduced/no-webgl — observed: Pause → "Play motion", data-paused true, 0 rAF in 1s, persists after reload; reduced motion all chapters opacity 1, 0 rAF; --disable-webgl shows SVG fallback, no toggle, 0 page errors
Acceptance: manual — walk widths and links — observed: 1024 canvas 456x708 beside; 390 canvas 358x338 sticky top, no sideways scroll; #ai-tutor link focus ring solid 2px, heading top 181; dialog opens and closes
Acceptance: manual — visual quality — observed: camera too close (classroom and rooftop fill the frame with one block), flat lighting, campus does not read as a campus; motion limited to camera glide and beacon
Acceptance: evidence — spec-products-audience-flow-evidence/verification.txt — 13886 bytes — sha256 8abb6fe0ccfb — verification.txt
Acceptance: evidence — spec-products-audience-flow-evidence/walk.mjs — 7444 bytes — sha256 0b927567b3d1 — walk.mjs
Acceptance: evidence — spec-products-audience-flow-evidence/walk-output.txt — 3035 bytes — sha256 d4c94f09ec46 — walk-output.txt
Acceptance: evidence — spec-products-audience-flow-evidence/flow-1280-intro.png — 126879 bytes — sha256 8fbf43a2cc4d — flow-1280-intro.png
Acceptance: evidence — spec-products-audience-flow-evidence/flow-1280-chapter-1.png — 126749 bytes — sha256 012fe31ba0a4 — flow-1280-chapter-1.png
Acceptance: evidence — spec-products-audience-flow-evidence/flow-1280-chapter-2.png — 117944 bytes — sha256 37393e8a4978 — flow-1280-chapter-2.png
Acceptance: evidence — spec-products-audience-flow-evidence/flow-1280-chapter-3.png — 109879 bytes — sha256 1aa961d06702 — flow-1280-chapter-3.png
Acceptance: evidence — spec-products-audience-flow-evidence/flow-1280-chapter-4.png — 117165 bytes — sha256 5dc0dbc0156f — flow-1280-chapter-4.png
Acceptance: evidence — spec-products-audience-flow-evidence/flow-1280-reduced.png — 110269 bytes — sha256 c954a38e9788 — flow-1280-reduced.png
Acceptance: evidence — spec-products-audience-flow-evidence/flow-1024.png — 104048 bytes — sha256 b32ecd023084 — flow-1024.png
Acceptance: evidence — spec-products-audience-flow-evidence/flow-390.png — 62239 bytes — sha256 9b2df7a7bc9c — flow-390.png
Acceptance: evidence — spec-products-audience-flow-evidence/flow-1280-no-webgl.png — 119583 bytes — sha256 c4797bb3f78f — flow-1280-no-webgl.png
Acceptance: verification — npx playwright test e2e/products.spec.ts --project=a11y — exit 0 — 5 passed (16.2s); deep-link and dialog tests now tagged @a11y so they run (matrix DEEP_LINK)
Task 8: dispatched (model opus, base c27d33b, report C:/Users/SONNGU~1/AppData/Local/Temp/claude/d--XionTech-LandingPage/1c6e4bbb-fba5-43bd-96d5-acf2d6db5914/scratchpad/t8-report.md)
Task 8: fix round 1/5 (rooftop and wing cameras from the plaza side, raycast occlusion test, projected z check; spark kept on same place; small details and clouds cast no shadow, shadows off below 640px)
Task 8: red — npx vitest run src/components/products/flow — scene 12 failed (camera distance 9.49 under floor 14, no trees, details, shadows, path lighting, tick); canvas 6 failed
Task 8: green — npx vitest run src/components/products src/app/products src/lib/design — 239 passed
Task 8: review — fail — 0 critical, 1 important (rooftop chapter hides staff room and lit path), 5 minor
Task 8: minor — campus-scene.ts:154-458 buildCampus ~300 lines in one function
Task 8: minor — campus-scene.ts:161 navy-soft used as a solid fill (DESIGN.md:367 limits it to gradients)
Task 8: minor — globals.css:3525-3532 desktop stage made square (unasked; UX Width row to re-measure)
Task 8: review — pass — re-review of e2c4a39: 0 of 3 findings open; 247 passed
Task 8: minor — campus-canvas.tsx:176 shadows decided once at load (innerWidth)
Task 8: minor — campus-scene.ts:271 staff-room side windows face away from the new camera
Task 8: complete (commits c27d33b..e2c4a39, diff verified)
Acceptance: verification — patches 5f5340a: review patches re-review pass (0 of 6 open); walk found chapter link stops short after a prior scroll; fixed 55d93cc (re-scroll on next frame) and 1935b2e (skip modified clicks, cancel pending frame); both re-reviews pass
Acceptance: verification — npm run lint && npm run typecheck && npm run format:check — exit 0 — clean
Acceptance: verification — npm test — exit 0 — Test Files 87 passed (87); Tests 1345 passed (1345)
Acceptance: verification — npm run test:coverage && npm run coverage:diff — exit 0 — Total 404 lines, Missing 0, Coverage 100%; products/flow branches 96.47%
Acceptance: verification — npm run test:smoke — exit 0 — 15 passed (20.9s)
Acceptance: verification — npm run build — exit 0 — ○ /products static
Acceptance: verification — npx playwright test --project=a11y — exit 1 — 47 passed, 1 failed: / color-contrast .w-more-trigger (known home flake, deferred; home not touched)
Acceptance: verification — npx playwright test --project=a11y --grep "every page type" — exit 0 — 11 passed (26.3s)
Acceptance: verification — npx playwright test e2e/products.spec.ts --project=a11y — exit 0 — 7 passed (33.8s)
Acceptance: manual — final walk 1280 — observed: chapters follow scroll, CLS 0.0000, off-screen 0 rAF, chapter link lands #ai-tutor heading top 181, dialog opens and closes
Acceptance: manual — final walk pause/reduced/no-webgl — observed: Pause → Play motion, 0 rAF, persists after reload, chapters fade to 1; reduced 0 rAF all at 1; no WebGL SVG fallback, no toggle, 0 errors
Acceptance: manual — final walk widths and look — observed: 1280 stage 564x564, 1024 456x456, 390 358x338 sticky, no sideways scroll; campus reads as a campus at every chapter with active place lit; chapter dot filled on the active chapter
Acceptance: evidence — spec-products-audience-flow-evidence/verification.txt — 18577 bytes — sha256 46d8f71e54e4 — verification.txt (final)
Acceptance: evidence — spec-products-audience-flow-evidence/walk.mjs — 7524 bytes — sha256 2eb96d358ca5 — walk.mjs (final)
Acceptance: evidence — spec-products-audience-flow-evidence/walk-output.txt — 3035 bytes — sha256 2aa3972cd9e4 — walk-output.txt (final)
Acceptance: evidence — spec-products-audience-flow-evidence/flow-1280-intro.png — 157394 bytes — sha256 7a7f9b6cba16 — flow-1280-intro.png (final)
Acceptance: evidence — spec-products-audience-flow-evidence/flow-1280-chapter-1.png — 157557 bytes — sha256 320666c9b6e6 — flow-1280-chapter-1.png (final)
Acceptance: evidence — spec-products-audience-flow-evidence/flow-1280-chapter-2.png — 168520 bytes — sha256 7926b313235b — flow-1280-chapter-2.png (final)
Acceptance: evidence — spec-products-audience-flow-evidence/flow-1280-chapter-3.png — 160620 bytes — sha256 938f967beeea — flow-1280-chapter-3.png (final)
Acceptance: evidence — spec-products-audience-flow-evidence/flow-1280-chapter-4.png — 161036 bytes — sha256 a5a3f302bcde — flow-1280-chapter-4.png (final)
Acceptance: evidence — spec-products-audience-flow-evidence/flow-1280-reduced.png — 162222 bytes — sha256 a18a223c367f — flow-1280-reduced.png (final)
Acceptance: evidence — spec-products-audience-flow-evidence/flow-1024.png — 140721 bytes — sha256 aaa46ee23911 — flow-1024.png (final)
Acceptance: evidence — spec-products-audience-flow-evidence/flow-390.png — 78857 bytes — sha256 2d84dfb52739 — flow-390.png (final)
Acceptance: evidence — spec-products-audience-flow-evidence/flow-1280-no-webgl.png — 120194 bytes — sha256 183026fa0608 — flow-1280-no-webgl.png (final)
