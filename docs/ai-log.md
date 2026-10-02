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
    the other 14 findings became 16 acceptance criteria for the Next.js build (`code-review-2026-09-28.md`).

## 2026-09-28 — PRD, epics and stories from the approved HTML prototype

- **Who / tool:** Amber Do / Claude Code (Claude Opus 5.5) with BMad `bmad-prd`,
  `bmad-create-epics-and-stories`, `bmad-code-review`
- **Prompt (short):** Home hero changes (dark silk background, one CTA, stats in the hero), text-only nav,
  an About FAQ, then "my developer mentions to have prds created and also have epic user stories created".
- **What the AI did:** Updated the HTML prototype after each request and waited for Amber's approval, then
  wrote the PRD (46 FRs, 8 NFRs) and `epics.md` (7 epics, 38 stories, every visual story linked to its
  prototype section), ran a 3-layer code review and fixed what it found.
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

## 2026-09-28 — Fixing Hoang's review of the PRD and epics (PR #4)

- **Who / tool:** Amber Do / Claude Code (Claude Opus 5.5)
- **Prompt (short):** "there's review from Hoang on the pull request i made, review that and have my pr
  updated fix".
- **What the AI did:** Rebased onto `develop` (Sanity CMS spike, #5), then applied all 24 review items to
  the PRD, `epics.md`, `EXPERIENCE.md`, `deferred-work.md` and this log: Sanity instead of "CMS not
  chosen" plus a new Story 1.8 (Sanity setup), owners and "Depends on" on every story, a proposed Demo-day
  plan (22 must-have stories, about 15 developer-days, two parallel tracks), an essential locale cookie,
  launch check scoped to `src/` and the build output, and the smaller clarity fixes.
- **Decision / result:** The Demo-day plan is marked PROPOSED and needs the team's sign-off. It moves the
  animated silk, the 4-D process and the News pages to after Demo day.
- **AI got it wrong?** Yes. The first PRD assumed a team of 3 and about 11 build days (the real window is
  2 developers and 7 to 8 days), kept the saved language in local storage (a server cannot read it, so a
  cookie is needed), left the CMS as undecided after Sanity was chosen, and counted 45 FRs after FR-46 was
  added. All caught by the lead's review, not by the AI's own review.

## 2026-09-29 — Demo-day scope re-cut, job page with CV upload, PR #4

- **Who / tool:** Amber Do / Claude Code (Claude Opus 5.5)
- **Prompt (short):** "language switcher can be after demo days, but animated silk, 4d process flow and news to be
  done for demo", then "my manager will be using this site as a real company site", then answers on forms, CVs,
  leadership, store links and effort ("there's no cutoff for this").
- **What the AI did:** Updated the HTML prototype (v3.8): Careers lists sample roles that open a new job page with an
  application form and CV upload; newsletter, talent network and leadership removed; About ends on "See our apps in
  action." with Book a demo; store and app links open a new tab. After Amber approved it, updated `DESIGN.md`,
  `EXPERIENCE.md`, the PRD (new FR-47, FR-29 and FR-35 marked removed, open questions 21 and 22) and `epics.md` (new
  Story 6.6, rewritten Stories 6.5 and 2.4, Demo-day plan rebuilt: 31 must-haves, 23.5 developer-days).
- **Decision / result:** English only on Demo day; silk, 4-D process (Home and Services), News from Sanity with
  `[Placeholder]` titles, Careers with CV upload, live forms and the accessibility and performance audits are
  must-haves. The plan is about 8.5 developer-days over budget with no cuts; the lead decides how to cover it.
- **AI got it wrong?** Partly. The first re-cut kept the Services 4-D flow as the last cut and assumed news could live
  in code; Amber and the lead's Sanity decision overruled both. The AI also flagged that uploaded Sanity files may
  be reachable by link, so CV storage is an open question for the lead rather than a settled design.
  The AI's own review then caught three build-order errors in its first plan (Story 6.6 scheduled before the
  6.5 it depends on, 6.3 in parallel with 3.7, audits before the last pages) and breadcrumbs required by must-have
  stories while Story 1.6 was after demo; all fixed before commit.

## 2026-09-29 — Real office addresses and contact email (PR #4)

- **Who / tool:** Amber Do / Claude Code (Claude Opus 5.5)
- **Prompt (short):** pasted the Plano and Ho Chi Minh City addresses, phones and email; "there's no head office,
  remove that, use address from plano ... keep the vietnam phone there and email as i provided".
