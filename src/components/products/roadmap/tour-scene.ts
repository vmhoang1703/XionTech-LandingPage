import {
  BoxGeometry,
  BufferGeometry,
  CanvasTexture,
  CatmullRomCurve3,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DirectionalLight,
  DodecahedronGeometry,
  Float32BufferAttribute,
  Fog,
  Group,
  HemisphereLight,
  IcosahedronGeometry,
  InstancedMesh,
  type Material,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  OctahedronGeometry,
  PerspectiveCamera,
  PlaneGeometry,
  QuadraticBezierCurve3,
  Raycaster,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  TorusGeometry,
  TubeGeometry,
  Vector2,
  Vector3,
} from "three";
import { appById } from "@/content/apps";
import { dayRoad, type RoadStop } from "@/content/products";

// The school day as a small floating island: a winding road from Start to
// Finish, one set piece and one in-world sign per stop, a school bus, and a
// camera that tours the day. Pure three.js; the canvas drives it.

export const STOP_COUNT = dayRoad.stops.length;
export const OVERVIEW = -1;

export type Fonts = { display: string; body: string; mono: string };

const COLORS = {
  navy: "#163663",
  navy2: "#244c85",
  ice: "#dce6f5",
  mist: "#eef2f9",
  paper: "#fdfdfe",
  white: "#ffffff",
  amber: "#ffc000",
  amberPale: "#ffe27a",
  text: "#10223f",
};

const v = (x: number, z: number, y = 0) => new Vector3(x, y, z);

// The stops zig-zag across the island; the road joins them.
const STOP_POINTS = [
  v(-16, 6),
  v(-9, -2.5),
  v(-2, 5),
  v(5, -3),
  v(11, 4.5),
  v(17, -3.5),
];
const ROUTE = new CatmullRomCurve3(
  [v(-24, 10), ...STOP_POINTS, v(24, -9)],
  false,
  "centripetal",
);

function nearestT(point: Vector3) {
  let best = 0;
  let bestDistance = Infinity;
  for (let i = 0; i <= 600; i += 1) {
    const t = i / 600;
    const d = ROUTE.getPointAt(t).distanceToSquared(point);
    if (d < bestDistance) {
      bestDistance = d;
      best = t;
    }
  }
  return best;
}

const STOP_T = STOP_POINTS.map(nearestT);

// Each set piece stands on the outer side of its bend, away from the road.
const PIECES = STOP_POINTS.map((p) =>
  p.clone().add(v(0, Math.sign(p.z) * 3.8)),
);

const VIEW_DIR = new Vector3(-0.5, 0.62, 1).normalize();
const FOV = 35;
const HALF_TAN = Math.tan(MathUtils.degToRad(FOV / 2));

// Camera goal for a stop (or the overview) at a given aspect ratio.
function goalFor(index: number, aspect: number) {
  if (index === OVERVIEW) {
    const distance = Math.max(48, 27 / (HALF_TAN * aspect));
    return { target: v(0, 0.5, 0.5), distance };
  }
  const distance = Math.max(16, 7.5 / (HALF_TAN * aspect));
  return { target: PIECES[index].clone().setY(2.6), distance };
}

// Sky and light for the time of day: overview and early stops are morning.
export function timeOfDay(index: number): "morning" | "midday" | "afternoon" {
  if (index >= 5) return "afternoon";
  if (index >= 3) return "midday";
  return "morning";
}

const SUN = {
  morning: { azimuth: 70, elevation: 28, color: "#ffe6b8", intensity: 2.4 },
  midday: { azimuth: 0, elevation: 62, color: "#ffffff", intensity: 2.8 },
  afternoon: { azimuth: -70, elevation: 30, color: "#ffd89a", intensity: 2.4 },
};
const FOG = { morning: "#f3ead6", midday: "#e7eef9", afternoon: "#f6e2c4" };

