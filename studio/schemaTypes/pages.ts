import { defineType, defineField } from "sanity";

/**
 * Page singletons — exactly one document each, so an editor who wants to change
 * the About page opens "About page" and finds everything for it in one screen.
 * The desk structure (see structure.ts) hides the "create new" button for these.
 */

/* ------------------------------ shared blocks ----------------------------- */

export const seo = defineType({
  name: "seo",
  title: "Search engine listing",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "title",
      title: "Browser tab title",
      type: "localeString",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "description",
      title: "Description in Google results",
      description: "Aim for 140–160 characters.",
      type: "localeText",
      validation: (R) => R.required(),
    }),
  ],
});

export const pageHero = defineType({
  name: "pageHero",
  title: "Top of the page",
  type: "object",
  options: { collapsible: true },
  fields: [
    defineField({
      name: "image",
      title: "Background photo",
      description:
        "Use a wide, landscape photo at least 1600px across. Portrait photos get badly cropped here.",
      type: "brandImage",
      validation: (R) => R.required(),
    }),
    defineField({ name: "heading", title: "Heading", type: "localeHeading", validation: (R) => R.required() }),
  ],
});

export const ctaBlock = defineType({
  name: "ctaBlock",
  title: "Closing call to action",
  type: "object",
  options: { collapsible: true },
  fields: [
    defineField({
      name: "image",
      title: "Background photo",
      description: "Wide landscape photo, at least 1600px across.",
      type: "brandImage",
      validation: (R) => R.required(),
    }),
    defineField({ name: "heading", title: "Heading", type: "localeHeading", validation: (R) => R.required() }),
    defineField({ name: "text", title: "Supporting text", type: "localeText" }),
  ],
});

/* ------------------------------ site settings ----------------------------- */

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Company information",
  type: "document",
  groups: [
    { name: "identity", title: "Identity", default: true },
    { name: "contact", title: "Contact" },
    { name: "numbers", title: "Key numbers" },
    { name: "legal", title: "Certificate & registration" },
  ],
  fields: [
    defineField({ name: "companyName", title: "Company name", type: "string", group: "identity" }),
    defineField({ name: "tagline", title: "Tagline", type: "localeString", group: "identity" }),
    defineField({ name: "taglineAlt", title: "Second tagline", description: "Used where a variation reads better.", type: "localeString", group: "identity" }),
    defineField({ name: "city", title: "City", type: "localeString", group: "identity" }),
    defineField({ name: "established", title: "Year established", type: "string", group: "identity" }),
    defineField({ name: "ceo", title: "Chief executive", type: "string", group: "identity" }),
    defineField({ name: "ceoRole", title: "Their job title", type: "localeString", group: "identity" }),

    defineField({
      name: "phones",
      title: "Phone numbers",
      type: "array",
      of: [{ type: "string" }],
      group: "contact",
    }),
    defineField({ name: "email", title: "Email address", type: "string", group: "contact" }),
    defineField({
      name: "addressLines",
      title: "Address",
      description: "One line per row.",
      type: "array",
      of: [{ type: "localeString" }],
      group: "contact",
    }),
    defineField({
      name: "hours",
      title: "Opening hours",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "days", title: "Days", type: "localeString" },
            { name: "time", title: "Hours", type: "string" },
          ],
          preview: { select: { title: "days.en", subtitle: "time" } },
        },
      ],
      group: "contact",
    }),
    defineField({ name: "website", title: "Website", type: "string", group: "contact" }),

    defineField({
      name: "stats",
      title: "Headline numbers",
      description: "The counting figures shown on the home page.",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "value", title: "Number", type: "number" },
            { name: "suffix", title: "Suffix", description: "For example + or MT.", type: "string" },
            { name: "label", title: "Label", type: "localeString" },
          ],
          preview: { select: { title: "label.en", subtitle: "value" } },
        },
      ],
      group: "numbers",
    }),

    defineField({
      name: "certificates",
      title: "Quality certificates",
      description:
        "The company holds more than one. Each renews on its own schedule, so keep 'Valid until' current — an expired certificate must not be advertised.",
      type: "array",
      group: "legal",
      of: [
        {
          type: "object",
          fields: [
            { name: "authority", title: "Issued by", type: "localeString" },
            { name: "title", title: "Certificate name", type: "localeString" },
            { name: "product", title: "Covers which product", type: "localeString" },
            { name: "standard", title: "Standard number", type: "string" },
            { name: "license", title: "Licence number", type: "string" },
            { name: "validUntil", title: "Valid until", type: "string" },
            { name: "note", title: "Explanation", type: "localeText" },
          ],
          preview: { select: { title: "title.en", subtitle: "license" } },
        },
      ],
    }),
    defineField({ name: "registration", title: "Registration number", type: "string", group: "legal" }),
    defineField({ name: "tin", title: "TIN", type: "string", group: "legal" }),
  ],
  preview: { prepare: () => ({ title: "Company information" }) },
});

