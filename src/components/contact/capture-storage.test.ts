import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  CAPTURE_EMAIL_KEY,
  fillCapturedEmail,
  rememberCapturedEmail,
} from "./capture-storage";

const EMAIL = "lan@school.edu.vn";

function field(value = "") {
  document.body.innerHTML = `<input id="c-email" value="${value}">`;
  return document.getElementById("c-email") as HTMLInputElement;
}

beforeEach(() => sessionStorage.clear());
afterEach(() => vi.restoreAllMocks());

describe("capture storage", () => {
  it("hands the email to the next form once", () => {
    rememberCapturedEmail(EMAIL);
    const input = field();
    fillCapturedEmail("c-email");
    expect(input.value).toBe(EMAIL);
    expect(sessionStorage.getItem(CAPTURE_EMAIL_KEY)).toBeNull();
  });

  it("leaves a field the visitor already filled", () => {
    rememberCapturedEmail(EMAIL);
    const input = field("ana@school.edu.vn");
    fillCapturedEmail("c-email");
    expect(input.value).toBe("ana@school.edu.vn");
  });

  it("does nothing with no email kept or no field", () => {
    const input = field();
    fillCapturedEmail("c-email");
    expect(input.value).toBe("");
    rememberCapturedEmail(EMAIL);
    fillCapturedEmail("missing");
    expect(sessionStorage.getItem(CAPTURE_EMAIL_KEY)).toBeNull();
  });

  it("stays quiet when storage is blocked", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("blocked", "SecurityError");
    });
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("blocked", "SecurityError");
    });
    const error = vi.spyOn(console, "error");
    expect(() => rememberCapturedEmail(EMAIL)).not.toThrow();
    const input = field();
    expect(() => fillCapturedEmail("c-email")).not.toThrow();
    expect(input.value).toBe("");
    expect(error).not.toHaveBeenCalled();
  });
});
