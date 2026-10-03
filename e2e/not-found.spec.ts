import { expect, test } from "@playwright/test";

test(
  "unknown path answers 404 with the Not found copy and no capture band",
  { tag: "@smoke" },
  async ({ request }) => {
    const response = await request.get("/does-not-exist");
    const html = await response.text();

    expect(response.status()).toBe(404);
    expect(html).toContain("that page");
    expect(html).toContain("Go to Home");
    expect(html).not.toContain("See it working at your school.");
  },
);
