# Build ledger — spec: D:/XionTech-LandingPage/_bmad-output/implementation-artifacts/spec-locales-ja-fr-ko-zh.md
Task 1: dispatched (model opus, base 68d7b18, report C:\Users\SONNGU~1\AppData\Local\Temp\bmad-b\task1.md)
Task 1: red — npx vitest run src/proxy.test.ts — 5 failed (zh-CN, zh, zh-SG, zh-Hans, zh-Hans-SG redirected to /en)
Task 1: green — npm test — 1698 passed; proxy rerun passes
Task 1: review — fail — 0 critical, 3 important (unregistered pickLocale call sites unguarded; registry bundles all locales into client islands; zh-TW,zh header lands on /zh), 3 minor
Task 1: fix round 1/5 dispatched (resume implementer)
Task 1: fix round 1/5 (zh Traditional guard 3d7346e; server-only registry + LocaleProvider strings + registry guard test 46d545c; proxy 25/25, 1711 unit)
Task 1: review — fail — re-review: finding 3 addressed, findings 1-2 open: (A) call-site guard regex skips trailing-comma/shorthand/spread/alias calls (fails open); (B) newsPage in CLIENT_KEYS holds a function → RSC serialization error once filled; 2 minor
Task 1: fix round 2/5 dispatched (resume implementer)
Task 1: fix round 2/5 (newsPage count → serializable templates + JSON/structuredClone test 51dc713; AST call-site guard, fails closed, 75/75 calls a1d62f7)
Task 1: review — pass — re-review: A and B addressed; 0 critical, 0 important, 2 minor
Task 1: minor — registry-coverage guard misses aliased picker imports / namespace calls
Task 1: minor — no test that every locale's newsPage.countMany keeps {n}
Task 1: complete (commits 68d7b18..a1d62f7, diff verified)
Task 2: dispatched (model opus, base a1d62f7, report C:\Users\SONNGU~1\AppData\Local\Temp\bmad-b\task2.md)
Task 2: red — npx vitest run language-menu — expected 日本語/简体中文 native names, received 'JA 日本語' and lang zh
Task 2: NEEDS_CONTEXT answered by user: (5) CJK fonts via Google Fonts <link> on ja/ko/zh only; (6) CTA hidden <492px, compact <524px
Task 2: green — npm test 1729 passed; header e2e 66 passed (6 locales x 11 widths); build: /en,/vi,/fr no Google Fonts link, /ja,/ko,/zh one each
Task 2: review — fail — 0 critical, 1 important (CJK heading line-height rule in @layer utilities loses to unlayered component heading rules), 2 minor
Task 2: fix round 1/5 dispatched (resume implementer)
Task 2: fix round 1/5 (CJK line-height rule unlayered at end of globals.css; Chrome: /ja headings 1.35, /en unchanged; sr-only assertion)
Task 2: review — pass — controller-checked fix diff 24f42d8 (CSS move + test), browser evidence in report
Task 2: complete (commits a1d62f7..24f42d8, diff verified)
Task 3: dispatched (model opus, base 24f42d8, report C:\Users\SONNGU~1\AppData\Local\Temp\bmad-b\task3.md)
Task 3: red — npx vitest run services/page — ja render got 'Software teams that get IT done.'
Task 3: green — npm test 1732 passed; header e2e 66 passed; build ok
Task 3: review — pass — 0 critical, 0 important, 3 minor
Task 3: minor — page-level fallback tests moved to zh/ko/fr; need a durable mocked-empty-locale test before those locales fill
Task 3: minor — ja.ts:66 ariaLabel?.replace can interpolate 'undefined'
Task 3: minor — ja.ts hardcodes 'Parent Hub' instead of shortName; 明細 vs 領収書; FAQ Record spread
Task 3: complete (commits 24f42d8..fe10c08, diff verified)
Task 4: dispatched (model opus, base fe10c08, report C:\Users\SONNGU~1\AppData\Local\Temp\bmad-b\task4.md)
Task 4: red — npx vitest run services/page — fr render got 'Software teams that get IT done.'
Task 4: green — npm test 1732 passed; header e2e 66 passed; build ok
Task 4: review — pass — 0 critical, 0 important, 6 minor
Task 4: minor — fr.ts:748 'maîtrisons' overstates 'work in' (adds a claim)
Task 4: minor — fr.ts:49-50 'Centre de delivery' inconsistent with 'réalisation' elsewhere
Task 4: minor — fr.ts:774 vs 514 'Lettre de motivation' vs 'note' mismatch
Task 4: minor — fr.ts 4-D label vs Conception initial; newsPage.title drift; 'Pas encore décidé', 'responsabilité' for ownership
Task 4: complete (commits 92f90c6~1..955c82e, diff verified)
Task 5: dispatched (model opus, base 955c82e, report C:\Users\SONNGU~1\AppData\Local\Temp\bmad-b\task5.md)
Task 5: red — npx vitest run services/page — ko render got 'Software teams that get IT done.'
Task 5: green — npm test 1733 passed; build 56/56; header e2e 66 passed
Task 5: review — pass — 0 critical, 0 important, 8 minor
Task 5: minor — ko 'AI 기반' vs AI-assisted; '교사의 지도' strengthens 'alongside'; '현장에서' added; 'Also in' adds 거점 (claim strengthening, patch later)
Task 5: minor — ko register slips, 경영진 for school leaders, '책임감' vs 주인의식, literal Parent Hub
Task 5: complete (commits 17006f7~1..17006f7, diff verified)
Task 6: dispatched (model opus, base 17006f7, report C:\Users\SONNGU~1\AppData\Local\Temp\bmad-b\task6.md)
Task 6: review — pass — 0 critical, 0 important, 8 minor
Task 6: minor — zh claim strengthening: 即时 (instantly), 公开分享 (publicly), 真正重叠 (genuinely)
Task 6: minor — zh aboutHero title dangling 以; 你/您 mix; NEW_TAB spacing; task-list/shipped nuance; 从旁陪伴
Task 6: complete (commits 6152226~1..6152226, diff verified)
Task 7: dispatched (model opus, base 6152226, report C:\Users\SONNGU~1\AppData\Local\Temp\bmad-b\task7.md)
Task 7: red — npx vitest run scripts/i18n/untranslated.test.mjs — failed: ./review.mjs missing, ja strings unguarded
Task 7: green — npm test 1761 passed; Playwright header-language + language-switch 71 passed; build ok
Task 7: review — pass — 0 critical, 0 important, 5 minor
Task 7: minor — ai-log 'still pending' lists only claim wording; other open minors omitted
Task 7: minor — completeness pins only id, not href/icon/tone/slug; DATA regex wide; SHARED_APP untested; walk messages say 'vi'
Task 7: complete (commits 6152226..945255c, diff verified)
Acceptance: verification — npm run lint && npm run typecheck && npm run format:check — exit 0 — clean (at 945255c)
Acceptance: verification — npm test — exit 0 — Tests 1761 passed (1761)
Acceptance: verification — npm run test:coverage && npm run coverage:diff — exit 0 — Coverage: 100%, Missing: 0; C1 ok 42 files
Acceptance: verification — npm run test:smoke — exit 0 — 18 passed (17.6s)
Acceptance: verification — npm run build — exit 0 — six locales prerendered
Acceptance: manual — ja/fr/ko/zh x 8 routes x 320/375/1440 (96 checks) — observed: all 200, lang ja/fr/ko/zh-Hans, no page or header overflow, Google Fonts link only on ja/ko/zh, Noto JP/KR/SC load; only allow-listed English on CJK pages; '+3' chip overflows 3px in every locale incl. en (pre-existing)
Acceptance: evidence — spec-locales-ja-fr-ko-zh-evidence/observed.md — 1908 bytes — sha256 019d0d73558b — walk notes
Acceptance: evidence — spec-locales-ja-fr-ko-zh-evidence/verification.txt — 11831 bytes — sha256 b88ee1b385e0 — command output
Acceptance: evidence — spec-locales-ja-fr-ko-zh-evidence/w1440_fr_home.png — 332286 bytes — sha256 3b2b94f0c0ed — screenshot
Acceptance: evidence — spec-locales-ja-fr-ko-zh-evidence/w1440_fr_services.png — 456786 bytes — sha256 3669036583c3 — screenshot
Acceptance: evidence — spec-locales-ja-fr-ko-zh-evidence/w1440_ja_home.png — 327414 bytes — sha256 906981893e17 — screenshot
Acceptance: evidence — spec-locales-ja-fr-ko-zh-evidence/w1440_ja_services.png — 428474 bytes — sha256 27a01b17c872 — screenshot
Acceptance: evidence — spec-locales-ja-fr-ko-zh-evidence/w1440_ko_home.png — 292672 bytes — sha256 a63a78c77c58 — screenshot
Acceptance: evidence — spec-locales-ja-fr-ko-zh-evidence/w1440_ko_services.png — 402456 bytes — sha256 e5ec16179223 — screenshot
Acceptance: evidence — spec-locales-ja-fr-ko-zh-evidence/w1440_zh_home.png — 316571 bytes — sha256 95c260e6d889 — screenshot
Acceptance: evidence — spec-locales-ja-fr-ko-zh-evidence/w1440_zh_services.png — 416509 bytes — sha256 a88a3836e768 — screenshot
Acceptance: evidence — spec-locales-ja-fr-ko-zh-evidence/w320_fr_home.png — 1471877 bytes — sha256 cf71192f1cef — screenshot
Acceptance: evidence — spec-locales-ja-fr-ko-zh-evidence/w320_fr_services.png — 677042 bytes — sha256 c52c62ccfc39 — screenshot
Acceptance: evidence — spec-locales-ja-fr-ko-zh-evidence/w320_ja_home.png — 1378295 bytes — sha256 74a8db79e890 — screenshot
Acceptance: evidence — spec-locales-ja-fr-ko-zh-evidence/w320_ja_services.png — 670704 bytes — sha256 1124e372f29b — screenshot
Acceptance: evidence — spec-locales-ja-fr-ko-zh-evidence/w320_ko_home.png — 1107531 bytes — sha256 f45718cca055 — screenshot
Acceptance: evidence — spec-locales-ja-fr-ko-zh-evidence/w320_ko_services.png — 523775 bytes — sha256 9b708bf1ee33 — screenshot
Acceptance: evidence — spec-locales-ja-fr-ko-zh-evidence/w320_zh_home.png — 1174472 bytes — sha256 983bdda8fae2 — screenshot
Acceptance: evidence — spec-locales-ja-fr-ko-zh-evidence/w320_zh_services.png — 558074 bytes — sha256 417b86640922 — screenshot
Acceptance: evidence — spec-locales-ja-fr-ko-zh-evidence/walk-b.json — 22178 bytes — sha256 3295430e610f — raw walk results
Task 6: red — controller reproduced: services/page -t 'Simplified Chinese' against 6152226~1 zh.ts — expected '践行“Get IT done”的软件团队。', received 'Software teams that get IT done.'
Task 6: green — controller: same test on HEAD zh.ts — 1 passed
Review: patch round 38651f4..4c18f74 applied for triage rows 1-8,10-12
Review: follow-up 4eabac2 (format), f743e9b (layout strings test, proven red without prop), ced1c17 (ko term); re-review row 8 now addressed
