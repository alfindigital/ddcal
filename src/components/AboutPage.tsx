import { useState } from "react";
import { Lightbulb } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ReferenceTable } from "@/components/ReferenceTable";
import { TimeToRecover } from "@/components/TimeToRecover";
import { CompareScenarios } from "@/components/CompareScenarios";
import { CtaCard } from "@/components/CtaCard";
import { Toaster } from "@/components/ui/sonner";
import { useT } from "@/lib/i18n";

export function AboutPage() {
  const t = useT();
  const [dd] = useState(30);

  const faqs = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
  ];
  const tips = [t("about.tip1"), t("about.tip2"), t("about.tip3"), t("about.tip4")];

  return (
    <div className="bg-background text-foreground">
      <div className="mx-auto flex min-h-[100svh] max-w-xl flex-col gap-6 px-3 pt-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-4 sm:pt-6">
        <Header currentDrawdown={dd} />

        <header className="space-y-2">
          <h1 className="font-display text-xl font-bold leading-tight tracking-tight text-foreground sm:text-2xl">
            {t("content.lead")}
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">{t("content.sub")}</p>
        </header>

        <TimeToRecover drawdown={dd} />

        <CompareScenarios current={dd} />

        <section className="space-y-3">
          <h2 className="font-display text-base font-bold tracking-tight">
            {t("content.how_heading")}
          </h2>
          <div className="rounded-xl border bg-primary-soft/40 p-3 sm:p-4">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t("content.formula_heading")}
            </div>
            <div className="mt-1 font-display text-sm font-bold tabular tracking-tight text-foreground">
              recovery % = dd / (100 − dd) × 100
            </div>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">{t("about.explain")}</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-base font-bold tracking-tight">
            {t("about.reference")}
          </h2>
          <ReferenceTable />
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-base font-bold tracking-tight">{t("about.tips")}</h2>
          <ul className="space-y-1.5 text-[13px] leading-relaxed text-muted-foreground">
            {tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <Lightbulb className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-base font-bold tracking-tight">{t("faq.heading")}</h2>
          <div className="divide-y divide-border/60 overflow-hidden rounded-xl border">
            {faqs.map((f) => (
              <details key={f.q} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2.5 text-sm font-semibold text-foreground marker:hidden">
                  {f.q}
                  <span className="text-muted-foreground transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="px-3 pb-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
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
