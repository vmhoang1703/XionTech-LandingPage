#!/usr/bin/env bash
# Daily local SonarQube gate until Demo day (2026-10-16). New code = everything
# develop adds on top of main. Run it on an up-to-date, clean develop:
#
#   git switch develop && git pull && npm run sonar:gate:full
#
# The gate scans the working tree, so on any other branch, or with local
# edits, it would judge that code instead of develop. Extra arguments go to
# the gate (npm run sonar:gate:full -- --skip-tests).
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

fail() { echo "[sonar-gate-full] $*" >&2; exit 1; }

branch="$(git branch --show-current)"
[ "$branch" = develop ] || fail "Check out develop first (now on '${branch:-detached HEAD}')."
git fetch -q origin develop main
[ "$(git rev-parse HEAD)" = "$(git rev-parse origin/develop)" ] ||
  fail "develop is not the same as origin/develop. Run git pull (and push or drop local commits) first."
[ -z "$(git status --porcelain)" ] || fail "The working tree has local changes. Commit or stash them first."

SONAR_LOCAL_REFERENCE_BRANCH=main exec bash scripts/sonar/check_quality_gate.sh "$@"
