import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PercentTab } from "@/components/PercentTab";
import { EquityTab } from "@/components/EquityTab";
import { ResultCard } from "@/components/ResultCard";
import { DrawdownChart } from "@/components/DrawdownChart";
import { ActionsRow } from "@/components/ActionsRow";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { Toaster } from "@/components/ui/sonner";

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
      { property: "og:url", content: "https://drawdowncal.lovable.app/" },
      { property: "og:image", content: "https://drawdowncal.lovable.app/og-image.jpg" },
      { name: "twitter:image", content: "https://drawdowncal.lovable.app/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://drawdowncal.lovable.app/" }],
  }),
  component: Home,
});

function Home() {
  const [drawdown, setDrawdown] = useState(30);
  const [chartDrawdown, setChartDrawdown] = useState<number | null>(null);
  const [animDuration, setAnimDuration] = useState<number>(350);
  const [smoothAnim, setSmoothAnim] = useState(true);
  const effectiveDrawdown = chartDrawdown ?? drawdown;

  const handleSliderChange = (n: number) => {
    setChartDrawdown(null);
    setAnimDuration(350);
    setDrawdown(n);
  };

  const handleEquityChange = (n: number) => {
    setChartDrawdown(null);
    setAnimDuration(350);
    setDrawdown(n);
  };

  const handleChartActive = (n: number, velocity?: number) => {
    // velocity in px/ms. Fast scroll → snappier (shorter duration),
    // slow scroll → softer (longer duration). Clamp to a comfortable range.
    const v = velocity ?? 0;
    const duration = Math.max(120, Math.min(500, 400 - v * 120));
    setAnimDuration(duration);
    setChartDrawdown(n);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">

      <div className="mx-auto flex max-w-xl flex-col gap-3 px-3 py-3 sm:gap-4 sm:px-4 sm:py-6">
        <Header />
        <h1 className="sr-only">Kalkulator Drawdown & Pemulihan</h1>

        <main className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <Tabs defaultValue="pct" className="w-full">
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
                <EquityTab onDerivedDrawdown={handleEquityChange} />
              </TabsContent>
              <ResultCard drawdown={effectiveDrawdown} animationDuration={animDuration} smoothEnabled={smoothAnim} />
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
            <ActionsRow drawdown={effectiveDrawdown} />
          </div>
        </main>



        <Footer />
      </div>
      <Toaster />
    </div>
  );
}
