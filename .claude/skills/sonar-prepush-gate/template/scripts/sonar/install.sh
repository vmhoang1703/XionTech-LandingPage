#!/usr/bin/env bash
# Install/refresh this SonarQube pre-push gate in another repository.
#
# The canonical copy of the gate lives in the `sonar-prepush-gate` skill
# (.claude/skills/sonar-prepush-gate/template/scripts/). Every repo gets a copy
# from there, so when the gate changes, re-run this installer against each repo
# rather than hand-editing a repo's copy — that is what keeps them from
# drifting apart.
#
# Usage:
#   ./install.sh --target /path/to/repo --reference-branch dev
#   ./install.sh --target /path/to/monorepo/SubProject --reference-branch main
#
#   --target           Directory that should own `scripts/` — normally the repo
#                      root, but for a monorepo it is the project subdirectory
#                      (e.g. monorepo/SubProject). Required.
#   --reference-branch Branch the local gate diffs against: new code is what the
#                      current branch adds on top of it. Required the first time
#                      (afterwards it is remembered in sonar.env). Ask the repo's
#                      owner rather than assuming — it is usually the branch PRs
#                      target, dev or main.
#   --project-key      SonarQube project key. Defaults to the key in the target's
#                      sonar-project.properties, then its sonar.env.
#   --no-hooks         Copy the files but don't set core.hooksPath.
#
# LOCAL-ONLY variant: no shared-server URL or token is ever written.
#
# Existing sonar.env files are never overwritten — the installer only appends
# the settings the new gate needs.
set -euo pipefail

SRC_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC_HOOKS_DIR="$SRC_DIR/../git-hooks"

log() { echo "[sonar-install] $*"; }
die() { echo "[sonar-install] $*" >&2; exit 1; }

TARGET=""
PROJECT_KEY=""
REFERENCE_BRANCH=""
SET_HOOKS=1

while [ $# -gt 0 ]; do
  case "$1" in
    --target)      TARGET="${2:?--target needs a path}"; shift ;;
    --target=*)    TARGET="${1#--target=}" ;;
    --reference-branch)   REFERENCE_BRANCH="${2:?--reference-branch needs a branch name}"; shift ;;
    --reference-branch=*) REFERENCE_BRANCH="${1#--reference-branch=}" ;;
    --project-key) PROJECT_KEY="${2:?--project-key needs a value}"; shift ;;
    --project-key=*) PROJECT_KEY="${1#--project-key=}" ;;
    --no-hooks)    SET_HOOKS=0 ;;
    # Print the header block, whatever length it has grown to.
    -h|--help)     sed -n '2,/^set -euo pipefail/p' "${BASH_SOURCE[0]}" | sed '$d'; exit 0 ;;
    *)             die "Unknown argument '$1' (see --help)." ;;
  esac
  shift
done

[ -n "$TARGET" ] || die "--target is required."
[ -d "$TARGET" ] || die "Target '$TARGET' is not a directory."
TARGET="$(cd "$TARGET" && pwd)"

REPO_ROOT="$(git -C "$TARGET" rev-parse --show-toplevel)" \
  || die "'$TARGET' is not inside a git repository."

[ "$SRC_DIR" != "$TARGET/scripts/sonar" ] || die "Target is this repo — nothing to install."

# Paths the gate needs, expressed relative to the git root, which is what both
# core.hooksPath and SONAR_PROJECT_DIR are resolved against.
rel_to_root() { python -c "import os,sys;print(os.path.relpath(sys.argv[1], sys.argv[2]).replace('\\\\','/'))" "$1" "$REPO_ROOT"; }
PROJECT_DIR_REL="$(rel_to_root "$TARGET")"
HOOKS_PATH_REL="$(rel_to_root "$TARGET/scripts/git-hooks")"

DEST_SONAR="$TARGET/scripts/sonar"
DEST_HOOKS="$TARGET/scripts/git-hooks"
mkdir -p "$DEST_SONAR" "$DEST_HOOKS"

# ---------------------------------------------------------------------------
# Work out the project key before copying, so sonar.env can be seeded with it.
# ---------------------------------------------------------------------------
if [ -z "$PROJECT_KEY" ] && [ -f "$TARGET/sonar-project.properties" ]; then
  PROJECT_KEY="$(grep -E '^sonar\.projectKey=' "$TARGET/sonar-project.properties" | head -1 | cut -d= -f2- | tr -d '\r')"
fi
if [ -z "$PROJECT_KEY" ] && [ -f "$DEST_SONAR/sonar.env" ]; then
  PROJECT_KEY="$(grep -E '^SONAR_PROJECT_KEY=' "$DEST_SONAR/sonar.env" | head -1 | cut -d= -f2- | tr -d '\r')"
fi
[ -n "$PROJECT_KEY" ] || die "Could not determine the SonarQube project key — pass --project-key."

