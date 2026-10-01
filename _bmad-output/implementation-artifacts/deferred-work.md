# Deferred work

## Deferred from: code review (2026-09-28)

Change reviewed: team CLAUDE.md rules, test tooling, local-only SonarQube gate (branch `feature/setup-project`).

### Agent-context files (fix edits CLAUDE.md / AGENTS.md / SKILL.md — needs owner OK)

**Resolved 2026-09-28** (lead asked "fix the 5 docs items"; reviewed with bmad-code-review, 11 follow-up fixes applied):

- [x] RESOLVED [medium] CLAUDE.md "SonarQube — LOCAL ONLY" one-time setup omits `cp scripts/sonar/sonar.env.example scripts/sonar/sonar.env`; the gate dies with "Missing sonar.env" on a fresh clone that follows CLAUDE.md (README has the step).
- [x] RESOLVED [low] CLAUDE.md "Language / toolchain" omits Docker Desktop, Python 3.10+, uv and curl, which `coverage:diff` and the Sonar gate need.
- [x] RESOLVED [low] CLAUDE.md says the gate "refuses" when `SONAR_HOST_URL`/`SONAR_TOKEN` are set; the code silently unsets them. Only `SONAR_LOCAL_HOST_URL` and `sonar.host.url` are refused.
- [x] RESOLVED [low] AGENTS.md says the pre-push hook runs `npm run sonar:gate`; it execs `scripts/sonar/check_quality_gate.sh` directly.
- [x] RESOLVED [low] sonar-prepush-gate SKILL.md examples use `dev`/`main` and a Python probe; this repo uses `develop` and TypeScript (the real probe used `value === value` in a `.ts` file).

### Filed as defer by the verification-gap layer
- [medium] Unit tests, smoke and diff coverage do not block a push or merge: the gate only warns on test failures, and there is no CI.
- [low] The baseline "create missing source/test folders" fix has no automated test.
- [low] `test_local_only_guards.sh` runs only by hand (no hook or CI). Same decision as the CI item above.

### Pre-existing in the upstream sonar-prepush-gate skill (not caused by this change)
- [medium] Gate scans HEAD + working tree, not the pushed commits (`git push origin other-branch`, dirty tree, delete-only pushes).
- [medium] Baseline API writes (`projects/delete`, `projects/create`, `new_code_periods/set`) use `curl -s` without status checks; a failed period set still writes `sonar.baseline` and may judge zero lines.
- [medium] A test command that crashes before writing coverage leaves an older report that passes the existence check (stale coverage scanned).
- [medium] Container port is published on all interfaces (`-p 9000:9000`); bind to `127.0.0.1`.
- [medium] `sonar.env` saved with CRLF (Windows editors) leaves `\r` in values; reference branch lookup fails.
- [low] `local_sonar.sh` run by hand ignores `sonar.env` overrides (port, image, container).
- [low] `wait_for_analysis` writes diagnostics to stdout, which is captured into ANALYSIS_ID and lost.
- [low] `sonar_property` + `pipefail` exits silently for Python projects without `sonar.sources`.
- [low] Docker images unpinned (`sonar-scanner-cli:latest`, `sonarqube:community`).
- [low] Scripts call `python`, not `python3`; fails on Linux/macOS machines without `python`.
- [low] `project_status` error JSON raises a Python KeyError with no readable cause.
- [low] Coverage path rewrite stops at spaces in the repo path.
- [low] Container states paused/restarting/dead fall through to `docker run` and a name conflict.
- [low] Empty `serverUrl` in report-task.txt gives a misleading "published to ''" tripwire message.

## Deferred from: code review (2026-09-28), UX first draft

Change reviewed: UX prototype and README (branch `docs/ux-first-draft`). The 14 findings became 16 acceptance criteria for the Next.js build; they are in `_bmad-output/planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/code-review-2026-09-28.md`.

- [medium] No automated tests for the prototype script (forms, EN/VI, news filters, navigation). Test these behaviours in the Next.js build.
- [medium] Translation beyond visible text: page titles, meta descriptions, aria labels and toasts need VI versions; serve `/en/` and `/vi/` URLs with hreflang.
- [low] Per-page metadata (favicon, canonical, Open Graph) is missing in the prototype; use the Next.js Metadata API.
- [low] "Read story" has no detail page and the news filters have no empty state; depends on the CMS choice.
- [low] Stats band and 4-D flow are copied across prototype pages; build each as one component.

## Deferred from: code review (2026-09-28), UX round 3

Change reviewed: approved prototype changes, final UX specs, PRD and epics (branch `docs/ux-first-draft`).

- [low] Prototype `site.css` has stacked patch layers (v3.1 to v3.7) that redefine the same rules. Consolidate when the prototype is next touched; the specs, not the CSS, are the build reference.
- [medium] FAQ "How do you keep our data secure?" reuses the current site answer, which does not name hosting, access control or certifications. Replace with real facts before launch.
- [medium] Story 6.3: decide whether a story or role can be published with only one language filled, or must wait for both EN and VI.

## Deferred from: code review (2026-09-29), Demo-day scope change

Change reviewed: prototype v3.8 (job page, roles list, removals) and the PRD, UX spec and epics updates (branch `docs/ux-first-draft`). Fixed before commit: build order in the Demo-day plan, breadcrumbs note, stale Flow 4 route and capture exceptions in `EXPERIENCE.md`, privacy text, CV field description and empty-file check, success focus.

- [low] Message and cover note limits say "under 2,000 characters" while the check allows exactly 2,000 (same in the contact form); align the wording or the check in the Next.js build.
- [low] "(opens in a new tab)" accessible names on store and app links are English only; add VI with Story 1.2.
- [low] Epic 1 title and Story 7.3 still say "bilingual" and "both locales"; Vietnamese is after Demo day.
- [low] `.people` and `.person` CSS in the prototype is unused since the leadership section was removed.

## Deferred from: code review (2026-10-01), create-pr skill moved to GitHub

Change reviewed: `create-pr` skill ported from `az` to `gh`, the "open every PR with /create-pr" rule and the narrowed no-hand-edit rule in `AGENTS.md` (branch `fix/create-pr-github`).

- [low] There is no `.github/pull_request_template.md`, so PRs opened in the GitHub web UI get no template; the template checklist also does not list the pre-PR gates from `AGENTS.md` (lint, coverage, smoke, build, Sonar, code review, AI log). Decide whether to move the template to `.github/` and extend the checklist.
- [low] `storyKey` is read only from branches named `<type>/<epic>-<story>-<slug>`, but `AGENTS.md` still says `feature/<short-name>`. Write the story branch format into `AGENTS.md` → Git workflow.
- [low] `AGENTS.md` describes `.claude/skills/` as the 57 BMad skills only; the team-owned skills (`create-pr`, `sonar-prepush-gate`, `maestro-flows`, `code-review-and-quality`, …) and their owners are not listed. `maestro-flows` was copied from the same PXP workspace and still targets `pxp_mobile`.
- [low] `test_pr_scripts.sh` runs only by hand (no npm script, no CI); the same holds for `test_local_only_guards.sh`. A `test:skills` npm script would make it part of the checks.
- [low] `docs/ai-log.md`: this branch and `feature/1-1-brand-tokens` (PR #7) both append after the same last line, so the branch merged second needs a rebase; PR #7's entry says `/create-pr` cannot open GitHub PRs, which is true until this branch merges.
