#!/usr/bin/env node
// Validate JSON-LD blocks in root + index routes and confirm URLs match SITE_URL.
import { readFileSync } from "node:fs";
import { extractUrls, findForeignUrls } from "./lib/jsonld-urls.mjs";

const SITE_URL = process.env.VITE_SITE_URL || "https://ddcal.lotmetrik.my.id";
// Route-level JSON-LD now comes from helper builders in src/lib/jsonld.ts (not
// inline literals), so we only statically validate the root graph here. The
// rendered-HTML check (check-built-html.mjs) covers the per-route blocks.
const FILES = ["src/routes/__root.tsx"];
// alfindigital.com is the legitimate author/creator URL in the app schema.
const ALLOWLIST = ["https://schema.org", "https://alfindigital.com"];

let failed = false;

function extractJsonLd(src) {
  // Find JSON.stringify({...}) inside scripts entries with application/ld+json
  const blocks = [];
  const re =
    /type:\s*["']application\/ld\+json["'][\s\S]*?JSON\.stringify\(([\s\S]*?)\)\s*,?\s*\}/g;
  let m;
  while ((m = re.exec(src))) blocks.push(m[1]);
  return blocks;
}

for (const file of FILES) {
  const src = readFileSync(file, "utf8");
  const blocks = extractJsonLd(src);
  if (!blocks.length) {
    console.error(`[jsonld] ${file}: no JSON-LD blocks found`);
    failed = true;
    continue;
  }
  for (const [i, raw] of blocks.entries()) {
    // Replace template literals / SITE_URL / SITE_NAME references with placeholders to eval as JSON-ish
    let normalized = raw
      .replace(/SITE_URL/g, JSON.stringify(SITE_URL))
      .replace(/SITE_NAME/g, JSON.stringify("DrawdownCal"))
      .replace(/APP_URL/g, JSON.stringify(SITE_URL));
    let obj;
    try {
      obj = new Function(`return (${normalized});`)();
    } catch (e) {
      console.error(`[jsonld] ${file}#${i}: failed to parse: ${e.message}`);
      failed = true;
      continue;
    }
    if (!obj["@context"]) {
      console.error(`[jsonld] ${file}#${i}: missing @context`);
      failed = true;
    }
    const urls = extractUrls(obj);
    const foreign = findForeignUrls(urls, SITE_URL, ALLOWLIST);
    for (const u of foreign) {
      console.error(`[jsonld] ${file}#${i}: foreign URL ${u} (expected ${SITE_URL})`);
      failed = true;
    }
  }
}

if (failed) process.exit(1);
console.log("OK: JSON-LD valid, URLs match SITE_URL.");
