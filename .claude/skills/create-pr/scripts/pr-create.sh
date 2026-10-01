#!/usr/bin/env bash
set -euo pipefail
# Create one GitHub PR from the current branch of a repo, with `gh`.
#
# This script does NOT push. It refuses to run when the branch is ahead of, or
# behind, its upstream — a PR built from a stale remote branch reviews code
# nobody can see.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./gh-lib.sh
source "$SCRIPT_DIR/gh-lib.sh"

usage() {
  cat <<'USAGE'
Usage: pr-create.sh --title <title> --description-file <path> [options]

  --repo <dir>             Local repo directory, not owner/name (default: current directory)
  --target-branch <branch> Target branch (default: develop if it exists, else origin/HEAD);
                           from develop, --target-branch main opens the release PR
  --title <title>          PR title (required)
  --description-file <path> Markdown file with the filled PR description (required)
  --reviewers <a,b>        Comma-separated GitHub logins (default: none)
  --draft                  Create the PR as a draft
  --dry-run                Print the exact gh invocation without running it
USAGE
  exit 1
}

REPO_DIR="."
TARGET_BRANCH=""
TARGET_EXPLICIT=false
TITLE=""
DESCRIPTION_FILE=""
REVIEWERS=""
DRAFT=false
DRY_RUN=false

while [[ $# -gt 0 ]]; do
  case "$1" in
  --repo)
    REPO_DIR="$2"
    shift 2
    ;;
  --target-branch)
    TARGET_BRANCH="$2"
    TARGET_EXPLICIT=true
    shift 2
    ;;
  --title)
    TITLE="$2"
    shift 2
    ;;
  --description-file)
    DESCRIPTION_FILE="$2"
    shift 2
    ;;
  --reviewers)
    REVIEWERS="$2"
    shift 2
    ;;
  --draft)
    DRAFT=true
    shift
    ;;
  --dry-run)
    DRY_RUN=true
    shift
    ;;
  *) usage ;;
  esac
done

[[ -z "$TITLE" || -z "$DESCRIPTION_FILE" ]] && usage

if ! git -C "$REPO_DIR" rev-parse --git-dir >/dev/null 2>&1; then
  echo "Error: $REPO_DIR is not inside a git repository." >&2
  exit 1
fi
REPO_DIR="$(git -C "$REPO_DIR" rev-parse --show-toplevel)"

if [[ ! -f "$DESCRIPTION_FILE" ]]; then
  echo "Error: description file not found: $DESCRIPTION_FILE" >&2
  exit 1
fi

if [[ "$DRY_RUN" != "true" ]] && ! command -v gh >/dev/null 2>&1; then
  echo "Error: GitHub CLI (gh) is not installed or not in PATH." >&2
  exit 1
fi

# Explicit --repo, never gh's own guess: with more than one remote gh asks
# which one to use, or picks the upstream of a fork.
REMOTE="$(git -C "$REPO_DIR" remote get-url origin 2>/dev/null || true)"
if [[ -z "$REMOTE" ]]; then
  echo "Error: $REPO_DIR has no 'origin' remote." >&2
  exit 1
fi
if ! gh_parse_remote "$REMOTE"; then
  echo "Error: could not parse a GitHub owner/repo out of: $REMOTE" >&2
  exit 1
fi

[[ -z "$TARGET_BRANCH" ]] && TARGET_BRANCH="$(resolve_base "$REPO_DIR")"

CURRENT_BRANCH="$(git -C "$REPO_DIR" branch --show-current)"
if [[ -z "$CURRENT_BRANCH" ]]; then
  echo "Error: $REPO_DIR is in detached HEAD; check out a branch first." >&2
  exit 1
fi
if [[ "$CURRENT_BRANCH" == "$TARGET_BRANCH" ]]; then
  echo "Error: source and target branch are both '$CURRENT_BRANCH'." >&2
  exit 1
fi

