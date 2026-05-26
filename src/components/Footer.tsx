import { Facebook, Globe, Youtube } from "lucide-react";

const linkClass =
  "inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-all duration-200 hover:bg-primary/10 hover:text-primary hover:scale-110 active:scale-95";

export function Footer() {
  return (
    <footer className="flex flex-col items-center gap-2.5 py-4">
      {/* Brand tag */}
      <div className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Alfin Digital
        </span>
      </div>

      {/* Social links */}
      <div className="flex items-center gap-1 rounded-xl border border-border/50 bg-muted/40 px-2.5 py-1.5 backdrop-blur-sm">
        <a
          href="https://alfindigital.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Website alfindigital.com"
          title="alfindigital.com"
          className={linkClass}
        >
          <Globe className="h-4 w-4" />
        </a>
        <a
          href="https://fb.com/alfindigital"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook @alfindigital"
          title="Facebook @alfindigital"
          className={linkClass}
        >
          <Facebook className="h-4 w-4" />
        </a>
        <a
          href="https://youtube.com/@alfindigital"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="YouTube @alfindigital"
          title="YouTube @alfindigital"
          className={linkClass}
        >
          <Youtube className="h-4 w-4" />
        </a>
        <a
          href="https://tiktok.com/@alfindigital"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="TikTok @alfindigital"
          title="TikTok @alfindigital"
          className={linkClass}
        >
          <TikTokIcon />
        </a>
        <a
          href="https://x.com/alfindigital"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X (Twitter) @alfindigital"
          title="X @alfindigital"
          className={linkClass}
        >
          <XIcon />
        </a>
        <a
          href="https://t.me/alfidx"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Telegram @alfidx"
          title="Telegram @alfidx"
          className={linkClass}
        >
          <TelegramIcon />
        </a>
      </div>

      {/* Credit */}
      <span className="text-[11px] tracking-wide text-muted-foreground">
        by <span className="font-medium text-foreground">@alfindigital</span>
      </span>
    </footer>
  );
}

function TikTokIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V9.83a8.16 8.16 0 0 0 4.77 1.52V7.9a4.83 4.83 0 0 1-1.84-1.21Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25h6.83l4.713 6.231 5.447-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M21.94 4.34 18.7 19.62c-.24 1.08-.88 1.35-1.78.84l-4.92-3.63-2.37 2.28c-.26.26-.48.48-.99.48l.35-5.02 9.13-8.25c.4-.35-.09-.55-.61-.2L6.22 12.95l-4.86-1.52c-1.06-.33-1.08-1.06.22-1.57l19-7.32c.88-.33 1.65.2 1.36 1.8Z" />
    </svg>
  );
}
