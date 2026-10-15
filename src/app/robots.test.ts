import { describe, expect, it } from "vitest";
import robots from "./robots";

describe("robots.txt", () => {
  it("allows every crawler and points at the sitemap", () => {
    expect(robots()).toEqual({
      rules: { userAgent: "*", allow: "/" },
      sitemap: "https://xiontech-hoangvu-dev.vercel.app/sitemap.xml",
    });
  });
});
