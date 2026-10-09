import {
  BoxGeometry,
  type BufferGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DirectionalLight,
  Group,
  HemisphereLight,
  IcosahedronGeometry,
  InstancedMesh,
  MathUtils,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  OctahedronGeometry,
  Quaternion,
  Scene,
  Vector3,
} from "three";
import { audienceFlow, type FlowPlace } from "@/content/products";

// The low-poly campus for the Products audience flow, built from primitives
// (no models or textures). Pure three.js: nothing here needs a renderer, so
// the canvas component owns the WebGL context and the render loop.

export const BEACON_NAME = "beacon";

type FlowChapter = (typeof audienceFlow.chapters)[number];

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

// Scroll progress 0..1 split into equal parts, one per chapter.
export function chapterAt(progress: number): FlowChapter {
  const { chapters } = audienceFlow;
  const index = Math.min(
    chapters.length - 1,
    Math.floor(clamp01(progress) * chapters.length),
  );
  return chapters[index];
}

// DESIGN.md tokens: ice (morning) to amber-pale (afternoon).
const MORNING = new Color("#dce6f5");
const AFTERNOON = new Color("#ffe27a");

// Writes into `target` when given, so a render loop allocates nothing.
export function skyAt(progress: number, target = new Color()): Color {
  return target.copy(MORNING).lerp(AFTERNOON, clamp01(progress));
}

// The camera's field of view, in degrees, across the shorter side of the
// stage: a tall stage widens the vertical view so the campus still fits.
export const CAMERA_FOV = 50;

export function viewFov(aspect: number) {
  if (aspect >= 1) return CAMERA_FOV;
  const half = Math.tan(MathUtils.degToRad(CAMERA_FOV / 2));
  return MathUtils.radToDeg(2 * Math.atan(half / aspect));
}

type Vec3 = readonly [number, number, number];

// Where each place stands on the campus.
const PLACE_POSITIONS: Record<FlowPlace, Vec3> = {
  gate: [0, 0, 5],
  "staff-room": [-4, 0, 0.5],
  classroom: [4, 0, 0.5],
  rooftop: [0, 3.5, -4],
};
// The camera looks at each place from the plaza side, so its door and path
// face the camera, and stands far enough back that the other places stay in
// view: [azimuth from the front, elevation, distance], in degrees and units.
const VIEWS: Record<FlowPlace, Vec3> = {
  gate: [6, 30, 18],
  "staff-room": [45, 38, 22],
  classroom: [-45, 38, 22],
  rooftop: [40, 25, 24],
};
const LOOK_HEIGHT = 1;

export function placeTarget(place: FlowPlace) {
  const lookAt = new Vector3(...PLACE_POSITIONS[place]);
  lookAt.y += LOOK_HEIGHT;
  const [azimuth, elevation, distance] = VIEWS[place];
  const offset = new Vector3().setFromSphericalCoords(
    distance,
    MathUtils.degToRad(90 - elevation),
    MathUtils.degToRad(azimuth),
  );
  return { position: lookAt.clone().add(offset), lookAt };
}

// The plaza in the middle; each path runs from it to its place's door.
const HUB = new Vector3(0, 0, 1.2);
const PATH_ENDS: Record<FlowPlace, Vector3> = {
  gate: new Vector3(0, 0, 5),
  "staff-room": new Vector3(-2.7, 0, 0.5),
  classroom: new Vector3(2.3, 0, 0.5),
  rooftop: new Vector3(0, 0, -2.25),
};
const SPARK_MS = 1600;

const CLOUD_SPEED = 0.0006; // units per ms
const CLOUD_SPAN = 44; // they wrap round out of view

// DESIGN.md tokens only; amber-decor is never used.
// `glow` makes it shine in that colour.
const material = (color: string, glow?: string) =>
  new MeshStandardMaterial({
    color,
    flatShading: true,
    ...(glow ? { emissive: glow } : {}),
    emissiveIntensity: glow ? 0.4 : 0,
  });

// A mesh at `at`, optionally turned about the vertical axis.
function mesh(
  geometry: BufferGeometry,
  mat: MeshStandardMaterial,
  at: Vec3,
  turn = 0,
) {
  const result = new Mesh(geometry, mat);
  result.position.set(...at);
  result.rotation.y = turn;
  return result;
}

const box = (size: Vec3, mat: MeshStandardMaterial, at: Vec3, turn = 0) =>
  mesh(new BoxGeometry(...size), mat, at, turn);

