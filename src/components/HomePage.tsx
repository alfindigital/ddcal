import { useCallback, useEffect, useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PercentTab } from "@/components/PercentTab";
import { EquityTab } from "@/components/EquityTab";
import { ResultCard } from "@/components/ResultCard";
import { DrawdownChart } from "@/components/DrawdownChart";
import { ActionsRow } from "@/components/ActionsRow";
import { InstallPrompt } from "@/components/InstallPrompt";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/sonner";
import { useT } from "@/lib/i18n";
import { SITE_URL } from "@/lib/seo";
import { calcDrawdownFromCapital, formatPercentSmart } from "@/lib/drawdown";
import { track } from "@/lib/analytics";
import { PartyPopper } from "lucide-react";

const ANIM = 350;

export type HomeInitial = {
  dd: number;
  mode: "pct" | "eq";
  awal: number;
  sisa: number;
};

function buildQuery(
  drawdown: number,
  mode: "persen" | "equity",
  awal: number,
  sisa: number,
): string {
  const p = new URLSearchParams();
  if (mode === "equity") {
    p.set("mode", "eq");
    p.set("awal", String(awal));
    p.set("sisa", String(sisa));
  } else if (Math.round(drawdown) !== 30) {
    p.set("dd", String(Math.round(drawdown)));
  }
  return p.toString();
}

export function HomePage({ initial }: { initial: HomeInitial }) {
  const tr = useT();

  const [drawdown, setDrawdown] = useState(initial.dd);
  const [mode, setMode] = useState<"persen" | "equity">(
    initial.mode === "eq" ? "equity" : "persen",
  );
  const [equityInitial, setEquityInitial] = useState(initial.awal);
  const [equityCurrent, setEquityCurrent] = useState(initial.sisa);

  const handleSliderChange = (n: number) => setDrawdown(n);
  const handleChartActive = (n: number) => setDrawdown(n);
  const handleEquityChange = useCallback((n: number) => setDrawdown(n), []);

  const inProfit = mode === "equity" && equityCurrent > equityInitial && equityInitial > 0;
  const profitPct = inProfit ? Math.abs(calcDrawdownFromCapital(equityInitial, equityCurrent)) : 0;

  // URL state sync (replaceState — no router churn) + share deep link.
  const query = useMemo(
    () => buildQuery(drawdown, mode, equityInitial, equityCurrent),
    [drawdown, mode, equityInitial, equityCurrent],
  );
  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = setTimeout(() => {
      const url = window.location.pathname + (query ? `?${query}` : "");
      window.history.replaceState(window.history.state, "", url);
    }, 300);
    return () => clearTimeout(id);
  }, [query]);

  const [origin, setOrigin] = useState(SITE_URL);
  useEffect(() => {
    if (typeof window !== "undefined") setOrigin(window.location.origin);
  }, []);
  const shareUrl = `${origin}/${query ? `?${query}` : ""}`;

  const Calculator = (
    <main className="overflow-hidden rounded-2xl border bg-card shadow-[var(--shadow-elegant)]">
      <Tabs
        value={mode === "persen" ? "pct" : "eq"}
        onValueChange={(v) => {
          setMode(v === "eq" ? "equity" : "persen");
          track("mode_switch", { mode: v });
        }}
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

          {inProfit ? (
            <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-3 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              <PartyPopper className="h-4 w-4 shrink-0" />
              {tr("profit.banner", { n: formatPercentSmart(profitPct) })}
            </div>
          ) : (
            <ResultCard drawdown={drawdown} animationDuration={ANIM} smoothEnabled />
          )}
        </div>
      </Tabs>
      <div className="space-y-2 border-t p-3 sm:p-4">
        <DrawdownChart
          active={drawdown}
          onActiveChange={handleChartActive}
          smoothEnabled
          animationDuration={ANIM}
        />
      </div>
      <div className="border-t p-3 sm:p-4">
        <ActionsRow
          drawdown={drawdown}
          mode={mode}
          equityInitial={equityInitial}
          equityCurrent={equityCurrent}
          shareUrl={shareUrl}
        />
      </div>
    </main>
  );

  return (
    <div className="bg-background text-foreground">
      <div className="mx-auto flex min-h-[100svh] max-w-xl flex-col gap-5 px-3 pt-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:gap-6 sm:px-4 sm:pt-6 sm:pb-[max(1rem,env(safe-area-inset-bottom))] lg:max-w-5xl">
        <div className="dd-fade" style={{ animationDelay: "0ms" }}>
          <Header currentDrawdown={drawdown} />
        </div>

        <h1 className="sr-only">{tr("seo.h1")}</h1>

        <div className="dd-fade" style={{ animationDelay: "120ms" }}>
          {Calculator}
        </div>

        <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
          {tr("privacy")}
          <br />
          {tr("disclaimer")}
        </p>


        <div className="dd-fade mt-auto" style={{ animationDelay: "220ms" }}>
          <Footer />
        </div>
      </div>

      <Toaster />
      <InstallPrompt />
    </div>
  );
}
