import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PercentTab } from "@/components/PercentTab";
import { EquityTab } from "@/components/EquityTab";
import { ResultCard } from "@/components/ResultCard";
import { DrawdownChart } from "@/components/DrawdownChart";
import { ActionsRow } from "@/components/ActionsRow";
import { HistoryDialog } from "@/components/HistoryDialog";
import { InstallPrompt } from "@/components/InstallPrompt";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useT } from "@/lib/i18n";
import { Toaster } from "@/components/ui/sonner";
import { calcRecovery } from "@/lib/drawdown";
import {
  appendHistory,
  HistoryEntry,
  HistoryMode,
  loadHistory,
  saveHistory,
} from "@/lib/history";

import { SITE_URL, buildMeta } from "@/lib/seo";

const APP_URL = SITE_URL;
const PAGE_TITLE =
  "Kalkulator Drawdown & Recovery Trading | DrawdownCal";
const PAGE_DESC =
  "Hitung berapa persen profit yang dibutuhkan untuk pulih dari drawdown trading. Gunakan kalkulator drawdown & recovery ini dengan dua mode: persentase atau equity.";

const DEFAULT_DD = 30;
const DEFAULT_AWAL = 10_000_000;
const DEFAULT_SISA = 7_000_000;

const searchSchema = z.object({
  dd: fallback(z.number().int().min(1).max(99), DEFAULT_DD).default(DEFAULT_DD),
  mode: fallback(z.enum(["pct", "eq"]), "pct").default("pct"),
  awal: fallback(z.number().int().min(0).max(1_000_000_000_000), DEFAULT_AWAL).default(DEFAULT_AWAL),
  sisa: fallback(z.number().int().min(0).max(1_000_000_000_000), DEFAULT_SISA).default(DEFAULT_SISA),
});

export const Route = createFileRoute("/")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: buildMeta({
      title: PAGE_TITLE,
      description: PAGE_DESC,
      url: `${APP_URL}/`,
    }),
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
          "@type": "SoftwareApplication",
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
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/" });
  const tr = useT();

  const [drawdown, setDrawdown] = useState(search.dd);
  const [chartDrawdown, setChartDrawdown] = useState<number | null>(null);
  const [animDuration, setAnimDuration] = useState<number>(350);
  const [mode, setMode] = useState<HistoryMode>(
    search.mode === "eq" ? "equity" : "persen",
  );
  const [equityInitial, setEquityInitial] = useState(search.awal);
  const [equityCurrent, setEquityCurrent] = useState(search.sisa);
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

  // Debounced URL sync — keeps history clean (replace) and avoids spamming.
  const firstUrlSync = useRef(true);
  useEffect(() => {
    if (firstUrlSync.current) {
      firstUrlSync.current = false;
      return;
    }
    const t = setTimeout(() => {
      navigate({
        replace: true,
        search: () => {
          if (mode === "equity") {
            return {
              mode: "eq" as const,
              dd: DEFAULT_DD,
              awal: Math.round(equityInitial),
              sisa: Math.round(equityCurrent),
            };
          }
          return {
            mode: "pct" as const,
            dd: Math.round(effectiveDrawdown),
            awal: DEFAULT_AWAL,
            sisa: DEFAULT_SISA,
          };
        },
      });
    }, 400);
    return () => clearTimeout(t);
  }, [effectiveDrawdown, mode, equityInitial, equityCurrent, navigate]);

  // Debounced history save
  const historyRef = useRef<HistoryEntry[]>([]);
  useEffect(() => {
    historyRef.current = loadHistory();
    // Multi-tab sync: refresh in-memory ref when another tab edits history.
    const onStorage = (e: StorageEvent) => {
      if (e.key === "dd-history") historyRef.current = loadHistory();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
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


  const fade = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
  };
  const t = (i: number) => ({ duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] as const });

  return (
    <div className="bg-background text-foreground">
      <div className="mx-auto flex min-h-[100svh] max-w-xl flex-col gap-4 px-3 pt-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:gap-6 sm:px-4 sm:pt-6 sm:pb-[max(1rem,env(safe-area-inset-bottom))]">

        <motion.div {...fade} transition={t(0)}>
          <Header
            currentDrawdown={effectiveDrawdown}
            onOpenHistory={() => setHistoryOpen(true)}
          />
        </motion.div>

        <motion.main
          {...fade}
          transition={t(1)}
          className="overflow-hidden rounded-2xl border bg-card shadow-[var(--shadow-elegant)]"
        >
          <Tabs
            value={mode === "persen" ? "pct" : "eq"}
            onValueChange={(v) => setMode(v === "eq" ? "equity" : "persen")}
            className="w-full"
          >
            <TabsList className="grid h-14 w-full grid-cols-2 rounded-none border-b bg-transparent p-0">
              <TabsTrigger
                value="pct"
                className="rounded-none border-b-2 border-transparent py-2 text-sm font-bold uppercase tracking-[0.18em] data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                {tr("tab.percent")}
              </TabsTrigger>
              <TabsTrigger
                value="eq"
                className="rounded-none border-b-2 border-transparent py-2 text-sm font-bold uppercase tracking-[0.18em] data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                {tr("tab.equity")}
              </TabsTrigger>
            </TabsList>
            <div className="space-y-3 p-3 sm:p-4">
              <TabsContent value="pct" className="mt-0">
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
          <div className="space-y-2 border-t p-3 sm:p-4">
            <DrawdownChart
              active={effectiveDrawdown}
              onActiveChange={handleChartActive}
              smoothEnabled={smoothAnim}
              animationDuration={animDuration}
            />
          </div>
          <div className="space-y-2 border-t p-3 sm:p-4">
            <ActionsRow
              drawdown={effectiveDrawdown}
              mode={mode}
              equityInitial={equityInitial}
              equityCurrent={equityCurrent}
            />
          </div>
        </motion.main>

        <motion.div {...fade} transition={t(2)} className="mt-auto">
          <Footer />
        </motion.div>

      </div>

      <HistoryDialog
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        onLoad={handleLoadHistory}
      />
      <Toaster />
      <InstallPrompt />
    </div>
  );
}
