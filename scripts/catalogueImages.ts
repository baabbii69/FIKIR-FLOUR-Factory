/**
 * Exports one image per product for the printed company profile.
 *
 * Pulls each product's main photo from Sanity at full resolution — the site
 * only ever requests ~1200px versions, which are fine on screen and too soft
 * once a page is printed.
 *
 * Files are numbered in catalogue order and named after the product, so
 * whoever assembles the document can match them without opening every file.
 * A mapping sheet is written alongside for the same reason.
 *
 *   npx tsx scripts/catalogueImages.ts
 */
import fs from "node:fs";
import path from "node:path";
import content from "../src/generated/content.json";

const OUT = path.join("catalogue-images");

type Loc = { en?: string };
type Product = {
  slug: string;
  name?: Loc;
  category?: string;
  brand?: string;
  meta?: Loc;
  blurb?: Loc;
  image?: { asset?: { _ref?: string } };
};

const en = (l: Loc | undefined) => l?.en ?? "";

/** Order the catalogue reads in: flour first, then the Unic ranges. */
const ORDER = ["flour", "biscuits", "wafers", "chips"];

const products = ((content as { productList?: Product[] }).productList ?? [])
  .slice()
  .sort((a, b) => {
    const c = ORDER.indexOf(a.category ?? "") - ORDER.indexOf(b.category ?? "");
    return c !== 0 ? c : 0;
  });

/**
 * Sanity image refs encode their own dimensions, so the original size can be
 * requested exactly rather than guessed at.
 */
function fullSizeUrl(ref: string): { url: string; w: number; h: number; ext: string } {
  const [, id, dims, ext] = ref.split("-");
  const [w, h] = dims.split("x").map(Number);
  return {
    url: `https://cdn.sanity.io/images/ntiaycof/production/${id}-${dims}.${ext}?w=${w}&q=95`,
    w, h, ext,
  };
}

/**
 * Largest local image whose filename mentions this product, if it beats the
 * CMS copy on pixel count. Dimensions are read from the file header only.
 */
function bestLocal(slug: string, cmsPixels: number): { file: string; size: [number, number] } | null {
  const key = slug.replace(/^(wafer|chips)-/, "");
  const roots = ["public/media", "public/media/products"];
  let best: { file: string; size: [number, number] } | null = null;

  for (const dir of roots) {
    if (!fs.existsSync(dir)) continue;
    for (const name of fs.readdirSync(dir)) {
      if (!/\.(png|jpe?g)$/i.test(name)) continue;
      if (!name.toLowerCase().includes(key)) continue;
      const file = path.join(dir, name);
      const size = imageSize(fs.readFileSync(file));
      if (!size) continue;
      const px = size[0] * size[1];
      if (px > cmsPixels && (!best || px > best.size[0] * best.size[1])) best = { file, size };
    }
  }
  return best;
}

/** Minimal PNG/JPEG header reader — avoids pulling in an image library. */
function imageSize(b: Buffer): [number, number] | null {
  if (b.length > 24 && b.readUInt32BE(0) === 0x89504e47) {
    return [b.readUInt32BE(16), b.readUInt32BE(20)];
  }
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const marker = b[i + 1];
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
      }
      i += 2 + b.readUInt16BE(i + 2);
    }
  }
  return null;
}

fs.mkdirSync(OUT, { recursive: true });

const rows: string[] = [];
let n = 0;

for (const p of products) {
  const ref = p.image?.asset?._ref;
  if (!ref) {
    console.log(`  SKIP  ${en(p.name)} — no image in the CMS`);
    continue;
  }
  n++;
  const { url, w, h, ext } = fullSizeUrl(ref);
  // eslint-disable-next-line prefer-const
  const file = `${String(n).padStart(2, "0")}-${p.slug}.${ext}`;

  const res = await fetch(url);
  if (!res.ok) {
    console.log(`  FAIL  ${file} — HTTP ${res.status}`);
    continue;
  }
  let buf = Buffer.from(await res.arrayBuffer());
  let src = "cms";
  let [fw, fh] = [w, h];

  // The CMS copy is not always the best one we hold. Some products were
  // uploaded from a small crop while a larger original still sits in public/,
  // and print will show the difference even though the website never did.
  const better = bestLocal(p.slug, w * h);
  if (better) {
    buf = fs.readFileSync(better.file);
    src = path.basename(better.file);
    [fw, fh] = better.size;
  }

  const outFile = file.replace(/\.\w+$/, path.extname(src === "cms" ? file : src));
  fs.writeFileSync(path.join(OUT, outFile), buf);

  const kb = Math.round(buf.length / 1024);
  const flag = fw < 900 ? "  <- LOW RES, needs a new photo" : "";
  const from = src === "cms" ? "" : `  (from ${src})`;
  console.log(`  ${outFile.padEnd(30)} ${fw}x${fh}  ${String(kb).padStart(5)} KB${flag}${from}`);

  rows.push(
    [outFile, en(p.name), p.category ?? "", p.brand ?? "", en(p.meta), `${fw}x${fh}`]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  );
}

fs.writeFileSync(
  path.join(OUT, "products.csv"),
  ["file,product,category,brand,pack sizes,pixels", ...rows].join("\n") + "\n",
  "utf8"
);

console.log(`\n${n} images written to ${OUT}/ with products.csv`);
