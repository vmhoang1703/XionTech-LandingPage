import {
  AmbientLight,
  BoxGeometry,
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DirectionalLight,
  Float32BufferAttribute,
  Group,
  HemisphereLight,
  type Material,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  type OrthographicCamera,
  Scene,
  Vector3,
} from "three";
import { dayRoad } from "@/content/products";

// The school-day roadmap as a small isometric world: a winding road from a
// Start arch to a Finish arch, one station per stop, and a school bus that
// drives the road. Pure three.js: the canvas renders it and places the HTML
// cards on `stopAnchor` points.

const VIEW = { azimuth: 45, elevation: 32, distance: 60 } as const;
const PADDING = 1.12;
const ROAD_WIDTH = 1.5;
const DRIVE_MS = 16000; // one trip, start to finish
const PULSE_MS = 1400;
const STOP_COUNT = dayRoad.stops.length;

const COLORS = {
  ground: "#eef2f9", // mist
  grass: "#dce6f5", // ice
  road: "#163663", // navy
  line: "#ffe27a", // amber-pale
  paper: "#fdfdfe",
  navy: "#163663",
  navy2: "#244c85",
  amber: "#ffc000",
  white: "#ffffff",
};

// Stops along the screen's left-to-right axis (u) with a zig-zag in depth
// (v), turned into world x/z for the 45° camera.
function fromScreen(u: number, v: number) {
  const r = Math.SQRT1_2;
  return new Vector3((u + v) * r, 0, (v - u) * r);
}

const STOP_POINTS = dayRoad.stops.map((_, i) => {
  const u = -15 + (30 * i) / (STOP_COUNT - 1);
  const v = i % 2 === 0 ? 3.2 : -3.2;
  return fromScreen(u, v);
});
const START = fromScreen(-20, 0);
const FINISH = fromScreen(20, 0);

const ROUTE = new CatmullRomCurve3(
  [START, ...STOP_POINTS, FINISH],
  false,
  "centripetal",
);

// Where each stop sits along the route (0..1), found once.
const STOP_AT = STOP_POINTS.map((point) => {
  let best = 0;
  let bestDistance = Infinity;
  for (let i = 0; i <= 400; i += 1) {
    const t = i / 400;
    const d = ROUTE.getPointAt(t).distanceToSquared(point);
    if (d < bestDistance) {
      bestDistance = d;
      best = t;
    }
  }
  return best;
});

export const STOP_ANCHOR_HEIGHT = 3.2;

export function stopAnchor(index: number) {
  return STOP_POINTS[index].clone().setY(STOP_ANCHOR_HEIGHT);
}

const FRAME_POINTS = [
  START,
  FINISH,
  ...STOP_POINTS.map((p) => p.clone().setY(STOP_ANCHOR_HEIGHT + 2)),
  fromScreen(0, 8),
  fromScreen(0, -8),
];

export function frameCamera(camera: OrthographicCamera, aspect: number) {
  const { azimuth, elevation, distance } = VIEW;
  camera.position.setFromSphericalCoords(
    distance,
    MathUtils.degToRad(90 - elevation),
    MathUtils.degToRad(azimuth),
  );
  camera.up.set(0, 1, 0);
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld(true);
  let halfWidth = 0;
  let halfHeight = 0;
  const seen = new Vector3();
  for (const point of FRAME_POINTS) {
    seen.copy(point).applyMatrix4(camera.matrixWorldInverse);
    halfWidth = Math.max(halfWidth, Math.abs(seen.x));
    halfHeight = Math.max(halfHeight, Math.abs(seen.y));
  }
  halfWidth *= PADDING;
  halfHeight *= PADDING;
  if (aspect >= halfWidth / halfHeight) halfWidth = halfHeight * aspect;
  else halfHeight = halfWidth / aspect;
  Object.assign(camera, {
    left: -halfWidth,
    right: halfWidth,
    top: halfHeight,
    bottom: -halfHeight,
    near: 1,
    far: distance * 2,
  });
  camera.updateProjectionMatrix();
}

