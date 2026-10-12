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

## Round 2 (lead, 2026-10-12: "continue to review and enhance the design which you feel not good")

The AI's own review of round 1: the field was too faint, the page ends did not match (Products ended navy), the warm end was an empty amber band, and Services lost its structure with its panel. Changes:

- Stronger field: amber up to 90% (was 55%), the warm blob in amber-light 70%, blue 50% (was 45%, the most it can take); bigger cores (full colour to 15% of the radius); blobs sit further on screen and sweep side to side as you scroll (four waypoints instead of one straight line). Lowest contrast for text on the field: 4.73:1 (muted #4a5b78 and the About numbers #735500 on blue alone); amber is painted over blue.
- A sun behind the footer ridge on every page (`.ridge-sun` in `SiteFooter`): a pale disc behind the peak (x 860 of 1440) with an amber glow, in a box no taller than the room above the footer (220px, 160px on phones), so it never covers text. It rises as the footer scrolls into view (`view-timeline`); still and up where scroll-driven animations are missing and under reduced motion.
- Products: the navy demo band is an inset rounded panel (like the Services hero and Home's How we work); the room above the footer goes below it as margin, so Products ends warm like every page.
- Services: the panel comes back, see-through (light blue 75% fading to 30%), so the field glows through it.
- Not changed: the heroes (still all different). A shared hero system would replace Amber's designs; left as a question for the lead.

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
| Colour field (round 2) | Scroll | Wheel, touch, keyboard | Amber and blue clearly visible, sweeping side to side | Linked to scroll | Lead (round 2) | Yes (scroll videos; screenshots 1440 and 390) |
| Footer sun | Scroll to the end | Any | A sun rises behind the ridge peak, on every page; never over text | Linked to scroll | Lead (round 2) | Yes (screenshots; ridge e2e test) |
| Products end | End of the page | Any | Rounded navy demo panel, then the warm end and the sun | n/a | Lead (round 2) | Yes (screenshot) |
| Services panel | Below the hero | Any | Light-blue rounded panel, see-through to the field | n/a | E-S2, round 2 | Yes (screenshot) |
| Text on the stronger field | Any | Any | 4.5:1 or more; lowest 4.73:1 | n/a | WCAG 2.2 AA | Yes (computed; axe at rest) |
