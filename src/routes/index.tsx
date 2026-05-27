import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PercentTab } from "@/components/PercentTab";
import { EquityTab } from "@/components/EquityTab";
import { ResultCard } from "@/components/ResultCard";
import { DrawdownChart } from "@/components/DrawdownChart";
import { ActionsRow } from "@/components/ActionsRow";
import { HistoryDialog } from "@/components/HistoryDialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/sonner";
import { calcRecovery } from "@/lib/drawdown";
import {
  appendHistory,
  HistoryEntry,
  HistoryMode,
  loadHistory,
  saveHistory,
} from "@/lib/history";

const APP_URL = "https://drawdowncal.lovable.app";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DrawdownCal — Kalkulator Drawdown & Pemulihan Modal Trading" },
      {
        name: "description",
        content:
          "Hitung persen kenaikan yang dibutuhkan untuk pulih dari minus trading. Mode persentase & equity dalam satu alat simpel.",
      },
      {
        property: "og:title",
        content: "DrawdownCal — Kalkulator Drawdown & Pemulihan Modal Trading",
      },
      {
        property: "og:description",
        content:
          "Hitung persen kenaikan yang dibutuhkan untuk pulih dari minus trading. Mode persentase & equity dalam satu alat simpel.",
      },
      { property: "og:url", content: `${APP_URL}/` },
      { property: "og:image", content: `${APP_URL}/og-image.jpg` },
      { name: "twitter:image", content: `${APP_URL}/og-image.jpg` },
    ],
    links: [{ rel: "canonical", href: `${APP_URL}/` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "Apa itu drawdown dalam trading?",
              acceptedAnswer: {
                "@type": "Answer",
                text:
                  "Drawdown adalah persentase penurunan modal dari titik tertinggi (peak) ke titik terendah (trough) sebelum naik kembali. Dalam trading saham, drawdown menunjukkan seberapa besar kerugian yang dialami portofolio dari nilai tertingginya.",
              },
            },
            {
              "@type": "Question",
              name: "Bagaimana cara menghitung recovery dari drawdown?",
              acceptedAnswer: {
                "@type": "Answer",
                text:
                  "Rumus: Recovery % = Drawdown ÷ (100 - Drawdown) × 100. Contoh: drawdown 50% membutuhkan recovery 100% untuk kembali ke modal awal.",
              },
            },
            {
              "@type": "Question",
              name:
                "Berapa persen profit yang dibutuhkan untuk pulih dari kerugian 50%?",
              acceptedAnswer: {
                "@type": "Answer",
                text:
                  "Jika modal turun 50%, dibutuhkan kenaikan 100% dari modal yang tersisa untuk kembali ke modal awal. Ini karena recovery dihitung dari basis modal yang lebih kecil, bukan dari modal awal.",
              },
            },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "DrawdownCal",
          description:
            "Kalkulator drawdown dan pemulihan modal trading. Hitung berapa persen profit yang dibutuhkan untuk pulih dari kerugian investasi.",
          url: APP_URL,
          applicationCategory: "FinanceApplication",
          operatingSystem: "Web",
          offers: { "@type": "Offer", price: "0", priceCurrency: "IDR" },
          inLanguage: "id",
        }),
      },
    ],
  }),
  component: Home,
});

