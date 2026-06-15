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
} from "@/lib/reference-table";
import { formatPercent } from "@/lib/drawdown";
import { IconButton } from "./IconButton";
import { useT } from "@/lib/i18n";

export function AboutDialog({ currentDrawdown: _currentDrawdown }: { currentDrawdown: number }) {
  const t = useT();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <IconButton aria-label={t("label.about")} title={t("label.about")}>
          <Info className="h-4 w-4" />
        </IconButton>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto space-y-4">
        <DialogHeader className="space-y-2 text-left">
          <DialogTitle className="font-display text-lg font-bold tracking-tight">
            {t("about.title")}
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed">
            <strong className="text-foreground">Drawdown</strong> {t("about.desc")}
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg bg-primary-soft/60 p-3">
          <h3 className="font-display text-sm font-bold tracking-tight mb-2">
            {t("about.formula")}
          </h3>
          <div className="font-display tabular tracking-tight text-sm font-bold">
            recovery % = dd / (100 − dd) × 100
          </div>
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {t("about.explain")}
        </p>

        <div>
          <h3 className="font-display text-sm font-bold tracking-tight mb-2">
            {t("about.reference")}
          </h3>
          <div className="rounded-lg border border-border/60 overflow-hidden">
            <table className="w-full text-[13px] tabular table-fixed">
              <thead className="bg-muted/80">
                <tr className="text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  <th className="px-2 py-2 w-1/4">{t("label.drawdown")}</th>
                  <th className="px-2 py-2 w-1/4 border-r border-border/60">{t("label.recovery")}</th>
                  <th className="px-2 py-2 w-1/4">{t("label.drawdown")}</th>
                  <th className="px-2 py-2 w-1/4">{t("label.recovery")}</th>
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
            {t("about.tips")}
          </h3>
          <ul className="space-y-1.5 text-[13px] leading-relaxed text-muted-foreground">
            {[t("about.tip1"), t("about.tip2"), t("about.tip3"), t("about.tip4")].map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <Lightbulb className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
