import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LocaleProvider } from "@/components/layout/locale-link";
import { HomeContact } from "./home-contact";

describe("HomeContact", () => {
  it.each([
    ["en", "Have something you want to build?", "Ho Chi Minh City"],
    ["vi", "Bạn có điều gì muốn xây dựng?", "TP. Hồ Chí Minh"],
  ] as const)(
    "renders the %s heading and city names",
    (locale, heading, city) => {
      render(
        <LocaleProvider locale={locale}>
          <HomeContact locale={locale} />
        </LocaleProvider>,
      );
      expect(
        screen.getByRole("heading", { level: 2, name: heading }),
      ).toBeTruthy();
      expect(screen.getByText(new RegExp(city))).toBeTruthy();
    },
  );
});
