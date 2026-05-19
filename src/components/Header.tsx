import { TrendingDown } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
          <TrendingDown className="h-5 w-5" strokeWidth={2.5} />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-base font-bold leading-tight tracking-tight">
            DrawdownCal
          </h1>
          <p className="truncate text-xs text-muted-foreground leading-tight">
            Makin besar drawdown, makin berat pulih.
          </p>
        </div>
      </div>
      <ThemeToggle />
    </header>
  );
}
