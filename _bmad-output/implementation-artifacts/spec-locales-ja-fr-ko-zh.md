---
title: 'Japanese, French, Korean and Simplified Chinese'
type: 'feature'
created: '2026-10-14'
status: 'in-review'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: '68d7b1845de29a1a87d2ac0badeb19995dec5c5a'
context:
  - '{project-root}/AGENTS.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The site speaks English and Vietnamese only. Part B of the user's multi-language request (2026-10-13) adds Japanese, French, Korean and Simplified Chinese.

**Approach:** Add four locales on top of the en/vi system from PR #109. First generalise it so a language is one set of dictionaries, not a twin export per module. Then translate all copy into each language with AI, starting from the real English (the Vietnamese can serve as cross-reference), and flag every string for a native reader. Arabic and right-to-left layout (part C) stay deferred.

**Decisions (user):** carried over from 2026-10-13/14:

- AI translations are allowed when they are flagged for review.
- Product and service names and the tagline "Get IT done" stay English.
- `[Placeholder]` prefixes are kept.
- English is the default and the fallback.

New on 2026-10-14:

- (1) Japanese, Korean and Chinese pages load Noto Sans JP, KR or SC, only on that locale's pages. Latin text keeps the brand fonts.
- (2) The language button shows the code (EN, VI, JA, FR, KO, ZH). The list shows native names: English, Tiếng Việt, 日本語, Français, 한국어, 简体中文.
- (3) Simplified Chinese uses `/zh/`, with `lang="zh-Hans"`. Browsers asking for zh, zh-CN, zh-SG or zh-Hans land there.
- (4) Sanity news and jobs have no ja, fr, ko or zh fields. They fall back to English, marked `lang="en"`. No schema change.

Task 2 decisions (user, 2026-10-14):

- (5) next/font cannot keep the Noto CSS off the other locales' pages, so Japanese, Korean and Chinese pages load Noto Sans JP, KR or SC with a Google Fonts `<link>` (`display=swap`) on those pages only. en, vi and fr pages load no CJK font.
- (6) The header hides "Get in touch" below 492px and compacts it below 524px, so the header fits in every locale. This fixes an overflow at 412–443px that exists on `develop`.

## Boundaries & Constraints

**Always:**

- Locales are `en, vi, ja, fr, ko, zh`.
- Every locale has every key the English dictionaries have. A test fails on any missing key, extra key or wrong array length.
- The Vietnamese output and the English output are unchanged.
- Non-copy data is shared, never copied per locale.
- Dates follow each locale's convention, through `Intl` with that locale.
- CJK text gets no negative letter-spacing and no uppercase tracking, and has a readable line-height.
- The language button and list fit the header at 320, 375, 390, 412, 640, 900, 1080 and 1440 px in every locale, with no overflow and no truncated buttons.
- Each locale gets a generated review list for a native reader.
- A test fails when a non-English string equals its English source, unless the string is on the allow-list.

**Never:**

- Arabic, RTL or `dir` changes.
- Sanity schema or Studio changes.
- A new i18n library.
- Invented facts: translate meaning only, add nothing.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| First visit, Japanese | `GET /`, `Accept-Language: ja-JP`, no cookie | 307 to `/ja` | N/A |
| Chinese variants | `Accept-Language: zh-CN` or `zh-Hans-SG` | 307 to `/zh` | `zh-TW` or `zh-Hant` → `/en` (Traditional is not offered) |
| Page in a new locale | `GET /ko/services` | Korean copy; `<html lang="ko">`; Noto Sans KR loaded | N/A |
| Chinese html lang | `GET /zh` | `<html lang="zh-Hans">` | N/A |
| Sanity on a new locale | `/fr/news/<slug>` | English story; the text blocks have `lang="en"` | N/A |
| Switch language | On `/en/demo`, mid-page, choose 日本語 | `/ja/demo`, same scroll, typed fields kept, focus on the button | Same as en/vi |
| Unknown locale | `/de/products` | Site 404 | N/A |

</frozen-after-approval>

## Code Map

