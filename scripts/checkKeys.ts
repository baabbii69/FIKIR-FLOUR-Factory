/**
 * Finds arrays of objects whose items are missing `_key`.
 *
 * Sanity requires a unique `_key` on every item in an array of objects; without
 * it the Studio refuses to edit the list ("Missing keys"). Arrays of plain
 * strings/numbers are exempt. Easy to miss when writing documents through the
 * API, so this checks every document rather than relying on spotting it.
 */
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "ntiaycof",
  dataset: "production",
  apiVersion: "2024-10-01",
  useCdn: false,
});

type Hit = { id: string; path: string; count: number };

function scan(value: unknown, path: string, id: string, hits: Hit[]) {
  if (Array.isArray(value)) {
    const objects = value.filter((v) => v && typeof v === "object" && !Array.isArray(v));
    const missing = objects.filter((o) => !(o as Record<string, unknown>)._key);
    if (missing.length) hits.push({ id, path, count: missing.length });
    value.forEach((v, i) => scan(v, `${path}[${i}]`, id, hits));
    return;
  }
  if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (k.startsWith("_")) continue;
      scan(v, path ? `${path}.${k}` : k, id, hits);
    }
  }
}

async function main() {
  // An explicit slice is required: without one the API caps the result set,
  // which silently hid most documents from this scan the first time round.
  const docs: Record<string, unknown>[] = await client.fetch(
    `*[!(_id in path("_.**")) && _type != "sanity.imageAsset" && _type != "sanity.fileAsset"][0...2000]`
  );
  const hits: Hit[] = [];
  for (const d of docs) scan(d, "", String(d._id), hits);

  if (!hits.length) {
    console.log(`scanned ${docs.length} documents — every array item has a _key`);
    return;
  }
  console.log(`scanned ${docs.length} documents — ${hits.length} array(s) missing _key:\n`);
  for (const h of hits) console.log(`  ${h.id.padEnd(20)} ${h.path.padEnd(28)} ${h.count} item(s)`);
  process.exitCode = 1;
}

main().catch((e) => {
  console.error(e?.message ?? e);
  process.exit(1);
});
