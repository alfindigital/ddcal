import { useRef } from "react";
import { Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toPng } from "html-to-image";
import { calcRecovery, formatPercent } from "@/lib/drawdown";
import { toast } from "sonner";
import { ShareCard } from "./ShareCard";

export function ActionsRow({ drawdown }: { drawdown: number }) {
  const shareRef = useRef<HTMLDivElement>(null);

  const summary = `Drawdown: -${formatPercent(drawdown)}% | Pemulihan: +${formatPercent(
    calcRecovery(drawdown),
  )}%`;

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      toast.success("Disalin");
    } catch {
      toast.error("Gagal menyalin");
    }
  };

  const onDownload = async () => {
    if (!shareRef.current) return;
    try {
      const dataUrl = await toPng(shareRef.current, {
        backgroundColor: getComputedStyle(document.body).backgroundColor,
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = `drawdowncal-${drawdown}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      toast.error("Gagal mengunduh");
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs" onClick={onCopy}>
          <Copy className="h-3.5 w-3.5" /> Salin
        </Button>
        <Button size="sm" className="h-9 gap-1.5 text-xs" onClick={onDownload}>
          <Download className="h-3.5 w-3.5" /> Unduh PNG
        </Button>
      </div>
      {/* Off-screen share card used to render the downloadable PNG. */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          left: -10000,
          top: 0,
          pointerEvents: "none",
          opacity: 0,
        }}
      >
        <ShareCard ref={shareRef} drawdown={drawdown} />
      </div>
    </>
  );
}