- **What the AI did:** Updated the office blocks in the prototype footer, About and Book a demo (Plano first, Vietnam
  Delivery Center second, WhatsApp link, `mailto:`), then the PRD (FR-7, open questions 1, 2, 8 and 10, dependencies,
  assumptions), `EXPERIENCE.md`, `epics.md` (Story 1.5, Story 2.3 destination, FR-38 inbox, content list), both READMEs
  and `.memlog.md`. After the bmad-code-review run, renamed Dallas to Plano everywhere (stats, clocks, FAQ, meta
  descriptions, privacy text, specs) at Amber's request, and applied 8 review fixes.
- **Decision / result:** Offices and the contact inbox are real; CV storage in Sanity stays open for Hoang Vu.
- **AI got it wrong?** Yes. The first version labelled Plano "Head office" (copied from the pasted text) and kept
  "Dallas, USA" as the heading; Amber corrected both.

## 2026-10-01 — Demo-day plan and 31 story specs

- **Who / tool:** Hoang Vu (Andy) / Claude Code (Claude Opus 5.5), `bmad-spec` format, 4 + 2 agents
  in parallel.
- **Prompt (short):** "plan for next 3 days", then "we must complete all before 7/10", "keep all,
  push hard", "create spec and group by per developer" (one spec per story, in folders).
- **What the AI did:** Showed the gap (31 must-have stories ≈ 23.5 developer-days vs 10–14
  available); after the lead kept all of them, made a day-by-day plan 01–07/10 for Andy (11
  stories) and Sammy (20). Wrote 31 specs under `_bmad-output/specs/{andy,sammy}/` from the
  epics, PRD, UX and prototype, each with the Demo-day slice as capabilities and the after-demo
  parts as non-goals. Collected 13 decisions from the lead into
  `_bmad-output/specs/decisions-2026-10-01.md` and applied them to 20 specs.