- `src/i18n/locales.ts:1` -- `LOCALES = ["en","vi"]`, from which `Locale` and `isLocale` derive; `locales.test.ts:5` pins it.
- `src/i18n/content.ts:10-15` -- `pickLocale(locale, Record<Locale,T>)`. Lines 25-70: `contentMismatches` (messages say "vi"). Line 74: `fallbackLang`.
- `src/content/*.ts`, `src/components/contact/contact-strings.ts` -- 56 `*Vi`/`*_VI` twin exports; 57 `pickLocale({en, vi})` call sites.
- `src/i18n/shell.ts:36,78,103-124,150` -- `language: {label, en, vi}` and `SHELL = {en, vi}`.
- `src/i18n/site-meta.ts:7`, `src/i18n/page-metadata.ts:15-21` -- `Record<Locale, …>` meta.
- `src/proxy.ts:6-22` -- Accept-Language matched on the primary tag (zh variants need mapping).
- `src/app/[locale]/layout.tsx:17-20` -- `generateStaticParams` from `LOCALES`, `dynamicParams=false`, `lang={locale}` (zh needs "zh-Hans").
- `src/lib/news/latest-posts.ts:36-50` -- `DATE_FORMATS: Record<Locale, Intl.DateTimeFormat>`.
- `src/lib/sanity/localized.ts` -- `select(length(f[$locale]) > 0 => f[$locale], f.en)`, already generic.
- `src/components/layout/language-menu.tsx:228-252` -- button `h-11 min-w-11 px-2` shows `toUpperCase()` code; list `min-w-24`, 44px rows, sr-only names from SHELL.
- `src/components/layout/site-header.tsx:45-48` -- CTA `max-[443px]` compact, `max-[411px]:hidden`.
- `src/app/fonts.ts` -- four brand fonts, `latin`+`vietnamese` subsets, no CJK. `node_modules/next/dist/compiled/@next/font/dist/google/font-data.json` has Noto Sans JP/KR/SC, with CJK served as unicode-range chunks; use `preload: false`.
- `src/app/globals.css` -- `:lang(vi)` heading rule (l.4600); negative tracking tokens (l.79-161) and uppercase tracking (l.129, 133, 378, 783, 1781, 1877, 2127).
- `scripts/i18n/vi-review.mjs`, `untranslated.test.mjs`, `vi-review.test.mjs` -- vi-only, with a hard-coded module list and suffix pairing.
- Tests that list locales: `e2e/header-language.spec.ts:5`, `e2e/language-switch.spec.ts`, `src/proxy.test.ts`, `layout.test.tsx:163`, `shell.test.ts:17-33`.

## Tasks & Acceptance

**Execution:**
- [x] Locale plumbing -- add ja, fr, ko, zh to `LOCALES`. Add a translation registry so a locale is one set of dictionaries, typed against the English shapes; vi keeps working. `pickLocale` falls back to en for a missing dictionary until each locale task fills it. Map Accept-Language zh variants, set `lang="zh-Hans"` for zh, add per-locale `DATE_FORMATS`, and extend SHELL, META and page-metadata with locale entries.
  - red: `src/proxy.test.ts` -- `Accept-Language: zh-CN` is not redirected to `/zh`.
- [x] Language menu and type -- native names in the list, codes on the button, header fit at every listed width. Load Noto Sans JP, KR and SC per locale. Add CJK `:lang()` rules: no negative or uppercase tracking, readable line-height.
  - red: `src/components/layout/language-menu.test.tsx` -- the list does not show 日本語 and 简体中文.
- [x] Japanese -- every dictionary (content modules, contact strings and errors, shell, meta).
  - red: `src/app/[locale]/services/page.test.tsx` -- `ja` render shows the English title.
- [x] French -- every dictionary.
  - red: `src/app/[locale]/services/page.test.tsx` -- `fr` render shows the English title.
- [x] Korean -- every dictionary.
  - red: `src/app/[locale]/services/page.test.tsx` -- `ko` render shows the English title.
- [x] Simplified Chinese -- every dictionary.
  - red: `src/app/[locale]/services/page.test.tsx` -- `zh` render shows the English title.
- [x] Review tooling and docs -- generalise the review generator and the untranslated guard to every non-English locale (`docs/translations/<locale>-review.md`); a completeness test across all locales; `e2e/header-language.spec.ts` and `language-switch.spec.ts` cover every locale; update `AGENTS.md` and `docs/ai-log.md`.
  - red: `scripts/i18n/untranslated.test.mjs` -- a ja string equal to its English passes.

**Acceptance Criteria:**
- Given each of `/ja`, `/fr`, `/ko` and `/zh` at 320, 375 and 1440 px, when every page renders, then no English copy remains except names, tags, addresses and Sanity fallbacks; no button is truncated; nothing overflows.
- Given `npm run build`, when it runs, then all six locales prerender, and the `/en` and `/vi` HTML text is unchanged.

## Design Notes

Prefer one file per locale under `src/content/locales/<locale>/` (or one per module and locale), registered in one place. Do not add `*Ja`/`*Fr` twin exports to every module. The registry must make TypeScript reject a missing key once a locale is declared complete. Existing vi twins may stay as they are, or move into the registry if that is the smaller change; either way the vi output must not change.

## Verification

**Commands:**
- `npm run lint && npm run typecheck && npm run format:check` -- expected: clean
- `npm test` and `npm run test:coverage && npm run coverage:diff` -- expected: pass, 100% changed lines
- `npm run test:smoke` and `npm run build` -- expected: pass

**Manual checks:**
- At 320, 375 and 1440 px, every page in `/ja`, `/fr`, `/ko` and `/zh`: the copy is in that language, CJK glyphs render in Noto (no tofu), and buttons fit.

## Review Triage Log

