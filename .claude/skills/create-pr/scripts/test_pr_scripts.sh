#!/usr/bin/env bash
set -uo pipefail
# Offline tests for the create-pr scripts. No network: the real `gh` is never
# called — create cases stop at a guard, at --dry-run, or at a fake `gh` that
# records its arguments. Run after any change here:
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
check "http" "acme/demo" "$(parse http://github.com/acme/demo)"
check "scp ssh" "acme/demo" "$(parse git@github.com:acme/demo.git)"
check "ssh url" "acme/demo" "$(parse ssh://git@github.com/acme/demo.git)"
check "dots, dashes" "a-b/c.d_e" "$(parse https://github.com/a-b/c.d_e.git)"
check "azure devops" "<none>" "$(parse https://dev.azure.com/org/proj/_git/repo)"
check "gitlab" "<none>" "$(parse https://gitlab.com/acme/demo.git)"
check "github.com in a path" "<none>" "$(parse https://gitlab.com/x@github.com/acme/demo)"
check "deep path" "<none>" "$(parse https://github.com/acme/demo/tree/main)"
check "owner only" "<none>" "$(parse https://github.com/acme)"

# --- story_key --------------------------------------------------------------
check "story feature" "1-1-brand-tokens" "$(story_key feature/1-1-brand-tokens)"
check "story fix" "10-2-nav" "$(story_key fix/10-2-nav)"
check "no story" "" "$(story_key fix/create-pr-github)"
check "docs branch" "" "$(story_key docs/story-specs)"
check "one number" "" "$(story_key feature/1-brand)"

# --- a throwaway repo shaped like this one ----------------------------------
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
# Ignore the user's own git config (signing, hooks, templates).
: >"$TMP/gitconfig"
export GIT_CONFIG_GLOBAL="$TMP/gitconfig" GIT_CONFIG_NOSYSTEM=1
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
git push -q -u origin develop
# Like the real repo: GitHub's default branch is develop, and main leads it.
git symbolic-ref refs/remotes/origin/HEAD refs/remotes/origin/develop
git switch -q main
git commit -q --allow-empty -m "release: merge develop"
git push -q origin main
printf '## What\n\nTest.\n' >"$TMP/body.md"

create() { bash "$SCRIPT_DIR/pr-create.sh" --title "feat: x" --description-file "$TMP/body.md" "$@" 2>&1; }

# --- pr-create.sh refusals --------------------------------------------------
out="$(create --dry-run)"
check_has "refuses main (default is develop)" "'main' is a shared branch" "$out"

git switch -q develop
out="$(create --dry-run --target-branch main)"
check_has "release PR develop -> main" "--base main --head develop" "$out"
out="$(create --dry-run)"
check_has "refuses develop -> develop" "source and target branch are both" "$out"
out="$(create --dry-run --target-branch feature/x)"
check_has "refuses develop to anything but main" "'develop' is a shared branch" "$out"

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

git reset -q --hard HEAD~1
out="$(create --dry-run)"
check_has "refuses behind upstream" "1 commit(s) behind" "$out"
git reset -q --hard "origin/feature/1-2-demo"

out="$(create --dry-run --target-branch feature/1-2-demo)"
check_has "refuses same source and target" "source and target branch are both" "$out"

out="$(bash "$SCRIPT_DIR/pr-create.sh" --title x --description-file "$TMP/missing.md" 2>&1)"
check_has "refuses missing body file" "description file not found" "$out"

out="$(bash "$SCRIPT_DIR/pr-create.sh" --description-file "$TMP/body.md" 2>&1)"
check_has "refuses missing title" "Usage: pr-create.sh" "$out"

git switch -q --detach
out="$(create --dry-run)"
check_has "refuses detached HEAD" "detached HEAD" "$out"
git switch -q feature/1-2-demo

git remote set-url origin https://gitlab.com/acme/demo.git
out="$(create --dry-run)"
check_has "refuses non-GitHub origin" "could not parse a GitHub owner/repo" "$out"
git remote rename origin upstream
out="$(create --dry-run)"
check_has "refuses no origin" "has no 'origin' remote" "$out"
git remote rename upstream origin
git remote set-url origin https://github.com/acme/demo.git

# --- pr-create.sh happy path ------------------------------------------------
out="$(create --dry-run --draft --reviewers 'alice, bob')"
check_has "dry run repo" "Repo:   acme/demo" "$out"
check_has "dry run base and head" "--base develop --head feature/1-2-demo" "$out"
check_has "dry run body file" "--body-file $TMP/body.md" "$out"
check_has "dry run reviewers (spaces dropped) and draft" '--reviewer alice\,bob --draft' "$out"

# A real run with a fake gh: it records its arguments and checks, from its own
# working directory, that the relative body file it was given exists.
mkdir -p "$TMP/bin" "$TMP/elsewhere"
cat >"$TMP/bin/gh" <<'FAKE'
#!/usr/bin/env bash
printf '%s\n' "$@" >"$FAKE_GH_LOG"
while [[ $# -gt 0 ]]; do
  [[ "$1" == --body-file ]] && { [[ -f "$2" ]] && echo BODY_FOUND || echo BODY_MISSING; }
  shift
done
FAKE
chmod +x "$TMP/bin/gh"
cp "$TMP/body.md" "$TMP/elsewhere/body.md"
out="$(cd "$TMP/elsewhere" && FAKE_GH_LOG="$TMP/gh.log" PATH="$TMP/bin:$PATH" \
  bash "$SCRIPT_DIR/pr-create.sh" --repo "$TMP/work" --title "feat: x" --description-file body.md 2>&1)"
check_has "real run reads a relative body file from the caller's directory" "BODY_FOUND" "$out"
check "real run passes --repo owner/name" "acme/demo" "$(sed -n '/^--repo$/{n;p;}' "$TMP/gh.log")"

# --- pr-scan.sh -------------------------------------------------------------
scan_row() { bash "$SCRIPT_DIR/pr-scan.sh" --root "$1" | python -c '
import json, sys
r = json.load(sys.stdin)[0]
print(r["currentBranch"], r["githubRepo"], r["storyKey"], r["baseBranch"], r["aheadCount"], r["prReady"])'; }
check "scan feature branch" "feature/1-2-demo acme/demo 1-2-demo develop 2 True" "$(scan_row "$TMP/work")"
git switch -q main
check "scan main is never PR-ready" "main acme/demo None develop 1 False" "$(scan_row "$TMP/work")"
git switch -q feature/1-2-demo
git worktree add -q "$TMP/wt" develop 2>/dev/null
check "scan works in a worktree" "develop acme/demo None develop 0 False" "$(scan_row "$TMP/wt")"

# --- pr-gather.sh -----------------------------------------------------------
gather() { bash "$SCRIPT_DIR/pr-gather.sh" --repo "$TMP/work" | python -c '
import json, sys
d = json.load(sys.stdin)
print(d["githubRepo"], d["storyKey"], d["baseBranch"], d["aheadCount"], d["templatePath"].replace("\\", "/"))'; }
out="$(gather)"
check_has "gather fields" "acme/demo 1-2-demo develop 2 " "$out"
check_has "gather uses the bundled template" "/assets/pull_request_template.md" "$out"
mkdir -p "$TMP/work/.github"
printf '## Repo template\n' >"$TMP/work/.github/pull_request_template.md"
check_has "gather prefers the repo's .github template" "/work/.github/pull_request_template.md" "$(gather)"

echo "create-pr tests: $PASS passed, $FAIL failed"
[[ "$FAIL" -eq 0 ]]
