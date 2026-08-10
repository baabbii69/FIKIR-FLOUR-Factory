import { defineType, defineField } from "sanity";

/**
 * Collections — things the client adds to and removes from over time.
 *
 * Page-specific copy lives in the page singletons instead (see pages.ts), so an
 * editor who wants to change the About page finds everything in one place
 * rather than hunting across document types.
 */

const orderField = defineField({
  name: "order",
  title: "Sort order",
  description: "Lower numbers appear first.",
  type: "number",
  validation: (R) => R.required().min(0),
});

export const category = defineType({
  name: "category",
  title: "Product category",
  type: "document",
  fields: [
    defineField({
      name: "key",
      title: "Category ID",
      description:
        "Used by the website code. Do not change this after launch — it will break links and filters.",
      type: "string",
      options: {
        list: [
          { title: "Flour", value: "flour" },
          { title: "Biscuits", value: "biscuits" },
          { title: "Wafers", value: "wafers" },
          { title: "Chips", value: "chips" },
        ],
      },
      validation: (R) => R.required(),
    }),
    defineField({ name: "label", title: "Name", type: "localeString", validation: (R) => R.required() }),
    defineField({ name: "note", title: "Short description", type: "localeString" }),
    defineField({
      name: "status",
      title: "Availability",
      description:
        "Use 'Paused' when a product line stops for a while — it stays on the website with a note, " +
        "so customers know it exists and will return. 'Hidden' removes it from the site completely.",
      type: "string",
      options: {
        list: [
          { title: "On sale", value: "active" },
          { title: "Paused — temporarily unavailable", value: "paused" },
          { title: "Hidden from the website", value: "hidden" },
        ],
        layout: "radio",
      },
      initialValue: "active",
      validation: (R) => R.required(),
    }),
    orderField,
  ],
  preview: {
    select: { title: "label.en", subtitle: "key", status: "status" },
    prepare: ({ title, subtitle, status }) => ({
      title:
        status === "paused" ? `${title} (paused)` : status === "hidden" ? `${title} (hidden)` : title,
      subtitle,
    }),
  },
});

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Product name", type: "localeString", validation: (R) => R.required() }),
    defineField({
      name: "slug",
      title: "Web address",
      description: "The last part of the product's link. Click Generate to fill it from the English name.",
      type: "slug",
      options: { source: "name.en", maxLength: 64 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (R) => R.required(),
    }),
    defineField({
      name: "brand",
      title: "Brand",
      type: "string",
      options: { list: ["Fikir", "Unic"], layout: "radio" },
      validation: (R) => R.required(),
    }),
    defineField({ name: "image", title: "Main photo", type: "brandImage", validation: (R) => R.required() }),
    defineField({
      name: "gallery",
      title: "More photos",
      description: "Extra shots shown on the product's own page.",
      type: "array",
      of: [{ type: "brandImage" }],
    }),
    defineField({ name: "blurb", title: "Description", type: "localeText", validation: (R) => R.required() }),
    defineField({
      name: "meta",
      title: "Pack sizes or descriptor",
      description: "For example: 5 · 10 · 25 · 50 kg, or Cream biscuit.",
      type: "localeString",
    }),
    defineField({
      name: "badge",
      title: "Badge",
      description: "Small label on the product card, e.g. Best seller. Leave empty for none.",
      type: "localeString",
    }),
    defineField({
      name: "nutrition",
      title: "Nutrition table",
      description: "Optional. Only fill this in with real figures from the lab.",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", title: "Label", type: "localeString" },
            { name: "value", title: "Value", type: "string" },
          ],
          preview: { select: { title: "label.en", subtitle: "value" } },
        },
      ],
    }),
    defineField({ name: "ingredients", title: "Ingredients", type: "localeText" }),
    orderField,
  ],
  preview: {
    select: { title: "name.en", subtitle: "category.label.en", media: "image" },
  },
});

