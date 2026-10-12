import {
  BoxGeometry,
  type BufferGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DirectionalLight,
  ExtrudeGeometry,
  Group,
  HemisphereLight,
  IcosahedronGeometry,
  InstancedMesh,
  type Material,
  MathUtils,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  OctahedronGeometry,
  type OrthographicCamera,
  Quaternion,
  Scene,
  Shape,
  SphereGeometry,
  Vector3,
} from "three";
import { journeyMap } from "@/content/products";

// The isometric journey map for the Products hero, built from primitives (no
// models or textures): the XionTech hub joined by dashed roads to one island
// per app. Pure three.js: the canvas component owns the renderer and the
// render loop, and lays real buttons over the islands at `islandAnchor`.

export type PlaceId = (typeof journeyMap.places)[number]["id"];

export const HUB_NAME = "hub";

type Vec3 = readonly [number, number, number];

// The fixed camera: about 35° down and 45° around, looking at the hub.
export const ISO_VIEW = { azimuth: 45, elevation: 35, distance: 40 } as const;

// Islands sit on the diagonals of the screen, so with the iso camera the tab
// order (parent, staff, tutor, IoT) reads top-left, top-right, bottom-left,
// bottom-right.
const REACH = 9.5;
const SPOTS: Record<PlaceId, Vec3> = {
  "parent-hub": [-REACH, 0, 0],
  "staff-hub": [0, 0, -REACH],
  "ai-tutor": [0, 0, REACH],
  iot: [REACH, 0, 0],
};

const ISLAND = 4; // side of an app island's top
const HUB = 4.6; // side of the hub's top
const SLAB = 1.1; // depth of an island below its top
const TOP = 0.2; // the light top layer
const BEVEL = 0.08;
const ANCHOR_HEIGHT = 1; // the button's point, above the island's top

const LIFT = 0.6;
const LIFT_MS = 200;
const BOB = 0.1;
const BOB_MS = 2600;

const DASH = 0.4;
const GAP = 0.3;
const DOTS_PER_ROAD = 2;
const DOT_MS = 3200; // one run along a road

// Height of the tallest prop and depth of the base, for framing.
const PROPS_HIGH = 3.4;
const PADDING = 1.12;

export function islandAnchor(id: PlaceId) {
  const [x, , z] = SPOTS[id];
  return new Vector3(x, ANCHOR_HEIGHT, z);
}

// Corners of the box that holds every island at its highest and lowest.
const FRAME_POINTS = [[0, 0, 0] as Vec3, ...Object.values(SPOTS)].flatMap(
  ([x, , z]) => {
    const half = HUB / 2 + 0.2;
    return [-half, half].flatMap((dx) =>
      [-half, half].flatMap((dz) =>
        [-SLAB - 0.3 - BOB, PROPS_HIGH + LIFT + BOB].map(
          (y) => new Vector3(x + dx, y, z + dz),
        ),
      ),
    );
  },
);

// Places the camera on ISO_VIEW and sizes its frustum so the whole map fits a
// stage of `aspect` (width / height), wide or tall.
export function frameCamera(camera: OrthographicCamera, aspect: number) {
  const { azimuth, elevation, distance } = ISO_VIEW;
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

// DESIGN.md tokens only; amber-decor is never used.
const material = (color: string, glow?: string) =>
  new MeshStandardMaterial({
    color,
    flatShading: true,
    ...(glow ? { emissive: glow, emissiveIntensity: 0.45 } : {}),
  });

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

// A rounded square slab `depth` deep whose top face is at y = 0.
function slab(side: number, depth: number) {
  const half = side / 2;
  const r = 0.5;
  const shape = new Shape()
    .moveTo(-half + r, -half)
    .lineTo(half - r, -half)
    .quadraticCurveTo(half, -half, half, -half + r)
    .lineTo(half, half - r)
    .quadraticCurveTo(half, half, half - r, half)
    .lineTo(-half + r, half)
    .quadraticCurveTo(-half, half, -half, half - r)
    .lineTo(-half, -half + r)
    .quadraticCurveTo(-half, -half, -half + r, -half);
  const geometry = new ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSize: BEVEL,
    bevelThickness: BEVEL,
    bevelSegments: 2,
    curveSegments: 4,
  });
  // Turned so the extrusion runs up; the top bevel ends at depth + bevel.
  geometry.rotateX(-Math.PI / 2);
  geometry.translate(0, -(depth + BEVEL), 0);
  return geometry;
}

