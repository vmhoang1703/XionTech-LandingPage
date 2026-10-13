---
title: 'Story 1.2: Locale routing and language dropdown'
type: 'feature'
created: '2026-10-13'
status: 'done'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: 'f4a3314ba2ec0be12ed6b20930db49d3c391aa07'
context:
  - '{project-root}/AGENTS.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The site is English only at bare paths; Vietnamese visitors cannot switch language, and the PRD (FR-4, FR-5, AC-NAV-1) requires every page under `/en/` and `/vi/` with a header language dropdown.

**Approach:** Move every page under a `[locale]` segment (`en`, `vi`), add a request-level proxy that adds the locale to bare paths from the locale cookie, then Accept-Language, then `en`, and add the header dropdown that switches locale on the same page. This story ships the routing, cookie, dropdown and EN/VI string-set plumbing with Vietnamese for the site shell only; page-body translation is deferred (`deferred-work.md`, 2026-10-13). Built before Demo day by the user's decision (2026-10-13), overriding the 2026-09-29 "after demo" plan; Hoang Vu to be told and the AI log updated.

**Decisions (2026-10-13):** (1) Until page copy is translated, a `/vi/` page shows the Vietnamese shell around the English page body, with `lang="en"` on `<main>`. (2) Shell strings take Vietnamese from Amber's prototype (`data-vi`); where the prototype has none, the VI value is `[Placeholder] ` + the English text. (3) Spec kept whole at ~2,100 tokens by the user's choice. (4) Review, 2026-10-13: until page copy is translated, each page's `vi` title and meta description are `[Placeholder] ` + the English text. (5) Review, 2026-10-13: an outside click only closes the language list (focus stays where the visitor clicked), per AC-NAV-1.

## Boundaries & Constraints

**Always:** URL locale wins over the cookie. Locale cookie is essential, first-party, `SameSite=Lax`, one year, never local storage. Product and service names identical in EN and VI. Shell strings exist in both locales (unit test fails on a missing key). Dropdown is the last item in the header bar at every width (after the mobile menu button, as in the prototype `site.js` header), never inside the mobile menu; 44px targets; `aria-current` on the chosen option; Escape, outside click and choosing close it; choosing and Escape return focus to the button, an outside click does not (AC-NAV-1). Fonts add the `vietnamese` subset; `:lang(vi) h1, :lang(vi) h2 { line-height: 1.2 }`. `lang`, title and meta description follow the locale. Switching keeps the page, scroll position and typed form values.

**Never:** No i18n library unless the Next.js docs require one. No translation of page bodies (`src/content/*` page copy) in this story. No change to `/api/*` routes. No `hreflang`/sitemap (Story 7.1). No invented Vietnamese.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| First visit | `GET /`, no cookie, `Accept-Language: vi-VN` | 307 to `/vi` | Unparseable header → `/en` |
| Saved choice | `GET /products`, cookie `vi` | 307 to `/vi/products`, query kept | Cookie not `en`/`vi` → ignored |
| Shared link | `GET /en/products`, cookie `vi` | 200 English page | N/A |
| Unknown locale | `GET /fr/products` | 404 page | N/A |
| Excluded paths | `/api/*`, `/_next/*`, `/icon.png`, files with an extension | Served untouched | N/A |
| Switch | On `/en/demo` scrolled with typed fields, choose VI | `/vi/demo`, same scroll, fields kept, cookie `vi` | Restore skipped silently if storage is unavailable |

</frozen-after-approval>

## Code Map