/* --------------------------------- pages ---------------------------------- */

const page = (name: string, title: string, extra: any[] = [], withCta = true) =>
  defineType({
    name,
    title,
    type: "document",
    groups: [
      { name: "content", title: "Content", default: true },
      { name: "seo", title: "Search listing" },
    ],
    fields: [
      defineField({ name: "hero", title: "Top of the page", type: "pageHero", group: "content" }),
      ...extra.map((f) => ({ ...f, group: f.group ?? "content" })),
      ...(withCta
        ? [defineField({ name: "cta", title: "Closing call to action", type: "ctaBlock", group: "content" })]
        : []),
      defineField({ name: "seo", title: "Search listing", type: "seo", group: "seo" }),
    ],
    preview: { prepare: () => ({ title }) },
  });

export const homePage = defineType({
  name: "homePage",
  title: "Home page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "sections", title: "Sections" },
    { name: "seo", title: "Search listing" },
  ],
  fields: [
    defineField({ name: "heroImage", title: "Hero photo", type: "brandImage", group: "hero" }),
    defineField({ name: "heroEyebrow", title: "Small label above the heading", type: "localeString", group: "hero" }),
    defineField({ name: "heroHeading", title: "Main heading", type: "localeHeading", group: "hero" }),
    defineField({ name: "heroSub", title: "Intro paragraph", type: "localeText", group: "hero" }),

    defineField({
      name: "marquee",
      title: "Scrolling ribbon",
      description: "Short facts that scroll across the band under the hero.",
      type: "array",
      of: [{ type: "localeString" }],
      group: "sections",
    }),
    defineField({ name: "whoWeAreEyebrow", title: "'Who we are' label", type: "localeString", group: "sections" }),
    defineField({
      name: "whoWeAreBody",
      title: "'Who we are' paragraph",
      description: "The large statement that lights up as visitors scroll.",
      type: "localeText",
      group: "sections",
    }),
    defineField({
      name: "process",
      title: "How Fikir is made",
      description: "The steps in the side-scrolling journey.",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "step", title: "Step number", type: "string" },
            { name: "title", title: "Title", type: "localeString" },
            { name: "text", title: "Description", type: "localeText" },
            { name: "image", title: "Photo", type: "brandImage" },
          ],
          preview: { select: { title: "title.en", subtitle: "step", media: "image" } },
        },
      ],
      group: "sections",
    }),
    defineField({
      name: "film",
      title: "Company film section",
      type: "object",
      group: "sections",
      fields: [
        { name: "eyebrow", title: "Small label", type: "localeString" },
        { name: "heading", title: "Heading", type: "localeHeading" },
        { name: "body", title: "Paragraph", type: "localeText" },
        {
          name: "loopUrl",
          title: "Background clip URL",
          description: "Short silent clip that plays behind the text. Keep it under about 3 MB.",
          type: "string",
        },
        {
          name: "fullUrl",
          title: "Full film URL",
          description: "Opens when someone clicks play. A YouTube or Vimeo link is best.",
          type: "string",
        },
        { name: "duration", title: "Length", description: "For example 7:56.", type: "string" },
      ],
    }),
    defineField({ name: "cta", title: "Closing call to action", type: "ctaBlock", group: "sections" }),
    defineField({ name: "seo", title: "Search listing", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Home page" }) },
});

