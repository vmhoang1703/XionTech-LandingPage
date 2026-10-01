// @vitest-environment node
// scripts/sonar-gate-full.sh must only hand develop, exactly as on origin and
// with no local edits, to the gate, with main as the reference branch. Each
// case runs it in a throwaway repo whose scripts/sonar/check_quality_gate.sh is
// a stub that prints what it was given.
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const SCRIPT = resolve(import.meta.dirname, "sonar-gate-full.sh");
const STUB = 'echo "GATE ref=$SONAR_LOCAL_REFERENCE_BRANCH args=$*"\n';

// git is slow to start on Windows; the default 5 s is not enough.
const TIMEOUT = 30_000;

let root;
let work;
let env;

function git(...args) {
  return execFileSync("git", args, { cwd: work, encoding: "utf8", env });
}

function runFull(...args) {
  const result = spawnSync("bash", [SCRIPT, ...args], {
    cwd: work,
    encoding: "utf8",
    env,
  });
  return { code: result.status, out: result.stdout + result.stderr };
}

beforeAll(() => {
  root = mkdtempSync(join(tmpdir(), "sonar-gate-full-"));
  // Ignore the user's own git config (autocrlf, signing, hooks).
  writeFileSync(join(root, "gitconfig"), "");
  env = {
    ...process.env,
    GIT_CONFIG_GLOBAL: join(root, "gitconfig"),
    GIT_CONFIG_NOSYSTEM: "1",
  };
  work = join(root, "work");
  const remote = join(root, "remote.git");
  execFileSync("git", ["init", "-q", "--bare", remote], { env });
  execFileSync("git", ["init", "-q", "-b", "main", work], { env });
  git("config", "user.name", "test");
  git("config", "user.email", "test@example.invalid");
  git("remote", "add", "origin", remote);
  mkdirSync(join(work, "scripts", "sonar"), { recursive: true });
  writeFileSync(join(work, "scripts", "sonar", "check_quality_gate.sh"), STUB);
  git("add", ".");
  git("commit", "-q", "-m", "chore: init");
  git("push", "-q", "-u", "origin", "main");
  git("switch", "-q", "-c", "develop");
  git("commit", "-q", "--allow-empty", "-m", "feat: work");
  git("push", "-q", "-u", "origin", "develop");
}, TIMEOUT);

afterAll(() => {
  rmSync(root, { recursive: true, force: true });
});

describe("sonar-gate-full.sh", () => {
  it(
    "refuses any branch but develop",
    () => {
      git("switch", "-q", "-c", "feature/x");
      const { code, out } = runFull();
      git("switch", "-q", "develop");
      expect(code).toBe(1);
      expect(out).toContain("Check out develop first (now on 'feature/x')");
    },
    TIMEOUT,
  );

  it(
    "refuses a develop that differs from origin/develop",
    () => {
      git("commit", "-q", "--allow-empty", "-m", "feat: not pushed");
      const { code, out } = runFull();
      git("reset", "-q", "--hard", "origin/develop");
      expect(code).toBe(1);
      expect(out).toContain("develop is not the same as origin/develop");
    },
    TIMEOUT,
  );

  it(
    "refuses local changes",
    () => {
      writeFileSync(join(work, "draft.ts"), "export {};\n");
      const { code, out } = runFull();
      rmSync(join(work, "draft.ts"));
      expect(code).toBe(1);
      expect(out).toContain("The working tree has local changes");
    },
    TIMEOUT,
  );

  it(
    "runs the gate against main and passes extra arguments on",
    () => {
      const { code, out } = runFull("--skip-tests");
      expect(code).toBe(0);
      expect(out).toContain("GATE ref=main args=--skip-tests");
    },
    TIMEOUT,
  );
});
