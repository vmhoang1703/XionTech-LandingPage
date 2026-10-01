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
  const names = new Set();
  for (const [i, element] of elements.entries()) {
    for (const key of ["name", "proto", "dev"]) {
      if (typeof element?.[key] !== "string" || element[key] === "")
        problems.push(`elements[${i}].${key} must be a non-empty string`);
    }
    if (names.has(element?.name))
      problems.push(`elements[${i}].name "${element.name}" is used twice`);
    names.add(element?.name);
  }
  for (const [i, probe] of (surface?.probes ?? []).entries()) {
    if (typeof probe?.name !== "string" || probe.name === "")
      problems.push(`probes[${i}].name must be a non-empty string`);
    for (const key of ["trigger", "observe"]) {
      for (const side of ["proto", "dev"]) {
        if (typeof probe?.[key]?.[side] !== "string" || probe[key][side] === "")
          problems.push(`probes[${i}].${key}.${side} must be a CSS selector`);
      }
    }
  }
  for (const [i, state] of (surface?.states ?? []).entries()) {
    if (typeof state?.name !== "string" || state.name === "")
      problems.push(`states[${i}].name must be a non-empty string`);
    for (const side of ["proto", "dev"]) {
      if (!Array.isArray(state?.[side]))
        problems.push(`states[${i}].${side} must be a list of actions`);
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

/** True when the surface's `intended` list explains this difference. */
export function isIntended(surface, element, prop) {
  return (surface.intended ?? []).some(
    (entry) =>
      entry.element === element &&
      (entry.prop === undefined || entry.prop === prop),
  );
}

/** The intended entry's note, for the report. */
export function intendedNote(surface, element, prop) {
  return (surface.intended ?? []).find(
    (entry) =>
      entry.element === element &&
      (entry.prop === undefined || entry.prop === prop),
  )?.note;
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
  "hover-then-click",
  "click",
  "click-twice",
  "keyboard",
  "escape",
];

/** Events whose outcome ("open" / "closed", plus focus after Escape) differs between the sides. */
export function compareProbeOutcomes(proto, dev) {
  return PROBE_EVENTS.filter((event) => proto[event] !== dev[event]).map(
    (event) => ({ event, proto: proto[event], dev: dev[event] }),
  );
}

/** Behaviour section of the report: one row per probe, event and width. */
function renderProbes(surface, probes) {
  let unexplained = 0;
  const lines = [];
  if (probes.length === 0) return { lines, unexplained };
  lines.push(
    "## Behaviour (interaction probes)",
    "",
    "| Probe | Width | Event | Prototype | Dev | |",
    "| --- | --- | --- | --- | --- | --- |",
  );
  for (const p of probes) {
    for (const event of PROBE_EVENTS) {
      const proto = p.proto[event];
      const dev = p.dev[event];
      let mark = "same";
      if (proto !== dev) {
        const note = intendedNote(surface, p.name, event);
        if (note) mark = `intended: ${note}`;
        else {
          unexplained += 1;
          mark = "**differs**";
        }
      }
      lines.push(
        `| ${p.name} | ${p.width} | ${event} | ${proto} | ${dev} | ${mark} |`,
      );
    }
  }
  lines.push("");
  return { lines, unexplained };
}

/** Markdown report for parity results: one section per state and width, then behaviour. */
export function renderParityReport(surface, results, probes = []) {
  let unexplained = 0;
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
      if (e.missing) notes.push(`missing on ${e.missing}`);
      for (const d of [...e.boxDiffs, ...e.styleDiffs]) {
        const note = intendedNote(surface, e.name, d.prop);
        if (note)
          notes.push(`${d.prop}: ${d.proto} → ${d.dev} (intended: ${note})`);
        else {
          unexplained += 1;
          notes.push(`**${d.prop}: ${d.proto} → ${d.dev}**`);
        }
      }
      if (e.missing && !isIntended(surface, e.name)) unexplained += 1;
      const pixels =
        e.percent === undefined ? "n/a" : `${e.percent}% ![](${e.image})`;
      lines.push(
        `| ${e.name} | ${pixels} | ${notes.length ? notes.join("<br>") : "none"} |`,
      );
    }
    lines.push("");
  }
  const behaviour = renderProbes(surface, probes);
  lines.push(...behaviour.lines);
  unexplained += behaviour.unexplained;
  lines.splice(
    3,
    0,
    `**Unexplained differences: ${unexplained}** (bold below). Each must be fixed, or listed in the surface file's \`intended\` with a reason or decision ID.`,
    "",
  );
  return { markdown: lines.join("\n"), unexplained };
}
