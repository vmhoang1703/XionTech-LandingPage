import { describe, expect, it } from "vitest";
import type { Object3D } from "three";
import { audienceFlow } from "@/content/products";
import {
  BEACON_NAME,
  buildCampus,
  chapterAt,
  placeTarget,
  skyAt,
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

  it("returns fresh vectors, so a tween cannot move the next target", () => {
    const first = placeTarget("gate");
    first.position.set(0, 0, 0);
    expect(placeTarget("gate").position.toArray()).not.toEqual([0, 0, 0]);
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

  it("points each camera target at its place on the campus", () => {
    for (const place of places) {
      const [object] = named(place);
      const { lookAt } = placeTarget(place);
      expect(lookAt.x).toBeCloseTo(object.position.x);
      expect(lookAt.z).toBeCloseTo(object.position.z);
    }
  });
});
