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

| ID      | Date       | Page and section                                                              | Change                                                                                                                                                                                                                                                                                            | Status   | Stories to update                     |
| ------- | ---------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------- |
| ENH-001 | 2026-10-03 | Home, last section                                                            | The demo email band becomes a contact form: "Have something you want to build?"                                                                                                                                                                                                                   | In PR    | 3.7, 2.2, 2.3, 2.4                    |
| ENH-002 | 2026-10-04 | Home hero and Why XionTechs; header                                           | Amber headline word, no button glow, two stats ("25+ Years"), silk across the hero fading out before the stats, bigger hero text on small screens, front doors moved into Why XionTechs, Products as a plain link, underline-only hover on the word, numbers count up from 0, hamburger menu icon | In PR    | 1.3, 1.4, 3.1, 3.2, 3.3, 3.4, 3.5     |
| ENH-003 | 2026-10-04 | Home, new sections                                                            | Placeholder partner logo strip (scrolling; pauses on hover, focus or tap) under the hero, and three placeholder case study cards                                                                                                                                                                  | In PR    | new stories (Epic 3)                  |
| ENH-004 | 2026-10-04 | Every section; Home Why XionTechs                                             | Tighter space above and below section headings; each section shows its heading first, then its content; Why XionTechs rebuilt as a four-card bento (app logos, reveal animation, +3 hover reveal) with a small Get IT Done line                                                                   | In PR    | 3.5, 7.x (reveal), every page section |
| ENH-005 | 2026-10-04 | Home, section order                                                           | The products section moves below the 4-D process and becomes "Apps for every role in school."; case studies turn white                                                                                                                                                                            | In PR    | 3.5                                   |
| ENH-006 | 2026-10-04 | Home, Case studies; every section                                             | Case studies become a full-width slider of six placeholder partner cards with carousel dots (from Amber's reference HTML); tighter section spacing                                                                                                                                                | In PR    | new stories (Epic 3)                  |
| ENH-007 | 2026-10-04 | Home and News, news cards                                                     | Home news gets a one-line intro with "See all news" on the same row; a story about an app shows only the app name in its pill; the third story is about PXP                                                                                                                                       | In PR    | 3.7, 6.1                              |
| ENH-008 | 2026-10-04 | Home, products section; Our partners                                          | "Apps for every role in school." becomes "What we build." with AI Tutor and AI Timetable added and back and forward buttons; the partners heading is left-aligned                                                                                                                                 | In PR    | 3.5, new stories                      |
| ENH-009 | 2026-10-04 | Home, process; What we build; every section                                   | The 4-D process becomes "How we approach." with five steps (Amber's reference HTML); equal-size app cards; more space between headings and their descriptions                                                                                                                                     | In PR    | 3.6, 3.5                              |
| ENH-010 | 2026-10-04 | Home, contact form                                                            | The phone field shows an example number as its placeholder instead of a hint line; "Start the conversation" has no glow or lift                                                                                                                                                                   | In PR    | 2.2                                   |
| ENH-011 | 2026-10-04 | Services process; Home and Services steps; About, Contact                     | Services uses the same five-step "How we work." component and content as Home; the chosen step is highlighted; the 4-D wording is retired                                                                                                                                                         | In PR    | 5.4, 3.6                              |
| ENH-012 | 2026-10-04 | Home, How we approach                                                         | Home shows a light five-step diagram with one short line per step and a link to Services; the full tabbed component stays on Services                                                                                                                                                             | In PR    | 3.6                                   |
| ENH-013 | 2026-10-04 | Home, What we build                                                           | AI Tutor (Students) and AI Timetable (School leaders) are marked "Coming soon"                                                                                                                                                                                                                    | In PR    | 3.5, new stories                      |
| ENH-014 | 2026-10-04 | Products, hero                                                                | "Built apart. Better together." with one button and a diagram of the four apps around the X tile, on a warm light background with drifting glows                                                                                                                                                  | In PR    | 4.1                                   |
| ENH-015 | 2026-10-04 | Products, after the four apps                                                 | New "One event. Multiple experiences." timeline: one school day from 07:45 to 15:30 across the apps                                                                                                                                                                                               | In PR    | 4.1                                   |
| ENH-016 | 2026-10-04 | About, frequently asked questions                                             | The FAQ becomes "Your question, we answer": two columns of hairline rows, closed by default, on a soft animated light-to-navy background                                                                                                                                                          | In PR    | 6.4                                   |
| ENH-017 | 2026-10-04 | Products, LXP and IoT sections                                                | The two centred section headings move to the left, so every heading on the site is left aligned                                                                                                                                                                                                   | In PR    | 4.1                                   |
| ENH-018 | 2026-10-04 | Products, hero                                                                | A "Pause motion" button stops the drifting glows; the choice is shared with Home                                                                                                                                                                                                                  | In PR    | 4.1                                   |
| ENH-019 | 2026-10-04 | About, frequently asked questions                                             | The FAQ background stops moving: the clouds and the gradient stay, the drifting and the sheen go                                                                                                                                                                                                  | In PR    | 6.4                                   |
| ENH-020 | 2026-10-04 | Products, hero and app sections                                               | No hero button; audience pills that jump and highlight (School navy, Parents amber, Students white); seven apps (with the new AI Grader) become stacked cards with device mockups and grouped features                                                                                            | In PR    | 4.1                                   |
| ENH-021 | 2026-10-04 | Home, What we build                                                           | Matches Products: AI Tutor and AI Timetable lose "Coming soon" and get real lines; AI Grader added; AI cards link to their Products card                                                                                                                                                          | In PR    | 3.5                                   |
| ENH-022 | 2026-10-04 | Products, whole page                                                          | The background colour follows the scroll: white with amber dots, bright amber by the last app cards, the school day turning into blue, blue Product updates, dark blue into the footer; phases come from section order                                                                            | In PR    | 4.1                                   |
| ENH-023 | 2026-10-04 | Products, school-day section                                                  | "One event. Multiple experiences." becomes "A day at school.": new copy, lighter type, dark background and a timeline that plays step by step once                                                                                                                                                | In PR    | 4.1                                   |
| ENH-024 | 2026-10-04 | Products, Product updates and email band                                      | "See all news" moves onto the heading row; the email band loses its ring illustration                                                                                                                                                                                                             | In PR    | 4.1                                   |
| ENH-025 | 2026-10-05 | Every page, typography                                                        | Calmer weights: headings, labels, numbers and buttons drop from bold (600 to 700) to 500; original fonts and sizes kept                                                                                                                                                                           | In PR    | Batch 1 (all pages)                   |
| ENH-026 | 2026-10-05 | Job page and Home contact section                                             | On phones no page scrolls sideways: the job page and Home's contact section fit the screen                                                                                                                                                                                                        | In PR    | 6.5                                   |
| ENH-027 | 2026-10-05 | Products, app cards                                                           | Resizing a window across the phone/desktop breakpoint keeps the reader on the card they were reading                                                                                                                                                                                              | In PR    | 4.1                                   |
| ENH-028 | 2026-10-05 | Products, app cards                                                           | Phone rotation keeps the card; the pill clears below the cards; one rule for "the card being read"                                                                                                                                                                                                | In PR    | 4.1                                   |
| ENH-029 | 2026-10-05 | Products, audience pills                                                      | The pill clears as soon as "A day at school" reaches the middle of the screen                                                                                                                                                                                                                     | In PR    | 4.1                                   |
| ENH-030 | 2026-10-05 | About, hero                                                                   | "Inspired by a mountain." becomes the hero: a held two-chapter story with the title at the top, the mountain climbing beside it, X mark at the summit; the old hero, key facts, breadcrumb and "Two strengths, one team." go                                                                      | In PR    | 4.1                                   |
| ENH-031 | 2026-10-05 | About, FAQ                                                                    | The empty slot after the nine questions becomes "Still have a question? Ask us directly", linking to the contact form                                                                                                                                                                             | In PR    | 4.1                                   |
| ENH-032 | 2026-10-05 | About, hero on large screens                                                  | On screens at least 1500px wide and 1050px tall the held story grows (wider layout, larger title, text and picture), roughly halving the empty band below it                                                                                                                                      | In PR    | 4.1                                   |
| ENH-033 | 2026-10-05 | Services, whole page                                                          | One white-and-amber background flowing down the page (no blue): a light hero, warming to amber through the services, How we work on amber with a navy step list, the email band blended in                                                                                                        | In PR    | 4.1                                   |
| ENH-034 | 2026-10-05 | News, whole page                                                              | White with light blue shading through the whole page, header included, and a light email band; fixes the filter buttons turning into "NaN"                                                                                                                                                        | In PR    | 4.1                                   |
| ENH-035 | 2026-10-05 | Careers, whole page                                                           | One pastel background in light amber shades flowing down the page, with a light hero in place of the bright amber one                                                                                                                                                                             | In PR    | 4.1                                   |
| ENH-036 | 2026-10-05 | Email and contact sections (Home, About, Services, News)                      | They blend into the page instead of sitting in their own coloured box; the decorative rings are gone                                                                                                                                                                                              | In PR    | 4.1                                   |
| ENH-037 | 2026-10-05 | News and story page                                                           | News filters stories by audience and shows full-image story cards; the story page becomes an editorial article (following Amber's two design files)                                                                                                                                               | In PR    | 4.1                                   |
| ENH-038 | 2026-10-05 | Every page, page titles                                                       | Typography check against the guideline: every page title uses the original display font at one size; the Products title was still in the rejected body-font style                                                                                                                                 | In PR    | Batch 1 (all pages)                   |
| ENH-039 | 2026-10-05 | Every page, heading weight                                                    | Page and section headings drop to 300 and card titles to 400 in the original display font, so they read as the guideline's moderate weight instead of bold                                                                                                                                        | In PR    | Batch 1 (all pages)                   |
| ENH-040 | 2026-10-05 | Every page headings; News cards; Careers                                      | Headings take the guideline's line height and letter spacing; News card titles at card-title scale; "A day at school." in the display font; Life at XionTechs becomes a horizontal carousel                                                                                                       | In PR    | Batch 1 (all pages)                   |
| ENH-041 | 2026-10-05 | Careers, Life at XionTechs                                                    | A horizontal event reel of real team photos, all one size, drifts edge to edge like the partner strip; a pause button stops it and it holds for hover and focus                                                                                                                                   | In PR    | Batch 1 (all pages)                   |
| ENH-042 | 2026-10-05 | News, story page, Home and Products news rows                                 | Real stories from the newXion newsroom (plus marked mock stories for Students and Parents); the story page shows each story's own text; Home and Products news rows use the News story cards                                                                                                      | In PR    | 4.1                                   |
| ENH-043 | 2026-10-05 | Every page footer; 404; forms                                                 | Mountain touches: the footer sits on a ridgeline with the X on the peak; the 404 page is a lost-trail map; form success shows a flag going up and "Summit reached"                                                                                                                                | In PR    | Batch 1 (all pages)                   |
| ENH-044 | 2026-10-05 | News stories; every page footer                                               | Newsroom stories get news-style titles and fuller articles; stories open straight away; the footer peak is taller and a climber walks up it as the reader scrolls                                                                                                                                 | In PR    | 4.1                                   |
| ENH-045 | 2026-10-05 | News grid; every page footer                                                  | News stories in a bento grid of mixed shapes; the footer climber stands at a spot set by the page's place in the navigation and walks there from the previous page, replacing the X on the peak                                                                                                   | In PR    | Batch 1 (all pages)                   |
| ENH-046 | 2026-10-05 | About                                                                         | Version A stays the base with an "Our mission." section above the mountain; newXion labels the X at the peak; the place name becomes a caption under the picture; the full mountain shows with a light amber glow                                                                                     | In PR    | 4.1                                   |
| ENH-047 | 2026-10-05 | News                                                                          | The two company posts with the least content (AI in Action, Year-End Town Hall) are removed                                                                                                                                                                                                       | In PR    | 4.1                                   |
| ENH-048 | 2026-10-05 | Services                                                                      | A white page with pastel amber washes; "What can we help you achieve?" before How we work; the facts strip keeps three facts                                                                                                                                                                      | In PR    | 4.1                                   |
| ENH-049 | 2026-10-05 | About intro and mountain; Products audience tabs; Careers                     | A Salesforce-style "We’re XionTechs" intro over pastel mountains; a transparent mountain picture with the place-name caption above it; underlined audience tabs under "What we build."; "Find your next challenge."                                                                               | In PR    | 4.1                                   |
| ENH-050 | 2026-10-05 | Products tabs and A day at school; About                                      | Plain transparent audience tabs (amber selected text, no dots); the day title and description share a row; reached timeline dots show a flag; no mountain name or place on About; city drawings in the office cards; "ownership" in amber text                                                    | In PR    | 4.1                                   |
| ENH-051 | 2026-10-05 | About drawings; Products tabs and timeline; footer climber; email bands; News | Country landmarks in the city drawings; rounder intro peaks; tabs and card dividers turn navy over amber; "Student learns"; the climber only climbs; no small print in email bands; big equal News cards                                                                                          | In PR    | Batch 1 (all pages)                   |
| ENH-052 | 2026-10-05 | Products tabs; About office drawings; 404                                     | The selected tab is amber only where it reads, navy elsewhere, on a light frosted bar; Ben Thanh Market for Ho Chi Minh City and the Plano Balloon Festival for Plano; no underline on the 404 heading                                                                                            | In PR    | 4.1                                   |
| ENH-053 | 2026-10-05 | News                                                                          | One large lead story (the newest), then square cards three to a row                                                                                                                                                                                                                               | In PR    | 4.1                                   |
| ENH-054 | 2026-10-05 | About offices; Careers reel                                                   | Smaller office cards; the reel's pause button sits on the same row as the section description                                                                                                                                                                                                     | In PR    | 4.1                                   |
| ENH-055 | 2026-10-05 | Careers (hero, Inside XionTechs, how we work); Services; About offices        | Careers follows Amber's two careers files: a "Stay curious. Build what’s next." hero with the Growth Learning Model, Inside XionTechs tiles and five flip cards, without Why you’ll grow here; no email band on Services; more space between the About office cards                               | In PR    | 4.1                                   |
| ENH-056 | 2026-10-05 | About mountain; footer; browser tab icon                                      | A pastel-amber glow around the mountain; footer links brought up to date; the XionTech X as the site icon                                                                                                                                                                                         | In PR    | Batch 1 (all pages)                   |
| ENH-057 | 2026-10-05 | Footer by audience; offices with icons; softer mountain glow | Footer Products grouped for schools, parents and students; Company cut to News, About, Careers; offices as Vietnam then US Delivery Center with icons; mountain glow toned down | In PR    | Batch 1 (all pages) |
| ENH-058 | 2026-10-05 | Footer audiences; phone format; About office cards; About background options | Footer Products shows For schools / For students / For parents only; phones as (+1) / (+84); About office cards use icon rows; about-2.html compares three About backgrounds | In PR    | Batch 1 (all pages) |
| ENH-059 | 2026-10-05 | About: white after the hero | Every About section after the hero on plain white (FAQ, offices and the email band no longer blue or navy); comparison page removed | In PR    | Batch 1 (About) |
| ENH-060 | 2026-10-05 | Careers background | One light gradient from light blue (hero) through white to amber (above the footer); Inside XionTechs no longer a navy band; the hero glow fades into the page | In PR    | 4.1 |
| ENH-061 | 2026-10-05 | Services, eight services | The heading and description stay in place on the left while the eight service cards scroll on the right, two to a row | In PR    | 4.1 |
| ENH-062 | 2026-10-05 | Products audience tabs | Larger tabs with icons and more padding; the bar shows the page colour behind it | In PR    | 4.1 |
| ENH-063 | 2026-10-05 | News | "Catch up with us" with a new description; words rise in, "us" gets an amber marker, story cards unfold one by one as they scroll in (again on each filter) | In PR    | 4.1 |
| ENH-064 | 2026-10-05 | Footer, climber, Vietnam email; docs wording | "About us" in the footer; a bolder hiker with a backpack as the climber; vinni.tran@xiontechs.com for Vietnam; religious place names removed from the log and AI log | In PR    | Batch 1 (all pages) |
| ENH-065 | 2026-10-05 | Services background | Three ways section removed; navy into light blue and white with white and amber glows (top of page reworked again in ENH-069) | In PR    | 4.1 |
| ENH-066 | 2026-10-06 | News | No marker under "us"; the email section is a newsletter sign-up with an in-place thank-you | In PR    | 4.1 |
| ENH-067 | 2026-10-06 | Home, About, Careers backgrounds and spacing | Home: one soft background from Our partners to Latest from XionTechs, How we approach fading into it; About: soft light blue glows; Careers: more space under Find your next challenge | In PR    | 4.1 |
| ENH-069 | 2026-10-06 | Services top of page | Hero and Eight services as rounded panels; four cards across them (24/7, 20+, 25+, 4 industries) with a short note each; See how we work button and the separate facts and Industries sections removed | In PR    | 4.1 |
| ENH-070 | 2026-10-06 | Home background; Services cards, spacing and motion | Home: navy from the hero through Our partners and Why XionTechs (white text), easing into light blue, white and light amber; How we approach has no colour of its own. Services: cards are text and numbers only, a little wider; more room above Eight services; playful entrances | In PR    | 4.1 |
| ENH-071 | 2026-10-06 | Home background and How we approach; Services cards | Home: hero navy into Our partners, an even fall from darkest to light blue with no visible steps; news and contact keep their own colours; more room under How we approach, link over step 05. Services: cards without notes, one footer style | In PR    | 4.1 |
| ENH-072 | 2026-10-06 | Services panel gap and spacing; Home mountain divider and smoother blends | Services: 28px gap between the two panels with the cards centred across it, more room above What can we help you achieve? and below How we work. Home: a small mountain range before Our partners, the blue lightening through Work built with our partners, one seamless layer from What we build to the contact form | In PR    | 4.1 |
| ENH-073 | 2026-10-06 | Home spacing; footer clearance on every page | No mountain illustration; more space above and below Our partners; the last section of every page leaves room above the footer climber | In PR    | Batch 1 (all pages) |
| ENH-074 | 2026-10-06 | Design system page | A design-system.html in the prototype folder, laid out like the AI Tutor design system, showing the real colours, type, spacing, components, illustration and motion from css/site.css | In PR    | Docs |
| ENH-075 | 2026-10-06 | Home background in amber shades | After the navy (hero to Work built with our partners), every blue becomes an amber shade: pale amber, cream and soft amber into the amber contact form | Withdrawn | 4.1 |
| ENH-076 | 2026-10-06 | Services card order; Products hub label; Our partners spacing | Metric cards come in 1, 2, 3, 4; the Products hub reads "Smart School" (ENH-077); tighter Our partners with more room under its title (the Home background trial was reverted) | Withdrawn | 4.1 |
| ENH-077 | 2026-10-06 | Footer climber steps forward on every page |  The footer hiker walks one step up the ridge on each page, from the page before it in the menu, and reaches the summit on Careers (the other parts of this entry were withdrawn) | In PR    | Batch 1 (all pages) |
| ENH-078 | 2026-10-06 | Home case study carousel; Products usability trial page | Case studies as one large centred card with the neighbours peeking, arrow buttons on the side cards and one dot per card, the first card a real client visit; products-2.html tries every product one click away | Withdrawn | 4.1 |
| ENH-079 | 2026-10-06 | Case cards back to their original size, with arrows and dots; client-facing sample card; flat primary buttons | Original case study cards with arrow buttons over the slider edges and the dots below; the first card is a [Sample] partner card with a logo; primary buttons are flat amber with no glow | Withdrawn | Batch 1 (all pages) |
| ENH-080 | 2026-10-06 | Story-style case cards and darker arrows; Products catalogue trial | Case cards with the partner name on a tall picture and the story and link below, navy arrows lower down; products-2.html as a searchable, audience-filtered catalogue like stripe.com/products | Withdrawn | 4.1 |
| ENH-081 | 2026-10-06 | Home: light Why XionTechs and case studies with a soft silk; white case cards | Why XionTechs and Work built with our partners back on light backgrounds with a faint white-and-amber silk instead of glows; white case cards of one width, no numbering, two-sentence stories, the Northbridge Learning logo alone | Withdrawn | 4.1 |
| ENH-082 | 2026-10-06 | Products catalogue trial: one-block search, hover outline, in-page app details | Search and audience filter in one bar with clearer selected state; navy outline on hover; clicking an app opens its details (promise, features checklist, pictures, highlights) in a panel that closes back to all apps; the stray background circle is gone | Withdrawn | 4.1 |
| ENH-083 | 2026-10-06 | Home background back to the PR version; result-led case stories; Products catalogue with an Audience dropdown | Home and Products backgrounds as committed in PR #48; case stories in a two-sentence "[Partner] improves [metric] by [X%] after..." format with no card shadow; products-2 search plus an Audience dropdown, filtered results in a Stripe-style grid, A day at school moved before the apps | Withdrawn | 4.1 |
| ENH-084 | 2026-10-06 | Products trial colours and motion; Home case text; Careers cycle | Deeper amber behind A day at school with flags raised above the dots; an even fall from light blue into the navy updates; white See all news; cards rise in on scroll; plain placeholder case text and a two-sentence sample; the Careers dot glides smoothly and steps light up in soft blue only when it arrives | Withdrawn | 4.1 |
| ENH-085 | 2026-10-06 | Header: Home link (#52) | Home is the first link in the main menu on every page and in the mobile menu, marked current on the home page; the logo still goes home | In PR    | Batch 1 (all pages) |
| ENH-086 | 2026-10-06 | Home hero: what we do, Get in touch, five figures, two doors; Services hero figures removed (#53) | Hero copy says what XionTechs is and does; Get in touch leads to the contact form; five figures; Products for schools and Your software delivery team cards across the hero edge; Services hero without figure cards | In PR    | 4.1 |
| ENH-087 | 2026-10-06 | Feedback blocks 2 to 8 (#55 to #61) | Home: Capabilities, Core Values, the original 4-D process and a four-step How we approach in the new order, no Our partners or What we build; Parent Hub and Staff Hub (P-Hub, S-Hub) with no Learner Hub; a simple four-card Products page on a navy panel; QA inside Development | In PR    | 4.1 |
| ENH-088 | 2026-10-06 | GitHub #62 | Home: the 4-D section is titled How we approach with a short 4-D description; the separate How we approach section is removed | In PR    | 4.1 |
| ENH-089 | 2026-10-06 | GitHub #64 | Products: the four apps become showcase cards (title top left, square expand icon top right, screenshot centred); the expand icon that opens a product detail view on the same page | In PR    | 4.1 |
| ENH-090 | 2026-10-06 | GitHub #66 | Clean-up: styles and scripts no page uses any more are removed; the design system shows the Products showcase card instead of the audience tabs and metric card | In PR    | 4.1 |
| ENH-091 | 2026-10-07 | Amber (as in the AI Tutor prototype) | Presenter bar above the header: Phone, Tablet and Desktop buttons show any page in a phone or tablet frame | In PR    | 4.1 |

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
  - The place tag is the only link in the story. It is reached by keyboard, at least 44px tall, and says it opens in a new tab.
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

## ENH-020: Products apps as stacked cards, grouped by audience

- **Why:** Amber on 2026-10-04: drop the hero button and show the apps by audience (Parents, School, Students), with every app card following the stacking cards spec she supplied (`.working/stacking-cases-effect.md`, after the Featured cases effect on phenomenonstudio.com). Second and third rounds the same day, from her notes and a reference screenshot: no section title, audience colours, a real filter, one sentence per card, device mockups, store and prototype buttons, and features grouped under a label.
- **What changed:**
  - the "Explore products" button in the hero is removed;
  - the bar under the hero (PXP, LXP, SXP, IoT, Updates) becomes three audience pills, each with a colour dot: School (dark navy), Parents (amber), Students (white). They sit in one small floating white capsule lined up with the content's left edge, with no full-width bar, so the background shows around it;
  - the four app sections become one section of seven app cards, with no visible title or description (a hidden heading keeps the page outline for screen readers). Order: School (SXP, IoT Device Management, AI Timetable, AI Grader), Parents (PXP), Students (LXP, AI Tutor). no card carries a "Coming soon" tag. AI Grader is new (a teacher-facing marking web app, Amber 2026-10-04); AI Timetable, AI Grader and AI Tutor use Amber's product copy; AI Tutor has its demo link;
  - each card: on the left a device mockup only (no panel behind it), at the full size of its column: a phone at full height for PXP (the only mobile app) and a full-width browser window for the five web apps; on the right the app badge in its audience colour with the full app name beside it (Staff eXperience Place, IoT Device Management, AI Timetable, AI Grader, Parent eXperience Place, Learner eXperience Place, AI Tutor; no audience text), one short sentence, a "Features" group (a small label over a thin line, then one short line per feature, four per live app) and the buttons;
  - buttons: PXP has two store buttons of equal weight in the familiar black badge style, "Download on the App Store" and "Get it on Google Play" (use Apple's and Google's official badge artwork in production); the six web apps have a primary "View prototype". All open in a new tab. AI Tutor's goes to https://xt-ai-tutor-demo.azurewebsites.net/; the others are placeholders until the store pages and prototype links exist.
- **Card sentences:** PXP "Keeps parents close to every school day, on their phone."; SXP "One workspace where staff, teachers and leaders share the same data."; IoT "Run classroom devices, lighting, climate and access from one screen."; LXP "Lessons, assignments and progress in one calm place to learn."; AI Tutor "Solve new problems on your own. Not just read solutions." with the features "Skill-by-skill diagnosis", "Step-by-step hints once you have tried" and "Mastery only when you can do it alone" (Amber's copy); AI Timetable "A transparent “best fit” timetable, built around what your school values." (features: bring in your school’s data; tell Felix what your school values; a transparent “best fit” timetable, generated for you; talked through every step, alongside the timetable); AI Grader "Mark a whole class against your rubric, with you in charge of every mark." (features: marks typed, handwritten, image and audio work; rubric-aligned marks and feedback for every student; each score linked to evidence in the work; nothing reaches the markbook until you approve).
- **Rules:**
  - Audience pills (jump and highlight, chosen by Amber over filtering so no app is ever hidden): a pill jumps to its audience's first card, landing with the card settled and ready to read. As the reader scrolls, the pill of the audience being read highlights on its own (no count). The hero diagram cards land the same way.
  - A card always moves as one piece: its screenshot no longer holds still on its own while the text scrolls past (the spec's inner sticky image is dropped), so screenshot, text and buttons stay together, including on the last card as it scrolls away.
  - Hovering anywhere on a card lifts the whole card slightly (both columns together); its buttons no longer move on their own. No outline, shadow or box appears around the card: the card shows exactly the same background as the page behind it.
  - Each new card replaces the one before it completely. It settles right under the header with its content padded below the audience bar. The card underneath fades out as the new one approaches and is fully hidden before the new one reaches the content line, so no text from the previous card ever shows. This was checked every 20px of scroll at four screen sizes.
  - Desktop (993px and wider): each card is as tall as its content; cards are spaced a little over a quarter of a screen apart, so a whole card stays readable with nothing covering it for about 200 to 580px of scrolling (1557 × 933) before the next one arrives, without long empty stretches (Amber found full-screen cards too padded and the scrolling sluggish).
  - Desktop (993px and wider): each shown card pins below the audience bar and the next shown card slides over it on a white sheet with a thin top line and two small amber sparkles; the card underneath fades out as it is covered, and it reverses when scrolling up. Each mockup opens with a one-time wipe and straighten.
  - Phones and tablets (under 993px): a plain single column of the same cards, with the mockup reveal only; the pills jump and highlight the same way.
  - Reduced motion: no mockup reveal; the stacking (which follows the scroll rather than playing an animation) stays.
- **Developer notes:** follow the spec's structure: cards are direct children of the stack, each with exactly two columns, the mockup box has a fixed 4:3 ratio, and the pin position is recalculated on resize and font load, and cleared below 993px. The pills are links to each audience's first card inside a labelled navigation; the highlighted one carries `aria-current`. The hero diagram cards still link to each app (`#pxp`, `#lxp`, `#sxp`, `#iot`).
- **After review (2026-10-05):**
  - A card that would not fit on a short screen settles by its bottom edge, so its buttons are never cut off.
  - Covered cards fade out but stay reachable by keyboard and screen reader. Tabbing into one brings it to the front, and a pill or hero link moves focus to the card it opens.
  - Each card's heading is now the app's name. The sentence below it is a paragraph, so a screen reader's heading list names all seven apps.
  - The pill highlight follows the card being read, with nothing highlighted before the cards are reached. On small phones the capsule tightens so all three pills fit, in English and in Vietnamese.
  - A page opened at a card from Home lands with that card settled.
  - Hovering a settled card no longer moves it.
- **Open items:**
  - resolved by ENH-027: resizing across the 993px breakpoint keeps the card being read;
  - Product updates is no longer linked from the bar (the section is still on the page);
  - ENH-017 (left-aligning the LXP and IoT headings) no longer applies, because those sections are now cards;
  - App Store, Google Play and prototype links (all but AI Tutor) are needed before launch.

## ENH-021: Home's app row matches the Products page

- **Why:** Amber on 2026-10-04: once Products dropped "Coming soon" and added AI Grader (ENH-020), Home should match.
- **What changed:** in "What we build." on Home:
  - AI Tutor (Students) loses the "Coming soon" tag; its line becomes "Solve new problems on your own, not just read solutions.";
  - AI Timetable (School leaders) loses the tag; its line becomes "A transparent “best fit” timetable.";
  - a new seventh card, AI Grader (Teachers): "Rubric-based marking, with teachers in charge.";
  - the three AI cards now link to their own card on Products (`#ai-tutor`, `#ai-timetable`, `#ai-grader`) instead of the top of the page.
- **Rules:** the row keeps its back and forward buttons and equal card sizes; seven cards scroll the same way six did.
- **Developer notes:** this closes ENH-013's Coming soon tags; the tag style stays in the stylesheet for future apps.
- **Open items:** none.

## ENH-022: The Products background colour follows the scroll

- **Why:** Amber on 2026-10-04, over four rounds:
  - a background with no visible boundaries between sections (`seamless-three-section-gradient-flow.md`);
  - a colour order (`seamless-six-section-color-order.html`), changing only colours and keeping her circle animations;
  - a colour that "dynamically trails and expands across the content" instead of sitting in bands;
  - a final colour order: white with yellow dots at the start; bright amber through the app cards; from halfway down the LXP card, a gradual move into light blue by AI Tutor and then into dark blue, with no empty space added for it; dark blue from the school day down, matching the footer. Any section added later should extend the gradient on its own.
    She also asked for the School, Parents and Students bar to stay sticky only within its own section.
- **What changed:** one background colour flows down the whole Products page, with no line between sections:
  - 1 Hero: white and platinum, with a soft amber dot. The hero keeps its original drifting circles (amber, navy, white, slow light sheen), which fade out before the hero's lower edge.
  - 2 App cards: amber builds up from platinum behind the School apps and is bright amber on the Parents card and the top half of LXP. From halfway down the LXP card it eases into light blue, so AI Tutor sits on light blue; below AI Tutor, with no extra space added, the light blue deepens into dark blue. Staying in one colour family (light blue to navy) keeps that last step smooth.
  - 3 A day at school: dark blue (deep blue into Prussian blue), with a faint regal-navy glow at the top right (ENH-023).
  - 4 Product updates: Prussian blue deepening to the footer's colour (#0B1730).
  - 5 See it working at your school: the footer's dark navy (#0B1730) throughout.
  - 6 Footer: the same dark navy, so the last sections read as one block.
- **More changes:**
  - Text colours follow the phase: navy on white and amber, white on blue.
  - The audience bar sits inside the apps section and sticks below the header only while the app cards are on screen.
- **Rules:**
  - The phases come from the order of the sections, not from their names: the first is white, the middle ones warm up to bright amber and, from halfway down their second-to-last card, ease into light blue, and the last three are dark blue, deepening into the footer. A new section therefore extends the flow and takes the right text colours with no extra work. A section can be forced into a phase with `data-flow="light|rise|night|blue|deep"`.
  - The colours are part of the page, not an animation, so they also show with reduced motion. The hero circles follow the Pause motion button (ENH-018) and reduced motion.
  - All text keeps at least 4.5:1 contrast.
- **Developer notes:**
  - One page-long gradient is drawn behind the content once, and again only when the layout changes (resize, fonts, sections added). Scrolling just moves it, with no repainting, which keeps scrolling smooth.
  - Each pinned app card shows the slice of that same gradient that sits behind it (its position is updated as it moves), so it matches the page exactly and still hides the card beneath.
  - Without JavaScript the sections keep their own backgrounds.
  - The apps section and the school day clip sideways overflow, so tilted mockups and glows never widen the page.
- **After review (2026-10-05):** the faint glow at the top of the school day was removed, because it drew a one-pixel line over the flowing background. Colour stops are measured from the backdrop's own top. Without JavaScript the apps stay on a light background all the way down.
- **Open items:** none.

## ENH-023: A day at school

- **Why:** Amber supplied a build brief on 2026-10-04 (`day-at-school-section-instructions.md`) for the section after the apps, and asked for the drifting circles behind it to go.
- **What changed:**
  - Heading "A day at school." and the line "Follow one student journey through a typical school day and see how students, parents and school staff stay informed and connected across each step." The heading is large but light (weight 500) and the line is 22px.
  - Five steps:
    - 07:45 Student arrives: the student arrives on campus.
    - 08:00 Attendance recorded: a teacher marks the student's attendance in SXP.
    - 08:01 Parent updated: PXP notifies parents that the student is at school.
    - 09:30 Student learns in LXP: students access learning materials, marks and assignments in LXP.
    - 15:30 Day stays connected: notifications and school information stay connected across the system.
  - Desktop: one horizontal rail with each dot sitting on it. Phones: a vertical rail with the text to the right of each dot.
  - Dark blue background. No decorative dots, circles, cards, extra panels or buttons; the only dots are the timeline's own.
- **Rules:**
  - The timeline plays once when the reader reaches the section. Step 1 lights up, the rail fills to step 2, step 2 lights up, and so on every 1.8 seconds, stopping at step 5. Completed steps stay lit and the rail stays full; it does not loop or restart while the reader carries on down.
  - It resets only when the reader scrolls back above the whole section, and replays from step 1 on re-entry.
  - Dots: dark with a faint white ring by default, filled solid amber once the rail reaches them, and a slightly larger dot with a soft amber halo while current. Amber is used only for this progress. Steps not yet reached are dimmed while it plays.
  - With reduced motion, every step shows as reached at once. Without JavaScript, all steps show in full.
- **After review (2026-10-05):**
  - The timeline follows the Pause motion button: with motion off it shows the finished day at once, and pressing Pause while it plays finishes it straight away.
  - Steps not reached yet are dimmed to 70%, so their text keeps its contrast.
  - The halo shows only on the step being played.
  - On phones it starts once the timeline itself is on screen.
  - The description stays 22px on phones.
- **Developer notes:** the rail is one segment per gap, from each dot to the next, so it never runs past the last dot. The step states are classes (reached, current, passed) set by a timer that starts on scroll, with the timing in one constant. Vietnamese copy is in the prototype.
- **Open items:** none.

## ENH-024: Product updates link on the heading row; a plain email band

- **Why:** Amber on 2026-10-04 asked whether "See all news" should sit with the title and description, and asked for the email band's illustration to go.
- **What changed:**
  - "See all news" moves from below the stories to the right end of the heading row, as on Home (ENH-007).
  - The email band ("See it working at your school.") drops its large ring illustration; it is now plain dark navy, continuous with the footer.
- **Rules:** on small screens the link drops under the description, as on Home.
- **Developer notes:** the ring stays available on other pages; only this band switches it off.
- **Open items:** none.

## ENH-025: Calmer type weights across the site

- **Why:** Amber on 2026-10-04 felt the type was "screaming at the customer" and supplied guidelines (`website-typography-guidelines.md`): hierarchy from size, spacing, colour and layout, not heavy weights. A first pass also switched the headings to Be Vietnam Pro at the guideline sizes. Amber found on 2026-10-05 that this no longer matched the logo, and asked to keep the original fonts and change only the weights.
- **What changed (every page):**
  - The original fonts and sizes stay: Unbounded for headings (it matches the logo), Be Vietnam Pro for text, Lexend Exa for small brand labels.
  - Nothing is bold any more. Every heading, card title, label, link, number and button that was 600 to 700 is now 500. Body and intro copy are 400, navigation is 450 (500 for the current page), and inline bold text is 600.
- **Rules:** do not use 700, 800 or 900 for marketing text. When something needs more emphasis, add space, size, colour or layout first, and weight only last.
- **Developer notes:** weights only; font families, sizes and spacing are unchanged from before this entry. All pages were checked at 1440 and 375px. The job page's body text already overflowed by 89px on phones before this change; it is a separate fix.
- **Open items:** the job page's phone overflow (pre-existing).

## ENH-026: The job page and Home contact section fit phone screens

- **Why:** found while checking ENH-025: on phones the job page scrolled sideways (its text and apply form ran 89px past a 375px screen). Amber asked for it to be fixed on 2026-10-05, together with a 2px sideways scroll on Home at 320px.
- **What changed:** the job description and apply form, and Home's contact section ("Have something you want to build?"), now fit the screen at every width; nothing else changes.
- **Rules:** none new.
- **Developer notes:** the two-column layout becomes one column on phones, but a grid column will not shrink below its widest content, and the form fields (inputs, the CV file picker) kept it at 448px. Home's contact grid had the same cause (its column held 306px in a 288px space at 320px). Grid items in these layouts and form fields may now shrink (min-width 0; fields capped at 100% width; checkboxes and radio buttons keep their size; long words such as email addresses in the contact section wrap). Desktop layouts were compared before and after on all 11 pages and are unchanged. All 11 pages were checked at 320, 360, 375, 414, 768, 1024 and 1440px: none scroll sideways.
- **Open items:** none.

## ENH-027: Resizing keeps the reader on their app card

- **Why:** left open in ENH-020: resizing a browser window across 993px (stacked cards on desktop, one column on phones) kept the scroll position but not the card, because the two layouts have very different lengths. Amber asked for it to be fixed on 2026-10-05.
- **What changed:** after a resize that crosses the breakpoint, the page returns to the card the reader was on, settled on desktop or just under the audience pills on phones, and the right pill stays highlighted. Away from the cards (the hero, the school day, Product updates, the footer), the section the reader was reading stays at the same place on screen.
- **Rules:** a resize that stays on one side of the breakpoint (including a phone keyboard opening) does not move the page.
- **Developer notes:** the card being read is noted only while scrolling and ignored during a resize (resize handlers would otherwise overwrite it with the half-changed layout); a short pause after the last resize event triggers the return. Away from the cards, the section crossing a line 30% down the screen and its offset are kept instead. The restore always finishes its clean-up, even in browsers that reject an instant scroll. Checked from several cards and from the hero, school day, Product updates and footer, desktop to phone and back, and with a phone-keyboard resize.
- **Open items:** none.

## ENH-028: Pill and resize follow-ups from the ENH-027 audit

- **Why:** the ENH-027 acceptance audit raised three edge cases on 2026-10-05; Amber asked for them to be fixed.
- **What changed:**
  - Widening or rotating a phone (for example 390 to 700px, or portrait to landscape) keeps the reader exactly where they were in their app card (the same spot on screen, even halfway down a long card). Changes that only alter the height, such as a phone keyboard opening, still do not move the page.
  - The School, Parents or Students pill clears once the last app card has scrolled away, so nothing stays highlighted in "A day at school" or below it (as before, nothing is highlighted in the hero).
  - The pill and the resize memory now share one rule for "the card being read": the front-most card whose top has passed the middle of the screen and that is still on screen. So a resize during a slide lands on the card the pill shows.
- **Rules:** a desktop-only resize still does not move the page.
- **Developer notes:** widths are measured from the page layout, not the visible area, so pinch-zoom never counts as a width change. Checked by scanning the whole stack every 40px at 1440 and 375px, comparing the pill to the card with the most visible, unfaded area. The few differences are hand-over moments where two cards share the screen about equally, or the last card leaving with under 30% of it on screen.
- **Open items:** none.

## ENH-029: The pill clears when "A day at school" reaches the middle

- **Why:** the ENH-028 audit noted that the Students pill stayed lit for about the last 100px after AI Tutor, while "A day at school" was already past the middle of the screen. Amber asked on 2026-10-05 for the pill to clear at that point.
- **What changed:** the audience pill clears as soon as the section after the app cards reaches the middle of the screen, on desktop and phones.
- **Rules:** a resize from that point keeps the reader's place in the section rather than returning to the last card, since the same rule decides which card is being read. Away from the cards, the place is kept as the section at mid-screen and how far down the screen it sits (for example 45%), so it holds on any window size; on desktop this also applies to resizes that only change the height, because the card stack above changes length with the window. A phone keyboard opening still never moves the page.
- **Developer notes:** the check uses the bottom of the cards' own section (whatever section follows it), so it keeps working if sections are reordered. The review found that the saved place used a different line (30%) from the pill (50%), and that desktop resizes let the school-day section drift; both fixed and re-checked at five resize pairs.
- **Open items:** none.

## ENH-030: The mountain story opens the About page

- **Why:** Amber asked on 2026-10-05 to bring the mountain story from `xiontechs-mountain-story.html` into the About page, without the thin frame lines around and between its parts. She then asked for it to be the page's hero, told on the left while the picture changes beside it (like the night-to-dawn reference), with the XionTech X mark at the summit. After seeing three short steps she chose two fuller ones, with the title kept at the top and highlighted, and no breadcrumb. Finally she asked for wording that does not mention God, faith or spiritual ideas while still letting readers look up the origin themselves, with the place referenced on the picture, and the title above both columns.
- **What changed:** the navy hero ("Tech made simple. Solutions made powerful." and its description), the five key-fact figures, "Two strengths, one team." and the breadcrumb are removed. The page now opens with the story, held in place for about one extra screen of scrolling:
  - Top, centred above both columns: the title "Inspired by a mountain. United by purpose.", with "purpose" in the site's amber highlight. It stays while the chapters change.
  - Left: chapter 01 The inspiration (the name is inspired by a mountain, a place where people belong together and look towards a brighter future) with a Scroll cue, which gives way to chapter 02 The purpose (the pioneers who founded newXion), closing with "Our inspiration is a mountain. Our purpose is people." and "Vision · Community · Technology".
  - Right: the mountain, grey at first. When chapter 02 takes over, the colour climbs from the foot to the summit with an amber dot following the trail, and the X mark on the summit turns from grey to full colour. Two small dots under the picture show the chapter.
  - Place tags on the picture, like a survey map, each with a short leader line and an amber point: the mountain’s place name and coordinates beside the summit, a link that opens the reference page in a new tab so readers can look the place up; and "newXion, Founded in America" at the village on the slope, which appears with chapter 02.
- **Rules:**
  - Chapter 02 takes over 40% of the way through the held scroll; scrolling back up returns to chapter 01 and climbs back down. There is no timer or autoplay.
  - Phones and portrait tablets stack the title, the picture and the chapter text, all held in place together. Short screens cannot fit that (phones under about 740px tall, and landscape phones of any width), so there nothing is held: the picture stays in view while both chapters scroll past it, and chapter 02 takes over once its heading is 60% of the way down the screen.
  - Both chapters are ordinary page text, read in order by screen readers; the picture is decorative.
  - With reduced motion the picture and text change without movement, and the dot is hidden. Without JavaScript nothing is held, both chapters show one after the other, and the whole mountain, X mark included, is in colour.
  - No frame lines and no eyebrow label. The picture's edges fade into the page so no box shows, and the colour's leading edge is soft.
- **Content:** no mention of God, faith or spiritual ideas; the origin is given as a place, with its coordinates, that readers can look up. Chapter 02 is the newXion story from the reference. All copy has Vietnamese.
- **After review (2026-10-05):**
  - Landscape phones wider than 800px used to get the held layout, which did not fit; they now scroll normally with the picture beside the text.
  - Short desktop windows tighten slightly so the held story fits in Vietnamese too.
  - The 40% switch point is measured from where the story starts to stick under the header (it was landing at about 47%).
  - A page opened or reloaded part-way down shows the right chapter straight away instead of replaying the climb.
  - The place tag underlines on keyboard focus as well as hover; the newXion tag clears the edge on 320px phones; the trail glow uses the brand amber.
- **Developer notes:** the picture is `assets/mountain-story.webp` (1536×1024, 177 KB), taken from the source file, which embedded the same image twice; it is used twice here too (grey base and colour layer). The X mark is `assets/x-mark.webp` (160×86, 8 KB), cut from `logo-square.png` with its white background removed.
- **Open items:** none.

## ENH-031: The FAQ's last slot invites the rest

- **Why:** Amber asked on 2026-10-05 to sort out the FAQ's last row, which held a single question because there are nine. A tenth question would need real content we do not have, so the slot is put to use instead.
- **What changed:** after the ninth question, the empty right-hand slot holds "Still have a question? Ask us directly", styled like a question row with an amber underline and an arrow, linking to the contact form on Home.
- **Rules:** it sits in the same row as the ninth question on desktop and is the last row on phones. It is a link (at least 44px tall), not an expandable question.
- **Developer notes:** `.faq-ask` in the FAQ grid. Vietnamese: "Vẫn còn câu hỏi? Hỏi trực tiếp chúng tôi".
- **Open items:** none.

## ENH-032: The About story uses very large screens

- **Why:** the ENH-030 review found that on very large screens (2560×1440) about 700px stayed empty below the held story while it was on screen. Amber asked on 2026-10-05 to fix it.
- **What changed:** on screens at least 1500px wide and 1050px tall the title, chapter text and picture grow, with a little more space above the title. The text stays lined up with the header; only the picture's column reaches further right. Smaller screens are unchanged.
- **Rules:** measured empty space below the story: 2560×1440 about 460px (was about 700px), 1920×1080 about 190px, 1440×900 unchanged at 171px. It never removes the 64px before "Our core values.".
- **Developer notes:** one media query at the end of the ENH-030 block. Centring the story vertically was not used, because it brings back the gap below the story that Amber asked to remove.
- **Open items:** none.

## ENH-033: Services gets a white-and-amber background flow

- **Why:** Amber asked on 2026-10-05 to bring the rest of the site up to the new look, one page at a time, starting with Services. Products (ENH-022) and About (ENH-030) use one flowing background instead of separate coloured bands. After a first version that ended in navy like Products, she asked for Services to use only white and amber, with no blue.
- **What changed:**
  - One background flows down the page: white with a soft amber glow at the top, warming through cream to bright amber at "Three ways to work with us.", easing back through softer amber behind "How we work." and "Industries we serve.", and carrying on behind the email section (see ENH-036). Nothing on the page is blue apart from the footer.
  - The hero is light (navy text), matching Products and About, with the same headline, buttons and office clocks; its glow and silk lines are amber only, so there is no blue.
  - "How we work." sits on amber, so its step list (numbers, names, line and circles) is navy instead of white; the detail panel keeps its own dark card.
  - On amber, secondary text is a shade darker (#3F4F6C) so it keeps AA contrast on full amber (5:1; the usual grey is 4.2:1 there). This applies to every flowing page (the amber stretch of Products, and News and Careers, where it changes little).
- **Rules:** content, order and links are unchanged. Text colours follow the background. Without JavaScript each section keeps its own colour. Reduced motion is unaffected (the background does not move on its own).
- **Developer notes:** the shared flow script now takes a palette: `<div class="flow-bg" data-palette="warm">` (Services) or `"cool"` (News, ENH-034); no palette keeps the Products flow. With a palette, the first section is light and the colours are spread across the middle sections by height, so added sections extend the flow on their own.
- **Open items:** none.

## ENH-034: News gets a white-and-blue background flow

- **Why:** Amber asked on 2026-10-05 for News to use only white and blue shades, blended together, as the next page brought up to the new look. After the first version she asked for a white page with light blue shading throughout, with no difference between the header and the first section.
- **What changed:**
  - The page is white with light blue shading drifting through it, header included: the header no longer has its own glow, so it matches the stories below it. Faint blue glows mix in down the page so it never forms bands; the light blue is a touch deeper towards the bottom, where it meets the footer.
  - The silk lines in the header are blue only (they had amber in them).
  - The email section at the bottom sits on the same light background (it was a bright amber block, then a dark band); see ENH-036.
  - Bug fix: the number count-up also picked up the story filter group, so after scrolling the All / Product / Company / Schools / Team buttons were replaced by "NaN" (only with motion on). The count-up now only runs on real numbers.
- **Rules:** content, filters and story cards are unchanged; the amber highlight under "up to", the amber app tags and the amber "Book a demo" button stay as brand accents. Without JavaScript each section keeps its own colour.
- **Developer notes:** `<div class="flow-bg" data-palette="cool">`; the strands canvas has a new `data-tone="cool"`. The count-up fix is in the shared script, so it protects any page.
- **Open items:** none.

## ENH-035: Careers gets a pastel amber background flow

- **Why:** Amber asked on 2026-10-05 for Careers, the next page brought up to the new look, to use pastel colours: light shades of amber.
- **What changed:**
  - One background flows down the page in soft, light amber shades: white at the top, warming gently to a pale amber around "Why you'll grow here." and "Open roles.", and easing back to a creamy white by "Life at XionTechs.". It never reaches full amber.
  - The hero is light with a soft amber glow and the light silk lines, in place of the bright amber hero; the headline, highlight and buttons are unchanged.
- **Rules:** content, order and links are unchanged; text stays navy throughout. Without JavaScript each section keeps its own colour.
- **Developer notes:** `<div class="flow-bg" data-palette="pastel">`, alongside the warm (Services) and cool (News) palettes.
- **Open items:** none.

## ENH-036: Email sections blend into the page

- **Why:** Amber said on 2026-10-05 that the email section on every page looked hard-coded (a box of fixed colour) instead of blending in with the page's colours.
- **What changed:**
  - **Services:** the email section has no box of its own; the white-and-amber background carries on behind it, softening towards the bottom.
  - **News:** the email section sits on the page's white and light blue (no dark band).
  - **About:** the page has no flowing background, so the email section carries on from the navy of "Two offices, serving the world." above it (that section now fades to the same navy at its bottom) and darkens into the footer; white text and the amber "Book a demo" button.
  - **Home:** the contact section picks up the light grey of the news row above it and warms into amber towards the footer, instead of a fixed amber box (Amber asked for this when approving).
  - The decorative rings in the corner of the email sections are gone.
- **Rules:** form, wording and links are unchanged. Products already blends (its email section continues the dark of the section above, into the footer, as asked in ENH-024), so it is unchanged.
- **After review (2026-10-05), across ENH-031 to ENH-036:**
  - The moving silk lines on light heroes (Services, Careers, News, Privacy, story pages) fade out behind the headline and description, so the text keeps AA contrast (it dipped to 1–3:1 where a line crossed it; News already did before this change). Measured 5.2 to 7.3:1 from 375px to 1920px.
  - On Services the selected step in How we work has a navy dot and a navy edge, since the amber dot and white tile barely showed on amber; the step panel's keyboard ring is amber on its dark card.
  - Services' hero glow and silk lines are amber only (they still had blue in them).
  - About's fade and email section start from the offices section's own dark navy, so there is no lighter stripe between them.
  - On very large screens the About text lines up with the header again (the first version widened the whole layout).
  - The FAQ link's arrow nudges on keyboard focus too; an unused branch of the flow script was removed.
- **Developer notes:** `.capture-plain` drops the rings; on flowing pages every section after the hero now shares the page gradient. About uses `.capture-dark` and `.fade-to-navy` on the offices section; Home's contact uses a vertical gradient on `.sec.contact`.
- **Open items:** none.

## ENH-037: News by audience, and an editorial story page

- **Why:** Amber asked on 2026-10-05 to update the News section and the story page to follow two design files, `xiontech-news-audience-filter-v7.html` and `xiontech-story-detail-clean-v4.html`.
- **What changed (News):**
  - The header is "What we’re building, learning and sharing" with a short line beside it, in place of "What we've been up to." and the breadcrumb. The file's "News & stories" label above the heading is left out (no labels above headings).
  - Filters are by audience: All, Schools, Students, Parents, Company (they were Product, Company, Schools, Team).
  - Each story is a full-photo card: the audience label and date at the top, the title at the bottom over a dark fade, in a two-column grid with the newest story featured tall on the left. On hover or keyboard focus the card lifts, the photo zooms and darkens, the title rises and "Read story →" appears; on touch screens "Read story" always shows. Clicking fades the card out as the story opens.
  - Six sample stories from the file replace the eight old ones; the "[Placeholder] Sample stories" note stays.
- **What changed (story page):** a "Back to News" link, the audience label and date, a large headline, a short summary, a wide rounded photo, then the article: paragraphs, subheadings, an amber-edged pull quote and an inline photo. The header (label, date, headline, summary, photo) follows the story opened; the article text is the file's shared sample for every story, marked "[Placeholder]".
- **Rules:**
  - The whole card is one link. New-tab and modified clicks open normally, and with reduced motion the card opens without the fade or the zoom.
  - Card labels and dates are at least 11.5px. The date sits on its own dark pill (the file had white text straight on the photo, which fell to about 1.2:1 on bright photos), and the dark fade behind the title starts a little higher than in the file, deeper still on touch screens where the title sits higher; measured at 7.7:1 or better for dates and 5:1 or better for titles at 1440, 768 and 375.
  - All copy, including the six stories and the article, has Vietnamese; dates show as dd/mm/yyyy in Vietnamese.
  - Home's and Products' news rows use the same stories (Products shows the stories about an app: AI Timetable, AI Tutor, LXP) and now show each story's photo; their cards keep their compact style and link to the matching story.
- **Content:** the stories and article are the sample copy from Amber's files. The file's photo for the featured story no longer exists on Unsplash (it returns 404), so it was replaced with another Unsplash classroom photo; photos load from Unsplash.
- **After review (2026-10-05):** each card link is read as its title, then date and audience; Home's and Products' photos are plain images (the photo-frame tool was turning them back into "click to add" frames); a photo that fails to load is hidden instead of showing a broken-image icon; while a filter is on, the first card is not featured, so the grid stays even; a card opens only once on a double click; "Read story" uses one Vietnamese wording ("Đọc tiếp"); the story page's browser tab title follows the language and its sharing title names the story.
- **Sizes (after Amber's review, 2026-10-05):** photos were too large, so story cards are shorter (340px, the featured one 520px; 380px on tablets and 340px on phones) and the story page's main photo is 440px tall (was 620px) with a 320px inline photo (was 420px). The News header is tighter (56px above the title instead of 88px) and there is more room around the filters (48px above, 36px below).
- **Developer notes:** the stories live in the shared `NEWS` list in `js/site.js` (audience, app, date, title, summary, photo, English and Vietnamese); News renders `.scard` cards, Home and Products render `.ncard`. The story page reads `?id=` and falls back to the first story.
- **Open items:** real stories, photos and article text before launch.

## ENH-038: One page-title style on every page

- **Why:** Amber asked on 2026-10-05 to check that the typography guideline (`website-typography-guidelines.md`, applied in ENH-025 as weights only, keeping the original fonts and sizes) is followed on every page and section.
- **What was checked:** every visible piece of text on all 11 pages (about 1,100 elements): font, weight, size, line height and letter spacing.
- **Result:** no text is bold (nothing at 700 or above), body copy is regular, text is at least 11.5px, and headings use the display font, with three exceptions, fixed here:
  - The Products hero title ("Built apart. Better together.") was still in the body font at 86px, a leftover of the heading-font switch Amber turned down in ENH-025. It now uses the display font.
  - Page titles came in five sizes (48 to 86px at 1440px wide). Products, About, News and the story page now use the standard page-title style shared with Services, Careers and the rest: 57.6px at 1440px, weight 500, line height 1.08. Home's hero title keeps its own original style.
- **Left as is:** the small uppercase label "Experience you can count on" over Home's stats row (it labels the numbers, not a section heading, and matches the guideline's small-label style); a few small UI labels at weight 500 (step tags, card labels), which the guideline allows.
- **Rules:** the held About story still fits on screen at 1440×900, 1366×640, 375×812 and 360×760 with the larger title.
- **Later:** ENH-039 lightened the display weight to 300 and ENH-040 set page titles to line height 1.04 and -0.04em; the size and font set here stay.
- **Open items:** none.

## ENH-039: Headings at a visually moderate weight

- **Why:** Amber said on 2026-10-05 that page and section headings still looked bold, against the typography guideline ("large size + moderate weight + generous spacing").
- **Finding:** the headings were already set to 500, the guideline's number, but the display font (Unbounded) is a wide, heavy face whose 500 reads as bold. Its 400 still reads as semibold; 300 gives the moderate look the guideline describes. The pages also only loaded Unbounded at 500, 600 and 700, so nothing lighter was available.
- **What changed:**
  - Every page now loads Unbounded at 300 and 400 too.
  - Page and section headings (every h1 and h2 in the display font) use 300.
  - Card titles, big numbers, the pull quote and other smaller display text use 400, keeping a little more emphasis than the large headings, as the guideline allows for card titles.
  - Body text, labels, buttons and navigation are unchanged (Be Vietnam Pro and Lexend Exa at their ENH-025 weights).
- **Rules:** the font, sizes, spacing and colours are unchanged; only the weight of the display font changes. All weights are loaded (checked on every page), so nothing falls back to a faked weight.
- **Developer notes:** every rule that sets `font-family:var(--f-display)` now sets its weight (300 for h1/h2, 400 otherwise); the ENH-025 rule `h1,h2,h3,h4{font-weight:500}` is now `h1,h2{300}` and `h3,h4{500}` (body-font h3s keep 500).
- **Open items:** none.

## ENH-040: Heading rhythm, smaller News titles, Life at XionTechs carousel

- **Why:** Amber asked on 2026-10-05 to make the News titles smaller, to check whether section headings follow the typography guideline, and to turn "Life at XionTechs" on Careers into a horizontal carousel.
- **Typography check (measured on every page at 1440px):**
  - Weight: follows the guideline visually since ENH-039 (Unbounded 300 for headings, because its 500 reads as bold).
  - Line height and letter spacing did not: page titles were 1.08 and -0.03em (guideline 0.98–1.04 and -0.04em), section headings 1.12 and -0.025em (guideline 1.02–1.08 and -0.035em), and several card titles were at 1.6 (guideline 1.25–1.35).
  - "A day at school." on Products was still in the body font at 83px and weight 500, a leftover of the rejected font switch.
  - Sizes stay the original ones Amber chose in ENH-025 (the guideline's sizes are larger); buttons (16px) and navigation (15.2px) also keep their original sizes.
- **What changed:**
  - All 11 page titles: line height 1.04, letter spacing -0.04em. All section headings: 1.06 and -0.035em. Card titles (the small card headings): line height 1.3, and -0.02em on the display-font ones; the large statement titles in Home's Why XionTechs cards keep their tighter heading spacing. Small form and job-page headings use 400 rather than 300. Vietnamese keeps a little more line height (1.14 titles, 1.16 headings) for the stacked accents.
  - "A day at school." uses the display font at the standard section-heading style.
  - News story card titles are smaller, at card-title scale: about 21.6px (28px for the featured story) at 1.28 line height and -0.02em (they were 29 and 36px).
  - Careers: "Life at XionTechs" is a horizontal carousel of six photo frames (later replaced by the event reel in ENH-041) (team, office, event, workshop, celebration, community; all "click to add" placeholders, three were there before) using the same slider as Home's case studies: drag with a mouse, swipe on touch, arrow keys when focused, and page dots below. It shows four frames at a time on desktop, two on tablets and one on phones. The photo frames stay reachable by keyboard.
- **Developer notes:** the slider script now runs for every `.case-slider` (it handled one); each finds the dots in its own section, and the dot labels come from `data-dot-en`/`data-dot-vi`. The six page-title rules carry the new values directly; section headings and card titles use one small block.
- **Open items:** real Life at XionTechs photos.

## ENH-041: Life at XionTechs as a horizontal event reel

- **Why:** Amber asked on 2026-10-05 for the Life at XionTechs photos to move on their own, then for them to follow the "Horizontal event reel" option in `xiontech-life-carousel-options.html`.
- **What changed:** the ENH-040 carousel (six empty photo frames with dots) is replaced by a reel of real team photos drifting slowly to the left in a continuous loop, running edge to edge of the screen and fading out at both sides. After Amber's review it has no background stage, every photo is the same size (380×253px, 280×187px on phones) and there are no back or forward buttons; a small pause button sits under the right end. Each photo's label (for example "Lunar New Year", "Year-end town hall") appears on hover or keyboard focus, and always shows on touch screens.
- **Content:** the photos are the six newXion newsroom photos (the agentic AI workshop, Lunar New Year, the XionTech AI workshop, the year-end town hall and the two client visits) instead of the file's stock photos, and each one links to its news story. The intro line now reads "Moments from our team, from workshops to Tết."
- **Rules (moving content must be stoppable, WCAG 2.2.2):**
  - The reel holds while the pointer is over it or keyboard focus is inside it, and only moves while it is on screen and the tab is visible.
  - The pause button stops it until pressed again ("Pause the photos" / "Play the photos", Vietnamese "Tạm dừng ảnh" / "Tiếp tục ảnh").
  - A photo reached with the Tab key slides fully into view; the repeated copy that makes the loop seamless is hidden from screen readers and the keyboard.
  - With reduced motion the reel never moves on its own, the pause button is hidden, and the row can be scrolled sideways instead.
- **Developer notes:** the reel is a JavaScript-driven loop (one frame per screen refresh, about 34px a second), so it can hold for hover and focus and bring a focused photo into view. The Home case-study slider is unchanged; the slider autoplay added earlier for Careers is removed.
- **Open items:** more team photos as they come in (add them to the reel's list).

## ENH-042: Real newsroom stories, and the story cards on Home and Products

- **Why:** Amber asked on 2026-10-05 to use the newXion newsroom content (`newxion-newsroom-content.html`, captured from newxion.com/newsroom) for the news, with mock data where needed, and to make the news sections on other pages follow the News page format.
- **What changed:**
  - The six newsroom posts are the real stories, with their own photos (copied to `assets/news/`), dates and full text: Work Smart, Play Sharp (31 Jul 2026), AI in Action (08 Apr 2026), Lunar New Year 2026 (23 Feb 2026), Year-End Town Hall (19 Dec 2025), Showcasing AI Robotics (10 Oct 2025) and Advancing Together (08 Apr 2025). The culture posts are labelled Company; the two client visits about education are labelled Schools.
  - The newsroom has nothing for Students or Parents, so three mock stories fill those filters (AI Tutor, PXP, LXP), each titled with "[Placeholder]" and shown with a sample note on its story page. The note on News now reads "Stories from the newXion newsroom; those marked [Placeholder] are samples."
  - The story page shows each story's own paragraphs (English and Vietnamese), and the photo carries its description as alternative text, instead of one shared sample article.
  - Home's "Latest from XionTechs" and Products' "Product updates" use the News page's full-photo story cards, three in a row (two on tablets, one per row on phones). Home shows the three newest stories; Products shows the three stories about an app.
- **Rules:** nine stories in all, newest first; the featured card is the newest real story. All titles, summaries and paragraphs have Vietnamese translations (newsroom text translated for the prototype; review before launch).
- **Content notes (from the capture):** two posts name different governing bodies ("Board of Management" and "Board of Directors"), clients are never named, and the newsroom has no per-post pages, so the story pages are new.
- **Open items:** real Students and Parents stories (the mock ones are dated January to March 2025, after the real stories in the list); confirm dates and the governing-body name with the client.

## ENH-043: Mountain touches: footer ridgeline, 404 trail, Summit reached

- **Why:** the company name comes from a mountain; Amber asked on 2026-10-05 for the footer ridgeline, the 404 trail and the "summit reached" idea from the suggestions.
- **What changed:**
  - **Every page:** the footer's top edge is a mountain ridgeline in the footer's navy, with a thin amber line along the ridge and the XionTech X standing on the highest peak. The last section on each page has a little more room at the bottom so the ridge never covers content.
  - **404:** "You’ve wandered off the trail." with a small trail map beside it: a dotted amber trail walks from a pulsing "You are here" dot up to the summit, where the X marks Home. The same links back (Home, Products, Services, News) stay; the moving hero lines are removed on this page so the map reads clearly.
  - **Forms (Home contact, Demo, job application):** when a form is sent, a small mountain appears and a flag rises on its summit, and the thank-you heading starts with "Summit reached." (for example "Summit reached. Thank you!").
- **Rules:** all of it is decorative and hidden from screen readers (the 404 labels are part of the picture); with reduced motion the trail does not walk, the dot does not pulse and the flag appears without rising. The ridge is 60px tall (40px on phones). Labels have Vietnamese.
- **Open items:** the other ideas (back-to-top climb, Services and Products trail treatments, Careers expedition, News empty state, hidden summit egg) wait for Amber's pick.

## ENH-044: News-style titles, fuller articles, and a climber on the ridge

- **Why:** Amber asked on 2026-10-05 for the company news titles to read like the app stories, for fuller articles built from the existing newsroom content so they read as real news, for a story to open straight away (the card turned white first), and for a taller footer peak with a climber moving towards it on every page.
- **What changed (news):**
  - The six newsroom titles are rewritten in the same explanatory style as the app stories, for example "Work Smart, Play Sharp" becomes "How our team is putting agentic AI to work every day", and "Lunar New Year 2026 – Year of the Horse!" becomes "Welcoming the Year of the Horse with our Vietnam team". Each has a new one-line summary.
  - Each article is longer (three to six paragraphs with one or two subheadings). Factual statements come only from the newsroom posts (dates, places, events, the names used there); the added sentences are framing and context in the company's voice (for example why learning matters, what a kickoff is for), with no new names, numbers, quotes or events. The story page shows the subheadings. English and Vietnamese.
  - Clicking a story opens it straight away. The fade-out from the design file is removed, because it showed as a white flash before the new page.
- **What changed (ridge):**
  - The footer ridge is taller (120px, 72px on phones) with a much higher, sharper peak, so the X stands out.
  - A small climber (navy, with an amber backpack) walks along the ridge from the left as the footer comes into view, and reaches the peak, next to the X, at the very end of the page; the X lifts a little when it arrives. It follows the scroll, so it moves back down when the reader scrolls up.
  - The last section on each page leaves 160px (110px on phones) at the bottom, so the taller ridge never covers content; checked on all 11 pages.
- **Rules:** decorative and hidden from screen readers; with reduced motion the X does not lift (the climber still follows the scroll, which the reader controls).
- **Content note:** the expanded articles are drafted copy based on the newsroom facts; review them with the client before launch.
- **Later:** ENH-045 replaces the scroll-driven climb with a fixed spot per page and removes the X from the peak.
- **Open items:** none.

## ENH-045: A bento News grid, and a climber that moves between pages

- **Why:** Amber asked on 2026-10-05 for News stories to come in different block shapes instead of one size, and for the footer climber to stand at one spot per page, set by the page's place in the navigation, moving up and down the hill between pages, and to replace the X on the peak.
- **What changed (News):** the story grid is a bento layout on desktop: four columns with the featured story large (two by two), then a tall card, square cards and wide cards in a repeating mix. The shapes follow the visible order, so a filtered list keeps the same mix. Tablets use two columns (featured large, tall and wide cards kept); phones show one card per row at one size. Title sizes follow the card size.
- **What changed (climber):**
  - Each page has its own spot on the ridge, in navigation order from the foot to the summit: Home 6% of the way up, Products 24%, Services 42%, News 60%, About 80%, Careers at the summit. The story page uses News's spot, the job page Careers's, and Demo, Privacy and 404 Home's.
  - Arriving from another page, the climber walks from that page's spot to this one once the ridge comes into view, stepping as it goes and facing downhill when the new page is lower. Staying on a page, it stays put (it no longer follows the scroll).
  - The X mark is removed from the peak; the climber is the only figure on the ridge, a little larger than before.
- **Rules:** decorative and hidden from screen readers; with reduced motion it simply stands at the page's spot. The previous spot is remembered for the browser tab only (session storage). Pages outside the navigation (Privacy, Demo, 404) keep the climber where it was.
- **After the last review check (2026-10-05, after the push):** on desktop the titles on the shorter News cards (square and wide) started too high on the photo, where the dark fade was still light, and fell to about 2–3:1. Those cards now have a fade that starts higher and their titles stop at three lines; every News title measures 7:1 or better at 1440 and 900. The reel photos no longer repeat their description before the label for screen readers, and the 404 map's Home label sits clear of the ridge line. These fixes go out with the next push.
- **After review (2026-10-05):** the reel loops seamlessly (its loop length now includes the last gap, which caused a small jump), the first photo stays in view when reached by keyboard, the repeated photos switch language too, the reel stops working when it is paused, held or off screen, and with reduced motion only the six photos are shown. The News grid picks shapes by how many stories are showing (one full-width story, two side by side, three as one large and two tall), so filters never leave holes. The three mock stories are dated before the real ones, so Home's row and the featured story are real newsroom stories. Three article sentences that went beyond the newsroom posts were corrected (an "evening", a link between two unrelated posts, and what the AI workshop covered). The Demo form moves focus to its thank-you like the other forms, and the 404 map labels are larger on phones and clear of each other.
- **Open items:** none.

## ENH-046: About gains "Our mission", and the mountain shows in full

- **Why:** Amber compared a second About version built from `xiontechs-about-page-recommendation.md` and chose to keep the current page (version A) as the base, with changes: an "Our mission" section above the mountain like the "What IBM does" section on IBM's About page, the newXion label on top of the X at the peak, the place name and coordinates off the mountain itself, and the whole mountain visible (it was cut off at both sides) with a light amber glow around its outline. The version B page is removed.
- **What changed:**
  - **Our mission.** (new first section, the page title; later restyled as a centred intro in ENH-049): the large title on the left and, on the right, the mission in large light type ("We bring people, ideas and technology together to build exceptional IT systems and shape a brighter future for all."), one line on what the company does and where from, and links to Products and Services. The mission sentence is the one already used on the site.
  - **The mountain story** follows as the second section, unchanged in content (two chapters), with "Inspired by a mountain. United by purpose." now a section heading.
  - The picture shows the whole mountain edge to edge (only the outermost few percent fade into the page), with a soft amber glow traced from the mountain's own lines.
  - "newXion, Founded in America" sits on top of the X at the summit with a short line down to it (on phones it sits to the left of the X, where there is room). It still appears with chapter 02.
  - The place name and coordinates are a caption under the picture, still linking to the reference page.
- **Rules:** the held story still fits on screen at 1440×900, 1366×640, 375×812 and 375×667; all new copy has Vietnamese; the FAQ, core values, offices and email band stay on About.
- **Developer notes:** the glow is `assets/mountain-glow.webp` (768×512, 29 KB), an amber, blurred trace of the picture's lines on a transparent background; the second chapter's label timing uses `data-late` on the section.
- **Open items:** none.

## ENH-047: Two thin company posts removed from News

- **Why:** Amber asked on 2026-10-05 to remove the two company updates with the least information and the least engaging content.
- **What changed:** "Inside the XionTech AI team’s workshop on staying ahead with AI" (AI in Action) and "Looking back on 2025 and ahead to 2026 at our year-end town hall" are removed. In the newsroom they were the shortest posts (two to three short sentences, no specifics). Their photos also leave the Life at XionTechs reel, which now shows four photos (with two repeat copies so the loop still fills wide screens).
- **Rules:** News now has seven stories (four real, three marked mock); the bento grid stays full; Home's row shows the three newest real stories.
- **Open items:** none.

## ENH-048: Services in white, with what we can help you achieve

- **Why:** Amber asked on 2026-10-05 for Services to be a white page with only some light pastel amber in places (like a reference screenshot with soft colour washes), for a "What can we help you achieve?" section before the steps, and for the facts strip to follow her screenshot.
- **What changed:**
  - The background is white throughout, with four large, very pale amber washes drifting in from alternate sides down the page (the ENH-033 white-to-amber gradient is replaced). The hero keeps its soft amber glow.
  - **What can we help you achieve?** (new, before How we work.): four numbered outcome cards in two columns: Build a new digital product, Extend your team, Modernise an existing platform, Apply AI where it creates value, each with one line.
  - The facts strip keeps three facts with a line above each: 24/7 global coverage across time zones, 20+ technology stacks, 25+ years of software leadership experience (the service count and office count are dropped). The screenshot's "Service proof" label and heading are not used (no labels above headings, and the strip has no heading today).
- **Rules:** content elsewhere on the page is unchanged; text colours stay navy on the light background; all new copy has Vietnamese; one card per row on phones.
- **Developer notes:** a new `soft` palette for the shared background (`data-palette="soft"`).
- **Open items:** none.

## ENH-049: A "who we are" intro, a clear mountain, Products tabs, and Careers' roles title

- **Why:** Amber asked on 2026-10-05 for the About intro to introduce the company the way Salesforce's About page does (a centred statement, with a mountain illustration behind it if useful); for the mountain's location caption to sit above the picture; for the mountain picture to be transparent with no background and not cut off at the sides; for the Products audience pill to become underlined tabs like a reference screenshot, with "What we build." above it; and for Careers' "Open roles." to read "Find your next challenge."
- **What changed:**
  - **About intro** (replaces the two-column "Our mission." layout from ENH-046): a centred "We’re XionTechs, technology built with ownership." (amber highlight on "ownership"), the mission sentence and where the company builds from in one paragraph, and links to Products and Services, over soft pastel-amber mountain shapes rising from both sides and curving into the next section.
  - **Mountain picture:** a transparent version (`assets/mountain-clear.webp`, 1200×800) replaces the paper-backed one, so no box or tint shows. The source drawing runs off both edges at the mountain's base, so the base now fades out over the outer 9% at each side instead of stopping in a hard line. The amber glow from ENH-046 stays.
  - **The place-name caption** moves above the picture (removed in ENH-050).
  - **Products:** a visible "What we build." heading above the apps, and the audience switcher becomes three centred text tabs (School, Parents, Students, each with its colour dot) on a full-width line, with an amber underline under the active one. It still sticks under the header while the cards are on screen and follows the card being read.
  - **Careers:** the roles heading reads "Find your next challenge."
- **Rules:** all new copy has Vietnamese; the held mountain story still fits on screen at 1440×900 and 375×812; tabs are 60px tall; nothing scrolls sideways.
- **Open items:** none.

## ENH-050: Plainer tabs, flags on the day, a neutral mountain, city drawings

- **Why:** Amber asked on 2026-10-05 for the Products tab bar to have no scroll bar, a transparent background and no colour dots, with the selected tab's text in amber; for the "A day at school" description to sit on its title's line; for reached timeline dots to show a flag; for About not to name the mountain or its place (to keep away from religion and spirituality); for city illustrations in the two office cards; and for "ownership" in the About intro to be amber text without the underline.
- **What changed:**
  - **Products tabs:** transparent bar (the cards show through), no colour dots, no scroll bar; the selected tab's text is a dark amber (#9A6C00, 4.6:1 on white) with the amber underline.
  - **A day at school:** title and description in two equal columns, vertically centred on one row; the description is a little smaller and wider (three lines instead of four).
  - **Timeline:** each step's dot shows a small navy flag once the step is reached (it appears with the amber fill).
  - **About, mountain:** the place-name caption and its Wikipedia link are removed, and chapter 01 now reads "Our name is inspired by a mountain: a place people look up to, gather around and climb together towards a brighter future." Nothing on the page names the mountain or a place for it.
  - **About, offices:** each card opens with a small line drawing of its city in amber on the navy card (Plano: low-rise towers; Ho Chi Minh City: two landmark-style towers by the river).
  - **About intro:** "ownership" is amber text (#A87600, 3.9:1 on white, enough for large text) instead of the highlight underline.
- **Rules:** flags and drawings are decorative and hidden from screen readers; with reduced motion the flag appears without moving; all copy has Vietnamese.
- **Open items:** none.

## ENH-051: Country landmarks, contrast over amber, a climber that only climbs, bigger News cards

- **Why:** Amber asked on 2026-10-05 for city drawings that clearly represent each country; smoother points on the About intro mountains; the Products tab text and the diamond markers to switch to navy where the background is solid amber; a shorter "Student learn" step title; the footer climber never to go back down; no "We only use your email…" line in the email bands; and bigger News cards that show each photo clearly, without being full width.
- **What changed:**
  - **Office drawings:** Plano shows a water tower with a Texas star, office towers and a low ranch-style house; Ho Chi Minh City shows a lotus-bud tower with its helipad, a tall stepped tower, the Ben Thanh market clock tower, and a boat on the river.
  - **About intro:** the pastel mountains' peaks and dips are rounded curves instead of sharp points.
  - **Products:** where the page behind them is amber, the selected tab text and its underline, the bar's line, and the diamond markers on the card dividers turn navy; elsewhere the selected tab stays dark amber. The site works out the page colour at each point from its own background, so this follows the scroll.
  - **A day at school:** the fourth step reads "Student learns" (Vietnamese "Học sinh học tập").
  - **Footer climber:** it only climbs. Moving to a page lower on the mountain keeps it where it is, so in one visit it can only stay or go up (Home, then Careers, then Products leaves it on the summit).
  - **Email bands** (About, Products, Services, News): the "We only use your email…" line and its privacy link are removed. The full contact, demo and job forms keep their privacy note, since they collect more than an email.
  - **News** (replaced by ENH-053): the bento is replaced by big, equal cards, two to a row (584×460px at 1440px wide), with an odd last card centred; one per row on phones. Titles are a little larger.
- **Rules:** decorative drawings stay hidden from screen readers; all copy has Vietnamese.
- **Open items:** none.

## ENH-052: Readable tabs everywhere, landmark drawings, plain 404 heading

- **Why:** Amber found on 2026-10-05 that the selected tab had poor contrast over the last cards (dark amber on light blue, with card content showing through the transparent bar), asked for the Ben Thanh Market to represent Ho Chi Minh City and for a feature unique to Plano, and asked for no underline effect on the 404 heading.
- **What changed:**
  - **Products tabs:** the selected tab uses dark amber (#8A6700) only where the background behind it keeps 4.5:1 (the light stretch at the top); over amber or blue it is navy. The bar now has a light frosted backing (45% white with blur) so cards scrolling underneath never collide with the tab text; it still reads as almost transparent.
  - **Ho Chi Minh City card:** the drawing is the Ben Thanh Market front (clock tower, arched gate and two side wings), with two slim towers faint in the background.
  - **Plano card:** hot-air balloons over the city skyline, for the Plano Balloon Festival, the city's best-known annual event.
  - **404:** "You’ve wandered off the trail." has no highlight underline.
- **Open items:** none.

## ENH-053: News leads with one big story, then square cards

- **Why:** Amber found the ENH-051 cards too big all round (every story a large block) and asked for one large featured story, the newest, with the rest smaller and square rather than tall.
- **What changed:** the first story shown spans the full width (1192×520px at 1440px wide); the others are square cards three to a row (384px), two to a row on tablets and one per row on phones. With a filter on, the first story in that filter takes the lead spot. Square-card titles are a little smaller and stop at four lines; the dark fade behind them starts higher so they stay readable (7.2:1 or better measured).
- **Open items:** none.

## ENH-054: Compact office cards; the reel's pause button moves up

- **Why:** Amber found the About office cards too big after the city drawings were added, and asked for the Life at XionTechs pause button to sit on the same row as the section description instead of below the photos.
- **What changed:**
  - **About offices:** each card is at most 400px wide (was half the page), with tighter padding, a smaller clock and a smaller city drawing (72px tall); on phones they stay full width.
  - **Careers:** the pause button sits at the right end of the "Moments from our team, from workshops to Tết." row, vertically centred with it; nothing sits below the reel.
- **Open items:** none.

## ENH-055: Careers from the new careers files; Services without the email band

- **Why:** Amber shared `xiontechs-careers-modern-full-page.html` and `xiontechs-careers-recommended-final.html` on 2026-10-05 and asked for the Careers hero from the final version, the "Inside XionTechs" section from the first file (with "Work smart. Play sharp." replaced by Client visits, "Launches, holidays & wins" renamed Celebration, and equal tiles on tablets and phones), and the "How we work together" flip cards from the final version; plus no email capture on Services and more space between the About office cards.
- **What changed (Careers, in the final file's order):**
  1. **Hero:** "Stay curious. Build what’s next." with the line about the team and an "Explore open roles" button, beside the Growth Learning Model: five steps (Curious, Learn, Ask, Grow, Improve) round a navy "Growth" circle. When it comes into view an amber dot travels once round the ring, lighting each step, and rests on Improve (so nothing keeps moving); with reduced motion it simply shows the first step. The dot starts on the ring at Curious from the first moment (it used to slide in from the centre while the page loaded). The file's "Careers at XionTechs" label and the old breadcrumb are left out.
  2. **Inside XionTechs.** (replaces the Life at XionTechs photo reel): a navy section with five tiles: Workshops & experiments (large), Client visits (amber), Town halls and Project kickoffs (cream), and Celebration. On tablets they are two equal columns and on phones one, every tile the same size.
  3. **Five things that shape the way we work.** (replaces "A culture that goes beyond employment."): five flip cards (Stay agile, Own the outcome, Innovate with purpose, Grow together, Get IT Done) with line icons; clicking, tapping or pressing Enter or Space flips a card to its meaning in practice, and again flips it back.
  4. Find your next challenge follows, unchanged. "Why you’ll grow here." is removed (Amber, 2026-10-05).
- **Services:** the "Tell us what you’re building." email band is removed.
- **About:** the two office cards sit at opposite edges of the page (Plano on the left, Ho Chi Minh City on the right) instead of side by side; on tablets and phones they stack with 40px between them.
- **Rules:** flip cards are buttons that say whether they are flipped; all new copy has Vietnamese.
- **Open items:** the Life at XionTechs reel (ENH-041) is no longer on the page; its photos remain in News.

## ENH-056: A glow round the mountain, an up-to-date footer, and a site icon

- **Why:** Amber asked on 2026-10-05 for a very pastel yellow ambient glow around the mountain (like a reference screenshot's soft radial glow), for the footer to reflect the latest changes, and for the logo as the browser tab icon.
- **What changed:**
  - **About mountain:** a soft pastel-amber radial glow sits behind the picture, brightest under the peak and fading out into the page on all sides, so the mountain feels lit rather than placed on white.
  - **Footer links:** Products adds AI Tutor, AI Timetable and AI Grader; Services adds How we work; Company adds Open roles (to Careers' "Find your next challenge."). Every footer link with a section anchor was checked and lands on an existing section.
  - **Site icon:** the XionTech X mark (from the logo) on every page as the browser tab icon (32px and 192px, transparent) and the home-screen icon (180px, on white).
- **Developer notes:** `assets/favicon-32.png`, `assets/favicon-192.png`, `assets/apple-touch-icon.png`, linked in each page's head.
- **Open items:** none.

## ENH-057: Footer grouped by audience, offices with icons, and a softer mountain glow

- **Why:** Amber said on 2026-10-05 that the mountain glow was too much, and asked for the footer's Products to be grouped by audience, Company to keep only News, About and Careers, and the offices to use icons with Vietnam first and no city or country headings.
- **What changed:**
  - **Footer Products:** grouped under For schools (SXP, IoT Device Management, AI Timetable, AI Grader), For parents (PXP) and For students (LXP, AI Tutor).
  - **Footer Services:** unchanged.
  - **Footer Company:** News, About and Careers only.
  - **Footer Offices:** Vietnam Delivery Center first (address and phone), then US Delivery Center (address, phone, WhatsApp, email). Each line has an icon (pin, phone, WhatsApp, email) and the city/country headings are gone. The Offices column is a little wider so the email stays on one line.
  - **About mountain:** the glow behind the picture is smaller and much paler; it now reads as a faint warm haze under the peak.
- **Developer notes:** footer template in `js/site.js`; `.fgroup`, `.orow` and the footer grid columns in `css/site.css`.
- **Open items:** About background moved to ENH-058 (option page).

## ENH-058: Footer by audience only, bracketed phone codes, icon office cards, and About background options

- **Why:** Amber asked on 2026-10-05 for the footer to show only For schools, For students and For parents (no app list), for phone codes in brackets such as (+1), for the About office cards to use icons, and for the three About background suggestions on a second About page she can switch between.
- **What changed:**
  - **Footer Products:** three links, For schools, For students and For parents, each opening that audience on Products.
  - **Phone numbers:** written as (+1) 469 322 9899, (+1) 469 439 9345 and (+84) 908 107 552 in the footer, About, Home contact and Demo.
  - **About office cards:** address, phone, WhatsApp and email each on an icon row (pin, phone, WhatsApp, envelope); the Plano card now carries a US Delivery Center tag to match the Vietnam card. Each link is a 44px target.
  - **about-2.html (comparison only, not linked from the menu):** a small switcher at the bottom of the screen (Option 1, 2, 3) changes the background after the hero:
    - **Option 1:** warm cream and pastel amber from the mountain story through core values, FAQ and light office cards, then one navy email band before the footer.
    - **Option 2:** the same warm wash down to FAQ, which then fades into the navy offices and email band.
    - **Option 3:** warm all the way to the footer, with no navy band.
  - The chosen option is kept in the address (`?bg=1`, `2` or `3`) so a view can be shared.
- **Developer notes:** `about-2.html` holds its own option styles and switcher script; `.office-card .orow` in `css/site.css`.
- **Open items:** superseded by ENH-059 (white chosen; `about-2.html` deleted).

## ENH-059: About page on white after the hero

- **Why:** Amber decided on 2026-10-05 that, apart from the hero, every About section should sit on a white background, and asked for the comparison page to be deleted.
- **What changed:**
  - **Mountain story and core values:** white, as before.
  - **FAQ:** white, without the blue gradient and clouds.
  - **Two offices:** white instead of navy; the city drawings switch to amber and soft navy lines so they still read on white.
  - **Email band ("See our apps in action."):** white instead of navy; the navy footer follows straight after.
  - **about-2.html:** deleted.
- **Developer notes:** About sections use `s-paper`; light-page city drawing colours in `css/site.css` (`.s-paper .office-card`).
- **Open items:** none.

## ENH-060: Careers on one light gradient

- **Why:** Amber asked on 2026-10-05 for the Careers page to use a light gradient background that connects from section to section, running from the theme's light blue to white to amber.
- **What changed:**
  - Inside XionTechs is no longer a navy band; its heading and description turn navy on the light page, and the tiles keep their own colours.
  - One continuous gradient: the theme's light blue in the hero (with a soft blue glow), easing to white through Inside XionTechs and the five cards, then warming to light amber behind Find your next challenge and into the footer ridge.
  - The hero's glow fades out before the hero ends, so there is no edge between the hero and the next section.
- **Developer notes:** `careers.html` (#life loses `data-flow="night"`); the pastel palette in `js/site.js`; `.inside` and the pastel hero glow mask in `css/site.css`.
- **Open items:** none.

## ENH-061: Services, a fixed heading beside scrolling service cards

- **Why:** Amber asked on 2026-10-05 for the eight services to follow a reference layout where the section title and its description stay put while the cards on the right scroll, with no action on the cards or the section, on the same background.
- **What changed:**
  - "Eight services, one team." and its description sit on the left and stay in view (below the header) while the cards scroll past on the right.
  - The eight cards are equal, two to a row: an amber icon and the service name, a dashed line, the description, and the technologies at the bottom where the service has them. No links, buttons or hover effects.
  - On tablets and phones the heading sits above the cards and scrolls normally; phones show one card per row.
  - Each card keeps its id, so footer links such as Product Engineering still land on it.
- **Developer notes:** `.svc-split`, `.svc-stick`, `.svc-cards`, `.svc-card` in `css/site.css`.
- **Open items:** none.

## ENH-062: Products audience tabs, bigger and on the page colour

- **Why:** Amber asked on 2026-10-05 for the audience tabs to be big, visible and easy to use like a reference product page, with the bar's background matching the section and more padding.
- **What changed:**
  - Each tab has an icon (building for School, people for Parents, graduation cap for Students), larger text (about 18 to 21px) and is 76px tall with wide padding; the bar has extra space above.
  - The bar shows exactly the page colour behind it as it moves down the page (white, then amber, then light blue), instead of a lighter strip.
  - The selected tab keeps its underline and readable text colour (amber or navy).
  - On phones the icon sits above the label.
- **Developer notes:** icons in `products.html`; the bar copies the page background in `js/site.js` (the `tone` handler).
- **Open items:** none.

## ENH-063: News, "Catch up with us" with playful motion

- **Why:** Amber asked on 2026-10-05 for a fun animation on the News page, the title "Catch up with us" and the description "Stay informed with the latest news and announcements, fresh off the press."
- **What changed:**
  - New title and description (with Vietnamese).
  - The title's words rise in one after another, then an amber marker sweeps under "us"; the description follows.
  - Each story card unfolds slowly from the top like a menu opening (about 1.25 seconds) as it scrolls into view, one after another across its row about a quarter of a second apart (the lead story first), rather than all at once. Choosing a filter plays it again for the stories shown.
  - With reduced motion, everything shows at once with no movement.
- **Developer notes:** `.press-h`, `.press-mark`, `.press-in` in `css/site.css`; the `press` function in `js/site.js`.
- **Open items:** none.

## ENH-064: Footer "About us", a bolder climber, Vietnam email, docs wording

- **Why:** Amber asked on 2026-10-05 for "About us" in the footer, a more visible climber (a hiker with a backpack, no rope), vinni.tran@xiontechs.com for the Vietnam location, and the religious place names removed.
- **What changed:**
  - **Footer:** Company shows "About us".
  - **Climber:** a bolder hiker drawn in thick navy lines with an amber backpack, leaning into the climb, about a third bigger.
  - **Vietnam email:** vinni.tran@xiontechs.com under Vietnam Delivery Center in the footer, on the Ho Chi Minh City card on About, and on the Demo page.
  - **Docs:** the enhancement log and the AI log no longer name the religious place; earlier entries now say "the place name" (the names remain in older git history).
- **Developer notes:** footer template and climber SVG in `js/site.js`; `.ridge-climber` and `.rc-*` in `css/site.css`.
- **Open items:** none.

## ENH-065: Services from dark navy to light blue and white, with white and amber glows

- **Why:** Amber liked a reference where colours sweep and mix with white shades. After several trials she settled on dark navy at the top, lightening gradually while the eight services scroll past, light blue through How we work, white at the end of the page with no glows there, and asked to remove "Three ways to work with us" (2026-10-05 and 2026-10-06).
- **What changed:**
  - "Three ways to work with us." is removed.
  - The page starts dark navy behind the hero and facts. Behind Eight services it lightens steadily from dark navy to a mid blue as the cards scroll by, turns light blue from What can we help you achieve? through How we work, and ends white behind Industries we serve.
  - White and amber glows drift through the blue part of the page, alternating left and right (two per section, three in the long ones); the white end has none.
  - Text is white on the dark part ("get IT done", "/7" and "+" in bright amber, no marker bar; the Eight services description fully white) and navy from What can we help you achieve? on; the change falls in the space between sections. The service cards stay white with navy text.
  - Every piece of text was measured against the real background pixels at 1440, 768 and 375px: all pass WCAG AA.
- **Developer notes:** palette `mesh` in the shared flow script (`js/site.js`) sets each section's text phase and places the colour stops and glows; accent and card overrides in `css/site.css`.
- **Open items:** none.

## ENH-066: News without the marker, and a newsletter sign-up

- **Why:** Amber asked on 2026-10-06 to remove the highlight under the News title and to make the News email section a newsletter sign-up.
- **What changed:**
  - "Catch up with us" keeps its rising words but no longer has the amber marker under "us".
  - The email section reads "Subscribe to our newsletter." with "Get our latest news, product updates and stories from the team, straight to your inbox.", a "Your email" field and a Subscribe button. Submitting shows "You’re subscribed. Look out for our next newsletter." in place (it no longer goes to the demo page).
- **Developer notes:** `data-mode="newsletter"` on the News form uses the existing in-place success state (`.cap-ok`).
- **Open items:** none.

## ENH-067: Home sections share one background, light blue glows on About, room under Careers roles

- **Why:** Amber asked on 2026-10-06 for the Home sections from Our partners to Latest from XionTechs to use colours that blend into one another, for some light blue glow on the About page, and for more bottom padding under Find your next challenge.
- **What changed:**
  - **Home:** superseded by ENH-070 (one flowing background from the navy hero into white and light amber).
  - **About:** soft light blue glows on the white sections after the hero (mountain story, core values, FAQ, offices, email band), alternating left and right.
  - **Careers:** Find your next challenge has about 96 to 144px of space below it before the footer ridge.
  - Text contrast re-measured on Home and About against the real backgrounds: all visible text passes WCAG AA.
- **Developer notes:** page-scoped rules at the end of `css/site.css` (`body[data-page="home"]`, `body[data-page="about"]`, `#roles`).
- **Open items:** none.

## ENH-069: Services hero and Eight services as panels, with metric cards across them

- **Why:** Amber shared a reference on 2026-10-06 where the first and second sections are separate rounded panels and a row of metric cards sits across the join, each card with a big number, a short description and a status line. She asked for the three Services metrics and the industries to become those cards, and for the See how we work button to go.
- **What changed:**
  - **Hero:** a rounded dark navy panel, inset from the page edges, with soft amber and white glows and the existing thin amber lines; the See how we work button and the office clocks are removed from it (Start a project stays).
  - **Four cards** sit across the bottom of the hero and the top of the next panel, each with a navy tag, a big number, a decorative trend line, a one-line label, a short note and a footer line:
    - **24/7** global coverage across time zones; note on the Ho Chi Minh City and Plano hand-over; footer shows both offices' live local times. (Trend lines removed in ENH-070.)
    - **20+** technology stacks we work in; note on web, mobile, AI/ML, low-code and cloud; footer "Web · Mobile · AI · Cloud".
    - **25+** years of software leadership experience; note on the leaders guiding each engagement; footer "From idea to operation".
    - **4** industries we serve (the final card); the EdTech note; footer pills for EdTech, Healthcare, Logistics and Private Equity.
  - **Eight services:** a rounded light blue panel starting under the cards; heading and cards as before.
  - The separate facts strip and the Industries we serve section are removed (their content now lives in the cards). The page around and below the panels is soft light blue turning white at the end, with white and amber glows on What can we help you achieve? and How we work.
  - Four columns on desktop, two on tablets, one on phones. All text re-measured against the real background at 1440, 1024, 768 and 375px: WCAG AA throughout.
- **Developer notes:** `.svc-hero`, `.svc-metrics`, `.metric*`, `.svc-panel` in `css/site.css`; the `mesh` palette in `js/site.js` now only colours the page around the panels. The trend lines are decorative (`aria-hidden`) and carry no data.
- **Open items:** none.

## ENH-070: Home flows from navy to white and amber; Services cards simplified, with playful motion

- **Why:** Amber asked on 2026-10-06 for How we approach on Home to lose its own background and blend in, for Our partners to continue the hero's dark navy with white text, then for the page to ease gradually into white with a little light amber; on Services, for the metric cards to be text and numbers only and a little wider, for more space above the Eight services title (it was hidden behind the cards), and for fun animations on the page's sections.
- **What changed:**
  - **Home background:** one background drawn down the page. The hero keeps its navy; Our partners and Why XionTechs continue in navy with white text ("Get IT Done" in bright amber, partner logos on white tiles); between Why XionTechs and Work built with our partners it eases into light blue (in the gap, not under text), then to white through How we approach, with light amber warmth through What we build and the news, ending in the amber of the contact form. Soft amber and white glows alternate sides.
  - **How we approach** has no background of its own; its heading, link and five steps turn navy on the light page (the numbered circles stay navy with amber rings).
  - **Services cards:** the decorative trend lines are gone; each card is the tag, the number, its label, the note and the footer line. On desktop the row runs about 120px wider than the text column.
  - **Eight services:** about 70px more space above the title, so it starts well clear of the cards on every screen size.
  - **Services motion:** the four cards spring up one after another and their tag icons spin in; the service cards rise with a slight tilt (alternating left and right) and settle, then lift with a bouncing icon on hover; the four outcome cards slide in from alternating sides; a light sweeps once across "get IT done". With reduced motion, everything simply fades in.
  - Text contrast re-measured on Home and Services at desktop, tablet and phone: all visible text passes WCAG AA (the only flags are hidden hover text and logos under the marquee's edge fade).
- **Developer notes:** palette `home` in the shared flow script (`js/site.js`) with `data-flow="night"` on the hero, Our partners and Why XionTechs; light-page overrides for `.approach-lite`; Services motion rules at the end of `css/site.css`.
- **Open items:** none.

## ENH-071: Home blue fades evenly; news and contact unchanged; Services cards simplified

- **Why:** Amber asked on 2026-10-06 for Our partners to use the hero's colour, for the rest to blend gradually from darkest blue to dark, normal and light blue with no hard shift or visible bands, for Latest from XionTechs and Have something you want to build? to keep their earlier blended colours, for more space under How we approach with its last step lined up under the See how we work link, and for the Services cards to drop their description blocks and follow one consistent pattern.
- **What changed:**
  - **Home background:** the hero and Our partners share the hero's navy; Why XionTechs deepens to dark blue, Work built with our partners to a normal blue and How we approach stays blue (white text throughout this part; the case study cards stay white with navy text). Below How we approach the blue eases into light blue across its bottom space and the top of What we build, reaching the soft blue the news section starts with. A very fine grain over the colour keeps the long fade free of visible steps.
  - **Latest from XionTechs** and **Have something you want to build?** keep their own backgrounds from before (soft blue, then into amber), unchanged. (ENH-072 draws them in the shared layer, same colours.)
  - **How we approach:** about 96 to 136px more space below; on screens wider than 900px the See how we work link sits directly above step 05 (same left edge).
  - **Services cards:** the grey description blocks are removed. Every card is now tag, number, label and one footer line with an amber dot: live office times (HCMC and Plano), "Web · Mobile · AI · Cloud", "From idea to operation", and "EdTech · Healthcare · Logistics · Private Equity".
  - Text contrast re-measured on Home (1440, 768, 375) and Services: all visible text passes WCAG AA.
- **Developer notes:** `home` palette in `js/site.js` (sections with `data-flow-own` keep their own backgrounds; `data-flow="night"` from the hero to How we approach); grain layer on `.flow-bg[data-palette="home"]`; `.approach-lite .sec-head-row` grid in `css/site.css`.
- **Open items:** none.

## ENH-072: Services panels with a gap; Home mountain divider and smoother blends

- **Why:** Amber asked on 2026-10-06 for a visible gap between the first and second Services sections as in her reference, more space above What can we help you achieve? and below How we work (the footer's mountain nearly touched it); on Home, for something to set Our partners apart from the hero's figures (more space or a cute mountain illustration), for the colour to start lightening within Work built with our partners, and for the remaining line between What we build and Latest from XionTechs to go.
- **What changed:**
  - **Services panels:** the light blue Eight services panel now starts 28px below the navy hero panel at every screen size, and the four cards sit centred across that gap (measured from the cards' real height, so it holds when text wraps or the language changes). The Eight services title starts about 140px below the cards (96px on phones).
  - **Services spacing:** about 112 to 152px more space above What can we help you achieve? and 140 to 190px below How we work.
  - **Home mountain divider:** added, then removed in ENH-073 (Amber found it childish).
  - **Home colour:** Work built with our partners starts in blue behind its heading (white text) and lightens behind its case study cards, so How we approach now sits on light blue with navy text; What we build eases into the soft blue of the news. The news and contact form keep their colours (soft blue into amber) but are now drawn in the same layer as the rest, so there is no edge between What we build and Latest from XionTechs or between the news and the form.
  - Text contrast re-measured on Home and Services at 1440, 768 and 375px: all visible text passes WCAG AA.
- **Developer notes:** panel fitting script in `js/site.js` (`.svc-hero`, `.svc-metrics`, `.svc-panel`); `.peaks-divider` SVG in `index.html` with `.pk-*` styles; the `home` palette now paints every section, including news and contact.
- **Open items:** none.

## ENH-073: Home spacing and room above the footer climber

- **Why:** Amber asked on 2026-10-06 to remove the mountain illustration (too childish), to separate Our partners from the hero figures and from Why XionTechs with more space instead, for the last content of every page to have enough bottom space that the footer climber never collides with it.
- **What changed:**
  - **Home:** the mountain illustration is removed. Our partners has about 112 to 152px above it and 96 to 136px below it.
  - **Every page:** the last section before the footer has about 232 to 256px of bottom space (176px on phones), so the climber on the footer ridge, even at the summit on Careers, stays clear of the content. Measured on all 11 pages at 1440, 1024, 768 and 375px.
  - **How we approach (Home):** re-measured: the See how we work link and step 05 share the same left edge at 1920, 1440, 1280 and 1024px.
  - A Services fix found on the way: the outcome cards' slide-in no longer widens the page on phones before they appear.
- **Developer notes:** `main>section:last-of-type` bottom padding in `css/site.css` (replaces the per-page rules for Careers roles and Services How we work).
- **After review (ENH-060 to ENH-073):** News cards unfold left to right in each row from the first load, and the thank-you takes keyboard focus; Services cards lift on hover after appearing, reduced motion stops every entrance, a card opened from a footer link lands below the header, the panel gap refits after a language switch, the cards keep 72px under the hero button, and the page stacks plainly without JavaScript; Products deep links clear the bigger tab bar and Vietnamese tabs fit from 521px; the Home link-over-step-05 grid starts at 1025px; About step numbers and Home case numbers now pass AA on the new backgrounds; footer links and the newsletter field are 44px or taller; form errors are linked to their fields; leftover styles removed.
- **Open items:** the SVG tab icon is on hold until Amber shares the right file (the PNG icons stay as they are).

## ENH-074: A design system page for the prototype

- **Why:** Amber asked on 2026-10-06 for a design system HTML file for the XionTech prototype like the one in the AI Tutor project (`xt-ai-tutoring-ws/prototype/packages/design-system/docs/design-system.html`).
- **What changed:**
  - New `prototype/design-system.html`, following the AI Tutor page's structure: a sticky section menu, a hero, and numbered sections with a title, a short intro, examples and Do / Don't cards.
  - **Sections:** 01 Brand (logo on white and on its white tile, the Get IT Done tagline on navy and light), 02 Colour (navy, amber and light-surface ramps; text and status tokens; the three readability rules), 03 Surfaces and backgrounds (the four section surfaces and the flowing page palettes for Home, Services and Careers), 04 Typography (Unbounded, Lexend Exa, Be Vietnam Pro, JetBrains Mono and the type scale), 05 Space, shape and depth (spacing, radius, the 44px target, shadows), 06 Icons (the Phosphor icons in use), 07 Illustration (the Plano and Ho Chi Minh City drawings and the footer climber), 08 Components (buttons and links, filters, chips, audience tabs, metric, service and outcome cards, the email field), 09 Patterns (panels with cards across the gap; the sticky heading beside cards), 10 Motion and voice (reveal, unfold and spring with their timings; writing rules).
  - Every value is read from `css/site.css` when the page is built, and the components are the site's own classes, so the page shows exactly what the site uses. Light theme only, like the site.
  - Checked at 1440 and 375px: no errors, no sideways scroll, no text under 11.5px; the demo animations stop with reduced motion.
- **Developer notes:** standalone page (no site header or footer script), `noindex`, not linked from the site navigation. English only, as an internal reference.
- **Open items:** none.

## ENH-075: Home background turns to amber shades after the navy

- **Why:** Amber shared the AI Tutor design system's "Sky wash" gradient on 2026-10-06 and asked for the Home background (palette "home") to use amber shades in place of the blue.
- **What changed:**
  - The navy part stays: the hero, Our partners and Why XionTechs, and the top of Work built with our partners behind its heading (white text).
  - Behind the case study cards the navy now warms into cream instead of light blue, and everything after sits on amber shades with navy text: pale amber behind How we approach, cream and soft amber through What we build and Latest from XionTechs, deepening into the amber of the contact form.
  - Latest from XionTechs therefore moves from soft blue to soft cream so no blue band remains between the amber sections; the contact form keeps its amber fade.
  - The Home swatch on the design system page shows the new stops.
  - Text contrast re-measured at 1440, 768 and 375px against the real background: all visible text passes WCAG AA.
- **Developer notes:** the `home` palette stops in `js/site.js`.
- **Open items:** withdrawn on 2026-10-06: Amber did not like the colours; the Home background is back to the version committed in PR #48 (ENH-070 to ENH-073).

## ENH-076: Services cards in order, "Smart school" hub, Our partners spacing

- **Why:** Amber asked on 2026-10-06 for the Services metric cards to animate in order one to four, for the X on the Products hero to say "Smart school", for less padding above and below Our partners but more between its title and the logos, and for the Home background to use the AI Tutor's sky wash in XionTechs blues behind Work built with our partners, turning amber at What we build and deepening from light to darker amber through Latest from XionTechs and the contact form.
- **What changed:**
  - **Services:** once the card row is on screen, the four metric cards spring up one after another (24/7, 20+, 25+, 4), about a fifth of a second apart, each tag icon spinning in with its card. With reduced motion they simply show.
  - **Products:** the white X tile in the middle of the four app cards now reads "Smart school" under the X (Vietnamese "Trường học thông minh").
  - **Our partners (Home):** about 64 to 88px above and 56 to 72px below (down from 112 to 152 and 96 to 136), with 32 to 48px between the title and the logo strip.
  - **Home background:** a sky wash into amber was tried and then reverted at Amber's request; the Home background is the version committed in PR #48.
  - Text contrast re-measured on Home (1440, 768, 375) and Products: all visible text passes WCAG AA.
- **Developer notes:** the metric sequence (`.m-wait` / `.m-go`) in `js/site.js` and `css/site.css`; `.eco-hub small` for the hub label.
- **Open items:** none.

## ENH-077: Smart School hub, sections in order, a climber that always climbs, smoother case slider

- **Why:** Amber asked on 2026-10-06 to remove the X from the Products hub and use "Smart School", for every section to appear only once the section before it has appeared, for the footer climber to be seen moving forward on each page and to reach the summit on Careers, and for the white edge on the case study slider to go, with clean motion while sliding.
- **What changed:**
  - **Products:** the white tile in the middle of the four app cards reads "Smart School" (no X), in the display font (Vietnamese "Trường học thông minh").
  - **Every page:** a section's content waits until the section above it has started to appear (about 0.4 seconds apart), so nothing lower down arrives first; sections already scrolled past show at once, and everything still appears only when scrolled into view.
  - **Footer climber:** on every page the hiker walks one step up the ridge when the footer comes into view, from the spot of the page before it in the menu to its own (Home, Products, Services, News, About, then the summit on Careers). It always walks forward and never back; Privacy, Demo and 404 leave it at the foot.
  - **Home case studies:** edge fade and grow effect tried, then replaced by the carousel in ENH-078.
- **Developer notes:** section gating (`gate`, `markSec`) in the reveal code and the climber's `ORDER` in `js/site.js`; `.eco-name`, the slider mask and `caseGlide` (`animation-timeline: view(inline)`) in `css/site.css`.
- **Open items:** none.

## ENH-078: A centred case study carousel on Home, and a Products usability trial page

- **Why:** Amber asked on 2026-10-06 to tone down the slider's edge effect, for the case study slider to work like a reference carousel (navigation buttons on the side cards, dots underneath) with one sample card from a real collaboration, and for a copy of the Products page with the changes recommended by the usability check.
- **What changed:**
  - **Home case studies:** the white fade on the right edge and the edge fade and grow effect are gone. One large card (up to 1120px, 84% of the screen) sits in the centre with the cards either side peeking in; a white square arrow button sits on each side card (hidden at either end), moving one card at a time; one dot per card below shows where you are (6 dots). Cards are full photo cards with the partner line, title, a sentence and a button over a dark fade at the bottom. On phones the arrows hide and cards swipe.
  - **Sample card:** the first card uses the real client visit from the newXion newsroom (photo, "Exploring AI and robotics for education", the visit to the Ho Chi Minh City Delivery Center) and links to that story; the partner's name stays "[Partner name]" because no client is named in our content. The other five cards remain placeholders.
  - **products-2.html (comparison only):** audience tabs only (School 4, Parents 1, Students 2, with counts; no app names in the bar, so it scales to more apps) and a switcher at the bottom of the screen to compare four layouts on the real app cards: **A · Filter** (the tab filters the apps into a two-column zig-zag, each card complete with its button, re-flowing with a staggered fade), **B · Explorer** (a short list of the audience's apps on the left, the chosen app on the right, with "n of N"), **C · Stack** (the pinned stacking cards for the chosen audience only, with "n of N" and a Next app link) and **D · Carousel** (the audience's apps in a carousel with arrows and dots, like the case studies). An earlier version that listed every app name in the bar was dropped at Amber's request.
- **Usability results (headless, 1440 / 768 / 375):** on the current page only 3 of 7 products can be reached from the tabs and AI Tutor sits about 46 mouse-wheel notches down on desktop (63 on tablets); on products-2 every product is one click away and AI Tutor is about 34 notches down on desktop, with each "View prototype" button clickable for a longer stretch of scrolling. Both store buttons on PXP are clickable on phones on both pages.
- **Developer notes:** carousel arrows in the case slider script (`js/site.js`) and `.case-nav` / `.case-shell` styles in `css/site.css`; products-2.html carries its own trial styles and script and is not linked from the site.
- **Open items:** the large centred cards and the photo sample card were replaced in ENH-079 (original card size kept); Amber to decide whether products-2 replaces the Products page.

## ENH-079: Original case cards with arrows and dots, a sample partner card, and flat primary buttons

- **Why:** Amber asked on 2026-10-06 to keep the original case study card size (the large cards were only meant to bring the navigation buttons and dots), to show a client-facing sample card with a partner logo, sample title and text, to make primary buttons a plain flat colour without the glow, to update the design system to match, and not to use a primary button on the card.
- **What changed:**
  - **Case study slider:** the cards are back to the first version (about 320px wide on desktop, a picture area on top and the text below, a plain "View case study" link). The arrow buttons stay: white square buttons over the left and right edges of the slider, level with the picture area, hidden at either end; the dots below follow the slider as before.
  - **Sample card:** the first card shows a made-up partner, clearly marked "Sample" ("[Sample] Northbridge Learning · Education"), with its logo on a light panel and a sample sentence about an SXP and PXP rollout. A real company's logo (Adobe was the example) is not used, so the public prototype never claims a partnership that does not exist; a real partner's logo can replace it once they agree.
  - **Primary buttons, every page:** one flat amber (#FFC000) with navy text, no gradient, no glow and no lift; hover turns them a deeper amber.
  - **Design system page:** the amber button's glow is removed from the elevation examples, and the button notes say primary buttons are flat and cards use a plain link.
- **Developer notes:** `.btn-primary` (and the Home hero override) in `css/site.css`; `.case-nav`, `.case-logo`, `.sample-logo`, `.sample-tag`; the large-card carousel styles from ENH-078 are removed. `--shadow-primary` stays defined but unused.
- **Open items:** a real partner's logo and case study when available.

## ENH-080: Story-style case cards, and a searchable Products catalogue trial

- **Why:** Amber asked on 2026-10-06 for darker, lower slider buttons, for the case cards to follow a customer-story reference (picture with the name on it, text and link below), and for the Products copy to drop the Filter, Stack and Carousel options and instead mimic stripe.com/products: search, filter tabs and how each product is presented, with every app one click away.
- **What changed:**
  - **Home case studies:** each card is a tall rounded picture with the partner's name on it (the sample shows the [Sample] Northbridge Learning logo in white on navy); the story sentence and "View case study" link sit below the picture. The background stays dark behind the cards and lightens only after them, so the white story text stays readable. The arrow buttons are navy with a white arrow, at the middle of the pictures.
  - **products-2.html (comparison only):** the four options are gone. "What we build" becomes a catalogue: a search box, audience filters with counts (All 7, School 4, Parents 1, Students 2) and a "Showing N apps" line; a sticky list of audiences on the left that follows the scroll; and the apps grouped under For schools, For parents and For students, two to a row, each card showing the app name, its one-line promise and its picture, opening the app in one click. Search matches names, promises and features in English and Vietnamese, and a message shows when nothing matches.
- **Developer notes:** Home story styles (`body[data-page="home"] .case-*`) and the darker `.case-nav` in `css/site.css`; the Home palette keeps navy to the bottom of the case slider; products-2.html builds its cards from the existing app content.
- **Open items:** Amber to decide whether the catalogue replaces the Products page.

## ENH-081: Light Why XionTechs and case studies with a soft silk, and white case cards

- **Why:** Amber asked on 2026-10-06 for less blue from Why XionTechs to Work built with our partners (their backgrounds back to the earlier light version), a subtle white-and-amber silk animation behind those two sections instead of amber glow dots, and white case cards of one width with two-sentence descriptions, no numbering, and the sample showing only the Northbridge Learning logo.
- **What changed:**
  - **Background:** navy stays for the hero and Our partners only; Why XionTechs and Work built with our partners are light again (navy text), the change from navy falling in the space between Our partners and Why XionTechs.
  - **Silk:** a faint white-and-amber version of the hero's silk cloth moves slowly behind Why XionTechs and the case studies (about half opacity, fading out at the top and bottom of each section; it holds still with the site's motion pause and reduced motion).
  - **Case cards:** white with a light border, all the same width (300 to 340px); the "01 / 06" numbers are gone; descriptions show at most three lines (two sentences). The sample card shows only the Northbridge Learning logo, with no "Sample" tag or name label.
- **Developer notes:** `canvas.silk.silk-soft` with a light palette in the silk script (`js/site.js`); the Home palette marks only the hero and Our partners as dark; ENH-080's dark story-card styles are replaced.
- **Open items:** none.

## ENH-082: Products catalogue trial with one-block search, hover outline and in-page app details

- **Why:** Amber asked on 2026-10-06 to remove the large circle behind the catalogue, keep the section transparent, put the search and filters in one block like stripe.com/products, make the filter text and its selected state stronger, outline a card in dark blue on hover, and open each app's details on the same page (laid out like a reference product panel, with its features and pictures) with a way to close back to all apps.
- **What changed (products-2.html only):**
  - **Search and filter:** one white bar with the search box on the left and the audience filters (All 7, School 4, Parents 1, Students 2) on the right, with "Showing N apps" underneath; filter text is larger and the selected audience is solid navy.
  - **Cards:** a navy outline and slight lift on hover; the whole card is a button.
  - **App details:** clicking a card opens a centred panel over the page: the app's badge and name, its promise as the heading, a "View prototype" and a "Book a demo" button, its features as a checklist on the right, two pictures (the app's screenshot frame and a sample team photo marked as a placeholder), and its first three features as highlights with icons. Close with the X, Esc or a click outside; focus returns to the card.
  - **Circle:** the catalogue had reused an existing class name of the site's small rounded pill, which drew one huge rounded shape behind everything and set the text in capitals; the class is renamed, so the section is clean and transparent.
- **Developer notes:** `.pcat` (was `.cat`), the `<dialog class="app-detail">` and its script in products-2.html; `.eco-hero` now contains its own background layer (site.css).
- **Open items:** real screenshots for each app; Amber to decide whether the catalogue replaces the Products page.

## ENH-083: Backgrounds back to the PR version, result-led case stories, and an Audience dropdown

- **Why:** Amber asked on 2026-10-06 to restore the Home and Products backgrounds to the versions pushed in PR #48, to write each case story as two sentences in a result-led format ("[App] decreases costs for customer support operations by 65% after..."), to drop the card shadow, and on the Products copy to group the audiences in a dropdown beside the search (like Stripe's Product area), hide the count until a filter is used, show filtered results in Stripe's result format, make the selected audience clearly highlighted, and move A day at school before the apps with colours that contrast.
- **What changed:**
  - **Home:** the background is the PR #48 version again (navy from the hero through Work built with our partners); the faint silk stays, much softer. Case cards have no shadow; the sample reads "Northbridge Learning cuts weekly admin time by [X%] after moving attendance, grades and parent messages onto SXP and PXP. Every campus now works from one source of truth." and the other five use the same two-sentence pattern with placeholders. The percentage stays a placeholder until a real figure is agreed.
  - **products-2.html:** the page background is the committed Products one. The search bar now has one Audience dropdown with checkboxes (School 4, Parents 1, Students 2; the chosen ones are bold navy on a tinted row, and the button shows how many are chosen). Nothing is counted until you filter or search; then "Showing 4 apps for 'School'. Clear filters" appears and the matching apps sit in a three-column grid, each with its name, promise, an audience tag and its picture, as on Stripe. In the grouped view the audience you are in is bold navy in the side list. A day at school now comes before the apps on its own navy background, so its white text contrasts.
  - Text contrast re-measured on Home and products-2 at 1440 and 375px: all visible text passes WCAG AA.
- **Developer notes:** Home palette block restored from HEAD in `js/site.js`; `.aud-drop`, `.cat-result`, `.cat-results`, `.app-tag` in products-2.html; `#school-day` carries `data-flow="night"` and `#apps` `data-flow="rise"` there.
- **Open items:** real case study results; Amber to decide whether the catalogue replaces the Products page.

## ENH-083b: Products catalogue trial, blended background and filter fix

- **Why:** Amber found the Products copy hard to read (hard-coded section colours, What we build and A day at school text not visible) and a bug where the grouped audience view stayed on screen while filtering (2026-10-06).
- **What changed (products-2.html):** one background flowing down the page instead of fixed section colours: white in the hero, warming to amber behind A day at school (now with navy text and navy reached dots), easing to light blue behind What we build, then dark navy for Product updates and the closing band. Filtering now hides the grouped view and shows only the matching results. All visible text passes WCAG AA at 1440 and 375px.
- **Developer notes:** palette `catalog` in `js/site.js`; the grouped view is hidden via `.cat-body[hidden]`.

## ENH-084: Products trial polish, simpler case text, and a smoother Careers cycle

- **Why:** Amber asked on 2026-10-06 for a deeper amber behind A day at school with the flag raised above each dot, a smoother blend from What we build into Product updates, a See all news link that matches the white heading, plain placeholder text on the Home case cards with a two-sentence sample, animated app cards, and a Careers cycle where the dot moves naturally and each step lights up (not in amber) only when the dot reaches it.
- **What changed:**
  - **products-2.html:** A day at school sits on a deeper amber; reached dots stay white with a navy ring and a navy flag rises above each one. The light blue behind the apps falls evenly into the navy of Product updates over the space under the last cards. See all news is white like the heading. App cards rise in as they reach the screen.
  - **Home:** the five placeholder cards read "[Placeholder] Two sentences on the outcome."; the sample reads "Northbridge Learning cuts admin time after moving onto SXP and PXP. Every campus now shares one source of truth." with no cut-off dots.
  - **Careers:** the amber dot glides along the ring at an even, eased pace (1.6 seconds per step, a short pause at each), and a step lights up only once the dot reaches it, in soft blue with a navy ring, so amber stays for the main button and the dot. With reduced motion the first step simply shows.
  - Text contrast re-measured on products-2 and Home: all visible text passes WCAG AA.
- **Developer notes:** `catalog` palette stops and the Careers glide in `js/site.js`; `.cycle-node.current` colours in `css/site.css`; day flag and app reveal styles in products-2.html.
- **Open items:** none.

## ENH-085: Home link in the main menu (GitHub #52)

- **Why:** team feedback, tracked as https://github.com/vmhoang1703/XionTech-LandingPage/issues/52: the header had no Home link, so visitors had to know the logo returns home.
- **What changed:** "Home" (Vietnamese "Trang chủ") is the first link in the header menu on every page and in the mobile menu, underlined as the current page on the home page like the other links; the logo still links home. Checked at 1440, 1024 and 375px: the menu fits with no sideways scroll.
- **Developer notes:** header template in `js/site.js`.
- **Open items:** none.

## ENH-086: Home hero says what we do, with Get in touch, five figures and two doors (GitHub #53)

- **Why:** team feedback, tracked as https://github.com/vmhoang1703/XionTech-LandingPage/issues/53.
- **What changed:**
  - **Home hero:** "School apps and software teams that get IT done." with "XionTechs is an education technology company and software partner. We build connected apps for schools (PXP, LXP, SXP and IoT) and deliver digital products for companies, from Ho Chi Minh City and Plano." The main button is "Get in touch" and scrolls to the contact form.
  - **Experience you can count on:** five figures in a row with dividers: 25+ years of leadership experience in software, 24/7 global coverage, 20+ technology stacks, 8 service offerings, 2 offices (three then two per row on smaller screens).
  - **Two doors** across the hero's lower edge: a white Products for schools card (app badges, line, PXP · Parents / LXP · Students / SXP · Staff / IoT · Campus, arrow) linking to Products, and a navy Your software delivery team card (line, service chips with +3 more, arrow) linking to Services. Vietnamese for all new text.
  - **Spacing and background:** more space above the hero copy and between Get in touch and the figures; as in the reference, the navy stops at the middle of the two cards and the page is light from there (Our partners, Why XionTechs and the case studies now sit on light backgrounds with navy text).
  - **Opens at the hero:** reloading Home (even after Get in touch) always starts at the hero; Get in touch scrolls to the form without leaving #contact in the address; a link from another page to the contact form (About's Ask us directly) still lands on the form.
  - **Outsourcing services** label above "Your software delivery team" on the navy card, as in the reference.
  - **App names on the Products card:** the badges read PHub (ParentHub) and SHub (StaffHub) alongside LXP and IoT, and the pills show app names only: ParentHub, LXP, StaffHub, IoT.
  - **ParentHub and StaffHub everywhere (#54):** PXP and SXP are renamed ParentHub and StaffHub across all pages, the news, the footer and the design system (badges PHub and SHub), in English and Vietnamese; page anchors such as products.html#pxp keep working.
  - **Mockups removed:** the tablet and phone mockups are gone from the Home hero; the copy runs full width over the silk.
  - **Services:** the figure cards are gone from the hero; the Eight services panel starts below the hero.
  - Checked at 1440 and 375px: no sideways scroll, all text passes WCAG AA.
- **Developer notes:** hero markup in index.html; `.stats-5`, `.doors`, `.door*` and the Services spacing at the end of `css/site.css`.
- **Open items:** none.

## ENH-087: Team feedback blocks 2 to 8 (GitHub #55 to #61)

- **Why:** team feedback logged as issues #55 (Home content), #56 (Home order), #57 (process), #58 (product naming), #59 (Products contrast), #60 (Products page) and #61 (Services metrics).
- **What changed:**
  - **Home order (#56):** Hero, Capabilities, Core values, the 4-D process, How we approach, Work built with our partners, Latest from XionTechs, contact form.
  - **Home content (#55):** Our partners and What we build are removed; Why XionTechs becomes **Capabilities** ("Why XionTech: the core capabilities behind every school app and every product we deliver."), its tiles relabelled School platforms, Global delivery, Domain expertise and Software engineering; Core values move from About to Home.
  - **Process (#57):** the original 4-D design returns on Home and Services (your request, Discovery, Design, Development, Deployment, launch, with the filling track and floating icons); Development now says testing and QA run inside every sprint; How we approach has four steps; "five steps" wording on About, Demo and Home now says four.
  - **Naming (#58):** Parent Hub and Staff Hub everywhere (short logos P-Hub and S-Hub); LXP / Learner Hub is gone from the products, the hero cards, A day at school (students now practise with the AI Tutor), the FAQ, the demo checklist and the footer (For students opens the AI Tutor).
  - **Products page (#60, #59):** the stacked app cards are replaced by four plain cards (Parent Hub, Staff Hub, IoT Device Management, AI Tutor) with name, one-line description and their store or prototype buttons, no pictures and no card animation, set on a dark navy panel so they stand out clearly from the page; the hero diagram shows AI Tutor in place of LXP.
  - **Services (#61):** no metrics (done in ENH-086).
  - Checked at 1440 and 375px: no errors, no sideways scroll, all visible text passes WCAG AA on Home, Products, Services and About.
- **Developer notes:** 4-D styles (`.flow`, `.node`, `.step4`) and `.papps` / `.papp` at the end of `css/site.css`; the track lights via an observer in `js/site.js`.
- **Open items:** products-2.html (the catalogue trial) still shows the old app set.

## ENH-088: Home, one How we approach section (GitHub #62)

- **Why:** Home showed the 4-D process and a separate four-step How we approach, which said the same thing twice.
- **What changed:** the separate How we approach section is removed; the 4-D section is now titled **How we approach.** (VI: Cách chúng tôi tiếp cận.) with the description "Our 4-D process (Discovery, Design, Development, Deployment) takes your idea to launch, and every step ends with something you can see and approve." The See how we work link to Services moves to this heading. Home order: Hero, Capabilities, Core values, How we approach, Work built with our partners, Latest from XionTechs, contact form.
  - Checked at 1440 and 375px: no errors, no sideways scroll, the 4-D track still animates.
- **Developer notes:** index.html only ( heading and lede); the implementation specs are not changed.
- **Open items:** none.

## ENH-089: Products, earlier app cards with a product detail view (GitHub #64)

- **Why:** Amber wants the richer earlier cards back, plus a way to read more about each app without leaving the page.
- **What changed:**
  - **Cards (per the reference Amber shared):** Parent Hub, Staff Hub, IoT Device Management and AI Tutor sit in a two-column grid (one column on phones). Each white card has the app badge and name, the tagline as a large title at the top left, a square expand icon at the top right, and the app screenshot centred below. Features and buttons move into the detail view; no LXP, AI Timetable or AI Grader.
  - **Expand icon:** a square 44px button at the top right of each card opens that app's detail view over the page: name, tagline, who it is made for, a larger screenshot, the store or prototype buttons and the features as cards. It closes with the X, Esc or a click outside, and focus returns to the card.
  - Feature descriptions in the detail view are **[Placeholder]** until the product owners supply copy.
  - Checked at 1440 and 375px: no errors, no sideways scroll, the view opens, closes and returns focus.
- **Developer notes:** `.pshow` cards and the four `<dialog class="pdetail">` views in products.html; `.pshows` / `.pshow` / `.ps-*`, `.pc-expand` and `.pdetail` / `.pd-*` at the end of css/site.css; the opener at the end of js/site.js. `.papps` / `.papp` (ENH-087) and the `.pstack` / `.aud-nav` styles are no longer used on Products. The implementation specs are not changed.
- **Open items:** feature descriptions and real screenshots for each app.

## ENH-090: Remove unused styles and scripts, update the design system (GitHub #66)

- **Why:** after #56, #61, #62 and #64 the old Products cards, the audience tabs, the old How we approach section and the Services metric cards appear on no page, but their code stayed in the prototype.
- **What changed:**
  - **Styles:** 133 unused rules removed from css/site.css (stacked app cards and their tab bar, the plain ENH-087 cards, the light How we approach steps, the Services metric cards), about 14 KB less.
  - **Scripts:** the stacked-card scrolling, the tab bar colouring and the Services metric-card spacing are removed from js/site.js.
  - **Design system:** the audience tabs and the metric card are gone; the Products showcase card is shown with its expand icon, which opens a sample detail view; the cards-across-an-edge pattern now describes Home (two cards across the hero edge), and the motion and elevation notes no longer mention metric cards.
  - **No visible change:** every page was screenshotted before and after at 1440 and 375px and the images match (2 anti-aliased pixels differ on Home at 375px); no errors, no sideways scroll.
- **Developer notes:** only css/site.css, js/site.js and design-system.html change. The implementation specs are not changed.
- **Open items:** none.

## ENH-091: Presenter device toggle (Phone, Tablet, Desktop)

- **Why:** like the AI Tutor prototype, presenters need to show how any page looks on a phone or a tablet without resizing the browser.
- **What changed:**
  - **Toggle:** a thin white presenter bar sits above the header on every page, as in the AI Tutor prototype: "Presenter view" on the left and three square icon buttons for Phone, Tablet and Desktop in the middle (the chosen one outlined in navy). It scrolls away with the page; the header stays sticky.
  - **Device view:** Phone or Tablet opens device.html, which keeps the same bar on top and shows the page in a frame: Phone 390px wide with rounded corners, Tablet 820px (iPad). The page reflows to that width, links keep working inside the frame, and the control and the address follow the page. Desktop returns to the full page.
  - **Presenter-only:** the control is hidden on screens under 1024px, on touch devices and in print; it never shows inside the frame.
  - English and Vietnamese labels follow the page language; 44px buttons with pressed states for screen readers.
  - Checked at 1440px: no errors; phone frame 390px, tablet 820px, navigation inside the frame and the way back to Desktop work; hidden at 375px.
- **Developer notes:** device.html (only accepts prototype page names); the toggle at the top of js/site.js after the footer; `.demobar` / `.devbar` at the end of css/site.css. A presenter tool for the prototype, not a feature of the live site. The implementation specs are not changed.
- **Open items:** none.

## Withdrawn: ENH-076, ENH-078 to ENH-084 (and the climber-only scope of ENH-077)

- **Why:** on 2026-10-06 Amber kept only the footer climber change and the work tied to GitHub issues (ENH-086 for #53 and #54, ENH-087 for #55 to #61), and withdrew the rest.
- **Taken out of the prototype:** the Services metric card sequence (076); sections appearing in page order and the "Smart School" hub label (077, the Products hub shows the X again); the case study arrows, sample partner card, story-style cards, white numbered-less cards, soft silk, result-led case text and darker arrows (078 to 084; the case studies are back to the PR version); flat primary buttons (079; the amber buttons keep their PR look, also on the design system page); the Careers growth-cycle glide and blue highlight (084); and products-2.html, the catalogue trial, which is deleted.
- **Kept:** ENH-077's footer climber, ENH-085 (pushed), ENH-086 and ENH-087.
