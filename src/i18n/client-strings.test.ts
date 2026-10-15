import { describe, expect, it } from "vitest";
import { clientStrings } from "./client-strings";

describe("clientStrings", () => {
  it("sends nothing for en and vi, whose twins are in the client bundle", () => {
    expect(clientStrings("en")).toBeUndefined();
    expect(clientStrings("vi")).toBeUndefined();
  });
});
