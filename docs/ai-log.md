# AI Log

Prompts and decisions that mattered, including the ones where the AI got it wrong.
Newest entries at the bottom. One entry per decision.

Template:

```md
## YYYY-MM-DD — <short title>

- **Who / tool:** <name> / <agent + model>
- **Prompt (short):** ...
- **What the AI did:** ...
- **Decision / result:** ...
- **AI got it wrong?** no | yes — <what and how we caught it>
```

---

## 2026-09-26 — Repo init and scraping the current site

- **Who / tool:** Hoang Vu / Claude Code (Claude Opus 5.5)
- **Prompt (short):** "Init project" with the GitHub repo URL and https://xiontechs.com/.
- **What the AI did:** Read the current site, wrote the content summary in `README.md`,
  added `.gitignore` / `.gitattributes`, pushed `main`, then created `develop`.
- **Decision / result:** Stack left open on purpose; `develop` is the base branch for all work.
- **AI got it wrong?** Yes. The page reader returned the contact email as `[email protected]`.
  That is the site's email-protection script, not the real address. Lesson: every fact
  scraped by the AI must be checked by a human before it goes on the page.

## 2026-09-26 — Tech stack

- **Who / tool:** Hoang Vu / Claude Code (Claude Opus 5.5)
- **Prompt (short):** "Let's discuss the tech stack", then the challenge brief was pasted in.
- **What the AI did:** Compared Next.js, Astro and Vite + React. First suggested no CMS
  for a short challenge.
- **Decision / result:** Next.js 16 + TypeScript + Tailwind v4 + shadcn/ui, hosted on Vercel.
  The team lead overruled "no CMS": Careers/Jobs and Blog need frequent updates by
  non-developers, so a CMS stays in scope. CMS product still to be chosen.
- **AI got it wrong?** Partly. The AI optimised for the 2-week deadline and missed the
  long-term need for content editing.

## 2026-09-26 — Team rules, skills and a local-only SonarQube gate

- **Who / tool:** Hoang Vu / Claude Code (Claude Opus 5.5)
- **Prompt (short):** Added shared skills (incl. `sonar-prepush-gate`) and the team's `CLAUDE.md`
  rules v1.0; "NEVER push to XT server … just run on local for ensuring code quality".
- **What the AI did:** Merged the rules into `CLAUDE.md` and filled the per-project setup block.
  Found that the sonar skill publishes `dev`/`main` pushes and `--remote` runs to the shared XT
  server, and changed this repo's copy to local-only: removed remote mode and the server
  URL/token settings, and added guards that refuse any non-localhost SonarQube URL.
- **Decision / result:** SonarQube runs only in a local Docker container, on every branch.
  Verified with 5 guard tests in a throwaway repo (no network calls).
- **AI got it wrong?** Not yet known. Open gap: the rules require unit tests, diff coverage
  and a smoke test, but no test runner exists yet, so those commands are marked NOT SET UP YET.

## 2026-09-28 — Test tooling and the local Sonar gate installed

- **Who / tool:** Hoang Vu / Claude Code (Claude Opus 5.5)
- **Prompt (short):** "Have you set up running Sonar gate on local before pushing … like other
  projects?" then "NEVER push to XT server, just run at local."
- **What the AI did:** Admitted the gate was not installed (only the skill copy was changed).
  Added Vitest 5 + Testing Library, `diff-cover`, a Playwright `@smoke` test,
  `sonar-project.properties`, and installed the local-only gate with a `pre-push` hook.
  Wrote the LOCAL ONLY rule into `CLAUDE.md`, `AGENTS.md` and `README.md`.
- **Decision / result:** Gate passes on this branch. A probe file with a known bug
  (`value === value`) was blocked (`new_violations=1`, `new_lines=153`), so the gate really measures.
- **AI got it wrong?** Yes, three times:
  1. The AI said it had "set up" Sonar earlier when it had only edited the skill. The user caught it.
  2. First test run failed ("multiple elements found"): Testing Library only auto-cleans with
     Vitest globals on. Fixed with `vitest.setup.ts`.
  3. The gate's baseline scan failed because `develop` has no `src/` yet. Fixed in the skill
     template (create missing source/test folders in the baseline export), not by bypassing.

## 2026-09-28 — bmad-code-review of the setup PR

