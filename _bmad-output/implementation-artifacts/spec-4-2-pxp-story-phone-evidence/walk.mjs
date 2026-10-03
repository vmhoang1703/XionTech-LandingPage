import { chromium } from "@playwright/test";

const OUT = process.env.OUT;
if (!OUT) throw new Error("Set OUT to the evidence folder");
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const b = await chromium.launch({ channel: "chrome", timeout: 120000 });
const log = (s) => console.log(s);
const css = (loc, props) => loc.evaluate((el, ps) => ps.map((p) => getComputedStyle(el)[p]).join(" | "), props);
const settle = (p) => p.waitForTimeout(1200);
const box = (loc) => loc.evaluate((el) => { const r = el.getBoundingClientRect(); return { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) }; });
const shown = (p) => p.evaluate(() => [...document.querySelectorAll("#pxp [role=tabpanel]")].filter((el) => !el.hidden).map((el) => el.id).join(","));
const tabTo = async (p, loc, max) => {
  let n = 0;
  while (n < max && !(await loc.evaluate((el) => el === document.activeElement))) { await p.keyboard.press("Tab"); n++; }
  if (!(await loc.evaluate((el) => el === document.activeElement))) throw new Error(`Tab did not reach the target in ${max} presses`);
  return n;
};
const sec = (p) => p.locator("#pxp");
const tab = (p, name) => sec(p).getByRole("tab", { name });

// 1280: layout, phone, tabs, hover, click, keyboard, features, stores
{
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  const r = await p.goto(`${BASE}/products#pxp`, { waitUntil: "load" });
  if (!r) throw new Error("No response for /products");
  await settle(p);
  const head = sec(p).locator("#pxp-h");
  log(`[1280] direct /products#pxp: #pxp top ${(await box(sec(p))).y} | H2 top ${(await box(head)).y} | sub-nav bottom ${(await box(p.locator("nav.subnav"))).y + (await box(p.locator("nav.subnav"))).h}`);
  const phone = sec(p).locator(".story-phone");
  log(`[1280] phone ${JSON.stringify(await box(phone))} | H2 ${JSON.stringify(await box(head))} | two columns ${(await box(phone)).x + (await box(phone)).w <= (await box(head)).x}`);
  log(`[1280] shown panel: ${await shown(p)}`);
  const att = tab(p, /Attendance/);
  const gr = tab(p, /Grades/);
  log(`[1280] Attendance (selected): ${await css(att, ["backgroundColor", "color"])} | Grades: ${await css(gr, ["backgroundColor", "color", "cursor"])}`);
  await gr.hover(); await p.waitForTimeout(400);
  log(`[1280] Grades hover: ${await css(gr, ["backgroundColor", "color", "cursor"])}`);
  await p.screenshot({ path: `${OUT}/pxp-1280.png` });
  await gr.click(); await p.waitForTimeout(100);
  log(`[1280] click Grades: selected ${await gr.getAttribute("aria-selected")} | shown ${await shown(p)} | Grades ${await css(gr, ["backgroundColor", "color"])}`);
  // Keyboard: Tab into tablist lands on selected tab only
  await p.goto(`${BASE}/products`, { waitUntil: "load" }); await settle(p);
  await p.mouse.move(0, 0);
  const n = await tabTo(p, att, 80);
  log(`[1280] Tab x${n} lands on Attendance (selected) | :focus-visible ${await att.evaluate((el) => el.matches(":focus-visible"))} | outline ${await css(att, ["outlineStyle", "outlineWidth", "outlineColor"])}`);
  await p.keyboard.press("ArrowRight"); await p.waitForTimeout(100);
  log(`[1280] ArrowRight: focus "${await p.evaluate(() => document.activeElement.textContent.trim())}" | shown ${await shown(p)}`);
  await p.keyboard.press("End"); await p.waitForTimeout(100);
  log(`[1280] End: focus "${await p.evaluate(() => document.activeElement.textContent.trim())}" | shown ${await shown(p)}`);
  // Next Tab leaves the tablist; record the next stops and that none is inside a hidden panel
  const stops = [];
  for (let i = 0; i < 4; i++) {
    await p.keyboard.press("Tab");
    stops.push(await p.evaluate(() => { const a = document.activeElement; const inHidden = !!a.closest("[role=tabpanel][hidden]"); return `${a.tagName.toLowerCase()}:${(a.textContent || "").trim().slice(0, 18)}${inHidden ? " (IN HIDDEN PANEL)" : ""}`; }));
  }
  log(`[1280] next Tab stops: ${stops.join(" -> ")}`);
  // Features
  const feat = await sec(p).locator(".feature-list").evaluate((el) => ({ cols: getComputedStyle(el).gridTemplateColumns, items: el.children.length }));
  log(`[1280] features: ${feat.items} items, columns "${feat.cols}"`);
  // Store button hover + new tab
  const store = sec(p).locator(".store-row a").first();
  const before = await box(store);
  log(`[1280] store before hover: ${await css(store, ["borderColor", "transform"])}`);
  await store.hover(); await p.waitForTimeout(500);
  log(`[1280] store after hover: ${await css(store, ["borderColor", "transform", "transitionDuration"])} | y ${before.y} -> ${(await box(store)).y}`);
  log(`[1280] store link: href ${await store.getAttribute("href")} target ${await store.getAttribute("target")} rel ${await store.getAttribute("rel")}`);
  const [popup] = await Promise.all([ctx.waitForEvent("page", { timeout: 10000 }), store.click()]);
  await popup.waitForLoadState("load").catch(() => {});
  log(`[1280] store click opens a new tab: ${new URL(popup.url()).pathname}${new URL(popup.url()).hash}`);
  await popup.close();
  // Sub-nav pill and mega menu
  await p.goto(`${BASE}/products`, { waitUntil: "load" }); await settle(p);
  await p.evaluate(() => window.scrollTo(0, 2000)); await p.waitForTimeout(400);
  await p.locator('nav.subnav a[href="#pxp"]').click(); await settle(p);
  log(`[1280] sub-nav PXP: #pxp top ${(await box(sec(p))).y} | H2 top ${(await box(sec(p).locator("#pxp-h"))).y}`);
  await p.goto(`${BASE}/`, { waitUntil: "load" }); await settle(p);
  await p.locator("header").getByRole("button", { name: "Products" }).click();
  await p.locator('header a[href="/products#pxp"]').first().click();
  await p.waitForURL("**/products#pxp", { timeout: 20000 }); await settle(p);
  log(`[1280] mega menu PXP from /: #pxp top ${(await box(sec(p))).y} | H2 top ${(await box(sec(p).locator("#pxp-h"))).y}`);
  await ctx.close();
}

