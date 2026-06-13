import { Download, History, Trash2, Upload, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onLoad: (e: HistoryEntry) => void;
}

export function HistoryDialog({ open, onOpenChange, onLoad }: Props) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setEntries(loadHistory());
  }, [open]);

  const handleClear = () => {
    clearHistory();
    setEntries([]);
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
      toast.error("Gagal mengekspor");
    }
  };

  const handleImportFile = async (file: File) => {
    try {
      const text = await file.text();
      const imported = importHistory(text);
      if (!imported.length) {
        toast.error("File tidak berisi riwayat valid");
        return;
      }
      const ok = saveHistory(imported);
      if (!ok) {
        toast.error("Gagal menyimpan (storage penuh)");
        return;
      }
      setEntries(imported);
      toast.success(`${imported.length} riwayat diimpor`);
    } catch {
      toast.error("File tidak valid");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto [&>button]:hidden">
        <DialogHeader className="flex-row items-center justify-between gap-2">
          <DialogTitle className="font-display text-lg font-bold tracking-tight">
            Riwayat Kalkulasi
          </DialogTitle>
          <div className="flex items-center gap-1">
            <button
              onClick={() => fileRef.current?.click()}
              title="Impor"
              className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Upload className="h-4 w-4" />
            </button>
            <button
              onClick={handleExport}
              disabled={entries.length === 0}
              title="Ekspor"
              className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40"
            >
              <Download className="h-4 w-4" />
            </button>
            {entries.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    title="Hapus Semua"
                    className="grid h-8 w-8 place-items-center rounded-md text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Hapus semua riwayat?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tindakan ini tidak dapat dibatalkan.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClear}>
                      Hapus
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <DialogClose asChild>
              <button
                title="Tutup"
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
            <p className="text-sm text-muted-foreground">
              Belum ada riwayat kalkulasi
            </p>
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
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {e.mode === "persen" ? "Persentase" : "Equity"}
                    </span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-3 font-display tabular tracking-tight">
                    <span className="text-sm font-bold text-red-600 dark:text-red-400">
                      -{formatPercent(e.drawdownPct)}%
                    </span>
                    <span className="text-[11px] text-muted-foreground">→</span>
                    <span className="text-sm font-bold text-foreground">
                      +{formatPercent(e.recoveryPct)}%
                    </span>
                  </div>
                  {e.mode === "equity" && e.equityAwal != null && e.equityTersisa != null && (
                    <div className="mt-0.5 text-[11px] text-muted-foreground tabular">
                      {formatRupiah(e.equityAwal)} → {formatRupiah(e.equityTersisa)}
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
