# UX, accessibility and motion audit — findings tracker (2026-10-16)

Full report with persona journeys, screenshots and measurements:
[2026-10-16-ux-persona-accessibility-audit.html](2026-10-16-ux-persona-accessibility-audit.html)

**How it was run:** headless Edge (Playwright) against the dev server (`localhost:3000`, develop @ c61ef6e), EN with a VI spot-check, desktop 1440×900 and phone 390×844; axe-core WCAG 2.2 AA on 7 pages; performance via Playwright (LCP, CLS, long tasks, idle main-thread %) with and without `prefers-reduced-motion`. Dev-server numbers; re-measure on a production build before quoting.

## Scorecard

| Area | Result |
|---|---|
| Persona journeys (5 personas × 2 viewports) | 8 / 10 succeeded (news reader partial on both) |
| Accessibility test cases | 24 pass · 6 fail · axe-core: 0 violations on 7 pages |
| Layout shift (CLS) | 0.000 on every page |
| LCP (dev server) | < 0.9 s |
| Idle CPU, Home phone | 68% normal → 7% with reduced motion |
| Idle CPU, Products phone | 49% normal → 0% with reduced motion |

## Findings and status

| # | Priority | Finding | Status |
|---|---|---|---|
| 1 | High | No proof (case studies, client logos, outcomes) near CTAs | Deferred — no verified case studies, logos or outcomes yet |
| 2 | High | Contact form doesn't qualify leads (company, interest, timeline) | Open — not scheduled |
| 3 | High | Product dialogs have no context CTA; all CTAs leave the page for `/#contact` | Deferred |
| 4 | High | No conversion tracking (CTA clicks, form start/submit, applications, language switch) | Open — not scheduled |
| 5 | High | Focus escapes the product dialog (5/15 Tab presses) and mobile menu (3/20 stops) | Fixed — `feature/ux-a11y-motion-news-fixes` |
| 6 | Medium | "Pause motion" leaves 3 looping animations running; no pressed state for screen readers | Fixed — `feature/ux-a11y-motion-news-fixes` |
| 7 | Medium | Looping animations burn idle CPU when off-screen / tab hidden | Fixed — `feature/ux-a11y-motion-news-fixes` |
| 8 | Medium | Content hidden without JavaScript (Products 3, Careers 7, News 1 elements) | Fixed — `feature/ux-a11y-motion-news-fixes` |
| 9 | Medium | News stories have no share links (LinkedIn, Facebook, copy link) or next/related stories | Fixed — `feature/ux-a11y-motion-news-fixes` |
| 10 | Medium | Careers has one open role and no general application / talent-pool path | Fixed — email-only "General application" form on Careers, sent to the contact inbox |
| L1 | Low | 1×1 px focusable element on phone Home | Open |
| L2 | Low | Reassurance line next to the form Submit button | Open |
| L3 | Low | Desktop news-card click didn't navigate in time (likely dev-server latency) | Re-check on production build |

## What already works

- Skip link and visible focus on all tab stops checked; one h1, landmarks and correct heading order on every page.
- Contact form: labels, error summary, errors linked to fields, focus moves to the first error.
- `prefers-reduced-motion` honoured: nothing animates, all content stays visible.
- No horizontal scroll at 390 px or 200% zoom; text-spacing override causes no clipping.
- Language switch keeps the current page; Vietnamese persists into Careers.