// A building with a pitched roof, its base at the group's origin.
function building(
  [width, height, depth]: Vec3,
  walls: MeshStandardMaterial,
  roof: MeshStandardMaterial,
) {
  const group = new Group();
  group.add(box([width, height, depth], walls, [0, height / 2, 0]));
  const top = new Mesh(
    new ConeGeometry(Math.max(width, depth) * 0.75, 1, 4),
    roof,
  );
  top.position.y = height + 0.5;
  top.rotation.y = Math.PI / 4;
  group.add(top);
  return group;
}

// Positive remainder, so clouds wrap around on both sides.
const wrap = (value: number, span: number) =>
  ((((value + span / 2) % span) + span) % span) - span / 2;

export function buildCampus() {
  const scene = new Scene();
  scene.background = skyAt(0);

  const walls = material("#fdfdfe"); // paper
  const roof = material("#244c85"); // navy-2
  const trim = material("#163663"); // navy
  const soft = material("#3f66a0"); // navy-soft: base, glass, leaves
  const lawn = material("#eef2f9"); // mist
  const path = material("#fdfdfe"); // paper
  const litPath = material("#ffe27a", "#ffc000"); // amber-pale, amber glow
  const glow = material("#ffc000"); // amber
  const cloud = material("#ffffff"); // white
  const windowGlow = material("#ffe27a", "#ffc000"); // staff-room windows
  const screenGlow = material("#ffe27a", "#ffc000"); // phone and tablets

  scene.add(new HemisphereLight("#ffffff", "#dce6f5", 1.5));
  // Warm key light (white with some amber-pale), the only shadow caster.
  const warm = new Color("#ffffff").lerp(new Color("#ffe27a"), 0.35);
  const sun = new DirectionalLight(warm, 1.6);
  sun.position.set(7, 14, 9);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.radius = 4;
  sun.shadow.bias = -0.0005;
  sun.shadow.normalBias = 0.02;
  Object.assign(sun.shadow.camera, {
    left: -12,
    right: 12,
    top: 12,
    bottom: -12,
    near: 1,
    far: 40,
  });
  scene.add(sun);

  // The campus is a tile floating in the sky: a navy base, a mist lawn.
  const groundMesh = box([18, 0.6, 15], soft, [0, -0.3, 0]);
  groundMesh.name = "ground";
  scene.add(groundMesh);
  scene.add(box([17.6, 0.04, 14.6], lawn, [0, 0.02, 0]));

  // Paths from the plaza to each place; focus() lights one of them.
  const paths = new Group();
  paths.name = "paths";
  paths.add(
    mesh(new CylinderGeometry(1.6, 1.6, 0.06, 16), path, [0, 0.03, 1.2]),
  );
  const segments = {} as Record<FlowPlace, Mesh>;
  for (const { place } of audienceFlow.chapters) {
    const end = PATH_ENDS[place];
    const run = end.clone().sub(HUB);
    const middle = HUB.clone().lerp(end, 0.5);
    const segment = box(
      [0.9, 0.06, run.length()],
      path,
      [middle.x, 0.04, middle.z],
      Math.atan2(run.x, run.z),
    );
    segment.name = `path-${place}`;
    segments[place] = segment;
    paths.add(segment);
  }
  const spark = mesh(
    new CylinderGeometry(0.28, 0.28, 0.08, 12),
    glow,
    [0, 0.1, 0],
  );
  spark.name = "spark";
  paths.add(spark);
  scene.add(paths);

  // A low wall either side of the gate along the front of the campus.
  scene.add(box([6.6, 0.5, 0.25], walls, [-4.8, 0.25, 5]));
  scene.add(box([6.6, 0.5, 0.25], walls, [4.8, 0.25, 5]));

  const gate = new Group();
  gate.add(box([0.4, 2.4, 0.4], trim, [-1.2, 1.2, 0]));
  gate.add(box([0.4, 2.4, 0.4], trim, [1.2, 1.2, 0]));
  gate.add(box([2.8, 0.3, 0.4], trim, [0, 2.4, 0]));

  const staffRoom = building([2.6, 1.8, 2.4], walls, roof);
  const classroom = building([3.4, 2, 2.6], walls, roof);

  // The main hall; the rooftop and plant room sit on its roof.
  const hall = new Group();
  hall.add(box([5, 3.5, 3.5], walls, [0, 1.75, 0]));
  hall.add(box([0.9, 1.4, 0.06], trim, [0, 0.7, 1.76]));
  const hallPane = new BoxGeometry(0.5, 0.6, 0.06);
  for (const x of [-1.8, -0.9, 0.9, 1.8]) {
    hall.add(mesh(hallPane, soft, [x, 2.4, 1.76]));
    hall.add(mesh(hallPane, soft, [x, 2.4, -1.76]));
  }
  hall.position.set(0, 0, -4);
  scene.add(hall);
  const rooftop = new Group();
  rooftop.add(box([1.6, 0.9, 1.2], trim, [-1.2, 0.45, 0]));
  rooftop.add(
    mesh(new CylinderGeometry(0.45, 0.45, 1.1, 8), roof, [1.3, 0.55, -0.3]),
  );

  const places: Record<FlowPlace, Group> = {
    gate,
    "staff-room": staffRoom,
    classroom,
    rooftop,
  };

  // One group of details per place; tick() moves the ones that animate.
  const phone = new Group();
  phone.add(box([0.55, 1, 0.08], trim, [0, 0, 0]));
  phone.add(box([0.45, 0.8, 0.02], screenGlow, [0, 0, 0.05]));

  const staffDetails = new Group();
  const pane = new BoxGeometry(0.5, 0.5, 0.06);
  for (const x of [-0.6, 0.6]) {
    staffDetails.add(mesh(pane, windowGlow, [x, 1.05, 1.21]));
    staffDetails.add(mesh(pane, windowGlow, [-1.31, 1.05, x], Math.PI / 2));
  }

  const classDetails = new Group();
  const deskTop = new BoxGeometry(0.6, 0.06, 0.4);
  const deskLeg = new BoxGeometry(0.08, 0.4, 0.3);
  const tablet = new BoxGeometry(0.26, 0.03, 0.18);
  for (const x of [-1.1, 0, 1.1]) {
    for (const z of [2.2, 3.1]) {
      classDetails.add(mesh(deskTop, walls, [x, 0.42, z]));
      classDetails.add(mesh(deskLeg, roof, [x, 0.2, z]));
      classDetails.add(mesh(tablet, screenGlow, [x, 0.47, z]));
    }
  }
  classDetails.add(box([1.6, 0.9, 0.08], trim, [0, 1, 1.45]));
  for (const x of [-1, 0, 1]) {
    classDetails.add(box([0.6, 0.6, 0.06], soft, [x, 1.2, 1.31]));
  }

  const vents: Mesh[] = [];
  const roofDetails = new Group();
  const ventBase = new CylinderGeometry(0.14, 0.14, 0.4, 6);
  const ventCap = new CylinderGeometry(0.3, 0.22, 0.3, 6);
  for (const [x, z] of [
    [0.2, -1.1],
    [1.8, 1.1],
  ]) {
    roofDetails.add(mesh(ventBase, trim, [x, 0.2, z]));
    const cap = mesh(ventCap, walls, [x, 0.55, z]);
    vents.push(cap);
    roofDetails.add(cap);
  }

  const details: Record<FlowPlace, Group> = {
    gate: phone,
    "staff-room": staffDetails,
    classroom: classDetails,
    rooftop: roofDetails,
  };
  for (const { place } of audienceFlow.chapters) {
    places[place].name = place;
    places[place].position.set(...PLACE_POSITIONS[place]);
    details[place].name = "details";
    places[place].add(details[place]);
    scene.add(places[place]);
  }

  // Trees: one instanced mesh for the trunks and one for the crowns.
  const treeSpots: Vec3[] = [
    [-6.5, -6, 1.1],
    [-4.6, -6.4, 0.9],
    [4.6, -6.3, 1],
    [6.6, -5.8, 1.2],
    [-7.2, -3, 1],
    [-7, 0.2, 0.9],
    [-6.8, 3.2, 1.1],
    [7.2, -2.6, 0.9],
    [7, 0.6, 1.1],
    [6.8, 3.4, 1],
    [-2.2, 4.1, 0.8],
    [1.9, 4.1, 0.85],
  ];
  const trees = new Group();
  trees.name = "trees";
  const trunks = new InstancedMesh(
    new CylinderGeometry(0.12, 0.16, 0.8, 5),
    trim,
    treeSpots.length,
  );
  const crowns = new InstancedMesh(
    new IcosahedronGeometry(0.8, 0),
    soft,
    treeSpots.length,
  );
  const placing = new Matrix4();
  const upright = new Quaternion();
  treeSpots.forEach(([x, z, size], i) => {
    const scale = new Vector3(size, size, size);
    trunks.setMatrixAt(
      i,
      placing.compose(new Vector3(x, 0.4 * size, z), upright, scale),
    );
    crowns.setMatrixAt(
      i,
      placing.compose(new Vector3(x, 1.3 * size, z), upright, scale),
    );
  });
  trees.add(trunks, crowns);
  scene.add(trees);

  // Benches round the plaza, each facing it.
  const benches = new Group();
  benches.name = "benches";
  const seat = new BoxGeometry(1, 0.08, 0.36);
  const back = new BoxGeometry(1, 0.34, 0.06);
  const leg = new BoxGeometry(0.08, 0.4, 0.32);
  for (const [x, z] of [
    [-2, 2.8],
    [2, 2.8],
    [-2, -0.4],
    [2, -0.4],
  ]) {
    const bench = new Group();
    bench.add(mesh(seat, roof, [0, 0.42, 0]));
    bench.add(mesh(back, roof, [0, 0.62, -0.16]));
    bench.add(mesh(leg, trim, [-0.4, 0.2, 0]));
    bench.add(mesh(leg, trim, [0.4, 0.2, 0]));
    bench.position.set(x, 0, z);
    bench.rotation.y = Math.atan2(HUB.x - x, HUB.z - z);
    benches.add(bench);
  }
  scene.add(benches);

  // Clouds: three puffs each, drifting across while the scene runs.
  const clouds = new Group();
  clouds.name = "clouds";
  const puff = new IcosahedronGeometry(0.7, 0);
  const cloudSpots: Vec3[] = [
    [-9, 10.5, -2],
    [-1, 11, 3],
    [7, 10.5, -5],
    [13, 11.5, 2],
  ];
  for (const at of cloudSpots) {
    const group = new Group();
    group.add(mesh(puff, cloud, [0, 0, 0]));
    group.add(mesh(puff, cloud, [0.8, -0.15, 0.15]));
    group.add(mesh(puff, cloud, [-0.7, -0.2, -0.1]));
    group.children[1].scale.setScalar(0.75);
    group.children[2].scale.setScalar(0.65);
    group.position.set(...at);
    clouds.add(group);
  }
  scene.add(clouds);

  const beacon = new Mesh(new OctahedronGeometry(0.4, 0), glow);
  beacon.name = BEACON_NAME;
  beacon.position.copy(placeTarget("gate").lookAt).setY(3.4);
  scene.add(beacon);

  scene.traverse((object) => {
    if (!(object as Mesh).isMesh) return;
    object.castShadow = true;
    object.receiveShadow = true;
  });
  // Clouds and small details skip the shadow pass: cheaper on phones.
  for (const part of [groundMesh, clouds, ...Object.values(details)]) {
    part.traverse((object) => {
      object.castShadow = false;
    });
  }

  let focused: FlowPlace = "gate";
  segments[focused].material = litPath;
  let elapsed = 0;
  let sparkTime: number | undefined; // undefined: resting at the place

  // Sets every animated part for the time the scene has run.
  const pose = () => {
    phone.position.set(2.3, 2.3 + Math.sin(elapsed / 500) * 0.15, 0.6);
    phone.rotation.y = -0.5 + Math.sin(elapsed / 1300) * 0.3;
    windowGlow.emissiveIntensity = 0.5 + Math.sin(elapsed / 700) * 0.3;
    screenGlow.emissiveIntensity = 0.5 + Math.sin(elapsed / 450) * 0.3;
    for (const cap of vents) cap.rotation.y = elapsed / 400;
    clouds.children.forEach((group, i) => {
      group.position.x = wrap(
        cloudSpots[i][0] + elapsed * CLOUD_SPEED,
        CLOUD_SPAN,
      );
    });
    const along = sparkTime === undefined ? 1 : sparkTime / SPARK_MS;
    spark.position.lerpVectors(HUB, PATH_ENDS[focused], along).setY(0.1);
  };

  // Lights the path toward a new place and rests the spark at its end; the
  // same place again leaves the spark where it is.
  const focus = (place: FlowPlace) => {
    if (place === focused) return;
    segments[focused].material = path;
    focused = place;
    segments[place].material = litPath;
    sparkTime = undefined;
    pose();
  };

  // Moves the clouds, the details and the spark on by `ms` of running time.
  const tick = (ms: number) => {
    if (ms <= 0) return;
    elapsed += ms;
    sparkTime = ((sparkTime ?? 0) + ms) % SPARK_MS;
    pose();
  };

  pose();
  return { scene, beacon, focus, tick };
}
