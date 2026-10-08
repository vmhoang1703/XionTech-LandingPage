---
id: SPEC-ENH-A7-careers
owner: Andy
build_day: 2026-10-08
depends_on: ["E-A1"]
soft_depends_on: ["E-A4"]
companions:
  - ../../enhancement-2026-10-07/README.md
  - ../../decisions-2026-10-01.md
  - ../../../prototype-enhancement/prototype/careers.html
  - ../../../prototype-enhancement/prototype/job.html
  - ../../../prototype-enhancement/prototype/css/site.css
  - ../../../prototype-enhancement/prototype/js/site.js
sources:
  - ../../../prototype-enhancement/enhancement-log.md
---

# E-A7 Careers matches the prototype

Covers: ENH-026 (job page part), ENH-035, ENH-040 (Careers part), ENH-049 (Careers title), ENH-055
(Careers part), ENH-060, ENH-067 (Careers part).

**Tier: decided by Q14.** The default moves the whole task to Tier 2: Careers works today, and much of
its new content is unverified (Q6).

## Why

Careers in the prototype follows Amber's two careers files: a lighter page about how people grow
here, with the roles last.

## Capabilities

- **CAP-1 Hero.**
  - A light hero: "Stay curious. Build what's next.", the lede and "Explore open roles". No breadcrumb.
  - The Growth Learning Model ring (Curious, Learn, Ask, Grow, Improve). A dot travels round once and
    rests on Improve; with reduced motion it stays on Curious and does not move (`js/site.js:283-288`).
  - The model is `[Placeholder]` unless Amber confirms its source (Q6).
- **CAP-2 Inside XionTech.**
  - Five text tiles. Write "XionTech"; the prototype says "Inside XionTechs".
  - Workshops, Client visits, Town halls and Project kickoffs trace to newsroom posts (Project
    kickoffs: "Kicking off a major education initiative with our client in Ho Chi Minh City",
    `js/site.js:93`).
  - "Celebration" is `[Placeholder]` until confirmed (Q6).
- **CAP-3 "Five things that shape the way we work."**
  - Five flip cards, each a `<button>` with `aria-pressed`.
  - The hidden face is `inert`, so screen readers read one face only.
  - With reduced motion the faces swap with no rotation.
  - The five values differ from the six core values, so they are `[Placeholder]` until Amber confirms
    them (Q6).
- **CAP-4 Remove** "Why you'll grow here" and the Life photo frames. Q15 decides what happens to the
  Sanity life-photo code.
- **CAP-5 Roles.**
  - "Find your next challenge." is the last section. Its bottom space is the shared footer clearance
    (E-S4 CAP-4); ENH-067's 96–144px is replaced by ENH-073.
  - The role list and links are unchanged.
- **CAP-6 Background.** One light gradient: light blue in the hero, white in the middle, amber above
  the footer.
- **CAP-7 Job page check.** No sideways scroll from 320px to 1440px (ENH-026). Success shows "Summit
  reached." (E-A4).
- **CAP-8 Page title.** "Careers at XionTech | Software Jobs in Ho Chi Minh City".

## Constraints

- Update the Careers tests and e2e checks in this task.
- `studio/schemas/*` is shared with E-A2 and E-A6: rebase on them before touching it.
- Definition of Done from `CLAUDE.md`.

## Open questions

- Q6 (unverified content): default `[Placeholder]`.
- Q14 (tier): default Tier 2.
- Q15 (life-photo code): default "keep the code and list it in `deferred-work.md`".

## Success signal

On the preview, the growth ring plays once, each flip card turns with Enter or Space, and "Find your
next challenge." is the last section with its roles.

## Request to paste

```
/bmad-build _bmad-output/specs/andy/spec-enh-a7-careers — E-A7 Careers hero with the growth ring, Inside XionTech tiles, five flip cards (buttons, reduced motion), roles last, one gradient. Unverified content ships [Placeholder] (Q6). Branch feature/enh-a7-careers from an up-to-date develop after E-A1 merges. Tier per Q14. UI task: UX checks table before coding.
```
