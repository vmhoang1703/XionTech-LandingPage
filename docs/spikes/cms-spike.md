# Spike: CMS for Careers/Jobs and Blog — Sanity vs Payload

- **Date:** 2026-09-28
- **Owner:** Hoang Vu (Andy), with Claude Code (Claude Opus 5.5) running both spikes in parallel
- **Decision:** **Sanity** (chosen by Andy). Input for `bmad-architecture`.
- **Rule applied:** free first — prefer free tools and free tiers, and name the limits.

## Question

Can each CMS run inside our app (Next.js 16.3.6, React 19.2.8, App Router, Turbopack, Vercel
Hobby) with a Jobs and a Blog content type, and what does it cost on free tiers?

## Method

Two throwaway local clones of `develop` (nothing pushed, since deleted). Each added the CMS, a
`job` and a `post` content type, and `/careers` + `/blog` pages that read them, then ran
`npm run typecheck`, `npm run lint`, `npm run build`, `npm test`, and started the production
build.

Limits of the method:

- **Sanity used a fake project ID** (no account created). The pages returned 200 because they
  caught the fetch error and showed "Could not load jobs." / "Could not load posts." **Reading
  real Sanity content was not tested.**
- **Payload used SQLite**, not Postgres. The Neon Postgres adapter and running migrations against
  Neon were not tested. Payload did create and serve real rows (user, job, media upload).
- **No CMS tests were added.** "9 of 9" below are the existing tests; they only show the CMS did
  not break them.

## Results

|                                                      | Sanity                                                                                                                              | Payload                                                                                                                                                             |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Versions                                             | next-sanity 13.3.4, sanity 6.16.0, styled-components 6.5.3                                                                          | payload, @payloadcms/next, richtext-lexical, db-sqlite 3.90.2                                                                                                       |
| Peer range for Next                                  | `next ^16.0.0-0`                                                                                                                    | `next >=16.3.3 <17.0.0`                                                                                                                                             |
| Verdict                                              | **Builds and runs, no fixes; content reads not proven** (fake project)                                                              | **Works with 2 fixes** (on SQLite)                                                                                                                                  |
| Typecheck / lint / build / tests                     | pass / pass / pass (53 s) / 9 of 9 existing                                                                                         | pass / pass / pass (67 s; develop alone 38 s) / 9 of 9 existing                                                                                                     |
| Runtime                                              | `/`, `/studio`, `/careers`, `/blog` = 200 (`/careers`, `/blog` show the caught error; `/studio` shows "Project not found")          | `/admin` = 200; `/careers`, `/blog` = 500 until migrations ran, then 200 with real rows                                                                             |
| Fixes needed                                         | none                                                                                                                                | `"type": "module"` in `package.json` (`ERR_REQUIRE_ASYNC_MODULE` in `generate:importmap`); run `payload migrate` in production (`SqliteError: no such table: jobs`) |
| Change to our app                                    | adds `sanity.config.ts`, `src/sanity/`, `/studio` route                                                                             | moves every page into `src/app/(frontend)/`, adds `(payload)` routes, wraps `next.config`                                                                           |
| Size (measured differently, not directly comparable) | `/studio` first load about 1.94 MB gzipped (6.1 MB raw); `/` about 174 KB gzipped                                                   | `.next` folder 269 MB (develop 38 MB); 4.2 MB raw browser JS in `.next/static`                                                                                      |
| `npm audit` (new packages)                           | 14 (11 moderate, 3 high); 775 packages added. Packages named: adm-zip, js-yaml, smol-toml, uuid (which 3 are high was not recorded) | 5 moderate (esbuild via @esbuild-kit, dev server only, "No fix available"); added package count not recorded                                                        |

## Free-tier cost (pricing pages read on 2026-09-28)

Counting extra services beyond Vercel hosting (both options run on Vercel Hobby): **Sanity needs
1, Payload needs 2** (Neon + Vercel Blob; Payload itself runs inside our app).

| Service                            | Free plan                                                                                                                              | At the limit                                                                                  |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Sanity Free                        | $0; 20 users; 2 datasets (public); 10,000 documents per dataset; 1M CDN + 250k API requests per month; 100 GB bandwidth; 100 GB assets | not stated on the pricing page — check before demo. Next plan: Growth, $15 per user per month |
| Neon Postgres Free (Payload)       | 0.5 GB per project; 100 CU-hours per month (compute units × hours); sleeps after 5 min idle (cannot be turned off)                     | writes blocked above 0.5 GB; compute suspended when CU-hours run out                          |
| Vercel Blob, Hobby (Payload media) | 1 GB; 10k simple + 2k advanced operations per month; 10 GB transfer                                                                    | Blob locked for 30 days                                                                       |

Sources: https://www.sanity.io/pricing · https://neon.com/pricing ·
https://vercel.com/docs/vercel-blob/usage-and-pricing

## Why Sanity

1. **Fewer free tiers that can stop us:** 1 extra service instead of 2 with hard stops (Blob's
   30-day lockout could take images offline during demo week).
2. **No change to existing code:** it only adds files. Payload moves every page and switches the
   project to ES modules, which touches everyone's work.
3. **Built and ran on Next.js 16 with no fixes** — but real content reads are still to be proven
   (first item below).

Trade-offs accepted:

- Content lives on Sanity's servers. Exit plan: `sanity dataset export` gives a full NDJSON
  export.
- Free datasets are public: published documents can be read by anyone. Drafts (document IDs with
  a dot, such as `drafts.*`) need a token to read, per Sanity's docs — verify when setting up.
- The Studio bundle is heavy. Option: host the Studio for free on `<name>.sanity.studio` instead
  of `/studio`, which also removes `styled-components` from our Next.js build.

Risk for both options: Vercel Hobby is for non-commercial use; a company website is a grey area
(accepted earlier by the team to stay free).

## Open work for the architecture and build (estimates, not measured)

1. **First: prove reads.** Create a free Sanity project, add one job and one post, and check that
   `/careers` and `/blog` show them (about 1 h). Set `NEXT_PUBLIC_SANITY_PROJECT_ID` and
   `NEXT_PUBLIC_SANITY_DATASET` on Vercel.
2. Missing env vars: fail the build clearly, or show a fallback, instead of empty pages (about
   0.5 h).
3. CORS origins: localhost, the production domain, `xiontech-dev.vercel.app`, and preview URLs.
   Do not allow credentials on a wildcard origin; use exact origins for Studio logins (about
   0.5 h).
4. Caching and quota: the spike used `force-dynamic`, so every page view would call Sanity. Use
   `useCdn: true` for public reads and tag-based revalidation with a Sanity webhook and a secret,
   to stay far under 250k API / 1M CDN requests per month (2–4 h).
5. List and detail pages (`/careers`, `/careers/[slug]`, `/blog`, `/blog/[slug]`), image URL
   builder, generated types, and tests for all of them (1–2 days).
6. `npm audit`: check whether an upgrade or an `overrides` entry clears the 3 high findings; if
   not, record why they are acceptable (about 1 h).
7. EN/VI: the UX needs Vietnamese. Choose field-level or document-level translation. Document
   level doubles the document count against the 10,000 per-dataset limit (decision, about 1 h).
8. Optional, probably not for the demo: draft mode and visual editing (1–2 days).
