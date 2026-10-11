---
target_identity: "file:C:\\XionTech\\LandingPage\\src\\app\\page.tsx"
target_fingerprint: "sha256:2a221087a48ce412b9129d1633db9642fee78ca4e4ac2d499beb1385a2f98f2e"
target_path: "C:\\XionTech\\LandingPage\\src\\app\\page.tsx"
timestamp: 2026-10-11T04-10-57Z
slug: src-app-page-tsx
---

⚠️ DEGRADED: single-context (user asked for no subagents, to save tokens)

# Home critique — 2026-10-11 (src/app/page.tsx)

Mode: Persuade. Detector: 0 findings (exit 0) on page.tsx, components/home, home-contact, home-news, process-flow, stats-band. Browser: prod build, 1440 and 390, reduced motion.

## Heuristics (n/a: 7, 10 — landing page)

1 Status 3 · 2 Real world 3 · 3 Control 3 · 4 Consistency 2 (doors and Capabilities repeat) · 5 Errors 3 · 6 Recognition 3 · 8 Minimal 2 (repeat cards, long values text) · 9 Recovery 3 → 22/32 (good, not yet excellent)

## Working

- Hero: XT particle mark and "get IT done" highlight are specific to XionTech.
- 4-D flow: concrete "You receive" per step, request → launch framing.
- Footer mountain silhouette ties back to the About climb story.

## Priority issues

- P1 Repeat content: front doors ("Products for schools" / "Your software delivery team", same lines) are repeated one screen later as Capabilities cards. Fix: doors stay as the two entry points; Capabilities cards drop to Delivery + Industries + a new angle, or the doors go. → distill / clarify
- P1 News row has no images: all 3 posts lack `image` in Sanity, so 3 identical grey grid covers, all "4 Oct 2026". Fix: add real cover images in Sanity (content), or a designed branded fallback per tag. → content + colorize
- P2 Values wall of text: 6 cards × 4–5 lines of generic copy ("Embody an entrepreneurial mindset…"). Phone page 10,968px. Fix: one short line per value, full text on About. → distill / clarify (copy change needs OK)
- P2 Section titles: "How we approach." is not correct English ("Our approach." / "How we work."). "Capabilities." lede starts "Why XionTech:". → clarify
- P3 Motto row "Get IT Done / Built with ownership" is small and repeats the hero line and the values card "Get IT Done Attitude". → distill

## Personas

- School leader (first visit): sees products twice, values text is long; may not reach News.
- CTO buying outsourcing: wants proof; stats are good, news covers look empty.
