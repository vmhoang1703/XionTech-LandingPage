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

const ja: ClientStrings = {
  dictionary: { roadDialog: { close: "閉じる" } },
  errors: { pairs: [], fallback: "ja send error" },
};

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

  it("uses the strings the layout sent in another locale", () => {
    expect(show("ja", ja)).toBe("閉じる|ja send error");
  });

  it("falls back to English when the layout sent no translation for the key", () => {
    expect(show("ko", { ...ja, dictionary: {} })).toBe("Close|ja send error");
    expect(show("fr")).toBe("Close|none");
  });
});
