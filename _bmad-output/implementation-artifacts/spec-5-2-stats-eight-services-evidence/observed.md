# Story 5.2 — what was observed

Production build made by `npm run test:smoke`, served with `npx next start -p 3005`, in Chrome via Playwright. Script `walk.mjs`, raw output `walk-output.txt`. Re-captured after the review patches on 2026-10-05.

- **Route `/services`, 1280px.**
  - The paper stats section follows the navy hero directly.
  - The five figures show with their captions; "+" and "/7" are rgb(138, 103, 0) (#8A6700).
  - The "Key facts" h2 is a 1×1 box (sr-only) and names the group. The section has no `aria-label`, so the name is announced once.
  - The list has a 0px top border, and each column keeps a 1px divider.
  - Stats 5 columns, services 4 columns.
- **Services section.**
  - Mist gradient with the linen `::after`, padding-top 40px.
  - h2 "Eight services, one team." and the lede.
  - Eight `article` cards in spec order, each with a 48px icon tile. `product-engineering` and `cloud` are `feature`, `ai-solutions` is `navy`.
  - Tags are in JetBrains Mono at 11.2px on five cards; co-creation, staffing and custom-apps have none.
- **Cards are not links.**
  - The grid has 0 links, buttons or tabindex elements; the cursor is `auto`.
  - Clicking `#low-code` leaves the URL unchanged.
  - Tab from "See our 4-D process" goes to the footer (logo, PXP, LXP); there is no stop in the grid.
- **Anchors, opening `/services#<id>` fresh for each of the eight.**
  - Each measurement waits until the smooth scroll stops (scrollY steady for 150 ms).
  - At 1280px and at 390px, every card top lands at 88 and every h3 at 172–173, below the header bottom at 72.
  - The earlier 390px readings of 94–131 were taken mid-scroll. A probe showed `#cloud` passing 467 at 500 ms, then 88 from 1000 ms on.
- **Links in from other pages (1280px).**
  - From Home, the Low-code card goes to `/services#low-code`, card at 88.
  - The footer "Cloud Computing" link goes to `/services#cloud`, card at 88.
  - Opening the Services mega menu by hover and clicking "Low-code Solutions" goes to `/services#low-code`, card at 88.
- **Widths.**
  - At 899px: stats 3 columns, services 2.
  - At 390px: stats 2 columns, services 1.
  - No sideways scroll at either width.
- **Reduced motion.**
  - The figures show 25+, 24/7, 20+, 8 and 2.
  - `html` `scroll-behavior` is `auto` (it is `smooth` without reduced motion). `/services#cloud` at 390px has the card at 88 right after load, with no smooth scroll.
  - The cards have no animation in either mode.
