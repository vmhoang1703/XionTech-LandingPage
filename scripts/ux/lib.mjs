// Shared, side-effect-free helpers for the UX quality scripts (parity.mjs, shots.mjs).
// Everything here is unit-tested in lib.test.mjs; the scripts only add the browser.
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

/** Style properties compared element by element (computed values). */
export const STYLE_PROPS = [
  "fontFamily",
  "fontSize",
  "fontWeight",
  "lineHeight",
  "letterSpacing",
  "textTransform",
  "color",
  "backgroundColor",
  "padding",
  "gap",
  "borderRadius",
  "borderBottom",
  "boxShadow",
];

/** Box differences up to this many CSS pixels count as equal (sub-pixel rounding). */
export const BOX_TOLERANCE = 1;

/** `--key value` pairs after one positional argument: the surface file. */
export function parseArgs(argv) {
  const [surface, ...rest] = argv;
  if (!surface || surface.startsWith("--")) {
    throw new Error(
      "Usage: <surface.json> [--dev <url>] [--out <dir>] [--strict]",
    );
  }
  const options = {
    surface,
    dev: "http://localhost:3000",
    out: null,
    strict: false,
  };
  for (let i = 0; i < rest.length; i += 1) {
    const flag = rest[i];
    if (flag === "--strict") {
      options.strict = true;
    } else if (flag === "--dev" || flag === "--out") {
      const value = rest[i + 1];
      if (!value || value.startsWith("--"))
        throw new Error(`${flag} needs a value`);
      options[flag.slice(2)] = value;
      i += 1;
    } else {
      throw new Error(`Unknown argument: ${flag}`);
    }
  }
  return options;
}

