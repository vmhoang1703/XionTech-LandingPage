import { chromium } from "@playwright/test";
const OUT = process.env.OUT;
if (!OUT) throw new Error("Set OUT to the evidence folder");
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const b = await chromium.launch({ channel: "chrome", timeout: 120000 });
for (const w of [1280, 390]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 }, ...(w === 390 ? { hasTouch: true, isMobile: true } : {}) });
  const r = await p.goto(`${BASE}/privacy`, { waitUntil: "load" });
  if (!r) throw new Error("No response for /privacy");
  await p.waitForTimeout(1000);
  console.log(`[${w}] status ${r.status()} | title "${await p.title()}"`);
  console.log(`[${w}] h1 ${await p.locator("h1").count()} "${(await p.locator("h1").first().innerText()).replace(/\s+/g, " ")}" | h2 in main ${await p.locator("main h2").count()}`);
  console.log(`[${w}] h2 list: ${(await p.locator("main h2").allInnerTexts()).join(" | ")}`);
  console.log(`[${w}] [Placeholder] paragraphs ${await p.locator("main p", { hasText: "[Placeholder]" }).count()} of ${await p.locator("main p").count()}`);
  console.log(`[${w}] header ${await p.locator("header").count()} footer ${await p.locator("footer").count()} capture band ${await p.locator("section.capture").count()}`);
  console.log(`[${w}] no horizontal scroll ${await p.evaluate((x) => document.documentElement.scrollWidth <= x, w)}`);
  const crumb = p.getByRole("navigation", { name: "Breadcrumb" }).getByRole("link", { name: "Home" });
  if (await crumb.count()) {
    console.log(`[${w}] first main link "${(await crumb.innerText()).trim()}" -> ${await crumb.getAttribute("href")}`);
    if (w === 1280) {
      const before = await crumb.evaluate((el) => getComputedStyle(el).color + " " + getComputedStyle(el).textDecorationLine);
      await crumb.hover(); await p.waitForTimeout(300);
      const after = await crumb.evaluate((el) => getComputedStyle(el).color + " " + getComputedStyle(el).textDecorationLine);
      console.log(`[1280] breadcrumb hover: before "${before}" after "${after}"`);
      await p.mouse.move(0, 0);
      await p.evaluate(() => document.activeElement instanceof HTMLElement && document.activeElement.blur());
      let tabs = 0;
      while (tabs < 40 && !(await crumb.evaluate((el) => el === document.activeElement))) { await p.keyboard.press("Tab"); tabs++; }
      const st = await crumb.evaluate((el) => ({ active: el === document.activeElement, fv: el.matches(":focus-visible"), o: getComputedStyle(el).outlineStyle + " " + getComputedStyle(el).outlineWidth }));
      console.log(`[1280] Tab x${tabs} reaches breadcrumb ${st.active} | :focus-visible ${st.fv} | outline ${st.o}`);
      await p.keyboard.press("Enter");
      await p.waitForURL((u) => new URL(u).pathname === "/", { timeout: 15000 });
      console.log(`[1280] Enter on breadcrumb lands ${new URL(p.url()).pathname}`);
    }
  } else console.log(`[${w}] no breadcrumb link in main`);
  if (w === 1280) await p.goto(`${BASE}/privacy`, { waitUntil: "load" });
  await p.screenshot({ path: `${OUT}/privacy-${w}.png`, fullPage: true });
  if (w === 390) {
    await p.goto(`${BASE}/`, { waitUntil: "load" }); await p.waitForTimeout(800);
    await p.locator("footer").getByRole("link", { name: /privacy/i }).first().tap();
    await p.waitForURL("**/privacy", { timeout: 15000 });
    console.log(`[390] footer Privacy link tap lands ${new URL(p.url()).pathname}`);
  }
  await p.close();
}
// Footer link by mouse click and keyboard Enter, at 1280
{
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  for (const how of ["click", "Enter"]) {
    await p.goto(`${BASE}/`, { waitUntil: "load" }); await p.waitForTimeout(800);
    const link = p.locator("footer").getByRole("link", { name: /privacy/i }).first();
    if (how === "click") await link.click(); else { await link.focus(); await p.keyboard.press("Enter"); }
    await p.waitForURL("**/privacy", { timeout: 15000 });
    console.log(`[1280] footer Privacy link ${how} lands ${new URL(p.url()).pathname}`);
  }
  await p.close();
}
// Text column and sideways scroll at 1280, 720, 375
for (const w of [1280, 720, 375]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  await p.goto(`${BASE}/privacy`, { waitUntil: "load" }); await p.waitForTimeout(800);
  const m = await p.evaluate(() => {
    const box = document.querySelector("main h2").closest(".wrap").getBoundingClientRect();
    return { sw: document.documentElement.scrollWidth, w: Math.round(box.width), l: Math.round(box.left), r: Math.round(innerWidth - box.right) };
  });
  console.log(`[${w}] text column .wrap box ${m.w}px, left ${m.l}, right ${m.r} | no sideways scroll ${m.sw <= w}`);
  if (w !== 1280) await p.screenshot({ path: `${OUT}/privacy-${w}.png` });
  await p.close();
}
await b.close();
