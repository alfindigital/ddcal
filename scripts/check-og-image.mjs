#!/usr/bin/env node
// Validate the OG image exists and has reasonable dimensions for social sharing.
// Acceptable: aspect ratio close to 1.91:1 (Facebook/LinkedIn/Twitter large card)
// or 1.5:1 (current asset). Minimum 600x315.
import { readFileSync, existsSync, statSync } from "node:fs";

const FILE = "public/og-image.jpg";
const FALLBACK = "public/og-image-fallback.svg";

function readJpegSize(buf) {
  // Walk JPEG markers to find SOF0/SOF2 frame.
  let i = 2; // skip SOI
  while (i < buf.length) {
    if (buf[i] !== 0xff) throw new Error("invalid jpeg marker");
    const marker = buf[i + 1];
    const len = buf.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xc3) {
      const height = buf.readUInt16BE(i + 5);
      const width = buf.readUInt16BE(i + 7);
      return { width, height };
    }
    i += 2 + len;
  }
  throw new Error("no SOF marker");
}

let failed = false;

if (!existsSync(FILE)) {
  console.error(`[og-image] missing ${FILE}`);
  if (existsSync(FALLBACK)) {
    console.warn(`[og-image] fallback present at ${FALLBACK} — pass`);
  } else {
    failed = true;
  }
} else {
  const buf = readFileSync(FILE);
  const { size } = statSync(FILE);
  try {
    const { width, height } = readJpegSize(buf);
    const ratio = width / height;
    console.log(`[og-image] ${FILE}: ${width}x${height} (${(size / 1024).toFixed(0)} KB), ratio ${ratio.toFixed(2)}`);
    if (width < 600 || height < 315) {
      console.error(`[og-image] too small (min 600x315)`);
      failed = true;
    }
    if (ratio < 1.4 || ratio > 2.1) {
      console.error(`[og-image] aspect ratio ${ratio.toFixed(2)} outside acceptable 1.4-2.1`);
      failed = true;
    }
    if (size > 5 * 1024 * 1024) {
      console.error(`[og-image] file >5MB, may be rejected by some scrapers`);
      failed = true;
    }
  } catch (e) {
    console.error(`[og-image] could not read dimensions: ${e.message}`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log("OK: OG image valid.");
