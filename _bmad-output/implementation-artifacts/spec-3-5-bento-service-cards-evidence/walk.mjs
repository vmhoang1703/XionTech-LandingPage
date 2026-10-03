// Walks every Story 3.5 UX checks line on the Home page and prints what it observes.
// Run from the repo root: BASE=http://localhost:3005 node _bmad-output/implementation-artifacts/spec-3-5-bento-service-cards-evidence/walk.mjs
import { chromium } from "@playwright/test";

const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = "_bmad-output/implementation-artifacts/spec-3-5-bento-service-cards-evidence";
const browser = await chromium
  .launch()
  .catch(() => chromium.launch({ channel: "chrome" }));
const log = (k, v) => console.log(`${k}: ${v}`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const BENTO = 'section[aria-labelledby="apps-title"]';
const SVC = 'section[aria-labelledby="services-title"]';

async function open(width, options = {}) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, ...options });
  const page = await context.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "load" });
  await page.waitForSelector(SVC);
  await sleep(500);
  return { page, context };
}
const css = (loc, props) =>
  loc.evaluate((el, ps) => ps.map((p) => `${p} ${getComputedStyle(el).getPropertyValue(p).slice(0, 70)}`).join("; "), props);
const tile = (page, id) => page.locator(`${BENTO} .t-${id}`);

const { page, context } = await open(1280);
const bento = page.locator(BENTO);
log("bento section", await css(bento, ["background-image"]));
log("linen texture", await bento.evaluate((s) => getComputedStyle(s, "::after").backgroundImage.slice(0, 60)));
log("bento head", `${await bento.locator("h2").textContent()} | ${await bento.locator(".lede").textContent()}`);
const box = async (id) => {
  const b = await tile(page, id).boundingBox();
  return `${Math.round(b.width)}x${Math.round(b.height)}@${Math.round(b.x)},${Math.round(b.y)}`;
};
log("grid columns", await bento.locator(".bento").evaluate((g) => getComputedStyle(g).gridTemplateColumns.split(" ").length));
log("tiles (w x h @ x,y)", `PXP ${await box("pxp")} | SXP ${await box("sxp")} | LXP ${await box("lxp")} | IoT ${await box("iot")}`);
for (const id of ["pxp", "sxp", "lxp", "iot"]) {
  const t = tile(page, id);
  log(`tile ${id}`, `${await css(t, ["background-image", "border-radius"])} | badge ${await t.locator(".badge").evaluate((b) => `${b.className} ${getComputedStyle(b).width} ${b.textContent || "(svg)"}`)} | name ${await t.locator("h3 a").getAttribute("aria-label")} | full ${await t.locator(".full").evaluate((f) => `${getComputedStyle(f).fontFamily.split(",")[0]} ${getComputedStyle(f).color}`)} | chips ${(await t.locator(".chip").allTextContents()).join(", ") || "-"} | arrow ${await t.locator(".go").count()}`);
}
const phone = tile(page, "pxp").locator(".mini-phone");
log("mini phone", `${await css(phone, ["transform", "width"])} | ${await phone.textContent()} | aria-hidden ${await phone.getAttribute("aria-hidden")} | bottom past tile ${Math.round((await phone.boundingBox()).y + (await phone.boundingBox()).height - ((await tile(page, "pxp").boundingBox()).y + (await tile(page, "pxp").boundingBox()).height))}px`);
await bento.screenshot({ path: `${OUT}/bento-1280.png` });

const pxp = tile(page, "pxp");
await pxp.scrollIntoViewIfNeeded();
await pxp.hover({ position: { x: 40, y: 250 } });
await sleep(500);
log("hover PXP tile: arrow", await pxp.locator(".go").evaluate((g) => `${getComputedStyle(g).opacity} ${getComputedStyle(g).transform}`));
await page.mouse.move(0, 0);
await sleep(500);
await pxp.click({ position: { x: 40, y: 250 } });
await page.waitForURL("**/products#pxp", { timeout: 5000 }).catch(() => undefined);
log("click on PXP tile body", page.url());
await page.goBack();
await page.waitForSelector(SVC);
for (const id of ["sxp", "lxp", "iot"]) {
  await tile(page, id).click({ position: { x: 30, y: 120 } });
  await page.waitForURL(`**/products#${id}`, { timeout: 5000 }).catch(() => undefined);
  log(`click on ${id} tile body`, page.url());
  await page.goBack();
  await page.waitForSelector(SVC);
}

