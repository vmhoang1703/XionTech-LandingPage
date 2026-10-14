# One-shot spec: Products title clears the header pill

Owner: Hoang Vu (Andy). Stage: UI/UX enhancement (AGENTS.md). Route: one-shot (CSS only, no API, no schema, no form change).
Step 1 of `plan-responsive-mobile-tablet.md` (P0). Lead, 2026-10-13: preview shown, then "go".

## Problem

The Products page's first section (`.map-sec`, from #106) used the plain `.sec` padding (64px, 48px on
phones). The floating header pill (#101) sits over each page's first section, so every other page hero
adds `--spacing-header-room`. Without it, the pill covered the top of "Built apart. Better together.":
H1 top 64px vs pill bottom 84px at 1080px and up, 48px vs 68px on phones and tablets.

## Change

- `.map-sec { padding-top: calc(var(--spacing-header-room) + var(--spacing-section)); }` in
  `src/app/globals.css`: 160px above 1080px, 144px at 1080px and below (room 80px). The bottom padding and the
  roadmap are unchanged; the scroll tour measures its positions at run time.
- Test: `src/app/products/page.test.tsx` pins the rule and that the first section is `.map-sec`.

## UX checks

| Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| ---- | --------------- | ----- | ------------------ | ------ | ------ | ------- |
| Products H1 | Load, top of page | n/a | "Built apart. Better together." starts below the header pill, fully visible | n/a | Audit 2026-10-13 (P0) | Yes (screenshot 390) |
| Products H1 | Load at 320, 390, 768, 1024, 1280, 1440 | n/a | H1 top is at least 16px below the pill bottom at every width | n/a | Same | Yes (measured: 76px, 60px at 1080) |
| Roadmap tour | Scroll through the stops | Wheel, touch | The tour still moves stop to stop as before (e2e `products.spec.ts`) | As #106 | #106 | Yes (smoke + a11y 72/72) |
| Other pages | Load | n/a | No change (only `.map-sec` is touched) | n/a | Scope | Yes (diff) |
