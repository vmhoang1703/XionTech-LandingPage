"use client";

import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { useEffect, useSyncExternalStore } from "react";
import { saveTheme, THEME_KEY, type Theme } from "@/lib/theme/theme-preference";

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
    // Absent outside a browser (the test DOM); there is no setting to follow.
    const query = globalThis.matchMedia?.("(prefers-color-scheme: dark)");
    if (!query) return;
    const onChange = () => {
      let saved: string | null = null;
      try {
        saved = localStorage.getItem(THEME_KEY);
      } catch {
        // Storage is blocked: treat it as no saved choice.
      }
      if (!saved) apply(query.matches ? "dark" : "light");
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const dark = theme === "dark";
  const toggle = () => {
    const next: Theme = dark ? "light" : "dark";
    apply(next);
    saveTheme(next);
  };
  const Icon = dark ? SunIcon : MoonIcon;

  return (
    <button
      type="button"
      aria-pressed={dark}
      aria-label={variant === "header" ? label : undefined}
      onClick={toggle}
      className={variant === "header" ? "theme-toggle" : "theme-toggle-row"}
    >
      <Icon aria-hidden="true" weight={dark ? "fill" : "regular"} />
      {variant === "menu" && <span>{label}</span>}
    </button>
  );
}
