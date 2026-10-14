import { describe, expect, it } from "vitest";
import { advance, fitWords } from "./scene-layout";

const APPS = ["Parent Hub", "Staff Hub", "IoT", "AI Tutor"];

describe("advance", () => {
  it("counts a letter as wider than a space", () => {
    expect(advance("AB")).toBeGreaterThan(advance("A B") - advance("A"));
    expect(advance("A B")).toBeGreaterThan(advance("AB"));
  });

  it("grows with the letters", () => {
    expect(advance("Staff Hub")).toBeGreaterThan(advance("IoT"));
  });
});

describe("fitWords, one word", () => {
  it("fits the name into the stage's room, centred", () => {
    const [fit] = fitWords(["Staff Hub"]);
    expect(fit.wide.x).toBe(0);
    expect(fit.wide.z).toBe(0);
    expect(fit.wide.size * advance("Staff Hub")).toBeLessThanOrEqual(820);
    expect(fit.narrow.size * advance("Staff Hub")).toBeLessThanOrEqual(660);
  });

  it("caps the letters of a short name, so IoT does not tower", () => {
    const [short] = fitWords(["IoT"]);
    expect(short.wide.size).toBe(130);
    expect(short.narrow.size).toBe(130);
  });

  it("stretches the letters to the height of the stage", () => {
    const [fit] = fitWords(["Staff Hub"]);
    // size x cap height x stretch is the tower's height
    expect(fit.wide.size * 0.75 * fit.wide.stretch).toBeCloseTo(230);
    expect(fit.narrow.size * 0.75 * fit.narrow.stretch).toBeCloseTo(320);
  });
});

describe("fitWords, the four apps", () => {
  const fits = fitWords(APPS);

  it("fits each word", () => {
    expect(fits).toHaveLength(4);
  });

  it("stands two rows of two on the wide stage, the back row taller", () => {
    const [parent, staff, iot, tutor] = fits.map((fit) => fit.wide);
    expect(parent.z).toBe(staff.z);
    expect(iot.z).toBe(tutor.z);
    expect(iot.z).toBeLessThan(parent.z);
    expect(parent.x).toBeLessThan(staff.x);
    expect(iot.x).toBeLessThan(tutor.x);
    const tall = (fit: typeof parent) => fit.size * 0.75 * fit.stretch;
    expect(tall(iot)).toBeGreaterThan(tall(parent));
  });

  it("keeps the words of a row apart and inside the stage", () => {
    const [parent, staff] = fits.map((fit) => fit.wide);
    const parentRight = parent.x + (parent.size * advance(APPS[0])) / 2;
    const staffLeft = staff.x - (staff.size * advance(APPS[1])) / 2;
    expect(parentRight).toBeLessThan(staffLeft);
    expect(
      Math.abs(parent.x) + (parent.size * advance(APPS[0])) / 2,
    ).toBeLessThan(500);
  });

  it("stands one column on the tall stage, each row taller and further back", () => {
    const column = fits.map((fit) => fit.narrow);
    for (let i = 1; i < column.length; i += 1) {
      expect(column[i].z).toBeLessThan(column[i - 1].z);
      expect(column[i].size * column[i].stretch).toBeGreaterThan(
        column[i - 1].size * column[i - 1].stretch,
      );
    }
    expect(new Set(column.map((fit) => fit.size)).size).toBe(1);
  });

  it("stands the short IoT to the left of AI Tutor behind it", () => {
    const [, , iot, tutor] = fits.map((fit) => fit.narrow);
    expect(iot.x).toBeLessThan(tutor.x);
  });
});
