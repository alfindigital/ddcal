import { Link } from "@tanstack/react-router";
import { Info } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { IconButton } from "./IconButton";
import { useT } from "@/lib/i18n";

export function Header({ currentDrawdown: _ }: { currentDrawdown?: number } = {}) {
  const t = useT();
  return (
    <header className="flex h-12 items-center justify-between gap-2">
      <Link to="/" className="flex min-w-0 items-center gap-3">
        {/* Architectural mark: rotated soft square halo + solid crimson tile */}
        <div className="relative grid h-9 w-9 shrink-0 place-items-center">
          <span aria-hidden className="absolute inset-0 rotate-45 rounded-xl bg-primary/10" />
          <span className="relative z-10 grid h-8 w-8 place-items-center overflow-hidden rounded-lg bg-primary text-primary-foreground shadow-sm">
            <RecoveryMark />
          </span>
        </div>

        {/* Wordmark - unified 'drawdown' wordmark with crimson 'cal' lockup */}
        <span className="font-display flex min-w-0 flex-col">
          <span className="flex items-baseline gap-1 truncate">
            <span className="text-[15px] font-bold lowercase tracking-tight text-foreground sm:text-[17px]">
              drawdown
            </span>
            <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              cal
            </span>
          </span>
          <span className="truncate text-[10px] font-medium leading-tight text-muted-foreground">
            by @lotmetrik
          </span>
        </span>

      </Link>

      <nav className="flex items-center gap-1">
        <IconButton asChild aria-label={t("nav.about")} title={t("nav.about")}>
          <Link to="/about">
            <Info className="h-4 w-4" />
          </Link>
        </IconButton>
        <ThemeToggle />
      </nav>
    </header>
  );
}

/**
 * Recovery mark — left & right ticks (market high markers), a central vertical
 * descent into a V (drawdown bottom + reversal), and a baseline rule (floor).
 */
function RecoveryMark() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M4 6H6M18 6H20" />
      <path d="M12 4V16" />
      <path d="M12 16L8 12M12 16L16 12" />
      <path d="M4 20H20" />
    </svg>
  );
}
