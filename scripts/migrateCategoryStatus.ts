/**
 * One-off migration: category.hidden (boolean) -> category.status (string).
 *
 * The old flag could only remove a line from the site entirely. That is the
 * wrong tool for a product that has paused production and will return: hiding
 * it throws away the page, its photos and its search ranking, all of which have
 * to be rebuilt from scratch when it comes back.
 *
 *   hidden: true   ->  status: "paused"   (visible, marked unavailable)
 *   hidden: false  ->  status: "active"
 *
 * Chips are the only paused line today, which is exactly the case this exists
 * for. Anything that genuinely needs removing can be set to "hidden" in the
 * Studio afterwards.
 *
 *   npx tsx scripts/migrateCategoryStatus.ts          # report
 *   npx tsx scripts/migrateCategoryStatus.ts --apply
 */
import fs from "node:fs";

const apply = process.argv.includes("--apply");
const env = fs.readFileSync(".env.local", "utf8");
const token = env.match(/^SANITY_WRITE_TOKEN=(.+)$/m)?.[1]?.trim();
const project = env.match(/^VITE_SANITY_PROJECT_ID=(.+)$/m)?.[1]?.trim() ?? "ntiaycof";
const dataset = env.match(/^VITE_SANITY_DATASET=(.+)$/m)?.[1]?.trim() ?? "production";
if (!token) {
  console.error("SANITY_WRITE_TOKEN missing from .env.local");
  process.exit(1);
}

const API = `https://${project}.api.sanity.io/v2024-10-01`;
const auth = { Authorization: `Bearer ${token}` };

type Cat = { _id: string; key: string; hidden?: boolean; status?: string };

const res = await fetch(
  `${API}/data/query/${dataset}?query=${encodeURIComponent(
    '*[_type=="category"]{_id,key,hidden,status} | order(key asc)'
  )}`,
  { headers: auth }
);
const cats = ((await res.json()) as { result: Cat[] }).result ?? [];

const mutations = cats.map((c) => {
  const status = c.status ?? (c.hidden ? "paused" : "active");
  return {
    patch: { id: c._id, set: { status }, unset: ["hidden"] },
    _report: `${c.key.padEnd(10)} hidden=${String(c.hidden ?? false).padEnd(5)} -> status="${status}"`,
  };
});

for (const m of mutations) console.log("  " + m._report);

if (!apply) {
  console.log("\nre-run with --apply to write these changes");
  process.exit(0);
}

const write = await fetch(`${API}/data/mutate/${dataset}`, {
  method: "POST",
  headers: { ...auth, "Content-Type": "application/json" },
  body: JSON.stringify({ mutations: mutations.map(({ _report, ...m }) => m) }),
});
if (!write.ok) {
  console.error("\nmutation failed:", write.status, await write.text());
  process.exit(1);
}
console.log(`\n${mutations.length} categories migrated.`);
