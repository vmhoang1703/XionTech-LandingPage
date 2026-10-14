import { expect, test, type Locator, type Page } from "@playwright/test";

const text = (html: string) => html.replaceAll(/<[^>]*>/g, "");

test(
  "products page responds 200 with the H1, the map, the four card anchors and no Updates link",
  { tag: "@smoke" },
  async ({ request }) => {
    const response = await request.get("/products");
    const html = await response.text();

    expect(response.status()).toBe(200);
    // Each title word is its own span (the hero entrance): compare the text.
    expect(text(html)).toContain("Built apart. Better together.");
    expect(html).toContain('id="map"');
    // Inside the roadmap: between the map section's start and its end.
    const start = html.indexOf('id="map"');
    const map = html.slice(start, html.indexOf("</section>", start));
    for (const id of ["pxp", "sxp", "iot", "ai-tutor"]) {
      expect(map.split(`id="${id}"`)).toHaveLength(2);
      expect(html.split(`id="${id}"`)).toHaveLength(2);
    }
    expect(html).not.toContain('href="#updates"');
    expect(html).not.toContain('id="lxp"');
    expect(html).not.toContain("xt-ai-tutor-demo");
  },
);

test.describe("deep links to an app", { tag: "@a11y" }, () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  // Each app's anchor and the roadmap stop it lands on.
  for (const [anchor, index, title] of [
    ["sxp", 1, "Attendance recorded"],
    ["pxp", 2, "Parent updated"],
    ["ai-tutor", 3, "Student learns"],
    ["iot", 4, null],
  ] as const) {
    test(`/products#${anchor} makes stop ${index + 1} active with its card in view below the header`, async ({
      page,
    }) => {
      await page.goto(`/products#${anchor}`);
      const stop = page.locator("#map .rm-stop").nth(index);
      const card = stop.locator(".rm-card");
      if (title) await expect(card).toContainText(title);
      await expect(stop).toHaveAttribute("data-active", "true");
      // Smooth scroll: wait until the card sits whole between the header and
      // the bottom of the window.
      await expect
        .poll(() =>
          card.evaluate((el) => {
            const box = el.getBoundingClientRect();
            const header = document.querySelector("header");
            const below = header ? header.getBoundingClientRect().bottom : 0;
            return box.top >= below && box.bottom <= window.innerHeight;
          }),
        )
        .toBe(true);
      await expect(stop).toHaveAttribute("data-active", "true");
    });
  }
});

