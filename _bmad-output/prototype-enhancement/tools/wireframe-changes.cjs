// Change tags for wireframes-final.md. Update this file whenever an enhancement-log entry is approved,
// then regenerate: node _bmad-output/prototype-enhancement/tools/wireframes.cjs final --out _bmad-output/prototype-enhancement/wireframes-final.md
// "Batch 1" = the readability, accessibility and header changes written into the specs before the log existed.

const SITE_WIDE =
  "site-wide rules only (Batch 1 readability; ENH-004 heading-first reveal; ENH-006 and ENH-009 spacing; ENH-025 calmer type weights; ENH-038 to ENH-040 one page-title style, lighter display headings and the guideline's heading rhythm; ENH-043 to ENH-045 the footer ridgeline with a climber whose spot follows the page; ENH-051 the climber only climbs and email bands drop the small print; ENH-056 to ENH-058 the updated footer and the site icon; ENH-064 a bolder hiker as the climber; ENH-073 room above the footer climber on every page).";

module.exports = {
  // header and footer frames (shared by every page)
  header: "Batch 1 · ENH-002",
  footer: "ENH-056 to ENH-058 (Products by audience, Company: News, About us, Careers; offices with icons, Vietnam first with its email; phone codes in brackets) · ENH-064",

  // section tags, keyed by page and the id of the section heading
  sections: {
    "index.html#h1": "Batch 1 · ENH-002 · part of one flowing background in ENH-070 to ENH-072", // Home hero
    "index.html#why-h": "new in Batch 1 · rebuilt in ENH-004 · on dark blue in ENH-070",
    "index.html#cases-h": "new in ENH-003 · slider in ENH-006 · blue lightening behind the cards in ENH-072",
    "index.html#d4-h": "the 4-D process in ENH-087 · titled How we approach, replacing the separate section, in ENH-088",
    "services.html#process-h": "five steps in ENH-011 (full version) · on light blue in ENH-065",
    "index.html#contact-h": "new in ENH-001 · ENH-010 · blended in ENH-036",
    "products.html#h1": "ENH-014 · ENH-018 · ENH-020", // Products hero
    "about.html#h1": "We’re XionTechs intro in ENH-049 · rounder peaks in ENH-051", // About hero
    "about.html#story-h": "the mountain story (ENH-030) moved below the intro in ENH-046 and ENH-049 · no place name in ENH-050 · softer glow in ENH-057",
    "about.html#off-h": "city drawings in ENH-050 to ENH-052 · smaller, further apart in ENH-054 and ENH-055 · icon rows in ENH-058 · white in ENH-059",
    "about.html#faq-h": "rebuilt in ENH-016 · background stilled in ENH-019 · last slot in ENH-031 · white in ENH-059",
    "about.html#cap-h": "blended in ENH-036 · white in ENH-059",
    "services.html#h1": "light hero in ENH-033 · rounded navy panel, one button, in ENH-069",
    "services.html#all-h": "sticky heading beside the cards in ENH-061 · light blue panel in ENH-069 and ENH-072",
    "services.html#out-h": "new in ENH-048 · more space above in ENH-072",
    "news.html#h1": "white and light blue in ENH-034 · rebuilt in ENH-037 · newsroom stories in ENH-042 · lead story and square cards in ENH-053 · Catch up with us, cards unfold as they scroll in ENH-063 and ENH-066",
    "index.html#news-h": "ENH-007 · story cards in ENH-042",
    "products.html#up-h": "ENH-024 · story cards in ENH-042",
    "404.html#h1": "lost-trail map in ENH-043",
    "news-story.html#h1": "editorial article in ENH-037",
    "careers.html#life-h": "Inside XionTechs tiles in ENH-055 · on the light gradient in ENH-060",
    "careers.html#cul-h": "five flip cards in ENH-055",
    "careers.html#roles-h": "Find your next challenge. in ENH-049",
    "products.html#apps-h": "new in ENH-020 · audience tabs in ENH-049 to ENH-052 · bigger tabs with icons in ENH-062",
    "products.html#day-h": "new in ENH-015 · rebuilt in ENH-023 · display font in ENH-040 · flags on reached dots in ENH-050",
    "news.html#cap-h": "blended in ENH-036 · newsletter sign-up in ENH-066",
    "careers.html#h1": "Stay curious. Build what’s next. with the Growth Learning Model in ENH-055 · light blue into white and amber in ENH-060",
  },

  // one line under each page title
  pages: {
    "index.html": "Batch 1, ENH-001 to ENH-013, ENH-021, ENH-025, ENH-026, ENH-036 (contact section blends in), ENH-037 (news cards show their photo and open their story), ENH-070 to ENH-073 (one background from the hero navy, through blue, into white and amber; more space around Our partners; the section colours below are the no-JavaScript fallback) (see the change list at the top).",
    "products.html": "ENH-062 (bigger audience tabs with icons on the page colour); ENH-014 and ENH-018 (hero; display font in ENH-038), ENH-037 (news row shows the app stories with photos), ENH-020 (stacked app cards), ENH-022 (background flow), ENH-023 (A day at school), ENH-024 (updates link, plain email band), ENH-027 to ENH-029 (resizing keeps the card; pill clears once A day at school reaches mid-screen), ENH-049 to ENH-052 (transparent audience tabs that stay readable over amber; “Student learns”; flags on A day at school); " + SITE_WIDE,
    "services.html": "ENH-061, ENH-065 and ENH-069 to ENH-072 (rounded navy hero and light blue Eight services panels with four metric cards across the gap, a sticky Eight services heading beside its cards, Three ways and Industries sections removed, navy to light blue to white, playful entrances); ENH-011 (the five-step How we work. replaces the 4-D process); ENH-033 (one white-and-amber background, light hero; the section colours below are the no-JavaScript fallback); ENH-036 (email section blends in); ENH-048 (white with pastel amber; What can we help you achieve? before How we work; three facts, now cards); ENH-055 (no email band); " + SITE_WIDE,
    "about.html": 'ENH-067 (soft light blue glows); ENH-046 and ENH-049 to ENH-059 (a We’re XionTechs intro over pastel peaks, then the mountain story with newXion at the peak and no place name, core values, FAQ, two office cards with city drawings and icon rows, all on white after the intro); ENH-030 (the mountain story; the old hero, key facts and "Two strengths, one team." are gone); ENH-031 (FAQ last slot asks for more questions); ENH-032 (the story grows on very large screens); ENH-036 then ENH-059 (email section on white, the navy footer follows); Batch 1 (no label above "Our core values."); ENH-011 (FAQ says five steps); ENH-016 (FAQ rebuilt), ENH-019 (FAQ background holds still); ' + SITE_WIDE,
    "news.html": "ENH-063 and ENH-066 (Catch up with us; cards unfold one by one as they scroll in; a newsletter sign-up); ENH-007 (a story about an app shows the app name in its pill); ENH-034 (white with light blue throughout; filter buttons no longer turn into NaN; the section colours below are the no-JavaScript fallback); ENH-037 (audience filter and full-photo story cards); ENH-047 (two thin company posts removed); ENH-053 (one large lead story, then square cards three to a row); ENH-036 (email section blends in); " + SITE_WIDE,
    "news-story.html": "ENH-037 (an editorial article: label, date, headline, summary, wide photo); ENH-042 and ENH-044 (each story's own text, with subheadings, from the newXion newsroom); " + SITE_WIDE,
    "careers.html": "ENH-060 (light blue into white and amber, no navy band); ENH-035 (one pastel light-amber background, light hero; the section colours below are the no-JavaScript fallback); ENH-041 (event reel, later replaced); ENH-049 and ENH-055 (Stay curious. Build what’s next. hero with the Growth Learning Model, Inside XionTechs tiles, five flip cards, Find your next challenge.; Why you’ll grow here removed); " + SITE_WIDE,
    "job.html": "ENH-026 (fits phone screens); " + SITE_WIDE,
    "demo.html": "ENH-011 (checklist says five steps); " + SITE_WIDE,
    "privacy.html": SITE_WIDE,
    "404.html": "Batch 1 (no label above the heading); ENH-043 (You’ve wandered off the trail, with a trail map); ENH-052 (no underline in the heading); " + SITE_WIDE,
  },

  // the change list printed at the top of wireframes-final.md
  table: `## Changes since the original

| Where | Original (first draft) | Now | Entry |
| --- | --- | --- | --- |
| Header, every page | Menu in the middle, Book a demo button, EN/VI toggle, Products and Services mega menus | Menu on the right, no Book a demo button, EN/VI dropdown last | Batch 1 |
| Header, every page | Products mega menu; mist pill on hover; "Menu" text button on small screens | Products is a plain link (Services already was); amber underline under the word on hover; hamburger icon before the language dropdown; no header border | ENH-002 |
| Every page | Small labels above headings; some text under 11.5px; some controls under 44px | No labels above headings; text at least 11.5px; controls at least 44px; one tokenised stylesheet | Batch 1 |
| Every page | 112px around sections; 48px under a heading; 14px between a heading and its description; content revealed on its own | 64px around sections (48px on phones); 24px under a heading; 20px between a heading and its description; each section's heading appears first, then its content | ENH-004, ENH-006, ENH-009 |
| Home, hero | Underlined "connected"; five stats; silk on the right only | Amber "connected"; no button glow; two stats ("25+ Years", "8") that count up from 0; silk across the hero, quieter on the left, fading out before the stats; bigger headline on small screens | ENH-002 |
| Home, below the hero | Two front doors overlapping the hero | Removed here; their content is the first row of Why XionTechs | ENH-002, ENH-004 |
| Home, Our partners | — | New: placeholder logo strip that scrolls in a loop (pauses on hover, focus or tap); heading left-aligned | ENH-003, ENH-008 |
| Home, Why XionTechs | — | New in Batch 1 (four tiles); rebuilt as a four-card bento: Products with app logos, Delivery with live clocks, Industries with a "+3" reveal, Outsourcing services; a small "Get IT Done" line | Batch 1, ENH-004 |
| Home, Case studies | — | New (ENH-003); now "Work built with our partners.": a full-width slider of six placeholder partner cards (partner name, description, "View case study") with carousel dots | ENH-003, ENH-006 |
| Home, process | "From your request to launch, in four steps." under a small label, four cards | "How we approach.": a light row of five steps (Discovery to Deployment), one short line each, joined by a line, with "See how we work" to Services, on a blue gradient (now on the page's light blue, with more space and the link over step 05: ENH-070 to ENH-072) | Batch 1, ENH-009, ENH-012 |
| Services, process | "Our 4-D process": four cards | "How we work.": the full five-step component (layered diagram, step tabs with the chosen step highlighted, detail panel) on a blue gradient (now on light blue: ENH-065); About and Contact say five steps | ENH-011 |
| Home, products | Four-app bento with phone mockups, right after the doors | "What we build.": seven equal app cards (PXP, LXP, SXP, IoT, AI Tutor, AI Timetable, AI Grader) in a row with back and forward buttons, below the process | Batch 1, ENH-005, ENH-008, ENH-009, ENH-013, ENH-021 |
| Home, eight services | Eight service cards | Removed from Home (they stay on Services) | Batch 1 |
| Home and News, news | "Latest from XionTechs." with a placeholder note; pills "Product · PXP" | One-line intro with "See all news" on the same row; an app's story shows only the app name in its pill | ENH-007 |
| Products, hero | "Four apps. One connected school." with a breadcrumb, two buttons and tablet and phone mockups, on amber | "Built apart. Better together.", no button, and four app cards (PXP, LXP, SXP, IoT) around an X tile joined by lines, on a warm light background with slowly drifting glows and a Pause motion button (shared with Home) | ENH-014, ENH-018, ENH-020 |
| Products, after the apps | — | New: "A day at school.", a five-step timeline (07:45 to 15:30) on dark blue that plays step by step once, filling the rail and each dot with amber | ENH-015, ENH-023 |
| About, hero | Navy hero "Tech made simple. Solutions made powerful." with a breadcrumb and description; five key-fact figures; "Two strengths, one team." | "We’re XionTechs, technology built with ownership." ("ownership" in amber) over soft pastel peaks; below it the mountain story "Inspired by a mountain. United by purpose.": two chapters (the vision, then the pioneers who founded newXion) beside a transparent mountain that fills to the summit, where newXion labels the X; no place name | ENH-030, ENH-046, ENH-049 to ENH-051, ENH-056, ENH-057 |
| About, FAQ | "Frequently asked questions." above one column of nine bordered cards | "Your question, we answer": the same nine questions in two columns of hairline rows, closed by default, a + or − at the right of each; on white (the clouds and light-to-navy background were removed in ENH-059) | ENH-016, ENH-059 |
| About, FAQ background | — | The clouds and gradient hold still; the drifting and the sheen are gone | ENH-019 |
| About, FAQ last row | The ninth question alone on the last row | "Still have a question? Ask us directly" fills the slot beside it, linking to the contact form | ENH-031 |
| About, hero on very large screens | — | On screens at least 1500 × 1050 the held story widens and grows, roughly halving the empty space below it | ENH-032 |
| Services, whole page | Navy hero; white and grey bands; amber email band | One white-and-amber background flowing down the page (no blue); light hero; How we work on amber with a navy step list (since reworked: navy hero panel, light blue below, ENH-065 and ENH-069) | ENH-033 |
| News, whole page | Light hero with its own glow; white stories; amber email band | White with light blue shading throughout, header included; filter buttons no longer turn into "NaN" | ENH-034 |
| Careers, whole page | Bright amber hero; white and grey bands | One pastel, light-amber background flowing down the page; light hero | ENH-035 |
| News, whole page (again) | Product/Company/Schools/Team filters; compact cards | "What we’re building, learning and sharing"; filters by audience (Schools, Students, Parents, Company); full-photo story cards with the newest featured; hover or focus lifts the card and shows "Read story" | ENH-037 |
| Story page | Placeholder headline and body | An editorial article: Back to News, audience label and date, headline, summary, wide rounded photo, subheadings, amber pull quote, inline photo | ENH-037 |
| Every page, headings | Display headings at 500 (reading as bold); page titles in five sizes; Products titles in the body font | One page-title style; display headings at 300 and card titles at 400; the guideline's line height and letter spacing | ENH-038, ENH-039, ENH-040 |
| Careers, Life at XionTechs | Three photo frames in a row | Replaced by Inside XionTechs tiles (ENH-055); the photo reel is gone | ENH-040, ENH-041, ENH-055 |
| News content | Sample stories | Four newXion newsroom stories (news-style titles, fuller articles) plus marked mock stories for Students and Parents; a lead story and square cards (ENH-053); Home and Products rows use the story cards | ENH-042, ENH-044, ENH-045, ENH-047, ENH-053 |
| Every page, footer | Flat footer top | A mountain ridgeline; a small climber stands at a spot set by the page’s place in the navigation (Home at the foot, Careers on the summit) and walks there between pages | ENH-043 to ENH-045 |
| 404 | “We couldn’t find that page.” | “You’ve wandered off the trail.” with a trail map from You are here to Home | ENH-043 |
| Forms (contact, demo, job) | Check-mark thank-you | A flag rises on a small summit above “Summit reached.” and the thank-you | ENH-043 |
| Email and contact sections | Fixed amber or navy boxes with corner rings | Home's contact, and the email sections on About and News, blend into the colours around them; no rings; Services has no email section (ENH-055); About's is white (ENH-059) | ENH-036, ENH-055, ENH-059 |
| Products, the apps | Four separate sections (PXP, LXP, SXP, IoT) with their own layouts, and a PXP / LXP / SXP / IoT / Updates bar | Seven stacked app cards (SXP, IoT, AI Timetable, AI Grader, PXP, LXP, AI Tutor) that pin and replace one another on desktop; phone or browser mockup, app name, one sentence, a Features list, store or View prototype buttons; School / Parents / Students pills that jump and highlight | ENH-020 |
| Products, background | Separate coloured bands per section | One background flowing down the page: white with amber dots, bright amber through the apps, easing into light blue by AI Tutor, then dark blue to the footer | ENH-022 |
| Products, updates and last band | "See all news" below the stories; navy band with a ring illustration | "See all news" on the heading row; plain dark navy band, continuous with the footer | ENH-024 |
| Every page, type | Bold headings, labels and buttons (600 to 700) | The same fonts and sizes at weight 500; body 400 | ENH-025 |
| Job page and Home contact, phones | The job page ran 89px past a phone screen; Home ran 2px at 320px | Both fit the screen at every width | ENH-026 |
| About, after the intro | Navy offices and email band; blue FAQ | Plain white from the mountain story to the footer; two office cards with a city drawing each (Plano balloons, Ben Thanh Market), local time, delivery-center tag and icon rows for address, phone, WhatsApp and email | ENH-050 to ENH-055, ENH-058, ENH-059 |
| Services, more | Four-step process; email band | "What can we help you achieve?" before How we work; three facts (now the 24/7, 20+ and 25+ cards, ENH-069); no email band | ENH-048, ENH-055 |
| Careers, whole page (again) | Pastel hero; event reel; Why you’ll grow here | "Stay curious. Build what’s next." with the Growth Learning Model cycle; Inside XionTechs tiles; five flip cards; "Find your next challenge."; Why you’ll grow here removed | ENH-049, ENH-054, ENH-055 |
| Products, audience tabs | School / Parents / Students pills with colour dots | Transparent tabs on a light frosted bar; the selected tab is amber only where that reads, navy over amber; reached A day at school dots show a flag | ENH-049 to ENH-052 |
| News, layout | Bento grid of mixed shapes | One large lead story (the newest), then square cards three to a row; two thin company posts removed | ENH-047, ENH-051, ENH-053 |
| Footer, every page | Plain link columns | Products: For schools, For students, For parents; Company: News, About us, Careers; offices with icons, Vietnam Delivery Center first, US Delivery Center second; phone codes in brackets; the climber only climbs; XionTech X as the site icon | ENH-051, ENH-056 to ENH-058 |
| Careers, background | Pastel amber with a navy Inside XionTechs band | One light gradient: light blue at the top, white in the middle, amber towards the footer | ENH-060 |
| Services, top of page | Light hero, facts strip, eight cards in a grid, Three ways, Industries | A rounded navy hero panel and a light blue Eight services panel with a gap between them; four metric cards (24/7, 20+, 25+, 4 industries) sit across the gap; the Eight services heading stays in view beside its cards; Three ways and Industries removed | ENH-061, ENH-069, ENH-071, ENH-072 |
| Services, background and motion | White with amber washes | Light blue below the panels turning white at the end, with white and amber glows; metric cards spring in, service cards rise with a tilt, outcome cards slide in from the sides | ENH-065, ENH-070 |
| Products, audience tabs (again) | Transparent tabs on a frosted strip | Larger tabs with icons on exactly the page colour behind them | ENH-062 |
| News, title, motion and sign-up | What we’re building, learning and sharing; demo email band | Catch up with us; cards unfold one by one as they scroll in; Subscribe to our newsletter with an in-place thank-you | ENH-063, ENH-066 |
| Home, background | Separate white, grey and blue bands | One background: the hero's navy through Our partners and Why XionTechs, lightening through Work built with our partners, light blue behind How we approach, white and light amber into the contact form, with no visible edges | ENH-070 to ENH-073 |
| About, background | White after the intro | White with soft light blue glows | ENH-067 |
| Footer and climber | About; climber outline | About us; Vietnam email; a bolder hiker with an amber backpack; every page leaves room above it | ENH-064, ENH-073 |
| Design system | None | design-system.html: brand, colour, surfaces and page backgrounds, type, space and shape, icons, illustration, components, patterns, motion and voice, all read from css/site.css; unused styles removed and the Products showcase card added | ENH-074, ENH-090 |
| Home, hero and order | Product headline, mockups, two figures | What XionTechs does, Get in touch, five figures, two cards across the hero edge; then Capabilities, Core values, How we approach (the 4-D process), case studies, news, contact; no Our partners or What we build | ENH-086 to ENH-088 |
| Products page | Stacked app cards (seven apps) | Four showcase cards (Parent Hub, Staff Hub, IoT, AI Tutor): tagline as the title, a square expand icon that opens the app's detail view on the same page, screenshot centred | ENH-087, ENH-089 |
| Process | Five-step How we work | The original 4-D process with QA inside Development | ENH-087 |
| App names | PXP, SXP, LXP | Parent Hub and Staff Hub (P-Hub, S-Hub); no Learner Hub | ENH-086, ENH-087 |
| Footer climber | Stays at the highest page reached | Walks one step up on each page, summit on Careers | ENH-077 |
| Home, last section | Amber "See it working at your school." email band (Book a demo) | Amber contact form "Have something you want to build?"; example phone number as placeholder; quiet button | ENH-001, ENH-010 |`,
};
