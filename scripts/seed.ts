/**
 * Seeds the Sanity dataset from the content that currently lives in code.
 *
 * Idempotent: every document uses a deterministic _id, so re-running updates in
 * place instead of creating duplicates. Uploaded assets are cached in
 * scripts/.asset-cache.json so re-runs skip the (slow) upload step.
 *
 *   npx tsx scripts/seed.ts            # assets + documents
 *   npx tsx scripts/seed.ts --assets   # upload assets only
 *   npx tsx scripts/seed.ts --docs     # documents only (assets must be cached)
 */
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";
import { extractAll } from "./extractEnglish";
import { AM } from "../src/i18n/am";
import { OM } from "../src/i18n/om";
import * as S from "../src/data/site";

/* ------------------------------- client --------------------------------- */

const token = process.env.SANITY_WRITE_TOKEN;
if (!token) {
  console.error("SANITY_WRITE_TOKEN missing. Run with the .env.local values loaded.");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID || "ntiaycof",
  dataset: process.env.VITE_SANITY_DATASET || "production",
  apiVersion: process.env.VITE_SANITY_API_VERSION || "2024-10-01",
  token,
  useCdn: false,
});

/* ------------------------------ localisation ----------------------------- */

const EN = extractAll();

/** Build a {en, am, om} value. `fallback` covers keys whose English lives in
 *  data/site.ts rather than inline in JSX. */
const loc = (key: string, fallback?: string) => {
  const en = EN[key] ?? fallback;
  if (en === undefined) return undefined;
  const v: Record<string, string> = { _type: "localeString", en } as never;
  if (AM[key]) v.am = AM[key];
  if (OM[key]) v.om = OM[key];
  return v;
};
const locText = (key: string, fallback?: string) => {
  const v = loc(key, fallback);
  return v ? { ...v, _type: "localeText" } : undefined;
};
/** A plain value with no i18n key behind it. */
const en = (s: string) => ({ _type: "localeString", en: s });

/** Stamps a _key onto each item of an array of objects. Sanity requires one,
 *  and without it the Studio shows "Missing keys" and blocks editing. */
const keyed = <T>(items: T[], prefix: string) =>
  items.filter(Boolean).map((v, i) => ({ ...(v as object), _key: `${prefix}${i}` }));

/** Splits "Lead *highlighted.*" into the two fields the schema uses, so editors
 *  never have to place an asterisk. */
function heading(key: string, fallback?: string) {
  const pick = (dict: Record<string, string> | null, k: string, fb?: string) =>
    dict ? dict[k] : (EN[k] ?? fb);
  const build = (raw?: string) => {
    if (!raw) return null;
    const m = raw.match(/^([\s\S]*?)\*([\s\S]+?)\*([\s\S]*)$/);
    return m ? { lead: (m[1] + m[3]).trim(), accent: m[2].trim() } : { lead: raw.trim(), accent: "" };
  };
  const parts = {
    en: build(pick(null, key, fallback)),
    am: build(AM[key]),
    om: build(OM[key]),
  };
  if (!parts.en) return undefined;
  const lead: Record<string, string> = { _type: "localeString", en: parts.en.lead };
  const accent: Record<string, string> = { _type: "localeString", en: parts.en.accent };
  if (parts.am) { lead.am = parts.am.lead; accent.am = parts.am.accent; }
  if (parts.om) { lead.om = parts.om.lead; accent.om = parts.om.accent; }
  return { _type: "localeHeading", lead, accent };
}

/** Two separate keys (title + accent), as PageHero/CTABanner already take them. */
function heading2(leadKey: string, accentKey: string) {
  const lead = loc(leadKey);
  const accent = loc(accentKey);
  if (!lead) return undefined;
  return { _type: "localeHeading", lead, accent: accent ?? en("") };
}

/* --------------------------------- assets -------------------------------- */

const CACHE = path.join("scripts", ".asset-cache.json");
const cache: Record<string, string> = fs.existsSync(CACHE)
  ? JSON.parse(fs.readFileSync(CACHE, "utf8"))
  : {};

