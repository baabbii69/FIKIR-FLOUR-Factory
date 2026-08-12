/**
 * End-to-end check of the CMS wiring, without a browser.
 *
 * Runs the same functions the app runs — the flatten-to-keys mapping and the
 * image URL builder — against the real snapshot, and asserts that the values
 * components will receive are the ones sitting in Sanity.
 */
import fs from "node:fs";
import { flattenToKeys } from "../src/lib/cms/flattenKeys";
import { imageUrl } from "../src/lib/cms/client";
import type { SiteContent } from "../src/lib/cms/types";
import { AM } from "../src/i18n/am";
import { OM } from "../src/i18n/om";

const content = JSON.parse(fs.readFileSync("src/generated/content.json", "utf8")) as SiteContent;

let failures = 0;
const check = (label: string, ok: boolean, detail = "") => {
  if (!ok) failures++;
  console.log(`  ${ok ? "pass" : "FAIL"}  ${label}${detail ? ` — ${detail}` : ""}`);
};

console.log("\n1. English keys resolve from the CMS");
const enKeys = flattenToKeys(content, "en");
const expectEn: [string, string][] = [
  ["home.hero.title", "We produce quality, *we deliver trust.*"],
  ["about.founder.title", "A work ethic he *inherited, not learned.*"],
  ["about.awards.title", "Recognised by *those we work with.*"],
  ["prod.special.name", "Special Flour"],
  ["home.mq.1", "Since 2004 E.C."],
  ["cert.authority", "Institute of Ethiopian Standards (IES)"],
];
for (const [k, v] of expectEn) check(k, enKeys[k] === v, enKeys[k] ? "" : "missing");

console.log("\n2. Heading lead + accent recombine into the *starred* form");
check(
  "accent markers present",
  (enKeys["home.hero.title"]?.match(/\*/g) ?? []).length === 2,
  enKeys["home.hero.title"]
);

console.log("\n3. Amharic and Afan Oromo resolve from the CMS, not the fallback");
const amKeys = flattenToKeys(content, "am");
const omKeys = flattenToKeys(content, "om");
check("am home.hero.title differs from en", amKeys["home.hero.title"] !== enKeys["home.hero.title"]);
check("om prod.special.name differs from en", omKeys["prod.special.name"] !== enKeys["prod.special.name"]);
check("am matches the shipped dictionary", amKeys["prod.special.name"] === AM["prod.special.name"]);
check("om matches the shipped dictionary", omKeys["prod.special.name"] === OM["prod.special.name"]);

console.log("\n4. Every gallery caption is translated in all three languages");
const capMissing = (content.galleryItems ?? []).filter((g) => !g.caption?.am || !g.caption?.om).length;
check("31 captions, none missing am/om", capMissing === 0, `${capMissing} missing`);

console.log("\n5. Images resolve to sized Sanity CDN urls");
const p0 = content.productList?.[0];
const url = imageUrl(p0?.image, 800);
check("product image url built", !!url);
check("points at the Sanity CDN", !!url?.includes("cdn.sanity.io"));
check("requests the width asked for", !!url?.includes("w=800"), url?.split("?")[1]);
check("negotiates format automatically", !!url?.includes("auto=format"));

console.log("\n6. Video urls come from the CMS");
check("loop url set", !!content.home?.film?.loopUrl?.startsWith("https://cdn.sanity.io"));
check("full film url set", !!content.home?.film?.fullUrl?.startsWith("https://cdn.sanity.io"));

console.log("\n7. Collections are complete");
const counts: [string, number, number][] = [
  ["products", content.productList?.length ?? 0, 20],
  ["gallery", content.galleryItems?.length ?? 0, 31],
  ["values", content.values?.length ?? 0, 6],
  ["awards", content.awards?.length ?? 0, 6],
  ["certificate scans", content.certShots?.length ?? 0, 7],
  ["testimonials", content.testimonials?.length ?? 0, 3],
  ["openings", content.openings?.length ?? 0, 3],
];
for (const [label, got, want] of counts) check(`${label}: ${got}`, got === want, got === want ? "" : `expected ${want}`);

console.log("\n8. Settings the pages depend on");
const s = content.settings;
check("email", s?.email === "contact@fikirfoods.et", s?.email);
check("phones", (s?.phones?.length ?? 0) === 3);
check("stats", (s?.stats?.length ?? 0) === 4);
check("certificates", (s?.certificates?.length ?? 0) === 2);
check("ceo", s?.ceo === "Ato Fikru Garedew", s?.ceo);

