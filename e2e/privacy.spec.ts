import { expect, test } from "@playwright/test";

test(
  "privacy page responds 200 with its H1 and no capture band",
  { tag: "@smoke" },
  async ({ request }) => {
    const response = await request.get("/en/privacy");
    const html = await response.text();

    expect(response.status()).toBe(200);
    expect(html).toContain("Privacy policy.");
    expect(html).toContain("[Placeholder]");
    expect(html).not.toContain("<form");
  },
);
