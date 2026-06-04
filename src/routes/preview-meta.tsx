import { createFileRoute } from "@tanstack/react-router";
import {
  SITE_URL,
  SITE_NAME,
  DEFAULT_TITLE,
  DEFAULT_DESCRIPTION,
  OG_IMAGE,
} from "@/lib/seo";

const PAGE_TITLE = "DrawdownCal: Kalkulator Drawdown & Recovery Modal Trading";
const PAGE_DESC =
  "Hitung berapa profit yang dibutuhkan buat balik modal setelah loss. Dua mode: persentase atau equity.";

export const Route = createFileRoute("/preview-meta")({
  head: () => ({
    meta: [
      { title: "Meta Preview" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PreviewMeta,
});

type Card = {
  label: string;
  url: string;
  title: string;
  description: string;
};

function FacebookCard({ c }: { c: Card }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card max-w-md">
      <div className="aspect-[1.91/1] bg-muted grid place-items-center text-xs text-muted-foreground">
        <img src={OG_IMAGE} alt="" className="h-full w-full object-cover" onError={(e) => ((e.currentTarget.style.display = "none"))} />
      </div>
      <div className="border-t border-border p-3">
        <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
          {new URL(c.url).hostname}
        </div>
        <div className="mt-1 font-semibold text-foreground line-clamp-2">{c.title}</div>
        <div className="mt-1 text-sm text-muted-foreground line-clamp-2">{c.description}</div>
      </div>
    </div>
  );
}

function TwitterCard({ c }: { c: Card }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card max-w-md">
      <div className="aspect-[1.91/1] bg-muted">
        <img src={OG_IMAGE} alt="" className="h-full w-full object-cover" onError={(e) => ((e.currentTarget.style.display = "none"))} />
      </div>
      <div className="border-t border-border p-3">
        <div className="text-sm font-semibold text-foreground line-clamp-1">{c.title}</div>
        <div className="mt-0.5 text-sm text-muted-foreground line-clamp-2">{c.description}</div>
        <div className="mt-1 text-xs text-muted-foreground">{new URL(c.url).hostname}</div>
      </div>
    </div>
  );
}

function Section({ heading, c }: { heading: string; c: Card }) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-lg font-bold tracking-tight">{heading}</h2>
      <div className="rounded-md border border-border bg-muted/30 p-3 text-xs font-mono space-y-1">
        <div><span className="text-muted-foreground">title:</span> {c.title} <span className="text-muted-foreground">({c.title.length})</span></div>
        <div><span className="text-muted-foreground">description:</span> {c.description} <span className="text-muted-foreground">({c.description.length})</span></div>
        <div><span className="text-muted-foreground">url:</span> {c.url}</div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">Facebook / LinkedIn</div>
          <FacebookCard c={c} />
        </div>
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">Twitter / X</div>
          <TwitterCard c={c} />
        </div>
      </div>
    </section>
  );
}

function PreviewMeta() {
  const root: Card = {
    label: "Root",
    url: SITE_URL,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  };
  const index: Card = {
    label: "Index",
    url: `${SITE_URL}/`,
    title: PAGE_TITLE,
    description: PAGE_DESC,
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-8 space-y-8">
        <header>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Meta Preview
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Pratinjau title & description {SITE_NAME} di Facebook, LinkedIn, dan Twitter/X.
          </p>
        </header>
        <Section heading="Root (sitewide default)" c={root} />
        <Section heading="Index (/)" c={index} />
      </div>
    </div>
  );
}
