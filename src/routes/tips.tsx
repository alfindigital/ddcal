import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";

export const Route = createFileRoute("/tips")({
  head: () => ({
    meta: [
      { title: "Tips Cegah Drawdown — DrawdownCal" },
      {
        name: "description",
        content:
          "Tujuh prinsip risk management untuk menjaga modal dari drawdown besar.",
      },
      { property: "og:title", content: "Tips Cegah Drawdown" },
      {
        property: "og:description",
        content: "Risk management ringkas untuk trader.",
      },
      { property: "og:url", content: "/tips" },
    ],
    links: [{ rel: "canonical", href: "/tips" }],
  }),
  component: TipsPage,
});

const TIPS: { title: string; body: string }[] = [
  {
    title: "Risiko per posisi 1–2%",
    body: "Batasi kerugian per trade ke 1–2% modal. Drawdown beruntun jadi terkendali.",
  },
  {
    title: "Selalu pasang stop loss",
    body: "Tentukan exit sebelum entry. Tanpa SL, satu trade bisa hapus puluhan kemenangan.",
  },
  {
    title: "Hindari revenge trade",
    body: "Setelah loss, jeda dulu. Trade balas dendam memperbesar drawdown secara emosional.",
  },
  {
    title: "Diversifikasi & korelasi",
    body: "Jangan tumpuk posisi berkorelasi tinggi. Risiko efektif bisa 2–3x dari yang terlihat.",
  },
  {
    title: "Jurnal setiap trade",
    body: "Catat setup, alasan, hasil. Pola kesalahan baru terlihat saat ditulis.",
  },
  {
    title: "Kurangi size saat losing streak",
    body: "Saat drawdown mencapai 10%, pangkas ukuran posisi setengahnya sampai equity pulih.",
  },
  {
    title: "Target realistis",
    body: "Compound 5–10% per bulan jauh lebih sustainable daripada 100% lalu blow up.",
  },
];

function TipsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-xl flex-col gap-4 px-3 py-3 sm:py-6">
        <Header />
        <article className="space-y-3 rounded-xl border bg-card p-4 shadow-sm sm:p-5">
          <h1 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
            Tips Cegah Drawdown
          </h1>
          <p className="text-sm text-muted-foreground">
            Tujuh prinsip ringkas untuk menjaga modal tetap utuh.
          </p>
          <ol className="space-y-2.5">
            {TIPS.map((t, i) => (
              <li
                key={t.title}
                className="flex gap-3 rounded-lg border bg-card p-3"
              >
                <span className="font-display tabular grid h-7 w-7 shrink-0 place-items-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <div className="font-display text-sm font-bold">
                    {t.title}
                  </div>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    {t.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </article>
      </div>
    </div>
  );
}
