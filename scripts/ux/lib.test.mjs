// @vitest-environment node
import { readFileSync } from "node:fs";
import { PNG } from "pngjs";
import { describe, expect, it } from "vitest";
import {
  compareBoxes,
  compareProbeOutcomes,
  PROBE_EVENTS,
  probeError,
  compareStyles,
  diffImages,
  findIntended,
  firstLine,
  neverFound,
  neverUsed,
  normalizeColor,
  normalizeStyle,
  padImage,
  parityImageName,
  parseArgs,
  relevantProps,
  renderParityReport,
  sideBySide,
  stateApplies,
  validateSurface,
} from "./lib.mjs";

const surface = {
  name: "header",
  prototype: "index.html",
  route: "/",
  elements: [{ name: "logo", proto: ".logo img", dev: "header img" }],
};

function solid(width, height, [r, g, b]) {
  const png = new PNG({ width, height });
  for (let i = 0; i < png.data.length; i += 4) png.data.set([r, g, b, 255], i);
  return png;
}

describe("parseArgs", () => {
  it("reads the surface file, defaults and flags", () => {
    expect(parseArgs(["s.json"])).toEqual({
      surface: "s.json",
      dev: "http://localhost:3000",
      out: null,
      strict: false,
    });
    expect(
      parseArgs([
        "s.json",
        "--dev",
        "http://localhost:3210",
        "--out",
        "x",
        "--strict",
      ]),
    ).toEqual({
      surface: "s.json",
      dev: "http://localhost:3210",
      out: "x",
      strict: true,
    });
  });

  it("refuses a missing surface, a flag without value and unknown flags", () => {
    expect(() => parseArgs([])).toThrow("Usage");
    expect(() => parseArgs(["--dev", "x"])).toThrow("Usage");
    expect(() => parseArgs(["s.json", "--dev"])).toThrow("--dev needs a value");
    expect(() => parseArgs(["s.json", "--out", "--strict"])).toThrow(
      "--out needs a value",
    );
    expect(() => parseArgs(["s.json", "--nope"])).toThrow(
      "Unknown argument: --nope",
    );
  });
});

describe("validateSurface", () => {
  it("accepts a complete surface", () => {
    expect(validateSurface(surface)).toBe(surface);
  });

  it("lists every problem at once", () => {
    const bad = {
      name: "",
      route: "/",
      elements: [
        { name: "a", proto: "x", dev: "" },
        { name: "a", proto: "y", dev: "z" },
      ],
      states: [{ name: "", proto: [] }],
    };
    let message = "";
    try {
      validateSurface(bad);
    } catch (error) {
      message = error.message;
    }
    expect(message).toContain('"name" must be a non-empty string');
    expect(message).toContain('"prototype" must be a non-empty string');
    expect(message).toContain("elements[0].dev must be a non-empty string");
    expect(message).toContain('elements[1].name "a" is used twice');
    expect(message).toContain("states[0].name must be a non-empty string");
    expect(message).toContain("states[0].dev must be a list of actions");
  });

  it("needs at least one element", () => {
    expect(() => validateSurface({ ...surface, elements: [] })).toThrow(
      '"elements" must list at least one element',
    );
    expect(() => validateSurface(null)).toThrow("Invalid surface file");
  });
});

describe("stateApplies", () => {
  it("skips desktop-only states below their minWidth", () => {
    expect(stateApplies({ name: "default" }, 600)).toBe(true);
    expect(stateApplies({ name: "open", minWidth: 1081 }, 1080)).toBe(false);
    expect(stateApplies({ name: "open", minWidth: 1081 }, 1081)).toBe(true);
  });
});