/** Throws a readable error unless the surface file has what both scripts need. */
export function validateSurface(surface) {
  const problems = [];
  for (const key of ["name", "prototype", "route"]) {
    if (typeof surface?.[key] !== "string" || surface[key] === "")
      problems.push(`"${key}" must be a non-empty string`);
  }
  const elements = Array.isArray(surface?.elements) ? surface.elements : [];
  if (elements.length === 0)
    problems.push('"elements" must list at least one element');
  // Names become folder names, file names and report text, so they stay plain and lower case (a
  // file system that ignores case would merge "Logo" and "logo"). Only real names enter the
  // sets: a null or nameless entry is listed as a problem, never matched or crashed on.
  const named = (value) => typeof value === "string" && value !== "";
  const plainName = (value, where) => {
    if (named(value) && !/^[a-z0-9_-]+$/.test(value))
      problems.push(
        `${where} "${value}" may only use a-z, 0-9, "-" and "_" (names become file names and report text)`,
      );
  };
  plainName(surface?.name, "name");
  const names = new Set();
  for (const [i, element] of elements.entries()) {
    for (const key of ["name", "proto", "dev"]) {
      if (typeof element?.[key] !== "string" || element[key] === "")
        problems.push(`elements[${i}].${key} must be a non-empty string`);
    }
    if (names.has(element?.name))
      problems.push(`elements[${i}].name "${element.name}" is used twice`);
    plainName(element?.name, `elements[${i}].name`);
    if (named(element?.name)) names.add(element.name);
  }
  for (const key of ["states", "probes", "intended", "widths", "shotWidths"]) {
    if (surface?.[key] !== undefined && !Array.isArray(surface[key]))
      problems.push(`"${key}" must be a list`);
  }
  const list = (key) => (Array.isArray(surface?.[key]) ? surface[key] : []);
  const parityWidths = Array.isArray(surface?.widths)
    ? surface.widths
    : PARITY_WIDTHS;
  const probeNames = new Set();
  for (const [i, probe] of list("probes").entries()) {
    if (typeof probe?.name !== "string" || probe.name === "")
      problems.push(`probes[${i}].name must be a non-empty string`);
    if (probeNames.has(probe?.name))
      problems.push(`probes[${i}].name "${probe.name}" is used twice`);
    if (names.has(probe?.name))
      problems.push(
        `probes[${i}].name "${probe.name}" is also an element name (an intended entry for it would match both)`,
      );
    plainName(probe?.name, `probes[${i}].name`);
    if (named(probe?.name)) probeNames.add(probe.name);
    for (const key of [
      "trigger",
      "observe",
      ...(probe?.hover ? ["hover"] : []),
    ]) {
      for (const side of ["proto", "dev"]) {
        if (typeof probe?.[key]?.[side] !== "string" || probe[key][side] === "")
          problems.push(`probes[${i}].${key}.${side} must be a CSS selector`);
      }
    }
  }
  // The scripts make their own "default" state and "reduced-motion" / "no-js" shots.
  const reservedStates = ["default", "reduced-motion", "no-js"];
  const stateNames = new Set();
  for (const [i, state] of list("states").entries()) {
    if (typeof state?.name !== "string" || state.name === "")
      problems.push(`states[${i}].name must be a non-empty string`);
    if (reservedStates.includes(state?.name))
      problems.push(
        `states[${i}].name "${state.name}" is reserved (${reservedStates.join(", ")})`,
      );
    else if (stateNames.has(state?.name))
      problems.push(`states[${i}].name "${state.name}" is used twice`);
    plainName(state?.name, `states[${i}].name`);
    if (named(state?.name)) stateNames.add(state.name);
    for (const side of ["proto", "dev"]) {
      if (!Array.isArray(state?.[side]))
        problems.push(`states[${i}].${side} must be a list of actions`);
    }
    if (state?.elements !== undefined && !Array.isArray(state.elements))
      problems.push(`states[${i}].elements must be a list of element names`);
    for (const name of Array.isArray(state?.elements) ? state.elements : []) {
      if (!names.has(name))
        problems.push(`states[${i}].elements names unknown element "${name}"`);
    }
  }
  for (const [i, entry] of list("intended").entries()) {
    if (!names.has(entry?.element) && !probeNames.has(entry?.element))
      problems.push(
        `intended[${i}].element "${entry?.element}" is not an element or probe name`,
      );
    if (typeof entry?.note !== "string" || entry.note === "")
      problems.push(`intended[${i}].note must give the reason or decision ID`);
    if (entry?.pending !== undefined && typeof entry.pending !== "boolean")
      problems.push(`intended[${i}].pending must be true or false`);
    if (probeNames.has(entry?.element)) {
      if (!PROBE_EVENTS.includes(entry.prop))
        problems.push(
          `intended[${i}].prop must be a probe event (${PROBE_EVENTS.join(", ")})`,
        );
      if (entry.state !== undefined)
        problems.push(
          `intended[${i}].state does not apply to a probe (probes run from a fresh page)`,
        );
    } else if (
      entry?.state !== undefined &&
      entry.state !== "default" &&
      !stateNames.has(entry.state)
    )
      problems.push(
        `intended[${i}].state "${entry.state}" is not "default" or a state name`,
      );
    // An entry for a state or width that never runs would never match, and a pending one would
    // silently drop out of the "Pending design decisions" list.
    if (entry?.width !== undefined && !parityWidths.includes(entry.width))
      problems.push(
        `intended[${i}].width ${entry.width} is not a parity width (${parityWidths.join(", ")})`,
      );
  }
  for (const key of ["widths", "shotWidths"]) {
    for (const width of list(key)) {
      if (!Number.isInteger(width) || width <= 0)
        problems.push(`"${key}" must hold positive whole numbers`);
    }
  }
  if (problems.length > 0)
    throw new Error(`Invalid surface file:\n- ${problems.join("\n- ")}`);
  return surface;
}

/** A state applies at a width unless it sets a `minWidth` above it (e.g. desktop-only menus). */
export function stateApplies(state, width) {
  return state.minWidth === undefined || width >= state.minWidth;
}

