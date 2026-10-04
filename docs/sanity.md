# Sanity setup

Sanity is the CMS for News (`post`) and Careers (`job`). This page is for the team.
It says where the code lives, how to set up, and what the free plan allows.

## What lives where

| Path                              | What it does                                                                                             |
| --------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `src/lib/sanity/config.ts`        | Reads and checks `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`.                       |
| `src/lib/sanity/client.ts`        | `sanityFetch`: the one server-only read helper (no CDN, `published` perspective, no token, cached by tags; decision A11). |
| `src/app/api/revalidate/route.ts` | Webhook. Checks Sanity's signature, then calls `revalidateTag("post" or "job", "max")`.                  |
| `studio/`                         | Sanity Studio. A separate package with its own `package.json` and lockfile. It is not an npm workspace.  |
| `scripts/sanity-check.mjs`        | Run with `npm run sanity:check`. Reads one post, one job and a draft read from the real project.         |
| `.env.example`                    | The three variable names. Copy it to `.env.local`.                                                       |

The Next.js build does not contain the Studio. The root app installs only `@sanity/client` and `@sanity/webhook`.

## Local setup for a teammate

1. Copy `.env.example` to `.env.local`.
2. Ask the lead (Hoang Vu) for the value of `SANITY_REVALIDATE_SECRET`. Put it in `.env.local`. Never put it in chat, in a commit or in a log.
3. Run `npm run sanity:check`. It must print one post and one job. To prove that drafts stay private, run it again with `SANITY_DRAFT_PROBE_ID=drafts.<id>` (see below); without it, the script says draft privacy is "not proven".

`NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` are checked in `next.config.ts`. If one is missing, `next build`, `next dev` and `next start` stop. The message names the missing variable.

The project ID `1khn3hf4` and the dataset `production` are public values.

## How a page story reads content

- Use `sanityFetch({ query, params, tags })` from `src/lib/sanity/client.ts`.
- Use the tag `post` for news and the tag `job` for jobs.
- Write your own GROQ query in your page story (decision T2). There is no shared query file.
- Never use `force-dynamic`, `cache: "no-store"` or a time-based `revalidate` on a Sanity read. The cache is cleared by the webhook, not by time, and every uncached read counts against the 250k API requests per month (the client skips the CDN, decision A11).
- Do not store CVs or application data in Sanity (decision T1).

## Account steps (the lead does these, in this order)

1. Go to sanity.io. Create a free project "XionTech Landing Page". Use the dataset `production` and make it public. The project ID is `1khn3hf4`.
2. In Manage, open API, then CORS origins. Add these:
   - `http://localhost:3333` (allow credentials). Only the local Studio needs credentials.
   - `http://localhost:3000` (no credentials). The site reads on the server without a login.
   - `https://xion-tech-landing-page.vercel.app` (no credentials)
   - `https://xiontech-dev.vercel.app` (no credentials)
   - `https://xion-tech-landing-page-*-vmhoang1703s-projects.vercel.app` (no credentials). This is the preview pattern.
3. Run `cd studio && npm install && npx sanity login && npx sanity deploy`. Use the host `xiontech-landing`. The Studio is then at `https://xiontech-landing.sanity.studio`. Create one `[Placeholder]` post and one `[Placeholder]` job. Publish both.

**Every later schema change** (a merged PR that edits `studio/schemas/`): deploy from an up-to-date `develop`, or the Studio keeps the old fields.

```bash
git switch develop && git pull
cd studio && npx sanity deploy
```

`studio/sanity.cli.ts` holds the Studio's `appId` (public, not a secret), so the deploy does not ask for it. After a publish, the first visit to a page may still show the old content; the next visit shows the new one (the webhook marks the cached page stale).

After the deploy for Story 3.7 (decision A9), each news post needs:

