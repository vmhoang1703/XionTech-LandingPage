// Checks the shared hero motion on Andy's Not found page and takes screenshots.
// Run from the repo root: BASE=http://localhost:3005 node _bmad-output/implementation-artifacts/spec-1-6-inner-hero-motion-evidence/walk-404.mjs
import { chromium } from "@playwright/test";

const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = "_bmad-output/implementation-artifacts/spec-1-6-inner-hero-motion-evidence";
const browser = await chromium
  .launch()
  .catch(() => chromium.launch({ channel: "chrome" }));
const log = (k, v) => console.log(`${k}: ${v}`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const HERO = "section.page-hero";
const read = (page) =>
  page.locator(`${HERO} canvas.strands`).evaluate((c) => {
    const d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
    let h = 0;
    for (let i = 0; i < d.length; i += 97) h = (h * 31 + d[i]) | 0;
    return h;
  });

for (const width of [1280, 390]) {
  const context = await browser.newContext({ viewport: { width, height: 900 } });
  const page = await context.newPage();
  const response = await page.goto(`${BASE}/does-not-exist`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction((sel) => document.querySelector(sel)?.width !== 300, `${HERO} canvas.strands`);
  log(`${width}px status`, response.status());
  log(`${width}px art aria-hidden`, `${await page.locator(`${HERO} .aurora`).getAttribute("aria-hidden")} / ${await page.locator(`${HERO} canvas`).getAttribute("aria-hidden")}`);
  await sleep(500);
  const a = await read(page);
  await sleep(800);
  log(`${width}px ribbon moving early`, a !== (await read(page)));
  await sleep(5000);
  const c = await read(page);
  await sleep(1200);
  log(`${width}px ribbon still after 6s`, c === (await read(page)));
  log(`${width}px sideways scroll`, await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth));
  await page.screenshot({ path: `${OUT}/not-found-${width}.png` });
  await context.close();
}
await browser.close();
