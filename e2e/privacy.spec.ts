import { expect, test } from "@playwright/test";

const text = (html: string) => html.replaceAll(/<[^>]*>/g, "");

test(
  "privacy page responds 200 with its H1 and no capture band",
  { tag: "@smoke" },
  async ({ request }) => {
    const response = await request.get("/privacy");
    const html = await response.text();

    expect(response.status()).toBe(200);
    // Each title word is its own span (the hero entrance): compare the text.
    expect(text(html)).toContain("Privacy policy.");
    expect(html).toContain("[Placeholder]");
    expect(html).not.toContain("<form");
  },
);
