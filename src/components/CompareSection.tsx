import { useState } from "react";
import { ChevronDown, GitCompare } from "lucide-react";
import { calcRecovery, formatPercent } from "@/lib/drawdown";
import { useT } from "@/lib/i18n";

const PRESETS: { key: "compare.preset.mild" | "compare.preset.moderate" | "compare.preset.severe" | "compare.preset.extreme"; dd: number }[] = [
  { key: "compare.preset.mild", dd: 10 },
  { key: "compare.preset.moderate", dd: 30 },
  { key: "compare.preset.severe", dd: 50 },
  { key: "compare.preset.extreme", dd: 80 },
];

export function CompareSection({
  current,
  onPick,
}: {
  current: number;
  onPick: (dd: number) => void;
}) {
  const t = useT();
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border bg-card/40">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left sm:px-4"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          <GitCompare className="h-3.5 w-3.5" />
          {t("label.compare")}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="space-y-2 border-t px-3 py-3 sm:px-4">
          <p className="text-[11px] text-muted-foreground">{t("compare.helper")}</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {PRESETS.map((p) => {
              const rec = calcRecovery(p.dd);
              const active = Math.round(current) === p.dd;
              return (
                <button
                  key={p.dd}
                  type="button"
                  onClick={() => onPick(p.dd)}
                  className={`flex flex-col items-start gap-0.5 rounded-xl border px-3 py-2 text-left transition-colors ${
                    active
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-input bg-background hover:bg-accent"
                  }`}
                >
                  <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                    {t(p.key)}
                  </span>
                  <span className="font-display text-base font-bold tabular">
                    -{p.dd}%
                  </span>
                  <span className="text-[10px] font-semibold text-primary">
                    {t("label.recovery_short")} +{formatPercent(rec)}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
