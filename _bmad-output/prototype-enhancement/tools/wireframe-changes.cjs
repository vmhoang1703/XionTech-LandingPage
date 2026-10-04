// Change tags for wireframes-final.md. Update this file whenever an enhancement-log entry is approved,
// then regenerate: node _bmad-output/prototype-enhancement/tools/wireframes.cjs final --out _bmad-output/prototype-enhancement/wireframes-final.md
// "Batch 1" = the readability, accessibility and header changes written into the specs before the log existed.

module.exports = {
  // header and footer frames (shared by every page)
  header: "Batch 1 · ENH-002",
  footer: "content unchanged",

  // section tags, keyed by page and the id of the section heading
  sections: {
    "index.html#h1": "Batch 1 · ENH-002", // Home hero
    "index.html#partners-h": "new in ENH-003",
    "index.html#why-h": "new in Batch 1 · rebuilt in ENH-004",
    "index.html#cases-h": "new in ENH-003",
    "index.html#flow-h": "Batch 1 (heading)",
    "index.html#prod-h": "Batch 1 · moved in ENH-005",
    "index.html#news-h": "content unchanged",
    "index.html#contact-h": "new in ENH-001",
  },

  // one line under each page title
  pages: {
    "index.html":
      "Batch 1, ENH-001 to ENH-005 (see the change list at the top).",
    "products.html":
      "site-wide rules only (Batch 1 readability; ENH-004 spacing and heading-first reveal).",
    "services.html":
      "site-wide rules only (Batch 1 readability; ENH-004 spacing and heading-first reveal).",
    "about.html":
      'Batch 1 (no label above "Our core values."); ENH-004 spacing and heading-first reveal.',
    "news.html":
      "site-wide rules only (Batch 1 readability; ENH-004 spacing and heading-first reveal).",
    "news-story.html":
      "site-wide rules only (Batch 1 readability; ENH-004 spacing and heading-first reveal).",
    "careers.html":
      "site-wide rules only (Batch 1 readability; ENH-004 spacing and heading-first reveal).",
    "job.html":
      "site-wide rules only (Batch 1 readability; ENH-004 spacing and heading-first reveal).",
    "demo.html":
      "site-wide rules only (Batch 1 readability; ENH-004 spacing and heading-first reveal).",
    "privacy.html":
      "site-wide rules only (Batch 1 readability; ENH-004 spacing and heading-first reveal).",
    "404.html": "Batch 1 (no label above the heading); ENH-004 spacing.",
  },

  // the change list printed at the top of wireframes-final.md
  table: `## Changes since the original

| Where | Original (first draft) | Now | Entry |
| --- | --- | --- | --- |
| Header, every page | Menu in the middle, Book a demo button, EN/VI toggle, Products and Services mega menus | Menu on the right, no Book a demo button, EN/VI dropdown last | Batch 1 |
| Header, every page | Products mega menu; mist pill on hover; "Menu" text button on small screens | Products is a plain link (Services already was); amber underline under the word on hover; hamburger icon before the language dropdown; no header border | ENH-002 |
| Every page | Small labels above headings; some text under 11.5px; some controls under 44px | No labels above headings; text at least 11.5px; controls at least 44px; one tokenised stylesheet | Batch 1 |
| Every page | 112px around sections; content revealed on its own | 80px around sections (56px on phones); each section's heading appears first, then its content | ENH-004 |
| Home, hero | Underlined "connected"; five stats; silk on the right only | Amber "connected"; no button glow; two stats ("25+ Years", "8") that count up from 0; silk across the hero, quieter on the left, fading out before the stats; bigger headline on small screens | ENH-002 |
| Home, below the hero | Two front doors overlapping the hero | Removed here; their content is the first row of Why XionTechs | ENH-002, ENH-004 |
| Home, Our partners | — | New: placeholder logo strip that scrolls in a loop (pauses on hover, focus or tap) | ENH-003 |
| Home, Why XionTechs | — | New in Batch 1 (four tiles); rebuilt as a four-card bento: Products with app logos, Delivery with live clocks, Industries with a "+3" reveal, Outsourcing services; a small "Get IT Done" line | Batch 1, ENH-004 |
| Home, products | Four-app bento with phone mockups, right after the doors | A four-app row (Batch 1), now "Apps for every role in school." below the process | Batch 1, ENH-005 |
| Home, eight services | Eight service cards | Removed from Home (they stay on Services) | Batch 1 |
| Home, process | "From your request to launch, in four steps." under a small label | "Our 4-D process: from your request to launch." (label merged into the heading) | Batch 1 |
| Home, Case studies | — | New: three placeholder case study cards and "Start a project" | ENH-003 |
| Home, last section | Amber "See it working at your school." email band (Book a demo) | Amber contact form "Have something you want to build?" | ENH-001 |`,
};
