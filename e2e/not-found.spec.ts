import { expect, test } from "@playwright/test";

test(
  "unknown path answers 404 with the lost-trail copy and no capture band",
  { tag: "@smoke" },
  async ({ request }) => {
    const response = await request.get("/en/does-not-exist");
    const html = await response.text();

    expect(response.status()).toBe(404);
    expect(html).toContain("You’ve wandered off the trail.");
    expect(html).toContain("<title>Page not found | XionTech</title>");
    expect(html).toContain("You are here");
    expect(html).not.toContain(">404<");
    expect(html).toContain("Go to Home");
    expect(html).not.toContain("See it working at your school.");
  },
);

test(
  "unknown Vietnamese path answers 404 in Vietnamese with one title and one robots tag",
  { tag: "@smoke" },
  async ({ request }) => {
    const response = await request.get("/vi/does-not-exist");
    const html = await response.text();

    expect(response.status()).toBe(404);
    expect(html).toContain("Bạn đã đi lạc lối mòn.");
    expect(html.match(/<title>/g)).toHaveLength(1);
    expect(html).toContain("<title>Không tìm thấy trang | XionTech</title>");
    expect(html.match(/<meta name="robots"/g)).toHaveLength(1);
  },
);

test(
  "unsupported locale answers 404 instead of redirecting",
  { tag: "@smoke" },
  async ({ request }) => {
    const response = await request.get("/fr/products", { maxRedirects: 0 });

    expect(response.status()).toBe(404);
    expect(await response.text()).toContain("You’ve wandered off the trail.");
  },
);