describe("normalizeColor and normalizeStyle", () => {
  it("gives rgb, rgba and color(srgb) one notation", () => {
    expect(normalizeColor("rgb(22, 54, 99)")).toBe("rgba(22, 54, 99, 1)");
    expect(normalizeColor("rgba(22, 54, 99, 0.12)")).toBe(
      "rgba(22, 54, 99, 0.12)",
    );
    expect(
      normalizeColor("color(srgb 0.992157 0.992157 0.996078 / 0.78)"),
    ).toBe("rgba(253, 253, 254, 0.78)");
    expect(normalizeColor("color(srgb 1 0 0)")).toBe("rgba(255, 0, 0, 1)");
    expect(normalizeColor("transparent")).toBe("transparent");
    expect(normalizeColor(undefined)).toBe(undefined);
  });

  it("treats empty borders, empty shadow layers and huge radii as the same look", () => {
    expect(normalizeStyle("borderBottom", "0px none rgb(16, 34, 63)")).toBe(
      "none",
    );
    expect(normalizeStyle("borderBottom", "1px solid rgb(22, 54, 99)")).toBe(
      "1px solid rgba(22, 54, 99, 1)",
    );
    expect(
      normalizeStyle(
        "boxShadow",
        "rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(22, 54, 99, 0.3) 0px 30px 70px -24px",
      ),
    ).toBe("rgba(22, 54, 99, 0.3) 0px 30px 70px -24px");
    expect(normalizeStyle("boxShadow", "none")).toBe("none");
    expect(normalizeStyle("borderRadius", "999px")).toBe("pill");
    expect(normalizeStyle("borderRadius", "9999px")).toBe("pill");
    expect(normalizeStyle("borderRadius", "24px")).toBe("24px");
    expect(normalizeStyle("fontSize", 16)).toBe(16);
  });
});

describe("relevantProps", () => {
  it("drops text styles without text and gap without children", () => {
    const image = { hasText: false, children: 0 };
    expect(relevantProps(image, image)).not.toContain("color");
    expect(relevantProps(image, image)).not.toContain("gap");
    expect(relevantProps({ hasText: true, children: 3 }, image)).toEqual(
      expect.arrayContaining(["color", "gap"]),
    );
  });
});

describe("compareStyles and compareBoxes", () => {
  it("reports only real differences", () => {
    const proto = {
      color: "rgb(22, 54, 99)",
      fontSize: "14.72px",
      borderRadius: "999px",
    };
    const dev = {
      color: "rgba(22, 54, 99, 1)",
      fontSize: "16px",
      borderRadius: "9999px",
    };
    expect(
      compareStyles(proto, dev, ["color", "fontSize", "borderRadius"]),
    ).toEqual([{ prop: "fontSize", proto: "14.72px", dev: "16px" }]);
    expect(compareStyles({}, { color: "red" }, ["color"])).toEqual([
      { prop: "color", proto: "(missing)", dev: "red" },
    ]);
  });

  it("allows one pixel of rounding in boxes", () => {
    expect(
      compareBoxes(
        { x: 240, y: 0, width: 96, height: 40 },
        { x: 241, y: 0, width: 96, height: 40 },
      ),
    ).toEqual([]);
    expect(
      compareBoxes(
        { x: 240, y: 0, width: 96, height: 40 },
        { x: 250, y: 0, width: 96, height: 40 },
      ),
    ).toEqual([{ prop: "x", proto: 240, dev: 250 }]);
    expect(compareBoxes({ x: 1 }, {})).toContainEqual({
      prop: "x",
      proto: 1,
      dev: "(missing)",
    });
  });
});

describe("intended differences", () => {
  const withIntended = {
    ...surface,
    intended: [
      { element: "logo", prop: "x", note: "T9" },
      { element: "nav", note: "Story 1.4" },
    ],
  };

  it("matches by element and optional prop", () => {
    expect(findIntended(withIntended, "logo", "x")?.note).toBe("T9");
    expect(findIntended(withIntended, "logo", "y")).toBeUndefined();
    expect(findIntended(withIntended, "nav", "anything")).toBeDefined();
    expect(findIntended(surface, "logo", "x")).toBeUndefined();
    expect(findIntended(withIntended, "nav", "y")?.note).toBe("Story 1.4");
  });

  it("can narrow an entry to one state and width", () => {
    const narrow = {
      ...surface,
      intended: [
        { element: "logo", prop: "x", state: "open", width: 1280, note: "n" },
      ],
    };
    expect(
      findIntended(narrow, "logo", "x", { state: "open", width: 1280 }),
    ).toBeDefined();
    expect(
      findIntended(narrow, "logo", "x", { state: "open", width: 600 }),
    ).toBeUndefined();
    expect(
      findIntended(narrow, "logo", "x", { state: "default", width: 1280 }),
    ).toBeUndefined();
  });
});

