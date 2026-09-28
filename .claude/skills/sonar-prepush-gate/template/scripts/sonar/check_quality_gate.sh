#!/usr/bin/env bash
# SonarQube Quality Gate check — reusable across projects unchanged except for
# the coverage-generation step, which auto-detects the project's stack
# (Python/pytest, Node/vitest, or a bespoke run_coverage.sh).
#
# LOCAL-ONLY variant (XionTech Landing Page). This project is not a XionTech
# company project, so nothing is ever published to the shared XT SonarQube
# server: every branch — including develop and main — is scanned against a
# SonarQube container on this machine (scripts/sonar/local_sonar.sh). The
# upstream skill's remote mode (default-branch pushes, --remote) is removed.
#
# The scanner itself runs in Docker (sonarsource/sonar-scanner-cli) so nobody
# has to install a scanner locally. Docker is required: without it the gate
# refuses to run.
#
# Usage:
#   check_quality_gate.sh                 # scan against the local container
#   check_quality_gate.sh --branch dev    # pretend this branch is being pushed
#   check_quality_gate.sh --skip-tests    # reuse the existing coverage.xml
#
# Escape hatches: SONAR_GATE_SKIP=1 git push  (or git push --no-verify).
#
# To reuse in another project: copy scripts/sonar/ + scripts/git-hooks/, copy
# sonar-project.properties (with a new sonar.projectKey), and set
# SONAR_PROJECT_DIR in sonar.env to wherever that properties file lives
# relative to the repo root.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(git rev-parse --show-toplevel)"
ENV_FILE="$SCRIPT_DIR/sonar.env"
# Machine-wide, not per-repo: one local SonarQube container serves every repo,
# so its credentials do too (see local_sonar.sh).
LOCAL_ENV_FILE="${SONAR_LOCAL_STATE_FILE:-$HOME/.sonar-prepush-gate.env}"

log() { echo "[sonar-gate] $*"; }
die() { echo "[sonar-gate] $*" >&2; exit 1; }

if [ "${SONAR_GATE_SKIP:-0}" = "1" ]; then
  log "SONAR_GATE_SKIP=1 — skipping the Quality Gate check."
  exit 0
fi

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
if [ -f "$ENV_FILE" ]; then
  # Anything already exported by the caller wins, so a one-off override works:
  #   SONAR_LOCAL_NEW_CODE_MODE=days ./check_quality_gate.sh
  # Plain `source` would clobber those silently. Every KEY=VALUE line is turned
  # into a default assignment instead; sonar.env still supplies everything the
  # caller did not set.
  while IFS= read -r _line || [ -n "$_line" ]; do
    case "$_line" in
      ''|'#'*) continue ;;
      *=*) ;;
      *) continue ;;
    esac
    _key="${_line%%=*}"
    _key="$(printf '%s' "$_key" | tr -d '[:space:]')"
    case "$_key" in
      ''|*[!A-Za-z0-9_]*) continue ;;   # not a shell identifier - skip
    esac
    # Let the shell strip quotes exactly as it would on a normal assignment.
    eval "export $_key=\"\${$_key:-$(printf '%s' "${_line#*=}")}\""
  done < "$ENV_FILE"
  unset _line _key
else
  die "Missing $ENV_FILE — copy sonar.env.example to sonar.env and fill it in."
fi

: "${SONAR_PROJECT_DIR:?Set SONAR_PROJECT_DIR in scripts/sonar/sonar.env}"
: "${SONAR_PROJECT_KEY:?Set SONAR_PROJECT_KEY in scripts/sonar/sonar.env}"

SONAR_LOCAL_CONTAINER="${SONAR_LOCAL_CONTAINER:-sonarqube-local}"
SONAR_LOCAL_NETWORK="${SONAR_LOCAL_NETWORK:-sonar-local-net}"
SONAR_LOCAL_PORT="${SONAR_LOCAL_PORT:-9000}"
SONAR_LOCAL_HOST_URL="${SONAR_LOCAL_HOST_URL:-http://localhost:$SONAR_LOCAL_PORT}"
SONAR_LOCAL_NEW_CODE_DAYS="${SONAR_LOCAL_NEW_CODE_DAYS:-7}"
SONAR_LOCAL_NEW_CODE_MODE="${SONAR_LOCAL_NEW_CODE_MODE:-reference_branch}"
SONAR_LOCAL_REFERENCE_BRANCH="${SONAR_LOCAL_REFERENCE_BRANCH:-}"
SONAR_SCANNER_IMAGE="${SONAR_SCANNER_IMAGE:-sonarsource/sonar-scanner-cli:latest}"
BASELINE_FILE="$SCRIPT_DIR/sonar.baseline"

# Normalised, because SONAR_PROJECT_DIR is usually "." — a raw "$REPO_ROOT/."
# keeps its trailing separator through cygpath, and the coverage-path rewrite
# would then swallow the separator ("/usr/src" + "src" instead of "/usr/src/src").
PROJECT_PATH="$(cd "$REPO_ROOT/$SONAR_PROJECT_DIR" && pwd)"

# ---------------------------------------------------------------------------
# Arguments
# ---------------------------------------------------------------------------
TARGET_BRANCH=""
RUN_TESTS=1

while [ $# -gt 0 ]; do
  case "$1" in
    --local)      ;;   # the only mode; accepted for compatibility
    --remote)     die "--remote is disabled: this project must never publish to the shared XT SonarQube server. Scans run locally only." ;;
    --branch)     TARGET_BRANCH="${2:?--branch needs a branch name}"; shift ;;
    --branch=*)   TARGET_BRANCH="${1#--branch=}" ;;
    --skip-tests) RUN_TESTS=0 ;;
    -h|--help)    sed -n '2,/^set -euo pipefail/p' "${BASH_SOURCE[0]}" | sed '$d'; exit 0 ;;
    *)            die "Unknown argument '$1' (see --help)." ;;
  esac
  shift
