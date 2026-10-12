import { expect, test } from "@playwright/test";

test(
  "home page serves the hero headline and CTA without JavaScript",
  { tag: "@smoke" },
  async ({ request }) => {
    const response = await request.get("/");
    const html = await response.text();

    expect(response.status()).toBe(200);
    expect(html).toContain("get IT done");
    expect(html).toContain("Get in touch");
    expect(html).toContain("Experience you can count on");
    expect(html).toContain("Products for schools");
    expect(html).toContain("Your software delivery team");
    expect(html).toContain("What can we help you achieve?");
    expect(html).toContain("One connected school.");
    expect(html).toContain("Why XionTech.");
    expect(html).toContain("How we work.");
    expect(html).toContain("Our core values.");
    expect(html).toContain("Your questions, answered.");
    // Without JavaScript the "+3" industries are still in the HTML.
    expect(html).toContain("Private Equity");
    expect(html).not.toContain("Four apps. One school day.");
    expect(html).not.toContain("Eight ways we get IT done for you.");
    // Without JavaScript the flow is static, so every step is visible.
    expect(html).toContain(`data-phase="static"`);
    // The motion toggle only appears once WebGL is confirmed in the browser.
    expect(html).not.toContain("Pause motion");
  },
);
