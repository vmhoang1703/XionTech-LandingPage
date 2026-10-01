#!/usr/bin/env bash
set -uo pipefail
# Offline tests for the create-pr scripts. No network, no gh call: every
# create case stops at a guard or at --dry-run. Run after any change here:
#   bash .claude/skills/create-pr/scripts/test_pr_scripts.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./gh-lib.sh
source "$SCRIPT_DIR/gh-lib.sh"

PASS=0
FAIL=0
check() { # check <name> <expected> <actual>
  if [[ "$2" == "$3" ]]; then
    PASS=$((PASS + 1))
  else
    FAIL=$((FAIL + 1))
    printf 'FAIL %s\n  want: %s\n  got:  %s\n' "$1" "$2" "$3"
  fi
}
check_has() { # check_has <name> <needle> <haystack>
  if [[ "$3" == *"$2"* ]]; then
    PASS=$((PASS + 1))
  else
    FAIL=$((FAIL + 1))
    printf 'FAIL %s\n  want text: %s\n  got:       %s\n' "$1" "$2" "$3"
  fi
}

# --- gh_parse_remote --------------------------------------------------------
parse() { if gh_parse_remote "$1"; then echo "$GH_REPO_SLUG"; else echo "<none>"; fi; }
check "https .git" "acme/demo" "$(parse https://github.com/acme/demo.git)"
check "https bare" "acme/demo" "$(parse https://github.com/acme/demo)"
check "https slash" "acme/demo" "$(parse https://github.com/acme/demo/)"
check "https user@" "acme/demo" "$(parse https://someone@github.com/acme/demo.git)"
check "scp ssh" "acme/demo" "$(parse git@github.com:acme/demo.git)"
check "ssh url" "acme/demo" "$(parse ssh://git@github.com/acme/demo.git)"
check "dots, dashes" "a-b/c.d_e" "$(parse https://github.com/a-b/c.d_e.git)"
check "azure devops" "<none>" "$(parse https://dev.azure.com/org/proj/_git/repo)"
check "gitlab" "<none>" "$(parse https://gitlab.com/acme/demo.git)"
check "deep path" "<none>" "$(parse https://github.com/acme/demo/tree/main)"
check "owner only" "<none>" "$(parse https://github.com/acme)"

# --- story_key --------------------------------------------------------------
check "story feature" "1-1-brand-tokens" "$(story_key feature/1-1-brand-tokens)"
check "story fix" "10-2-nav" "$(story_key fix/10-2-nav)"
check "no story" "" "$(story_key fix/create-pr-github)"
check "docs branch" "" "$(story_key docs/story-specs)"
check "one number" "" "$(story_key feature/1-brand)"

# --- pr-create.sh guards, against a throwaway repo --------------------------
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
git init -q --bare "$TMP/remote.git"
git init -q -b main "$TMP/work"
cd "$TMP/work" || exit 1
git config user.name test
git config user.email test@example.invalid
# origin must look like GitHub to the parser; pushes go to the local bare repo.
git remote add origin https://github.com/acme/demo.git
git config "url.$TMP/remote.git.pushInsteadOf" https://github.com/acme/demo.git
git commit -q --allow-empty -m "chore: init"
git push -q origin main
git switch -q -c develop
git push -q origin develop
git remote set-head origin main >/dev/null 2>&1 ||
  git symbolic-ref refs/remotes/origin/HEAD refs/remotes/origin/main
printf '## What\n\nTest.\n' >"$TMP/body.md"

create() { bash "$SCRIPT_DIR/pr-create.sh" --title "feat: x" --description-file "$TMP/body.md" "$@" 2>&1; }

git switch -q main
out="$(create --dry-run)"
check_has "refuses default branch" "is this repo's default branch" "$out"

git switch -q -c feature/1-2-demo develop
git commit -q --allow-empty -m "feat: demo"
out="$(create --dry-run)"
check_has "refuses no upstream" "has no upstream set" "$out"

git switch -q -c feature/1-3-tracks --track origin/develop
git commit -q --allow-empty -m "feat: tracks develop"
out="$(create --dry-run)"
check_has "refuses upstream on another branch" "tracks 'origin/develop'" "$out"

git switch -q feature/1-2-demo
git push -q -u origin feature/1-2-demo
git commit -q --allow-empty -m "feat: not pushed"
out="$(create --dry-run)"
check_has "refuses ahead of upstream" "1 commit(s) ahead" "$out"

git push -q
out="$(create --dry-run --draft --reviewers alice,bob)"
check_has "dry run repo" "Repo:   acme/demo" "$out"
check_has "dry run base and head" "--base develop --head feature/1-2-demo" "$out"
check_has "dry run body file" "--body-file $TMP/body.md" "$out"
check_has "dry run reviewers and draft" "--reviewer alice\,bob --draft" "$out"

out="$(create --dry-run --target-branch feature/1-2-demo)"
check_has "refuses same source and target" "source and target branch are both" "$out"

out="$(bash "$SCRIPT_DIR/pr-create.sh" --title x --description-file "$TMP/missing.md" 2>&1)"
check_has "refuses missing body file" "description file not found" "$out"

git remote set-url origin https://gitlab.com/acme/demo.git
out="$(create --dry-run)"
check_has "refuses non-GitHub origin" "could not parse a GitHub owner/repo" "$out"
git remote set-url origin https://github.com/acme/demo.git

# --- pr-scan.sh -------------------------------------------------------------
scan="$(bash "$SCRIPT_DIR/pr-scan.sh" --root "$TMP/work" | python3 -c '
import json, sys
r = json.load(sys.stdin)[0]
print(r["githubRepo"], r["storyKey"], r["baseBranch"], r["aheadCount"], r["prReady"])')"
check "scan fields" "acme/demo 1-2-demo develop 2 True" "$scan"

echo "create-pr tests: $PASS passed, $FAIL failed"
[[ "$FAIL" -eq 0 ]]
