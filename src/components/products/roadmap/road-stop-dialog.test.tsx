import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LocaleProvider } from "@/components/layout/locale-link";
import { APPS, appById, appTaglinesVi } from "@/content/apps";
import {
  productDetails,
  productRoad,
  productsShowcase,
} from "@/content/products";
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
      return function Scene(props: { index: number; app: string }) {
        return createElement("div", {
          "data-testid": "scene",
          "data-index": props.index,
          "data-app": props.app,
        });
      };
    },
  };
});

const LAST = productRoad.stops.length - 1;
const names = productRoad.stops.map((id) => appById(id).shortName);

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
  it("has three stops: Parent Hub, Staff Hub and AI Tutor", () => {
    expect(names).toEqual(["Parent Hub", "Staff Hub", "AI Tutor"]);
  });

  it("stays closed without an index", () => {
    const { dialog } = setup(null);
    expect(dialog.open).toBe(false);
    expect(HTMLDialogElement.prototype.showModal).not.toHaveBeenCalled();
    expect(dialog.querySelector("h2")).toBeNull();
  });

  it("opens for an index and shows the product: name, tagline and step", () => {
    const { dialog } = setup(1);
    expect(dialog.open).toBe(true);
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe(
      "Staff Hub",
    );
    expect(dialog.querySelector(".road-dialog-text")?.textContent).toBe(
      APPS.find((app) => app.id === "staff-hub")?.tagline,
    );
    expect(dialog.querySelector(".road-dialog-step")?.textContent).toBe(
      "2 / 3",
    );
  });

  it("opens when the index changes from null, and closes when it goes back", () => {
    const { dialog, rerender, onMove, onClose } = setup(null);
    rerender(<RoadStopDialog index={0} onMove={onMove} onClose={onClose} />);
    expect(dialog.open).toBe(true);
    rerender(<RoadStopDialog index={null} onMove={onMove} onClose={onClose} />);
    expect(dialog.open).toBe(false);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("moves with Previous and Next, which are named for the neighbouring products", () => {
    const { onMove } = setup(1);
    fireEvent.click(button("Previous Parent Hub"));
    expect(onMove).toHaveBeenLastCalledWith(0);
    fireEvent.click(button("Next AI Tutor"));
    expect(onMove).toHaveBeenLastCalledWith(2);
  });

  it("has no Previous on the first stop and no Next on the last (no Start or Finish)", () => {
    const first = setup(0);
    expect(
      first.dialog.querySelector('.road-dialog-go[data-dir="prev"]'),
    ).toBeNull();
    expect(button("Next Staff Hub")).toBeTruthy();
    expect(first.dialog.textContent).not.toContain(productRoad.start);
    first.unmount();
    const last = setup(LAST);
    expect(
      last.dialog.querySelector('.road-dialog-go[data-dir="next"]'),
    ).toBeNull();
    expect(button("Previous Staff Hub")).toBeTruthy();
    expect(last.dialog.textContent).not.toContain(productRoad.finish);
  });

  it("shows the app's logo on the right of its name's row", () => {
    const { dialog } = setup(1);
    const row = dialog.querySelector(".road-dialog-name") as HTMLElement;
    expect(row.firstElementChild?.tagName).toBe("H2");
    expect(row.lastElementChild?.classList.contains("map-badge")).toBe(true);
    expect(dialog.querySelectorAll(".map-badge")).toHaveLength(1);
  });

  it("closes with Esc", () => {
    const { dialog, onClose } = setup(0);
    fireEvent(dialog, new Event("cancel", { cancelable: true }));
    expect(dialog.open).toBe(false);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("shows a new stop from the top of the card", () => {
    const { dialog, rerender, onMove, onClose } = setup(0);
    const body = dialog.querySelector(".road-dialog-body") as HTMLElement;
    body.scrollTop = 300;
    rerender(<RoadStopDialog index={1} onMove={onMove} onClose={onClose} />);
    expect(body.scrollTop).toBe(0);
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

  it("shows who the product is made for and its features", () => {
    setup(1);
    const section = screen.getByRole("region", { name: "Staff Hub" });
    const detail = productDetails["staff-hub"];
    expect(section.textContent).toContain(
      `${productsShowcase.madeFor}: ${detail.madeFor}`,
    );
    expect(
      within(section).getByRole("heading", {
        level: 3,
        name: productsShowcase.featuresHeading,
      }),
    ).toBeTruthy();
    const items = within(section)
      .getAllByRole("listitem")
      .map((li) => li.textContent);
    expect(items).toEqual(detail.features.map((feature) => feature.title));
  });

  it("shows the product's badge", () => {
    const { dialog } = setup(0);
    expect(dialog.querySelector(".road-dialog-name .map-badge")).not.toBeNull();
  });

  it("has no list of all apps, and no school-day times", () => {
    const { dialog } = setup(LAST);
    expect(dialog.querySelector(".road-dialog-apps")).toBeNull();
    expect(dialog.querySelector(".road-dialog-step")?.textContent).toBe(
      "3 / 3",
    );
    expect(dialog.textContent).not.toMatch(/\d\d:\d\d/);
  });

  describe("the scene behind the card", () => {
    const shown = () => screen.getByTestId("scene").dataset.app;

    it("loads the scene's own chunk, only when asked to", async () => {
      expect(loaders).toHaveLength(1);
      expect(await loaders[0]()).toBe(ProductScene);
    });

    it("is not built while the dialog is closed", () => {
      setup(null);
      expect(screen.queryByTestId("scene")).toBeNull();
    });

    it("gets the product at every stop, and the stop", () => {
      const { rerender, onMove, onClose } = setup(0);
      for (const [i, expected] of productRoad.stops.entries()) {
        rerender(
          <RoadStopDialog index={i} onMove={onMove} onClose={onClose} />,
        );
        expect(shown()).toBe(expected);
        expect(screen.getByTestId("scene").dataset.index).toBe(String(i));
      }
    });

    it("moves with Next, without being built again", () => {
      const { rerender, onMove, onClose } = setup(1);
      const before = screen.getByTestId("scene");
      rerender(<RoadStopDialog index={2} onMove={onMove} onClose={onClose} />);
      expect(screen.getByTestId("scene")).toBe(before);
      expect(shown()).toBe("ai-tutor");
    });

    it("is decoration: the card keeps the product's name as real text", () => {
      setup(2);
      expect(screen.getByRole("heading", { name: "AI Tutor" })).toBeTruthy();
    });
  });

  it("speaks Vietnamese on vi: close, step, product details and tagline", () => {
    const { container, rerender } = render(
      <LocaleProvider locale="vi">
        <RoadStopDialog index={1} onMove={vi.fn()} onClose={vi.fn()} />
      </LocaleProvider>,
    );
    const dialog = container.querySelector("dialog") as HTMLDialogElement;

    expect(button("Đóng")).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe(
      "Staff Hub",
    );
    expect(dialog.textContent).toContain(appTaglinesVi["staff-hub"]);
    expect(dialog.textContent).toContain(
      "Dành cho: Nhân viên, giáo viên và lãnh đạo nhà trường",
    );
    expect(screen.getByRole("heading", { name: "Tính năng" })).toBeTruthy();
    expect(button("Trước Parent Hub")).toBeTruthy();

    rerender(
      <LocaleProvider locale="vi">
        <RoadStopDialog index={LAST} onMove={vi.fn()} onClose={vi.fn()} />
      </LocaleProvider>,
    );
    expect(dialog.textContent).toContain(appTaglinesVi["ai-tutor"]);
    expect(button("Trước Staff Hub").disabled).toBe(false);
    expect(dialog.textContent).not.toContain("Kết thúc");

    rerender(
      <LocaleProvider locale="vi">
        <RoadStopDialog index={0} onMove={vi.fn()} onClose={vi.fn()} />
      </LocaleProvider>,
    );
    expect(button("Tiếp Staff Hub").disabled).toBe(false);
    expect(dialog.textContent).not.toContain("Bắt đầu");
  });
});
