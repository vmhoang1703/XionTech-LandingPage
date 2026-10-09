---
title: 'E-S3 About matches the prototype'
type: 'feature'
created: '2026-10-09'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
baseline_commit: 'dcfc3df650b7d77b15a2cb0594029fc352738d38'
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
| Intro | Load at 1280px | — | Centred H1 "We're XionTech, technology built with ownership." with "ownership" in dark amber, no underline; pastel peaks below; no breadcrumb | Static | ENH-049, ENH-050 |  ✅ walk (dark amber rgb(168,118,0), no underline, centred, no crumbs); `about/page.test.tsx` |
| Intro links | Activate | Mouse, keyboard | "Explore our products" → `/products`, "Explore our services" → `/services` | Instant | `about.html` |  ✅ walk; `about/page.test.tsx` |
| Mountain story | Load | — | H2 with "purpose" highlighted; chapters 01 and 02 stacked; closing lines; no picture | Static | ENH-030, ENH-046, Q5 |  ✅ walk (no images); `about/page.test.tsx` |
| Founding sentence | Load | — | Starts with "[Placeholder]" | Static | Q12 |  ✅ walk; `about/page.test.tsx` |
| Removed | Load | — | No stats, no "Two strengths", no `#values` section | Static | ENH-030, ENH-087 |  ✅ walk; `about/page.test.tsx`, `e2e/about.spec.ts` |
| FAQ layout | Load at 1280px / 760px | — | Two columns of hairline rows, 96px apart / one column | Static | ENH-016, `site.css:424-439` |  ✅ walk (2 columns, 96px / 1 column); `a11y.spec.ts` about layout |
| FAQ rows | Open, close | Mouse, keyboard (Enter, Space) | Answer shows and hides; "+" becomes "−"; several can be open at once | Instant | Story 6.4 CAP-2, ENH-016 |  ✅ walk (Enter opens, "+" to "−"); `a11y.spec.ts` about layout (Enter, Space, several open) |
| Ask us directly | Activate | Mouse, keyboard | Goes to `/#contact`; 44px target | Instant | ENH-031 |  ✅ walk (lands on the Home contact heading, 57px tall); `about/page.test.tsx` |
| FAQ rows | Hover, focus | Mouse, keyboard | Question text turns navy on hover; visible focus ring on the summary | Instant | `site.css:427-430`, decision T9 |  ✅ walk (navy on hover, focus ring) |
| FAQ rows | Tap | Touch, pen | Same as click: the answer opens and closes | Instant | Story 6.4 CAP-2 |  ✅ walk (touch tap opens) |
| Ask us directly | Hover, focus | Mouse, keyboard | Arrow nudges right; amber underline on the text only | Instant | `site.css:435-438` |  ✅ walk (no underline on the link, amber on the text) |
| Office links | Hover, focus, tap | Mouse, keyboard, touch | Link colour changes on hover; visible focus ring; at least 24px (44px rows) | Instant | `site.css:474-477`, Story 7.3 |  ✅ walk (icons, new-tab WhatsApp); `a11y.spec.ts` keyboard (24px targets) |
| FAQ copy | Load | — | Q1 "What does XionTech do?", Q3 and Q5 as the prototype; security answer starts "[Placeholder]" | Static | ENH-087, Q9 |  ✅ walk; `about/page.test.tsx` |
| Offices | Load at 1280px / 390px | — | Two white cards at opposite edges, Plano first / stacked | Static | ENH-054, ENH-059 |  ✅ walk (400px cards at opposite edges / one column); `a11y.spec.ts` about layout |
| Office rows | Load | — | Live time, city, tag, icon rows; bracketed phones; WhatsApp opens a new tab; no Vietnam email | Static, clock each minute | ENH-057, ENH-058, Q7 |  ✅ walk (US Delivery Center, Vietnam Delivery Center, bracketed phones, no Vietnam email); `offices.test.ts`, `about/page.test.tsx` |
| Book a demo band | Load | — | White band "See our apps in action." with the Parent Hub and Staff Hub lede | Static | ENH-059, ENH-087 |  ✅ walk; `about/page.test.tsx` |
| Background | Scroll | — | White with soft light blue glows, no hard edges | Static | ENH-067 |  ✅ walk, `about-1280-full.png` |
| Footer anchors | Open `/about#faq` | — | FAQ heading lands fully visible under the header | After smooth scroll | Story 6.4 CAP-2 |  ✅ walk (heading under the header); `a11y.spec.ts` about layout (`#faq`, `#book`) |
| Page title | Load | — | "About XionTech \| Get IT Done" | Static | `about.html` |  ✅ walk; `about/page.test.tsx` |

