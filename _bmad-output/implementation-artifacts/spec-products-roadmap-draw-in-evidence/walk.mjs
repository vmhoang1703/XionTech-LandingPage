// Walks the roadmap draw-in UX checks on a production build and prints what it sees.
// BASE=http://localhost:3005 node _bmad-output/implementation-artifacts/spec-products-roadmap-draw-in-evidence/walk.mjs
import { chromium } from "@playwright/test";

const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = "_bmad-output/implementation-artifacts/spec-products-roadmap-draw-in-evidence";
const log = (k, v) => console.log(`${k}: ${v}`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const CLS = () => {
  window.__cls = 0;
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
  }).observe({ type: "layout-shift", buffered: true });
};

// How many cards are really shown: the card (or a child) is hit at its centre.
const shownCards = (page) =>
  page.evaluate(() =>
    [...document.querySelectorAll(".rm-card")].filter((card) => {
      card.scrollIntoView({ block: "center", behavior: "instant" });
      const b = card.getBoundingClientRect();
      const hit = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
      return hit !== null && card.contains(hit);
    }).length,
  );

const browser = await chromium.launch({ channel: "chrome" });

// 1. Wide: load at the top, scroll the roadmap in, watch it draw.
{
  const context = await browser.newContext({ viewport: { width: 1280, height: 600 } });
  await context.addInitScript(CLS);
  const page = await context.newPage();
  await page.goto(`${BASE}/products`, { waitUntil: "load" });
  await sleep(800);
  log("wide at load", await page.locator(".rm").getAttribute("data-reveal"));
  await page.evaluate(() => document.querySelector(".rm").scrollIntoView({ block: "center", behavior: "instant" }));
  for (const at of [400, 1200, 3000]) {
    await sleep(at === 400 ? 400 : at === 1200 ? 800 : 1800);
    log(`wide +${at}ms`, `${await page.locator(".rm").getAttribute("data-reveal")}`);
    await page.screenshot({ path: `${OUT}/wide-${at}ms.png` });
  }
  log("wide cards shown after the draw", `${await shownCards(page)} of 6`);
  log("wide CLS", (await page.evaluate(() => window.__cls)).toFixed(4));
  // Card → modal → Next → Esc.
  const first = page.locator(".rm-open").first();
  await first.scrollIntoViewIfNeeded();
  await first.click();
  const dialog = page.locator("dialog.road-dialog");
  log("modal open", await dialog.evaluate((d) => d.open));
  log("modal title", await dialog.locator("h2").textContent());
  await dialog.getByRole("button", { name: /Attendance recorded/ }).click();
  log("after Next", await dialog.locator("h2").textContent());
  await page.keyboard.press("Escape");
  await sleep(200);
  log("after Esc", `open ${await dialog.evaluate((d) => d.open)} | focus on "${await page.evaluate(() => document.activeElement?.textContent?.trim())}"`);
  // Hand-over to the app dialog.
  await page.locator(".rm-open").nth(1).click();
  await dialog.getByRole("button", { name: "Open Staff Hub details" }).click();
  log("hand-over", `road modal ${await dialog.evaluate((d) => d.open)} | #pd-sxp ${await page.locator("dialog#pd-sxp").evaluate((d) => d.open)}`);
  await page.keyboard.press("Escape");
  await context.close();
}

// 2. Already in view at load: shown at once, no replay.
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 2200 } });
  await page.goto(`${BASE}/products`, { waitUntil: "load" });
  await sleep(400);
  log("tall viewport at load", await page.locator(".rm").getAttribute("data-reveal"));
  await page.close();
}

// 3. Reduced motion: static and complete.
{
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto(`${BASE}/products`, { waitUntil: "load" });
  await sleep(400);
  log("reduced", `${await page.locator(".rm").getAttribute("data-reveal")} | shown ${await shownCards(page)} of 6`);
  await page.evaluate(() => document.querySelector(".rm").scrollIntoView({ block: "center", behavior: "instant" }));
  await page.screenshot({ path: `${OUT}/reduced.png` });
  await context.close();
}

// 4. Narrow: stops reveal one by one as they scroll in.
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${BASE}/products`, { waitUntil: "load" });
  await sleep(500);
  const marks = () => page.evaluate(() => [...document.querySelectorAll(".rm-stop")].map((s) => (s.dataset.in ? "in" : "-")).join(" "));
  log("narrow at load", `${await page.locator(".rm").getAttribute("data-reveal")} | ${await marks()}`);
  const top = await page.evaluate(() => document.querySelector(".rm").getBoundingClientRect().top + scrollY);
  for (let step = 0; step < 4; step += 1) {
    await page.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), top - 400 + step * 700);
    await sleep(900);
    log(`narrow step ${step + 1}`, await marks());
    await page.screenshot({ path: `${OUT}/narrow-step-${step + 1}.png` });
  }
  log("narrow sideways scroll", await page.evaluate(() => document.documentElement.scrollWidth > innerWidth));
  await page.close();
}

await browser.close();
