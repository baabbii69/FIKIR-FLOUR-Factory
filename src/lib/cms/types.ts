import type { SanityImage } from "./client";

/** A field carrying all three languages. English is always present. */
export type Loc = { en: string; am?: string; om?: string };
export type Heading = { lead: Loc; accent?: Loc };

export type CmsCta = { image?: SanityImage; heading?: Heading; text?: Loc };
export type CmsSeo = { title?: Loc; description?: Loc };
export type CmsHero = { image?: SanityImage; heading?: Heading };

export type CmsSettings = {
  companyName?: string;
  established?: string;
  ceo?: string;
  registration?: string;
  tin?: string;
  website?: string;
  email?: string;
  phones?: string[];
  tagline?: Loc;
  taglineAlt?: Loc;
  city?: Loc;
  ceoRole?: Loc;
  addressLines?: Loc[];
  hours?: { _key: string; days?: Loc; time?: string }[];
  stats?: { _key: string; value?: number; suffix?: string; label?: Loc }[];
  certificates?: {
    _key: string;
    standard?: string;
    license?: string;
    validUntil?: string;
    authority?: Loc;
    title?: Loc;
    product?: Loc;
    note?: Loc;
  }[];
};

export type CmsProduct = {
  _id: string;
  slug: string;
  brand: "Fikir" | "Unic";
  category: string;
  name?: Loc;
  blurb?: Loc;
  meta?: Loc;
  badge?: Loc;
  image?: SanityImage;
  gallery?: SanityImage[];
  ingredients?: Loc;
  nutrition?: { _key: string; label?: Loc; value?: string }[];
};

export type CmsGalleryItem = {
  _id: string;
  group: "facility" | "production" | "products" | "people";
  span?: "normal" | "wide" | "tall";
  featured?: boolean;
  caption?: Loc;
  image?: SanityImage;
};

/** "paused" still renders, with a note that the line is temporarily stopped. */
export type CategoryStatus = "active" | "paused" | "hidden";

export type SiteContent = {
  settings?: CmsSettings;
  home?: Record<string, unknown> & {
    heroImage?: SanityImage;
    heroEyebrow?: Loc;
    heroHeading?: Heading;
    heroSub?: Loc;
    marquee?: Loc[];
    whoWeAreEyebrow?: Loc;
    whoWeAreBody?: Loc;
    process?: { _key: string; step?: string; title?: Loc; text?: Loc; image?: SanityImage }[];
    film?: {
      eyebrow?: Loc;
      heading?: Heading;
      body?: Loc;
      loopUrl?: string;
      fullUrl?: string;
      duration?: string;
    };
    unic?: {
      eyebrow?: Loc;
      heading?: Heading;
      body?: Loc;
      stats?: { _key: string; value?: string; label?: Loc }[];
    };
    cta?: CmsCta;
    seo?: CmsSeo;
  };
  about?: Record<string, unknown> & {
    hero?: CmsHero;
    whoWeAreHeading?: Heading;
    whoWeAreBody?: Loc[];
    plantImage?: SanityImage;
    plantCaption?: Loc;
    employedCount?: string;
    employedLabel?: Loc;
    vision?: Loc;
    mission?: Loc;
    founder?: { portrait?: SanityImage; heading?: Heading; body?: Loc[] };
    milestones?: { _key: string; year?: Loc; title?: Loc; text?: Loc }[];
    valuesHeading?: Loc;
    people?: {
      heading?: Heading;
      body?: Loc;
      quote?: Loc;
      teamImage?: SanityImage;
      teamCaption?: Loc;
      meetingImage?: SanityImage;
      meetingCaption?: Loc;
    };
    awards?: {
      heading?: Heading;
      body?: Loc;
      trainingNote?: Loc;
      groupTax?: Loc;
      groupPartners?: Loc;
      groupPress?: Loc;
    };
    whyUs?: { _key: string; title?: Loc; text?: Loc }[];
    cta?: CmsCta;
    seo?: CmsSeo;
  };
  products?: { hero?: CmsHero; faqs?: { _key: string; q?: Loc; a?: Loc }[]; cta?: CmsCta; seo?: CmsSeo };
  facility?: {
    hero?: CmsHero;
    overviewHeading?: Heading;
    overviewBody?: Loc[];
    qualitySteps?: { _key: string; step?: string; title?: Loc; text?: Loc }[];
    cta?: CmsCta;
    seo?: CmsSeo;
  };
  gallery?: { hero?: CmsHero; cta?: CmsCta; seo?: CmsSeo };
  careers?: {
    hero?: CmsHero;
    introHeading?: Heading;
    introBody?: Loc;
    introImage?: SanityImage;
    valuesHeading?: Loc;
    cta?: CmsCta;
    seo?: CmsSeo;
  };
  contact?: { hero?: CmsHero; formHeading?: Loc; formIntro?: Loc; mapEmbedUrl?: string; seo?: CmsSeo };
  categories?: { _id: string; key: string; status?: CategoryStatus; label?: Loc; note?: Loc }[];
  productList?: CmsProduct[];
  galleryItems?: CmsGalleryItem[];
  values?: { _id: string; icon: string; title?: Loc; text?: Loc }[];
  testimonials?: { _id: string; quote?: Loc; name?: Loc; role?: Loc }[];
  openings?: { _id: string; title?: Loc; employmentType?: Loc; location?: Loc; note?: Loc }[];
  awards?: { _id: string; group: "tax" | "partners" | "press"; year?: Loc; issuer?: Loc; text?: Loc }[];
  certShots?: { _id: string; caption?: Loc; image?: SanityImage }[];
};