export const aboutPage = page("aboutPage", "About page", [
  defineField({ name: "whoWeAreHeading", title: "'Who we are' heading", type: "localeHeading" }),
  defineField({ name: "whoWeAreBody", title: "'Who we are' paragraphs", type: "array", of: [{ type: "localeText" }] }),
  defineField({ name: "plantImage", title: "Photo beside 'Who we are'", type: "brandImage" }),
  defineField({ name: "plantCaption", title: "Caption for that photo", type: "localeString" }),
  defineField({ name: "employedCount", title: "Employee figure", description: "For example 1,026.", type: "string" }),
  defineField({ name: "employedLabel", title: "Label under that figure", type: "localeString" }),
  defineField({ name: "vision", title: "Vision statement", type: "localeText" }),
  defineField({ name: "mission", title: "Mission statement", type: "localeText" }),
  defineField({
    name: "founder",
    title: "Founder story",
    type: "object",
    fields: [
      { name: "portrait", title: "Portrait", type: "brandImage" },
      { name: "heading", title: "Heading", type: "localeHeading" },
      { name: "body", title: "Paragraphs", type: "array", of: [{ type: "localeText" }] },
    ],
  }),
  defineField({
    name: "milestones",
    title: "Growth milestones",
    type: "array",
    of: [
      {
        type: "object",
        fields: [
          { name: "year", title: "Year", type: "localeString" },
          { name: "title", title: "What happened", type: "localeString" },
          { name: "text", title: "Detail", type: "localeText" },
        ],
        preview: { select: { title: "year.en", subtitle: "title.en" } },
      },
    ],
  }),
  defineField({ name: "valuesHeading", title: "Values section heading", type: "localeString" }),
  defineField({
    name: "people",
    title: "Our people section",
    type: "object",
    fields: [
      { name: "heading", title: "Heading", type: "localeHeading" },
      { name: "body", title: "Paragraph", type: "localeText" },
      { name: "teamImage", title: "Workforce photo", type: "brandImage" },
      { name: "teamCaption", title: "Caption", type: "localeString" },
      { name: "meetingImage", title: "Leadership photo", type: "brandImage" },
      { name: "meetingCaption", title: "Caption", type: "localeString" },
      { name: "quote", title: "Pull quote", type: "localeText" },
    ],
  }),
  defineField({
    name: "awards",
    title: "Recognition section",
    type: "object",
    fields: [
      { name: "heading", title: "Heading", type: "localeHeading" },
      { name: "body", title: "Intro paragraph", type: "localeText" },
      { name: "groupTax", title: "Label: public recognition", type: "localeString" },
      { name: "groupPartners", title: "Label: partners & community", type: "localeString" },
      { name: "groupPress", title: "Label: in the press", type: "localeString" },
      {
        name: "trainingNote",
        title: "Staff training note",
        description:
          "Small line under the list. Describes staff training as a capability — do not name individual employees or publish their personal certificates.",
        type: "localeText",
      },
    ],
  }),
  defineField({
    name: "whyUs",
    title: "Why customers stay with us",
    type: "array",
    of: [
      {
        type: "object",
        fields: [
          { name: "title", title: "Title", type: "localeString" },
          { name: "text", title: "Description", type: "localeText" },
        ],
        preview: { select: { title: "title.en" } },
      },
    ],
  }),
]);

export const productsPage = page("productsPage", "Products page", [
  defineField({
    name: "faqs",
    title: "Frequently asked questions",
    type: "array",
    of: [
      {
        type: "object",
        fields: [
          { name: "q", title: "Question", type: "localeString" },
          { name: "a", title: "Answer", type: "localeText" },
        ],
        preview: { select: { title: "q.en" } },
      },
    ],
  }),
]);

export const facilityPage = page("facilityPage", "Facility page", [
  defineField({ name: "overviewHeading", title: "Overview heading", type: "localeHeading" }),
  defineField({ name: "overviewBody", title: "Overview paragraphs", type: "array", of: [{ type: "localeText" }] }),
  defineField({
    name: "qualitySteps",
    title: "Quality process steps",
    type: "array",
    of: [
      {
        type: "object",
        fields: [
          { name: "step", title: "Number", type: "string" },
          { name: "title", title: "Title", type: "localeString" },
          { name: "text", title: "Description", type: "localeText" },
        ],
        preview: { select: { title: "title.en", subtitle: "step" } },
      },
    ],
  }),
]);

export const galleryPage = page("galleryPage", "Gallery page");

export const careersPage = page("careersPage", "Careers page", [
  defineField({ name: "introHeading", title: "Intro heading", type: "localeHeading" }),
  defineField({ name: "introBody", title: "Intro paragraph", type: "localeText" }),
  defineField({
    name: "introImage",
    title: "Photo beside the intro",
    description: "Use a landscape photo of real staff at work. Portrait photos leave a large gap here.",
    type: "brandImage",
  }),
  defineField({ name: "valuesHeading", title: "Values section heading", type: "localeString" }),
]);

export const contactPage = page("contactPage", "Contact page", [
  defineField({ name: "formHeading", title: "Form heading", type: "localeString" }),
  defineField({ name: "formIntro", title: "Text above the form", type: "localeText" }),
  defineField({
    name: "mapEmbedUrl",
    title: "Map embed URL",
    description: "The OpenStreetMap or Google Maps embed link for the factory.",
    type: "string",
  }),
// The contact page ends with the map and the form, not a call-to-action band,
// so no cta field — an empty box wired to nothing is worse than no box.
], false);
