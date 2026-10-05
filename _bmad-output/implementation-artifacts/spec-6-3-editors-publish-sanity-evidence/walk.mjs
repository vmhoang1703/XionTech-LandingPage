import { chromium } from "@playwright/test";

const OUT = process.env.OUT;
if (!OUT) throw new Error("Set OUT to the evidence folder");
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const b = await chromium.launch({ channel: "chrome" });
try {
  for (const w of [1280, 640, 390]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    const r = await p.goto(`${BASE}/careers`, { waitUntil: "load" });
    const life = p.locator("#life");
    const frames = await life.locator(".news-grid > *").evaluateAll((els) =>
      els.map((el) => (el.querySelector("img") ? `photo "${el.querySelector("img").alt}"` : `frame "${el.textContent.trim()}"`)),
    );
    const cols = await life.locator(".news-grid").evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(" ").length);
    const sideways = await p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
    console.log(`[${w}] /careers -> ${r?.status()} | life: ${frames.join(", ")} | columns ${cols} | no sideways scroll ${sideways}`);
    if (w === 1280) await life.screenshot({ path: `${OUT}/life-1280.png` });
    await p.close();
  }
} finally {
  await b.close();
}
