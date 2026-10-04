# Story 3.7 — observed surface (2026-10-04)

Surface: Home `/`, the section "Latest from XionTech." between the navy 4-D band and the amber capture band.

Not exercised in a browser in this run. Blocker: the build runs in a git worktree whose `node_modules` is a junction to the main checkout, and Turbopack rejects it, so `npm run build`, `npm run test:smoke`, `npm run dev` and the browser walk are left to the controller (lead instruction for this run).

What was observed instead (jsdom, real invocations in `verification.txt`):
- `src/components/news/home-news.test.tsx`: the awaited server component renders 3 cards plus the `[Placeholder]` sample note; with 1 story only 1 card; with 0 stories no grid and no note, heading and "See all news" (`/news`) stay.
- `src/components/news/news-card.test.tsx`: mono date `18 SEP 2026`, tag, title, excerpt, "Read story" link to `/news/<slug>`; product tag has the `product` class.
- `src/app/page.test.tsx`: sections after the hero carry surfaces [none (doors), mist + linen, paper, navy, mist, amber]; news sits between the 4-D band and the capture band, capture is last.
- `src/app/no-js.test.tsx`: static server markup has the news section before "See it working at your school." (news section stubbed: an async component cannot render to static markup).

Pending (controller, browser): card looks (frame, tag colours, type), hover arrow, focus ring, 900px and 640px columns, and real Sanity stories on https://xiontech-dev.vercel.app/ after the A9 Studio deploy.
