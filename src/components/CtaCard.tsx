import { Send } from "lucide-react";
import { useT } from "@/lib/i18n";
import { track } from "@/lib/analytics";

const TELEGRAM_URL = "https://t.me/alfidx";

export function CtaCard() {
  const t = useT();
  return (
    <section className="overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 to-primary/5 p-4 sm:p-5">
      <div className="flex items-center gap-4">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <Send className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-sm font-bold tracking-tight text-foreground sm:text-base">
            {t("cta.title")}
          </h2>
          <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{t("cta.body")}</p>
        </div>
      </div>
      <a
        href={TELEGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("cta_telegram")}
        className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <Send className="h-4 w-4" /> {t("cta.button")}
      </a>
    </section>
  );
}
