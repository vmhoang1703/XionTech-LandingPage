// Walks the products audience-flow UX checks and prints what it observes.
// BASE=http://localhost:3005 node _bmad-output/implementation-artifacts/spec-products-audience-flow-evidence/walk.mjs
import { chromium } from "@playwright/test";

const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = "_bmad-output/implementation-artifacts/spec-products-audience-flow-evidence";
const log = (k, v) => console.log(`${k}: ${v}`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Counts animation frames requested by the page, and layout shift.
const PROBE = () => {
  window.__raf = 0;
  const raf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = (cb) => {
    window.__raf += 1;
    return raf(cb);
  };
  window.__cls = 0;
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
  }).observe({ type: "layout-shift", buffered: true });
};

async function settle(page) {
  // Wait for smooth scrolling to stop: three equal scrollY readings.
  let last = -1;
  let same = 0;
  while (same < 3) {
    const y = await page.evaluate(() => scrollY);
    same = y === last ? same + 1 : 0;
    last = y;
    await sleep(150);
  }
}

const state = (page) =>
  page.evaluate(() => {
    const host = document.querySelector(".flow-canvas");
    const canvas = document.querySelector("canvas.flow-scene");
    const chapters = [...document.querySelectorAll("#flow .flow-chapter")].map(
      (c) => `${c.querySelector("h2").textContent}=${c.dataset.active ?? "-"}@${getComputedStyle(c).opacity}`,
    );
    const toggle = document.querySelector(".flow-toggle");
    return {
      chapters: chapters.join(", "),
      paused: host?.dataset.paused ?? "-",
      canvas: canvas && !canvas.hidden ? `${canvas.clientWidth}x${canvas.clientHeight}` : "hidden",
      fallback: document.querySelectorAll(".flow-fallback").length,
      toggle: toggle ? `${toggle.textContent.trim()} ${Math.round(toggle.getBoundingClientRect().height)}px` : "none",
      sideways: document.documentElement.scrollWidth > innerWidth,
    };
  });

// Colour at the middle top of the canvas: shows the sky.
const sky = async (page, name) => {
  const box = await page.locator(".flow-canvas").boundingBox();
  const shot = `${OUT}/${name}.png`;
  await page.screenshot({ path: shot });
  return `${shot.split("/").pop()} stage ${Math.round(box.x)},${Math.round(box.y)} ${Math.round(box.width)}x${Math.round(box.height)}`;
};

const scrollToChapter = async (page, i) => {
  await page.evaluate((n) => {
    const c = document.querySelectorAll("#flow .flow-chapter")[n];
    scrollTo({ top: c.getBoundingClientRect().top + scrollY - innerHeight / 2 + 40, behavior: "instant" });
  }, i);
  await settle(page);
  await sleep(1200); // camera tween is 900ms
};

const browser = await chromium.launch({ channel: "chrome" });

// 1. Desktop 1280: intro, chapters, camera, sky, CLS, off-screen.
{
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await context.addInitScript(PROBE);
  const page = await context.newPage();
  const res = await page.goto(`${BASE}/products`, { waitUntil: "load" });
  await sleep(1500);
  log("status", res.status());
  log("H1", await page.locator("h1").textContent());
  log("lede", await page.locator("#flow h1 + p").textContent());
  log("intro 1280", JSON.stringify(await state(page)));
  log("shot", await sky(page, "flow-1280-intro"));
  for (let i = 0; i < 4; i++) {
    await scrollToChapter(page, i);
    log(`chapter ${i + 1} 1280`, JSON.stringify(await state(page)));
    log("shot", await sky(page, `flow-1280-chapter-${i + 1}`));
  }
  log("CLS", (await page.evaluate(() => window.__cls)).toFixed(4));
  await page.evaluate(() => scrollTo({ top: document.querySelector("#apps").offsetTop + 600, behavior: "instant" }));
  await settle(page);
  await sleep(500);
  const a = await page.evaluate(() => window.__raf);
  await sleep(1000);
  const b = await page.evaluate(() => window.__raf);
  log("off-screen rAF in 1s", b - a);
  // Chapter link → card.
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await settle(page);
  await page.locator('#flow a[href="#ai-tutor"]').focus();
  log("link focus ring", await page.evaluate(() => { const s = getComputedStyle(document.activeElement); return `${s.outlineStyle} ${s.outlineWidth}`; }));
  await page.keyboard.press("Enter");
  await settle(page);
  log("after link", `${new URL(page.url()).hash} heading top ${Math.round(await page.evaluate(() => document.querySelector("#ai-tutor-h").getBoundingClientRect().top))}`);
  // Card dialog unchanged.
  await page.locator("#ai-tutor .pc-expand").click();
  log("dialog open", await page.locator("dialog#pd-ai-tutor").evaluate((d) => d.open));
  await page.keyboard.press("Escape");
  log("dialog closed", !(await page.locator("dialog#pd-ai-tutor").evaluate((d) => d.open)));
  await context.close();
}

// 2. Pause persists on reload; paused = no frames.
{
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await context.addInitScript(PROBE);
  const page = await context.newPage();
  await page.goto(`${BASE}/products`, { waitUntil: "load" });
  await page.locator(".flow-toggle").waitFor();
  await page.locator(".flow-toggle").click();
  log("after pause", JSON.stringify(await state(page)));
  const a = await page.evaluate(() => window.__raf);
  await sleep(1000);
  log("paused rAF in 1s", (await page.evaluate(() => window.__raf)) - a);
  await page.reload({ waitUntil: "load" });
  await page.locator(".flow-toggle").waitFor();
  log("after reload", JSON.stringify(await state(page)));
  await page.locator(".flow-toggle").click();
  await context.close();
}

// 3. Reduced motion.
{
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
  await context.addInitScript(PROBE);
  const page = await context.newPage();
  await page.goto(`${BASE}/products`, { waitUntil: "load" });
  await page.locator(".flow-toggle").waitFor();
  await scrollToChapter(page, 2);
  log("reduced chapter 3", JSON.stringify(await state(page)));
  const a = await page.evaluate(() => window.__raf);
  await sleep(1000);
  log("reduced rAF in 1s", (await page.evaluate(() => window.__raf)) - a);
  log("shot", await sky(page, "flow-1280-reduced"));
  await context.close();
}

// 4. Widths.
for (const w of [1024, 390]) {
  const context = await browser.newContext({ viewport: { width: w, height: 844 } });
  const page = await context.newPage();
  await page.goto(`${BASE}/products`, { waitUntil: "load" });
  await sleep(1500);
  await scrollToChapter(page, 1);
  log(`width ${w}`, JSON.stringify(await state(page)));
  log("shot", await sky(page, `flow-${w}`));
  await context.close();
}
await browser.close();

// 5. No WebGL.
{
  const nogl = await chromium.launch({ channel: "chrome", args: ["--disable-webgl", "--disable-3d-apis"] });
  const page = await nogl.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`${BASE}/products`, { waitUntil: "load" });
  await sleep(1500);
  await scrollToChapter(page, 0);
  log("no webgl", `${JSON.stringify(await state(page))} errors ${errors.length}`);
  log("shot", await sky(page, "flow-1280-no-webgl"));
  await nogl.close();
}
