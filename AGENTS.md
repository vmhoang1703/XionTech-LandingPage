<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# XionTech Landing Page — shared agent context

This file is the single source of context for every AI agent and every team member
(Claude Code reads it via `CLAUDE.md`, which also holds the coding rules and Definition of Done;
Cursor, Codex and Copilot read `AGENTS.md`).
Update it in the same PR whenever a decision changes.

## Project

Rebuild of https://xiontechs.com/ from scratch for the XionTech internal AI build challenge.

- **Demo day:** 2026-10-16 (10 min presentation + 5 min Q&A; moved from 2026-10-09 on 2026-10-08)
- **Scope (2026-10-13):** Story 1.2 (locale routing, language dropdown, Vietnamese shell) is built before Demo day on the user's decision, overriding the 2026-09-29 English-only plan. Vietnamese page content shipped 2026-10-14: AI translations are flagged in `docs/translations/vi-review.md`; product and service names and "Get IT done" stay English; `[Placeholder]` is kept in front of placeholder text. Any copy edit must re-run `npm run i18n:vi-review` and commit the regenerated page. Log: `docs/ai-log.md`.
- **Team:** 3 people. Leader: Hoang Vu.
- **Hand-in:** public URL (https://xion-tech-landing-page.vercel.app), full git history, this context
  file, `docs/ai-log.md`.
- **Scoring:** build quality 30%, AI usage 25%, teamwork & context sharing 25%, presentation 20%.
- **Brand name:** write "XionTech" in page copy, titles and alt text, even where the mockup,
  the planning docs or the old site say "XionTechs" (lead, 2026-10-03). The domain
  `xiontechs.com` and the logo image stay as they are. (On 2026-10-12 the lead briefly asked for
  "XionTechs", then took it back: XionTech is right.)
- **Locations:** four, with two headquarters: Plano, Texas (USA) and Ho Chi Minh City
  (Vietnam), plus Ha Noi and Da Nang (named only; no published addresses) (lead, 2026-10-12).

## Hard rules (from the challenge)

1. **Everything on the page is real or clearly marked as placeholder.** No Lorem Ipsum.
   No invented testimonials, client logos, stats, team members or job openings.
   Placeholder text starts with `[Placeholder]` so it is easy to find with grep.
2. **Start clean.** Do not copy the current site's WordPress theme, CSS, images or layout.
   Facts (services, offices, contact details) may be reused after a human verifies them.
3. **All three members must commit.** Work in small PRs, one owner per feature.
4. **SonarQube runs LOCAL ONLY. NEVER publish to, scan against, or create a project on the
   shared XT SonarQube server** — this is not a XionTech company project. Never add
   `SONAR_HOST_URL`, `SONAR_TOKEN` or `sonar.host.url`. The `pre-push` hook
   (`scripts/git-hooks/pre-push`) runs `scripts/sonar/check_quality_gate.sh` directly; run
   the same check by hand with `npm run sonar:gate`. Details in `CLAUDE.md` → "SonarQube —
   LOCAL ONLY".

## Tech stack

How the parts fit together (routes, Sanity flow, forms, security, limits, decision index): `docs/architecture.md`.

| Area         | Choice                                                                                           |
| ------------ | ------------------------------------------------------------------------------------------------ |
| Framework    | Next.js 16 (App Router, `src/` dir), React 19                                                    |
| Language     | TypeScript (strict)                                                                              |
| Styling      | Tailwind CSS v4 (config lives in `src/app/globals.css` via `@theme`)                             |
| UI parts     | shadcn/ui (to be added)                                                                          |
| Animation    | Motion (to be added)                                                                             |
| Icons        | `@phosphor-icons/react` (installed by the first story that renders an icon)                      |
| CMS          | Sanity for Careers/Jobs and Blog (free plan) — see `docs/spikes/cms-spike.md`                    |
| Hosting      | Vercel Hobby (owner: Hoang Vu; only the owner can change project settings). See Git workflow     |
| Mail         | Gmail SMTP through `nodemailer`, with an App Password; see `docs/contact-delivery.md`            |
| Rate limit   | Upstash Redis (free, Vercel Marketplace) with `@upstash/ratelimit`; `docs/contact-delivery.md`   |
| Formatting   | Prettier + `prettier-plugin-tailwindcss`, ESLint (`eslint-config-next`, `eslint-plugin-sonarjs`) |
| Tests        | Vitest 5 + Testing Library (unit), Playwright (`@smoke`), `diff-cover` (via `uvx`)               |
| Quality gate | SonarQube Community in local Docker — LOCAL ONLY, `pre-push` hook (until Demo day: daily run)    |

## Commands

```bash
npm install
npm run dev          # http://localhost:3000
npm run lint
npm run typecheck
npm run format       # write; use format:check in CI
npm test             # unit tests (Vitest)
npm run test:coverage && npm run coverage:diff   # 100% line coverage on changed lines
npm run test:smoke   # Playwright @smoke: build, boot, GET / = 200
npm run sonar:gate   # local SonarQube gate (runs on git push; lint only until Demo day)
npm run sonar:gate:full   # same gate on a clean, up-to-date develop; new code = since main
npm run test:skills  # create-pr skill scripts (after changing them)
npm run ux:parity -- scripts/ux/surfaces/header.json --strict   # looks and behaviour vs the mockup (dev server running: npm run dev)
npm run ux:shots -- scripts/ux/surfaces/header.json --strict    # screenshots, axe, layout shift (dev server; known limits in docs/ux-quality.md)
npm run build
```

**Optional UX tools until Demo day** (`docs/ux-quality.md`): `ux:parity` compares a page with the
mockup in looks and behaviour, `ux:shots` takes screenshots with axe and layout shift, and the
`ux-critic` skill proposes improvements. No story has to run them; the lead decided on 2026-10-02
to save time and rely on the UX checks written in the spec. Open design questions (UX-Q1…) are
listed there.

Before opening a PR: lint, typecheck, tests, diff coverage, smoke and build must pass, and the
local Sonar gate must be green.

**Until Demo day (2026-10-16) the Sonar gate runs daily, not per push.** Every clone uses the
lint-only hook: `git config core.hooksPath scripts/git-hooks-demo` (`npm run lint` includes
SonarQube's JS/TS rules). Hoang Vu runs `npm run sonar:gate:full` on `develop` once a day and
before the release PR; findings become fix PRs. After Demo day:
`git config core.hooksPath scripts/git-hooks`. Details in `CLAUDE.md` → Definition of Done.

## Git workflow

- `main` = production, deployed by Vercel to https://xion-tech-landing-page.vercel.app. Only updated by a
  release PR from `develop` (merge commit).
- `develop` = integration branch, deployed to https://xiontech-dev.vercel.app. Everyone branches from it
  and opens PRs back into it. Every PR gets a Vercel preview URL, unless the Hobby commit-email
  limit blocks it (see "Live URLs" in `README.md`).
- Open every PR with the `create-pr` skill (`/create-pr` in Claude Code); do not run `gh pr create`
  by hand. It uses `gh`, targets `develop`, fills the PR template
  (`.claude/skills/create-pr/assets/pull_request_template.md`) and refuses a branch that is not
  pushed and in sync. Agents without skills (Cursor, Codex, Copilot) follow its `SKILL.md` and run
  its scripts in `.claude/skills/create-pr/scripts/`.
- Merge PRs with **Create a merge commit** (squash is off) so each person's commits stay in history.
  Rebase merge is also allowed and keeps them too. `main` and `develop` have no branch protection
  (not available for a private repo on the free plan), so these rules rely on the team.
- Branch names: `feature/<short-name>`, `fix/<short-name>`, `docs/<short-name>`.
  Prototype work is the exception: it stays on the one long-lived `docs/prototype-enhancement`
  branch, rebased on `develop` and merged into it by PR (`_bmad-output/prototype-enhancement/README.md`).
- Commit messages: Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`). GitHub's
  own `Merge pull request #…` commits are exempt.
- When an AI agent writes a commit, keep its `Co-Authored-By` trailer so AI work is visible.

## BMad workflow (XTek BMad)

We plan and build with the XionTechs fork of BMad Method (`@xiontechs/bmad-method` v6.12.1).
Installed modules: Core, BMad Method (bmm), Builder (bmb), CIS, Test Architect (tea), BMAD Loop.

- `_bmad/` — BMad config and scripts. Committed so everyone shares the same setup.
- `.claude/skills/` — BMad skills for Claude Code (57). Committed.
- `_bmad-output/planning-artifacts/` — brief, PRD, architecture, UX, epics. Committed.
- `_bmad-output/prototype-enhancement/` — the clickable prototype (`prototype/`) and
  `enhancement-log.md`, the hand-off of every prototype change to the developers. Committed.
- `_bmad-output/implementation-artifacts/` — stories and sprint status. Committed.
- `docs/` — project knowledge (BMad `project_knowledge`).
- Personal config (`_bmad/config.user.toml`, `_bmad/custom/config.user.toml`) is gitignored.
  Put your own name in `_bmad/custom/config.user.toml` under a `[core]` table:
  `user_name = "Your Name"`.
- Team-wide overrides go in `_bmad/custom/config.toml`.
- BMad skills need Python 3.10+ and `uv` installed.

Start with the `bmad-help` skill when unsure what to do next. Planning docs flow
brief → PRD → UX → architecture → epics/stories → `bmad-build` per story.

**One-shot builds for simple stories (until Demo day).** `bmad-build` picks its route itself in
step 2: one-shot when there are no open questions, nothing irreversible and a small footprint.
A story that only adds or changes page sections or static content — no new API route, no Sanity
schema, no form submission, no shared component that other stories depend on — usually fits, so
say so in the request ("Story N.M is a simple page-section story; one-shot if your step 2
agrees"). The request is a hint, not an override. The one-shot route writes a short spec,
implements, runs one review layer and presents, without the per-task reviews and the evidence
audits of the full route. Run the full `bmad-code-review` once before the PR (`CLAUDE.md` →
Definition of Done). Every other story uses the full route.

Do not edit files under `_bmad/` or the `bmad-*` skills in `.claude/skills/` by hand; re-run the installer
(`npx @xiontechs/bmad-method@next install`, needs an Azure PAT in `~/.npmrc`) or use
`bmad-customize`.

**UI stories: UX checks in the spec.** Every UI story's build spec (one-shot specs too) has a
"UX checks" table, written by the developer before coding: looks and behaviour (hover, click,
keyboard, touch, pen), one testable line each, with its source. Every interactive part in
`EXPERIENCE.md` gets its behaviour lines. Where the mockup and `DESIGN.md` disagree, ask Amber and
write the winner; never pick silently. Before the PR, check every line and copy the table into the
PR's "UX checks" section. Rules, template and example: `docs/ux-checks.md`.

## UI/UX enhancement stage

Hoang Vu and Sammy improve UI/UX, animation and 3D after the enhancement tasks (lead, 2026-10-10).

- **Skill:** use `/impeccable <command> <target>` (`.claude/skills/impeccable/`) for UI/UX and animation
  work. Do not use the `frontend-design` plugin in the same task; their rules conflict.
- **Source of truth:** Amber's prototype and `DESIGN.md` set brand, colours and fonts. Enhance them;
  do not replace them, even when the skill says "go bold".
- **Motion:** every animation has a `prefers-reduced-motion` version. Animate only `transform` and
  `opacity`.
- **3D:** lazy-load it, show a still fallback on slow or small devices, and keep the Lighthouse
  mobile performance score at 90 or higher.
- **Content:** the `[Placeholder]` rule still applies. No invented stats, logos or testimonials.
- **Approval:** Hoang Vu and Sammy decide; Amber's sign-off is not needed in this stage. The
  Definition of Done in `CLAUDE.md` still applies.

## AI log

Log every prompt or decision that mattered in `docs/ai-log.md`, **especially when the AI
got it wrong**. It is a hand-in item and counts toward the AI-usage score.
