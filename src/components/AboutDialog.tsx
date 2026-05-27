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
          <div className="max-h-72 overflow-y-auto rounded-lg border border-border/60">
            <table className="w-full text-[13px] tabular">
              <thead className="sticky top-0 bg-muted/80 backdrop-blur">
                <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  <th className="px-2 py-1.5">Drawdown</th>
                  <th className="px-2 py-1.5">Sisa</th>
                  <th className="px-2 py-1.5">Recovery</th>
                  <th className="px-2 py-1.5">Level</th>
                </tr>
              </thead>
              <tbody>
                {REFERENCE_ROWS.map((r) => {
                  const active = r.drawdown === highlightDd;
                  return (
                    <tr
                      key={r.drawdown}
                      className={
                        "border-t border-border/40 " +
                        (active
                          ? "bg-primary-soft/70 font-semibold text-foreground"
                          : "text-muted-foreground")
                      }
                    >
                      <td className="px-2 py-1.5">-{r.drawdown}%</td>
                      <td className="px-2 py-1.5">
                        Rp{r.remaining}
                      </td>
                      <td className="px-2 py-1.5 text-primary">
                        +{formatPercent(r.recovery)}%
                      </td>
                      <td className={"px-2 py-1.5 font-medium " + levelClass(r.level)}>
                        {r.level}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold tracking-tight mb-2">
            Tips Risk Management
          </h3>
          <ul className="space-y-1.5 text-[13px] leading-relaxed text-muted-foreground">
            <li>💡 Hubungan drawdown vs recovery itu eksponensial, bukan linear</li>
            <li>💡 Loss 10% butuh 11% balik. Loss 50% butuh 100%. Loss 90% butuh 900%</li>
            <li>💡 Cut loss kecil berkali-kali lebih baik daripada hold 1 floating loss besar</li>
            <li>💡 Yang bikin profit konsisten bukan cuan besar, tapi loss kecil</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
