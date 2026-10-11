# One-shot spec: Home background — one colour field and a navy "How we work" (PR 3 of 3)

Owner: Hoang Vu (Andy). Stage: UI/UX enhancement (AGENTS.md). Route: one-shot (no API, no schema, no form change).
Plan: `plan-home-enhance.md` §2. PR 1 (motion) and PR 2 (content) are merged.

## History

The first version of this PR faded three pale tones (paper, light blue, mist) behind the story. The
lead rejected it: "It does not match to my ideas and at overall, it is not enough to say wow". His
idea was one background colour for the whole Home page, with background motion you can see when
scrolling. Two directions were previewed on the real page (screenshots and scroll videos): navy all
the way, and one light colour with a moving colour field. He chose the light colour field, plus one
navy moment in "How we work".

## Goal

Below the hero, Home is one light canvas with a living amber and blue colour field, and one dark,
premium moment in the middle of the story, without hurting text contrast, performance or the static
page.

## Design

- `HomeScene` wraps everything below the hero: one light colour (`--color-page`) and a decorative
  layer (`aria-hidden`), sticky, one screen tall and taking no space, with three soft blobs: blue,
  amber, and a smaller warm amber. `overflow: clip` keeps the layer off the hero and the footer.
- Each blob floats on its own (16–22 s, `transform`). With scroll-driven animations it also travels
  as the page scrolls (`translate`, `animation-timeline: scroll(root)`): amber down the right, blue up
  the left, warm across the bottom. Where scroll-driven animations are missing the blobs only float.
- Under the hero doors the field fades in from the page colour (`.home-scene::before`), so it meets
  the doors' strip (now `--color-page`) with no edge.
- The Home flow and News drop their own backgrounds; Contact keeps its warm surface with a
  see-through first stop (`--contact-top`), so the field flows into its cream and its amber still
  meets the footer ridge. The room above the footer goes on the last section inside the scene.
- "How we work" is the one navy moment: `surface-navy`, a rounded panel inset like the Services
  panels, with a soft amber light (18%) that crosses it as it passes through the screen
  (`animation-timeline: view()`). On navy the 4-D steps take dark art and amber numbers.
- Contrast: blobs stay soft enough for every text colour. Muted text is 4.64:1 or more where they
  are strongest, with amber painted over blue (blue over amber would be 4.38:1, so blue is painted
  first). Small amber text now sits on navy or on cards only.
- CSS only, so the field shows with no JavaScript. Reduced motion (the global reset) and a saved
  Pause (`HomeScene` sets `data-paused`) hold the field and the light still; the colours stay.

## UX checks

| Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| ---- | --------------- | ----- | ------------------ | ------ | ------ | ------- |
| Home background | Scroll the page | Wheel, touch, keyboard (Page Down, Space) | One light colour; soft amber and blue colour that floats and travels as you scroll | Float 16–22 s; travel linked to scroll | Lead 2026-10-11 (option 2, chosen from a preview) | Yes (scroll video; screenshots 1440 and 390) |
| Colour field | Top, under the hero doors | Load | Fades in from the page colour; no edge at the doors | n/a | Lead (one colour) | Yes (screenshot) |
| How we work | Scroll into view | Any | Rounded navy panel; a soft amber light crosses it | Linked to scroll | Lead ("one navy moment") | Yes (screenshots 1440 and 390) |
| 4-D steps on navy | Any | Mouse, touch, keyboard | Glass cards, amber numbers, dark art; the PR 1 hover still works | n/a | PR 1 | Yes (screenshot; hover rules unchanged) |
| Contact and footer | End of the page | Any | The field flows into Contact's cream; amber behind the footer ridge | n/a | E-A4 | Yes (screenshot; ridge test) |
| All text | On the field or the navy panel | Any | 4.5:1 or more; muted text lowest 4.64:1 (amber over blue) | n/a | WCAG 2.2 AA | Yes (computed with `contrastRatio`; axe at rest) |
| Whole Home | Reduced motion, saved Pause | OS setting, hero Pause button | Field and light hold still; the colours stay | None | NFR-2 | Yes (global reset; unit for `data-paused`) |
| Whole Home | No JavaScript | Browser setting | The same colour field (CSS only) | n/a | AGENTS.md | Yes (server HTML test) |
| Whole Home | Load, scroll | Any | Layout shift 0; no sideways scroll; page height unchanged | n/a | PRODUCT.md | Yes (0.0000; 7,151px desktop) |
