# Japanese, French, Korean, Chinese: what the browser showed

Production build (`npm run build`, then `next start -p 3005`), Chrome via Playwright, 2026-10-14, re-captured after the review patches, at commit c35da46 (code at ced1c17). `/api/*` was intercepted.

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
- **"+3" button:**
  - At 320 and 375 px it no longer overflows in any locale. Below 640 px the circle is now the full 44 px tap target (`e2e/home-more-chip.spec.ts`).
  - At 900 and 1440 px the 38 px circle still has scrollWidth 41, the same in en and ja. The cause is its invisible `::after` hit area, which extends 3 px to make a 44 px tap target. Nothing visible is cut off. This is the original design and the patch did not change it.

## English and Vietnamese unchanged

- **How it was checked:** the baseline commit 6069334 and this branch were each built and served, and the visible text of all eight routes was captured in en and vi at 1440 px. The diff is in `en-vi-text.diff`.
- **What differs (intended):**
  - The language list shows native names instead of the EN/VI codes (decision 2).
  - The Privacy provider line adds Google Fonts.
  - The live office clocks moved by a minute between the two captures.
- **What else differs:** nothing.