done

# ---------------------------------------------------------------------------
# Which branch is being pushed?
# ---------------------------------------------------------------------------
# git hands a pre-push hook one line per ref on stdin:
#   <local ref> <local sha> <remote ref> <remote sha>
# The remote ref is the branch name used in the log; every branch is scanned
# locally regardless.
ZERO_SHA="0000000000000000000000000000000000000000"
if [ -z "$TARGET_BRANCH" ] && [ ! -t 0 ]; then
  # -t: git writes the ref list immediately and closes stdin, so a read that
  # blocks means stdin belongs to something else entirely (a background job, a
  # CI runner, a wrapper script). Without the timeout the gate hangs forever
  # there instead of falling back to the current branch.
  while read -r -t 5 _local_ref local_sha remote_ref _remote_sha; do
    [ -n "${remote_ref:-}" ] || continue
    [ "$local_sha" = "$ZERO_SHA" ] && continue   # branch deletion, nothing to scan
    case "$remote_ref" in
      refs/heads/*)
        candidate="${remote_ref#refs/heads/}"
        TARGET_BRANCH="$candidate"
        ;;
    esac
  done
fi
[ -n "$TARGET_BRANCH" ] || TARGET_BRANCH="$(git -C "$REPO_ROOT" rev-parse --abbrev-ref HEAD)"

# ---------------------------------------------------------------------------
# Target selection
# ---------------------------------------------------------------------------
sonar_host_url_in_properties() {
  local file="$PROJECT_PATH/sonar-project.properties"
  [ -f "$file" ] || return 0
  grep -E '^[[:space:]]*sonar\.host\.url[[:space:]]*=' "$file" | head -1
}

DOCKER_OK=0
if command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1; then
  DOCKER_OK=1
fi

# Shared-server settings are never used here; drop them so nothing downstream
# can pick them up by accident.
unset SONAR_HOST_URL SONAR_TOKEN

# The "local" container URL is overridable in sonar.env; refuse anything that
# is not this machine, so an override can never point the gate at a server.
# Only http://localhost:<port> or http://127.0.0.1:<port>, nothing after the
# port. A glob such as http://localhost:* would also accept
# http://localhost:1@remote.host/, which curl sends to remote.host.
LOCAL_URL_RE='^http://(localhost|127\.0\.0\.1):[0-9]+/?$'
if ! [[ "$SONAR_LOCAL_HOST_URL" =~ $LOCAL_URL_RE ]]; then
  die "SONAR_LOCAL_HOST_URL must be http://localhost:<port> or http://127.0.0.1:<port> (got '$SONAR_LOCAL_HOST_URL'). This project never scans against a remote server."
fi

if [ -n "$(sonar_host_url_in_properties)" ]; then
  die "sonar-project.properties sets sonar.host.url — remove it. This project scans against the local container only."
fi

if [ "$DOCKER_OK" != "1" ]; then
  die "The gate needs Docker for the local SonarQube container. Start Docker Desktop and retry, or bypass once with:  SONAR_GATE_SKIP=1 git push"
fi
log "Branch '$TARGET_BRANCH' — checking against the LOCAL SonarQube container (this project never publishes to the shared server)."
"$SCRIPT_DIR/local_sonar.sh" ensure
set -a
# shellcheck disable=SC1090
[ -f "$LOCAL_ENV_FILE" ] && source "$LOCAL_ENV_FILE"
set +a
: "${SONAR_LOCAL_TOKEN:?local_sonar.sh did not produce a token — run scripts/sonar/local_sonar.sh up}"
API_URL="$SONAR_LOCAL_HOST_URL"
API_TOKEN="$SONAR_LOCAL_TOKEN"

# The project must exist before its new-code period can be set. What that
# period should be is decided later, once the scanner helpers are defined
# (see configure_local_new_code).
curl -s -o /dev/null -m 20 -u "$API_TOKEN:" -X POST "$API_URL/api/projects/create" \
  --data-urlencode "project=$SONAR_PROJECT_KEY" \
  --data-urlencode "name=$SONAR_PROJECT_KEY" || true

# ---------------------------------------------------------------------------
# New code: resolve and validate the reference point
# ---------------------------------------------------------------------------
# Done before the test suite runs, not after: a misconfigured reference branch
# should cost a second, not a full coverage run. Only git and config are needed
# here; the baseline scan itself happens later (configure_local_new_code).
REF_SPEC=""
MERGE_BASE=""

resolve_reference_base() {
  [ "$SONAR_LOCAL_NEW_CODE_MODE" = "reference_branch" ] || return 0

  # Everything below fails closed. A gate that quietly falls back to a window
  # nothing lands in reports "passed" while judging zero lines, which is worse
  # than refusing to run: use SONAR_LOCAL_NEW_CODE_MODE=days or SONAR_GATE_SKIP=1
  # if you consciously want to proceed without a branch diff.
  local ref="${SONAR_LOCAL_REFERENCE_BRANCH:-}"
  if [ -z "$ref" ]; then
    die "SONAR_LOCAL_NEW_CODE_MODE=reference_branch needs SONAR_LOCAL_REFERENCE_BRANCH set in scripts/sonar/sonar.env (the branch your work is diffed against, e.g. dev)."
  fi

  # The remote-tracking ref can be days old, and the merge base is computed from
  # it — stale means baselining against the wrong commit, silently. Refresh it,
  # but never let a network problem block the push.
  if [ "${SONAR_LOCAL_FETCH_REFERENCE:-1}" = "1" ]; then
    local fetch_cmd=(git -C "$REPO_ROOT" fetch --quiet origin "$ref")
    command -v timeout >/dev/null 2>&1 && fetch_cmd=(timeout 60 "${fetch_cmd[@]}")
    if ! "${fetch_cmd[@]}" 2>/dev/null; then
      log "WARNING: could not fetch '$ref' from origin — using the local copy, which may be out of date."
    fi
  fi

  local candidate
  for candidate in "origin/$ref" "$ref"; do
    if git -C "$REPO_ROOT" rev-parse --verify --quiet "$candidate^{commit}" >/dev/null 2>&1; then
      REF_SPEC="$candidate"
      break
    fi
  done
  [ -n "$REF_SPEC" ] || die "Reference branch '$ref' not found. Fetch it first:  git fetch origin $ref"

  MERGE_BASE="$(git -C "$REPO_ROOT" merge-base HEAD "$REF_SPEC" 2>/dev/null || true)"
  [ -n "$MERGE_BASE" ] || die "No merge base between HEAD and $REF_SPEC — the branches share no history, so there is nothing to diff against."
}

resolve_reference_base

SCAN_LOG="$(mktemp)"
TEST_LOG="$(mktemp)"
COVERAGE_REPORT=""
COVERAGE_BACKUP=""
BASELINE_EXPORT=""
cleanup() {
  # The coverage report is rewritten in place for the dockerised scanner (see
  # rewrite_coverage_for_container); always put the original back, including on
  # a failed scan, so the file on disk still matches this machine's paths.
  if [ -n "$COVERAGE_BACKUP" ] && [ -f "$COVERAGE_BACKUP" ]; then
    cp "$COVERAGE_BACKUP" "$COVERAGE_REPORT"
    rm -f "$COVERAGE_BACKUP"
  fi
  # An interrupted baseline scan would otherwise leave its tree export behind.
  [ -n "$BASELINE_EXPORT" ] && rm -rf "$BASELINE_EXPORT"
  rm -f "$SCAN_LOG" "$TEST_LOG"
}
trap cleanup EXIT

# ---------------------------------------------------------------------------
# Coverage
# ---------------------------------------------------------------------------
# Generate a real coverage report so Sonar's new_coverage condition reflects
# actual measured coverage instead of reading 0% (no report = no data, not
# "no coverage"). Test failures are warned about, not blocking here —
# pre-existing/unrelated failures shouldn't stop the gate from seeing accurate
# coverage; the test suite itself is a separate concern from the Sonar gate.
# Nothing here is project-specific by default: the Python coverage target is
# read from this project's own sonar.sources, and any project that does not fit
# the auto-detection can override both the command and the report path in
# sonar.env (SONAR_COVERAGE_COMMAND / SONAR_COVERAGE_REPORT).
sonar_property() {
  local key="$1" file="$PROJECT_PATH/sonar-project.properties"
  [ -f "$file" ] || return 0
  grep -E "^[[:space:]]*${key}[[:space:]]*=" "$file" | head -1 | cut -d= -f2- | tr -d '\r' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//'
}

if [ -n "${SONAR_COVERAGE_COMMAND:-}" ]; then
  COVERAGE_REPORT="$PROJECT_PATH/${SONAR_COVERAGE_REPORT:-coverage.xml}"
  # Deliberately word-split: sonar.env carries this as a plain command string.
  # shellcheck disable=SC2206
  TEST_CMD=($SONAR_COVERAGE_COMMAND)
elif [ -x "$PROJECT_PATH/run_coverage.sh" ]; then
  COVERAGE_REPORT="$PROJECT_PATH/${SONAR_COVERAGE_REPORT:-coverage.xml}"
  TEST_CMD=(./run_coverage.sh)
elif [ -f "$PROJECT_PATH/pyproject.toml" ] || [ -f "$PROJECT_PATH/requirements.txt" ]; then
  PYTHON_BIN="$PROJECT_PATH/.venv/Scripts/python.exe"
  [ -x "$PYTHON_BIN" ] || PYTHON_BIN="$PROJECT_PATH/.venv/bin/python"
  [ -x "$PYTHON_BIN" ] || PYTHON_BIN="$PROJECT_PATH/venv/Scripts/python.exe"
  [ -x "$PYTHON_BIN" ] || PYTHON_BIN="$PROJECT_PATH/venv/bin/python"

  # --cov wants the package/dir under test; sonar.sources already names it, so
  # projects that use app/, lib/ or a nested path work without extra config.
  COV_TARGET="$(sonar_property 'sonar\.sources')"
  COV_TARGET="${COV_TARGET%%,*}"
  [ -n "$COV_TARGET" ] && [ "$COV_TARGET" != "." ] || COV_TARGET="."

  COVERAGE_REPORT="$PROJECT_PATH/${SONAR_COVERAGE_REPORT:-coverage.xml}"
  if [ -x "$PYTHON_BIN" ]; then
    TEST_CMD=("$PYTHON_BIN" -m pytest "--cov=$COV_TARGET" --cov-report=xml:coverage.xml -q)
  else
    TEST_CMD=(uv run pytest "--cov=$COV_TARGET" --cov-report=xml:coverage.xml -q)
  fi
elif [ -f "$PROJECT_PATH/package.json" ]; then
  COVERAGE_REPORT="$PROJECT_PATH/${SONAR_COVERAGE_REPORT:-coverage/lcov.info}"
  TEST_CMD=(npm run test:coverage)
else
  die "Could not detect how to produce coverage under $PROJECT_PATH (no pyproject.toml, requirements.txt, package.json, or run_coverage.sh). Set SONAR_COVERAGE_COMMAND and SONAR_COVERAGE_REPORT in scripts/sonar/sonar.env."
fi

if [ "$RUN_TESTS" = "1" ]; then
  log "Running tests with coverage..."
  if (cd "$PROJECT_PATH" && "${TEST_CMD[@]}" > "$TEST_LOG" 2>&1); then
    log "Tests passed."
  else
    log "WARNING: some tests failed — continuing so Sonar still gets real coverage data. Fix these separately:"
    tail -n 40 "$TEST_LOG"
  fi
else
  log "--skip-tests: reusing the existing coverage report."
fi

if [ ! -f "$COVERAGE_REPORT" ]; then
  tail -n 40 "$TEST_LOG"
  die "$COVERAGE_REPORT was not generated — aborting (a stale/missing coverage report would make the gate's coverage check meaningless)."
fi

# ---------------------------------------------------------------------------
# Scan
# ---------------------------------------------------------------------------
# Path handed to `docker -v` must be a Windows-style path on Git Bash/MSYS,
# and MSYS must be told not to rewrite the container-side /usr/src.
to_docker_path() {
  case "$(uname -s)" in
    MINGW*|MSYS*|CYGWIN*) cygpath -m "$1" ;;
    *)                    printf '%s' "$1" ;;
  esac
}

# Coverage reports record absolute paths from the machine that produced them
# (e.g. C:/XionTech/.../src in coverage.xml's <source>), which do not exist
# inside the scanner container — Sonar then silently drops every coverage
# measure. Point those paths at the bind mount for the duration of the scan.
rewrite_coverage_for_container() {
  [ -f "$COVERAGE_REPORT" ] || return 0
  COVERAGE_BACKUP="$(mktemp)"
  cp "$COVERAGE_REPORT" "$COVERAGE_BACKUP"
  python - "$COVERAGE_REPORT" "$PROJECT_PATH" "$(to_docker_path "$PROJECT_PATH")" <<'PY'
import pathlib, sys

BACKSLASH = chr(92)
MOUNT = "/usr/src"
# A path in the report ends at whatever quotes or brackets it; everything up to
# one of these belongs to the path.
DELIMS = set("\"'<>" + " \t\r\n")

report, msys_path, native_path = sys.argv[1], sys.argv[2], sys.argv[3]
path = pathlib.Path(report)
text = path.read_text(encoding="utf-8", errors="surrogateescape")

# Longest first so a shorter variant can't chew a prefix off a longer one.
variants = sorted(
    {native_path, native_path.replace("/", BACKSLASH), msys_path},
    key=len,
    reverse=True,
)
for variant in variants:
    text = text.replace(variant, MOUNT)

# coverage.py writes native separators, so what survives the prefix swap on
# Windows is "/usr/src\src" — one unsplittable name to the Linux scanner. Flip
# the separators on whatever hangs off the mount point.
out, i = [], 0
while True:
    start = text.find(MOUNT, i)
    if start < 0:
        out.append(text[i:])
        break
    out.append(text[i:start])
    end = start + len(MOUNT)
    while end < len(text) and text[end] not in DELIMS:
        end += 1
    out.append(text[start:end].replace(BACKSLASH, "/"))
    i = end
text = "".join(out)

path.write_text(text, encoding="utf-8", errors="surrogateescape")
PY
}

run_scanner_docker() {
  local scan_path="$1" scanner_url="$2"; shift 2
  # Reach the SonarQube container by name on the shared user-defined network;
  # "localhost" inside the scanner container is the scanner itself.
  local net_args=(--network "$SONAR_LOCAL_NETWORK")
  # On Linux/macOS the container has to run as the invoking user or it litters
  # the repo with root-owned files. That uid can't write the image's own
  # SONAR_USER_HOME, so the plugin cache goes to the container's /tmp (world
  # writable, discarded per run). On Windows there is no uid mismatch, so a
  # named volume seeded from the image keeps the cache warm between runs.
  local user_args=() cache_args=()
  case "$(uname -s)" in
    Linux|Darwin)
      user_args=(--user "$(id -u):$(id -g)")
      cache_args=(-e SONAR_USER_HOME=/tmp/.sonar)
      ;;
    *)
      cache_args=(-v sonar_scanner_cache:/opt/sonar-scanner/.sonar)
      ;;
  esac
  # SCANNER_WORKDIR_PATH: the image defaults it to /tmp/.scannerwork, i.e.
  # inside the container — report-task.txt would never reach the repo and the
  # gate would poll a stale one. Put it on the bind mount instead.
  MSYS_NO_PATHCONV=1 docker run --rm \
    "${net_args[@]}" \
    "${user_args[@]}" \
    "${cache_args[@]}" \
    -e SONAR_HOST_URL="$scanner_url" \
    -e SONAR_TOKEN="$API_TOKEN" \
    -e SCANNER_WORKDIR_PATH=/usr/src/.scannerwork \
    -v "$(to_docker_path "$scan_path"):/usr/src" \
    "$SONAR_SCANNER_IMAGE" \
    -Dsonar.host.url="$scanner_url" \
    -Dsonar.projectKey="$SONAR_PROJECT_KEY" \
    "$@"
}

SCANNER_URL="http://$SONAR_LOCAL_CONTAINER:9000"

# Runs the dockerised scanner against $1, forwarding any extra -D args.
run_scanner() {
  local scan_path="$1"; shift
  run_scanner_docker "$scan_path" "$SCANNER_URL" "$@"
}

# Polls the compute-engine task recorded in $1/.scannerwork/report-task.txt and
# echoes its analysisId. The poll URL is built from API_URL rather than the
# report's ceTaskUrl: with the dockerised scanner that URL is the
# container-network address, unreachable from the host.
wait_for_analysis() {
  local scan_path="$1" report="$1/.scannerwork/report-task.txt"
  local task_id json status
  [ -f "$report" ] || { log "report-task.txt not found at $report — the scan may not have completed."; return 1; }
  task_id="$(grep '^ceTaskId=' "$report" | cut -d= -f2- | tr -d '\r')"
  [ -n "$task_id" ] || { log "No ceTaskId in $report."; return 1; }
  for _ in $(seq 1 90); do
    json="$(curl -s -m 20 -u "$API_TOKEN:" "$API_URL/api/ce/task?id=$task_id")"
    status="$(echo "$json" | python -c "import sys, json; print(json.load(sys.stdin)['task']['status'])" 2>/dev/null || echo "")"
    case "$status" in
      SUCCESS)
        echo "$json" | python -c "import sys, json; print(json.load(sys.stdin)['task']['analysisId'])"
        return 0
        ;;
      FAILED|CANCELED)
        log "Background analysis task $status."
        return 1
        ;;
    esac
    sleep 2
  done
  # A 404/permission error looks identical to a slow task otherwise, and the two
  # need very different fixes.
  log "Timed out waiting for the analysis task. Last response from $API_URL/api/ce/task?id=$task_id:"
  echo "${json:0:500}"
  return 1
}

# ---------------------------------------------------------------------------
# New code period (local instance only)
# ---------------------------------------------------------------------------
# What counts as "new code" is what the Sonar way gate judges — every one of its
# conditions is a new-code metric. SonarQube derives it from git blame dates, so
# the period is always a point in time, never a branch diff.
#
# To make it mean "what this branch adds on top of $SONAR_LOCAL_REFERENCE_BRANCH",
# the local project is seeded with one analysis of the merge-base tree, backdated
# to the merge-base commit's own timestamp, and the period is pinned to it. Every
# commit made after the branch diverged is then newer than the period and counts.
#
# Without a reference branch the period falls back to a fixed day window, which
# on a freshly created local project resolves to the first analysis — meaning
# nothing already committed is ever "new". Prefer the reference branch.
set_new_code_days() {
  curl -s -o /dev/null -m 20 -u "$API_TOKEN:" -X POST "$API_URL/api/new_code_periods/set" \
    --data-urlencode "project=$SONAR_PROJECT_KEY" \
    --data-urlencode "type=NUMBER_OF_DAYS" \
    --data-urlencode "value=$SONAR_LOCAL_NEW_CODE_DAYS" || true
}

set_new_code_previous_version() {
  curl -s -o /dev/null -m 20 -u "$API_TOKEN:" -X POST "$API_URL/api/new_code_periods/set" \
    --data-urlencode "project=$SONAR_PROJECT_KEY" \
    --data-urlencode "type=PREVIOUS_VERSION" || true
}

baseline_matches() {
  local want="$1"
  curl -s -m 20 -u "$API_TOKEN:" "$API_URL/api/new_code_periods/list?project=$SONAR_PROJECT_KEY" \
    | python -c "
import sys, json
want = sys.argv[1]
try:
    periods = json.load(sys.stdin).get('newCodePeriods', [])
except Exception:
    sys.exit(1)
sys.exit(0 if any(p.get('type') == 'SPECIFIC_ANALYSIS' and p.get('value') == want for p in periods) else 1)
" "$want"
}

create_baseline() {
  local base="$1" refspec="$2" base_date export_dir analysis_id rel
  base_date="$(git -C "$REPO_ROOT" show -s --format=%cd --date=format:'%Y-%m-%dT%H:%M:%S%z' "$base")"
  log "Baselining the local project at the merge base with $refspec (${base:0:8}, $base_date)."
  log "This is one extra scan, cached until the merge base moves."

  # A backdated analysis has to be the project's oldest, so the local project is
  # recreated from scratch. Local data only.
  curl -s -o /dev/null -m 30 -u "$API_TOKEN:" -X POST "$API_URL/api/projects/delete" \
    --data-urlencode "project=$SONAR_PROJECT_KEY" || true
  curl -s -o /dev/null -m 30 -u "$API_TOKEN:" -X POST "$API_URL/api/projects/create" \
    --data-urlencode "project=$SONAR_PROJECT_KEY" \
    --data-urlencode "name=$SONAR_PROJECT_KEY" || true

  # A plain tree export, not a git worktree: a worktree's .git is a file holding
  # an absolute host path to the main repo, which does not resolve inside the
  # scanner container. The baseline only has to exist and carry the right date —
  # it needs no SCM history of its own.
  export_dir="$(mktemp -d)"
  if ! git -C "$REPO_ROOT" archive "$base" | tar -x -C "$export_dir" 2>"$SCAN_LOG"; then
    tail -n 10 "$SCAN_LOG"
    rm -rf "$export_dir"
    die "Could not export the merge-base tree at ${base:0:8}."
  fi
  BASELINE_EXPORT="$export_dir"

  rel="$SONAR_PROJECT_DIR"
  [ "$rel" = "." ] && rel=""
  local baseline_path="$export_dir${rel:+/$rel}"
  # The merge base may predate this gate, so it may not carry a usable
  # sonar-project.properties. Use the current one so both scans agree on
  # sources, tests and exclusions.
  cp "$PROJECT_PATH/sonar-project.properties" "$baseline_path/sonar-project.properties" 2>/dev/null || true

  # The merge base may also predate the source/test folders those properties
  # name (e.g. the first PR that adds src/). The scanner rejects a missing
  # folder, so create empty ones: an empty baseline is the correct answer there,
  # and every line on this branch then counts as new code.
  local dir
  for dir in $(printf '%s,%s' "$(sonar_property 'sonar\.sources')" "$(sonar_property 'sonar\.tests')" | tr ',' ' '); do
    mkdir -p "$baseline_path/$dir"
  done

  if run_scanner "$baseline_path" \
       -Dsonar.projectDate="$base_date" \
       -Dsonar.projectVersion="baseline-${base:0:8}" \
       -Dsonar.python.coverage.reportPaths= \
       -Dsonar.javascript.lcov.reportPaths= > "$SCAN_LOG" 2>&1 \
     && analysis_id="$(wait_for_analysis "$baseline_path")" && [ -n "$analysis_id" ]; then
    curl -s -o /dev/null -m 20 -u "$API_TOKEN:" -X POST "$API_URL/api/new_code_periods/set" \
      --data-urlencode "project=$SONAR_PROJECT_KEY" \
      --data-urlencode "type=SPECIFIC_ANALYSIS" \
      --data-urlencode "value=$analysis_id"
    printf 'SONAR_BASELINE_SHA=%s\nSONAR_BASELINE_ANALYSIS_ID=%s\nSONAR_BASELINE_REF=%s\n' \
      "$base" "$analysis_id" "$refspec" > "$BASELINE_FILE"
    log "Baseline set — new code is now everything this branch adds on top of $refspec."
  else
    tail -n 20 "$SCAN_LOG"
    rm -f "$BASELINE_FILE"
    rm -rf "$export_dir"
    BASELINE_EXPORT=""
    die "The baseline scan failed, so new code cannot be measured against $refspec. Fix the error above, or set SONAR_LOCAL_NEW_CODE_MODE=days in scripts/sonar/sonar.env to fall back deliberately."
  fi

  rm -rf "$export_dir"
  BASELINE_EXPORT=""
}

configure_local_new_code() {
  case "$SONAR_LOCAL_NEW_CODE_MODE" in
    previous_version)
      # New code is whatever changed since the previous analysis carrying a different
      # sonar.projectVersion. Locally the version is the HEAD commit (see
      # local_project_version), so the window is "since the last gate run on a
      # different commit". The first run on a fresh local project has no
      # previous version, so the whole codebase is judged at once — that is the
      # intended behaviour.
      set_new_code_previous_version
      log "New code = changes since the previous local gate run (PREVIOUS_VERSION)."
      return 0
      ;;
    reference_branch) ;;  # handled below
    days)
      set_new_code_days
      log "New code = the last $SONAR_LOCAL_NEW_CODE_DAYS days."
      return 0
      ;;
    *)
      log "WARNING: unknown SONAR_LOCAL_NEW_CODE_MODE '$SONAR_LOCAL_NEW_CODE_MODE' — using previous_version."
      set_new_code_previous_version
      return 0
      ;;
  esac

  # Resolved and validated before the test suite ran (resolve_reference_base).
  local refspec="$REF_SPEC" base="$MERGE_BASE"

  if [ -f "$BASELINE_FILE" ]; then
    # shellcheck disable=SC1090
    . "$BASELINE_FILE"
    if [ "${SONAR_BASELINE_SHA:-}" = "$base" ] && [ -n "${SONAR_BASELINE_ANALYSIS_ID:-}" ] \
       && baseline_matches "$SONAR_BASELINE_ANALYSIS_ID"; then
      log "New code = this branch vs $refspec (baseline ${base:0:8}, cached)."
      return 0
    fi
  fi

  create_baseline "$base" "$refspec"
}

configure_local_new_code

# A leftover report-task.txt from an earlier run must never be mistaken for
# this scan's — it would point the poller at a task on the wrong server.
REPORT_FILE="$PROJECT_PATH/.scannerwork/report-task.txt"
rm -f "$REPORT_FILE"

log "Scanning $SONAR_PROJECT_DIR with $SONAR_SCANNER_IMAGE -> $SCANNER_URL ..."
rewrite_coverage_for_container

SCAN_OK=0
run_scanner "$PROJECT_PATH" > "$SCAN_LOG" 2>&1 && SCAN_OK=1

if [ "$SCAN_OK" != "1" ]; then
  echo "[sonar-gate] sonar-scanner failed:"
  tail -n 40 "$SCAN_LOG"
  exit 1
fi

# Tripwire. A project's sonar-project.properties may carry its own
# sonar.host.url; the command line overrides it, but if that ever stops being
# true a scan could publish to a remote server. Check where the analysis
# actually went.
if [ -f "$REPORT_FILE" ]; then
  PUBLISHED_TO="$(grep '^serverUrl=' "$REPORT_FILE" | cut -d= -f2- | tr -d '\r' || true)"
  if [ "$PUBLISHED_TO" != "$SCANNER_URL" ] && ! [[ "$PUBLISHED_TO" =~ $LOCAL_URL_RE ]]; then
    die "The scan published to '$PUBLISHED_TO' instead of the local container. Check for a sonar.host.url in $SONAR_PROJECT_DIR/sonar-project.properties. If it points at a remote server, tell the team lead: this project must never publish there."
  fi
fi

# ---------------------------------------------------------------------------
# Quality Gate
# ---------------------------------------------------------------------------
log "Waiting for the background analysis task..."
ANALYSIS_ID="$(wait_for_analysis "$PROJECT_PATH")" || {
  tail -n 20 "$SCAN_LOG"
  exit 1
}
[ -n "$ANALYSIS_ID" ] || die "The analysis finished without returning an analysisId."

GATE_JSON="$(curl -s -m 20 -u "$API_TOKEN:" "$API_URL/api/qualitygates/project_status?analysisId=$ANALYSIS_ID")"
GATE_STATUS="$(echo "$GATE_JSON" | python -c "import sys, json; print(json.load(sys.stdin)['projectStatus']['status'])")"

DASHBOARD="$API_URL/dashboard?id=$SONAR_PROJECT_KEY"

if [ "$GATE_STATUS" != "OK" ]; then
  # Coverage conditions are reported but never block the push — writing tests to hit
  # an arbitrary coverage % is a separate, slower effort than the Maintainability/
  # Reliability/Security/Duplication findings this gate exists to catch immediately.
  # Everything else (bugs, vulnerabilities, code smells, hotspots, duplication) still blocks.
  BLOCKING_FAILURES="$(echo "$GATE_JSON" | python -c "
import sys, json
data = json.load(sys.stdin)['projectStatus']
non_ok = [c for c in data.get('conditions', []) if c.get('status') != 'OK']
blocking = [c for c in non_ok if 'coverage' not in c.get('metricKey', '')]
warned = [c for c in non_ok if 'coverage' in c.get('metricKey', '')]
for c in warned:
    print(f\"WARN  {c.get('metricKey', '?')}: actual={c.get('actualValue')} (threshold {c.get('comparator')} {c.get('errorThreshold')})\")
for c in blocking:
    print(f\"BLOCK {c.get('metricKey', '?')}: actual={c.get('actualValue')} (threshold {c.get('comparator')} {c.get('errorThreshold')})\")
if not blocking and not warned:
    # Gate status is non-OK but the API gave no per-condition detail to explain
    # why (e.g. empty/missing conditions array) — don't assume it was coverage,
    # fail safe instead of silently passing a red gate.
    print('BLOCK unknown: Quality Gate status is non-OK but no per-condition detail was returned')
")"
  echo "$BLOCKING_FAILURES"

  if echo "$BLOCKING_FAILURES" | grep -q '^BLOCK'; then
    log "Push blocked (local gate). Fix the BLOCK conditions above — details: $DASHBOARD"
    exit 1
  fi

  log "Quality Gate failed only on coverage — not blocking. Fix WARN conditions separately. Details: $DASHBOARD"
  exit 0
fi

log "Quality Gate passed (local). Details: $DASHBOARD"
exit 0
