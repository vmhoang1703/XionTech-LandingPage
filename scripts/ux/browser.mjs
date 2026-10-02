// Playwright side of the UX quality scripts. Pure logic lives in lib.mjs.
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";
import { STYLE_PROPS, firstLine } from "./lib.mjs";

/** The approved HTML prototype (UX reference) inside the repo. */
export const DEFAULT_PROTOTYPE_ROOT =
  "_bmad-output/planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/mockups/site-v3";

/** Playwright's bundled Chromium, or the installed Chrome when it is missing. */
export async function launchBrowser() {
  try {
    return await chromium.launch();
  } catch (bundledError) {
    try {
      return await chromium.launch({ channel: "chrome" });
    } catch {
      throw new Error(
        `No browser available: run "npx playwright install chromium". (${bundledError.message})`,
      );
    }
  }
}

export function prototypeUrl(surface) {
  const root = resolve(
    process.cwd(),
    surface.prototypeRoot ?? DEFAULT_PROTOTYPE_ROOT,
  );
  return pathToFileURL(resolve(root, surface.prototype)).href;
}

export function devUrl(surface, base) {
  return new URL(surface.route, base).href;
}

/**
 * How long a page's ready selector, a state action or a probe step may wait for its element. A
 * ready selector or state action that times out stops the run with a clear message; a probe step
 * that times out becomes an error row.
 */
const ACTION_TIMEOUT_MS = 5000;

/** Opens a page and waits until it is ready (and the optional ready selector exists). */
export async function openPage(context, url, readySelector) {
  const page = await context.newPage();
  try {
    // Not "networkidle": a production build prefetches linked routes, and those requests can stay
    // open, so the network never goes idle. Wait for the load event, the fonts and the ready part.
    await page.goto(url, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    if (readySelector)
      await page.waitForSelector(readySelector, { timeout: ACTION_TIMEOUT_MS });
  } catch (error) {
    throw new Error(
      `Cannot open ${url}${readySelector ? ` (waiting for "${readySelector}")` : ""}: ${firstLine(error)}. ` +
        'For the app, start it first (npm run dev) or pass --dev <url>; for the prototype, check the surface file\'s "prototype".',
    );
  }
  return page;
}

/** Runs a state's actions: click, hover, focus, press (keyboard key) or wait (ms). */
export async function runActions(page, actions, label = "actions") {
  for (const action of actions) {
    const timeout = { timeout: ACTION_TIMEOUT_MS };
    try {
      if (action.click) await page.locator(action.click).first().click(timeout);
      else if (action.hover)
        await page.locator(action.hover).first().hover(timeout);
      else if (action.focus)
        await page.locator(action.focus).first().focus(timeout);
      else if (action.press) await page.keyboard.press(action.press);
      else if ("wait" in action) await page.waitForTimeout(action.wait);
      else throw new Error("unknown action");
    } catch (error) {
      throw new Error(
        `${label}: ${JSON.stringify(action)} failed: ${firstLine(error)}`,
      );
    }
  }
}

/** Box and computed styles of the first visible match, or null when hidden or absent. */
export async function readElement(page, selector) {
  return page.evaluate(
    ([sel, props]) => {
      // Visible means: has a size, is not visibility:hidden and is at least partly on screen
      // (the unfocused skip link sits at left:-999px and must count as hidden).
      const el = [...document.querySelectorAll(sel)].find((e) => {
        const r = e.getBoundingClientRect();
        const onScreen =
          r.right > 0 &&
          r.bottom > 0 &&
          r.left < innerWidth &&
          r.top < innerHeight;
        return (
          r.width > 0 &&
          r.height > 0 &&
          onScreen &&
          getComputedStyle(e).visibility !== "hidden"
        );
      });
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      const styles = {};
      for (const prop of props) styles[prop] = s[prop];
      styles.fontFamily = s.fontFamily.split(",")[0].replaceAll('"', "").trim();
      styles.borderBottom = `${s.borderBottomWidth} ${s.borderBottomStyle} ${s.borderBottomColor}`;
      return {
        box: {
          x: Math.round(r.x),
          y: Math.round(r.y),
          width: Math.round(r.width),
          height: Math.round(r.height),
        },
        styles,
        hasText: (el.innerText ?? el.textContent ?? "").trim().length > 0,
        children: el.children.length,
      };
    },
    [selector, STYLE_PROPS],
  );
}

/** PNG buffer of a box on the page (CSS pixels), clamped to the viewport. */
export async function captureBox(page, box) {
  const { width: vw, height: vh } = page.viewportSize();
  const x = Math.max(0, box.x);
  const y = Math.max(0, box.y);
  const width = Math.max(1, Math.min(box.x + box.width, vw) - x);
  const height = Math.max(1, Math.min(box.y + box.height, vh) - y);
  return page.screenshot({ clip: { x, y, width, height } });
}

/** True when the first match is rendered, on screen and not faded out. */
export async function isOpen(page, selector) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return false;
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return (
      r.width > 0 &&
      r.height > 0 &&
      s.visibility !== "hidden" &&
      Number(s.opacity) > 0.01
    );
  }, selector);
}

/**
 * One interaction probe on one side: what happens to `observe` after a visitor's action on
 * `trigger` (hovering `hover`, default the trigger). Returns "open" or "closed"; after Escape
 * also where focus went.
 */
export async function runProbeEvent(page, probe, side, event) {
  // Probe pages only: a hidden trigger fails in 5s, not Playwright's 30s. Screenshots keep 30s.
  page.setDefaultTimeout(ACTION_TIMEOUT_MS);
  // A selector that matches nothing must not read as "closed" on both sides and pass as "same".
  for (const key of ["trigger", "observe", ...(probe.hover ? ["hover"] : [])]) {
    if ((await page.locator(probe[key][side]).count()) === 0)
      return `error: ${key} not found`;
  }
  const trigger = page.locator(probe.trigger[side]).first();
  const hoverTarget = page
    .locator((probe.hover ?? probe.trigger)[side])
    .first();
  const panel = page.locator(probe.observe[side]).first();
  const { width, height } = page.viewportSize();
  const settle = () => page.waitForTimeout(400); // longer than the prototype's 0.3s fade
  const leave = () => page.mouse.move(Math.round(width / 2), height - 10);
  if (event === "hover") {
    await hoverTarget.hover();
  } else if (event === "hover-then-leave") {
    await hoverTarget.hover();
    await settle();
    await leave();
  } else if (event === "hover-into-panel") {
    // The classic hover-menu test: travel from the trigger across the gap into the panel.
    await trigger.hover();
    await settle();
    const box = await panel.boundingBox();
    if (box)
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, {
        steps: 12,
      });
  } else if (event === "hover-then-click") {
    await hoverTarget.hover();
    await settle();
    await trigger.click();
  } else if (event === "click") {
    await trigger.click();
  } else if (event === "click-then-leave") {
    await trigger.click();
    await settle();
    await leave();
  } else if (event === "click-twice") {
    await trigger.click();
    await settle();
    await trigger.click();
  } else if (event === "keyboard") {
    await trigger.focus();
    await page.keyboard.press("Enter");
  } else if (event === "escape") {
    await trigger.click();
    await settle();
    await page.keyboard.press("Escape");
  }
  await settle();
  const state = (await isOpen(page, probe.observe[side])) ? "open" : "closed";
  if (event !== "escape") return state;
  const onTrigger = await trigger.evaluate(
    (el) => el === document.activeElement,
  );
  return `${state}, focus ${onTrigger ? "on trigger" : "elsewhere"}`;
}
