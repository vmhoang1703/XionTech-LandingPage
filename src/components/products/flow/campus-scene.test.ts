import { describe, expect, it } from "vitest";
import {
  type DirectionalLight,
  type InstancedMesh,
  type Light,
  type Mesh,
  type MeshStandardMaterial,
  type Object3D,
  PerspectiveCamera,
} from "three";
import { audienceFlow } from "@/content/products";
import {
  BEACON_NAME,
  buildCampus,
  CAMERA_FOV,
  chapterAt,
  placeTarget,
  skyAt,
  viewFov,
} from "./campus-scene";

const places = audienceFlow.chapters.map((c) => c.place);

describe("chapterAt", () => {
  it.each([
    [0, "parent"],
    [0.2499, "parent"],
    [0.25, "staff"],
    [0.4999, "staff"],
    [0.5, "student"],
    [0.7499, "student"],
    [0.75, "campus"],
    [1, "campus"],
  ])("maps progress %d to the %s chapter", (progress, id) => {
    expect(chapterAt(progress).id).toBe(id);
  });

  it("clamps progress outside 0..1 to the first and last chapter", () => {
    expect(chapterAt(-0.2).id).toBe("parent");
    expect(chapterAt(1.3).id).toBe("campus");
  });
});

describe("placeTarget", () => {
  it("gives each place its own camera position and look-at", () => {
    const targets = places.map(placeTarget);
    const positions = targets.map((t) => t.position.toArray().join());
    const lookAts = targets.map((t) => t.lookAt.toArray().join());
    expect(new Set(positions).size).toBe(places.length);
    expect(new Set(lookAts).size).toBe(places.length);
    for (const t of targets) {
      expect(t.position.distanceTo(t.lookAt)).toBeGreaterThan(0);
    }
  });

  // Seen through the canvas camera at a tall, a square and a wide stage, the
  // camera stands back far enough that the other places stay on screen.
  it.each(places)("frames the %s with every other place in view", (place) => {
    const { position, lookAt } = placeTarget(place);
    expect(position.distanceTo(lookAt)).toBeGreaterThan(14);

    for (const aspect of [0.64, 1, 1.6]) {
      const camera = new PerspectiveCamera(viewFov(aspect), aspect, 0.1, 100);
      camera.position.copy(position);
      camera.lookAt(lookAt);
      camera.updateMatrixWorld();
      for (const other of places) {
        const onScreen = placeTarget(other).lookAt.project(camera);
        expect(Math.abs(onScreen.x)).toBeLessThan(0.9);
        expect(Math.abs(onScreen.y)).toBeLessThan(0.9);
      }
    }
  });

  it("returns fresh vectors, so a tween cannot move the next target", () => {
    const first = placeTarget("gate");
    first.position.set(0, 0, 0);
    expect(placeTarget("gate").position.toArray()).not.toEqual([0, 0, 0]);
  });
});

describe("viewFov", () => {
  const degrees = (radians: number) => (radians * 180) / Math.PI;
  const radians = (deg: number) => (deg * Math.PI) / 180;

  it("spans CAMERA_FOV across the shorter side of the stage", () => {
    expect(viewFov(1)).toBe(CAMERA_FOV);
    expect(viewFov(1.6)).toBe(CAMERA_FOV);
    const tall = 0.5;
    const across = 2 * Math.atan(Math.tan(radians(viewFov(tall)) / 2) * tall);
    expect(degrees(across)).toBeCloseTo(CAMERA_FOV);
  });
});

describe("skyAt", () => {
  it("moves from a morning colour to a different afternoon colour", () => {
    expect(skyAt(0).getHex()).not.toBe(skyAt(1).getHex());
  });

  it("clamps progress outside 0..1", () => {
    expect(skyAt(-1).getHex()).toBe(skyAt(0).getHex());
    expect(skyAt(2).getHex()).toBe(skyAt(1).getHex());
  });
});

