// The Home hero's story in points of light (lead, 2026-10-10), drawn on a 2D
// canvas over the silk shader. Each scene is a picture anyone can read, with
// no captions. Times are shader time (silk-shader.ts), so Pause stops both
// layers.
//
// On load the silk runs alone, then sparks gather into the XionTech mark.
// Then three scenes loop:
//   1. Follow the sun: the mark opens into a globe showing both head offices.
//      Day sweeps from Plano to Vietnam; as Plano's day ends, a torch of light
//      flies to Ho Chi Minh City, which wakes with Da Nang and Ha Noi: one
//      team, around the clock.
//   2. Climb together: the globe sets below a horizon and the land's light
//      walks to the foot of a mountain (the name's inspiration, as on the
//      About page), climbs both slopes to the peak; at the summit a flash,
//      and the amber check-mark is ticked off from it: the X.
//   3. Technology: the logos of the stacks the team builds with fly in and
//      stack up into the T; the mark rests, light sweeping across it.
import { LAND, LAND_COLUMNS, TECH_ICONS } from "./hero-data";
import { SILK_START_TIME, SILK_TIME_SCALE } from "./silk-shader";

// Where the scene forms, in CSS pixels from the canvas's top-left: its
// centre and the mark's height. null = no room, nothing is drawn.
export type MarkArea = { x: number; y: number; size: number } | null;

type Point = { x: number; y: number };

// ---- Timing (seconds) --------------------------------------------------------
const INTRO_START = 1.2; // silk alone until then
const INTRO_END = 4.2; // the mark has formed
const CYCLE = 20; // the loop after the intro
const OPEN = [2.2, 4.4]; // mark -> globe
const SUNSET = [5.4, 8.6]; // day moves from Plano to Vietnam
const TORCH = [6.6, 8]; // the torch flies Plano -> Ho Chi Minh City
const LEAVE = 9.6; // the land's light leaves for the mountain
const SINK = [9.6, 11.4]; // the globe sets below the horizon
const CLIMB = 10.9; // the climb starts
const SUMMIT = 13.1; // the climbers reach the top: flash
const TICK = 13.3; // the check-mark is ticked off from the summit
const ICONS_IN = 13.9; // the tech logos appear
const STACK = 14.6; // ...and start stacking into the T
const FILL = 16.2; // light settles behind the logos and along the thin line
const FLIGHT = 1.6;
// Where each scene starts in the loop; the progress dots jump here.
export const SCENE_STARTS = [OPEN[0], LEAVE - 0.3, ICONS_IN - 0.3];

// The first moment the mark has fully formed: a paused silk (reduced
// motion) starts here, so it rests on the finished mark.
export const SCENE_REST_TIME = SILK_START_TIME + INTRO_END * SILK_TIME_SCALE;

function smoothstep(edge0: number, edge1: number, x: number) {
  const v = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return v * v * (3 - 2 * v);
}
const mix = (a: number, b: number, f: number) => a + (b - a) * f;
const mixPoint = (a: Point, b: Point, f: number) => ({
  x: mix(a.x, b.x, f),
  y: mix(a.y, b.y, f),
});
const window01 = (phase: number, [from, to]: number[], fade = 0.5) =>
  smoothstep(from - fade, from + fade, phase) *
  (1 - smoothstep(to - fade, to + fade, phase));

export const seconds = (time: number) =>
  (time - SILK_START_TIME) / SILK_TIME_SCALE;

// Seconds into the loop, or -1 during the intro.
export function loopPhase(time: number): number {
  const sec = seconds(time) - INTRO_END;
  if (sec < 0) return -1;
  return sec % CYCLE;
}

// ---- One moment of the whole scene -------------------------------------------
// The globe is turned so both head offices show: Plano on the right, Vietnam
// on the left; it drifts a little while the day moves across it.
const FACING = [-186, -198];
const TILT = 0.36;
export const GLOBE_RADIUS = 0.8;

export type Frame = {
  sec: number;
  phase: number; // -1 during the intro
  facing: number;
  sun: number[]; // x right, y down, z towards the viewer
  sink: number; // 0..1: the globe setting below the horizon
  globe: number; // 0..1: how much the globe shows
};

export function frameAt(time: number): Frame {
  const phase = loopPhase(time);
  // The sun is over Plano's side at first, then over Vietnam's.
  const azimuth = mix(1.05, -1.05, smoothstep(SUNSET[0], SUNSET[1], phase));
  const up = 0.3;
  return {
    sec: seconds(time),
    phase,
    facing: mix(FACING[0], FACING[1], smoothstep(OPEN[0], LEAVE, phase)),
    sun: [
      Math.sin(azimuth) * Math.cos(up),
      -Math.sin(up),
      Math.cos(azimuth) * Math.cos(up),
    ],
    sink: smoothstep(SINK[0], SINK[1], phase),
    globe:
      phase < 0
        ? 0
        : smoothstep(OPEN[0], OPEN[1], phase) *
          (1 - smoothstep(SINK[1] - 0.4, SINK[1] + 0.6, phase)),
  };
}

// Which scene is showing (0 = the globe, 1 = the mountain, 2 = the mark).
export function sceneIndex(f: Frame): number {
  const { phase } = f;
  if (phase < SCENE_STARTS[0] || phase >= SCENE_STARTS[2]) return 2;
  return phase >= SCENE_STARTS[1] ? 1 : 0;
}

