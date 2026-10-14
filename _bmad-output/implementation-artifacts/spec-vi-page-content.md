---
title: 'Vietnamese for all page content'
type: 'feature'
created: '2026-10-13'
status: 'done'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: 'fb657de6c09af5ea6658c5077aad952235f93873'
context:
  - '{project-root}/AGENTS.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Story 1.2 gave `/vi/` a Vietnamese header, footer and 404, but every page body, page title, form message and Sanity story still shows English. Visitors who choose VI see a mostly English site.

**Approach:** Give every content module a Vietnamese dictionary with the same shape as the English one, and let pages and components pick it by locale. Translate all copy into Vietnamese: Amber's prototype `data-vi` text where the English still matches, AI translation of the real English copy everywhere else. Every AI string is listed for a native reader to check. Read Sanity's existing `vi` fields, falling back to `en`. Remove the `<main lang="en">` marker and the `[Placeholder]` prefixes on vi page titles once a page is translated. This is part A of the user's 2026-10-13 request. Part B (ja, fr, ko, zh-Hans) and part C (Arabic, RTL) are deferred and reuse this plumbing.

**Decisions (2026-10-13, user):** (1) AI translations are allowed when flagged for review. (2) Product and service names stay English. (3) A `[Placeholder]` English source string stays `[Placeholder]` in Vietnamese (prefix kept, rest translated). (4) Review, 2026-10-14: the tagline "Get IT done" is a brand name and stays English on every page and locale. (5) Review, 2026-10-14: the header hides "Book a demo" below about 400px (fixes the 375px overflow from Story 1.2).

## Boundaries & Constraints

**Always:** The English exports keep their names and values, so existing tests and imports still work. The vi dictionary has every key the en one has (a unit test fails on a missing or extra key, per module). Non-copy data (ids, hrefs, icons, numbers, addresses, phone numbers, emails) is shared, never duplicated per locale. Server components get the locale from `params` or `getRequestLocale()`, client components from `useLocale()`. Dates follow FR-26: `18 SEP 2026` in en, `18/09/2026` in vi. Server-side mail subjects and API error text stay English. Vietnamese copy keeps the brand "XionTech". Long Vietnamese labels must not truncate buttons (NFR-6).

**Never:** No i18n library. No change to Sanity schemas or studio. No new routes. No ja/fr/ko/zh/ar. No invented facts: translate meaning, add nothing.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| Page body | `GET /vi/services` | Vietnamese headings and body; `<main>` has no `lang="en"`; title without `[Placeholder]` | N/A |
| English unchanged | `GET /en/services` | Same English output as before this story | N/A |
| Sanity story | `/vi/news/<slug>` whose `vi` fields are filled | Vietnamese title, excerpt and body | `vi` empty → `en` text shown with `lang="en"` on that block |
| News date | Story dated 2026-09-18 | `/en`: 18 SEP 2026; `/vi`: 18/09/2026 | N/A |
| Form validation | Submit the empty demo form on `/vi/demo` | Vietnamese field errors | Server English error → shown as the localized message for its code, else the generic localized error |
| Placeholder source | English `[Placeholder] Own the outcome` | vi `[Placeholder] <Vietnamese>` | N/A |

</frozen-after-approval>

## Code Map

- `src/content/*.ts` -- copy modules (about, apps, careers, home, job, news, not-found, offices, privacy, process, products, services, site-footer, values). Mixed copy and data; exports imported by name across `src/app/[locale]` and `src/components`. `service-icons.ts` has no copy.
- `src/components/contact/contact-strings.ts` (`CONTACT_STRINGS`), `src/lib/contact/contact-rules.ts` (`CONTACT_ERRORS` l.12, `MESSAGE_REQUIRED_ERROR` l.21, `LENGTH_ERROR` l.32), `src/lib/careers/application-rules.ts` (`JOB_ERRORS` l.16-19) -- form copy. Client: capture-band, contact-form, home-contact-form, job-application-form.
- `src/components/products/roadmap/road-stop-dialog.tsx:67` -- hard-coded "Close".
- `src/i18n/shell.ts` -- en/vi pattern to follow; vi has `[Placeholder]` skipLink, mainNav, homeLink, demo, notFound.metaTitle (translate now).
- `src/i18n/page-metadata.ts` -- `forLocale`/`localeMetadata` prefix vi with `[Placeholder]`; switch to real vi meta per page.
- `src/app/[locale]/layout.tsx` -- sets `<main lang="en">` on vi (remove).
- `src/lib/news/post.ts:15-24`, `src/lib/careers/open-roles.ts:11-25`, `src/lib/news/all-posts.ts`, `latest-posts.ts` -- GROQ hard-codes `.en`; schemas in `studio/schemas/localized.ts` already hold `{en, vi}`. `latest-posts.ts:27,42` `newsDate()` en-US only.
- `src/lib/contact/delivery.ts:176,256` -- mail subjects, stay English.
- Prototype pairs: `_bmad-output/prototype-enhancement/prototype/*.html`, `js/site.js` (`data-vi`, `data-vi-aria`, `data-vi-ph`, `data-vi-html`); ~261 of 544 current strings match exactly or nearly (brand "XionTechs" → "XionTech").

