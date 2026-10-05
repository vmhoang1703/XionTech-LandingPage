import { expect, test } from "@playwright/test";

test(
  "services page responds 200 with the zone labels, the H1, the eight service anchors, #process and the project capture in the HTML without JavaScript",
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
    // Story 5.4: the 4-D band target and the project capture
    expect(html).toContain('href="#process"');
    expect(html).toContain('<section id="process"');
    expect(html.indexOf('<section id="process"')).toBeLessThan(
      html.indexOf("Tell us what you&#x27;re building."),
    );
    expect(html).toContain("From your request to launch, in four steps.");
    expect(html).toContain("Tell us what you&#x27;re building.");
  },
);
