// Walks every Story 3.2 UX checks line on a running dev server and prints what it observes.
// Motion is proven by comparing two screenshots of the hero background taken 1.5s apart.
// Run from the repo root: BASE=http://localhost:3005 node _bmad-output/implementation-artifacts/spec-3-2-silk-motion-toggle-evidence/walk.mjs
import { chromium } from "@playwright/test";

const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = "_bmad-output/implementation-artifacts/spec-3-2-silk-motion-toggle-evidence";
const browser = await chromium
  .launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] })
  .catch(() => chromium.launch({ channel: "chrome" }));
const log = (k, v) => console.log(`${k}: ${v}`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function open(width, options = {}) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, ...options });
  const page = await context.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "load" });
  await page.waitForTimeout(1500);
  return { page, context };
}

// A 30px strip at the hero's right edge, below the toggle: only the silk
// shows there (no text, devices or toggle drawn over it).
const strip = async (page) => {
  const box = await page
    .locator("section[aria-labelledby=home-hero-title]")
    .boundingBox();
  return page.screenshot({
    clip: { x: box.x + box.width - 30, y: box.y + 80, width: 30, height: box.height - 120 },
  });
};
async function moving(page) {
  const a = await strip(page);
  await sleep(1500);
  const b = await strip(page);
  return !a.equals(b);
}

const { page, context } = await open(1280);
const hero = page.locator("section[aria-labelledby=home-hero-title]");
const canvas = hero.locator("canvas");
log("canvas visible / aria-hidden", `${await canvas.isVisible()} / ${await canvas.getAttribute("aria-hidden")}`);
log("canvas z-index vs glow", `${await canvas.evaluate((c) => getComputedStyle(c).zIndex)} vs ${await hero.locator(".silk-fallback").evaluate((g) => getComputedStyle(g).zIndex)}`);
log("silk moving on load", await moving(page));

const toggle = hero.getByRole("button");
const tbox = await toggle.boundingBox();
const hbox = await hero.boundingBox();
log("toggle aria-pressed", await toggle.getAttribute("aria-pressed"));
log("toggle accessible name", await toggle.evaluate((b) => b.textContent.trim()));
log("toggle size px", `${Math.round(tbox.width)} x ${Math.round(tbox.height)}; top ${Math.round(tbox.y - hbox.y)}, right ${Math.round(hbox.x + hbox.width - tbox.x - tbox.width)}`);
log("toggle style", await toggle.evaluate((b) => {
  const s = getComputedStyle(b);
  return `opacity ${s.opacity}; background ${s.backgroundColor}; border ${s.borderColor}; radius ${s.borderRadius}`;
}));
log("label width hidden", await toggle.locator("span").evaluate((s) => s.getBoundingClientRect().width));
await toggle.screenshot({ path: `${OUT}/toggle-rest.png` });

await toggle.hover();
await page.waitForTimeout(500);
log("hover: opacity / label width", `${await toggle.evaluate((b) => getComputedStyle(b).opacity)} / ${Math.round(await toggle.locator("span").evaluate((s) => s.getBoundingClientRect().width))}`);
await toggle.screenshot({ path: `${OUT}/toggle-hover.png` });

await toggle.click();
await page.mouse.move(0, 0);
await page.waitForTimeout(400);
log("after click: name", await toggle.evaluate((b) => b.textContent.trim()));
log("after click: silk moving", await moving(page));
await toggle.click();
await page.mouse.move(0, 0);
await page.waitForTimeout(400);
log("after second click: name", await toggle.evaluate((b) => b.textContent.trim()));
log("after second click: silk moving", await moving(page));

await page.keyboard.press("Tab");
await toggle.focus();
await page.keyboard.press("Shift+Tab");
await page.keyboard.press("Tab");
await page.waitForTimeout(500);
log("keyboard focus", await page.evaluate(() => {
  const el = document.activeElement;
  const s = getComputedStyle(el);
  return `${el.textContent.trim()} [outline ${s.outlineStyle} ${s.outlineWidth} ${s.outlineColor}] label width ${Math.round(el.querySelector("span").getBoundingClientRect().width)}`;
}));
await page.keyboard.press("Enter");
await page.waitForTimeout(300);
log("Enter: name", await toggle.evaluate((b) => b.textContent.trim()));
await page.keyboard.press("Space");
await page.waitForTimeout(300);
log("Space: name", await toggle.evaluate((b) => b.textContent.trim()));
await hero.screenshot({ path: `${OUT}/hero-silk-1280.png` });

await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(500);
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(500);
log("after scrolling away and back: silk moving", await moving(page));
await context.close();

const reduced = await open(1280, { reducedMotion: "reduce" });
const rt = reduced.page.locator("section[aria-labelledby=home-hero-title]").getByRole("button");
log("reduced motion: name", await rt.evaluate((b) => b.textContent.trim()));
log("reduced motion: silk moving", await moving(reduced.page));
await reduced.context.close();

const noJs = await open(1280, { javaScriptEnabled: false });
const nh = noJs.page.locator("section[aria-labelledby=home-hero-title]");
log("JS off: toggle count / canvas visible", `${await nh.getByRole("button").count()} / ${await nh.locator("canvas").isVisible().catch(() => false)}`);
await noJs.context.close();

const noGl = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const ngp = await noGl.newPage();
await ngp.addInitScript(() => {
  const real = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (type, ...rest) {
    return type === "webgl" ? null : real.call(this, type, ...rest);
  };
});
await ngp.goto(`${BASE}/`, { waitUntil: "load" });
await ngp.waitForTimeout(1500);
const ngh = ngp.locator("section[aria-labelledby=home-hero-title]");
log("no WebGL: toggle count / canvas hidden", `${await ngh.getByRole("button").count()} / ${await ngh.locator("canvas").evaluate((c) => c.hidden)}`);
await noGl.close();

const mobile = await open(390);
const mh = mobile.page.locator("section[aria-labelledby=home-hero-title]");
const mb = await mh.getByRole("button").boundingBox();
const label = await mh.locator(".label").boundingBox();
log("390px: toggle right gap", Math.round(390 - mb.x - mb.width));
log("390px: toggle overlaps label", mb.y + mb.height > label.y && mb.x < label.x + label.width);
await mh.screenshot({ path: `${OUT}/hero-silk-390.png` });
await mobile.context.close();

await browser.close();
