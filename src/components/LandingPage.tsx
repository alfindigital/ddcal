import { ArrowRight, ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ResultCard } from "@/components/ResultCard";
import { DrawdownChart } from "@/components/DrawdownChart";
import { ReferenceTable } from "@/components/ReferenceTable";
import { CtaCard } from "@/components/CtaCard";
import { Toaster } from "@/components/ui/sonner";
import { useT, type Locale } from "@/lib/i18n";
import { calcRecovery, formatPercent, REFERENCE_BUCKETS } from "@/lib/drawdown";
import { track } from "@/lib/analytics";

export function LandingPage({ dd, locale }: { dd: number; locale: Locale }) {
  const t = useT();
  const recovery = calcRecovery(dd);
  const base = locale === "en" ? "/en" : "";
  const homeHref = `${locale === "en" ? "/en" : "/"}?dd=${dd}`;
  const related = REFERENCE_BUCKETS.filter((b) => b !== dd);

  return (
    <div className="bg-background text-foreground">
      <div className="mx-auto flex min-h-[100svh] max-w-xl flex-col gap-5 px-3 pt-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:gap-6 sm:px-4 sm:pt-6">
        <Header currentDrawdown={dd} />

        <a
          href={base === "" ? "/drawdown" : `${base}/drawdown`}
          className="inline-flex w-fit items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> {t("landing.back")}
        </a>

        <header className="space-y-2">
          <h1 className="font-display text-xl font-bold leading-tight tracking-tight text-foreground sm:text-2xl">
            {t("landing.h1", { dd })}
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {t("landing.intro", { dd, rec: formatPercent(recovery) })}
          </p>
        </header>

        <ResultCard drawdown={dd} smoothEnabled={false} />

        <div className="rounded-2xl border bg-card p-3 shadow-[var(--shadow-card)] sm:p-4">
          <DrawdownChart active={dd} staticRender />
        </div>

        <a
          href={homeHref}
          onClick={() => track("landing_cta_click", { dd })}
          className="flex h-11 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {t("landing.cta")} <ArrowRight className="h-4 w-4" />
        </a>

        <section className="space-y-2">
          <h2 className="font-display text-base font-bold tracking-tight">
            {t("about.reference")}
          </h2>
          <ReferenceTable />
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-base font-bold tracking-tight">
            {t("landing.related")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {related.map((b) => (
              <a
                key={b}
                href={`${base}/drawdown/${b}`}
                className="rounded-lg border bg-card px-3 py-1.5 text-xs font-bold tabular text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                -{b}%
              </a>
            ))}
          </div>
        </section>

        <CtaCard />

        <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
          {t("privacy")}
          <br />
          {t("disclaimer")}
        </p>

        <div className="mt-auto">
          <Footer />
        </div>
      </div>
      <Toaster />
    </div>
  );
}
