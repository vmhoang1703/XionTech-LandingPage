import { expect, test, type Page } from "@playwright/test";

test(
  "products page responds 200 with the H1, the map, the four card anchors and no Updates link",
  { tag: "@smoke" },
  async ({ request }) => {
    const response = await request.get("/products");
    const html = await response.text();

    expect(response.status()).toBe(200);
    expect(html).toContain("Built apart. Better together.");
    expect(html).toContain('id="map"');
    for (const id of ["pxp", "sxp", "iot", "ai-tutor"]) {
      expect(html).toContain(`id="${id}"`);
    }
    expect(html).not.toContain('href="#updates"');
    expect(html).not.toContain('id="lxp"');
    expect(html).not.toContain("xt-ai-tutor-demo");
  },
);

test(
  "a showcase card opens its dialog by keyboard, keeps Tab inside, and Esc returns focus",
  { tag: "@a11y" },
  async ({ page }) => {
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
  },
);

test(
  "/products#ai-tutor lands on the AI Tutor card below the header",
  { tag: "@a11y" },
  async ({ page }) => {
    await page.goto("/products#ai-tutor");
    await expect(page.locator("#ai-tutor-h")).toBeInViewport();
    const top = await page
      .locator("#ai-tutor")
      .evaluate((el) => el.getBoundingClientRect().top);
    expect(top).toBeGreaterThanOrEqual(60);
  },
);

test.describe("school-day roadmap", { tag: "@a11y" }, () => {
  test.use({ viewport: { width: 1280, height: 400 } });

  const roadmap = (page: Page) => page.locator("#map .rm");
  const cards = (page: Page) => roadmap(page).locator(".rm-card");

  // A wiped card still has full opacity, so ask the browser what is painted
  // at the card's centre: the card (or a part of it) only once it is open.
  const expectOpen = async (page: Page) => {
    for (const card of await cards(page).all()) {
      // elementFromPoint only sees the viewport.
      await card.evaluate((el) =>
        el.scrollIntoView({ block: "center", behavior: "instant" }),
      );
      await expect
        .poll(() =>
          card.evaluate((el) => {
            const box = el.getBoundingClientRect();
            const hit = document.elementFromPoint(
              box.left + box.width / 2,
              box.top + box.height / 2,
            );
            return !!hit && el.contains(hit);
          }),
        )
        .toBe(true);
    }
  };

  test("the roadmap shows the H1 and six cards", async ({ page }) => {
    await page.goto("/products");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Built apart. Better together.",
      }),
    ).toBeVisible();
    await expect(roadmap(page)).toBeVisible();
    await expect(cards(page)).toHaveCount(6);
    await expect(cards(page).first()).toBeVisible();
  });

  test("scrolling it into view plays the draw-in and leaves every card open", async ({
    page,
  }) => {
    await page.goto("/products");
    // Scrolled to the top with the roadmap below the fold: waiting, not shown.
    await expect(roadmap(page)).toHaveAttribute("data-reveal", "armed");
    await expect(cards(page).first()).not.toBeInViewport();

    await roadmap(page).evaluate((el) =>
      el.scrollIntoView({ block: "center", behavior: "instant" }),
    );

    await expect(roadmap(page)).toHaveAttribute("data-reveal", "on");
    await expect(roadmap(page).locator(".rm-draw")).toHaveCSS(
      "stroke-dashoffset",
      "0px",
    );
    for (const pin of await roadmap(page).locator(".rm-pin").all()) {
      await expect(pin).toHaveCSS("scale", /^(1|none)$/);
    }
    await expectOpen(page);
  });

  test.describe("phone", () => {
    test.use({ viewport: { width: 390, height: 800 } });

    test("each stop appears as it scrolls into view", async ({ page }) => {
      await page.goto("/products");
      await expect(roadmap(page)).toHaveAttribute("data-reveal", "armed");
      for (const stop of await roadmap(page).locator(".rm-stop").all()) {
        await stop.evaluate((el) =>
          el.scrollIntoView({ block: "center", behavior: "instant" }),
        );
        await expect(stop).toHaveAttribute("data-in", "true");
      }
      await expectOpen(page);
    });
  });

  test.describe("reduced motion", () => {
    test.use({ reducedMotion: "reduce" });

    test("shows the whole roadmap at once", async ({ page }) => {
      await page.goto("/products");
      await expect(roadmap(page)).toHaveAttribute("data-reveal", "static");
      await expect(cards(page)).toHaveCount(6);
      await expectOpen(page);
    });
  });

  test("a card opens the modal, Next moves, and Esc returns focus to the card", async ({
    page,
  }) => {
    await page.goto("/products");
    const first = page.getByRole("button", { name: "1. Student arrives" });
    await first.scrollIntoViewIfNeeded();
    await first.click();

    const modal = page.locator("dialog.road-dialog");
    await expect(modal).toBeVisible();
    await expect(modal.getByRole("heading", { level: 2 })).toHaveText(
      "Student arrives",
    );

    await modal.getByRole("button", { name: /Attendance recorded/ }).click();
    await expect(modal.getByRole("heading", { level: 2 })).toHaveText(
      "Attendance recorded",
    );

    await page.keyboard.press("Escape");
    await expect(modal).toBeHidden();
    // Focus goes back to the card that opened the modal (the first one).
    await expect(first).toBeFocused();
  });

  test('"Open ... details" opens the app dialog', async ({ page }) => {
    await page.goto("/products");
    await page.getByRole("button", { name: "2. Attendance recorded" }).click();

    const modal = page.locator("dialog.road-dialog");
    await modal.getByRole("button", { name: "Open Staff Hub details" }).click();

    await expect(modal).toBeHidden();
    await expect(page.getByRole("dialog", { name: "Staff Hub" })).toBeVisible();
  });

  test("390px has no sideways scroll", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto("/products");
    await expect(cards(page)).toHaveCount(6);
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
