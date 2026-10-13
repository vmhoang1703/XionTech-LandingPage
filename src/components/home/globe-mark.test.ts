import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildScene,
  createGlobeMark,
  daylight,
  dotAt,
  frameAt,
  GLOBE_RADIUS,
  horizonAmount,
  isLand,
  loopPhase,
  MARK_END,
  MARK_WIDTH,
  mountainAmount,
  OFFICES,
  officeLights,
  partOf,
  project,
  pulseAt,
  restAmount,
  SCENE_REST_TIME,
  sceneAmount,
  SLOGAN_CELL,
  sloganAt,
  sloganCells,
  seconds,
  summitFlash,
  torchAt,
} from "./globe-mark";
import { SILK_START_TIME, SILK_TIME_SCALE } from "./silk-shader";

const INTRO = seconds(SCENE_REST_TIME);
const CYCLE = 20;
// Shader time `phase` seconds into loop `loop` (after the intro).
const at = (phase: number, loop = 0) =>
  SILK_START_TIME + (INTRO + loop * CYCLE + phase) * SILK_TIME_SCALE;
// Shader time `sec` seconds after load.
const atSec = (sec: number) => SILK_START_TIME + sec * SILK_TIME_SCALE;
const frame = (phase: number) => frameAt(at(phase));

const scene = buildScene();
const part = (name: "amber" | "peak" | "tee") =>
  scene.land.filter((dot) => dot.part === name);
const HORIZON = (174.5 - 106) / 137;
const SUMMIT = { x: (116 - 162) / 137, y: (121 - 106) / 137 };
const near = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  Math.hypot(a.x - b.x, a.y - b.y);

describe("timeline", () => {
  it("runs an intro, then a 20 s loop", () => {
    expect(loopPhase(atSec(1))).toBe(-1);
    expect(loopPhase(at(0.001))).toBeCloseTo(0);
    expect(loopPhase(at(3, 2))).toBeCloseTo(3);
    // The intro joins the loop with the globe open, not at its start.
    expect(loopPhase(atSec(3.3))).toBeCloseTo(4.9);
  });

  it("shows nothing for the first moment, only the silk", () => {
    expect(sceneAmount(frameAt(atSec(0.1)))).toBe(0);
    expect(sceneAmount(frame(0))).toBe(1);
  });

  it("rests on the finished mark at SCENE_REST_TIME", () => {
    expect(restAmount(frameAt(SCENE_REST_TIME))).toBe(1);
    // No mark during the intro: the globe forms first.
    expect(restAmount(frameAt(atSec(2.5)))).toBe(0);
    // The mark first rests at the start of the first full loop.
    expect(INTRO).toBeCloseTo(18.4);
    expect(restAmount(frame(1))).toBe(1);
    expect(restAmount(frame(3.5))).toBe(0);
    expect(restAmount(frame(8))).toBe(0);
    expect(restAmount(frame(19.5))).toBe(1);
  });
});

