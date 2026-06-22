import { Info, Lightbulb } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { ReferenceTable } from "./ReferenceTable";
import { IconButton } from "./IconButton";
import { useT } from "@/lib/i18n";
import { track } from "@/lib/analytics";

export function AboutDialog() {
  const t = useT();

  return (
    <Dialog onOpenChange={(o) => o && track("about_open")}>
      <DialogTrigger asChild>
        <IconButton aria-label={t("label.about")} title={t("label.about")}>
          <Info className="h-4 w-4" />
        </IconButton>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto space-y-4">
        <DialogHeader className="space-y-2 text-left">
          <DialogTitle className="font-display text-lg font-bold tracking-tight">
            {t("about.title")}
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed">
            <strong className="text-foreground">Drawdown</strong> {t("about.desc")}
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg bg-primary-soft/60 p-3">
          <h3 className="font-display text-sm font-bold tracking-tight mb-2">
            {t("about.formula")}
          </h3>
          <div className="font-display tabular tracking-tight text-sm font-bold">
            recovery % = dd / (100 − dd) × 100
          </div>
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">{t("about.explain")}</p>

        <div>
          <h3 className="font-display text-sm font-bold tracking-tight mb-2">
            {t("about.reference")}
          </h3>
          <ReferenceTable />
        </div>

        <div>
          <h3 className="font-display text-sm font-bold tracking-tight mb-2">{t("about.tips")}</h3>
          <ul className="space-y-1.5 text-[13px] leading-relaxed text-muted-foreground">
            {[t("about.tip1"), t("about.tip2"), t("about.tip3"), t("about.tip4")].map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <Lightbulb className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
