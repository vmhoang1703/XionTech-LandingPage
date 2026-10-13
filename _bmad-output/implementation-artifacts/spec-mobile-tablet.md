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
