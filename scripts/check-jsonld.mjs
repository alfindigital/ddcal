#!/usr/bin/env node
// Validate the JSON-LD builders in src/lib/jsonld.ts: every builder returns a
// graph with @context, and every absolute URL is either SITE_URL-based or
// explicitly allowlisted. The rendered-HTML check (check-built-html.mjs)
// covers the per-route output.
import { readFileSync } from "node:fs";

const SITE_URL = process.env.VITE_SITE_URL || "https://ddcal.lotmetrik.my.id";
const FILES = ["src/lib/jsonld.ts"];
// alfindigital.com is the legitimate author/creator URL in the app schema.
const ALLOWLIST = [
  "https://schema.org",
  "https://alfindigital.com",
  "https://t.me",
  "https://instagram.com",
  "https://tiktok.com",
  "https://x.com",
];

let failed = false;

/** Extract balanced `return { ... }` object literals from a source file. */
function extractReturnObjects(src) {
  const blocks = [];
  const re = /return\s*\{/g;
  let m;
  while ((m = re.exec(src))) {
    let depth = 0;
    let i = m.index + m[0].length - 1;
    const start = i;
    for (; i < src.length; i++) {
      const ch = src[i];
      if (ch === "{") depth++;
      else if (ch === "}") {
        depth--;
        if (depth === 0) break;
      }
    }
    blocks.push(src.slice(start, i + 1));
  }
  return blocks;
}

for (const file of FILES) {
  const src = readFileSync(file, "utf8");
  const blocks = extractReturnObjects(src);
  if (!blocks.length) {
    console.error(`[jsonld] ${file}: no JSON-LD builders found`);
    failed = true;
    continue;
  }
  for (const [i, block] of blocks.entries()) {
    if (!block.includes('"@context"')) {
      console.error(`[jsonld] ${file}#${i}: missing @context`);
      failed = true;
    }
    if (!/"@type"/.test(block) && !/"@graph"/.test(block)) {
      console.error(`[jsonld] ${file}#${i}: missing @type/@graph`);
      failed = true;
    }
  }

  // URL audit across the whole module (string + template literals).
  const urls = [...src.matchAll(/https?:\/\/[^"'`\s${}]+/g)].map((u) => u[0]);
  for (const u of urls) {
    const okUrl = u.startsWith(SITE_URL) || ALLOWLIST.some((a) => u.startsWith(a));
    if (!okUrl) {
      console.error(`[jsonld] ${file}: foreign URL ${u} (expected ${SITE_URL})`);
      failed = true;
    }
  }
}

if (failed) process.exit(1);
console.log("OK: JSON-LD builders valid, URLs match SITE_URL.");
