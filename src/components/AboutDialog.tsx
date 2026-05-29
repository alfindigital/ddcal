import { Info } from "lucide-react";
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

export function AboutDialog({ currentDrawdown }: { currentDrawdown: number }) {
  const highlightDd = nearestReferenceDrawdown(currentDrawdown);

  return (
    <Dialog>
      <DialogTrigger
        aria-label="Tentang"
        title="Tentang"
        className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Info className="h-4 w-4" />
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
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
            Rumus
          </div>
          <div className="font-display tabular tracking-tight mt-1 text-sm font-bold">
            recovery % = dd / (100 − dd) × 100
          </div>
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">
          Saat modal turun, basis kalkulasi ikut mengecil — kenaikan untuk
          balik modal selalu lebih besar dari penurunannya.
        </p>

        <div>
          <h3 className="font-display text-sm font-bold tracking-tight mb-2">
            Tabel Referensi Lengkap
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
                    const lActive = !!l && l.drawdown === highlightDd;
                    const rActive = !!r && r.drawdown === highlightDd;
                    return (
                      <tr
                        key={i}
                        className={
                          "border-t border-border/40 transition-colors hover:bg-muted/50 text-muted-foreground " +
                          (i % 2 === 1 ? "bg-muted/25" : "")
                        }
                      >
                        <td
                          className={
                            "px-2 py-1.5 text-center " +
                            (lActive ? "bg-primary-soft/70 font-semibold text-foreground" : "")
                          }
                        >
                          {l ? `-${l.drawdown}%` : ""}
                        </td>
                        <td
                          className={
                            "px-2 py-1.5 text-center border-r border-border/60 " +
                            (lActive ? "bg-primary-soft/70 font-semibold" : "") +
                            " text-primary"
                          }
                        >
                          {l ? `+${formatPercent(l.recovery)}%` : ""}
                        </td>
                        <td
                          className={
                            "px-2 py-1.5 text-center " +
                            (rActive ? "bg-primary-soft/70 font-semibold text-foreground" : "")
                          }
                        >
                          {r ? `-${r.drawdown}%` : ""}
                        </td>
                        <td
                          className={
                            "px-2 py-1.5 text-center " +
                            (rActive ? "bg-primary-soft/70 font-semibold" : "") +
                            " text-primary"
                          }
                        >
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
            <li>💡 Loss 10% → 11% balik. Loss 50% → 100%. Loss 90% → 900%</li>
            <li>💡 Cut loss kecil lebih baik daripada hold floating loss besar</li>
            <li>💡 Profit konsisten datang dari loss yang kecil</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
