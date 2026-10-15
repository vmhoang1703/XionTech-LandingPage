import { describe, expect, it, vi } from "vitest";
import { focusField } from "./focus-field";

describe("focusField", () => {
  it("focuses without the browser's own scroll, then centres the field", () => {
    const field = document.createElement("input");
    document.body.append(field);
    const focus = vi.spyOn(field, "focus");
    field.scrollIntoView = vi.fn();
    focusField(field);
    expect(focus).toHaveBeenCalledWith({ preventScroll: true });
    expect(document.activeElement).toBe(field);
    expect(field.scrollIntoView).toHaveBeenCalledWith({ block: "center" });
    field.remove();
  });

  it("does nothing without a field", () => {
    expect(() => focusField(null)).not.toThrow();
    expect(() => focusField(undefined)).not.toThrow();
  });
});
