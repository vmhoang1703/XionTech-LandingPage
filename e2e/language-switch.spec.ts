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

// Each new locale: the switch lands on its URL and lang, and keeps the typed fields.
for (const { code, lang, name, label } of [
  { code: "ja", lang: "ja", name: "日本語", label: "言語" },
  { code: "fr", lang: "fr", name: "Français", label: "Langue" },
  { code: "ko", lang: "ko", name: "한국어", label: "언어" },
  { code: "zh", lang: "zh-Hans", name: "简体中文", label: "语言" },
]) {
  test(
    `EN to ${code.toUpperCase()} on Home keeps the typed fields and sets lang`,
    {
      tag: "@a11y",
    },
    async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("/en");
      await page.locator('[name="name"]').fill("Lan Nguyen");
      await page.locator('[name="message"]').fill("Trường Mầm Non");

      await page.getByRole("button", { name: /Language/ }).focus();
      await page.keyboard.press("Enter");
      await page.getByRole("button", { name: new RegExp(name) }).focus();
      await page.keyboard.press("Enter");

      await expect(page).toHaveURL(new RegExp(`/${code}$`));
      await expect(page.locator("html")).toHaveAttribute("lang", lang);
      await expect(
        page.getByRole("button", { name: new RegExp(label) }),
      ).toBeFocused();
      await expect(page.locator('[name="name"]')).toHaveValue("Lan Nguyen");
      await expect(page.locator('[name="message"]')).toHaveValue(
        "Trường Mầm Non",
      );
      expect(
        (await page.context().cookies()).find((c) => c.name === "locale")
          ?.value,
      ).toBe(code);
    },
  );
}
