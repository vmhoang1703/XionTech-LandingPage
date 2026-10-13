---
title: "Mobile and tablet, round 2: shorter pages"
status: done
owner: Hoang Vu (lead)
date: 2026-10-13
branch: feat/mobile-compact
---

# Mobile and tablet, round 2: shorter pages

Lead (2026-10-13): "Pages are too long, require excessive scrolling, and some interactions or content
layouts are not convenient to use on smaller screens." One branch, one PR, "enhance until I feel good".

## How it was decided

Measured every section at 390 and 768. Claude brainstormed 2-4 options for the five biggest problems
and rendered them on the real pages in one preview (`options.html`, session scratchpad), with a pick
marked. Lead picked **1A 2D 3A 4C 5B** (all as recommended).

| Area | Pick |
| --- | --- |
| 1. Phone card sets | A. Swipe row, next card peeking (4-D process, apps, values on Home and Careers, latest stories) |
| 2. Phone hero figures | D. Number + label rows, all five visible |
| 3. Phone footer | A. Packed columns: Company under Products, beside Services |
| 4. Tablet values | C. Cards as tall as their longer face, three across |
| 5. Tablet doors, stories, footer | B. Two doors side by side, three stories a row, three footer link columns, offices side by side |

Also on phones: story cards 250px (News lead 320px; were 340px or square), service cards in less
padding, Why cards without the 300px minimum.

All CSS in `src/app/globals.css` (unlayered blocks at the end, so they win over the layered rules).
The one-card-a-row rules from #107 are removed; the 4-D swipe rule moved into the shared block.

## Results (page height, local production build)

| Page | 390 before | 390 after | 768 before | 768 after |
| --- | --- | --- | --- | --- |
| Home | 12,264 | 9,434 | 10,376 | 9,156 |
| Services | 6,630 | 5,958 | 5,065 | 4,836 |
| Careers | 5,697 | 4,762 | 4,934 | 4,426 |
| About | 5,658 | 5,482 | 4,713 | 4,485 |
| News | 5,238 | 4,354 | 3,806 | — |

Desktop 1440 unchanged (Home 7,266). No sideways scroll at 320, 390, 768, 1440.

## UX checks

| Part | State or action | Input | Expected (visible) | Source | Checked |
| --- | --- | --- | --- | --- | --- |
| Apps, values, stories, 4-D process (phone) | Load | n/a | One card wide (84%), next card peeks at the right | Pick 1A | Yes (screenshots 390) |
| Same rows | Swipe | Touch | Snaps card by card; page does not scroll sideways | Pick 1A | Partly (scripted scroll; real finger swipe to do) |
| Swipe rows (phone) | Row in view (60%) | none | Moves on one card every 3.5 s, back to the first after the last | Lead, 2026-10-13 | Yes (Chrome 390, Apps row) |
| Swipe rows (phone) | First touch, wheel or key | Touch, key | Auto swipe stops for that row for good | Lead, 2026-10-13 | Yes |
| Swipe rows | Reduced motion, or 640px and up | n/a | No auto swipe | Motion rule in AGENTS.md | Yes (unit test) |
| Value cards in the row | Tap | Touch | Flips; back text fully visible; row height stays | Pick 1A | Yes (390) |
| Hero figures (phone) | Load | n/a | Five rows, number left, label right, thin lines between | Pick 2D | Yes (390) |
| Footer (phone) | Load | n/a | Products then Company in the left column, Services right | Pick 3A | Yes (390) |
| Values (tablet) | Load | n/a | Three across, no fixed 304px height | Pick 4C | Yes (768) |
| Doors, stories, footer (tablet) | Load | n/a | Doors side by side; 3 stories a row; 3 link columns; offices side by side | Pick 5B | Yes (768) |
| News page (phone) | Load | n/a | Lead story 320px, others 250px, title and "Read story" fit | Round 2 | Yes (390) |
| Every page | Load at 320-1440 | n/a | No sideways scroll; desktop unchanged | Round 2 | Yes |
| Resize across 640 and 1080 | Drag | Mouse | Layout switches, nothing cut off | Round 2 | Pending (by hand) |

