import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "./AnimatedValue";
import { track } from "@/lib/analytics";

type Social = {
  href: string;
  label: string;
  handle: string;
  path: string;
};

const SOCIALS: Social[] = [
  {
    href: "https://t.me/lotmetrik",
    label: "Telegram",
    handle: "@lotmetrik",
    path: "M9.8 18.7l.3-4.2 7.7-6.9c.3-.3-.1-.5-.5-.2L7.7 13.3 3.6 12c-.9-.3-.9-.9.2-1.3L19.8 4.5c.7-.3 1.4.2 1.1 1.3l-2.7 12.8c-.2.9-.7 1.1-1.5.7L12.6 16.3l-2 1.9c-.2.2-.4.4-.8.4z",
  },
  {
    href: "https://instagram.com/lotmetrik",
    label: "Instagram",
    handle: "@lotmetrik",
    path: "M12 2.2c3.2 0 3.6 0 4.85.07 1.17.05 1.8.25 2.23.42.56.22.96.48 1.38.9.42.42.68.82.9 1.38.17.42.37 1.06.42 2.23.06 1.26.07 1.64.07 4.85s0 3.6-.07 4.85c-.05 1.17-.25 1.8-.42 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.17-1.06.37-2.23.42-1.26.06-1.64.07-4.85.07s-3.6 0-4.85-.07c-1.17-.05-1.8-.25-2.23-.42-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.17-.42-.37-1.06-.42-2.23C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.85c.05-1.17.25-1.8.42-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.17 1.06-.37 2.23-.42C8.4 2.2 8.8 2.2 12 2.2zm0 5.6a4.2 4.2 0 100 8.4 4.2 4.2 0 000-8.4zm0 6.93a2.73 2.73 0 110-5.46 2.73 2.73 0 010 5.46zm5.34-7.1a.98.98 0 11-1.96 0 .98.98 0 011.96 0z",
  },
  {
    href: "https://tiktok.com/@lotmetrik",
    label: "TikTok",
    handle: "@lotmetrik",
    path: "M19.6 6.8a5.6 5.6 0 01-3.3-1.1 5.6 5.6 0 01-2.2-3.5h-3.3v13.1a2.6 2.6 0 11-1.9-2.5V9.4a5.9 5.9 0 104.9 5.8V9.9a8.9 8.9 0 005.2 1.7V8.3a5.5 5.5 0 01-1.4-.5z",
  },
  {
    href: "https://x.com/lotmetrik",
    label: "X",
    handle: "@lotmetrik",
    path: "M18.2 2.2h3.3l-7.2 8.3 8.5 11.3h-6.7l-5.2-6.8-6 6.8H1.7l7.7-8.8L1.2 2.2H8l4.7 6.2zM17 19.8h1.8L7.1 4.1H5.1z",
  },
];


export function Footer() {
  const [active, setActive] = useState(0);
  const pausedRef = useRef(false);
  const glowRef = useRef<HTMLDivElement>(null);
  const year = new Date().getFullYear();
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return; // respect reduced-motion: keep one social static
    const id = setInterval(() => {
      if (pausedRef.current || (typeof document !== "undefined" && document.hidden)) return;
      setActive((i) => (i + 1) % SOCIALS.length);
    }, 2300);
    return () => clearInterval(id);
  }, [reduced]);

  useEffect(() => {
    if (reduced) return; // no wandering glow under reduced-motion
    let timer: ReturnType<typeof setTimeout>;
    const move = () => {
      const el = glowRef.current;
      if (el && !(typeof document !== "undefined" && document.hidden)) {
        el.style.left = Math.random() * 120 - 30 + "%";
        el.style.top = Math.random() * 60 - 30 + "%";
      }
      timer = setTimeout(move, 4000 + Math.random() * 4000);
    };
    move();
    return () => clearTimeout(timer);
  }, [reduced]);

  return (
    <footer className="relative flex items-center justify-between gap-2.5 overflow-hidden rounded-b-xl border-t border-border bg-card px-3.5 py-2 sm:px-3 sm:py-1.5">
      <div
        ref={glowRef}
        className="afd-glow pointer-events-none absolute -top-[40%] -bottom-[40%] left-[-48%] z-0 w-[48%] rounded-full blur-lg"
      />
      <span className="relative z-10 inline-flex shrink min-w-0 items-center whitespace-nowrap border-l-2 border-primary pl-2 text-[11px] text-muted-foreground sm:pl-1.5 sm:text-[10px]">
        © {year}
        <a
          href="https://t.me/lotmetrik"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-1 font-semibold text-primary hover:underline"
        >
          lotmetrik
        </a>

        <span
          className={`${reduced ? "" : "afd-caret"} ml-[3px] inline-block h-3 w-[6px] bg-primary sm:h-2.5 sm:w-[5px]`}
        />
      </span>
      <div
        className="afd-rot relative z-10 h-[26px] min-w-[150px] shrink-0 sm:h-[22px] sm:min-w-[120px]"
        onMouseEnter={() => (pausedRef.current = true)}
        onMouseLeave={() => (pausedRef.current = false)}
      >
        {SOCIALS.map((s, idx) => {
          const isActive = idx === active;
          return (
            <a
              key={s.label}
              className={`absolute right-0 top-0 flex h-[26px] items-center gap-2 whitespace-nowrap text-xs text-foreground no-underline transition-[opacity,transform] duration-500 sm:h-[22px] sm:gap-1.5 sm:text-[10.5px] ${
                isActive
                  ? "afd-item-active translate-y-0 opacity-100 pointer-events-auto"
                  : "translate-y-1.5 opacity-0 pointer-events-none"
              }`}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              onClick={() => track("social_click", { label: s.label })}
            >
              <span className="afd-ico-bg relative inline-flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full text-primary transition-all duration-200 sm:h-[22px] sm:w-[22px]">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 sm:h-3 sm:w-3">
                  <path d={s.path} />
                </svg>
              </span>
              <b className="font-semibold text-primary">{s.handle}</b>
            </a>
          );
        })}
      </div>
    </footer>
  );
}
