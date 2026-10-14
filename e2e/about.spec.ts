import { expect, test } from "@playwright/test";

const text = (html: string) => html.replaceAll(/<[^>]*>/g, "");

test(
  "about page serves content with anchors and FAQ without JavaScript",
  { tag: "@smoke" },
  async ({ request }) => {
    const response = await request.get("/en/about");
    const html = await response.text();

    // Page returns 200
    expect(response.status()).toBe(200);

    // One H1, with the About headline
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1);
    // Each title word is its own span (the hero entrance): compare the text.
    expect(text(html)).toContain("technology built with ");
    expect(html).toContain("ownership");

    // The values moved to Home
    expect(html).not.toContain('id="values"');

    // Page has FAQ section anchor
    expect(html).toContain('id="faq"');

    // Page has nine details elements
    expect(html.match(/<details[\s>]/g)).toHaveLength(9);

    // The FAQ ends with the ask-us link
    expect(html).toContain("Still have a question?");

    // Page has both zone labels
    expect(html).toContain("US Central");
    expect(html).toContain("GMT+7");

    // Page has the capture copy
    expect(html).toContain("See our apps in action.");
  },
);