function Home() {
  const [drawdown, setDrawdown] = useState(30);
  const [chartDrawdown, setChartDrawdown] = useState<number | null>(null);
  const [animDuration, setAnimDuration] = useState<number>(350);
  const [mode, setMode] = useState<HistoryMode>("persen");
  const [equityInitial, setEquityInitial] = useState(10_000_000);
  const [equityCurrent, setEquityCurrent] = useState(7_000_000);
  const [historyOpen, setHistoryOpen] = useState(false);
  const smoothAnim = true;
  const effectiveDrawdown = chartDrawdown ?? drawdown;

  const handleSliderChange = (n: number) => {
    setChartDrawdown(null);
    setAnimDuration(350);
    setDrawdown(n);
  };

  const handleEquityChange = useCallback((n: number) => {
    setChartDrawdown(null);
    setAnimDuration(350);
    setDrawdown(n);
  }, []);

  const handleChartActive = (n: number, velocity?: number) => {
    const v = velocity ?? 0;
    const duration = Math.max(120, Math.min(500, 400 - v * 120));
    setAnimDuration(duration);
    setChartDrawdown(n);
  };

  // Debounced history save
  const historyRef = useRef<HistoryEntry[]>([]);
  useEffect(() => {
    historyRef.current = loadHistory();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      const recovery = calcRecovery(effectiveDrawdown);
      const next = appendHistory(historyRef.current, {
        mode,
        drawdownPct: effectiveDrawdown,
        recoveryPct: Number.isFinite(recovery) ? Math.round(recovery * 10) / 10 : 0,
        equityAwal: mode === "equity" ? equityInitial : null,
        equityTersisa: mode === "equity" ? equityCurrent : null,
      });
      if (next !== historyRef.current) {
        historyRef.current = next;
        saveHistory(next);
      }
    }, 2000);
    return () => clearTimeout(t);
  }, [effectiveDrawdown, mode, equityInitial, equityCurrent]);

  const handleLoadHistory = (e: HistoryEntry) => {
    setMode(e.mode);
    if (e.mode === "equity" && e.equityAwal != null && e.equityTersisa != null) {
      setEquityInitial(e.equityAwal);
      setEquityCurrent(e.equityTersisa);
    }
    setChartDrawdown(null);
    setDrawdown(e.drawdownPct);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-xl flex-col gap-3 px-3 py-3 sm:gap-4 sm:px-4 sm:py-6">
        <Header
          currentDrawdown={effectiveDrawdown}
          onOpenHistory={() => setHistoryOpen(true)}
        />
        <h1 className="sr-only">Kalkulator Drawdown & Pemulihan</h1>

        <main className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <Tabs
            value={mode === "persen" ? "pct" : "eq"}
            onValueChange={(v) => setMode(v === "eq" ? "equity" : "persen")}
            className="w-full"
          >
            <TabsList className="grid h-auto w-full grid-cols-2 rounded-none border-b bg-transparent p-0">
              <TabsTrigger
                value="pct"
                className="rounded-none border-b-2 border-transparent py-3 text-sm font-semibold tracking-wide data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                Persentase
              </TabsTrigger>
              <TabsTrigger
                value="eq"
                className="rounded-none border-b-2 border-transparent py-3 text-sm font-semibold tracking-wide data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                Equity
              </TabsTrigger>
            </TabsList>
            <div className="space-y-3 p-3 sm:p-4">
              <TabsContent value="pct" className="mt-0 space-y-3">
                <PercentTab value={drawdown} onChange={handleSliderChange} />
              </TabsContent>
              <TabsContent value="eq" className="mt-0">
                <EquityTab
                  initial={equityInitial}
                  current={equityCurrent}
                  onInitialChange={setEquityInitial}
                  onCurrentChange={setEquityCurrent}
                  onDerivedDrawdown={handleEquityChange}
                />
              </TabsContent>
              <ResultCard
                drawdown={effectiveDrawdown}
                animationDuration={animDuration}
                smoothEnabled={smoothAnim}
              />
            </div>
          </Tabs>
          <div className="border-t p-3 sm:p-4">
            <DrawdownChart
              active={effectiveDrawdown}
              onActiveChange={handleChartActive}
              smoothEnabled={smoothAnim}
              animationDuration={animDuration}
            />
          </div>
          <div className="border-t p-3 sm:p-4">
            <ActionsRow
              drawdown={effectiveDrawdown}
              mode={mode}
              equityInitial={equityInitial}
              equityCurrent={equityCurrent}
            />
          </div>
        </main>

        <section className="mt-4 border-t border-border/60 pt-6">
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            Apa Itu Drawdown dalam Trading?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            <strong className="font-semibold text-foreground">Drawdown</strong>{" "}
            adalah persentase penurunan modal dari titik tertinggi (peak) ke
            titik terendah (trough) sebelum naik kembali. Dalam trading saham,
            drawdown menunjukkan seberapa besar kerugian yang dialami
            portofolio dari nilai tertingginya. Memahami drawdown penting
            karena hubungan antara kerugian dan pemulihan bersifat
            eksponensial — semakin besar drawdown, semakin sulit dan lama
            proses pemulihannya.
          </p>

          <h2 className="mt-6 text-lg font-bold tracking-tight text-foreground">
            Cara Menghitung Recovery dari Drawdown
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Rumus menghitung persentase pemulihan yang dibutuhkan:
          </p>
          <p className="mt-2 rounded-lg bg-muted/60 px-4 py-3 font-display tabular text-sm font-bold text-foreground">
            Recovery % = Drawdown ÷ (100 − Drawdown) × 100
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Contoh: Jika modal turun 50% (drawdown 50%), maka sisa modal
            adalah 50% dari modal awal. Untuk kembali ke modal awal, kamu
            butuh kenaikan 100% dari modal yang tersisa — bukan 50%. Inilah
            mengapa risk management lebih penting daripada mengejar profit
            besar.
          </p>

          <h3 className="mt-4 text-base font-semibold text-foreground">
            Contoh Perhitungan
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            <strong className="font-semibold text-foreground">
              Modal awal Rp100 juta, turun 30%
            </strong>{" "}
            → sisa Rp70 juta. Recovery dibutuhkan: 30 ÷ (100−30) × 100 =
            42,9%. Artinya butuh profit Rp30 juta dari modal Rp70 juta =
            42,9%.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            <strong className="font-semibold text-foreground">
              Modal awal Rp100 juta, turun 50%
            </strong>{" "}
            → sisa Rp50 juta. Recovery dibutuhkan: 50 ÷ (100−50) × 100 = 100%.
            Butuh profit Rp50 juta dari modal Rp50 juta = 100% — dua kali
            lipat!
          </p>

          <h2 className="mt-6 text-lg font-bold tracking-tight text-foreground">
            Kenapa Risk Management Lebih Penting dari Profit?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Banyak trader fokus mengejar cuan besar tapi mengabaikan potensi
            kerugian. Padahal, kerugian kecil jauh lebih mudah dipulihkan
            daripada kerugian besar.{" "}
            <strong className="font-semibold text-foreground">
              Drawdown 10% hanya butuh 11,1% untuk pulih.
            </strong>{" "}
            Tapi drawdown 50% butuh 100%, dan drawdown 90% butuh 900%. Trader
            profesional memprioritaskan membatasi kerugian (cut loss)
            daripada mengejar profit maksimal di setiap transaksi.
          </p>
        </section>

        <p className="mb-2 mt-2 text-center text-[10px] italic text-muted-foreground/70">
          Kalkulator ini hanya untuk edukasi. Bukan rekomendasi investasi atau
          trading.
        </p>

        <Footer />
      </div>

      <HistoryDialog
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        onLoad={handleLoadHistory}
      />
      <Toaster />
    </div>
  );
}
