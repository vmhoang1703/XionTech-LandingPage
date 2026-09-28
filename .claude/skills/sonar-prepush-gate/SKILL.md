---
name: sonar-prepush-gate
description: Installs, verifies, and operates the LOCAL-ONLY SonarQube pre-push quality gate in this repo — every push (feature branches, develop and main) is scanned by a local SonarQube Docker container and diffed against the reference branch. This project NEVER publishes to the shared XT SonarQube server. A local developer gate only — it never touches CI pipelines. Bundles the scripts, an idempotent installer, and the verification procedure. Use when the user wants to add, roll out, refresh, or repair the SonarQube pre-push hook for a project, says "install the sonar gate", "set up the sonarqube docker check", "apply the sonar pre-push to <repo>", or asks why a sonar push check failed, passed without checking anything, or reported 0% coverage.
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, AskUserQuestion
---

# SonarQube pre-push gate (LOCAL ONLY)

> **This project never talks to the shared XT SonarQube server** (`sonaqube.xiontechsolution.com`).
> The XionTech Landing Page is not a XionTech company project. This copy of the skill has the
> upstream remote mode removed: there is no `SONAR_HOST_URL`/`SONAR_TOKEN`, `--remote` exits with
> an error, and the scripts refuse any non-localhost SonarQube URL. Never add a shared-server URL,
> token, or project, and never run a scan or `curl` against that server from this repo.

Canonical files live in `template/scripts/` next to this file. A repo gets its copy from the
installer; to change the gate, edit the template here and re-run the installer, never hand-edit a
repo's copy.

## What it does

Blocks `git push` when the SonarQube Quality Gate would fail — a real git hook, so neither a human
nor Claude Code can skip it silently. It reads the actual `/api/qualitygates/project_status` result,
not an approximation.

| Pushing to | Scanned against | Publishes anywhere | Blocks push |
| --- | --- | --- | --- |
| any branch, including `develop` / `main` | local `sonarqube:community` container | no | yes |

The scanner always runs in Docker (`sonarsource/sonar-scanner-cli`), so no developer needs a scanner
install. Docker must be running: without it the gate refuses (it never falls back to a server).

Coverage-only gate failures warn but do not block. Everything else (bugs, vulnerabilities, smells,
hotspots, duplication) blocks.

## How "new code" is defined — read this before changing anything

Every condition in the `Sonar way` gate is a **new code** metric. Get the new-code period wrong and
the gate reports "passed" while judging zero lines. That failure is silent and looks exactly like
success, so it must be verified explicitly (see the probe test below).

SonarQube has **no branch diff** on Community Build. New code is always a point in time, resolved
from `git blame` commit dates. `REFERENCE_BRANCH` — the only true branch-diff mode — is a paid-edition
feature; setting it on Community is accepted by the API but yields zero new lines.

So the gate reconstructs a branch diff from dates. `SONAR_LOCAL_NEW_CODE_MODE` picks how:

| Mode | New code is | Cost |
| --- | --- | --- |
| `reference_branch` *(default)* | what this branch adds on top of `SONAR_LOCAL_REFERENCE_BRANCH` | one extra scan when the merge base moves |
| `previous_version` | changes since the previous analysis — the definition CI uses | none |
| `days` | a fixed `SONAR_LOCAL_NEW_CODE_DAYS` window | none |

`reference_branch` works like this:

1. `git fetch origin <ref>`, then `git merge-base HEAD origin/<ref>`.
2. Export that commit's tree with `git archive` and scan it **backdated** to the merge-base commit's
   own timestamp: `-Dsonar.projectDate=<date>`.
3. Pin the period: `new_code_periods/set type=SPECIFIC_ANALYSIS value=<baseline analysisId>`.
4. Scan the working tree. Everything committed after the branch diverged is newer than the period.

Details that are easy to get wrong and are already handled:

- **Backdating is mandatory.** Without it the period is the analysis time, every existing commit is
  older, and new code is 0. `sonar.projectDate` wants `+0700`, not `+07:00`.
- **`git archive`, not `git worktree`.** A worktree's `.git` is a file pointing at an absolute host
  path that does not resolve inside the container; JGit then aborts the scan.
- **The local project is recreated** for each new baseline, because a backdated analysis has to be
  the project's oldest. Local data only.
- **Fail closed.** A missing reference branch, no merge base, or a failed baseline scan stops the
  push with an explanation. Only a failed `git fetch` degrades to a warning, since a flaky network
  must not block pushes.

## Prerequisites

- Docker Desktop running (`docker info` succeeds).
- `python`, `curl`, `git`, `tar` on PATH.
- The repo has a `sonar-project.properties` with a `sonar.projectKey` and **no** `sonar.host.url`.
  The project is created in the local container automatically; nothing is created on any server.
- The reference branch must be fetchable from `origin`.

## Install into a repo

