# One-shot spec: the header as a floating pill

Owner: Hoang Vu (Andy). Stage: UI/UX enhancement (AGENTS.md). Route: one-shot (no API, no schema, no form change).
Lead, 2026-10-12: "I want to move on redisgning/enhancing UI/UX for header followed this style: https://busplanner.com/". Two rounds of mocks on the real build were shown before any code: the lead kept the floating pill and the amber call-to-action button, dropped the dots, chevrons and menu panels, and chose "B: white everywhere" (one white pill, also over the dark Home hero).

## Goal

The header becomes a white pill with rounded ends that floats over the top of every page, with a "Book a demo" button on the right, in the style of busplanner.com.

## Design

- **Pill:** `--spacing-header-height` (72px, the DESIGN.md token) tall above 1080px, 56px at 1080px and below; at most 1180px wide, 12px from the top and the sides; white 95% with a light blur, a white edge and a soft navy shadow.
- **Strip:** the pill sits in a strip 12px deep above and below it, `--spacing-header-room` (96px; 80px at 1080px and below). The header takes no space (`margin-bottom` is minus the room), so each page's first section runs under the pill; every first section adds the room to its top padding (`.page-hero`, `.home-hero`, `.careers-hero`, `.nhead-sec`, `.art-hero`, `.eco-hero`, `.about-hero`). Anchors (`scroll-padding-top`, the anchor offsets) and the Services sticky heading clear the room. The strip lets clicks through (`pointer-events: none`; the pill and the mobile menu take them back).
- **Links:** centred in the pill; each link is a small pill, 44px tall, navy 600: light blue (ice 70%) on hover, soft amber (amber-light 38% on white) when it is the current page. Replaces prototype ENH-002's amber underline.
- **Book a demo:** `btn btn-primary btn-sm` with an arrow, to `/demo`, on the right at every width. At 420px and below the arrow hides and the button is narrower.
- **Logo:** never shrinks out of shape; 32px tall above 641px, 26px, then 22px below 375px and 20px below 340px, so the pill fits at 320px.
- **Phone:** logo, Book a demo, Menu. The menu button is round like the links. The open menu is a rounded white card under the pill (12px from the sides), with the same link pills.
- **Not changed:** link order and labels, `currentSection`, the menu's keyboard behaviour (Escape, focus trap, closing on navigation), the skip link.

## Differs from the UX docs (lead's decision, enhancement stage)

`DESIGN.md` ("Site header": "Sticky glass bar ... No Book a demo button") and `EXPERIENCE.md` (Layout: "There is no Book a demo button in the header (decided 2026-10-01)"; AC-NAV-2) describe the old header. The lead chose the button and the pill on 2026-10-12; AGENTS.md lets the lead decide in this stage without Amber's sign-off. The docs are Amber's and are not edited here; the PR flags it. The DESIGN.md token `header-height: 72px` still holds: it is now the pill's height.

## UX checks

| Part | State / action | Input | Visible result | Timing | Source | Checked |
| --- | --- | --- | --- | --- | --- | --- |
| Header pill | Load, any page, above 1080px | Any | White pill, rounded ends, 1180px max, 72px tall, 12px from the top; the page's first section runs under it | n/a | Lead (mock B) | Yes (browser check, 11 pages at 1440 and 1081) |
| Header pill | Load, 1080px and below | Any | 56px pill 12px from the edges: logo, Book a demo, Menu; nothing overflows from 320px to 1080px; logo keeps its shape | n/a | Lead (mock B) | Yes (11 widths, ratio 5.43 at each) |
| First heading | Load | Any | Starts at least 50px below the pill on every page | n/a | Spec | Yes (lowest 50px, News at 390) |
| Strip around the pill | Click or tap beside or above the pill | Mouse, touch | Reaches the page under it | Instant | Spec | Yes (20 page loads) |
| Nav link | Hover | Mouse, pen | Light-blue pill behind the word | 250ms, brand ease | Lead (mock B) | Yes (unit test) |
| Nav link | Current page | Any | Soft amber pill behind the word (`aria-current="page"`) | n/a | Lead (mock B) | Yes (unit test; screenshot) |
| Nav link, Book a demo, Menu | Focus | Keyboard (Tab) | 2px navy focus ring around the pill shape; order: logo, links, Book a demo, Menu | Instant | WCAG 2.2 AA | Yes (browser: Tab order and ring) |
| Book a demo | Click, tap, Enter | Mouse, touch, keyboard | Opens `/demo` | Instant | Lead | Yes (unit test: href) |
| Book a demo | 420px and below | Any | Arrow hidden, narrower button | n/a | Spec | Yes (fit check) |
| Mobile menu | Open | Tap, Enter | Rounded white card under the pill with the link pills; Escape closes; focus stays in header and menu | Instant | EXPERIENCE.md "Mobile menu" | Yes (existing unit tests; screenshot at 390) |
| Anchors | Open `/about#faq`, Services anchors | Any | Target lands below the strip | Smooth scroll | E-A anchors | Yes (a11y e2e) |
| All pages | Load | Any | Layout shift 0; no sideways scroll | n/a | PRODUCT.md | Yes (20 loads; one 0.004 at 1081, three re-runs 0) |