// A seeded random so the trees land in the same place every visit.
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// A flat ribbon that follows the road.
function ribbon(width: number, y: number, samples = 320) {
  const positions: number[] = [];
  const index: number[] = [];
  const side = new Vector3();
  const up = new Vector3(0, 1, 0);
  for (let i = 0; i <= samples; i += 1) {
    const t = i / samples;
    const point = ROUTE.getPointAt(t);
    side
      .copy(ROUTE.getTangentAt(t))
      .cross(up)
      .normalize()
      .multiplyScalar(width / 2);
    positions.push(point.x + side.x, y, point.z + side.z);
    positions.push(point.x - side.x, y, point.z - side.z);
    if (i < samples) {
      const a = i * 2;
      index.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setIndex(index);
  geometry.computeVertexNormals();
  return geometry;
}

// The in-world sign for a stop, drawn on a canvas: step number and time,
// the title, and the app's name.
const SIGN_W = 640;
const SIGN_H = 300;

// Splits text into lines that fit `max` pixels in the current font.
function wrapWords(ctx: CanvasRenderingContext2D, text: string, max: number) {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    const next = line ? `${line} ${word}` : word;
    const fits = ctx.measureText(next).width <= max;
    if (!fits && line) lines.push(line);
    line = !fits && line ? word : next;
  }
  lines.push(line);
  return lines;
}

function drawSign(
  stop: RoadStop,
  index: number,
  active: boolean,
  fonts: Fonts,
) {
  const canvas = document.createElement("canvas");
  canvas.width = SIGN_W;
  canvas.height = SIGN_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;
  const r = 36;
  const h = SIGN_H - 40;
  ctx.beginPath();
  ctx.roundRect(8, 8, SIGN_W - 16, h - 8, r);
  ctx.fillStyle = COLORS.white;
  ctx.fill();
  ctx.lineWidth = active ? 10 : 4;
  ctx.strokeStyle = active ? COLORS.amber : COLORS.ice;
  ctx.stroke();
  // The pointer under the sign.
  ctx.beginPath();
  ctx.moveTo(SIGN_W / 2 - 26, h - 2);
  ctx.lineTo(SIGN_W / 2, SIGN_H - 4);
  ctx.lineTo(SIGN_W / 2 + 26, h - 2);
  ctx.closePath();
  ctx.fillStyle = active ? COLORS.amber : COLORS.white;
  ctx.fill();
  // Step badge and time.
  ctx.beginPath();
  ctx.arc(64, 64, 30, 0, Math.PI * 2);
  ctx.fillStyle = active ? COLORS.amber : COLORS.navy;
  ctx.fill();
  ctx.fillStyle = active ? COLORS.navy : COLORS.white;
  ctx.font = `600 30px ${fonts.mono}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(String(index + 1), 64, 66);
  ctx.textAlign = "left";
  if (stop.time) {
    ctx.fillStyle = COLORS.navy2;
    ctx.font = `500 30px ${fonts.mono}`;
    ctx.fillText(stop.time, 112, 66);
  }
  // Title, up to two lines.
  ctx.fillStyle = COLORS.navy;
  ctx.font = `700 40px ${fonts.display}`;
  const lines = wrapWords(ctx, stop.title, SIGN_W - 80);
  lines.slice(0, 2).forEach((text, i) => ctx.fillText(text, 40, 134 + i * 48));
  // App chip.
  if (stop.app) {
    const name = appById(stop.app).shortName;
    ctx.font = `600 26px ${fonts.body}`;
    const w = ctx.measureText(name).width + 40;
    const y = lines.length > 1 ? 206 : 176;
    ctx.beginPath();
    ctx.roundRect(40, y - 20, w, 40, 20);
    ctx.fillStyle = COLORS.navy;
    ctx.fill();
    ctx.fillStyle = COLORS.white;
    ctx.fillText(name, 60, y + 1);
  }
  return canvas;
}

// Up to 70 trees on the island, off the road and away from the set pieces.
function treeSpots() {
  const random = seeded(7);
  const road = Array.from({ length: 120 }, (_, i) => ROUTE.getPointAt(i / 119));
  const clear = (point: Vector3) =>
    (point.x / 29) ** 2 + (point.z / 17.5) ** 2 <= 1 &&
    road.every((s) => s.distanceTo(point) >= 2.4) &&
    PIECES.every((s) => s.distanceTo(point) >= 4.2);
  const spots: { x: number; z: number; scale: number; turn: number }[] = [];
  for (let tries = 0; tries < 900 && spots.length < 70; tries += 1) {
    const point = v((random() * 2 - 1) * 28, (random() * 2 - 1) * 17);
    const scale = 0.75 + random() * 0.6;
    const turn = random() * Math.PI;
    if (clear(point)) spots.push({ x: point.x, z: point.z, scale, turn });
  }
  return spots;
}

// The stop index a picked object belongs to: a sign carries it in userData,
// a set piece is found by walking up to its group.
function stopOf(object: Object3D, pieces: Group[]) {
  let node: Object3D | null = object;
  while (node) {
    if (typeof node.userData.index === "number")
      return node.userData.index as number;
    const at = pieces.indexOf(node as Group);
    if (at >= 0) return at;
    node = node.parent;
  }
  return null;
}

const WHEELS = [
  [-0.66, -0.85],
  [0.66, -0.85],
  [-0.66, 0.85],
  [0.66, 0.85],
] as const;

export function buildTour(fonts: Fonts) {
  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 16 / 9, 1, 400);
  const disposables: { dispose: () => void }[] = [];
  const own = <T extends { dispose: () => void }>(thing: T) => {
    disposables.push(thing);
    return thing;
  };
  const mat = (color: string, emissive = 0) =>
    own(
      new MeshStandardMaterial({
        color: new Color(color),
        roughness: 0.82,
        metalness: 0,
        emissive: new Color(emissive ? color : "#000000"),
        emissiveIntensity: emissive,
      }),
    );
  const M = {
    navy: mat(COLORS.navy),
    navy2: mat(COLORS.navy2),
    ice: mat(COLORS.ice),
    mist: mat(COLORS.mist),
    paper: mat(COLORS.paper),
    white: mat(COLORS.white),
    amber: mat(COLORS.amber, 0.15),
    glow: mat(COLORS.amberPale, 0.9),
    road: mat("#1d3a66"),
    line: mat(COLORS.amberPale, 0.4),
  };
  const box = (
    size: [number, number, number],
    material: Material,
    at: [number, number, number],
    parent?: Object3D,
  ) => {
    const mesh = new Mesh(own(new BoxGeometry(...size)), material);
    mesh.position.set(...at);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent?.add(mesh);
    return mesh;
  };
  const cyl = (
    top: number,
    bottom: number,
    height: number,
    material: Material,
    at: [number, number, number],
    parent?: Object3D,
    segments = 12,
  ) => {
    const mesh = new Mesh(
      own(new CylinderGeometry(top, bottom, height, segments)),
      material,
    );
    mesh.position.set(...at);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent?.add(mesh);
    return mesh;
  };

  // Light: sky fill plus a sun that moves through the day.
  const sky = new HemisphereLight(0xffffff, 0xb8c6dc, 1.5);
  scene.add(sky);
  const sun = own(new DirectionalLight(0xffffff, 2.4));
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.bias = -0.0004;
  Object.assign(sun.shadow.camera, {
    left: -34,
    right: 34,
    top: 34,
    bottom: -34,
    near: 1,
    far: 140,
  });
  scene.add(sun, sun.target);
  scene.fog = new Fog(FOG.morning, 70, 190);

  // The island: a low-poly slab with a lawn top and a rocky underside.
  const islandGeometry = own(new CylinderGeometry(31, 27, 3, 11));
  const island = new Mesh(islandGeometry, [M.navy, M.ice, M.navy]);
  island.scale.set(1, 1, 0.62);
  island.position.y = -1.5;
  island.receiveShadow = true;
  scene.add(island);
  const rock = new Mesh(own(new ConeGeometry(26, 9, 11)), M.navy2);
  rock.scale.set(1, 1, 0.6);
  rock.rotation.x = Math.PI;
  rock.position.y = -7.4;
  scene.add(rock);

  // The road: a navy ribbon with a dashed amber centre line.
  const road = new Mesh(own(ribbon(2.1, 0.04)), M.road);
  road.receiveShadow = true;
  scene.add(road);
  const dash = own(new BoxGeometry(0.14, 0.02, 0.6));
  const dashes = new InstancedMesh(dash, M.line, 90);
  const placing = new Object3D();
  for (let i = 0; i < 90; i += 1) {
    const t = (i + 0.5) / 90;
    const p = ROUTE.getPointAt(t);
    const tangent = ROUTE.getTangentAt(t);
    placing.position.set(p.x, 0.08, p.z);
    placing.rotation.set(0, Math.atan2(tangent.x, tangent.z), 0);
    placing.updateMatrix();
    dashes.setMatrixAt(i, placing.matrix);
  }
  scene.add(dashes);

  // Start and Finish arches across the road ends.
  const arch = (t: number, banner: Material) => {
    const group = new Group();
    const p = ROUTE.getPointAt(t);
    const tangent = ROUTE.getTangentAt(t);
    group.position.copy(p);
    group.rotation.y = Math.atan2(tangent.x, tangent.z) + Math.PI / 2;
    box([0.35, 3, 0.35], M.navy, [-1.6, 1.5, 0], group);
    box([0.35, 3, 0.35], M.navy, [1.6, 1.5, 0], group);
    box([3.6, 0.8, 0.3], banner, [0, 2.8, 0], group);
    scene.add(group);
  };
  arch(0.012, M.amber);
  arch(0.988, M.navy2);

  // Trees across the island, kept off the road and the set pieces.
  const trunks = new InstancedMesh(
    own(new CylinderGeometry(0.14, 0.18, 0.8, 6)),
    M.navy,
    70,
  );
  const crowns = new InstancedMesh(
    own(new DodecahedronGeometry(0.85, 0)),
    M.navy2,
    70,
  );
  trunks.castShadow = true;
  crowns.castShadow = true;
  const spots = treeSpots();
  spots.forEach(({ x, z, scale, turn }, i) => {
    placing.position.set(x, 0.4 * scale, z);
    placing.rotation.set(0, turn, 0);
    placing.scale.setScalar(scale);
    placing.updateMatrix();
    trunks.setMatrixAt(i, placing.matrix);
    placing.position.y = 1.35 * scale;
    placing.updateMatrix();
    crowns.setMatrixAt(i, placing.matrix);
  });
  trunks.count = spots.length;
  crowns.count = spots.length;
  scene.add(trunks, crowns);

  // Set pieces, one per stop.
  const pieces: Group[] = [];
  const spinners: Object3D[] = [];
  const blinkers: Mesh[] = [];
  const piece = (i: number) => {
    const group = new Group();
    group.position.copy(PIECES[i]);
    group.rotation.y = PIECES[i].z > 0 ? 0 : Math.PI;
    scene.add(group);
    pieces.push(group);
    return group;
  };

  // 1 Student arrives: the school gate and a bus shelter.
  {
    const g = piece(0);
    cyl(1.6, 1.7, 0.3, M.paper, [0, 0.15, 0], g, 20);
    box([0.4, 3.2, 0.4], M.navy, [-1.4, 1.6, 0], g);
    box([0.4, 3.2, 0.4], M.navy, [1.4, 1.6, 0], g);
    box([3.4, 0.5, 0.5], M.navy2, [0, 3.2, 0], g);
    box([1.6, 0.12, 1], M.amber, [2.6, 1.9, 0.6], g);
    box([0.1, 1.9, 0.1], M.navy, [2.0, 0.95, 0.2], g);
    box([0.1, 1.9, 0.1], M.navy, [3.2, 0.95, 0.2], g);
  }
  // 2 Attendance recorded (Staff Hub): the school with a flag.
  {
    const g = piece(1);
    box([5.2, 2.8, 2.8], M.paper, [0, 1.4, 0], g);
    box([5.6, 0.35, 3.2], M.navy2, [0, 2.95, 0], g);
    box([1.6, 1.4, 1.6], M.paper, [0, 3.8, 0], g);
    cyl(0.45, 0.45, 0.1, M.navy, [0, 3.9, 0.82], g, 16).rotation.x =
      Math.PI / 2;
    box([0.9, 1.5, 0.1], M.navy, [0, 0.75, 1.41], g);
    for (const x of [-1.8, -0.9, 0.9, 1.8])
      box([0.55, 0.6, 0.06], M.glow, [x, 1.6, 1.42], g);
    box([0.08, 3, 0.08], M.navy, [2.9, 1.5, 1.4], g);
    box([0.9, 0.5, 0.05], M.amber, [3.35, 2.7, 1.4], g);
  }
  // 3 Parent updated (Parent Hub): a home and a phone with an alert.
  {
    const g = piece(2);
    box([2.8, 1.8, 2.4], M.paper, [-0.8, 0.9, 0], g);
    const roof = new Mesh(own(new ConeGeometry(2.3, 1.4, 4)), M.navy2);
    roof.position.set(-0.8, 2.5, 0);
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    g.add(roof);
    box([0.6, 1, 0.08], M.navy, [-0.8, 0.5, 1.22], g);
    box([0.6, 0.5, 0.06], M.glow, [0.2, 1.2, 1.22], g);
    const phone = new Group();
    phone.position.set(1.9, 2.2, 0.6);
    box([1.1, 2, 0.2], M.navy, [0, 0, 0], phone);
    box([0.9, 1.6, 0.04], M.glow, [0, 0, 0.12], phone);
    const bell = new Mesh(own(new SphereGeometry(0.32, 12, 8)), M.amber);
    bell.position.set(0.55, 1.05, 0.2);
    phone.add(bell);
    blinkers.push(bell);
    g.add(phone);
    spinners.push(phone);
  }
  // 4 Student learns (AI Tutor): an open classroom with a glowing laptop.
  {
    const g = piece(3);
    box([4.4, 0.25, 3.2], M.paper, [0, 0.12, 0], g);
    for (const [x, z] of [
      [-2, -1.4],
      [2, -1.4],
      [-2, 1.4],
      [2, 1.4],
    ] as const)
      box([0.2, 2.6, 0.2], M.navy, [x, 1.4, z], g);
    box([4.8, 0.3, 3.6], M.navy2, [0, 2.8, 0], g);
    for (const x of [-1, 1]) {
      box([1.2, 0.1, 0.8], M.paper, [x, 0.95, 0.2], g);
      box([0.1, 0.8, 0.1], M.navy, [x - 0.5, 0.55, 0.2], g);
      box([0.1, 0.8, 0.1], M.navy, [x + 0.5, 0.55, 0.2], g);
    }
    box([0.7, 0.45, 0.05], M.glow, [-1, 1.25, 0], g).rotation.x = -0.3;
    box([0.7, 0.45, 0.05], M.glow, [1, 1.25, 0], g).rotation.x = -0.3;
    const spark = new Mesh(own(new OctahedronGeometry(0.45, 0)), M.amber);
    spark.position.set(0, 3.8, 0);
    g.add(spark);
    spinners.push(spark);
  }
  // 5 IoT: a building with solar panels, an antenna and smart lamps.
  {
    const g = piece(4);
    box([3.4, 3.4, 2.6], M.paper, [0, 1.7, 0], g);
    for (const x of [-0.9, 0.9]) {
      const panel = box([1.3, 0.08, 1.8], M.navy2, [x, 3.6, 0], g);
      panel.rotation.x = -0.35;
    }
    box([0.1, 1.8, 0.1], M.navy, [1.4, 4.3, -0.9], g);
    const tip = new Mesh(own(new SphereGeometry(0.18, 10, 8)), M.glow);
    tip.position.set(1.4, 5.25, -0.9);
    g.add(tip);
    blinkers.push(tip);
    for (const x of [-2.6, 2.6]) {
      box([0.1, 2.2, 0.1], M.navy, [x, 1.1, 1.6], g);
      const lamp = new Mesh(own(new SphereGeometry(0.22, 10, 8)), M.glow);
      lamp.position.set(x, 2.3, 1.6);
      g.add(lamp);
    }
    for (const x of [-1, 0, 1])
      box([0.5, 0.5, 0.06], M.glow, [x, 2.2, 1.31], g);
  }
  // 6 Day stays connected: a hub tower with links to every other stop.
  const links: { curve: QuadraticBezierCurve3; dot: Mesh }[] = [];
  {
    const g = piece(5);
    cyl(0.9, 1.3, 4.6, M.paper, [0, 2.3, 0], g, 8);
    cyl(1.2, 1.2, 0.3, M.navy2, [0, 4.75, 0], g, 8);
    const ring = new Mesh(own(new TorusGeometry(1.1, 0.12, 8, 24)), M.glow);
    ring.position.set(0, 5.6, 0);
    ring.rotation.x = Math.PI / 2;
    g.add(ring);
    spinners.push(ring);
    const top = PIECES[5].clone().setY(5.6);
    const linkMaterial = own(
      new MeshBasicMaterial({
        color: COLORS.amber,
        transparent: true,
        opacity: 0.55,
      }),
    );
    const dotGeometry = own(new SphereGeometry(0.16, 8, 6));
    for (let i = 0; i < 5; i += 1) {
      const end = PIECES[i].clone().setY(3);
      const mid = top.clone().lerp(end, 0.5).setY(11);
      const curve = new QuadraticBezierCurve3(top, mid, end);
      const tube = new Mesh(
        own(new TubeGeometry(curve, 40, 0.05, 6)),
        linkMaterial,
      );
      scene.add(tube);
      const dot = new Mesh(dotGeometry, M.amber);
      scene.add(dot);
      links.push({ curve, dot });
    }
  }

  // Clouds drifting over the island.
  const clouds: Group[] = [];
  const puff = own(new IcosahedronGeometry(1, 0));
  for (let i = 0; i < 5; i += 1) {
    const cloud = new Group();
    for (let p = 0; p < 3; p += 1) {
      const m = new Mesh(puff, M.white);
      m.position.set(p * 1.1 - 1.1, (p % 2) * 0.3, 0);
      m.scale.setScalar(0.9 + (p === 1 ? 0.5 : 0));
      cloud.add(m);
    }
    cloud.position.set(-30 + i * 14, 13 + (i % 2) * 2, -12 + (i % 3) * 7);
    scene.add(cloud);
    clouds.push(cloud);
  }

  // The school bus.
  const bus = new Group();
  box([1.3, 1.05, 2.6], M.amber, [0, 0.85, 0], bus);
  box([1.34, 0.36, 2], M.navy, [0, 1.05, -0.15], bus);
  box([1.2, 0.36, 0.06], M.navy, [0, 1.05, 1.3], bus);
  const wheel = own(new CylinderGeometry(0.26, 0.26, 0.18, 12));
  for (const [x, z] of WHEELS) {
    const w = new Mesh(wheel, M.navy);
    w.rotation.z = Math.PI / 2;
    w.position.set(x, 0.28, z);
    bus.add(w);
  }
  scene.add(bus);

  // Signs: one billboard per stop, with a highlighted twin for the active stop.
  const signGeometry = own(new PlaneGeometry(4.8, 4.8 * (SIGN_H / SIGN_W)));
  const signs = dayRoad.stops.map((stop, i) => {
    const textures = [false, true].map((active) => {
      const texture = own(new CanvasTexture(drawSign(stop, i, active, fonts)));
      texture.colorSpace = SRGBColorSpace;
      texture.anisotropy = 4;
      return texture;
    });
    const material = own(
      new MeshBasicMaterial({
        map: textures[0],
        transparent: true,
        fog: false,
      }),
    );
    const sign = new Mesh(signGeometry, material);
    sign.position.copy(PIECES[i]).setY(i === 1 || i === 4 ? 7.2 : 6.4);
    sign.userData = { index: i };
    scene.add(sign);
    return { sign, material, textures };
  });

  // State: the goal stop, the camera's smoothed pose and the bus's progress.
  let goal = OVERVIEW;
  let aspect = 16 / 9;
  let elapsed = 0;
  let snap = true;
  const target = goalFor(OVERVIEW, aspect).target.clone();
  let distance = goalFor(OVERVIEW, aspect).distance;
  let busT = 0;
  const sunColor = new Color(SUN.morning.color);
  let sunIntensity = SUN.morning.intensity;
  const sunDir = new Vector3();
  const fogColor = new Color(FOG.morning);
  const scratch = new Vector3();
  const scratchColor = new Color();

  const placeBus = () => {
    const p = ROUTE.getPointAt(busT);
    const tangent = ROUTE.getTangentAt(busT);
    bus.position.set(p.x, 0.06, p.z);
    bus.rotation.y = Math.atan2(tangent.x, tangent.z);
  };

  const sunGoal = (index: number) => {
    const s = SUN[timeOfDay(index)];
    sunDir.setFromSphericalCoords(
      60,
      MathUtils.degToRad(90 - s.elevation),
      MathUtils.degToRad(s.azimuth),
    );
    return s;
  };

  const setActiveSign = (index: number) => {
    signs.forEach(({ material, textures, sign }, i) => {
      material.map = textures[i === index ? 1 : 0];
      material.needsUpdate = true;
      sign.scale.setScalar(i === index ? 1.18 : 1);
    });
  };

  // Aim the tour at a stop (or the overview). `instant` skips the glide.
  const go = (index: number, instant: boolean) => {
    goal = index;
    snap = instant;
    setActiveSign(index);
  };

  const resize = (nextAspect: number) => {
    aspect = nextAspect;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
  };

  // Idle motion: drifting clouds, spinners, blinking lights, link dots.
  const animate = (dt: number) => {
    elapsed += dt;
    for (const cloud of clouds) {
      cloud.position.x += dt * 0.0012;
      if (cloud.position.x > 36) cloud.position.x = -36;
    }
    for (const spinner of spinners) spinner.rotation.y += dt * 0.0012;
    const blink = Math.sin(elapsed / 300) > 0;
    for (const blinker of blinkers) blinker.visible = blink;
    links.forEach(({ curve, dot }, i) => {
      curve.getPoint((elapsed / 2600 + i / 5) % 1, dot.position);
    });
  };

  // Advance by `ms`. `live` runs the idle motion (clouds, spinners, links);
  // returns true while the camera or the bus is still moving.
  const tick = (ms: number, live: boolean) => {
    const dt = Number.isFinite(ms) ? MathUtils.clamp(ms, 0, 100) : 0;
    const wanted = goalFor(goal, aspect);
    const wantedBus = goal === OVERVIEW ? 0 : STOP_T[goal];
    const s = sunGoal(goal);
    const k = snap ? 1 : 1 - Math.exp(-dt / 420);
    target.lerp(wanted.target, k);
    distance += (wanted.distance - distance) * k;
    const busStep = snap
      ? 1
      : Math.max(
          0.00005 * dt,
          Math.abs(wantedBus - busT) * (1 - Math.exp(-dt / 500)),
        );
    busT += MathUtils.clamp(wantedBus - busT, -busStep, busStep);
    sunColor.lerp(scratchColor.set(s.color), k);
    sunIntensity += (s.intensity - sunIntensity) * k;
    fogColor.lerp(scratchColor.set(FOG[timeOfDay(goal)]), k);
    snap = false;

    camera.position.copy(target).addScaledVector(VIEW_DIR, distance);
    camera.lookAt(target);
    sun.position.copy(target).add(scratch.copy(sunDir));
    sun.target.position.copy(target);
    sun.color.copy(sunColor);
    sun.intensity = sunIntensity;
    (scene.fog as Fog).color.copy(fogColor);
    placeBus();

    if (live) animate(dt);
    for (const { sign } of signs) sign.quaternion.copy(camera.quaternion);

    const settled =
      target.distanceTo(wanted.target) < 0.02 &&
      Math.abs(distance - wanted.distance) < 0.02 &&
      Math.abs(wantedBus - busT) < 0.0005;
    return !settled;
  };

  // The stop whose sign or set piece is under a point (NDC), or null.
  const raycaster = new Raycaster();
  const pointer = new Vector2();
  const pickables = [...signs.map(({ sign }) => sign), ...pieces];
  const pick = (x: number, y: number) => {
    pointer.set(x, y);
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(pickables, true)[0];
    return hit ? stopOf(hit.object, pieces) : null;
  };

  const dispose = () => {
    for (const thing of disposables) thing.dispose();
    trunks.dispose();
    crowns.dispose();
    dashes.dispose();
  };

  sunGoal(OVERVIEW);
  placeBus();
  tick(0, false);
  return { scene, camera, go, tick, resize, pick, dispose };
}
