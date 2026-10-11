# One-shot spec: Home content — one story, three new sections (PR 2 of 3)

Owner: Hoang Vu (Andy). Stage: UI/UX enhancement (AGENTS.md). Route: one-shot (no API, no schema, no form change).
Plan: `plan-home-enhance.md` §1. PR 1 (motion) is merged; PR 3 (background tones) follows.

## Goal

Home reads as one story for its two visitors, a school leader and a company buying software
delivery, with real content from the other pages and no section that repeats another.

## Order and content

| #   | Section                       | Content (all real)                                                                                                       | Interaction                                                     |
| --- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------- |
| 1   | Hero, figures, two doors      | Kept                                                                                                                     | Kept (PR 1)                                                     |
| 2   | What can we help you achieve? | Services: the four outcomes and the Services lede; "Start a project" (Services CTA label) to `#contact`; "Explore services" | Rows are not links; the two calls to action are                |
| 3   | One connected school.         | Products: each app's badge, full name, "Made for" line and first two features; the Products hero lede                   | Each app is one link to its Products section; glow, lift, press |
| 4   | Why XionTech.                 | Capabilities without the two cards that repeated the doors: Global delivery, Domain expertise, the motto                 | Kept (clocks, "+3")                                             |
| 5   | How we work.                  | 4-D process; the link reads "See the full process"                                                                      | Kept (PR 1 hover)                                               |
| 6   | Our core values.              | Six values: front = icon, title, one short line; back = the full text                                                    | Flip on click, tap, Enter or Space (the Careers flip card)      |
| 7   | Your questions, answered.     | Four About FAQ answers: try Parent Hub or Staff Hub, time zones, results, feedback; "See all questions" to `/about#faq`   | Native details, open and close                                  |
| 8   | Latest news                   | Kept                                                                                                                     | Kept                                                            |
| 9   | Contact                       | Kept                                                                                                                     | Kept                                                            |

- Values: Home is the only page with them (About dropped them in E-S3), so the full text moves to
  the back of each card instead of being cut. The short lines are written from the full text.
- AI Tutor's tagline is still `[Placeholder]`, so the app cards use "Made for" and the features,
  which are real for all four apps. AI Tutor gets its own badge colour (`b-ait`).
- The FAQ markup moves into a shared `FaqList`, used by About and Home. FAQ items get ids, so Home
  picks them by id.
- Unused after this change and removed: the Capabilities products and services card styles, their
  app row and link styles, and the old values grid (`.values`, `.value`).

## UX checks

| Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| ---- | --------------- | ----- | ------------------ | ------ | ------ | ------- |
| Home | Scroll top to bottom | Any | Sections in the order above; no two sections say the same thing | n/a | Plan §1 | Yes (browser 1440/900/390: nine sections in order) |
| Outcomes | Load | Any | Heading, lede and the two calls to action stay beside the four outcomes on wide screens; stacked on phones | n/a | Services layout (`svc-split`) | Yes (screenshots 1440 and 390) |
| Outcomes "Start a project" | Activate | Mouse, touch, keyboard (Enter) | Scrolls to the contact form | Browser smooth scroll | Services CTA label | Yes (unit: `#contact`, plain anchor) |
| App card | Hover | Mouse, pen | Lifts 4px, arrow turns, amber light follows the pointer | 0.5 s lift | PR 1 door behaviour | Yes (browser: lift, arrow, glow) |
| App card | Press, activate | Mouse, touch, keyboard (Enter) | Shrinks to 98%, then opens the app's section on Products | 0.2 s | PR 1 | Yes (door rules; unit: hrefs `/products#pxp`…) |
| App cards | 1080px and wider | Any | Four in a row, joined by a thin line between the badges | n/a | "One connected school" | Yes (screenshot 1440) |
| Value card | Activate | Mouse, touch, keyboard (Enter, Space) | Turns over to the full value; again turns back; screen readers read one face | 0.65 s turn | Careers flip card (CAP-3) | Yes (browser click; unit: `aria-pressed`, inert faces) |
| Value card | Reduced motion | OS setting | Faces swap at once, no turn | None | NFR-2 | Yes (Careers rule: no transition under the global reset) |
| "Get IT Done" value | Load | Any | Gold front, as the featured value before | n/a | `values.ts` featured | Yes (unit and screenshot) |
| FAQ question | Activate | Mouse, touch, keyboard (Enter, Space) | Answer opens; the + becomes − | Native | About FAQ | Yes (browser and unit: `open`) |
| FAQ "See all questions" | Activate | Mouse, touch, keyboard | Opens About at the FAQ | n/a | Plan §1 | Yes (unit: `/about#faq`) |
| Whole Home | No JavaScript | Browser setting | Every section and every value's short line visible; FAQ works | n/a | AGENTS.md | Yes (browser no-JS: 6 fronts, 4 answers, 4 apps; no-JS test) |
| Whole Home | Load, scroll | Any | Layout shift 0; no horizontal scroll at 390px | n/a | PRODUCT.md | Yes (layout shift 0.0000; no horizontal scroll at 390px) |
| All text | Read | Any | No invented facts; only `[Placeholder]` items are marked | n/a | AGENTS.md hard rule 1 | Yes (unit: no `[Placeholder]` in apps or answers) |
