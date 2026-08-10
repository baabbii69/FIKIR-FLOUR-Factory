/**
 * One query for the entire site.
 *
 * Deliberately a single request rather than per-page fetches: the whole payload
 * is ~28 KB gzipped, so one edge-cached round trip beats eight, and every page
 * then renders from memory with no further network work during navigation.
 *
 * Images are returned raw (keeping `asset._ref`) rather than resolved to a URL,
 * because the ref carries the dimensions and lets the client build a correctly
 * sized CDN URL per breakpoint. Resolving here would force one fixed size.
 */
const LOCALE = `{en, am, om}`;
const HEADING = `{lead${LOCALE}, accent${LOCALE}}`;
const IMAGE = `{alt, hotspot, crop, asset}`;
const CTA = `{image${IMAGE}, heading${HEADING}, text${LOCALE}}`;
const SEO = `{title${LOCALE}, description${LOCALE}}`;
const HERO = `{image${IMAGE}, heading${HEADING}}`;

export const SITE_QUERY = /* groq */ `{
  "settings": *[_id == "siteSettings"][0]{
    companyName, established, ceo, registration, tin, website, email, phones,
    tagline${LOCALE}, taglineAlt${LOCALE}, city${LOCALE}, ceoRole${LOCALE},
    addressLines[]${LOCALE},
    hours[]{_key, days${LOCALE}, time},
    stats[]{_key, value, suffix, label${LOCALE}},
    certificates[]{
      _key, standard, license, validUntil,
      authority${LOCALE}, title${LOCALE}, product${LOCALE}, note${LOCALE}
    }
  },

  "home": *[_id == "homePage"][0]{
    heroImage${IMAGE}, heroEyebrow${LOCALE}, heroHeading${HEADING}, heroSub${LOCALE},
    marquee[]${LOCALE},
    whoWeAreEyebrow${LOCALE}, whoWeAreBody${LOCALE},
    process[]{_key, step, title${LOCALE}, text${LOCALE}, image${IMAGE}},
    film{eyebrow${LOCALE}, heading${HEADING}, body${LOCALE}, loopUrl, fullUrl, duration},
    cta${CTA}, seo${SEO}
  },

  "about": *[_id == "aboutPage"][0]{
    hero${HERO},
    whoWeAreHeading${HEADING}, whoWeAreBody[]${LOCALE},
    plantImage${IMAGE}, plantCaption${LOCALE},
    employedCount, employedLabel${LOCALE},
    vision${LOCALE}, mission${LOCALE},
    founder{portrait${IMAGE}, heading${HEADING}, body[]${LOCALE}},
    milestones[]{_key, year${LOCALE}, title${LOCALE}, text${LOCALE}},
    valuesHeading${LOCALE},
    people{
      heading${HEADING}, body${LOCALE}, quote${LOCALE},
      teamImage${IMAGE}, teamCaption${LOCALE},
      meetingImage${IMAGE}, meetingCaption${LOCALE}
    },
    awards{
      heading${HEADING}, body${LOCALE}, trainingNote${LOCALE},
      groupTax${LOCALE}, groupPartners${LOCALE}, groupPress${LOCALE}
    },
    whyUs[]{_key, title${LOCALE}, text${LOCALE}},
    cta${CTA}, seo${SEO}
  },

  "products": *[_id == "productsPage"][0]{
    hero${HERO},
    faqs[]{_key, q${LOCALE}, a${LOCALE}},
    cta${CTA}, seo${SEO}
  },

  "facility": *[_id == "facilityPage"][0]{
    hero${HERO},
    overviewHeading${HEADING}, overviewBody[]${LOCALE},
    qualitySteps[]{_key, step, title${LOCALE}, text${LOCALE}},
    cta${CTA}, seo${SEO}
  },

  "gallery": *[_id == "galleryPage"][0]{ hero${HERO}, cta${CTA}, seo${SEO} },

  "careers": *[_id == "careersPage"][0]{
    hero${HERO}, introHeading${HEADING}, introBody${LOCALE}, introImage${IMAGE},
    valuesHeading${LOCALE}, cta${CTA}, seo${SEO}
  },

  "contact": *[_id == "contactPage"][0]{
    hero${HERO}, formHeading${LOCALE}, formIntro${LOCALE}, mapEmbedUrl, seo${SEO}
  },

  "categories": *[_type == "category"] | order(order asc){
    _id, key, status, label${LOCALE}, note${LOCALE}
  },

  "productList": *[_type == "product"] | order(order asc){
    _id, brand, "slug": slug.current, "category": category->key,
    name${LOCALE}, blurb${LOCALE}, meta${LOCALE}, badge${LOCALE},
    image${IMAGE}, gallery[]${IMAGE},
    ingredients${LOCALE},
    nutrition[]{_key, label${LOCALE}, value}
  },

  "galleryItems": *[_type == "galleryItem"] | order(order asc){
    _id, group, span, featured, caption${LOCALE}, image${IMAGE}
  },

  "values": *[_type == "companyValue"] | order(order asc){
    _id, icon, title${LOCALE}, text${LOCALE}
  },

  "testimonials": *[_type == "testimonial"] | order(order asc){
    _id, quote${LOCALE}, name${LOCALE}, role${LOCALE}
  },

  "openings": *[_type == "jobOpening" && open == true] | order(order asc){
    _id, title${LOCALE}, employmentType${LOCALE}, location${LOCALE}, note${LOCALE}
  },

  "awards": *[_type == "award"] | order(order asc){
    _id, group, year${LOCALE}, issuer${LOCALE}, text${LOCALE}
  },

  "certShots": *[_type == "credentialScan"] | order(order asc){
    _id, caption${LOCALE}, image${IMAGE}
  }
}`;
