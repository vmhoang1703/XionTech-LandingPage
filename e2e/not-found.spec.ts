import { expect, test } from "@playwright/test";

const text = (html: string) => html.replaceAll(/<[^>]*>/g, "");

test(
  "unknown path answers 404 with the lost-trail copy and no capture band",
  { tag: "@smoke" },
  async ({ request }) => {
    const response = await request.get("/does-not-exist");
    const html = await response.text();

    expect(response.status()).toBe(404);
    // Each title word is its own span (the hero entrance): compare the text.
    expect(text(html)).toContain("You’ve wandered off the trail.");
    expect(html).toContain("You are here");
    expect(html).not.toContain(">404<");
    expect(html).toContain("Go to Home");
    expect(html).not.toContain("See it working at your school.");
  },
);
