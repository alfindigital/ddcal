import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PercentTab } from "@/components/PercentTab";
import { EquityTab } from "@/components/EquityTab";
import { ResultCard } from "@/components/ResultCard";
import { DrawdownChart } from "@/components/DrawdownChart";
import { ActionsRow } from "@/components/ActionsRow";
import { InstallPrompt } from "@/components/InstallPrompt";
import { TimeToRecover } from "@/components/TimeToRecover";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/sonner";
import { useT } from "@/lib/i18n";
import { SITE_URL } from "@/lib/seo";
import { calcCapitalChangePct, formatPercentSmart, isInProfit } from "@/lib/drawdown";
import { track } from "@/lib/analytics";
import { PartyPopper } from "lucide-react";

const ANIM = 350;
const DEFAULT_DD = 30;
const DEFAULT_AWAL = 10_000_000;
const DEFAULT_SISA = 7_000_000;

export type HomeInitial = {
  dd: number;
  mode: "pct" | "eq";
  awal: number;
  sisa: number;
};

function buildSearch(
  drawdown: number,
  mode: "persen" | "equity",
  awal: number,
  sisa: number,
): { dd?: number; mode?: "pct" | "eq"; awal?: number; sisa?: number } {
  if (mode === "equity") {
    const search: { mode: "eq"; awal?: number; sisa?: number } = { mode: "eq" };
    if (awal !== DEFAULT_AWAL) search.awal = awal;
    if (sisa !== DEFAULT_SISA) search.sisa = sisa;
    return search;
  }
  const rounded = Math.round(drawdown);
  if (rounded !== DEFAULT_DD) return { dd: rounded };
  return {};
}

export function HomePage({ initial }: { initial: HomeInitial }) {
  const tr = useT();
  const navigate = useNavigate({ from: "/" });

  const [drawdown, setDrawdown] = useState(initial.dd);
  const [mode, setMode] = useState<"persen" | "equity">(
    initial.mode === "eq" ? "equity" : "persen",
  );
  const [equityInitial, setEquityInitial] = useState(initial.awal);
  const [equityCurrent, setEquityCurrent] = useState(initial.sisa);

  const handleSliderChange = (n: number) => setDrawdown(n);
  const handleChartActive = (n: number) => setDrawdown(n);
  const handleEquityChange = useCallback((n: number) => setDrawdown(n), []);

  const inProfit = mode === "equity" && isInProfit(equityInitial, equityCurrent);
  const profitPct = inProfit ? Math.abs(calcCapitalChangePct(equityInitial, equityCurrent)) : 0;

  // URL state sync via the router (keeps history + router search in sync).
  const search = useMemo(
    () => buildSearch(drawdown, mode, equityInitial, equityCurrent),
    [drawdown, mode, equityInitial, equityCurrent],
  );
  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = setTimeout(() => {
      void navigate({ search, replace: true });
    }, 300);
    return () => clearTimeout(id);
  }, [search, navigate]);

  const [origin, setOrigin] = useState(SITE_URL);
  useEffect(() => {
    if (typeof window !== "undefined") setOrigin(window.location.origin);
  }, []);

  const queryString = useMemo(() => {
    const p = new URLSearchParams();
    if (search.mode) p.set("mode", search.mode);
    if (search.dd != null) p.set("dd", String(search.dd));
    if (search.awal != null) p.set("awal", String(search.awal));
    if (search.sisa != null) p.set("sisa", String(search.sisa));
    return p.toString();
  }, [search]);
  // Avoid trailing slash before "?" (canonical-friendly share URLs).
  const shareUrl = queryString ? `${origin}/?${queryString}` : `${origin}/`;

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
            <>
              <ResultCard drawdown={drawdown} animationDuration={ANIM} smoothEnabled />
              <TimeToRecover drawdown={drawdown} />
            </>
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
