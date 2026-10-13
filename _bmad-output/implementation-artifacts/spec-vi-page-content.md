---
title: 'Vietnamese for all page content'
type: 'feature'
created: '2026-10-13'
status: 'in-progress'
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

**Decisions (2026-10-13, user):** (1) AI translations are allowed when flagged for review. (2) Product and service names stay English. (3) A `[Placeholder]` English source string stays `[Placeholder]` in Vietnamese (prefix kept, rest translated).

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
- [ ] `src/i18n/content.ts`, `scripts/i18n/prototype-vi.mjs`, `src/i18n/prototype-vi.json` -- `Localized<T>` type (en shape, strings widened), `pickLocale(locale, {en, vi})`, parity helper; a script that extracts prototype `(english, vi)` pairs into the committed JSON -- shared plumbing and the Vietnamese source.
  - red: `src/i18n/content.test.ts` -- a vi object missing a key of en fails the parity helper.
- [ ] Home, values, process, apps -- vi dictionaries and wiring in `src/components/home/*`, `sections/process-flow`.
  - red: `src/components/home/home-hero.test.tsx` -- `vi` render shows no Vietnamese heading.
- [ ] Products, services, about, offices copy -- vi dictionaries and wiring (pages, journey/roadmap incl. "Close").
  - red: `src/app/[locale]/services/page.test.tsx` -- `vi` render shows the English title.
- [ ] Careers, job, news, privacy, not-found, site-footer -- vi dictionaries and wiring; Sanity `coalesce(field.vi, field.en)` and per-locale dates.
  - red: `src/lib/news/latest-posts.test.ts` -- `newsDate` for vi is not `18/09/2026`.
- [ ] Forms -- `CONTACT_STRINGS`, contact and job error messages per locale on the client; server stays English.
  - red: `src/components/contact/contact-form.test.tsx` -- empty submit on vi shows English errors.
- [ ] `src/i18n/shell.ts`, `page-metadata.ts`, `[locale]/layout.tsx` -- real vi shell strings and page meta; drop `<main lang="en">`.
  - red: `src/app/[locale]/layout.test.tsx` -- vi `<main>` still has `lang="en"`.
- [ ] `docs/translations/vi-review.md`, `docs/ai-log.md` -- generated list of every vi string with its source (prototype or AI) for a native reader; log the work.

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
