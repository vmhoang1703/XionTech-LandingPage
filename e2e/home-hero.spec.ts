import { expect, test } from "@playwright/test";

test(
  "home page serves the hero headline and CTA without JavaScript",
  { tag: "@smoke" },
  async ({ request }) => {
    const response = await request.get("/");
    const html = await response.text();

    expect(response.status()).toBe(200);
    expect(html).toContain("connected");
    expect(html).toContain("Explore our products");
  },
);
