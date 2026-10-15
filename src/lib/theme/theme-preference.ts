export const THEME_KEY = "xt-theme";

export type Theme = "dark" | "light";

const DARK_QUERY = "(prefers-color-scheme: dark)";

/** The saved choice, or null when nothing valid is saved or storage is blocked. */
export function savedTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "dark" || stored === "light") return stored;
  } catch {
    // Storage is blocked: no saved choice.
  }
  return null;
}

// The saved choice wins. With no saved choice, or when storage is blocked,
// the visitor's colour-scheme setting decides.
export function readTheme(): Theme {
  return (
    savedTheme() ??
    (globalThis.matchMedia?.(DARK_QUERY).matches ? "dark" : "light")
  );
}

export function saveTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Storage is blocked: the choice only lasts for this visit.
  }
}

// Inline script for <head>: sets data-theme before first paint, with the same
// rules as readTheme(). It is built from the same key and query, so the script
// and the toggle cannot drift apart.
export const THEME_SCRIPT = `(function(){var t;try{var s=localStorage.getItem(${JSON.stringify(THEME_KEY)});if(s==="dark"||s==="light")t=s}catch(e){}if(!t)t=matchMedia(${JSON.stringify(DARK_QUERY)}).matches?"dark":"light";document.documentElement.setAttribute("data-theme",t)})()`;
