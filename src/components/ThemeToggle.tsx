import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { IconButton } from "./IconButton";
import { useT } from "@/lib/i18n";

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
  const t = useT();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    // Light-default product: dark only when the user explicitly chose it.
    // Matches the pre-hydration script in __root.tsx (no OS-preference auto-dark).
    const isDark = safeGet() === "dark";
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
    <IconButton onClick={toggle} aria-label={t("theme.toggle")} title={t("theme.toggle")}>
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </IconButton>
  );
}
