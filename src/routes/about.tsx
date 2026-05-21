import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/about")({

  head: () => ({
    meta: [
      { title: "Tentang Drawdown — DrawdownCal" },
      {
        name: "description",
        content:
          "Pengertian drawdown, rumus pemulihan, dan kenapa pemulihan modal bersifat asimetris bagi trader.",
      },
      { property: "og:title", content: "Tentang Drawdown — DrawdownCal" },
      {
        property: "og:description",
        content:
          "Definisi drawdown, rumus recovery = dd/(100−dd)×100, dan tabel contoh pemulihan.",
      },
      { property: "og:url", content: "https://drawdowncal.lovable.app/about" },
    ],
    links: [{ rel: "canonical", href: "https://drawdowncal.lovable.app/about" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "Apa itu drawdown?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Drawdown adalah persentase penurunan modal dari titik tertinggi (peak) ke titik terendah (trough) sebelum naik kembali.",
              },
            },
            {
              "@type": "Question",
              name: "Kenapa pemulihan drawdown asimetris?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Saat modal turun, basis kalkulasi ikut mengecil. Untuk kembali ke modal awal, kenaikan persentasenya harus lebih besar dari penurunannya. Rumusnya: recovery % = dd / (100 − dd) × 100.",
              },
            },
          ],
        }),
      },
    ],
  }),
  component: AboutPage,
});



function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-xl flex-col gap-4 px-3 py-3 sm:py-6">
        <Header />
        <article className="space-y-4 rounded-xl border bg-card p-4 shadow-sm sm:p-5">
          <h1 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
            Tentang Drawdown
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            <strong className="text-foreground">Drawdown</strong> adalah
            persentase penurunan modal dari titik tertinggi (peak) ke titik
            terendah (trough) sebelum naik kembali.
          </p>

          <div className="rounded-lg bg-primary-soft/60 p-3">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-primary">
              Rumus pemulihan
            </div>
            <div className="font-display tabular mt-1 text-base font-bold">
              recovery % = dd / (100 − dd) × 100
            </div>
          </div>

          <div>
            <h2 className="font-display text-base font-bold">
              Kenapa pemulihan asimetris?
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Saat modal turun, basis kalkulasi ikut mengecil. Untuk kembali ke
              modal awal, kenaikan persentasenya harus lebih besar dari
              penurunannya.
            </p>
          </div>

          <ul className="space-y-1.5 text-sm">
            {[
              ["10% drawdown", "butuh +11,1%"],
              ["25% drawdown", "butuh +33,3%"],
              ["50% drawdown", "butuh +100%"],
              ["75% drawdown", "butuh +300%"],
              ["90% drawdown", "butuh +900%"],
            ].map(([dd, rec]) => (
              <li
                key={dd}
                className="flex justify-between border-b border-border/50 py-1 last:border-0"
              >
                <span className="text-muted-foreground">{dd}</span>
                <span className="font-display tabular font-bold text-primary">
                  {rec}
                </span>
              </li>
            ))}
          </ul>
        </article>
        <Footer />
      </div>
    </div>
  );
}