// 899 and 640: one column, feature columns
for (const w of [899, 640]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  await p.goto(`${BASE}/products#pxp`, { waitUntil: "load" }); await settle(p);
  const ph = await box(sec(p).locator(".story-phone"));
  const h = await box(sec(p).locator("#pxp-h"));
  const cols = await sec(p).locator(".feature-list").evaluate((el) => getComputedStyle(el).gridTemplateColumns);
  log(`[${w}] phone ${JSON.stringify(ph)} | H2 y ${h.y} | one column ${h.y >= ph.y + ph.h || ph.y >= h.y + h.h} | features columns "${cols}" | no sideways scroll ${await p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)}`);
  if (w === 640) await p.screenshot({ path: `${OUT}/pxp-640.png`, fullPage: false });
  await p.close();
}

// 390 touch and pen
{
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  await p.goto(`${BASE}/products#pxp`, { waitUntil: "load" }); await settle(p);
  await tab(p, /Messages/).tap(); await p.waitForTimeout(100);
  log(`[390] touch tap Messages: selected ${await tab(p, /Messages/).getAttribute("aria-selected")} | shown ${await shown(p)}`);
  const pb = await box(tab(p, /Payments/));
  await p.evaluate(({ x, y }) => {
    const el = document.elementFromPoint(x, y);
    const o = { bubbles: true, cancelable: true, pointerType: "pen", isPrimary: true, clientX: x, clientY: y };
    el.dispatchEvent(new PointerEvent("pointerdown", o));
    el.dispatchEvent(new PointerEvent("pointerup", o));
    el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, clientX: x, clientY: y }));
  }, { x: pb.x + pb.w / 2, y: pb.y + pb.h / 2 });
  await p.waitForTimeout(100);
  log(`[390] pen-type pointer + click on Payments (synthetic events): selected ${await tab(p, /Payments/).getAttribute("aria-selected")} | shown ${await shown(p)}`);
  log(`[390] phone width ${(await box(sec(p).locator(".story-phone"))).w} | no sideways scroll ${await p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)}`);
  await p.screenshot({ path: `${OUT}/pxp-390.png` });
  await p.close();
}

// Reduced motion
{
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/products#pxp`, { waitUntil: "load" }); await settle(p);
  const g = tab(p, /Grades/);
  const td = await p.evaluate(() => [...document.querySelectorAll("#pxp [role=tab], #pxp [role=tabpanel]")].map((el) => getComputedStyle(el).transitionDuration).filter((d) => d.split(",").some((x) => parseFloat(x) > 0)).length);
  await g.click(); await p.waitForTimeout(30);
  log(`[1280 reduced] tabs and panels with a transition > 0: ${td} | 30ms after Grades click shown ${await shown(p)}`);
  await ctx.close();
}

await b.close();
