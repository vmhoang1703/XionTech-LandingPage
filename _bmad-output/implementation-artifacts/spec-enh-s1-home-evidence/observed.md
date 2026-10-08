# E-S1 Home: observed on a production build

Build from `npm run build` (verification.txt), served with `npx next start -p 3005`, driven by
`walk.mjs` in Chrome (Playwright, `channel: "chrome"`); `/api/contact` answered by the walk.
Full walk output: `walk-output.txt`.

| Surface | Steps | Observed |
| --- | --- | --- |
| `/` at 1280px | load | Title "XionTech \| School Platforms & Software Outsourcing in Vietnam"; order hero > Capabilities. > Our core values. > How we approach. > Latest from XionTech. > See it working at your school.; one H1 |
| Hero | load | H1 "School apps and software teams that get IT done.", highlight amber rgb(255,207,6), `::after` none; no label; 0 device mockups; one button "Get in touch" -> /demo; figures heading "Experience you can count on", 5 columns |
| Doors | load, screenshot `home-1280-doors-edge.png` | Two cards side by side (grid 587px 587px); the navy ends at the cards' middle (light layer starts 175px into the 350px cards); light card h2 rgb(22,54,99) on light bg; badges P-Hub, S-Hub, IoT icon; chips Parent Hub, Staff Hub, IoT, AI Tutor; dark card kicker "Outsourcing services", chips incl. "+3 more"; links /products and /services |
| Products door | Tab from top | Focused with a solid 2px outline |
| Capabilities | load | H2 "Capabilities." + lede; cards 689px + 487px per row (two rows); clocks "Plano 03:52 HCMC 15:52"; motto "Get IT Done Built with ownership. ..." |
| "+3" | mouse click | aria-expanded true, list "Healthcare Logistics Private Equity" visible (`home-1280-industries-open.png`); second click: aria-expanded false, list still shown while the mouse hovers (hover reveal, as in the prototype) |
| "+3" | keyboard Enter, Space | aria-expanded toggles; focus stays on the button |
| "+3" | real touch taps at 390px (hasTouch) | tap 1: expanded true, visible; tap 2: expanded false, hidden (`home-390-industries-tapped.png`) |
| "+3" | JavaScript disabled | List visible with the three industries; clocks show "US Central" and "GMT+7" (`home-nojs-industries.png`) |
| Values | load | "Our core values." / "What guides how we work."; six values, "Get IT Done" Attitude featured; no `id="values"` on Home |
| How we approach | load, `home-1280-process-head.png` | Light (transparent on the flow surface), no label; "See how we work" -> /services#process at the right end of the heading row (aligned to its bottom); at 390px below the heading |
| Removed | load | No bento, no `.svc-grid`, no "Four apps" or "Eight ways" copy |
| Background | load | `.home-flow` linear-gradient #F4F6FA to #F7F9FD, sections transparent on it: no edges |
| Widths | 768px, 390px | Figures 3 columns at 768, 2 at 390; doors and Capabilities one column at 390; no sideways scroll at 1280 or 390 (`home-390-full.png`) |
| Other pages | `/about`, `/services` | About shows 6 values; Services keeps "From your request to launch, in four steps." with the new step 03 copy |