## Tasks & Acceptance

**Execution:**
- [x] `src/i18n/content.ts`, `scripts/i18n/prototype-vi.mjs`, `src/i18n/prototype-vi.json` -- `Localized<T>` type (en shape, strings widened), `pickLocale(locale, {en, vi})`, parity helper; a script that extracts prototype `(english, vi)` pairs into the committed JSON -- shared plumbing and the Vietnamese source.
  - red: `src/i18n/content.test.ts` -- a vi object missing a key of en fails the parity helper.
- [x] Home, values, process, apps -- vi dictionaries and wiring in `src/components/home/*`, `sections/process-flow`.
  - red: `src/components/home/home-hero.test.tsx` -- `vi` render shows no Vietnamese heading.
- [x] Products, services, about, offices copy -- vi dictionaries and wiring (pages, journey/roadmap incl. "Close").
  - red: `src/app/[locale]/services/page.test.tsx` -- `vi` render shows the English title.
- [x] Careers, job, news, privacy, not-found, site-footer -- vi dictionaries and wiring; Sanity `coalesce(field.vi, field.en)` and per-locale dates.
  - red: `src/lib/news/latest-posts.test.ts` -- `newsDate` for vi is not `18/09/2026`.
- [x] Forms -- `CONTACT_STRINGS`, contact and job error messages per locale on the client; server stays English.
  - red: `src/components/contact/contact-form.test.tsx` -- empty submit on vi shows English errors.
- [x] `src/i18n/shell.ts`, `page-metadata.ts`, `[locale]/layout.tsx` -- real vi shell strings and page meta; drop `<main lang="en">`.
  - red: `src/app/[locale]/layout.test.tsx` -- vi `<main>` still has `lang="en"`.
- [x] `docs/translations/vi-review.md`, `docs/ai-log.md` -- generated list of every vi string with its source (prototype or AI) for a native reader; log the work.

**Acceptance Criteria:**
- Given any page under `/vi/` at 320px and 1440px, when it renders, then no English copy remains except product and service names, and no button text is truncated.
- Given `npm run build`, when it runs, then every `/vi/*` route prerenders and `/en/*` output is unchanged except where shared data changed.

## Design Notes

Keep each module's English export as is and add `<name>Vi` beside it, or a `vi/` sibling file, typed `Localized<typeof en>` so TypeScript enforces the shape. Consumers call one accessor, for example `homeHero[locale]` via `pickLocale`. Do not thread a locale prop through deep trees when `useLocale()` or `getRequestLocale()` can read it.

## Verification

**Commands:**
- `npm run lint && npm run typecheck && npm run format:check` -- expected: clean
- `npm test` and `npm run test:coverage && npm run coverage:diff` -- expected: pass, 100% changed lines
- `npm run test:smoke` and `npm run build` -- expected: pass

**Manual checks:**
- At 320px and 1440px, every `/vi/` page: read top to bottom; only product and service names are English; buttons fit.

## Review Triage Log

