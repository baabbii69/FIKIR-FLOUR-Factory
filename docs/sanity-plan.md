# Sanity CMS migration plan

Goal: let non-technical staff at Fikir edit every piece of site content in
English, Amharic and Afan Oromo, without touching code or waiting on a
developer to redeploy.

## What we are actually migrating

Measured from the current codebase:

| Thing | Count |
|---|---|
| Products | 20 |
| Gallery items | 31 |
| Values / why-us / process / quality steps / milestones | 6 / 6 / 6 / 4 / 4 |
| FAQs / testimonials / job openings / categories / stats | 5 / 3 / 3 / 4 / 4 |
| Amharic translation keys | 444 |
| Afan Oromo translation keys | 380 (64 fewer than Amharic) |
| `t("key", "English")` call sites in components | 286 across 13 files |
| Source images | 98 (plus 98 generated `.webp`) |
| Video files | 2 (94 MB of the media folder) |

### The one non-obvious cost

**English text is not currently data.** It lives inline in JSX as the fallback
argument: `t("home.hero.title", "We produce quality, we deliver trust.")`.
Amharic and Afan Oromo are in dictionaries, but English is scattered across 286
call sites.

The good news: because each call site contains *both* the key and the English
string, a script can extract all 286 pairs automatically and join them to the
`am`/`om` dictionaries by key. This is a codemod, not retyping. Budget it as
real work, but not as manual labour.

---

## Decision 1 — What goes in the CMS, and what stays in code

Putting all 444 keys into Sanity would hand a non-technical editor a wall of
entries like `cta.view` and `crumb.home` and make the dashboard unusable.

Split into two tiers:

**Tier 1 — in Sanity (~343 keys, everything the client would want to change)**
products, gallery, values, why-us, FAQs, testimonials, milestones, process and
quality steps, certificate details, job openings, contact details, stats, the
per-page section copy (hero titles, body paragraphs, CTA text) and per-page SEO
title/description.

**Tier 2 — stays in code (~101 keys)**
Navigation labels, button text, breadcrumbs, form labels and validation
messages, badges. These change when the *design* changes, not when the business
changes. They stay in `am.ts` / `om.ts`.

If the client later asks to edit button labels, we add a single "Interface
labels" document. We should not start there.

## Decision 2 — How the three languages are modelled

**Recommendation: field-level localization.** One product = one document, and
each text field holds all three languages:

```ts
// A reusable object type used by every translatable field
{
  name: 'localeString',
  type: 'object',
  fields: [
    { name: 'en', title: 'English',      type: 'string', validation: R => R.required() },
    { name: 'am', title: 'አማርኛ',        type: 'string' },
    { name: 'om', title: 'Afaan Oromoo', type: 'string' },
  ],
}
```

Why this and not document-level (a separate document per language):

- 20 products would become 60 documents. Editors would have to find and keep
  three separate records in sync. That is exactly the failure mode we are
  trying to avoid for non-technical users.
- With field-level, the three languages sit **side by side in one screen**, so
  a missing translation is visually obvious rather than hidden in another
  document.
- English is `required`, am/om are optional — which mirrors how the site
  already behaves (missing translation falls back to English), so a
  half-translated product never breaks the page.

Alternative considered: `sanity-plugin-internationalized-array` gives a tabbed
UI instead of three stacked inputs. Worth a look at build time, but stacked
inputs are arguably *better* here — you see all three at once. Verify the
plugin's current API before adopting; a plain object type has no dependency to
maintain.

## Decision 3 — Kill the `*asterisk*` convention

Titles currently mark the gold italic segment with asterisks:
`"We produce quality, *we deliver trust.*"`. No non-technical editor will get
this right, and a stray asterisk silently breaks the styling.

Replace with two plain fields, which is what `PageHero` and `CTABanner` already
take as separate props anyway:

- `titleLead` — "We produce quality,"
- `titleAccent` — "we deliver trust." (rendered gold + italic)

Labelled in the Studio as "Heading" and "Highlighted ending".

## Decision 4 — How the live site reads content

