import { expect, test } from "@playwright/test";

test(
  "home page responds 200 with the site name",
  { tag: "@smoke" },
  async ({ request }) => {
    const response = await request.get("/");

    expect(response.status()).toBe(200);
    expect(await response.text()).toContain("XionTech");
  },
);

test(
  "demo page responds 200 with send request button",
  { tag: "@smoke" },
  async ({ request }) => {
    const response = await request.get("/demo");

    expect(response.status()).toBe(200);
    expect(await response.text()).toContain("Send request");
  },
);
