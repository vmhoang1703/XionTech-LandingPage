---
title: 'Story 5.4: 4-D process at #process and project capture'
type: 'feature'
created: '2026-10-05'
status: 'done'
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
| 4-D band | page loads | — | navy band with grid texture after the services; label "Our 4-D process", h2, lede | — | CAP-1, prototype | ✅ walk: background-image radial amber glow on navy, gridbg, after services; label, h2, lede; page.test |
| 4-D flow | scrolled 30% into view | — | amber track fills, steps enter one after another; Services step lines and "You receive" lines from the prototype | 2.4s fill; steps 0.3/0.85/1.4/1.95s | CAP-1, EXPERIENCE.md 4-D process | ✅ walk: armed → on, track 1192/1192; Services step and receive lines; page.test |
| 4-D flow | width above 1080px | — | one row with track and end nodes; the four "You receive" rows align at the same height | — | CAP-1, AC-UI-2 | ✅ walk: 1 row of 4, receive rows all at y 585 |
| 4-D flow | width 1080px and below / 640px and below | — | track and end nodes hidden; steps 2 columns, then 1 | — | EXPERIENCE.md Responsive | ⏳ pending: 899px → 2×2 and 390px → 1 column, with the track and end node hidden (`clip-path: inset(50%)`). At exactly 1080px the flow is still 4 in a row with the track, and at exactly 640px still 2 columns: the shared `lg`/`sm` breakpoints switch at ≥ (site-wide ≥/≤ question, Amber/Hoang) |
| Hero "See our 4-D process" | click | mouse | URL ends `#process`; the h2 fully below the 72px header after the smooth scroll | on click | CAP-1, AC-NAV-5 | ✅ walk: /services#process, h2 230–331 below header 72; a repeat click with the hash already set lands the same |
| Hero "See our 4-D process" | Enter | keyboard | same landing | on key | CAP-1 | ✅ walk: same landing |
| Mega menu "See the process" | hover Services, click | mouse | lands on `/services#process`, h2 fully visible | on load | CAP-1 | ✅ walk: from Home, h2 230–331 visible |
| `/services#process` | open directly at 1280 and 390px | link | h2 fully below the header | on load | CAP-1 | ✅ walk: h2 at 230 (1280), 198 (390) |
| Capture band | page loads | — | amber band last before the footer; "Tell us what you're building.", lede, "Work email" field, navy "Start a project" | — | CAP-2, prototype | ✅ walk: last in main, background linear-gradient amber, copy, navy button; page.test |
| Capture | submit an invalid email | keyboard | "Please enter a valid email address." shown; focus on the field; no navigation | on submit | Story 2.4 behaviour | ✅ walk: error shown, focus on field, URL unchanged |
| Capture | submit a valid work email | keyboard, mouse | lands on `/demo#project`, Outsourcing project tab selected, scrolled to the form, email prefilled; email not in the URL | after send | CAP-2, AC-FORM-2 | ✅ walk (POST intercepted): by click and by Enter → /demo#project, Outsourcing tab, email prefilled, form top 307, no email in URL |
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
- **Review patches.**
  - `servicesStepCopy` is keyed by step number, and Discovery alone overrides "You receive". A new `services.test.ts` case pins one entry per shared step. The h2 reuses `homeProcess.title`.
  - Tests:
    - The `.svc[id]` regex is tight again: `(\s*,\s*#process)?`.
    - The capture is asserted as the page's last element.
    - Smoke also checks the hero `href="#process"` and that `#process` comes before the capture.
  - The hero "See our 4-D process" is now a plain `<a>`. `next/link` did not scroll on a second click while the hash was already `#process`; the walk measured the h2 still at 1967. jsdom cannot observe the scroll, so the browser walk is its test: after the fix, a repeat click lands at 230.
  - The walk now logs `background-image` and `clip-path`, submits by click and by Enter, fails if a scroll never settles, and caps the error lookup at 2 s.

## Review Triage Log

One-shot review on 2026-10-05, five layers: Blind Hunter, Edge Case Hunter, Verification Gap, Acceptance Auditor, and the Security Auditor (clean).