await page.locator('section[aria-label="What we do"] a').nth(1).focus();
const stops = [];
for (let i = 0; i < 5; i++) {
  await page.keyboard.press("Tab");
  stops.push(await page.evaluate(() => {
    const el = document.activeElement;
    const ring = getComputedStyle(el, "::after");
    return `${el.getAttribute("aria-label") ?? el.textContent.trim().slice(0, 20)} [tile ring ${ring.outlineStyle} ${ring.outlineWidth} ${ring.outlineColor}]`;
  }));
}
log("Tab stops after the doors", stops.join("  >  "));
await page.keyboard.press("Shift+Tab");
await bento.screenshot({ path: `${OUT}/bento-focus-1280.png` });

const svc = page.locator(SVC);
log("services section", `${await css(svc, ["background-color"])} | ${await svc.locator("h2").textContent()} | ${await svc.locator(".lede").textContent()}`);
log("service grid columns", await svc.locator(".svc-grid").evaluate((g) => getComputedStyle(g).gridTemplateColumns.split(" ").length));
log("service cards", (await svc.locator("a").evaluateAll((as) => as.map((a) => {
  const ic = a.querySelector(".ic");
  return `${a.querySelector("h3").textContent}→${a.getAttribute("href").replace("/services", "")} [${a.className.replace("spot svc", "").trim() || "plain"}; icon ${getComputedStyle(ic).width} ${ic.querySelector("svg") ? "svg" : "none"} ${getComputedStyle(ic).color}]`;
}))).join("  |  "));
log("navy card", await css(svc.locator("a.navy"), ["background-image", "color"]));
log("feature card", await css(svc.locator("a.feature").first(), ["background-image"]));
await svc.screenshot({ path: `${OUT}/services-1280.png` });
await svc.locator("a").nth(2).click();
await page.waitForURL("**/services#co-creation", { timeout: 5000 }).catch(() => undefined);
log("click service card 3", page.url());
await context.close();

const touch = await browser.newContext({ viewport: { width: 390, height: 900 }, hasTouch: true, isMobile: true });
const tp = await touch.newPage();
await tp.goto(`${BASE}/`, { waitUntil: "load" });
await tp.waitForSelector(BENTO);
await tp.evaluate(() => document.querySelectorAll('section[aria-labelledby="apps-title"] a').forEach((a) => a.addEventListener("click", (e) => e.preventDefault())));
const tt = tp.locator(`${BENTO} .t-lxp`);
await tt.scrollIntoViewIfNeeded();
await tt.tap({ position: { x: 30, y: 120 } });
await sleep(600);
log("touch tap LXP: arrow", await tt.locator(".go").evaluate((g) => getComputedStyle(g).transform));
await touch.close();

const reduced = await open(1280, { reducedMotion: "reduce" });
const rt = reduced.page.locator(`${BENTO} .t-lxp`);
await rt.scrollIntoViewIfNeeded();
await rt.hover();
await sleep(500);
log("reduced motion hover LXP: arrow", await rt.locator(".go").evaluate((g) => getComputedStyle(g).transform));
await reduced.context.close();

for (const width of [1080, 1079, 900, 899, 640, 639, 390]) {
  const { page: p, context: c } = await open(width);
  const bc = await p.locator(`${BENTO} .bento`).evaluate((g) => getComputedStyle(g).gridTemplateColumns.split(" ").length);
  const sc = await p.locator(`${SVC} .svc-grid`).evaluate((g) => getComputedStyle(g).gridTemplateColumns.split(" ").length);
  const wide = await p.locator(`${BENTO} .t-pxp`).evaluate((t) => Math.round(t.getBoundingClientRect().width));
  const sideways = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  log(`layout ${width}px`, `bento ${bc} cols (PXP ${wide}px wide), services ${sc} cols, sideways scroll ${sideways}`);
  if (width === 390 || width === 899) {
    await p.locator(BENTO).screenshot({ path: `${OUT}/bento-${width}.png` });
    if (width === 390) await p.locator(SVC).screenshot({ path: `${OUT}/services-390.png` });
  }
  await c.close();
}

const order = await open(1280);
log("page order", (await order.page.evaluate(() => Array.from(document.querySelector("main").children).map((c) => c.getAttribute("aria-labelledby") || c.getAttribute("aria-label") || c.tagName))).join(" > "));
await order.context.close();
await browser.close();
