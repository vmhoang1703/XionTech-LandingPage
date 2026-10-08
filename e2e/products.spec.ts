import { expect, test } from "@playwright/test";

test(
  "products page responds 200 with its H1, the four cards and no Updates link",
  { tag: "@smoke" },
  async ({ request }) => {
    const response = await request.get("/products");
    const html = await response.text();

    expect(response.status()).toBe(200);
    expect(html).toContain("Built apart.");
    for (const id of ["pxp", "sxp", "iot", "ai-tutor"]) {
      expect(html).toContain(`href="#${id}"`);
      expect(html).toContain(`id="${id}"`);
    }
    expect(html).not.toContain('href="#updates"');
    expect(html).not.toContain('id="lxp"');
    expect(html).not.toContain("xt-ai-tutor-demo");
  },
);

test("a showcase card opens its dialog by keyboard, keeps Tab inside, and Esc returns focus", async ({
  page,
}) => {
  await page.goto("/products");
  const expand = page.getByRole("button", { name: "Open Staff Hub details" });
  await expand.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog", { name: "Staff Hub" });
  await expect(dialog).toBeVisible();
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press("Tab");
    const inside = await dialog.evaluate((d) =>
      d.contains(document.activeElement),
    );
    expect(inside, `Tab ${i + 1} stays in the dialog`).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(expand).toBeFocused();
});

test("/products#ai-tutor lands on the AI Tutor card below the header", async ({
  page,
}) => {
  await page.goto("/products#ai-tutor");
  await expect(page.locator("#ai-tutor-h")).toBeInViewport();
  const top = await page
    .locator("#ai-tutor")
    .evaluate((el) => el.getBoundingClientRect().top);
  expect(top).toBeGreaterThanOrEqual(60);
});
