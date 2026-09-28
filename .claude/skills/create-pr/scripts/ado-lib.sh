#!/usr/bin/env bash
# Shared helpers for the create-pr skill. Source this; do not execute it.
#
# Why this exists: `az repos pr create` auto-detects org/project/repo from the
# git remote, but this machine's `az devops configure` defaults point at a
# different organisation entirely (varkeyeducation / "Product Development").
# Relying on detection means a wrong-project PR gets created silently. Every
# az call in this skill therefore passes --organization/--project/--repository
# parsed from the repo's own `origin` URL.

# Project names can be percent-encoded in the remote URL ("Product%20Development"),
# but `az --project` wants the decoded name. The `%` in the pattern must be
# backslash-escaped for bash 3.2, which is what macOS ships as /bin/bash.
ado_urldecode() { printf '%b' "${1//\%/\\x}"; }

# ado_parse_remote <url> -> sets ADO_ORG_URL, ADO_PROJECT, ADO_REPO
ado_parse_remote() {
  local url="$1" rest host
  ADO_ORG_URL=""
  ADO_PROJECT=""
  ADO_REPO=""
  url="${url%.git}"

  case "$url" in
  git@ssh.dev.azure.com:v3/*)
    rest="${url#git@ssh.dev.azure.com:v3/}" # Org/Project/Repo
    ADO_ORG_URL="https://dev.azure.com/${rest%%/*}"
    rest="${rest#*/}"
    ADO_PROJECT="${rest%%/*}"
    ADO_REPO="${rest#*/}"
    ;;
  *dev.azure.com/*)
    # Handles both https://Org@dev.azure.com/... and https://dev.azure.com/...
    rest="${url#*dev.azure.com/}" # Org/Project/_git/Repo
    ADO_ORG_URL="https://dev.azure.com/${rest%%/*}"
    rest="${rest#*/}"
    if [[ "$rest" == _git/* ]]; then
      ADO_REPO="${rest#_git/}"
      ADO_PROJECT="$ADO_REPO" # repo named after the project
    else
      ADO_PROJECT="${rest%%/_git/*}"
      ADO_REPO="${rest##*/_git/}"
    fi
    ;;
  *.visualstudio.com/*)
    host="${url#*://}"
    host="${host%%/*}"
    host="${host#*@}"
    ADO_ORG_URL="https://${host}"
    rest="${url#*"${host}"/}"
    if [[ "$rest" == _git/* ]]; then
      ADO_REPO="${rest#_git/}"
      ADO_PROJECT="$ADO_REPO"
    else
      ADO_PROJECT="${rest%%/_git/*}"
      ADO_REPO="${rest##*/_git/}"
    fi
    ;;
  *)
    return 1
    ;;
  esac

  ADO_PROJECT="$(ado_urldecode "$ADO_PROJECT")"
  ADO_REPO="$(ado_urldecode "$ADO_REPO")"
  [[ -n "$ADO_ORG_URL" && -n "$ADO_PROJECT" && -n "$ADO_REPO" ]]
}

# ado_resolve_base <repo_dir> -> echoes the base branch name
# `develop` where it exists, otherwise the remote default from origin/HEAD.
# pxp-backend and pxp-infra have no develop, so a hardcoded default is wrong.
ado_resolve_base() {
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

# ado_work_items <branch_name> -> echoes space-separated work item ids
# Digit runs of 4+ so that "v2" or "round1" are not mistaken for ids.
# Branches here carry several forms: 13166-update-activity-cost,
# InDevelop/Task-16569-..., feat/PXP-21350-21289-20120-... (three ids).
ado_work_items() {
  printf '%s\n' "$1" | grep -oE '[0-9]{4,}' | awk '!seen[$0]++' | tr '\n' ' ' | sed 's/ *$//'
}

# ado_repo_label <repo_dir> <workspace_root> -> display name
ado_repo_label() {
  local repo="$1" root="$2"
  if [[ "$(cd "$repo" && pwd)" == "$(cd "$root" && pwd)" ]]; then
    basename "$(cd "$root" && pwd)"
  else
    basename "$(cd "$repo" && pwd)"
  fi
}
