import { expect, test } from "@playwright/test";

test(
  "about page serves content with anchors and FAQ without JavaScript",
  { tag: "@smoke" },
  async ({ request }) => {
    const response = await request.get("/about");
    const html = await response.text();

    // Page returns 200
    expect(response.status()).toBe(200);

    // Page has an H1
    expect(html).toContain("<h1");

    // Page has values section anchor
    expect(html).toContain('id="values"');

    // Page has FAQ section anchor
    expect(html).toContain('id="faq"');

    // Page has nine details elements
    const detailsMatches = html.match(/<details/g);
    expect(detailsMatches?.length).toBe(9);

    // Page has both zone labels
    expect(html).toContain("US Central");
    expect(html).toContain("GMT+7");

    // Page has the capture copy
    expect(html).toContain("See our apps in action.");
  },
);