1. **Ask the user which branch this repo's work is diffed against.** Do not guess — it decides what
   the gate treats as new code. Use `AskUserQuestion`, offering the repo's likely PR target
   (`dev`, `main`) read from its branches. The installer refuses to run without it.

2. Run the installer, pointing at the directory that should own `scripts/` — the repo root normally,
   or the project subdirectory in a monorepo:

   ```bash
   bash "<skill-dir>/template/scripts/sonar/install.sh" --target /path/to/repo --reference-branch dev
   # monorepo: the subdirectory holding sonar-project.properties
   bash "<skill-dir>/template/scripts/sonar/install.sh" --target /path/to/monorepo/SubProject --reference-branch main
   ```

   It copies the scripts, templates `sonar.env.example` with the repo's project key, its path
   relative to the git root and the reference branch, adds the `.gitignore` entries, and sets
   `core.hooksPath`. An existing `sonar.env` is never overwritten — only missing settings are
   appended, so re-running is safe.

   `--project-key KEY` overrides key detection, `--no-hooks` skips the
   `core.hooksPath` write. `SONAR_PROJECT_DIR` must be the path from the **git root** to the
   directory holding `sonar-project.properties`.

3. Warm up the local instance — the first boot pulls ~700MB and takes 1–3 minutes:

   ```bash
   ./scripts/sonar/local_sonar.sh up
   ```

4. Record the rules in the repo's `CLAUDE.md` (correct an existing SonarQube section rather than
   appending a second one):

   ```markdown
   SonarQube runs LOCAL ONLY: every push is scanned by a local `sonarqube:community`
   Docker container. Never publish to the shared XT SonarQube server — this is not
   a XionTech company project. "New code" is what the branch adds on top of
   `SONAR_LOCAL_REFERENCE_BRANCH`. Docker Desktop must be running; warm up once with
   `./scripts/sonar/local_sonar.sh up`. Change the gate in the `sonar-prepush-gate`
   skill, not in `scripts/sonar/`.
   ```

5. Confirm the wiring:

   ```bash
   git -C <repo-root> config core.hooksPath      # -> scripts/git-hooks (or <subdir>/scripts/git-hooks)
   grep -E '^SONAR_(PROJECT_KEY|PROJECT_DIR|LOCAL_)' scripts/sonar/sonar.env
   ```

## Verify (run all of these once per repo)

```bash
# 1. First run also builds the baseline (2 scans).
./scripts/sonar/check_quality_gate.sh --skip-tests

# 2. THE IMPORTANT ONE — prove the gate is not vacuous. Drop a file with a known
#    violation under the project's sonar.sources, then re-run: it must BLOCK and
#    report new_lines > 0. A gate that passes here is measuring nothing.
cat > <sonar.sources>/_sonar_gate_probe.py <<'EOF'
def probe(value):
    if value == value:   # python:S1764
        return 1
    return 2
EOF
./scripts/sonar/check_quality_gate.sh --skip-tests   # expect: BLOCK new_violations, exit 1
rm <sonar.sources>/_sonar_gate_probe.py

# 3. Coverage imported — CE warnings must be [] and coverage non-zero.
source ~/.sonar-prepush-gate.env
curl -s -u "$SONAR_LOCAL_TOKEN:" "http://localhost:9000/api/ce/activity?component=<KEY>&ps=1"
curl -s -u "$SONAR_LOCAL_TOKEN:" "http://localhost:9000/api/measures/component?component=<KEY>&metricKeys=new_lines,coverage"

# 4. Remote mode is gone — both must exit non-zero with an error, no network call.
./scripts/sonar/check_quality_gate.sh --remote
SONAR_LOCAL_HOST_URL=https://example.com ./scripts/sonar/check_quality_gate.sh --branch feature/x

# 5. develop/main pushes also stay local — expect the LOCAL container in the log.
printf 'refs/heads/mywork <sha> refs/heads/develop <sha>
' | ./scripts/sonar/check_quality_gate.sh

# 6. Docker down -> refuses.
mkdir -p /tmp/nodock && printf '#!/bin/sh\nexit 1\n' > /tmp/nodock/docker && chmod +x /tmp/nodock/docker
PATH="/tmp/nodock:$PATH" ./scripts/sonar/check_quality_gate.sh --branch feature/x

# 7. Fail closed — must stop immediately, before running the test suite.
SONAR_LOCAL_REFERENCE_BRANCH=nope ./scripts/sonar/check_quality_gate.sh --branch feature/x

```

Checks 2 and 4 are the ones that matter: 2 proves the gate can fail, 4 proves nothing can reach a
server. The local container uses the default `Sonar way` profile; there is no shared server to match.

## Day-to-day

```bash
./scripts/sonar/check_quality_gate.sh              # scan against the local container
./scripts/sonar/check_quality_gate.sh --skip-tests # reuse the existing coverage report

./scripts/sonar/local_sonar.sh up|status|down|reset
```

