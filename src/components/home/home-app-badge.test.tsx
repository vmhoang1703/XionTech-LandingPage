import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { appById } from "@/content/apps";
import { HomeAppBadge } from "./home-app-badge";

function badgeOf(id: Parameters<typeof appById>[0]) {
  const { container } = render(<HomeAppBadge app={appById(id)} />);
  const badge = container.querySelector(".badge");
  if (!badge) throw new Error("no badge rendered");
  return badge;
}

describe("HomeAppBadge", () => {
  it("shows a text badge with its app's colour class", () => {
    const badge = badgeOf("parent-hub");
    expect(badge.textContent).toBe("P-Hub");
    expect(badge.className).toBe("badge b-pxp");
  });

  it("shows an icon badge with the short name for screen readers", () => {
    const badge = badgeOf("iot");
    expect(badge.className).toBe("badge b-iot");
    expect(badge.querySelector("svg")?.getAttribute("aria-hidden")).toBe(
      "true",
    );
    expect(badge.querySelector(".sr-only")?.textContent).toBe("IoT");
  });

  it("gives AI Tutor its own colour class, for the Home app cards", () => {
    const badge = badgeOf("ai-tutor");
    expect(badge.className).toBe("badge b-ait");
    expect(badge.querySelector("svg")).not.toBeNull();
    expect(badge.querySelector(".sr-only")?.textContent).toBe("AI Tutor");
  });
});
