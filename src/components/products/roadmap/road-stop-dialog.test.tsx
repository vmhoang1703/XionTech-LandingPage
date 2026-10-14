import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LocaleProvider } from "@/components/layout/locale-link";
import { APPS, appTaglinesVi } from "@/content/apps";
import { dayRoad, productDetails, productsShowcase } from "@/content/products";
import { ProductScene } from "../scene/product-scene";
import { RoadStopDialog } from "./road-stop-dialog";

// The scene loads on the first click (next/dynamic); here it is a stand-in
// that shows what the dialog gave it, and the loaders it was given are kept.
const loaders = vi.hoisted(() => [] as (() => Promise<unknown>)[]);
vi.mock("next/dynamic", async () => {
  const { createElement } = await import("react");
  return {
    default: (load: () => Promise<unknown>) => {
      loaders.push(load);
      return function Scene(props: { index: number; words: string[] }) {
        return createElement("div", {
          "data-testid": "scene",
          "data-index": props.index,
          "data-words": props.words.join("|"),
        });
      };
    },
  };
});

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

  describe("click outside the card", () => {
    const scene = () => screen.getByTestId("scene");

    it("closes on a click on the scene, which fills the window", () => {
      const { dialog, onClose } = setup(0);
      fireEvent.pointerDown(scene());
      fireEvent.click(scene());
      expect(dialog.open).toBe(false);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("closes on a click on the dialog itself", () => {
      const { dialog, onClose } = setup(0);
      fireEvent.click(dialog);
      expect(dialog.open).toBe(false);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("stays open on a click in the card", () => {
      const { dialog, onClose } = setup(0);
      const heading = screen.getByRole("heading", { level: 2 });
      fireEvent.pointerDown(heading);
      fireEvent.click(heading);
      expect(dialog.open).toBe(true);
      expect(onClose).not.toHaveBeenCalled();
    });

    it("stays open when a press in the card ends outside it", () => {
      const { dialog, onClose } = setup(0);
      fireEvent.pointerDown(screen.getByRole("heading", { level: 2 }));
      fireEvent.click(scene());
      expect(dialog.open).toBe(true);
      expect(onClose).not.toHaveBeenCalled();
    });

    it("closes on a click outside after an earlier press in the card", () => {
      const { dialog } = setup(0);
      fireEvent.pointerDown(screen.getByRole("heading", { level: 2 }));
      fireEvent.pointerDown(scene());
      fireEvent.click(scene());
      expect(dialog.open).toBe(false);
    });
  });

  describe("the scene behind the card", () => {
    const words = () => screen.getByTestId("scene").dataset.words;

    it("loads the scene's own chunk, only when asked to", async () => {
      expect(loaders).toHaveLength(1);
      expect(await loaders[0]()).toBe(ProductScene);
    });

    it("is not built while the dialog is closed", () => {
      setup(null);
      expect(screen.queryByTestId("scene")).toBeNull();
    });

    it("stands the app's name at an app's stop, and passes the stop", () => {
      setup(1);
      expect(words()).toBe("Staff Hub");
      expect(screen.getByTestId("scene").dataset.index).toBe("1");
    });

    it("stands the brand at the first stop", () => {
      setup(0);
      expect(words()).toBe("XionTech");
    });

    it("stands all four apps at the last stop", () => {
      setup(LAST);
      expect(words()).toBe(APPS.map((app) => app.shortName).join("|"));
    });

    it("moves with Next, without being built again", () => {
      const { rerender, onMove, onClose } = setup(1);
      const before = screen.getByTestId("scene");
      rerender(<RoadStopDialog index={2} onMove={onMove} onClose={onClose} />);
      expect(screen.getByTestId("scene")).toBe(before);
      expect(words()).toBe("Parent Hub");
    });

    it("is decoration: the card keeps the app's name as real text", () => {
      setup(2);
      expect(screen.getByRole("heading", { name: "Parent Hub" })).toBeTruthy();
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

  it("speaks Vietnamese on vi: close, step, app details and taglines", () => {
    const { container, rerender } = render(
      <LocaleProvider locale="vi">
        <RoadStopDialog index={1} onMove={vi.fn()} onClose={vi.fn()} />
      </LocaleProvider>,
    );
    const dialog = container.querySelector("dialog") as HTMLDialogElement;

    expect(button("Đóng")).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe(
      "Ghi nhận điểm danh",
    );
    expect(dialog.textContent).toContain(appTaglinesVi["staff-hub"]);
    expect(dialog.textContent).toContain(
      "Dành cho: Nhân viên, giáo viên và lãnh đạo nhà trường",
    );
    expect(screen.getByRole("heading", { name: "Tính năng" })).toBeTruthy();
    expect(button("Học sinh đến trường")).toBeTruthy();

    rerender(
      <LocaleProvider locale="vi">
        <RoadStopDialog index={LAST} onMove={vi.fn()} onClose={vi.fn()} />
      </LocaleProvider>,
    );
    expect(dialog.textContent).toContain(appTaglinesVi.iot);
    expect(button("Kết thúc").disabled).toBe(true);
  });
});
