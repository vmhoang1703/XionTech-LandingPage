import { expect, test } from "@playwright/test";

test.describe("language switch", { tag: "@a11y" }, () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("EN to VI on Home keeps the scroll, typed fields and focus on the button", async ({
    page,
  }) => {
    await page.goto("/en");
    await page.locator('[name="name"]').fill("Lan Nguyen");
    await page.locator('[name="message"]').fill("Trường Mầm Non");
    await page.evaluate(() =>
      window.scrollTo({ top: 1141, behavior: "instant" }),
    );
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(1141);

    // Keyboard, not click(): Playwright's click scrolls the sticky header "into view",
    // which moves the page before the switch.
    await page.getByRole("button", { name: /Language/ }).focus();
    await page.keyboard.press("Enter");
    await page.getByRole("button", { name: /Tiếng Việt/ }).focus();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(1141);
    await page.keyboard.press("Enter");

    await expect(page).toHaveURL(/\/vi$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "vi");
    const language = page.getByRole("button", { name: /Ngôn ngữ/ });
    await expect(language).toBeFocused();
    await expect(page.locator('[name="name"]')).toHaveValue("Lan Nguyen");
    await expect(page.locator('[name="message"]')).toHaveValue(
      "Trường Mầm Non",
    );
    // Wait past the restore's settle window, then check it held.
    await page.waitForTimeout(1000);
    const y = await page.evaluate(() => window.scrollY);
    expect(Math.abs(y - 1141)).toBeLessThanOrEqual(40);
    await expect(language).toBeFocused();
    expect(
      (await page.context().cookies()).find((c) => c.name === "locale")?.value,
    ).toBe("vi");
  });
});

test(
  "a 404 keeps its translated tab title after the page loads",
  {
    tag: "@a11y",
  },
  async ({ page }) => {
    await page.goto("/vi/no-such-page");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveTitle("Không tìm thấy trang | XionTech");
  },
);