// A building with a pitched roof, its base at the group's origin.
function building(
  [width, height, depth]: Vec3,
  walls: MeshStandardMaterial,
  roof: MeshStandardMaterial,
) {
  const group = new Group();
  group.add(box([width, height, depth], walls, [0, height / 2, 0]));
  const top = new Mesh(
    new ConeGeometry(Math.max(width, depth) * 0.75, 0.9, 4),
    roof,
  );
  top.position.y = height + 0.45;
  top.rotation.y = Math.PI / 4;
  group.add(top);
  return group;
}

export function buildJourney() {
  const scene = new Scene();
  scene.background = new Color("#eef2f9"); // mist

  const navy = material("#163663");
  const navy2 = material("#244c85");
  const soft = material("#3f66a0"); // navy-soft
  const ice = material("#dce6f5");
  const paper = material("#fdfdfe");
  const amber = material("#ffc000");
  const glow = material("#ffe27a", "#ffc000"); // amber-pale, amber glow

  scene.add(new HemisphereLight("#ffffff", "#dce6f5", 1.6));
  const sun = new DirectionalLight("#ffffff", 1.5);
  sun.position.set(-6, 16, 10);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.bias = -0.0005;
  sun.shadow.normalBias = 0.02;
  Object.assign(sun.shadow.camera, {
    left: -16,
    right: 16,
    top: 16,
    bottom: -16,
    near: 1,
    far: 50,
  });
  scene.add(sun);

  // Every island: a navy-2 base under a light top.
  const islandBase = slab(ISLAND, SLAB - TOP);
  const islandTop = slab(ISLAND, TOP);
  const platform = (
    base: BufferGeometry,
    top: BufferGeometry,
    face: MeshStandardMaterial,
  ) => {
    const group = new Group();
    const under = new Mesh(base, navy2);
    under.position.y = -TOP;
    group.add(under, new Mesh(top, face));
    return group;
  };

  // The hub: a raised X of two crossed bars.
  const hub = platform(slab(HUB, SLAB - TOP), slab(HUB, TOP), paper);
  hub.name = HUB_NAME;
  const hubProps = new Group();
  hubProps.name = "props";
  hubProps.add(box([3.2, 0.45, 0.6], navy, [0, 0.35, 0], Math.PI / 4));
  hubProps.add(box([3.2, 0.45, 0.6], amber, [0, 0.4, 0], -Math.PI / 4));
  hubProps.add(
    mesh(new CylinderGeometry(0.5, 0.6, 0.2, 8), navy2, [0, 0.1, 0]),
  );
  hub.add(hubProps);
  scene.add(hub);

  // Parent Hub: a house and a phone.
  const parentProps = new Group();
  const house = building([1.5, 1.1, 1.3], paper, navy2);
  house.position.set(-0.5, 0, -0.4);
  house.add(box([0.35, 0.6, 0.05], navy, [0, 0.3, 0.66]));
  const phone = new Group();
  phone.add(box([0.55, 1, 0.1], navy, [0, 0, 0]));
  phone.add(box([0.44, 0.8, 0.02], glow, [0, 0, 0.06]));
  phone.position.set(0.9, 0.65, 0.7);
  phone.rotation.set(-0.2, -0.5, 0);
  parentProps.add(house, phone);

  // Staff Hub: a school building with a flag.
  const staffProps = new Group();
  const school = building([2.2, 1.3, 1.4], paper, navy);
  school.position.set(-0.2, 0, -0.3);
  const pane = new BoxGeometry(0.35, 0.35, 0.04);
  for (const x of [-0.65, 0, 0.65]) {
    school.add(mesh(pane, soft, [x, 0.85, 0.71]));
  }
  staffProps.add(school);
  staffProps.add(
    mesh(new CylinderGeometry(0.04, 0.04, 2.6, 6), navy, [1.3, 1.3, 0.9]),
  );
  staffProps.add(box([0.7, 0.42, 0.04], amber, [1.65, 2.35, 0.9]));

  // AI Tutor: a desk with a book and a laptop under a spark.
  const tutorProps = new Group();
  tutorProps.add(box([2, 0.12, 1], paper, [0, 0.75, 0]));
  const leg = new BoxGeometry(0.1, 0.7, 0.9);
  tutorProps.add(mesh(leg, navy2, [-0.9, 0.35, 0]));
  tutorProps.add(mesh(leg, navy2, [0.9, 0.35, 0]));
  tutorProps.add(box([0.9, 0.05, 0.6], navy, [0.3, 0.84, 0]));
  const screen = box([0.9, 0.55, 0.05], navy, [0.3, 1.12, -0.28]);
  screen.rotation.x = -0.25;
  screen.add(box([0.78, 0.44, 0.02], glow, [0, 0, 0.035]));
  tutorProps.add(screen);
  tutorProps.add(box([0.5, 0.12, 0.38], amber, [-0.55, 0.87, 0.1], 0.3));
  const spark = mesh(new OctahedronGeometry(0.3, 0), glow, [0.3, 2.2, -0.2]);
  tutorProps.add(spark);

  // IoT: a building with an antenna, sensors and a lamp.
  const iotProps = new Group();
  iotProps.add(box([1.4, 1.8, 1.2], paper, [-0.4, 0.9, -0.3]));
  iotProps.add(
    mesh(new CylinderGeometry(0.05, 0.05, 1.3, 6), navy, [-0.4, 2.45, -0.3]),
  );
  iotProps.add(mesh(new SphereGeometry(0.14, 8, 6), amber, [-0.4, 3.15, -0.3]));
  const sensor = new CylinderGeometry(0.12, 0.12, 0.08, 8);
  for (const y of [0.6, 1.2]) {
    iotProps.add(mesh(sensor, soft, [0.31, y, -0.3]));
  }
  iotProps.add(
    mesh(new CylinderGeometry(0.05, 0.06, 1.4, 6), navy, [1.1, 0.7, 0.8]),
  );
  iotProps.add(mesh(new SphereGeometry(0.22, 8, 6), glow, [1.1, 1.5, 0.8]));

  const props: Record<PlaceId, Group> = {
    "parent-hub": parentProps,
    "staff-hub": staffProps,
    "ai-tutor": tutorProps,
    iot: iotProps,
  };

  const islands = {} as Record<PlaceId, Group>;
  for (const { id } of journeyMap.places) {
    const island = platform(islandBase, islandTop, ice);
    island.name = id;
    island.position.set(...SPOTS[id]);
    props[id].name = "props";
    island.add(props[id]);
    islands[id] = island;
    scene.add(island);
  }

  // A few low-poly trees on the islands' free corners.
  const treeSpots: Vec3[] = [
    [-REACH - 1.3, 0, 1.3],
    [-1.4, 0, -REACH + 1.3],
    [-1.4, 0, REACH + 1.3],
    [REACH + 1.3, 0, -1.3],
  ];
  const crowns = new InstancedMesh(
    new IcosahedronGeometry(0.5, 0),
    soft,
    treeSpots.length,
  );
  crowns.name = "trees";
  const placing = new Matrix4();
  const upright = new Quaternion();
  const tall = new Vector3(1, 1.3, 1);
  const same = new Vector3(1, 1, 1);
  treeSpots.forEach(([x, , z], i) => {
    crowns.setMatrixAt(
      i,
      placing.compose(new Vector3(x, 0.65, z), upright, tall),
    );
  });
  scene.add(crowns);

  // Dashed roads from the hub's edge to each island's edge; dots run along
  // them outwards.
  type Road = { start: Vector3; end: Vector3 };
  const roads: Road[] = [];
  const dashGeometry = new BoxGeometry(0.22, 0.06, DASH);
  for (const { id } of journeyMap.places) {
    const target = new Vector3(...SPOTS[id]);
    const along = target.clone().normalize();
    const start = along
      .clone()
      .multiplyScalar(HUB / 2 + 0.35)
      .setY(0.03);
    const end = target
      .clone()
      .sub(along.clone().multiplyScalar(ISLAND / 2 + 0.35))
      .setY(0.03);
    const length = start.distanceTo(end);
    const count = Math.floor((length + GAP) / (DASH + GAP));
    const road = new InstancedMesh(dashGeometry, soft, count);
    road.name = `road-${id}`;
    const turn = new Quaternion().setFromAxisAngle(
      new Vector3(0, 1, 0),
      Math.atan2(along.x, along.z),
    );
    const spare = length - (count * DASH + (count - 1) * GAP);
    for (let i = 0; i < count; i++) {
      const at = start
        .clone()
        .lerp(end, (spare / 2 + DASH / 2 + i * (DASH + GAP)) / length);
      road.setMatrixAt(i, placing.compose(at, turn, same));
    }
    roads.push({ start, end });
    scene.add(road);
  }

  const dots = new InstancedMesh(
    new SphereGeometry(0.16, 10, 8),
    amber,
    roads.length * DOTS_PER_ROAD,
  );
  dots.name = "dots";
  scene.add(dots);

  scene.traverse((object) => {
    if (!(object as Mesh).isMesh) return;
    object.castShadow = true;
    object.receiveShadow = true;
  });
  // Roads and dots are flat on the ground: they skip the shadow pass.
  dots.castShadow = false;
  scene.traverse((object) => {
    if (object.name.startsWith("road-")) object.castShadow = false;
  });

  let elapsed = 0;
  let lifted: PlaceId | null = null;
  // How far each island is lifted, 0..1, eased toward `lifted`.
  const raised = {} as Record<PlaceId, number>;
  for (const { id } of journeyMap.places) raised[id] = 0;
  const dotAt = new Vector3();

  // Sets every animated part for the time the scene has run.
  const pose = () => {
    journeyMap.places.forEach(({ id }, i) => {
      const bob = Math.sin((elapsed / BOB_MS + i / 4) * Math.PI * 2) * BOB;
      const eased = 1 - (1 - raised[id]) ** 3;
      islands[id].position.y = bob + eased * LIFT;
    });
    hub.position.y = Math.sin((elapsed / BOB_MS) * Math.PI * 2) * BOB * 0.5;
    spark.rotation.y = elapsed / 600;
    roads.forEach(({ start, end }, r) => {
      for (let d = 0; d < DOTS_PER_ROAD; d++) {
        const along = (elapsed / DOT_MS + d / DOTS_PER_ROAD) % 1;
        dotAt.lerpVectors(start, end, along).setY(0.18);
        dots.setMatrixAt(
          r * DOTS_PER_ROAD + d,
          placing.compose(dotAt, upright, same),
        );
      }
    });
    dots.instanceMatrix.needsUpdate = true;
  };

  // Moves the dots, the bob and any lift on by `ms` of running time.
  const tick = (ms: number) => {
    if (ms <= 0) return;
    elapsed += ms;
    const step = ms / LIFT_MS;
    for (const { id } of journeyMap.places) {
      const goal = id === lifted ? 1 : 0;
      raised[id] =
        goal > raised[id]
          ? Math.min(goal, raised[id] + step)
          : Math.max(goal, raised[id] - step);
    }
    pose();
  };

  // Lifts one island (null: none); `instant` skips the ease, for reduced
  // motion and pause.
  const lift = (id: PlaceId | null, instant: boolean) => {
    lifted = id;
    if (!instant) return;
    for (const { id: other } of journeyMap.places) {
      raised[other] = other === id ? 1 : 0;
    }
    pose();
  };

  // Frees every geometry and material the scene holds, each once.
  const dispose = () => {
    const owned = new Set<BufferGeometry | Material>();
    scene.traverse((object) => {
      const { geometry, material: mat } = object as Mesh;
      if (geometry) owned.add(geometry);
      for (const one of [mat].flat()) if (one) owned.add(one);
    });
    for (const one of owned) one.dispose();
  };

  pose();
  return { scene, hub, islands, tick, lift, dispose };
}
