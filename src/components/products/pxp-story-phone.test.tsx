import { createEvent, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { pxpSection } from "@/content/products";
import { PxpStoryPhone } from "./pxp-story-phone";

const labels = pxpSection.screens.map((s) => s.label);

function tab(name: string) {
  return screen.getByRole("tab", { name });
}

function shownPanels() {
  return screen.getAllByRole("tabpanel");
}

describe("PxpStoryPhone", () => {
  it("renders five tabs in order with Attendance selected", () => {
    render(<PxpStoryPhone />);
    const list = screen.getByRole("tablist", { name: pxpSection.tabsLabel });
    expect(list.classList.contains("ptabs")).toBe(true);
    const tabs = screen.getAllByRole("tab");
    expect(tabs.map((t) => t.textContent)).toEqual(labels);
    expect(tabs.map((t) => t.getAttribute("aria-selected"))).toEqual([
      "true",
      "false",
      "false",
      "false",
      "false",
    ]);
    expect(tabs.map((t) => t.tabIndex)).toEqual([0, -1, -1, -1, -1]);
  });

  it("links every tab to its own panel and holds five screens", () => {
    const { container } = render(<PxpStoryPhone />);
    const panels = container.querySelectorAll('[role="tabpanel"]');
    expect(panels).toHaveLength(5);
    for (const t of screen.getAllByRole("tab")) {
      const panel = document.getElementById(
        t.getAttribute("aria-controls") ?? "",
      );
      expect(panel?.getAttribute("role")).toBe("tabpanel");
      expect(panel?.getAttribute("aria-labelledby")).toBe(t.id);
    }
    expect(container.querySelector(".story-phone .notch")).not.toBeNull();
    expect(container.querySelectorAll("img")).toHaveLength(0);
  });

  it("shows only the Attendance screen at first, with a placeholder caption", () => {
    render(<PxpStoryPhone />);
    const panels = shownPanels();
    expect(panels).toHaveLength(1);
    expect(panels[0].textContent).toBe(
      "[Placeholder] Parent Hub Attendance screen",
    );
  });

  it("shows the Grades screen and hides the others when Grades is clicked", () => {
    render(<PxpStoryPhone />);
    fireEvent.click(tab("Grades"));
    expect(tab("Grades").getAttribute("aria-selected")).toBe("true");
    expect(tab("Attendance").getAttribute("aria-selected")).toBe("false");
    const panels = shownPanels();
    expect(panels).toHaveLength(1);
    expect(panels[0].textContent).toBe(
      "[Placeholder] Parent Hub Grades screen",
    );
    expect(panels[0].getAttribute("aria-labelledby")).toBe(tab("Grades").id);
  });

  it("keeps inactive screens out of focus and the accessibility tree", () => {
    const { container } = render(<PxpStoryPhone />);
    const hidden = container.querySelectorAll('[role="tabpanel"][hidden]');
    expect(hidden).toHaveLength(4);
    for (const panel of hidden) {
      expect((panel as HTMLElement).tabIndex).toBe(-1);
    }
    fireEvent.click(tab("Payments"));
    const reachable = container.querySelectorAll<HTMLElement>(
      'a[href], button:not([tabindex="-1"]), [tabindex="0"]',
    );
    // Tab order in the phone: the shown Payments screen, then the selected tab.
    expect([...reachable].map((el) => el.id)).toEqual([
      "pxp-panel-payments",
      "pxp-tab-payments",
    ]);
    for (const el of reachable) {
      expect(el.closest("[hidden]")).toBeNull();
    }
  });

  it("moves focus and selection with the arrow, Home and End keys", () => {
    render(<PxpStoryPhone />);
    tab("Attendance").focus();
    const steps: [string, string][] = [
      ["ArrowRight", "Grades"],
      ["ArrowLeft", "Attendance"],
      ["ArrowLeft", "Events"],
      ["ArrowRight", "Attendance"],
      ["End", "Events"],
      ["Home", "Attendance"],
    ];
    for (const [key, expected] of steps) {
      fireEvent.keyDown(document.activeElement as Element, { key });
      expect(document.activeElement).toBe(tab(expected));
      expect(tab(expected).getAttribute("aria-selected")).toBe("true");
      expect(tab(expected).tabIndex).toBe(0);
      expect(shownPanels()[0].textContent).toBe(
        `[Placeholder] Parent Hub ${expected} screen`,
      );
    }
  });

  it("ignores other keys", () => {
    render(<PxpStoryPhone />);
    fireEvent.keyDown(tab("Attendance"), { key: "a" });
    expect(tab("Attendance").getAttribute("aria-selected")).toBe("true");
  });

  it("leaves browser shortcuts with a modifier key alone (Alt+Left is Back)", () => {
    render(<PxpStoryPhone />);
    for (const mod of ["altKey", "ctrlKey", "metaKey", "shiftKey"]) {
      const event = createEvent.keyDown(tab("Attendance"), {
        key: "ArrowLeft",
        [mod]: true,
      });
      fireEvent(tab("Attendance"), event);
      expect(event.defaultPrevented).toBe(false);
      expect(tab("Attendance").getAttribute("aria-selected")).toBe("true");
    }
  });
});
