# One-shot spec: Home background tones — one canvas that changes as you scroll (PR 3 of 3)

Owner: Hoang Vu (Andy). Stage: UI/UX enhancement (AGENTS.md). Route: one-shot (no API, no schema, no form change).
Plan: `plan-home-enhance.md` §2 "Background (option C)". PR 1 (motion) and PR 2 (content) are merged.

## Goal

Below the hero, Home reads as one modern canvas whose colour shifts with the story, instead of
separate section strips, without hurting text contrast, performance or the static page.

## Design

- `HomeScene` (client) wraps everything below the hero. Its first child is a decorative layer
  (`aria-hidden`), sticky at the top, one screen tall (`100lvh`) and taking no space
  (`margin-bottom: -100lvh`). `overflow: clip` on the scene keeps the layer inside it, so the hero
  and the footer stay navy and the page gets no extra scroll.
- `SceneMark` (an empty block) marks where a tone starts: blue before Why XionTech., mist before
  Our core values.; paper before the first mark. Contact keeps its own warm surface; with the scene
  on, its first gradient stop is see-through (`--contact-top`), so the scene flows into its cream
  with no seam and its amber still meets the footer ridge. Two earlier tries failed in the browser:
  a scene-wide warm tone, pinned to the screen, left the ridge on pale cream; Contact outside the
  scene left a visible line where the scene met Contact's opaque top.
- The tone is the last mark above the middle line of the screen. An IntersectionObserver whose root
  is the top half of the screen re-checks it whenever a mark crosses that line.
- Tones are three stacked layers; the active one fades in (opacity, 0.8 s, brand curve):
  paper `#f4f6fa → page` (the old Home flow), blue `door-tint → mist`, mist `mist → mist-end` (the
  News surface). With the scene on, the Home flow and News drop their own backgrounds.
- Two soft glows (amber 14%, navy-soft 10%) drift up 20vh over the whole page scroll, with CSS
  scroll-driven animation where supported (`@supports (animation-timeline: scroll())`); still
  elsewhere.
- Contrast: every text colour on every tone is 4.5:1 or more. Blue uses `door-tint`, not `ice`: on
  `ice` the amber step numbers would be 4.15:1; on `door-tint` they are 4.56:1.
- Off (no scene, today's still backgrounds): server HTML and no JavaScript, reduced motion, a saved
  Pause.

## UX checks

| Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| ---- | --------------- | ----- | ------------------ | ------ | ------ | ------- |
| Home background | Scroll down the story | Wheel, touch, keyboard (Page Down, Space) | Paper, then blue at Why XionTech., mist at the values; Contact warms from mist into amber | 0.8 s fade, brand curve; Contact follows the scroll | Lead 2026-10-11 (option C) | Yes (browser 1440 and 390: paper > blue > mist; screenshots) |
| Home background | Scroll back up | Any | The tones fade back in reverse | 0.8 s | Lead 2026-10-11 | Yes (unit: tone follows the last mark above the line, both ways) |
| Glows | Scroll | Any | Two soft glows drift up a little; still where scroll-driven animation is missing | Linked to scroll | Lead ("background can move on scroll") | Yes (Chrome: scroll-linked; `@supports` guard) |
| Hero, Contact, footer | Any | Any | Keep their own surfaces; the footer ridge sits on Contact's amber | n/a | DESIGN.md, E-A4 | Yes (screenshots: ridge on amber; no line at News → Contact) |
| All text | On any tone | Any | 4.5:1 or more (amber step numbers 4.56:1 on blue) | n/a | WCAG 2.2 AA | Yes (computed with `contrastRatio`: lowest 4.56:1; axe at rest passes) |
| Whole Home | Reduced motion, saved Pause, no JavaScript | OS setting, Pause button, browser setting | No scene: each section keeps its still background | None | NFR-2, AGENTS.md | Yes (browser: no `data-scene`, still backgrounds; unit) |
| Whole Home | Load, scroll | Any | Layout shift 0; no horizontal scroll at 390px | n/a | PRODUCT.md | Yes (layout shift 0.0000; no sideways scroll; same page height) |