## Implementation Notes

- Built by one implementer subagent (one-shot route). RED: `npx vitest run src/app/about src/content/about.test.ts src/content/offices.test.ts` 21 failed | 13 passed; GREEN: full `npx vitest run` passed.
- `src/app/about/page.tsx` rewritten as `#mission` (peaks SVG with page-scoped gradient ids), `#story` (two stacked chapters, no picture: Q5; the chapter 02 founding sentence starts with `[Placeholder]`: Q12), `#faq` (two columns, hairline rows, "Ask us directly" to `/#contact`), `#offices` (white cards from the new `aboutOfficeView` in `offices.ts`, icon rows via the shared `contactIcon`), `#book` (white `CaptureBand` with an optional `id` prop, new lede).
- The shared `offices` keeps its labels and order (Demo, Home contact, footer); `aboutOfficeView` reuses the footer's bracketed contacts and the Vietnam constant. `contactIcon` moved to `src/components/sections/contact-icon.tsx` (footer and About).
- Removed: stats, "Two strengths", the About values section (values stay on Home), `aboutValues.label`/`title` (unused), `#values` from the anchor rule. Old `/about#values` links now land at the top of the page; no link in the repo points there.
- Decisions recorded: office rows are 44px tall for touch targets (prototype rows are shorter); Safari's FAQ disclosure marker is hidden with `display: none` and allowed in `contrast.test.ts` as a decorative UA marker.
- Review: full five layers (security clean; acceptance found the missing `#book` id), then two fix rounds (176 and 88 lines, each fully reviewed again) and a 20-line test follow-up with one edge-case layer.
- Evidence: `spec-enh-s3-about-evidence/` (verification.txt: lint, 1243 unit tests, diff coverage 100%, 15 smoke, build, 41 a11y; walk.mjs, walk-output.txt, screenshots). Safari itself was not checked (no WebKit project); deferred.


## Review Triage Log

| # | Finding | Verdict | Evidence / route |
| --- | --- | --- | --- |
| 1 | Capture band has no `#book` id | medium | `/about#book` went nowhere; optional `id` on `CaptureBand`; patched |
| 2 | `#story`, `#offices`, `#book` missing from the anchor offset rule | medium | Headings would land under the header; patched |
| 3 | Safari disclosure triangle beside "+/−" | low | Prototype hides it; `display: none` plus a contrast-test allow-list entry; patched |
| 4 | An open FAQ answer stretches its row neighbour | low | `align-items: start`; patched and tested |
| 5 | `.faq-ask` could underline in full | low | `text-decoration: none`; patched |
| 6 | About imported the icon helper from the footer component | low | Moved to `contact-icon.tsx`, error text neutral; patched |
| 7 | Peaks SVG gradient ids are document-global | low | Prefixed `about-peaks-*`; patched |
| 8 | Dead `aboutValues.label`/`title`, stale Home comment | low | Removed and fixed; patched |
| 9 | Brand rule no longer covered the values copy | low | Home values test asserts no "XionTechs"; patched |
| 10 | Office layout, FAQ marker and keyboard only regex-checked | medium | `@a11y` about layout tests (columns, edges, Enter/Space, neighbour height, `#faq`/`#book` landing); patched |
| 11 | UX table missed hover, focus and touch lines | low | Four lines added |
| 12 | E-S2 ENH rows marked Built in this branch | false | First commit of this branch, agreed bookkeeping; noted in the PR |
| 13 | Hard-coded amber colours (`#a87600`, `#735500`) | low | Prototype values, contrast-checked by axe; rejected |
| 14 | `#book` glow not scoped to About | low | No other page uses these ids (grep); rejected |
| 15 | Empty `id` on `CaptureBand` | false | Only literal ids are passed; rejected |
| 16 | `contact-icon.tsx` should be `.ts`; `aboutValues` name | low | Cosmetic; rejected (rename noted for later) |
| 17 | Placeholder covers the whole chapter 02 paragraph | false | The unconfirmed sentence is the first sentence, where the marker sits |
| 18 | Layout checks run only in the opt-in `a11y` project; no WebKit project | low | Project-wide choice (Story 7.3); deferred |
| 19 | Security (three passes) | — | Clean |

## Verification

**Commands:**
- `npm run lint && npm run typecheck && npm run format:check` -- expected: clean
- `npm test` -- expected: all pass
- `npm run test:coverage && npm run coverage:diff` -- expected: 100% changed lines; changed files ≥ 80% branches
- `npm run test:smoke` -- expected: all pass
- `npm run build` -- expected: success
- `npx playwright test --project=a11y` -- expected: all pass
