---
id: SPEC-ENH-A3-header
owner: Andy
build_day: 2026-10-08
depends_on: ["E-A1", "E-A2"]
companions:
  - ../../enhancement-2026-10-07/README.md
  - ../../decisions-2026-10-01.md
  - ../../../prototype-enhancement/prototype/index.html
  - ../../../prototype-enhancement/prototype/css/site.css
  - ../../../prototype-enhancement/prototype/js/site.js
sources:
  - ../../../prototype-enhancement/enhancement-log.md
---

# E-A3 A simpler header

Covers: ENH-002 (header part), ENH-085, and the header changes the prototype made before the log
started (no Book a demo button, menu on the right).

## Why

The prototype header is six plain links with a quiet hover. It is the same on every page, so it is
what the demo audience sees most.

## Capabilities (Tier 1)

- **CAP-1 Links.**
  - Home, Products, Services, News, About and Careers, in that order, as plain links.
  - Home is marked current only when the path is exactly `/`; never use a prefix match, or it is
    current on every page, the 404 included. The other links keep their current section detection.
  - The logo still goes home.
  - Remove the Products and Services mega menus. Decision T11 (hover-opened mega menus) no longer
    applies; say so in the PR.
- **CAP-2** Remove the Book a demo button from the header and the mobile menu, and the header's
  bottom border.
- **CAP-3 Hover and focus.**
  - On hover, a 2px amber underline under the word only, with no pill background.
  - 30px between links.
  - The current item at weight 500.
  - The focus ring stays at 2px (decision T9).
- **CAP-4 Mobile button.**
  - A Phosphor `List` icon that changes to a cross while the menu is open, 44px, with the
    screen-reader name "Menu".
  - The mobile menu lists the same six links.
  - The menu still closes when a link is chosen or the window grows past 1080px (decision T6).

## Constraints

- Files: `site-header.tsx`, `site-nav.tsx`, `nav-data.ts`, `mobile-menu.tsx` and their tests. E-A1
  (weights) and E-A2 (names) also edit these files, so start after both merge.
- `nav-data.ts` also holds section detection and the mega-menu footers. Remove only what nothing else
  uses; grep first.
- Update `e2e/a11y.spec.ts` (around line 226 it expects hidden `#mega-products` and `#mega-services`) in
  this task.
- Definition of Done from `CLAUDE.md`.

## Non-goals for this build (Tier 2, after the demo)

- The EN/VI dropdown (Q10, Story 1.2).

## Open questions

- Q8: default "no Book a demo in the header". If the answer differs, keep a Book a demo link.

## Success signal

On the preview, Home is underlined as current only on `/`, Tab moves through six links, and the
mobile menu opens and closes from the hamburger icon.

## Request to paste

```
/bmad-build _bmad-output/specs/andy/spec-enh-a3-header — E-A3 header with six plain links (Home first, current only on "/"), no mega menus, no Book a demo, underline hover, hamburger icon. Branch feature/enh-a3-header from an up-to-date develop after E-A1 and E-A2 merge. UI task: UX checks table before coding. Update e2e/a11y.spec.ts.
```
