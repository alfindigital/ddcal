import { formatRupiah, calcDrawdownFromCapital } from "@/lib/drawdown";
import { useEffect, useId, useState } from "react";
import { useT } from "@/lib/i18n";
import { track } from "@/lib/analytics";

const MAX_CAP = 1_000_000_000_000;

export function EquityTab({
  initial,
  current,
  onInitialChange,
  onCurrentChange,
  onDerivedDrawdown,
}: {
  initial: number;
  current: number;
  onInitialChange: (n: number) => void;
  onCurrentChange: (n: number) => void;
  onDerivedDrawdown: (d: number) => void;
}) {
  const t = useT();

  // Precise derived drawdown — keep one decimal, never fake integer precision.
  useEffect(() => {
    const dd = calcDrawdownFromCapital(initial, current);
    const clamped = Math.max(0, Math.min(99, dd));
    onDerivedDrawdown(Math.round(clamped * 10) / 10);
  }, [initial, current, onDerivedDrawdown]);

  return (
    <div className="space-y-2">
      <Field label={t("label.initial_capital")} value={initial} onChange={onInitialChange} />
      <Field label={t("label.current_capital")} value={current} onChange={onCurrentChange} />
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const [text, setText] = useState("");
  // While focused: raw digits the user typed (caret-stable). While blurred:
  // grouped currency for readability.
  const display = focused ? text : formatRupiah(value).replace(/^Rp/, "");

  return (
    <div className="flex items-center justify-between gap-3">
      <label
        htmlFor={id}
        className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
      >
        {label}
      </label>
      <div className="flex h-8 w-32 items-center rounded-md border bg-background px-2 focus-within:ring-2 focus-within:ring-primary/30 sm:w-40">
        <span className="pr-1 text-xs font-semibold text-muted-foreground">Rp</span>
        <input
          id={id}
          inputMode="numeric"
          value={display}
          onFocus={() => {
            setFocused(true);
            setText(value ? String(value) : "");
          }}
          onBlur={() => {
            setFocused(false);
            track("equity_input");
          }}
          onChange={(e) => {
            const digits = e.target.value.replace(/[^\d]/g, "");
            const n = Math.min(digits ? parseInt(digits, 10) : 0, MAX_CAP);
            setText(digits);
            onChange(n);
          }}
          className="w-full bg-transparent text-right font-display text-sm font-bold tabular tracking-tight focus:outline-none"
        />
      </div>
    </div>
  );
}
