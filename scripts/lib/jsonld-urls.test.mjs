import { test } from "node:test";
import assert from "node:assert/strict";
import { extractUrls, findForeignUrls, isSchemaOrgVocab } from "./jsonld-urls.mjs";

const SITE = "https://drawdowncal.lovable.app";

test("extractUrls finds http(s) urls in nested objects", () => {
  const obj = {
    "@context": "https://schema.org",
    url: SITE,
    nested: { logo: `${SITE}/logo.png`, ext: "https://example.com/x" },
  };
  const urls = extractUrls(obj);
  assert.ok(urls.includes("https://schema.org"));
  assert.ok(urls.includes(SITE));
  assert.ok(urls.includes(`${SITE}/logo.png`));
  assert.ok(urls.includes("https://example.com/x"));
});

test("findForeignUrls ignores schema.org and site urls", () => {
  const urls = ["https://schema.org", SITE, `${SITE}/og-image.jpg`, "https://example.com/foreign"];
  const foreign = findForeignUrls(urls, SITE);
  assert.deepEqual(foreign, ["https://example.com/foreign"]);
});

test("findForeignUrls returns empty when all urls match site", () => {
  const urls = [SITE, `${SITE}/`, `${SITE}/preview-meta`];
  assert.deepEqual(findForeignUrls(urls, SITE), []);
});

test("findForeignUrls does NOT treat lookalike domains as site (no false positive)", () => {
  const urls = ["https://drawdowncal.lovable.app.evil.com/x"];
  // startsWith match means evil subdomain pretending. Confirm it's flagged.
  // Note: startsWith would actually MATCH here since the string starts with the site.
  // That's a real false negative we want to harden — switch matcher to origin-based.
  const foreign = findForeignUrls(urls, SITE);
  assert.deepEqual(foreign, ["https://drawdowncal.lovable.app.evil.com/x"]);
});

test("isSchemaOrgVocab true for schema.org urls only", () => {
  assert.equal(isSchemaOrgVocab("https://schema.org/Article"), true);
  assert.equal(isSchemaOrgVocab(SITE), false);
});
