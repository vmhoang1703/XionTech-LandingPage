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
  },
);
