#!/usr/bin/env node
// Verify the rendered HTML of key routes contains correct OG/Twitter meta,
// JSON-LD, canonical, and that og:image is reachable (with fallback present).
//
// Usage:
//   node scripts/check-built-html.mjs                      # uses http://localhost:3000
//   E2E_BASE_URL=https://drawdowncal.lovable.app node ...  # against deployed

import { existsSync } from "node:fs";

const BASE = process.env.E2E_BASE_URL || "http://localhost:3000";
const SITE_URL = process.env.VITE_SITE_URL || "https://drawdowncal.alfindigital.com";
const OG_IMAGE = `${SITE_URL}/og.jpg`;
const OG_FALLBACK = `${SITE_URL}/og-image-fallback.svg`;

let failed = false;
const fail = (msg) => {
  console.error("FAIL: " + msg);
  failed = true;
};
const ok = (msg) => console.log("ok: " + msg);

function pickMeta(html, sel) {
  const attr = sel.name ? `name` : `property`;
  const val = sel.name ?? sel.property;
  // Try both attribute orderings.
  const re1 = new RegExp(`<meta[^>]+${attr}=["']${val}["'][^>]*content=["']([^"']*)["']`, "i");
  const re2 = new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*${attr}=["']${val}["']`, "i");
  const m = html.match(re1) || html.match(re2);
  return m ? m[1] : null;
}

function pickAll(html, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "gi");
  return [...html.matchAll(re)].map((m) => m[1]);
}

async function fetchHtml(path) {
  const res = await fetch(BASE + path, { headers: { accept: "text/html" } });
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
  return res.text();
}

async function head(url) {
  try {
    const r = await fetch(url, { method: "HEAD" });
    return r.status;
  } catch {
    return 0;
  }
}

async function checkRoute(path, expect) {
  console.log(`\n--- ${path} ---`);
  const html = await fetchHtml(path);

  for (const [sel, expected] of Object.entries(expect.meta)) {
    const i = sel.indexOf(":");
    const kind = sel.slice(0, i);
    const key = sel.slice(i + 1);
    const val = pickMeta(html, kind === "name" ? { name: key } : { property: key });
    if (!val) {
      fail(`${path}: missing meta ${sel}`);
      continue;
    }
    if (expected instanceof RegExp ? !expected.test(val) : val !== expected) {
      fail(`${path}: meta ${sel} = "${val}" did not match ${expected}`);
    } else {
      ok(`${path}: meta ${sel}`);
    }
  }

  if (expect.canonical) {
    const m = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
    if (!m) fail(`${path}: missing canonical`);
    else if (m[1] !== expect.canonical)
      fail(`${path}: canonical "${m[1]}" expected "${expect.canonical}"`);
    else ok(`${path}: canonical`);
  }

  if (expect.jsonld) {
    const scripts = pickAll(html, "script[^>]*type=[\"']application/ld\\+json[\"']");
    // Above regex tag pattern won't quite work since pickAll expects tag name. Use direct:
    const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    const blocks = [...html.matchAll(re)].map((m) => m[1]);
    if (blocks.length < expect.jsonld.minBlocks) {
      fail(
        `${path}: only ${blocks.length} JSON-LD blocks (expected >= ${expect.jsonld.minBlocks})`,
      );
    } else {
      ok(`${path}: ${blocks.length} JSON-LD blocks`);
    }
    for (const [i, raw] of blocks.entries()) {
      try {
        const obj = JSON.parse(raw);
        if (!obj["@context"]) fail(`${path}#ld${i}: missing @context`);
      } catch (e) {
        fail(`${path}#ld${i}: invalid JSON: ${e.message}`);
      }
    }
  }
}

async function main() {
  // Root and Index meta expectations.
  await checkRoute("/", {
    meta: {
      "property:og:title": /DrawdownCal/,
      "property:og:description": /.+/,
      "property:og:type": "website",
      "property:og:image": OG_IMAGE,
      "property:og:site_name": "DrawdownCal",
      "name:twitter:card": "summary_large_image",
      "name:twitter:image": OG_IMAGE,
      "name:description": /.+/,
    },
    jsonld: { minBlocks: 2 }, // root WebSite/Organization + index FAQ/WebApp
  });

  // OG image fetch + fallback presence
  console.log("\n--- OG image reachability ---");
  const status = await head(OG_IMAGE);
  if (status >= 200 && status < 400) {
    ok(`og-image.jpg reachable (${status})`);
  } else {
    console.warn(`warn: og-image.jpg HEAD ${status} — checking fallback`);
    if (!existsSync("public/og-image-fallback.svg")) {
      fail("og-image unreachable AND no fallback file present");
    } else {
      const fbStatus = await head(OG_FALLBACK);
      if (fbStatus >= 200 && fbStatus < 400) ok(`fallback reachable (${fbStatus})`);
      else fail(`fallback not reachable (${fbStatus})`);
    }
  }

  if (failed) {
    console.error("\nFAILED");
    process.exit(1);
  }
  console.log("\nAll OG/meta checks passed.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
