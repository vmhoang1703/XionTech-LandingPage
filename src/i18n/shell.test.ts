import { describe, expect, it } from "vitest";
import { SHELL } from "./shell";

function keyPaths(value: unknown, prefix = ""): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item, i) => keyPaths(item, `${prefix}[${i}]`));
  }
  if (value !== null && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) =>
      keyPaths(v, prefix ? `${prefix}.${k}` : k),
    );
  }
  return [prefix];
}

describe("shell dictionaries", () => {
  it("has the same keys in en and vi", () => {
    expect(keyPaths(SHELL.vi)).toEqual(keyPaths(SHELL.en));
  });

  it("keeps product and service names identical in en and vi", () => {
    expect(SHELL.vi.names).toEqual(SHELL.en.names);
  });
});
