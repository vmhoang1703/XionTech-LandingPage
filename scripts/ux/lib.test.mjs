// @vitest-environment node
import { readFileSync } from "node:fs";
import { PNG } from "pngjs";
import { describe, expect, it } from "vitest";
import {
  compareBoxes,
  compareProbeOutcomes,
  PROBE_EVENTS,
  compareStyles,
  diffImages,
  findIntended,
  isIntended,
  neverFound,
  normalizeColor,
  normalizeStyle,
  padImage,
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
    expect(isIntended(withIntended, "logo", "x")).toBe(true);
    expect(isIntended(withIntended, "logo", "y")).toBe(false);
    expect(isIntended(withIntended, "nav", "anything")).toBe(true);
    expect(isIntended(surface, "logo", "x")).toBe(false);
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
      isIntended(narrow, "logo", "x", { state: "open", width: 1280 }),
    ).toBe(true);
    expect(isIntended(narrow, "logo", "x", { state: "open", width: 600 })).toBe(
      false,
    );
    expect(
      isIntended(narrow, "logo", "x", { state: "default", width: 1280 }),
    ).toBe(false);
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
      states: [{ name: "open", proto: [], dev: [], elements: ["logoo"] }],
      probes: [...base.probes, { ...base.probes[0], hover: { proto: "x" } }],
      intended: [{ element: "nope", prop: "x" }],
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
    expect(message).toContain('"widths" must hold positive whole numbers');
    expect(message).toContain('"shotWidths" must be a list');
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
    expect(markdown).toContain("missing on dev");
    expect(markdown).toContain("| same | 0% ![](same.png) | none |");
    expect(markdown).toContain("| gone | n/a | none |");
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

  it("counts mapped elements that were never found", () => {
    const { markdown, unexplained } = renderParityReport(surface, [], []);
    expect(unexplained).toBe(1);
    expect(markdown).toContain("fix the selector:** logo");
  });
});
