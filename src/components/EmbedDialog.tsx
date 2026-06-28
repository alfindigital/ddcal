import { useState } from "react";
import { Code2, Check, Copy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { IconButton } from "./IconButton";
import { useT, useLocale } from "@/lib/i18n";
import { SITE_URL } from "@/lib/seo";
import { track } from "@/lib/analytics";
import { toast } from "sonner";

export function EmbedDialog({ currentDrawdown }: { currentDrawdown: number }) {
  const t = useT();
  const locale = useLocale();
  const [transparent, setTransparent] = useState(false);
  const [copied, setCopied] = useState(false);
  const dd = Math.round(currentDrawdown);

  const src = `${SITE_URL}/embed?dd=${dd}&lang=${locale}${transparent ? "&transparent=true" : ""}`;
  const snippet = `<iframe src="${src}" width="100%" height="260" style="border:0;border-radius:16px;max-width:440px" loading="lazy" title="DrawdownCal"></iframe>`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      toast.success(t("embed.copied"));
      track("embed_copy", { dd });
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error(t("toast.copy_failed"));
    }
  };

  return (
    <Dialog onOpenChange={(o) => o && track("embed_open")}>
      <DialogTrigger asChild>
        <IconButton aria-label={t("embed.title")} title={t("embed.title")}>
          <Code2 className="h-4 w-4" />
        </IconButton>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-0">
        <div className="space-y-4 p-5 sm:p-6">
          <DialogHeader className="space-y-1.5 text-left">
            <DialogTitle className="font-display text-lg font-bold tracking-tight">
              {t("embed.title")}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {t("embed.desc")}
            </DialogDescription>
          </DialogHeader>

          <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border bg-muted/30 px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/50">
            <span>{t("embed.transparent")}</span>
            <input
              type="checkbox"
              checked={transparent}
              onChange={(e) => setTransparent(e.target.checked)}
              className="h-4 w-4 accent-[var(--primary)]"
            />
          </label>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {t("embed.label")}
              </div>
              <button
                type="button"
                onClick={copy}
                className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-semibold text-primary transition-colors hover:bg-primary/10"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? t("embed.copied") : t("embed.copy")}
              </button>
            </div>
            <pre className="overflow-hidden rounded-lg border bg-muted/40 p-3 font-mono text-[11px] leading-relaxed text-foreground whitespace-pre-wrap break-all">
              <code>{snippet}</code>
            </pre>
          </div>

          <button
            type="button"
            onClick={copy}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? t("embed.copied") : t("embed.copy")}
          </button>

          <div className="space-y-1.5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t("embed.preview")}
            </div>
            <div className="overflow-hidden rounded-xl border bg-muted/20 p-2">
              <iframe
                src={src}
                width="100%"
                height={260}
                style={{ border: 0, borderRadius: 12, display: "block" }}
                loading="lazy"
                title="DrawdownCal embed preview"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
