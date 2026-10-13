import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TouchPress } from "./touch-press";

afterEach(() => vi.restoreAllMocks());

describe("TouchPress", () => {
  it("listens for touches, passively, so iPhone Safari shows :active", () => {
    const add = vi.spyOn(document, "addEventListener");
    const remove = vi.spyOn(document, "removeEventListener");
    const { unmount } = render(<TouchPress />);
    const call = add.mock.calls.find(([name]) => name === "touchstart");
    expect(call?.[2]).toEqual({ passive: true });
    const listen = call?.[1] as () => unknown;
    expect(listen()).toBeUndefined();
    unmount();
    expect(remove).toHaveBeenCalledWith("touchstart", listen);
  });
});
