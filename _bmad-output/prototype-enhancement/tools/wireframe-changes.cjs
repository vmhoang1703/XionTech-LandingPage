// Change tags for wireframes-final.md. Update this file whenever an enhancement-log entry is approved,
// then regenerate: node _bmad-output/prototype-enhancement/tools/wireframes.cjs final --out _bmad-output/prototype-enhancement/wireframes-final.md
// "Batch 1" = the readability, accessibility and header changes written into the specs before the log existed.

const SITE_WIDE =
  "site-wide rules only (Batch 1 readability; ENH-004 heading-first reveal; ENH-006 and ENH-009 spacing).";

module.exports = {
  // header and footer frames (shared by every page)
  header: "Batch 1 · ENH-002",
  footer: "content unchanged",

  // section tags, keyed by page and the id of the section heading
  sections: {
    "index.html#h1": "Batch 1 · ENH-002", // Home hero
    "index.html#partners-h": "new in ENH-003 · left-aligned in ENH-008",
    "index.html#why-h": "new in Batch 1 · rebuilt in ENH-004",
    "index.html#cases-h": "new in ENH-003 · slider in ENH-006",
    "index.html#approach-h": "rebuilt in ENH-009 · light version in ENH-012",
    "services.html#process-h": "five steps in ENH-011 (full version)",
    "index.html#prod-h": "Batch 1 · moved in ENH-005 · What we build in ENH-008, ENH-009 · Coming soon in ENH-013",
    "index.html#news-h": "ENH-007",
    "index.html#contact-h": "new in ENH-001 · ENH-010",
    "products.html#h1": "rebuilt in ENH-014", // Products hero
    "products.html#day-h": "new in ENH-015",
  },

  // one line under each page title
  pages: {
    "index.html": "Batch 1, ENH-001 to ENH-013 (see the change list at the top).",
    "products.html": "ENH-014 (hero), ENH-015 (school-day timeline); " + SITE_WIDE,
    "services.html": "ENH-011 (the five-step How we work. replaces the 4-D process); " + SITE_WIDE,
    "about.html": 'Batch 1 (no label above "Our core values."); ENH-011 (FAQ says five steps); ' + SITE_WIDE,
    "news.html": "ENH-007 (a story about an app shows the app name in its pill); " + SITE_WIDE,
    "news-story.html": SITE_WIDE,
    "careers.html": SITE_WIDE,
    "job.html": SITE_WIDE,
    "demo.html": "ENH-011 (checklist says five steps); " + SITE_WIDE,
    "privacy.html": SITE_WIDE,
    "404.html": "Batch 1 (no label above the heading); " + SITE_WIDE,
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
| Home, process | "From your request to launch, in four steps." under a small label, four cards | "How we approach.": a light row of five steps (Discovery to Deployment), one short line each, joined by a line, with "See how we work" to Services, on a blue gradient | Batch 1, ENH-009, ENH-012 |
| Services, process | "Our 4-D process": four cards | "How we work.": the full five-step component (layered diagram, step tabs with the chosen step highlighted, detail panel) on a blue gradient; About and Contact say five steps | ENH-011 |
| Home, products | Four-app bento with phone mockups, right after the doors | "What we build.": six equal app cards (PXP, LXP, SXP, IoT, and AI Tutor and AI Timetable marked Coming soon) in a row with back and forward buttons, below the process | Batch 1, ENH-005, ENH-008, ENH-009, ENH-013 |
| Home, eight services | Eight service cards | Removed from Home (they stay on Services) | Batch 1 |
| Home and News, news | "Latest from XionTechs." with a placeholder note; pills "Product · PXP" | One-line intro with "See all news" on the same row; an app's story shows only the app name in its pill | ENH-007 |
| Products, hero | "Four apps. One connected school." with a breadcrumb, two buttons and tablet and phone mockups, on amber | "Built apart. Better together.", one "Explore products" button, and four app cards (PXP, LXP, SXP, IoT) around an X tile joined by lines, on a warm light background with slowly drifting glows | ENH-014 |
| Products, after the four apps | — | New: "One event. Multiple experiences.", a five-step school-day timeline (07:45 to 15:30) on dark navy | ENH-015 |
| Home, last section | Amber "See it working at your school." email band (Book a demo) | Amber contact form "Have something you want to build?"; example phone number as placeholder; quiet button | ENH-001, ENH-010 |`,
};
