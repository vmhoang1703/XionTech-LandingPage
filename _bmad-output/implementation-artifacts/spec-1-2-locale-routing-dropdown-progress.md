# Build ledger — spec: D:/XionTech-LandingPage/_bmad-output/implementation-artifacts/spec-1-2-locale-routing-dropdown.md
Task 1: dispatched (model sonnet, base f4a3314, report C:\Users\SONNGU~1\AppData\Local\Temp/bmad-1-2/task1.md)
Task 1: red — npx vitest run src/i18n — 2 files failed: cannot resolve ./shell, ./locales
Task 1: green — npx vitest run src/i18n — 5 tests passed
Task 1: review — pass — 0 critical, 0 important, 3 minor
Task 1: minor — src/i18n/shell.test.ts:79 names-equal test compares the same object; cannot fail
Task 1: minor — src/i18n/shell.test.ts:75 key parity compares ordered arrays; sort to be order-insensitive
Task 1: minor — src/i18n/locales.ts:47 '/#' branch untested; non-slash paths produce /vi#x
Task 1: complete (commits f4a3314..232c979, diff verified)
Task 2: dispatched (model sonnet, base 232c979, report C:\Users\SONNGU~1\AppData\Local\Temp\bmad-1-2\task2.md)
Task 2: red — npx vitest run src/proxy.test.ts — 6 failed (no 307 from pass-through stub)
Task 2: green — npx vitest run src/proxy.test.ts — 8 passed
Task 2: review — pass — 0 critical, 0 important, 2 minor
Task 2: minor — src/proxy.ts:43 matcher lookahead api|_next lacks segment boundary (/apifoo skipped)
Task 2: minor — src/proxy.test.ts:55-66 matcher test misses /apixyz and nested dotted path
Task 2: complete (commits 232c979..eb3a4f1, diff verified)
Task 3: dispatched (model opus, base eb3a4f1, report C:\Users\SONNGU~1\AppData\Local\Temp\bmad-1-2\task3.md)
Task 3: red — npx vitest run layout.test — expected 'en' to be 'vi'
Task 3: green — npx vitest run layout.test — passes (implementer: npm test 1391 passed)
Task 3: review — pass — 0 critical, 0 important, 2 minor
Task 3: minor — src/app/global-not-found.tsx:5,69 imports [locale]/not-found, lang=en hardcoded, English only
Task 3: minor — src/app/[locale]/layout.tsx:232-242 generateMetadata bad-locale branch untested
Task 3: complete (commits eb3a4f1..c344692, diff verified)
Task 4: dispatched (model opus, base c344692, report C:\Users\SONNGU~1\AppData\Local\Temp\bmad-1-2\task4.md)
Task 4: red — npx vitest run language-menu — 11 failed vs stub (no button, no navigation to /vi/demo)
Task 4: green — npx vitest run language-menu — 11 passed
Task 4: review — pass — 0 critical, 0 important, 3 minor
Task 4: minor — language-menu.tsx:377 outside click steals focus back to button (spec-mandated wording)
Task 4: minor — language-menu.tsx:371-385 tabbing out of open list does not close it
Task 4: minor — language-menu.tsx:339 cookie lacks Secure
Task 4: complete (commits c344692..5a716e7, diff verified)
Task 5: dispatched (model sonnet, base 5a716e7, report C:\Users\SONNGU~1\AppData\Local\Temp\bmad-1-2\task5.md)
Task 5: red — npx vitest run site-header — vi nav links lacked /vi prefix and VI labels
Task 5: green — npx vitest run site-header — passed (implementer: full run 1408/1408)
Task 5: review — pass — 0 critical, 0 important, 2 minor
Task 5: minor — src/app/[locale]/not-found.tsx:20-21 body <title>/robots may double or clash with layout metadata
Task 5: minor — site-footer/mobile-menu/site-nav use Link+localeHref while others use LocaleLink (mixed idiom)
Task 5: complete (commits 5a716e7..f07a6cc, diff verified)
Task 6: dispatched (model sonnet, base f07a6cc, report C:\Users\SONNGU~1\AppData\Local\Temp\bmad-1-2\task6.md)
Task 6: no-red (test-only task: e2e path updates plus new @smoke check, no app behaviour change)
Task 6: green — npm run test:smoke — 14 passed, 2 failed (job/news unknown slug 404 shows bare error shell)
Task 6: fix round 1/5 (server not-found view, request-locale cache, [...rest] catch-all; smoke 17 passed, npm test 1413 passed)
Task 6: fix round 2/5 (vi.notFound title/lede/primary/here from prototype 404.html; npm test 1413, smoke 17 passed)
Task 6: review — pass — re-review: 3 open findings addressed; 0 critical, 0 important, 3 minor
Task 6: minor — src/i18n/request-locale.ts silent English fallback if locale box unset; thrown notFound() inside a vi page untested
Task 6: minor — thrown notFound() 404 HTML is __next_error__ shell, lang=vi only client-side (Next 16 limit)
Task 6: minor — not-found.test.tsx / request-locale.test.ts duplicate a module-level cache mock
Task 6: complete (commits f07a6cc..330c8a3, diff verified)
Task 7: dispatched (model haiku, base 330c8a3, report C:\Users\SONNGU~1\AppData\Local\Temp\bmad-1-2\task7.md)
Task 7: no-red (docs only)
Task 7: fix round 1/5 (AI-log entry: correct models, list AI errors, decision wording)
Task 7: review — pass — controller-reviewed docs diff (docs-only, 2 commits); 0 critical, 0 important
Task 7: complete (commits 330c8a3..323063a, diff verified)
Task 5: fix round 1/5 dispatched post-completion (acceptance gap: frozen decision 1, lang="en" on <main> for vi; base 323063a)
Task 5: fix round 1/5 (acceptance gap: main lang=en on vi [8c372bf]; 404 section lang=locale [c8b4d83]; layout+not-found-view tests pass)
Acceptance: verification — npm run lint && npm run typecheck && npm run format:check — exit 0 — All matched files use Prettier code style!
Acceptance: verification — npm test — exit 0 — Tests 1416 passed (1416)
Acceptance: verification — npm run test:coverage && npm run coverage:diff — exit 0 — Coverage: 100% (166 lines, missing 0)
Acceptance: verification — npm run test:smoke — exit 0 — 17 passed (28.8s)
Acceptance: verification — npm run build — exit 0 — 16 /en and /vi routes listed
Task 4: fix round 1/5 (scroll restore instant + hold, focus to language button after switch; e2e language-switch.spec.ts @a11y; npm test 1421 passed)
Acceptance: manual — 390px re-walk after f318c07 (keyboard open/choose; scrollY 719 at the moment of choosing, header focus moved it from 1141) — observed: /vi/demo scrollY 719 (kept exactly), fields kept, focus on language button, html lang vi, main lang en, cookie vi; tab title still English
Acceptance: manual — 1440px re-walk after f318c07 — observed: /vi/demo, fields kept, focus on language button, language button last header item 53x44; tab title still English
Task 4: review — pass — re-review: 2 findings addressed; 0 critical, 0 important, 3 minor
Task 4: minor — language-menu.tsx:155-165 focus return skipped when sessionStorage blocked
Task 4: minor — language-menu.tsx:155,166 StrictMode (next dev) consumes saved state on first mount; hold loop lost in dev only
Task 4: minor — e2e/language-switch.spec.ts:37-39 fixed 1s sleep, ±40px tolerance
Task 4: complete (fix commit c8b4d83..f318c07, diff verified)
Acceptance: verification — npm run lint && npm run typecheck && npm run format:check — exit 0 — clean (rerun at f318c07)
Acceptance: verification — npm test — exit 0 — Tests 1421 passed (1421)
Acceptance: verification — npm run test:coverage && npm run coverage:diff — exit 0 — Coverage: 100%, Missing: 0 lines
Acceptance: verification — npm run test:smoke — exit 0 — 17 passed (13.2s)
Acceptance: verification — npm run build — exit 0 — /en and /vi routes prerendered
Acceptance: evidence — spec-1-2-locale-routing-dropdown-evidence/verification.txt — 10000 bytes — sha256 e8a7c440b366 — literal output of the 5 declared commands
Acceptance: evidence — spec-1-2-locale-routing-dropdown-evidence/observed.md — 1701 bytes — sha256 c44615eca95b — browser walk notes at 390/1440
Acceptance: evidence — spec-1-2-locale-routing-dropdown-evidence/mobile-dropdown-open.png — 100864 bytes — sha256 aafbd063ba91 — 390px dropdown open, last header item
Acceptance: evidence — spec-1-2-locale-routing-dropdown-evidence/mobile-after-vi.png — 109630 bytes — sha256 7bc9b7b12567 — 390px /vi/demo after switch, fields kept
Acceptance: evidence — spec-1-2-locale-routing-dropdown-evidence/desktop-dropdown-open.png — 482141 bytes — sha256 9b3f63a6dab4 — 1440px dropdown open
Acceptance: evidence — spec-1-2-locale-routing-dropdown-evidence/desktop-after-vi.png — 464446 bytes — sha256 1d49e86d3cea — 1440px /vi/demo after switch
Acceptance: verification — npx playwright test e2e/language-switch.spec.ts --project=a11y — exit 0 — 1 passed (matrix row: Switch); npx playwright test e2e/not-found.spec.ts --project=smoke — exit 0 — 3 passed (matrix row: Unknown locale, new test 85f904f)
Review: patch round (2579910..000a34d) applied for triage rows 1-15
Review: follow-up patch 6639842 (null relatedTarget blur keeps list open; architecture.md /fr clause) — controller-checked diff
Acceptance: verification — npm run lint && npm run typecheck && npm run format:check — exit 0 — clean (re-verify at 6639842)
Acceptance: verification — npm test — exit 0 — Tests 1435 passed (1435)
Acceptance: verification — npm run test:coverage && npm run coverage:diff — exit 0 — Coverage: 100%, Missing: 0 lines
Acceptance: verification — npm run test:smoke — exit 0 — 18 passed (18.9s)
Acceptance: verification — npm run build — exit 0 — /en and /vi routes prerendered
Acceptance: manual — 320px /vi — observed: header overflow 0, items logo, Menu, language button; /fr/products 404 with site 404 H1, EN choice → /en/products; /vi/demo title "[Placeholder] Book a Demo or Start a Project | XionTech"
Acceptance: manual — 390px /en/demo → VI (keyboard) — observed: /vi/demo scrollY 719 = scroll at choice, fields kept, focus on language button, html vi, main en, cookie vi Lax 365d, reload stays VI, bare /products → /vi/products
Acceptance: manual — 1440px same walk — observed: same results, language button last header item 53x44
Acceptance: evidence — spec-1-2-locale-routing-dropdown-evidence/verification.txt — 10502 bytes — sha256 18628e1acb80 — literal output of the five declared commands
Acceptance: evidence — spec-1-2-locale-routing-dropdown-evidence/observed.md — 1969 bytes — sha256 ef25d79b2d8b — browser walk notes at 320/390/1440 and /fr
Acceptance: evidence — spec-1-2-locale-routing-dropdown-evidence/w320-vi-header.png — 89034 bytes — sha256 f0367742ec82 — 320px /vi header fits
Acceptance: evidence — spec-1-2-locale-routing-dropdown-evidence/mobile-dropdown-open.png — 100852 bytes — sha256 e47f9642fbd6 — 390px dropdown open
Acceptance: evidence — spec-1-2-locale-routing-dropdown-evidence/mobile-after-vi.png — 109707 bytes — sha256 ba9b9df54bd9 — 390px after switch
Acceptance: evidence — spec-1-2-locale-routing-dropdown-evidence/desktop-dropdown-open.png — 482228 bytes — sha256 533ac0990e0f — 1440px dropdown open
Acceptance: evidence — spec-1-2-locale-routing-dropdown-evidence/desktop-after-vi.png — 465575 bytes — sha256 90d07146d487 — 1440px after switch
Acceptance: verification — npx playwright test e2e/header-language.spec.ts e2e/language-switch.spec.ts --project=a11y — exit 0 — 11 passed (27.8s)
