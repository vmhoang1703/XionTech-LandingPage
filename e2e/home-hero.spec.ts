import { expect, test } from "@playwright/test";

test(
  "home page serves the hero headline and CTA without JavaScript",
  { tag: "@smoke" },
  async ({ request }) => {
    const response = await request.get("/");
    const html = await response.text();

    expect(response.status()).toBe(200);
    expect(html).toContain("connected");
    expect(html).toContain("Explore our products");
    expect(html).toContain("Experience you can count on");
    expect(html).toContain("Products for schools");
    expect(html).toContain("Your software delivery team");
    expect(html).toContain("Four apps. One school day.");
    expect(html).toContain("Eight ways we get IT done for you.");
    // The motion toggle only appears once WebGL is confirmed in the browser.
    expect(html).not.toContain("Pause motion");
  },
);