// A flat ribbon along the route, a little above the ground.
function ribbon(width: number, y: number, samples = 240) {
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
      index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setIndex(index);
  geometry.computeVertexNormals();
  return geometry;
}

export function buildRoad() {
  const scene = new Scene();
  const mat = (color: string, emissive = 0) =>
    new MeshStandardMaterial({
      color: new Color(color),
      roughness: 0.85,
      emissive: emissive ? new Color(color) : new Color(0),
      emissiveIntensity: emissive,
    });
  const materials = {
    ground: mat(COLORS.ground),
    grass: mat(COLORS.grass),
    road: mat(COLORS.road),
    line: mat(COLORS.line, 0.3),
    paper: mat(COLORS.paper),
    navy: mat(COLORS.navy),
    navy2: mat(COLORS.navy2),
    amber: mat(COLORS.amber, 0.25),
    white: mat(COLORS.white),
  };
  const box = (
    size: [number, number, number],
    material: Material,
    at: [number, number, number],
  ) => {
    const mesh = new Mesh(new BoxGeometry(...size), material);
    mesh.position.set(...at);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  };

  // Lights: soft sky, warm key with shadows.
  scene.add(new HemisphereLight(0xffffff, 0xc5d0e3, 1.4));
  scene.add(new AmbientLight(0xffffff, 0.35));
  const sun = new DirectionalLight(0xfff4d6, 2.2);
  sun.position.set(14, 24, 10);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, {
    left: -30,
    right: 30,
    top: 30,
    bottom: -30,
  });
  scene.add(sun);

  // Ground: a thick slab with a grass top.
  const slab = box([38, 1.2, 26], materials.navy, [0, -0.65, 0]);
  slab.rotation.y = Math.PI / 4;
  scene.add(slab);
  const lawn = box([37.4, 0.1, 25.4], materials.grass, [0, 0, 0]);
  lawn.rotation.y = Math.PI / 4;
  lawn.castShadow = false;
  scene.add(lawn);

  // The road and its dashed centre line.
  const road = new Mesh(ribbon(ROAD_WIDTH, 0.08), materials.road);
  road.receiveShadow = true;
  scene.add(road);
  const dashes = new Group();
  for (let i = 0; i < 70; i += 1) {
    const t = (i + 0.5) / 70;
    const point = ROUTE.getPointAt(t);
    const dash = box([0.12, 0.02, 0.45], materials.line, [
      point.x,
      0.11,
      point.z,
    ]);
    dash.castShadow = false;
    const tangent = ROUTE.getTangentAt(t);
    dash.rotation.y = Math.atan2(tangent.x, tangent.z);
    dashes.add(dash);
  }
  scene.add(dashes);

  // Start and finish arches.
  const arch = (at: Vector3, banner: Material) => {
    const group = new Group();
    const tangent = ROUTE.getTangentAt(at === START ? 0 : 1);
    group.position.copy(at);
    group.rotation.y = Math.atan2(tangent.x, tangent.z) + Math.PI / 2;
    group.add(box([0.3, 2.6, 0.3], materials.navy, [-1.3, 1.3, 0]));
    group.add(box([0.3, 2.6, 0.3], materials.navy, [1.3, 1.3, 0]));
    group.add(box([3, 0.7, 0.25], banner, [0, 2.4, 0]));
    return group;
  };
  scene.add(arch(START, materials.amber));
  scene.add(arch(FINISH, materials.navy2));

  // Stations: a round pad beside the road with a pole and a flag.
  const stations: Group[] = [];
  const flags: Mesh[] = [];
  STOP_POINTS.forEach((point, i) => {
    const station = new Group();
    station.name = `stop-${dayRoad.stops[i].id}`;
    station.position.copy(point);
    const pad = new Mesh(
      new CylinderGeometry(1.25, 1.35, 0.3, 24),
      materials.paper,
    );
    pad.position.y = 0.15;
    pad.castShadow = true;
    pad.receiveShadow = true;
    station.add(pad);
    station.add(box([0.12, 2.2, 0.12], materials.navy, [0, 1.4, 0]));
    const flag = box([0.9, 0.5, 0.06], materials.amber, [0.5, 2.25, 0]);
    flags.push(flag);
    station.add(flag);
    stations.push(station);
    scene.add(station);
  });

  // Trees and small buildings to make it a campus.
  const crownGeometry = new ConeGeometry(0.7, 1.6, 7);
  const trunkGeometry = new CylinderGeometry(0.12, 0.14, 0.6, 6);
  const tree = (u: number, v: number) => {
    const at = fromScreen(u, v);
    const group = new Group();
    group.position.copy(at);
    const trunk = new Mesh(trunkGeometry, materials.navy);
    trunk.position.y = 0.3;
    const crown = new Mesh(crownGeometry, materials.navy2);
    crown.position.y = 1.35;
    crown.castShadow = true;
    group.add(trunk, crown);
    scene.add(group);
  };
  for (const [u, v] of [
    [-17, 6.5],
    [-12, -7],
    [-6, 7.5],
    [-1, -7.5],
    [5, 7],
    [10, -7.5],
    [16, 6.5],
    [18, -6],
    [-18, -5],
    [1, 7.5],
  ]) {
    tree(u, v);
  }
  const school = new Group();
  school.position.copy(fromScreen(0, 9));
  school.add(box([5, 2.4, 2.6], materials.paper, [0, 1.2, 0]));
  school.add(box([5.4, 0.3, 3], materials.navy2, [0, 2.55, 0]));
  school.add(box([0.9, 1.3, 0.1], materials.navy, [0, 0.65, 1.31]));
  school.rotation.y = Math.PI / 4;
  scene.add(school);

  // The school bus.
  const bus = new Group();
  bus.add(box([1.1, 0.9, 2.2], materials.amber, [0, 0.75, 0]));
  bus.add(box([1.14, 0.3, 1.6], materials.navy, [0, 0.95, -0.1]));
  const wheelGeometry = new CylinderGeometry(0.22, 0.22, 0.15, 10);
  for (const z of [-0.7, 0.7]) {
    for (const x of [-0.55, 0.55]) {
      const wheel = new Mesh(wheelGeometry, materials.navy);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(x, 0.25, z);
      bus.add(wheel);
    }
  }
  scene.add(bus);

  let elapsed = 0;
  let active = -1;
  const place = () => {
    // Always in [0, 1): elapsed only grows, but stay safe for any input.
    const t = (((elapsed % DRIVE_MS) + DRIVE_MS) % DRIVE_MS) / DRIVE_MS;
    const point = ROUTE.getPointAt(t);
    const tangent = ROUTE.getTangentAt(t);
    bus.position.set(point.x, 0.12, point.z);
    bus.rotation.y = Math.atan2(tangent.x, tangent.z);
    // The station the bus has most recently passed is active.
    active = -1;
    for (let i = 0; i < STOP_AT.length; i += 1)
      if (t >= STOP_AT[i] - 0.01) active = i;
    const pulse = 1 + Math.sin((elapsed / PULSE_MS) * Math.PI * 2) * 0.08;
    for (let i = 0; i < flags.length; i += 1) {
      const on = i === active;
      flags[i].scale.setScalar(on ? pulse * 1.25 : 1);
      stations[i].position.y = on ? 0.15 : 0;
    }
  };

  // Advance the trip; returns the active stop index (or -1).
  const tick = (ms: number) => {
    // The first frame's timestamp can come before the loop's start time.
    if (Number.isFinite(ms) && ms > 0) elapsed += Math.min(ms, 100);
    place();
    return active;
  };

  // Park the bus at a stop (for a still frame or a chosen card).
  const showStop = (index: number) => {
    elapsed = STOP_AT[index] * DRIVE_MS;
    place();
  };

  const dispose = () => {
    const owned = new Set<BufferGeometry | Material>();
    scene.traverse((object) => {
      const { geometry, material } = object as Mesh;
      if (geometry) owned.add(geometry);
      for (const one of [material].flat()) if (one) owned.add(one);
    });
    sun.dispose();
    for (const one of owned) one.dispose();
  };

  place();
  return { scene, tick, showStop, dispose };
}