describe("globe", () => {
  it("lights Plano's side first, then Vietnam's", () => {
    expect(frame(4.5).sun[0]).toBeGreaterThan(0.5);
    expect(frame(9).sun[0]).toBeLessThan(-0.5);
  });

  it("forms the globe first on load, as the loop has it where the intro joins", () => {
    expect(frameAt(atSec(0.5)).globe).toBe(0);
    expect(frameAt(atSec(1.5)).globe).toBeGreaterThan(0);
    const formed = frameAt(atSec(3.1));
    const joined = frameAt(atSec(3.25));
    expect(formed.globe).toBe(1);
    expect(joined.globe).toBe(1);
    expect(formed.facing).toBeCloseTo(joined.facing, 0);
    expect(formed.sun[0]).toBeCloseTo(joined.sun[0], 2);
  });

  it("shows the globe in scene 1 and sets it below the horizon after", () => {
    expect(frame(6).globe).toBeCloseTo(1);
    expect(frame(9).sink).toBe(0);
    expect(frame(11.5).sink).toBe(1);
    expect(frame(12.5).globe).toBe(0);
  });

  it("projects the facing longitude to the centre, the far side behind", () => {
    const front = project(0, -190, -190);
    expect(front.x).toBeCloseTo(0);
    expect(front.z).toBeGreaterThan(0.9);
    expect(project(0, -10, -190).z).toBeLessThan(0);
    expect(Math.hypot(front.x, front.y)).toBeLessThanOrEqual(GLOBE_RADIUS);
  });

  it("measures daylight from 0 (night) to 1 (noon)", () => {
    const point = { x: 0, y: 0, z: 1 };
    expect(daylight(point, [0, 0, 1])).toBeCloseTo(1);
    expect(daylight(point, [0, 0, -1])).toBe(0);
  });

  it("knows land from sea, across the date line", () => {
    // Da Nang sits on the coast: at 1.5 degree cells it reads as sea, but
    // its office light does not depend on the land mask.
    for (const office of OFFICES.filter((o) => o.name !== "Da Nang")) {
      expect(isLand(office.lat, office.lon)).toBe(true);
    }
    expect(isLand(0, -150)).toBe(false);
    expect(isLand(33.02, -96.7 + 360)).toBe(true);
    expect(typeof isLand(-90, 0)).toBe("boolean");
  });

  it("gives the Americas, Asia and the far side to the three parts", () => {
    expect(partOf(-97)).toBe("amber");
    expect(partOf(106)).toBe("peak");
    expect(partOf(-175)).toBe("peak");
    expect(partOf(20)).toBe("tee");
  });

  it("wakes Plano by day, then Ho Chi Minh City", () => {
    const glow = (phase: number, name: string) =>
      officeLights(frame(phase)).find((office) => office.name === name)?.glow ??
      0;
    expect(glow(5, "Plano")).toBeGreaterThan(glow(5, "Ho Chi Minh City"));
    expect(glow(9, "Ho Chi Minh City")).toBeGreaterThan(glow(9, "Plano"));
    expect(glow(1, "Plano")).toBe(0);
  });

  it("flies the torch from Plano to Ho Chi Minh City with a trail", () => {
    expect(torchAt(frame(5)).alpha).toBe(0);
    const early = torchAt(frame(6.8));
    const late = torchAt(frame(7.8));
    expect(late.alpha).toBeGreaterThan(0);
    expect(late.points).toHaveLength(22);
    const hcmc = project(OFFICES[1].lat, OFFICES[1].lon, frame(7.8).facing);
    expect(near(late.points[0], hcmc)).toBeLessThan(
      near(early.points[0], hcmc),
    );
  });
});

describe("scene", () => {
  it("is the same on every load", () => {
    expect(buildScene().land[100]).toEqual(scene.land[100]);
  });

  it("turns every part of the world into part of the mark", () => {
    expect(scene.land.length).toBeGreaterThan(3000);
    for (const name of ["amber", "peak", "tee"] as const) {
      expect(part(name).length).toBeGreaterThan(300);
    }
    expect(scene.grid).toHaveLength(17);
  });

  it("writes GET IT DONE up the T's stem in dots, 7 cells tall", () => {
    const stem = { x: (219 - 162) / 137, y: (104 - 106) / 137 };
    const cells = sloganCells();
    // G 17, E 18, T 11, I 11, T 11, D 18, O 16, N 18, E 18 dots.
    expect(cells).toHaveLength(138);
    expect(scene.slogan).toHaveLength(138);
    const xs = cells.map((c) => c.x);
    const ys = cells.map((c) => c.y);
    // Across the stem: 7 rows centred on it, inside its 14 px half-width.
    expect(Math.max(...xs) - Math.min(...xs)).toBeCloseTo(6 * SLOGAN_CELL);
    expect((Math.max(...xs) + Math.min(...xs)) / 2).toBeCloseTo(stem.x);
    expect(Math.max(...xs) - stem.x).toBeLessThan(14 / 137);
    // Up the stem: 55 columns centred on its middle, inside its length.
    expect(Math.max(...ys) - Math.min(...ys)).toBeCloseTo(54 * SLOGAN_CELL);
    expect((Math.max(...ys) + Math.min(...ys)) / 2).toBeCloseTo(stem.y);
    expect(Math.max(...ys)).toBeLessThan((156 - 106) / 137);
    expect(Math.min(...ys)).toBeGreaterThan((52 - 106) / 137);
  });

  it("reads upward: the first letter at the bottom, letter tops on the left", () => {
    const cells = sloganCells();
    const first = cells.filter((c) => c.along === 0);
    const last = cells.filter((c) => c.along === 1);
    expect(Math.min(...first.map((c) => c.y))).toBeGreaterThan(
      Math.max(...last.map((c) => c.y)),
    );
    // G's first column: rows 1 to 5 (its round left side), not 0 and 6.
    expect(first).toHaveLength(5);
    // The last E's last column: rows 0 and 6 only.
    expect(last).toHaveLength(2);
    // The T of GET: its top bar (row 0) is the leftmost row.
    const tTop = cells.filter((c) => c.along > 0.2 && c.along < 0.3);
    expect(Math.min(...tTop.map((c) => c.x))).toBeCloseTo(
      Math.min(...cells.map((c) => c.x)),
    );
  });

  it("fits the mark's width", () => {
    expect(MARK_WIDTH).toBeCloseTo((288 - 36) / 137);
  });
});

