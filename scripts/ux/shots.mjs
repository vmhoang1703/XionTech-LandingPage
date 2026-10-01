// UX shots (input for the critic pass): the running app at many widths and states,
// plus an axe accessibility scan, reduced motion, JavaScript off and layout-shift numbers.
//   npm run ux:shots -- scripts/ux/surfaces/header.json [--dev http://localhost:3000] [--out dir]
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import AxeBuilder from "@axe-core/playwright";
import { devUrl, launchBrowser, openPage, runActions } from "./browser.mjs";
import { parseArgs, stateApplies, validateSurface } from "./lib.mjs";

export const SHOT_WIDTHS = [360, 390, 768, 1024, 1280, 1440, 1920];

const options = parseArgs(process.argv.slice(2));
const surface = validateSurface(
  JSON.parse(await readFile(options.surface, "utf8")),
);
const out = options.out ?? join("ux-reports", surface.name, "shots");
await mkdir(out, { recursive: true });

const url = devUrl(surface, options.dev);
const clipHeight = surface.shotHeight ?? 640;
const states = [{ name: "default", dev: [] }, ...(surface.states ?? [])];
const browser = await launchBrowser();
const index = [
  `# UX shots: ${surface.name}`,
  "",
  `Route \`${surface.route}\` on ${options.dev}. Input for the critic pass (docs/ux-quality.md).`,
  "",
];
const summary = {
  surface: surface.name,
  url,
  shots: [],
  axe: [],
  layoutShift: null,
};
try {
  for (const state of states) {
    index.push(`## ${state.name}`, "");
    for (const width of (surface.shotWidths ?? SHOT_WIDTHS).filter((w) =>
      stateApplies(state, w),
    )) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
      });
      const page = await openPage(context, url, surface.ready?.dev);
      await runActions(page, state.dev);
      const file = `${state.name}-${width}.png`;
      await page.screenshot({
        path: join(out, file),
        clip: { x: 0, y: 0, width, height: clipHeight },
      });
      index.push(`- ${width}px: ![](${file})`);
      summary.shots.push(file);
      await context.close();
    }
    index.push("");
  }

  for (const width of [1280, 390]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
    });
    const page = await openPage(context, url, surface.ready?.dev);
    const scan = await new AxeBuilder({ page })
      .include(surface.axeScope ?? "body")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    summary.axe.push({
      width,
      violations: scan.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        help: v.help,
        nodes: v.nodes.length,
      })),
    });
    if (width === 1280) {
      summary.layoutShift = await page.evaluate(
        () =>
          new Promise((done) => {
            let total = 0;
            new PerformanceObserver((list) => {
              for (const entry of list.getEntries())
                if (!entry.hadRecentInput) total += entry.value;
            }).observe({ type: "layout-shift", buffered: true });
            setTimeout(() => done(Math.round(total * 1000) / 1000), 1000);
          }),
      );
    }
    await context.close();
  }

  const reduced = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    reducedMotion: "reduce",
  });
  await (
    await openPage(reduced, url, surface.ready?.dev)
  ).screenshot({
    path: join(out, "reduced-motion-1280.png"),
    clip: { x: 0, y: 0, width: 1280, height: clipHeight },
  });
  await reduced.close();
  const noJs = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    javaScriptEnabled: false,
  });
  await (
    await openPage(noJs, url)
  ).screenshot({
    path: join(out, "no-js-1280.png"),
    clip: { x: 0, y: 0, width: 1280, height: clipHeight },
  });
  await noJs.close();
} finally {
  await browser.close();
}

index.push(
  "## Reduced motion and JavaScript off",
  "",
  "- ![](reduced-motion-1280.png)",
  "- ![](no-js-1280.png)",
  "",
);
index.push("## Accessibility (axe, WCAG 2.2 AA tags)", "");
for (const scan of summary.axe) {
  index.push(
    `- ${scan.width}px: ${scan.violations.length === 0 ? "no violations" : scan.violations.map((v) => `${v.id} (${v.impact}, ${v.nodes} node(s)): ${v.help}`).join("; ")}`,
  );
}
index.push(
  "",
  `## Layout shift`,
  "",
  `- Cumulative layout shift after load at 1280px: ${summary.layoutShift} (dev server; measure budgets on \`next start\`).`,
  "",
);
await writeFile(join(out, "shots.md"), index.join("\n"));
await writeFile(join(out, "summary.json"), JSON.stringify(summary, null, 2));
const violations = summary.axe.reduce((n, s) => n + s.violations.length, 0);
console.log(
  `UX shots ${surface.name}: ${summary.shots.length} screenshots, ${violations} axe violation(s), CLS ${summary.layoutShift}. Index: ${join(out, "shots.md")}`,
);
