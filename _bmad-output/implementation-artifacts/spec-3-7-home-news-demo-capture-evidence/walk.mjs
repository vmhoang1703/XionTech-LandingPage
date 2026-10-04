import { chromium } from "@playwright/test";

const OUT = process.env.OUT;
if (!OUT) throw new Error("Set OUT to the evidence folder");
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const b = await chromium.launch({ channel: "chrome", timeout: 120000 });
const log = (s) => console.log(s);
const settle = (p) => p.waitForTimeout(1200);
const css = (l, ps) => l.evaluate((el, ps) => ps.map((p) => getComputedStyle(el)[p]).join(" | "), ps);
const box = (l) =>
  l.evaluate((el) => {
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) };
  });
const news = (p) => p.locator('section[aria-labelledby="news-h"]');

try {
  {
    const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
    const r = await p.goto(`${BASE}/`, { waitUntil: "load" });
    if (!r) throw new Error("No response for /");
    await settle(p);
    const order = await p.evaluate(() =>
      [...document.querySelectorAll("main > section, main > * > section")].map((s) => `${s.getAttribute("aria-labelledby") || s.className.split(" ")[0]}`),
    );
    log(`[1280] section order: ${order.join(" > ")}`);
    const s = news(p);
    if ((await s.count()) === 0) throw new Error("No Home news section");
    log(`[1280] news: class "${await s.getAttribute("class")}" | bg ${(await css(s, ["backgroundImage", "backgroundColor"])).slice(0, 70)} | H2 "${(await s.locator("h2").innerText()).trim()}"`);
    log(`[1280] sample note: "${await s.locator(".sample").innerText().catch(() => "none")}" | cards ${await s.locator(".ncard").count()} | grid columns ${await s.locator(".news-grid").evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(" ").length).catch(() => "error")}`);
    const card = s.locator(".ncard").first();
    if (await card.count()) {
      log(`[1280] card radius ${await css(card, ["borderRadius"])} | frame ratio ${await card.locator(".frame").evaluate((el) => (el.getBoundingClientRect().width / el.getBoundingClientRect().height).toFixed(2))} | meta "${(await card.locator(".meta").innerText()).replace(/\s+/g, " ")}" | tag ${await card.locator(".cat").count()}`);
      const read = card.locator("a.link-arrow");
      log(`[1280] Read story: href ${await read.getAttribute("href")} | name "${(await read.innerText()).replace(/\s+/g, " ")}"`);
      const c0 = await box(card);
      const arrow = read.locator("svg").first();
      const a0 = (await arrow.count()) ? await box(arrow) : null;
      await read.hover();
      await p.waitForTimeout(600);
      const c1 = await box(card);
      const a1 = a0 ? await box(arrow) : null;
      log(`[1280] hover Read story: card y ${c0.y} -> ${c1.y} (no lift) | arrow x ${a0?.x} -> ${a1?.x} | card shadow ${(await css(card, ["boxShadow"])).slice(0, 30)}`);
      await p.mouse.move(0, 0);
      await p.evaluate(() => document.activeElement instanceof HTMLElement && document.activeElement.blur());
      let n = 0;
      while (n < 80 && !(await read.evaluate((el) => el === document.activeElement))) {
        await p.keyboard.press("Tab");
        n++;
      }
      log(`[1280] Tab x${n} reaches Read story ${await read.evaluate((el) => el === document.activeElement)} | :focus-visible ${await read.evaluate((el) => el.matches(":focus-visible"))} | outline ${await css(read, ["outlineStyle", "outlineWidth"])}`);
      await read.click();
      await p.waitForTimeout(2500);
      log(`[1280] click Read story lands ${new URL(p.url()).pathname} | h1 "${await p.locator("h1").first().innerText().catch(() => "")}"`);
      await p.goto(`${BASE}/`, { waitUntil: "load" });
      await settle(p);
    }
    const all = news(p).getByRole("link", { name: /See all news/ });
    log(`[1280] See all news: href ${await all.getAttribute("href")}`);
    await news(p).scrollIntoViewIfNeeded();
    await p.waitForTimeout(400);
    await news(p).screenshot({ path: `${OUT}/home-news-1280.png` });
    await p.close();
  }
  for (const w of [900, 640, 390]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    await p.goto(`${BASE}/`, { waitUntil: "load" });
    await settle(p);
    const cols = await news(p).locator(".news-grid").evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(" ").length).catch(() => "error");
    log(`[${w}] news grid columns ${cols} | no sideways scroll ${await p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)}`);
    if (w === 390) {
      await news(p).scrollIntoViewIfNeeded();
      await p.waitForTimeout(400);
      await news(p).screenshot({ path: `${OUT}/home-news-390.png` });
    }
    await p.close();
  }
} finally {
  await b.close();
}
