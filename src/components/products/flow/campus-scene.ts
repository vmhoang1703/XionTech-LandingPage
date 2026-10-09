import {
  BoxGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DirectionalLight,
  Group,
  HemisphereLight,
  Mesh,
  MeshStandardMaterial,
  OctahedronGeometry,
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

export function skyAt(progress: number): Color {
  return MORNING.clone().lerp(AFTERNOON, clamp01(progress));
}

// Where each place stands on the campus; the camera looks at it from
// CAMERA_OFFSET away.
const PLACE_POSITIONS: Record<FlowPlace, readonly [number, number, number]> = {
  gate: [0, 0, 7],
  "staff-room": [-5, 0, 0],
  classroom: [5, 0, 0],
  rooftop: [0, 4, -5],
};
const CAMERA_OFFSET = new Vector3(5, 4, 7);
const LOOK_HEIGHT = 1;

export function placeTarget(place: FlowPlace) {
  const lookAt = new Vector3(...PLACE_POSITIONS[place]);
  lookAt.y += LOOK_HEIGHT;
  return { position: lookAt.clone().add(CAMERA_OFFSET), lookAt };
}

const material = (color: string) =>
  new MeshStandardMaterial({ color, flatShading: true });

const box = (
  size: [number, number, number],
  mat: MeshStandardMaterial,
  at: [number, number, number],
) => {
  const mesh = new Mesh(new BoxGeometry(...size), mat);
  mesh.position.set(...at);
  return mesh;
};

// A building with a pitched roof, its base at the group's origin.
function building(
  width: number,
  height: number,
  depth: number,
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

export function buildCampus() {
  const scene = new Scene();
  scene.background = skyAt(0);

  const walls = material("#fdfdfe"); // paper
  const roof = material("#244c85"); // navy-2
  const trim = material("#163663"); // navy
  const ground = material("#eef2f9"); // mist
  const path = material("#dce6f5"); // ice
  const glow = material("#ffc000"); // amber

  scene.add(new HemisphereLight("#ffffff", "#c5d0e3", 1.6));
  const sun = new DirectionalLight("#ffffff", 1.4);
  sun.position.set(6, 12, 8);
  scene.add(sun);

  const groundMesh = box([24, 0.2, 22], ground, [0, -0.1, 0]);
  groundMesh.name = "ground";
  scene.add(groundMesh);

  // Paths from the gate to the hall, and across to both wings.
  const paths = new Group();
  paths.name = "paths";
  paths.add(box([1.4, 0.04, 12], path, [0, 0.02, 1]));
  paths.add(box([11, 0.04, 1.4], path, [0, 0.02, 2]));
  scene.add(paths);

  const gate = new Group();
  gate.add(box([0.4, 2.4, 0.4], trim, [-1.2, 1.2, 0]));
  gate.add(box([0.4, 2.4, 0.4], trim, [1.2, 1.2, 0]));
  gate.add(box([2.8, 0.3, 0.4], trim, [0, 2.4, 0]));

  const staffRoom = building(3, 2, 3, walls, roof);
  const classroom = building(4, 2.4, 3, walls, roof);

  // The main hall; the rooftop and plant room sit on its roof.
  const hall = box([6, 4, 4], walls, [0, 2, -5]);
  scene.add(hall);
  const rooftop = new Group();
  rooftop.add(box([2, 1, 1.6], trim, [-1.2, 0.5, 0]));
  const tank = new Mesh(new CylinderGeometry(0.5, 0.5, 1.2, 8), roof);
  tank.position.set(1.4, 0.6, 0);
  rooftop.add(tank);

  const places: Record<FlowPlace, Group> = {
    gate,
    "staff-room": staffRoom,
    classroom,
    rooftop,
  };
  for (const { place } of audienceFlow.chapters) {
    places[place].name = place;
    places[place].position.set(...PLACE_POSITIONS[place]);
    scene.add(places[place]);
  }

  const beacon = new Mesh(new OctahedronGeometry(0.4, 0), glow);
  beacon.name = BEACON_NAME;
  beacon.position.copy(placeTarget("gate").lookAt).setY(3.4);
  scene.add(beacon);

  return { scene, beacon };
}
