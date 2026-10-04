// @vitest-environment node
import { describe, expect, it } from "vitest";
import { describeError, readBody } from "./route-helpers";

describe("readBody", () => {
  it("parses a JSON body", async () => {
    const request = new Request("https://site.test", {
      method: "POST",
      body: JSON.stringify({ a: 1 }),
    });
    expect(await readBody(request)).toEqual({ a: 1 });
  });

  it("returns undefined for a body that is not JSON", async () => {
    const request = new Request("https://site.test", {
      method: "POST",
      body: "{nope",
    });
    expect(await readBody(request)).toBeUndefined();
  });
});

describe("describeError", () => {
  it("names the class and the string code", () => {
    const error = Object.assign(new TypeError("private"), { code: "EAUTH" });
    expect(describeError(error)).toBe("TypeError EAUTH");
  });

  it("names the class when the code is not a string", () => {
    const error = Object.assign(new Error("x"), { code: 5 });
    expect(describeError(error)).toBe("Error");
  });

  it("names the class when there is no code", () => {
    expect(describeError(new RangeError("x"))).toBe("RangeError");
  });

  it("says unknown for a value that is not an Error", () => {
    expect(describeError("text")).toBe("unknown");
  });
});
