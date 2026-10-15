import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MapBadge } from "./map-badge";

describe("MapBadge", () => {
  it("shows the text of a text badge", () => {
    const { container } = render(
      <MapBadge badge={{ kind: "text", text: "P-Hub" }} />,
    );
    const badge = container.querySelector(".map-badge");
    expect(badge?.textContent).toBe("P-Hub");
    expect(badge?.getAttribute("aria-hidden")).toBe("true");
    expect(badge?.querySelector("svg")).toBeNull();
  });

  it.each(["Sparkle"] as const)("shows the %s icon", (icon) => {
    const { container } = render(<MapBadge badge={{ kind: "icon", icon }} />);
    const badge = container.querySelector(".map-badge");
    expect(badge?.getAttribute("aria-hidden")).toBe("true");
    expect(badge?.querySelector("svg")).not.toBeNull();
    expect(badge?.textContent).toBe("");
  });
});
