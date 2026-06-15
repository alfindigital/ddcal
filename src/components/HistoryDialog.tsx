import { Download, History, Trash2, Upload, X, Check } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useRef, useState } from "react";
import {
  HistoryEntry,
  clearHistory,
  exportHistory,
  formatHistoryDate,
  importHistory,
  loadHistory,
  saveHistory,
} from "@/lib/history";
import { formatPercent, formatRupiah } from "@/lib/drawdown";
import { toast } from "sonner";
import { useT } from "@/lib/i18n";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onLoad: (e: HistoryEntry) => void;
}

export function HistoryDialog({ open, onOpenChange, onLoad }: Props) {
  const t = useT();
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setEntries(loadHistory());
      setConfirmDelete(false);
    }
  }, [open]);

  // Auto-reset the inline delete confirmation after a short window.
  useEffect(() => {
    if (!confirmDelete) return;
    const id = setTimeout(() => setConfirmDelete(false), 3000);
    return () => clearTimeout(id);
  }, [confirmDelete]);

  const handleClear = () => {
    clearHistory();
    setEntries([]);
    setConfirmDelete(false);
  };

  const handleExport = () => {
    try {
      const blob = new Blob([exportHistory(entries)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `drawdowncal-history-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error(t("toast.export_failed"));
    }
  };

  const handleImportFile = async (file: File) => {
    try {
      const text = await file.text();
      const imported = importHistory(text);
      if (!imported.length) {
        toast.error(t("toast.no_valid_history"));
        return;
      }
      const ok = saveHistory(imported);
      if (!ok) {
        toast.error(t("toast.storage_full"));
        return;
      }
      setEntries(imported);
      toast.success(t("toast.imported", { n: imported.length }));
    } catch {
      toast.error(t("toast.invalid_file"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto [&>button]:hidden">
        <DialogHeader className="flex-row items-center justify-between gap-2">
          <DialogTitle className="font-display text-lg font-bold tracking-tight">
            {t("history.title")}
          </DialogTitle>
          <div className="flex items-center gap-1">
            <button
              onClick={() => fileRef.current?.click()}
              title={t("label.import")}
              className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Upload className="h-4 w-4" />
            </button>
            <button
              onClick={handleExport}
              disabled={entries.length === 0}
              title={t("label.export")}
              className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40"
            >
              <Download className="h-4 w-4" />
            </button>
            {entries.length > 0 && (
              <button
                onClick={() => {
                  if (confirmDelete) handleClear();
                  else setConfirmDelete(true);
                }}
                title={confirmDelete ? t("label.confirm_delete") : t("label.delete_all")}
                aria-label={confirmDelete ? t("label.confirm_delete") : t("label.delete_all")}
                className={`grid h-8 w-8 place-items-center rounded-md transition-colors ${
                  confirmDelete
                    ? "bg-red-600 text-white hover:bg-red-700 dark:bg-red-500"
                    : "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                }`}
              >
                {confirmDelete ? <Check className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
              </button>
            )}
            <DialogClose asChild>
              <button
                title={t("label.close")}
                className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </DialogClose>
          </div>
        </DialogHeader>

        {entries.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <History className="h-8 w-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">{t("history.empty")}</p>
          </div>
        ) : (
          <ul className="divide-y divide-border/50">
            {entries.map((e) => (
              <li key={e.id}>
                <button
                  onClick={() => {
                    onLoad(e);
                    onOpenChange(false);
                  }}
                  className="w-full rounded-md px-2 py-2.5 text-left transition-colors hover:bg-muted/60"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] text-muted-foreground">
                      {formatHistoryDate(e.timestamp)}
                    </span>
                    <span className="grid h-5 w-5 place-items-center rounded-md bg-muted text-[10px] font-bold tabular text-muted-foreground">
                      {e.mode === "persen" ? t("history.mode.percent") : t("history.mode.equity")}
                    </span>
                  </div>
                  {e.mode === "equity" && e.equityAwal != null && e.equityTersisa != null ? (
                    <div className="mt-1 flex items-baseline gap-3 font-display tabular tracking-tight">
                      <span className="text-sm font-bold text-foreground">
                        {formatRupiah(e.equityAwal)}
                      </span>
                      <span className="text-[11px] text-muted-foreground">→</span>
                      <span className="text-sm font-bold text-foreground">
                        {formatRupiah(e.equityTersisa)}
                      </span>
                    </div>
                  ) : (
                    <div className="mt-1 flex items-baseline gap-3 font-display tabular tracking-tight">
                      <span className="text-sm font-bold text-red-600 dark:text-red-400">
                        -{formatPercent(e.drawdownPct)}%
                      </span>
                      <span className="text-[11px] text-muted-foreground">→</span>
                      <span className="text-sm font-bold text-foreground">
                        +{formatPercent(e.recoveryPct)}%
                      </span>
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleImportFile(f);
            e.target.value = "";
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