| # | Source | Finding | Verdict | Evidence | Route |
|---|---|---|---|---|---|
| 1 | acceptance, blind, verif, edge | Home capabilities: English clock zone label "US Central" and `<abbr title="Ho Chi Minh City">` on `/vi` | medium | `capabilities.tsx:53,59,63` import English `plano`/`hcmc` | patch |
| 2 | acceptance, ledger T3 | Services hero translates "Get IT done"; elsewhere English; the AI log calls it a user decision | medium | `services.ts:139-143`; decision (4) | intent_gap → decision (4), patch |
| 3 | edge, blind, evidence | 375px page overflows 23px (header) | medium | walk-vi.json; Story 1.2 cut-off 360px | intent_gap → decision (5), patch |
| 4 | verif, edge, task-6 minor | Unescaped `|` makes two vi title assertions vacuous | low | careers/services page tests | patch |
| 5 | verif, task-5 minor | Only the first `f-size` option value is checked on vi; `f-svc`, `f-when` and the posted body are unchecked | medium | contact-form.test.tsx | patch (test) |
| 6 | verif | vi WhatsApp `aria-label` unchecked in the footer and on Demo | low | site-footer.test.tsx, demo test | patch (test) |
| 7 | blind, verif, edge | No guard against a vi string left equal to English; the review list drops equal rows | medium | `vi-review.mjs walk()`; `contentMismatches` checks shape only | patch (test with allow-list) |
| 8 | blind, edge | Index-paired vi lists (STAT_CAPTIONS_VI, STEPS_VI, VALUES_VI, services icons) have no length or id assert | low | `home.ts`, `process.ts`, `values.ts`, services page | patch (asserts in parity tests) |
| 9 | edge, task-4 minor | `key={part.text}` / `key={chip.text}` can collide | low | open-roles.tsx, job-hero.tsx | patch |
| 10 | edge, task-1 minor | `prototype-vi.mjs` argv guard throws when argv[1] is undefined | low | `prototype-vi.mjs:94` | patch |
| 11 | blind, verif, edge | New GROQ never evaluated against Sanity | medium | String-only tests; dataset has no vi | patch (live read-only check via `sanity:check`) |
| 12 | blind, edge | `localizeError` keys on English text; vi texts hard-code 200 and 2.000 | low | `contact-strings.ts` ERRORS_VI | patch (test: every rule message is a key; limits from constants) |
| 13 | edge | Story image `alt` is English on vi with no lang | low | news/[slug]/page.tsx | patch |
| 14 | blind, edge | `prototype-vi.test.mjs` re-extracts from the live prototype, so a prototype edit breaks `npm test` on unrelated PRs | medium | AGENTS.md: prototype branch keeps changing | patch (move the freshness check to the script) |
| 15 | blind | `vi-review.test.mjs` fails on any copy edit until regenerated; not documented | low | intended gate | patch (docs: AGENTS.md) |
| 16 | blind | AGENTS.md still says page-body translation waits until after demo; new decisions unrecorded | low | AGENTS.md scope line | patch (docs) |
| 17 | blind | Privacy text is AI-translated legal copy with no legal sign-off flag | medium | vi-review.md mixes it with marketing | patch (docs: legal-review note) |
| 18 | blind, ledger T2/T3 | Terminology drift: TP. Hồ Chí Minh vs Thành phố…, Mỹ/Hoa Kỳ, Châu Âu, Văn hoá/văn hóa, Private Equity term | low | Several dictionaries | patch |
| 19 | security | Vite dev server in `vi-review.mjs` may open an HMR socket | maybe-false (low) | Set `hmr: false`/`ws: false` | patch (one option) |
| 20 | edge | Whitespace-only vi strings or empty PT blocks count as filled | low | `localized.ts` | defer |
| 21 | blind, edge | Optional `locale = "en"` defaults hide wiring bugs; locale guard repeated in ~12 pages | medium | Root cause of finding 1 | defer |
| 22 | blind | No hreflang / `openGraph.locale` | medium | Story 7.1 | defer |
| 23 | blind | `getOpenRoles` sorts by `title.en` on vi | low | open-roles.ts | defer |
| 24 | blind | Placeholder-preservation test is positional and covers 3 modules | low | careers-news-vi.test.ts | defer |
| 25 | blind | No UX checks table | low | DoD item, done in PR prep | reject (PR prep) |
| 26 | acceptance | deferred-work.md entries are not in a task | low | Workflow bookkeeping | reject |
| 27 | ledger minors T1-T7 | Remaining task-review minors (null kind, duplicate describe, source-tag nuance, journeyMap `as const`) | low | Cosmetic | reject |

## Acceptance Evidence

Re-captured after the review patches on 2026-10-14, at commit 7c46664.

**Commands**

- `npm run lint && npm run typecheck && npm run format:check` -- exit 0 -- clean
- `npm test` -- exit 0 -- Tests 1602 passed (1602)
- `npm run test:coverage && npm run coverage:diff` -- exit 0 -- Coverage: 100% (Missing: 0 lines)
- `npm run test:smoke` -- exit 0 -- 18 passed (38.7s)
- `npm run build` -- exit 0 -- `/vi/*` prerendered

**Observed**

- Every `/vi/` page, plus one story and one job, at 320, 375 and 1440 px: no page overflow, no truncated buttons, and no `lang` on `<main>`. The only English left is Sanity content without `vi` (marked `lang="en"`) and the names, tags, addresses and "Get IT done" kept English by decision -- production build on :3005
- `npm run sanity:check` (implementer, read-only) ran the real queries for en and vi: news list, story, roles list and role all ok; every `*Lang` is `en` because the dataset has no `vi` values yet

**Artifacts**

- [observed.md](spec-vi-page-content-evidence/observed.md), [walk-vi.json](spec-vi-page-content-evidence/walk-vi.json), [verification.txt](spec-vi-page-content-evidence/verification.txt) and 18 screenshots (`w320_*` full page, `w1440_*` first screen); each file's byte count and sha256 are in the ledger's latest rows

**Not captured**

- Vietnamese text stored in Sanity: no `vi` values exist yet, so that path is covered by unit tests and the GROQ check only
