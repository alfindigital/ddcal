import { Languages } from "lucide-react";
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
      <span className="relative inline-flex items-center">
        <Languages className="h-4 w-4" />
        <span className="ml-1 text-[10px] font-bold uppercase tabular tracking-tight">
          {loc}
        </span>
      </span>
    </IconButton>
  );
}
