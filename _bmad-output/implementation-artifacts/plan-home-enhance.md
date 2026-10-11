# Home enhancement — plan (draft for Andy's OK, 2026-10-11)

Goal: Home tells one connected story for its two visitors (a school leader and a
company buying software delivery) and feels alive: key numbers count up, cards
answer hover and press, and the background changes tone as you scroll.

Input: Andy's ideas (count-up on key numbers, card hover/click motion, more and
better-linked content from the other pages, one background that changes on
scroll — option C) and the critique `.impeccable/critique/2026-10-11T04-10-57Z__src-app-page-tsx.md`.

## 1. Content: new order

| #   | Section                          | Real content from                                                                                  | Change                                                                                      |
| --- | -------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| 1   | Hero, stats, two doors           | Home (kept)                                                                                        | Count-up on 25+ and 20+                                                                     |
| 2   | What can we help you achieve?    | Services: 4 outcomes (Build a product, Extend your team, Modernise, Apply AI)                      | New on Home; each card links to `/services`                                                 |
| 3   | One connected school             | Products: Parent Hub, Staff Hub, IoT, AI Tutor (names and one-line value)                          | New on Home; replaces the Capabilities card that repeats the door. No screenshots (they are `[Placeholder]`) |
| 4   | Why XionTech                     | Capabilities: Global delivery (live clocks), Domain expertise, Get IT Done motto                   | Drop the 2 cards that repeat the doors; motto joins this section                            |
| 5   | How we work                      | 4-D process (kept)                                                                                 | Title "How we approach." becomes "How we work."                                             |
| 6   | Our values                       | `values.ts`                                                                                        | Flip cards: icon, title, one short line; the full text on the back (correction: About has had no values since E-S3)                     |
| 7   | Your questions                   | About FAQ: What does XionTech do? / How can our school try Parent Hub or Staff Hub? / How do you work across time zones? / How do we give feedback during a project? | New on Home, same accordion, "See all questions" links to `/about#faq`. The security answer is `[Placeholder]`, so it is not picked |
| 8   | Latest news                      | Sanity (kept)                                                                                      | None                                                                                        |
| 9   | Contact                          | Home (kept)                                                                                        | None                                                                                        |

No new facts, stats, logos or quotes. The short value lines are written from the full
value text; Andy checks the wording in the PR.

## 2. Motion

- **Count-up:** only 25+ (years) and 20+ (tech stacks), set by a `count` flag in
  `src/content/home.ts`. 1.2 s, fast then slow, starts when the number comes into view.
  The final number is in the HTML (no JavaScript, search engines, screen readers). The
  width is locked, so nothing moves. Reduced motion or a saved Pause: no count. On wide
  screens the hero numbers fade in 0.4 s after load, so the count starts before they show
  (no "25 → 0" flash).
- **Cards:** (a) every card and button presses in a little (scale 0.98); (b) a soft gold
  light follows the mouse on the navy and gold cards (mouse only, not touch); (c) hover a
  4-D step and the line fills up to it; (d) each office clock shows a sun or a moon from
  its real local hour.
- **Background (option C):** one fixed layer behind sections 2–9. Its tone fades per
  section: cool paper, then mist blue, then warm cream at Contact, with soft brand glows.
  Opacity only, 0.8 s. Dark text reads on every tone. The hero and the footer stay navy.
  No JavaScript or reduced motion: each section keeps a still background in the same tone.

## 3. Not in this plan

- News covers: the 3 posts have no image in Sanity, so they show a grey grid. Fix: add
  real cover images in Sanity (Andy or Amber).
- Services and About: they have no number band since E-S2 and E-S3 (they match the
  prototype), so the count-up is on Home only. `StatsBand` counts wherever it is used.

## 4. PRs and time

| PR  | Scope                                   | Time       |
| --- | --------------------------------------- | ---------- |
| 1   | Count-up and the card effects           | ~half day  |
| 2   | New section order and 3 new sections    | ~1 day     |
| 3   | Background tones                        | ~half day  |

Then the release PR `develop` → `main` before Demo day (2026-10-16).

## 5. Rules kept

`transform` and `opacity` only (the count-up changes text, with the width locked so
there is no layout shift), a `prefers-reduced-motion` path for every effect, content
visible without JavaScript, the `[Placeholder]` rule, Lighthouse mobile 90 or higher.
Each PR has a UX checks table (`docs/ux-checks.md`) and the full Definition of Done.
