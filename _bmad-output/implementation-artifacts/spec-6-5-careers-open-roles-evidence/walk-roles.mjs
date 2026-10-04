import { chromium } from "@playwright/test";
// Run against the dev site after a role with a slug is published.
const BASE = process.env.BASE_URL ?? "https://xiontech-dev.vercel.app";
const OUT = process.env.OUT;
if (!OUT) throw new Error("Set OUT to the evidence folder");
const b = await chromium.launch({ channel: "chrome", timeout: 120000 });
const log = (s) => console.log(s);
const css = (l, ps) => l.evaluate((el, ps) => ps.map((p) => getComputedStyle(el)[p]).join(" | "), ps);
const box = (l) => l.evaluate((el) => { const r = el.getBoundingClientRect(); return { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) }; });
const ratio = (fg, bg) => { const lum = (c) => { const [r, g, b2] = c.match(/[\d.]+/g).slice(0, 3).map(Number).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b2; }; const a = lum(fg), c = lum(bg); return ((Math.max(a, c) + 0.05) / (Math.min(a, c) + 0.05)).toFixed(2); };
try {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/careers#roles`, { waitUntil: "load" }); await p.waitForTimeout(1500);
  const cards = p.locator("#roles a.role");
  log(`[1280] cards ${await cards.count()}`);
  const card = cards.first();
  log(`[1280] card href ${await card.getAttribute("href")} | name "${(await card.innerText()).replace(/\s+/g, " ")}" | nested links/buttons ${await card.locator("a, button").count()}`);
  const title = card.locator(".role-main > :first-child");
  const meta = card.locator("small").first();
  log(`[1280] title font ${await css(title, ["fontFamily"])} | meta "${(await meta.innerText()).trim()}" color ${await css(meta, ["color"])}`);
  const bg = await p.locator("#roles").evaluate((el) => getComputedStyle(el).backgroundColor);
  log(`[1280] meta contrast ${ratio(await css(meta, ["color"]), bg === "rgba(0, 0, 0, 0)" ? "rgb(255,255,255)" : bg)}:1 on section bg ${bg}`);
  const arrow = card.locator(".link-arrow svg, .link-arrow").last();
  const c0 = await box(card); const a0 = await box(arrow);
  await card.hover(); await p.waitForTimeout(700);
  const c1 = await box(card); const a1 = await box(arrow);
  log(`[1280] hover: card y ${c0.y} -> ${c1.y} | shadow ${(await css(card, ["boxShadow"])).slice(0, 40)} | arrow x ${a0.x} -> ${a1.x}`);
  await p.mouse.move(0, 0); await p.waitForTimeout(500);
  await p.evaluate(() => document.activeElement?.blur?.());
  let n = 0; while (n < 80 && !(await card.evaluate((el) => el === document.activeElement))) { await p.keyboard.press("Tab"); n++; }
  log(`[1280] Tab x${n} reaches card ${await card.evaluate((el) => el === document.activeElement)} | :focus-visible ${await card.evaluate((el) => el.matches(":focus-visible"))} | outline ${await css(card, ["outlineStyle", "outlineWidth", "outlineOffset"])}`);
  await p.keyboard.press("Enter"); await p.waitForTimeout(2000);
  log(`[1280] Enter lands ${new URL(p.url()).pathname} | h1 "${await p.locator("h1").first().innerText().catch(() => "")}"`);
  await p.goto(`${BASE}/careers#roles`, { waitUntil: "load" }); await p.waitForTimeout(1200);
  const meta2 = p.locator("#roles a.role small").first();
  const mb = await box(meta2); await p.mouse.click(mb.x + 5, mb.y + 5); await p.waitForTimeout(2000);
  log(`[1280] click on the meta text lands ${new URL(p.url()).pathname}`);
  await p.goto(`${BASE}/careers#roles`, { waitUntil: "load" }); await p.waitForTimeout(1000);
  await p.screenshot({ path: `${OUT}/role-1280.png` });
  await ctx.close();
  for (const w of [641, 640, 390]) {
    const c = await b.newContext({ viewport: { width: w, height: 900 }, hasTouch: w === 390, isMobile: w === 390 });
    const q = await c.newPage();
    await q.goto(`${BASE}/careers#roles`, { waitUntil: "load" }); await q.waitForTimeout(1200);
    const card2 = q.locator("#roles a.role").first();
    const t = await box(card2.locator(".role-main")); const l = await box(card2.locator(".link-arrow"));
    log(`[${w}] "View and apply" under the title ${l.y >= t.y + t.h - 2} (title y ${t.y} h ${t.h}, link y ${l.y}) | no sideways scroll ${await q.evaluate(() => document.documentElement.scrollWidth <= innerWidth)}`);
    if (w === 390) {
      const y0 = (await box(card2)).y;
      await card2.dispatchEvent("pointerover", { pointerType: "touch" });
      log(`[390 touch] hover media ${await q.evaluate(() => matchMedia("(hover: hover)").matches)} | card transform ${await css(card2, ["transform"])}`);
      await card2.tap(); await q.waitForTimeout(2000);
      log(`[390 touch] tap lands ${new URL(q.url()).pathname}`);
      await q.goto(`${BASE}/careers#roles`, { waitUntil: "load" }); await q.waitForTimeout(1000);
      await q.screenshot({ path: `${OUT}/role-390.png` });
    }
    await c.close();
  }
  const r = await b.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
  const rp = await r.newPage();
  await rp.goto(`${BASE}/careers#roles`, { waitUntil: "load" }); await rp.waitForTimeout(1200);
  const rc = rp.locator("#roles a.role").first();
  await rc.hover(); await rp.waitForTimeout(100);
  log(`[1280 reduced] card transition ${await css(rc, ["transitionDuration"])} | transform ${await css(rc, ["transform"])}`);
  await r.close();
} finally { await b.close(); }