/**
 * Section 9 exists because pruneMedia once deleted all 20 marquee packs from a
 * live deploy: the code builds their src as `/media/${p}.png`, so the filename
 * never appears literally and the pruner could not see them. Nothing in the
 * bundle catches that — the site builds, typechecks and ships with broken
 * images. This compares what survived the prune against what the source
 * actually names, so over-pruning fails the build instead of the browser.
 */
if (fs.existsSync("dist/media")) {
  console.log("\n9. Local media survived the prune");
  const srcText = fs
    .readdirSync("src", { recursive: true, encoding: "utf8" })
    .filter((f) => /\.(ts|tsx)$/.test(f))
    .map((f) => fs.readFileSync(`src/${f}`, "utf8"))
    .join("\n");

  // Recursive: media/products/ holds the pack shots.
  const names = (dir: string) =>
    fs.readdirSync(dir, { recursive: true, encoding: "utf8" }).map((f) => f.replace(/^.*[\\/]/, ""));

  const shipped = new Set(names("dist/media"));
  const missing = names("public/media")
    .filter((name) => {
      if (shipped.has(name)) return false;
      const stem = name.replace(/\.[a-z0-9]+$/i, "");
      return srcText.includes(stem);
    });

  check(
    `${shipped.size} files shipped, none referenced by src are missing`,
    missing.length === 0,
    missing.slice(0, 8).join(", ")
  );
}

/**
 * Section 10 exists because Gallery shipped with its hero and CTA images
 * hardcoded to local files. Every check above passed: the query fetched the
 * fields, the snapshot contained them, the CDN served them. The page simply
 * never read them, so an editor could change the photo in the Studio, see it
 * save and publish, and watch nothing happen on the site — with no error
 * anywhere to explain why.
 *
 * Resolving content is not the same as rendering it. This asserts the page
 * component actually references the field.
 */
console.log("\n10. Page images are read from the CMS, not hardcoded");
const PAGE_FILES: Record<string, string> = {
  home: "Home", about: "About", products: "Products",
  facility: "Facility", gallery: "Gallery", careers: "Careers", contact: "Contact",
};

for (const [key, file] of Object.entries(PAGE_FILES)) {
  const section = (content as unknown as Record<string, Record<string, unknown>>)[key];
  const path = `src/pages/${file}.tsx`;
  if (!section || !fs.existsSync(path)) continue;
  const src = fs.readFileSync(path, "utf8");

  // `home` names it heroImage; the rest nest it under hero.image.
  const hero = section.hero || section.heroImage;
  if (hero) {
    const ok = src.includes(`cms.${key}?.hero?.image`) || src.includes(`cms.${key}?.heroImage`);
    check(`${file}: hero image`, ok, ok ? "" : "field exists in the CMS but the page never reads it");
  }
  if ((section.cta as Record<string, unknown> | undefined)?.image) {
    const ok = src.includes(`cms.${key}?.cta?.image`);
    check(`${file}: cta image`, ok, ok ? "" : "field exists in the CMS but the page never reads it");
  }
}

/**
 * Section 11 guards the pre-render, because its failure mode is silent and
 * expensive: the build still succeeds, the site still works for humans, and
 * only crawlers see an empty body. That is exactly how every inner page sat
 * unindexed for weeks with nothing appearing to be wrong.
 *
 * Reads the shipped HTML the way a crawler does — scripts stripped — so a page
 * that renders only via JavaScript fails here rather than in Search Console a
 * month from now.
 */
if (fs.existsSync("dist/index.html")) {
  console.log("\n11. Every route ships pre-rendered HTML");
  const sitemap = fs.readFileSync("public/sitemap.xml", "utf8");
  const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
    new URL(m[1]).pathname.replace(/\/$/, "")
  );

  for (const p of paths) {
    const file = p === "" ? "dist/index.html" : `dist${p}/index.html`;
    if (!fs.existsSync(file)) {
      check(p || "/", false, "no pre-rendered HTML — run npm run prerender");
      continue;
    }
    const body = /<body[^>]*>([\s\S]*)<\/body>/.exec(fs.readFileSync(file, "utf8"))?.[1] ?? "";
    const words = body
      .replace(/<script[\s\S]*?<\/script>/g, "")
      .replace(/<[^>]+>/g, " ")
      .split(/\s+/)
      .filter(Boolean).length;
    // 120 sits well below the thinnest real page (Gallery, ~224 words) and far
    // above an empty shell, which scores 0.
    check(
      `${(p || "/").padEnd(10)} ${String(words).padStart(4)} words`,
      words >= 120,
      words >= 120 ? "" : "body is effectively empty to a crawler"
    );
  }
}

console.log(
  failures === 0
    ? "\nAll checks passed — the site is wired to Sanity.\n"
    : `\n${failures} check(s) failed.\n`
);
process.exit(failures === 0 ? 0 : 1);