describe("dots", () => {
  it("start as invisible sparks", () => {
    const dot = dotAt(scene.land[0], frameAt(atSec(0)));
    expect(dot.alpha).toBe(0);
  });

  it("gather onto the globe on load and carry on into the loop with no jump", () => {
    for (const dot of scene.land.slice(0, 400)) {
      const landed = dotAt(dot, frameAt(atSec(3.1)));
      expect(Math.hypot(landed.x, landed.y)).toBeLessThanOrEqual(
        GLOBE_RADIUS + 1e-9,
      );
      expect(near(landed, dotAt(dot, frameAt(atSec(3.25))))).toBeLessThan(0.01);
    }
  });

  it("rest in the mark, the stem glowing faintly behind the logos", () => {
    const rest = frameAt(SCENE_REST_TIME);
    for (const dot of scene.land.slice(0, 400)) {
      expect(near(dotAt(dot, rest), dot.mark)).toBeLessThan(0.03);
    }
    const stem = part("tee").find((dot) => dot.mark.trace === 0);
    const line = part("tee").find((dot) => dot.mark.trace === 1);
    if (!stem || !line) throw new Error("No T dots");
    const f = frame(1.9);
    expect(dotAt(stem, f).alpha).toBeLessThan(dotAt(line, f).alpha);
  });

  it("light the globe's near side only, with warm light at night", () => {
    const f = frame(6);
    const frames = part("peak").map((dot) => dotAt(dot, f));
    expect(frames.some((d) => d.alpha === 0)).toBe(true);
    expect(frames.some((d) => d.alpha > 0.3 && d.amber > 0.5)).toBe(true);
  });

  it("hide below the horizon once the globe has set", () => {
    const f = frame(11);
    for (const dot of [...part("peak"), ...part("amber")]) {
      const d = dotAt(dot, f);
      if (d.y > HORIZON + 0.01) expect(d.alpha).toBeLessThan(0.05);
    }
  });

  it("climb the mountain from its feet and settle into the peak", () => {
    const climbing = frame(12.4);
    for (const dot of part("peak")) {
      expect(dotAt(dot, climbing).y).toBeLessThanOrEqual(HORIZON + 0.02);
    }
    const done = frame(15);
    for (const dot of part("peak").slice(0, 200)) {
      expect(near(dotAt(dot, done), dot.mark)).toBeLessThan(0.03);
    }
  });

  it("gather at the summit, then tick the check-mark", () => {
    const waiting = frame(13.2);
    const gathered = part("amber").filter(
      (dot) => near(dotAt(dot, waiting), SUMMIT) < 0.01,
    );
    expect(gathered.length).toBeGreaterThan(part("amber").length / 2);
    const done = frame(15.5);
    for (const dot of part("amber").slice(0, 200)) {
      expect(dotAt(dot, done).amber).toBe(1);
      expect(near(dotAt(dot, done), dot.mark)).toBeLessThan(0.03);
    }
  });

  it("wait unseen, then light the T behind the logos", () => {
    for (const dot of part("tee").slice(0, 100)) {
      expect(dotAt(dot, frame(14)).alpha).toBe(0);
      expect(near(dotAt(dot, frame(19)), dot.mark)).toBeLessThan(0.03);
    }
  });

  it("open from the mark into the globe", () => {
    const dot = part("peak")[0];
    const opening = dotAt(dot, frame(3));
    const open = dotAt(dot, frame(8));
    expect(near(opening, dot.mark)).toBeGreaterThan(0);
    expect(Math.hypot(open.x, open.y)).toBeLessThanOrEqual(GLOBE_RADIUS + 1e-9);
  });
});

