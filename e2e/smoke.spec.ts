import { expect, test } from "@playwright/test";

test(
  "home page responds 200 with the site name",
  { tag: "@smoke" },
  async ({ request }) => {
    const response = await request.get("/en");

    expect(response.status()).toBe(200);
    expect(await response.text()).toContain("XionTech");
    // E-A1: the X-mark icons come from the app/ metadata file convention.
    const html = await response.text();
    expect(html).toMatch(/<link rel="icon" href="\/icon\.png[^"]*"/);
    expect(html).toMatch(
      /<link rel="apple-touch-icon" href="\/apple-icon\.png[^"]*"/,
    );
    expect(html).not.toContain("favicon.ico");
    // E-A4: the last Home section is the contact form.
    expect(html).toContain('id="contact"');
    expect(html).toContain("Have something you want to build?");
  },
);

test("/demo redirects home", { tag: "@smoke" }, async ({ request }) => {
  for (const path of ["/demo", "/en/demo", "/vi/demo"]) {
    const response = await request.get(path, { maxRedirects: 0 });
    expect([307, 308]).toContain(response.status());
  }
});

test(
  "contact route answers 200 to a filled honeypot without any secrets",
  { tag: "@smoke" },
  async ({ request }) => {
    const response = await request.post("/api/contact", {
      data: { type: "demo", website: "https://spam.example" },
    });

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
  },
);

test(
  "bare path redirects to a locale and /en answers 200",
  { tag: "@smoke" },
  async ({ request }) => {
    const bare = await request.get("/", { maxRedirects: 0 });

    expect(bare.status()).toBe(307);
    expect(bare.headers().location).toMatch(/\/en$/);
    expect((await request.get("/en")).status()).toBe(200);
  },
);

test(
  "removed languages redirect to English, path and query kept",
  { tag: "@smoke" },
  async ({ request }) => {
    // ja, fr, ko and zh were removed on 2026-10-15 (lead).
    const response = await request.get("/ja/products?x=1", {
      maxRedirects: 0,
    });
    expect(response.status()).toBe(308);
    expect(response.headers().location).toMatch(/\/en\/products\?x=1$/);
  },
);
