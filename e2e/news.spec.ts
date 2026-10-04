import { expect, test } from "@playwright/test";

test(
  "news page responds 200 with its H1, the filter chips and the demo capture",
  { tag: "@smoke" },
  async ({ request }) => {
    const response = await request.get("/news");
    const html = await response.text();

    expect(response.status()).toBe(200);
    expect(html).toContain('id="news-h1"');
    expect(html).toContain('aria-label="Filter stories"');
    expect(html).toContain("See it working at your school.");
  },
);
