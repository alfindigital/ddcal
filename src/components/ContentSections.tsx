import { ReferenceTable } from "./ReferenceTable";
import { useT } from "@/lib/i18n";

export function ContentSections() {
  const t = useT();
  const faqs = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
  ];

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h2 className="font-display text-base font-bold tracking-tight text-foreground">
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

      <section className="space-y-3">
        <h2 className="font-display text-base font-bold tracking-tight text-foreground">
          {t("about.reference")}
        </h2>
        <ReferenceTable />
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-base font-bold tracking-tight text-foreground">
          {t("faq.heading")}
        </h2>
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
    </div>
  );
}
