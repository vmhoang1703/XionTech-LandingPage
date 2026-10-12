import { describe, expect, it, vi } from "vitest";
import {
  Box3,
  type InstancedMesh,
  Matrix4,
  type Mesh,
  type Object3D,
  OrthographicCamera,
  Vector3,
} from "three";
import { journeyMap } from "@/content/products";
import {
  buildJourney,
  frameCamera,
  HUB_NAME,
  islandAnchor,
  type PlaceId,
} from "./journey-scene";

const ids = journeyMap.places.map((p) => p.id);

// World position of instance `i` of an instanced mesh.
const instanceAt = (mesh: InstancedMesh, i: number) => {
  const matrix = new Matrix4();
  mesh.getMatrixAt(i, matrix);
  return new Vector3().setFromMatrixPosition(
    matrix.premultiply(mesh.matrixWorld),
  );
};

const flat = (v: Vector3) => new Vector3(v.x, 0, v.z);

const worldOf = (object: Object3D) => {
  object.updateWorldMatrix(true, false);
  return new Vector3().setFromMatrixPosition(object.matrixWorld);
};

const meshesIn = (object: Object3D) => {
  const found: Mesh[] = [];
  object.traverse((child) => {
    if ((child as Mesh).isMesh) found.push(child as Mesh);
  });
  return found;
};

