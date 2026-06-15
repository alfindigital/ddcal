import { IconButton } from "./IconButton";
import { setLocale, useLocale, useT } from "@/lib/i18n";

export function LocaleToggle() {
  const loc = useLocale();
  const t = useT();
  const next = loc === "id" ? "en" : "id";
  return (
    <IconButton
      aria-label={t("label.locale")}
      title={`${t("label.locale")}: ${loc.toUpperCase()} → ${next.toUpperCase()}`}
      onClick={() => setLocale(next)}
    >
      <span className="text-[11px] font-bold uppercase tabular tracking-tight">
        {loc}
      </span>
    </IconButton>
  );
}