- **Who / tool:** Hoang Vu / Claude Code (Claude Opus 5.5), `bmad-code-review` with 4 parallel
  reviewer agents (Blind Hunter, Edge Case Hunter, Verification Gap, Acceptance Auditor).
- **Prompt (short):** "go" (run the review required by the CLAUDE.md Definition of Done).
- **What the AI did:** Triage: 1 decision, 11 patches, 21 deferred
  (`_bmad-output/implementation-artifacts/deferred-work.md`), 8 rejected. Lead chose to add a C1
  (branch coverage >= 80% per changed file) check and to apply all patches.
- **Decision / result:** All 12 fixes applied. New offline test
  `test_local_only_guards.sh` (9 cases, stubs `docker`/`curl`); C1 script
  `scripts/coverage-branches.mjs` with unit tests. All checks and the local Sonar gate pass.
- **AI got it wrong?** Yes:
  1. The AI's own localhost guard (`http://localhost:*` glob) accepted
     `http://localhost:1@remote.host/`, which curl sends to `remote.host`. Found by the Edge Case
     Hunter; fixed with a strict regex.
  2. The first guard test passed even with the old glob put back (mutation check): the gate
     fell through to the second guard in `local_sonar.sh`, which printed the same message. Fixed
     by matching gate-only text.
  3. The AI wrote `coverage:diff` as `fetch || echo ... && diff-cover && ...`. On Windows npm
     runs `cmd.exe`, which reads that as `fetch || (echo && ...)`, so the check silently did
     nothing and exited 0. Caught because the output had no coverage table; fixed by moving the
     fetch into its own script.

## 2026-09-28 — Fix the 5 deferred doc items

- **Who / tool:** Hoang Vu / Claude Code (Claude Opus 5.5), `bmad-code-review` (4 reviewers).
- **Prompt (short):** "fix the 5 docs items".
- **What the AI did:** Fixed the 5 items in `CLAUDE.md`, `AGENTS.md` and the sonar `SKILL.md`,
  then ran the review; applied 11 follow-up fixes (0 decisions, 1 deferred, 4 rejected).
- **Decision / result:** New guard test case proves `SONAR_HOST_URL`/`SONAR_TOKEN` never reach
  `curl` (a mutant without the `unset` fails it).
- **AI got it wrong?** Yes. The AI labelled the TypeScript probe `value === value` as rule S1764.
  Three reviewers said S1764 ignores self-comparison (a NaN test). Checking the local
  container showed the probe did block, but through `typescript:S6679` (use `Number.isNaN()`).
  Doc corrected to the rule that really fired.

## 2026-09-28 — Deployment on Vercel

- **Who / tool:** Hoang Vu / Claude Code (Claude Opus 5.5)
- **Prompt (short):** "Can we move to deployment?", then "deployment also on develop branch for
  development env".
