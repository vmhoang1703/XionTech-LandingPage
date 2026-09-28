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

- **Demo day:** 2026-10-09 (10 min presentation + 5 min Q&A)
- **Team:** 3 people. Leader: Hoang Vu.
- **Hand-in:** public URL, full git history, this context file, `docs/ai-log.md`.
- **Scoring:** build quality 30%, AI usage 25%, teamwork & context sharing 25%, presentation 20%.

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

| Area         | Choice                                                                             |
| ------------ | ---------------------------------------------------------------------------------- |
| Framework    | Next.js 16 (App Router, `src/` dir), React 19                                      |
| Language     | TypeScript (strict)                                                                |
| Styling      | Tailwind CSS v4 (config lives in `src/app/globals.css` via `@theme`)               |
| UI parts     | shadcn/ui (to be added)                                                            |
| Animation    | Motion (to be added)                                                               |
| CMS          | For Careers/Jobs and Blog — **not decided yet**                                    |
| Hosting      | Vercel                                                                             |
| Formatting   | Prettier + `prettier-plugin-tailwindcss`, ESLint (`eslint-config-next`)            |
| Tests        | Vitest 5 + Testing Library (unit), Playwright (`@smoke`), `diff-cover` (via `uvx`) |
| Quality gate | SonarQube Community in local Docker — LOCAL ONLY, `pre-push` hook                  |

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
npm run sonar:gate   # local SonarQube gate (also runs on git push)
npm run build
```

Before opening a PR: lint, typecheck, tests, diff coverage, smoke and build must pass, and the
local Sonar gate must be green.

## Git workflow

- `main` = production (deployed to the public URL). Only updated by PR from `develop`.
- `develop` = integration branch. Everyone branches from it and opens PRs back into it.
- Branch names: `feature/<short-name>`, `fix/<short-name>`, `docs/<short-name>`.
- Commit messages: Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`).
- When an AI agent writes a commit, keep its `Co-Authored-By` trailer so AI work is visible.

## BMad workflow (XTek BMad)

We plan and build with the XionTechs fork of BMad Method (`@xiontechs/bmad-method` v6.12.1).
Installed modules: Core, BMad Method (bmm), Builder (bmb), CIS, Test Architect (tea), BMAD Loop.

- `_bmad/` — BMad config and scripts. Committed so everyone shares the same setup.
- `.claude/skills/` — BMad skills for Claude Code (57). Committed.
- `_bmad-output/planning-artifacts/` — brief, PRD, architecture, UX, epics. Committed.
- `_bmad-output/implementation-artifacts/` — stories and sprint status. Committed.
- `docs/` — project knowledge (BMad `project_knowledge`).
- Personal config (`_bmad/config.user.toml`, `_bmad/custom/config.user.toml`) is gitignored.
  Put your own name in `_bmad/custom/config.user.toml` under a `[core]` table:
  `user_name = "Your Name"`.
- Team-wide overrides go in `_bmad/custom/config.toml`.
- BMad skills need Python 3.10+ and `uv` installed.

Start with the `bmad-help` skill when unsure what to do next. Planning docs flow
brief → PRD → UX → architecture → epics/stories → `bmad-build` per story.
Do not edit files under `_bmad/` or `.claude/skills/` by hand; re-run the installer
(`npx @xiontechs/bmad-method@next install`, needs an Azure PAT in `~/.npmrc`) or use
`bmad-customize`.

## AI log

Log every prompt or decision that mattered in `docs/ai-log.md`, **especially when the AI
got it wrong**. It is a hand-in item and counts toward the AI-usage score.
