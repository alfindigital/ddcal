import { useState } from "react";
import { Clock } from "lucide-react";
import { calcRecovery, monthsToRecover } from "@/lib/drawdown";
import { useT } from "@/lib/i18n";
import { track } from "@/lib/analytics";

const PRESETS = [3, 5, 10];

export function TimeToRecover({ drawdown }: { drawdown: number }) {
  const t = useT();
  const [monthly, setMonthly] = useState(5);
  const recovery = calcRecovery(drawdown);
  const months = monthsToRecover(recovery, monthly);

  const label = (() => {
    if (!Number.isFinite(months)) return t("time.impossible");
    if (months <= 0) return `0 ${t("time.month")}`;
    if (months < 12) return `${months.toFixed(months < 3 ? 1 : 0)} ${t("time.month")}`;
    const years = months / 12;
    return `${years.toFixed(1)} ${t("time.year")} (${Math.round(months)} ${t("time.month")})`;
  })();

  return (
    <div className="rounded-xl border bg-card/40 p-3 sm:p-4">
      <div className="mb-2 flex items-center gap-2">
        <Clock className="h-3.5 w-3.5 text-primary" />
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {t("time.title")}
        </h3>
      </div>

      <div className="flex items-center justify-between gap-3">
        <label className="text-xs text-muted-foreground" htmlFor="ttr-monthly">
          {t("time.input")}
        </label>
        <div className="flex items-center gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => {
                setMonthly(p);
                track("recovery_time_calc", { monthly: p });
              }}
              className={`rounded-md border px-2 py-0.5 text-[11px] font-bold tabular transition-colors ${
                monthly === p
                  ? "border-primary bg-primary/10 text-primary"
                  : "bg-background text-foreground hover:border-primary"
              }`}
            >
              {p}%
            </button>
          ))}
          <input
            id="ttr-monthly"
            type="text"
            inputMode="decimal"
            value={monthly}
            onChange={(e) => {
              const n = parseFloat(e.target.value.replace(",", "."));
              setMonthly(Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : 0);
            }}
            className="h-7 w-12 rounded-md border bg-background text-center text-xs font-bold tabular focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          />
        </div>
      </div>

      <div className="mt-2 flex items-baseline justify-between border-t pt-2">
        <span className="text-[11px] text-muted-foreground">{t("time.hint")}</span>
        <span className="font-display text-base font-bold tabular tracking-tight text-primary">
          {label}
        </span>
      </div>
    </div>
  );
}
