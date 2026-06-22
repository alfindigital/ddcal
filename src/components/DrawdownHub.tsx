import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ReferenceTable } from "@/components/ReferenceTable";
import { CtaCard } from "@/components/CtaCard";
import { Toaster } from "@/components/ui/sonner";
import { useT, type Locale } from "@/lib/i18n";
import { REFERENCE_BUCKETS, calcRecovery, formatPercent } from "@/lib/drawdown";

export function DrawdownHub({ locale }: { locale: Locale }) {
  const t = useT();
  const base = locale === "en" ? "/en" : "";

  return (
    <div className="bg-background text-foreground">
      <div className="mx-auto flex min-h-[100svh] max-w-xl flex-col gap-5 px-3 pt-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:gap-6 sm:px-4 sm:pt-6 lg:max-w-3xl">
        <Header currentDrawdown={30} />

        <header className="space-y-2">
          <h1 className="font-display text-xl font-bold leading-tight tracking-tight sm:text-2xl">
            {t("landing.back")}
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">{t("content.sub")}</p>
        </header>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {REFERENCE_BUCKETS.map((b) => (
            <a
              key={b}
              href={`${base}/drawdown/${b}`}
              className="flex items-center justify-between rounded-xl border bg-card px-3 py-2.5 transition-colors hover:border-primary"
            >
              <span className="font-display text-sm font-bold tabular text-foreground">-{b}%</span>
              <span className="text-xs font-bold tabular text-primary">
                +{formatPercent(calcRecovery(b))}%
              </span>
            </a>
          ))}
        </div>

        <section className="space-y-2">
          <h2 className="font-display text-base font-bold tracking-tight">
            {t("about.reference")}
          </h2>
          <ReferenceTable />
        </section>

        <CtaCard />

        <div className="mt-auto">
          <Footer />
        </div>
      </div>
      <Toaster />
    </div>
  );
}