// The shader time at which scene `index` starts, in the current loop.
export function sceneJumpTime(index: number, time: number): number {
  const loops = Math.max(0, Math.floor((seconds(time) - INTRO_END) / CYCLE));
  // A hair past the start, so rounding cannot land in the scene before.
  const sec = INTRO_END + loops * CYCLE + SCENE_STARTS[index] + 0.01;
  return SILK_START_TIME + sec * SILK_TIME_SCALE;
}

// How much of the scene shows at all: 0 before the intro sparks.
export function sceneAmount(f: Frame): number {
  return smoothstep(INTRO_START, INTRO_START + 1.2, f.sec);
}

// The horizon the globe sets behind (mark units, y down): the mountain's
// left foot stands on it.
const HORIZON = (174.5 - 106) / 137;
const globeShift = (f: Frame) => f.sink * (HORIZON + GLOBE_RADIUS);
// Below the horizon, the setting globe fades out.
const belowHorizon = (f: Frame) => smoothstep(0, 0.25, f.sink);

// Light travelling below the horizon is out of sight (once the globe sets).
function aboveHorizon(d: DotFrame, f: Frame): DotFrame {
  return d.y > HORIZON ? { ...d, alpha: d.alpha * (1 - belowHorizon(f)) } : d;
}

export function horizonAmount(f: Frame): number {
  return window01(f.phase, [SINK[0] + 0.3, TICK + 1.2], 0.6);
}

// Scene 2: how strongly the mountain's body shows under the peak.
export function mountainAmount(f: Frame): number {
  return window01(f.phase, [CLIMB + 0.2, TICK + 1.2], 0.6);
}

// The summit flash, 0..1.
export function summitFlash(f: Frame): number {
  return window01(f.phase, [SUMMIT, SUMMIT + 0.3], 0.35);
}

// How settled the mark is (its light sweeps and pulses only at rest).
export function restAmount(f: Frame): number {
  if (f.phase < 0) return smoothstep(INTRO_END - 0.6, INTRO_END, f.sec);
  if (f.phase < OPEN[1])
    return 1 - smoothstep(OPEN[0] - 0.2, OPEN[0] + 0.3, f.phase);
  return smoothstep(FILL + 1.2, FILL + 2, f.phase);
}

// ---- Globe ------------------------------------------------------------------
// Orthographic projection: x, y in mark units (y down), z > 0 faces us.
export function project(lat: number, lon: number, facing: number) {
  const la = (lat * Math.PI) / 180;
  const lo = ((lon - facing) * Math.PI) / 180;
  const y0 = Math.sin(la);
  const z0 = Math.cos(la) * Math.cos(lo);
  return {
    x: Math.cos(la) * Math.sin(lo) * GLOBE_RADIUS,
    y: -(y0 * Math.cos(TILT) - z0 * Math.sin(TILT)) * GLOBE_RADIUS,
    z: y0 * Math.sin(TILT) + z0 * Math.cos(TILT),
  };
}

// Daylight on a point of the globe: 0 = night, 1 = noon.
export function daylight(
  p: { x: number; y: number; z: number },
  sun: number[],
): number {
  const n = [p.x / GLOBE_RADIUS, p.y / GLOBE_RADIUS, p.z];
  return Math.max(0, n[0] * sun[0] + n[1] * sun[1] + n[2] * sun[2]);
}

// A point on the globe as it shows now: projected, set by the sink, and
// faded out below the horizon once the globe starts setting.
function onSphere(lat: number, lon: number, f: Frame) {
  const p = project(lat, lon, f.facing);
  const y = p.y + globeShift(f);
  const seen = y > HORIZON ? 1 - belowHorizon(f) : 1;
  return { x: p.x, y, z: p.z, seen, day: daylight(p, f.sun) };
}

export function isLand(lat: number, lon: number): boolean {
  const y = Math.min(
    Math.floor(((90 - lat) / 180) * LAND.length),
    LAND.length - 1,
  );
  const wrapped = (((lon + 180) % 360) + 360) % 360;
  const column = Math.floor((wrapped / 360) * LAND_COLUMNS);
  const nibble = Number.parseInt(LAND[y][column >> 2], 16);
  return ((nibble >> (3 - (column & 3))) & 1) === 1;
}

// Evenly spaced points on the sphere: rows of latitude, each with as many
// points as its circumference allows.
function sphereGrid(step: number) {
  const points: { lat: number; lon: number }[] = [];
  for (let lat = -90 + step / 2; lat < 90; lat += step) {
    const count = Math.max(
      1,
      Math.round((360 / step) * Math.cos((lat * Math.PI) / 180)),
    );
    for (let i = 0; i < count; i++) {
      points.push({ lat, lon: -180 + ((i + 0.5) * 360) / count });
    }
  }
  return points;
}

// ---- Offices ----------------------------------------------------------------
export const OFFICES = [
  { name: "Plano", lat: 33.02, lon: -96.7, hq: true },
  { name: "Ho Chi Minh City", lat: 10.82, lon: 106.63, hq: true },
  { name: "Da Nang", lat: 16.05, lon: 108.2, hq: false },
  { name: "Ha Noi", lat: 21.03, lon: 105.85, hq: false },
];
const [PLANO, HCMC] = OFFICES;

