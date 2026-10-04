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

| ID      | Date       | Page and section                    | Change                                                                                                                                                                                                                                                                                            | Status   | Stories to update                     |
| ------- | ---------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------- |
| ENH-001 | 2026-10-03 | Home, last section                  | The demo email band becomes a contact form: "Have something you want to build?"                                                                                                                                                                                                                   | Approved | 3.7, 2.2, 2.3, 2.4                    |
| ENH-002 | 2026-10-04 | Home hero and Why XionTechs; header | Amber headline word, no button glow, two stats ("25+ Years"), silk across the hero fading out before the stats, bigger hero text on small screens, front doors moved into Why XionTechs, Products as a plain link, underline-only hover on the word, numbers count up from 0, hamburger menu icon | Approved | 1.3, 1.4, 3.1, 3.2, 3.3, 3.4, 3.5     |
| ENH-003 | 2026-10-04 | Home, new sections                  | Placeholder partner logo strip (scrolling; pauses on hover, focus or tap) under the hero, and three placeholder case study cards                                                                                                                                                                  | Approved | new stories (Epic 3)                  |
| ENH-004 | 2026-10-04 | Every section; Home Why XionTechs   | Tighter space above and below section headings; each section shows its heading first, then its content; Why XionTechs rebuilt as a four-card bento (app logos, reveal animation, +3 hover reveal) with a small Get IT Done line                                                                   | Approved | 3.5, 7.x (reveal), every page section |
| ENH-005 | 2026-10-04 | Home, section order                 | The products section moves below the 4-D process and becomes "Apps for every role in school."; case studies turn white                                                                                                                                                                            | Approved | 3.5                                   |

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
- **Open items:** the manager's homepage brief (2026-10-02) said not to add partner logo or case study
  placeholders until real evidence exists. Amber to confirm with the manager that these placeholders
  are wanted now.

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
