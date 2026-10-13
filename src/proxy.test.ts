// @vitest-environment node
import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { config, proxy } from "@/proxy";

function run(path: string, headers: Record<string, string> = {}) {
  return proxy(new NextRequest(`http://localhost:3000${path}`, { headers }));
}

describe("proxy", () => {
  it("redirects / to /vi for Accept-Language vi-VN", () => {
    const res = run("/", { "accept-language": "vi-VN,vi;q=0.9,en;q=0.5" });
    expect(res.status).toBe(307);
    expect(new URL(res.headers.get("location") ?? "").pathname).toBe("/vi");
  });

  it("falls back to /en for an unparseable header", () => {
    const res = run("/", { "accept-language": ";;;" });
    expect(new URL(res.headers.get("location") ?? "").pathname).toBe("/en");
  });

  it("falls back to /en without a header or match", () => {
    expect(new URL(run("/").headers.get("location") ?? "").pathname).toBe(
      "/en",
    );
    const fr = run("/", { "accept-language": "fr-FR,de;q=0.8" });
    expect(new URL(fr.headers.get("location") ?? "").pathname).toBe("/en");
  });

  it("skips a language refused with q=0", () => {
    const res = run("/", { "accept-language": "vi;q=0, en" });
    expect(new URL(res.headers.get("location") ?? "").pathname).toBe("/en");
  });

  it("does not pick a language with an unparseable q", () => {
    const res = run("/", { "accept-language": "vi;q=abc" });
    expect(new URL(res.headers.get("location") ?? "").pathname).toBe("/en");
  });

  it("uses the cookie over Accept-Language and keeps the query", () => {
    const res = run("/products?a=1", {
      cookie: "locale=vi",
      "accept-language": "en",
    });
    expect(res.status).toBe(307);
    const url = new URL(res.headers.get("location") ?? "");
    expect(url.pathname).toBe("/vi/products");
    expect(url.search).toBe("?a=1");
  });

  it("ignores an invalid cookie", () => {
    const res = run("/about", { cookie: "locale=fr" });
    expect(new URL(res.headers.get("location") ?? "").pathname).toBe(
      "/en/about",
    );
  });

  it("does not redirect paths that already have a locale", () => {
    const res = run("/en/products", { cookie: "locale=vi" });
    expect(res.status).toBe(200);
    expect(res.headers.get("location")).toBeNull();
  });

  it("leaves an unknown locale to the 404 page", () => {
    const res = run("/fr/products");
    expect(res.headers.get("location")).toBeNull();
  });

  it("matcher excludes api, _next and files with an extension", () => {
    const re = new RegExp(`^${config.matcher[0]}$`);
    expect(re.test("/products")).toBe(true);
    expect(re.test("/")).toBe(true);
    expect(re.test("/api/contact")).toBe(false);
    expect(re.test("/_next/static/a.js")).toBe(false);
    expect(re.test("/icon.png")).toBe(false);
    expect(re.test("/api")).toBe(false);
    expect(re.test("/api/x")).toBe(false);
    expect(re.test("/api-docs")).toBe(true);
    expect(re.test("/_nextish")).toBe(true);
  });
});
