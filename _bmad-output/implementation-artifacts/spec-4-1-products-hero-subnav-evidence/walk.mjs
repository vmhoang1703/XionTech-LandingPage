import { chromium } from "@playwright/test";

const OUT = process.env.OUT;
if (!OUT) throw new Error("Set OUT to the evidence folder");
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const b = await chromium.launch({ channel: "chrome", timeout: 120000 });
const log = (s) => console.log(s);
const style = (loc, props) => loc.evaluate((el, ps) => ps.map((p) => getComputedStyle(el)[p]).join(" | "), props);
const sectionTop = (p, id) => p.evaluate((i) => Math.round(document.getElementById(i).getBoundingClientRect().top), id);
const headingTop = (p, id) =>
  p.evaluate((i) => {
    const s = document.getElementById(i);
    const h = s.querySelector("h1, h2, h3") ?? s;
    return Math.round(h.getBoundingClientRect().top);
  }, id);
const bars = (p) =>
  p.evaluate(() => {
    const h = document.querySelector("header").getBoundingClientRect();
    const s = document.querySelector("nav.subnav").getBoundingClientRect();
    return { headerBottom: Math.round(h.bottom), subnavTop: Math.round(s.top), subnavBottom: Math.round(s.bottom) };
  });
const scrollY = (p) => p.evaluate(() => Math.round(window.scrollY));
const settle = (p) => p.waitForTimeout(1200);
const devicesBox = (p) =>
  p.evaluate(() => {
    const t = document.querySelector("h1").getBoundingClientRect();
    const d = document.querySelector(".home-devices").getBoundingClientRect();
    return { textLeft: Math.round(t.left), textRight: Math.round(t.right), textBottom: Math.round(t.bottom), devLeft: Math.round(d.left), devTop: Math.round(d.top) };
  });
const tabTo = async (p, loc, max) => {
  let n = 0;
  while (n < max && !(await loc.evaluate((el) => el === document.activeElement))) {
    await p.keyboard.press("Tab");
    n++;
  }
  if (!(await loc.evaluate((el) => el === document.activeElement))) throw new Error(`Tab did not reach the target in ${max} presses`);
  return n;
};

// 1280: hero layout, CTA, pills, sticky sub-nav, anchor offset
{
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const r = await p.goto(`${BASE}/products`, { waitUntil: "load" });
  if (!r) throw new Error("No response for /products");
  await settle(p);
  log(`[1280] status ${r.status()} | title "${await p.title()}"`);
  log(`[1280] html scroll-behavior ${await p.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)}`);
  log(`[1280] hero ${JSON.stringify(await devicesBox(p))}`);
  await p.screenshot({ path: `${OUT}/products-1280.png` });

  const cta = p.locator("main").getByRole("link", { name: /Book a demo/ });
  log(`[1280] CTA before hover: ${await style(cta, ["backgroundColor"])}`);
  await cta.hover();
  await p.waitForTimeout(500);
  log(`[1280] CTA after hover: ${await style(cta, ["backgroundColor", "transitionProperty", "transitionDuration"])}`);
  await p.mouse.move(0, 0);
  await p.evaluate(() => document.activeElement instanceof HTMLElement && document.activeElement.blur());
  let n = await tabTo(p, cta, 60);
  log(`[1280] CTA after Tab x${n}: active ${await cta.evaluate((el) => el === document.activeElement)} | :focus-visible ${await cta.evaluate((el) => el.matches(":focus-visible"))} | outline ${await style(cta, ["outlineStyle", "outlineWidth", "outlineColor"])}`);

  const pill = p.locator('nav.subnav a[href="#lxp"]');
  log(`[1280] pill LXP before hover: ${await style(pill, ["backgroundColor", "color"])}`);
  await pill.hover();
  await p.waitForTimeout(500);
  log(`[1280] pill LXP after hover: ${await style(pill, ["backgroundColor", "color", "transitionDuration"])}`);
  await p.mouse.move(0, 0);
  n = await tabTo(p, pill, 20);
  log(`[1280] pill LXP after Tab x${n} more: :focus-visible ${await pill.evaluate((el) => el.matches(":focus-visible"))} | outline ${await style(pill, ["outlineStyle", "outlineWidth"])}`);
  const y0 = await scrollY(p);
  await p.keyboard.press("Enter");
  const mid = [];
  for (let i = 0; i < 4; i++) {
    await p.waitForTimeout(60);
    mid.push(await scrollY(p));
  }
  await settle(p);
  log(`[1280] Enter on LXP: scrollY ${y0} -> ${mid.join(",")} -> ${await scrollY(p)} | hash ${new URL(p.url()).hash}`);
  log(`[1280] after LXP: ${JSON.stringify(await bars(p))} | #lxp top ${await sectionTop(p, "lxp")} | heading top ${await headingTop(p, "lxp")}`);
  for (const id of ["pxp", "sxp", "iot"]) {
    await p.locator(`nav.subnav a[href="#${id}"]`).click();
    await settle(p);
    const max = await p.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
    log(`[1280] click ${id}: ${JSON.stringify(await bars(p))} | #${id} top ${await sectionTop(p, id)} | heading top ${await headingTop(p, id)} | scrollY ${await scrollY(p)} of max ${max}`);
  }
  await p.screenshot({ path: `${OUT}/products-1280-sticky.png` });

  await p.goto(`${BASE}/products`, { waitUntil: "load" });
  await settle(p);
  await cta.click();
  await p.waitForURL("**/demo#form", { timeout: 20000 });
  await settle(p);
  log(`[1280] CTA click lands ${new URL(p.url()).pathname}${new URL(p.url()).hash} | #form top ${await sectionTop(p, "form")}`);
  await p.goto(`${BASE}/products`, { waitUntil: "load" });
  await settle(p);
  await cta.focus();
  await p.keyboard.press("Enter");
  await p.waitForURL("**/demo#form", { timeout: 20000 });
  log(`[1280] CTA Enter lands ${new URL(p.url()).pathname}${new URL(p.url()).hash}`);

  await p.goto(`${BASE}/products#lxp`, { waitUntil: "load" });
  await settle(p);
  log(`[1280] direct /products#lxp: ${JSON.stringify(await bars(p))} | #lxp top ${await sectionTop(p, "lxp")} | heading top ${await headingTop(p, "lxp")}`);
  await p.close();
}

