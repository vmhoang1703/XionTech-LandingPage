// Walks every Story 1.6 (motion part) UX checks line on /demo and prints what it observes.
// Motion is proven by comparing screenshots of the hero background over time.
// Run from the repo root: BASE=http://localhost:3005 node _bmad-output/implementation-artifacts/spec-1-6-inner-hero-motion-evidence/walk.mjs
import { chromium } from "@playwright/test";

const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = "_bmad-output/implementation-artifacts/spec-1-6-inner-hero-motion-evidence";
const browser = await chromium
  .launch()
  .catch(() => chromium.launch({ channel: "chrome" }));
const log = (k, v) => console.log(`${k}: ${v}`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const HERO = "section.page-hero";

async function open(width, options = {}) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, ...options });
  const page = await context.newPage();
  await page.goto(`${BASE}/demo`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector(`${HERO} h1`);
  return { page, context };
}

// The ribbon's own pixels plus the aurora's animation state: the form card
// and text sit over the background, so a screenshot cannot isolate the art.
const strip = (page) =>
  page.locator(`${HERO} canvas.strands`).evaluate((c) => {
    const ctx = c.getContext("2d");
    const data = ctx.getImageData(0, 0, c.width, c.height).data;
    let hash = 0;
    for (let i = 0; i < data.length; i += 97) hash = (hash * 31 + data[i]) | 0;
    const drift = c.parentElement
      .querySelector(".aurora")
      .getAnimations()
      .map((a) => `${a.playState}@${Math.round(a.currentTime ?? 0)}`)
      .join(",");
    return { hash, drift };
  });
const same = (x, y) => x.hash === y.hash;

const { page, context } = await open(1280);
const hero = page.locator(HERO);
const aurora = hero.locator(".aurora");
const canvas = hero.locator("canvas.strands");
log("aurora / canvas aria-hidden", `${await aurora.getAttribute("aria-hidden")} / ${await canvas.getAttribute("aria-hidden")}`);
log("aurora style", await aurora.evaluate((a) => {
  const s = getComputedStyle(a);
  return `filter ${s.filter}; animation ${s.animationName} ${s.animationDuration} ${s.animationFillMode}; z ${s.zIndex}`;
}));
log("focusable inside art", await hero.locator(".aurora [tabindex], canvas[tabindex]").count());

const hl = hero.locator(".hl");
log("highlight word", await hl.textContent());
log("highlight animation", await hl.evaluate((el) => {
  const s = getComputedStyle(el, "::after");
  return `${s.animationName} ${s.animationDuration} delay ${s.animationDelay}`;
}));
await sleep(200);
log("highlight scale soon after load (drawing in)", await hl.evaluate((el) => getComputedStyle(el, "::after").transform));
await page.screenshot({ path: `${OUT}/demo-1280-start.png`, fullPage: false });

const a = await strip(page);
await sleep(800);
const b = await strip(page);
log("ribbon moving at 1-2s", !same(a, b));
log("aurora at 1-2s", `${a.drift} -> ${b.drift}`);
await sleep(5500);
log("highlight scale after 2s", await hl.evaluate((el) => getComputedStyle(el, "::after").transform));
const c = await strip(page);
await sleep(1500);
const d = await strip(page);
log("ribbon still after 6s", same(c, d));
log("aurora after 6s", `${c.drift} -> ${d.drift}`);
await page.screenshot({ path: `${OUT}/demo-1280.png`, fullPage: false });
await page.screenshot({ path: `${OUT}/demo-1280-full.png`, fullPage: true });
log("sideways scroll 1280", await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth));
await context.close();

// Under reduced motion the ribbon is drawn at one fixed frame when the effect
// mounts and never again. Pixel reads right after the first draw can return
// the not-yet-painted canvas, so count draw calls instead: none may happen
// once the canvas has settled.
const reducedContext = await browser.newContext({
  viewport: { width: 1280, height: 900 },
  reducedMotion: "reduce",
});
const reducedPage = await reducedContext.newPage();
await reducedPage.addInitScript(() => {
  window.__draws = 0;
  const clear = CanvasRenderingContext2D.prototype.clearRect;
  CanvasRenderingContext2D.prototype.clearRect = function (...args) {
    window.__draws++;
    return clear.apply(this, args);
  };
});
await reducedPage.goto(`${BASE}/demo`, { waitUntil: "domcontentloaded" });
await reducedPage.waitForFunction(
  (sel) => document.querySelector(sel)?.width !== 300,
  `${HERO} canvas.strands`,
);
await sleep(800);
const settled = await reducedPage.evaluate(() => window.__draws);
await sleep(2000);
const later = await reducedPage.evaluate(() => window.__draws);
const reduced = { page: reducedPage, context: reducedContext };
const r2 = await strip(reducedPage);
log("reduced motion: draws at load / in the next 2s", `${settled} / ${later - settled}`);
log("reduced motion: aurora animations", r2.drift || "none");
log("reduced motion: highlight", await reduced.page.locator(`${HERO} .hl`).evaluate((el) => `${getComputedStyle(el, "::after").animationName} ${getComputedStyle(el, "::after").transform}`));
await reduced.context.close();

const noJs = await open(1280, { javaScriptEnabled: false });
log("JS off: aurora shown / ribbon drawn", `${await noJs.page.locator(`${HERO} .aurora`).isVisible()} / canvas size ${await noJs.page.locator(`${HERO} canvas`).evaluate((c) => `${c.width}x${c.height}`)}`);
log("JS off: H1", await noJs.page.locator(`${HERO} h1`).textContent());
await noJs.page.screenshot({ path: `${OUT}/demo-no-js-1280.png` });
await noJs.context.close();

// Scroll away during the run, resize while away, come back after the run:
// the ribbon must be repainted (held frame), not left blank.
const back = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const backPage = await back.newPage();
await backPage.addInitScript(() => {
  window.__draws = 0;
  const clear = CanvasRenderingContext2D.prototype.clearRect;
  CanvasRenderingContext2D.prototype.clearRect = function (...args) {
    window.__draws++;
    return clear.apply(this, args);
  };
});
await backPage.goto(`${BASE}/demo`, { waitUntil: "domcontentloaded" });
await backPage.waitForFunction(
  (sel) => document.querySelector(sel)?.width !== 300,
  `${HERO} canvas.strands`,
);
// /demo is shorter than hero + viewport, so add a spacer (walk only) to let
// the hero leave the screen completely.
await backPage.evaluate(() => {
  const spacer = document.createElement("div");
  spacer.style.height = "4000px";
  document.body.append(spacer);
  window.scrollTo(0, document.body.scrollHeight);
});
await sleep(300);
log("scrolled away: hero bottom above viewport", await backPage.locator(HERO).evaluate((h) => h.getBoundingClientRect().bottom < 0));
await sleep(6000);
await backPage.setViewportSize({ width: 1100, height: 900 });
await sleep(500);
const drawsAway = await backPage.evaluate(() => window.__draws);
await backPage.evaluate(() => window.scrollTo(0, 0));
await sleep(600);
const drawsBack = await backPage.evaluate(() => window.__draws);
log("scrolled away, resized, back: repainted on return", drawsBack > drawsAway);
await back.close();

const mobile = await open(390);
await sleep(6500);
log("sideways scroll 390", await mobile.page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth));
await mobile.page.screenshot({ path: `${OUT}/demo-390.png`, fullPage: false });
await mobile.page.screenshot({ path: `${OUT}/demo-390-full.png`, fullPage: true });
await mobile.context.close();

await browser.close();
