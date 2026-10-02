@AGENTS.md

# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

Version 1.0 — 2026-07-09. Project context (challenge rules, stack, git workflow, BMad) lives in `AGENTS.md`, imported above.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.** Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.** When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it — don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

**The test:** Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.** Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan with per-step verify checks.

## Mandatory Project Quality Rules

### Code hygiene (all languages)

These rules are mandatory for every code change, regardless of language.

- Use the formatter, linter, type checker, compiler, and static-analysis tools configured by the project.
- Do not introduce new warnings or errors.
- Remove unused imports, variables, parameters, dependencies, unreachable code, and dead code.
- Do not leave commented-out code, debug statements, breakpoints, temporary workarounds, generated artifacts, or test-only logic in production code.
- Do not silently swallow exceptions. Handle, propagate, or log errors with sufficient context.
- Do not perform unrelated refactoring or modify files outside the requested scope.

### Production Guardrails

These rules are mandatory for every code change, regardless of language.

- Do not introduce hidden mutable global state.
- Do not introduce unbounded in-process collections or caches. Caches must have an explicit TTL and/or maximum size.
- Shared application state must be stored in an appropriate external managed store.
- Do not place secrets, credentials, access tokens, connection strings, or private keys in source code, tests, configuration files, logs, or documentation.
- Use the approved secrets manager or environment-based configuration.
- Do not hardcode absolute local paths, machine-specific paths, developer-specific configuration, or environment-specific service URLs.
- Required configuration must be explicit and validated at application startup.
- Do not silently use unsafe production defaults when required configuration is missing.
- Logs must not expose secrets, credentials, personal data, authorization headers, or sensitive payloads.
- Production logic must not live only in notebooks. Reusable logic must be moved into version-controlled modules, packages, services, or scripts. Notebooks may only orchestrate, demonstrate, experiment, or analyze.

## Definition of Done

A task is done only when ALL are true:

- **Code** directly satisfies the requested change; no unrelated refactor.
- **Tests:** when behavior changes, write and run unit tests. For the changed code, ensure:
  - C0 — Statement/Line Coverage: 100%
  - C1 — Branch Coverage: at least 80%

  Coverage must be measured against the changed lines and branches using diff coverage, not the total project coverage. Produce a coverage report, then run an appropriate diff-coverage gate. For example: `diff-cover --fail-under=100` for C0, together with a branch-coverage check enforcing C1 >= 80%. Ensure the change is committed or staged so the diff can be measured accurately.