Home core values keep their original layout (lead, 2026-10-13): one a row on phones, two columns of 304px cards on tablets. Careers "Five things" uses the new layouts.

## Round 3 (lead, 2026-10-13)

Lead: the count jumps from 0 to 25; "Start a project" and "Explore services" sit in an ugly place; check
every page. Claude measured and audited every page at 390 and 768, then rendered options on the real pages.
Lead picked 1a D, 1b B, 2 B + animation, 3 C, 4 C, 5 B.

- **Count-up (bug):** a phone draws a frame only every 250-600ms while the page loads, and the count ran
  then, so it showed 0 → 6 → 12 or 0 → 15. Each figure now waits at 0 (`data-count="wait"`, server HTML)
  until it is in view and the page has loaded and gone idle, then counts. Measured: every step 0 → 25
  shows at 390 (CPU ×1 and ×4), 768 (×4) and 1440. No script: a `<noscript>` style shows the number.
- **1a/1b Next steps:** below 980px they come after the four goals (`display: contents` on the heading
  block, `order: 1`; DOM order unchanged). Phones: full-width button, link under it. Tablets: one row.
  Desktop unchanged.
- **2 Swipe dots:** `SwipeRows` (was `AutoSwipe`) puts one 28x44px dot button a card under each phone
  swipe row. The amber pill slides to the card in front (`transform`); the other cards shrink to 0.94
  (`scale`). A tap on a dot goes to its card and stops the auto swipe. Reduced motion or a saved Pause:
  dots only, no auto swipe, no animation. The 4-D track and nodes are not counted.
- **3 Services (phone):** one list card, a row a service. Deviation from the preview: the tags stay
  (small, under the line); the preview hid them, but they are facts (Azure, AWS, GCP, the low-code
  tools) and the no-JS content guard flags hidden content.
- **4 Careers Inside XionTech (phone):** a mosaic, the big moment across, then pairs.
- **5 Why XionTech (tablet 640-900px):** the two cards side by side, as tall as their content.

| Page | 390 after round 2 | 390 after round 3 |
| --- | --- | --- |
| Services | 5,958 | 5,663 |
| Careers | 4,762 | 4,182 |
| Home | 9,434 (values swipe) | 10,525 (values back to the original) |

### UX checks (round 3)

| Part | State or action | Input | Expected (visible) | Source | Checked |
| --- | --- | --- | --- | --- | --- |
| Hero figures | Load | n/a | Count 0, 1, 2 … 25, every step shows | Lead | Yes (frame log, 390/768/1440, CPU ×4) |
| Next steps (phone) | Load | n/a | After the goals: full-width "Start a project", "Explore services" centred under it | Pick 1a D | Yes (390) |
| Next steps (tablet) | Load | n/a | After the goals, button and link in one row | Pick 1b B | Yes (768) |
| Next steps (desktop) | Load | Mouse | Unchanged: beside the list, under the heading | Pick 1b B | Yes (1440) |
| Swipe dots | Load | n/a | One dot a card (Apps 4, 4-D 4, stories 3, Careers 5), first amber | Pick 2 B | Yes (390) |
| Swipe dots | Auto swipe or swipe | Touch | Amber pill slides to the card in front; that card full size, others smaller | Pick 2 B | Yes (390, scripted) |
| Swipe dots | Tap a dot | Touch | Row goes to that card; auto swipe stops | Pick 2 B | Yes (unit test) |
| Swipe dots | Reduced motion or Pause | n/a | Dots only, no auto swipe, no animation | Motion rule | Yes (unit test) |
| Services (phone) | Load | n/a | One list card, eight rows, icon, name, line, tags | Pick 3 C | Yes (390) |
| Inside XionTech (phone) | Load | n/a | First tile across, then two pairs | Pick 4 C | Yes (390) |
| Why XionTech (tablet) | Load | n/a | Two cards side by side, no empty space | Pick 5 B | Yes (768) |

## Round 4 (lead, 2026-10-13): behaviour, touch, one contact form

