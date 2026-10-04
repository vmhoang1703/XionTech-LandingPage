import { chromium } from "@playwright/test";

const OUT = process.env.OUT;
if (!OUT) throw new Error("Set OUT to the evidence folder");
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const b = await chromium.launch({ channel: "chrome", timeout: 120000 });
const log = (s) => console.log(s);
const settle = (p) => p.waitForTimeout(1000);
const css = (l, ps) => l.evaluate((el, ps) => ps.map((p) => getComputedStyle(el)[p]).join(" | "), ps);
const box = (l) =>
  l.evaluate((el) => {
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) };
  });
const menuBtn = (p) => p.locator("header").getByRole("button", { name: "Menu" });
const panel = (p) => p.locator("#mobile-menu");
// The button is hidden above 1080px, so read its state by attribute, not by role.
const isOpen = (p) => p.locator('header [aria-controls="mobile-menu"]').getAttribute("aria-expanded");
const active = (p) =>
  p.evaluate(() => {
    const a = document.activeElement;
    return `${a.tagName.toLowerCase()}:${(a.getAttribute("aria-label") || a.textContent || "").trim().slice(0, 20)}`;
  });

try {
  // Desktop: no Menu button
  {
    const p = await b.newPage({ viewport: { width: 1081, height: 900 } });
    await p.goto(`${BASE}/`, { waitUntil: "load" });
    await settle(p);
    log(`[1081] Menu button visible ${await menuBtn(p).isVisible()} | desktop nav visible ${await p.locator("header").getByRole("button", { name: "Products" }).isVisible()}`);
    await p.close();
  }

  // 800: look, keyboard open, tab order, focus ring, scroll lock, resize close
  {
    const p = await b.newPage({ viewport: { width: 800, height: 700 } });
    await p.goto(`${BASE}/`, { waitUntil: "load" });
    await settle(p);
    const m = menuBtn(p);
    log(`[800] Menu: visible ${await m.isVisible()} | ${JSON.stringify(await box(m))} | ${await css(m, ["color", "borderColor", "borderRadius"])} | text "${(await m.innerText()).trim()}" | icon ${await m.locator("svg").count()}`);
    log(`[800] header Book a demo visible ${await p.locator("header").getByRole("link", { name: /Book a demo/ }).first().isVisible()}`);
    await p.mouse.move(0, 0);
    let n = 0;
    while (n < 20 && !(await m.evaluate((el) => el === document.activeElement))) {
      await p.keyboard.press("Tab");
      n++;
    }
    if (!(await m.evaluate((el) => el === document.activeElement))) throw new Error("Tab never reached Menu");
    log(`[800] Tab x${n} reaches Menu | :focus-visible ${await m.evaluate((el) => el.matches(":focus-visible"))} | outline ${await css(m, ["outlineStyle", "outlineWidth"])}`);
    await p.keyboard.press("Enter");
    await p.waitForTimeout(300);
    log(`[800] Enter: expanded ${await isOpen(p)} | focus ${await active(p)} | panel ${JSON.stringify(await box(panel(p)))} | header bottom ${(await box(p.locator("header"))).y + (await box(p.locator("header"))).h}`);
    log(`[800] panel look: ${await css(panel(p), ["backgroundColor", "overflowY"])} | CTA in panel visible ${await panel(p).getByRole("link", { name: /Book a demo/ }).isVisible().catch(() => "error")}`);
    const order = [];
    for (let i = 0; i < 10; i++) {
      await p.keyboard.press("Tab");
      order.push(await active(p));
    }
    log(`[800] Tab order while open: ${order.join(" -> ")}`);
    const y0 = await p.evaluate(() => window.scrollY);
    await p.mouse.move(400, 650);
    await p.mouse.wheel(0, 600);
    await p.waitForTimeout(400);
    log(`[800] wheel while open: scrollY ${y0} -> ${await p.evaluate(() => window.scrollY)} | html overflow ${await p.evaluate(() => getComputedStyle(document.documentElement).overflow)}`);
    await p.keyboard.press("Escape");
    await p.waitForTimeout(200);
    log(`[800] Escape: expanded ${await isOpen(p)} | focus ${await active(p)} | html overflow ${await p.evaluate(() => getComputedStyle(document.documentElement).overflow)}`);
    await m.click();
    await p.waitForTimeout(200);
    await p.setViewportSize({ width: 1200, height: 700 });
    await p.waitForTimeout(500);
    log(`[800->1200] resize while open: expanded ${await isOpen(p)} | html overflow ${await p.evaluate(() => getComputedStyle(document.documentElement).overflow)}`);
    await p.close();
  }

  // Current page style on /careers
  {
    const p = await b.newPage({ viewport: { width: 800, height: 700 } });
    await p.goto(`${BASE}/careers`, { waitUntil: "load" });
    await settle(p);
    await menuBtn(p).click();
    await p.waitForTimeout(200);
    const cur = panel(p).locator('[aria-current="page"]');
    log(`[800 /careers] current item "${(await cur.innerText().catch(() => "none")).trim()}" | ${await css(cur, ["color", "fontWeight", "boxShadow"]).catch(() => "error")}`);
    await p.close();
  }

  // 375 touch: tap open, CTA first, no sideways scroll, logo height, touch scroll lock, link tap closes
  {
    const ctx = await b.newContext({ viewport: { width: 375, height: 700 }, hasTouch: true, isMobile: true });
    const p = await ctx.newPage();
    await p.goto(`${BASE}/`, { waitUntil: "load" });
    await settle(p);
    log(`[375] header Book a demo visible ${await p.locator("header > * a", { hasText: /Book a demo/ }).first().isVisible().catch(() => "error")} | logo height ${(await box(p.locator("header img").first())).h}`);
    await menuBtn(p).tap();
    await p.waitForTimeout(300);
    const items = await panel(p).locator("a").evaluateAll((els) => els.filter((e) => e.getClientRects().length).map((e) => e.textContent.trim()));
    log(`[375] tap: expanded ${await isOpen(p)} | panel items: ${items.join(" | ")} | CTA class "${await panel(p).locator("a").first().getAttribute("class")}"`);
    log(`[375] no sideways scroll ${await p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)}`);
    await p.screenshot({ path: `${OUT}/menu-375-open.png` });
    const y0 = await p.evaluate(() => window.scrollY);
    await p.touchscreen.tap(187, 650);
    await p.evaluate(() => window.scrollBy(0, 0));
    await p.mouse.wheel(0, 500);
    await p.waitForTimeout(400);
    log(`[375] scroll attempt while open: scrollY ${y0} -> ${await p.evaluate(() => window.scrollY)}`);
    await panel(p).getByRole("link", { name: "Careers" }).tap();
    await p.waitForURL("**/careers", { timeout: 20000 });
    await settle(p);
    log(`[375] tap Careers: url ${new URL(p.url()).pathname} | expanded ${await isOpen(p)} | html overflow ${await p.evaluate(() => getComputedStyle(document.documentElement).overflow)}`);
    await ctx.close();
  }

  // 641: CTA in the header, not in the panel
  {
    const p = await b.newPage({ viewport: { width: 641, height: 700 } });
    await p.goto(`${BASE}/`, { waitUntil: "load" });
    await settle(p);
    await menuBtn(p).click();
    await p.waitForTimeout(200);
    log(`[641] panel CTA visible ${await panel(p).getByRole("link", { name: /Book a demo/ }).isVisible().catch(() => "error")} | header CTA visible ${await p.locator("header").getByRole("link", { name: /Book a demo/ }).first().isVisible()}`);
    await p.screenshot({ path: `${OUT}/menu-641-open.png` });
    await p.close();
  }

  // Exact breakpoints: 640 (CTA in the panel), 1080 (Menu shown)
  for (const w of [640, 1080]) {
    const p = await b.newPage({ viewport: { width: w, height: 700 } });
    await p.goto(`${BASE}/`, { waitUntil: "load" });
    await settle(p);
    const shown = await menuBtn(p).isVisible();
    let cta = "n/a";
    if (shown) {
      await menuBtn(p).click();
      await p.waitForTimeout(200);
      cta = String(await panel(p).getByRole("link", { name: /Book a demo/ }).isVisible().catch(() => "error"));
    }
    log(`[${w}] Menu visible ${shown} | panel CTA visible ${cta} | header CTA visible ${await p.locator("header").getByRole("link", { name: /Book a demo/ }).first().isVisible()}`);
    await p.close();
  }

  // Reduced motion
  {
    const ctx = await b.newContext({ viewport: { width: 800, height: 700 }, reducedMotion: "reduce" });
    const p = await ctx.newPage();
    await p.goto(`${BASE}/`, { waitUntil: "load" });
    await settle(p);
    await menuBtn(p).click();
    await p.waitForTimeout(50);
    log(`[800 reduced] open after 50ms: panel visible ${await panel(p).isVisible()} | running animations ${await p.evaluate(() => document.getAnimations().filter((a) => a.playState === "running").length)}`);
    await ctx.close();
  }
} finally {
  await b.close();
}
