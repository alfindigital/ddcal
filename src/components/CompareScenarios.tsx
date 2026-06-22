import { useState } from "react";
import { Plus, X, GitCompare } from "lucide-react";
import { calcRecovery, formatPercent, formatPercentSmart, bucketColor } from "@/lib/drawdown";
import { useT } from "@/lib/i18n";
import { track } from "@/lib/analytics";

const MAX_ITEMS = 4;

export function CompareScenarios({ current }: { current: number }) {
  const t = useT();
  const [items, setItems] = useState<number[]>([]);

  const add = () => {
    const dd = Math.round(current);
    setItems((prev) =>
      prev.includes(dd) || prev.length >= MAX_ITEMS ? prev : [...prev, dd].sort((a, b) => a - b),
    );
    track("compare_add", { dd });
  };
  const remove = (dd: number) => {
    setItems((prev) => prev.filter((x) => x !== dd));
    track("compare_remove");
  };

  const maxRec = items.length
    ? Math.max(...items.map((d) => calcRecovery(d)).filter(Number.isFinite), 1)
    : 1;

  return (
    <div className="rounded-xl border bg-card/40 p-3 sm:p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <GitCompare className="h-3.5 w-3.5 text-primary" />
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {t("compare.title")}
          </h3>
        </div>
        <button
          type="button"
          onClick={add}
          disabled={items.length >= MAX_ITEMS}
          className="inline-flex items-center gap-1 rounded-md border border-primary/40 bg-primary/5 px-2 py-1 text-[11px] font-bold text-primary transition-colors hover:bg-primary/10 disabled:opacity-40"
        >
          <Plus className="h-3 w-3" /> {t("compare.add")} -{formatPercentSmart(Math.round(current))}
          %
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-[11px] text-muted-foreground">{t("compare.hint")}</p>
      ) : (
        <ul className="space-y-1.5">
          {items.map((dd) => {
            const rec = calcRecovery(dd);
            const w = Number.isFinite(rec) ? (rec / maxRec) * 100 : 100;
            return (
              <li key={dd} className="flex items-center gap-2">
                <span className="w-12 shrink-0 text-right text-xs font-bold tabular text-foreground">
                  -{dd}%
                </span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-[width] duration-300"
                    style={{
                      width: `${Math.max(3, Math.min(100, w))}%`,
                      backgroundColor: bucketColor(dd),
                    }}
                  />
                </div>
                <span className="w-14 shrink-0 text-right text-xs font-bold tabular text-primary">
                  +{formatPercent(rec)}%
                </span>
                <button
                  type="button"
                  aria-label={t("compare.remove")}
                  onClick={() => remove(dd)}
                  className="grid h-5 w-5 shrink-0 place-items-center rounded text-muted-foreground hover:text-destructive"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
