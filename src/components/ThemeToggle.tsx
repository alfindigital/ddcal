import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { IconButton } from "./IconButton";

const STORAGE_KEY = "theme";

function safeGet(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function safeSet(v: string) {
  try {
    localStorage.setItem(STORAGE_KEY, v);
  } catch {
    /* Safari private mode / storage blocked — silently degrade. */
  }
}

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    // Sync state with whatever the pre-hydration script already applied.
    const stored = safeGet();
    const isDark =
      stored === "dark" ||
      (stored == null &&
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-color-scheme: dark)").matches);
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);

    // Multi-tab sync: react when another tab changes the theme.
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      const next = e.newValue === "dark";
      setDark(next);
      document.documentElement.classList.toggle("dark", next);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    safeSet(next ? "dark" : "light");
  };

  return (
    <IconButton
      onClick={toggle}
      aria-label="Ganti tema"
      title="Ganti tema"
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </IconButton>
  );
}
