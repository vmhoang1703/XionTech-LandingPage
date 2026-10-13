# Plan: mobile and tablet pass (2026-10-13)

Owner: Hoang Vu (lead). Audit by Claude Code on `develop` at `f4a3314` (live on
https://xiontech-dev.vercel.app). Goal: everything we built for desktop in #96–#106 works and
impresses on phones and tablets before Demo day (2026-10-16).

## How it was measured

Headless Chrome (Playwright, touch and mobile emulation, DPR 1) on 10 pages: `/`, `/services`,
`/products`, `/about`, `/careers`, `/news`, `/demo`, `/privacy`, one news story, one job.
Widths: 320×640, 390×844, 844×390 (phone landscape), 768×1024, 1024×768. Each page was
scrolled to the end to fire the reveals. Checks: sideways scroll, elements outside the screen,
layout shift (CLS), tap targets, text under 12px, first-screen positions; full-page screenshots
at 390 and 768. Emulation only: no real iPhone or Android yet, and Chromium is not Safari.

## What already works

- No sideways scroll on any page at any width, 320 included.
- CLS 0 on every page and width.
- Header pill fits at 320 (56px pill, logo, Book a demo, menu button). The menu panel opens
  under the pill and lists all six pages.
- Home first screen: at 390 the H1, sub line and Get in touch are in view and the stats band
  starts; at 768 all five stats are in view.
- Tablet (768) uses two-column grids for products, process, values, news and the form.
- New copy (AI line, four locations) and the page scene background show at every width.

## Desktop work vs phone and tablet today

| Desktop work | Phone (≤640) | Tablet (641–1079) |
| --- | --- | --- |
| Header pill, amber CTA (#101) | OK | OK (hamburger up to 1079, also iPad landscape 1024) |
| Globe, XT mark, GET IT DONE slogan (#102, #103) | **Not shown**: `.hero-stage` is `hidden lg:block`, so the canvas has no stage under 1080px. Pause button shows with only the silk behind it | **Not shown**; the right half of the hero is empty |
| Stats above the fold (#102) | OK; 5th stat sits alone in the 2-column grid | OK (3 + 2) |
| AI copy, 4 locations (#103–#105) | OK | OK |
| Page scene background (#99, #100) | OK | OK |
| Products school-day tour (#106) | Vertical road list, works. **Bug: the H1 "Built apart. Better together." is under the header pill** | **Same bug** (H1 bottom at 101px, header room 80px) |

## Findings, by priority

### P0 — bug

1. **Products H1 hidden under the header pill at ≤1080px.** `.map-sec` (src/components/products/journey/journey-section.tsx)
   uses the plain `.sec` padding (`--spacing-section-mobile` on phones), not the header room the
   other page heroes use (`calc(var(--spacing-header-room) + …)`). H1 bottom at load: 158px (320),
   121px (390), 101px (768), 111px (1024). Desktop to be checked in the same fix.

### P1 — the wow is missing on phones and tablets

2. **No globe, no XT mark, no slogan under 1080px.** The hero's main animation is desktop only.
   Phones and tablets see the silk and text. This is what judges will see first if they open the
   site on a phone.

### P2 — pages are too long on phones

Home is 13,790px tall at 390 (desktop: 7,151px). Services 7,584px, Careers 6,222px, About 5,579px.
Main causes:

3. Flip value cards (Home "Our core values", Careers "Five things"): one per row, 230–300px tall,
   mostly empty (title, one line, "Flip for details").
4. 4-D process cards (Home, Services): one per row, about 250px each with the icon art.
5. Service cards (Services): eight cards, about 260px each.
6. Footer: about 1,400px on a phone (four link groups and two office cards stacked).
7. Capture band: large empty yellow area above the mountain line.

### P3 — touch and readability

8. Tap targets under 44px (PRODUCT.md rule): footer links 24px tall, link arrows ("Explore
   services") 26px, Pause 36×36, "+3 more industries" 38×38, roadmap "Details" 25px, logo link
   26px. Under 24px (WCAG 2.5.8 floor): capture-band "Privacy policy" link 17px at 320.
9. Text under 12px: "You receive" 9.6px (process cards), P-Hub/S-Hub badges 10.6px, office tags
   10.9px. The 11.5px uppercase labels are the brand eyebrow style; keep.
10. 49 CSS `:hover` rules, only 5 inside `@media (hover: hover)`: on phones a tapped card can stay
    in its hover look. (Tailwind `hover:` is already guarded.)
11. No safe-area padding (`env(safe-area-inset-*)`) for notch phones in landscape.
12. Phone landscape (844×390): Get in touch is below the first screen (451px).

### Content note (all widths, not responsive)

- Services hero still says "from Ho Chi Minh City" only; the four locations are not there.
- Footer and About office cards still say "Vietnam/US Delivery Center", not headquarters (open item).

## Plan

| Step | What | Est. | Needs from lead |
| --- | --- | --- | --- |
| 1 | P0: Products hero top padding = header room, every width; test pins H1 below the pill | 30 min | — (Sammy's page; tell Sammy) |
| 2 | P1: mobile and tablet globe. Mock 2–3 options first (below), lead picks, then build. Fewer dots and DPR cap on phones; Lighthouse mobile ≥ 90 kept | 3–4 h | pick an option |
| 3 | P2: shorter phone pages. Value cards as 2-column tiles; process and services as a swipe row (scroll-snap) or compact steps; footer link groups as two columns or accordions. Target Home ≤ 10,000px at 390 | 3–4 h | pick card pattern |
| 4 | P3: tap targets ≥ 44px, text ≥ 12px, `:hover` rules inside `(hover: hover)`, safe-area padding | 1.5 h | — |
| 5 | Verify: this audit again (all 10 pages, 5 widths), Lighthouse mobile on Home and Products (not measured since #99), reduced motion, one real iPhone and one real Android | 1 h | real phones |

Order for Demo day: 1 → 2 → 4 → 3 → 5. Step 1 and 4 are safe fixes; 2 is the wow; 3 is the
biggest change and can wait if time runs out.

### Step 2 options (to mock)

- **A. Stage under the CTA.** A 240–280px globe band between Get in touch and the stats. Clear,
  but pushes the stats below the first screen on phones.
- **B. Globe behind the text.** The globe sits large at the top right, part off-screen, dimmed
  under the H1; the mark and slogan show when it settles. Keeps the first screen as it is.
- **C. Tablet two columns from 900px.** Desktop layout (text left, stage right) from 900px;
  phones get A or B.
