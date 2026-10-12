import { describe, expect, it } from "vitest";
import { appById } from "@/content/apps";
import {
  dayRoad,
  journeyBoard,
  journeyMap,
  productDetails,
} from "@/content/products";

describe("journeyMap", () => {
  it("has the H1 and a lede", () => {
    expect(journeyMap.intro.title).toBe("Built apart. Better together.");
    expect(journeyMap.intro.lede).toBe(
      "A connected suite for school communities — bringing parents, learning, staff operations and campus technology into one shared ecosystem.",
    );
  });
});

describe("dayRoad", () => {
  it("has six stops in road order", () => {
    expect(dayRoad.stops.map((stop) => stop.id)).toEqual([
      "arrive",
      "attendance",
      "parent",
      "learn",
      "campus",
      "connected",
    ]);
  });

  it("uses the prototype's times and copy", () => {
    expect(
      dayRoad.stops
        .filter((stop) => stop.id !== "campus")
        .map(({ time, title, text, app }) => ({ time, title, text, app })),
    ).toEqual([
      {
        time: "07:45",
        title: "Student arrives",
        text: "The student arrives on campus.",
        app: undefined,
      },
      {
        time: "08:00",
        title: "Attendance recorded",
        text: "A teacher marks the student's attendance in Staff Hub.",
        app: "staff-hub",
      },
      {
        time: "08:01",
        title: "Parent updated",
        text: "Parent Hub notifies parents that the student is at school.",
        app: "parent-hub",
      },
      {
        time: "09:30",
        title: "Student learns",
        text: "Students practise and ask questions with the AI Tutor.",
        app: "ai-tutor",
      },
      {
        time: "15:30",
        title: "Day stays connected",
        text: "Notifications and school information stay connected across the system.",
        app: undefined,
      },
    ]);
  });

  it("gives the IoT stop IoT's feature title and tagline, and no time", () => {
    const stop = dayRoad.stops.find((one) => one.id === "campus");
    expect(stop).toEqual({
      id: "campus",
      title: productDetails.iot.features[1].title,
      text: appById("iot").tagline,
      app: "iot",
    });
    expect(stop).not.toHaveProperty("time");
  });
});

describe("journeyBoard", () => {
  it("gives every stop a lane", () => {
    for (const stop of dayRoad.stops) {
      expect(journeyBoard.laneOf[stop.id], stop.id).toBeDefined();
    }
  });

  it("points every lane at the app in apps.ts", () => {
    expect(journeyBoard.lanes.map((lane) => lane.app)).toEqual([
      "ai-tutor",
      "staff-hub",
      "parent-hub",
      "iot",
    ]);
    for (const lane of journeyBoard.lanes) {
      expect(appById(lane.app).id).toBe(lane.app);
    }
  });

  it("puts every stop in a known lane, or all", () => {
    const ids = journeyBoard.lanes.map((lane) => lane.id);
    for (const stop of dayRoad.stops) {
      const lane = journeyBoard.laneOf[stop.id];
      expect(lane === "all" || ids.includes(lane), stop.id).toBe(true);
    }
  });

  it("makes the last stop span all lanes", () => {
    const last = dayRoad.stops[dayRoad.stops.length - 1];
    expect(journeyBoard.laneOf[last.id]).toBe("all");
  });
});