/** rgb(), rgba() and color(srgb …) all become `rgba(R, G, B, A)` so equal colours compare equal. */
export function normalizeColor(value) {
  if (typeof value !== "string") return value;
  const rgb =
    /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.]+))?\s*\)$/.exec(
      value.trim(),
    );
  if (rgb)
    return formatRgba(
      [rgb[1], rgb[2], rgb[3]].map(Number),
      rgb[4] === undefined ? 1 : Number(rgb[4]),
    );
  const srgb =
    /^color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\s*\)$/.exec(
      value.trim(),
    );
  if (srgb)
    return formatRgba(
      [srgb[1], srgb[2], srgb[3]].map((c) => Number(c) * 255),
      srgb[4] === undefined ? 1 : Number(srgb[4]),
    );
  return value;
}

function formatRgba(channels, alpha) {
  const [r, g, b] = channels.map((c) => Math.round(c));
  return `rgba(${r}, ${g}, ${b}, ${Math.round(alpha * 100) / 100})`;
}

/** Normalizes every colour inside a longer value such as a box-shadow or border. */
export function normalizeColors(value) {
  if (typeof value !== "string") return value;
  return value.replace(/(?:rgba?|color)\([^)]*\)/g, (match) =>
    normalizeColor(match),
  );
}

/** Text styles; meaningless on an element without text (an image, an empty box). */
export const TEXT_PROPS = [
  "fontFamily",
  "fontSize",
  "fontWeight",
  "lineHeight",
  "letterSpacing",
  "textTransform",
  "color",
];

/**
 * One notation per look, so equal renderings compare equal: colours as rgba(), an empty border as
 * "none", transparent zero-size shadow layers (Tailwind adds four) dropped, any radius of 999px or
 * more as "pill".
 */
export function normalizeStyle(prop, value) {
  if (typeof value !== "string") return value;
  const v = normalizeColors(value);
  if (prop === "borderBottom" && /^0px\b/.test(v)) return "none";
  if (prop === "boxShadow") {
    const layers = v
      .split(/,(?![^(]*\))/)
      .map((l) => l.trim())
      .filter(
        (l) =>
          l !== "none" && !/^rgba\(\d+, \d+, \d+, 0\) 0px 0px 0px 0px$/.test(l),
      );
    return layers.length === 0 ? "none" : layers.join(", ");
  }
  if (prop === "borderRadius" && Number.parseFloat(v) >= 999) return "pill";
  return v;
}

/** The props worth comparing for this pair: no text styles without text, no gap without children. */
export function relevantProps(proto, dev, props = STYLE_PROPS) {
  const hasText = Boolean(proto?.hasText || dev?.hasText);
  const hasChildren = (proto?.children ?? 0) > 1 || (dev?.children ?? 0) > 1;
  return props.filter(
    (p) => (hasText || !TEXT_PROPS.includes(p)) && (hasChildren || p !== "gap"),
  );
}

/** Differences between two computed-style objects, after normalizeStyle. */
export function compareStyles(proto, dev, props = STYLE_PROPS) {
  const diffs = [];
  for (const prop of props) {
    const a = normalizeStyle(prop, proto?.[prop]);
    const b = normalizeStyle(prop, dev?.[prop]);
    if (a !== b)
      diffs.push({ prop, proto: a ?? "(missing)", dev: b ?? "(missing)" });
  }
  return diffs;
}

/** Box differences beyond the tolerance: [{ prop, proto, dev }]. */
export function compareBoxes(proto, dev, tolerance = BOX_TOLERANCE) {
  const diffs = [];
  for (const prop of ["x", "y", "width", "height"]) {
    const a = proto?.[prop];
    const b = dev?.[prop];
    if (a === undefined || b === undefined || Math.abs(a - b) > tolerance)
      diffs.push({ prop, proto: a ?? "(missing)", dev: b ?? "(missing)" });
  }
  return diffs;
}

/**
 * The `intended` entry that explains this difference, or undefined. An entry may narrow itself
 * to one state and/or width, so it cannot hide the same property drifting somewhere else.
 */
export function findIntended(surface, element, prop, where = {}) {
  return (surface.intended ?? []).find(
    (entry) =>
      entry.element === element &&
      (entry.prop === undefined || entry.prop === prop) &&
      (entry.state === undefined || entry.state === where.state) &&
      (entry.width === undefined || entry.width === where.width),
  );
}