- **Checks run:** MUST run the project's test + lint commands. Never claim a command passed unless it actually ran.
- **Lint scope:** exclude vendored / generated / third-party tooling directories from lint (they are not the project's own code).
- **Code review (always):** must run a code review with `bmad-code-review` in Claude Code, and address findings before marking done. Required for every change — including non-production (docs/config/scripts) — no exception. Summarize the result + actions in the report.
  - **Light review for small follow-ups (until Demo day, 2026-10-09):** run the full `bmad-code-review` (all layers) once per story or PR. After that, follow-up changes on the same branch (fixing review or Sonar findings, a typo) need one layer only while they total fewer than 50 changed lines since the last full review — count with `git diff --shortstat <last-reviewed-commit>..HEAD` (insertions + deletions, lock files excluded). Write that diff to a file, launch one subagent with `.claude/skills/bmad-code-review/review-prompts/edge-case-hunter.md` on it, triage its findings as `bmad-code-review` step 3 does, and report the result. At 50 lines or more, run the full review again.
- **UX checks (UI stories):** the build spec has a **UX checks** table (`docs/ux-checks.md`): one testable line per look and behaviour — part, state or action, input (mouse, touch, keyboard), visible result, timing, source. Every interactive part in `EXPERIENCE.md` gets its behaviour lines. Where the mockup and `DESIGN.md` disagree, ask Amber and write which one wins. Before the PR, check every line (by hand or by a test) and copy the ticked table into the PR.
- **Smoke (gate):** at least one smoke test (tagged `smoke` — register the tag/marker in your test runner config) that boots the app/service and runs one happy-path (e.g. a health endpoint returns 200). The smoke command must pass before done.
- **SonarQube gate (LOCAL ONLY):** the local SonarQube Quality Gate must pass before every push (`npm run sonar:gate`; the `pre-push` hook runs it automatically). See "SonarQube — LOCAL ONLY" below.
  - **Daily, not per push (until Demo day, 2026-10-09):** every clone points its hooks at `scripts/git-hooks-demo` (`git config core.hooksPath scripts/git-hooks-demo`), whose `pre-push` runs only `npm run lint` — that includes SonarQube's JS/TS rules, but not CSS, duplication, coverage or hotspots. Hoang Vu runs the full gate once a day and before the release PR: `git switch develop && git pull && npm run sonar:gate:full` (new code = everything since `main`; the script refuses any other branch, a `develop` that differs from `origin/develop`, or local changes). Each finding becomes a fix PR the next morning, owned by whoever wrote that code. After Demo day: `git config core.hooksPath scripts/git-hooks` (setup step 4 below).
- **Impact analysis:** before a non-trivial change, identify its blast radius — find all callers/dependents/consumers (grep the symbol; check the project's registration & integration points; note cross-repo consumers). Summarize what's affected + what was verified. Flag risk if blast radius is high and not fully test-covered.
- **Similar check:** after a fix/pattern change, grep the same idiom/duplicate across the repo and any sibling / shared-scaffolding repos. Apply the same change where applicable, or list remaining instances as a follow-up. Don't fix one of N copies silently.

## SonarQube — LOCAL ONLY

> **NEVER publish to, scan against, log in to, or create a project on the shared XT SonarQube
> server (`sonaqube.xiontechsolution.com`).** This is not a XionTech company project. SonarQube
> runs only as a local code-quality check on each developer's machine.

- Never add `SONAR_HOST_URL`, `SONAR_TOKEN`, a `sonar.host.url` property, or a CI Sonar step.
  Never `curl` the XT server from this repo. What the gate does with each:
  - `SONAR_LOCAL_HOST_URL` that is not `http://localhost:<port>` / `http://127.0.0.1:<port>`:
    refuses to run.
  - `sonar.host.url` in `sonar-project.properties`: refuses to run.
  - `SONAR_HOST_URL` / `SONAR_TOKEN`: ignored (unset before any call), so they cannot leak.
  - The offline test `.claude/skills/sonar-prepush-gate/template/scripts/sonar/test_local_only_guards.sh`
    proves these guards; run it after any change to the gate template.
- Every push — feature branches, `develop` and `main` — is scanned by a local
  `sonarqube:community` Docker container. There is no remote mode (`--remote` exits with an error).
  Until Demo day the `pre-push` hook runs lint only and the scan runs daily instead (see
  Definition of Done).
- "New code" is what the branch adds on top of `develop` (`SONAR_LOCAL_REFERENCE_BRANCH`).
  Coverage comes from `npm run test:coverage` (`coverage/lcov.info`).
- Findings block the push (bugs, vulnerabilities, code smells, hotspots, duplication). Until
  Demo day, findings from the daily run become fix PRs instead.
  Coverage-only failures warn. Fix findings; do not bypass. `SONAR_GATE_SKIP=1 git push` /
  `--no-verify` only with the user's explicit OK, and say so in the PR.
- One-time setup per clone (same as `README.md`), with Docker Desktop running:
  1. `npm install`
  2. `cp scripts/sonar/sonar.env.example scripts/sonar/sonar.env` — without it the gate stops
     with `Missing …/scripts/sonar/sonar.env`. It already sets
     `SONAR_LOCAL_REFERENCE_BRANCH=develop`; do not change it. `sonar.env` is gitignored —
     never commit it.
  3. `./scripts/sonar/local_sonar.sh up` (first boot pulls ~700MB)
  4. `git config core.hooksPath scripts/git-hooks` — last, so no push is blocked mid-setup.
     Until Demo day (2026-10-09) use `git config core.hooksPath scripts/git-hooks-demo` instead
     (lint only; the gate runs daily).

  Dashboard: <http://localhost:9000> (admin password in `~/.sonar-prepush-gate.env`).

- To change the gate, edit the `sonar-prepush-gate` skill template and re-run its installer —
  never hand-edit `scripts/sonar/`.

## Per-project setup

The only place stack specifics go.

- **Language / toolchain:** TypeScript (strict) on Node.js 22 (`.nvmrc`) + npm. Next.js 16 App Router, React 19, Tailwind CSS v4.
  Also needed for the checks: Docker Desktop (Sonar gate), Python 3.10+ available as the command `python` (the gate calls `python`, not `python3`), [uv](https://docs.astral.sh/uv/) (`uvx diff-cover`), `curl`, `tar`, `git` and bash (Git Bash on Windows). npm scripts run in `cmd.exe` on Windows: never chain `a || b && c` in `package.json` — when `a` succeeded, `cmd.exe` skipped `c` too, so a check silently did nothing and exited 0 (seen 2026-09-28). Put the `||` part in its own script.
- **Test command:** `npm test` (Vitest 5, jsdom + Testing Library; tests live next to the code as `*.test.ts(x)`).
- **Coverage source + diff-coverage command:** source `src/`; `npm run test:coverage && npm run coverage:diff` (C0: `diff-cover --fail-under=100` vs `origin/develop`). C1: Vitest enforces branches >= 80% project-wide (`vitest.config.mts`); diff-cover measures lines only, so check branch coverage of changed files in the `text` report.
- **Lint command:** `npm run lint && npm run typecheck && npm run format:check`
- **Lint excludes (vendored/generated dirs):** `.claude/`, `_bmad/`, `_bmad-output/`, `scripts/sonar/`, `node_modules/`, `.next/`, `out/`, `build/`, `coverage/`, `test-results/`, `playwright-report/`, `next-env.d.ts`
- **Smoke command:** `npm run test:smoke` (Playwright project `smoke` runs tests tagged `@smoke`; builds, boots `next start` on port 3100, checks `/` returns 200).
- **Build command:** `npm run build` (must pass before a PR).
- **Code-review tool:** `/bmad-code-review`
- **Static analysis:** `npm run sonar:gate` — SonarQube **LOCAL ONLY** (see section above). Runs automatically on `git push` (until Demo day: the hook runs lint only; `npm run sonar:gate:full` daily on `develop` instead). `npm run lint` also runs SonarQube's JS/TS rules (`eslint-plugin-sonarjs`, typed) on the TS/TSX files in `src/` without tests — the gate's TS scope; CSS, duplication, coverage and hotspots are only checked by the gate. `scripts/eslint-config.test.mjs` proves the rules fire.
- **Language-specific extras:**
  - Next.js 16 differs from training data: read `node_modules/next/dist/docs/` before using a Next.js API (see `AGENTS.md`).
  - No `any`, no `@ts-ignore`; fix the type instead.
  - Server Components by default; add `"use client"` only for components that need state, effects, or browser APIs.
  - Only `NEXT_PUBLIC_*` env vars may reach the browser; never put secrets in them.
  - Page content must be real or marked `[Placeholder]` (challenge rule, see `AGENTS.md`).