// 899: one column
{
  const p = await b.newPage({ viewport: { width: 899, height: 900 } });
  await p.goto(`${BASE}/products`, { waitUntil: "load" });
  await settle(p);
  const d = await devicesBox(p);
  log(`[899] hero ${JSON.stringify(d)} | one column ${d.devTop >= d.textBottom} | no sideways scroll ${await p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)}`);
  await p.screenshot({ path: `${OUT}/products-899.png`, fullPage: true });
  await p.close();
}

// 390 touch: sideways sub-nav and a tap
{
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  await p.goto(`${BASE}/products`, { waitUntil: "load" });
  await settle(p);
  const s = await p.evaluate(() => {
    const w = document.querySelector("nav.subnav .wrap");
    const pills = [...w.querySelectorAll("a")].map((a) => `${a.textContent}:${Math.round(a.getBoundingClientRect().height)}px`);
    return `overflow-x ${getComputedStyle(w).overflowX}, scrollWidth ${w.scrollWidth}, clientWidth ${w.clientWidth}, pill heights ${pills.join(" ")}`;
  });
  log(`[390] sub-nav ${s} | page no sideways scroll ${await p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)}`);
  await p.locator('nav.subnav a[href="#sxp"]').tap();
  await settle(p);
  log(`[390] tap SXP: hash ${new URL(p.url()).hash} | ${JSON.stringify(await bars(p))} | #sxp top ${await sectionTop(p, "sxp")}`);
  await p.screenshot({ path: `${OUT}/products-390.png` });
  await p.close();
}

// 300 touch: the narrowest width checked; do the four pills still fit?
{
  const p = await b.newPage({ viewport: { width: 300, height: 700 }, hasTouch: true, isMobile: true });
  await p.goto(`${BASE}/products`, { waitUntil: "load" });
  await settle(p);
  const s = await p.evaluate(() => {
    const w = document.querySelector("nav.subnav .wrap");
    const before = w.scrollLeft;
    w.scrollLeft = 1000;
    const heights = [...w.querySelectorAll("a")].map((a) => Math.round(a.getBoundingClientRect().height));
    return `scrollWidth ${w.scrollWidth}, clientWidth ${w.clientWidth}, scrollLeft ${before} -> ${w.scrollLeft}, pill heights ${heights.join(",")}`;
  });
  log(`[300] sub-nav ${s} | page no sideways scroll ${await p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)}`);
  await p.screenshot({ path: `${OUT}/products-300.png` });
  await p.close();
}

// From another page: mega menu, Home bento card, and an instant route change
{
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto(`${BASE}/`, { waitUntil: "load" });
  await settle(p);
  await p.locator("header").getByRole("button", { name: "Products" }).click();
  await p.locator('header a[href="/products#lxp"]').first().click();
  await p.waitForURL("**/products#lxp", { timeout: 20000 });
  await settle(p);
  log(`[1280] mega menu LXP from /: ${JSON.stringify(await bars(p))} | #lxp top ${await sectionTop(p, "lxp")} | heading top ${await headingTop(p, "lxp")}`);
  await p.goto(`${BASE}/`, { waitUntil: "load" });
  await settle(p);
  await p.locator('main a[href="/products#sxp"]').first().click();
  await p.waitForURL("**/products#sxp", { timeout: 20000 });
  await settle(p);
  log(`[1280] Home bento SXP from /: ${JSON.stringify(await bars(p))} | #sxp top ${await sectionTop(p, "sxp")} | heading top ${await headingTop(p, "sxp")}`);
  await p.goto(`${BASE}/`, { waitUntil: "load" });
  await settle(p);
  await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await p.waitForTimeout(300);
  const from = await scrollY(p);
  await p.locator("footer").getByRole("link", { name: /privacy/i }).first().click();
  await p.waitForURL("**/privacy", { timeout: 20000 });
  await p.waitForTimeout(50);
  const early = await scrollY(p);
  await settle(p);
  log(`[1280] route change / -> /privacy from scrollY ${from}: html data-scroll-behavior "${await p.evaluate(() => document.documentElement.dataset.scrollBehavior)}" | scrollY 50ms after ${early}, after settle ${await scrollY(p)}`);
  await p.close();
}

// Reduced motion: the jump is instant
{
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/products`, { waitUntil: "load" });
  await settle(p);
  log(`[1280 reduced] html scroll-behavior ${await p.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)}`);
  await p.locator('nav.subnav a[href="#sxp"]').click();
  await p.waitForTimeout(50);
  const early = await scrollY(p);
  await settle(p);
  log(`[1280 reduced] click SXP: scrollY 50ms after ${early}, after settle ${await scrollY(p)}`);
  await ctx.close();
}

await b.close();
