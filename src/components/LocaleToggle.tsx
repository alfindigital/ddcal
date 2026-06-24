import { useRouterState } from "@tanstack/react-router";
import { IconButton } from "./IconButton";
import { useLocale, useT, type Locale } from "@/lib/i18n";
import { track } from "@/lib/analytics";

/** Returns the equivalent path in the other locale, preserving sub-paths. */
export function toggleLocalePath(pathname: string, next: Locale): string {
  const isEn = pathname === "/en" || pathname.startsWith("/en/");
  let idPath = isEn ? pathname.slice(3) : pathname;
  if (idPath === "") idPath = "/";
  return next === "en" ? (idPath === "/" ? "/en" : "/en" + idPath) : idPath;
}

export function LocaleToggle() {
  const loc = useLocale();
  const t = useT();
  const next: Locale = loc === "id" ? "en" : "id";
  const { pathname, searchStr } = useRouterState({ select: (s) => s.location });
  const href = toggleLocalePath(pathname, next) + (searchStr ?? "");

  return (
    <IconButton
      asChild
      aria-label={t("label.locale")}
      title={`${t("label.locale")}: ${loc.toUpperCase()} → ${next.toUpperCase()}`}
    >
      <a href={href} hrefLang={next} onClick={() => track("locale_toggle", { to: next })}>
        <span className="text-[11px] font-bold uppercase tabular tracking-tight">{loc}</span>
      </a>
    </IconButton>
  );
}
