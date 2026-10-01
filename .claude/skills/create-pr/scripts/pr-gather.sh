#!/usr/bin/env bash
set -euo pipefail
# Collect everything needed to write one repo's PR, in a single read-only call.
#
# Resolves the commit range, ahead counts, story key, diff and PR template
# itself so the caller never has to issue follow-up `git` commands. Output is a
# JSON object on stdout.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./gh-lib.sh
source "$SCRIPT_DIR/gh-lib.sh"

REPO_DIR="."
BASE_BRANCH=""
COMMIT_REF=""
MAX_DIFF_BYTES=60000

while [[ $# -gt 0 ]]; do
  case "$1" in
  --repo)
    REPO_DIR="$2"
    shift 2
    ;;
  --base-branch)
    BASE_BRANCH="$2"
    shift 2
    ;;
  --commit-ref)
    COMMIT_REF="$2"
    shift 2
    ;;
  --max-diff-bytes)
    MAX_DIFF_BYTES="$2"
    shift 2
    ;;
  -h | --help)
    echo "Usage: $(basename "$0") [--repo <path>] [--base-branch <branch>] [--commit-ref <range>] [--max-diff-bytes <n>]"
    exit 0
    ;;
  *)
    echo "Unknown argument: $1" >&2
    exit 1
    ;;
  esac
done

if ! git -C "$REPO_DIR" rev-parse --git-dir >/dev/null 2>&1; then
  echo "Error: $REPO_DIR is not inside a git repository." >&2
  exit 1
fi
REPO_DIR="$(git -C "$REPO_DIR" rev-parse --show-toplevel)"

BRANCH="$(git -C "$REPO_DIR" branch --show-current || true)"
[[ -z "$BRANCH" ]] && BRANCH="(detached)"

UPSTREAM="$(git -C "$REPO_DIR" rev-parse --abbrev-ref --symbolic-full-name '@{u}' 2>/dev/null || true)"
AHEAD_UPSTREAM=0
BEHIND_UPSTREAM=0
if [[ -n "$UPSTREAM" ]]; then
  AHEAD_UPSTREAM="$(git -C "$REPO_DIR" rev-list --count '@{u}..HEAD' || echo 0)"
  BEHIND_UPSTREAM="$(git -C "$REPO_DIR" rev-list --count 'HEAD..@{u}' || echo 0)"
fi

[[ -z "$BASE_BRANCH" ]] && BASE_BRANCH="$(resolve_base "$REPO_DIR")"

MERGE_BASE=""
if [[ -z "$COMMIT_REF" ]]; then
  if ! git -C "$REPO_DIR" show-ref --verify --quiet "refs/remotes/origin/$BASE_BRANCH"; then
    echo "Error: origin/$BASE_BRANCH does not exist in $REPO_DIR. Pass --base-branch." >&2
    exit 1
  fi
  MERGE_BASE="$(git -C "$REPO_DIR" merge-base "origin/$BASE_BRANCH" HEAD)"
  COMMIT_REF="$MERGE_BASE..HEAD"
fi

AHEAD_COUNT="$(git -C "$REPO_DIR" rev-list --count --no-merges "$COMMIT_REF" 2>/dev/null || echo 0)"

SLUG=""
REMOTE="$(git -C "$REPO_DIR" remote get-url origin 2>/dev/null || true)"
if [[ -n "$REMOTE" ]] && gh_parse_remote "$REMOTE"; then
  SLUG="$GH_REPO_SLUG"
fi

# Template resolution: the repo's own GitHub template wins, then the copy
# bundled with this skill. The repo ships no .github/ template today, so the
# bundled asset is the usual answer.
TEMPLATE_PATH=""
for candidate in \
  "$REPO_DIR/.github/pull_request_template.md" \
  "$SCRIPT_DIR/../assets/pull_request_template.md"; do
  if [[ -f "$candidate" ]]; then
    TEMPLATE_PATH="$candidate"
    break
  fi
done

TMPDIR_G="$(mktemp -d)"
trap 'rm -rf "$TMPDIR_G"' EXIT

