import { expect, test } from "@playwright/test";

test(
  "unknown job slug answers 404 with the Not found page",
  { tag: "@smoke" },
  async ({ request }) => {
    const response = await request.get("/careers/no-such-role");
    const html = await response.text();

    expect(response.status()).toBe(404);
    expect(html).toContain("You’ve wandered off the trail.");
  },
);

test(
  "apply route answers 200 to a filled honeypot without any secrets",
  { tag: "@smoke" },
  async ({ request }) => {
    const response = await request.post("/api/careers/apply", {
      data: { slug: "any", website: "https://spam.example" },
    });

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
  },
);
