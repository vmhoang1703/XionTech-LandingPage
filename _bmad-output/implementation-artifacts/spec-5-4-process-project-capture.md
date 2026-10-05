---
title: 'Story 5.4: 4-D process at #process and project capture'
type: 'feature'
created: '2026-10-05'
status: 'in-progress'
baseline_commit: 'f38d72fb07e0c56c4925bf52e0d97c144ddacb2e'
route: 'oneshot'
review_loop_iteration: 0
context: ['{project-root}/AGENTS.md']
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `/services` ends after the eight services. The hero's "See our 4-D process" and the mega menu's "See the process" (`/services#process`) have no target. Quân (Flow 2) cannot start a project from the page. Contract: `_bmad-output/specs/sammy/spec-5-4-process-project-capture/SPEC.md` (CAP-1 to CAP-3).

**Approach:** Place two finished components after the services section, ported from the prototype `services.html` (lines 78–138):
- **4-D band:** `<section id="process" class="sec surface-navy gridbg">`, as Home's `HomeProcess` does it.
  - Its `.sec-head` holds the label "Our 4-D process", the h2 "From your request to launch, in four steps." and the lede "Every step ends with something you can see, test and approve."
  - It renders the shared `ProcessFlow` (3.6). The flow takes the Services step copy as data: the prototype's longer step lines, plus "A clear scope, estimate and delivery plan." for Discovery. The icons and the start and end nodes stay those of `processFlow`.
- **Capture:** `CaptureBand kind="project"` (2.4) last. Its copy, validation and redirect to `/demo#project` with the email prefilled already exist.
- **Anchor:** `#process` gets the same `scroll-margin-top` as the service cards (`.svc[id]`, from `--spacing-anchor-offset`), so its heading lands below the sticky header.
- **Copy:** in `src/content/services.ts`.
- **Boundaries:** no change to `ProcessFlow`, `CaptureBand`, Home, `@theme`, `layout.tsx` or `src/components/layout/*`.

</frozen-after-approval>

## UX checks

Sources: SPEC CAP-1 to CAP-3, `EXPERIENCE.md` (4-D process; Email capture; Reduced motion; Responsive), `DESIGN.md` (Services surfaces line 440), prototype `services.html` 78–138.

| Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| ---- | --------------- | ----- | ------------------ | ------ | ------ | ------- |
| 4-D band | page loads | — | navy band with grid texture after the services; label "Our 4-D process", h2, lede | — | CAP-1, prototype | ✅ walk: navy glow + gridbg after services; label, h2, lede; page.test |
| 4-D flow | scrolled 30% into view | — | amber track fills, steps enter one after another; Services step lines and "You receive" lines from the prototype | 2.4s fill; steps 0.3/0.85/1.4/1.95s | CAP-1, EXPERIENCE.md 4-D process | ✅ walk: armed → on, track 1192/1192; Services step and receive lines; page.test |
| 4-D flow | width above 1080px | — | one row with track and end nodes; the four "You receive" rows align at the same height | — | CAP-1, AC-UI-2 | ✅ walk: 1 row of 4, receive rows all at y 585 |
| 4-D flow | width 1080px and below / 640px and below | — | track and end nodes hidden; steps 2 columns, then 1 | — | EXPERIENCE.md Responsive | ✅ walk: 899 and 640 → 2×2, track and end node hidden; 390 → 1 column. pending: at exactly 1080px still 4 in a row and at 640px 2 columns (site-wide ≥/≤ breakpoint question, Amber/Hoang) |
| Hero "See our 4-D process" | click | mouse | URL ends `#process`; the h2 fully below the 72px header after the smooth scroll | on click | CAP-1, AC-NAV-5 | ✅ walk: /services#process, h2 230–331 below header 72 |
| Hero "See our 4-D process" | Enter | keyboard | same landing | on key | CAP-1 | ✅ walk: same landing |
| Mega menu "See the process" | hover Services, click | mouse | lands on `/services#process`, h2 fully visible | on load | CAP-1 | ✅ walk: from Home, h2 230–331 visible |
| `/services#process` | open directly at 1280 and 390px | link | h2 fully below the header | on load | CAP-1 | ✅ walk: h2 at 230 (1280), 198 (390) |
| Capture band | page loads | — | amber band last before the footer; "Tell us what you're building.", lede, "Work email" field, navy "Start a project" | — | CAP-2, prototype | ✅ walk: last in main, amber gradient, copy, navy button; page.test |
| Capture | submit an invalid email | keyboard | "Please enter a valid email address." shown; focus on the field; no navigation | on submit | Story 2.4 behaviour | ✅ walk: error shown, focus on field, URL unchanged |
| Capture | submit a valid work email | keyboard, mouse | lands on `/demo#project`, Outsourcing project tab selected, scrolled to the form, email prefilled; email not in the URL | after send | CAP-2, AC-FORM-2 | ✅ walk (POST intercepted): /demo#project, Outsourcing tab, email prefilled, form top 307, no email in URL |
| Page rhythm | page loads | — | navy hero, navy 4-D band, exactly one amber band (the capture) | — | CAP-3 | ✅ walk and page.test: 1 hero-navy, 1 surface-navy, 1 amber |
| Whole page | reduced motion | — | full 4-D track and all steps shown at once; anchor jumps are instant | — | EXPERIENCE.md Reduced motion | ✅ walk: flow static, scroll-behavior auto, h2 at 198 on load |
| Whole page | width 390px | — | no sideways scroll; capture field above the button | — | EXPERIENCE.md Responsive | ✅ walk: no sideways scroll; input above button (input 20px tall, from Story 2.4, deferred) |

