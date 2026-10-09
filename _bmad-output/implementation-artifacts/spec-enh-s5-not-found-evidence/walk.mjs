// Walks the E-S5 UX checks on an unknown path and prints what it observes.
// BASE=http://localhost:3005 node _bmad-output/implementation-artifacts/spec-enh-s5-not-found-evidence/walk.mjs
import { chromium } from "@playwright/test";

const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = "_bmad-output/implementation-artifacts/spec-enh-s5-not-found-evidence";
const browser = await chromium.launch({ channel: "chrome" });
const log = (k, v) => console.log(`${k}: ${v}`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

for (const [w, options] of [[1280, {}], [860, {}], [390, {}], [1280, { reducedMotion: "reduce" }]]) {
  const context = await browser.newContext({ viewport: { width: w, height: 900 }, ...options });
  const page = await context.newPage();
  const res = await page.goto(`${BASE}/does-not-exist`, { waitUntil: "load" });
  await sleep(600);
  const tag = `${w}${options.reducedMotion ? " reduced" : ""}`;
  if (w === 1280 && !options.reducedMotion) {
    log("status", res.status());
    log("title", await page.title());
    log("robots", (await page.locator('meta[name="robots"]').evaluateAll((ms) => ms.map((m) => m.getAttribute("content")))).join(", "));
    log("H1", `"${await page.locator("h1").textContent()}" | hl ${await page.locator("h1 .hl").count()} | label ${await page.locator(".label").count()}`);
    log("lede", await page.locator("h1 + p").textContent());
    log("buttons", (await page.locator(".btn").evaluateAll((as) => as.map((a) => `${a.textContent.trim()} -> ${a.getAttribute("href")} (${a.className.includes("primary") ? "primary" : "glass"})`))).join(", "));
    await page.locator(".btn").first().focus();
    log("focus ring", await page.evaluate(() => { const a = document.activeElement; return `${getComputedStyle(a).outlineStyle} ${getComputedStyle(a).outlineWidth}`; }));
    log("hero art", await page.locator(".aurora, canvas.strands").count());
  }
  log(`map ${tag}`, await page.evaluate(() => {
    const m = document.querySelector(".trail-map"); const r = m.getBoundingClientRect(); const c = document.querySelector(".trail-grid > div").getBoundingClientRect();
    const labels = [...m.querySelectorAll("text")].map((t) => { const b = t.getBoundingClientRect(); return `${t.textContent} ${Math.round(b.left)}-${Math.round(b.right)} size ${getComputedStyle(t).fontSize}`; });
    const x = m.querySelector(".tm-x").getBoundingClientRect();
    return `aria-hidden ${m.getAttribute("aria-hidden")} | beside copy ${r.left > c.right - 1} | width ${Math.round(r.width)} | ${labels.join("; ")} | X at ${Math.round(x.left)},${Math.round(x.top)} | trail anim ${getComputedStyle(m.querySelector(".tm-trail")).animationName} | ring anim ${getComputedStyle(m.querySelector(".tm-here-ring")).animationName} ring stroke-opacity ${getComputedStyle(m.querySelector(".tm-here-ring")).strokeOpacity} | sideways ${document.documentElement.scrollWidth > innerWidth}`;
  }));
  await page.screenshot({ path: `${OUT}/not-found-${w}${options.reducedMotion ? "-reduced" : ""}.png` });
  await context.close();
}
{ const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${BASE}/does-not-exist`, { waitUntil: "load" });
  await page.getByRole("link", { name: "Go to Home" }).click();
  await page.waitForURL(`${BASE}/`);
  log("Go to Home", new URL(page.url()).pathname);
  await context.close(); }
await browser.close();
