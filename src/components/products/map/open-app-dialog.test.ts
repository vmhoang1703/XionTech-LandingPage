import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { openAppDialog } from "./open-app-dialog";

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

describe("openAppDialog", () => {
  it("opens dialog#pd-{anchor} and returns focus to the opener on close", () => {
    document.body.innerHTML =
      '<button id="opener">Open</button><dialog id="pd-pxp"></dialog>';
    const opener = document.getElementById("opener") as HTMLElement;
    const dialog = document.getElementById("pd-pxp") as HTMLDialogElement;

    expect(openAppDialog("pxp", opener)).toBe(true);
    expect(dialog.open).toBe(true);
    expect(document.activeElement).not.toBe(opener);

    dialog.close();
    expect(document.activeElement).toBe(opener);
  });

  it("returns false when there is no such dialog", () => {
    document.body.innerHTML = '<button id="opener">Open</button>';
    const opener = document.getElementById("opener") as HTMLElement;

    expect(openAppDialog("pxp", opener)).toBe(false);
    expect(HTMLDialogElement.prototype.showModal).not.toHaveBeenCalled();
  });

  it("returns false when the element is not a dialog", () => {
    document.body.innerHTML =
      '<button id="opener">Open</button><div id="pd-pxp"></div>';
    const opener = document.getElementById("opener") as HTMLElement;

    expect(openAppDialog("pxp", opener)).toBe(false);
  });
});