describe("slogan", () => {
  const dot = scene.slogan[60];

  it("hides while the globe forms on load and rests in the mark later", () => {
    for (const sec of [0, 1.5, 3.1]) {
      expect(sloganAt(dot, frameAt(atSec(sec))).alpha).toBe(0);
    }
    // ...and the first loop picks up with it hidden too.
    expect(sloganAt(dot, frameAt(atSec(3.3))).alpha).toBe(0);
    const rest = sloganAt(dot, frameAt(SCENE_REST_TIME));
    expect(rest.alpha).toBeGreaterThan(0.6);
    expect(near(rest, dot.cell)).toBeLessThan(0.001);
  });

  it("is written from the bottom up", () => {
    const first = scene.slogan.find((d) => d.along === 0);
    const top = scene.slogan.find((d) => d.along === 1);
    const writing = frame(15.5);
    expect(first && near(sloganAt(first, writing), first.cell)).toBeLessThan(
      0.001,
    );
    expect(top && near(sloganAt(top, writing), top.cell)).toBeGreaterThan(0.01);
  });

  it("leaves with the mark and stays hidden through the globe", () => {
    const leaving = sloganAt(dot, frame(2.6));
    expect(leaving.alpha).toBeLessThan(1);
    expect(leaving.scale).toBeGreaterThan(1);
    expect(sloganAt(dot, frame(8)).alpha).toBe(0);
  });

  it("gathers large around the T, then writes into its cell", () => {
    const gathering = sloganAt(dot, frame(14.3));
    expect(gathering.alpha).toBeGreaterThan(0);
    expect(gathering.scale).toBeGreaterThan(1.5);
    expect(near(gathering, dot.cell)).toBeGreaterThan(0.2);
    const written = sloganAt(dot, frame(18));
    expect(near(written, dot.cell)).toBeLessThan(0.001);
    expect(written.alpha).toBeGreaterThan(0.6);
  });
});

describe("light", () => {
  it("runs a pulse up the T while the mark rests", () => {
    expect(pulseAt(frame(8))).toBeNull();
    const pulses = [0, 0.4, 0.8, 1.2, 1.6, 2, 2.4, 2.8, 3.2].map((s) =>
      pulseAt(frameAt(at(18) + s * SILK_TIME_SCALE)),
    );
    expect(pulses.some((p) => p === null)).toBe(true);
    const shown = pulses.filter((p) => p !== null);
    expect(shown.length).toBeGreaterThan(3);
    for (const pulse of shown) {
      expect(pulse.x).toBeGreaterThan((210 - 162) / 137);
    }
  });

  it("draws the horizon and the mountain in scene 2, with a summit flash", () => {
    expect(horizonAmount(frame(8))).toBe(0);
    expect(horizonAmount(frame(12))).toBe(1);
    expect(mountainAmount(frame(9))).toBe(0);
    expect(mountainAmount(frame(12.5))).toBe(1);
    expect(summitFlash(frame(12))).toBe(0);
    expect(summitFlash(frame(13.25))).toBeGreaterThan(0.5);
  });
});

describe("mark-only story (phones and tablets)", () => {
  const markAt = (sec: number) => frameAt(atSec(sec), true);

  it("has no globe: an intro, then the mark at rest for good", () => {
    for (const sec of [0.5, 2, MARK_END - 0.01, MARK_END, 30, 300]) {
      expect(markAt(sec).globe).toBe(0);
      expect(markAt(sec).markOnly).toBe(true);
    }
    expect(markAt(MARK_END - 0.01).phase).toBe(-1);
    // Float seconds land a hair early at MARK_END itself, so check just after.
    const after = MARK_END + 0.001;
    expect(markAt(after).phase).toBe(markAt(300).phase);
    expect(restAmount(markAt(2))).toBe(0);
    expect(restAmount(markAt(after))).toBe(1);
    expect(restAmount(frameAt(SCENE_REST_TIME, true))).toBe(1);
    // The full story is unchanged.
    expect(frameAt(atSec(30)).markOnly).toBe(false);
  });

  it("gathers the sparks straight into the mark, with no jump when it rests", () => {
    for (const dot of scene.land.slice(0, 400)) {
      expect(dotAt(dot, markAt(0)).alpha).toBe(0);
      const formed = dotAt(dot, markAt(MARK_END - 0.01));
      expect(near(formed, dot.mark)).toBeLessThan(0.03);
      expect(near(formed, dotAt(dot, markAt(MARK_END + 0.001)))).toBeLessThan(
        0.01,
      );
    }
  });

  it("writes GET IT DONE up the stem once, bottom first, then rests in place", () => {
    const first = scene.slogan.find((d) => d.along === 0);
    const top = scene.slogan.find((d) => d.along === 1);
    if (!first || !top) throw new Error("No slogan ends");
    expect(sloganAt(first, markAt(0.5)).alpha).toBe(0);
    const writing = markAt(3.4);
    expect(near(sloganAt(first, writing), first.cell)).toBeLessThan(0.001);
    expect(near(sloganAt(top, writing), top.cell)).toBeGreaterThan(0.01);
    for (const dot of scene.slogan) {
      const landed = sloganAt(dot, markAt(MARK_END - 0.001));
      const rest = sloganAt(dot, markAt(MARK_END + 0.001));
      expect(near(landed, rest)).toBeLessThan(0.001);
      expect(Math.abs(landed.alpha - rest.alpha)).toBeLessThan(0.02);
      expect(near(sloganAt(dot, markAt(60)), dot.cell)).toBeLessThan(0.001);
    }
  });
});