describe("validateSurface cross-references", () => {
  const base = {
    ...surface,
    states: [{ name: "open", proto: [], dev: [], elements: ["logo"] }],
    probes: [
      {
        name: "menu",
        trigger: { proto: "a", dev: "b" },
        observe: { proto: "c", dev: "d" },
      },
    ],
    intended: [{ element: "menu", prop: "hover", note: "T11" }],
    widths: [1280],
  };

  it("accepts names that exist", () => {
    expect(validateSurface(base)).toBe(base);
  });

  it("catches typos and missing notes that would otherwise pass silently", () => {
    const bad = {
      ...base,
      states: [
        { name: "open", proto: [], dev: [], elements: ["logoo"] },
        { name: "typed", proto: [], dev: [], elements: "logo" },
      ],
      probes: [...base.probes, { ...base.probes[0], hover: { proto: "x" } }],
      intended: [
        { element: "nope", prop: "x" },
        { element: "logo", prop: "x", note: "n", pending: "false" },
        { element: "menu", prop: "hovr", note: "n" },
        { element: "menu", prop: "hover", state: "open", note: "n" },
        { element: "logo", prop: null, note: "n" },
      ],
      widths: [0],
      shotWidths: "1280",
    };
    let message = "";
    try {
      validateSurface(bad);
    } catch (error) {
      message = error.message;
    }
    expect(message).toContain(
      'states[0].elements names unknown element "logoo"',
    );
    expect(message).toContain('probes[1].name "menu" is used twice');
    expect(message).toContain("probes[1].hover.dev must be a CSS selector");
    expect(message).toContain(
      'intended[0].element "nope" is not an element or probe name',
    );
    expect(message).toContain(
      "intended[0].note must give the reason or decision ID",
    );
    expect(message).toContain(
      "states[1].elements must be a list of element names",
    );
    expect(message).not.toContain('unknown element "l"');
    expect(message).toContain("intended[1].pending must be true or false");
    expect(message).toContain("intended[2].prop must be a probe event");
    expect(message).toContain("intended[3].state does not apply to a probe");
    expect(message).toContain("intended[4].prop must be a non-empty string");
    expect(message).toContain('"widths" must hold positive whole numbers');
    expect(message).toContain('"shotWidths" must be a list');
  });

  it("refuses a probe that has an element's name", () => {
    expect(() =>
      validateSurface({
        ...base,
        probes: [{ ...base.probes[0], name: "logo" }],
        intended: [],
      }),
    ).toThrow('probes[0].name "logo" is also an element name');
  });

  it("lists nameless or null entries instead of crashing", () => {
    let message = "";
    try {
      validateSurface({
        ...base,
        elements: [...base.elements, { proto: "a", dev: "b" }],
        probes: [null, null],
        intended: [],
      });
    } catch (error) {
      message = error.message;
    }
    expect(message).toContain("Invalid surface file");
    expect(message).toContain("elements[1].name must be a non-empty string");
    expect(message).toContain("probes[1].name must be a non-empty string");
    expect(message).not.toContain("used twice");
    expect(message).not.toContain("also an element name");
  });

  it("keeps names plain and lower case because they name folders and files", () => {
    let message = "";
    try {
      validateSurface({
        ...base,
        name: "../header",
        elements: [
          { name: "a|b", proto: "x", dev: "y" },
          { name: "Logo", proto: "x", dev: "y" },
        ],
        states: [{ name: "open state", proto: [], dev: [] }],
        probes: [{ ...base.probes[0], name: "menu/1" }],
        intended: [],
      });
    } catch (error) {
      message = error.message;
    }
    const plain = 'may only use a-z, 0-9, "-" and "_"';
    expect(message).toContain(`name "../header" ${plain}`);
    expect(message).toContain(`elements[0].name "a|b" ${plain}`);
    expect(message).toContain(`elements[1].name "Logo" ${plain}`);
    expect(message).toContain(`probes[0].name "menu/1" ${plain}`);
    expect(message).toContain(`states[0].name "open state" ${plain}`);
  });

  it("refuses repeated and reserved state names", () => {
    let message = "";
    try {
      validateSurface({
        ...base,
        states: ["open", "open", "default", "no-js", "reduced-motion"].map(
          (name) => ({ name, proto: [], dev: [] }),
        ),
        intended: [],
      });
    } catch (error) {
      message = error.message;
    }
    expect(message).toContain('states[1].name "open" is used twice');
    expect(message).toContain('states[2].name "default" is reserved');
    expect(message).toContain('states[3].name "no-js" is reserved');
    expect(message).toContain('states[4].name "reduced-motion" is reserved');
    expect(message).not.toContain("states[0]");
  });

  it("refuses intended states and widths that never run", () => {
    let message = "";
    try {
      validateSurface({
        ...base,
        intended: [
          { element: "logo", prop: "x", state: "opne", note: "n" },
          { element: "logo", prop: "x", width: 999, note: "n" },
          {
            element: "logo",
            prop: "x",
            state: "default",
            width: 1280,
            note: "n",
          },
          { element: "logo", prop: "x", state: "open", note: "n" },
        ],
      });
    } catch (error) {
      message = error.message;
    }
    expect(message).toContain(
      'intended[0].state "opne" is not "default" or a state name',
    );
    expect(message).toContain(
      "intended[1].width 999 is not a parity width (1280)",
    );
    expect(message).not.toContain("intended[2]");
    expect(message).not.toContain("intended[3]");
    expect(() =>
      validateSurface({
        ...base,
        widths: undefined,
        intended: [{ element: "logo", prop: "x", width: 1081, note: "n" }],
      }),
    ).toThrow("is not a parity width (1280, 1000, 600)");
    expect(() =>
      validateSurface({
        ...base,
        intended: [{ element: "menu", prop: "hover", width: 999, note: "n" }],
      }),
    ).toThrow("intended[0].width 999 is not a parity width (1280)");
  });

  it("keeps parity image names apart because a name never holds a dot", () => {
    expect(parityImageName("mega", "products-open", 1280)).not.toBe(
      parityImageName("mega-products", "open", 1280),
    );
    expect(() =>
      validateSurface({
        ...base,
        elements: [{ name: "mega.item", proto: "x", dev: "y" }],
        states: [],
        intended: [],
      }),
    ).toThrow('elements[0].name "mega.item" may only use a-z, 0-9');
  });

  it("accepts the committed header surface file", () => {
    const file = JSON.parse(
      readFileSync(new URL("./surfaces/header.json", import.meta.url), "utf8"),
    );
    expect(validateSurface(file).name).toBe("header");
  });
});