// Each office's light (0..1): always marked while the globe shows, bright
// while it is in daylight (at work).
export function officeLights(f: Frame) {
  return OFFICES.map((office) => {
    const p = onSphere(office.lat, office.lon, f);
    const awake = smoothstep(0.05, 0.3, p.day);
    return {
      ...office,
      x: p.x,
      y: p.y,
      z: p.z,
      glow:
        f.globe * p.seen * smoothstep(-0.05, 0.25, p.z) * (0.35 + 0.65 * awake),
    };
  });
}

// The torch: a point on the great circle from Plano to Ho Chi Minh City,
// lifted off the globe, with the trail behind it (newest first).
export function torchAt(f: Frame, trail = 22) {
  const along = smoothstep(TORCH[0], TORCH[1], f.phase);
  const alpha = window01(f.phase, TORCH, 0.25) * f.globe;
  const toVector = (lat: number, lon: number) => {
    const la = (lat * Math.PI) / 180;
    const lo = (lon * Math.PI) / 180;
    return [
      Math.cos(la) * Math.cos(lo),
      Math.sin(la),
      Math.cos(la) * Math.sin(lo),
    ];
  };
  const a = toVector(PLANO.lat, PLANO.lon);
  const b = toVector(HCMC.lat, HCMC.lon);
  const angle = Math.acos(a[0] * b[0] + a[1] * b[1] + a[2] * b[2]);
  const at = (t: number) => {
    const s1 = Math.sin((1 - t) * angle) / Math.sin(angle);
    const s2 = Math.sin(t * angle) / Math.sin(angle);
    const v = a.map((c, k) => c * s1 + b[k] * s2);
    const lift = 1 + 0.3 * Math.sin(Math.PI * t);
    const p = project(
      (Math.asin(v[1]) * 180) / Math.PI,
      (Math.atan2(v[2], v[0]) * 180) / Math.PI,
      f.facing,
    );
    return { x: p.x * lift, y: p.y * lift };
  };
  const points = Array.from({ length: trail }, (_, i) =>
    at(Math.max(0, along - i * 0.02)),
  );
  return { points, alpha };
}

// ---- The mark ------------------------------------------------------------------
// Stroke centres from logo-square.png: x, y and half-width in the 300 px
// logo. The navy stroke is the mountain (left foot, summit, right foot); the
// amber check-mark is ticked from its top-left; the T is the stem (bottom up,
// widened to carry the tech logos) and its thin rising line.
type Trace = [x: number, y: number, halfWidth: number][];
const AMBER: Trace[] = [
  [
    [92, 74, 3],
    [102, 79, 7],
    [114, 87, 11],
    [126, 98, 11.5],
    [136, 104, 11.5],
    [150, 94, 9],
    [162, 84.5, 6.5],
    [174, 75.5, 5],
    [186, 67.5, 3.5],
    [198, 60, 2.2],
    [210, 54, 1.3],
    [222, 49, 0.8],
  ],
];
const PEAK: Trace[] = [
  [
    [36, 174.5, 1],
    [48, 170, 2],
    [60, 163, 3],
    [72, 154.5, 4.5],
    [84, 146.5, 6.5],
    [96, 137, 8],
    [108, 127, 9.5],
    [116, 121, 10.5],
    [126, 129, 11.5],
    [138, 140, 11],
    [150, 147, 8],
    [160, 152, 3],
  ],
];
const TEE: Trace[] = [
  [
    [219, 156, 14],
    [219, 52, 14],
  ],
  [
    [228, 50, 1.2],
    [258, 44, 1],
    [288, 38, 0.6],
  ],
];
// One mark unit = the mark's height (137 px), centred on (162, 106), y down.
const LOGO_HEIGHT = 137;
const ux = (x: number) => (x - 162) / LOGO_HEIGHT;
const uy = (y: number) => (y - 106) / LOGO_HEIGHT;
const unit = ([x, y]: readonly number[]) => ({ x: ux(x), y: uy(y) });
export const MARK_WIDTH = ux(288) - ux(36);
// The mountain: its summit (the peak vertex, 7 of 11 segments along) and
// its feet.
const SUMMIT_AT = 7 / 11;
const SUMMIT_POINT = unit(PEAK[0][7]);
const FEET = [unit(PEAK[0][0]), unit(PEAK[0].at(-1) ?? PEAK[0][0])];

// A point on a trace's centre line, f = 0..1 by segment count.
function onTrace(trace: Trace, f: number): Point {
  const at = Math.min(Math.max(f, 0), 1) * (trace.length - 1);
  const i = Math.min(Math.floor(at), trace.length - 2);
  return mixPoint(unit(trace[i]), unit(trace[i + 1]), at - i);
}

type Target = Point & { tx: number; ty: number; along: number; trace: number };

