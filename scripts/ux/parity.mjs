// UX parity (the floor): prototype vs the running app, element by element.
//   npm run ux:parity -- scripts/ux/surfaces/header.json [--dev http://localhost:3000] [--out dir] [--strict]
// Writes <out>/report.md, <out>/results.json and one prototype|dev|diff image per element.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { PNG } from "pngjs";
import {
  devUrl,
  launchBrowser,
  openPage,
  prototypeUrl,
  readElement,
  runActions,
  runProbeEvent,
  captureBox,
} from "./browser.mjs";
import {
  compareBoxes,
  compareStyles,
  diffImages,
  PARITY_WIDTHS,
  parseArgs,
  PROBE_EVENTS,
  probeError,
  relevantProps,
  renderParityReport,
  sideBySide,
  stateApplies,
  validateSurface,
} from "./lib.mjs";

const options = parseArgs(process.argv.slice(2));
const surface = validateSurface(
  JSON.parse(await readFile(options.surface, "utf8")),
);
const out = options.out ?? join("ux-reports", surface.name, "parity");
await mkdir(out, { recursive: true });

const states = [
  { name: "default", proto: [], dev: [] },
  ...(surface.states ?? []),
];
const browser = await launchBrowser();
const results = [];
const probes = [];
try {
  for (const width of surface.widths ?? PARITY_WIDTHS) {
    for (const state of states.filter((s) => stateApplies(s, width))) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        reducedMotion: "reduce",
      });
      const proto = await openPage(
        context,
        prototypeUrl(surface),
        surface.ready?.proto,
      );
      const dev = await openPage(
        context,
        devUrl(surface, options.dev),
        surface.ready?.dev,
      );
      await runActions(proto, state.proto, `${state.name} (prototype)`);
      await runActions(dev, state.dev, `${state.name} (dev)`);
      const elements = [];
      for (const element of surface.elements.filter(
        (e) => !state.elements || state.elements.includes(e.name),
      )) {
        const a = await readElement(proto, element.proto);
        const b = await readElement(dev, element.dev);
        if (!a && !b) continue; // hidden on both sides at this width and state
        const entry = { name: element.name, boxDiffs: [], styleDiffs: [] };
        if (!a || !b) {
          entry.missing = a ? "dev" : "prototype";
        } else {
          entry.boxDiffs = compareBoxes(a.box, b.box);
          entry.styleDiffs = compareStyles(
            a.styles,
            b.styles,
            element.props ?? relevantProps(a, b),
          );
          const shot = diffImages(
            PNG.sync.read(await captureBox(proto, a.box)),
            PNG.sync.read(await captureBox(dev, b.box)),
          );
          entry.percent = shot.percent;
          // "." cannot appear in a name, so no two element/state pairs share a file.
          entry.image = `${element.name}.${state.name}.${width}.png`;
          await writeFile(
            join(out, entry.image),
            PNG.sync.write(sideBySide(shot.a, shot.b, shot.diff)),
          );
        }
        elements.push(entry);
      }
      results.push({ state: state.name, width, elements });
      await context.close();
    }
  }
  for (const probe of surface.probes ?? []) {
    for (const width of (surface.widths ?? PARITY_WIDTHS).filter((w) =>
      stateApplies(probe, w),
    )) {
      const outcome = { name: probe.name, width, proto: {}, dev: {} };
      for (const event of PROBE_EVENTS) {
        for (const [side, url, ready] of [
          ["proto", prototypeUrl(surface), surface.ready?.proto],
          ["dev", devUrl(surface, options.dev), surface.ready?.dev],
        ]) {
          // A fresh page per event and side: no state leaks from one probe to the next.
          const context = await browser.newContext({
            viewport: { width, height: 900 },
          });
          const page = await openPage(context, url, ready);
          // A probe that cannot run (e.g. a trigger hidden at this width) is a counted error.
          outcome[side][event] = await runProbeEvent(
            page,
            probe,
            side,
            event,
          ).catch(probeError);
          await context.close();
        }
      }
      probes.push(outcome);
    }
  }
} finally {
  await browser.close();
}

const { markdown, unexplained, pending } = renderParityReport(
  surface,
  results,
  probes,
);
await writeFile(join(out, "report.md"), markdown);
await writeFile(
  join(out, "results.json"),
  JSON.stringify({ results, probes }, null, 2),
);
console.log(
  `UX parity ${surface.name}: ${unexplained} unexplained difference(s), ${pending} pending design decision(s). Report: ${join(out, "report.md")}`,
);
if (options.strict && unexplained > 0) process.exitCode = 1;
