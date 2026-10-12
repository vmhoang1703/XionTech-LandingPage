# One-shot spec: the Home background on every main page

Owner: Hoang Vu (Andy). Stage: UI/UX enhancement (AGENTS.md). Route: one-shot (no API, no schema, no form change).
Follows `spec-home-background.md` (PR #98). Lead, 2026-10-12: "apply home tones for other pages ... to make website consistent"; preview shown, then "go".

## Goal

Every main page shares Home's background below its own hero: one light colour with the moving amber and blue colour field, ending warm above the footer ridge.

## Design

- `HomeScene` becomes the shared `PageScene` (`src/components/sections/page-scene.tsx`, class `page-scene`). Home is unchanged.
- Services, About, Careers and Products: the scene wraps everything below the hero. News: the scene wraps the whole page, without the fade-in (`fade={false}`), because its heading sits inside it.
- Light surfaces inside the scene (`surface-paper`, `surface-mist`, `hero-light`) turn see-through. Navy ones stay: the Products demo band. Each hero keeps its art; light heroes now end in the page colour (Careers, Products, the About ground), so the field starts with no line.
- Warm end: `.page-scene::after`, 520px of amber light at the bottom, behind the footer ridge and under the content. On Home it sits under Contact's own warm surface; on Products under the navy band.
- Removed: `.svc-flow`, the Services panel background, `.careers-flow`, `.news-flow`.
- Not on reading pages (news story, job, Privacy, Demo): moving colour behind long text is harder to read.
- No new navy parts: the lead did not ask for one on About, Careers or News.

## UX checks

| Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| ---- | --------------- | ----- | ------------------ | ------ | ------ | ------- |
| Services, About, Careers, Products, News | Scroll the page | Wheel, touch, keyboard (Page Down, Space) | Light page colour with the same moving amber and blue field as Home, below the hero | Float 16–22 s; travel linked to scroll | Lead 2026-10-12 (preview) | Yes (screenshots 1440 and 390) |
| Light heroes | Hero bottom | Load | The field starts with no line under the hero | n/a | Lead (one colour) | Yes (screenshots) |
| News | Top | Load | The heading is fully visible on the field (no fade over it) | n/a | Preview fix | Yes (screenshot) |
| Every main page | End of the page | Any | Amber light behind the footer ridge | n/a | Home Contact, old Careers | Yes (screenshots) |
| Text on the warm end | Capture bands | Any | 4.5:1 or more; lowest 4.96:1 (muted on amber-light) | n/a | WCAG 2.2 AA | Yes (computed with `contrastRatio`) |
| Home | Whole page | Any | Unchanged (height 7,151px desktop) | n/a | PR #98 | Yes |
| All pages | Reduced motion, saved Pause, no JavaScript | OS setting, hero Pause, browser setting | Field still; colours stay; CSS only | None | NFR-2 | Yes (global reset; unit tests) |
| All pages | Load, scroll | Any | Layout shift 0; no sideways scroll | n/a | PRODUCT.md | Yes (0.0000 on 6 pages, 2 widths) |
