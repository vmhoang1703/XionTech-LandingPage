import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { appById } from "@/content/apps";
import { AppBadge } from "./app-badge";

describe("AppBadge", () => {
  it("shows a text badge with its app's colour class", () => {
    const { container } = render(<AppBadge app={appById("parent-hub")} />);
    const badge = container.querySelector(".badge");
    expect(badge).toHaveTextContent("P-Hub");
    expect(badge).toHaveClass("b-pxp");
  });

  it("shows an icon badge with the short name for screen readers", () => {
    const { container } = render(<AppBadge app={appById("iot")} />);
    const badge = container.querySelector(".badge");
    expect(badge).toHaveClass("b-iot");
    expect(badge?.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(badge?.querySelector(".sr-only")).toHaveTextContent("IoT");
  });

  it("leaves out the colour class for an app Home has none for", () => {
    const { container } = render(<AppBadge app={appById("ai-tutor")} />);
    const badge = container.querySelector(".badge");
    expect(badge?.className).toBe("badge");
    expect(badge?.querySelector(".sr-only")).toHaveTextContent("AI Tutor");
  });
});
