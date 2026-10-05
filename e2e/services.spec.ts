import { expect, test } from "@playwright/test";

test(
  "services page responds 200 with both zone labels and the H1 in the HTML without JavaScript",
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
    expect(html).toContain('id="product-engineering"');
    expect(html).toContain('id="ai-analytics"');
    expect(html).toContain('id="co-creation"');
    expect(html).toContain('id="staffing"');
    expect(html).toContain('id="custom-apps"');
    expect(html).toContain('id="low-code"');
    expect(html).toContain('id="ai-solutions"');
    expect(html).toContain('id="cloud"');
    expect(html).toContain("Eight services, one team.");
  },
);