describe("buildJourney", () => {
  it("names the hub and one island per app, each carrying props", () => {
    const { scene, islands } = buildJourney();
    expect(scene.getObjectByName(HUB_NAME)).toBeDefined();
    expect(Object.keys(islands)).toEqual(ids);
    for (const id of ids) {
      const island = scene.getObjectByName(id);
      expect(island).toBe(islands[id]);
      const props = island?.getObjectByName("props");
      expect(props && meshesIn(props).length).toBeGreaterThanOrEqual(3);
    }
    // Islands stand apart from each other and from the hub.
    const spots = [HUB_NAME, ...ids].map((name) =>
      worldOf(scene.getObjectByName(name) as Object3D),
    );
    for (const [i, a] of spots.entries()) {
      for (const b of spots.slice(i + 1)) {
        expect(flat(a).distanceTo(flat(b))).toBeGreaterThan(4);
      }
    }
  });

  it("runs one dashed road from the hub to each island", () => {
    const { scene } = buildJourney();
    scene.updateMatrixWorld(true);
    const hub = flat(worldOf(scene.getObjectByName(HUB_NAME) as Object3D));
    for (const id of ids) {
      const road = scene.getObjectByName(`road-${id}`) as InstancedMesh;
      expect(road.isInstancedMesh).toBe(true);
      expect(road.count).toBeGreaterThanOrEqual(4);
      const island = flat(worldOf(scene.getObjectByName(id) as Object3D));
      const dashes = Array.from({ length: road.count }, (_, i) =>
        flat(instanceAt(road, i)),
      );
      const first = dashes[0];
      const last = dashes.at(-1) as Vector3;
      expect(first.distanceTo(hub)).toBeLessThan(first.distanceTo(island));
      expect(last.distanceTo(island)).toBeLessThan(last.distanceTo(hub));
      // Every dash lies on the line from the hub to the island.
      const along = island.clone().sub(hub).normalize();
      for (const dash of dashes) {
        const off = dash.clone().sub(hub);
        const side = off.sub(along.clone().multiplyScalar(off.dot(along)));
        expect(side.length()).toBeLessThan(0.01);
      }
    }
  });

  it("moves the dots outwards along the roads on tick", () => {
    const { scene, tick } = buildJourney();
    scene.updateMatrixWorld(true);
    const dots = scene.getObjectByName("dots") as InstancedMesh;
    const hub = flat(worldOf(scene.getObjectByName(HUB_NAME) as Object3D));
    const before = Array.from({ length: dots.count }, (_, i) =>
      flat(instanceAt(dots, i)).distanceTo(hub),
    );
    tick(100);
    scene.updateMatrixWorld(true);
    const after = Array.from({ length: dots.count }, (_, i) =>
      flat(instanceAt(dots, i)).distanceTo(hub),
    );
    expect(dots.count).toBeGreaterThanOrEqual(ids.length);
    // Outwards, except a dot that wrapped back to the hub this tick.
    const outwards = after.filter((d, i) => d > before[i]);
    expect(outwards.length).toBeGreaterThanOrEqual(dots.count - ids.length);
  });

  it("ignores a tick of zero or less", () => {
    const { scene, tick } = buildJourney();
    const dots = scene.getObjectByName("dots") as InstancedMesh;
    const before = instanceAt(dots, 0);
    tick(0);
    tick(-50);
    expect(instanceAt(dots, 0).distanceTo(before)).toBe(0);
  });

  it("bobs the islands as time runs", () => {
    const { islands, tick } = buildJourney();
    const before = islands["ai-tutor"].position.y;
    tick(700);
    expect(islands["ai-tutor"].position.y).not.toBe(before);
  });

  it("lifts only the chosen island, at once when instant", () => {
    const { islands, lift } = buildJourney();
    const rest = ids.map((id) => islands[id].position.y);
    lift("staff-hub", true);
    ids.forEach((id, i) => {
      if (id === "staff-hub") {
        expect(islands[id].position.y).toBeGreaterThan(rest[i] + 0.3);
      } else {
        expect(islands[id].position.y).toBe(rest[i]);
      }
    });
    lift(null, true);
    ids.forEach((id, i) => expect(islands[id].position.y).toBe(rest[i]));
  });

  it("eases a lift in over ticks when not instant", () => {
    const { islands, lift, tick } = buildJourney();
    const start = islands.iot.position.y;
    lift("iot", false);
    expect(islands.iot.position.y).toBe(start);
    tick(50);
    const part = islands.iot.position.y;
    tick(500);
    const full = islands.iot.position.y;
    lift("iot", true);
    const instant = islands.iot.position.y;
    expect(part).toBeGreaterThan(start);
    expect(full).toBeGreaterThan(part);
    expect(full).toBeCloseTo(instant, 5);
  });

  it("disposes every geometry and material once", () => {
    const { scene, dispose } = buildJourney();
    const geometry = meshesIn(scene)[0].geometry;
    const spy = vi.spyOn(geometry, "dispose");
    dispose();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

describe("frameCamera and islandAnchor", () => {
  it.each([1, 0.6, 2])(
    "keeps every anchor and island in view at aspect %d",
    (aspect) => {
      const camera = new OrthographicCamera();
      frameCamera(camera, aspect);
      camera.updateMatrixWorld(true);
      const inView = (point: Vector3) => {
        const p = point.clone().project(camera);
        expect(Math.abs(p.x)).toBeLessThanOrEqual(1);
        expect(Math.abs(p.y)).toBeLessThanOrEqual(1);
        expect(Math.abs(p.z)).toBeLessThanOrEqual(1);
      };
      for (const id of ids) inView(islandAnchor(id));
      const { scene, islands, lift } = buildJourney();
      for (const id of ids) {
        lift(id, true);
        scene.updateMatrixWorld(true);
        const box = new Box3().setFromObject(islands[id]);
        for (const x of [box.min.x, box.max.x]) {
          for (const y of [box.min.y, box.max.y]) {
            for (const z of [box.min.z, box.max.z]) {
              inView(new Vector3(x, y, z));
            }
          }
        }
      }
    },
  );

  it("gives each island its own anchor above its top", () => {
    const { scene, islands } = buildJourney();
    scene.updateMatrixWorld(true);
    const anchors = ids.map((id: PlaceId) => islandAnchor(id));
    expect(new Set(anchors.map((a) => a.toArray().join())).size).toBe(4);
    ids.forEach((id, i) => {
      const centre = flat(worldOf(islands[id]));
      expect(flat(anchors[i]).distanceTo(centre)).toBeLessThan(0.01);
      expect(anchors[i].y).toBeGreaterThan(0);
    });
  });

  it("looks down at the isometric angle from the same side at any aspect", () => {
    const wide = new OrthographicCamera();
    const tall = new OrthographicCamera();
    frameCamera(wide, 2);
    frameCamera(tall, 0.6);
    expect(wide.position.toArray()).toEqual(tall.position.toArray());
    expect(wide.right / wide.top).toBeCloseTo(2, 5);
    expect(tall.right / tall.top).toBeCloseTo(0.6, 5);
  });
});
