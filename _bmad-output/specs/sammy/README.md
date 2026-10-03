# Sammy (Son Nguyen) — story specs, Demo-day build

Build window 2026-10-01 to 2026-10-07; 2026-10-08 is for bug fixes and demo practice.
Run each story with `bmad-build` on its own branch (`feature/<n-n>-<slug>`), pointing it at the
spec folder. Plan source: "Demo-day plan" in `../../planning-artifacts/epics.md`.

**Plan C (2026-10-03, decision P1 in `../decisions-2026-10-01.md`):** 9 stories moved from Sammy to Andy (1.7, 2.1, 6.5, 3.7, 6.1, 6.2, 4.1, 4.2, 4.3) so no story waits on another owner. Andy owns everything that uses Sanity or the forms, plus Products; Sammy owns Home, Services and About. Days below are the new plan.

| Day | Story | Spec | Depends on |
| --- | --- | --- | --- |
| Wed 01/10 | 1.5 Site footer (PR #15 open) | [`spec-1-5-site-footer`](spec-1-5-site-footer/SPEC.md) | 1.1 |
| Sat 03/10 | 3.1 Dark Home hero | [`spec-3-1-dark-home-hero`](spec-3-1-dark-home-hero/SPEC.md) | 1.1 |
| Sun 04/10 | 3.2 Silk animation and motion toggle | [`spec-3-2-silk-motion-toggle`](spec-3-2-silk-motion-toggle/SPEC.md) | 3.1 |
| Mon 05/10 | 3.3 Stats band | [`spec-3-3-stats-band`](spec-3-3-stats-band/SPEC.md) | 3.1 |
| Mon 05/10 | 3.4 Two front doors | [`spec-3-4-two-front-doors`](spec-3-4-two-front-doors/SPEC.md) | 3.1 |
| Mon 05/10 | 3.5 Bento and service cards | [`spec-3-5-bento-service-cards`](spec-3-5-bento-service-cards/SPEC.md) | 1.1 |
| Mon 05/10 | 3.6 4-D process component | [`spec-3-6-4d-process-flow`](spec-3-6-4d-process-flow/SPEC.md) | 1.1 |
| Tue 06/10 | 5.1 Services hero and clocks | [`spec-5-1-services-hero-clocks`](spec-5-1-services-hero-clocks/SPEC.md) | 1.1 |
| Tue 06/10 | 5.2 Stats and eight services | [`spec-5-2-stats-eight-services`](spec-5-2-stats-eight-services/SPEC.md) | 3.3, 5.1 |
| Tue 06/10 | 5.4 4-D at #process and project capture | [`spec-5-4-process-project-capture`](spec-5-4-process-project-capture/SPEC.md) | 3.6, 2.4, 5.1 |
| Wed 07/10 | 6.4 About page | [`spec-6-4-about-page`](spec-6-4-about-page/SPEC.md) | 2.4, 3.3, 5.1 |

First: finish PR #15 (1.5 footer) so it merges; Andy then mounts the footer in `src/app/layout.tsx`
(decision T10). Simple page-section stories can use the one-shot route of `bmad-build` (see `AGENTS.md`).
