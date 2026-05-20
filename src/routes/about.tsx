import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Tentang Drawdown — DrawdownCal" },
      {
        name: "description",
        content:
          "Apa itu drawdown, kenapa pemulihan bersifat eksponensial, dan rumusnya.",
      },
      { property: "og:title", content: "Tentang Drawdown" },
      {
        property: "og:description",
        content: "Makin besar drawdown, makin berat pulih.",
      },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
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
      </div>
    </div>
  );
}
