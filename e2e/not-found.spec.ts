import { expect, test } from "@playwright/test";

test(
  "unknown path answers 404 with the lost-trail copy and no capture band",
  { tag: "@smoke" },
  async ({ request }) => {
    const response = await request.get("/en/does-not-exist");
    const html = await response.text();

    expect(response.status()).toBe(404);
    expect(html).toContain("You’ve wandered off the trail.");
    expect(html).toContain("You are here");
    expect(html).not.toContain(">404<");
    expect(html).toContain("Go to Home");
    expect(html).not.toContain("See it working at your school.");
  },
);