- a real English title (posts are real and use only confirmed facts; a `[Placeholder]` post would show on Home with no sample note);
- a **slug** (Generate) and a **Published at** date (the Studio now requires both, and the category);
- a **category**, and the **app** for a Product story.

Home shows the 3 newest posts. A post without an English title, a slug or a date never shows on Home.

If Sanity cannot be reached while Home is built or refreshed, Home still renders: the news section shows its heading and "See all news", and the log says "Home news: could not load the latest posts from Sanity". That empty news section stays until the next refresh, so after an outage **re-publish any post** (the webhook refreshes Home) **or redeploy**.

4. Make the webhook. Copy `SANITY_REVALIDATE_SECRET` from `.env.local`. In Manage, open API, then Webhooks. Use these settings:
   - URL: `https://xiontech-dev.vercel.app/api/revalidate`. Add a second webhook for the production URL `https://xion-tech-landing-page.vercel.app/api/revalidate`.
   - Filter: `_type in ["post", "job"]`
   - Projection: `{_type}`
   - Trigger on: create, update, delete
   - Method: POST
   - Secret: the value of `SANITY_REVALIDATE_SECRET` (only the text after `=`, without quotes or spaces), not the variable name. It must match the value in Vercel. Both webhooks use the same value, because Vercel has one value for Preview and Production.
5. In Vercel, open Settings, then Environment Variables. Set these for Preview and Production: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET` (`production`) and `SANITY_REVALIDATE_SECRET`. Do this before you merge. The build stops without the first two.

Webhook answers: 200 is OK, 401 is a bad or missing signature, 400 is an unknown document type or bad JSON, 500 means the secret is not set. After you publish a change in the Studio, the webhook delivery in sanity.io/manage must show 200. A 401 "Invalid signature" means the webhook secret differs from the one in Vercel.

## Draft privacy proof

Drafts must not be readable with the public client. To prove it:

1. In the Studio, save a post but do not publish it.
2. Copy its document ID. It starts with `drafts.`.
3. Run `SANITY_DRAFT_PROBE_ID=drafts.<id> npm run sanity:check`.

The draft read must be empty. Without `SANITY_DRAFT_PROBE_ID`, the script says the draft privacy is "not proven".

## Free plan limits

From `docs/spikes/cms-spike.md` (pricing page read on 2026-09-28):

- $0 per month
- 20 users
- 2 datasets, and datasets are public
- 10,000 documents per dataset
- 1M CDN requests per month
- 250k API requests per month
- 100 GB bandwidth
- 100 GB assets

What would force a paid plan:

- More than 10,000 documents in a dataset.
- More than 250k API or 1M CDN requests in a month.
- More than 20 users, or a need for a private dataset.

The pricing page does not say what happens at the limit. Check this before Demo day. The next plan is Growth, at $15 per user per month.

Webhooks on the Free plan: confirmed on 2026-10-02. The dev webhook to `https://xiontech-dev.vercel.app/api/revalidate` delivered a published post change with 200 `{"revalidated":"post"}`. The production webhook is still to do: the lead adds it after the first release to `main` and checks that its first delivery shows 200.

## Security: npm audit (run 2026-10-02)

Root, `npm audit --omit=dev`: found 0 vulnerabilities.

`studio/`, `npm audit`: 14 vulnerabilities (10 moderate, 4 high).

The 4 high packages are:

- `adm-zip`
- `js-yaml`
- `smol-toml`
- `undici`

The moderate ones come from `uuid`, and from packages that depend on the packages above.

All of these live only in `studio/`. They are dev tooling (the Sanity CLI and Studio build). They are not in the site build or in the root `package-lock.json`. The only fix npm offers is `npm audit fix --force`. It installs `sanity@5.14.1`, which is a breaking downgrade from `sanity@6.17.0`.

Decision T7: we accept these findings. Recheck on or after 2026-10-12 (after Demo day), and run `npm audit` in `studio/` again. If a newer `sanity` fixes them, upgrade.
