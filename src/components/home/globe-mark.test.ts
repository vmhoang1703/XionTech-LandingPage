import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildScene,
  createGlobeMark,
  daylight,
  dotAt,
  frameAt,
  GLOBE_RADIUS,
  horizonAmount,
  ICON_SIZE,
  iconAt,
  isLand,
  loopPhase,
  MARK_WIDTH,
  mountainAmount,
  OFFICES,
  officeLights,
  partOf,
  project,
  pulseAt,
  restAmount,
  SCENE_REST_TIME,
  SCENE_STARTS,
  sceneAmount,
  sceneIndex,
  sceneJumpTime,
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
    expect(loopPhase(at(0))).toBeCloseTo(0);
    expect(loopPhase(at(3, 2))).toBeCloseTo(3);
  });

  it("shows nothing for the first moment, only the silk", () => {
    expect(sceneAmount(frameAt(atSec(0.5)))).toBe(0);
    expect(sceneAmount(frame(0))).toBe(1);
  });

  it("names the scene showing: globe, mountain, then the mark", () => {
    expect(sceneIndex(frameAt(atSec(1)))).toBe(2);
    expect(sceneIndex(frame(1))).toBe(2);
    expect(sceneIndex(frame(SCENE_STARTS[0] + 0.1))).toBe(0);
    expect(sceneIndex(frame(SCENE_STARTS[1] + 0.1))).toBe(1);
    expect(sceneIndex(frame(SCENE_STARTS[2] + 0.1))).toBe(2);
  });

  it("jumps to the start of a scene in the current loop", () => {
    for (const index of [0, 1, 2]) {
      const time = sceneJumpTime(index, at(5, 2));
      expect(loopPhase(time)).toBeCloseTo(SCENE_STARTS[index], 1);
      expect(sceneIndex(frameAt(time))).toBe(index);
      expect(seconds(time)).toBeCloseTo(
        INTRO + 2 * CYCLE + SCENE_STARTS[index],
        1,
      );
    }
    // From the intro, it jumps into the first loop.
    expect(seconds(sceneJumpTime(1, atSec(1)))).toBeCloseTo(
      INTRO + SCENE_STARTS[1],
      1,
    );
  });

  it("rests on the finished mark at SCENE_REST_TIME", () => {
    expect(restAmount(frameAt(SCENE_REST_TIME))).toBe(1);
    expect(restAmount(frameAt(atSec(INTRO - 1)))).toBe(0);
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

  it("shows the globe in scene 1 and sets it below the horizon after", () => {
    expect(frameAt(atSec(1)).globe).toBe(0);
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

  it("stacks 13 tech logos in the T, two a row from the bottom up", () => {
    const stem = (219 - 162) / 137;
    expect(scene.icons).toHaveLength(13);
    for (const icon of scene.icons) {
      expect(Math.abs(icon.slot.x - stem)).toBeLessThanOrEqual(ICON_SIZE);
    }
    expect(scene.icons[0].slot.y).toBeGreaterThan(scene.icons[12].slot.y);
    expect(scene.icons[12].slot.x).toBeCloseTo(stem);
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

describe("tech logos", () => {
  const icon = scene.icons[3];

  it("fade in at their slots during the intro", () => {
    expect(iconAt(icon, frameAt(atSec(0))).alpha).toBe(0);
    const rest = iconAt(icon, frameAt(SCENE_REST_TIME));
    expect(rest.alpha).toBe(1);
    expect(near(rest, icon.slot)).toBeLessThan(0.01);
  });

  it("leave with the mark and stay hidden through the globe", () => {
    const leaving = iconAt(icon, frame(2.6));
    expect(leaving.alpha).toBeLessThan(1);
    expect(leaving.scale).toBeGreaterThan(1);
    expect(iconAt(icon, frame(8)).alpha).toBe(0);
  });

  it("fly in large, then stack into their slots", () => {
    const flying = iconAt(icon, frame(14.3));
    expect(flying.alpha).toBeGreaterThan(0);
    expect(flying.scale).toBeGreaterThan(1.5);
    const stacked = iconAt(icon, frame(18));
    expect(stacked.scale).toBe(1);
    expect(near(stacked, icon.slot)).toBeLessThan(0.01);
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
    mark?.resize({ x: 400, y: 300, size: 200 });
    expect(canvas.width).toBe(
      800 * Math.min(window.devicePixelRatio || 1, 1.5),
    );
    mark?.setPointer(5, -5);
    const times = [
      atSec(0.5),
      atSec(3),
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
});
