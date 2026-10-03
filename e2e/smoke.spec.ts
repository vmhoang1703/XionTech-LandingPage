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