// Points spread over the traces in proportion to stroke area (length x
// width), each placed at random across the stroke. Each keeps the stroke's
// direction (tx, ty), its trace and how far along it sits (0..1).
function strokeFill(traces: Trace[], count: number, rand: () => number) {
  const segments = traces.flatMap((trace, t) =>
    trace.slice(1).map((b, i) => ({
      a: trace[i],
      b,
      trace: t,
      at: i,
      of: trace.length - 1,
    })),
  );
  const weights = segments.map(
    ({ a, b }) =>
      Math.hypot(ux(b[0]) - ux(a[0]), uy(b[1]) - uy(a[1])) * (a[2] + b[2] + 3),
  );
  const total = weights.reduce((sum, w) => sum + w, 0);
  return Array.from({ length: count }, (): Target => {
    let pick = rand() * total;
    let i = 0;
    while (pick > weights[i] && i < segments.length - 1) pick -= weights[i++];
    const { a, b, trace, at, of } = segments[i];
    const f = rand();
    const dx = ux(b[0]) - ux(a[0]);
    const dy = uy(b[1]) - uy(a[1]);
    const len = Math.hypot(dx, dy) || 1;
    const w = (mix(a[2], b[2], f) / LOGO_HEIGHT) * (rand() * 2 - 1);
    return {
      x: ux(mix(a[0], b[0], f)) - (dy / len) * w,
      y: uy(mix(a[1], b[1], f)) + (dx / len) * w,
      tx: dx / len,
      ty: dy / len,
      along: (at + f) / of,
      trace,
    };
  });
}

// ---- The T's tech logos -----------------------------------------------------------
// Two logos a row, stacked from the bottom of the stem up; the last one sits
// alone at the top.
export const ICON_SIZE = 0.088; // mark units
function iconSlots(count: number): Point[] {
  const bottom = uy(146);
  const step = (bottom - uy(64)) / Math.ceil(count / 2 - 1);
  return Array.from({ length: count }, (_, i) => {
    const row = Math.floor(i / 2);
    const alone = i === count - 1 && count % 2 === 1;
    const side = i % 2 === 0 ? -1 : 1;
    return {
      x: ux(219) + (alone ? 0 : side * ICON_SIZE * 0.58),
      y: bottom - row * step,
    };
  });
}