Local dashboard: <http://localhost:9000>, user `admin`. One container serves every repo on the
machine, so its password and analysis token live in `~/.sonar-prepush-gate.env`, not in any repo.
Per-repo state is just `scripts/sonar/sonar.baseline` (which merge base the baseline was built at).

Emergency bypass: `SONAR_GATE_SKIP=1 git push` (or `git push --no-verify`). Do not use it to dodge
real findings — fix them, or ask the user.

## Adapting to a project that does not fit

Nothing in the gate is stack-specific by default. Coverage is auto-detected: `run_coverage.sh` if
present, else pytest with `--cov` pointed at that repo's own `sonar.sources`, else
`npm run test:coverage`. Anything else is configured, not coded:

```bash
SONAR_COVERAGE_COMMAND="make coverage"
SONAR_COVERAGE_REPORT=build/coverage.xml
```

## Out of scope: CI pipelines

**Do not edit any pipeline YAML as part of installing this gate.** This is a local developer gate
only. Leave `azure-pipelines*.yml` / `.azure-devops/` untouched unless the user asks separately, in
that same request.

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Gate passes but `new_lines` is 0 | the new-code period resolved to a point after the code was committed, so nothing is "new" — the gate is measuring nothing | run verification check 2; use `reference_branch` mode, and confirm the period with `api/new_code_periods/list` |
| `REFERENCE_BRANCH` set but new code is 0 | branch analysis is a paid-edition feature; Community accepts the setting and ignores it | use the backdated-baseline approach, which is what `reference_branch` mode does |
| `RepositoryNotFoundException` during the baseline scan | a git worktree's `.git` is a file pointing at an absolute host path, unresolvable in the container | export the tree with `git archive` instead |
| `The date '...' does not respect format` | `sonar.projectDate` rejects the `+07:00` offset form | use `%z` (`+0700`) |
| `HTTP 401` bootstrapping the second repo | one container, one admin password — credentials must not be per repo | they live in `~/.sonar-prepush-gate.env`; the script migrates an old per-repo file automatically |
| `Timed out waiting for the analysis task` | the poller followed a `report-task.txt` left by an earlier run | the gate deletes that file before each scan; read the printed last response |
| `report-task.txt not found` | the scanner image forces `SCANNER_WORKDIR_PATH=/tmp/.scannerwork`, inside the container | the run passes `-e SCANNER_WORKDIR_PATH=/usr/src/.scannerwork`; don't remove it |
| Coverage reads 0%, CE warning `Cannot resolve N file paths` | the coverage report records the producing machine's absolute paths, which don't exist in the container | the run rewrites those paths to `/usr/src` and restores the file afterwards |
| Rewritten path comes out as `/usr/srcsrc` | `SONAR_PROJECT_DIR=.` makes `$REPO_ROOT/.` keep a trailing separator through `cygpath -m`, eating the path separator | `PROJECT_PATH` is normalised with `cd … && pwd`; keep it that way |
| `AccessDeniedException: /tmp/.sonar/cache` | a root-owned named volume mounted where the container's uid 1000 must write | Windows caches at the image's own `SONAR_USER_HOME`; Linux/macOS run `--user` and cache in the container's `/tmp` |
| `local_sonar.sh` cannot set the admin password | the container was bootstrapped before and this machine lost the password | `./scripts/sonar/local_sonar.sh reset` then `up` |

Elasticsearch bootstrap checks are disabled in the local container (`SONAR_ES_BOOTSTRAP_CHECKS_DISABLE`)
because Docker Desktop/WSL2 doesn't set `vm.max_map_count=524288`. Local dev instance only.

Editing `check_quality_gate.sh` while a run is in progress corrupts that run — bash reads scripts
incrementally. Copy it aside and run the copy if you need to iterate.

## Updating the gate everywhere

Edit `template/scripts/...` here, then re-run `install.sh --target <repo>` for each repo already
using it — the reference branch is remembered, so the flag is only needed the first time. The
installer overwrites `check_quality_gate.sh`, `local_sonar.sh`, `install.sh`, `README.md`, and
`pre-push`, and leaves `sonar.env` alone.

## Uninstall

```bash
git -C <repo-root> checkout -- .gitignore CLAUDE.md <dir>/scripts/git-hooks/pre-push <dir>/scripts/sonar/
rm -f <dir>/scripts/sonar/install.sh <dir>/scripts/sonar/local_sonar.sh <dir>/scripts/sonar/sonar.baseline
git -C <repo-root> config --unset core.hooksPath     # or restore the previous value
```

`sonar.env` is gitignored, so `checkout` will not revert it — strip the settings the installer
appended by hand, or delete the file if the installer created it. Verify with `git status --short`:
a clean uninstall leaves zero changes. `~/.sonar-prepush-gate.env` and the container are shared with
other repos — only remove them when uninstalling the last one.

Ask before uninstalling — `core.hooksPath` may have held a value that predates this gate.
