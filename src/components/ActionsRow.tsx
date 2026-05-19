import { Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toPng } from "html-to-image";
import { calcRecovery, formatPercent } from "@/lib/drawdown";
import { toast } from "sonner";

export function ActionsRow({
  drawdown,
  chartRef,
}: {
  drawdown: number;
  chartRef: React.RefObject<HTMLDivElement | null>;
}) {
  const summary = `Drawdown: -${formatPercent(drawdown)}% | Pemulihan: +${formatPercent(
    calcRecovery(drawdown),
  )}%`;

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      toast.success("Disalin ke clipboard");
    } catch {
      toast.error("Gagal menyalin");
    }
  };

  const onDownload = async () => {
    if (!chartRef.current) return;
    try {
      const dataUrl = await toPng(chartRef.current, {
        backgroundColor: getComputedStyle(document.body).backgroundColor,
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = `drawdown-${drawdown}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      toast.error("Gagal mengunduh");
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <Button variant="outline" className="h-12 rounded-xl gap-2" onClick={onCopy}>
        <Copy className="h-4 w-4" /> Salin
      </Button>
      <Button className="h-12 rounded-xl gap-2" onClick={onDownload}>
        <Download className="h-4 w-4" /> Unduh
      </Button>
    </div>
  );
}
