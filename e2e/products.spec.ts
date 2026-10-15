import { AxeBuilder } from "@axe-core/playwright";
import { expect, test, type Locator, type Page } from "@playwright/test";

const text = (html: string) => html.replaceAll(/<[^>]*>/g, "");

// The roadmap has one stop for each product: Parent Hub, Staff Hub, AI Tutor.
const STOPS = 3;

test(
  "products page responds 200 with the H1, the map, the four card anchors and no Updates link",
  { tag: "@smoke" },
  async ({ request }) => {
    const response = await request.get("/en/products");
    const html = await response.text();

    expect(response.status()).toBe(200);
    // Each title word is its own span (the hero entrance): compare the text.
    expect(text(html)).toContain("Built apart. Better together");
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

  // Each app's anchor and the roadmap stop it lands on. IoT has no stop: its
  // old link lands at the start of the roadmap, on the first stop.
  for (const [anchor, index, title] of [
    ["pxp", 0, "Parent Hub"],
    ["sxp", 1, "Staff Hub"],
    ["ai-tutor", 2, "AI Tutor"],
    ["iot", 0, "Parent Hub"],
  ] as const) {
    test(`/en/products#${anchor} makes stop ${index + 1} active with its card in view below the header`, async ({
      page,
    }) => {
      await page.goto(`/en/products#${anchor}`);
      const stop = page.locator("#map .rm-stop").nth(index);
      const card = stop.locator(".rm-card");
      await expect(card).toContainText(title);
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

test.describe("product roadmap", { tag: "@a11y" }, () => {
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

  test("the roadmap shows the H1 and three cards, one per product", async ({
    page,
  }) => {
    await page.goto("/en/products");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Built apart. Better together",
      }),
    ).toBeVisible();
    await expect(roadmap(page)).toBeVisible();
    await expect(cards(page)).toHaveCount(STOPS);
    await expect(cards(page)).toContainText([
      "Parent Hub",
      "Staff Hub",
      "AI Tutor",
    ]);
    await expect(cards(page).first()).toBeVisible();
  });

  test("scrolling walks the tour stop by stop, pinned, then the demo band follows", async ({
    page,
  }) => {
    await page.goto("/en/products");
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
          el.querySelectorAll(".rm-stop").length,
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

    for (let i = 0; i < STOPS; i += 1) {
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
      top - pin + STOPS * step + 400,
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
        step:
          (rect.height - stageEl.getBoundingClientRect().height) /
          el.querySelectorAll(".rm-stop").length,
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
    await page.goto("/en/products");
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
    for (let y = from + 1; y < from + STOPS * step; y += step / 8) {
      await scrollTo(page, y);
      // Let the page draw, so a stop passed between two frames is not skipped.
      await page.evaluate(
        () =>
          new Promise((done) =>
            requestAnimationFrame(() => requestAnimationFrame(done)),
          ),
      );
    }
    await expect
      .poll(() =>
        page.evaluate(() => (window as unknown as { seen: number[] }).seen),
      )
      .toEqual([0, 1, 2]);

    // Back up: the active stop follows, one step at a time.
    for (let i = STOPS - 1; i >= 0; i -= 1) {
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
      await page.goto("/en/products");
      await expect(roadmap(page)).toHaveAttribute("data-tour", "on");
      const { top, step, pin } = await track(page);
      for (let i = 0; i < STOPS; i += 1) {
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
    await page.goto("/en/products");
    await expect(roadmap(page)).toHaveAttribute("data-tour", "on");
    // Shifts while the page loads and reveals are not the tour's: count from
    // the moment it has settled.
    await page.waitForTimeout(1000);
    await page.evaluate(() => {
      (window as unknown as { cls: number }).cls = 0;
    });
    const { top, step, pin } = await track(page);
    for (let i = 0; i < STOPS; i += 1) {
      await scrollTo(page, top - pin + (i + 0.5) * step);
      await expect.poll(() => activeIndex(page)).toBe(i);
    }
    const cls = await page.evaluate(
      () => (window as unknown as { cls: number }).cls,
    );
    expect(cls).toBeLessThan(0.1);
  });

  test("Tab reaches the three cards in road order", async ({ page }) => {
    await page.goto("/en/products");
    const buttons = cards(page).getByRole("button");
    await expect(buttons).toHaveCount(STOPS);
    await buttons.first().focus();
    const names: string[] = [];
    for (let i = 0; i < STOPS; i += 1) {
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
    expect(names[STOPS - 1]).toMatch(/^3\./);
  });

  test("the footer link Staff Hub lands on Staff Hub with its card whole", async ({
    page,
  }) => {
    await page.goto("/en/products");
    const link = page
      .getByRole("contentinfo")
      .getByRole("link", { name: "Staff Hub", exact: true });
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
      await page.goto("/en/products");
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
      await page.goto("/en/products");
      await expect(roadmap(page)).toHaveAttribute("data-reveal", "static");
      await expect(roadmap(page)).not.toHaveAttribute("data-tour", "on");
      await expect(roadmap(page).locator(".rm-stage")).not.toHaveCSS(
        "position",
        "sticky",
      );
      await expect(roadmap(page).locator("[data-selected]")).toHaveCount(0);
      await expect(roadmap(page).locator("[data-active]")).toHaveCount(0);
      await expect(cards(page)).toHaveCount(STOPS);
      await expectOpen(page);
    });
  });

  test("a card opens the modal, Next moves, and Esc returns focus to the card", async ({
    page,
  }) => {
    await page.goto("/en/products");
    const first = page.getByRole("button", { name: "1. Parent Hub" });
    await first.scrollIntoViewIfNeeded();
    await first.click();

    const modal = page.locator("dialog.road-dialog");
    await expect(modal).toBeVisible();
    await expect(modal.getByRole("heading", { level: 2 })).toHaveText(
      "Parent Hub",
    );

    await modal.getByRole("button", { name: "Staff Hub" }).click();
    await expect(modal.getByRole("heading", { level: 2 })).toHaveText(
      "Staff Hub",
    );

    await page.keyboard.press("Escape");
    await expect(modal).toBeHidden();
    // Focus goes back to the card that opened the modal (the first one).
    await expect(first).toBeFocused();
  });

  // The stop dialog is a full-window stage: the 3D scene behind a card.
  const openStop = async (page: Page, name: string) => {
    const open = page.getByRole("button", { name });
    await open.scrollIntoViewIfNeeded();
    await open.click();
    const modal = page.locator("dialog.road-dialog");
    await expect(modal).toBeVisible();
    // The scene's chunk loads on this first click.
    await expect(modal.locator(".rd-scene")).toBeAttached();
    return { open, modal, card: modal.locator(".road-dialog-body") };
  };

  test("a stop opens over the whole window, the next title inside its button, the page still", async ({
    page,
  }) => {
    await page.goto("/en/products");
    const { modal, card } = await openStop(page, "2. Staff Hub");
    const size = page.viewportSize() as { width: number; height: number };

    // The dialog fills the window (it sat in the top-left corner).
    expect(await modal.boundingBox()).toEqual({ x: 0, y: 0, ...size });
    const cardBox = await card.boundingBox();
    expect(cardBox?.x).toBeGreaterThanOrEqual(0);
    expect((cardBox?.x ?? 0) + (cardBox?.width ?? 0)).toBeLessThanOrEqual(
      size.width,
    );
    expect((cardBox?.y ?? 0) + (cardBox?.height ?? 0)).toBeLessThanOrEqual(
      size.height,
    );

    // A long title (the product names are short, but a button may hold two
    // lines) stays inside its button and the card.
    const next = modal.locator(".road-dialog-nav button").last();
    await next.evaluate((el) => {
      el.firstChild?.replaceWith("Lighting and climate on the timetable");
    });
    const [nextBox, fit] = await Promise.all([
      next.boundingBox(),
      next.evaluate((el) => ({
        scroll: el.scrollWidth,
        client: el.clientWidth,
      })),
    ]);
    expect(fit.scroll).toBeLessThanOrEqual(fit.client);
    expect((nextBox?.x ?? 0) + (nextBox?.width ?? 0)).toBeLessThanOrEqual(
      (cardBox?.x ?? 0) + (cardBox?.width ?? 0),
    );

    // The page behind does not scroll under a wheel.
    const before = await page.evaluate(() => window.scrollY);
    await page.mouse.move(size.width - 200, 300);
    await page.mouse.wheel(0, 900);
    await page.waitForTimeout(300);
    expect(await page.evaluate(() => window.scrollY)).toBe(before);
  });

  test("the scene stands the product's device and is decoration; the card keeps the real text", async ({
    page,
  }) => {
    await page.goto("/en/products");
    const { modal, card } = await openStop(page, "2. Staff Hub");
    const scene = modal.locator(".rd-scene");
    await expect(scene).toHaveAttribute("aria-hidden", "true");
    await expect(scene).toHaveAttribute("data-play", "on");
    // Staff Hub is on a laptop: a screen on a hinge over a keyboard, with its
    // placeholder wireframe, its name and its real feature names.
    await expect(scene.locator('.dv[data-kind="laptop"]')).toHaveCount(1);
    await expect(scene.locator(".dv-lid .dv-screen")).toHaveCount(1);
    await expect(scene.locator(".ws-tag")).toHaveText("[Placeholder] screen");
    await expect(scene.locator(".ws-name")).toHaveText("Staff Hub");
    await expect(scene.locator(".ws-label")).toHaveText([
      "Attendance and student records",
      "Classes, timetables and grades",
      "Messages to parents through Parent Hub",
      "Leader dashboards for today's priorities",
    ]);
    await expect(scene.locator("button, a, [tabindex]")).toHaveCount(0);
    await expect(card.getByRole("heading", { level: 2 })).toHaveText(
      "Staff Hub",
    );
    await expect(card.getByRole("region", { name: "Staff Hub" })).toBeVisible();
    // Only transform and opacity move: the camera, the device and its screen.
    const moving = await scene.evaluate((el) =>
      el
        .getAnimations({ subtree: true })
        .flatMap((a) =>
          Object.keys((a.effect as KeyframeEffect).getKeyframes()[0]),
        )
        .filter(
          (key) =>
            !["offset", "computedOffset", "easing", "composite"].includes(key),
        ),
    );
    expect(new Set(moving)).toEqual(new Set(["opacity", "transform"]));
  });

  test("Next walks the road: the title, the device and the road follow", async ({
    page,
  }) => {
    await page.goto("/en/products");
    const { modal, card } = await openStop(page, "2. Staff Hub");
    const at = () =>
      modal
        .locator(".rd-ground")
        .evaluate((el) => (el as HTMLElement).style.getPropertyValue("--px"));
    const first = await at();
    await card.getByRole("button", { name: "AI Tutor" }).click();
    await expect(card.getByRole("heading", { level: 2 })).toHaveText(
      "AI Tutor",
    );
    await expect(modal.locator('.dv[data-kind="monitor"]')).toHaveCount(1);
    expect(await at()).not.toBe(first);
    // The last stop: Next is the end of the road, and Previous walks back.
    await expect(card.getByRole("button", { name: "Finish" })).toBeDisabled();
    await card.getByRole("button", { name: "Staff Hub" }).click();
    await card.getByRole("button", { name: "Parent Hub" }).click();
    await expect(card.getByRole("heading", { level: 2 })).toHaveText(
      "Parent Hub",
    );
    await expect(card.getByRole("button", { name: "Start" })).toBeDisabled();
    await expect(modal.locator('.dv[data-kind="phone"]')).toHaveCount(1);
  });

  test("Esc, the close button and a click outside close it, and focus returns to the card", async ({
    page,
  }) => {
    await page.goto("/en/products");
    const { open, modal, card } = await openStop(page, "1. Parent Hub");
    await page.keyboard.press("Escape");
    await expect(modal).toBeHidden();
    await expect(open).toBeFocused();

    await open.click();
    await expect(modal).toBeVisible();
    await card.getByRole("button", { name: "Close" }).click();
    await expect(modal).toBeHidden();
    await expect(open).toBeFocused();

    await open.click();
    await expect(modal).toBeVisible();
    // A click on the scene, right of the card.
    await page.mouse.click(1100, 200);
    await expect(modal).toBeHidden();
    await expect(open).toBeFocused();
  });

  test("a drag turns the view and does not close the stop", async ({
    page,
  }) => {
    await page.goto("/en/products");
    const { modal } = await openStop(page, "2. Staff Hub");
    await page.waitForTimeout(600);
    await page.mouse.move(900, 300);
    await page.mouse.down();
    await page.mouse.move(1100, 300, { steps: 8 });
    await page.mouse.up();
    await expect(modal).toBeVisible();
    const yaw = await modal
      .locator(".rd-scene")
      .evaluate((el) => (el as HTMLElement).style.getPropertyValue("--yaw"));
    expect(Number.parseFloat(yaw)).toBeGreaterThan(5);
  });

  test("the stop dialog passes axe with the card and the scene", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en/products");
    const { modal } = await openStop(page, "3. AI Tutor");
    await expect(modal.locator(".rd-scene")).toHaveAttribute(
      "data-play",
      "off",
    );
    const result = await new AxeBuilder({ page })
      .include("dialog.road-dialog")
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(
      result.violations.map(
        (v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`,
      ),
    ).toEqual([]);
  });

  test.describe("reduced motion", () => {
    test.use({ reducedMotion: "reduce" });

    test("the scene rests at its final view: no camera move, no rise, no look-around", async ({
      page,
    }) => {
      await page.goto("/en/products");
      const { modal } = await openStop(page, "2. Staff Hub");
      const scene = modal.locator(".rd-scene");
      await expect(scene).toHaveAttribute("data-play", "off");
      const state = await scene.evaluate((el) => ({
        running: el.getAnimations({ subtree: true }).length,
        device: getComputedStyle(el.querySelector(".dv-rise") as Element)
          .animationName,
        world: getComputedStyle(el.querySelector(".rd-world") as Element)
          .animationName,
      }));
      expect(state).toEqual({ running: 0, device: "none", world: "none" });
      await page.mouse.move(100, 100);
      await page.mouse.move(1200, 700);
      expect(
        await scene.evaluate((el) =>
          (el as HTMLElement).style.getPropertyValue("--yaw"),
        ),
      ).toBe("");
      // Still a stage: the device stands, its screen shows, and so does the card.
      await expect(scene.locator(".dv .ws")).toHaveCount(1);
      await expect(scene.locator(".dv .ws")).toHaveCSS("opacity", "1");
    });
  });

  test("a saved Pause also holds the scene still", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("xt-motion", "off"));
    await page.goto("/en/products");
    const { modal } = await openStop(page, "2. Staff Hub");
    await expect(modal.locator(".rd-scene")).toHaveAttribute(
      "data-play",
      "off",
    );
  });

  for (const [name, width, height] of [
    ["tablet", 820, 1180],
    ["phone", 390, 844],
  ] as const) {
    test(`${name}: the card is a sheet at the bottom and the scene fits above it`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height });
      await page.goto("/en/products");
      const { card, modal } = await openStop(page, "3. AI Tutor");
      const sheet = await card.boundingBox();
      expect(Math.round((sheet?.x ?? -1) + (sheet?.width ?? 0))).toBe(width);
      expect(Math.round((sheet?.y ?? 0) + (sheet?.height ?? 0))).toBe(height);
      // The device stands inside the window, above the sheet.
      const frame = await modal.locator(".rd-frame").boundingBox();
      expect(frame?.y).toBe(0);
      expect((frame?.y ?? 0) + (frame?.height ?? 0)).toBeLessThanOrEqual(
        (sheet?.y ?? 0) + 1,
      );
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }

  test("a landscape phone keeps the card beside the scene and scrolls inside it", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 844, height: 390 });
    await page.goto("/en/products");
    const { card } = await openStop(page, "2. Staff Hub");
    const box = await card.boundingBox();
    expect(box?.y).toBeGreaterThanOrEqual(0);
    expect((box?.y ?? 0) + (box?.height ?? 0)).toBeLessThanOrEqual(390);
    expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThan(844 / 2 + 24);
    // The Close button stays in reach while the card scrolls.
    await card.evaluate((el) => el.scrollTo(0, el.scrollHeight));
    await expect(card.getByRole("button", { name: "Close" })).toBeInViewport();
  });

  test("390px has no sideways scroll", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto("/en/products");
    await expect(cards(page)).toHaveCount(STOPS);
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
