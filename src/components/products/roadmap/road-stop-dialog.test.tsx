import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { APPS } from "@/content/apps";
import { dayRoad, productDetails, productsShowcase } from "@/content/products";
import { RoadStopDialog } from "./road-stop-dialog";

const LAST = dayRoad.stops.length - 1;

// jsdom has no showModal or close: stand-ins that set `open` and fire
// "close" like the browser does.
beforeEach(() => {
  HTMLDialogElement.prototype.showModal = vi.fn(function (
    this: HTMLDialogElement,
  ) {
    this.setAttribute("open", "");
  });
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  });
});

afterEach(() => {
  document.body.innerHTML = "";
  vi.restoreAllMocks();
});

function setup(index: number | null) {
  const onMove = vi.fn();
  const onClose = vi.fn();
  const view = render(
    <RoadStopDialog index={index} onMove={onMove} onClose={onClose} />,
  );
  const dialog = view.container.querySelector("dialog") as HTMLDialogElement;
  return { ...view, dialog, onMove, onClose };
}

function button(name: string) {
  return screen.getByRole("button", { name }) as HTMLButtonElement;
}

describe("RoadStopDialog", () => {
  it("stays closed without an index", () => {
    const { dialog } = setup(null);
    expect(dialog.open).toBe(false);
    expect(HTMLDialogElement.prototype.showModal).not.toHaveBeenCalled();
    expect(dialog.querySelector("h2")).toBeNull();
  });

  it("opens for an index and shows the step", () => {
    const { dialog } = setup(1);
    expect(dialog.open).toBe(true);
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe(
      dayRoad.stops[1].title,
    );
    expect(dialog.textContent).toContain("2 / 6 · 08:00");
  });

  it("opens when the index changes from null, and closes when it goes back", () => {
    const { dialog, rerender, onMove, onClose } = setup(null);
    rerender(<RoadStopDialog index={0} onMove={onMove} onClose={onClose} />);
    expect(dialog.open).toBe(true);
    rerender(<RoadStopDialog index={null} onMove={onMove} onClose={onClose} />);
    expect(dialog.open).toBe(false);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("leaves the time out of the step label for a stop without one", () => {
    const { dialog } = setup(4);
    expect(dialog.textContent).toContain("5 / 6");
    expect(dialog.textContent).not.toContain("5 / 6 ·");
  });

  it("moves with Previous and Next", () => {
    const { onMove } = setup(2);
    fireEvent.click(button(dayRoad.stops[1].title));
    expect(onMove).toHaveBeenLastCalledWith(1);
    fireEvent.click(button(dayRoad.stops[3].title));
    expect(onMove).toHaveBeenLastCalledWith(3);
  });

  it("disables Previous on the first stop", () => {
    setup(0);
    expect(button(dayRoad.start).disabled).toBe(true);
    expect(button(dayRoad.stops[1].title).disabled).toBe(false);
  });

  it("disables Next on the last stop", () => {
    setup(LAST);
    expect(button(dayRoad.finish).disabled).toBe(true);
    expect(button(dayRoad.stops[LAST - 1].title).disabled).toBe(false);
  });

  it("closes with the close button", () => {
    const { dialog, onClose } = setup(0);
    fireEvent.click(button("Close"));
    expect(dialog.open).toBe(false);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  describe("backdrop", () => {
    const box = { left: 100, right: 300, top: 100, bottom: 300 } as DOMRect;

    it("closes on a click outside the box", () => {
      const { dialog, onClose } = setup(0);
      vi.spyOn(dialog, "getBoundingClientRect").mockReturnValue(box);
      fireEvent.click(dialog, { clientX: 10, clientY: 10 });
      expect(dialog.open).toBe(false);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("stays open on a click inside the box", () => {
      const { dialog, onClose } = setup(0);
      vi.spyOn(dialog, "getBoundingClientRect").mockReturnValue(box);
      fireEvent.click(dialog, { clientX: 200, clientY: 200 });
      expect(dialog.open).toBe(true);
      expect(onClose).not.toHaveBeenCalled();
    });

    it("stays open on a click on the content", () => {
      const { dialog, onClose } = setup(0);
      vi.spyOn(dialog, "getBoundingClientRect").mockReturnValue(box);
      fireEvent.click(screen.getByRole("heading", { level: 2 }), {
        clientX: 10,
        clientY: 10,
      });
      expect(dialog.open).toBe(true);
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  it("shows Made for and the features of the stop's app", () => {
    setup(1);
    const section = screen.getByRole("region", { name: "Staff Hub" });
    const detail = productDetails["staff-hub"];
    expect(section.textContent).toContain(
      `${productsShowcase.madeFor}: ${detail.madeFor}`,
    );
    const items = within(section)
      .getAllByRole("listitem")
      .map((li) => li.textContent);
    expect(items).toEqual(detail.features.map((feature) => feature.title));
  });

  it("shows no app section on a stop without an app", () => {
    setup(0);
    expect(screen.queryByRole("region")).toBeNull();
    expect(screen.queryByRole("list")).toBeNull();
  });

  it("has no open-details button on an app stop", () => {
    setup(1);
    expect(screen.queryByRole("button", { name: /details/i })).toBeNull();
  });

  it("lists all four apps on the last stop as plain chips, not buttons", () => {
    const { dialog } = setup(LAST);

    const list = dialog.querySelector(".road-dialog-apps") as HTMLElement;
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(4);
    expect(within(list).queryAllByRole("button")).toHaveLength(0);
    for (const [i, app] of APPS.entries()) {
      expect(items[i].textContent).toContain(app.shortName);
      expect(items[i].textContent).toContain(app.tagline);
    }
  });
});
