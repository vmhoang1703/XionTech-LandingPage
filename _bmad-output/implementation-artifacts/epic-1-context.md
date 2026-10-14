# Epic 1 Context: Bilingual site shell

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Any visitor can move through a branded, bilingual (EN/VI) site at any width. Stories 1.1 to 1.7 deliver the shared layout every later page renders inside (tokens and fonts, locale routing and language dropdown, header and mega menu, mobile menu, footer, inner hero and breadcrumbs, Not found); Story 1.8 connects the Sanity content source. Scope note: on 2026-09-29 the team decided the Demo-day build (2026-10-16) is English only with no language switch, so Story 1.2 and all Vietnamese strings were scheduled after demo and VI parts of acceptance criteria are checked after demo. The planning docs record no later reversal of that decision; if Story 1.2 is being built before Demo day, confirm with the lead (Hoang Vu) and log it in `docs/ai-log.md`.

## Stories

- Story 1.1: Brand tokens, fonts, surfaces and motion primitives
- Story 1.2: Locale routing and language dropdown
- Story 1.3: Desktop header, mega menus and skip link
- Story 1.4: Mobile menu
- Story 1.5: Site footer
- Story 1.6: Inner page hero, breadcrumbs and anchor landing
- Story 1.7: Not found page
- Story 1.8: Sanity setup

## Requirements & Constraints

- **Locale routing:** every page exists under `/en/` and `/vi/`. Bare `/` redirects on the server, at request level, to the saved locale (cookie), else `/vi/` when the browser prefers Vietnamese, else `/en/`. A locale in the URL always wins over the saved choice (a shared `/en/products` opens in English for a `vi` visitor). A path without a locale (e.g. `/products`) redirects to the same path under the resolved locale; `sitemap.xml`, `robots.txt`, favicon, `_next` and public assets are excluded and served as-is.
- **Locale cookie:** the choice is stored in an essential first-party cookie (never local storage, which the server cannot read). Under Vietnam PDPD it counts as essential, needs no consent, and must be listed in the privacy page's cookies section. No non-essential cookies without opt-in.
- **Switching language:** lands on the same page under the other locale, keeps scroll position and typed form values, updates `<html lang>`, title and meta description, and saves the cookie.
- **Strings:** every visible string, page title, meta description, screen-reader label, alt text and toast exists in EN and VI. A unit test must fail when a key exists in one locale but not the other, and must check product and service names are identical in both. Product names (PXP, LXP, SXP, IoT Device Management) and service names stay English. Who writes/checks the Vietnamese copy is an open question; unverified copy uses `[Placeholder]` in both languages.
- **Voice:** short plain sentences, headlines end with a full stop, "you"/"we", no exclamation marks (except "Thank you!"), no emoji, prototype spelling (organisation). Brand name in copy is "XionTech". English is the default language.
- **SEO (Epic 7, after demo, but routing must allow it):** per page and locale title, description, canonical, Open Graph; `hreflang` pairs for `/en/` and `/vi/` plus `x-default` to `/en/`; sitemap for both locales; header, footer and News server-rendered.
- **Accessibility:** WCAG 2.2 AA in both locales; visible focus ring; controls (including the language dropdown and its options) at least 44px; hidden content unfocusable; meaningful alt text in EN and VI.
- **Layout:** Vietnamese runs longer; buttons never truncate, headlines may wrap; breakpoints 1080/900/640px down to 320px.
- **Dates:** news dates in mono, `18 SEP 2026` (EN) and `18/09/2026` (VI).

## Technical Decisions

- Locale segment `src/app/[locale]/...` with a request-level redirect for bare and unprefixed paths reading the locale cookie; the exact Next.js 16 mechanism (e.g. proxy/middleware) must be confirmed in `node_modules/next/dist/docs/` before coding.
- Fonts via `next/font` with `subsets: ['latin', 'vietnamese']` and `display: swap`: Unbounded (headlines), Lexend Exa (brand caps), Be Vietnam Pro (body/UI), JetBrains Mono (data). Never fonts without Vietnamese glyphs (Michroma, Orbitron, Sora).
- `:lang(vi) h1, :lang(vi) h2 { line-height: 1.2 }` (floor 1.18); never tighten tracking on Vietnamese uppercase.
- Tokens live in `src/app/globals.css` `@theme`; amber text uses `#8A6700`, never `#C99700`.
- Sanity content uses field-level translation (one document with EN and VI fields) `[ASSUMPTION]`.
- Server Components by default; the dropdown is a client component only where state is needed.

## UX & Interaction Patterns

- **Language dropdown** (popover disclosure, not a menu role): the last item in the header bar at every width (320px to wide desktop), never inside the mobile menu. Trigger is a button styled like the nav links (Be Vietnam Pro 500, ink text, no border, mist fill on hover and while open, 44px tall, pill) showing the current code EN or VI with a caret that flips up when open; it is the only header control with a caret. Options "EN" and "VI" (named English and Tiếng Việt) appear in a small list on the header glass (page at 96%, hairline border, large radius), same text style; current option is bold navy and has `aria-current`. Choosing closes the list and returns focus to the button; Escape or an outside click closes it.
- Design reference: prototype header template in `_bmad-output/prototype-enhancement/prototype/js/site.js` (`.lang`, `#langBtn`, `#langList`).
- Below 1080px the header bar shows logo, language dropdown and Menu button; the mobile menu focus trap includes the language dropdown.
- Reduced motion: no animation runs; animate only transform and opacity.

## Cross-Story Dependencies

- 1.1 (tokens and fonts, including the Vietnamese subset) underpins every story; 1.2 depends on 1.1.
- 1.3 and 1.4 reserve the language dropdown slot in the header bar that 1.2 fills; 1.4's focus trap must include it.
- 1.5, 1.7 and every page story render links and copy in the current locale, so they consume 1.2's routing and string sets.
- Epic 2 privacy page must list the locale cookie; Epic 7 (Story 7.1) adds metadata, hreflang and sitemap on top of 1.2's locale URLs.
