/**
 * Checks whether an origin is allowed to read content from Sanity.
 *
 * This matters more than it looks. If the live domain is not in Sanity's CORS
 * list, the site still renders — the snapshot baked into the bundle covers it —
 * but the runtime refresh silently fails with a 403. The client would then edit
 * content in the Studio, press Publish, and see nothing change on the site,
 * with no visible error anywhere.
 *
 *   npx tsx scripts/checkCors.ts https://fikirfoods.et
 *   npx tsx scripts/checkCors.ts            # checks the usual origins
 */
const PROJECT = process.env.VITE_SANITY_PROJECT_ID || "ntiaycof";
const DATASET = process.env.VITE_SANITY_DATASET || "production";

const DEFAULTS = [
  "https://fikirfoods.et",
  "https://www.fikirfoods.et",
  "http://localhost:5173",
];

const origins = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULTS;

const query = encodeURIComponent('count(*[_type=="product"])');
const url = `https://${PROJECT}.apicdn.sanity.io/v2024-10-01/data/query/${DATASET}?query=${query}`;

let bad = 0;

for (const origin of origins) {
  try {
    const res = await fetch(url, { headers: { Origin: origin } });
    const allowed = res.status === 200;
    if (!allowed) bad++;
    console.log(
      `  ${allowed ? "allowed" : "BLOCKED"}  ${origin}` +
        (allowed ? "" : `  (HTTP ${res.status} — add it in Sanity → API → CORS origins)`)
    );
  } catch (e) {
    bad++;
    console.log(`  ERROR    ${origin}  ${(e as Error).message}`);
  }
}

console.log(
  bad === 0
    ? "\nAll origins can read content."
    : `\n${bad} origin(s) blocked. Until fixed, published edits will not reach the site.`
);
process.exit(bad === 0 ? 0 : 1);
