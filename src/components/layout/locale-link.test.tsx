import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ClientStrings } from "@/i18n/client-strings";
import type { Locale } from "@/i18n/locales";
import {
  LocaleProvider,
  useContactErrorText,
  useLocalized,
} from "./locale-link";

const roadDialog = { en: { close: "Close" }, vi: { close: "Đóng" } };

function Probe() {
  const { close } = useLocalized("roadDialog", roadDialog);
  return (
    <p>
      {close}|{useContactErrorText()?.fallback ?? "none"}
    </p>
  );
}

function show(locale: Locale, strings?: ClientStrings) {
  const { container, unmount } = render(
    <LocaleProvider locale={locale} strings={strings}>
      <Probe />
    </LocaleProvider>,
  );
  const text = container.textContent;
  unmount();
  return text;
}

describe("useLocalized", () => {
  it("uses the twins on en and vi", () => {
    expect(show("en")).toBe("Close|none");
    expect(show("vi")).toBe("Đóng|none");
  });
});