// ---- Scene ------------------------------------------------------------------
function random(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

// Which part of the mark a stretch of land becomes.
type Part = "amber" | "peak" | "tee";
export function partOf(lon: number): Part {
  if (lon > -170 && lon < -25) return "amber"; // the Americas
  if (lon >= 60 || lon <= -170) return "peak"; // Asia and Oceania
  return "tee"; // Europe, Africa and the Middle East: the far side
}

type Dot = {
  lat: number;
  lon: number;
  part: Part;
  mark: Target;
  spark: Point;
  seed: number;
  delay: number;
  size: number;
  glow: boolean;
};

type Icon = { index: number; slot: Point; from: Point };

export type Scene = {
  land: Dot[];
  icons: Icon[];
  grid: { lat: number; lon: number }[][];
};

const TRACES: Record<Part, Trace[]> = { amber: AMBER, peak: PEAK, tee: TEE };

export function buildScene(seed = 11): Scene {
  const rand = random(seed);
  const cells = sphereGrid(1.9).filter((c) => isLand(c.lat, c.lon));
  const land: Dot[] = [];
  for (const part of ["amber", "peak", "tee"] as const) {
    const mine = cells.filter((c) => partOf(c.lon) === part);
    const targets = strokeFill(TRACES[part], mine.length, rand);
    mine.forEach((cell, i) => {
      const angle = rand() * Math.PI * 2;
      const reach = 0.5 + rand() * 0.9;
      land.push({
        ...cell,
        part,
        mark: targets[i],
        spark: { x: Math.cos(angle) * reach, y: Math.sin(angle) * reach },
        seed: rand() * Math.PI * 2,
        delay: rand(),
        size: 0.6 + rand() * 1,
        glow: rand() < 0.22,
      });
    });
  }
  // The logos wait in a loose cloud around the T before they stack.
  const slots = iconSlots(TECH_ICONS.length);
  const icons = slots.map((slot, index) => {
    const angle = -2.5 + (index / slots.length) * 4.2 + (rand() - 0.5) * 0.3;
    const reach = 0.42 + rand() * 0.22;
    return {
      index,
      slot,
      from: {
        x: Math.min(0.86, ux(219) + Math.cos(angle) * reach),
        y: Math.sin(angle) * reach * 0.85,
      },
    };
  });
  // Graticule: parallels and meridians every 30 degrees.
  const grid = [
    ...[-60, -30, 0, 30, 60].map((lat) =>
      Array.from({ length: 121 }, (_, i) => ({ lat, lon: -180 + i * 3 })),
    ),
    ...Array.from({ length: 12 }, (_, m) =>
      Array.from({ length: 61 }, (_, i) => ({
        lat: -90 + i * 3,
        lon: -180 + m * 30,
      })),
    ),
  ];
  return { land, icons, grid };
}

// ---- One dot, one moment ---------------------------------------------------
// depth: how near the viewer the dot is (-1..1), for the pointer parallax.
export type DotFrame = Point & {
  alpha: number;
  amber: number;
  scale: number;
  depth: number;
};

// A slow band of light that sweeps across the resting mark.
function sheen(p: Point, sec: number): number {
  const band = ((sec * 0.3) % 2.2) - 0.6;
  const across = (p.x + MARK_WIDTH / 2) / MARK_WIDTH - p.y * 0.35;
  return Math.exp(-((across - band) ** 2) / 0.005);
}

// Resting in the mark: light drifting along the stroke, softly twinkling;
// the stem's light glows faintly behind the tech logos.
function resting(dot: Dot, sec: number): DotFrame {
  const m = dot.mark;
  const flow = 0.016 * Math.sin(sec * 0.8 + dot.seed);
  const sway = 0.005 * Math.cos(sec * 1.3 + dot.seed * 2);
  const behind = dot.part === "tee" && m.trace === 0 ? 0.35 : 1;
  const shine = sheen(m, sec);
  return {
    x: m.x + m.tx * flow - m.ty * sway,
    y: m.y + m.ty * flow + m.tx * sway,
    alpha:
      (0.72 + 0.26 * Math.sin(sec * 1.9 + dot.seed * 3)) * behind + 0.5 * shine,
    amber: dot.part === "amber" ? 1 : 0,
    scale: 1 + 0.6 * shine,
    depth: dot.size - 1.1,
  };
}

// On the globe: day side pale, night side faint with warm city light.
function onGlobe(dot: Dot, f: Frame): DotFrame {
  const p = onSphere(dot.lat, dot.lon, f);
  const night = 1 - smoothstep(0, 0.35, p.day);
  const lit = Math.max(0.3 + 0.7 * (1 - night), 0.5 * night);
  return {
    x: p.x,
    y: p.y,
    alpha: p.z > 0 ? lit * p.seen : 0,
    amber: 0.85 * night,
    scale: 0.65 + 0.35 * Math.max(p.z, 0),
    depth: p.z,
  };
}

// A quadratic curve from a to b, pulled towards c.
function curve(a: Point, c: Point, b: Point, t: number): Point {
  const u = 1 - t;
  return {
    x: u * u * a.x + 2 * u * t * c.x + t * t * b.x,
    y: u * u * a.y + 2 * u * t * c.y + t * t * b.y,
  };
}

function blend(from: DotFrame, to: DotFrame, at: Point, t: number): DotFrame {
  return {
    ...at,
    alpha: mix(from.alpha, to.alpha, t),
    amber: mix(from.amber, to.amber, t),
    scale: mix(from.scale, to.scale, t),
    depth: mix(from.depth, to.depth, t),
  };
}

function intro(dot: Dot, f: Frame): DotFrame {
  const start = INTRO_START + dot.delay * 1.1;
  const t = smoothstep(start, start + FLIGHT, f.sec);
  const rest = resting(dot, f.sec);
  const spark = { ...dot.spark, alpha: 0, amber: 0.6, scale: 0.6, depth: 0 };
  return blend(spark, rest, curve(dot.spark, { x: 0, y: 0 }, rest, t), t);
}

// Scene 2, the mountain: down to the nearer foot, then up the slope to its
// place, so the mountain fills from the feet to the summit.
function climber(dot: Dot, f: Frame, from: DotFrame): DotFrame {
  const m = dot.mark;
  const left = m.along <= SUMMIT_AT;
  const foot = FEET[left ? 0 : 1];
  const atFoot = { ...foot, alpha: 0.9, amber: 0, scale: 0.9, depth: 0 };
  const climbFrom = CLIMB + dot.delay * 0.5;
  if (f.phase < climbFrom) {
    const start = LEAVE + dot.delay * 0.7;
    const down = smoothstep(start, start + FLIGHT, f.phase);
    const via = mixPoint(from, foot, 0.5);
    return aboveHorizon(
      blend(from, atFoot, curve(from, via, foot, down), down),
      f,
    );
  }
  // Higher places are reached later.
  const height = left ? m.along / SUMMIT_AT : (1 - m.along) / (1 - SUMMIT_AT);
  const start = climbFrom + height * 0.9;
  const up = smoothstep(start, start + 0.9, f.phase);
  const path = onTrace(PEAK[0], mix(left ? 0 : 1, m.along, up));
  const rest = resting(dot, f.sec);
  return blend(atFoot, rest, mixPoint(path, rest, smoothstep(0.7, 1, up)), up);
}

// Scene 2, the check-mark: the Americas gather as light at the summit, then
// the mark is ticked from its top-left, down and up across to the right.
function ticker(dot: Dot, f: Frame, from: DotFrame): DotFrame {
  const summit = {
    ...SUMMIT_POINT,
    alpha: 0.18,
    amber: 1,
    scale: 0.7,
    depth: 0,
  };
  if (f.phase < TICK) {
    const start = LEAVE + dot.delay * 0.8;
    const gather = smoothstep(start, start + FLIGHT, f.phase);
    const via = { x: 0, y: -0.2 };
    const path = curve(from, via, SUMMIT_POINT, gather);
    return aboveHorizon(blend(from, summit, path, gather), f);
  }
  const start = TICK + dot.mark.along * 1.1;
  const t = smoothstep(start, start + 0.55, f.phase);
  const rest = resting(dot, f.sec);
  return blend(summit, rest, mixPoint(SUMMIT_POINT, rest, t), t);
}

// Scene 3, behind the logos: the far side of the world waits out of sight,
// then glows up the stem and out along the thin line.
function filler(dot: Dot, f: Frame, from: DotFrame): DotFrame {
  const m = dot.mark;
  const order = m.trace === 0 ? m.along * 0.7 : 0.7 + m.along * 0.4;
  const start = FILL + order * 1;
  const t = smoothstep(start, start + 0.6, f.phase);
  if (t <= 0) {
    // Fades out with the globe, then waits unseen.
    const fade = 1 - smoothstep(LEAVE, LEAVE + 1, f.phase);
    return { ...from, alpha: from.alpha * fade };
  }
  const rest = resting(dot, f.sec);
  const base = unit(TEE[m.trace][0]);
  const rise = { ...base, alpha: 0, amber: 0, scale: 0.8, depth: 0 };
  return blend(rise, rest, mixPoint(base, rest, t), t);
}

export function dotAt(dot: Dot, f: Frame): DotFrame {
  if (f.phase < 0) return intro(dot, f);
  const globe = onGlobe(dot, f);
  if (f.phase < LEAVE) {
    // Mark -> globe, each dot bowing out from the centre on the way.
    const rest = resting(dot, f.sec);
    const start = OPEN[0] + dot.delay * 0.8;
    const t = smoothstep(start, start + FLIGHT, f.phase);
    const bow = { x: globe.x * 1.5, y: globe.y * 1.5 };
    return blend(rest, globe, curve(rest, bow, globe, t), t);
  }
  if (dot.part === "peak") return climber(dot, f, globe);
  if (dot.part === "amber") return ticker(dot, f, globe);
  return filler(dot, f, globe);
}

export type IconFrame = Point & { alpha: number; scale: number };

// A tech logo: in its slot at rest, leaving with the mark, then flying in
// from the cloud around the T and stacking from the bottom up.
export function iconAt(icon: Icon, f: Frame): IconFrame {
  const bob = 0.004 * Math.sin(f.sec * 1.4 + icon.index);
  const slot = { x: icon.slot.x, y: icon.slot.y + bob };
  if (f.phase < 0) {
    const start = INTRO_START + 0.9 + icon.index * 0.07;
    const t = smoothstep(start, start + 0.7, f.sec);
    return { ...slot, alpha: t, scale: mix(0.5, 1, t) };
  }
  if (f.phase < OPEN[0]) return { ...slot, alpha: 1, scale: 1 };
  if (f.phase < ICONS_IN) {
    const t = smoothstep(OPEN[0], OPEN[0] + 0.8, f.phase);
    return {
      ...mixPoint(slot, icon.from, t),
      alpha: 1 - t,
      scale: mix(1, 1.4, t),
    };
  }
  const show = smoothstep(
    ICONS_IN,
    ICONS_IN + 0.5,
    f.phase - icon.index * 0.05,
  );
  const start = STACK + icon.index * 0.13;
  const t = smoothstep(start, start + 0.8, f.phase);
  const float = {
    x: icon.from.x + 0.015 * Math.sin(f.sec * 0.9 + icon.index),
    y: icon.from.y + 0.015 * Math.cos(f.sec * 0.8 + icon.index),
  };
  const lift = {
    x: (float.x + slot.x) / 2,
    y: Math.min(float.y, slot.y) - 0.15,
  };
  return { ...curve(float, lift, slot, t), alpha: show, scale: mix(1.7, 1, t) };
}

// A pulse of light running up the T and out along its thin line, at rest.
export function pulseAt(f: Frame): (Point & { alpha: number }) | null {
  const rest = restAmount(f);
  const run = (f.sec * 0.42) % 1.4;
  if (rest <= 0.01 || run > 1) return null;
  const stem = 0.6; // share of the run spent on the stem
  const at =
    run < stem
      ? onTrace(TEE[0], run / stem)
      : onTrace(TEE[1], (run - stem) / (1 - stem));
  return { ...at, alpha: rest * Math.sin(Math.PI * run) };
}

// ---- Canvas -------------------------------------------------------------------
export type GlobeMark = {
  // Draws a frame; returns how much the scene shows (0..1), so the silk can
  // quiet its gold threads while it does (0 when there is no room).
  draw: (time: number) => number;
  resize: (area: MarkArea) => void;
  // Where the pointer is over the hero, -1..1 on each axis (0, 0 = centre).
  setPointer: (x: number, y: number) => void;
};

const MIST = "rgb(198,216,244)";
const GOLD = "rgb(255,192,0)";
// How far the nearest dots shift with the pointer, in mark units.
const PARALLAX = 0.035;

export function createGlobeMark(canvas: HTMLCanvasElement): GlobeMark | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  // Built on the first frame that has room for the scene, so narrow screens
  // (no stage) never pay for it.
  let scene: Scene | null = null;
  let iconPaths: Path2D[] = [];
  const font = getComputedStyle(canvas).fontFamily;
  let area: MarkArea = null;
  let ratio = 1;
  const pointer = { x: 0, y: 0 };
  const look = { x: 0, y: 0 };
  // Mark units to canvas pixels; nearer things (depth > 0) follow the
  // pointer more.
  type ToPixels = (p: Point, depth?: number) => [number, number];

  const paintSphere = (
    cx: number,
    cy: number,
    r: number,
    f: Frame,
    alpha: number,
  ) => {
    const [sx, sy] = f.sun;
    const ocean = ctx.createLinearGradient(
      cx + sx * r,
      cy + sy * r,
      cx - sx * r,
      cy - sy * r,
    );
    ocean.addColorStop(0, `rgba(58,114,196,${0.62 * alpha})`);
    ocean.addColorStop(0.45, `rgba(22,52,108,${0.62 * alpha})`);
    ocean.addColorStop(1, `rgba(4,10,26,${0.82 * alpha})`);
    ctx.fillStyle = ocean;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    const air = ctx.createRadialGradient(cx, cy, r * 0.9, cx, cy, r * 1.18);
    air.addColorStop(0, `rgba(110,170,255,${0.3 * alpha})`);
    air.addColorStop(0.35, `rgba(90,150,240,${0.12 * alpha})`);
    air.addColorStop(1, "rgba(90,150,240,0)");
    ctx.fillStyle = air;
    ctx.fillRect(cx - r * 1.2, cy - r * 1.2, r * 2.4, r * 2.4);
  };

  // The globe; once it starts setting, the part below the horizon fades.
  const drawSphere = (f: Frame, px: ToPixels, size: number) => {
    if (f.globe <= 0.01) return;
    const [cx, cy] = px({ x: 0, y: globeShift(f) });
    const r = GLOBE_RADIUS * size * ratio;
    const [, horizon] = px({ x: 0, y: HORIZON });
    const below = belowHorizon(f);
    ctx.save();
    if (below > 0) {
      ctx.beginPath();
      ctx.rect(0, 0, canvas.width, horizon);
      ctx.clip();
    }
    paintSphere(cx, cy, r, f, f.globe);
    ctx.restore();
    if (below > 0 && below < 1) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, horizon, canvas.width, canvas.height - horizon);
      ctx.clip();
      paintSphere(cx, cy, r, f, f.globe * (1 - below));
      ctx.restore();
    }
  };

  const drawGrid = (grid: Scene["grid"], f: Frame, px: ToPixels) => {
    const alpha = 0.09 * f.globe * (1 - belowHorizon(f));
    if (alpha <= 0.005) return;
    ctx.strokeStyle = `rgba(150,190,255,${alpha})`;
    ctx.lineWidth = ratio * 0.7;
    ctx.beginPath();
    for (const line of grid) {
      let pen = false;
      for (const point of line) {
        const p = onSphere(point.lat, point.lon, f);
        const [x, y] = px(p, p.z);
        if (p.z > 0 && pen) ctx.lineTo(x, y);
        else if (p.z > 0) ctx.moveTo(x, y);
        pen = p.z > 0;
      }
    }
    ctx.stroke();
  };

  // The horizon the globe sets behind, and the mountain's body under the
  // peak, lit from the ridge down.
  const drawLand = (f: Frame, px: ToPixels) => {
    const line = horizonAmount(f);
    const [, horizon] = px({ x: 0, y: HORIZON });
    if (line > 0.01) {
      const [left] = px({ x: -1.15, y: HORIZON });
      const [right] = px({ x: 1.15, y: HORIZON });
      const edge = ctx.createLinearGradient(left, 0, right, 0);
      edge.addColorStop(0, "rgba(180,210,255,0)");
      edge.addColorStop(0.5, `rgba(205,226,255,${0.6 * line})`);
      edge.addColorStop(1, "rgba(180,210,255,0)");
      ctx.fillStyle = edge;
      ctx.fillRect(left, horizon - ratio, right - left, 2 * ratio);
    }
    const body = mountainAmount(f);
    if (body <= 0.01) return;
    const ridge = PEAK[0].map((p) => px(unit(p)));
    const [, top] = px(SUMMIT_POINT);
    const fill = ctx.createLinearGradient(0, top, 0, horizon);
    fill.addColorStop(0, `rgba(170,200,245,${0.26 * body})`);
    fill.addColorStop(1, "rgba(170,200,245,0.02)");
    ctx.fillStyle = fill;
    ctx.beginPath();
    for (const [x, y] of ridge) ctx.lineTo(x, y);
    ctx.lineTo(ridge.at(-1)?.[0] ?? 0, horizon);
    ctx.lineTo(ridge[0][0], horizon);
    ctx.closePath();
    ctx.fill();
  };

  const square = (x: number, y: number, s: number) =>
    ctx.fillRect(x - s / 2, y - s / 2, s, s);

  const drawDots = (land: Dot[], f: Frame, px: ToPixels, shown: number) => {
    for (const dot of land) {
      const d = dotAt(dot, f);
      const alpha = Math.min(1, d.alpha) * shown;
      if (alpha < 0.02) continue;
      const s = dot.size * d.scale * ratio * 1.7;
      const [x, y] = px(d, d.depth);
      if (d.amber < 1) {
        ctx.globalAlpha = alpha * (1 - d.amber);
        ctx.fillStyle = MIST;
        square(x, y, s);
      }
      if (d.amber > 0) {
        ctx.globalAlpha = alpha * d.amber;
        ctx.fillStyle = GOLD;
        square(x, y, s);
      }
      // A few dots carry a soft halo, so the strokes glow.
      if (dot.glow) {
        ctx.globalAlpha = alpha * 0.07;
        square(x, y, s * 3.4);
      }
    }
    ctx.globalAlpha = 1;
  };

  const glowAt = (x: number, y: number, r: number, alpha: number) => {
    const glow = ctx.createRadialGradient(x, y, 0, x, y, r);
    glow.addColorStop(0, `rgba(255,246,214,${alpha})`);
    glow.addColorStop(0.3, `rgba(255,192,0,${0.65 * alpha})`);
    glow.addColorStop(1, "rgba(255,192,0,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  };

  // The torch: a bright head with a fading tail of light behind it.
  const drawTorch = (f: Frame, px: ToPixels, size: number) => {
    const { points, alpha } = torchAt(f);
    if (alpha <= 0.01) return;
    const pixels = points.map((p) => px(p, 1));
    ctx.lineCap = "round";
    for (let i = pixels.length - 1; i > 0; i--) {
      const fade = 1 - i / pixels.length;
      ctx.strokeStyle = `rgba(255,214,110,${alpha * fade})`;
      ctx.lineWidth = (1 + 4 * fade) * ratio;
      ctx.beginPath();
      ctx.moveTo(...pixels[i]);
      ctx.lineTo(...pixels[i - 1]);
      ctx.stroke();
    }
    glowAt(...pixels[0], 0.09 * size * ratio, alpha);
  };

  const drawFlashes = (f: Frame, px: ToPixels, size: number) => {
    const flash = summitFlash(f);
    if (flash > 0.01) {
      const [x, y] = px(SUMMIT_POINT);
      glowAt(x, y, 0.32 * size * ratio, flash);
    }
    const pulse = pulseAt(f);
    if (pulse) {
      const [x, y] = px(pulse, 0.6);
      glowAt(x, y, 0.06 * size * ratio, pulse.alpha);
    }
  };

  const drawIcons = (icons: Icon[], f: Frame, px: ToPixels, size: number) => {
    const box = ICON_SIZE * size * ratio;
    ctx.fillStyle = "rgb(226,236,252)";
    for (const icon of icons) {
      const frame = iconAt(icon, f);
      if (frame.alpha <= 0.01) continue;
      const [x, y] = px(frame, 0.6);
      const s = (box * frame.scale) / 24;
      ctx.save();
      ctx.globalAlpha = frame.alpha;
      ctx.translate(x - 12 * s, y - 12 * s);
      ctx.scale(s, s);
      ctx.fill(iconPaths[icon.index]);
      ctx.restore();
    }
  };

  const drawOffices = (f: Frame, px: ToPixels, size: number) => {
    ctx.font = `500 ${12 * ratio}px ${font}`;
    ctx.textBaseline = "middle";
    for (const office of officeLights(f)) {
      if (office.glow <= 0.01) continue;
      const [x, y] = px(office, office.z);
      const core = (office.hq ? 0.05 : 0.032) * size * ratio;
      glowAt(x, y, core, office.glow);
      // A ring that keeps pulsing outward.
      const beat = f.sec * 0.7 + office.lon / 50;
      const pulse = beat - Math.floor(beat);
      ctx.strokeStyle = `rgba(255,205,80,${office.glow * (1 - pulse) * 0.8})`;
      ctx.lineWidth = ratio;
      ctx.beginPath();
      ctx.arc(x, y, core * (0.4 + pulse * 1.6), 0, Math.PI * 2);
      ctx.stroke();
      // Labels sit on the globe's side of the light.
      const inward = office.x > 0 ? -1 : 1;
      ctx.textAlign = inward > 0 ? "left" : "right";
      ctx.fillStyle = `rgba(232,240,255,${Math.min(1, office.glow * 1.2)})`;
      ctx.fillText(office.name, x + inward * core * 0.9, y);
    }
  };

  const draw = (time: number) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!area) return 0;
    if (!scene) {
      scene = buildScene();
      iconPaths = TECH_ICONS.map((icon) => new Path2D(icon.path));
    }
    const { x, y, size } = area;
    // Ease the view towards the pointer.
    look.x += (pointer.x - look.x) * 0.06;
    look.y += (pointer.y - look.y) * 0.06;
    const px: ToPixels = (p, depth = 0) => [
      (x + (p.x + look.x * depth * PARALLAX) * size) * ratio,
      (y + (p.y + look.y * depth * PARALLAX) * size) * ratio,
    ];
    const f = frameAt(time);
    const shown = sceneAmount(f);
    drawSphere(f, px, size);
    drawLand(f, px);
    ctx.globalCompositeOperation = "lighter";
    drawGrid(scene.grid, f, px);
    drawDots(scene.land, f, px, shown);
    drawTorch(f, px, size);
    drawFlashes(f, px, size);
    ctx.globalCompositeOperation = "source-over";
    drawIcons(scene.icons, f, px, size);
    drawOffices(f, px, size);
    return shown;
  };

  const resize = (next: MarkArea) => {
    ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = canvas.clientWidth * ratio;
    canvas.height = canvas.clientHeight * ratio;
    area = next;
  };

  const setPointer = (px: number, py: number) => {
    pointer.x = Math.max(-1, Math.min(1, px));
    pointer.y = Math.max(-1, Math.min(1, py));
  };

  return { draw, resize, setPointer };
}
