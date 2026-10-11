# One-shot spec: Home motion — count-up and card effects (PR 1 of 3)

Owner: Hoang Vu (Andy). Stage: UI/UX enhancement (AGENTS.md). Route: one-shot (no API, no schema, no form change).
Plan: `plan-home-enhance.md` §2. PR 2 (content order) and PR 3 (background tones) follow.

## Goal

Home feels alive while you read it: the two key numbers count up, and the cards answer the
mouse and the press, without moving any content and with a still version for reduced motion.

## Design

- **Count-up** (`src/components/sections/count-up.tsx`, client; CSS "Count-up" in `globals.css`):
  only stats with `count: true` in the content (Home: 25+ years, 20+ tech stacks). The real
  number stays in the HTML; with motion allowed, its glyphs are transparent and a `::after`
  shows a registered `<integer>` property (`--count`) through a CSS counter, drawn from
  the real number's start in the same box, so neither the width nor the start ever changes. On screen at load: CSS counts from 0 at
  first paint (no "25 → 0" flash, no JavaScript needed). Below the screen: the script marks
  it `wait` (0, off screen) and `play` when it comes into view (same margin as the scroll
  reveal). Saved Pause: `off` (plain number). Reduced motion and print: plain number.
  The stats list joins the scroll reveal (`data-reveal`), so on phones the figures rise in
  as they count.
- **Press:** the doors and the Capabilities link cards shrink to 98% while pressed
  (`scale`, 0.2 s). Buttons already do this (`.btn:active`).
- **Pointer glow** (`src/components/sections/pointer-glow.tsx`, client, in the layout):
  cards with `data-glow` (the two doors now; the new Home cards in PR 2) show a soft amber
  light under the pointer. Mouse and pen with hover only; fades in and out with opacity,
  moves with `translate`. Reduced motion: no glow.
- **4-D step hover** (1080px and wider, hover devices): the amber track draws back to the
  centre of the hovered step (`translate`, exact `calc()` from the grid), the icon tile
  rises 4px and the orbs move out a little; all return on leave.
- **Office clocks:** Global delivery chips show a sun from 06:00 to 17:59 local time and a
  moon otherwise (`DaylightIcon`, shares `useOfficeTime` with `LiveClock`). Without
  JavaScript: the clock icon, as today.

## UX checks

| Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| ---- | --------------- | ----- | ------------------ | ------ | ------ | ------- |
| Hero 25+ and 20+ | On screen at load | Load | Count from 0 to the final number; the "+" never moves | 1.6 s after 0.2 s, soft ease-out | Lead 2026-10-11 | Yes (browser: 0 → 25 and 0 → 20, end pixels match) |
| Hero 25+ and 20+ | Below the screen at load (phone) | Scroll: wheel, touch, keyboard | Count starts as the figure rises into view | 1.6 s, with the 0.7 s rise | Lead 2026-10-11 | Yes (browser 390px: "wait", then "play" on scroll) |
| 24/7, 8, 2 | Any | Any | No count | None | Lead ("only the key numbers") | Yes (unit and browser: two `.count-up` only) |
| All figures | Reduced motion, or saved Pause | OS setting, hero Pause button | Final number at once | None | NFR-2, PRODUCT.md | Yes (browser: no `::after`, `data-count="off"`) |
| All figures | No JavaScript; screen reader | Browser setting; NVDA/VoiceOver | Final number in the HTML, read once | None | AGENTS.md | Yes (browser no-JS; `::after` alt text "") |
| Doors, Capabilities link cards | Pressed | Mouse down, touch | Card shrinks to 98%, back on release | 0.2 s | Lead 2026-10-11 | Yes (browser: `scale` 0.98) |
| Doors | Pointer moves over a door | Mouse, pen | Soft amber light follows the pointer; fades out on leave | Follows each frame; fade 0.4 s | Lead 2026-10-11 | Yes (browser: light at the pointer, opacity 1) |
| Doors | Touch | Touch | No glow; tap opens the page | None | EXPERIENCE.md (pointer effects only on hover devices) | Yes (unit: no listener without a fine pointer; CSS hover media) |
| 4-D step (1080px+) | Hover | Mouse, pen | Amber line draws back to that step's centre; icon tile rises 4px, orbs move out | 0.5 s line, 0.4 s art | Lead 2026-10-11 | Yes (browser: fill ends at the step centre, 605 = 605) |
| 4-D step (1080px+) | Pointer leaves | Mouse, pen | Line refills to the end; art settles | 0.5 s | Lead 2026-10-11 | Yes (CSS transition back to none) |
| Global delivery chips | After load | Load | Sun from 06:00 to 17:59 local, moon otherwise; it turns in | 0.5 s | Plan §2 (d) | Yes (unit at 06:00 and 18:00; browser: 2 icons) |
| Global delivery chips | No JavaScript | Browser setting | Clock icon, as today | None | AGENTS.md | Yes (unit: clock icon in the server HTML) |
| Whole Home | Reduced motion | OS setting | No count, no glow; press and hover changes are instant | None | NFR-2 | Yes (browser and CSS media) |
| Whole Home | Load, scroll, hover | Any | Layout shift 0 | n/a | PRODUCT.md (CLS at most 0.1) | Yes (layout shift 0.0000 at 1440px and 390px) |
