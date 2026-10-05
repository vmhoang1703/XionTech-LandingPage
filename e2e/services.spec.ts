import { expect, test } from "@playwright/test";

test(
  "services page responds 200 with the zone labels, the H1 and the eight service anchors in the HTML without JavaScript",
  { tag: "@smoke" },
  async ({ request }) => {
    const response = await request.get("/services");
    const html = await response.text();

    expect(response.status()).toBe(200);
    // CAP-2: zone labels server-rendered without JavaScript
    expect(html).toContain("Ho Chi Minh City");
    expect(html).toContain("GMT+7");
    expect(html).toContain("Plano");
    expect(html).toContain("US Central");
    // H1 is present in server-rendered HTML
    expect(html).toContain("Software teams that");
    expect(html).toContain("get IT done");
    // Story 5.2: eight service card IDs and section title, anchors exist without JavaScript
    expect(html).toContain('<article id="product-engineering"');
    expect(html).toContain('<article id="ai-analytics"');
    expect(html).toContain('<article id="co-creation"');
    expect(html).toContain('<article id="staffing"');
    expect(html).toContain('<article id="custom-apps"');
    expect(html).toContain('<article id="low-code"');
    expect(html).toContain('<article id="ai-solutions"');
    expect(html).toContain('<article id="cloud"');
    expect(html).toContain("Eight services, one team.");
  },
);