# The reference branch decides what the gate treats as "new code", so it is
# never guessed. Required on first install; remembered afterwards.
if [ -z "$REFERENCE_BRANCH" ] && [ -f "$DEST_SONAR/sonar.env" ]; then
  REFERENCE_BRANCH="$(grep -E '^SONAR_LOCAL_REFERENCE_BRANCH=' "$DEST_SONAR/sonar.env" | head -1 | cut -d= -f2- | tr -d '\r')"
fi
[ -n "$REFERENCE_BRANCH" ] || die "--reference-branch is required: the branch this repo's work is diffed against (usually the branch PRs target, e.g. dev or main). Ask the repo's owner instead of guessing."

# ---------------------------------------------------------------------------
# Copy the gate itself (these files are owned by the installer, overwritten).
# ---------------------------------------------------------------------------
for f in check_quality_gate.sh local_sonar.sh install.sh README.md; do
  cp "$SRC_DIR/$f" "$DEST_SONAR/$f"
  chmod +x "$DEST_SONAR/$f" 2>/dev/null || true
done
chmod -x "$DEST_SONAR/README.md" 2>/dev/null || true
cp "$SRC_HOOKS_DIR/pre-push" "$DEST_HOOKS/pre-push"
chmod +x "$DEST_HOOKS/pre-push"
log "Copied gate scripts into $PROJECT_DIR_REL/scripts/"

# sonar.env.example is templated per project so a fresh clone can just copy it.
sed -e "s|^SONAR_PROJECT_KEY=.*|SONAR_PROJECT_KEY=$PROJECT_KEY|" \
    -e "s|^SONAR_PROJECT_DIR=.*|SONAR_PROJECT_DIR=$PROJECT_DIR_REL|" \
    -e "s|^SONAR_LOCAL_REFERENCE_BRANCH=.*|SONAR_LOCAL_REFERENCE_BRANCH=$REFERENCE_BRANCH|" \
    "$SRC_DIR/sonar.env.example" > "$DEST_SONAR/sonar.env.example"

# ---------------------------------------------------------------------------
# sonar.env: never clobbered (may hold local overrides), only topped up.
# ---------------------------------------------------------------------------
ENV_FILE="$DEST_SONAR/sonar.env"
if [ ! -f "$ENV_FILE" ]; then
  cp "$DEST_SONAR/sonar.env.example" "$ENV_FILE"
  log "Created $PROJECT_DIR_REL/scripts/sonar/sonar.env."
else
  ensure_setting() {
    local key="$1" value="$2" comment="${3:-}"
    grep -qE "^[[:space:]]*$key=" "$ENV_FILE" && return 0
    { printf '\n'; [ -n "$comment" ] && printf '%s\n' "$comment"; printf '%s=%s\n' "$key" "$value"; } >> "$ENV_FILE"
    log "sonar.env: added $key"
  }
  ensure_setting SONAR_PROJECT_KEY "$PROJECT_KEY"
  ensure_setting SONAR_PROJECT_DIR "$PROJECT_DIR_REL"
  ensure_setting SONAR_LOCAL_NEW_CODE_MODE reference_branch \
    '# How the LOCAL gate defines "new code":
#   reference_branch - what this branch adds on top of the branch below (default)
#   previous_version - changes since the previous analysis
#   days             - a fixed SONAR_LOCAL_NEW_CODE_DAYS window'
  ensure_setting SONAR_LOCAL_REFERENCE_BRANCH "$REFERENCE_BRANCH" \
    '# Branch the local gate diffs against. Fetched before every run.'
fi

# ---------------------------------------------------------------------------
# .gitignore + hooks wiring
# ---------------------------------------------------------------------------
GITIGNORE="$REPO_ROOT/.gitignore"
touch "$GITIGNORE"
for entry in "$PROJECT_DIR_REL/scripts/sonar/sonar.env" \
             "$PROJECT_DIR_REL/scripts/sonar/sonar.local.env" \
             "$PROJECT_DIR_REL/scripts/sonar/sonar.baseline" \
             ".scannerwork/"; do
  # Monorepo-relative paths start with "./" when the target IS the root; strip it.
  clean="${entry#./}"
  grep -qxF "$clean" "$GITIGNORE" || { printf '%s\n' "$clean" >> "$GITIGNORE"; log ".gitignore: added $clean"; }
done

if [ "$SET_HOOKS" = "1" ]; then
  git -C "$REPO_ROOT" config core.hooksPath "$HOOKS_PATH_REL"
  log "core.hooksPath set to $HOOKS_PATH_REL"
else
  log "Skipped core.hooksPath (--no-hooks). Set it with: git config core.hooksPath $HOOKS_PATH_REL"
fi

log "Done. Next: start Docker Desktop, then run $PROJECT_DIR_REL/scripts/sonar/local_sonar.sh up"
