/**
 * Reports fields the schema defines but the seeded documents do not have, so
 * empty boxes in the Studio can be traced to a missing source string rather
 * than found by clicking around.
 */
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "ntiaycof",
  dataset: "production",
  apiVersion: "2024-10-01",
  useCdn: false,
});

/** Top-level fields each singleton is expected to carry. */
const EXPECTED: Record<string, string[]> = {
  siteSettings: [
    "companyName", "tagline", "taglineAlt", "city", "established", "ceo", "ceoRole",
    "phones", "email", "addressLines", "hours", "website", "stats", "certificates",
    "registration", "tin",
  ],
  homePage: [
    "heroImage", "heroEyebrow", "heroHeading", "heroSub", "marquee",
    "whoWeAreEyebrow", "whoWeAreBody", "process", "film", "cta", "seo",
  ],
  aboutPage: [
    "hero", "whoWeAreHeading", "whoWeAreBody", "plantImage", "plantCaption",
    "employedCount", "employedLabel", "vision", "mission", "founder", "milestones",
    "valuesHeading", "people", "awards", "whyUs", "cta", "seo",
  ],
  productsPage: ["hero", "faqs", "cta", "seo"],
  facilityPage: ["hero", "overviewHeading", "overviewBody", "qualitySteps", "cta", "seo"],
  galleryPage: ["hero", "cta", "seo"],
  careersPage: ["hero", "introHeading", "introBody", "introImage", "valuesHeading", "cta", "seo"],
  // No cta: the contact page ends with the form and map.
  contactPage: ["hero", "formHeading", "formIntro", "mapEmbedUrl", "seo"],
};

/** Nested paths worth checking individually — a present object can still be
 *  missing the piece that renders. */
const NESTED: Record<string, string[]> = {
  homePage: ["heroHeading.lead.en", "film.eyebrow.en", "film.heading.lead.en", "cta.heading.lead.en", "cta.image.asset"],
  aboutPage: ["hero.heading.lead.en", "founder.heading.lead.en", "people.heading.lead.en", "awards.heading.lead.en", "cta.image.asset"],
  productsPage: ["hero.heading.lead.en", "cta.heading.lead.en"],
  facilityPage: ["hero.heading.lead.en", "overviewHeading.lead.en", "cta.heading.lead.en"],
  galleryPage: ["hero.heading.lead.en", "cta.heading.lead.en"],
  careersPage: ["hero.heading.lead.en", "introHeading.lead.en", "cta.heading.lead.en"],
  contactPage: ["hero.heading.lead.en"],
};

const get = (obj: unknown, path: string) =>
  path.split(".").reduce<unknown>((o, k) => (o == null ? o : (o as Record<string, unknown>)[k]), obj);

const empty = (v: unknown) =>
  v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0);

async function main() {
  let problems = 0;
  for (const [id, fields] of Object.entries(EXPECTED)) {
    const doc = await client.fetch(`*[_id == $id][0]`, { id });
    if (!doc) {
      console.log(`\n${id}: DOCUMENT MISSING`);
      problems++;
      continue;
    }
    const missing = fields.filter((f) => empty(doc[f]));
    const nestedMissing = (NESTED[id] ?? []).filter((p) => empty(get(doc, p)));
    if (missing.length || nestedMissing.length) {
      console.log(`\n${id}`);
      missing.forEach((f) => console.log(`   empty: ${f}`));
      nestedMissing.forEach((p) => console.log(`   empty: ${p}`));
      problems += missing.length + nestedMissing.length;
    }
  }

  // Collections: required-ish fields
  const checks: [string, string][] = [
    ["product", "name.en"], ["product", "blurb.en"], ["product", "image.asset"],
    ["galleryItem", "caption.en"], ["galleryItem", "image.asset"],
    ["companyValue", "title.en"], ["award", "issuer.en"],
    ["credentialScan", "image.asset"], ["testimonial", "quote.en"],
    ["jobOpening", "title.en"], ["category", "label.en"],
  ];
  for (const [type, field] of checks) {
    const n = await client.fetch(`count(*[_type == $type && !defined(${field})])`, { type });
    if (n > 0) {
      console.log(`\n${type}: ${n} missing ${field}`);
      problems += n;
    }
  }

  console.log(problems === 0 ? "\nno empty fields found" : `\n${problems} empty field(s)`);
}

main().catch((e) => {
  console.error(e?.message ?? e);
  process.exit(1);
});