- **Decision / result:** CVs in a private Vercel Blob store (free Sanity datasets are public; a
  5 MB file is over Vercel's 4.5 MB request limit); 1.8 builds the Sanity client and fetch helper;
  `#updates` links hidden on Demo day; store links and product URLs are `[Placeholder]`; data
  kept with no time limit; Hoang Vu is the Sanity editor.
- **AI got it wrong?** Yes, twice, caught by the spec agents: the update brief gave the wrong
  relative path to the decisions file (`../` instead of `../../`), and decision T1 first said
  "Sanity holds job posts only", which would have banned the Life at XionTechs photos.

## 2026-10-01 — Story 1.1 brand tokens, fonts and surfaces (`bmad-build`)

- **Who / tool:** Hoang Vu (Andy) / Claude Code (Claude Opus 5.5), `bmad-build` with task
  reviews, `bmad-code-review` layers and an independent acceptance auditor (subagents).
- **Prompt (short):** "start 1.1", then "Keep full spec" and "Approve and continue" at the plan
  checkpoint.
- **What the AI did:** Put every `DESIGN.md` token into `@theme static` in `globals.css` (39
  colours, 18 type styles, radii, spacing, breakpoints 640/900/1080, z layers, motion, shadows),
  added the eight surface classes, the button variants, the 2.5px focus ring and the
  reduced-motion rule; loaded the four fonts with `next/font/google` (Latin + Vietnamese,
  `display: swap`); wrote a WCAG contrast helper that checks every text/background pair in tests.
  126 tests, 100% changed-line coverage. Checked fonts, focus rings and network requests in real
  Chrome on both `next start` and `npm run dev`: no request leaves localhost.
- **Decision / result:** Light surfaces re-declare the full light token set, so a paper card
  inside a navy band stays readable. `@phosphor-icons/react` is the icon package (recorded in
  `AGENTS.md`), installed by the first story that renders an icon.
- **AI got it wrong?** Yes, several times, all caught by the workflow's own reviews or checks:
  1. The first contrast helper ignored the alpha channel, so `#RRGGBBAA` colours passed with the
     wrong ratio.
  2. Light surfaces did not re-scope the text tokens: a paper card inside navy would have had
     white text on white.
  3. The font loader used a spread for shared options; `next build` failed with "Unexpected
     spread" because `next/font` needs literal options in every call.
  4. The story review found 10 more issues (h1 not in the display font, the `:lang(vi)` rule in
     the wrong CSS layer, `--destructive` unreadable on navy, missing AA pairs, a fragile CSS
     parser); all fixed and re-reviewed.
  5. The first real-browser check showed Times New Roman and the default focus outline. Cause: an
     old `next start` process from an earlier run still held the port and served a deleted build.
     `pkill` does not exist on Windows; stopping it with PowerShell `Stop-Process` fixed the check.
  6. The independent evidence audit failed twice. First, the manual check had run on
     `next start`, not `npm run dev`. Second, the AI's own script had skipped adding the dev-server
     files to the spec, and nobody had seen the focus ring's 2.5px width or 8px radius. A new check
     at 2× pixel density showed that Chrome draws the 2.5px ring as 2px. The lead decides whether
     to keep 2.5px.
  7. The AI opened PR #7 with `gh pr create` and its own body, instead of `/create-pr` as the
     lead had asked for earlier PRs. The lead caught it. `/create-pr` targets Azure DevOps (`az`),
     so it cannot open a GitHub PR here, but PRs #1–#6 used its template; the PR #7 body was
     rewritten to that template with `gh pr edit`.

## 2026-10-01 — `create-pr` skill moved from Azure DevOps to GitHub

- **Who / tool:** Hoang Vu (Andy) / Claude Code (Claude Opus 5.5)
- **Prompt (short):** "why you do not use /create-pr?", then "update skill to use gh instead of az
  and add rule for using skill when creating PR".
- **What the AI did:** Ported the `create-pr` skill (copied from another XionTech project) from
  `az repos pr create` to `gh pr create`: the scripts parse `origin` into `--repo owner/name`, target
  `develop`, read the story key from the branch name, and keep the old guards (not pushed, behind,
  default branch). Added a guard for a branch that tracks `origin/develop` instead of itself, and an
  offline test script (28 checks; a mutation check showed it catches broken guards). Added the rule to
  `AGENTS.md` → Git workflow, and narrowed the "do not edit `.claude/skills/` by hand" rule to the
  `bmad-*` skills, which the BMad installer owns.
- **Decision / result:** Every PR is opened with `/create-pr`; no hand-run `gh pr create`.
- **AI got it wrong?** Yes. The AI opened PR #7 with a hand-run `gh pr create` and a body outside the
  team's PR template, although the lead had asked for `/create-pr` on earlier PRs. Its Python-based
  edits to the shell scripts also failed twice: the shell turned each double backslash into a single
  one, so the match strings never matched; the AI switched to whole-file rewrites and the Edit tool.

## 2026-10-01 — Faster checks until Demo day

- **Who / tool:** Hoang Vu (Andy) / Claude Code (Claude Opus 5.5)
- **Prompt (short):** "temporary bypass Sonar check and will run check at overall after all done to
  optimize the time … any suggestions to optimize time but keep the quality?"
- **What the AI did:** Pointed out that skipping the gate on every branch and checking only at the
  end would measure almost nothing: "new code" is what a branch adds on top of `develop`, so after
  the merges there is no new code left. Proposed four changes; the lead chose all four:
  1. `eslint-plugin-sonarjs` (typed, `src/` without tests — the gate's own scope) plus a
     `no-restricted-globals` rule for `parseInt`, so `npm run lint` catches in about 15 seconds
     all three kinds of finding that blocked the Story 1.1 push.
  2. Until Demo day the `pre-push` hook runs `npm run lint` only (`scripts/git-hooks-demo`);
     `npm run sonar:gate:full` (new code = everything since `main`) runs once a day on a clean,
     up-to-date `develop` and before the release PR.
  3. Full `bmad-code-review` once per story or PR; follow-up commits under about 50 lines get one
     review layer.
  4. Simple page-section stories use the one-shot `bmad-build` route.
- **Decision / result:** Rules written into `CLAUDE.md`, `AGENTS.md` and `README.md`, all marked
  "until Demo day (2026-10-09)", with an undo item in `deferred-work.md`. Also added
  `npm run test:skills` for the `create-pr` script tests.
- **AI got it wrong?** Yes, several times:
  1. With only the recommended config, the plugin caught one of the three Story 1.1 findings;
     `prefer-regexp-exec` needs type information and the plugin has no `Number.parseInt` rule. A
     probe file showed the gap before the change was committed.
  2. The 3-layer code review then found 13 real problems. The worst: spreading the sonarjs preset
     also replaced Next's React version setting ("detect" → "999.999.999") for all of `src/`;
     turning the hook off would have left no check at all on push (Next.js 16 `next build` no
     longer lints); and `sonar:gate:full` would scan whatever branch or local edits were checked
     out. All fixed, with tests: `scripts/eslint-config.test.mjs` and
     `scripts/sonar-gate-full.test.mjs`.

## 2026-10-01 — UX quality loop: match the mockup, then improve on it

- **Who / tool:** Hoang Vu (Andy) / Claude Code (Claude Opus 5.5), Playwright, pixelmatch, axe-core,
  a UX critic subagent.
- **Prompt (short):** "Seems the UX has not been followed with mockup … propose the rule/skill/tool",
  then "matching with the mockup is not enough … propose the technique to enhance/improve the UI/UX
  per spec", then "set it up, start with the 1.3 header".
- **What the AI did:** Measured the merged-to-PR header against the prototype in Chrome and found real
  gaps (background colour, spacing, the mega value line, skip-link text) plus four places where the
  prototype and `DESIGN.md` disagree. Built `npm run ux:parity` (prototype vs app, element by element:
  box, computed styles, pixels) and `npm run ux:shots` (8 widths, every state, reduced motion,
  JavaScript off, axe, layout shift), a `ux-critic` skill with an eight-area scorecard, and
  `docs/ux-quality.md` (floor, ceiling, measure, feed back). First run on the header: 62 differences
  became 0 unexplained after fixes on PR #9; the critic scored interaction feedback 3/5 and two of
  its fixes were applied (hand cursor on buttons, hover fades).
- **Decision / result:** UI stories follow the loop (CLAUDE.md Definition of Done); the full critic
  pass is for the header, Home hero, Products and Book a demo until Demo day. Amber decides UX-Q1 to
  UX-Q4 and every "enhance" proposal, and records accepted ones in `DESIGN.md`.
- **AI got it wrong?** Yes. The Story 1.3 spec summarized the prototype into tokens, so the
  implementer agents guessed missing values (`gap-8`, `text-ui`) and nothing compared the result
  with the mockup; five review layers passed it. The first parity run reported 101 differences,
  many of them notation noise (`0px none` vs `0px solid`, empty shadow layers, 999px vs 9999px);
  after the tool normalized them, 62 real differences were left, and those became 0 unexplained
  after the header fixes.

  The lead then spotted that the menus opened on click only, while `EXPERIENCE.md` and the
  prototype open them on hover. The tool had compared only how things look, the Demo-day plan had
  cut hover, and the critic was told to file scope cuts under "Later". Fixed by interaction probes
  in `ux:parity` (they reported the four hover differences before the fix and none after), a
  critic rule that raises scope cuts which hurt the experience, and hover-open on PR #9
  (decision T11).

  The code review of this work then found that a menu opened by click or keyboard closed when the
  mouse passed over and left, dropping keyboard focus; the fix pins a menu the visitor chose. That
  fix first broke hover-then-click in real Chrome (a mouse press focuses the button before the
  click), which the jsdom tests could not see; the new `click-then-leave` and `hover-into-panel`
  probes ran in Chrome and confirmed the final behaviour.

  The reviews of the tool's own fixes found more holes. A probe that could not run was shown as
  "intended" or "pending", and so hidden, when an entry named the same event. A 5s timeout meant
  for probes also cut the time allowed for screenshots. A bad surface file could crash the checker
  instead of listing the problem. A first fix escaped "|" only in probe results, not in notes and
  names (a missed similar check), and names were not yet safe as folder and file names (`../x`,
  `Logo` vs `logo` on Windows, two element and state pairs writing one image). State names could
  repeat or reuse the scripts' own `default`, `reduced-motion` and `no-js`. Last, three reviewers
  showed that checking each `intended` field alone still let an entry match nothing (a typo, a
  state and width that never run together), so an open decision could vanish from the pending
  list; instead of more field rules, the report now lists states that did not run or compared
  nothing, probes that did not run and entries that matched nothing, and the pending list shows
  every pending entry in the file. Twice the AI's own new tests asserted the very bug: they
  expected a pending entry to be left out of the pending list. All are fixed and unit-tested,
  except the timeout move: it lives in the browser code, which has no automated test yet. The full
  review was run again after each large follow-up, as `CLAUDE.md` asks; each round still found
  slips in the previous fix, and the smallest gaps left are listed in `deferred-work.md`.

  **Decision (2026-10-02): the tools become optional.** The lead saw that the loop would cost too
  much time before Demo day (a surface file per page, 2–5 minute runs, and runs that sometimes
  failed by chance). The AI first proposed a lighter scope and speed fixes; while testing them it
  found new causes of random failures (a CDN stall, React hydration timing). The lead chose to keep
  UX checks (looks and behaviour) in the spec only and to merge the tools as optional. The AI also
  read Anthropic's `webapp-testing` and `frontend-design` skills before installing them and advised
  against both as they stand (Python one-off scripts that wait for `networkidle`; a skill that
  invents new palettes and fonts against our fixed `DESIGN.md`); neither was installed. **AI got
  it wrong?** Partly: its first answer (a lighter scope plus speed fixes) still kept a slow,
  flaky tool on the path; testing those fixes cost about two hours before the lead's simpler
  choice. Lesson: when a check is slow and unreliable, first ask whether the team needs it
  before the deadline at all. The planned 2026-10-07 screenshot sweep was dropped with the
  tools; the spec's UX checks replace it.
