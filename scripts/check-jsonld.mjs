#!/usr/bin/env node
// Validate JSON-LD blocks in root + index routes and confirm URLs match SITE_URL.
import { readFileSync } from "node:fs";

const SITE_URL = "https://drawdowncal.lovable.app";
const FILES = ["src/routes/__root.tsx", "src/routes/index.tsx"];

let failed = false;

function extractJsonLd(src) {
  // Find JSON.stringify({...}) inside scripts entries with application/ld+json
  const blocks = [];
  const re = /type:\s*["']application\/ld\+json["'][\s\S]*?JSON\.stringify\(([\s\S]*?)\)\s*,?\s*\}/g;
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
      // eslint-disable-next-line no-new-func
      obj = new Function(`return (${normalized});`)();
    } catch (e) {
      console.error(`[jsonld] ${file}#${i}: failed to parse: ${e.message}`);
      failed = true;
      continue;
    }
    const json = JSON.stringify(obj);
    if (!obj["@context"]) {
      console.error(`[jsonld] ${file}#${i}: missing @context`);
      failed = true;
    }
    // Find URLs and check domain
    const urls = json.match(/https?:\/\/[^"\s]+/g) || [];
    for (const u of urls) {
      if (u.startsWith("https://schema.org")) continue;
      if (!u.startsWith(SITE_URL)) {
        console.error(`[jsonld] ${file}#${i}: foreign URL ${u} (expected ${SITE_URL})`);
        failed = true;
      }
    }
  }
}

if (failed) process.exit(1);
console.log("OK: JSON-LD valid, URLs match SITE_URL.");
