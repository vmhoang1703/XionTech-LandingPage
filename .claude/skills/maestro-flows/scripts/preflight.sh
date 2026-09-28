#!/usr/bin/env bash
# Answer, before authoring anything, whether a device run is possible at all --
# and if not, which of .maestro/README.md's Setup steps is the one that failed.
# Read-only: installs nothing, starts no run, touches no device state.
#
#   preflight.sh [--maestro-root pxp_mobile/.maestro] [--app-id com.gems.ai.dev]
#
# Exit 0 = a run can proceed. Exit 1 = it cannot; the FAIL lines say why.

set -uo pipefail

MAESTRO_ROOT="pxp_mobile/.maestro"
APP_ID="com.gems.ai.dev"
while [[ $# -gt 0 ]]; do
  case "$1" in
    --maestro-root) MAESTRO_ROOT="$2"; shift 2 ;;
    --app-id) APP_ID="$2"; shift 2 ;;
    -h|--help) sed -n '2,9p' "$0"; exit 0 ;;
    *) echo "unknown argument: $1" >&2; exit 2 ;;
  esac
done

fails=0
ok()   { printf 'OK    %s\n' "$*"; }
fail() { printf 'FAIL  %s\n' "$*"; fails=$((fails + 1)); }
warn() { printf 'WARN  %s\n' "$*"; }

[[ -x "$MAESTRO_ROOT/run.sh" ]] \
  && ok "run.sh present at $MAESTRO_ROOT" \
  || fail "no executable $MAESTRO_ROOT/run.sh -- wrong --maestro-root?"

# Everything below checks the environment this script is running in, and no
# other. A handset reachable from somewhere else is not reachable from here, and
# each host writes its own `~/.maestro/tests` that `collect-evidence.py` will not
# find from here -- so "ready elsewhere" is the one answer that helps nobody.
# `device_ok` gates every later check that needs to TALK to the handset. Without
# it the driver-package check below runs on an empty `adb shell` result and
# reports a reassuring "driver absent ... Not a hang" about a device it never
# reached.
device_ok=0

if ! command -v adb >/dev/null 2>&1; then
  fail "adb not on PATH -- README Setup step 1 (Tooling)"
else
  ok "adb present"
  devices="$(adb devices 2>/dev/null | tr -d '\r' | awk 'NR>1 && NF {print $1, $2}')"
  if [[ -z "$devices" ]]; then
    fail "no device in 'adb devices' -- README Setup step 2 (Device access)"
    if command -v usbipd.exe >/dev/null 2>&1; then
      warn "usbipd.exe is here: if the handset is plugged into Windows it may just"
      warn "  not be attached to WSL. 'usbipd.exe list' shows the busid; Shared but"
      warn "  not Attached means Windows has it and WSL does not. Attach it with"
      warn "  'usbipd.exe attach --wsl --busid <busid>'."
      warn "  A device that keeps detaching mid-run re-enumerates faster than usbip"
      warn "  survives: 'adb tcpip 5555' then 'adb connect <phone-ip>:5555' is the"
      warn "  stable path, and adb reverse tunnels still work over it."
    fi
  elif grep -q 'unauthorized' <<<"$devices"; then
    fail "device unauthorized -- accept the RSA prompt on the handset"
  elif grep -q 'offline' <<<"$devices"; then
    fail "device is offline: $devices"
    warn "  a wireless device goes offline when the phone sleeps or changes network."
    warn "  Reconnect with 'adb connect <phone-ip>:5555'; over usbipd, re-attach."
    warn "  adb reverse tunnels do NOT survive this -- re-add them after reconnecting."
  elif grep -q 'no permissions' <<<"$devices"; then
    fail "no permissions for the device: $devices"
    warn "  a udev rule is missing, or another adb server holds it. 'adb kill-server'"
    warn "  then re-run; on Linux see the udev rules in README Setup step 2."
  else
    ok "device: $devices"
    device_ok=1
    if adb shell pm list packages 2>/dev/null | grep -q "$APP_ID"; then
      ok "$APP_ID installed"
    else
      fail "$APP_ID not installed -- README Setup step 3 (debug build)"
    fi
  fi
fi

# maestro is a JVM launcher, so being on PATH proves nothing on its own: with no
# JDK it exits on "JAVA_HOME is not set" while looking perfectly healthy to
# `command -v`. Ask it for its version, the cheapest call that starts the JVM.
if command -v maestro >/dev/null 2>&1 &&
   version="$(maestro --version 2>/dev/null | tail -1)" && [[ -n "$version" ]]; then
  ok "maestro $version"
elif command -v maestro >/dev/null 2>&1; then
  fail "maestro is on PATH but cannot start -- no JVM here"
  warn "  it exits with 'JAVA_HOME is not set' -- install a JDK (openjdk 21 works)."
else
  fail "maestro not on PATH -- README Setup step 1 (Tooling)"
fi

# A missing driver is not a failure: Maestro installs it. It is a warning
# because that install is the slow, silent leg -- minutes with no output.
#
# Both packages must be checked, and matched exactly. `dev.mobile.maestro` is a
# prefix of `dev.mobile.maestro.test`, so a substring grep reports a healthy
# driver when only the test package survives -- which is precisely the wedged
# half-installed state left behind by a run killed during a driver install, and
# the state this check exists to catch. Observed 2026-08-26.
pkgs=""
[[ "$device_ok" == 1 ]] && \
  pkgs="$(adb shell pm list packages 2>/dev/null | sed 's/^package://' | tr -d '\r')"
has_pkg() { printf '%s\n' "$pkgs" | grep -qx "$1"; }

if [[ "$device_ok" != 1 ]]; then
  warn "driver state unknown -- no reachable device to ask"
elif has_pkg dev.mobile.maestro && has_pkg dev.mobile.maestro.test; then
  ok "maestro driver present (both packages) -- runs start in seconds"
elif has_pkg dev.mobile.maestro || has_pkg dev.mobile.maestro.test; then
  fail "maestro driver is HALF-INSTALLED — runs hang. Recover with: REINSTALL_DRIVER=1 ./.maestro/run.sh <flow>"
else
  warn "maestro driver absent; the first run pays the silent APK push (minutes). Not a hang."
fi

[[ -n "${MAESTRO_DRIVER_STARTUP_TIMEOUT:-}" ]] \
  && ok "MAESTRO_DRIVER_STARTUP_TIMEOUT=$MAESTRO_DRIVER_STARTUP_TIMEOUT" \
  || warn "MAESTRO_DRIVER_STARTUP_TIMEOUT unset -- run.sh exports 240000; never invoke maestro test directly"

if [[ $fails -gt 0 ]]; then
  echo
  echo "$fails blocker(s). Authoring and 'maestro check-syntax' still work offline;"
  echo "a device run does not. Do not report unrun flows as coverage."
  exit 1
fi
echo
echo "Device run can proceed."