test.describe("school-day roadmap", { tag: "@a11y" }, () => {
  test.use({ viewport: { width: 1280, height: 800 } });

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

  test("scrolling walks the tour stop by stop, pinned, then the demo band follows", async ({
    page,
  }) => {
    await page.goto("/products");
    await expect(roadmap(page)).toHaveAttribute("data-tour", "on");
    const stage = roadmap(page).locator(".rm-stage");
    const stops = roadmap(page).locator(".rm-stop");
    // Where the track starts (page offset) and how long each step is.
    const { top, step, pin } = await roadmap(page).evaluate((el) => {
      const stageEl = el.querySelector(".rm-stage") as HTMLElement;
      return {
        top: el.getBoundingClientRect().top + window.scrollY,
        step:
          (el.getBoundingClientRect().height -
            stageEl.getBoundingClientRect().height) /
          6,
        // The stage pins at --spacing-header-room (a calc, so measure it).
        pin: (() => {
          const probe = document.createElement("div");
          probe.style.height = "var(--spacing-header-room)";
          document.body.append(probe);
          const room = probe.getBoundingClientRect().height;
          probe.remove();
          return room;
        })(),
      };
    });
    const scrollToStep = (i: number) =>
      page.evaluate(
        (y) => window.scrollTo({ top: y, behavior: "instant" }),
        top - pin + (i + 0.5) * step,
      );

    for (let i = 0; i < 6; i += 1) {
      await scrollToStep(i);
      await expect(stops.nth(i)).toHaveAttribute("data-active", "true");
      await expect(stops.nth(i)).toHaveAttribute("data-selected", "true");
      await expect(roadmap(page).locator('[data-active="true"]')).toHaveCount(
        1,
      );
      // Pinned: the stage stays at the same place below the header.
      const stageTop = await stage.evaluate(
        (el) => el.getBoundingClientRect().top,
      );
      expect(Math.round(stageTop)).toBe(Math.round(pin));
    }

    // Back up: the active stop steps back.
    await scrollToStep(1);
    await expect(stops.nth(1)).toHaveAttribute("data-active", "true");

    // Past the last step the stage releases and the demo band follows.
    await page.evaluate(
      (y) => window.scrollTo({ top: y, behavior: "instant" }),
      top - pin + 6 * step + 400,
    );
    await expect(page.locator("section.capture")).toBeInViewport();
  });

  // Where the track starts (page offset), one step's length and the header's
  // height, read from the DOM.
  const track = (page: Page) =>
    roadmap(page).evaluate((el) => {
      const stageEl = el.querySelector(".rm-stage") as HTMLElement;
      const rect = el.getBoundingClientRect();
      return {
        top: rect.top + window.scrollY,
        step: (rect.height - stageEl.getBoundingClientRect().height) / 6,
        // The stage pins at --spacing-header-room (a calc, so measure it).
        pin: (() => {
          const probe = document.createElement("div");
          probe.style.height = "var(--spacing-header-room)";
          document.body.append(probe);
          const room = probe.getBoundingClientRect().height;
          probe.remove();
          return room;
        })(),
      };
    });
  const scrollTo = (page: Page, y: number) =>
    page.evaluate((to) => window.scrollTo({ top: to, behavior: "instant" }), y);
  const activeIndex = (page: Page) =>
    roadmap(page)
      .locator(".rm-stop")
      .evaluateAll((all) =>
        all.findIndex((el) => el.getAttribute("data-active") === "true"),
      );
  // A card sits whole between the header and the bottom of the window.
  const cardInView = (card: Locator) =>
    card.evaluate((el) => {
      const box = el.getBoundingClientRect();
      const header = document.querySelector("header");
      const below = header ? header.getBoundingClientRect().bottom : 0;
      return box.top >= below && box.bottom <= window.innerHeight;
    });

  test("each stop becomes active exactly once, in order, and back again", async ({
    page,
  }) => {
    await page.goto("/products");
    await expect(roadmap(page)).toHaveAttribute("data-tour", "on");
    const { top, step, pin } = await track(page);
    // Record every change of the active stop while scrolling in small steps.
    await roadmap(page).evaluate((el) => {
      const seen: number[] = [];
      (window as unknown as { seen: number[] }).seen = seen;
      const note = () => {
        const i = [...el.querySelectorAll(".rm-stop")].findIndex(
          (s) => s.getAttribute("data-active") === "true",
        );
        if (i >= 0 && seen.at(-1) !== i) seen.push(i);
      };
      new MutationObserver(note).observe(el, {
        subtree: true,
        attributes: true,
        attributeFilter: ["data-active"],
      });
      note();
    });
    const from = top - pin;
    for (let y = from + 1; y < from + 6 * step; y += step / 8) {
      await scrollTo(page, y);
    }
    await expect
      .poll(() =>
        page.evaluate(() => (window as unknown as { seen: number[] }).seen),
      )
      .toEqual([0, 1, 2, 3, 4, 5]);

    // Back up: the active stop follows, one step at a time.
    for (let i = 5; i >= 0; i -= 1) {
      await scrollTo(page, from + (i + 0.5) * step);
      await expect.poll(() => activeIndex(page)).toBe(i);
    }
  });

  for (const [width, height] of [
    [1280, 800],
    [1920, 1080],
  ] as const) {
    test(`${width}x${height}: the whole stage stays inside the window below the header`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height });
      await page.goto("/products");
      await expect(roadmap(page)).toHaveAttribute("data-tour", "on");
      const { top, step, pin } = await track(page);
      for (let i = 0; i < 6; i += 1) {
        await scrollTo(page, top - pin + (i + 0.5) * step);
        await expect(roadmap(page).locator(".rm-stop").nth(i)).toHaveAttribute(
          "data-active",
          "true",
        );
        const box = await roadmap(page)
          .locator(".rm-stage")
          .evaluate((el) => {
            const r = el.getBoundingClientRect();
            const header = document.querySelector("header");
            return {
              top: r.top,
              bottom: r.bottom,
              left: r.left,
              right: r.right,
              below: header ? header.getBoundingClientRect().bottom : 0,
              width: document.documentElement.clientWidth,
              height: window.innerHeight,
            };
          });
        expect(box.top).toBeGreaterThanOrEqual(box.below - 1);
        expect(box.bottom).toBeLessThanOrEqual(box.height + 1);
        expect(box.left).toBeGreaterThanOrEqual(-1);
        expect(box.right).toBeLessThanOrEqual(box.width + 1);
      }
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }

  test("walking the tour shifts the layout by less than 0.1", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      const w = window as unknown as { cls: number };
      w.cls = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const shift = entry as PerformanceEntry & {
            value: number;
            hadRecentInput: boolean;
          };
          if (!shift.hadRecentInput) w.cls += shift.value;
        }
      }).observe({ type: "layout-shift", buffered: true });
    });
    await page.goto("/products");
    await expect(roadmap(page)).toHaveAttribute("data-tour", "on");
    const { top, step, pin } = await track(page);
    for (let i = 0; i < 6; i += 1) {
      await scrollTo(page, top - pin + (i + 0.5) * step);
      await expect.poll(() => activeIndex(page)).toBe(i);
    }
    const cls = await page.evaluate(
      () => (window as unknown as { cls: number }).cls,
    );
    expect(cls).toBeLessThan(0.1);
  });

  test("Tab reaches the six cards in road order", async ({ page }) => {
    await page.goto("/products");
    const buttons = cards(page).getByRole("button");
    await expect(buttons).toHaveCount(6);
    await buttons.first().focus();
    const names: string[] = [];
    for (let i = 0; i < 6; i += 1) {
      names.push(
        await page.evaluate(
          () => document.activeElement?.textContent?.trim() ?? "",
        ),
      );
      await page.keyboard.press("Tab");
    }
    const expected = await buttons.evaluateAll((all) =>
      all.map((el) => el.textContent?.trim() ?? ""),
    );
    expect(names).toEqual(expected);
    expect(names[0]).toMatch(/^1\./);
    expect(names[5]).toMatch(/^6\./);
  });

  test("the footer link For schools lands on Staff Hub with its card whole", async ({
    page,
  }) => {
    await page.goto("/products");
    const link = page
      .getByRole("contentinfo")
      .getByRole("link", { name: "For schools" });
    // The footer reveals as it scrolls in (shared scroll reveal): bring the
    // link into view and let it settle before clicking.
    await link.scrollIntoViewIfNeeded();
    await expect(link).toBeInViewport({ ratio: 1 });
    let last = "";
    await expect
      .poll(async () => {
        const rect = await link.boundingBox();
        if (!rect) return false;
        const box = JSON.stringify(rect);
        const still = box === last;
        last = box;
        return still;
      })
      .toBe(true);
    await link.click();
    await expect(page).toHaveURL(/#sxp$/);
    const stop = roadmap(page).locator(".rm-stop").nth(1);
    const card = stop.locator(".rm-card");
    await expect.poll(() => cardInView(card)).toBe(true);
    await expect(stop).toHaveAttribute("data-active", "true");
  });

  test.describe("phone", () => {
    test.use({ viewport: { width: 390, height: 800 } });

    test("each stop appears as it scrolls into view", async ({ page }) => {
      await page.goto("/products");
      await expect(roadmap(page)).toHaveAttribute("data-reveal", "armed");
      await expect(roadmap(page)).not.toHaveAttribute("data-tour", "on");
      await expect(roadmap(page).locator(".rm-stage")).not.toHaveCSS(
        "position",
        "sticky",
      );
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
      await expect(roadmap(page)).not.toHaveAttribute("data-tour", "on");
      await expect(roadmap(page).locator(".rm-stage")).not.toHaveCSS(
        "position",
        "sticky",
      );
      await expect(roadmap(page).locator("[data-selected]")).toHaveCount(0);
      await expect(roadmap(page).locator("[data-active]")).toHaveCount(0);
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
