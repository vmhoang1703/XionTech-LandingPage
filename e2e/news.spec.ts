import { expect, test } from "@playwright/test";

test(
  "news page responds 200 with its hero, the audience filters, the sample note and the demo capture",
  { tag: "@smoke" },
  async ({ request }) => {
    const response = await request.get("/news");
    const html = await response.text();

    expect(response.status()).toBe(200);
    expect(html).toContain("<title>News | XionTechs</title>");
    expect(html).toContain('id="news-h1"');
    expect(html).toContain("Catch up with us");
    expect(html).toContain('class="page-scene"');
    expect(html).not.toContain('aria-label="Breadcrumb"');
    expect(html).toContain('aria-label="Filter stories by audience"');
    for (const chip of ["All", "Schools", "Students", "Parents", "Company"]) {
      expect(html).toContain(`>${chip}</button>`);
    }
    expect(html).toContain(
      "Stories from the newXion newsroom; those marked [Placeholder] are samples.",
    );
    expect(html).toContain("See it working at your school.");
  },
);

test(
  "unknown story slug answers 404 with the Not found page",
  { tag: "@smoke" },
  async ({ request }) => {
    const response = await request.get("/news/no-such-story");
    const html = await response.text();

    expect(response.status()).toBe(404);
    // The Story 1.7 Not found page's H1 id.
    expect(html).toContain("not-found-title");
  },
);

test(
  "the first story on the News page answers 200 with its header, Back to News and no breadcrumb",
  { tag: "@smoke" },
  async ({ request }) => {
    const newsResponse = await request.get("/news");
    expect(newsResponse.status()).toBe(200);
    const news = await newsResponse.text();
    const href = /href="(\/news\/[^"#?]+)"/.exec(news)?.[1];
    expect(href, "a published story in Sanity to open").toBeTruthy();

    const response = await request.get(href ?? "");
    const html = await response.text();

    expect(response.status()).toBe(200);
    expect(html).toContain('id="story-h1"');
    expect(html).toContain('class="art-back"');
    expect(html).toContain("Back to News");
    expect(html).toContain('class="art-body"');
    expect(html).not.toContain('aria-label="Breadcrumb"');
  },
);
