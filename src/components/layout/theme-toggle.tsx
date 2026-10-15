"use client";

import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { useEffect, useSyncExternalStore } from "react";
import {
  readTheme,
  savedTheme,
  saveTheme,
  type Theme,
} from "@/lib/theme/theme-preference";

const root = () => document.documentElement;
const apply = (theme: Theme) => {
  root().dataset.theme = theme;
};

// The theme lives on <html data-theme>, set before paint by THEME_SCRIPT; the
// toggle reads it from there, so every toggle on the page stays in step.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(root(), { attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}
const getTheme = () => (root().dataset.theme === "dark" ? "dark" : "light");
const getServerTheme = () => null;

// Dark-mode switch (Hoang Vu and Sammy, 2026-10-15). A click flips the theme
// and saves the choice. With no saved choice the page follows the visitor's
// colour-scheme setting, also when it changes while the page is open.
export function ThemeToggle({
  label,
  variant,
}: Readonly<{ label: string; variant: "header" | "menu" }>) {
  const theme = useSyncExternalStore(subscribe, getTheme, getServerTheme);

  useEffect(() => {
    // A 404 renders the head script on the client only, where it does not run:
    // set the theme here then (the CSS follows the colour scheme until now).
    if (!root().dataset.theme) apply(readTheme());
    // Absent outside a browser (the test DOM); there is no setting to follow.
    const query = globalThis.matchMedia?.("(prefers-color-scheme: dark)");
    if (!query) return;
    // A click this visit (kept on <html>, also when storage is blocked) or a
    // saved choice wins over the setting.
    const onChange = () => {
      if (root().dataset.themeChosen !== undefined || savedTheme()) return;
      apply(query.matches ? "dark" : "light");
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const dark = theme === "dark";
  const toggle = () => {
    const next: Theme = dark ? "light" : "dark";
    apply(next);
    root().dataset.themeChosen = "";
    saveTheme(next);
  };

  return (
    <button
      type="button"
      aria-pressed={dark}
      aria-label={variant === "header" ? label : undefined}
      onClick={toggle}
      className={variant === "header" ? "theme-toggle" : "theme-toggle-row"}
    >
      {/* Both icons render; CSS shows the one for <html data-theme>, so the
          icon is right before hydration too. */}
      <MoonIcon aria-hidden="true" className="tt-moon" />
      <SunIcon aria-hidden="true" weight="fill" className="tt-sun" />
      {variant === "menu" && <span>{label}</span>}
    </button>
  );
}