| # | Source | Finding | Verdict | Evidence | Route |
|---|---|---|---|---|---|
| 1 | acceptance, blind, T4-T6 minors | fr/ko/zh wording adds or strengthens claims (maîtrisons, 교사의 지도, 현장에서, 거점, 即时, 公开分享, 真正重叠) | medium | Breaks the "add nothing" Never rule | patch |
| 2 | T3-T6 minors | Other wording minors: ja `ariaLabel?.replace` can print "undefined"; literal "Parent Hub" (ja, ko); fr "Centre de delivery", "Lettre de motivation"/"note"; ko register slips, 경영진, 책임감; zh dangling 以, 你/您 mix, NEW_TAB spacing | low | Ledger rows T3-T6 | patch |
| 3 | blind, security | Google Fonts requests are not listed on the Privacy page (provider list names Gmail, Upstash, Vercel only) | medium | `src/content/privacy.ts`; decision (5) sends IPs to Google | patch (fact added in every locale) |
| 4 | blind | Noto loads weights 400-600 only; the site uses 300 | low | 11 `font-weight: 300` rules | patch |
| 5 | blind | The CJK heading line-height rule leaks into `lang="en"` islands | low | Descendant `:lang(ja) :is(h1…)` | patch |
| 6 | blind | Count plural is English-shaped (fr singular for 0) | low | `storyCount` n===1 | patch (`Intl.PluralRules`) |
| 7 | blind, edge, T7 minors | Completeness pins only `id` (not href/slug/icon/tel/mailto); no array/object kind check; DATA regex too wide; `LOCALE_ALLOWED[locale]` spread of undefined; `walk` messages say "vi"; duplicate `i18n:vi-review` writer | low | review.mjs, completeness.test.mjs | patch |
| 8 | verif | No test that the layout feeds a client island translated strings on a new locale; `clientStrings` error pairing only tested as English-to-English; `roleTypeLabel` never tested with a real translation | medium | Removing `strings=` keeps every test green | patch (tests) |
| 9 | acceptance | Task 6 had no red/green rows | low | Ledger | fixed: red reproduced by the controller |
| 10 | acceptance | The "+3" chip overflows 3px at 320/375 in every locale | low | walk-b.json; pre-existing, but the AC says no truncated button | patch |
| 11 | edge | A Traditional tag with q=0 still drops bare `zh` | low | proxy.ts | patch |
| 12 | edge | A pseudo-element can keep its own letter-spacing on CJK pages | low | globals.css | patch (cheap) |
| 13 | acceptance | No before/after proof that `/en` and `/vi` text is unchanged | maybe-false (medium if true) | Settle by diffing built HTML text against the baseline | patch (controller check) |
| 14 | edge | A client switch from ja to en keeps the Noto stylesheet loaded | low | React hoists the `<link>` | defer |
| 15 | edge | Native CJK names in the menu can show as tofu on devices without CJK fonts | low | OS fallback only on en/vi/fr | defer |
| 16 | blind | No hreflang / alternates for six locales | medium | Story 7.1 | defer |
| 17 | verif | The header-fit e2e runs only in the a11y project, not the smoke gate | low | playwright.config.ts | defer |
| 18 | edge | String-valued registry entries are keyed by content | maybe-false (low) | translations.ts | reject (low, unshown) |
| 19 | blind | `zh-TW,zh-CN;q=0.5` lands on `/zh` | false | The user lists Simplified, so `/zh` is right; the matrix row covers Traditional-only headers | reject |
| 20 | blind | "Get in touch" hidden at 411-491px in English too | false | User decision (6) | reject |
| 21 | blind | newsDate uses the Asia/Ho_Chi_Minh time zone in fr | false | Same rule as en/vi (FR-26, the company's time zone) | reject |
| 22 | security | The third-party stylesheet has no SRI and no CSP in the repo | maybe-false | Google CSS varies per UA, so SRI is impossible; any CSP lives in Vercel | defer |

## Acceptance Evidence

Captured at the end of step-03 on 2026-10-14, at commit 945255c.

**Commands**

- `npm run lint && npm run typecheck && npm run format:check` -- exit 0 -- clean
- `npm test` -- exit 0 -- Tests 1761 passed (1761)
- `npm run test:coverage && npm run coverage:diff` -- exit 0 -- Coverage: 100% (Missing: 0), C1 ok on 42 files
- `npm run test:smoke` -- exit 0 -- 18 passed (17.6s)
- `npm run build` -- exit 0 -- six locales prerendered

**Observed**

- ja, fr, ko and zh, with 8 routes each at 320, 375 and 1440 px (96 checks): every route returns 200 with `lang` ja/fr/ko/zh-Hans; nothing overflows; only ja, ko and zh load a Google Fonts stylesheet, and Noto JP/KR/SC render; the CJK pages show only the agreed English names and tags -- production build on :3005
- The home page's "+3" button overflows by 3 px in every locale, en and vi included; this existed before this story -- production build on :3005

**Artifacts**

- [observed.md](spec-locales-ja-fr-ko-zh-evidence/observed.md), [walk-b.json](spec-locales-ja-fr-ko-zh-evidence/walk-b.json), [verification.txt](spec-locales-ja-fr-ko-zh-evidence/verification.txt) and 16 screenshots; each file's byte count and sha256 are recorded in the ledger

**Not captured**

- Leftover English in French is checked by the untranslated and completeness tests, not by the browser walk.
- Translations stored in Sanity: none exist, by decision (4).
