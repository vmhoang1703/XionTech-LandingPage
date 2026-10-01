# Andy (Hoang Vu) — story specs, Demo-day build

Build window 2026-10-01 to 2026-10-07; 2026-10-08 is for bug fixes and demo practice.
Run each story with `bmad-build` on its own branch (`feature/<n-n>-<slug>`), pointing it at the
spec folder. Plan source: "Demo-day plan" in `../../planning-artifacts/epics.md`.

| Day | Story | Spec | Depends on |
| --- | --- | --- | --- |
| Wed 01/10 | 1.1 Brand tokens, fonts, surfaces (merge tokens + fonts by end of day) | [`spec-1-1-brand-tokens`](spec-1-1-brand-tokens/SPEC.md) | none |
| Thu 02/10 | 1.3 Desktop header, mega menus, skip link | [`spec-1-3-desktop-header`](spec-1-3-desktop-header/SPEC.md) | 1.1, 1.5 |
| Fri 03/10 | 1.8 Sanity setup (prove real reads) | [`spec-1-8-sanity-setup`](spec-1-8-sanity-setup/SPEC.md) | 1.1 |
| Sat 04/10 | 2.2 Two-tab contact form | [`spec-2-2-contact-form`](spec-2-2-contact-form/SPEC.md) | 1.1 |
| Sun 05/10 | 2.3 Submission delivery and spam protection | [`spec-2-3-submission-delivery`](spec-2-3-submission-delivery/SPEC.md) | 2.2 |
| Sun 05/10 | 2.4 Email capture band | [`spec-2-4-email-capture`](spec-2-4-email-capture/SPEC.md) | 2.2, 2.3 |
| Mon 06/10 | 1.4 Mobile menu | [`spec-1-4-mobile-menu`](spec-1-4-mobile-menu/SPEC.md) | 1.3 |
| Mon 06/10 | 6.6 Job page and CV upload | [`spec-6-6-job-page-cv-upload`](spec-6-6-job-page-cv-upload/SPEC.md) | 1.7, 1.8, 2.3, 6.5 |
| Tue 07/10 | 6.3 Editors publish in Sanity Studio | [`spec-6-3-editors-publish-sanity`](spec-6-3-editors-publish-sanity/SPEC.md) | 1.8, 3.7 |
| Tue 07/10 | 7.4 Performance budget | [`spec-7-4-performance-budget`](spec-7-4-performance-budget/SPEC.md) | 3.2, all Demo-day page stories (Epics 1 to 6) |
| Tue 07/10 | 7.3 Accessibility checks | [`spec-7-3-accessibility-checks`](spec-7-3-accessibility-checks/SPEC.md) | all Demo-day page stories (Epics 1 to 6) |

Blockers for Sammy: 1.1 (Wed), 1.8 (Fri), 2.2 → 2.4 (Sat–Sun). Say in the team chat the same day
if one slips.