## Implementation Notes

- **Test-first.** `npx vitest run src/app/services/page.test.tsx` first failed with 5 failures, 12 passed:
  - no `section#process`;
  - no list named "4-D process";
  - no heading "Tell us what you're building.";
  - no amber band;
  - no `#process` scroll-margin rule.

  After the change, `npx vitest run src/app/services src/content` gave 27 passed.
- **Copy.** `servicesProcess` in `src/content/services.ts` spreads `processFlow` and overrides only `line` and `receive` per step, so the icons and the start and end nodes stay shared with Home.
- **Page.** `src/app/services/page.tsx` appends `<section id="process" class="sec surface-navy gridbg">` (label, h2, lede, `ProcessFlow`), then `<CaptureBand kind="project" />`.
- **CSS.** `src/app/globals.css` adds `#process` to the 5.2 anchor rule (`.svc[id], #process`); there is no new token.
- **Two existing tests updated on purpose:**
  - The CSS contract now allows `sr-only`, the Tailwind utility on the capture band's honeypot label.
  - The `.svc[id]` regex accepts a selector list.
- **Page tests.** `page.test.tsx` mocks `next/navigation` and stubs `matchMedia` and `IntersectionObserver`, as the Home page test does.
- **Smoke.** `e2e/services.spec.ts` also checks for `<section id="process"`, the 4-D h2 and the capture heading.

## Acceptance Evidence

Captured on 2026-10-05 on a production build (`next start -p 3005`).

**Commands**

- `npm test` -- exit 0 -- Test Files 73 passed (73), Tests 1105 passed (1105)
- `npm run lint && npm run typecheck && npm run format:check` -- exit 0 -- All matched files use Prettier code style!
- `npm run test:coverage && npm run coverage:diff` -- exit 0 -- Total: 3 lines, Missing: 0 lines, Coverage: 100%; branches on page.tsx 2/2
- `npm run test:smoke` -- exit 0 -- 14 passed (14.4s)

**Artifacts**

- [observed.md](spec-5-4-process-project-capture-evidence/observed.md) -- 3140 bytes -- sha256 bbaaaccaa71a
- [walk-output.txt](spec-5-4-process-project-capture-evidence/walk-output.txt) -- 2462 bytes -- sha256 99f4cafba72a
- [verification.txt](spec-5-4-process-project-capture-evidence/verification.txt) -- 5745 bytes -- sha256 9982dc068952
- [process-1280.png](spec-5-4-process-project-capture-evidence/process-1280.png) -- 549676 bytes -- sha256 01a1863d462c
- [process-landing-1280.png](spec-5-4-process-project-capture-evidence/process-landing-1280.png) -- 571876 bytes -- sha256 23fbc67b8c61
- [process-390.png](spec-5-4-process-project-capture-evidence/process-390.png) -- 387557 bytes -- sha256 fd92a9928835
- [capture-1280.png](spec-5-4-process-project-capture-evidence/capture-1280.png) -- 121346 bytes -- sha256 4b80e02573b8
- [demo-project-after-capture.png](spec-5-4-process-project-capture-evidence/demo-project-after-capture.png) -- 507240 bytes -- sha256 aaf348ac123e

**Not captured**

- A real mail send. The walk answered `POST /api/contact` itself, because delivery is Story 2.4's and a live send would mail the inbox.
- Touch and pen input on a real device.
