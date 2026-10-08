import { expect, test } from "@playwright/test";

test(
  "products page responds 200 with its H1, the four pills and no Updates link",
  { tag: "@smoke" },
  async ({ request }) => {
    const response = await request.get("/products");
    const html = await response.text();

    expect(response.status()).toBe(200);
    expect(html).toContain("Four apps. One");
    for (const id of ["pxp", "sxp", "iot"]) {
      expect(html).toContain(`href="#${id}"`);
      expect(html).toContain(`id="${id}"`);
    }
    expect(html).not.toContain('href="#updates"');
    expect(html).not.toContain('id="lxp"');
  },
);