- `src/app/layout.tsx` -- root layout; `<html lang="en">` hard-coded (l.56), fonts `subsets: ["latin"]` only, static `metadata` (l.47); becomes `src/app/[locale]/layout.tsx` with `generateStaticParams` (`en`, `vi`), `dynamicParams = false`, `generateMetadata`, `lang={locale}`.
- `src/app/{page,about,products,services,demo,privacy,news,news/[slug],careers,careers/[slug]}` -- move under `src/app/[locale]/` with their `page.test.tsx`; `news/[slug]` already uses `generateMetadata`; `params` is a Promise.
- `src/app/not-found.tsx` -- root 404; with no single root layout use `src/app/global-not-found.tsx` (`experimental.globalNotFound` in `next.config.ts`); links from `src/content/not-found.ts:7-11`.
- `src/app/api/*`, `icon.png`, `apple-icon.png` -- stay at the root; not under `[locale]`.
- `src/proxy.ts` (new) -- Next 16 renamed middleware to proxy: `export function proxy(request: NextRequest)`, constant `config.matcher` excluding `api`, `_next`, files with a dot. Docs: `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`, `02-guides/internationalization.md`.
- `src/components/layout/site-header.tsx` -- server; order: skip link, logo (l.22), `SiteNav` (l.35), "Book a demo" (l.36-42), `MobileMenu` (l.43); dropdown goes after `MobileMenu`.
- `src/components/layout/mobile-menu.tsx` -- reuse its disclosure pattern (`aria-expanded` l.116, focus-trap selector l.15); trap must include the dropdown button.
- `src/components/layout/nav-data.ts` -- `LABELS`, `NAV_ITEMS` (l.83-94): shell strings to localise; hrefs gain the locale.
- `src/components/layout/site-footer.tsx`, `src/content/site-footer.ts` -- footer shell strings and links.
- Internal hrefs (~46 literal `"/..."`): `src/app/[locale]/{demo,privacy}/page.tsx`, `src/components/{careers/job-hero,contact/capture-band,contact/contact-form,contact/home-contact-form,layout/*}.tsx`, `src/content/{about,home,news,not-found,services,site-footer}.ts`.
- `src/content/privacy.ts:68-71` -- cookies section already promises the language cookie; leave text.
- `_bmad-output/prototype-enhancement/prototype/js/site.js` -- shell VI strings (`data-vi`), dropdown markup l.26-27, behaviour l.152-159.
- Tests that pin paths/lang: `src/app/layout.test.tsx:36`, `e2e/smoke.spec.ts` (GET `/` = 200), e2e `goto` calls (a11y 26, products 13, others), ~7 unit tests asserting `"/products"`-style hrefs, `nav-data.test.ts`, `site-header.test.tsx`, `mobile-menu.test.tsx`.

## Tasks & Acceptance

**Execution:**
- [x] `src/i18n/locales.ts`, `src/i18n/shell.ts` -- `LOCALES`, `isLocale`, `localeHref(locale, path)`, EN/VI shell dictionaries -- single source for locale data.
  - red: `src/i18n/shell.test.ts` -- a key in one locale missing in the other fails; product/service names equal.
- [x] `src/proxy.ts` -- locale resolution and redirect per the I/O matrix.
  - red: `src/proxy.test.ts` -- `/` with `Accept-Language: vi` is not redirected to `/vi`.
- [x] `src/app/[locale]/**`, `src/app/global-not-found.tsx`, `next.config.ts` -- move pages and layout; per-locale `lang`, title, description; `vietnamese` font subset; `:lang(vi)` heading rule in `globals.css`.
  - red: `src/app/[locale]/layout.test.tsx` -- `vi` renders `lang="vi"`.
- [x] `src/components/layout/language-menu.tsx` + header wiring -- dropdown per Boundaries; sets the cookie; navigates to the same path in the other locale; saves and restores scroll and form field values via `sessionStorage`.
  - red: `src/components/layout/language-menu.test.tsx` -- choosing VI does not navigate to `/vi/<same path>`.
- [x] Shell components and content hrefs -- read labels from the shell dictionary; prefix internal hrefs with the locale.
  - red: `src/components/layout/site-header.test.tsx` -- nav links on `vi` do not start with `/vi/`.
- [x] Tests and e2e -- update pinned paths; add `@smoke` check that `/` redirects and `/en` returns 200.
- [x] `docs/ai-log.md`, `AGENTS.md` -- log the "1.2 before Demo day" decision.

**Acceptance Criteria:**
- Given any page at 320, 640, 900, 1080px and wide desktop, when it renders, then the language button is the last header item and the mobile menu has no language control.
- Given `vi`, when a page renders, then header, footer, dropdown and 404 text are Vietnamese and `npm run build` prerenders `/en/*` and `/vi/*`.

## Design Notes

