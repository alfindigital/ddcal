import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  SITE_URL,
  SITE_NAME,
  DEFAULT_TITLE,
  DEFAULT_DESCRIPTION,
  OG_IMAGE,
  OG_IMAGE_FALLBACK,
} from "@/lib/seo";

const PAGE_TITLE = "DrawdownCal: Kalkulator Drawdown & Recovery Modal Trading";
const PAGE_DESC =
  "Hitung berapa profit yang dibutuhkan buat balik modal setelah loss. Dua mode: persentase atau equity.";

export const Route = createFileRoute("/preview-meta")({
  head: () => ({
    meta: [{ title: "Meta Preview" }, { name: "robots", content: "noindex" }],
  }),
  component: PreviewMeta,
});

type Card = {
  label: string;
  url: string;
  title: string;
  description: string;
};

type Device = "mobile" | "desktop";

function OgImg() {
  return (
    <img
      src={OG_IMAGE}
      alt=""
      className="h-full w-full object-cover"
      onError={(e) => {
        const t = e.currentTarget;
        if (t.dataset.fallback !== "1") {
          t.dataset.fallback = "1";
          t.src = OG_IMAGE_FALLBACK;
        }
      }}
    />
  );
}

function FacebookCard({ c, device }: { c: Card; device: Device }) {
  const w = device === "mobile" ? "max-w-[340px]" : "max-w-md";
  return (
    <div className={`overflow-hidden rounded-lg border border-border bg-card ${w}`}>
      <div className="aspect-[1.91/1] bg-muted">
        <OgImg />
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

function TwitterCard({ c, device }: { c: Card; device: Device }) {
  const w = device === "mobile" ? "max-w-[340px]" : "max-w-md";
  return (
    <div className={`overflow-hidden rounded-2xl border border-border bg-card ${w}`}>
      <div className="aspect-[1.91/1] bg-muted">
        <OgImg />
      </div>
      <div className="border-t border-border p-3">
        <div className="text-sm font-semibold text-foreground line-clamp-1">{c.title}</div>
        <div className="mt-0.5 text-sm text-muted-foreground line-clamp-2">{c.description}</div>
        <div className="mt-1 text-xs text-muted-foreground">{new URL(c.url).hostname}</div>
      </div>
    </div>
  );
}

function buildShareText(c: Card) {
  return `${c.title}\n\n${c.description}\n\n${c.url}`;
}

function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function Section({ heading, c }: { heading: string; c: Card }) {
  const [device, setDevice] = useState<Device>("desktop");
  const shareText = buildShareText(c);
  const slug = heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
    } catch {
      // ignore
    }
  };

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-lg font-bold tracking-tight">{heading}</h2>
        <div className="inline-flex rounded-md border border-border bg-card p-0.5 text-xs">
          {(["mobile", "desktop"] as Device[]).map((d) => (
            <button
              key={d}
              onClick={() => setDevice(d)}
              className={`rounded px-2 py-1 capitalize transition-colors ${
                device === d
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-md border border-border bg-muted/30 p-3 text-xs font-mono space-y-1">
        <div>
          <span className="text-muted-foreground">title:</span> {c.title}{" "}
          <span className="text-muted-foreground">({c.title.length})</span>
        </div>
        <div>
          <span className="text-muted-foreground">description:</span> {c.description}{" "}
          <span className="text-muted-foreground">({c.description.length})</span>
        </div>
        <div>
          <span className="text-muted-foreground">url:</span> {c.url}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {(["Facebook / LinkedIn", "Twitter / X"] as const).map((label) => (
          <div key={label} className="space-y-2">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
            {label.startsWith("Facebook") ? (
              <FacebookCard c={c} device={device} />
            ) : (
              <TwitterCard c={c} device={device} />
            )}
          </div>
        ))}
      </div>

      <div className="rounded-md border border-border bg-card p-3 space-y-2">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">
          Share text (Facebook, LinkedIn, Twitter/X)
        </div>
        <pre className="whitespace-pre-wrap break-words text-xs text-foreground">{shareText}</pre>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={copyAll}
            className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent"
          >
            Copy
          </button>
          <button
            onClick={() => downloadText(`share-${slug}.txt`, shareText)}
            className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          >
            Download .txt
          </button>
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
          <h1 className="font-display text-2xl font-bold tracking-tight">Meta Preview</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Pratinjau title, description, dan share text {SITE_NAME} di Facebook, LinkedIn, dan
            Twitter/X. Toggle mobile/desktop untuk lihat ukuran kartunya.
          </p>
        </header>
        <Section heading="Root (sitewide default)" c={root} />
        <Section heading="Index" c={index} />
      </div>
    </div>
  );
}
