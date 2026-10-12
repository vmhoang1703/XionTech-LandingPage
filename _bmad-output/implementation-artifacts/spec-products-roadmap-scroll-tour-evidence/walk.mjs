// Walks the scroll-tour UX checks on a production build and prints what it sees.
// BASE=http://localhost:3005 node _bmad-output/implementation-artifacts/spec-products-roadmap-scroll-tour-evidence/walk.mjs
import { chromium } from "@playwright/test";

const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = "_bmad-output/implementation-artifacts/spec-products-roadmap-scroll-tour-evidence";
const log = (k, v) => console.log(`${k}: ${v}`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const state = (page) =>
  page.evaluate(() => {
    const rm = document.querySelector(".rm");
    const stage = document.querySelector(".rm-stage") ?? rm;
    const box = stage.getBoundingClientRect();
    const stops = [...document.querySelectorAll(".rm-stop")];
    const active = stops.findIndex((s) => s.dataset.active === "true");
    const selected = stops.findIndex((s) => s.dataset.selected === "true");
    const header = document.querySelector("header")?.getBoundingClientRect().bottom ?? 0;
    return {
      tour: rm.dataset.tour ?? "-",
      active: active + 1,
      selected: selected + 1,
      stageTop: Math.round(box.top),
      fits: box.top >= header - 1 && box.bottom <= innerHeight + 1 && box.left >= 0 && box.right <= innerWidth + 1,
      sideways: document.documentElement.scrollWidth > innerWidth,
    };
  });

const browser = await chromium.launch({ channel: "chrome" });

// 1. 1280x800: scroll through the six steps, then past the roadmap.
{
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await context.addInitScript(() => {
    window.__cls = 0;
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
    }).observe({ type: "layout-shift", buffered: true });
  });
  const page = await context.newPage();
  await page.goto(`${BASE}/products`, { waitUntil: "load" });
  await sleep(800);
  const { top, height } = await page.evaluate(() => {
    const track = document.querySelector(".rm").getBoundingClientRect();
    return { top: track.top + scrollY, height: track.height };
  });
  log("track", `top ${Math.round(top)} height ${Math.round(height)}`);
  const steps = 6;
  for (let i = 0; i < steps; i += 1) {
    const y = top - 88 + ((i + 0.5) * (height - 800 + 88)) / steps;
    await page.evaluate((to) => scrollTo({ top: to, behavior: "instant" }), y);
    await sleep(700);
    log(`step ${i + 1}`, JSON.stringify(await state(page)));
    if (i === 0 || i === 2 || i === 5) await page.screenshot({ path: `${OUT}/tour-step-${i + 1}.png` });
  }
  await page.evaluate((to) => scrollTo({ top: to, behavior: "instant" }), top + height + 100);
  await sleep(500);
  log("past the roadmap", `demo band in view ${await page.evaluate(() => {
    const band = document.querySelector(".capture");
    const b = band.getBoundingClientRect();
    return b.top < innerHeight && b.bottom > 0;
  })} | stage stuck ${JSON.stringify((await state(page)).stageTop)}`);
  await page.screenshot({ path: `${OUT}/after-tour.png` });
  // Back up one step.
  await page.evaluate((to) => scrollTo({ top: to, behavior: "instant" }), top - 88 + (2.5 * (height - 800 + 88)) / steps);
  await sleep(700);
  log("scrolled back to step 3", JSON.stringify(await state(page)));
  log("CLS", (await page.evaluate(() => window.__cls)).toFixed(4));
  // Click a card mid-tour, Next, Esc.
  await page.locator(".rm-open").nth(1).click();
  const dialog = page.locator("dialog.road-dialog");
  log("modal", `${await dialog.evaluate((d) => d.open)} | ${await dialog.locator("h2").textContent()} | details button ${await dialog.getByRole("button", { name: /details/i }).count()}`);
  log("selected after click", (await state(page)).selected);
  await page.keyboard.press("Escape");
  await sleep(200);
  log("after Esc focus", await page.evaluate(() => document.activeElement?.textContent?.trim()));
  log("What we build", `#apps ${await page.locator("#apps").count()} | app dialogs ${await page.locator("dialog.pdetail").count()}`);
  await context.close();
}

// 2. Fit at other sizes.
for (const [w, h] of [[1440, 900], [1920, 1080], [1366, 768]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(`${BASE}/products`, { waitUntil: "load" });
  await sleep(600);
  await page.evaluate(() => {
    const track = document.querySelector(".rm").getBoundingClientRect();
    scrollTo({ top: track.top + scrollY + 200, behavior: "instant" });
  });
  await sleep(600);
  log(`fit ${w}x${h}`, JSON.stringify(await state(page)));
  await page.close();
}

// 3. Deep links.
for (const anchor of ["sxp", "pxp", "ai-tutor", "iot"]) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto(`${BASE}/products#${anchor}`, { waitUntil: "load" });
  await sleep(2500);
  const s = await state(page);
  const card = await page.evaluate(() => {
    const stop = document.querySelector('.rm-stop[data-active="true"] .rm-card');
    if (!stop) return "no active card";
    const b = stop.getBoundingClientRect();
    const header = document.querySelector("header").getBoundingClientRect().bottom;
    return `card fully visible ${b.top >= header - 1 && b.bottom <= innerHeight + 1}`;
  });
  log(`#${anchor}`, `active stop ${s.active} | ${card}`);
  if (anchor === "sxp") await page.screenshot({ path: `${OUT}/deeplink-sxp.png` });
  await page.close();
}

// 4. Reduced motion.
{
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto(`${BASE}/products`, { waitUntil: "load" });
  await sleep(500);
  log("reduced", JSON.stringify(await state(page)));
  await page.evaluate(() => document.querySelector(".rm").scrollIntoView({ block: "start", behavior: "instant" }));
  await page.screenshot({ path: `${OUT}/reduced.png` });
  await context.close();
}

// 5. Phone.
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${BASE}/products`, { waitUntil: "load" });
  await sleep(500);
  const marks = () => page.evaluate(() => [...document.querySelectorAll(".rm-stop")].map((s) => (s.dataset.in ? "in" : "-")).join(" "));
  log("phone at load", `${JSON.stringify(await state(page))} | ${await marks()}`);
  for (const y of [600, 1100, 1600, 2100]) {
    await page.evaluate((to) => scrollTo({ top: to, behavior: "instant" }), y);
    await sleep(800);
    log(`phone scrolled to ${y}`, await marks());
  }
  log("phone sideways", JSON.stringify((await state(page)).sideways));
  await page.screenshot({ path: `${OUT}/phone.png` });
  await page.close();
}

await browser.close();