Root layout under `[locale]` means no single root layout; `global-not-found.tsx` renders its own `<html>`/`<body>` for unmatched URLs and `[locale]/not-found.tsx` for `notFound()` inside a locale. Cookie set with `document.cookie` in the dropdown (no Server Action, so the proxy matcher's POST handling is not involved).

## Verification

**Commands:**
- `npm run lint && npm run typecheck && npm run format:check` -- expected: clean
- `npm test` and `npm run test:coverage && npm run coverage:diff` -- expected: pass, 100% changed lines
- `npm run test:smoke` and `npm run build` -- expected: pass; build lists `/en` and `/vi` routes

**Manual checks:**
- At 390px and 1440px: open the dropdown, choose VI on `/demo` with typed fields mid-page; same page, scroll and values; reload stays VI.

## Review Triage Log

| # | Source | Finding | Verdict | Evidence | Route |
|---|---|---|---|---|---|
| 1 | acceptance, edge, blind | `/vi` inner-page titles and descriptions stay English | medium | `/vi/demo` title seen English in the walk; page `metadata` overrides the layout | intent_gap → decision (4), patch |
| 2 | verif-gap, edge, task-4 minor | Outside click returns focus to the button, stealing it from the clicked control | medium | `close()` focuses `buttonRef` on outside click; AC-NAV-1 asks focus return on choice only | intent_gap → decision (5), patch |
| 3 | edge, blind | Checkbox group `products` restored wrongly on switch | medium | `readFields` keys by `name`, so the last pill's boolean is written to all four (`language-menu.tsx:41-54`) | patch |
| 4 | edge, task-4 minor | Tabbing out of the open list leaves it open | low | No focusout handling; the prototype closes on focusout (`site.js:156`) | patch |
| 5 | edge, blind | On `/fr/x` (global 404) choosing EN does nothing; `swapLocale` drops a non-locale segment | low | `current` defaults to `en`; `swapLocale` slices the first segment unconditionally | patch |
| 6 | edge, blind, task-2 minors | Matcher lookahead `api|_next` lacks a segment boundary | low | `/api-docs` would skip the redirect; one-token fix | patch |
| 7 | verif-gap | `LocaleProvider` wiring on `vi` is untested; removing it keeps every test green | medium | Only `not-found-view.test.tsx` mounts a `vi` provider, and not through the layout | patch (test) |
| 8 | verif-gap | `MobileMenu` on `vi` is never asserted | medium | The `vi` header test hits the desktop `SiteNav` links; the mobile nav is hidden | patch (test) |
| 9 | verif-gap | The `vi` 404 title text is unasserted end to end | low | e2e counts `<title>` only | patch (test) |
| 10 | verif-gap | `/fr` 404 checks status only | low | `e2e/not-found.spec.ts` new test | patch (test) |
| 11 | verif-gap, blind | Accept-Language `q=0` and NaN branches untested | low | `proxy.test.ts` has no such case | patch (test) |
| 12 | acceptance, blind | Header at 320/640/900/1080px not shown by any test | medium | Evidence claimed coverage that does not exist | patch (e2e) |
| 13 | blind, edge, task-1 minor | "Names equal" test compares one shared object | low | `en.names === vi.names` | patch (test) |
| 14 | blind, acceptance | AI log omits Sonnet (tasks 1, 2, 5, 6) | low | Ledger dispatch rows | patch (docs) |
| 15 | blind | `docs/architecture.md` not updated for `[locale]`, `proxy.ts`, `global-not-found` | low | AGENTS.md names it as the routes record | patch (docs) |
| 16 | security, blind, edge | Typed form values (personal data) sit in `sessionStorage` until the next page reads them; stale entries can re-apply later | medium | `save()`/`takeSaved()`; no timestamp, no `pagehide` cleanup | defer |
| 17 | security | Proxy 307s vary by cookie and Accept-Language; CDN caching not checked | maybe-false (medium if true) | Settle with a `curl -I` on a Vercel preview for `Vary`/`Cache-Control` | defer |
| 18 | blind | `/vi/*` duplicates English bodies with no `noindex`/canonical until translated | medium | Story 7.1 owns hreflang | defer |
| 19 | edge, blind | Same `name` across two forms on one page collides | low | Home capture band and contact form | defer |
| 20 | edge | Escape with the mobile menu and the list both open fires both handlers | low | Two document keydown listeners | defer |
| 21 | edge, task-4 minor | StrictMode dev double mount loses the scroll hold | low | Dev only; production walk is exact | defer |
| 22 | task-6 minor, verif | `request-locale` silently falls back to English | low | No log or test of the unset path | defer |
| 23 | task-4 minor | Focus return skipped when `sessionStorage` is blocked | low | Early return before focus | defer |
| 24 | blind, acceptance | `epic-1-context.md` rewritten | false | Regenerated by step 1 from planning docs newer than the cache, as the workflow requires | reject |
| 25 | edge | Restore runs before client forms hydrate | false | Walk: both fields kept on the production build | reject |
| 26 | edge | `localeHref` mangles absolute, `mailto:` or pre-prefixed paths | low | No caller passes one; contacts render plain `<a>` | reject |
| 27 | blind | No UX checks table in the spec | low | DoD item; written in `docs/ux-checks.md` form for the PR, not a spec edit | reject (PR prep) |
| 28 | edge | Placeholder `vi` shell strings voiced as Vietnamese | low | Decision (2) sanctions the placeholder | reject |
| 29 | task-4 minor, task-2 minors, task-1 minors, task-3 minors, task-5 minors | Remaining task-review minors (cookie `Secure`, mixed link idiom, untested `/#`, generateMetadata bad-locale branch, ordered key compare, 1s sleep in e2e) | low | Cosmetic or test-only | reject |

## Acceptance Evidence

Re-captured after the review patches on 2026-10-13, at commit 6639842.

**Commands**

- `npm run lint && npm run typecheck && npm run format:check` -- exit 0 -- clean
- `npm test` -- exit 0 -- Tests 1435 passed (1435)
- `npm run test:coverage && npm run coverage:diff` -- exit 0 -- Coverage: 100% (Missing: 0 lines)
- `npm run test:smoke` -- exit 0 -- 18 passed (18.9s)
- `npm run build` -- exit 0 -- `/en/*` and `/vi/*` prerendered

**Observed**

- 320px `/vi`: header has no overflow; the items are logo, Menu, then the language button ("Book a demo" moves into the menu below 360px) -- production build on :3005
- `/fr/products`: 404 with the site's 404 copy; choosing EN goes to `/en/products` -- production build on :3005
- 390px `/en/demo` mid-page, VI chosen by keyboard: `/vi/demo` with the same scroll, typed fields kept, focus on the language button, `html lang="vi"`, `main lang="en"`, title "[Placeholder] Book a Demo or Start a Project | XionTech", cookie `vi` Lax 365d; a reload stays VI -- production build on :3005
- 1440px: the same switch results; the language button (53x44) is the last header item -- production build on :3005
- Header at 320, 640, 900, 1080 and 1440px in en and vi: `npx playwright test e2e/header-language.spec.ts e2e/language-switch.spec.ts --project=a11y` run by the controller at 6639842: 11 passed

**Artifacts**

- [verification.txt](spec-1-2-locale-routing-dropdown-evidence/verification.txt) -- 10502 bytes -- sha256 18628e1acb80 -- output of the five commands
- [observed.md](spec-1-2-locale-routing-dropdown-evidence/observed.md) -- 1969 bytes -- sha256 ef25d79b2d8b -- browser walk notes
- [w320-vi-header.png](spec-1-2-locale-routing-dropdown-evidence/w320-vi-header.png) -- 89034 bytes -- sha256 f0367742ec82 -- 320px header fits
- [mobile-dropdown-open.png](spec-1-2-locale-routing-dropdown-evidence/mobile-dropdown-open.png) -- 100852 bytes -- sha256 e47f9642fbd6 -- 390px dropdown open
- [mobile-after-vi.png](spec-1-2-locale-routing-dropdown-evidence/mobile-after-vi.png) -- 109707 bytes -- sha256 ba9b9df54bd9 -- 390px after the switch
- [desktop-dropdown-open.png](spec-1-2-locale-routing-dropdown-evidence/desktop-dropdown-open.png) -- 482228 bytes -- sha256 533ac0990e0f -- 1440px dropdown open
- [desktop-after-vi.png](spec-1-2-locale-routing-dropdown-evidence/desktop-after-vi.png) -- 465575 bytes -- sha256 90d07146d487 -- 1440px after the switch

**Not captured**

- The 640, 900 and 1080px widths were checked by the a11y e2e spec above, not by hand.
