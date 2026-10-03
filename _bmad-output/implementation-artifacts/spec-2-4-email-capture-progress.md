# Build ledger — spec: C:\XionTech\LandingPage\_bmad-output\implementation-artifacts\spec-2-4-email-capture.md

Task 1: dispatched (model sonnet, base 668ef1c, report C:/Users/DELL/AppData/Local/Temp/claude/C--XionTech-LandingPage/f753fe58-8a41-440f-be5a-fbd7a1607dc9/scratchpad/24-t1-report.md)
Task 1: red — npx vitest run src/lib/contact/contact-rules.test.ts — 2 failed | 15 passed (TypeError: isValidEmail is not a function)
Task 1: green — npx vitest run src/lib/contact/contact-rules.test.ts — 17 passed
Task 1: review — pass — 0 critical, 0 important, 1 minor
Task 1: minor — src/lib/contact/contact-rules.test.ts:16-24 no direct cases for ana@x.c or ana@.com
Task 1: complete (commits 668ef1c..825ac2e, diff verified)
Task 2: dispatched (model sonnet, base 825ac2e, report C:/Users/DELL/AppData/Local/Temp/claude/C--XionTech-LandingPage/f753fe58-8a41-440f-be5a-fbd7a1607dc9/scratchpad/24-t2-report.md)
Task 2: red — npx vitest run (submission, delivery, route tests) — 21 failed | 121 passed (valid capture got 400; sendContactMail threw on submission.org)
Task 2: green — npx vitest run src/lib/contact src/app/api/contact — 159 passed; npm test 494 passed
Task 2: review — pass — 0 critical, 0 important, 2 minor
Task 2: minor — src/lib/contact/submission.test.ts:342 no CR/LF row in the invalid-email table (Reply-To guard)
Task 2: minor — src/lib/contact/submission.ts:113 trim + isValidEmail + 254 repeated (contact-rules.ts:58, band next)
Task 2: complete (commits 825ac2e..bfdd161, diff verified)
Task 3: dispatched (model sonnet, base bfdd161, report C:/Users/DELL/AppData/Local/Temp/claude/C--XionTech-LandingPage/f753fe58-8a41-440f-be5a-fbd7a1607dc9/scratchpad/24-t3-report.md)
Task 3: red — npx vitest run src/components/contact/post-submission.test.ts — Failed to resolve import "./post-submission"
Task 3: green — npx vitest run src/components/contact — 55 passed (40 form tests unchanged, 15 new); npm test 509 passed
Task 3: review — pass — 0 critical, 0 important, 0 minor (moved code compared line by line)
Task 3: complete (commits bfdd161..e1400b7, diff verified)
Task 4: dispatched (model sonnet, base e1400b7, report C:/Users/DELL/AppData/Local/Temp/claude/C--XionTech-LandingPage/f753fe58-8a41-440f-be5a-fbd7a1607dc9/scratchpad/24-t4-report.md)
Task 4: red — npx vitest run src/components/contact/capture-band.test.tsx — Failed to resolve import "./capture-band"
Task 4: green — npx vitest run src/components/contact/capture-band.test.tsx — 40 passed; npm test 549 passed
Task 4: review — pass — 0 critical, 0 important, 3 minor
Task 4: minor — capture-band.tsx:406 any server field error shows as the email error (check result.errors.email)
Task 4: minor — capture-band.test.tsx:138-147 trim test cannot fail (input type=email strips spaces)
Task 4: minor — capture-band.test.tsx:166-170 console spies without mockImplementation
Task 4: complete (commits e1400b7..c460aa0, diff verified)
Task 5: dispatched (model sonnet, base c460aa0, report C:/Users/DELL/AppData/Local/Temp/claude/C--XionTech-LandingPage/f753fe58-8a41-440f-be5a-fbd7a1607dc9/scratchpad/24-t5-report.md)
Task 5: red — npx vitest run src/components/contact/contact-form.test.tsx — 3 failed | 42 passed (prefill got '', typed value, scroll called 0 times)
Task 5: green — npx vitest run src/components/contact/contact-form.test.tsx — 45 passed
Task 5: review — pass — 0 critical, 0 important, 3 minor
Task 5: minor — contact-form.test.tsx:57-66 removeItem-only throw not tested
Task 5: minor — contact-form.test.tsx:68-84 #project hash not reset; no hashchange-after-mount test
Task 5: minor — contact-form.test.tsx:65 restoreAllMocks at end of test body, not afterEach
Task 5: complete (commits c460aa0..64ef9a4, diff verified)
Task 6: dispatched (model sonnet, base 64ef9a4, report C:/Users/DELL/AppData/Local/Temp/claude/C--XionTech-LandingPage/f753fe58-8a41-440f-be5a-fbd7a1607dc9/scratchpad/24-t6-report.md)
Task 6: red — npx vitest run src/lib/design/contrast.test.ts — 9 failed (capture rules missing)
Task 6: green — npx vitest run src/lib/design/contrast.test.ts — 142 passed; npm test 563 passed
Task 6: review — pass — 0 critical, 0 important, 3 minor (band carries surface-amber, so --color-focus is navy)
Task 6: minor — globals.css:957-960 focus indicator is box-shadow only; forced-colors mode shows no ring
Task 6: minor — globals.css:516-520 hover glow/background still applies to disabled buttons
Task 6: minor — contrast.test.ts:181-189 transform:none and underline offset not asserted
Task 6: complete (commits 64ef9a4..62b5670, diff verified)
Task 7: dispatched (model sonnet, base 62b5670, report C:/Users/DELL/AppData/Local/Temp/claude/C--XionTech-LandingPage/f753fe58-8a41-440f-be5a-fbd7a1607dc9/scratchpad/24-t7-report.md)
Task 7: red — npx vitest run src/app/page.test.tsx — 1 failed (band heading not found)
Task 7: green — npx vitest run src/app/page.test.tsx — 4 passed; npm run test:smoke 3 passed
Task 7: review — pass — 0 critical, 0 important, 2 minor
Task 7: minor — src/app/page.test.tsx:35-42 order after the placeholder not asserted
Task 7: minor — e2e/smoke.spec.ts:11 response.text() awaited twice
Task 7: complete (commits 62b5670..a567d25, diff verified)
Task 8: dispatched (model sonnet, base a567d25, report C:/Users/DELL/AppData/Local/Temp/claude/C--XionTech-LandingPage/f753fe58-8a41-440f-be5a-fbd7a1607dc9/scratchpad/24-t8-report.md)
Task 8: no-red (documentation only; prettier --check passes)
Task 8: review — pass — 0 critical, 0 important, 2 minor
Task 8: minor — docs/contact-delivery.md:84 "about 3 more sends" assumes the form keeps the same email
Task 8: complete (commits a567d25..3af22e0, diff verified)
Task 7: fix round 1/5 (dispatched: src/app/no-js.test.tsx fails — next/navigation mock lacks useRouter now that Home renders CaptureBand; found by the full npm test)
Task 7: review — pass — re-review of fix round 1: 0 open, 0 new (useRouter mock, band heading asserted in no-JS HTML)
Acceptance: verification — `npm run lint && npm run typecheck && npm run format:check` — exit 0 — clean
Acceptance: verification — `npm test` — exit 1 — "Tests  1 failed | 563 passed" (no-js.test.tsx: next/navigation mock lacked useRouter); fixed in 613f767; re-run exit 0 — "Tests  564 passed (564)"
Acceptance: verification — `npm run test:coverage && npm run coverage:diff` — exit 1 (same test), re-run after 613f767 exit 0 — "Coverage: 100%"; "C1 ok: 9 changed file(s) with branch coverage >= 80% vs origin/develop."
Acceptance: verification — `npm run build && npm run test:smoke` — exit 0 — "3 passed (16.4s)"
Acceptance: verification — `npm audit --omit=dev` — exit 0 — "found 0 vulnerabilities"
Acceptance: manual — UX walk on `npm run dev` with /api/contact intercepted (walk.mjs) — observed: 1280 H2 left of form, amber gradient, navy button, row border computed 1px navy (Chrome rounds 1.5px at 1x; the CSS rule is 1.5px), 3px navy ring on keyboard focus; invalid email → role=alert, aria-invalid, aria-describedby cap-err, focus on field, no request; typing clears; Sending... + disabled; 200 → /demo#form, Product demo tab, Work email filled, no email in URL, storage cleared; project via client push → Outsourcing tab, filled, form in view; 502/429/timeout (15.4 s) → message, email kept, button enabled, still on Home; 900 one column; 390 field above button, touch tap shows the error; no horizontal scroll; /demo has no band. The lede has no top gap (prototype 14px; Minor)
Acceptance: manual — walk correction: the first walk opened /demo then changed only the hash and saw the Product demo tab for #project; probing showed a fresh load and the band's client push both open Outsourcing; the walk now uses the client push
Acceptance: evidence — spec-2-4-email-capture-evidence/verification.txt — 8559 bytes — sha256 8dad6802ae49 — every Verification command, with the npm test failure and the re-run after 613f767
Acceptance: evidence — spec-2-4-email-capture-evidence/walk-output.txt — 1971 bytes — sha256 383d20e2cdeb — UX walk observations L1-L9 and CAP-9
Acceptance: evidence — spec-2-4-email-capture-evidence/walk.mjs — 7324 bytes — sha256 1094a7b9d1be — the walk script
Acceptance: evidence — spec-2-4-email-capture-evidence/band-1280.png — 129129 bytes — sha256 6640cb7214ed — demo band on Home at 1280px
Acceptance: evidence — spec-2-4-email-capture-evidence/band-900.png — 108236 bytes — sha256 18c16c8fa631 — band at 900px, one column
Acceptance: evidence — spec-2-4-email-capture-evidence/band-390.png — 92903 bytes — sha256 8e8dbbc04dee — band at 390px, field above button
Acceptance: evidence — spec-2-4-email-capture-evidence/band-error-1280.png — 129437 bytes — sha256 d674dcb0d639 — invalid email error
Acceptance: evidence — spec-2-4-email-capture-evidence/band-failure-1280.png — 133210 bytes — sha256 9feb116ca107 — send failure message, email kept
Acceptance: evidence — spec-2-4-email-capture-evidence/demo-prefilled-1280.png — 380911 bytes — sha256 8bc159a2ae34 — /demo#form with Work email prefilled
Acceptance: BLOCKED — after merge: one real capture on https://xiontech-dev.vercel.app reaching the inbox and landing prefilled (lead); the project band is not placed on any page yet (Story 5.4)
Acceptance: manual — correction: the timeout row above says 15.4 s (first walk); the evidence walk-output.txt records 15.2 s
Review: step 4 full review — 15 findings: 2 patch, 1 evidence, 5 defer, 7 reject (triage log in spec)
Review: correction — triage started before the Edge Case Hunter reported; its 2 new findings (late 200 after unmount, <= vs < breakpoints) added as patches to the same round; 18 findings total
Review: patches cb665a5 (method=post on both forms, prototype ring + h2 15ch + lede gap, unmount guard, < breakpoints); RED 5 failed, GREEN pass on touched tests
Review: patch re-review — pass — 4 addressed, 0 open, 1 new minor
Review: minor — capture-band.tsx:51-53 focus comment now sits above the mountedRef block — deferred
Review: minor — contrast.test.ts ring test does not assert .capture overflow: hidden — deferred
Review: correction — triage row 17 was wrong (controller): CAP-8 and EXPERIENCE.md require <= at 640/900px; walk after cb665a5 showed two columns at 900px; revert dispatched
Review: revert ca73c72 (band breakpoints back to <=) — controller checked the 4-line diff restores the reviewed task 6 rules; RED 2 failed, GREEN 145 passed
Acceptance: verification — `npm run lint && npm run typecheck && npm run format:check` — exit 0 — clean (foreground; two background runs were stopped by Claude Code for low memory)
Acceptance: verification — `npm test` — exit 0 — "Tests  572 passed (572)"
Acceptance: verification — `npm run test:coverage && npm run coverage:diff` — exit 0 — "Coverage: 100%"; "C1 ok: 9 changed file(s) with branch coverage >= 80% vs origin/develop."
Acceptance: verification — `npm run build && npm run test:smoke` — exit 0 — "3 passed (25.5s)"
Acceptance: verification — `npm audit --omit=dev` — exit 0 — "found 0 vulnerabilities"
Acceptance: manual — UX walk after the patches (walk.mjs) — observed: same as the first walk; 900px one column again after the <= revert; 390 field above button; #project → Outsourcing; timeout 15.2 s; row border computes 1px at 1x (rule 1.5px); /demo has no band
Acceptance: evidence — spec-2-4-email-capture-evidence/verification.txt — 4196 bytes — sha256 01ce27ed8a64 — every Verification command after the step-4 patches (cb665a5, ca73c72), run one at a time in the foreground
Acceptance: evidence — spec-2-4-email-capture-evidence/walk-output.txt — 1971 bytes — sha256 383d20e2cdeb — UX walk observations L1-L9 and CAP-9
Acceptance: evidence — spec-2-4-email-capture-evidence/walk.mjs — 7324 bytes — sha256 1094a7b9d1be — the walk script
Acceptance: evidence — spec-2-4-email-capture-evidence/band-1280.png — 141606 bytes — sha256 ce2c481d30ce — demo band on Home at 1280px, with the ported ring
Acceptance: evidence — spec-2-4-email-capture-evidence/band-900.png — 132732 bytes — sha256 b9a8127e2d71 — band at 900px, one column
Acceptance: evidence — spec-2-4-email-capture-evidence/band-390.png — 93520 bytes — sha256 2c409e05ec96 — band at 390px, field above button
Acceptance: evidence — spec-2-4-email-capture-evidence/band-error-1280.png — 144623 bytes — sha256 8beca59204e8 — invalid email error
Acceptance: evidence — spec-2-4-email-capture-evidence/band-failure-1280.png — 146043 bytes — sha256 aa3813f4eaf5 — send failure message, email kept
Acceptance: evidence — spec-2-4-email-capture-evidence/demo-prefilled-1280.png — 380911 bytes — sha256 8bc159a2ae34 — /demo#form with Work email prefilled
Acceptance: BLOCKED — after merge: one real capture on https://xiontech-dev.vercel.app reaching the inbox and landing prefilled (lead); the project band is placed by Story 5.4
Review: acceptance re-audit — not compliant: the Observed text claimed every UX line was walked; consent underline/href, keyboard and touch valid submit, full-width button and the typed-value line were not observed; walk extended and re-captured once
Acceptance: verification — `npm run lint && npm run typecheck && npm run format:check` — exit 0 — clean (foreground; unchanged since the previous set)
Acceptance: verification — `npm test` — exit 0 — "Tests  572 passed (572)"
Acceptance: verification — `npm run test:coverage && npm run coverage:diff` — exit 0 — "Coverage: 100%"; "C1 ok: 9 changed file(s) with branch coverage >= 80% vs origin/develop."
Acceptance: verification — `npm run build && npm run test:smoke` — exit 0 — "3 passed (25.5s)"
Acceptance: verification — `npm audit --omit=dev` — exit 0 — "found 0 vulnerabilities"
Acceptance: manual — extended UX walk after the re-audit (walk.mjs) — observed: Privacy link href /privacy, underline; valid submit by keyboard Enter → /demo#form, email filled; valid submit by touch tap at 390 → /demo#form, email filled; button full width of the row at 390; all earlier lines as before (900 one column, 390 field above button, #project → Outsourcing, timeout 15.2 s, /demo has no band). Not observable in a browser: a value typed before the prefill (covered by contact-form.test.tsx)
Acceptance: evidence — spec-2-4-email-capture-evidence/verification.txt — 4196 bytes — sha256 01ce27ed8a64 — every Verification command after the step-4 patches, run one at a time in the foreground
Acceptance: evidence — spec-2-4-email-capture-evidence/walk-output.txt — 2163 bytes — sha256 02c433c63358 — UX walk observations L1-L9 and CAP-9, incl. keyboard and touch submit, link target and underline, full-width button
Acceptance: evidence — spec-2-4-email-capture-evidence/walk.mjs — 8483 bytes — sha256 e85d926af9df — the walk script
Acceptance: evidence — spec-2-4-email-capture-evidence/band-1280.png — 141606 bytes — sha256 ce2c481d30ce — demo band on Home at 1280px, with the ported ring
Acceptance: evidence — spec-2-4-email-capture-evidence/band-900.png — 132732 bytes — sha256 b9a8127e2d71 — band at 900px, one column
Acceptance: evidence — spec-2-4-email-capture-evidence/band-390.png — 93520 bytes — sha256 2c409e05ec96 — band at 390px, field above a full-width button
Acceptance: evidence — spec-2-4-email-capture-evidence/band-error-1280.png — 143090 bytes — sha256 7b1efe820cde — invalid email error
Acceptance: evidence — spec-2-4-email-capture-evidence/band-failure-1280.png — 145966 bytes — sha256 72ed16a3a36a — send failure message, email kept
Acceptance: evidence — spec-2-4-email-capture-evidence/demo-prefilled-1280.png — 380911 bytes — sha256 8bc159a2ae34 — /demo#form with Work email prefilled
Acceptance: BLOCKED — after merge: one real capture on https://xiontech-dev.vercel.app reaching the inbox and landing prefilled (lead); the project band is placed by Story 5.4
Acceptance: UNVERIFIED — second audit: the evidence text overclaims (timeout recorded 15.2 s, artifact 15.3 s; Sending... observed for click only, claimed for click/Enter/touch; invalid email by click not walked; touch run lacks role/aria-invalid/focus; no-email-in-URL checked on the click path only). Artifacts and command rows verified. Escalated to the lead.
Acceptance: manual — lead chose to narrow the claims (2026-10-03): spec UX Checked cells and Observed text now state exactly what walk-output.txt shows (timeout 15.3 s; Sending... for click only; invalid email by Enter and touch, not click; touch message only; no-email-in-URL on the click path only). The UNVERIFIED row stands as history; the artifacts and command rows were verified by the audit.
Acceptance: manual — after merge of #20 (756cd34), the lead on https://xiontech-dev.vercel.app (2026-10-03 16:05, screenshot): a real demo capture mailed "Demo capture" with "Kind: demo" and the email to the lead's inbox; supersedes the after-merge part of the BLOCKED row (the project band is still placed by Story 5.4)
