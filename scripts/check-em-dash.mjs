#!/usr/bin/env node
// Scan src/ for em dashes (—) in user-facing strings.
// Skips comments and the script itself. Exits non-zero on any hit.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOT = "src";
const EXTS = new Set([".ts", ".tsx", ".js", ".jsx"]);
const EM = "\u2014";

function stripComments(src) {
  // remove /* ... */ and // ... line comments (best effort, ignores strings)
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/[^\n]*/g, "$1");
}

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, out);
    else if (EXTS.has(extname(p))) out.push(p);
  }
  return out;
}

const hits = [];
for (const f of walk(ROOT)) {
  const raw = readFileSync(f, "utf8");
  const cleaned = stripComments(raw);
  if (!cleaned.includes(EM)) continue;
  const lines = raw.split("\n");
  lines.forEach((ln, i) => {
    if (ln.includes(EM) && !ln.trim().startsWith("//") && !ln.trim().startsWith("*")) {
      hits.push(`${f}:${i + 1}: ${ln.trim()}`);
    }
  });
}

if (hits.length) {
  console.error("Em dash (\u2014) found in user-facing code:");
  for (const h of hits) console.error("  " + h);
  process.exit(1);
}
console.log("OK: no em dashes in user-facing strings.");