/** "intended: …" or, for a design question still open, "pending: …". */
function intendedLabel(entry) {
  return `${entry.pending ? "pending" : "intended"}: ${entry.note}`;
}

/** Copies a PNG onto a white canvas of the given size (top-left aligned). */
export function padImage(png, width, height) {
  const out = new PNG({ width, height });
  out.data.fill(255);
  PNG.bitblt(
    png,
    out,
    0,
    0,
    Math.min(png.width, width),
    Math.min(png.height, height),
    0,
    0,
  );
  return out;
}

/** Pixel difference of two PNGs of any size: both are padded to the larger box first. */
export function diffImages(a, b, threshold = 0.1) {
  const width = Math.max(a.width, b.width);
  const height = Math.max(a.height, b.height);
  const pa = padImage(a, width, height);
  const pb = padImage(b, width, height);
  const diff = new PNG({ width, height });
  const mismatched = pixelmatch(pa.data, pb.data, diff.data, width, height, {
    threshold,
  });
  const total = width * height;
  return {
    diff,
    mismatched,
    total,
    percent: Math.round((mismatched / total) * 1000) / 10,
    a: pa,
    b: pb,
  };
}

/** prototype | dev | diff side by side, 8px apart, for the report. */
export function sideBySide(a, b, diff) {
  const gap = 8;
  const out = new PNG({ width: a.width * 3 + gap * 2, height: a.height });
  out.data.fill(255);
  PNG.bitblt(a, out, 0, 0, a.width, a.height, 0, 0);
  PNG.bitblt(b, out, 0, 0, b.width, b.height, a.width + gap, 0);
  PNG.bitblt(diff, out, 0, 0, diff.width, diff.height, (a.width + gap) * 2, 0);
  return out;
}

/**
 * Interaction probes: what a visitor does to a trigger, on a fresh page each time. Static states
 * only show how things look; these compare how they behave (hover-open, click toggles, Escape).
 */
export const PROBE_EVENTS = [
  "hover",
  "hover-then-leave",
  "hover-into-panel",
  "hover-then-click",
  "click",
  "click-then-leave",
  "click-twice",
  "keyboard",
  "escape",
];

/** Default parity widths for ux:parity (a surface may set its own `widths`). */
export const PARITY_WIDTHS = [1280, 1000, 600];

/** Default screenshot widths for ux:shots (a surface may set its own `shotWidths`). */
export const SHOT_WIDTHS = [360, 390, 768, 1024, 1280, 1440, 1920];

/** First line of an error's message (Playwright messages run to many lines); any value works. */
export const firstLine = (error) =>
  String(error?.message ?? error).split(/\r\n?|\n/)[0];

/** Outcome of a probe event that could not run. The "error" prefix never counts as the same. */
export const probeError = (error) => `error: ${firstLine(error)}`;

const isError = (outcome) => String(outcome).startsWith("error");

/** Report text kept on one line: a "|" or any line break must not split a table row or list item. */
const cell = (value) =>
  String(value)
    .replaceAll("|", String.raw`\|`)
    .replaceAll(/\r\n?|\n/g, "<br>");

/**
 * Events whose outcome ("open" / "closed", plus focus after Escape) differs between the sides,
 * or could not be measured ("error: …" on either side, which never counts as the same).
 */
export function compareProbeOutcomes(proto, dev) {
  return PROBE_EVENTS.filter(
    (event) =>
      proto[event] !== dev[event] ||
      isError(proto[event]) ||
      isError(dev[event]),
  ).map((event) => ({ event, proto: proto[event], dev: dev[event] }));
}