describe("neverFound", () => {
  it("lists mapped elements that no state or width ever found", () => {
    const s = {
      ...surface,
      elements: [
        ...surface.elements,
        { name: "ghost", proto: ".x", dev: ".y" },
      ],
    };
    expect(neverFound(s, [{ elements: [{ name: "logo" }] }])).toEqual([
      "ghost",
    ]);
  });
});

describe("images", () => {
  it("pads to a white canvas", () => {
    const padded = padImage(solid(2, 2, [0, 0, 0]), 4, 3);
    expect([padded.width, padded.height]).toEqual([4, 3]);
    expect([...padded.data.subarray(0, 4)]).toEqual([0, 0, 0, 255]);
    expect([
      ...padded.data.subarray((2 * 4 + 3) * 4, (2 * 4 + 3) * 4 + 4),
    ]).toEqual([255, 255, 255, 255]);
  });

  it("measures the share of different pixels, size differences included", () => {
    expect(
      diffImages(solid(10, 10, [255, 255, 255]), solid(10, 10, [255, 255, 255]))
        .percent,
    ).toBe(0);
    expect(
      diffImages(solid(10, 10, [0, 0, 0]), solid(10, 10, [255, 255, 255]))
        .percent,
    ).toBe(100);
    const sized = diffImages(solid(10, 10, [0, 0, 0]), solid(10, 5, [0, 0, 0]));
    expect([sized.diff.width, sized.diff.height, sized.percent]).toEqual([
      10, 10, 50,
    ]);
  });

  it("lays prototype, dev and diff side by side", () => {
    const a = solid(5, 4, [0, 0, 0]);
    expect([sideBySide(a, a, a).width, sideBySide(a, a, a).height]).toEqual([
      5 * 3 + 16,
      4,
    ]);
  });
});

