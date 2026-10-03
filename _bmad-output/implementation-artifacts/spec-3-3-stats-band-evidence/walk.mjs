// Walks every Story 3.3 UX checks line on the Home page and prints what it observes.
// Run from the repo root: BASE=http://localhost:3005 node _bmad-output/implementation-artifacts/spec-3-3-stats-band-evidence/walk.mjs
import { chromium } from "@playwright/test";

const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = "_bmad-output/implementation-artifacts/spec-3-3-stats-band-evidence";
const browser = await chromium
  .launch()
  .catch(() => chromium.launch({ channel: "chrome" }));
const log = (k, v) => console.log(`${k}: ${v}`);
const BAND = 'section[aria-labelledby=home-hero-title] [role="group"]';

async function open(width) {
  const context = await browser.newContext({
    viewport: { width, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "load" });
  await page.waitForSelector(BAND);
  await page.waitForTimeout(600);
  return { page, context };
}

const { page, context } = await open(1280);
const band = page.locator(BAND);
const label = band.locator("h2");
const box = await band.boundingBox();
log("band bottom within first screen (px)", `${Math.round(box.y + box.height)} of 900`);
log("label", `${await label.textContent()} | ${await label.evaluate((l) => {
  const s = getComputedStyle(l);
  return `${s.fontFamily.split(",")[0]} ${s.textTransform}; rule ${getComputedStyle(l, "::before").backgroundColor}`;
})}`);
log("line above figures", await band.locator("ul").evaluate((u) => `${getComputedStyle(u).borderTopWidth} ${getComputedStyle(u).borderTopColor}`));
log("accessible group name", await band.evaluate((g) => document.getElementById(g.getAttribute("aria-labelledby")).textContent));
const items = band.locator("li");
log("figures", (await items.evaluateAll((ls) => ls.map((l) => `${l.firstElementChild.textContent} | ${l.lastElementChild.textContent}`))).join("  //  "));
log("figure style", await items.first().locator("p").first().evaluate((p) => {
  const s = getComputedStyle(p);
  return `${s.fontFamily.split(",")[0]} ${s.fontWeight} ${s.fontSize} ${s.color}`;
}));
log("suffix colour", await items.first().locator("span").evaluate((s) => getComputedStyle(s).color));
log("caption", await items.first().locator("p").last().evaluate((p) => `${getComputedStyle(p).color}; max-width ${getComputedStyle(p).maxWidth}`));
log("dividers (left border per item)", (await items.evaluateAll((ls) => ls.map((l) => getComputedStyle(l).borderLeftWidth))).join(" "));
await page.locator("section[aria-labelledby=home-hero-title]").screenshot({ path: `${OUT}/hero-stats-1280.png` });
await context.close();

for (const width of [1080, 1079, 640, 639, 390]) {
  const { page: p, context: c } = await open(width);
  const ul = p.locator(`${BAND} ul`);
  const cols = await ul.evaluate((u) => getComputedStyle(u).gridTemplateColumns.split(" ").length);
  const rowGap = await ul.evaluate((u) => getComputedStyle(u).rowGap);
  const borders = (await p.locator(`${BAND} li`).evaluateAll((ls) => ls.map((l) => getComputedStyle(l).borderLeftWidth))).join(" ");
  const sideways = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  log(`layout ${width}px`, `${cols} columns, row gap ${rowGap}, borders ${borders}, sideways scroll ${sideways}`);
  if (width === 1079 || width === 390) await p.locator(BAND).screenshot({ path: `${OUT}/stats-${width}.png` });
  await c.close();
}
await browser.close();
