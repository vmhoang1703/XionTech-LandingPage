import { expect, test } from "@playwright/test";

const text = (html: string) => html.replaceAll(/<[^>]*>/g, "");

test(
  "careers page responds 200 with its H1 and the open roles",
  { tag: "@smoke" },
  async ({ request }) => {
    const response = await request.get("/en/careers");
    const html = await response.text();

    expect(response.status()).toBe(200);
    // Each title word is its own span (the hero entrance): compare the text.
    expect(text(html)).toMatch(/Careers at\s*XionTech/);
    expect(html).toContain('id="meet-the-team"');
    expect(html).toContain('id="roles"');
    // Round 13: Inside XionTech (#life) and the five values (#culture) are gone.
    expect(html).not.toContain('id="life"');
    expect(html).not.toContain('id="culture"');
  },
);
