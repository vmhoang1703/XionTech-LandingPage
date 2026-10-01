# Sammy (Son Nguyen) — story specs, Demo-day build

Build window 2026-10-01 to 2026-10-07; 2026-10-08 is for bug fixes and demo practice.
Run each story with `bmad-build` on its own branch (`feature/<n-n>-<slug>`), pointing it at the
spec folder. Plan source: "Demo-day plan" in `../../planning-artifacts/epics.md`.

| Day | Story | Spec | Depends on |
| --- | --- | --- | --- |
| Wed 01/10 | 1.5 Site footer | [`spec-1-5-site-footer`](spec-1-5-site-footer/SPEC.md) | 1.1 |
| Wed 01/10 | 1.7 Not found page | [`spec-1-7-not-found-page`](spec-1-7-not-found-page/SPEC.md) | 1.1 |
| Wed 01/10 | 2.1 Privacy policy page | [`spec-2-1-privacy-policy-page`](spec-2-1-privacy-policy-page/SPEC.md) | 1.1 |
| Thu 02/10 | 3.1 Dark Home hero | [`spec-3-1-dark-home-hero`](spec-3-1-dark-home-hero/SPEC.md) | 1.1 |
| Thu 02/10 | 3.2 Silk animation and motion toggle | [`spec-3-2-silk-motion-toggle`](spec-3-2-silk-motion-toggle/SPEC.md) | 3.1 |
| Fri 03/10 | 3.3 Stats band | [`spec-3-3-stats-band`](spec-3-3-stats-band/SPEC.md) | 3.1 |
| Fri 03/10 | 3.4 Two front doors | [`spec-3-4-two-front-doors`](spec-3-4-two-front-doors/SPEC.md) | 3.1 |
| Fri 03/10 | 3.5 Bento and service cards | [`spec-3-5-bento-service-cards`](spec-3-5-bento-service-cards/SPEC.md) | 1.1 |
| Fri 03/10 | 3.6 4-D process component | [`spec-3-6-4d-process-flow`](spec-3-6-4d-process-flow/SPEC.md) | 1.1 |
| Sat 04/10 | 4.1 Products hero and sub-nav | [`spec-4-1-products-hero-subnav`](spec-4-1-products-hero-subnav/SPEC.md) | 1.1 |
| Sat 04/10 | 4.2 PXP story phone | [`spec-4-2-pxp-story-phone`](spec-4-2-pxp-story-phone/SPEC.md) | 4.1 |
| Sat 04/10 | 4.3 LXP, SXP and IoT sections | [`spec-4-3-lxp-sxp-iot-sections`](spec-4-3-lxp-sxp-iot-sections/SPEC.md) | 4.1 |
| Sun 05/10 | 6.5 Careers page and open roles | [`spec-6-5-careers-open-roles`](spec-6-5-careers-open-roles/SPEC.md) | 1.8 |
| Sun 05/10 | 5.1 Services hero and clocks | [`spec-5-1-services-hero-clocks`](spec-5-1-services-hero-clocks/SPEC.md) | 1.1 |
| Sun 05/10 | 5.2 Stats and eight services | [`spec-5-2-stats-eight-services`](spec-5-2-stats-eight-services/SPEC.md) | 3.3, 5.1 |
| Mon 06/10 | 5.4 4-D at #process and project capture | [`spec-5-4-process-project-capture`](spec-5-4-process-project-capture/SPEC.md) | 3.6, 2.4, 5.1 |
| Mon 06/10 | 3.7 Home news and demo capture | [`spec-3-7-home-news-demo-capture`](spec-3-7-home-news-demo-capture/SPEC.md) | 2.4, 1.8 |
| Mon 06/10 | 6.1 News page with filters | [`spec-6-1-news-filters`](spec-6-1-news-filters/SPEC.md) | 1.8, 2.4, 3.7 |
| Tue 07/10 | 6.2 Story detail page | [`spec-6-2-story-detail`](spec-6-2-story-detail/SPEC.md) | 1.7, 1.8, 6.1 |
| Tue 07/10 | 6.4 About page | [`spec-6-4-about-page`](spec-6-4-about-page/SPEC.md) | 2.4, 3.3, 5.1 |

Wed 01/10 before 1.1 merges: write the markup and content for 1.5, 1.7 and 2.1; style them once
the tokens land.
