import { ArrowDown, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
          <ArrowDown className="h-5 w-5" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-base font-bold leading-tight tracking-tight">
            DrawdownCal
          </h1>
          <p className="text-xs text-muted-foreground leading-tight">
            Makin besar drawdown, makin berat pulih.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button className="gap-2 rounded-xl">
          <Download className="h-4 w-4" /> Install
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}
