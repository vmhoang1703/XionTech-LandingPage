#!/usr/bin/env bash
set -euo pipefail
# Scan every repo in the workspace and report which ones have PR-able work.
#
# One call replaces a dozen per-repo `git` invocations. Read-only: it never
# pushes, never writes, never talks to Azure DevOps. Output is a JSON array on
# stdout, one object per repo.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./ado-lib.sh
source "$SCRIPT_DIR/ado-lib.sh"

# <root>/.claude/skills/create-pr/scripts/pr-scan.sh -> four levels up.
WORKSPACE_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"
BASE_OVERRIDE=""

while [[ $# -gt 0 ]]; do
  case "$1" in
  --root)
    WORKSPACE_ROOT="$2"
    shift 2
    ;;
  --base-branch)
    BASE_OVERRIDE="$2"
    shift 2
    ;;
  -h | --help)
    echo "Usage: $(basename "$0") [--root <workspace>] [--base-branch <branch>]"
    exit 0
    ;;
  *)
    echo "Unknown argument: $1" >&2
    exit 1
    ;;
  esac
done

if [[ ! -d "$WORKSPACE_ROOT/.git" ]]; then
  echo "Error: $WORKSPACE_ROOT is not a git repository (pass --root)." >&2
  exit 1
fi

# The workspace repo itself takes PRs too (planning artifacts live here), so it
# is scanned alongside the app repos. Discovery is by presence of .git rather
# than a hardcoded list, so a sixth repo is picked up automatically.
REPOS=("$WORKSPACE_ROOT")
for d in "$WORKSPACE_ROOT"/*/; do
  [[ -e "${d}.git" ]] && REPOS+=("${d%/}")
done

TSV="$(mktemp)"
trap 'rm -f "$TSV"' EXIT

for repo in "${REPOS[@]}"; do
  label="$(ado_repo_label "$repo" "$WORKSPACE_ROOT")"
  branch="$(git -C "$repo" branch --show-current 2>/dev/null || true)"
  [[ -z "$branch" ]] && branch="(detached)"

  upstream="$(git -C "$repo" rev-parse --abbrev-ref --symbolic-full-name '@{u}' 2>/dev/null || true)"
  ahead_up=0
  behind_up=0
  if [[ -n "$upstream" ]]; then
    ahead_up="$(git -C "$repo" rev-list --count '@{u}..HEAD' 2>/dev/null || echo 0)"
    behind_up="$(git -C "$repo" rev-list --count 'HEAD..@{u}' 2>/dev/null || echo 0)"
  fi

  base="${BASE_OVERRIDE:-$(ado_resolve_base "$repo")}"

  # A repo sitting on its own default branch has no feature work to open a PR
  # from, even when that branch is ahead of develop. Without this, pxp-ai and
  # pxp-data-aggregator read as PR-ready purely because main leads develop.
  default_branch="$(git -C "$repo" symbolic-ref --short refs/remotes/origin/HEAD 2>/dev/null || true)"
  default_branch="${default_branch#origin/}"
  [[ -z "$default_branch" ]] && default_branch="main"

  ahead=0
  merge_base=""
  if git -C "$repo" show-ref --verify --quiet "refs/remotes/origin/$base"; then
    merge_base="$(git -C "$repo" merge-base "origin/$base" HEAD 2>/dev/null || true)"
    [[ -n "$merge_base" ]] && ahead="$(git -C "$repo" rev-list --count "$merge_base..HEAD" 2>/dev/null || echo 0)"
  fi

  dirty=false
  [[ -n "$(git -C "$repo" status --porcelain 2>/dev/null)" ]] && dirty=true

  org=""
  project=""
  adorepo=""
  remote="$(git -C "$repo" remote get-url origin 2>/dev/null || true)"
  if [[ -n "$remote" ]] && ado_parse_remote "$remote"; then
    org="$ADO_ORG_URL"
    project="$ADO_PROJECT"
    adorepo="$ADO_REPO"
  fi

  printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n' \
    "$label" "$repo" "$branch" "$upstream" "$ahead_up" "$behind_up" \
    "$base" "$ahead" "$merge_base" "$dirty" "$org" "$project" "$adorepo" \
    "$default_branch" >>"$TSV"
done

python3 - "$TSV" <<'PY'
import json, re, sys


def work_items(branch):
    """Digit runs of 4+, deduped, in branch order.

    Branch names here take several shapes: 13166-update-activity-cost,
    InDevelop/Task-16569-..., feat/PXP-21350-21289-20120-... (three ids).
    The 4-digit floor keeps "v2" and "round1" from being read as ids.
    """
    seen, ordered = set(), []
    for w in re.findall(r"\d{4,}", branch):
        if w not in seen:
            seen.add(w)
            ordered.append(w)
    return ordered


rows = []
with open(sys.argv[1]) as fh:
    for line in fh:
        if not line.strip():
            continue
        (label, path, branch, upstream, ahead_up, behind_up,
         base, ahead, merge_base, dirty, org, project, repo,
         default_branch) = line.rstrip("\n").split("\t")
        ahead = int(ahead or 0)
        on_shared = branch in (base, default_branch)
        rows.append({
            "repo": label,
            "path": path,
            "currentBranch": branch,
            "upstream": upstream or None,
            "hasUpstream": bool(upstream),
            "aheadOfUpstream": int(ahead_up or 0),
            "behindUpstream": int(behind_up or 0),
            "baseBranch": base,
            "aheadCount": ahead,
            "mergeBase": merge_base or None,
            "dirty": dirty == "true",
            "defaultBranch": default_branch,
            "onSharedBranch": on_shared,
            # A range this long is not one story. Almost always it means the
            # base is wrong (pxp_mobile's long-lived `prototype` vs develop),
            # so the caller must confirm rather than summarise it.
            "largeRange": ahead > 30,
            "prReady": ahead > 0 and not on_shared,
            "organization": org or None,
            "project": project or None,
            "adoRepository": repo or None,
            "workItemIds": work_items(branch),
        })

json.dump(rows, sys.stdout, indent=2)
print()
PY