describe("createGlobeMark", () => {
  function fakeContext() {
    const calls: string[] = [];
    const gradient = { addColorStop: () => undefined };
    const ctx = new Proxy({} as Record<string, unknown>, {
      get(target, key: string) {
        if (key in target) return target[key];
        if (key === "createLinearGradient" || key === "createRadialGradient") {
          return () => gradient;
        }
        return () => {
          calls.push(key);
        };
      },
      set(target, key: string, value) {
        target[key] = value;
        return true;
      },
    });
    return { ctx, calls };
  }

  function canvasWith(context: unknown) {
    const canvas = document.createElement("canvas");
    vi.spyOn(canvas, "getContext").mockReturnValue(
      context as RenderingContext | null,
    );
    Object.defineProperty(canvas, "clientWidth", { value: 800 });
    Object.defineProperty(canvas, "clientHeight", { value: 600 });
    return canvas;
  }

  beforeEach(() => {
    vi.stubGlobal(
      "Path2D",
      class {
        constructor(public path: string) {}
      },
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("returns null without a 2D context", () => {
    expect(createGlobeMark(canvasWith(null))).toBeNull();
  });

  it("draws nothing until there is room for the scene", () => {
    const { ctx, calls } = fakeContext();
    const mark = createGlobeMark(canvasWith(ctx));
    expect(mark?.draw(SCENE_REST_TIME)).toBe(0);
    expect(calls).toEqual(["clearRect"]);
  });

  it("sizes the canvas and draws every stage of the story", () => {
    const { ctx, calls } = fakeContext();
    const canvas = canvasWith(ctx);
    const mark = createGlobeMark(canvas);
    mark?.resize({ x: 400, y: 300, size: 200, markOnly: false });
    expect(canvas.width).toBe(
      800 * Math.min(window.devicePixelRatio || 1, 1.5),
    );
    mark?.setPointer(5, -5);
    const times = [
      atSec(0.1),
      atSec(2),
      ...[1, 3, 5, 7.3, 9, 9.9, 10.2, 11, 12, 13.2, 14.3, 16.5, 19].map((p) =>
        at(p),
      ),
    ];
    const shown = times.map((time) => mark?.draw(time));
    expect(shown[0]).toBe(0);
    expect(shown.at(-1)).toBe(1);
    for (const call of [
      "arc",
      "fill",
      "fillRect",
      "stroke",
      "fillText",
      "clip",
    ]) {
      expect(calls).toContain(call);
    }
  });

  it("draws the mark-only story with no globe and no office names", () => {
    const { ctx, calls } = fakeContext();
    const mark = createGlobeMark(canvasWith(ctx));
    mark?.resize({ x: 200, y: 150, size: 120, markOnly: true });
    const shown = [0.1, 2, 3.4, MARK_END, 30].map((sec) =>
      mark?.draw(atSec(sec)),
    );
    expect(shown[0]).toBe(0);
    expect(shown.at(-1)).toBe(1);
    expect(calls).toContain("fillRect");
    expect(calls).not.toContain("fillText");
    expect(calls).not.toContain("clip");
  });
});