/** Every image path the content refers to. */
function referencedImages(): string[] {
  const set = new Set<string>();
  const add = (p?: string) => {
    if (p && p.startsWith("/media/")) set.add(p);
  };
  Object.values(S.IMAGES).forEach(add);
  S.PRODUCTS.forEach((p) => {
    add(p.image);
    p.gallery?.forEach(add);
  });
  S.GALLERY.forEach((g) => add(g.src));
  S.PROCESS.forEach((p) => add(p.img));
  S.CERT_SHOTS.forEach((c) => add(c.src));
  return [...set];
}

async function uploadAssets() {
  const paths = referencedImages();
  const todo = paths.filter((p) => !cache[p]);
  console.log(`assets: ${paths.length} referenced, ${todo.length} to upload`);
  let n = 0;
  for (const rel of todo) {
    const file = path.join("public", rel.replace(/^\//, ""));
    if (!fs.existsSync(file)) {
      console.warn(`  missing on disk, skipped: ${rel}`);
      continue;
    }
    const asset = await client.assets.upload("image", fs.createReadStream(file), {
      filename: path.basename(file),
    });
    cache[rel] = asset._id;
    fs.writeFileSync(CACHE, JSON.stringify(cache, null, 2));
    n++;
    if (n % 10 === 0 || n === todo.length) console.log(`  uploaded ${n}/${todo.length}`);
  }
  console.log(`assets ready: ${Object.keys(cache).length} cached`);
}

/** Build a brandImage value. Alt text is required by the schema. */
function img(src: string | undefined, alt: string) {
  if (!src) return undefined;
  const ref = cache[src];
  if (!ref) return undefined;
  return {
    _type: "brandImage",
    asset: { _type: "reference", _ref: ref },
    alt: alt.length >= 8 ? alt : `${alt} at the Fikir plant in Adama`,
  };
}

/** Videos go in as Sanity *file* assets so the client can swap the film without
 *  a developer, and so a Plesk deploy no longer has to carry ~70 MB of media. */
const VIDEOS = ["/media/company-loop.mp4", "/media/company-film-muted.mp4"];

async function uploadVideos() {
  const todo = VIDEOS.filter((v) => !cache[v]);
  console.log(`videos: ${VIDEOS.length} referenced, ${todo.length} to upload`);
  for (const rel of todo) {
    const file = path.join("public", rel.replace(/^\//, ""));
    if (!fs.existsSync(file)) {
      console.warn(`  missing on disk, skipped: ${rel}`);
      continue;
    }
    const mb = (fs.statSync(file).size / 1048576).toFixed(1);
    console.log(`  uploading ${path.basename(file)} (${mb} MB)…`);
    const asset = await client.assets.upload("file", fs.createReadStream(file), {
      filename: path.basename(file),
    });
    cache[rel] = asset.url;
    fs.writeFileSync(CACHE, JSON.stringify(cache, null, 2));
    console.log(`    -> ${asset.url}`);
  }
}

/* -------------------------------- documents ------------------------------ */

/**
 * Document ids use a hyphen, never a dot.
 *
 * Sanity treats a "." in an _id as a private namespace, so `product.special`
 * is invisible to unauthenticated readers — which is exactly how the public
 * website reads content. Dotted ids silently returned zero products to anyone
 * without a token.
 */
const id = (type: string, key: string | number) => `${type}-${key}`;


const docs: Record<string, unknown>[] = [];
const clean = <T extends Record<string, unknown>>(o: T) =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as T;

function buildCollections() {
  S.CATEGORIES.forEach((c, i) =>
    docs.push(
      clean({
        _id: id("category", c.id),
        _type: "category",
        key: c.id,
        label: loc(`cat.${c.id}.label`, c.label),
        note: loc(`cat.${c.id}.note`, c.note),
        status: c.paused ? "paused" : "active",
        order: i,
      })
    )
  );

  S.PRODUCTS.forEach((p, i) =>
    docs.push(
      clean({
        _id: id("product", p.slug),
        _type: "product",
        name: loc(`prod.${p.slug}.name`, p.name),
        slug: { _type: "slug", current: p.slug },
        category: { _type: "reference", _ref: id("category", p.category) },
        brand: p.brand,
        image: img(p.image, `${p.name} pack shot`),
        gallery: keyed(
          (p.gallery ?? []).map((g) => img(g, `${p.name} product photo`)),
          "g"
        ),
        blurb: locText(`prod.${p.slug}.blurb`, p.blurb),
        meta: p.meta ? loc(`prod.${p.slug}.meta`, p.meta) : undefined,
        badge: p.badge ? loc(`badge.${p.badge}`, p.badge) : undefined,
        order: i,
      })
    )
  );

  S.GALLERY.forEach((g, i) =>
    docs.push(
      clean({
        _id: id("galleryItem", i),
        _type: "galleryItem",
        image: img(g.src, g.caption),
        caption: loc(`gal.cap.${i}`, g.caption),
        group: g.group,
        span: g.span ?? "normal",
        featured: !!g.featured,
        order: i,
      })
    )
  );

  S.VALUES.forEach((v, i) =>
    docs.push(
      clean({
        _id: id("companyValue", i),
        _type: "companyValue",
        icon: v.icon,
        title: loc(`value.${i}.title`, v.title),
        text: locText(`value.${i}.text`, v.text),
        order: i,
      })
    )
  );

  S.TESTIMONIALS.forEach((t, i) =>
    docs.push(
      clean({
        _id: id("testimonial", i),
        _type: "testimonial",
        quote: locText(`tst.${i}.quote`, t.quote),
        name: loc(`tst.${i}.name`, t.name),
        role: loc(`tst.${i}.role`, t.role),
        order: i,
      })
    )
  );

  S.OPENINGS.forEach((o, i) =>
    docs.push(
      clean({
        _id: id("jobOpening", i),
        _type: "jobOpening",
        title: loc(`open.${i}.title`, o.title),
        employmentType: loc(`open.${i}.type`, o.type),
        location: loc(`open.${i}.location`, o.location),
        note: locText(`open.${i}.note`, o.note),
        open: true,
        order: i,
      })
    )
  );

  S.AWARDS.forEach((a, i) =>
    docs.push(
      clean({
        _id: id("award", i),
        _type: "award",
        group: a.group,
        year: loc(`award.${i}.year`, a.year),
        issuer: loc(`award.${i}.issuer`, a.issuer),
        text: locText(`award.${i}.text`, a.text),
        order: i,
      })
    )
  );

  S.CERT_SHOTS.forEach((c, i) =>
    docs.push(
      clean({
        _id: id("credentialScan", i),
        _type: "credentialScan",
        image: img(c.src, c.caption),
        caption: loc(`cert.shot.${i}`, c.caption),
        order: i,
      })
    )
  );
}

function buildSingletons() {
  docs.push(
    clean({
      _id: "siteSettings",
      _type: "siteSettings",
      companyName: S.COMPANY.name,
      tagline: en(S.COMPANY.tagline),
      taglineAlt: en(S.COMPANY.taglineAlt),
      city: en(S.COMPANY.city),
      established: S.COMPANY.established,
      ceo: S.COMPANY.ceo,
      ceoRole: loc("about.ceoRole", "Chief Executive Officer"),
      phones: S.CONTACT.phones,
      email: S.CONTACT.email,
      addressLines: keyed(S.CONTACT.addressLines.map((l) => en(l)), "addr"),
      hours: S.CONTACT.hours.map((h, i) => ({
        _key: `h${i}`,
        days: loc(`con.hours.${i}.days`, h.days),
        time: h.time,
      })),
      website: S.COMPANY.website,
      stats: S.STATS.map((s, i) => ({
        _key: `s${i}`,
        value: s.value,
        suffix: s.suffix,
        label: loc(`stats.${i}`, s.label),
      })),
      certificates: [S.CERTIFICATE, S.CERTIFICATE_2].map((c, i) => ({
        _key: `c${i}`,
        authority: i === 0 ? loc("cert.authority", c.authority) : en(c.authority),
        title: i === 0 ? loc("cert.title", c.title) : en(c.title),
        product: i === 0 ? loc("cert.product", c.product) : en(c.product),
        standard: c.standard,
        license: c.license,
        validUntil: c.validUntil,
        note: i === 0 ? locText("cert.note", c.note) : { _type: "localeText", en: c.note },
      })),
      registration: S.COMPANY.registration,
      tin: S.COMPANY.tin,
    })
  );

  docs.push(
    clean({
      _id: "homePage",
      _type: "homePage",
      heroImage: img(S.IMAGES.hero, "The Fikir plant, fleet and products at sunset"),
      heroEyebrow: loc("home.hero.eyebrow", `Adama, Ethiopia · ${S.COMPANY.name}`),
      heroHeading: heading("home.hero.title"),
      heroSub: locText("home.hero.sub"),
      // English for these lives in a MARQUEE array in Home.tsx, not inline in
      // a t() call, so the extractor cannot see it.
      marquee: keyed([
        "Since 2004 E.C.",
        "Adama, Ethiopia",
        "Fortified up to Vitamin B12",
        "1,026 team members",
        "Delivered nationwide",
        "We produce quality, we deliver trust",
      ].map((fallback, i) => loc(`home.mq.${i + 1}`, fallback)), "mq"),
      whoWeAreEyebrow: loc("home.who.eyebrow"),
      whoWeAreBody: locText(
        "home.who.body",
        "A legally registered Ethiopian food manufacturer in Adama, making the highest-quality wheat flour, more than twelve kinds of biscuits, cream wafers, and potato chips, for *families across the country.*"
      ),
      process: S.PROCESS.map((p, i) => ({
        _key: `p${i}`,
        step: p.n,
        title: loc(`proc.${i}.title`, p.title),
        text: locText(`proc.${i}.text`, p.text),
        image: img(p.img, p.title),
      })),
      film: {
        eyebrow: loc("film.eyebrow"),
        heading: heading("film.title"),
        body: locText("film.body"),
        loopUrl: cache[S.FILM_LOOP.src] ?? S.FILM_LOOP.src,
        fullUrl:
          S.FEATURE_VIDEO?.type === "file"
            ? (cache[S.FEATURE_VIDEO.src] ?? S.FEATURE_VIDEO.src)
            : undefined,
        duration: S.FILM_LOOP.fullDuration,
      },
      cta: {
        image: img(S.IMAGES.distribution1, "The Fikir delivery fleet on the road"),
        heading: heading2("home.cta.titleLead", "home.cta.titleAccent"),
        text: locText("home.cta.text"),
      },
      seo: {
        title: en("FIKIR FOOD PROCESSING | Flour, Biscuits, Wafers & Chips, Ethiopia"),
        description: {
          _type: "localeText",
          en: "Fikir Food Processing makes fortified flour, Unic biscuits, wafers, and chips in Adama, Ethiopia. Over 15 years, 1,026 employees, delivered nationwide.",
        },
      },
    })
  );

  docs.push(
    clean({
      _id: "aboutPage",
      _type: "aboutPage",
      hero: {
        image: img(S.IMAGES.wheatFarming, "Combine harvesters bringing in the wheat harvest"),
        heading: heading2("about.hero.title", "about.hero.accent"),
      },
      whoWeAreHeading: heading("about.who.title"),
      whoWeAreBody: keyed([locText("about.who.p1"), locText("about.who.p2")], "p"),
      plantImage: img(S.IMAGES.factoryAerial, "The Fikir plant and silos seen from the air"),
      plantCaption: loc("about.plantCaption", "The plant in Adama, from above"),
      employedCount: "1,026",
      employedLabel: loc("about.statEmployed", "Ethiopians employed"),
      vision: locText("about.vision.text"),
      mission: locText("about.mission.text"),
      founder: {
        portrait: img(S.IMAGES.ceo, `${S.COMPANY.ceo}, founder and Chief Executive Officer`),
        heading: heading("about.founder.title"),
        body: keyed([locText("about.founder.p1"), locText("about.founder.p2")], "p"),
      },
      milestones: S.MILESTONES.map((m, i) => ({
        _key: `m${i}`,
        year: loc(`ms.${i}.year`, m.year),
        title: loc(`ms.${i}.title`, m.title),
        text: { _type: "localeText", en: m.text },
      })),
      valuesHeading: loc("about.values.title", "The values behind every batch"),
      people: {
        heading: heading("about.people.title"),
        body: locText("about.people.body"),
        teamImage: img(S.IMAGES.teamGroup, "The Fikir workforce outside the Adama plant"),
        teamCaption: loc("about.people.capTeam"),
        meetingImage: img(S.IMAGES.ceoMeeting, "The management committee meeting with the CEO"),
        meetingCaption: loc("about.people.capMeeting"),
        quote: locText("about.people.quote"),
      },
      awards: {
        heading: heading("about.awards.title"),
        body: locText("about.awards.body"),
        groupTax: loc("about.awards.g1", "Public recognition"),
        groupPartners: loc("about.awards.g2", "Partners & community"),
        groupPress: loc("about.awards.g3", "In the press"),
        trainingNote: locText("about.awards.training", S.STAFF_TRAINING),
      },
      whyUs: S.WHY_US.map((w, i) => ({
        _key: `w${i}`,
        title: loc(`why.${i}.title`, w.title),
        text: locText(`why.${i}.text`, w.text),
      })),
      cta: {
        image: img(S.IMAGES.proRange, "The full range of Unic biscuits and wafers"),
        heading: heading2("about.cta.title", "about.cta.accent"),
        text: locText("about.cta.text"),
      },
      seo: {
        title: en("About Us | FIKIR FOOD PROCESSING"),
        description: {
          _type: "localeText",
          en: "Fikir Food Processing: a trusted Ethiopian food manufacturer in Adama for over 15 years, built on quality, honesty, and trust.",
        },
      },
    })
  );

  docs.push(
    clean({
      _id: "productsPage",
      _type: "productsPage",
      hero: {
        image: img(S.IMAGES.proRange, "The Unic range held in both hands"),
        heading: heading2("prod.hero.title", "prod.hero.accent"),
      },
      faqs: S.FAQS.map((f, i) => ({
        _key: `f${i}`,
        q: loc(`faq.${i}.q`, f.q),
        a: locText(`faq.${i}.a`, f.a),
      })),
      cta: {
        image: img(S.IMAGES.facBiscuitWarehouse, "Pallets of finished Unic biscuits ready to ship"),
        heading: heading2("prod.cta.title", "prod.cta.accent"),
        text: locText("prod.cta.text"),
      },
      seo: {
        title: en("Products | FIKIR FOOD PROCESSING"),
        description: {
          _type: "localeText",
          en: "Fortified flour, Unic biscuits, wafers, and chips, made in Adama, Ethiopia and distributed nationwide.",
        },
      },
    })
  );

  docs.push(
    clean({
      _id: "facilityPage",
      _type: "facilityPage",
      hero: {
        image: img(S.IMAGES.silos, "Grain storage silos at the Adama plant"),
        heading: heading2("fac.hero.title", "fac.hero.accent"),
      },
      overviewHeading: heading("fac.overview.title"),
      overviewBody: keyed([locText("fac.overview.p1"), locText("fac.overview.p2")], "p"),
      qualitySteps: S.QUALITY_STEPS.map((q, i) => ({
        _key: `q${i}`,
        step: q.step,
        title: loc(`qc.${i}.title`, q.title),
        text: locText(`qc.${i}.text`, q.text),
      })),
      cta: {
        image: img(S.IMAGES.factoryAerial, "The Fikir plant seen from the air"),
        heading: heading2("fac.cta.title", "fac.cta.accent"),
        text: locText("fac.cta.text"),
      },
      seo: {
        title: en("Our Facility | FIKIR FOOD PROCESSING"),
        description: {
          _type: "localeText",
          en: "Inside the Fikir plant in Adama: modern milling, baking and packing lines, with every batch laboratory tested.",
        },
      },
    })
  );

  docs.push(
    clean({
      _id: "galleryPage",
      _type: "galleryPage",
      hero: {
        image: img(S.IMAGES.facProductionHall, "The production hall at the Adama plant"),
        heading: heading2("gal.hero.title", "gal.hero.accent"),
      },
      cta: {
        image: img(S.IMAGES.facTrucks, "The Fikir delivery fleet at the plant"),
        heading: heading2("gal.cta.title", "gal.cta.accent"),
        text: locText("gal.cta.text"),
      },
      seo: {
        title: en("Gallery | FIKIR FOOD PROCESSING"),
        description: {
          _type: "localeText",
          en: "Photographs from around the Fikir plant in Adama: production, facility, people and the product range.",
        },
      },
    })
  );

  docs.push(
    clean({
      _id: "careersPage",
      _type: "careersPage",
      hero: {
        image: img(S.IMAGES.facPacking1, "Fikir staff packing Unic biscuits on the line"),
        heading: heading2("car.hero.title", "car.hero.accent"),
      },
      introHeading: heading("car.intro.title"),
      introBody: locText("car.intro.body"),
      introImage: img(S.IMAGES.facOffice1, "Fikir staff at work in the administration office"),
      valuesHeading: loc("car.values.title", "What we value in our team"),
      cta: {
        image: img(S.IMAGES.teamGroup, "The Fikir workforce outside the Adama plant"),
        heading: heading2("car.cta.title", "car.cta.accent"),
        text: locText("car.cta.text"),
      },
      seo: {
        title: en("Careers | FIKIR FOOD PROCESSING"),
        description: {
          _type: "localeText",
          en: "Join Fikir Food Processing in Adama. Explore open positions and grow with a trusted Ethiopian manufacturer.",
        },
      },
    })
  );

  docs.push(
    clean({
      _id: "contactPage",
      _type: "contactPage",
      hero: {
        image: img(S.IMAGES.facReception, "The reception area at the Fikir head office"),
        heading: heading2("con.hero.title", "con.hero.accent"),
      },
      formHeading: loc("con.form.title"),
      formIntro: locText("con.form.sub"),
      mapEmbedUrl:
        "https://www.openstreetmap.org/export/embed.html?bbox=39.2189%2C8.4914%2C39.3189%2C8.5914&layer=mapnik&marker=8.5414%2C39.2689",
      seo: {
        title: en("Contact | FIKIR FOOD PROCESSING"),
        description: {
          _type: "localeText",
          en: "Reach Fikir Food Processing in Adama, Ethiopia. Become a distributor, place an order, or ask us a question.",
        },
      },
    })
  );
}

/* --------------------------------- report -------------------------------- */

function reportGaps() {
  const missing = { am: [] as string[], om: [] as string[] };
  // `key in dict` rather than truthiness: some keys are deliberately empty
  // (an Amharic phrasing may need no separate accent word), and that is a
  // translation decision, not a gap.
  for (const key of Object.keys(EN)) {
    if (!(key in AM)) missing.am.push(key);
    if (!(key in OM)) missing.om.push(key);
  }
  console.log(`\ntranslation gaps (English present, translation absent):`);
  console.log(`  Amharic:     ${missing.am.length}`);
  console.log(`  Afan Oromo:  ${missing.om.length}`);
  if (missing.om.length) {
    console.log(`  first few missing in Afan Oromo: ${missing.om.slice(0, 8).join(", ")}`);
  }
  fs.writeFileSync("scripts/.translation-gaps.json", JSON.stringify(missing, null, 2));
  console.log(`  full list written to scripts/.translation-gaps.json`);
}

/* ---------------------------------- run ---------------------------------- */

async function main() {
  const only = process.argv[2];

  if (only !== "--docs") {
    await uploadAssets();
    await uploadVideos();
  }
  if (only === "--assets") return;

  buildCollections();
  buildSingletons();

  console.log(`\ndocuments to write: ${docs.length}`);
  const byType = docs.reduce<Record<string, number>>((acc, d) => {
    const t = String(d._type);
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});
  Object.entries(byType)
    .sort()
    .forEach(([t, n]) => console.log(`  ${t.padEnd(18)} ${n}`));

  let tx = client.transaction();
  for (const d of docs) tx = tx.createOrReplace(d as never);
  await tx.commit();
  console.log("\ncommitted.");

  reportGaps();
}

main().catch((err) => {
  console.error("\nseed failed:", err?.message ?? err);
  process.exit(1);
});