export const galleryItem = defineType({
  name: "galleryItem",
  title: "Gallery photo",
  type: "document",
  fields: [
    defineField({ name: "image", title: "Photo", type: "brandImage", validation: (R) => R.required() }),
    defineField({ name: "caption", title: "Caption", type: "localeString", validation: (R) => R.required() }),
    defineField({
      name: "group",
      title: "Album",
      type: "string",
      options: {
        list: [
          { title: "Facility", value: "facility" },
          { title: "Production", value: "production" },
          { title: "Products", value: "products" },
          { title: "People", value: "people" },
        ],
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "span",
      title: "Size in the grid",
      type: "string",
      options: {
        list: [
          { title: "Normal", value: "normal" },
          { title: "Wide (2 columns)", value: "wide" },
          { title: "Tall (2 rows)", value: "tall" },
        ],
        layout: "radio",
      },
      initialValue: "normal",
    }),
    defineField({
      name: "featured",
      title: "Feature this photo",
      description: "Featured photos also appear in the gallery preview on other pages.",
      type: "boolean",
      initialValue: false,
    }),
    orderField,
  ],
  preview: { select: { title: "caption.en", subtitle: "group", media: "image" } },
});

export const companyValue = defineType({
  name: "companyValue",
  title: "Company value",
  type: "document",
  fields: [
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      options: {
        list: [
          { title: "Seal / quality", value: "seal" },
          { title: "Handshake / integrity", value: "handshake" },
          { title: "Upward trend / improvement", value: "trend" },
          { title: "Smile / customer", value: "smiley" },
          { title: "People / shared prosperity", value: "users" },
          { title: "Flask / innovation", value: "flask" },
          { title: "Leaf / environment", value: "leaf" },
        ],
      },
      validation: (R) => R.required(),
    }),
    defineField({ name: "title", title: "Title", type: "localeString", validation: (R) => R.required() }),
    defineField({ name: "text", title: "Description", type: "localeText", validation: (R) => R.required() }),
    orderField,
  ],
  preview: { select: { title: "title.en", subtitle: "icon" } },
});

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({ name: "quote", title: "Quote", type: "localeText", validation: (R) => R.required() }),
    defineField({ name: "name", title: "Who said it", type: "localeString", validation: (R) => R.required() }),
    defineField({ name: "role", title: "Their role or town", type: "localeString" }),
    orderField,
  ],
  preview: { select: { title: "name.en", subtitle: "quote.en" } },
});

export const jobOpening = defineType({
  name: "jobOpening",
  title: "Job opening",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Job title", type: "localeString", validation: (R) => R.required() }),
    defineField({
      name: "employmentType",
      title: "Type",
      description: "For example: Full-time.",
      type: "localeString",
    }),
    defineField({ name: "location", title: "Location", type: "localeString" }),
    defineField({ name: "note", title: "What the job involves", type: "localeText" }),
    defineField({
      name: "open",
      title: "Currently open",
      description: "Turn off to remove the listing without deleting it.",
      type: "boolean",
      initialValue: true,
    }),
    orderField,
  ],
  preview: {
    select: { title: "title.en", subtitle: "location.en", open: "open" },
    prepare: ({ title, subtitle, open }) => ({
      title: open ? title : `${title} (closed)`,
      subtitle,
    }),
  },
});

export const award = defineType({
  name: "award",
  title: "Award or recognition",
  type: "document",
  fields: [
    defineField({
      name: "group",
      title: "Where it belongs on the page",
      type: "string",
      options: {
        list: [
          { title: "Public recognition", value: "tax" },
          { title: "Partners & community", value: "partners" },
          { title: "In the press", value: "press" },
        ],
        layout: "radio",
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "year",
      title: "Year",
      description: "As written on the certificate, e.g. 2017 E.C. Use Ongoing if it has no single year.",
      type: "localeString",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "issuer",
      title: "Who gave it",
      type: "localeString",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "text",
      title: "What it was for",
      description: "One or two plain sentences. Keep it modest — the fact speaks for itself.",
      type: "localeText",
      validation: (R) => R.required(),
    }),
    orderField,
  ],
  preview: {
    select: { title: "issuer.en", subtitle: "year.en", group: "group" },
    prepare: ({ title, subtitle, group }) => ({ title, subtitle: `${subtitle} · ${group}` }),
  },
});

export const credentialScan = defineType({
  name: "credentialScan",
  title: "Certificate image",
  type: "document",
  description: "Scans and photos shown in the rotating frame on the About page.",
  fields: [
    defineField({
      name: "image",
      title: "Scan or photo",
      description:
        "Shown whole, never cropped, so seals and signatures stay readable. Portrait scans are fine.",
      type: "brandImage",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "localeString",
      validation: (R) => R.required(),
    }),
    orderField,
  ],
  preview: { select: { title: "caption.en", media: "image" } },
});
