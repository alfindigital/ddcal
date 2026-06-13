import { Info, Lightbulb } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  REFERENCE_ROWS,
  levelClass,
  nearestReferenceDrawdown,
} from "@/lib/reference-table";
import { formatPercent } from "@/lib/drawdown";
import { IconButton } from "./IconButton";

export function AboutDialog({ currentDrawdown }: { currentDrawdown: number }) {
  const highlightDd = nearestReferenceDrawdown(currentDrawdown);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <IconButton aria-label="Tentang" title="Tentang">
          <Info className="h-4 w-4" />
        </IconButton>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto space-y-4">
        <DialogHeader className="space-y-2 text-left">
          <DialogTitle className="font-display text-lg font-bold tracking-tight">
            Tentang Drawdown
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed">
            <strong className="text-foreground">Drawdown</strong> itu seberapa dalam modal turun dari puncaknya sebelum balik naik.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg bg-primary-soft/60 p-3">
          <h3 className="font-display text-sm font-bold tracking-tight mb-2">
            Rumus
          </h3>
          <div className="font-display tabular tracking-tight text-sm font-bold">
            recovery % = dd / (100 − dd) × 100
          </div>
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">
          Saat modal turun, basis hitungnya ikut mengecil. Itu sebabnya persen buat balik modal selalu lebih besar dari penurunannya.
        </p>


        <div>
          <h3 className="font-display text-sm font-bold tracking-tight mb-2">
            Tabel Referensi
          </h3>
          <div className="rounded-lg border border-border/60 overflow-hidden">
            <table className="w-full text-[13px] tabular table-fixed">
              <thead className="bg-muted/80">
                <tr className="text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  <th className="px-2 py-2 w-1/4">Drawdown</th>
                  <th className="px-2 py-2 w-1/4 border-r border-border/60">Recovery</th>
                  <th className="px-2 py-2 w-1/4">Drawdown</th>
                  <th className="px-2 py-2 w-1/4">Recovery</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const half = Math.ceil(REFERENCE_ROWS.length / 2);
                  const left = REFERENCE_ROWS.slice(0, half);
                  const right = REFERENCE_ROWS.slice(half);
                  const rows = Math.max(left.length, right.length);
                  return Array.from({ length: rows }).map((_, i) => {
                    const l = left[i];
                    const r = right[i];
                    return (
                      <tr
                        key={i}
                        className={
                          "border-t border-border/40 transition-colors hover:bg-muted/50 text-muted-foreground " +
                          (i % 2 === 1 ? "bg-muted/25" : "")
                        }
                      >
                        <td className="px-2 py-1.5 text-center">
                          {l ? `-${l.drawdown}%` : ""}
                        </td>
                        <td className="px-2 py-1.5 text-center border-r border-border/60 text-primary">
                          {l ? `+${formatPercent(l.recovery)}%` : ""}
                        </td>
                        <td className="px-2 py-1.5 text-center">
                          {r ? `-${r.drawdown}%` : ""}
                        </td>
                        <td className="px-2 py-1.5 text-center text-primary">
                          {r ? `+${formatPercent(r.recovery)}%` : ""}
                        </td>
                      </tr>
                    );
                  });
                })()}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold tracking-tight mb-2">
            Tips Risk Management
          </h3>
          <ul className="space-y-1.5 text-[13px] leading-relaxed text-muted-foreground">
            <li>💡 Drawdown vs recovery itu eksponensial, bukan linear</li>
            <li>💡 Loss 10% butuh 11% balik, loss 50% butuh 100%, loss 90% butuh 900%</li>
            <li>💡 Cut loss kecil jauh lebih sehat daripada nahan floating loss</li>
            <li>💡 Profit konsisten lahir dari loss yang dikecilin</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
