// Walks every Story 3.1 UX checks line on a running dev server and prints what it observes.
// Run from the repo root: BASE=http://localhost:3005 node _bmad-output/implementation-artifacts/spec-3-1-dark-home-hero-evidence/walk.mjs
import { chromium } from "@playwright/test";

const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = "_bmad-output/implementation-artifacts/spec-3-1-dark-home-hero-evidence";
const browser = await chromium
  .launch()
  .catch(() => chromium.launch({ channel: "chrome" }));
const log = (k, v) => console.log(`${k}: ${v}`);

async function open(width, { javaScriptEnabled = true } = {}) {
  const context = await browser.newContext({
    viewport: { width, height: 900 },
    javaScriptEnabled,
  });
  const page = await context.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "load" });
  await page.waitForTimeout(800);
  return { page, context };
}

const style = (loc, props) =>
  loc.evaluate(
    (el, ps) => {
      const s = getComputedStyle(el);
      return ps.map((p) => `${p}=${s.getPropertyValue(p)}`).join("; ");
    },
    props,
  );

const { page, context } = await open(1280);
const hero = page.locator("section[aria-labelledby=home-hero-title]");
const box = await hero.boundingBox();
const header = await page.locator("header").first().boundingBox();
log("hero height / viewport - header", `${Math.round(box.height)} / ${900 - Math.round(header?.height ?? 0)}`);
log("hero background", await style(hero, ["background-color"]));
log("glow layer", await style(hero.locator(".silk-fallback"), ["background-image", "z-index"]));

const label = hero.locator(".label");
log("label", `${await label.textContent()} | ${await style(label, ["font-family", "text-transform", "color"])}`);
log("label rule", await label.evaluate((el) => getComputedStyle(el, "::before").backgroundColor));
const h1 = hero.locator("h1");
log("H1", `${await h1.textContent()} | ${await style(h1, ["font-family", "color"])}`);
log("highlight bar", await hero.locator(".hl").evaluate((el) => getComputedStyle(el, "::after").backgroundImage));
log("sub line", `${await hero.locator("p").first().textContent()} | ${await style(hero.locator("p").first(), ["color"])}`);

const links = hero.locator("a");
const buttons = hero.locator("button");
log("links / buttons in hero", `${await links.count()} / ${await buttons.count()}`);
const cta = links.first();
log("CTA", `${await cta.textContent()} -> ${await cta.getAttribute("href")} | icon svg: ${await cta.locator("svg").count()}`);
log("CTA style", await style(cta, ["background-image", "color", "border-radius", "height"]));
const before = (await cta.boundingBox()).y;
await cta.hover();
await page.waitForTimeout(400);
log("CTA hover lift px", Math.round((before - (await cta.boundingBox()).y) * 10) / 10);
await page.mouse.move(0, 0);
await page.waitForTimeout(400);
await cta.focus();
await page.keyboard.press("Shift+Tab");
await page.keyboard.press("Tab");
log("CTA focus", await page.evaluate(() => {
  const el = document.activeElement;
  const s = getComputedStyle(el);
  return `${el.textContent} [outline ${s.outlineStyle} ${s.outlineWidth} ${s.outlineColor}]`;
}));

for (const part of [".home-device-tablet", ".home-device-phone"]) {
  const d = hero.locator(part);
  log(part, `${await style(d, ["background-image", "border-radius", "box-shadow"])} | caption: ${await d.locator(".home-media").textContent()} | caption colour ${await style(d.locator(".home-media"), ["color", "background-color"])}`);
}
log("notch", await hero.locator(".home-notch").count());
log("img elements in hero", await hero.locator("img").count());
await hero.screenshot({ path: `${OUT}/hero-1280.png` });

await cta.click();
await page.waitForURL("**/products", { timeout: 5000 }).catch(() => undefined);
log("after CTA click URL", page.url());
await context.close();

const noJs = await open(1280, { javaScriptEnabled: false });
const nh = noJs.page.locator("section[aria-labelledby=home-hero-title]");
log("no-JS H1", await nh.locator("h1").textContent());
log("no-JS glow present", await nh.locator(".silk-fallback").count());
await nh.screenshot({ path: `${OUT}/hero-no-js-1280.png` });
await noJs.context.close();

for (const width of [900, 899, 390]) {
  const { page: p, context: c } = await open(width);
  const h = p.locator("section[aria-labelledby=home-hero-title]");
  const cols = await h.locator(".wrap").evaluate((g) => getComputedStyle(g).gridTemplateColumns.split(" ").length);
  const devW = Math.round((await h.locator(".home-devices").boundingBox()).width);
  const sideways = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  log(`layout ${width}px`, `${cols} columns, devices ${devW}px wide, sideways scroll: ${sideways}`);
  if (width !== 900) await h.screenshot({ path: `${OUT}/hero-${width}.png` });
  await c.close();
}

await browser.close();
