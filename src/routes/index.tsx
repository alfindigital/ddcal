import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
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
      { title: "DrawdownCal — Kalkulator Drawdown & Pemulihan" },
      {
        name: "description",
        content:
          "Hitung berapa persen kenaikan yang dibutuhkan untuk pulih dari drawdown. Mode persentase & equity.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const [drawdown, setDrawdown] = useState(30);
  const chartRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-xl flex-col gap-3 px-3 py-3 sm:gap-4 sm:px-4 sm:py-6">
        <Header />

        <main className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <Tabs defaultValue="pct" className="w-full">
            <TabsList className="flex h-auto w-full rounded-none border-b bg-transparent p-0">
              <TabsTrigger
                value="pct"
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
                <PercentTab value={drawdown} onChange={setDrawdown} />
              </TabsContent>
              <TabsContent value="eq" className="mt-0">
                <EquityTab onDerivedDrawdown={setDrawdown} />
              </TabsContent>
              <ResultCard drawdown={drawdown} />
            </div>
          </Tabs>
          <div ref={chartRef} className="border-t p-3 sm:p-4">
            <DrawdownChart active={drawdown} />
          </div>
          <div className="border-t p-3 sm:p-4">
            <ActionsRow drawdown={drawdown} chartRef={chartRef} />
          </div>
        </main>



        <Footer />
      </div>
      <Toaster />
    </div>
  );
}