describe("buildCampus", () => {
  const { scene, beacon } = buildCampus();
  const named = (name: string) => {
    const found: Object3D[] = [];
    scene.traverse((o) => {
      if (o.name === name) found.push(o);
    });
    return found;
  };

  it("has the four named places, the ground and the paths", () => {
    for (const place of places) {
      expect(named(place)).toHaveLength(1);
    }
    expect(named("ground")).toHaveLength(1);
    expect(named("paths")).toHaveLength(1);
  });

  it("has one beacon, the one it returns", () => {
    expect(named(BEACON_NAME)).toEqual([beacon]);
  });

  it("has trees, benches and clouds", () => {
    const [trees] = named("trees");
    expect(trees.children.length).toBeGreaterThan(0);
    for (const part of trees.children as InstancedMesh[]) {
      expect(part.isInstancedMesh).toBe(true);
      expect(part.count).toBeGreaterThanOrEqual(8);
      expect(part.castShadow).toBe(true);
    }
    expect(named("benches")[0].children.length).toBeGreaterThanOrEqual(3);
    expect(named("clouds")[0].children.length).toBeGreaterThanOrEqual(3);
  });

  it("has one group of details at each place", () => {
    for (const place of places) {
      const [object] = named(place);
      const details = object.children.filter((c) => c.name === "details");
      expect(details).toHaveLength(1);
      expect(details[0].children.length).toBeGreaterThan(0);
    }
  });

  it("lights the campus with one warm key light that casts soft shadows", () => {
    const lights: Light[] = [];
    scene.traverse((o) => {
      if ((o as Light).isLight) lights.push(o as Light);
    });
    const casters = lights.filter((l) => l.castShadow);
    expect(casters).toHaveLength(1);
    const [key] = casters as DirectionalLight[];
    expect(key.color.r).toBeGreaterThan(key.color.b);
    expect(key.shadow.mapSize.x).toBeLessThanOrEqual(1024);
    expect(key.shadow.radius).toBeGreaterThan(1);
    expect(named("ground")[0].receiveShadow).toBe(true);
  });

  it("points each camera target at its place on the campus", () => {
    for (const place of places) {
      const [object] = named(place);
      const { lookAt } = placeTarget(place);
      expect(lookAt.x).toBeCloseTo(object.position.x);
      expect(lookAt.z).toBeCloseTo(object.position.z);
    }
  });
});

// Every transform and glow below `root`: equal snapshots mean nothing moved.
function motion(root: Object3D | undefined) {
  const state: number[] = [];
  root?.traverse((o) => {
    state.push(
      ...o.position.toArray(),
      ...o.quaternion.toArray(),
      ...o.scale.toArray(),
    );
    const material = (o as Mesh).material as MeshStandardMaterial | undefined;
    if (material?.emissiveIntensity !== undefined) {
      state.push(material.emissiveIntensity);
    }
  });
  return state;
}

const segments = (scene: Object3D) =>
  (scene.getObjectByName("paths")?.children ?? []).filter((o) =>
    o.name.startsWith("path-"),
  ) as Mesh[];

const glows = (mesh: Mesh) =>
  (mesh.material as MeshStandardMaterial).emissiveIntensity > 0;

describe("focus", () => {
  it("lights only the path toward the focused place", () => {
    const { scene, focus } = buildCampus();
    expect(segments(scene)).toHaveLength(places.length);
    for (const place of places) {
      focus(place);
      const lit = segments(scene).filter(glows);
      expect(lit.map((s) => s.name)).toEqual([`path-${place}`]);
      const colours = new Set(
        segments(scene).map((s) =>
          (s.material as MeshStandardMaterial).color.getHex(),
        ),
      );
      expect(colours.size).toBe(2);
    }
  });

  it("rests the spark at the place, then runs it along the path as time ticks", () => {
    const { scene, focus, tick } = buildCampus();
    const spark = scene.getObjectByName("spark");
    if (!spark) throw new Error("No spark");
    focus("classroom");
    const end = spark.position.clone();
    const { lookAt } = placeTarget("classroom");
    const others = places.filter((p) => p !== "classroom");
    for (const other of others) {
      const near = placeTarget(other).lookAt.setY(0);
      expect(
        end.clone().setY(0).distanceTo(lookAt.clone().setY(0)),
      ).toBeLessThan(end.clone().setY(0).distanceTo(near));
    }

    tick(300);
    expect(spark.position.equals(end)).toBe(false);
    expect(spark.position.y).toBe(end.y);
  });
});

describe("tick", () => {
  it("drifts the clouds and moves every place's details", () => {
    const { scene, tick } = buildCampus();
    const parts = [
      scene.getObjectByName("clouds"),
      ...places.map((p) =>
        scene.getObjectByName(p)?.getObjectByName("details"),
      ),
    ];
    const before = parts.map(motion);
    tick(1000);
    parts.forEach((part, i) => {
      expect(motion(part)).not.toEqual(before[i]);
    });
  });

  it("moves nothing when no time has passed", () => {
    const { scene, tick } = buildCampus();
    const before = motion(scene);
    tick(0);
    expect(motion(scene)).toEqual(before);
  });
});
