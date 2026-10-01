#!/usr/bin/env bash
# Shared helpers for the create-pr skill. Source this; do not execute it.
#
# Every gh call in this skill passes --repo <owner>/<name> parsed from the
# repo's own `origin` URL, so gh never has to guess the target (it otherwise
# prompts, or picks an upstream when the clone has more than one remote).

# gh_parse_remote <url> -> sets GH_REPO_SLUG (owner/name)
gh_parse_remote() {
  local url="$1" rest
  GH_REPO_SLUG=""
  url="${url%/}"
  url="${url%.git}"

  case "$url" in
  git@github.com:*)
    rest="${url#git@github.com:}"
    ;;
  ssh://git@github.com/*)
    rest="${url#ssh://git@github.com/}"
    ;;
  https://github.com/* | http://github.com/* | https://*@github.com/*)
    rest="${url#*github.com/}"
    ;;
  *)
    return 1
    ;;
  esac

  # Exactly owner/name: anything deeper (a tree/ path) is not a clone URL.
  [[ "$rest" =~ ^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$ ]] || return 1
  GH_REPO_SLUG="$rest"
}

# resolve_base <repo_dir> -> echoes the base branch name
# `develop` where it exists (every PR here targets it), otherwise the remote
# default from origin/HEAD, otherwise main.
resolve_base() {
  local repo="$1" head
  if git -C "$repo" show-ref --verify --quiet refs/remotes/origin/develop; then
    echo develop
    return
  fi
  if head="$(git -C "$repo" symbolic-ref --short refs/remotes/origin/HEAD 2>/dev/null)"; then
    echo "${head#origin/}"
    return
  fi
  echo main
}

# story_key <branch_name> -> echoes the BMad story key, or nothing
# Branches are named <type>/<epic>-<story>-<slug> (feature/1-1-brand-tokens),
# and specs are spec-<epic>-<story>-<slug>.md, so the key is the branch name
# without its type prefix when it starts with two numbers.
story_key() {
  local name="${1#*/}"
  [[ "$name" =~ ^[0-9]+-[0-9]+-[a-z0-9-]+$ ]] && echo "$name"
  return 0
}
