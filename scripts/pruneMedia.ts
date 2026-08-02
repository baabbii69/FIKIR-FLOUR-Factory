/**
 * Reports which files in dist/media the built site still references.
 *
 * Since images and video now stream from Sanity's CDN, most of public/media is
 * dead weight in a deploy — and on Plesk a deploy is a manual upload, so
 * carrying ~100 MB of unused files costs real time on every release.
 *
 * Run with --apply to delete the unreferenced files from dist/ only. public/
 * is never touched: it stays the source of truth and the seed script's input.
 *
 *   npx tsx scripts/pruneMedia.ts          # report
 *   npx tsx scripts/pruneMedia.ts --apply  # prune dist/media
 */
import fs from "node:fs";
import path from "node:path";

const DIST_MEDIA = path.join("dist", "media");
const apply = process.argv.includes("--apply");

/**
 * All text of the built bundle plus src, concatenated.
 *
 * Matching whole `/media/...` paths does NOT work: the IMAGES map is emitted as
 * template literals (`${U}/still-milk.jpg`), so the full path never appears as
 * a literal. Matching on the *filename* catches both forms, and erring toward
 * keeping a file is the safe direction.
 */
function referenced(): string {
  const parts: string[] = [];

  const scan = (dir: string, exts: RegExp) => {
    if (!fs.existsSync(dir)) return;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) scan(p, exts);
      else if (exts.test(e.name)) parts.push(fs.readFileSync(p, "utf8"));
    }
  };

  // The bundle is what actually ships; src is a belt-and-braces second pass.
  scan(path.join("dist", "assets"), /\.(js|css)$/);
  scan("dist", /\.html$/);
  scan("src", /\.(ts|tsx)$/);
  return parts.join("\n");
}

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}

const refs = referenced();
const files = walk(DIST_MEDIA);
const keep: string[] = [];
const drop: string[] = [];

for (const f of files) {
  const name = path.basename(f);
  // A .webp sibling is served implicitly by <picture>, so keep it whenever its
  // base image is referenced.
  const siblings = [name, name.replace(/\.webp$/, ".jpg"), name.replace(/\.webp$/, ".png")];
  (siblings.some((n) => refs.includes(n)) ? keep : drop).push(f);
}

const mb = (list: string[]) =>
  list.reduce((n, f) => n + fs.statSync(f).size, 0) / 1048576;

console.log(`dist/media: ${files.length} files, ${mb(files).toFixed(1)} MB`);
console.log(`  still referenced : ${keep.length} files, ${mb(keep).toFixed(1)} MB`);
console.log(`  unreferenced     : ${drop.length} files, ${mb(drop).toFixed(1)} MB`);

if (!apply) {
  console.log("\nre-run with --apply to remove the unreferenced files from dist/");
} else {
  for (const f of drop) fs.unlinkSync(f);
  console.log(`\nremoved ${drop.length} files from dist/media (public/ untouched)`);
}
