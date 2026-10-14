# Build ledger — spec: D:/XionTech-LandingPage/_bmad-output/implementation-artifacts/spec-vi-page-content.md
Task 1: dispatched (model sonnet, base fb657de, report C:\Users\SONNGU~1\AppData\Local\Temp\bmad-vi\task1.md)
Task 1: dispatched (model sonnet, base f9f354f, report C:\Users\SONNGU~1\AppData\Local\Temp\bmad-vi\task1.md) — supersedes the row above; base moved by the spec commit
Task 1: red — npx vitest run src/i18n/content — 7/8 failed vs stub (expected [] to deeply equal ['cta.label: missing in vi'])
Task 1: green — npx vitest run src/i18n/content scripts/i18n — passed
Task 1: review — pass — 0 critical, 0 important, 3 minor
Task 1: minor — src/i18n/content.ts:325 null vs object treated as same kind
Task 1: minor — prototype-vi.json has 3 English strings with two Vietnamese renderings (about vs demo)
Task 1: minor — scripts/i18n/prototype-vi.mjs:94 CLI guard throws when argv[1] undefined
Task 1: complete (commits f9f354f..0735b2c, diff verified)
Task 2: dispatched (model opus, base 0735b2c, report C:\Users\SONNGU~1\AppData\Local\Temp\bmad-vi\task2.md)
Task 2: red — npx vitest run src/components/home/home-hero.test.tsx — expected Vietnamese heading, received 'Build smarter. Ship faster. Get IT done.'
Task 2: green — npm test — 1467 passed (home-hero rerun passes)
Task 2: review — pass — 0 critical, 0 important, 4 minor
Task 2: minor — home.ts:663,665, apps.ts:560,563 prototype wording loose (Hỗ trợ/Nền tảng/cùng con/điều hòa) for native review
Task 2: minor — values.ts Văn hoá vs văn hóa spelling mismatch
Task 2: minor — vi-sources.json hand-kept, unvalidated keys
Task 2: minor — doors chips/capabilities icons rely on item order
Task 2: complete (commits 0735b2c..cc7ca08, diff verified)
Task 3: dispatched (model opus, base cc7ca08, report C:\Users\SONNGU~1\AppData\Local\Temp\bmad-vi\task3.md)
Task 3: red — npx vitest run services/page — vi title still 'Software teams that get IT done.'
Task 3: green — npm test — 1497 passed; services/page rerun passes
Task 3: review — pass — 0 critical, 0 important, 5 minor
Task 3: minor — services.ts:139-143 Services hero translates tagline 'Get IT done' while every other vi surface keeps it English
Task 3: minor — Private Equity: 'Đầu tư tư nhân' (about.ts) vs 'Quỹ đầu tư tư nhân' (home.ts)
Task 3: minor — vi-sources.json omits aboutOfficeViewVi and officesVi keys
Task 3: minor — officesVi/footerOfficesVi/*MetaVi exported but unused until tasks 4-6
Task 3: minor — products.ts:1446 prototype vi drops 'Leader'
Task 3: complete (commits cc7ca08..7c782cf, diff verified)
Task 4: dispatched (model opus, base 7c782cf, report C:\Users\SONNGU~1\AppData\Local\Temp\bmad-vi\task4.md)
Task 4: dispatched (model opus, base 7c782cf) — dispatch call was interrupted by the user but the implementer's commit 0c16104 landed; uncommitted fallback tests committed by controller (62f2362); no implementer report
Task 4: red — controller reproduced: latest-posts.test.ts against 7c782cf's latest-posts.ts — 4 failed (expected '18 Sep 2026' to be '18/09/2026'; query lacks coalesce(title[$locale]...))
Task 4: green — npx vitest run careers news privacy latest-posts site-footer not-found — 392 passed; latest-posts 22 passed
Task 4: review — fail — 0 critical, 1 important (shared lang flag mislabels per-field Sanity fallbacks), 3 minor
Task 4: fix round 1/5 dispatched (fresh opus; original implementer interrupted, cannot be resumed; base 62f2362)
Task 4: fix round 1/5 (per-field Sanity lang markers via src/lib/sanity/localized.ts, lang only when differs, blank vi falls back, vi-sources tags; 15 red → 311 green)
Task 4: review — pass — re-review: 4 findings addressed; 0 critical, 0 important, 2 minor
Task 4: minor — open-roles.tsx:30, job-hero.tsx:43 list keyed by text (duplicate key if team == location)
Task 4: minor — localized.ts whitespace-only vi still counts as present
Task 4: complete (commits 7c782cf..52a8950, diff verified; GROQ select() validity to be confirmed by build against Sanity)
Task 5: dispatched (model opus, base 52a8950, report C:\Users\SONNGU~1\AppData\Local\Temp\bmad-vi\task5.md)
Task 5: red — npx vitest run contact-form.test.tsx -t Vietnamese — 3 failed (English form: no 'Gửi yêu cầu')
Task 5: green — npm run test:coverage — 1559 passed; contact-form Vietnamese rerun passes
Task 5: review — pass — 0 critical, 0 important, 4 minor
Task 5: minor — contact-form.test.tsx:406-411 English option values test covers first schoolSize only
Task 5: minor — contact-strings.test.ts:537-555 localizeError not enumerated over every server/client message
Task 5: minor — job-application-form.test.tsx:449,463 duplicate describe title
Task 5: minor — vi-sources.json tags some prototype strings as ai (demo hero, form.sending, successText)
Task 5: complete (commits 52a8950..5ff8f5d, diff verified)
Task 6: dispatched (model sonnet, base 5ff8f5d, report C:\Users\SONNGU~1\AppData\Local\Temp\bmad-vi\task6.md)
Task 6: red — npx vitest run layout.test — vi main still had lang="en"; vi description '[Placeholder] ...'
Task 6: green — npm run test:coverage — passed, diff-cover 100% (473 lines); layout.test rerun passes
Task 6: review — pass — 0 critical, 0 important, 2 minor
Task 6: minor — careers/page.test.tsx:114 and services/page.test.tsx:492 regex unescaped | makes title assertion vacuous
Task 6: complete (commits 5ff8f5d..c779b05, diff verified)
Task 7: dispatched (model sonnet, base c779b05, report C:\Users\SONNGU~1\AppData\Local\Temp\bmad-vi\task7.md)
Task 7: red — npx vitest run scripts/i18n/vi-review.test.mjs — failed: generator missing, then docs file missing
Task 7: green — npm run test:coverage — 1582 passed; vi-review 12 passed
Task 7: review — fail — 0 critical, 1 important (ai-log cites prototype examples the generator disproves), 3 minor
Task 7: fix round 1/5 dispatched (resume implementer)
Task 7: fix round 1/5 (ai-log examples corrected to generator-verified counts 106/26; vite ^8.3.1 declared; lockfile validated with npm ci --dry-run)
Task 7: review — pass — controller-checked fix diff (docs + package.json + lockfile), npm ls vite single 8.3.1
Task 7: complete (commits c779b05..f808a67, diff verified)
Acceptance: verification — npm run lint && npm run typecheck && npm run format:check — exit 0 — clean (at f808a67)
Acceptance: verification — npm test — exit 0 — Tests 1582 passed (1582)
Acceptance: verification — npm run test:coverage && npm run coverage:diff — exit 0 — Coverage: 100%, Missing: 0 lines
Acceptance: verification — npm run test:smoke — exit 0 — 18 passed (32.0s)
Acceptance: verification — npm run build — exit 0 — /vi routes prerendered
Acceptance: manual — every /vi page at 320 and 1440 (plus 375) — observed: no static English left; only Sanity fallbacks (lang=en) and allow-listed names/tags/addresses; no truncated buttons; 320/1440 no overflow; 375px header overflows 23px (Story 1.2 threshold 360px)
Acceptance: evidence — spec-vi-page-content-evidence/observed.md — 1818 bytes — sha256 8426e078d41e — walk notes
Acceptance: evidence — spec-vi-page-content-evidence/verification.txt — 12702 bytes — sha256 ff6e2a2bbf56 — command output
Acceptance: evidence — spec-vi-page-content-evidence/w1440_vi.png — 333287 bytes — sha256 82d3f674a1fd — screenshot
Acceptance: evidence — spec-vi-page-content-evidence/w1440_vi_about.png — 152663 bytes — sha256 3ec63f714c8c — screenshot
Acceptance: evidence — spec-vi-page-content-evidence/w1440_vi_careers.png — 527237 bytes — sha256 f28e7824b51e — screenshot
Acceptance: evidence — spec-vi-page-content-evidence/w1440_vi_careers_fresh-full-stack-developer.png — 377786 bytes — sha256 9619373c9cc8 — screenshot
Acceptance: evidence — spec-vi-page-content-evidence/w1440_vi_demo.png — 484035 bytes — sha256 a1add7499f31 — screenshot
Acceptance: evidence — spec-vi-page-content-evidence/w1440_vi_news.png — 342357 bytes — sha256 c47d162dc2e4 — screenshot
Acceptance: evidence — spec-vi-page-content-evidence/w1440_vi_news_pxp-the-school-day-in-a-parents-pocket.png — 113222 bytes — sha256 ec8e6102c9f5 — screenshot
Acceptance: evidence — spec-vi-page-content-evidence/w1440_vi_privacy.png — 149933 bytes — sha256 283e3a3c8faa — screenshot
Acceptance: evidence — spec-vi-page-content-evidence/w1440_vi_products.png — 553383 bytes — sha256 9f5fdd090af3 — screenshot
Acceptance: evidence — spec-vi-page-content-evidence/w1440_vi_services.png — 444598 bytes — sha256 4149e4f44dd1 — screenshot
Acceptance: evidence — spec-vi-page-content-evidence/w320_vi.png — 1705673 bytes — sha256 d5e6570db96e — screenshot
Acceptance: evidence — spec-vi-page-content-evidence/w320_vi_about.png — 654462 bytes — sha256 fadb920d4171 — screenshot
Acceptance: evidence — spec-vi-page-content-evidence/w320_vi_careers.png — 772519 bytes — sha256 fb168144521c — screenshot
Acceptance: evidence — spec-vi-page-content-evidence/w320_vi_demo.png — 466404 bytes — sha256 e04c8a13da66 — screenshot
Acceptance: evidence — spec-vi-page-content-evidence/w320_vi_news.png — 684486 bytes — sha256 2ebf55457404 — screenshot
Acceptance: evidence — spec-vi-page-content-evidence/w320_vi_privacy.png — 400088 bytes — sha256 186b4d39255e — screenshot
Acceptance: evidence — spec-vi-page-content-evidence/w320_vi_products.png — 578108 bytes — sha256 bad5834428b0 — screenshot
Acceptance: evidence — spec-vi-page-content-evidence/w320_vi_services.png — 804693 bytes — sha256 b47c757ba5ba — screenshot
Acceptance: evidence — spec-vi-page-content-evidence/walk-vi.json — 15758 bytes — sha256 1c7aab19dc74 — raw walk results
Review: patch round 395787c..7c46664 applied for triage rows 1-19; sanity:check en+vi exit 0
Acceptance: verification — npm run lint && npm run typecheck && npm run format:check — exit 0 — clean (re-verify at 7c46664)
Acceptance: verification — npm test — exit 0 — Tests 1602 passed (1602)
Acceptance: verification — npm run test:coverage && npm run coverage:diff — exit 0 — Coverage: 100%, Missing: 0 lines
Acceptance: verification — npm run test:smoke — exit 0 — 18 passed (38.7s)
Acceptance: verification — npm run build — exit 0 — /vi routes prerendered
Acceptance: manual — every /vi page at 320, 375 and 1440 (+ story, job) — observed: 26 rows, 0 overflow, 0 truncated buttons, no main lang; only Sanity fallbacks and allow-listed names/tags/addresses in English
Acceptance: evidence — spec-vi-page-content-evidence/observed.md — 1904 bytes — sha256 dc387e37c9ab — walk notes
Acceptance: evidence — spec-vi-page-content-evidence/verification.txt — 13161 bytes — sha256 24e5b1e33f63 — command output
Acceptance: evidence — spec-vi-page-content-evidence/w1440_vi.png — 333287 bytes — sha256 82d3f674a1fd — screenshot
Acceptance: evidence — spec-vi-page-content-evidence/w1440_vi_about.png — 152663 bytes — sha256 3ec63f714c8c — screenshot
Acceptance: evidence — spec-vi-page-content-evidence/w1440_vi_careers.png — 527237 bytes — sha256 f28e7824b51e — screenshot
Acceptance: evidence — spec-vi-page-content-evidence/w1440_vi_careers_fresh-full-stack-developer.png — 377786 bytes — sha256 9619373c9cc8 — screenshot
Acceptance: evidence — spec-vi-page-content-evidence/w1440_vi_demo.png — 483666 bytes — sha256 b2e74916599c — screenshot
Acceptance: evidence — spec-vi-page-content-evidence/w1440_vi_news.png — 342357 bytes — sha256 c47d162dc2e4 — screenshot
Acceptance: evidence — spec-vi-page-content-evidence/w1440_vi_news_pxp-the-school-day-in-a-parents-pocket.png — 113222 bytes — sha256 ec8e6102c9f5 — screenshot
Acceptance: evidence — spec-vi-page-content-evidence/w1440_vi_privacy.png — 149933 bytes — sha256 283e3a3c8faa — screenshot
Acceptance: evidence — spec-vi-page-content-evidence/w1440_vi_products.png — 553383 bytes — sha256 9f5fdd090af3 — screenshot
Acceptance: evidence — spec-vi-page-content-evidence/w1440_vi_services.png — 443564 bytes — sha256 024d64d4293d — screenshot
Acceptance: evidence — spec-vi-page-content-evidence/w320_vi.png — 1704946 bytes — sha256 0e4ed1aa8c63 — screenshot
Acceptance: evidence — spec-vi-page-content-evidence/w320_vi_about.png — 652331 bytes — sha256 50d7312db5ca — screenshot
Acceptance: evidence — spec-vi-page-content-evidence/w320_vi_careers.png — 772222 bytes — sha256 8528c382f01b — screenshot
Acceptance: evidence — spec-vi-page-content-evidence/w320_vi_demo.png — 465345 bytes — sha256 61f88f0ff533 — screenshot
Acceptance: evidence — spec-vi-page-content-evidence/w320_vi_news.png — 684197 bytes — sha256 4546bd3ae610 — screenshot
Acceptance: evidence — spec-vi-page-content-evidence/w320_vi_privacy.png — 399804 bytes — sha256 4c91476b3222 — screenshot
Acceptance: evidence — spec-vi-page-content-evidence/w320_vi_products.png — 577821 bytes — sha256 64fb0420e5b7 — screenshot
Acceptance: evidence — spec-vi-page-content-evidence/w320_vi_services.png — 803882 bytes — sha256 e0611cf05da1 — screenshot
Acceptance: evidence — spec-vi-page-content-evidence/walk-vi.json — 15742 bytes — sha256 5cce3b7d48e1 — raw walk results
