import { expect, test } from "@playwright/test";

const text = (html: string) => html.replaceAll(/<[^>]*>/g, "");

test(
  "careers page responds 200 with its H1, Inside XionTech and the open roles",
  { tag: "@smoke" },
  async ({ request }) => {
    const response = await request.get("/careers");
    const html = await response.text();

    expect(response.status()).toBe(200);
    // Each title word is its own span (the hero entrance): compare the text.
    expect(text(html)).toContain("Stay curious.");
    expect(html).toContain('id="life"');
    expect(html).toContain('id="roles"');
    expect(html.indexOf('id="life"')).toBeLessThan(
      html.indexOf('id="culture"'),
    );
    expect(html.indexOf('id="culture"')).toBeLessThan(
      html.indexOf('id="roles"'),
    );
  },
);
