// Utility helpers shared by check-jsonld and its tests.

export function extractUrls(obj) {
  const json = JSON.stringify(obj);
  return json.match(/https?:\/\/[^"\s]+/g) || [];
}

function sameOrigin(url, base) {
  try {
    const u = new URL(url);
    const b = new URL(base);
    return u.origin === b.origin;
  } catch {
    return false;
  }
}

// Returns URLs that are NOT same-origin with siteUrl and NOT on the allowlist.
// Uses URL origin matching to avoid false positives from lookalike domains
// (e.g. "https://site.app.evil.com" must NOT match "https://site.app").
export function findForeignUrls(urls, siteUrl, allowlist = ["https://schema.org"]) {
  return urls.filter((u) => {
    if (sameOrigin(u, siteUrl)) return false;
    if (allowlist.some((a) => sameOrigin(u, a) || u.startsWith(a))) return false;
    return true;
  });
}

export function isSchemaOrgVocab(url) {
  return url.startsWith("https://schema.org");
}
