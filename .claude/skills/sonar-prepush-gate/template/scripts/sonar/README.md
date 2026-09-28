# SonarQube Quality Gate pre-push check

Blocks `git push` (for humans and for Claude Code, since it's a real git hook —
not something either can silently skip) if the SonarQube Quality Gate would
fail.

## Local only

**LOCAL-ONLY variant (XionTech Landing Page).** This project is not a XionTech
company project, so it never publishes to the shared XT SonarQube server. Every
branch — feature branches, `develop` and `main` — is scanned against a
SonarQube container on your own machine. There is no remote mode: `--remote`
exits with an error, and the gate refuses any `SONAR_LOCAL_HOST_URL` that is not
`localhost` / `127.0.0.1`, or a `sonar.host.url` in `sonar-project.properties`.

This is a **local developer gate only** — no CI pipeline runs it.

The scanner itself always runs in Docker (`sonarsource/sonar-scanner-cli`), so
no local scanner install is needed. Docker is required: if the daemon is down,
the gate refuses to run.

## One-time setup (per clone)

```bash
cd scripts/sonar
cp sonar.env.example sonar.env   # no token needed — local container only

# From the repo root:
git config core.hooksPath scripts/git-hooks
```

Requires Docker Desktop running, and `python` + `curl` on PATH (used only for
JSON parsing and HTTP, no extra deps).

The local SonarQube container is created on first use. To warm it up ahead of
time (the first boot pulls ~700MB and takes 1-3 minutes):

```bash
./scripts/sonar/local_sonar.sh up
```

## Local instance management

```bash
./scripts/sonar/local_sonar.sh up        # start + wait for UP + mint a token
./scripts/sonar/local_sonar.sh status    # container / server / token state
./scripts/sonar/local_sonar.sh down      # stop and remove the container (data kept)
./scripts/sonar/local_sonar.sh reset     # also wipe the volumes and saved credentials
```

Dashboard: <http://localhost:9000> — log in as `admin` with the password in
`~/.sonar-prepush-gate.env`. One container serves every repo on the machine, so
its credentials live there rather than in any repo.

## What counts as "new code"

Every condition in the `Sonar way` gate is a new-code metric, so this setting
decides whether the gate checks anything at all. SonarQube has no branch diff on
Community Build — new code is always a point in time, taken from git blame dates.

By default (`SONAR_LOCAL_NEW_CODE_MODE=reference_branch`) new code is **what your
branch adds on top of `SONAR_LOCAL_REFERENCE_BRANCH`**. To get that from a
date-based system, the gate fetches the reference branch, finds
`git merge-base HEAD origin/<ref>`, scans that commit's tree once with the
analysis backdated to the merge-base commit's timestamp, and pins the new-code
period to it. That baseline is cached in `scripts/sonar/sonar.baseline` and only
rebuilt when the merge base moves — so the extra scan costs you once per rebase
or merge from the reference branch, not once per push.

Other modes, if a project needs them: `previous_version` (changes since the
previous analysis) and `days`
(`SONAR_LOCAL_NEW_CODE_DAYS`).

The gate **fails closed**: a missing reference branch, no merge base, or a failed
baseline scan stops the push and says why, instead of quietly falling back to a
window that catches nothing. A failed `git fetch` only warns.

## Running it by hand

```bash
./scripts/sonar/check_quality_gate.sh              # scan against the local container
./scripts/sonar/check_quality_gate.sh --skip-tests # reuse the existing coverage.xml
```

## What it does

1. Works out which branch is being pushed (from the ref list git writes to the
   hook's stdin), for the log only.
2. Starts the local container if needed (`local_sonar.sh ensure`).
3. Runs the project's test suite with coverage (auto-detected: pytest for
   Python, `npm run test:coverage` for Node, or `run_coverage.sh` if present).
4. Runs `sonar-scanner` against `SONAR_PROJECT_DIR` (reads `sonar-project.properties` there).
5. Polls the background compute-engine task until it finishes.
6. Queries `/api/qualitygates/project_status` for that analysis — the actual gate, not a guess.
7. Prints the failing conditions and exits non-zero (blocking the push) if the gate is red on
   anything other than coverage (coverage-only failures warn but don't block).

Adds ~30s-2min per push (full re-scan).

## Bypassing

```bash
SONAR_GATE_SKIP=1 git push     # or: git push --no-verify
```

## Notes

- `sonar.env` (local overrides) and `sonar.baseline` (which merge base
  the local baseline was built at) are gitignored. `sonar.env.example` is the
  tracked template. Local container credentials live outside the repo entirely,
  in `~/.sonar-prepush-gate.env`.
- Coverage is auto-detected (`run_coverage.sh`, else pytest with `--cov` pointed
  at this project's `sonar.sources`, else `npm run test:coverage`). Override with
  `SONAR_COVERAGE_COMMAND` / `SONAR_COVERAGE_REPORT` in `sonar.env`.
- `core.hooksPath` is a per-clone git config, not committed — everyone who wants
  the gate enforced locally runs the one-time setup command themselves.
- The LOCAL-ONLY guards have an offline test in the `sonar-prepush-gate` skill:
  `bash .claude/skills/sonar-prepush-gate/template/scripts/sonar/test_local_only_guards.sh`.
  Run it after every change to the gate template. It stubs `docker` and `curl`
  and fails if any path could reach a remote server.
