---
title: 'Story 3.4: Two front doors'
type: 'feature'
created: '2026-10-05'
status: 'in-progress'
route: 'oneshot'
review_loop_iteration: 0
context: ['{project-root}/AGENTS.md']
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Directly under the Home hero, two doors must send school buyers to Products and companies to Services: the light Products door with the four app badges and chips, the navy Services door with its label and service chips, each one link, overlapping the hero's bottom (FR-13, UX-DR16, AC-A11Y-4). Contract: `_bmad-output/specs/sammy/spec-3-4-two-front-doors/SPEC.md` (CAP-1 to CAP-3).

**Approach:** `src/components/home/front-doors.tsx` (Server Component), placed after the hero and before Andy's capture band. Built first on 2026-10-01 before 1.1 merged with class names 1.1 never defined (`front-door-products`, `product-badge-*`, `industry-chip`), so the doors, badges and chips rendered unstyled. Fixed here by porting the prototype `.doors`, `.door`, `.door-products`, `.door-services`, `.go`, `.badge`, `.b-*`, `.chips`, `.chip` rules into the Home section of `globals.css` `@layer components` with tokens (`@theme` untouched); badges and chips are shared so Story 3.5's bento reuses them. Icons from Phosphor: the arrow circle, and the IoT badge's CPU icon (prototype `ph-cpu`) with a visually hidden "IoT" so the door's name keeps it.

</frozen-after-approval>

## UX checks

Sources: story spec CAP-1 to CAP-3, `EXPERIENCE.md` Component Patterns › Front door and Responsive, `DESIGN.md` (front-door-products, front-door-services, product badges), prototype `index.html` (`.doors`) and `site.css`. Checked by the walk in `spec-3-4-two-front-doors-evidence/`.

| Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| ---- | --------------- | ----- | ------------------ | ------ | ------ | ------- |
| Doors | page load, 1280px | — | two doors side by side directly under the hero, overlapping its bottom by 104px | static | CAP-1 |  ✅ walk: 2 columns, overlap 104px |
| Products door | read | — | white-to-door-tint gradient panel, 28px radius, card shadow; PXP (amber), LXP (navy-soft), SXP (navy/ink, amber text) and IoT (mist, CPU icon) badges; arrow circle; "Products for schools", its line in muted, chips "PXP · Parents", "LXP · Students", "SXP · Staff", "IoT · Campus" in white pills | static | CAP-3, UX-DR16, DESIGN.md front-door-products |  ✅ walk + unit tests: white→rgb(234,240,250) gradient, 28px, card shadow; PXP amber, LXP navy-soft, SXP navy/ink with amber text, IoT mist with CPU svg; line rgb(74,91,120); four white pill chips (after fix: unstyled) |
| Services door | read | — | navy panel; label "Outsourcing services" in Lexend Exa caps; amber arrow circle; "Your software delivery team", its line; chips Product Engineering, AI-Driven Analytics, Staffing, Low-code, Cloud, "+3 more" in glass pills | static | CAP-3, DESIGN.md front-door-services |  ✅ walk + unit tests: navy gradient; label Lexend Exa caps; arrow amber rgb(255,207,6); six glass chips (after fix: unstyled) |
| Door | hover | mouse | lifts 4px; the arrow circle turns to full opacity and rotates −45° | 0.5s / 0.35s | prototype `.door:hover`, `.door:hover .go` |  ✅ walk: lift 4px; arrow opacity 1, rotated −45° |
| Door | click anywhere on the panel | mouse | Products door opens `/products`, Services door opens `/services` | instant | CAP-2 |  ✅ walk: Products → /products, Services → /services |
| Door | Tab | keyboard | one stop per door (2 stops); visible focus ring (navy on the Products door, amber on the Services door) | instant | CAP-2, AC-A11Y-4, EXPERIENCE.md Focus ring |  ✅ walk: Tab after the hero CTA → /products (2px navy) → /services (2px amber) → next section |
| Door | accessible name | — | each link's name includes its title; no interactive element inside either link | static | CAP-2, AC-A11Y-4 |  ✅ walk + unit tests: names start with the badges/label and include the titles; 0 interactive elements inside |
| Door | reduced motion | — | no lift, no rotation | static | NFR-2 |  ✅ walk: lift 0, arrow transform none (after fix: the hover transform still applied) |
| Layout | 899px / 390px | — | one column, overlap 80px; no sideways scroll | static | CAP-1, EXPERIENCE.md Responsive |  ✅ walk: 899px and 390px 1 column, overlap 80px, no sideways scroll |
| Layout | exactly 900px | — | two columns, overlap 104px (1.1 switches at ≥ 900) | static | pending: spec says one column and 80px "at 900px and below"; 1.1 breakpoints switch at ≥ site-wide — ask Amber |  ✅ walk: 2 columns, 104px at 900px (pending Amber) |
| Order | page | — | hero → doors → capture band last | static | 3.4 constraint (capture band last) |  ✅ walk + page test: hero > What we do > capture band |

## Implementation Notes

- 2026-10-05: merged `develop` (3.1–3.3, Story 1.6 motion, capture band); resolved `page.tsx` and its test so the order is hero → doors → capture band.
- Ported the prototype door, badge and chip rules into the Home section of `globals.css` (tokens; `@theme` untouched); the component uses `.doors`, `.door`, `.door-products`, `.door-services surface-navy`, `.go`, `.badge .b-*`, `.chips .chip`, 1.1's `.wrap` and `.label`. Phosphor `ArrowRightIcon` and `CpuIcon` (IoT, with a visually hidden "IoT").
- Test first: 2 new tests failed on the old component and pass on the new one. The first version of one test held a literal backspace character instead of a regex `` (written through a script), so it failed for the wrong reason; replaced with `classList` checks and re-run red/green.
- Under reduced motion the global rule only removes transitions, so the hover lift would still jump; `.door:hover` and `.door:hover .go` have no transform under reduced motion.
- The first walk reported a 611px "lift" because `hover()` scrolled the door into view; the walk now scrolls first.

