import {
  Outlet,
  Link,
  createRootRoute,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect } from "react";

import appCss from "../styles.css?url";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import { registerPWA } from "@/lib/pwa-register";
import { GA_ID, gaBootstrapScript } from "@/lib/analytics";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  if (import.meta.env.DEV) {
    console.error(error);
  }
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "robots", content: "max-image-preview:large, max-snippet:-1" },
      { name: "google-site-verification", content: "7EO77GIvBUN_mJX4xEfJTJlEgb9G5nfcDDBgyiBulVw" },
      { property: "og:site_name", content: SITE_NAME },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/favicon-dark.svg",
        media: "(prefers-color-scheme: dark)",
      },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
    ],
    scripts: [
      {
        // Pre-hydration theme apply to prevent FOUC. Light-default: dark only
        // when the user explicitly chose it. Syncs theme-color to that choice.
        children:
          "(function(){try{var d=localStorage.getItem('theme')==='dark';if(d)document.documentElement.classList.add('dark');var c=d?'#18120f':'#ffffff';document.querySelectorAll('meta[name=\"theme-color\"]').forEach(function(m){m.setAttribute('content',c);});}catch(e){}})();",
      },
      ...(GA_ID
        ? [
            { src: `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`, async: true },
            { children: gaBootstrapScript(GA_ID) },
          ]
        : []),
      {
        type: "application/ld+json",
        children: JSON.stringify(siteGraphJsonLd()),
      },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#ffffff" />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  useEffect(() => {
    registerPWA();
  }, []);

  // Keep theme-color in sync when the user toggles dark/light after load.
  useEffect(() => {
    const sync = () => {
      const dark = document.documentElement.classList.contains("dark");
      const color = dark ? "#18120f" : "#ffffff";
      document.querySelectorAll('meta[name="theme-color"]').forEach((m) => {
        m.setAttribute("content", color);
        m.removeAttribute("media");
      });
    };
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);

  return <Outlet />;
}
