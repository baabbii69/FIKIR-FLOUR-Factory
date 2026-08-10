/**
 * Uploads a new hero/film background clip to Sanity and points the Home page's
 * `film.loopUrl` at it.
 *
 * The field is a plain URL string rather than an asset reference, so the file
 * has to be uploaded first and the resulting CDN url written back.
 *
 * The previous asset is left in place. Sanity keeps it, so reverting is a
 * matter of pasting the old url back into the Studio — worth having while the
 * client is still deciding on the edit.
 *
 *   npx tsx scripts/uploadHeroLoop.ts <path-to-mp4>
 */
import fs from "node:fs";
import path from "node:path";

const file = process.argv[2];
if (!file || !fs.existsSync(file)) {
  console.error("usage: npx tsx scripts/uploadHeroLoop.ts <path-to-mp4>");
  process.exit(1);
}

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

const before = (await (
  await fetch(`${API}/data/query/${dataset}?query=${encodeURIComponent('*[_id=="homePage"][0].film.loopUrl')}`, {
    headers: auth,
  })
).json()) as { result?: string };
console.log("current loopUrl :", before.result ?? "(none)");

const bytes = fs.readFileSync(file);
console.log(`uploading       : ${path.basename(file)} (${(bytes.length / 1048576).toFixed(2)} MB)`);

const upload = await fetch(
  `${API}/assets/files/${dataset}?filename=${encodeURIComponent(path.basename(file))}`,
  { method: "POST", headers: { ...auth, "Content-Type": "video/mp4" }, body: bytes }
);
if (!upload.ok) {
  console.error("upload failed:", upload.status, await upload.text());
  process.exit(1);
}
const asset = (await upload.json()) as { document: { _id: string; url: string } };
console.log("uploaded        :", asset.document.url);

const patch = await fetch(`${API}/data/mutate/${dataset}`, {
  method: "POST",
  headers: { ...auth, "Content-Type": "application/json" },
  body: JSON.stringify({
    mutations: [{ patch: { id: "homePage", set: { "film.loopUrl": asset.document.url } } }],
  }),
});
if (!patch.ok) {
  console.error("patch failed:", patch.status, await patch.text());
  process.exit(1);
}

console.log("\nHome page film.loopUrl updated.");
console.log("previous url kept for rollback:\n  ", before.result ?? "(none)");
