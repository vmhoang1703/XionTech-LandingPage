import { describe, expect, it } from "vitest";

import { appById } from "@/content/apps";

import { postApp } from "./post-app";

describe("postApp", () => {
  it.each([
    ["parent-hub", "parent-hub"],
    ["staff-hub", "staff-hub"],
    ["iot", "iot"],
    ["ai-tutor", "ai-tutor"],
  ] as const)("keeps the new id %s", (value, id) => {
    expect(postApp(value)).toBe(appById(id));
  });

  it.each([
    ["PXP", "parent-hub"],
    ["SXP", "staff-hub"],
    ["IoT", "iot"],
  ] as const)("maps the old value %s to %s", (value, id) => {
    expect(postApp(value)).toBe(appById(id));
  });

  it.each(["LXP", "CRM", "toString", "", null, undefined])(
    "gives no app for %s",
    (value) => {
      expect(postApp(value)).toBeNull();
    },
  );
});