This matters because of hosting. The site is a **static SPA**, and the final
home is Plesk, where there is no Node and no build step — deploys are a manual
upload of `dist/`.

If we only fetch content at build time, every content edit would need a
developer to rebuild and re-upload. That defeats the point of a CMS.

**Recommendation: baked snapshot + runtime refresh.**

1. At build time, fetch all content from Sanity into a bundled `content.json`.
   First paint is instant, and the site keeps working if Sanity is unreachable.
2. At runtime, fetch fresh content from Sanity's CDN once at boot and swap it
   in. Client edits go live within seconds, with no rebuild and no upload.

The whole site's text is small (order of 100–200 KB of JSON), so this is one
cached request. It also fits the existing boot `Loader`.

Crucially, `src/content.ts` already exists as the seam for exactly this:

> "Today these functions read the static arrays in `data/site.ts`. When we move
> to a CMS (Sanity), only the bodies here change"

So the UI components mostly do not change. That was designed in, and it holds.

## Decision 5 — Images move into Sanity

Upload all 98 source images as Sanity assets and render them through
`@sanity/image-url`.

Three wins beyond "editors can swap photos":

- **Hotspot / crop.** Editors set the focal point by dragging on the image.
  This is precisely the problem we hand-fixed on the CEO portrait with
  `objectPosition: "75% center"` — with hotspot, a non-technical editor fixes
  that themselves in seconds.
- **The `.webp` pipeline becomes unnecessary.** Sanity serves format and size
  on demand (`?w=1600&fm=webp&q=80`), so the 98 committed `.webp` siblings and
  the `Img` component's `<picture>` fallback can retire.
- **Responsive sizes for free**, which matters on Ethiopian mobile connections.

The 2 video files are a separate decision — video belongs on a video host
(YouTube/Vimeo/Cloudflare Stream), not in Sanity assets and not in git. The
`VideoBlock` component already accepts `youtube` and `vimeo` source types, so
that swap stays a one-line change.

---

## The seeding script

`scripts/seed-sanity.ts`, run once, idempotent (uses deterministic
`_id`s so re-running updates rather than duplicates).

1. **Upload assets.** Walk `public/media/*.jpg|png`, upload each, build a
   `filename -> assetId` map, cache it to disk so re-runs skip uploads.
2. **Extract English.** Codemod pass over `src/**/*.tsx` collecting all 286
   `t("key", "English")` pairs.
3. **Join languages.** For each key, combine English (step 2) with `AM[key]`
   and `OM[key]` into `{ en, am, om }`.
4. **Emit documents.** Map `site.ts` arrays plus the joined strings into the
   document types, swapping image paths for asset references.
5. **Report gaps.** Print every key missing `am` or `om` — this immediately
   surfaces the 64-key Afan Oromo shortfall as a work list for the translator.

Everything is seeded automatically. Nothing gets retyped by hand.

## Studio setup for non-technical editors

This is where the project succeeds or fails. Specifics:

- **Custom desk structure**, not a flat list of schema types. Group as:
  Pages (Home, About, Products, Facility, Gallery, Careers, Contact) ·
  Products · Gallery · Company info · Jobs.
- **Singletons for pages** so there is exactly one "Home page" document and no
  button that lets someone create a second one.
- **Plain-language field descriptions.** "Shown under the big heading on the
  home page" beats "heroSubtitle".
- **Validation that matches the design**: required English, max lengths on
  headings so long text cannot break a layout, required alt text on images.
- **List previews with thumbnails** so products are recognisable at a glance.
- **A "Needs translation" view** filtering documents where `am` or `om` is
  empty. This is how the native-speaker proofing pass gets driven.
- **Roles**: client staff as Editor, not Administrator.
- **Draft/publish**: editors can save drafts safely; only publish goes live.
- A one-page written guide plus a short screen recording, in Amharic.

## Phasing

| Phase | Work | Rough effort |
|---|---|---|
| 1 | Schema types, `localeString`, desk structure, singletons | 2–3 days |
| 2 | Seed script: asset upload, English codemod, document emit | 2–3 days |
| 3 | Wire the site: `content.ts` seam, content context, image URLs, baked snapshot + runtime refresh | 3–4 days |
| 4 | Studio polish, validation, roles, client guide | 1–2 days |
| 5 | Native-speaker translation pass (client-side, in the Studio) | ongoing |

