// Walks every Story 3.6 UX checks line on the Home page and prints what it observes.
// Run from the repo root: BASE=http://localhost:3005 node _bmad-output/implementation-artifacts/spec-3-6-4d-process-flow-evidence/walk.mjs
import { chromium } from "@playwright/test";

const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = "_bmad-output/implementation-artifacts/spec-3-6-4d-process-flow-evidence";
const browser = await chromium
  .launch()
  .catch(() => chromium.launch({ channel: "chrome" }));
const log = (k, v) => console.log(`${k}: ${v}`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const BAND = 'section[aria-labelledby="process-title"]';
const FLOW = `${BAND} ol.flow`;

// Records every data-phase the flow takes, from the first paint.
const recordPhases = () => {
  window.__phases = [];
  new MutationObserver(() => {
    const ol = document.querySelector("ol.flow");
    if (ol && window.__phases.at(-1) !== ol.dataset.phase) window.__phases.push(ol.dataset.phase);
  }).observe(document, { subtree: true, attributes: true, childList: true, attributeFilter: ["data-phase"] });
};

async function open(width, height = 900, options = {}, hash = "") {
  const context = await browser.newContext({ viewport: { width, height }, ...options });
  const page = await context.newPage();
  await page.addInitScript(recordPhases);
  await page.goto(`${BASE}/${hash}`, { waitUntil: "load" });
  await page.waitForSelector(FLOW);
  await sleep(800);
  return { page, context };
}
const css = (loc, props) =>
  loc.evaluate((el, ps) => ps.map((p) => `${p} ${getComputedStyle(el).getPropertyValue(p).slice(0, 60)}`).join("; "), props);
const steps = (page) =>
  page.locator(`${FLOW} .step4`).evaluateAll((ls) => ls.map((l) => `${getComputedStyle(l).opacity}/${getComputedStyle(l).transform === "none" ? "0" : getComputedStyle(l).transform.split(",")[5]?.trim()}`).join(" "));

const { page, context } = await open(1280);
const band = page.locator(BAND);
log("band", `${await css(band, ["background-image"])} | grid texture ${await band.evaluate((b) => getComputedStyle(b, "::before").backgroundImage.slice(0, 40))}`);
log("label / heading", `${await band.locator(".label").textContent()} (rule ${await band.locator(".label").evaluate((l) => getComputedStyle(l, "::before").backgroundColor)}) / ${await band.locator("h2").textContent()}`);
log("list items", (await page.locator(FLOW).evaluate((ol) => Array.from(ol.children).filter((li) => li.getAttribute("aria-hidden") !== "true").map((li) => li.querySelector("h3, b")?.textContent)).then((x) => x)).join(" > "));
log("orb animation while armed", await page.locator(`${FLOW} .orb`).first().evaluate((o) => getComputedStyle(o).animationName));
log("phase before scrolling (flow off screen)", `${await page.locator(FLOW).getAttribute("data-phase")}; steps ${await steps(page)}; track ${await page.locator(`${FLOW} .track i`).evaluate((i) => getComputedStyle(i).transform)}`);

await band.scrollIntoViewIfNeeded();
await sleep(150);
const t = Date.now();
const early = await steps(page);
await sleep(700);
const mid = await steps(page);
await sleep(2600);
log("reveal: steps early / at 0.85s / at 3.3s", `${early} | ${mid} | ${await steps(page)}`);
log("reveal: phase and track at the end", `${await page.locator(FLOW).getAttribute("data-phase")}; ${await page.locator(`${FLOW} .track i`).evaluate((i) => getComputedStyle(i).transform)} (${Date.now() - t}ms)`);
log("orb animation while armed / after reveal", `${await page.locator(`${FLOW} .orb`).first().evaluate((o) => getComputedStyle(o).animationName)} (now)`);
log("node width vs dot", await page.locator(`${FLOW} .node`).first().evaluate((n) => `${Math.round(n.getBoundingClientRect().width)} / ${Math.round(n.querySelector(".dot").getBoundingClientRect().width)}`));
log("step delays (--d, applied only while revealing)", (await page.locator(`${FLOW} .step4`).evaluateAll((ls) => ls.map((l) => `${l.style.getPropertyValue("--d")}→${getComputedStyle(l).transitionDelay.split(",")[0]}`))).join(" "));
log("phases seen", (await page.evaluate(() => window.__phases)).join(" > "));
await page.evaluate(() => window.scrollTo(0, 0));
await sleep(500);
await band.scrollIntoViewIfNeeded();
await sleep(500);
log("once only: phase after leaving and coming back", (await page.evaluate(() => window.__phases)).join(" > "));

const node = page.locator(`${FLOW} .node`).first();
log("start node", `${await css(node.locator(".dot"), ["width", "border-top-style", "background-color"])} | svg ${await node.locator(".dot svg").count()} | ${await node.locator("b").textContent()}`);
log("end node", `${await css(page.locator(`${FLOW} .node.end .dot`), ["background-image"])} | svg ${await page.locator(`${FLOW} .node.end .dot svg`).count()}`);
const first = page.locator(`${FLOW} .step4`).first();
log("step card", `${await css(first, ["border-radius", "background-color"])} | art ${await css(first.locator(".art"), ["height"])} main svg ${await first.locator(".art .main svg").count()} orbs ${await first.locator(".art .orb svg").count()} | num ${await css(first.locator(".num"), ["font-family", "color"])} | get ${await css(first.locator(".get"), ["border-top-style"])}`);
const trackBox = await page.locator(`${FLOW} .track`).boundingBox();
const artBox = await first.locator(".art").boundingBox();
log("track at art middle", `track y ${Math.round(trackBox.y)}, art middle ${Math.round(artBox.y + artBox.height / 2)}`);
const gets = await page.locator(`${FLOW} .step4 .get`).evaluateAll((gs) => gs.map((g) => Math.round(g.getBoundingClientRect().top)));
log("You receive rows top (px)", gets.join(" "));
await band.screenshot({ path: `${OUT}/process-1280.png` });
await context.close();

// The hero is 100dvh tall, so only a link to the band (the browser jumps
// there before JavaScript runs) starts with the flow on screen.
const tall = await open(1280, 900, {}, "#process-title");
log("already in view at load: phases seen", (await tall.page.evaluate(() => window.__phases)).join(" > ") || "(none)");
log("already in view at load: steps", await steps(tall.page));
await tall.context.close();

const reduced = await open(1280, 900, { reducedMotion: "reduce" });
await reduced.page.locator(BAND).scrollIntoViewIfNeeded();
await sleep(300);
log("reduced motion: phase / steps / track / orb animation", `${await reduced.page.locator(FLOW).getAttribute("data-phase")} / ${await steps(reduced.page)} / ${await reduced.page.locator(`${FLOW} .track i`).evaluate((i) => getComputedStyle(i).transform)} / ${await reduced.page.locator(`${FLOW} .orb`).first().evaluate((o) => getComputedStyle(o).animationName)}`);
await reduced.context.close();

const noJs = await open(1280, 900, { javaScriptEnabled: false });
log("JS off: phase / steps / track", `${await noJs.page.locator(FLOW).getAttribute("data-phase")} / ${await steps(noJs.page)} / ${await noJs.page.locator(`${FLOW} .track i`).evaluate((i) => getComputedStyle(i).transform)}`);
await noJs.context.close();

for (const width of [1080, 1079, 640, 639, 390]) {
  const { page: p, context: c } = await open(width);
  await p.locator(BAND).scrollIntoViewIfNeeded();
  await sleep(2600);
  const cols = await p.locator(FLOW).evaluate((g) => getComputedStyle(g).gridTemplateColumns.split(" ").length);
  const nodeW = await p.locator(`${FLOW} .node`).first().evaluate((n) => Math.round(n.getBoundingClientRect().width));
  const trackH = await p.locator(`${FLOW} .track`).evaluate((n) => `${Math.round(n.getBoundingClientRect().width)}x${getComputedStyle(n).clipPath}`);
  const sideways = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  log(`layout ${width}px`, `${cols} columns, node width ${nodeW}px, track ${trackH}, sideways scroll ${sideways}`);
  if (width === 1079 || width === 390) await p.locator(BAND).screenshot({ path: `${OUT}/process-${width}.png` });
  await c.close();
}

const order = await open(1280);
log("page order", (await order.page.evaluate(() => Array.from(document.querySelector("main").children).map((c) => c.getAttribute("aria-labelledby") || c.getAttribute("aria-label") || c.tagName))).join(" > "));
await order.context.close();
await browser.close();
