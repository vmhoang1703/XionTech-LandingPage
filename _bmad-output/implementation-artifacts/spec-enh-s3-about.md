---
title: 'E-S3 About matches the prototype'
type: 'feature'
created: '2026-10-09'
status: 'in-progress'
route: 'oneshot'
review_loop_iteration: 0
context:
  - '{project-root}/AGENTS.md'
  - '{project-root}/docs/ux-checks.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `/about` is still the Story 6.4 page (navy hero with breadcrumb, stats, "Two strengths",
core values, a one-column card FAQ, navy offices). The prototype (`prototype/about.html`; ENH-016, 030,
031, 046, 049, 050, 054, 055, 056, 057, 058, 059, 067, 087; planned spec
`_bmad-output/specs/sammy/spec-enh-s3-about/SPEC.md`) tells the story through an intro and the
mountain, then answers questions and shows the offices, all on white; the values moved to Home (E-S1).

**Approach:** Port the prototype in this order, copy verbatim from `about.html` with "XionTechs" written
"XionTech":
- `#mission` intro: centred H1 "We're XionTech,<br>technology built with **ownership**." ("ownership"
  in amber text `#A87600`, no underline), the mission paragraph, links "Explore our products" (`/products`)
  and "Explore our services" (`/services`), and the inline SVG pastel peaks (`site.css:1116-1123,1136`).
  No breadcrumb, no stats, no `HeroArt`.
- `#story` mountain, static (the prototype's no-JS layout, `site.css:1307-1319,1363-1385`): H2
  "Inspired by a mountain.<br>United by **purpose**.", chapter 01 "The inspiration" and chapter 02 "The
  purpose" stacked, then "Our inspiration is a mountain. Our purpose is people." and "Vision · Community ·
  Technology". The chapter 02 founding sentence ("Inspired by this vision, a group of pioneers established
  newXion in America.") is marked `[Placeholder]` (decision Q12). **No mountain picture** (decision Q5:
  the image licence is unconfirmed), so no X mark, tag, dots, scroll cue or held scroll.
- Remove the stats band, "Two strengths, one team." and `#values` (values live on Home); drop `#values`
  from the anchor rule; keep `#faq`.
- `#faq`: heading "Your question, we answer" with the lede "Straight answers about our products, our
  services and how we work."; two columns of hairline rows, 96px apart, "+"/"−" at the right, one column
  at 760px and below, all closed by default, native `<details>`; the tenth slot is the link "Still have a
  question? Ask us directly" → `/#contact` (44px target). Question 1 asks "What does XionTech do?" with
  the prototype answer (Parent Hub, Staff Hub and IoT Device Management); question 3 "How can our school
  try Parent Hub or Staff Hub?"; question 5 answer "…Discovery, the first of our four steps, …". The
  security answer keeps `[Placeholder]` (decision Q9).
- `#offices` on white: H2 "Two offices, serving the world."; two cards (max 400px) at opposite edges,
  Plano first: live clock, city h3, tag ("US Delivery Center" / "Vietnam Delivery Center"), icon rows
  (map pin, phone, WhatsApp, envelope) with bracketed phones "(+1) 469 322 9899", WhatsApp "(+1) 469 439
  9345" (new tab, name "WhatsApp (+1) 469 439 9345 (opens in a new tab)"), "(+84) 908 107 552" and the US
  email; no Vietnam email (decision Q7). The shared `offices` keeps its labels so Demo and Home are
  unchanged; links come from the shared records (as the footer view does).
- `#book`: the existing white `CaptureBand` with the lede "Leave your work email and we'll arrange a
  walkthrough of Parent Hub and Staff Hub."
- Background: white with soft light blue radial glows alternating sides (`site.css:1473-1477`, no `#values`).
- Title "About XionTech | Get IT Done".
- Out (Tier 2): held scroll, mountain picture, city drawings, large-screen sizing.

</frozen-after-approval>

## UX checks

| Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| --- | --- | --- | --- | --- | --- | --- |
| Intro | Load at 1280px | — | Centred H1 "We're XionTech, technology built with ownership." with "ownership" in dark amber, no underline; pastel peaks below; no breadcrumb | Static | ENH-049, ENH-050 | |
| Intro links | Activate | Mouse, keyboard | "Explore our products" → `/products`, "Explore our services" → `/services` | Instant | `about.html` | |
| Mountain story | Load | — | H2 with "purpose" highlighted; chapters 01 and 02 stacked; closing lines; no picture | Static | ENH-030, ENH-046, Q5 | |
| Founding sentence | Load | — | Starts with "[Placeholder]" | Static | Q12 | |
| Removed | Load | — | No stats, no "Two strengths", no `#values` section | Static | ENH-030, ENH-087 | |
| FAQ layout | Load at 1280px / 760px | — | Two columns of hairline rows, 96px apart / one column | Static | ENH-016, `site.css:424-439` | |
| FAQ rows | Open, close | Mouse, keyboard (Enter, Space) | Answer shows and hides; "+" becomes "−"; several can be open at once | Instant | Story 6.4 CAP-2, ENH-016 | |
| Ask us directly | Activate | Mouse, keyboard | Goes to `/#contact`; 44px target | Instant | ENH-031 | |
| FAQ copy | Load | — | Q1 "What does XionTech do?", Q3 and Q5 as the prototype; security answer starts "[Placeholder]" | Static | ENH-087, Q9 | |
| Offices | Load at 1280px / 390px | — | Two white cards at opposite edges, Plano first / stacked | Static | ENH-054, ENH-059 | |
| Office rows | Load | — | Live time, city, tag, icon rows; bracketed phones; WhatsApp opens a new tab; no Vietnam email | Static, clock each minute | ENH-057, ENH-058, Q7 | |
| Book a demo band | Load | — | White band "See our apps in action." with the Parent Hub and Staff Hub lede | Static | ENH-059, ENH-087 | |
| Background | Scroll | — | White with soft light blue glows, no hard edges | Static | ENH-067 | |
| Footer anchors | Open `/about#faq` | — | FAQ heading lands fully visible under the header | After smooth scroll | Story 6.4 CAP-2 | |
| Page title | Load | — | "About XionTech \| Get IT Done" | Static | `about.html` | |

## Implementation Notes

## Verification

**Commands:**
- `npm run lint && npm run typecheck && npm run format:check` -- expected: clean
- `npm test` -- expected: all pass
- `npm run test:coverage && npm run coverage:diff` -- expected: 100% changed lines; changed files ≥ 80% branches
- `npm run test:smoke` -- expected: all pass
- `npm run build` -- expected: success
- `npx playwright test --project=a11y` -- expected: all pass
