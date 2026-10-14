# Vietnamese page content: what the browser showed

Production build (`npm run build`, then `next start -p 3005`), Chrome via Playwright, 2026-10-14, at commit 7c46664 (after the review patches). `/api/*` was intercepted.

## Method

Each route was opened at 320, 375 and 1440 px: `/vi`, `/vi/products`, `/vi/services`, `/vi/about`, `/vi/careers`, `/vi/news`, `/vi/demo`, `/vi/privacy`, one news story and one job. For each, I listed every visible text node that has no Vietnamese diacritics, has two or more Latin words, and is not on the allow-list of names that stay English. The raw results are in `walk-vi.json`. Screenshots are named `w320_*.png` (full page) and `w1440_*.png` (first screen).

## Results

- All routes return 200. `<main>` has no `lang` attribute, and no button is truncated (no button has scrollWidth > clientWidth).
- No static page copy is left in English. What remains falls into these groups:
  - Sanity content with no Vietnamese yet, shown as English inside elements marked `lang="en"`: news card titles on `/vi` and `/vi/news`, the PXP story body, and the Fresh Full Stack Developer job (title, about, responsibilities, requirements). This is the planned fallback; editors still need to fill in the `vi` fields in Studio.
  - Names, tags and addresses kept in English by decision: service tags (Web, Mobile, AI/ML, Dashboards, Power Platform, Make, n8n, Retool, Bubble, Azure, AWS, GCP), "Low-code", the office addresses and email, and "Get IT Done" (the Careers value card and its index label).
- 320 px and 1440 px: no page or header overflow.
- 375 px: no overflow on any page. Since the review patch, the header hides "Book a demo" below 412 px and compacts it up to 443 px.
- The Home clock chips show "Giờ miền Trung Mỹ", and the HCMC abbreviation's title is "TP. Hồ Chí Minh". The Services hero keeps "Get IT done" in English (decision 4).
