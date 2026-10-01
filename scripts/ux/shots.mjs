// UX shots (input for the critic pass): the running app at many widths and states,
// plus an axe accessibility scan of every state, reduced motion, JavaScript off and layout shift.
//   npm run ux:shots -- scripts/ux/surfaces/header.json [--dev http://localhost:3000] [--out dir] [--strict]
// --strict exits 1 on any axe violation or a layout shift above LAYOUT_SHIFT_BUDGET.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import AxeBuilder from "@axe-core/playwright";
import { devUrl, launchBrowser, openPage, runActions } from "./browser.mjs";
import {
  parseArgs,
  SHOT_WIDTHS,
  stateApplies,
  validateSurface,
} from "./lib.mjs";

/** docs/ux-quality.md "Measure": cumulative layout shift must stay under this. */
const LAYOUT_SHIFT_BUDGET = 0.05;
const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"];

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

async function scanAxe(page, label) {
  const scan = await new AxeBuilder({ page })
    .include(surface.axeScope ?? "body")
    .withTags(AXE_TAGS)
    .analyze();
  summary.axe.push({
    label,
    violations: scan.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      help: v.help,
      nodes: v.nodes.length,
    })),
  });
}

try {
  for (const state of states) {
    index.push(`## ${state.name}`, "");
    const widths = (surface.shotWidths ?? SHOT_WIDTHS).filter((w) =>
      stateApplies(state, w),
    );
    for (const width of widths) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
      });
      const page = await openPage(context, url, surface.ready?.dev);
      await runActions(page, state.dev, `${state.name} at ${width}px`);
      await page.waitForTimeout(400); // let hover and colour transitions finish
      const file = `${state.name}-${width}.png`;
      await page.screenshot({
        path: join(out, file),
        clip: { x: 0, y: 0, width, height: clipHeight },
      });
      index.push(`- ${width}px: ![](${file})`);
      summary.shots.push(file);
      // Every state is scanned once (open menus are where contrast and ARIA problems hide);
      // the default state also at a phone width.
      if (width === Math.max(...widths)) await scanAxe(page, `${state.name}`);
      await context.close();
    }
    index.push("");
  }

  const phone = await browser.newContext({
    viewport: { width: 390, height: 900 },
  });
  await scanAxe(
    await openPage(phone, url, surface.ready?.dev),
    "default at 390px",
  );
  await phone.close();

  const load = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });
  summary.layoutShift = await (
    await openPage(load, url, surface.ready?.dev)
  ).evaluate(
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
  await load.close();

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

const violations = summary.axe.reduce((n, s) => n + s.violations.length, 0);
const shiftOverBudget = summary.layoutShift > LAYOUT_SHIFT_BUDGET;
index.push(
  "## Reduced motion and JavaScript off",
  "",
  "- ![](reduced-motion-1280.png)",
  "- ![](no-js-1280.png)",
  "",
  "## Accessibility (axe, WCAG 2.2 AA tags)",
  "",
  ...summary.axe.map(
    (scan) =>
      `- ${scan.label}: ${scan.violations.length === 0 ? "no violations" : scan.violations.map((v) => `**${v.id}** (${v.impact}, ${v.nodes} node(s)): ${v.help}`).join("; ")}`,
  ),
  "",
  "## Layout shift",
  "",
  `- Cumulative layout shift after load at 1280px: ${summary.layoutShift} (budget ${LAYOUT_SHIFT_BUDGET}${shiftOverBudget ? ", **over budget**" : ""}; dev server — measure page budgets on \`next start\`).`,
  "",
);
await writeFile(join(out, "shots.md"), index.join("\n"));
await writeFile(join(out, "summary.json"), JSON.stringify(summary, null, 2));
console.log(
  `UX shots ${surface.name}: ${summary.shots.length} screenshots, ${violations} axe violation(s), CLS ${summary.layoutShift}. Index: ${join(out, "shots.md")}`,
);
if (options.strict && (violations > 0 || shiftOverBudget)) process.exitCode = 1;
