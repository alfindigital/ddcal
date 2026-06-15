import { useEffect, useState } from "react";
import { Download, X, Share } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "dd-install-dismissed";
const VISIT_KEY = "dd-visit-count";
const MIN_VISITS = 2;

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [iosHint, setIosHint] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Already installed (standalone)?
    const standalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      // iOS Safari
      (navigator as unknown as { standalone?: boolean }).standalone === true;
    if (standalone) return;

    // Dismissed before?
    try {
      if (localStorage.getItem(DISMISS_KEY) === "1") return;
    } catch {
      /* noop */
    }

    // Track visit count
    let visits = 0;
    try {
      visits = parseInt(localStorage.getItem(VISIT_KEY) ?? "0", 10) || 0;
      visits += 1;
      localStorage.setItem(VISIT_KEY, String(visits));
    } catch {
      /* noop */
    }
    if (visits < MIN_VISITS) return;

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);

    // iOS fallback (Safari + not standalone)
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
    const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
    if (isIOS && isSafari) {
      const timer = setTimeout(() => {
        setIosHint(true);
        setShow(true);
      }, 1500);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("beforeinstallprompt", onPrompt);
      };
    }

    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  const dismiss = () => {
    setShow(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* noop */
    }
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    if (choice.outcome === "accepted") {
      dismiss();
    } else {
      setShow(false);
    }
    setDeferred(null);
  };

  if (!show) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-2xl border bg-card/95 px-3 py-2.5 shadow-[var(--shadow-elegant)] backdrop-blur-md">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          {iosHint ? <Share className="h-4 w-4" /> : <Download className="h-4 w-4" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-bold text-foreground">
            Install DrawdownCal
          </p>
          <p className="truncate text-[11px] text-muted-foreground">
            {iosHint
              ? "Tap Share → Add to Home Screen"
              : "Akses cepat dari home screen, offline-ready."}
          </p>
        </div>
        {!iosHint && deferred && (
          <button
            type="button"
            onClick={install}
            className="rounded-lg bg-primary px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Install
          </button>
        )}
        <button
          type="button"
          aria-label="Tutup"
          onClick={dismiss}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
