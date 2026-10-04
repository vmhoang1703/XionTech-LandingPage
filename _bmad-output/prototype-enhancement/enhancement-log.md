# Prototype enhancement log

For the technical team: every change to `prototype/` since 2026-10-03. The specs, PRD and epics are
not edited for these changes; update a story when you pick up an entry. How the log works:
`README.md` in this folder.

**Status:** Proposed (in the prototype, waiting for Amber) · Approved · In PR · Merged (in `develop`)
· Built (the code matches).

**Starting point:** the prototype with batch 1 (readability and accessibility, the new header and
language dropdown, Why XionTechs and the four-app row on Home). Batch 1 reaches `develop` with this
branch instead of PR #10, which was closed unmerged on 2026-10-03; it was written into the specs
directly, before this log existed.

| ID      | Date       | Page and section                                          | Change                                                                                                                                                                                                                                                                                            | Status   | Stories to update                     |
| ------- | ---------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------- |
| ENH-001 | 2026-10-03 | Home, last section                                        | The demo email band becomes a contact form: "Have something you want to build?"                                                                                                                                                                                                                   | Approved | 3.7, 2.2, 2.3, 2.4                    |
| ENH-002 | 2026-10-04 | Home hero and Why XionTechs; header                       | Amber headline word, no button glow, two stats ("25+ Years"), silk across the hero fading out before the stats, bigger hero text on small screens, front doors moved into Why XionTechs, Products as a plain link, underline-only hover on the word, numbers count up from 0, hamburger menu icon | Approved | 1.3, 1.4, 3.1, 3.2, 3.3, 3.4, 3.5     |
| ENH-003 | 2026-10-04 | Home, new sections                                        | Placeholder partner logo strip (scrolling; pauses on hover, focus or tap) under the hero, and three placeholder case study cards                                                                                                                                                                  | Approved | new stories (Epic 3)                  |
| ENH-004 | 2026-10-04 | Every section; Home Why XionTechs                         | Tighter space above and below section headings; each section shows its heading first, then its content; Why XionTechs rebuilt as a four-card bento (app logos, reveal animation, +3 hover reveal) with a small Get IT Done line                                                                   | Approved | 3.5, 7.x (reveal), every page section |
| ENH-005 | 2026-10-04 | Home, section order                                       | The products section moves below the 4-D process and becomes "Apps for every role in school."; case studies turn white                                                                                                                                                                            | Approved | 3.5                                   |
| ENH-006 | 2026-10-04 | Home, Case studies; every section                         | Case studies become a full-width slider of six placeholder partner cards with carousel dots (from Amber's reference HTML); tighter section spacing                                                                                                                                                | Approved | new stories (Epic 3)                  |
| ENH-007 | 2026-10-04 | Home and News, news cards                                 | Home news gets a one-line intro with "See all news" on the same row; a story about an app shows only the app name in its pill; the third story is about PXP                                                                                                                                       | Approved | 3.7, 6.1                              |
| ENH-008 | 2026-10-04 | Home, products section; Our partners                      | "Apps for every role in school." becomes "What we build." with AI Tutor and AI Timetable added and back and forward buttons; the partners heading is left-aligned                                                                                                                                 | Approved | 3.5, new stories                      |
| ENH-009 | 2026-10-04 | Home, process; What we build; every section               | The 4-D process becomes "How we approach." with five steps (Amber's reference HTML); equal-size app cards; more space between headings and their descriptions                                                                                                                                     | Approved | 3.6, 3.5                              |
| ENH-010 | 2026-10-04 | Home, contact form                                        | The phone field shows an example number as its placeholder instead of a hint line; "Start the conversation" has no glow or lift                                                                                                                                                                   | Approved | 2.2                                   |
| ENH-011 | 2026-10-04 | Services process; Home and Services steps; About, Contact | Services uses the same five-step "How we work." component and content as Home; the chosen step is highlighted; the 4-D wording is retired                                                                                                                                                         | Approved | 5.4, 3.6                              |
| ENH-012 | 2026-10-04 | Home, How we approach                                     | Home shows a light five-step diagram with one short line per step and a link to Services; the full tabbed component stays on Services                                                                                                                                                             | Approved | 3.6                                   |
| ENH-013 | 2026-10-04 | Home, What we build                                       | AI Tutor (Students) and AI Timetable (School leaders) are marked "Coming soon"                                                                                                                                                                                                                    | Approved | 3.5, new stories                      |
| ENH-014 | 2026-10-04 | Products, hero                                            | "Built apart. Better together." with one button and a diagram of the four apps around the X tile, on a warm light background with drifting glows                                                                                                                                                  | Approved | 4.1                                   |
| ENH-015 | 2026-10-04 | Products, after the four apps                             | New "One event. Multiple experiences." timeline: one school day from 07:45 to 15:30 across the apps                                                                                                                                                                                               | Approved | 4.1                                   |
| ENH-016 | 2026-10-04 | About, frequently asked questions                         | The FAQ becomes "Your question, we answer": two columns of hairline rows, closed by default, on a soft animated light-to-navy background                                                                                                                                                          | Approved | 6.4                                   |
| ENH-017 | 2026-10-04 | Products, LXP and IoT sections                            | The two centred section headings move to the left, so every heading on the site is left aligned                                                                                                                                                                                                   | Approved | 4.1                                   |
| ENH-018 | 2026-10-04 | Products, hero                                            | A "Pause motion" button stops the drifting glows; the choice is shared with Home                                                                                                                                                                                                                  | Approved | 4.1                                   |
| ENH-019 | 2026-10-04 | About, frequently asked questions                         | The FAQ background stops moving: the clouds and the gradient stay, the drifting and the sheen go                                                                                                                                                                                                  | Approved  | 6.4                                   |

## ENH-001: Contact form on Home

- **Why:** from the manager's homepage brief: a visitor can start a conversation on Home without going to
  another page. Amber kept only this part of the brief; the rest of Home stays as it is.
- **What changed:** the amber "See it working at your school." email band at the end of Home is replaced
  by an amber section with:
  - the heading "Have something you want to build?" and a short supporting paragraph ("Tell us a little
    about yourself and what you're working on. Our team will get in touch to learn more.");
  - the email and the Plano and Ho Chi Minh City phone numbers beside the form;
  - fields Your name, Work email, Phone number (optional) and Tell us about your project;
  - the button "Start the conversation" and, below it, "We only use your details to reply to your
    message." with a Privacy policy link;
  - an error under each field that needs attention, and a thank-you panel in place of the form, without
    leaving the page: "Thanks — we've received your message." and "Our team will review what you shared
    and get in touch with you." (The prototype's extra line "Prototype: nothing was sent." is not for
    production.)
- **Rules:**
  - Required: name, work email (a valid address) and the message.
  - Phone is optional. When filled, it has 7 to 15 digits, may start with +, and may use spaces, dots,
    dashes and brackets. Extensions ("ext 2") are not accepted.
  - The message is at most 2,000 characters.
  - Error wording: "Please enter your name.", "Please enter a valid email address.", "Please enter a
    valid phone number, for example +1 469 322 9899.", "Please tell us a little about your project.",
    "Please keep your message under 2,000 characters."
  - An error clears once the value is valid; on submit, focus moves to the first field that needs
    attention, then to the thank-you panel.
- **Developer notes:**
  - Call it the **contact** form, the third form beside **demo** and **project** on `/demo`, so delivery
    and analytics can tell them apart.
  - Like the other forms (Stories 2.3 and 2.4), production needs the hidden honeypot field, server-side
    checks, rate limiting and a send-failure message that keeps what the visitor typed. The prototype only
    shows the success path.
  - The old band saved the email and opened `/demo#form` with it filled in; that hand-off is gone from
    Home.
  - Stories to update: 3.7 (Home end section, design reference `#contact` instead of `#cap-h`), 2.2
    and 2.3 (a third form type), 2.4 (the email band no longer appears on Home), and AC-NAV-2 / FR-33
    (Home has no demo capture band).
- **Open items (do not block the prototype):** where contact messages are delivered (Hoang). Book a demo
  is still reached from the footer "Contact" link and the other pages' bands; Amber accepted losing the
  Home band on 2026-10-03.

## ENH-002: Home hero, front doors and header

- **Why:** Amber's review of the Home hero and the header on 2026-10-04.
- **What changed:**
  - **Headline:** the highlighted word ("connected") is amber text (`amber-tint`) instead of an amber
    underline that swipes in. Home hero only; the other heroes keep the underline (amber text would not
    be readable on the amber and light heroes).
  - **Hero button:** "Explore our products" has no amber glow, at rest or on hover. It keeps its amber
    fill and the thin inner highlight.
  - **Stats:** the label "Experience you can count on" stays above them. Only two stats remain, side by
    side with a 64px gap and no divider lines (none between them, none above them): "25+ Years" (the
    word "Years" beside the number) with "Leadership experience in software", and "8" with "Service
    offerings, from idea to operation". The descriptions are white. Below 640px the stats stack
    vertically. The space below them is 40px (32px on phones). The hero grid has 10px below the screenshots at
    every width (was 36px; 24px on phones), and below 900px the stats sit 10px under their label. "24/7", "20+" and "2 offices" are
    removed from Home (they are still on About and Services).
  - **Silk background:** the animated silk covers the whole hero, left side included, but stays quiet
    behind the headline so it does not distract: 35% strength on the far left, rising to full strength
    only on the right, behind the screenshots. Towards the bottom it fades out gradually and is gone by
    the stats (a top-to-bottom mask: full until 40% of the hero height, transparent at 82%). The no-WebGL
    fallback gradient behaves the same.
  - **Small screens:** the hero headline is bigger: 2.6rem to 3.2rem below 900px, 2.25rem to 2.75rem below
    640px (scaling with the screen width); the supporting line is 1.2rem below 900px.
  - **Front doors:** the two cards "Products for schools" and "Your software delivery team" no longer
    overlap the bottom of the hero. They open the "Why XionTechs." section, above its four tiles; their
    titles become H3 under the section's H2.
  - **Products is a plain link (every page):** the Products mega menu (the four apps with descriptions
    and "More products are on the way.") is removed; Products goes straight to `/products`, like the
    other menu items. The menu is five plain links.
  - **Hover is an underline only (every page):** hovering a menu item, the language dropdown or the
    hamburger shows the 2px amber underline (navy text) and no rounded background. The current page keeps
    its amber underline and bold text. The options inside the open language list keep their light
    background on hover.
  - **Hover only on the word (every page, above 1080px):** the menu items and the language trigger have
    no side padding; a 30px gap spaces them. The hover area and the underline are exactly as wide as the
    word, so hovering the space between items does nothing. Items stay 44px tall. The header has no
    bottom border line.
  - **Count-up:** the two numbers start at 0 and count up to 25+ and 8 (1.8s, easing out) once the stats
    are on screen, after their fade-in. With reduced motion, or without JavaScript, the final numbers
    show straight away.
  - **Menu button (every page, below 1080px):** a hamburger icon (Phosphor `list`, a cross while the menu
    is open) replaces the "Menu" text pill. No outline; 44px tap area. It comes before the language
    dropdown. Its accessible name stays "Menu"; the focus trap order is logo, Menu, language, then the
    menu panel.
- **Developer notes:**
  - Story 3.2: the shader mask `m` covers the whole width (0.35 at the far left, 1.0 on the right) and
    the canvas has a top-to-bottom fade, so the stats sit on plain navy.
  - Story 3.3: two stats on Home, no dividers, "Years" as a unit beside the number (outside the
    count-up element so the animation does not overwrite it).
  - Stories 3.4 and 3.5: the doors are no longer pulled up over the hero (no negative margin); they sit
    inside the Why XionTechs section.
  - Story 1.3 and UX-DR6: no mega menu; Products is a plain link to `/products` (marked current on
    that page). Menu items, the language trigger and the hamburger show the amber underline on hover,
    not a mist background. Story 1.3's hover and click behaviour for the Products menu no longer
    applies.
  - Story 1.4 and UX-DR7: an icon button instead of the "Menu" text pill, placed before the language
    dropdown.
- **Open items:** none.

## ENH-003: Partner logo strip and case studies placeholders on Home

- **Why:** Amber asked for placeholder sections for partner collaboration (with animated logos) and for
  case studies, so the page structure is ready when real partners and client stories are approved.
- **What changed:**
  - **Our partners.** (white, right under the hero): a centred heading only (no note, no button), then a
    strip of eight logo spaces ("[Placeholder] Partner logo 1" to 8, 320 × 160 each) that scrolls slowly
    from right to left in a seamless loop (40s per loop), fading out at both edges.
  - **How the strip stops (no visible button):** it pauses while the pointer is over it (only on devices
    that really hover), while it has keyboard focus (it is one Tab stop, named "Partner logos. Hover, focus
    or tap to pause."; Enter or Space toggles it), and a tap or click toggles it paused or playing. The
    hero's "Pause motion" button stops it too, and that choice is remembered. With reduced motion it never
    moves: the logos sit in centred rows. In the prototype the logo spaces are image drop zones (click to
    upload), so a tap on a logo opens the file picker; production logos are plain images, so a tap
    anywhere on the strip toggles it.
  - **Case studies.** (light blue, after the four-app row, before the process): heading, the note
    "[Placeholder] Real client stories replace these sample cards once each client approves them.",
    three cards (image 1200 × 750, "[Placeholder] Industry" tag, "[Placeholder] Case study title 1" to 3, a
    two-sentence summary, a "[Placeholder] Result" line, "Full case study coming soon") and a "Start a
    project" button that goes to the contact form.
  - **Section colours** shift to keep white and light blue alternating: Why XionTechs becomes light blue,
    the four-app row becomes white (its linen texture is dropped).
- **Developer notes:**
  - The loop works by repeating the logo list twice (three sets, so it stays seamless on screens up to
    about 2,600px wide); the repeats are hidden from screen readers and keyboards (`aria-hidden`,
    `inert`), so each logo is announced once.
  - Content that moves for more than five seconds needs a way to stop it (WCAG 2.2.2). There is no
    visible button, so keep every one of the stop methods above (hover, focus, tap, the hero's Pause
    motion and reduced motion); hover alone would leave out keyboard and touch users.
  - Real logos need the partner's written OK; real case studies need the client's approval (team rule:
    no invented logos or client stories).
  - No story covers these sections yet; they need new stories (or additions to Epic 3).
- **Open items:** resolved on 2026-10-04: the manager confirmed the partner logo and case study placeholders
  are wanted now, although the homepage brief (2026-10-02) had said to wait for real evidence.

## ENH-004: Section spacing, heading-first reveal and the Why XionTechs bento

- **Why:** Amber's review on 2026-10-04, with a reference screenshot for Why XionTechs.
- **What changed:**
  - **Spacing (every page):** sections have 80px above and below (was 112px; 56px on phones, was 80px),
    and a section heading has 32px below it before the content (was 48px). The partner strip has 56px.
  - **Heading first (every page):** in each section the heading fades in first; the rest of the section
    follows about 0.45s later, one item after another (0.16s apart), and never before its heading. The
    partner logo strip now fades in too, so it is not visible until its heading is. Items further down a
    section still wait until they are scrolled into view.
  - **Why XionTechs (Home):** the two front doors and the four tiles are replaced by one grid of four
    cards, following Amber's reference and her reference HTML for the "+3" behaviour, in brand colours.
    Layout: Products and Delivery on the first row, Industries and Outsourcing services on the second.
    - "Products" (navy, 7 of 12 columns): "Products for schools", "Connected apps for parents, students,
      teachers, leaders and school staff, designed as one ecosystem.", the four app logos (the PXP, LXP,
      SXP and IoT app tiles, each with its audience below: Parents, Students, Staff, Facilities), and
      "Explore products". The whole card links to /products.
    - "Delivery" (white, 5 columns): "Two offices, one working day.", "Teams across time zones keep
      delivery moving with practical overlap.", and two clock chips with the live local time in Plano and
      Ho Chi Minh City (HCMC).
    - "Industries" (white, 7 columns): "Deep in education. Built to adapt.", "Education is where we go
      deepest, while the same engineering capability supports other industries too.", a navy "Education"
      chip and a navy "+3" circle. Hovering, focusing or tapping "+3" widens its slot (to the width of
      the chips, wrapping if the card is too narrow) and swaps the circle for three white chips (light
      border) on the same line: Healthcare, Logistics and Private Equity (the industries listed on
      Services). On phones the chips wrap below. "+3" is a button named "3 more industries: Healthcare,
      Logistics and Private Equity" with `aria-expanded`; the revealed chips are hidden from screen
      readers so the names are heard once. Keyboard focus shows a ring around the whole slot.
    - "Outsourcing services" (amber, 5 columns): "Your software delivery team", "Dedicated teams and
      end-to-end delivery for companies building digital products.", "Explore services". The whole card
      links to /services.
    - **Decoration:** no illustrations (Amber found them distracting). Only the amber Outsourcing services
      card has the soft white circle in its bottom-right corner. "Explore products" and "Explore services"
      both sit on the right.
    - **Reveal animation:** when a card comes into view it fades up, then its label, heading, text and
      chips follow one after another (0.08s apart) and the app logos and clock chips pop in. Hovering a
      link card lifts it 3px. With reduced motion everything is shown at once, without movement.
    - Under a thin line, one quiet row (not a headline): "Get IT Done" (1.2rem to 1.5rem, amber-text) on the
      left; on the right "Built with ownership." (body size, bold) followed by "Ownership of our commitments
      and pride in quality." (small). No link.
    - Below 900px every card is full width.
    - Removed: the team photo tile and "We build and run our own school platforms." (with its confirmed
      claim), "Education is our core." (now the Industries card) and the "Our core values" link.
- **Developer notes:**
  - Story 3.4 and 3.5: the front doors become the first row of the Why XionTechs grid; the card labels
    (Products, Outsourcing services, Delivery, Industries) are allowed small caps labels, like the old
    door names.
  - "Get IT Done" uses the amber-text token, because the brand amber (#FFC000) does not reach the 3:1
    contrast that large text needs on a light background.
  - The reveal order is a site-wide rule: a section's heading reveals first and its other reveal items
    follow it. If the heading is already above the screen (Back button, a link to a lower part of the
    page), the section's content shows as soon as it is on screen, so nothing stays hidden. Only items that
    arrive with the heading are staggered.
  - The clock chips show "US Central" and "GMT+7" until the script fills in the live time; "HCMC" is
    marked up as an abbreviation of Ho Chi Minh City. "Built with ownership." is a paragraph, not a
    heading.
  - The UX parity tool's header surface (`scripts/ux/surfaces/header.json`) still probes the Products
    mega menu that ENH-002 removed; it needs updating (Hoang) before `npm run ux:parity` runs on the
    header again.
- **Open items:** none.

## ENH-005: Products section after the process

- **Why:** the products section right after Why XionTechs repeated the Products card. Amber keeps it,
  because XionTechs has more apps than the four on the page, but shows it later so the page meets the
  products twice from different angles: first as one of the two things we do, then as the apps
  themselves.
- **What changed:**
  - **Order of Home:** hero, Our partners, Why XionTechs, Case studies, Our 4-D process, **Apps for every
    role in school.**, Latest from XionTechs, Have something you want to build?
  - **Heading:** "Four apps for every role in school." becomes "Apps for every role in school.", with
    the line "Four apps serving schools today, with more products on the way." The four app items and
    "Explore our products" stay as they were.
  - **Colours:** Case studies turns white (it now follows the light blue Why XionTechs), so white and
    light blue keep alternating: partners white, Why light blue, Case studies white, process navy, apps
    white, news light blue, contact amber.
- **Developer notes:** Story 3.5's app row moves after the process (Story 3.6) on Home; ENH-003's note
  about section colours is replaced by the order above.
- **Open items:** none.

## ENH-006: Case studies as a full-width slider, and tighter section spacing

- **Why:** Amber's reference HTML (`partner-case-study-full-width-slider-text-link.html`) and her review,
  2026-10-04.
- **What changed:**
  - Heading "Work built with our partners." with the line "Explore a selection of company partnerships and
    see how different business needs became focused digital solutions." The reference's small label
    ("Selected partnerships") is left out: no labels above section headings.
  - A full-width row of six cards that runs past the right edge of the page (fading out there). The first
    card lines up with the page content; cards snap into place. A mouse can drag it, touch screens swipe
    it, and when the row has keyboard focus the left and right arrow keys move one card (it is one Tab
    stop, named "Partner case studies. Use the arrow keys to scroll.").
  - **Carousel dots** under the row, one per page of cards (as many cards as fit on the screen: 2 dots on a
    1280px to 1440px desktop, 3 at about 900px to 1100px, one per card below 900px where one card fills the
    width; recounted when the window size changes, without losing keyboard focus). The current
    page's dot is a longer navy bar, and clicking a dot scrolls to that page (each dot is a 44px button
    named "Case studies 1 to 3" and so on, in Vietnamese "Case study 1 đến 3", the current one marked with
    `aria-current`). The right-edge fade disappears when the row reaches its end. The hint line is
    removed.
  - Each card: an image area that uses the same light grid placeholder as every other image on the site
    (an image drop zone for a real screenshot) with a small "01 / 06" number; then the partner name as the
    card's heading ("[Placeholder] Partner 1", small caps), a one-to-two-sentence placeholder description,
    28px of space, and "View case study" with an arrow. No case study title. Cards are as tall as their
    content.
  - About 26% of the screen width per card on desktop, 62% below 900px, 86% on phones.
  - The "Start a project" button and the old three-card grid are removed.
  - **Section spacing (every page):** sections have 64px above and below (was 80px; 48px on phones, was
    56px), and a section heading has 24px below it (was 32px). The partner strip has 48px.
- **Developer notes:**
  - The reference uses invented partners (Northstar Education, Atlas Finance and others); the team rule
    allows only real content or `[Placeholder]`, so every card is a placeholder until a client approves
    its story.
  - "View case study" is not a link yet (no case study pages exist); it becomes one when the pages do.
  - A drag never opens a card's screenshot slot (prototype tooling).
  - The spacing replaces the values in ENH-004.
- **Open items:** none (the manager confirmed the placeholders on 2026-10-04, see ENH-003).

## ENH-007: News intro row and app pills

- **Why:** Amber's review, 2026-10-04.
- **What changed:**
  - **Home, Latest from XionTechs.:** under the heading, the line "Catch up with what our team is building and
    shipping." On the same row, on the right, "See all news" (it was a link under the cards). On phones the
    link sits under the line. The "[Placeholder] Sample stories…" note is removed (each sample title still
    starts with "[Placeholder]").
  - **Pills (Home and News):** a story about an app shows only the app's name in its pill ("PXP", "SXP",
    "LXP", "IoT"), in the amber product style; other stories keep their category ("Team", "Company").
    Before, product stories showed "Product · PXP".
  - **Third story:** "[Placeholder] Back-to-school week with PXP" is now a PXP story: its pill reads "PXP"
    and its text "Our team was on campus helping parents get started with PXP." It stays under the Schools
    filter on the News page.
- **Developer notes:** Story 3.7 (Home news) and 6.1 (news filters): the pill shows the app name when a story
  has an app; the category still drives the News filters. A reusable "section head with a link on the
  same row" layout is added (`.sec-head-row`).
- **Open items:** none.

## ENH-008: What we build, with AI Tutor and AI Timetable

- **Why:** Amber's review, 2026-10-04: XionTechs is building more apps than the first four.
- **What changed:**
  - **Heading:** "Apps for every role in school." becomes "What we build.", with the line "Digital products we
    design, build and run for every role in school, with more on the way."
  - **Two new apps** after PXP, LXP, SXP and IoT: "AI Tutor" (Students, "[Placeholder] Study help at each
    student's own pace.") and "AI Timetable" (School leaders, "[Placeholder] The whole school timetable,
    planned in fewer steps."), each with an amber icon tile (a sparkle and a calendar). Both link to the
    Products page for now, which does not describe them yet.
  - **Back and forward buttons:** the row now scrolls sideways (four apps visible on desktop, two below
    1080px, one and a bit on phones, snapping to each app). Two round arrow buttons on the right of the
    heading row move it one app; each switches off at its end. Each app card is a Tab stop (they
    are links); while one has focus, the left and right arrow keys move the row; on touch screens it swipes.
  - **Our partners:** the heading is left-aligned, like every other section (it was centred in ENH-003).
  - **Section spacing:** back to 64px above and below (48px on phones), as in ENH-006, after a short try
    with less space above.
- **Developer notes:** Story 3.5's app row becomes a horizontal rail with previous and next buttons
  (`aria-controls`, disabled at the ends). AI Tutor and AI Timetable need product facts (description,
  audience, status, Products page section) before they ship; their descriptions are placeholders.
- **Open items:** resolved by ENH-013: AI Tutor (Students) and AI Timetable (School leaders) are coming soon.
  Their descriptions are still placeholders.

## ENH-009: How we approach, equal app cards, heading spacing

- **Why:** Amber's reference HTML (`company-process-5-steps-simplified.html`) and her review, 2026-10-04.
- **What changed:**
  - **Home process:** "Our 4-D process: from your request to launch." becomes "How we approach.", with the line
    "Five clear steps take your idea from the first conversation to a product that keeps improving." Three
    columns on the reference's blue gradient (deep blue #13245a to #445fca to sky #69b8ea, with a soft amber glow
    top right), styled exactly as Amber's screenshot:
    - left: the layered 3D process diagram from the reference (re-encoded as WebP, 768 × 1152, 103 KB instead
      of a 1.27 MB PNG; decorative, so it has empty alt text);
    - middle: a vertical rail of five steps, each a dot, a small number and a large name in the body font: Discovery,
      Design, Development, QA & Improvement, Deployment. The chosen step has an amber dot with a soft ring and its
      number and name in full white; the other steps are dimmed to 85% opacity (95% on hover), the
      faintest that still keeps 4.5:1 contrast on the blue (55% would fall to about 2.6:1);
    - right: a deep navy panel (#08113a to #10205c, a faint diamond in the corner) for the chosen step: "Step
      01 — Discovery", a title in the body font, a short intro, four bullet
      points and a "You receive" box with a one-line outcome and three small outcome chips.
    - The reference's plus icon next to the step tag and its small label above the heading are left out.
    - The steps are tabs: click a step, or use the arrow keys (up, down, Home, End) on the rail; the panel
      changes with a short fade (none with reduced motion). Below 1080px the panel moves under the diagram
      and the rail; on phones everything stacks.
  - **Sizes (after Amber's review):** the panel is the widest column (about 1.35 parts to the diagram's 0.7 and
    the rail's 0.6; about 580px wide on a 1440px screen); the diagram is at most 300px wide (220px on phones);
    step names are 1.05rem to 1.2rem; inside the panel the tag, intro and bullets use the small text size and the
    title is 1.4rem to 2rem.
  - **Step names are the large element and the numbers stay small:** the name is what people scan and what the
    panel is about; the number only shows order, so it stays a small mono label.
  - **What we build:** every app card is the same width (a quarter of the row, minus a 16px gap) and the same
    height, with a light border and rounded corners; content sits at the top so the icons and names line up.
  - **Every section:** 20px between a section heading and its description (was 12px).
- **Developer notes:**
  - The section uses the reference's own blues, outside the brand palette in DESIGN.md (Amber chose the
    reference look). The prototype defines them as section tokens (`--ap-blue-1` to `--ap-blue-3`, `--ap-panel-1`,
    `--ap-panel-2`, `--ap-amber`, `--ap-amber-ring`, `--ap-dot`); production should do the same.
  - Every step's panel is in the page and focusable (`tabindex="0"`); the script hides all but the chosen one,
    so without JavaScript all five steps can be read.
  - Story 3.6: the four-card 4-D flow on Home is replaced by the tabbed five-step layout (WAI-ARIA tabs,
    vertical). The Services page still shows the four-step 4-D process; the two should match (open item).
  - The step content (titles, bullets, outcomes) comes from Amber's reference.
- **Open items:** resolved by ENH-011 (Services uses the same five steps).

## ENH-010: Contact form phone placeholder and a quiet button

- **Why:** Amber's review, 2026-10-04 (follows ENH-001).
- **What changed:**
  - **Phone number (optional):** the field shows "+1 469 322 9899" as greyed placeholder text ("+84 908 107 552"
    in Vietnamese); the hint line under it ("Include your country code, for example …") is removed. The
    error message is unchanged.
  - **"Start the conversation":** no amber glow and no lift on hover or press; it keeps its amber fill and turns a
    slightly deeper amber on hover so it still shows a hover state.
- **Developer notes:** the placeholder is an example only, not a label; the field keeps its visible label
  "Phone number (optional)". The validation rules in ENH-001 are unchanged.
- **Open items:** none.

## ENH-011: Five steps on Services, and a highlighted step

- **Why:** Amber's review, 2026-10-04: Home and Services described the process differently.
- **What changed:**
  - **Services:** the four-card "Our 4-D process" becomes "How we work.", with its own line "Every step ends with
    something you can see, test and approve." and the same five-step component and content as Home (diagram,
    step tabs, detail panel, blue gradient). The hero button "See our 4-D process" becomes "See how we work";
    it still jumps to the section (`#process`).
  - **Same steps on both pages:** one set of step names and outcomes. ENH-012 then made Home the short version
    and kept the full detail (diagram, tabs, panel) on Services only.
  - **Chosen step highlighted (Services; Home had it until ENH-012 made Home static):** a soft white band (14% white with a thin light outline,
    rounded) behind the chosen step's number and name, its name a little bolder (600), and a fainter band on hover
    (only on devices that hover). Long step names may wrap below 1240px so they stay inside the rail.
    The other steps stay at 85% so they remain readable on the blue.
  - **4-D wording retired:** About's FAQ answer (page and structured data) now says "Discovery, the first step
    of our five steps"; the Contact page checklist says "a first Discovery conversation, step one of our five
    steps". No page mentions 4-D any more.
  - The old four-card flow styles and script are removed. Discovery's outcome keeps the estimate: "A clear
    scope, estimate and delivery plan.", and its third point reads "Scope, risks, priorities and constraints" (both
    pages' panel content comes from this one set).
- **Developer notes:** Story 5.4 (Services process) uses the tabbed component. The Next.js app still shows
  the "4-D process" with four steps (Home, Services, the contact checklist) and its tests pin that wording
  (`src/app/page.test.tsx`, `src/components/sections/process-flow.test.tsx`); update both when Stories 3.6 and
  5.4 pick up ENH-011 and ENH-012.
- **Open items:** none.

## ENH-012: A light "How we approach" on Home

- **Why:** Amber's review, 2026-10-04: Home should carry lighter content, shorter text and a simple diagram; the
  full process belongs on Services.
- **What changed:**
  - **Home:** "How we approach." with the line "Five clear steps, from the first conversation to launch and
    beyond." and "See how we work" on the same row (to `services.html#process`). Below, one row of five steps
    joined by short lines between the circles: a numbered circle (navy with an amber ring), the step name and one
    short line each, all in full white:
    Discovery "Learn your goals, users and scope.", Design "Shape flows, interfaces and architecture.",
    Development "Build the product in agile sprints.", QA & Improvement "Test and refine before release.",
    Deployment "Release, monitor and keep improving." The line draws in from left to right and the steps follow
    one after another; with reduced motion everything shows at once. Below 900px the steps stack vertically
    with the line on the left. Home uses a deeper version of the blue gradient (it ends at #445fca instead of the light sky blue) so the
    white text keeps at least 4.5:1 contrast everywhere. Each connector draws in just before the next step
    appears; without JavaScript the lines and steps show at once.
  - **Services:** unchanged; it keeps the full component (diagram, step tabs, detail panel, highlighted step).
- **Developer notes:** Story 3.6 (Home) becomes a static five-step diagram with no tabs; Story 5.4 (Services)
  keeps the tabbed component.
- **Open items:** none.

## ENH-013: AI Tutor and AI Timetable are coming soon

- **Why:** Amber confirmed on 2026-10-04 that AI Tutor is for students, AI Timetable is for school leaders, and both
  are coming soon. She also confirmed with the manager that the partner logo and case study placeholders are
  wanted now (closes the open items in ENH-003, ENH-006 and ENH-008).
- **What changed:** the AI Tutor and AI Timetable cards in "What we build." show a small amber "Coming soon" tag
  (Vietnamese "Sắp ra mắt") under their audience line. Their names and audiences are confirmed; the one-line
  descriptions stay "[Placeholder]" until the product text is written. The cards keep the same size as the
  others, and every card's description now sits right under its header, with or without a tag.
- **Developer notes:** the tag is plain text inside the card link, so screen readers hear "AI Tutor, Students,
  Coming soon". When the apps launch, remove the tag and replace the placeholder descriptions. Both cards link to the Products page, which does not describe them yet; add their sections (or an anchor) when the product text exists. The tag uses the brand amber token and semibold text to keep its contrast above 4.5:1.
- **Open items:** none. Amber chose on 2026-10-04 to keep the placeholder descriptions for now; they will be
  replaced when the product text exists.

## ENH-014: Products hero shows the connected suite

- **Why:** Amber sent a reference screenshot on 2026-10-04 for the first section of the Products page.
- **What changed:** the hero "Four apps. One connected school." with device mockups, two buttons and a breadcrumb is replaced by:
  - the heading "Built apart. Better together." and the line "A connected suite for school communities — bringing parents, learning, staff operations and campus technology into one shared ecosystem.";
  - one navy button "Explore products" (arrow down-right) that jumps to the PXP section;
  - on the right, four navy cards (PXP "Parent experience", LXP "Learning experience", SXP "Staff experience", IoT "Connected campus") around a white X tile with a soft glow, joined by thin lines that draw in when the section appears;
  - a warm light background (Amber's option 2 reference, 2026-10-04): a pale cream-to-mist gradient with a soft amber glow, a faint navy glow and a white glow that drift slowly around the section (34 to 38 seconds per pass; the amber and navy glows move at the same pace), plus a very slow light sheen; the amber background and the moving strands are removed. No small label above the heading.
- **Rules:** each card links to its app section on the same page; the breadcrumb and the "Book a demo" and "Product updates" buttons are left out on purpose (Product updates stays in the bar under the hero). On phones the diagram sits under the text. The glows pause while the hero is off screen and when the visitor has turned motion off on Home. With reduced motion, the lines are shown at once, the glows stay still and the cards do not lift on hover or focus.
- **Developer notes:** the X tile is decorative (hidden from screen readers); the diagram is a labelled group, and each card is a link whose name reads "Parent experience PXP". Vietnamese copy is in the prototype.
- **Open items:** resolved by ENH-018: a Pause motion button stops the glows.

## ENH-015: Products shows one school day across the apps

- **Why:** Amber sent a reference screenshot on 2026-10-04: after the four apps, show why they are stronger together with a real school-day moment instead of another feature grid.
- **What changed:** a new dark section between IoT and Product updates:
  - the heading "One event. Multiple experiences." and the line "Use a real school-day scenario to explain why the products are stronger together instead of adding another generic feature grid." (Amber's wording from the reference);
  - a five-step timeline joined by a thin line: 07:45 Student arrives (campus systems detect the start of the day), 08:00 Attendance recorded (staff confirms attendance through SXP), 08:01 Parent updated (PXP reflects the latest school-day status), 09:30 Learning begins (LXP connects activity and feedback), 15:30 Day stays connected (every role sees what matters to them);
  - no small label above the heading (the reference's "The connected school day" label is left out, as on every other section).
- **Rules:** the line draws in and the steps appear one after another; on phones the timeline turns vertical. With reduced motion, everything shows at once.
- **Developer notes:** the timeline is an ordered list; each time is a `time` element; the dots are decorative. Vietnamese copy is in the prototype. The times are an example day, not product data.
- **Open items:** none. Amber chose on 2026-10-04 to keep the reference wording under the heading.

## ENH-016: FAQ in two columns under "Your question, we answer"

- **Why:** Amber sent a reference screenshot on 2026-10-04 of a help-centre style FAQ and asked for the About page FAQ to match it, with no search box.
- **What changed:** the FAQ section on About:
  - the heading "Frequently asked questions." becomes "Your question, we answer", with the existing line "Straight answers about our products, our services and how we work." under it;
  - the reference's search field is left out, as Amber asked;
  - the nine questions move from one column of bordered cards to two columns of plain rows separated by hairlines;
  - the + / − marker sits in its own column at the right of each question;
  - the section carries the soft animated background Amber chose (option 1 of her reference file): a light-to-navy gradient with a very slow sheen passing across and three soft cloud shapes drifting in the bottom left corner;
  - the heading, the line under it and the two columns all start at the same left edge.
- **Rules:** every answer is closed when the page loads; several can be open at once (UX-DR27). On phones the two columns become one. With reduced motion the background holds still and keeps its gradient.
- **Developer notes:** still native `details`/`summary`, so the FAQ works without JavaScript and keeps its FAQPage structured data. The nine answers are unchanged, Vietnamese copy included. The moving shapes are empty `aria-hidden` divs, ignored by screen readers. The background uses the site's own navy and light tokens rather than the hex values in the reference file, so it matches the rest of the site.
- **Fixed on 2026-10-04 after Amber's screenshot:** the left column's + sat hard against the right column's question because a `gap:0` written after `column-gap` cancelled it; the two declarations no longer fight, and the columns are 96px apart. The tinted band behind the heading was also dropped, so the whole section shares one background.
- **Fixed on 2026-10-04:** the heading looked centred because its box carried both `wrap` and a 760px width limit, and `wrap`’s automatic side margins then centred the narrowed box. The box is now a full-width `wrap`, with the width limit on the heading text itself, so the heading starts on the same left edge as the questions.
- **Changed on 2026-10-04 on Amber’s review:** the closing rule under the last row was removed, so each question has a line above it and the list simply ends.
- **Changed on 2026-10-04 on Amber’s review:** the drifting round blobs became cloud shapes and moved together into the bottom left corner, rather than one sitting over the top right of the questions.
- **Open items:** the last row holds a single card because there are nine questions, not ten. The Pause motion button added by ENH-018 only governs the Products hero glows, so a visitor who pauses motion there still sees the FAQ clouds drifting; worth deciding whether that saved choice should cover every moving background.

## ENH-017: Every section heading is left aligned

- **Why:** Amber on 2026-10-04: section titles should all be left aligned.
- **What changed:** the two centred section headings on Products, "A calm place to learn." (LXP) and "A campus you run from one screen." (IoT), now start at the left like every other heading on the site. Their badges move left with them.
- **Rules:** no other page had a centred heading, so nothing else moved.
- **Developer notes:** the `center` modifier was removed from those two `sec-head` blocks. The modifier itself stays in the stylesheet, unused, in case a future section wants it.
- **Open items:** none.

## ENH-018: Pause motion button on the Products hero

- **Why:** the drifting glows in ENH-014 move for longer than 5 seconds, so WCAG 2.2.2 (Pause, Stop, Hide) asks for a way to stop them that works for mouse, touch and keyboard. Amber chose a button on 2026-10-04 after pausing on hover was ruled out (keyboard and touch users cannot hover, and the motion restarts when the pointer leaves).
- **What changed:** the round "Pause motion" button from the Home hero now also sits in the top-right corner of the Products hero, in solid navy so it reads on the light background. Its label slides out on hover or focus; it reads "Play motion" when the glows are stopped (Vietnamese "Tạm dừng chuyển động" and "Chạy chuyển động").
- **Rules:** the choice is saved and shared: pausing on Products also pauses Home's hero and partner logos, and the other way round. With reduced motion, the glows start still and the button offers "Play motion". The glows still rest while the hero is off screen. On phones the hero has extra room at the top so the button and its label never touch the heading.
- **Developer notes:** the button is a real `button` reached by Tab; its accessible name is its label text. It is hidden without JavaScript, as on Home. Use one shared motion setting for every animated background.
- **Open items:** none.

## ENH-019: The FAQ background holds still

- **Why:** Amber on 2026-10-04, after seeing ENH-016 in place: the section does not need animation.
- **What changed:** on the About page FAQ:
  - the three clouds no longer drift; they keep their shapes, colours and places in the bottom left corner;
  - the slow sheen is removed altogether, since a sheen that does not travel is only a faint band of light sitting off to one side;
  - the light-to-navy gradient behind everything is unchanged.
- **Rules:** the section now has no motion at all, so there is nothing for a reduced-motion setting to switch off, and the rule that did that is gone.
- **Developer notes:** both keyframe sets (`faqFloat`, `faqSheen`) and the `.faq-sheen` layer are deleted, so the page carries no FAQ animation code. The clouds stay as three `aria-hidden` divs painted with stacked radial gradients.
- **Open items:** this also settles the question left open by ENH-016: with the FAQ still, the Pause motion button from ENH-018 no longer has anything to govern here, so it can stay scoped to the Products and Home heroes.
