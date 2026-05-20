import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="flex items-center justify-between gap-2">
      <Link to="/" className="flex min-w-0 items-center gap-2">
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M4 8l4 4 3-3 4 4 5-7" />
          </svg>
        </div>
        <span className="font-display truncate text-base font-bold tracking-tight">
          drawdown<span className="text-primary">cal</span>
        </span>
      </Link>
      <nav className="flex items-center gap-1 text-xs font-medium">
        <NavLink to="/about">Tentang</NavLink>
        <NavLink to="/tips">Tips</NavLink>
        <ThemeToggle />
      </nav>
    </header>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="rounded-md px-2 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      activeProps={{ className: "text-foreground bg-muted" }}
    >
      {children}
    </Link>
  );
}