describe("renderParityReport", () => {
  it("counts unexplained differences and labels intended ones", () => {
    const s = {
      ...surface,
      intended: [{ element: "logo", prop: "x", note: "T9" }],
    };
    const { markdown, unexplained } = renderParityReport(s, [
      {
        state: "default",
        width: 1280,
        elements: [
          {
            name: "logo",
            boxDiffs: [{ prop: "x", proto: 1, dev: 2 }],
            styleDiffs: [{ prop: "color", proto: "a", dev: "b" }],
            percent: 1.5,
            image: "logo.png",
          },
          { name: "nav", boxDiffs: [], styleDiffs: [], missing: "dev" },
          {
            name: "same",
            boxDiffs: [],
            styleDiffs: [],
            percent: 0,
            image: "same.png",
          },
          { name: "gone", boxDiffs: [], styleDiffs: [] },
        ],
      },
    ]);
    expect(unexplained).toBe(2);
    expect(markdown).toContain("**Unexplained differences: 2**");
    expect(markdown).toContain("x: 1 → 2 (intended: T9)");
    expect(markdown).toContain("**color: a → b**");
    expect(markdown).toContain("| nav | n/a | **missing on dev** |");
    expect(markdown).toContain("| same | 0% ![](same.png) | none |");
    expect(markdown).toContain("| gone | n/a | none |");
  });

  it("counts a missing element explained by a pending entry as pending", () => {
    const missingLogo = [
      {
        state: "default",
        width: 1280,
        elements: [
          { name: "logo", boxDiffs: [], styleDiffs: [], missing: "dev" },
        ],
      },
    ];
    const pendingMissing = renderParityReport(
      {
        ...surface,
        intended: [
          {
            element: "logo",
            prop: "missing",
            note: "UX-Q9\n\n# Amber",
            pending: true,
          },
        ],
      },
      missingLogo,
    );
    expect(pendingMissing.unexplained).toBe(0);
    expect(pendingMissing.pending).toBe(1);
    expect(pendingMissing.markdown).toContain(
      "| logo | n/a | missing on dev (pending: UX-Q9<br><br># Amber) |",
    );
    expect(pendingMissing.markdown).toContain("- logo: UX-Q9<br><br># Amber");
    expect(pendingMissing.markdown).not.toContain("\n# Amber");
    const decided = renderParityReport(
      {
        ...surface,
        intended: [{ element: "logo", prop: "missing", note: "T9" }],
      },
      missingLogo,
    );
    expect(decided.unexplained).toBe(0);
    expect(decided.pending).toBe(0);
    expect(decided.markdown).toContain(
      "| logo | n/a | missing on dev (intended: T9) |",
    );
  });
});

