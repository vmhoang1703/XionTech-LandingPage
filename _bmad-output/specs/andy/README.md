# Andy (Hoang Vu) — story specs, Demo-day build

Build window 2026-10-01 to 2026-10-07; 2026-10-08 is for bug fixes and demo practice.
Run each story with `bmad-build` on its own branch (`feature/<n-n>-<slug>`), pointing it at the
spec folder. Plan source: "Demo-day plan" in `../../planning-artifacts/epics.md`.

**Plan C (2026-10-03, decision P1 in `../decisions-2026-10-01.md`):** 9 stories moved from Sammy to Andy (1.7, 2.1, 6.5, 3.7, 6.1, 6.2, 4.1, 4.2, 4.3) so there are fewer waits between owners. The waits left: Sammy's 5.4 and 6.4 on Andy's 2.4, Andy's 3.7 on Sammy's 3.1, and the footer mount on Sammy's PR #15; 7.3 and 7.4 wait on all pages. Andy builds the forms and every page that reads Sanity, plus Products. Sammy owns Home, Services and About, and places the capture band in 5.4 and 6.4. Days below are the new plan.

| Day | Story | Spec | Depends on |
| --- | --- | --- | --- |
| Done | 1.1 Brand tokens, fonts, surfaces (#7) | [`spec-1-1-brand-tokens`](spec-1-1-brand-tokens/SPEC.md) | none |
| Done | 1.3 Desktop header, mega menus, skip link (#9) | [`spec-1-3-desktop-header`](spec-1-3-desktop-header/SPEC.md) | 1.1, 1.5 |
| Done | 2.2 Two-tab contact form (#13) | [`spec-2-2-contact-form`](spec-2-2-contact-form/SPEC.md) | 1.1 |
| Done | 1.8 Sanity setup (#14, #16) | [`spec-1-8-sanity-setup`](spec-1-8-sanity-setup/SPEC.md) | 1.1 |
| Done | 2.3 Submission delivery and spam protection (#17) | [`spec-2-3-submission-delivery`](spec-2-3-submission-delivery/SPEC.md) | 2.2 |
| Sat 03/10 | 2.4 Email capture band | [`spec-2-4-email-capture`](spec-2-4-email-capture/SPEC.md) | 2.2, 2.3 |
| Sat 03/10 | Footer mount in `src/app/layout.tsx` after PR #15 merges (decision T10) | — | 1.5 |
| Sun 04/10 | 1.7 Not found page (from Sammy) | [`spec-1-7-not-found-page`](spec-1-7-not-found-page/SPEC.md) | 1.1 |
| Sun 04/10 | 2.1 Privacy policy page (from Sammy) | [`spec-2-1-privacy-policy-page`](spec-2-1-privacy-policy-page/SPEC.md) | 1.1 |
| Sun 04/10 | 6.5 Careers page and open roles (from Sammy) | [`spec-6-5-careers-open-roles`](spec-6-5-careers-open-roles/SPEC.md) | 1.8 |
| Mon 05/10 | 4.1 Products hero and sub-nav (from Sammy) | [`spec-4-1-products-hero-subnav`](spec-4-1-products-hero-subnav/SPEC.md) | 1.1 |
| Mon 05/10 | 4.2 PXP story phone (from Sammy) | [`spec-4-2-pxp-story-phone`](spec-4-2-pxp-story-phone/SPEC.md) | 4.1 |
| Mon 05/10 | 4.3 LXP, SXP and IoT sections (from Sammy) | [`spec-4-3-lxp-sxp-iot-sections`](spec-4-3-lxp-sxp-iot-sections/SPEC.md) | 4.1 |
| Tue 06/10 | 3.7 Home news and demo capture (from Sammy) | [`spec-3-7-home-news-demo-capture`](spec-3-7-home-news-demo-capture/SPEC.md) | 2.4, 1.8, 3.1 |
| Tue 06/10 | 6.1 News page with filters (from Sammy) | [`spec-6-1-news-filters`](spec-6-1-news-filters/SPEC.md) | 1.8, 2.4, 3.7 |
| Tue 06/10 | 1.4 Mobile menu | [`spec-1-4-mobile-menu`](spec-1-4-mobile-menu/SPEC.md) | 1.3 |
| Wed 07/10 | 6.6 Job page and CV upload | [`spec-6-6-job-page-cv-upload`](spec-6-6-job-page-cv-upload/SPEC.md) | 1.7, 1.8, 2.3, 6.5 |
| Wed 07/10 | 6.2 Story detail page (from Sammy) | [`spec-6-2-story-detail`](spec-6-2-story-detail/SPEC.md) | 1.7, 1.8, 6.1 |
| Wed 07/10 | 6.3 Editors publish in Sanity Studio | [`spec-6-3-editors-publish-sanity`](spec-6-3-editors-publish-sanity/SPEC.md) | 1.8, 3.7 |
| Wed 07/10 | 7.4 Performance budget | [`spec-7-4-performance-budget`](spec-7-4-performance-budget/SPEC.md) | 3.2, all Demo-day page stories (Epics 1 to 6) |
| Wed 07/10 | 7.3 Accessibility checks | [`spec-7-3-accessibility-checks`](spec-7-3-accessibility-checks/SPEC.md) | all Demo-day page stories (Epics 1 to 6) |

Blockers for Sammy: 2.4 (Sat 03/10; 5.4 and 6.4 need it). Blockers for Andy: Sammy's 3.1 (Sat 03/10) for 3.7 (and through it 6.1, 6.2 and 6.3), and PR #15 (1.5 footer) for the footer mount and the footer checks in 1.7 and 2.1; if the footer is not mounted on `develop` on Sun 04/10, build 1.7 and 2.1 without those checks and add them in the mount PR. Say in the team chat the same day if one slips.

**Load and cuts.** Sizes from `epics.md` give Andy about 9.5 developer-days and Sammy about 6.5, for about 4.5 days left. Wed 07/10 is overloaded. If behind, cut in this order: 6.3 (the lead edits in the Studio by hand); slim 7.3 and 7.4 to one axe run and one Lighthouse run; 6.6 without CV upload on Demo day; then use Thu 08/10 morning. The lead decides.
