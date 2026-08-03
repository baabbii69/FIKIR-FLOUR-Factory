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

console.log(
  failures === 0
    ? "\nAll checks passed — the site is wired to Sanity.\n"
    : `\n${failures} check(s) failed.\n`
);
process.exit(failures === 0 ? 0 : 1);
