// Walks every Story 3.4 UX checks line on the Home page and prints what it observes.
// Run from the repo root: BASE=http://localhost:3005 node _bmad-output/implementation-artifacts/spec-3-4-two-front-doors-evidence/walk.mjs
import { chromium } from "@playwright/test";

const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = "_bmad-output/implementation-artifacts/spec-3-4-two-front-doors-evidence";
const browser = await chromium
  .launch()
  .catch(() => chromium.launch({ channel: "chrome" }));
const log = (k, v) => console.log(`${k}: ${v}`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const HERO = "section[aria-labelledby=home-hero-title]";
const DOORS = 'section[aria-label="What we do"]';

async function open(width, options = {}) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, ...options });
  const page = await context.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "load" });
  await page.waitForSelector(DOORS);
  await sleep(600);
  return { page, context };
}
const style = (loc, props) =>
  loc.evaluate((el, ps) => ps.map((p) => `${p} ${getComputedStyle(el).getPropertyValue(p)}`).join("; "), props);
const overlap = async (page) => {
  const h = await page.locator(HERO).boundingBox();
  const d = await page.locator(DOORS).boundingBox();
  return Math.round(h.y + h.height - d.y);
};

const { page, context } = await open(1280);
const doors = page.locator(DOORS);
const [products, services] = [doors.locator("a").nth(0), doors.locator("a").nth(1)];
log("overlap with hero (px)", await overlap(page));
log("columns", await doors.locator(".doors-grid").evaluate((g) => getComputedStyle(g).gridTemplateColumns.split(" ").length));
log("products door", await style(products, ["background-image", "border-radius", "box-shadow"]));
log("products badges", (await products.locator(".badge").evaluateAll((bs) => bs.map((b) => `${b.textContent || "(icon)"} ${getComputedStyle(b).backgroundImage.slice(0, 40) || getComputedStyle(b).backgroundColor} ${getComputedStyle(b).color} ${b.querySelector("svg") ? "svg" : ""}`))).join(" | "));
log("products text", `${await products.locator("h2").textContent()} / line colour ${await products.locator("p").evaluate((p) => getComputedStyle(p).color)}`);
log("products chips", (await products.locator(".chip").evaluateAll((cs) => cs.map((c) => c.textContent))).join(", "));
log("products chip style", await style(products.locator(".chip").first(), ["background-color", "color", "border-radius"]));
log("services door", await style(services, ["background-image", "border-radius"]));
log("services label", `${await services.locator(".label").textContent()} | ${await style(services.locator(".label"), ["font-family", "text-transform"])}`);
log("services text", await services.locator("h2").textContent());
log("services chips", (await services.locator(".chip").evaluateAll((cs) => cs.map((c) => c.textContent))).join(", "));
log("services chip style", await style(services.locator(".chip").first(), ["background-color", "color"]));
log("arrow colours", `${await products.locator(".go").evaluate((g) => getComputedStyle(g).color)} / ${await services.locator(".go").evaluate((g) => getComputedStyle(g).color)}`);
log("accessible names", `${await products.evaluate((a) => a.textContent.replace(/\s+/g, " ").slice(0, 60))}… / ${await services.evaluate((a) => a.textContent.replace(/\s+/g, " ").slice(0, 50))}…`);
log("interactive inside doors", await doors.locator("a a, a button, a input").count());
await page.screenshot({ path: `${OUT}/doors-1280.png` });

// Scroll first, so the measured change is the hover lift, not the scroll.
await products.scrollIntoViewIfNeeded();
await page.mouse.move(0, 0);
await sleep(700);
const before = (await products.boundingBox()).y;
await products.hover();
await sleep(700);
log("hover: lift px / arrow", `${Math.round((before - (await products.boundingBox()).y) * 10) / 10} / ${await products.locator(".go").evaluate((g) => `${getComputedStyle(g).opacity} ${getComputedStyle(g).transform}`)}`);
await doors.screenshot({ path: `${OUT}/doors-hover-1280.png` });
await page.mouse.move(0, 0);
await sleep(700);

const stops = [];
await page.locator(`${HERO} a`).first().focus();
for (let i = 0; i < 3; i++) {
  await page.keyboard.press("Tab");
  stops.push(await page.evaluate(() => {
    const el = document.activeElement;
    const s = getComputedStyle(el);
    return `${el.getAttribute("href")} [${s.outlineStyle} ${s.outlineWidth} ${s.outlineColor}]`;
  }));
}
log("Tab stops after the hero CTA", stops.join("  >  "));

await products.click();
await page.waitForURL("**/products", { timeout: 5000 }).catch(() => undefined);
log("click Products door", page.url());
await page.goBack();
await page.waitForSelector(DOORS);
await page.locator(DOORS).locator("a").nth(1).click();
await page.waitForURL("**/services", { timeout: 5000 }).catch(() => undefined);
log("click Services door", page.url());
await context.close();

const reduced = await open(1280, { reducedMotion: "reduce" });
const rp = reduced.page.locator(DOORS).locator("a").first();
await rp.scrollIntoViewIfNeeded();
await sleep(300);
const rb = (await rp.boundingBox()).y;
await rp.hover();
await sleep(700);
log("reduced motion: lift px / arrow transform", `${Math.round((rb - (await rp.boundingBox()).y) * 10) / 10} / ${await rp.locator(".go").evaluate((g) => getComputedStyle(g).transform)}`);
await reduced.context.close();

for (const width of [900, 899, 390]) {
  const { page: p, context: c } = await open(width);
  const cols = await p.locator(`${DOORS} .doors-grid`).evaluate((g) => getComputedStyle(g).gridTemplateColumns.split(" ").length);
  const sideways = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  log(`layout ${width}px`, `${cols} columns, overlap ${await overlap(p)}px, sideways scroll ${sideways}`);
  if (width === 390) await p.locator(DOORS).screenshot({ path: `${OUT}/doors-390.png` });
  await c.close();
}

const order = await open(1280);
log("page order", (await order.page.evaluate(() => Array.from(document.querySelector("main").children).map((c) => c.getAttribute("aria-label") || c.getAttribute("aria-labelledby") || c.querySelector("h2")?.textContent || c.tagName))).join(" > "));
await order.context.close();
await browser.close();
