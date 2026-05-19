import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatPercent, calcRecovery } from "@/lib/drawdown";

export function ResultCard({ drawdown }: { drawdown: number }) {
  const recovery = calcRecovery(drawdown);
  return (
    <TooltipProvider delayDuration={150}>
      <div className="relative overflow-hidden rounded-2xl border bg-primary-soft/60 pl-1">
        <div className="absolute inset-y-0 left-0 w-1 bg-primary" />
        <div className="space-y-2 px-4 py-3.5 sm:px-5 sm:py-4">
          <Row
            label="Drawdown"
            tip="Persentase penurunan modal dari titik tertinggi."
            value={`-${formatPercent(drawdown)}%`}
            valueClass="text-primary font-semibold"
          />
          <Row
            label="Pemulihan"
            tip="Kenaikan persen yang dibutuhkan untuk kembali ke modal awal."
            value={`+${formatPercent(recovery)}%`}
            valueClass="font-bold text-foreground"
          />
        </div>
      </div>
    </TooltipProvider>
  );
}

function Row({
  label,
  tip,
  value,
  valueClass,
}: {
  label: string;
  tip: string;
  value: string;
  valueClass: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        {label}
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button" aria-label={`Info ${label}`}>
              <Info className="h-3.5 w-3.5 opacity-70" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">{tip}</TooltipContent>
        </Tooltip>
      </div>
      <div className={`text-base tabular-nums ${valueClass}`}>{value}</div>
    </div>
  );
}
