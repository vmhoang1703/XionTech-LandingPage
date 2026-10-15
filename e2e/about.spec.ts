import { expect, test } from "@playwright/test";

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
    expect(html).toContain("Technology built with ");
    expect(html).toContain("ownership");

    // What drives us, the FAQ, the offices and the closing call to action
    expect(html).toContain('id="values"');
    expect(html).toContain('id="faq"');
    expect(html).toContain('id="offices"');
    expect(html).toContain('id="next"');

    // Five questions, no ask-us link
    expect(html.match(/<details[\s>]/g)).toHaveLength(5);
    expect(html).not.toContain("Still have a question?");

    // Both location cards, no capture band
    expect(html).toContain("US Delivery Center");
    expect(html).toContain("Vietnam Delivery Center");
    expect(html).not.toContain("See our apps in action");
  },
);