- **Hero hash link does nothing on a repeat click** (Blind Hunter) — medium, patch: plain `<a>`. The walk before the fix: h2 at 1967, not visible; after: 230–331.
- **Step copy matched by array index; three `receive` strings and the h2 copied from Home** (Edge Case Hunter, Blind Hunter) — low, patch: keyed by `num`, Discovery-only `receive`, `homeProcess.title` reused, plus a keys test.
- **Background claims not backed by the walk output** (Acceptance Auditor, Verification Gap, Edge Case Hunter, Blind Hunter) — low, patch: the walk now logs `background-image`. The observed gradients are recorded word for word.
- **The 1080px/640px row was marked ✅ while the walk showed a mismatch at exactly those widths** (Acceptance Auditor, Blind Hunter) — medium, patch to the record: the row is now ⏳ pending, naming the site-wide ≥/≤ breakpoint question. The breakpoints live in the shared 3.6 component and `@theme`, outside this story.
- **"Hidden" inferred from box size; mouse submit path not run** (Blind Hunter) — low, patch: the walk reads `clip-path: inset(50%)` and submits once by click and once by Enter.
- **`.svc[id]` regex loosened; "capture last" test ignored non-section elements; smoke did not pin the hero href** (Edge Case Hunter, Blind Hunter) — low, patch.
- **Walk robustness: settle loop could pass mid-scroll; 30 s stall on a missing error** (Edge Case Hunter) — low, patch: throw if not settled; a 2 s timeout.
- **Walk: swallowed launch error; no try/finally** (Edge Case Hunter) — low, rejected: an evidence script run by hand; a failed run shows as a non-zero exit, as seen in 5.2.
- **`branches on page.tsx 2/2` not in `verification.txt`** (Blind Hunter) — low, patch: the evidence now cites `coverage/lcov.info` for it, next to the `C1 ok` line.
- **`#process` landing checked only by CSS text and a manual walk** (Verification Gap) — medium, defer: a browser Playwright project is needed (5.2 entry). A new entry names `#process`.
- **Mega menu "See the process" may not re-scroll when already on `/services#process`** (Blind Hunter) — maybe-false, medium if true, defer: Andy's `site-nav.tsx` uses `next/link`. Settle it by clicking the menu link twice on `/services#process`.
- **No AI log entry** (Blind Hunter) — false at the time: written at the end of this run.
- **2 MB of PNG evidence in git** (Blind Hunter) — low, rejected: the team's evidence convention since Story 1.1.

## Acceptance Evidence

Captured again after the review patches on 2026-10-05, on a production build (`next start -p 3005`).

**Commands**

- `npm test` -- exit 0 -- Test Files 73 passed (73), Tests 1106 passed (1106)
- `npm run lint && npm run typecheck && npm run format:check` -- exit 0 -- All matched files use Prettier code style!
- `npm run test:coverage && npm run coverage:diff` -- exit 0 -- Total: 3 lines, Missing: 0 lines, Coverage: 100%; "C1 ok: 2 changed file(s) with branch coverage >= 80%" (`coverage/lcov.info`: page.tsx 2/2 branches)
- `npm run test:smoke` -- exit 0 -- 14 passed (15.1s)

**Artifacts**

- [observed.md](spec-5-4-process-project-capture-evidence/observed.md) -- 3574 bytes -- sha256 dfed596d1f37
- [walk-output.txt](spec-5-4-process-project-capture-evidence/walk-output.txt) -- 3014 bytes -- sha256 6ab4b27c26ef
- [verification.txt](spec-5-4-process-project-capture-evidence/verification.txt) -- 5746 bytes -- sha256 e8d7acfd4b59
- [process-1280.png](spec-5-4-process-project-capture-evidence/process-1280.png) -- 549894 bytes -- sha256 79b193a501e2
- [process-landing-1280.png](spec-5-4-process-project-capture-evidence/process-landing-1280.png) -- 571876 bytes -- sha256 23fbc67b8c61
- [process-390.png](spec-5-4-process-project-capture-evidence/process-390.png) -- 386589 bytes -- sha256 06ff7841a873
- [capture-1280.png](spec-5-4-process-project-capture-evidence/capture-1280.png) -- 121346 bytes -- sha256 4b80e02573b8
- [demo-project-after-capture.png](spec-5-4-process-project-capture-evidence/demo-project-after-capture.png) -- 507019 bytes -- sha256 526cd6ee77f0

**Not captured**

- A real mail send. The walk answered `POST /api/contact` itself, because delivery is Story 2.4's and a live send would mail the inbox.
- Touch and pen input on a real device.
