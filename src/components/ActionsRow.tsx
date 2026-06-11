import { useRef, useState } from "react";
import { Copy, Download, Link2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import { calcRecovery, formatPercent, formatRupiah } from "@/lib/drawdown";
import { toast } from "sonner";
import { ShareCard } from "./ShareCard";

const APP_URL = "drawdowncal.lovable.app";

export function ActionsRow({
  drawdown,
  mode,
  equityInitial,
  equityCurrent,
}: {
  drawdown: number;
  mode: "persen" | "equity";
  equityInitial: number;
  equityCurrent: number;
}) {
  const shareRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [mountShare, setMountShare] = useState(false);

  const recovery = calcRecovery(drawdown);
  const ratio = drawdown > 0 && Number.isFinite(recovery) ? recovery / drawdown : 0;

  const equityLine =
    mode === "equity"
      ? `Equity tersisa: ${formatRupiah(equityCurrent)} dari ${formatRupiah(equityInitial)}`
      : null;

  const summary = [
    "DrawdownCal",
    "",
    `Drawdown: -${formatPercent(drawdown)}%`,
    ...(equityLine ? [equityLine] : []),
    `Pemulihan dibutuhkan: +${formatPercent(recovery)}%`,
    `Rasio pemulihan/kerugian: ${ratio.toFixed(2)}x`,
    "",
    `Hitung sendiri: ${APP_URL}`,
  ].join("\n");

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      toast.success("Disalin");
    } catch {
      toast.error("Gagal menyalin");
    }
  };

  const onCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link disalin");
    } catch {
      toast.error("Gagal menyalin link");
    }
  };


  const onDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      setMountShare(true);
      // Wait one frame so ShareCard mounts before snapshot.
      await new Promise<void>((r) => requestAnimationFrame(() => r()));
      if (!shareRef.current) throw new Error("share card not ready");
      const { toPng } = await import("html-to-image");
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
    } finally {
      setDownloading(false);
      setMountShare(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs" onClick={onCopy}>
          <Copy className="h-3.5 w-3.5" /> Salin
        </Button>
        <Button
          size="sm"
          className="h-9 gap-1.5 text-xs"
          onClick={onDownload}
          disabled={downloading}
          aria-busy={downloading}
        >
          {downloading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Memproses
            </>
          ) : (
            <>
              <Download className="h-3.5 w-3.5" /> Unduh
            </>
          )}
        </Button>
      </div>
      {mountShare && (
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
      )}
    </>
  );
}
