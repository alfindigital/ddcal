// Utility helpers shared by check-jsonld and its tests.

export function extractUrls(obj) {
  const json = JSON.stringify(obj);
  return json.match(/https?:\/\/[^"\s]+/g) || [];
}

// Returns array of URLs that are NOT under siteUrl and NOT on the allowlist
// (schema.org vocab URLs are always allowed).
export function findForeignUrls(urls, siteUrl, allowlist = ["https://schema.org"]) {
  const allowed = [siteUrl, ...allowlist];
  return urls.filter((u) => !allowed.some((a) => u.startsWith(a)));
}

export function isSchemaOrgVocab(url) {
  return url.startsWith("https://schema.org");
}
