// @vitest-environment node
// Until Demo day `npm run lint` stands in for the per-push SonarQube gate, so
// these tests pin what the SonarQube part of eslint.config.mjs must catch: the
// three kinds of finding that blocked the Story 1.1 push.
import { ESLint } from "eslint";
import { describe, expect, it } from "vitest";

const SAMPLE = `export function probe(line: string): number {
  const re = /#([0-9a-fA-F]{6})/i;
  const m = line.match(re);
  return m ? parseInt(m[1], 16) : 0;
}
`;

// Typed linting needs a path the TypeScript project knows, so the sample is
// linted under the name of real files (their content on disk is not read).
async function ruleIds(filePath) {
  const [result] = await new ESLint().lintText(SAMPLE, { filePath });
  return result.messages.map((message) => message.ruleId);
}

describe("eslint config: SonarQube rules", () => {
  it("reports the three Story 1.1 finding kinds in source files", async () => {
    const ids = await ruleIds("src/lib/design/contrast.ts");
    expect(ids).toEqual(
      expect.arrayContaining([
        "sonarjs/duplicates-in-character-class", // S5869
        "sonarjs/prefer-regexp-exec", // S6594, needs type information
        "no-restricted-globals", // S7773
      ]),
    );
  }, 120_000);

  it("leaves test files to the gate's test-scope rules", async () => {
    const ids = await ruleIds("src/lib/design/contrast.test.ts");
    expect(ids).not.toContain("sonarjs/prefer-regexp-exec");
    expect(ids).not.toContain("sonarjs/duplicates-in-character-class");
    expect(ids).not.toContain("no-restricted-globals");
  }, 120_000);

  it("keeps eslint-config-next's React version detection", async () => {
    const config = await new ESLint().calculateConfigForFile(
      "src/app/page.tsx",
    );
    expect(config.settings.react.version).toBe("detect");
  }, 60_000);
});
