# Japanese, French, Korean, Chinese: what the browser showed

Production build (`npm run build`, then `next start -p 3005`), Chrome via Playwright, 2026-10-14, at commit 945255c. `/api/*` was intercepted.

## Method

Every route (`/`, products, services, about, careers, news, demo, privacy) was opened at 320, 375 and 1440 px for each of ja, fr, ko and zh: 96 checks in all. The raw results are in `walk-b.json`. Screenshots cover the home and services pages (`w320_*` full page, `w1440_*` first screen).

## Results

- **Status and `lang`:** every route returned 200. `<html lang>` is `ja`, `fr`, `ko` and `zh-Hans`.
- **Overflow:** no page or header overflows at any of the three widths.
- **Fonts:** pages in ja, ko and zh each have exactly one Google Fonts stylesheet; fr has none.
  - `document.fonts.check` passes for Noto Sans JP and KR.
  - For zh, a check with Chinese characters (中文) passes on products, services and privacy.
  - Headings use `Unbounded, …, "Noto Sans SC"`, so Latin text keeps the brand font.
  - An earlier check reported Noto Sans SC as not loaded. It tested with Japanese and Korean characters, which SC does not cover, so that was a probe error.
- **English left on CJK pages:**
  - Names and tags kept English by decision: Low-code, the service tags (Web · Mobile, AI/ML · Dashboards, Power Platform…, Azure · AWS · GCP), "GET IT" in the logo, and "Get IT Done" on the Careers card.
  - Sanity text without a translation, shown inside `lang="en"`.
- **French:** this walk does not check for leftover English in French. `scripts/i18n/untranslated.test.mjs` and `completeness.test.mjs` cover it instead; both pass in `npm test`.
- **"+3" button:** the home page's "+3" more-services button (`w-more-trigger`) has scrollWidth 41 against clientWidth 38 at 320 and 375 px in every locale, en and vi included. It is not caused by this story and is logged as deferred.
