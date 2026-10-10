import { expect, test } from "@playwright/test";

test(
  "products page responds 200 with the flow H1, the four chapter links, the four cards and no Updates link",
  { tag: "@smoke" },
  async ({ request }) => {
    const response = await request.get("/products");
    const html = await response.text();

    expect(response.status()).toBe(200);
    expect(html).toContain("Built apart. Better together.");
    expect(html).toContain('id="flow"');
    // The still campus is in the HTML, so no-JS visitors see a picture too.
    expect(html).toContain("flow-fallback");
    for (const id of ["pxp", "sxp", "iot", "ai-tutor"]) {
      expect(html).toContain(`href="#${id}"`);
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

const CHAPTER_ANCHORS = ["pxp", "sxp", "ai-tutor", "iot"];

test.describe("audience flow", { tag: "@a11y" }, () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("one H1, four chapters in order, each linking to its card, and a canvas or the fallback", async ({
    page,
  }) => {
    await page.goto("/products");

    await expect(page.locator("h1")).toHaveCount(1);
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Built apart. Better together.",
      }),
    ).toBeVisible();
    const hrefs = await page
      .locator("#flow .flow-chapter .flow-link")
      .evaluateAll((links) => links.map((a) => a.getAttribute("href")));
    expect(hrefs).toEqual(CHAPTER_ANCHORS.map((id) => `#${id}`));
    await expect(
      page.locator(
        "#flow .flow-canvas canvas.flow-scene:not([hidden]), #flow .flow-canvas .flow-fallback",
      ),
    ).toHaveCount(1);
  });

  test("scrolling to the Student chapter marks it active and no other", async ({
    page,
  }) => {
    await page.goto("/products");
    const chapters = page.locator("#flow .flow-chapter");

    await expect(chapters.nth(0)).toHaveAttribute("data-active", "true");
    await chapters
      .nth(2)
      .evaluate((el) =>
        el.scrollIntoView({ block: "center", behavior: "instant" }),
      );

    await expect(chapters.nth(2)).toHaveAttribute("data-active", "true");
    for (const other of [0, 1, 3]) {
      await expect(chapters.nth(other)).toHaveAttribute("data-active", "false");
    }
  });

  // Focusing an off-screen link starts Chrome's smooth focus scroll; Enter
  // straight after can lose the jump to the card to it. The race does not
  // always lose, so the steps run three times.
  test("a chapter link activated while its focus scroll runs still lands on the card", async ({
    page,
  }) => {
    for (let round = 0; round < 3; round++) {
      await page.goto("/products");
      await page.waitForTimeout(1500);
      await page.evaluate(() => {
        const apps = document.querySelector<HTMLElement>("#apps");
        scrollTo({ top: (apps?.offsetTop ?? 0) + 600, behavior: "instant" });
      });
      await page.waitForTimeout(800);
      await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
      await page.waitForTimeout(800);

      await page.locator('#flow a[href="#ai-tutor"]').focus();
      await page.keyboard.press("Enter");
      await expect(page.locator("#ai-tutor-h")).toBeInViewport();
    }
  });

  test("Pause un-dims the other chapters, and the choice survives a reload", async ({
    page,
  }) => {
    await page.goto("/products");
    const inactive = page.locator('#flow .flow-chapter[data-active="false"]');
    const allFull = async () => {
      await expect(inactive).toHaveCount(3);
      for (const chapter of await inactive.all()) {
        await expect(chapter).toHaveCSS("opacity", "1");
      }
    };

    await expect(inactive.first()).toHaveCSS("opacity", "0.8");
    await page.getByRole("button", { name: "Pause motion" }).click();
    await allFull();

    await page.reload();
    const play = page.getByRole("button", { name: "Play motion" });
    await expect(play).toBeVisible();
    await allFull();

    await play.click();
    await expect(
      page.getByRole("button", { name: "Pause motion" }),
    ).toBeVisible();
    await expect(inactive.first()).toHaveCSS("opacity", "0.8");
  });

  test.describe("reduced motion", () => {
    test.use({ reducedMotion: "reduce" });

    test("the scene is paused with no frame loop and every chapter reads at full strength", async ({
      page,
    }) => {
      await page.addInitScript(() => {
        const win = window as unknown as { __flowFrames: number };
        win.__flowFrames = 0;
        const request = window.requestAnimationFrame.bind(window);
        window.requestAnimationFrame = (callback) => {
          win.__flowFrames += 1;
          return request(callback);
        };
      });
      await page.goto("/products");
      const chapters = page.locator("#flow .flow-chapter");

      await chapters
        .nth(2)
        .evaluate((el) =>
          el.scrollIntoView({ block: "center", behavior: "instant" }),
        );
      await expect(chapters.nth(2)).toHaveAttribute("data-active", "true");
      await expect(page.locator("#flow .flow-canvas")).toHaveAttribute(
        "data-paused",
        "true",
      );
      await expect(
        page.getByRole("button", { name: "Play motion" }),
      ).toBeVisible();
      for (let i = 0; i < 4; i++) {
        await expect(chapters.nth(i)).toHaveCSS("opacity", "1");
      }

      // Let any scroll-driven frame settle, then no scene frame may follow.
      await page.waitForTimeout(500);
      const before = await page.evaluate(
        () => (window as unknown as { __flowFrames: number }).__flowFrames,
      );
      await page.waitForTimeout(1000);
      const after = await page.evaluate(
        () => (window as unknown as { __flowFrames: number }).__flowFrames,
      );
      expect(after, "no animation frame while paused").toBe(before);
    });
  });
});
