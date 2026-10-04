import { expect, test } from "@playwright/test";

test(
  "careers page responds 200 with its H1, the open roles and the life sections",
  { tag: "@smoke" },
  async ({ request }) => {
    const response = await request.get("/careers");
    const html = await response.text();

    expect(response.status()).toBe(200);
    expect(html).toContain("Build what schools use");
    expect(html).toContain('id="roles"');
    expect(html).toContain('id="life"');
  },
);
