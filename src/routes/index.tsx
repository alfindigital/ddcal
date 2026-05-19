import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Flame } from "lucide-react";
import { Header } from "@/components/Header";
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
          "Hitung berapa persen kenaikan yang dibutuhkan untuk pulih dari drawdown. Tersedia mode persentase dan equity.",
      },
      { property: "og:title", content: "DrawdownCal" },
      {
        property: "og:description",
        content: "Makin besar drawdown, makin berat pulih.",
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
      <div className="mx-auto flex max-w-2xl flex-col gap-5 px-4 py-6 sm:py-10">
        <Header />

        <Card>
          <Tabs defaultValue="pct" className="w-full">
            <TabsList className="grid h-auto w-full grid-cols-2 rounded-none border-b bg-transparent p-0">
              <TabsTrigger
                value="pct"
                className="rounded-none border-b-2 border-transparent py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                Persentase
              </TabsTrigger>
              <TabsTrigger
                value="eq"
                className="rounded-none border-b-2 border-transparent py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                Equity
              </TabsTrigger>
            </TabsList>
            <div className="space-y-5 p-5">
              <TabsContent value="pct" className="mt-0">
                <PercentTab value={drawdown} onChange={setDrawdown} />
              </TabsContent>
              <TabsContent value="eq" className="mt-0">
                <EquityTab onDerivedDrawdown={setDrawdown} />
              </TabsContent>
              <ResultCard drawdown={drawdown} />
            </div>
          </Tabs>
        </Card>

        <Card>
          <div ref={chartRef} className="p-4 sm:p-5">
            <DrawdownChart active={drawdown} />
          </div>
        </Card>

        <ActionsRow drawdown={drawdown} chartRef={chartRef} />

        <footer className="pt-2 pb-6 text-center text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            Made with <Flame className="h-3.5 w-3.5 text-primary" /> by{" "}
            <a
              href="https://instagram.com/alfndigital"
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              @alfndigital
            </a>
          </span>
        </footer>
      </div>
      <Toaster />
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      {children}
    </div>
  );
}