describe("interaction probes", () => {
  const same = Object.fromEntries(PROBE_EVENTS.map((e) => [e, "closed"]));

  it("lists the events whose outcome differs", () => {
    expect(compareProbeOutcomes(same, same)).toEqual([]);
    expect(compareProbeOutcomes({ ...same, hover: "open" }, same)).toEqual([
      { event: "hover", proto: "open", dev: "closed" },
    ]);
  });

  it("validates probe selectors", () => {
    expect(() =>
      validateSurface({
        ...surface,
        probes: [
          {
            name: "",
            trigger: { proto: "a" },
            observe: { proto: "b", dev: "c" },
          },
        ],
      }),
    ).toThrow(/probes\[0\]\.name[\s\S]*probes\[0\]\.trigger\.dev/);
  });

  it("reports behaviour differences, counts them and honours intended ones", () => {
    const probes = [
      {
        name: "menu",
        width: 1280,
        proto: { ...same, hover: "open", click: "open" },
        dev: { ...same, click: "open" },
      },
    ];
    const found = [
      {
        state: "default",
        width: 1280,
        elements: [{ name: "logo", boxDiffs: [], styleDiffs: [] }],
      },
    ];
    const plain = renderParityReport(surface, found, probes);
    expect(plain.unexplained).toBe(1);
    expect(plain.markdown).toContain("## Behaviour (interaction probes)");
    expect(plain.markdown).toContain(
      "| menu | 1280 | hover | open | closed | **differs** |",
    );
    expect(plain.markdown).toContain(
      "| menu | 1280 | click | open | open | same |",
    );
    const noted = renderParityReport(
      {
        ...surface,
        intended: [
          { element: "menu", prop: "hover", note: "T11", pending: true },
        ],
      },
      found,
      probes,
    );
    expect(noted.unexplained).toBe(0);
    expect(noted.pending).toBe(1);
    expect(noted.markdown).toContain("pending: T11");
    expect(noted.markdown).toContain("**Pending design decisions: 1**");
  });

  it("never treats a probe it could not measure as the same", () => {
    const broken = { ...same, hover: "error: observe not found" };
    expect(compareProbeOutcomes(broken, broken)).toEqual([
      {
        event: "hover",
        proto: "error: observe not found",
        dev: "error: observe not found",
      },
    ]);
  });

  it("never lets an intended or pending entry hide a probe that could not run", () => {
    const failing = {
      name: "menu",
      width: 1280,
      proto: { ...same, hover: "open" },
      dev: { ...same, hover: probeError(new Error("Timeout 5000ms\nmore")) },
    };
    const report = renderParityReport(
      {
        ...surface,
        intended: [
          { element: "menu", prop: "hover", note: "T11", pending: true },
        ],
      },
      [
        {
          state: "default",
          width: 1280,
          elements: [{ name: "logo", boxDiffs: [], styleDiffs: [] }],
        },
      ],
      [failing],
    );
    expect(report.unexplained).toBe(1);
    expect(report.pending).toBe(1);
    expect(report.markdown).toContain(
      "| menu | 1280 | hover | open | error: Timeout 5000ms | **differs** (pending: T11, not applied: the probe could not run) |",
    );
    expect(report.markdown).not.toContain("matched nothing");
  });

  it("lists states, probes and intended entries that did nothing in this run", () => {
    const probe = (name, extra = {}) => ({
      name,
      trigger: { proto: "a", dev: "b" },
      observe: { proto: "c", dev: "d" },
      ...extra,
    });
    const s = {
      ...surface,
      elements: [
        ...surface.elements,
        { name: "ghost", proto: ".g", dev: ".g" },
      ],
      states: [
        { name: "open", proto: [], dev: [], minWidth: 9999 },
        { name: "empty", proto: [], dev: [] },
        { name: "shown", proto: [], dev: [] },
      ],
      probes: [probe("menu", { minWidth: 9999 }), probe("tabs")],
      intended: [
        { element: "logo", prop: "x", note: "T9" },
        { element: "logo", prop: "x", width: 1280, note: "shadowed" },
        {
          element: "logo",
          prop: "colour",
          note: "typo\n# not a heading",
          pending: true,
        },
        { element: "logo", prop: "x", width: 600, note: "no 600 run" },
        { element: "logo", state: "open", note: "state never ran" },
        { element: "ghost", prop: "x", note: "selector broken" },
        { element: "menu", prop: "hover", note: "probe never ran" },
        { element: "tabs", prop: "escape", note: "same on both sides" },
      ],
    };
    const logo = (boxDiffs) => ({ name: "logo", boxDiffs, styleDiffs: [] });
    const results = [
      {
        state: "default",
        width: 1280,
        elements: [logo([{ prop: "x", proto: 1, dev: 2 }])],
      },
      { state: "empty", width: 1280, elements: [] },
      { state: "shown", width: 1280, elements: [logo([])] },
    ];
    const probes = [{ name: "tabs", width: 1280, proto: same, dev: same }];
    const { markdown, unexplained, pending } = renderParityReport(
      s,
      results,
      probes,
    );
    // ghost never found (1) + open, empty, menu idle (3) + four entries that matched nothing (4)
    expect(unexplained).toBe(8);
    expect(pending).toBe(1);
    expect(markdown).toContain("- logo: typo<br># not a heading");
    expect(markdown).not.toContain("\n# not a heading");
    expect(markdown).toContain("## Never ran or never used");
    for (const line of [
      "- state open: ran at no width or compared nothing",
      "- state empty: ran at no width or compared nothing",
      "- probe menu: ran at no width",
      "- intended logo (x, 1280px): matched nothing — shadowed",
      "- pending logo (colour): matched nothing — typo<br># not a heading",
      "- intended logo (x, 600px): matched nothing — no 600 run",
      "- intended tabs (escape): matched nothing — same on both sides",
    ])
      expect(markdown).toContain(line);
    for (const text of [
      "state shown",
      "probe tabs",
      "intended logo (x):",
      "state never ran",
      "selector broken",
      "probe never ran",
    ])
      expect(markdown).not.toContain(text);
    expect(neverUsed(surface, results, [], new Set())).toEqual([]);
  });

  it("turns any thrown value into a one-line error outcome", () => {
    expect(probeError(new Error("a\nb"))).toBe("error: a");
    expect(probeError(new Error("a\r\nb"))).toBe("error: a");
    expect(probeError(new Error("a\rb"))).toBe("error: a");
    expect(probeError("plain")).toBe("error: plain");
    expect(probeError(undefined)).toBe("error: undefined");
    expect(firstLine(null)).toBe("null");
    const failed = { ...same, click: probeError(new Error("x")) };
    expect(compareProbeOutcomes(failed, failed)).toHaveLength(1);
  });

  it("escapes a pipe in an outcome or a note so the table row stays whole", () => {
    const { markdown } = renderParityReport(
      {
        ...surface,
        intended: [
          { element: "logo", prop: "x", note: "10% | 12%" },
          { element: "menu", prop: "click", note: "T | U\nV\rW\r\nX" },
        ],
      },
      [
        {
          state: "default",
          width: 1280,
          elements: [
            {
              name: "logo",
              boxDiffs: [{ prop: "x", proto: 1, dev: 2 }],
              styleDiffs: [],
            },
          ],
        },
      ],
      [
        {
          name: "menu",
          width: 1280,
          proto: same,
          dev: { ...same, hover: "error: a|b", click: "open" },
        },
      ],
    );
    expect(markdown).toContain(String.raw`| error: a\|b | **differs** |`);
    expect(markdown).toContain(
      String.raw`| closed | open | intended: T \| U<br>V<br>W<br>X |`,
    );
    expect(markdown).toContain(String.raw`x: 1 → 2 (intended: 10% \| 12%) |`);
  });

  it("counts mapped elements that were never found", () => {
    const { markdown, unexplained } = renderParityReport(surface, [], []);
    expect(unexplained).toBe(1);
    expect(markdown).toContain("fix the selector:** logo");
  });
});
