import { expect, test } from "@playwright/test";

test(
  "services page responds 200 with the H1, the eight service anchors, the outcomes and #process in the HTML without JavaScript",
  { tag: "@smoke" },
  async ({ request }) => {
    const response = await request.get("/en/services");
    const html = await response.text();

    expect(response.status()).toBe(200);
    expect(html).toContain(
      "<title>Software Outsourcing Vietnam | Product Engineering, AI, Low-code &amp; Cloud | XionTech</title>",
    );
    // H1 is present in server-rendered HTML
    expect(html).toContain("Software teams that");
    expect(html).toContain("get IT done");
    // Eight service card IDs and section title, anchors exist without JavaScript
    expect(html).toContain('<article id="product-engineering"');
    expect(html).toContain('<article id="ai-analytics"');
    expect(html).toContain('<article id="co-creation"');
    expect(html).toContain('<article id="staffing"');
    expect(html).toContain('<article id="custom-apps"');
    expect(html).toContain('<article id="low-code"');
    expect(html).toContain('<article id="ai-solutions"');
    expect(html).toContain('<article id="cloud"');
    expect(html).toContain("Eight services, one team.");
    // E-S2: outcomes, then the process with the prototype heading; no clocks, no email band
    expect(html).toContain("What can we help you achieve?");
    expect(html).toContain('<section id="process"');
    expect(html.indexOf('<section id="outcomes"')).toBeLessThan(
      html.indexOf('<section id="process"'),
    );
    expect(html).toContain("Our 4-D process: from your request to launch.");
    expect(html).not.toContain('class="clock-strip');
    expect(html).not.toContain('class="capture');
  },
);
