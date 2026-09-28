import { describe, expect, it } from "vitest";
import { findFailures, parseBranchRates } from "./coverage-branches.mjs";

const XML = `<coverage>
  <class name="page.tsx" filename="src\\app\\page.tsx" line-rate="1" branch-rate="1"></class>
  <class branch-rate="0.5" name="form.tsx" filename="src/app/form.tsx" line-rate="1"></class>
  <class name="edge.ts" filename="src/lib/edge.ts" branch-rate="0.8"></class>
  <class name="broken.ts" line-rate="1"></class>
</coverage>`;

describe("parseBranchRates", () => {
  it("reads every class with forward-slash paths, in any attribute order", () => {
    const rates = parseBranchRates(XML);

    expect(rates).toEqual(
      new Map([
        ["src/app/page.tsx", 1],
        ["src/app/form.tsx", 0.5],
        ["src/lib/edge.ts", 0.8],
      ]),
    );
  });
});

describe("findFailures", () => {
  const rates = parseBranchRates(XML);

  it("reports only changed files below 80%", () => {
    expect(
      findFailures(rates, ["src/app/form.tsx", "src/app/page.tsx"]),
    ).toEqual([{ file: "src/app/form.tsx", rate: 0.5 }]);
  });

  it("passes a file exactly at 80%", () => {
    expect(findFailures(rates, ["src/lib/edge.ts"])).toEqual([]);
  });

  it("ignores changed files that are not in the report", () => {
    expect(findFailures(rates, ["README.md", "src/app/form.test.tsx"])).toEqual(
      [],
    );
  });
});
