# Story 5.2 — what was observed

Production build (`npm run test:smoke` built it; `npx next start -p 3005`), Chromium via Playwright, script `walk.mjs`, raw output `walk-output.txt`. Run on 2026-10-05.

- **Route `/services`, 1280px.**
  - The paper stats section follows the navy hero directly.
  - The five figures show with their captions; "+" and "/7" are rgb(138, 103, 0) (#8A6700).
  - The "Key facts" h2 is a 1×1 box (sr-only) and still names the group. The list has a 0px top border, and each column keeps a 1px divider.
  - Stats 5 columns, services 4 columns.
- **Services section.**
  - Mist gradient with the linen `::after`, padding-top 40px.
  - h2 "Eight services, one team." and the lede.
  - Eight `article` cards in spec order, each with a 48px icon tile. `product-engineering` and `cloud` are `feature`, `ai-solutions` is `navy`.
  - Tags are in JetBrains Mono at 11.2px (0.7rem) on five cards; co-creation, staffing and custom-apps have none.
- **Cards are not links.**
  - The grid has 0 links, buttons or tabindex elements; the cursor is `auto`.
  - Clicking `#low-code` leaves the URL unchanged.
  - Tab from "See our 4-D process" goes to the footer (logo, PXP, LXP); there is no stop in the grid.
- **Anchors, opening `/services#<id>` fresh for each of the eight.**
  - At 1280px the header bottom is at 72, every card top at 88 and its h3 at 172–173. All visible.
  - At 390px:
    - The first three cards land at 88.
    - Later cards land at 94–131. The amount differs between runs, so the content above is still settling after the jump.
    - Every h3 is fully below the 72px header.
- **Links in from other pages.**
  - From Home (1280px), clicking the Low-code card goes to `/services#low-code`: card at 88, h3 at 173.
  - The footer "Cloud Computing" link goes to `/services#cloud`: card at 88.
- **Widths.**
  - At 899px: stats 3 columns, services 2.
  - At 390px: stats 2 columns, services 1.
  - No sideways scroll at either width.
- **Reduced motion.** The figures show 25+, 24/7, 20+, 8 and 2; the card animation is `none` and the transition is 0s.