Audit of behaviour on every page (menu, forms, FAQ, anchors, touch, speed). Fixed at once: 16px form
fields (iPhone zoomed into 15.68px fields) and no tooltip underline on "HCMC" on touch screens.
Lighthouse mobile, live develop: Home 71-75, Products 88 (rule: 90); the text paints only after the
scripts run, so a focused speed pass is still open. Options shown on the real pages (videos for
motion); lead picked 4C 5B 6B 7C 8B 9B 10B, then: "Inactive demo page. Keep, not delete but no
navigation to demo page. Just use get in touch form. ... test behavior ... and test functional".

- **Demo page inactive:** `/demo` kept, `robots: noindex`, no links. Header button "Get in touch"
  (`CONTACT_HREF = "/#contact"`), Services "Start a project" and the capture bands lead to the Home
  form. A capture band no longer sends: it keeps the email (`rememberCapturedEmail`) and the Home
  form fills it in once (`fillCapturedEmail`, shared with the Demo form). About FAQ: "Book a demo." ->
  "Get in touch.". The API still accepts the old `capture` type.
- **Get in touch reliability:** `maxDuration` 10 -> 30 s on `/api/contact` (worst case: two 3 s
  rate-limit checks, a 5 s-per-step Gmail send and a cold start), client timeout 15 -> 32 s, longer than
  the route. Likely cause of "it gets worse": a slow send stopped at 10 s showed "could not send"
  although the mail may have gone, and repeated tries hit the limit of 5 sends per IP and email in
  10 minutes. Not confirmed from Vercel logs (no access here).
- **4C** Apply bar on job pages below 900px, shown while the form is below the screen, inert and
  invisible otherwise. **5B** header hides on scroll down below 1080px, back on scroll up, never near the
  top, while the menu is open or with focus inside. **6B** press-in to 0.96 on touch screens, and a
  passive `touchstart` listener so iPhone Safari applies `:active` at all. **7C** FAQ answer fades and
  slides in; the + turns 45 degrees into an x. **8B** after a client navigation `main` fades up 14px in
  0.45 s (Web Animations; never on the first load; off with reduced motion or Pause). **9B** news
  filters in one swipe row on phones. **10B** phone menu: Get in touch and both HQ phone numbers.

### UX checks (round 4)

| Part | State or action | Input | Expected (visible) | Source | Checked |
| --- | --- | --- | --- | --- | --- |
| Get in touch form | Empty submit | Touch, mouse | Three field errors, focus on Your name, nothing sent | Lead | Yes (e2e 390 + 1280) |
| Get in touch form | Valid submit | Touch, mouse | One request, values trimmed, "Sending..." and disabled, then the summit, focused | Lead | Yes (e2e) |
| Get in touch form | Second press while sending | Mouse | No second request | Lead | Yes (e2e) |
| Get in touch form | 429 / 502 / no network | n/a | Message, text kept, button focused; retry sends | Lead | Yes (e2e) |
| Get in touch form | Server field error | n/a | Error at the field, field focused | Lead | Yes (e2e) |
| Form fields | Tap | Touch | No zoom on iPhone (16px) | Audit | Yes (e2e computed size) |
| Header button | Click on /about | Mouse | Home, form in view | Lead | Yes (e2e) |
| Capture band | Email + Get in touch | Touch | Home form with the email filled in, nothing sent | Lead | Yes (e2e /news) |
| Every main page | Load | n/a | No link to /demo | Lead | Yes (e2e) |
| Phone menu | Open, tap Get in touch | Touch | Phones listed; menu closes; form in view | Pick 10B | Yes (e2e) |
| Job page (phone) | Scroll | Touch | Apply bar while the form is below; gone at the form; tap jumps to the form | Pick 4C | Yes (390) |
| Header (phone) | Scroll down / up | Touch | Hides / comes back | Pick 5B | Yes (390, unit tests) |
| Buttons, cards (touch) | Press | Touch | Press in to 96% | Pick 6B | Partly (CSS and unit; real iPhone to do) |
| FAQ | Open / close | Touch, keyboard | Answer fades in; + turns into x and back | Pick 7C | Yes (e2e, screenshot) |
| Any link to a page | Click | Mouse, touch | New page fades up once | Pick 8B | Yes (390) |
| News filters (phone) | Load, swipe | Touch | One row, no page sideways scroll | Pick 9B | Yes (390) |

