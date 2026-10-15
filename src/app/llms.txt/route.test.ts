import { describe, expect, it } from "vitest";
import { llmsTxt } from "@/lib/seo/llms-txt";
import { GET } from "./route";

describe("/llms.txt", () => {
  it("serves Markdown with the brand, summary and key page links", async () => {
    const response = GET();
    expect(response.headers.get("content-type")).toContain("text/markdown");
    const body = await response.text();
    expect(body.startsWith("# XionTech\n")).toBe(true);
    expect(body).toContain("Parent Hub, Staff Hub and AI Tutor");
    for (const path of [
      "",
      "/services",
      "/products",
      "/about",
      "/news",
      "/careers",
      "/privacy",
      "#contact",
    ]) {
      expect(body).toContain(
        `(https://xiontech-hoangvu-dev.vercel.app/en${path})`,
      );
    }
  });

  it("uses the origin it is given", () => {
    expect(llmsTxt("https://example.test")).toContain(
      "(https://example.test/en/services)",
    );
  });
});
