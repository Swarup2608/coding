"use client";

export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

export const themeBootScript = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}');document.documentElement.classList.toggle('dark',t?t==='dark':true);}catch(e){}})();`;

export function getStoredTheme(): Theme {
  if (typeof window === "undefined") {
    return "dark";
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "light" ? "light" : "dark";
}

export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  window.localStorage.setItem(STORAGE_KEY, theme);
}
