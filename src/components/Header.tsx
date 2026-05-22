import { Link } from "@tanstack/react-router";
import { AboutDialog } from "./AboutDialog";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="flex items-center justify-between gap-2">
      <Link to="/" className="flex min-w-0 items-center gap-2">
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-sm">
          <BearishCandleIcon />
        </div>
        <span className="font-display truncate text-base font-bold tracking-tight">
          Drawdown<span className="text-primary">CAL</span>
        </span>
      </Link>
      <nav className="flex items-center gap-1">
        <AboutDialog />
        <ThemeToggle />
      </nav>
    </header>
  );
}

function BearishCandleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[18px] w-[18px]"
      aria-hidden="true"
    >
      <path d="M6 6v3" />
      <rect x="4.5" y="9" width="3" height="4" rx="0.5" fill="currentColor" stroke="none" opacity="0.55" />
      <path d="M6 13v2" />
      <path d="M12 4v2" />
      <rect x="10.5" y="6" width="3" height="9" rx="0.5" fill="currentColor" stroke="none" />
      <path d="M12 15v3" />
      <path d="M18 8l0 10" />
      <path d="M15 15l3 3 3-3" />
    </svg>
  );
}
