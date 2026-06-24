import { REFERENCE_ROWS, levelClass, LEVEL_KEY } from "@/lib/reference-table";
import { formatPercent } from "@/lib/drawdown";
import { useT } from "@/lib/i18n";

export function ReferenceTable() {
  const t = useT();
  return (
    <div className="overflow-hidden rounded-lg border border-border/60">
      <table className="w-full text-[13px] tabular">
        <thead className="bg-muted/80">
          <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            <th className="px-3 py-2">{t("label.drawdown")}</th>
            <th className="px-3 py-2 text-right">{t("label.recovery")}</th>
            <th className="px-3 py-2 text-right">{t("label.difficulty")}</th>
          </tr>
        </thead>
        <tbody>
          {REFERENCE_ROWS.map((r, i) => (
            <tr
              key={r.drawdown}
              className={
                "border-t border-border/40 text-muted-foreground transition-colors hover:bg-muted/50 " +
                (i % 2 === 1 ? "bg-muted/25" : "")
              }
            >
              <td className="px-3 py-1.5 font-medium text-foreground">-{r.drawdown}%</td>
              <td className="px-3 py-1.5 text-right font-semibold text-primary">
                +{formatPercent(r.recovery)}%
              </td>
              <td className={`px-3 py-1.5 text-right font-semibold ${levelClass(r.level)}`}>
                {t(LEVEL_KEY[r.level])}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
