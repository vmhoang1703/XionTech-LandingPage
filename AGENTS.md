<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# XionTech Landing Page — shared agent context

This file is the single source of context for every AI agent and every team member
(Claude Code reads it via `CLAUDE.md`; Cursor, Codex and Copilot read `AGENTS.md`).
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

## Tech stack

| Area       | Choice                                                                  |
| ---------- | ----------------------------------------------------------------------- |
| Framework  | Next.js 16 (App Router, `src/` dir), React 19                           |
| Language   | TypeScript (strict)                                                     |
| Styling    | Tailwind CSS v4 (config lives in `src/app/globals.css` via `@theme`)    |
| UI parts   | shadcn/ui (to be added)                                                 |
| Animation  | Motion (to be added)                                                    |
| CMS        | For Careers/Jobs and Blog — **not decided yet**                         |
| Hosting    | Vercel                                                                  |
| Formatting | Prettier + `prettier-plugin-tailwindcss`, ESLint (`eslint-config-next`) |

## Commands

```bash
npm install
npm run dev          # http://localhost:3000
npm run lint
npm run typecheck
npm run format       # write; use format:check in CI
npm run build
```

Before opening a PR: `npm run lint && npm run typecheck && npm run build` must pass.

## Git workflow

- `main` = production (deployed to the public URL). Only updated by PR from `develop`.
- `develop` = integration branch. Everyone branches from it and opens PRs back into it.
- Branch names: `feature/<short-name>`, `fix/<short-name>`, `docs/<short-name>`.
- Commit messages: Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`).
- When an AI agent writes a commit, keep its `Co-Authored-By` trailer so AI work is visible.

## AI log

Log every prompt or decision that mattered in `docs/ai-log.md`, **especially when the AI
got it wrong**. It is a hand-in item and counts toward the AI-usage score.
