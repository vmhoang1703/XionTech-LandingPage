# One-shot spec: shared scroll reveal on every page

Owner: Hoang Vu (Andy). Stage: UI/UX enhancement (AGENTS.md). Route: one-shot (no API, no schema, no form change).

## Goal

Sections settle into place smoothly as the visitor scrolls, on every page, with one motion style.

## Design

- `src/components/sections/scroll-reveal.tsx` (client, in `src/app/layout.tsx`): one frame after mount and after each navigation, it scans `[data-reveal]` groups. Direct children below the screen get `data-shown="wait"` and are observed; children on screen are left alone. On arrival: `data-shown="play"` and `--reveal-delay` (70 ms steps, cap 280 ms).
- `globals.css` "Scroll reveal": `wait` = opacity 0, `translate: 0 18px`; `play` = `reveal-rise` 0.7 s `var(--ease-brand)`. Same values as the 4-D flow steps. Focus, print and reduced motion show items at once.
- Never marks anything under `prefers-reduced-motion: reduce` or after a saved Pause (`readMotionPaused`).
- Groups: Home (Capabilities head, cards, motto; Values head, cards; Process heading row; News heading row, cards; Contact), About (story chapters, FAQ head and list, offices), Services (section heads, service cards, outcomes), Products (apps heading), Careers (Inside, flip cards, life frames, open roles), every capture band, the footer.
- Not marked: heroes, the 4-D flow (own reveal), News filters list (changes on filter), story, job and privacy body text.

## UX checks

| Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| ---- | --------------- | ----- | ------------------ | ------ | ------ | ------- |
| Any reveal group | Item below the screen scrolls into view | Mouse wheel, touch scroll, keyboard (Page Down, Space) | Item rises 18px and fades in once | 0.7 s, brand curve | Lead brief 2026-10-10 | Yes (browser walk, 8 pages) |
| Row of cards | Several items arrive together | Scroll | They start left to right | 70 ms apart, max 280 ms | Lead brief | Yes (screenshot, Home values) |
| Any item | On screen when the page loads | Load | Shows at once, no flash, no replay | None | PRODUCT.md (motion never costs access) | Yes (browser walk) |
| Any item | Hidden item gets focus | Keyboard (Tab) | Shows at once | None | WCAG 2.2 AA | Yes (unit and CSS rule) |
| Whole page | Reduced motion on | OS setting | Nothing hidden, nothing moves | None | NFR-2 | Yes (browser walk) |
| Whole page | No JavaScript | Browser setting | Everything visible | None | AGENTS.md | Yes (browser and no-JS CSS test) |
| Whole page | Link to another page | Click | New page's items reveal as above; footer keeps its state | One frame after navigation | Lead "apply for all page" | Yes (Home -> About walk) |
| Card with hover lift | Hover after reveal | Mouse | Hover lift still works | Existing | Existing card styles | Yes (`translate` is separate from `transform`) |
| Whole page | Scroll through | Any | Layout shift 0 | n/a | PRODUCT.md CLS at most 0.1 | Yes (0.0000 on all 8 pages) |
