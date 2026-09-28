#!/usr/bin/env node
// C1 gate: branch coverage must be >= 80% for every source file changed against
// the base branch. diff-cover only checks changed lines (C0); this checks the
// branches of each changed file, read from the Vitest Cobertura report.
//
// Usage: node scripts/coverage-branches.mjs [base-ref]   (default origin/develop)
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

export const MIN_BRANCH_RATE = 0.8;
const REPORT = "coverage/cobertura-coverage.xml";

/** Map of repo-relative file path (forward slashes) -> branch rate (0..1). */
export function parseBranchRates(xml) {
  const rates = new Map();
  for (const [tag] of xml.matchAll(/<class\b[^>]*>/g)) {
    const file = /\bfilename="([^"]+)"/.exec(tag)?.[1];
    const rate = /\bbranch-rate="([^"]+)"/.exec(tag)?.[1];
    if (file !== undefined && rate !== undefined) {
      rates.set(file.replaceAll("\\", "/"), Number(rate));
    }
  }
  return rates;
}

/** Changed files that are in the report and below the minimum branch rate. */
export function findFailures(rates, changedFiles, min = MIN_BRANCH_RATE) {
  return changedFiles
    .filter((file) => rates.has(file) && rates.get(file) < min)
    .map((file) => ({ file, rate: rates.get(file) }));
}

function git(...args) {
  return execFileSync("git", args, { encoding: "utf8" })
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function main() {
  const base = process.argv[2] ?? "origin/develop";
  // Committed, staged and unstaged changes vs the base, plus new untracked files.
  const changed = [
    ...git("diff", "--name-only", base),
    ...git("ls-files", "--others", "--exclude-standard"),
  ];
  const rates = parseBranchRates(readFileSync(REPORT, "utf8"));
  const failures = findFailures(rates, changed);

  if (failures.length > 0) {
    for (const { file, rate } of failures) {
      console.error(
        `C1 FAIL ${file}: branch coverage ${(rate * 100).toFixed(1)}% < 80%`,
      );
    }
    process.exit(1);
  }
  const checked = changed.filter((file) => rates.has(file)).length;
  console.log(
    `C1 ok: ${checked} changed file(s) with branch coverage >= 80% vs ${base}.`,
  );
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
