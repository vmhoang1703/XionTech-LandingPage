#!/usr/bin/env bash
set -euo pipefail
# Create one Azure DevOps PR from the current branch of a repo.
#
# This script does NOT push. It refuses to run when the branch is ahead of, or
# behind, its upstream — a PR built from a stale remote branch reviews code
# nobody can see.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./ado-lib.sh
source "$SCRIPT_DIR/ado-lib.sh"

usage() {
  cat <<'EOF'
Usage: pr-create-azure.sh --title <title> --description-file <path> [options]

  --repo <path>            Repo to create the PR in (default: current directory)
  --target-branch <branch> Target branch (default: develop if it exists, else origin/HEAD)
  --title <title>          PR title (required)
  --description-file <path> Markdown file with the filled PR description (required)
  --reviewers <a,b>        Comma-separated reviewer emails (default: none)
  --work-items <1,2>       Work item ids to link (ADO links these; "AB#" text does not)
  --draft                  Create the PR as a draft
  --dry-run                Print the exact az invocation without running it
EOF
  exit 1
}

REPO_DIR="."
TARGET_BRANCH=""
TITLE=""
DESCRIPTION_FILE=""
REVIEWERS=""
WORK_ITEMS=""
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
  --work-items)
    WORK_ITEMS="$2"
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

if ! command -v az >/dev/null 2>&1; then
  echo "Error: Azure CLI (az) is not installed or not in PATH." >&2
  exit 1
fi

# Explicit org/project/repo, never az's auto-detection: the configured devops
# defaults on this machine point at a different organisation and project, and a
# PR opened there would look like it succeeded.
REMOTE="$(git -C "$REPO_DIR" remote get-url origin 2>/dev/null || true)"
if [[ -z "$REMOTE" ]]; then
  echo "Error: $REPO_DIR has no 'origin' remote." >&2
  exit 1
fi
if ! ado_parse_remote "$REMOTE"; then
  echo "Error: could not parse an Azure DevOps org/project/repo out of: $REMOTE" >&2
  exit 1
fi

[[ -z "$TARGET_BRANCH" ]] && TARGET_BRANCH="$(ado_resolve_base "$REPO_DIR")"

CURRENT_BRANCH="$(git -C "$REPO_DIR" branch --show-current)"
if [[ -z "$CURRENT_BRANCH" ]]; then
  echo "Error: $REPO_DIR is in detached HEAD; check out a branch first." >&2
  exit 1
fi
if [[ "$CURRENT_BRANCH" == "$TARGET_BRANCH" ]]; then
  echo "Error: source and target branch are both '$CURRENT_BRANCH'." >&2
  exit 1
fi

# main is ahead of develop in several of these repos, so a PR from the default
# branch would open and look plausible while proposing every unrelated commit
# that has ever landed there.
DEFAULT_BRANCH="$(git -C "$REPO_DIR" symbolic-ref --short refs/remotes/origin/HEAD 2>/dev/null || true)"
DEFAULT_BRANCH="${DEFAULT_BRANCH#origin/}"
if [[ -n "$DEFAULT_BRANCH" && "$CURRENT_BRANCH" == "$DEFAULT_BRANCH" ]]; then
  echo "Error: '$CURRENT_BRANCH' is this repo's default branch — a PR from it into" >&2
  echo "'$TARGET_BRANCH' would propose everything that ever landed on it." >&2
  echo "Check out the feature branch you meant, or pass --target-branch deliberately." >&2
  exit 1
fi

if ! git -C "$REPO_DIR" rev-parse --abbrev-ref --symbolic-full-name '@{u}' >/dev/null 2>&1; then
  echo "Error: branch '$CURRENT_BRANCH' has no upstream set." >&2
  echo "Push it first:  git -C $REPO_DIR push -u origin $CURRENT_BRANCH" >&2
  exit 1
fi

UPSTREAM_REF="$(git -C "$REPO_DIR" rev-parse --abbrev-ref --symbolic-full-name '@{u}')"
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

AZ_ARGS=(
  repos pr create
  --organization "$ADO_ORG_URL"
  --project "$ADO_PROJECT"
  --repository "$ADO_REPO"
  --source-branch "$CURRENT_BRANCH"
  --target-branch "$TARGET_BRANCH"
  --title "$TITLE"
  --description "$(cat "$DESCRIPTION_FILE")"
  --detect false
  --output json
)
# --reviewers and --work-items are nargs='+' in the az devops extension, so
# each value has to be its own argv entry rather than one comma-joined string.
if [[ -n "$REVIEWERS" ]]; then
  IFS=',' read -r -a _reviewers <<<"$REVIEWERS"
  AZ_ARGS+=(--reviewers "${_reviewers[@]}")
fi
if [[ -n "$WORK_ITEMS" ]]; then
  IFS=',' read -r -a _items <<<"$WORK_ITEMS"
  AZ_ARGS+=(--work-items "${_items[@]}")
fi
[[ "$DRAFT" == "true" ]] && AZ_ARGS+=(--draft true)

echo "Repo:   $ADO_REPO  ($ADO_ORG_URL / $ADO_PROJECT)"
echo "Branch: $CURRENT_BRANCH -> $TARGET_BRANCH  (in sync with $UPSTREAM_REF)"

if [[ "$DRY_RUN" == "true" ]]; then
  echo "DRY RUN — would run:"
  printf '  az'
  for arg in "${AZ_ARGS[@]}"; do
    # The description is the whole PR body; print a stand-in so the command
    # stays one readable line.
    if [[ "$arg" == "$(cat "$DESCRIPTION_FILE")" ]]; then
      printf ' <contents of %s>' "$DESCRIPTION_FILE"
    else
      printf ' %q' "$arg"
    fi
  done
  printf '\n'
  exit 0
fi

echo "Creating PR..."
RESPONSE="$(cd "$REPO_DIR" && az "${AZ_ARGS[@]}")"

PR_ID="$(printf '%s' "$RESPONSE" | python3 -c 'import json,sys; print(json.load(sys.stdin).get("pullRequestId",""))')"
if [[ -n "$PR_ID" ]]; then
  URL="$(ADO_ORG_URL="$ADO_ORG_URL" ADO_PROJECT="$ADO_PROJECT" ADO_REPO="$ADO_REPO" PR_ID="$PR_ID" \
    python3 -c 'import os,urllib.parse as u; print("{}/{}/_git/{}/pullrequest/{}".format(os.environ["ADO_ORG_URL"], u.quote(os.environ["ADO_PROJECT"]), u.quote(os.environ["ADO_REPO"]), os.environ["PR_ID"]))')"
  echo "PR !$PR_ID created: $URL"
else
  printf '%s\n' "$RESPONSE"
fi
