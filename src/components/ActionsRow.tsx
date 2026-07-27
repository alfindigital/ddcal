import { useRef, useState } from "react";
import { Copy, Download, Loader2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import { calcRecovery, formatPercent, formatRupiah } from "@/lib/drawdown";
import { toast } from "sonner";
import { ShareCard } from "./ShareCard";
import { useT } from "@/lib/i18n";
import { track } from "@/lib/analytics";

export function ActionsRow({
  drawdown,
  mode,
  equityInitial,
  equityCurrent,
  shareUrl,
}: {
  drawdown: number;
  mode: "persen" | "equity";
  equityInitial: number;
  equityCurrent: number;
  shareUrl: string;
}) {
  const t = useT();
  const shareRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [mountShare, setMountShare] = useState(false);
  const canNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  const recovery = calcRecovery(drawdown);
  const ratio = drawdown > 0 && Number.isFinite(recovery) ? recovery / drawdown : 0;

  const equityLine =
    mode === "equity"
      ? `${t("share.line_equity_remaining")}: ${formatRupiah(equityCurrent)} ${t("share.line_from")} ${formatRupiah(equityInitial)}`
      : null;

  const summaryBody = [
    t("share.summary_title"),
    "",
    `${t("share.line_drawdown")}: -${formatPercent(drawdown)}%`,
    ...(equityLine ? [equityLine] : []),
    `${t("share.line_recovery")}: +${formatPercent(recovery)}%`,
    `${t("share.line_ratio")}: ${ratio.toFixed(2)}x`,
  ].join("\n");

  const summary = `${summaryBody}\n\n${t("share.line_try")}: ${shareUrl}`;

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      toast.success(t("toast.copied"));
      track("copy_summary");
    } catch {
      toast.error(t("toast.copy_failed"));
    }
  };

  const onNativeShare = async () => {
    try {
      await navigator.share({ title: t("share.summary_title"), text: summary, url: shareUrl });
      track("native_share");
    } catch (err) {
      // User cancel is fine; anything else fall back to copy.
      if (err instanceof DOMException && err.name === "AbortError") return;
      await onCopy();
    }
  };

  const onDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      setMountShare(true);
      await new Promise<void>((r) => requestAnimationFrame(() => r()));
      if (!shareRef.current) throw new Error("share card not ready");
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(shareRef.current, {
        backgroundColor: getComputedStyle(document.body).backgroundColor,
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = `drawdowncal-${Math.round(drawdown)}.png`;
      link.href = dataUrl;
      link.click();
      track("download_image");
    } catch {
      toast.error(t("toast.download_failed"));
    } finally {
      setDownloading(false);
      setMountShare(false);
    }
  };

  const waHref = `https://wa.me/?text=${encodeURIComponent(summary)}`;
  const tgHref = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(summaryBody)}`;
  const xHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(summary)}`;

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs" onClick={onCopy}>
          <Copy className="h-3.5 w-3.5" /> {t("label.copy")}
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
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> ...
            </>
          ) : (
            <>
              <Download className="h-3.5 w-3.5" /> {t("label.download")}
            </>
          )}
        </Button>
      </div>


      {mountShare && (
        <div
          aria-hidden="true"
          style={{ position: "fixed", left: -10000, top: 0, pointerEvents: "none", opacity: 0 }}
        >
          <ShareCard ref={shareRef} drawdown={drawdown} />
        </div>
      )}
    </div>
  );
}
