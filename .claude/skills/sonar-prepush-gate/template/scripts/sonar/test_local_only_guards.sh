#!/usr/bin/env bash
# Offline test for the LOCAL-ONLY guards of the SonarQube pre-push gate.
#
# Installs the gate into a throwaway git repo and checks that every path to a
# remote SonarQube server is refused before any HTTP call is made. `docker` is
# stubbed to "running" so the guards are reached for the right reason, and
# `curl` is stubbed to record any call — a single call fails the test.
#
# Usage: bash test_local_only_guards.sh     (exit 0 = all guards hold)
set -euo pipefail

SRC_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

STUBS="$WORK/stubs"
CURL_CALLS="$WORK/curl-calls"
mkdir -p "$STUBS"
printf '#!/bin/sh\nexit 0\n' > "$STUBS/docker"
printf '#!/bin/sh\necho "$*" >> "%s"\nexit 1\n' "$CURL_CALLS" > "$STUBS/curl"
chmod +x "$STUBS/docker" "$STUBS/curl"

REPO="$WORK/repo"
mkdir -p "$REPO"
git -C "$REPO" init -q
git -C "$REPO" -c user.name=t -c user.email=t@t commit -q --allow-empty -m init
printf 'sonar.projectKey=guard-test\nsonar.sources=src\n' > "$REPO/sonar-project.properties"
bash "$SRC_DIR/install.sh" --target "$REPO" --reference-branch develop --no-hooks >/dev/null

FAILED=0
# expect_refusal <name> <expected message fragment> <command...>
expect_refusal() {
  local name="$1" expected="$2"; shift 2
  local out code=0
  out="$(cd "$REPO" && PATH="$STUBS:$PATH" "$@" 2>&1 </dev/null)" || code=$?
  if [ "$code" -eq 0 ]; then
    echo "FAIL  $name: exited 0"; FAILED=1
  elif ! grep -qF -- "$expected" <<<"$out"; then
    echo "FAIL  $name: expected '$expected', got: $out"; FAILED=1
  else
    echo "ok    $name"
  fi
}

GATE=./scripts/sonar/check_quality_gate.sh
# Gate cases match text only the gate's own message has: local_sonar.sh has a
# similar guard, and a gate regression must not pass by hitting that one.
LOCAL=./scripts/sonar/local_sonar.sh

expect_refusal "--remote is disabled" "--remote is disabled" \
  "$GATE" --remote
expect_refusal "remote SONAR_LOCAL_HOST_URL (gate)" "This project never scans against a remote server" \
  env SONAR_LOCAL_HOST_URL=https://sonar.example.com "$GATE" --branch feature/x
expect_refusal "userinfo URL bypass (gate)" "This project never scans against a remote server" \
  env SONAR_LOCAL_HOST_URL=http://localhost:1@remote.example/ "$GATE" --branch feature/x
expect_refusal "trailing path after port (gate)" "This project never scans against a remote server" \
  env SONAR_LOCAL_HOST_URL=http://localhost:9000/../x "$GATE" --branch feature/x
expect_refusal "remote SONAR_LOCAL_HOST_URL (local_sonar)" "SONAR_LOCAL_HOST_URL must be" \
  env SONAR_LOCAL_HOST_URL=https://sonar.example.com "$LOCAL" status
expect_refusal "userinfo URL bypass (local_sonar)" "SONAR_LOCAL_HOST_URL must be" \
  env SONAR_LOCAL_HOST_URL=http://127.0.0.1:1@remote.example/ "$LOCAL" status

printf 'sonar.host.url=https://sonar.example.com\n' >> "$REPO/sonar-project.properties"
expect_refusal "sonar.host.url in properties" "sets sonar.host.url" \
  "$GATE" --branch develop
sed -i.bak '/sonar.host.url/d' "$REPO/sonar-project.properties"

printf '#!/bin/sh\nexit 1\n' > "$STUBS/docker"
expect_refusal "Docker down refuses (develop push stays local)" "needs Docker" \
  "$GATE" --branch develop

if [ -s "$CURL_CALLS" ]; then
  echo "FAIL  curl was called (network access before a guard):"; cat "$CURL_CALLS"; FAILED=1
else
  echo "ok    no curl call was made"
fi

# Shared-server settings must be dropped before any call. Let the gate pass
# every guard and reach local_sonar.sh (docker "running", curl failing), then
# check that no curl call saw the remote URL or token — in args or environment.
LEAK_STUBS="$WORK/leak-stubs"
LEAK_LOG="$WORK/leak-log"
mkdir -p "$LEAK_STUBS" "$WORK/home"
printf '#!/bin/sh\nexit 0\n' > "$LEAK_STUBS/docker"
printf '#!/bin/sh\necho "$* HOST=${SONAR_HOST_URL:-} TOKEN=${SONAR_TOKEN:-}" >> "%s"\nexit 1\n' "$LEAK_LOG" > "$LEAK_STUBS/curl"
chmod +x "$LEAK_STUBS/docker" "$LEAK_STUBS/curl"
(cd "$REPO" && HOME="$WORK/home" PATH="$LEAK_STUBS:$PATH" \
  SONAR_HOST_URL=https://remote.example SONAR_TOKEN=leak-secret \
  "$GATE" --branch feature/x >/dev/null 2>&1 </dev/null) || true
if [ ! -s "$LEAK_LOG" ]; then
  echo "FAIL  SONAR_HOST_URL/SONAR_TOKEN dropped: gate never reached curl, nothing proven"; FAILED=1
elif grep -qE 'remote\.example|leak-secret' "$LEAK_LOG"; then
  echo "FAIL  SONAR_HOST_URL/SONAR_TOKEN reached curl:"; cat "$LEAK_LOG"; FAILED=1
else
  echo "ok    SONAR_HOST_URL/SONAR_TOKEN never reach curl"
fi

[ "$FAILED" -eq 0 ] && echo "All local-only guards hold." || { echo "Local-only guard test FAILED."; exit 1; }