/** Behaviour section of the report: one row per probe, event and width. */
function renderProbes(surface, probes) {
  const counts = { unexplained: 0, pending: new Set() };
  const lines = [];
  if (probes.length === 0) return { lines, ...counts };
  lines.push(
    "## Behaviour (interaction probes)",
    "",
    "| Probe | Width | Event | Prototype | Dev | |",
    "| --- | --- | --- | --- | --- | --- |",
  );
  for (const p of probes) {
    const differing = new Set(
      compareProbeOutcomes(p.proto, p.dev).map((d) => d.event),
    );
    for (const event of PROBE_EVENTS) {
      let mark = "same";
      if (differing.has(event)) {
        // A probe that could not run is never explained away by an intended or pending entry.
        const failed = isError(p.proto[event]) || isError(p.dev[event]);
        const entry = failed
          ? undefined
          : findIntended(surface, p.name, event, { width: p.width });
        if (entry) {
          mark = intendedLabel(entry);
          if (entry.pending) counts.pending.add(entry);
        } else {
          counts.unexplained += 1;
          mark = "**differs**";
        }
      }
      lines.push(
        `| ${cell(p.name)} | ${p.width} | ${event} | ${cell(p.proto[event])} | ${cell(p.dev[event])} | ${cell(mark)} |`,
      );
    }
  }
  lines.push("");
  return { lines, ...counts };
}

/** Mapped elements that were never found on either side in any state or width: a broken map. */
export function neverFound(surface, results) {
  const seen = new Set(results.flatMap((r) => r.elements.map((e) => e.name)));
  return surface.elements.map((e) => e.name).filter((name) => !seen.has(name));
}

/** Markdown report for parity results: one section per state and width, then behaviour. */
export function renderParityReport(surface, results, probes = []) {
  let unexplained = 0;
  const pending = new Set();
  const lines = [
    `# UX parity: ${surface.name}`,
    "",
    `Prototype \`${surface.prototype}\` vs route \`${surface.route}\`. Images: prototype | dev | diff (red = different).`,
    "",
  ];
  for (const r of results) {
    lines.push(
      `## ${r.state} at ${r.width}px`,
      "",
      "| Element | Pixels different | Differences |",
      "| --- | --- | --- |",
    );
    for (const e of r.elements) {
      const notes = [];
      const where = { state: r.state, width: r.width };
      if (e.missing) {
        const entry = findIntended(surface, e.name, "missing", where);
        if (entry) {
          notes.push(`missing on ${e.missing} (${intendedLabel(entry)})`);
          if (entry.pending) pending.add(entry);
        } else {
          unexplained += 1;
          notes.push(`**missing on ${e.missing}**`);
        }
      }
      for (const d of [...e.boxDiffs, ...e.styleDiffs]) {
        const entry = findIntended(surface, e.name, d.prop, where);
        if (entry) {
          notes.push(
            `${d.prop}: ${d.proto} → ${d.dev} (${intendedLabel(entry)})`,
          );
          if (entry.pending) pending.add(entry);
        } else {
          unexplained += 1;
          notes.push(`**${d.prop}: ${d.proto} → ${d.dev}**`);
        }
      }
      const pixels =
        e.percent === undefined ? "n/a" : `${e.percent}% ![](${e.image})`;
      lines.push(
        `| ${cell(e.name)} | ${pixels} | ${cell(notes.length ? notes.join("<br>") : "none")} |`,
      );
    }
    lines.push("");
  }
  const behaviour = renderProbes(surface, probes);
  lines.push(...behaviour.lines);
  unexplained += behaviour.unexplained;
  for (const entry of behaviour.pending) pending.add(entry);
  const missing = neverFound(surface, results);
  if (missing.length > 0) {
    unexplained += missing.length;
    lines.push(
      "## Never found",
      "",
      `**Not found on either side at any width or state — fix the selector:** ${missing.join(", ")}`,
      "",
    );
  }
  lines.splice(
    3,
    0,
    `**Unexplained differences: ${unexplained}** (bold below). Each must be fixed, or listed in the surface file's \`intended\` with a reason or decision ID.`,
    "",
    `**Pending design decisions: ${pending.size}** (rows marked "pending"). Built one way, waiting for Amber or the lead:`,
    "",
    ...[...pending].map((entry) => `- ${entry.element}: ${cell(entry.note)}`),
    ...(pending.size > 0 ? [""] : []),
  );
  return { markdown: lines.join("\n"), unexplained, pending: pending.size };
}
