# One-shot spec: mobile and tablet pass

Owner: Hoang Vu (Andy). Stage: UI/UX enhancement (AGENTS.md). Route: one-shot (no API, no schema, no form change).
Steps 2–4 of `plan-responsive-mobile-tablet.md`; step 1 is `spec-products-title-pill.md`. All on one branch and PR
(lead, 2026-10-13: "This branch is used for responsive enhancement").

## Step 2: the XT mark behind the headline on phones and tablets

Lead, 2026-10-13: picked "globe behind the text" from the preview, "but the T and the slogan must not fall off the
edge. No need to show globe"; then asked for one suggestion. Agreed: one design for every screen under 1080px.

- `.hero-stage` is no longer hidden under 1080px. Below 1080px (`globals.css`) it is an absolute box on the right of
  the hero, behind the headline: phones `top 110px, right 6px, width max(60%, 212px), height 320px`; 641–1079px
  `top 90px, right 16px, width 50%, height 420px`. The mark is fully on screen (smallest mark size 115 at 320px;
  HeroSilk needs 110). The H1 and sub line get a soft navy (`--color-ink`) text glow.
- Mark-only story (`globe-mark.ts`, `frameAt(time, markOnly)`): the sparks gather straight into the mark
  (0.2–2.9 s), GET IT DONE writes up the stem (2.6–4.4 s, `MARK_END`), then the mark rests for good at a loop phase
  where the full story rests: light sweeping, twinkle and the pulse up the T keep moving. No globe, torch, office
  names, mountain or check-mark tick. `HeroSilk` asks for it with `matchMedia("(width < 1080px)")`, the same edge as
  the CSS, measured again on every resize.
- Same as before: desktop (1080px and up) story, Pause/Play, reduced motion (starts paused on the finished mark),
  no WebGL fallback (static glow, no mark).

## Step 3: touch targets and small text

- 44px to tap on touch screens (`pointer: coarse`; PRODUCT.md), mouse layouts unchanged: the logo link
  (`min-h-11`), footer links (`pointer-coarse:min-h-11`, list gap 0), arrow links (`.link-arrow` 44px), the
  Pause/Play button (`pointer-coarse:h-11 min-w-11`). The menu button no longer shrinks at 320px (`shrink-0`;
  was 30px wide). The 38px "+3 more" circle gets a 3px invisible ring (`::after`), so it taps as 44px.
- Labels up to DESIGN.md's 11.5px floor (0.72rem), like the other labels: "You receive" (9.6px), the P-Hub and
  S-Hub badges (10.6px), the roadmap badges (11.2px) and the office tags (10.9px).
- Not changed, by design: inline links inside a sentence (WCAG 2.5.8 exception), the skip link (keyboard only),
  the roadmap "Details" button (its `::after` already makes the whole card the target), the form checkbox
  (its label toggles it). Hover: the moving hover effects are already inside `(hover: hover)`; the rest are
  colour changes on links. Safe areas: the viewport keeps the default `viewport-fit`, so iOS keeps content out
  of the notch.

## Step 4: shorter phone pages

- Flip cards (Home values, Careers "Five things"), 640px and below: the faces stack in one grid cell instead of
  sitting absolute, so a card is as tall as its longer face (was a fixed 304px), and the back text is never cut
  off. One card a row up to 520px. The preview showed two a row, but that was the fronts only: with the real
  back text (up to 204 characters) two columns were no shorter and the titles wrapped to five lines.
- 4-D process (Home, Services), below 640px: the steps sit in a row you swipe through (scroll-snap, 84% wide,
  the next card peeking in), instead of four tall cards.
- Footer, 640px and below: the link groups pair up in two columns; the brand and the offices keep the full
  width.
- Heights at 390px: Home 13,790 → 12,264px, Services 7,584 → 6,630px, Careers 6,222 → 5,697px; About
  5,579 → 5,658px (44px footer links). Desktop unchanged (Home 7,266 vs 7,263px live).

## UX checks

| Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| ---- | --------------- | ----- | ------------------ | ------ | ------ | ------- |
| Home hero, phone (320, 390) | Load | n/a | Sparks gather into the XT mark on the right, behind the headline; then GET IT DONE writes up the T | Mark by 2.9 s, slogan 2.6–4.4 s | Lead 2026-10-13 (preview, "go") | Yes (screenshots 1.5 s, 3.4 s; unit tests) |
| Home hero, phone | At rest | n/a | Whole X, T and slogan on screen; no globe at any time; light sweeps across the mark | From 4.4 s, for good | Same | Yes (screenshots 320, 390 at 18.8 s; unit tests) |
| Home hero, tablet (768, 1024, 1079) | Load and rest | n/a | Same story; the mark sits in the right half | Same | Same | Yes (screenshots 768, 1024, 1079) |
| Headline and sub line | Over the mark | n/a | Text readable over the dots (navy glow behind the letters) | n/a | Preview B3 | Yes (screenshots) |
| First screen, phone 390 | Load | n/a | Get in touch and the start of the figures still on the first screen (no layout change) | n/a | Plan step 2 | Yes (Get in touch bottom 509px of 844) |
| Desktop 1440 | Load | Mouse | Unchanged: globe first, then the full 20 s story | As #103 | #103 | Yes (screenshots 5 s globe, 18.8 s mark) |
| Pause/Play | Tap | Touch, keyboard | Stops and restarts the mark (and the silk) | Instant | NFR-2 | Yes (existing hero-silk unit tests; same clock) |
| Reduced motion | Load | n/a | Starts paused on the finished mark with its slogan | n/a | NFR-2 | Yes (screenshot 390, reduced motion) |
| Resize across 1080px | Drag the window | Mouse | The story switches between mark-only and full; nothing is cut off | On resize | Plan | Pending (re-measured on resize by the ResizeObserver; not walked by hand) |
| Tap targets, phone 390 | After scrolling the page | Touch | Logo, menu, footer links, arrow links, Pause at least 44px tall; "+3" circle 38px with a 44px tap ring | n/a | PRODUCT.md (44px) | Yes (measured: one under 44px, the "+3" circle, ringed) |
| Tap targets, desktop | Load | Mouse | Footer, arrow links and Pause keep their old size | n/a | Scope | Yes (Home 1440 height 7,266 vs 7,263px live) |
| Labels | Load | n/a | "You receive", badges and office tags at 11.5px; badge text fits its 44px box | n/a | DESIGN.md floor | Yes (no badge overflows; screenshot) |
| Flip cards, phone 320 and 390 | Tap every card | Touch | Back text fully visible, card height does not change on flip | 0.65 s flip | Plan step 4 | Yes (screenshots of all backs, Home and Careers) |
| 4-D process, phone | Swipe sideways | Touch | Steps move one by one and snap; the next card peeks in; the page does not move sideways | Snap | Preview | Partly: scrolled one card by script in Chromium phone emulation (row 1,222px in 370px, snaps, no sideways page scroll); a real finger swipe on iOS and Android is still to do |
| Footer, phone | Load | n/a | Products and Services side by side, Company under Products, offices full width | n/a | Preview | Yes (screenshot) |
| All pages, 320–1440 | Load | n/a | No sideways scroll | n/a | Audit | Yes (Home, Services, Careers, About at 320, 390, 768, 1440) |