# main, develop and the remote default (develop on GitHub here) are shared: a
# PR from one of them would open and look plausible while proposing unrelated
# commits (main leads develop after every release merge). The one exception is
# the release PR develop -> main, and only when --target-branch main is given.
DEFAULT_BRANCH="$(git -C "$REPO_DIR" symbolic-ref --short refs/remotes/origin/HEAD 2>/dev/null || true)"
DEFAULT_BRANCH="${DEFAULT_BRANCH#origin/}"
IS_RELEASE=false
[[ "$CURRENT_BRANCH" == develop && "$TARGET_BRANCH" == main && "$TARGET_EXPLICIT" == true ]] && IS_RELEASE=true
if [[ "$IS_RELEASE" != true && ("$CURRENT_BRANCH" == main || "$CURRENT_BRANCH" == develop || "$CURRENT_BRANCH" == "$DEFAULT_BRANCH") ]]; then
  echo "Error: '$CURRENT_BRANCH' is a shared branch — a PR from it into" >&2
  echo "'$TARGET_BRANCH' would propose everything that ever landed on it." >&2
  echo "Check out the feature branch you meant. For a release PR, run from develop" >&2
  echo "with --target-branch main." >&2
  exit 1
fi

if ! git -C "$REPO_DIR" rev-parse --abbrev-ref --symbolic-full-name '@{u}' >/dev/null 2>&1; then
  echo "Error: branch '$CURRENT_BRANCH' has no upstream set." >&2
  echo "Push it first:  git -C $REPO_DIR push -u origin $CURRENT_BRANCH" >&2
  exit 1
fi

UPSTREAM_REF="$(git -C "$REPO_DIR" rev-parse --abbrev-ref --symbolic-full-name '@{u}')"
# The PR is opened from origin/<current branch>; an upstream that is any other
# branch (a branch created from origin/develop tracks develop) means the code
# under review was never pushed.
if [[ "$UPSTREAM_REF" != "origin/$CURRENT_BRANCH" ]]; then
  echo "Error: '$CURRENT_BRANCH' tracks '$UPSTREAM_REF', not 'origin/$CURRENT_BRANCH'." >&2
  echo "Push it first:  git -C $REPO_DIR push -u origin $CURRENT_BRANCH" >&2
  exit 1
fi
AHEAD_COUNT="$(git -C "$REPO_DIR" rev-list --count '@{u}..HEAD')"
BEHIND_COUNT="$(git -C "$REPO_DIR" rev-list --count 'HEAD..@{u}')"

if [[ "$BEHIND_COUNT" -gt 0 ]]; then
  echo "Error: '$CURRENT_BRANCH' is $BEHIND_COUNT commit(s) behind '$UPSTREAM_REF'." >&2
  echo "Sync first (git -C $REPO_DIR pull --rebase), then re-run." >&2
  exit 1
fi
if [[ "$AHEAD_COUNT" -gt 0 ]]; then
  echo "Error: '$CURRENT_BRANCH' is $AHEAD_COUNT commit(s) ahead of '$UPSTREAM_REF'." >&2
  echo "Push first (git -C $REPO_DIR push), then re-run." >&2
  exit 1
fi

GH_ARGS=(
  pr create
  --repo "$GH_REPO_SLUG"
  --base "$TARGET_BRANCH"
  --head "$CURRENT_BRANCH"
  --title "$TITLE"
  --body-file "$DESCRIPTION_FILE"
)
# "alice, bob" would otherwise reach gh as the login " bob".
REVIEWERS="${REVIEWERS// /}"
[[ -n "$REVIEWERS" ]] && GH_ARGS+=(--reviewer "$REVIEWERS")
[[ "$DRAFT" == "true" ]] && GH_ARGS+=(--draft)

echo "Repo:   $GH_REPO_SLUG"
echo "Branch: $CURRENT_BRANCH -> $TARGET_BRANCH  (in sync with $UPSTREAM_REF)"

if [[ "$DRY_RUN" == "true" ]]; then
  echo "DRY RUN — would run:"
  printf '  gh'
  printf ' %q' "${GH_ARGS[@]}"
  printf '\n'
  exit 0
fi

echo "Creating PR..."
# gh prints the new PR's URL on success and a readable error otherwise
# (including "a pull request for branch ... already exists"). It runs in the
# caller's directory: --repo and --head name the target, and a relative
# --description-file must resolve where it was checked above.
gh "${GH_ARGS[@]}"
