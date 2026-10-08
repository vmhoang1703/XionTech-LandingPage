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

## 2026-10-01 — Decisions before Story 1.3, and the desktop header (`bmad-build`)

- **Who / tool:** Hoang Vu (Andy) / Claude Code (Claude Opus 5.5), `bmad-build` with task reviews and
  five `bmad-code-review` layers (subagents).
- **Prompt (short):** "back to decide before implementing 1.3", then the choices in
  `_bmad-output/specs/decisions-2026-10-01.md` (T9, T10, D1–D3), then "Keep full spec" and "Approve and
  continue".
- **What the AI did:** Recorded five decisions (focus ring 2px; build 1.3 without the footer mount
  until Story 1.5 merges; dev/preview form mail to Andy's inbox; XionTech IT owns the newxion.com DNS;
  the inbox is the record). Built the sticky glass header: skip link, logo, Products and Services mega
  menus from one data module, Book a demo; the root layout now owns the one `<main id="main">`. 189
  tests, 100% changed-line coverage; checked in real Chrome, including with JavaScript turned off.
- **Decision / result:** Page files must not render their own `<main>` (Sammy's pages too). Below
  1081px there is no nav until Story 1.4.
- **AI got it wrong?** Yes, caught by the workflow's reviews:
  1. Task reviews failed three times: `/about` was not marked current; an invented "For " prefix on the
     product lines; a full-width 4-column mega panel instead of the prototype's 660px 2-column one; and
     a menu that re-opened by itself after Back.
  2. The five-layer review found 29 items; 7 patch groups were applied: menus now close when keyboard
     focus leaves them (WCAG 2.2 focus not obscured), path matching got a `/` boundary, the prototype
     fonts and hover pill were missing, and `next/image` `priority` is deprecated in Next.js 16.
  3. The AI checked evidence line endings with a `grep` that missed CRLF; Python showed 3 CRLF lines,
     which were converted to LF (as git stores them) before hashing.

## 2026-10-02 — UX checks move into the spec

- **Prompt (Hoang Vu):** the UX tools cost too much time before Demo day; "keep UI/UX checks +
  behaviour in the spec only to save time".
- **What the AI did:** wrote `docs/ux-checks.md` (who writes the table and when, rules, template,
  the Story 1.3 header as an example), the Definition of Done line in `CLAUDE.md`, the `AGENTS.md`
  rule and a "UX checks" section in the PR template. The UX tools (PR #11) stay optional.
- **AI got it wrong?** Yes, twice. The header's hover-open gap was found only after the build,
  because no spec line said "hover opens"; this rule exists to stop that. And the first draft of
  the example table itself missed six menu behaviours from `EXPERIENCE.md` (pointer coming back
  within 150ms, one menu at a time, focus leaving the panel, navigation, pen input, the pinned
  menu); the code review caught them.

## 2026-10-02 — Story 2.2 two-tab contact form (`bmad-build`)

- **Prompt (Hoang Vu):** build Story 2.2 with the new "UX checks" table in the spec; fold in the 120s timeout for the eslint-config test; lead decisions: shared office data, EXPERIENCE.md labels ("Role", "Start timing"), a valid submit shows nothing until Story 2.3.
- **What the AI did:** a 15-line UX checks table before coding, 9 tasks with tests first (shared validation rules for 2.3, office data, strings, the client form with ARIA tabs and a live region, the `/demo` page, CSS, a smoke test), one task review each, then a 5-layer code review: 9 patches, 4 deferred, 14 rejected against the spec. 285 tests pass, 100% changed lines.
- **AI got it wrong?** Yes. The first evidence claimed all 15 UX lines were checked in Chrome when the walk script covered about 8; the acceptance auditor caught it, the script was extended to all 15 and the evidence re-captured. The form fields also first removed the focus outline (decision T9's 2px ring), caught by a task review.

## 2026-10-02 — Story 1.8 Sanity setup (`bmad-build`)

- **Prompt (Hoang Vu):** build Story 1.8 on the free plan; the lead created project `1khn3hf4` and chose dataset `production`, Studio host `xiontech-landing`, and the full spec; secrets stay out of source, logs and chat.
- **What the AI did:** 9 tasks with tests first: a server-only client and one tagged, cached fetch helper; a fail-fast config check in `next.config.ts`; a signed webhook route that revalidates `post` / `job`; a separate `studio/` package with EN/VI schemas; `.env.example`; a `sanity:check` proof script; `docs/sanity.md` with the account steps, free-plan limits and the audit result (T7). Then a 5-layer review: 24 findings, 4 patched, 4 deferred (one from the patch re-review), the rest rejected with reasons. 318 tests pass, 100% changed lines, no Studio code in the build.
- **AI got it wrong?** Yes, three times. The first draft check passed with no drafts at all (it now needs a real draft ID, or says "not proven"). The setup doc told the lead to give `localhost:3000` CORS credentials, which would let any local page act as a logged-in editor; the security review caught it. And the script used a different API version from the app while its comment said "same settings".
- **Still open:** the real read (`npm run sanity:check` with a published post and job) and the webhook delivery wait on the lead's account steps; the PR waits for that proof.

## 2026-10-02 — Story 1.8 webhook goes live

- **Prompt (Hoang Vu):** after merging #14, the first Sanity webhook delivery failed with 401 "Invalid signature".
- **What the AI did:** signed a test call with the local secret (without printing it) and sent it to the dev route: 200. That proved the code and the Vercel secret were right, so the webhook's own secret was wrong. It held the variable name `SANITY_REVALIDATE_SECRET`, not its value. After the fix, the delivery got 200. Webhooks on the Free plan are now confirmed.
- **AI got it wrong?** Partly. The setup guide said "Secret: the value of `SANITY_REVALIDATE_SECRET`", which was easy to read as the name; it now adds "only the text after `=`, without quotes or spaces, not the variable name".

## 2026-10-03 — Story 2.3 contact form delivery (`bmad-build`)

- **Prompt (Hoang Vu):** build Story 2.3: real sending for the `/demo` form with spam protection. Lead decisions: Gmail SMTP with an App Password (nodemailer) and Upstash Redis (free, via the Vercel Marketplace); the error texts; fail open when Upstash is down; then, during the build, the contact inbox becomes the lead's company email in every environment (the manager receives no form mail), an IP-only limit of 20 per hour after the security review, and the mail variables stay on all previews.
- **What the AI did:** 9 tasks with tests first: shared length and date-format rules, a server parser with a honeypot and a time-zone-safe "today", delivery (config check, SHA-256 rate-limit keys, Gmail send with Reply-To), the `/api/contact` route, the form states ("Sending...", thank-you panel with focus, inline server errors, failure and rate-limit messages with every value kept, a 15 s timeout), CSS, a smoke test and `docs/contact-delivery.md`. A task review per task, then a 5-layer review: 24 findings — 4 decided by the lead, 4 patched, 8 deferred, the rest rejected with reasons. 464 tests pass, 100% changed lines. One real test mail reached the lead's inbox; the real Upstash limit blocked the sixth call.
- **AI got it wrong?** Yes, several times. The spec missed the lead's own decision D1 (test mail to the lead, not to the manager) and first put the manager's address on Preview. The first UX walk printed "request URL has no query: true" as a fixed value, not a check; the acceptance auditor caught it and the walk was rewritten to read the real URL and to run at 390px too. A date test used past dates, so it could not fail for the new format rule. The docs first listed the route checks in the wrong order. Two implementers stalled or were stopped mid-task; their work was finished and its test-first run redone.
- **Still open:** after merge, a real send and the sixth-send check on the dev site; after the first release, a real send on production. Deferred items are in `deferred-work.md` (startup config check, honeypot autofill check, duplicate mail on a lost response, screen-reader pass).

## 2026-10-03 — Plan C: stories moved from Sammy to Andy

- **Prompt (Hoang Vu):** Sammy had 1 of 20 stories started on 03/10 and Andy's remaining stories were blocked by Sammy's; "re-assign to unblock and consolidate", then "apply C".
- **What the AI did:** compared the open work with the Demo-day plan sizes in `epics.md`, proposed three splits, and applied plan C: 9 spec folders moved from `specs/sammy/` to `specs/andy/` (1.7, 2.1, 6.5, 3.7, 6.1, 6.2, 4.1–4.3), `owner` changed in each SPEC, both README schedules rewritten, decision P1 added. Andy now builds the forms and every page that reads Sanity, plus Products, Not found and Privacy; Sammy keeps Home, Services and About, so Sammy's commits stay visible (challenge rule 3).
- **AI got it wrong?** Yes, twice. First, the first draft of the schedule gave Story 1.1 the PR number #4 from memory; checking GitHub showed #7. Second, the first commit changed only the `owner:` line and left old ownership text, old `build_day` values and a false "no story waits on another owner" claim; the two-layer review caught them and they were fixed. Open: the work still exceeds the days left, so the lead decides the cuts (6.3, slim 7.3/7.4, 6.6 without CV upload, Thu 08 buffer); `epics.md` (Amber) still shows the old split.

## 2026-10-03 — Story 1.5 site footer (`bmad-build`, one-shot) and its PR follow-up

- **Prompt (Son Nguyen):** build the unblocked stories, starting with 1.5 while Story 1.1 was not merged; later "follow PR 17 for our PR": spec with UX checks, build, unit + Playwright, review, evidence.
- **What the AI did:** a one-shot spec, the footer Server Component with office data defined once (`src/content/offices.ts`) for 2.2 and 6.4, tests first (7), a one-layer build review and a 4-layer `bmad-code-review`. For the PR follow-up: a 16-line UX checks table, a Chrome walk at 1280/899/639/390px with the footer mounted locally only (Andy mounts it, T3), screenshots, then two fixes test-first and a light review of them.
- **AI got it wrong?** Yes. The first build had no UX checks table, so two problems only surfaced in the walk: the focus ring was the global navy on the ink footer (now focus-on-navy) and text links were 19px tall (now 24px). During the merge of `develop` a command chain committed a merge with two failing Home tests because a piped `tail` hid the exit code; it was fixed in the next commit.

## 2026-10-03 — Story 2.4 email capture band (`bmad-build`)

- **Prompt (Hoang Vu):** build Story 2.4 (plan C: Andy's). Lead decisions: the capture send uses the same honeypot and rate limits as the contact form; the demo band goes on the Home placeholder now; full spec kept.
- **What the AI did:** 8 tasks with tests first: a shared email rule, a `type: "capture"` branch in the existing contact route (mail subject "Demo capture" / "Project capture", no personal data), a shared send helper, the `CaptureBand` component (prototype texts, honeypot, Sending..., inline failure, session-storage handoff, `router.push`), the `/demo` prefill and `#project` scroll, the band CSS, the demo band on Home, docs. A task review per task, then a 5-layer review: 18 findings — 4 patched (`method="post"` on both forms so a press before hydration never puts the email in a URL; the prototype ring, heading width and lede gap; ignore a late send after the visitor left), 6 deferred, the rest rejected. 572 tests pass, 100% changed lines; walked in Chrome at 1280, 900 and 390px.
- **AI got it wrong?** Yes, several times. The controller started triage before the last review layer had reported, then accepted that layer's breakpoint advice (`<` instead of `<=`) without checking the contract; the browser walk showed the band two-column at 900px and the change was reverted (CAP-8 says "640px and below"). A task-7 implementer ran only its own test file and missed a mock that broke `no-js.test.tsx`. Twice the evidence text claimed more than the walk observed (all UX lines, then keyboard/touch sending and a 15.2 s timeout the run measured as 15.3 s); the acceptance auditor caught both, and the lead chose to narrow the claims to what was observed (the ledger keeps an UNVERIFIED row as history). Two background check runs were stopped by Claude Code for low memory; running each command in the foreground worked.
- **Still open:** a real capture on the dev site after merge; the project band is placed by Story 5.4.

## 2026-10-03 — Story 3.1 Home hero fixed against the merged Story 1.1

- **Prompt (Son Nguyen):** compare the Story 3 specs with our branches, then fix 3.1 after pulling the latest `develop`.
- **What the AI did:** an acceptance audit of 3.1–3.6 against the current specs and the merged 1.1 `globals.css`, then for 3.1: a build spec with a 14-line UX checks table, tests first, the hero moved onto 1.1's `.label`, `.hl`, `.btn .btn-primary`, `.wrap` and `text-display-hero-fluid`, the prototype's glow layer and device frames ported into a Home section of `globals.css`, a Phosphor arrow, a Chrome walk at 1280/900/899/390px with screenshots, and a full 4-layer review (3 patched, 1 deferred, the rest rejected with reasons).
- **AI got it wrong?** Yes. The first build (2026-10-01, before 1.1 merged) guessed component class names from DESIGN.md (`highlight-mark`, `button-primary`, `device-frame`), which 1.1 never defined, so the hero rendered unstyled while every test passed; the same applies to 3.4 and 3.5. In the fix, one new test passed by accident (`toContain("hl")` matched "highlight-mark"), the caption first used the heading colour (white on the paper frame), and only the browser walk showed the H1 at about 1.1rem.

## 2026-10-03 — Footer mount and one office data source

- **Prompt (Hoang Vu):** after Sammy's footer (Story 1.5, #15) merged, mount it (decision T10) and remove the duplicate office data.
- **What the AI did:** rendered `SiteFooter` after `<main>` in the root layout (tests first in `layout.test.tsx` and `no-js.test.tsx`); switched `/demo` to Sammy's `src/content/offices.ts` and deleted `office-data.ts`, keeping the `/demo` output the same; a 4-layer review (Acceptance skipped: no spec) found that the office facts had lost their only test and that the `/demo` loop did not check every contact link — both patched.
- **AI got it wrong?** Yes: the security review layer was first launched with a prompt path that does not exist (the security prompt lives under the `bmad-build` render, not `bmad-code-review`); it stopped at once and was relaunched.
- **Open:** footer links point to pages that the page stories build later; `/demo` shows the offices twice (page and footer), as in the prototype.

## 2026-10-03 — Story 1.7 Not found page (`bmad-build`, one-shot, built in parallel)

- **Prompt (Hoang Vu):** build easy stories in parallel; 1.7, 2.1 and 4.1 run at the same time in three git worktrees.
- **What the AI did:** one-shot build in its own worktree: `not-found.tsx` with the navy hero, "Go to Home" and three section links, no capture band, title "Page not found" with noindex, a unit test and a `@smoke` 404 test. Full checks, then the build, smoke and browser walk in the main checkout. A 5-layer review found no Critical or Important issues.
- **AI got it wrong?** Yes. The worktrees first lacked BMad's git-ignored personal config, so every build agent stopped at once. Turbopack rejected the shared `node_modules` link in the worktree, so the build had to run in the main checkout. The controller left the spec out of the review diff, so one reviewer reported a missing UX table that exists.

## 2026-10-04 — Story 3.2 silk and motion toggle, after 3.1 merged

- **Prompt (Son Nguyen):** 3.1 merged; move to 3.2 and pull the latest `develop`.
- **What the AI did:** merged `develop` (resolving the hero and Home test conflicts), wrote the 3.2 build spec with a 14-line UX checks table, fixed three things test-first, walked every line in Chrome (motion proven by comparing screenshots 1.5s apart; reduced motion, JavaScript off and no WebGL each in their own browser context) and ran a light review (no findings).
- **AI got it wrong?** Yes. The first build put the canvas at `-z-10`; once 3.1 added its opaque glow at −2, the silk was painted underneath and could never show, and every unit test still passed. It was only noticed while resolving the merge. The toggle was 38px wide, not 36px, and the icons were inline SVG, not Phosphor. The first walk also said the silk kept moving after Pause, because it compared an area with the toggle and text drawn over the canvas; a clean strip at the edge showed it stopped.

## 2026-10-04 — Story 1.6 motion part on Andy's `/demo` hero

- **Prompt (Son Nguyen):** apply the same kind of motion as our Home hero to Andy's pages (Andy agreed), capture screenshots of his page, and commit it into PR #23.
- **What the AI did:** proposed Story 1.6's motion ACs (aurora, strand ribbon, highlight draw-in; an "after demo" story), wrote a build spec with a 9-line UX checks table, built a shared `HeroArt` client component and `strands.ts` ported from the prototype, CSS in a shared section of `globals.css`, one line on `/demo`; tests first, a Chrome walk with screenshots of `/demo`, and a full 4-layer review (4 patched, the rest triaged).
- **AI got it wrong?** Yes, several times. A first draft added `setTransform?.()` only to suit a test mock (test logic in production code). All four reviewers found that the ribbon was never redrawn after coming back on screen; the unit tests had only checked that drawing stops. The walk misled three times: a screenshot strip covered by the form card, a pixel read taken before the canvas's first paint, and a "scroll away" that never took the 1123px hero off a short page. Each was traced (draw-call and observer logs) before any code changed.

## 2026-10-04 — Story 3.3 stats band, after 3.2 merged

- **Prompt (Son Nguyen):** PR #23 merged; move to 3.3.
- **What the AI did:** merged `develop` (one test conflict, both tests kept), compared the band with the prototype `.stats` / `.stat` rules, wrote the 3.3 build spec with an 11-line UX checks table, fixed four style gaps test-first, walked every line in Chrome at 1280/1080/1079/640/639/390px with screenshots, and ran a light review (3 low findings, rejected with reasons).
- **AI got it wrong?** Yes. The first build (before 1.1 merged) drew the label as plain caps without 1.1's `.label` rule, used a fixed 3rem figure size, put a divider before the first figure and left captions unbounded; no test noticed. The first new tests then failed for the wrong reason (a typo, `stats` for `STATS`), which was fixed before the red run counted.

## 2026-10-05 — Story 3.4 front doors, after 3.3 merged

- **Prompt (Son Nguyen):** PR #25 merged; move to 3.4.
- **What the AI did:** merged `develop` (hero → doors → capture band order), wrote the 3.4 build spec with a 12-line UX checks table, ported the prototype door, badge and chip rules into `globals.css` (shared with 3.5), rewrote the doors on them with Phosphor icons, tests first, a Chrome walk (mouse, keyboard, touch, reduced motion, 900/899/390px) with screenshots, and a full 4-layer review: 6 patched, the rest triaged.
- **AI got it wrong?** Yes. The first build used class names Story 1.1 never defined, so the doors, badges and chips were unstyled while every test passed; a new test now reads `globals.css` and fails on that. Hover effects also applied on touch devices, against `EXPERIENCE.md`. Writing tests through a script twice mangled escapes: a regex `\b` became a backspace character (also in the spec note) and a template-string regex lost its backslashes; both were caught before the red run counted. The first walk reported a 611px "lift" because the hover scrolled the page.

## 2026-10-05 — Story 3.5 app bento and service cards, after 3.4 merged

- **Prompt (Son Nguyen):** PR #26 merged; move to 3.5.
- **What the AI did:** merged `develop`, wrote the 3.5 build spec with a 15-line UX checks table, ported the prototype bento, tile, mini-phone and service-card rules (reusing 3.4's badges and chips), rebuilt both sections with Phosphor icons, moved the "classes must exist in globals.css" check into a shared test helper, tests first, a Chrome walk at seven widths plus touch, keyboard and reduced motion, and a full 4-layer review: 9 patched, the rest triaged.
- **AI got it wrong?** Yes. As in 3.1 and 3.4, the first build used class names Story 1.1 never defined, so the bento and cards were unstyled. The review then found that the new navy card made its focus ring amber on a white section (nearly invisible), the tile ring's corners were clipped, and the undefined-class helper itself could pass falsely: it counted a class mentioned in a CSS comment (one the AI had just written) and inside other compound selectors. A script again produced a backspace character in a test; the script's own guard stopped it this time.

## 2026-10-03 — Story 2.1 Privacy policy page (`bmad-build`, one-shot, built in parallel)

- **Prompt (Hoang Vu):** build easy stories in parallel; 1.7, 2.1 and 4.1 run at the same time in three git worktrees.
- **What the AI did:** one-shot build of `/privacy`: breadcrumbs, H1, eight outline sections marked `[Placeholder]` except the decided retention sentence (A4), no capture band, a unit test and a `@smoke` test. Browser walk in the main checkout, then a full 5-layer review: Security clean, CAP-1 to CAP-6 met.
- **AI got it wrong?** Yes. The first walk forced focus from code, so "Tab reaches the breadcrumb" was ticked without proof; two reviewers caught it, and the walk now tabs to it. Some width readings came from a script that was not saved, and a pen row was ticked but never walked. The page text said the capture email stays only in the browser, but Story 2.4 mails it to the inbox. One reviewer said Sanity was missing from the share list; that was false (decision T1).

## 2026-10-05 — Story 3.6 4-D process flow, after 3.5 merged

- **Prompt (Son Nguyen):** PR #27 merged; move to 3.6.
- **What the AI did:** merged `develop` (page, test and content conflicts), wrote the 3.6 build spec with a 13-line UX checks table, ported the prototype's illustrated flow (track, nodes, step art with orbs, dashed rules, grid texture) with Phosphor icons as step data for 5.4, fixed the load flash, tests first, a Chrome walk that records every reveal phase (including opening `/#process-title`) at six widths with reduced motion and JavaScript off, and a full 4-layer review: 7 patched, the rest triaged.
- **AI got it wrong?** Yes. The first build had no illustrations and replayed the reveal after a flash. During the fix the walk showed the stagger delay also delayed hiding (steps 2–4 stayed visible off screen for up to 2s), and the first "already in view" check counted 1px as seen, which the review caught. Andy's "no CSS hides content without JavaScript" test flagged a `display: none` inside a media query; the nodes are now visually hidden instead. The walk's first "in view at load" scenario used a tall window, which only made the 100dvh hero taller.

## 2026-10-03 — Story 4.1 Products hero and sticky sub-nav (`bmad-build`, one-shot, built in parallel)

- **Prompt (Hoang Vu):** build easy stories in parallel (1.7, 2.1, 4.1); later "Remember to rebase with latest develop".
- **What the AI did:** one-shot build of `/products`: amber hero with breadcrumbs, highlighted H1, Book a demo, empty device frames; a sticky glass sub-nav with PXP, LXP, SXP, IoT pills and four anchor stubs. Browser walk, full 5-layer review, rebase onto `develop`, then a second walk.
- **AI got it wrong?** Yes. The build counted the header twice in the anchor offset (sections landed at 216px, not 144px) and left the pill hover without its 0.3s fade; the walk caught both. It set smooth scroll site-wide without the Next.js 16 `data-scroll-behavior` attribute, so every page change would animate; two reviewers caught it from the Next 16 upgrade guide. The first evidence measured the header's Book a demo instead of the hero's, ticked "scrolls sideways" when nothing overflowed, and copied scroll numbers from an older run. The one-shot triage had wrongly rejected a `/products` smoke test the spec asks for.

## 2026-10-03 — Brand name "XionTech" in the footer

- **Prompt (Hoang Vu):** "XionTech is right" (the Products title said "XionTechs", `/privacy` said "XionTech"), then "both" (fix the footer and start the next stories).
- **What the AI did:** changed the footer logo alt text and copyright to "XionTech", tests first. The mockup and the old site say "XionTechs"; the domain stays `xiontechs.com`.
- **AI got it wrong?** Yes. The first test anchored the copyright with `$`, but the line has more text after the name; it now uses a word boundary. The AI also dated this entry and the Story 4.1 entry 2026-10-05 (copied from the entries above) instead of the real date, 2026-10-03; the review caught it. The rule now sits in `AGENTS.md`.

## 2026-10-03 — Story 4.2 PXP story phone (`bmad-build`, one-shot, built in parallel with 4.3)

- **Prompt (Hoang Vu):** build Story 4.2 in its own worktree while 4.3 is built in another; change only the PXP part.
- **What the AI did:** one-shot build of `/products#pxp`: a Server Component section (badge, H2, lede, four features, `[Placeholder]` App Store and Google Play buttons that open a new tab) and one client island, the story phone with five ARIA tabs (roving tabindex, arrows, Home, End) and five empty `[Placeholder]` screens; inactive screens use `hidden` (AC-A11Y-3). Temporary store links live in a new `src/content/product-links.ts`, the one place 4.3 also uses (A1). Tests first, 19-line UX checks table, one review layer. Build, smoke and the browser walk wait for the controller (the worktree's `node_modules` junction blocks Turbopack).
- **AI got it wrong?** Yes. The first draft of the UX table invented a 0.3s hover colour for the tab pills that the prototype does not have. The review found icons matched to content by array position (a reorder would crash), a keyboard test that fired keys on the tablist instead of the focused tab, a focus test that could never fail and a brand-name test on text that never says "XionTech"; all fixed.

## 2026-10-03 — Story 4.2 full review and lead decisions

- **Prompt (Hoang Vu):** answered three questions from the review: mark the PXP claims `[Placeholder]`; text before the phone below 900px; no new tab while a store link is `#`.
- **What the AI did:** rebased onto `develop`, ran build, smoke and a browser walk in the main checkout, ran the 5-layer review, applied the three decisions tests first, blocked no browser shortcuts in the tab key handler, added a page test for `#pxp`, then walked again.
- **AI got it wrong?** Yes. The build copied product claims from the mockup as facts; the mockup's phone-first order hid the heading after a `#pxp` jump on narrow screens; a `#` store link opened a second copy of the page; the key handler swallowed Alt+Left. The first walk read the store hover while the page was still scrolling. The controller also wrote a wrong deferral line and corrected it. A second and third review round then found that the text-first markup broke desktop Tab order and that a `#` store link still jumped to the top (the controller had told the lead it "does nothing"); the lead chose phone-first markup with CSS order below 900px, and disabled labels for stand-in store buttons.

## 2026-10-03 — Story 4.3 LXP, SXP and IoT sections (`bmad-build`, one-shot, built in parallel with 4.2)

- **Prompt (Hoang Vu):** build Story 4.3 in its own worktree at the same time as 4.2; keep the PXP stub so the merge stays simple; one-shot if step 2 agrees.
- **What the AI did:** one-shot build of `#lxp` (mist, linen), `#sxp` (navy, grid) and `#iot` (paper, four service cards) on `/products`, each with audience chips, four features and a browser frame whose `[Placeholder]` URL pill opens a new tab. The three web addresses live in `src/content/product-links.ts`, the one place 4.2's store links also go (A1). Tests first, one review layer (Blind Hunter): 5 patched. Build, smoke and the browser walk are left to the controller, because Turbopack rejects the worktree's `node_modules` junction.
- **AI got it wrong?** Yes. The URL pill would be cut off on a 320px phone, the LXP features went to 4 narrow columns from 641px, the SXP browser frame came before its heading in reading order, and the icon maps accepted any string, so a renamed feature would crash at render; the review caught all four. Lint also rejected the first helper props (`prefer-read-only-props`).

## 2026-10-03 — Story 4.3 merged onto 4.2, full review and lead decisions

- **Prompt (Hoang Vu):** "both" (footer fix and the next stories), then three answers from the reviews: a stand-in URL pill is a disabled label like the 4.2 store buttons; one rule for product claims (the business confirmed feature copy on 2026-09-28, so PXP's feature lines are unmarked too); SXP follows the PXP layout pattern.
- **What the AI did:** rebased 4.3 onto the merged 4.2, resolved the conflicts by hand (one `product-links.ts`, no stub sections left), walked the page, ran the full 5-layer review, applied the decisions tests first, typed the icon maps, and walked again.
- **AI got it wrong?** Yes. 4.2 and 4.3 each added a `.feature-list` rule; the later copy silently forced the LXP features to 2 columns, which only the walk caught. The 4.3 build spec still described the old new-tab pill after the decision changed, and two of its rows disagreed about the IoT cards at 640px. For 4.2 the AI had marked PXP feature lines `[Placeholder]` without checking EXPERIENCE.md, which already records the business confirmation.

## 2026-10-03 — Story 6.5 Careers page and open roles (`bmad-build`, full route, worktree)

- **Prompt (Hoang Vu, through the controller):** build Story 6.5 in its own worktree; at the plan checkpoint, answers Q1-B (add `slug`, `team`, `closed` to the `job` schema), Q2-B (Life at XionTech photos wait for Story 6.3; three `[Placeholder]` frames now), Q3 (fixed culture photo frame), then "Approve and continue", "Keep full spec".
- **What the AI did:** wrote the build spec with a 24-line UX checks table, then 7 tasks tests first by sub-agents: the job schema fields, a GROQ query for open roles (published and not closed, with a slug) through the Story 1.8 `sanityFetch` helper with tag `job`, the page copy, five Server Components, the page, the CSS port and an `@smoke` test. One review layer (Edge Case Hunter): 1 patched, 8 rejected with evidence. Build, smoke and the browser walk wait for the main checkout (Turbopack rejects the worktree's `node_modules` junction).
- **AI got it wrong?** Yes. The planning sub-agent compiled the Epic 6 context from `epics.md` and copied two facts that the 2026-10-01 decisions had replaced (a shared content module, CVs stored in Sanity); the controller caught it and the file was fixed. The type-label lookup used a plain object, so a type named `constructor` would print function source; the reviewer caught it. The first build also had no check that its class names exist in `globals.css` (the 3.1/3.4/3.5 mistake); a guard test was added before review closed.

## 2026-10-04 — Story 6.5 Careers: walk and full review

- **Prompt (Hoang Vu):** answered the plan questions (job schema gets slug, team and closed; Life photos stay `[Placeholder]` frames until Story 6.3; the culture photo is a fixed frame), then approved the plan; the build ran in its own worktree.
- **What the AI did:** rebased onto `develop`, ran build and smoke in the main checkout, walked `/careers` at six widths plus reduced motion, ran the 5-layer review, fixed the clipped Life frames, added tests for the query projection and the required slug, and recorded the decisions as A8.
- **AI got it wrong?** Yes. The Life frames reused `.illo`, whose 320px minimum height overflowed the 4:3 box, so the bottom and caption were cut off; the first walk only measured the outer box and missed it. Two tests passed whatever the code did (the query text only, and "validation is a function"). The role cards cannot be checked in a browser until a role with a slug is published.

## 2026-10-04 — Studio deploy, role-card walk and Studio list titles

- **Prompt (Hoang Vu):** "I don't see the slug and team" (screenshots of the Studio after `sanity deploy`), then "published", then "1" (the small follow-up PR).
- **What the AI did:** found that the deploy ran from a checkout that had not pulled the merged #35, so the old schema went live; pulled `develop` and the lead deployed again. Checked the published role through Sanity's public query API and the dev site's cache headers, then walked the role-card rows on the dev site. The follow-up adds Studio list titles (`preview`) to `job` and `post`, records the Studio `appId` in `sanity.cli.ts`, and writes the walk into the 6.5 spec.
- **AI got it wrong?** Yes. The AI told the lead to deploy right after the merge without saying to pull `develop` first. Both Studio types had no `preview`, so every list showed "Untitled"; the 1.8 and 6.5 reviews did not notice it.

## 2026-10-04 — Story 1.4 Mobile menu (`bmad-build`, one-shot, worktree)

- **Prompt (Hoang Vu, through the controller):** build Story 1.4 in its own worktree from the 1.3 header; the header is on every page, so let step 2 choose the route; write the UX checks table.
- **What the AI did:** step 2 chose one-shot (no open questions, nothing irreversible, one new client component). Added `MobileMenu` (Menu pill and paper panel, Book a demo first at 640px and below), `NAV_LINKS` in `nav-data.ts` (now also used by the desktop links), and mounted it in the header after Book a demo. Escape, focus trap over the header's visible controls, scroll lock, and close on any link, navigation or growing above 1080px. Tests first (jsdom stubs the breakpoint boxes and `matchMedia`); one review layer (Blind Hunter): 5 patched, 3 rejected, 1 false, 1 pending for Amber, 1 deferred. The controller then ran build, smoke and a browser walk in the main checkout and the full 5-layer review.
- **AI got it wrong?** Yes. The first version closed the menu only from its own links, so tapping the logo on Home left the menu open and the page locked; the scroll lock also overwrote any earlier `overflow` value. The trap tests used a stand-in header, not the real one. The review caught all three. The AI also put the header Book a demo (641–1080px) in the focus trap as its own choice, though CAP-3 does not list it; it is now a pending UX row for Amber. The full review then found that the desktop links had lost their React `key`, that `max-[640px]` means below 640px in Tailwind v4 (the test stub assumed 640px and below, so it passed while the page was wrong at exactly 640px), and that a spec row's evidence was a copy of the row above (the controller's own script error).

## 2026-10-04 — Story 1.4 mobile menu: four review rounds

- **Prompt (Hoang Vu):** build 1.4 in parallel with 3.7 and 6.6; the controller walks and reviews each story before asking "push".
- **What the AI did:** walked the menu at 1081, 1080, 800, 641, 640 and 375px plus reduced motion and `/demo`, and ran the full 5-layer review four times, because each round of fixes went over CLAUDE.md's 50-line limit for a light review.
- **AI got it wrong?** Yes, several times. Round 1: the desktop links lost their React `key`, and `max-[640px]` means below 640px in Tailwind v4, so the menu had no Book a demo at exactly 640px (the test stub had the same wrong idea). Round 2: to fix review points the AI made modifier clicks and `target="_blank"` links keep the menu open, which narrowed CAP-8 without a human decision; round 3 reverted it. Also in round 2, a `#form` link on `/demo` left focus on the page body; the browser walk showed it, and focus now goes to the form. The controller also wrote a wrong evidence cell (a copy of the row above) and claimed no site link uses `target="_blank"`, which was false. Lesson: fixing every Minor review point keeps the line count over 50 and starts another full round; until Demo day only Critical and Important points are fixed.

## 2026-10-04 — Story 3.7 Home latest news: category field and heading

- **Prompt (Hoang Vu, through the controller):** build Story 3.7 in its own worktree; answered the question about the news tag: add `category` and `app` to the `post` schema in this PR (decision A9).
- **What the AI did:** found that the `post` schema had no category field, so the CAP-1 tag on the news card had no data source. It asked the lead instead of guessing a value or hard-coding tags. After the answer it added `category` (required) and `app` (only for Product) with schema tests, and recorded A9 and the post-merge deploy step in `docs/sanity.md`. The heading reads "Latest from XionTech." because the brand rule wins over the mockup's "XionTechs".
- **AI got it wrong?** Not on this point: the gap was caught while reading the spec against the schema, before any code used a made-up field.

## 2026-10-04 — Story 3.7 Home news: full review and lead decisions

- **Prompt (Hoang Vu):** two answers from the review: Home must survive a Sanity failure; make the post slug and published date required.
- **What the AI did:** rebased onto `develop`, ran build and smoke, walked Home, ran the 5-layer review, and fixed only the Critical and Important points: a guarded news fetch and date, the required post fields, the class-rule test, and complete post-merge steps.
- **AI got it wrong?** Yes. The build copied "Sanity error propagates" from Careers to Home, so one outage or one post with a bad date would have broken the landing page and the build; two reviewers caught it. The post-merge docs left out the slug and the date, so following them would still show 0 cards; the walk found 0 cards because the only post had neither. The first review layer had also found an inherited-key lookup (`categoryLabels["toString"]`) and an unencoded slug, which were fixed during the build.

## 2026-10-04 — Real news posts, and the stale CDN refresh

- **Prompt (Hoang Vu):** "can you help me to create by yourself with real information?", then "do not write anything like placeholder or sample or fake", then "publish" and "fix".
- **What the AI did:** found that the current xiontechs.com "blog" is the WordPress theme's demo posts (one is about Latin and Cicero), so there was no real news to copy. It declined to invent news events and instead wrote 3 posts only from confirmed facts (the business-confirmed product copy, decision A7, and the verified offices), showed the text to the lead, and published it with the Sanity CLI. Then it walked the cards on the dev site, removed the Home sample note, and turned off the Sanity CDN for server reads.
- **AI got it wrong?** Partly. The first webhook refresh after publishing cached 0 cards: the client used the Sanity CDN, which still returned the old result right after the publish. The 3.7 build and its two reviews had not caught that `useCdn: true` and webhook-driven refreshes do not mix.

## 2026-10-04 — Story 6.6 Job page and CV upload (`bmad-build`, full route, worktree)

- **Prompt (Hoang Vu, through the controller):** build Story 6.6 in its own worktree; answers Q1-A (the apply route attaches the CV to the mail), Q2-A (add `responsibilities` and `requirements` lists to the `job` schema), Q3-A (install `@vercel/blob` 2.8.0), keep the full spec, approve and continue.
- **What the AI did:** wrote the build spec with a 21-row UX checks table, then 16 tasks tests first by sub-agents: `getOpenRole`, shared CV and field rules, `parseApplication`, the application mail with the CV attached, a token route for a private Vercel Blob upload, the apply route, an endpoint-aware `postSubmission`, the form, hero and details, the job page with a real 404, CSS, an `@smoke` file and the docs. One review layer found a 15 s browser timeout shorter than the 30 s route, which was patched.
- **AI got it wrong?** Yes. The first `npm install` of `@vercel/blob` in the worktree pruned `vite` out of the shared `node_modules` and rewrote 800 lines of `package-lock.json`; the controller reverted and reinstalled. The first token route used `handleUpload`, which needs a read-write token, but the lead's store only has OIDC and a store id; it was reworked to `handleUploadPresigned` after the lead's note. `validateApplication` first needed a CV file object and a phone error slot that the server and the matrix do not have.
- **Decision / result:** decision A10 in `decisions-2026-10-01.md`; build, smoke and the browser walk are pending (controller).
- **Follow-up (lead, same day):** the review found that CVs from failed or abandoned applications would stay in the 1 GB store; the lead chose to delete the CV whenever the apply route does not send the mail, upload again on every submit, and lower the token limit to 5 per IP per hour (A10).
- **Full review, walk and second follow-up (lead, 2026-10-04):** the full 5-layer review found that any caller who knows a CV path could make the apply route delete it, with no rate limit, and that a used-up upload limit showed "try again" instead of the rate message. The lead chose in chat: delete an unsent CV only after the rate limits passed (rate limits now run before the Sanity role lookup), and answer a used-up upload limit with 200 and no presigned URL so the Blob SDK throws a known error and the form shows the rate message. The browser walk on the production build found that the CV file input made the page scroll sideways at 390px (`min-width: 0` fixed it). **AI got it wrong?** Yes: my script that filled the UX checks table wrote `||`, so every "Checked" cell landed in an extra column; I marked the 900px layout row ✅ although the walk showed it fail; four more rows (hero, "All open roles", focus ring, reduced motion) claimed checks the walk never made; one cell put focus on the alert instead of the button; and the walk hid a failed wait behind `.catch(() => {})`. The second and third reviews caught these. Build and smoke (10 passed) pass; the walk ran and shows one known fail (at exactly 900px the form stays beside the details, deferred); a real upload and mail follow after merge on the dev site.

## 2026-10-04 — Real job opening and the first real application (after #40)

- **Prompt (Hoang Vu):** "Help me do all steps left by yourself with real jobs opening, not placeholder", then "Real jobs I mean real content".
- **What the AI did:** deployed the Studio from `develop`; searched for real XionTech openings. The official careers page says "Currently no job offers available"; the only real posting, "Fresh Full Stack Developer", says "Offer ended on 30.06.2025". The AI refused to invent an opening or to show the ended role as open on its own, and asked. The lead confirmed in chat that XionTech is hiring this role now, so the AI published it with the posting's text word for word (`spec-6-6-job-page-cv-upload-evidence/published-jobs.md`) and closed (not deleted) the `[Placeholder]` sample job. Then it sent one clearly marked test application ("[Test] Claude walk", test@example.com, a 1-page test PDF) through the dev site: upload 200, apply 200, success panel.
- **AI got it wrong?** Yes, a small one: the first walk selector for the `/careers` list was wrong and found no roles. The AI re-checked with a working selector and removed the wrong line from `walk-dev-output.txt`. The first draft of `published-jobs.md` also said "Nothing was added", although the team and the short location are the lead's choice; the review caught it.
- **Decision / result:** the lead received the application mail with the CV attached, so the apply flow (upload, apply, mail) works end to end on the dev site (https://xiontech-dev.vercel.app). The job page shows the real role with its three sections.

## 2026-10-05 — Stories 6.1 and 6.2: News page and story page (`bmad-build`, one-shot)

- **Prompt (Hoang Vu):** "6.1", then "6.2" (after "check progress and what's remaining works?").
- **What the AI did:** built `/news` (filter chips, live count, empty panel, wide feature card) and `/news/[slug]` (crumbs, date and tag, body, "See <app>", "Back to News", 404 for an unknown slug that costs no Sanity request), tests first, with a browser walk on the production build for each, one full 5-layer review per story and a second full round for 6.2.
- **AI got it wrong?** Yes. 6.1: the wide feature card came out 1002px tall (`grid-row: 1 / span 99`); the walk caught it. 6.2: the first walk read the old page after a client-side navigation, and the AI marked UX rows ✅ for keyboard and crumb checks it had not run; "See PXP" would show on a Company story with a leftover app; a story with no body was almost blank. The reviews caught these; all are fixed.
- **Decision / result:** both pages work end to end on real posts; Minor points are in `deferred-work.md`, incl. giving `/careers/[slug]` the same list-first check.

## 2026-10-05 — Story 5.1 Services hero with live office clocks (`bmad-build`, full route)

- **Prompt (Son Nguyen):** move to 5.1; build it with `bmad-build`.
- **What the AI did:** chose the full route (the clock module is shared with About, 6.4), compiled the Epic 5 context, wrote a build spec with a 6-row edge-case matrix and a 14-line UX checks table, got the human's approval, then ran 7 tasks through implementer subagents (tests first) with an independent task review each. It captured evidence itself (the four verification commands, a Chrome walk on a production build using Playwright's clock to prove the 30 s refresh) and ran a 5-layer review (3 patched, 1 deferred, the rest triaged); an independent auditor re-checked every evidence hash.
- **AI got it wrong?** Yes. The ported CSS selector `.clock-strip span` also matched the time's own span and would have drawn a pill inside each pill (caught by the task review). The page's office lookup had an untested silent-drop branch that failed the branch-coverage gate at the acceptance run; it was replaced so a wrong id is a compile error. The lede copied Andy's 18px spacing instead of the prototype's 20px. Implementers twice left work uncommitted or reported more checks than they ran; the controller verified every claim against the diff. The dev server returned 500 on this machine (Google fonts in `layout.tsx`), so the walk ran on the production build; that is deferred.

## 2026-10-05 — Story 6.3: editors publish without a developer (`bmad-build`, full route)

- **Prompt (Hoang Vu):** asked what 6.3 is ("this is used for admin role?"), asked for a short design talk ("your response is too long"), then "start to build" on the recommended defaults: one Careers photos document with three slots, product clips upload only, photos stay `[Placeholder]` until people agree.
- **What the AI did:** a full spec (approved), six tasks by sub-agents tests first (schemas, Studio structure, webhook tags, `getLifePhotos`, the `#life` frames, the editor guide), the full 5-layer review, then patches. Task reviews were skipped by the controller's rule for this run (as in 6.6), so the one full review is the gate.
- **AI got it wrong?** Yes. Task 5 added an image rule to `next.config.ts` but ran only the careers tests, so `next-config.test.ts` broke; the controller's full run caught it. Task 1 added `name` and `app` fields the spec did not ask for, which could conflict with the fixed product ids; the review removed them. The AI also first wrote design replies that were too long for the lead.
- **Decision / result:** the Studio has two fixed-document sections, the webhook refreshes them, and `/careers` shows a photo per slot when one is published. The live proof with `[Test]` documents, the Studio deploy and the webhook filter update are the lead's steps after merge.

## 2026-10-05 — Story 5.2 Stats and eight services with anchors (`bmad-build`, full route)

- **Prompt (Son Nguyen):** "move to 5.2, PR 44 done".
- **What the AI did:** wrote a build spec with a 14-line UX checks table.
  - **Route:** the full route, because one question needed the human: the shared stats band shows a visible label on Home, but the Services mockup has none.
  - **Decision:** Son chose (a), an optional `hideLabel` that keeps the label for screen readers only. Home stays unchanged.
  - **Build:** 6 tasks by implementer subagents, tests first, each with an independent review. The service icon map moved into one shared module for Home and Services.
  - **Checks:** the AI ran the four verification commands itself, plus a Chrome walk on a production build of all eight `#anchors` at 1280px and 390px.
  - **Review:** a 5-layer review, with 7 patches and 1 item deferred (an automated browser check of the anchor landing). An independent auditor re-checked every evidence hash.
- **AI got it wrong?** Yes.
  - **390px landings:** the first walk reported 5 of the 8 cards landing 6–43px low and put it down to "content still settling" without checking. A probe showed the page was still smooth-scrolling; the walk now waits for the scroll to stop, and every card lands at exactly 88px.
  - **UX rows:** the walk marked the mega-menu row ✅ without trying the mega menu, and the reduced-motion row checked card motion that cannot differ.
  - **Screen readers:** the stats section and its group were both named "Key facts", so the name was read twice.
  - **Implementers:** they left two tasks uncommitted, and one first missed a Prettier error.
  - **Outcome:** the reviews caught all of these, and they are fixed.
- **Decision / result:** `/services#<id>` from the Home cards, the footer and the mega menu lands each card fully below the sticky header.
- **Same day, at PR time:** my script that filled the UX table's "Checked" column wrote `||`, which added an empty extra column to every row. This is the same mistake logged for Story 6.6. It was caught when the table was copied into the PR and has been fixed.

## 2026-10-05 — Story 5.4 4-D process at #process and project capture (`bmad-build`, one-shot)

- **Prompt (Son Nguyen):** "PR 46 done, move to 5.4 please".
- **What the AI did:**
  - **Route:** chose the one-shot route, because the story only places two finished components (the 3.6 4-D flow and the 2.4 capture band).
  - **Build:** wrote a short spec with a 14-line UX checks table and built it tests first. The Services step lines are passed to the shared flow as data.
  - **Checks:** walked it in Chrome on a production build. The walk answers the capture's `POST /api/contact` itself, so no mail is sent.
  - **Review:** ran all five review layers before the PR.
- **AI got it wrong?** Yes.
  - **UX table:** the same `||` slip as Story 5.2 again, in the same session. A column check caught it this time, before the commit.
  - **Evidence:**
    - The walk claimed "navy glow" and "amber gradient" while it only logged `background-color`, which read transparent.
    - It counted 1×3px boxes as hidden without reading how they were hidden.
    - It marked the 1080/640px row ✅ although the walk showed the layout switching one pixel late.
  - **Repeat click:** the review found that a second click on "See our 4-D process" did nothing, because `next/link` skips the scroll when the hash is unchanged. It is now a plain `<a>`, and the walk shows it landing.
  - **Outcome:** the five reviewers caught all of these, and they are fixed or recorded as pending.
- **Decision / result:**
  - Quân's path works on `/services`: "See our 4-D process" lands on the band with aligned "You receive" rows, and a work email in the amber capture opens `/demo#project` on the Outsourcing tab with the email filled in.
  - Pending: the site-wide ≥/≤ breakpoint question (Amber/Hoang).
  - Deferred:
    - the capture input is 20px tall at 390px (Andy, 2.4);
    - the mega menu's same-hash link may not re-scroll;
    - a browser test of the anchor landing.

## 2026-10-05 — Story 6.4 About page (`bmad-build`, full route)

- **Prompt (Son Nguyen):** "PR 47 done, move to the last one".
- **What the AI did:**
  - **Spec:** a full-route spec with a 23-line UX checks table.
    - It found that the shared capture band only had Home's demo wording. Son chose (a): an optional `copy` override on Andy's `CaptureBand`, which keeps the button, checks and redirect.
    - Decision A2 was never confirmed, so the fourth stat ships as `[Placeholder]`.
    - The FAQ's "XionTechs" became "XionTech".
  - **Build:** 5 tasks by implementer subagents, tests first, each reviewed independently.
  - **Checks:** a Chrome walk on a production build: footer anchors, the FAQ by mouse, keyboard and touch, the clocks with and without JavaScript, and the capture (POST answered by the walk).
  - **Review:** a 5-layer review with patches, then an independent evidence re-audit.
- **AI got it wrong?** Yes.
  - **Task 4 CSS:** the agent said the prototype CSS was "not in the repo" and invented its own styles. The task reviewer passed it, and the controller caught it by comparing with `site.css` and had it ported.
  - **Office layout:** the walk found the office cards in one column at 1280px. The shared `.offices` base rule overrides its own md query, which also affects `/demo` (deferred to Andy).
  - **Evidence wording:** it claimed "no leadership words" although "leadership experience" is real copy.
  - **Weakened test:** a services test regex was loosened so it no longer proved `#process` stays in the anchor rule.
  - **Regex:** a controller Python script turned `\b` into backspace characters in the new no-people test (logged before as a repeated mistake). It was caught at review and fixed, along with a `\b` after `Mr\.` that could never match.
  - **Uncommitted work:** implementers left two tasks uncommitted again.
- **Decision / result:**
  - `/about` shows the hero, stats, story, six values, a nine-question FAQ, two offices with live clocks, and "See our apps in action.".
  - The footer's "Core values" and "FAQ" land below the header.
  - Pending: the story at exactly 900px (the site-wide ≥/≤ breakpoint question).

## 2026-10-01 — Batch 1 into site-v3: readability, accessibility and the new header

- **Who / tool:** Amber Do / Claude Code (Claude Opus 5.5)
- **Prompt (short):** "start batch 1", then "remove book a demo button, change language to be drop down, not toggle
  switch, move those nav header on the right, make the language drop down to be final item in the navigation; in the
  middle, add the GET IT DONE text to highlight our slogan".
- **What the AI did:** On branch `docs/ux-readability` (from `develop`), brought the readability and accessibility
  fixes from the site-v6 proposal into the official prototype `site-v3`, without its visual changes (aurora, grid,
  linen, rings and cursor glow kept for batch 2): functional text at least 11.5px, 44px tap targets, reduced motion
  with short fades, the pause label fading in, no labels above section headings ("Our 4-D process: from your request
  to launch.", "Our core values."), one tokenised stylesheet and no inline styles. New header, after a second
  round of Amber's feedback: logo left, menu on the right, Services as a plain link (its mega menu removed), the
  language as outlined pills (an EN or VI trigger with a caret, options stacked below), no Book a demo button and no
  slogan in the middle (tried in round one, then removed). The language dropdown was then restyled to match the nav links
  (same text, mist on hover, options on the header glass). From the site-v6 proposal, "Why XionTechs" and "Four apps
  for every role in school" moved into site-v3 Home; the four-app row replaces the Home bento (Story 3.5 rewritten).
  The eight-services grid was removed from Home (it stays on Services). No Contact link in the menu: Book a demo stays
  reachable through heroes, capture bands and the footer "Contact" link (Amber's decision). Updated
  `DESIGN.md`, `EXPERIENCE.md`, the PRD (FR-3, FR-4, NFR-1, NFR-2, section 6, open question 15) and `epics.md`
  (FR inventory, UX-DR6 to UX-DR8 and UX-DR12, AC table, Stories 1.2, 1.3, 1.4, 1.5, 3.1, 3.5, 3.7, 5.4, 7.3), and synced
  five changed tokens into `src/app/globals.css` so the team's DESIGN.md parity test passes.
- **Decision / result:** Approved by Amber. bmad-code-review (four layers) found real issues that were fixed before
  commit: the mobile-menu focus trap skipped the logo and language dropdown, the Products mega menu could overflow the
  right edge once the menu moved right, the language buttons' accessible names did not contain the visible EN/VI
  (WCAG 2.5.3), the dropdown and Menu button were not right-aligned below 1080px, duplicate YAML keys in DESIGN.md, a
  caret rotation under reduced motion, dead bento CSS, and stale header wording in the stories. Follow-up for the
  developers: `globals.css` still switches every transition off under reduced motion, while the spec now keeps short
  fades. After the PR opened, Amber confirmed the Why XionTechs claim ("designed, built and supported by our own
  team"), so its [Placeholder] marker was removed and PRD open question 23 closed.
- **AI got it wrong?** Flagged, not wrong yet: removing the header Book a demo button changes AC-NAV-2. Book a demo
  stays reachable through heroes, capture bands and the footer "Contact" link, but pages without a capture band
  (Careers, Job, News story, Privacy, Not found) now rely on the footer only.

## 2026-10-03 — One prototype, one enhancement branch and an enhancement log

- **Who / tool:** Amber Do / Claude Code (Claude Opus 5.5)
- **Prompt / task:** Amber's manager asked for a clearer way of working on the prototype: keep rebasing on
  `develop`, keep all prototype work on one branch instead of one branch per change, give the prototype a plain
  name, and log enhancements for the technical team instead of editing the PRD and stories directly.
- **What changed:** The prototype moved from
  `_bmad-output/planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/mockups/site-v3/` to
  `_bmad-output/prototype-enhancement/prototype/`, and every live reference was updated (the UX specs, PRD, epics,
  the story specs under `_bmad-output/specs/`, the epic contexts and `scripts/ux/browser.mjs`). Historical records
  (this log, the `.memlog.md` files and the 2026-09-28 code review) keep the old name. New
  `_bmad-output/prototype-enhancement/README.md` (folder, names and the six-step flow) and `enhancement-log.md`
  (`ENH-NNN` entries with status Proposed, Approved, In PR, Merged, Built). The branch `docs/second-draft` became
  `docs/prototype-enhancement`, rebuilt as `develop` plus batch 1 (PR #10) and rebased on `develop`. The site-v6
  proposal folder is retired; its homepage ideas come back as logged enhancements in the one prototype.
  `AGENTS.md` records the folder and the branch exception.
- **Decision / result:** Amber chose one prototype folder (not site-v3 kept beside a copy), the branch name
  `docs/prototype-enhancement`, and a PR from the branch to `develop` for each approved set of enhancements. Hoang
  and the manager then agreed not to merge PR #10: batch 1 reaches `develop` with this branch's PR, and PR #10 was
  closed.
- **AI got it wrong?** Not yet. Risk flagged: open developer branches that still point to `mockups/site-v3` (for
  example the footer story, PR #15) need the new path after this reaches `develop`.

## 2026-10-03 — ENH-001: contact form on Home (first enhancement-log entry)

- **Who / tool:** Amber Do / Claude Code (Claude Opus 5.5), `bmad-code-review` (four layers)
- **Prompt / task:** Keep only the contact form from the manager's homepage brief and leave the rest of Home as
  it is. The Home demo email band became "Have something you want to build?" with name, work email, optional
  phone and project message fields, inline errors and a thank-you panel. Logged as ENH-001 in
  `_bmad-output/prototype-enhancement/enhancement-log.md`; no PRD, story or spec edits.
- **Decision / result:** Approved by Amber. The review found real issues that were fixed before commit: the phone
  check accepted input with no digits (now 7 to 15 digits), the 2,000-character limit had no error message
  (now checked by the script with its own message), an error cleared on the first keystroke even when the value
  was still invalid, and the button icon was read by screen readers. The log entry now states every rule and
  error message, names the form "contact", lists the production needs the prototype does not show (honeypot,
  server checks, rate limit, send-failure state) and every story it touches (3.7, 2.2, 2.3, 2.4, AC-NAV-2).
- **AI got it wrong?** Yes: the first version of the form copied the redesign's phone check, which let strings
  like "(------" through, and wrote the log's rules too vaguely for a developer to build or test from.

## 2026-10-04 — ENH-002 to ENH-005: Home hero, header, partners, case studies, Why XionTechs bento, section order

- **Who / tool:** Amber Do / Claude Code (Claude Opus 5.5), `bmad-code-review` (four layers), headless Edge
  checks (nothing shown on screen), plus a screen recording and two reference designs from Amber
- **Prompt / task:** Several rounds of Amber's review of the prototype Home, logged in
  `_bmad-output/prototype-enhancement/enhancement-log.md` as ENH-002 (hero, stats with count-up, silk,
  header: Products as a plain link, underline-only hover on the word, hamburger icon), ENH-003 (partner
  logo strip and case study placeholders), ENH-004 (tighter section spacing, heading-first reveal, Why
  XionTechs rebuilt as a four-card bento with a "+3" hover reveal from Amber's reference HTML) and ENH-005
  (products section moved below the process). Also `wireframes.md`, a text wireframe of every page,
  generated from the prototype.
- **Decision / result:** Approved by Amber. The review found real issues that were fixed before commit:
  content could stay invisible when the page opened below a section heading; a second tap could not
  restart the partner strip, each logo was its own Tab stop, Enter or Space did nothing and wide screens
  showed a gap in the loop; "+3" closed itself on phones, ignored taps on iPhone and could be clipped at
  some widths; the count-up started during the fade-in; the phone menu's focus trap let Tab escape; plus
  dead front-door and mega-menu styles, a motto marked up as a heading, clocks showing "--:--" without
  JavaScript and three identical case study headings. Developers' follow-up: the UX parity header
  surface still probes the removed mega menu.
- **AI got it wrong?** Yes, several times. It first read "hovering on the padding" as a dead strip and
  made the menu items full height, which Amber rejected; the fix was to remove the side padding so the
  hover is exactly the word. Its first Why XionTechs illustrations were too busy and were removed. A
  cleanup regex clipped one CSS rule (caught by comparing every selector with the last commit), and the
  wireframe generator skipped the logo strip because its class contained "track".

## 2026-10-04 — Two wireframe files: the original and the final with tracked changes

- **Who / tool:** Amber Do / Claude Code (Claude Opus 5.5), `bmad-code-review` (Blind Hunter and Edge Case Hunter)
- **Prompt / task:** Keep one wireframe of the original first draft and one of the final prototype that tracks
  every change. `wireframes-original.md` is built once from the first draft on `develop` (commit ae606f7,
  `mockups/site-v3`); `wireframes-final.md` has a change list at the top and every Home section tagged with the
  entry that shaped it (Batch 1, ENH-001 to ENH-005). The generator and the change tags live in
  `_bmad-output/prototype-enhancement/tools/`, and regenerating the final file is now a step after each approval.
- **Decision / result:** Approved by Amber. The review found real problems in the generator, fixed before commit:
  the "Years" unit was missing from the stats, original mode could silently rebuild from the current prototype,
  a run date changed the files on every run, a PowerShell redirect would garble the box characters (now `--out`
  writes UTF-8), missing pages or elements crashed it, one line-wrapping case could loop forever, and a block's
  own text was dropped when it also held links (the office addresses were missing).
- **AI got it wrong?** Yes: the first final file gave the Products hero the Home hero's tag (both headings have
  the id "h1"), and tagged the 4-D section "unchanged" although Batch 1 changed its heading. Tags are now keyed
  by page and heading.

## 2026-10-04 — ENH-006 to ENH-010: case study slider, news row, What we build rail, How we approach, form details

- **Who / tool:** Amber Do / Claude Code (Claude Opus 5.5), `bmad-code-review` (four layers), headless Edge
  checks (nothing shown on screen), two reference HTML files and a screenshot from Amber
- **Prompt / task:** Amber's review rounds, logged in `_bmad-output/prototype-enhancement/enhancement-log.md`:
  ENH-006 (case studies as a full-width slider of six placeholder partner cards with carousel dots; section
  spacing), ENH-007 (news intro row with "See all news", app name only in news pills), ENH-008 ("What we
  build." with AI Tutor and AI Timetable in a rail with back and forward buttons; partners heading left),
  ENH-009 ("How we approach.": the five-step tabbed process from Amber's reference, its layered diagram
  re-encoded from a 1.27 MB PNG to a 103 KB WebP; equal app cards; heading spacing) and ENH-010 (phone
  placeholder, quiet submit button). `wireframes-final.md` and its change tags were updated.
- **Decision / result:** Approved by Amber. The review found real issues that were fixed before commit: the
  case study row had seven Tab stops instead of one, the News story page still showed "Product · PXP", the
  process section switched layout at 1120px and 760px instead of the site's 1080px and 640px, dot labels
  stayed in English and were rebuilt on every resize (dropping focus), step panels were unreachable without
  JavaScript, the case study fade covered the last card, a drag could block the next click, focus rings
  were clipped in the app rail, and the generator drew both rails as plain grids. One request was adjusted
  for accessibility: dimmed steps use 85% opacity, because 55% falls to about 2.6:1 contrast on the blue.
- **AI got it wrong?** Yes: it first built the process section in the site's own navy and display font
  instead of the reference look (Amber sent a screenshot to correct it), counted one carousel dot per card
  (too many), and its first case study images used a navy mock-window style that did not match the
  placeholder images in other sections.

## 2026-10-04 — ENH-011 and ENH-012: five steps on Services, a light process on Home

- **Who / tool:** Amber Do / Claude Code (Claude Opus 5.5), `bmad-code-review` (four layers), headless Edge
  checks (nothing shown on screen)
- **Prompt / task:** Use the same five steps on Services as on Home, highlight the chosen step, then move the full
  tabbed process to Services and give Home a lighter version (a simple five-step row with one short line each and
  a link to Services). Logged as ENH-011 and ENH-012; the last "4-D" wording on About and Contact was retired
  and the old four-card flow code removed. `wireframes-final.md` and its change tags were updated.
- **Decision / result:** Approved by Amber. The review found real issues that were fixed before commit: the arrow
  keys skipped a step on Services (two keyboard handlers both moved the tabs), the Home connector line ran past
  the last step on phones, disappeared without JavaScript and ended at a guessed position, the Home step text fell
  to about 2.2:1 contrast on the light end of the gradient (Home now uses a deeper gradient and full white text),
  long step names could overflow the rail at mid widths, a stray hover band stayed after a tap, Home and Services
  worded two steps differently, Services had dropped "estimate" from Discovery's outcome, and the About and
  Contact wording repeated "step". Developers' follow-up: the Next.js app still shows the four-step "4-D
  process" and its tests pin it.
- **AI got it wrong?** Yes: a CSS cleanup regex removed part of a keyframes rule and broke the stylesheet's
  braces; it was restored from the last commit and the old block removed by exact line numbers after checking
  each line.

## 2026-10-04 — ENH-013: AI Tutor and AI Timetable marked Coming soon

- **Who / tool:** Amber Do / Claude Code (Claude Opus 5.5), `bmad-code-review` (Blind Hunter and Acceptance
  Auditor, as the change was small)
- **Prompt / task:** Amber confirmed AI Tutor is for students and AI Timetable is for school leaders, both coming
  soon, and that the manager wants the partner logo and case study placeholders now. The two cards got a
  "Coming soon" tag; their placeholder descriptions stay by Amber's choice. Open items in ENH-003, ENH-006 and
  ENH-008 were closed.
- **Decision / result:** Approved by Amber. The acceptance audit found no violations. Two hardening fixes from
  the review were applied: the tag text is semibold (its contrast only just passed at 500 weight) and its
  colours use the brand amber token. The cards linking to a Products page that does not describe them yet is
  noted for when the product text exists.
- **AI got it wrong?** Yes: the tag was first placed in the card's top-right corner, where it covered the app
  name; it now sits under the audience line, and the card rows were adjusted so every description sits right
  under its header.

## 2026-10-04 — ENH-014 and ENH-015: Products hero and a school-day timeline

- **Who / tool:** Amber Do / Claude Code (Claude Opus 5.5), `bmad-code-review` (Blind Hunter, Edge Case
  Hunter, Verification Gap, Acceptance Auditor)
- **Prompt / task:** From Amber's reference screenshots, the Products hero became "Built apart. Better
  together." with one "Explore products" button and a diagram of the four apps around an X tile, on her
  "warm light" background option with slowly drifting glows (ENH-014). A new "One event. Multiple
  experiences." section after the four apps follows one school day from 07:45 to 15:30 across the apps
  (ENH-015). Both are drawn in HTML and CSS rather than images, so they stay sharp, translate and adapt to
  phones. `wireframes-final.md` and its change tags were updated.
- **Decision / result:** Approved by Amber. The review found real issues that were fixed before commit: two
  diagram lines vanished on phones (the dash pattern was measured in screen pixels), the lines did not show
  without JavaScript, reduced motion did not stop the glows (a more specific rule won), Vietnamese accents
  touched between heading lines, timeline times sat at different heights in Vietnamese, the phone timeline
  line ran past the last dot, the cards had no focus lift, a few raw colours replaced tokens, and the wording
  drifted from Amber's text (em dash, "confirms", "reflects"). The glows now pause off screen and follow the
  saved motion choice. Open: whether to add a pause button for the glows (WCAG 2.2.2). The wireframe tool now
  reads a line break as a space, which also fixes "Suite 400Plano" on About.
- **AI got it wrong?** Yes: the first version reworded Amber's description and two timeline lines instead of
  using her text, and a hunk filter first staged unrelated FAQ work from another session (caught and
  unstaged before commit).

## 2026-10-04 — ENH-018: Pause motion button on the Products hero

- **Who / tool:** Amber Do / Claude Code (Claude Opus 5.5), `bmad-code-review` (Blind Hunter and Acceptance
  Auditor, as the change was small)
- **Prompt / task:** The drifting glows from ENH-014 move for longer than 5 seconds, so WCAG 2.2.2 asks for a
  way to stop them. Amber first suggested pausing on hover, then asked whether the card links (which jump down
  the page) were enough; neither works for keyboard and touch users or keeps the motion stopped, so she chose
  Home's "Pause motion" button. It now sits in the Products hero, in solid navy, and shares the saved choice
  with Home's hero and partner logos.
- **Decision / result:** Approved by Amber. The acceptance audit met 10 of 11 checks; the button and its label
  touched the heading on 320 and 375px phones, so the hero has more room at the top there. Also fixed: the
  icon is hidden from screen readers, and with reduced motion a pause after Play freezes the glows where they
  are instead of jumping them back.
- **AI got it wrong?** Yes: the previous commit (ENH-014 and ENH-015) also carried another session's unapproved
  ENH-016 and ENH-017 log entries, because the log file was staged whole; this commit removes them from the
  branch (they stay in the working copy until approved). The first ENH-018 draft was also numbered ENH-016,
  which that session had already used.

## 2026-10-04 — ENH-016 and ENH-017: the FAQ rebuilt, every heading left aligned

- **Who / tool:** Amber Do / Claude Code (Claude Opus 5)
- **Prompt / task:** Amber sent a screenshot of a help-centre style FAQ and asked for the About page FAQ to
  match it, titled "Your question, we answer", with no search box. Then, from her own screenshots of the
  result: one background for the whole section, all answers closed, the two columns further apart, every
  section title left aligned, the round background blobs turned into clouds in the bottom left corner, and no
  line under the last question. The animated background is option 1 of her reference file
  (`soft-animated-brand-backgrounds-balanced-speed.html`), mapped onto the site's own navy and light tokens.
- **Decision / result:** Approved by Amber. ENH-016 covers the FAQ; ENH-017 left-aligns the two centred
  headings on Products, which were the only centred ones on the site. Checks were static only, as Amber asks:
  `npm run lint` and the 976 unit tests pass, and `format:check` is clean apart from an untracked scratch file
  outside this change.
- **AI got it wrong?** Three times. First, the `+` marker was absolutely positioned over the question's own
  padding and collided with the next column; worse, `column-gap:96px` was followed by `gap:0` in the same
  rule, and the shorthand silently reset the gap to zero, which is what Amber's screenshot caught. Second, the
  heading looked centred although its text was left aligned: the box carried both `wrap` and a 760px width
  limit, so `wrap`'s automatic side margins centred the narrowed box; `text-align` could never fix that and
  the width limit had to move onto the heading text. Third, a second Claude session was editing this same
  branch at the same time and restored `about.html` and `site.css` over the finished FAQ work; it was
  re-applied with in-place edits so that session's ENH-014, ENH-015 and ENH-018 survived, and Amber closed the
  other session.

## 2026-10-04 — ENH-019: the FAQ background holds still

- **Who / tool:** Amber Do / Claude Code (Claude Opus 5)
- **Prompt / task:** Amber, after living with ENH-016 for a few minutes: the FAQ section does not need
  animation. The clouds and the light-to-navy gradient stay exactly where they are; the drifting stops.
- **Decision / result:** Approved by Amber. Both keyframe sets are deleted, so the page carries no FAQ
  animation code at all, and the reduced-motion rule went with them since there is nothing left to switch off.
  The sheen layer was removed rather than frozen: a sheen is a travelling band of light, and standing still it
  is only a faint streak parked off to one side. This also settles the open item from ENH-016 — with the FAQ
  still, the Pause motion button from ENH-018 can stay scoped to the Products and Home heroes.
- **AI got it wrong?** No, but a judgement call worth recording: "no animation" was read as keeping the look
  and removing the motion, not as reverting the background Amber had chosen one message earlier. Removing the
  sheen outright went slightly beyond the literal ask and was flagged to her rather than done quietly.

## 2026-10-05 — ENH-020 to ENH-025: Products apps, colour flow, A day at school, calmer weights

- **Who / tool:** Amber Do / Claude Code (Claude Opus 5.5), `bmad-code-review` (Blind Hunter, Edge Case Hunter,
  Verification Gap, Acceptance Auditor)
- **Prompt / task:** Over many rounds from Amber's notes, screenshots and three supplied specs (stacking cards,
  day at school, typography): the Products apps became seven stacked cards that pin and replace one another,
  with School / Parents / Students pills that jump and highlight (ENH-020); Home's app row matched (ENH-021);
  one background colour flows down the page, white with amber dots, amber through the apps, light blue from
  mid-LXP, then dark blue into the footer (ENH-022); "A day at school." became an animated timeline (ENH-023);
  "See all news" moved to the heading row and the email band went plain (ENH-024); bold weights dropped to 500
  across the site with the original fonts kept (ENH-025).
- **Decision / result:** Approved by Amber. The four-layer review found real issues, fixed before commit: cards
  cut off on short laptop screens, covered cards dropping out of keyboard and screen-reader reach, pill jumps
  not moving focus, the hover lift making a settled card jump 100px, the pill highlight lagging, a one-pixel
  seam at the school day, the timeline ignoring Pause motion and dimming text below contrast, the capsule
  clipped on small phones, the phone timeline starting off-screen, and card headings that did not name the apps.
  The page background is now drawn once rather than on every scroll frame, which fixed the sluggish scrolling.
  Open: keeping the reader's card when a window is resized across 993px; the job page's pre-existing phone
  overflow.
- **AI got it wrong?** Yes, several times: an early fixed background repainted on every frame and made scrolling
  sluggish; a first typography pass switched the heading font, which Amber rejected because it no longer matched
  the logo; the colour flow went through several wrong orders (too much blue, then a wasted empty gap) before
  matching her description; and a breakpoint scroll fix that did not hold was reverted rather than shipped.

## 2026-10-05 — ENH-026: the job page and Home contact section fit phone screens

- **Who / tool:** Amber Do / Claude Code (Claude Opus 5.5), `bmad-code-review` (Blind Hunter; the change is three
  lines of CSS)
- **Prompt / task:** Fix the job page scrolling sideways on phones (found during the ENH-025 checks), and a 2px
  sideways scroll on Home at 320px.
- **Decision / result:** Approved by Amber. Both had one cause: a one-column grid on phones will not shrink below
  its widest content, and the apply form (job) and the contact block (Home) held their columns wider than the
  screen. Grid items in those layouts and form fields may now shrink; checkboxes keep their size and long words
  wrap after the review. All 11 pages were checked at seven widths (no sideways scroll), and desktop layouts
  were compared before and after (unchanged).
- **AI got it wrong?** No, beyond first logging the Home overflow as a separate issue before finding it had the
  same cause.

## 2026-10-05 — ENH-027: resizing across the breakpoint keeps the reader's place

- **Who / tool:** Amber Do / Claude Code (Claude Opus 5.5), `bmad-code-review` (Blind Hunter and Acceptance
  Auditor)
- **Prompt / task:** Fix the open item from ENH-020: resizing a window across 993px (stacked cards on desktop,
  one column on phones) kept the scroll position but lost the reader's card, because the two layouts differ
  greatly in length.
- **Decision / result:** Approved by Amber. The card being read is noted only while scrolling (never mid-resize)
  and restored once the resize settles; away from the cards, the section at a reading line and its offset are
  restored instead. The review caught that a reader at the footer would have been pulled back to the last card,
  that an unsupported instant scroll could have stopped the tracking for good, and that a breakpoint change
  without a resize could leave a later keyboard resize jumping; all fixed and re-checked.
- **AI got it wrong?** Yes: the first attempt (in ENH-020) let resize handlers overwrite the remembered card and
  was reverted; here the first version of the non-card case kept the distance from the page end, which drifted
  because sections change height between layouts, and was replaced by a section anchor.

## 2026-10-05 — ENH-028: pill and resize follow-ups from the ENH-027 audit

- **Who / tool:** Amber Do / Claude Code (Claude Opus 5.5), `bmad-code-review` (Blind Hunter and Acceptance
  Auditor)
- **Prompt / task:** Fix the three edge cases the ENH-027 audit raised: phone rotation drifting to another card,
  a resize mid-slide landing on the incoming card, and the pill staying lit below the cards.
- **Decision / result:** Approved by Amber. Phone width changes (rotation) keep the reader's exact spot in their
  card; height-only changes (the keyboard) never move the page; the pill clears below the cards; the pill and the
  resize memory share one rule for the card being read. The review caught that rotation would have snapped to the
  card's top rather than the reader's spot, that pinch-zoom could count as a width change, and that short screens
  could show a blank pill for a moment; all fixed and re-checked.
- **AI got it wrong?** Yes: the first shared rule required the outgoing card to fade before the next counted,
  which left the pill lagging at hand-overs and a possible blank moment on short screens; it was simplified to
  the front-most card past the middle of the screen.

## 2026-10-05 — ENH-029: the pill clears when "A day at school" reaches the middle

- **Who / tool:** Amber Do / Claude Code (Claude Opus 5.5), `bmad-code-review` (Blind Hunter and Acceptance
  Auditor)
- **Prompt / task:** Clear the audience pill as soon as the school-day section reaches the middle of the screen,
  instead of about 100px later.
- **Decision / result:** Approved by Amber. The pill now clears at mid-screen. The acceptance audit found two
  real problems around it, fixed before commit: the saved resize place used a 30% line while the pill used 50%,
  so a desktop-to-phone resize could bring the last card back; and desktop resizes let the school-day section
  drift because the card stack changes length with the window. Away from the cards the place is now kept as a
  fraction of the screen height, on desktop for any resize; phone keyboard resizes still never move the page.
- **AI got it wrong?** Yes: the first fix kept the section at the same pixel offset, which on a shorter window
  fell below the middle and brought the pill back; it now keeps the same fraction of the screen.

## 2026-10-05 — ENH-030: the mountain story opens the About page

- **Who / tool:** Amber Do / Claude Code (Claude Opus 5.5), `bmad-code-review` (Blind Hunter, Edge Case Hunter,
  Verification Gap and Acceptance Auditor)
- **Prompt / task:** Bring the "Inspired by a mountain" story from a design file into the About page without its
  frame lines, then make it the page hero: the story told on the left while the mountain picture climbs beside
  it, the XionTech X mark at the summit, two fuller chapters, the title above both columns, no breadcrumb, and no
  mention of God, faith or spiritual ideas while still letting readers look the origin up themselves.
- **Decision / result:** Approved by Amber after six rounds. The old navy hero, key facts and "Two strengths, one
  team." are gone. The story is held for about a screen of scrolling; chapter 02 takes over at 40%, the colour
  climbs to the summit and the X turns full colour. The origin is a map-style place tag on the picture with
  its coordinates, linking out (removed later at Amber's request). The review found landscape phones getting a held layout
  that did not fit, a short Vietnamese desktop window overflowing by 7px, the switch point measured from the
  wrong line (about 47% instead of 40%), and a reload part-way down replaying the climb; all fixed and re-checked
  at ten window sizes.
- **AI got it wrong?** Yes: the first scroll version let a step click be overridden by the scroll it caused, the
  phone chapters slid under the picture before the next one took over, and the held block was stretched to a
  full screen, leaving an empty band under it that Amber had to point out.

## 2026-10-05 — ENH-031 to ENH-036: FAQ slot, big-screen About, page colours, blended email sections

- **Who / tool:** Amber Do / Claude Code (Claude Opus 5.5), `bmad-code-review` (Blind Hunter, Edge Case Hunter,
  Verification Gap and Acceptance Auditor); PR #48 opened with the team's `create-pr` skill
- **Prompt / task:** Open the hand-over PR, then: fill the FAQ's last slot, use the space on very large screens on
  About, and bring Services, News and Careers up to the new look one page at a time (Services white and amber,
  News white with light blue throughout, Careers pastel amber), make every email section blend into its page, and
  blend Home's contact section too.
- **Decision / result:** Approved by Amber. PR #48 carries ENH-001 to ENH-030 and batch 1. The page background
  script now takes a palette (warm, cool, pastel); Products is unchanged, checked string for string against HEAD.
  The FAQ slot became "Still have a question? Ask us directly" instead of an invented tenth question. Review
  fixes before commit: the moving hero lines now fade out behind the text (contrast had dipped to 1–3:1, already
  failing on News before), a navy marker for the selected step on amber, blue left in the Services hero removed,
  the About seam and big-screen alignment fixed, and log wording corrected to match the code.
- **AI got it wrong?** Yes: the first Services version ended in navy like Products, which Amber did not want; the
  first News version still had a visible header glow and a dark email band; and an existing bug turned the News
  filter buttons into "NaN" once the page was scrolled, which earlier checks missed because they did not scroll.

## 2026-10-05 — ENH-037 to ENH-040: News by audience, story page, heading typography, Life carousel

- **Who / tool:** Amber Do / Claude Code (Claude Opus 5.5), `bmad-code-review` (Blind Hunter, Edge Case Hunter,
  Verification Gap and Acceptance Auditor)
- **Prompt / task:** Rebuild News and the story page from two design files Amber supplied; check the typography
  guideline on every page (fonts, heading weight, line height, letter spacing); shrink the new photos and the News
  header; make the News titles smaller; turn "Life at XionTechs" into a horizontal carousel.
- **Decision / result:** Approved by Amber. News filters by audience with full-photo story cards; the story page is
  an editorial article whose header follows the story opened. The audit of about 1,100 text elements found no
  bold text but two leftovers of the rejected body-font headings (Products hero, "A day at school"), five page-title
  sizes, and loose heading rhythm; all fixed. Headings now use the display font at 300 (its 500 reads as bold).
  Review fixes before commit: white card dates moved onto a dark pill (they fell to about 1.2:1 on bright photos),
  a deeper title fade on touch screens, Home and Products news photos no longer wiped by the photo-frame tool,
  link names led by the title, and the carousel sized to the four frames the log promised.
- **AI got it wrong?** Yes: the design file's featured photo was a dead Unsplash link, and the first replacement
  had "Someone in your family has cancer" on its blackboard; the compact news photos were reused inside a
  photo-frame element that the prototype's upload tool rewrites; and a first contrast check flagged the date pills
  falsely by sampling outside their rounded corners.

## 2026-10-05 — ENH-041 to ENH-045: event reel, newsroom stories, bento News, mountain touches

- **Who / tool:** Amber Do / Claude Code (Claude Opus 5.5), `bmad-code-review` (Blind Hunter, Edge Case Hunter,
  Verification Gap and Acceptance Auditor)
- **Prompt / task:** Life at XionTechs as a horizontal event reel from Amber's options file (photos only, one size,
  no back or forward buttons); real news from the captured newXion newsroom with mock stories where needed, news-
  style titles and fuller articles; story cards on Home and Products; a bento News grid; the footer ridgeline with a
  climber whose spot follows the page's place in the navigation; the 404 lost-trail map; "Summit reached" on forms.
- **Decision / result:** Approved by Amber. The reel uses the real team photos (each links to its story) and keeps
  a pause button for WCAG 2.2.2. The six newsroom posts are the real stories; three marked mock stories fill
  Students and Parents. Review fixes before commit: a 9px seam in the reel loop, the first photo vanishing when
  focused, copied photos keeping the old language, the reel animating while idle, bento holes for small filters,
  Home's row showing mostly mock stories, Privacy and 404 resetting the climber, and three article sentences that
  went beyond the newsroom capture.
- **AI got it wrong?** Yes: the first climber followed the scroll instead of staying at one spot per page (Amber
  had to clarify), the first reel loop length ignored the last gap, the expanded articles added a few details the
  newsroom never said (an "evening", a link between two unrelated posts), and a script check line aborted a log
  update before it was saved.

## 2026-10-05 — ENH-046 to ENH-059: About rebuilt, Services and Careers refreshed, News lead story, new footer

- **Who / tool:** Amber Do / Claude Code (Claude Opus 5.5), `bmad-code-review` (Blind Hunter, Edge Case Hunter,
  Verification Gap and Acceptance Auditor)
- **Prompt / task:** Rebuild About from Amber's recommendation notes (a "We're XionTechs" intro over pastel peaks,
  then the mountain story with a transparent mountain, no place name or religious reference, city drawings in the
  office cards, white after the intro); a white and pastel-amber Services page with "What can we help you
  achieve?"; Careers from Amber's two careers files (Growth Learning Model hero, Inside XionTechs tiles, flip
  cards); transparent audience tabs on Products; a lead story and square cards on News; a footer grouped by
  audience with icon office rows and bracketed phone codes; the XionTech X as the site icon.
- **Decision / result:** Approved by Amber after several rounds (two About versions, then a page comparing three
  About backgrounds; Amber chose white after the hero). Review fixes before commit: the About story's inline
  height overrode the no-JavaScript and short-screen rules (a 939px gap); the Vietnamese back of a Careers flip card
  was clipped and screen readers heard both faces; filtered News could leave one square card beside a lead; square
  titles were cut at four lines; links to removed stories opened a different story; the Services hero linked to a
  missing demo anchor; the footer's contact links were 19px tall; the tabs spilled at 320px in Vietnamese; a
  leftover "mountain city" phrase; and dead CSS from the earlier layouts.
- **AI got it wrong?** Yes: the first mountain glow was far too strong, the first transparent mountain picture had a
  cyan tint from an overflowing colour calculation, the timeline dot first slid in from the centre, two review
  suggestions (restore the email privacy line and the footer Contact link) went against Amber's explicit requests
  and were not applied, and a review agent left a temporary script in the repo root that the lint caught.

## 2026-10-06 — ENH-060 to ENH-073: flowing backgrounds, Services panels and cards, News motion, footer room

- **Who / tool:** Amber Do / Claude Code (Claude Opus 5.5), `bmad-code-review` (Blind Hunter, Edge Case Hunter,
  Verification Gap and Acceptance Auditor)
- **Prompt / task:** Careers on a light blue to white to amber gradient; Services with a sticky Eight services heading,
  a navy hero panel and a light blue panel with four metric cards across the gap, Three ways and Industries folded in,
  a navy to light blue to white background with glows and playful entrances; bigger Products tabs; News "Catch up with
  us" with cards that unfold as they scroll and a newsletter sign-up; Home on one background from the hero navy through
  blue into white and amber; About light blue glows; footer "About us", a bolder climber, the Vietnam email, and room
  above the climber on every page; religious place names removed from the docs.
- **Decision / result:** Approved by Amber after many visual rounds (Services backgrounds tried as conic sweeps, curved
  bands, solid shapes, a dark navy page and finally panels with metric cards; Home blends reworked until no edges or
  bands showed). Every page's visible text was measured against the real rendered background for WCAG AA. Review fixes
  before commit: News reveal order and newsletter focus, Services hover lift and reduced motion, deep links under the
  header and tab bar, the panel gap after a language switch, no-JavaScript stacking, Vietnamese tab overflow, two
  contrast misses on the new glows, 44px footer links and newsletter field, and form errors linked to their fields.
- **AI got it wrong?** Yes: the first conic background focused on one point when Amber wanted curved bands, a solid
  shape version looked like floating circles, a mountain divider read as childish, the Services title hid behind the
  cards until the padding override was found, the first Home fade left a hard shift and visible banding, and a
  wrong SVG icon was briefly wired in before Amber said it was the wrong file.

## 2026-10-06 — ENH-074: a design system page for the prototype

- **Who / tool:** Amber Do / Claude Code (Claude Opus 5.5), `bmad-code-review` (Blind Hunter and Verification Gap)
- **Prompt / task:** A design system HTML page for the XionTech prototype, laid out like the AI Tutor project's
  design-system.html.
- **Decision / result:** Approved by Amber. `prototype/design-system.html` has ten numbered sections (brand, colour,
  surfaces and page backgrounds, type, space and shape, icons, illustration, components, patterns, motion and voice).
  Every value is read from `css/site.css` when the page is built, and the components use the site's own classes.
  Review fixes before commit: a contrast miss on the amber-text swatch labels, a focus ring that vanished on the navy
  stage, the email demo labelled as its error state with `aria-invalid`, the audience tab demo showing the real amber
  label, a section menu that hid links at narrow widths, working filter buttons, and a `<main>` landmark.
- **AI got it wrong?** Yes: the path Amber gave pointed at a folder that did not exist (the file was in another
  checkout), and the first build lost "GET IT" on the light tagline because a footer style made it white.

## 2026-10-06 — ENH-085: Home link in the main menu (GitHub #52)

- **Who / tool:** Amber Do / Claude Code (Claude Opus 5.5)
- **Prompt / task:** Team feedback turned into GitHub issue #52 first, then the prototype change: add Home to the header menu while the logo still goes home.
- **Decision / result:** Approved by Amber. Home (Trang chủ) is the first menu link on every page and in the mobile menu, marked current on the home page. Issue-first so the reason is tracked before the change.
- **AI got it wrong?** No.

## 2026-10-06 — ENH-077 (climber), ENH-086 and ENH-087: team feedback issues #53 to #61

- **Who / tool:** Amber Do / Claude Code (Claude Opus 5.5)
- **Prompt / task:** Turn team feedback into GitHub issues (label `prototype`) first, then update the prototype: Home hero with Get in touch and five figures, ParentHub/StaffHub naming then Parent Hub/Staff Hub (P-Hub, S-Hub), Home content and order (Capabilities, Core values, 4-D process, How we approach, case studies), QA inside Development, a four-card Products page, no metrics on Services; plus the footer climber stepping up on every page.
- **Decision / result:** Approved by Amber. Issue-first so every change has its reason on record. Other trial work from the same day (ENH-076, ENH-078 to ENH-084 and a Products catalogue trial) was withdrawn and removed before the push.
- **AI got it wrong?** Yes: a hero class reused by the catalogue drew a giant rounded shape; the Home page reopened at the contact form because Get in touch left #contact in the address; the first mockup removal left half a phone frame; the cards' descriptions came out empty on the first Products rebuild.

## 2026-10-06 — Home: one How we approach section (ENH-088, #62)

- **Who / tool:** Amber Do / Claude Code (Claude Opus 5.5)
- **Prompt (short):** "Remove the How we approach section; title the 4-D section How we approach with a short 4-D description." Also: never edit the implementation-artifact specs.
- **What the AI did:** Removed the duplicate section, retitled the 4-D section, moved the See how we work link onto it, logged ENH-088 and regenerated the wireframes.
- **Decision / result:** Home tells the process once. Specs under implementation-artifacts stay untouched; prototype changes live in the prototype and the enhancement log only.
- **AI got it wrong?** Yes, at first: removing the section also dropped the only Home link to the Services process. Caught in review and restored.

## 2026-10-06 — Products: showcase cards with a product detail view (ENH-089, #64)

- **Who / tool:** Amber Do / Claude Code (Claude Opus 5.5)
- **Prompt (short):** "Use the previous version of the card, with an expand icon that opens the product detail on the same page", then a reference screenshot of the card style, then "remove the circle behind each product".
- **What the AI did:** First restored the earlier stacked cards; after the screenshot, rebuilt them as showcase cards (title top left, square expand icon, screenshot centred) with a dialog per app for tagline, audience, buttons and features. Feature descriptions are [Placeholder].
- **Decision / result:** Products shows four showcase cards; details open over the page and close with X, Esc or a click outside, returning focus to the card.
- **AI got it wrong?** Yes: "previous version of the card" was read as the old stacked card until Amber shared the reference. A clean-up step also dropped the phone sizing rule; caught in the headless screenshot and restored.

## 2026-10-06 — Prototype clean-up: unused styles and scripts (ENH-090, #66)

- **Who / tool:** Amber Do / Claude Code (Claude Opus 5.5)
- **Prompt (short):** "Remove those unused styles; update the design system file if needed."
- **What the AI did:** Checked every class against all pages and scripts, removed 133 unused CSS rules with a parser (not by hand), cut three dead script blocks, and updated design-system.html (no audience tabs or metric card; the Products showcase card with a sample detail view).
- **Decision / result:** Proved "no visible change" by screenshotting all 11 pages before and after at two widths and comparing pixels.
- **AI got it wrong?** No. The scan also found the Services metric cards unused (removed in #61), so they were included.

## 2026-10-08 — Prototype catch-up plan: 12 task specs for Sammy and Andy

- **Who / tool:** Son Nguyen (Sammy) / Claude Code (Claude Opus 5.5)
- **Prompt (short):** "Base on prototype-enhancement, compare the enhancements with our design, make an enhancement spec file, and share tasks for Sammy and Andy, correctly and understandably" (for `/bmad-build`); then "run review: does it match the enhancement plan?"
- **What the AI did:** Four parallel agents compared the prototype (ENH-001 to ENH-090) with `develop` page by page. It wrote a plan (`_bmad-output/specs/enhancement-2026-10-07/README.md`) and 12 task specs (Andy E-A1 to E-A7, Sammy E-S1 to E-S5) with Tier 1 and Tier 2, merge order, shared files and 15 decisions with defaults. A four-lens `bmad-review` (adversarial, edge cases, structure, prose) then checked them against the log and the prototype, and a verification pass re-checked every fix.
- **Decision / result:** Andy's Tier 1 load (about 25 h) does not fit the time left; the cut is decision Q14 for the lead. Unverified content (Careers model, AI Tutor copy, the new Vietnam email, the mountain picture) ships `[Placeholder]` or waits for a decision.
- **AI got it wrong?** Yes, 12 times in the first draft, all caught by the review:
  - It renamed the Products card ids, although the prototype keeps `#pxp` and `#sxp`.
  - It set card titles to 500 instead of 400 and showed feature copy as fact, although ENH-089 marks it `[Placeholder]`.
  - It put the X back on the footer peak (removed in ENH-045) and flipped the shared office order for About and Demo.
  - It checked the industries against the wrong file and missed half the hero cards.
  - It left smoke tests unnamed that the changes would break.

  The verification pass then found that the Home colours had been copied from the wrong branch of the prototype script, and that the founding sentence was misquoted.

## 2026-10-08 — E-A1 calmer type, tighter spacing and the X site icon

- **Who / tool:** Hoang Vu (Andy) / Claude Code (Claude Opus 5.5), `bmad-build` (one-shot route) and `bmad-code-review`
- **Prompt (short):** "build all my spec enhancement (andy)", after the demo moved to 2026-10-16; the lead took every plan default (Q1, Q2, Q3, Q11, Q13, Q15) and asked for Tier 1 of all seven tasks, E-A1 first.
- **What the AI did:** Changed the `@theme` weights, heading rhythm and section spacing to the prototype's values, mapped all 25 hard-coded bold rules to 400 (card titles) or 500 by reading the prototype rule for each selector, added the Next.js `icon.png`/`apple-icon.png`, and wrote a token test first. It measured nine routes at 1280px and 390px in a real browser.
- **Decision / result:** Decision Q2 (prototype over `DESIGN.md`) is recorded in the DESIGN.md token test as an exact list of overridden tokens, so the other tokens still have to match `DESIGN.md`.
- **AI got it wrong?** Yes, twice. In the date PR (#71) it ran `git add -A` and committed 6 MB of local Lighthouse reports; the one-layer review caught it before the push. In E-A1 the first override list skipped tokens that had not changed, and Unbounded still loaded an unused 700 weight; the four-layer review caught both.

## 2026-10-08 — E-A7 Careers: growth ring, Inside XionTech, flip cards, roles last

- **Who / tool:** Hoang Vu (Andy) / Claude Code (Claude Opus 5.5), `bmad-build` (one-shot route) and `bmad-code-review`
- **Prompt (short):** "E-A7 Careers" from the enhancement plan, Tier 1, built in its own worktree on top of E-A1; lead decisions Q6 (unverified copy ships `[Placeholder]`) and Q15 (keep the Sanity life-photo code, list it in `deferred-work.md`).
- **What the AI did:** Ported the prototype Careers page: a light hero with the Growth Learning Model (the dot travels once round the ring when 40% is in view, and stays on Curious with reduced motion), five Inside XionTech tiles, five flip cards as `<button aria-pressed>` with the hidden face `inert`, the roles last, and the prototype's pastel gradient in CSS instead of its scroll script. It wrote the UX checks table and the tests first, then checked all 19 rows in Chrome at widths from 320px to 1440px, including the job page.
- **Decision / result:** "Culture" and "Why you'll grow here" are deleted. The life-photo code stays unrendered (Q15). The job form's "Summit reached." waits for E-A4.
- **AI got it wrong?** Yes, four times:
  - The hero glow override lost to the shared `.hero-light .aurora` rule, which comes later in the file. The first browser walk showed the amber default glow.
  - The reduced-motion flip hid the back face with `visibility: hidden`. The repo's "CSS hides no content" test caught it. The base reduced-motion rule already gives an instant swap.
  - It marked the five unconfirmed values with one section note instead of on each value. The four-layer review flagged this against the AGENTS.md placeholder rule.
  - The review also found the H1 read "Stay curious.Build" with no space, and that `/careers` was missing from the keyboard a11y run.

## 2026-10-08 — E-A2 one set of app names: Parent Hub, Staff Hub, IoT, AI Tutor

- **Who / tool:** Hoang Vu (Andy) / Claude Code (Claude Opus 5.5), `bmad-build` (full route, one implementer and one task review per task) and `bmad-code-review`
- **Prompt (short):** "/bmad-build spec-enh-a2-app-rename — rename PXP/SXP/LXP to Parent Hub, Staff Hub, IoT and AI Tutor with one `src/content/apps.ts`; Demo options; Sanity `post.app` values with a read-time mapping. Not one-shot."
- **What the AI did:** Added `src/content/apps.ts` (names, badges, anchors `pxp`/`sxp`/`iot`/`ai-tutor`, taglines). Products, the header menu, the Demo form and the News tag read from it. The LXP section is gone, so `/products#lxp` lands at the top. The Demo form offers Parent Hub, Staff Hub and IoT, and the server refuses the old values. Sanity `post.app` now stores the app ids; the site maps old stored values (PXP, SXP, IoT) when it reads them, and LXP shows no app. Checked in Chrome at 1280px and 390px.
- **Decision / result:** The menu's LXP row became AI Tutor, so the menu keeps four rows; its link lands at the top of /products until E-A5 adds the AI Tutor card (deferred-work.md). Sammy's Home, About and footer copy keeps the old names until his tasks import `apps.ts`. The lead deploys the Studio and re-picks the app on old posts after the merge (`docs/sanity.md`).
- **AI got it wrong?** Yes, three times. The Products implementer added a `throw` that no test could reach, so diff coverage would have failed; the task review caught it. The Demo options were first typed as literal names instead of being read from `apps.ts`. The first Sanity note said the old value shows as "not in the list" before the Studio deploy, when it is after. The first browser check also measured the anchor before the page settled and reported a wrong scroll; a re-run after network idle gave the right numbers.

## 2026-10-08 — E-A3 a simpler header: six plain links, no mega menus, no Book a demo

- **Who / tool:** Hoang Vu (Andy) / Claude Code (Claude Opus 5.5), `bmad-build` (one-shot route) and `bmad-code-review`
- **Prompt (short):** "E-A3 Header", Tier 1, after E-A1 and E-A2 merged; lead decisions Q8 (Book a demo leaves the header) and Q10 (no EN/VI switch before the demo).
- **What the AI did:** Replaced the Products and Services mega menus with six plain links (Home, Products, Services, News, About, Careers) on the right. Home is current only on exactly `/`, so it is not marked on `/demo` or the 404. It removed Book a demo from the header and the mobile menu, the header border and the pill hover; the hover is now the 2px amber underline under the word, 30px apart. The mobile button is a 44px Phosphor list icon that turns into a cross, named "Menu". It wrote the UX checks and the tests first (18 failing), then checked all nine rows in Chrome at 1280px, 800px and 390px.
- **Decision / result:** Decision T11 (hover-opened mega menus) no longer applies. Link weight stays at E-A1's 500 (the prototype's 450 was rejected there). The menu data for the four apps went with the mega menu; app names stay in `apps.ts`.
- **AI got it wrong?** Yes, twice. It added `data-icon` attributes to the icons only so the tests could read them, which breaks the "no test-only code" rule; the four-layer review caught it. The review also found that nothing tested the `ml-auto` that keeps the Menu button on the right. Its first browser script also failed because "News" matched both the desktop and the mobile link.

## 2026-10-08 — E-A5 Products: hero diagram, four showcase cards, detail dialogs

- **Who / tool:** Hoang Vu (Andy) / Claude Code (Claude Opus 5.5), `bmad-build` (full route) and `bmad-code-review`
- **Prompt (short):** "E-A5 Products", Tier 1 only, in its own worktree on top of E-A1, E-A2 and E-A7; lead decisions Q11 (the AI Tutor live address is not published, a disabled "View prototype" label) and Q14 (A day at school and Product updates stay Tier 2). The E-A2 review asked for the `#ai-tutor` card and an end to "Four apps" over three sections.
- **What the AI did:** Ported the prototype Products page: the "Built apart. Better together." hero with the four app cards around the X tile and a Pause motion button that shares one stored setting (`xt-motion`) with the Home silk; "What we build." with four cards (`#pxp`, `#sxp`, `#iot`, `#ai-tutor`, names from `apps.ts`); one native `<dialog>` per app with `[Placeholder]` feature descriptions and disabled stand-in buttons. The old sub-nav and the three app sections went, with their tests and CSS. It wrote the UX checks table and the tests first, then checked the page in Chrome: keyboard dialog walk, all four anchors, 320px and 390px, JavaScript off and reduced motion.
- **Decision / result:** Without JavaScript each card shows its features in a `<details>` inside `<noscript>`. The demo band keeps the current amber look until E-A4. Under reduced motion the glows stay still even after "Play motion", because the global reduced-motion rule wins (deferred-work.md).
- **AI got it wrong?** Yes, four times:
  - The first no-JS version hid content with CSS (`display: none`, `opacity: 0`) and used weight 600 on feature titles. The repo's "CSS hides no content" and type-scale tests caught both.
  - The browser check found that Tab left the Staff Hub dialog for the browser toolbar. Native `showModal()` does not wrap Tab when the dialog holds only one control, so a small Tab wrap was added.
  - The next fix showed the no-JS block until hydration and then hid it, a layout shift for every visitor. The four-layer review caught it, and the block moved into `<noscript>`.
  - The per-task reviews were skipped after tasks 1-2 to save time (the controller implemented tasks 3-6 itself); the full review at the end still ran.

## 2026-10-08 — E-S1 Home matches the prototype (ENH-086 to ENH-088)

- **Who / tool:** Son Nguyen (Sammy) / Claude Code (Claude Opus 5.5), `/bmad-build` full route
- **Prompt (short):** "Do all the enhancements from Sammy with /bmad-build; branch off develop, pull the latest code." First task: E-S1 Home.
- **What the AI did:** Wrote the build spec with a 23-line UX checks table, then had subagents build 7 tasks test-first, each reviewed. The changes:
  - a new hero with "Get in touch" and the two cards across its edge;
  - Capabilities with a "+3" industries reveal;
  - core values moved to a shared module;
  - a light "How we approach." 4-D section with one step copy shared with Services;
  - the bento and service cards removed;
  - one flowing background.

  A five-layer review followed, then patches, a re-verify and an independent evidence audit.

- **Decision / result:** All checks pass: 1148 unit tests, diff coverage 100%, 15 smoke tests, the build and 2 new browser tests. Two minor items are deferred: a small layout shift on hydration, and Escape on a hover-only reveal. Andy's E-A1, E-A2 and E-A4 were not merged, so app names are plain strings and "Get in touch" goes to `/demo` for now.
- **AI got it wrong?** Yes:
  - Moving the cards into the navy hero made the light card's text near-white on white. The integration task caught it.
  - The first "+3" CSS opened on keyboard focus, so Enter could not close it.
  - The fix for that made the button unclickable on phones.
  - A later hover reveal kept the list open after a second click.
  - Our own browser-check script measured the wrong elements, so its output contradicted the written evidence until the review caught it.