git -C "$REPO_DIR" log --no-merges --format='%H%x1f%s%x1f%b%x1e' "$COMMIT_REF" >"$TMPDIR_G/commits" 2>/dev/null || true
git -C "$REPO_DIR" diff --stat "$COMMIT_REF" >"$TMPDIR_G/diffstat" 2>/dev/null || true
git -C "$REPO_DIR" diff --numstat "$COMMIT_REF" >"$TMPDIR_G/numstat" 2>/dev/null || true
git -C "$REPO_DIR" diff "$COMMIT_REF" 2>/dev/null | head -c "$MAX_DIFF_BYTES" >"$TMPDIR_G/diff" || true
[[ -n "$TEMPLATE_PATH" ]] && cp "$TEMPLATE_PATH" "$TMPDIR_G/template"

export G_DIR="$TMPDIR_G" G_COMMIT_REF="$COMMIT_REF" G_BASE="$BASE_BRANCH" G_BRANCH="$BRANCH" \
  G_UPSTREAM="$UPSTREAM" G_AHEAD_UP="$AHEAD_UPSTREAM" G_BEHIND_UP="$BEHIND_UPSTREAM" \
  G_AHEAD="$AHEAD_COUNT" G_MERGE_BASE="$MERGE_BASE" G_SLUG="$SLUG" \
  G_STORY="$(story_key "$BRANCH")" G_REPO_DIR="$REPO_DIR" G_TEMPLATE_PATH="$TEMPLATE_PATH" \
  G_MAX_DIFF="$MAX_DIFF_BYTES"

python3 <<'PY'
import json, os, sys

d = os.environ["G_DIR"]


def read(name):
    path = os.path.join(d, name)
    if not os.path.exists(path):
        return ""
    with open(path, encoding="utf-8", errors="replace") as fh:
        return fh.read()


commits = []
for record in read("commits").split("\x1e"):
    record = record.strip("\n")
    if not record:
        continue
    parts = record.split("\x1f")
    commits.append({
        "hash": parts[0][:12],
        "subject": parts[1] if len(parts) > 1 else "",
        "body": (parts[2] if len(parts) > 2 else "").strip(),
    })

numstat, additions, deletions = [], 0, 0
for line in read("numstat").splitlines():
    cols = line.split("\t")
    if len(cols) != 3:
        continue
    add = 0 if cols[0] == "-" else int(cols[0])
    dele = 0 if cols[1] == "-" else int(cols[1])
    additions += add
    deletions += dele
    numstat.append({"file": cols[2], "additions": add, "deletions": dele})

files = len(numstat)
total = additions + deletions
diff = read("diff")
branch = os.environ["G_BRANCH"]

json.dump({
    "repoPath": os.environ["G_REPO_DIR"],
    "githubRepo": os.environ["G_SLUG"] or None,
    "commitRef": os.environ["G_COMMIT_REF"],
    "baseBranch": os.environ["G_BASE"],
    "currentBranch": branch,
    "upstream": os.environ["G_UPSTREAM"] or None,
    "hasUpstream": bool(os.environ["G_UPSTREAM"]),
    "aheadCount": int(os.environ["G_AHEAD"]),
    "aheadOfUpstream": int(os.environ["G_AHEAD_UP"]),
    "behindUpstream": int(os.environ["G_BEHIND_UP"]),
    "mergeBase": os.environ["G_MERGE_BASE"] or None,
    "storyKey": os.environ["G_STORY"] or None,
    "commits": commits,
    "diffStat": read("diffstat"),
    "numstat": numstat,
    "totals": {
        "filesModified": files,
        "additions": additions,
        "deletions": deletions,
        "totalLinesChanged": total,
        "averageChangesPerFile": round(total / files, 1) if files else 0,
    },
    "diffTruncated": len(diff.encode("utf-8", "replace")) >= int(os.environ["G_MAX_DIFF"]),
    "diff": diff,
    "templatePath": os.environ["G_TEMPLATE_PATH"] or None,
    "template": read("template"),
}, sys.stdout, indent=2)
print()
PY
