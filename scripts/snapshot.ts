/**
 * Bakes the current CMS content into the bundle.
 *
 * Runs before every `npm run build`. The result is imported directly by the
 * app, so the first paint renders real content with no network round trip and
 * the site still works if Sanity is unreachable. The runtime fetch then layers
 * fresher content on top.
 *
 * If the fetch fails the existing snapshot is kept and the build continues —
 * a CMS outage must never break a deploy.
 */
import fs from "node:fs";
import path from "node:path";
import { sanity } from "../src/lib/cms/client";
import { SITE_QUERY } from "../src/lib/cms/query";

const OUT = path.join("src", "generated", "content.json");

async function main() {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  try {
    const data = await sanity.fetch(SITE_QUERY);
    const counts = {
      products: data?.productList?.length ?? 0,
      gallery: data?.galleryItems?.length ?? 0,
      awards: data?.awards?.length ?? 0,
    };
    if (!data?.settings || counts.products === 0) {
      throw new Error("query returned no settings or no products — refusing to write a broken snapshot");
    }
    const json = JSON.stringify(data);
    fs.writeFileSync(OUT, json);
    console.log(
      `snapshot: ${(json.length / 1024).toFixed(1)} KB — ` +
        `${counts.products} products, ${counts.gallery} gallery, ${counts.awards} awards`
    );
  } catch (err) {
    const msg = (err as Error)?.message ?? err;
    if (fs.existsSync(OUT)) {
      console.warn(`snapshot: fetch failed (${msg}); keeping the existing snapshot`);
      return;
    }
    // No previous snapshot to fall back on: write an empty object so the import
    // resolves and the app falls back to its built-in content.
    fs.writeFileSync(OUT, "{}");
    console.warn(`snapshot: fetch failed (${msg}); wrote an empty snapshot`);
  }
}

main();