- **What the AI did:** Compared Vercel Hobby, Netlify and Vercel Pro; opened release PR #2
  (`develop` -> `main`) so `main` could build; guided the Vercel setup; checked every URL with curl
  and the GitHub deployments API; documented the URLs (PR #3).
- **Decision / result:** Vercel Hobby. Production = `main`
  (https://xion-tech-landing-page.vercel.app). `develop` = https://xiontech-dev.vercel.app
  (Vercel Preview env). Squash merge turned off so every member's commits stay visible.
- **AI got it wrong?** Partly. The AI said to find "Production Branch" under Settings > Git; Vercel
  moved it to Settings > Environments > Production > Branch Tracking. The PR #3 preview was blocked
  because the commit email was not verified on GitHub; on a private Hobby repo only the owner's
  verified commits deploy, so teammates' previews will be blocked too.

## 2026-09-28 — CMS spike: Sanity vs Payload

- **Who / tool:** Hoang Vu (Andy) / Claude Code (Claude Opus 5.5), two spike agents in parallel.
- **Prompt (short):** "CMS spike", then "free is priority".
- **What the AI did:** Checked peer ranges, then built both CMSs into throwaway clones of `develop`
  (Jobs + Blog, `/careers`, `/blog`), ran typecheck, lint, build, tests and the production server,
  and read the free-tier limits on the Sanity, Neon and Vercel Blob pricing pages.
- **Decision / result:** Sanity. It built and ran with no fixes and needs 1 extra free service;
  Payload needed `"type": "module"` and migrations, moves every page, and needs Neon + Vercel Blob.
  Real Sanity content reads are still to be proven (first open-work item). Details:
  `docs/spikes/cms-spike.md`.
- **AI got it wrong?** Yes. The first draft of the spike doc said Sanity "works, no fixes", but the
  spike used a fake project ID, so no real content was read; it also mixed up the service count
  (1 vs 3) and called Neon's CU-hours "compute-hours". `bmad-code-review` (4 reviewers) caught all
  three before the PR.

## 2026-09-28 — Website UX first draft (products + outsourcing, multi-page)

- **Who / tool:** Amber Do / Claude Code (Claude Opus 5.5) with BMad `bmad-agent-ux-designer`, `bmad-ux`, `design-taste-frontend`
- **Prompt (short):** "Build my company website (xiontechs) using white, navy and amber … showcase our web
  app and phone app in a creative way … structure similar to nashtechglobal.com", then many review rounds.
- **What the AI did:** Ran UX discovery, sampled the brand colours from the logo (navy `#163663`, amber `#FFC000`),
  built colour themes, three concept mini-sites, landing pages v1 and v2, a type kit, and finally a 7-page static
  prototype. Read the current xiontechs.com pages to reuse facts (services, 4-D process, industries, stats).
- **Decision / result:** Multi-page site with Products and Outsourcing both near the top of Home; brand colour
  rhythm per section instead of dark mode; core values in the office-banner wording; offices limited to
  Ho Chi Minh City and Dallas; email capture on every page; unverified content marked `[Placeholder]`.
- **AI got it wrong?** Yes, several times:
  - The first colour themes and concepts were rejected as "too AI, too simple". Solid swatches did not show
    what the site would feel like.
  - The AI verified pages by driving a browser preview, which looked like glitching on the user's screen. The user
    asked it to stop, so later checks were static only (syntax, links, anchors).
  - The first landing headline wrapped to 4 lines at desktop width; caught by measuring, then shortened.
  - The current site lists Da Nang and a second HCMC address; the team confirmed only HCMC and Dallas.
  - The current About page shows leadership names that look like theme placeholders ("Mary Crispy",
    "Rayan Athels"). They were not reused.
  - A scripted edit while adding `[Placeholder]` markers broke the news data in `site.js`; caught by
    `node --check`, restored and redone.
  - All checks were static. Accessibility, contrast and responsive layout were never checked in a browser.
    `bmad-code-review` then found 18 fixable issues, including a screenshot frame that could not be
    clicked, text contrast below AA and a language switch hidden on phones. 4 were fixed in the prototype;
    the other 14 became acceptance criteria for the Next.js build (`code-review-2026-09-28.md`).

## 2026-09-28 — PRD, epics and stories from the approved HTML prototype

- **Who / tool:** Amber Do / Claude Code (Claude Opus 5.5) with BMad `bmad-prd`,
  `bmad-create-epics-and-stories`, `bmad-code-review`
- **Prompt (short):** Home hero changes (dark silk background, one CTA, stats in the hero), text-only nav,
  an About FAQ, then "my developer mentions to have prds created and also have epic user stories created".
- **What the AI did:** Updated the HTML prototype after each request and waited for Amber's approval, then
  wrote the PRD (46 FRs, 8 NFRs) and `epics.md` (7 epics, 38 stories, every story linked to its prototype
  section), ran a 3-layer code review and fixed what it found.
- **Decision / result:** New default workflow: every UI change is checked by Amber in the HTML prototype;
  after approval the specs, PRD and stories are updated, reviewed, committed and a PR is opened into
  `develop`. The silk animation keeps moving with a discreet pause button (WCAG 2.2.2) instead of the
  Stripe-style "no control" approach.
- **AI got it wrong?** Yes:
  - A CSS rule for menu links made the mobile-only "Book a demo" show next to the logo on desktop. When
    Amber asked to remove "the button next to the logo", the AI removed the right-side header button
    instead; it found the real cause one round later and restored the right one.
  - The first pause control stopped the silk after 5 seconds; Amber wanted continuous motion, so it became
    a pause button.
  - The review found prototype behaviour that did not match the approved specs (a hover-opened menu
    closing on click, Escape not returning focus, no focus trap in the mobile menu, a pause button left
    with nothing to control when WebGL is missing). All fixed before the PR.