Estimates are rough and assume the content model does not change mid-flight.

Phases 1 and 2 can be done without touching the live site at all, so the
current Vercel review link keeps working while the CMS is built.

## Phase 3 architecture: keeping the site fast

Seeding is done, so these are now measured numbers rather than estimates.

**The entire site's content is 15 KB gzipped** (46.8 KB raw) — every page, every
product, all three languages. That is smaller than one product photo. Text
content is effectively free, and no amount of CMS wiring will make the site feel
slow because of it.

The rules that keep it that way:

1. **Bundle a build-time snapshot.** `npm run build` writes the full content
   query to a JSON file that ships in the bundle. First paint renders from it
   with zero network dependency, so the site is never blank waiting on Sanity,
   and it keeps working if Sanity is unreachable.
2. **Refresh at runtime, never block on it.** One request to
   `apicdn.sanity.io` (`useCdn: true`, edge-cached) fetches the same 15 KB after
   paint and swaps it in. Client edits go live in seconds with no rebuild. The
   fetch must never gate rendering, and the swap must be a plain state update —
   no loading spinner, no layout shift.
3. **Cache in `localStorage` as a third tier**, so a repeat visitor paints from
   the last known content even before the bundle parses.

### Images: the one real decision

Text is free; images are 95% of the bytes. Two options:

- **Sanity CDN** (`?w=800&auto=format`) — the editor can swap photos, and Sanity
  serves correctly sized WebP/AVIF per breakpoint. Today the site ships a
  1600px file into a 400px slot in several places, so *right-sizing alone is
  likely a net win* even after paying one extra DNS + TLS handshake.
- **Local files** — same origin, no extra handshake, but the client cannot
  change a photo without a developer, which defeats the CMS.

Recommendation: **Sanity CDN, with `<link rel="preconnect" href="https://cdn.sanity.io" crossorigin>`**
in `index.html` so the connection is warm before the first image is requested,
plus explicit `w`/`q` and `srcSet`.

Caveat worth measuring rather than assuming: the production host is Plesk inside
Ethiopia, which is physically close to the audience. If Sanity's nearest edge
turns out to be far, local files could win on latency. The escape hatch is a
**build-time image bake** — pull the assets from Sanity during `npm run build`
and write them into `dist/media`, so editors still manage images in the CMS but
visitors are served them locally. Decide this with a real measurement from
Adama, not from here.

### What must not regress

- `LOW_POWER` detection and the `prefers-reduced-motion` paths stay exactly as
  they are; the CMS work must not touch them.
- Route-level code splitting stays.
- The video is now served from Sanity's file CDN, so a Plesk deploy no longer
  has to carry ~70 MB of media.

## Open decisions and risks

1. **Who owns the Sanity project and billing?** It should end up on the
   client's account, not ours. Easier to set up that way from day one than to
   transfer later.
2. **Free-tier quotas.** Sanity's free plan has limits on users, documents, API
   requests and bandwidth. Check current numbers against expected usage before
   committing — in particular how many staff need Studio logins.
3. **The Afan Oromo gap.** 64 keys exist in Amharic but not Afan Oromo. They
   fall back to English today, which is invisible in review but obvious to an
   Oromo speaker.
4. **All translations are machine-assisted** and flagged as such in the file
   headers. The Studio is the right place to fix them, but it needs a real
   speaker. The founder's story especially.
5. **Where the Studio is hosted.** Sanity-hosted (`*.sanity.studio`) is free
   and simplest; the client just gets a URL. Self-hosting under
   `fikirfoods.et/studio` needs the Plesk setup to serve it.
6. **Unresolved content questions** carried over from the company profile:
   the contact email conflict (`contact@` vs `Info@fikirfoods.et`), the
   2011 vs 2012 E.C. founding date, the Sodere Road vs Gara Lugo address, and
   the next-expansion product line. These should be settled *before* seeding so
   we do not seed known-wrong data into the CMS.
