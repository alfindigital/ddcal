import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

export function AboutDialog() {
  return (
    <Dialog>
      <DialogTrigger
        aria-label="Tentang"
        title="Tentang"
        className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Info className="h-4 w-4" />
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-lg font-bold tracking-tight">
            Tentang Drawdown
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed">
            <strong className="text-foreground">Drawdown</strong> adalah
            persentase penurunan modal dari titik tertinggi (peak) ke titik
            terendah (trough) sebelum naik kembali.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg bg-primary-soft/60 p-3">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-primary">
            Rumus pemulihan
          </div>
          <div className="font-display tabular tracking-tight mt-1 text-sm font-bold">
            recovery % = dd / (100 − dd) × 100
          </div>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold tracking-tight">
            Kenapa pemulihan asimetris?
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Saat modal turun, basis kalkulasi ikut mengecil. Untuk kembali ke
            modal awal, kenaikan persentasenya harus lebih besar dari
            penurunannya.
          </p>
        </div>

        <ul className="space-y-1 text-sm">
          {[
            ["10% drawdown", "butuh +11,1%"],
            ["25% drawdown", "butuh +33,3%"],
            ["50% drawdown", "butuh +100%"],
            ["75% drawdown", "butuh +300%"],
            ["90% drawdown", "butuh +900%"],
          ].map(([dd, rec]) => (
            <li
              key={dd}
              className="flex justify-between border-b border-border/50 py-1 last:border-0"
            >
              <span className="text-muted-foreground">{dd}</span>
              <span className="font-display tabular tracking-tight font-bold text-primary">
                {rec}
              </span>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
