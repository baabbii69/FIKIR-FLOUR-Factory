import { defineType, defineField } from "sanity";

/**
 * Field-level localization.
 *
 * One document holds all three languages side by side, rather than three
 * separate documents per item. With a fixed set of three languages and
 * non-technical editors this is the right trade-off: a missing translation is
 * visible on screen instead of hidden in another document, and nobody has to
 * keep three records in sync.
 *
 * English is required; Amharic and Afan Oromo are optional because the site
 * already falls back to English for any missing string. A half-translated
 * document can never break a page.
 */

export const LANGUAGES = [
  { id: "en", title: "English" },
  { id: "am", title: "አማርኛ (Amharic)" },
  { id: "om", title: "Afaan Oromoo" },
] as const;

export const localeString = defineType({
  name: "localeString",
  title: "Text (3 languages)",
  type: "object",
  options: { collapsible: false },
  fields: LANGUAGES.map((lang) =>
    defineField({
      name: lang.id,
      title: lang.title,
      type: "string",
      validation: lang.id === "en" ? (R) => R.required() : undefined,
    })
  ),
});

export const localeText = defineType({
  name: "localeText",
  title: "Paragraph (3 languages)",
  type: "object",
  options: { collapsible: false },
  fields: LANGUAGES.map((lang) =>
    defineField({
      name: lang.id,
      title: lang.title,
      type: "text",
      rows: 4,
      validation: lang.id === "en" ? (R) => R.required() : undefined,
    })
  ),
});

/**
 * A heading split into a normal part and a highlighted ending, which the site
 * renders in gold italic.
 *
 * This replaces the old `*asterisk*` convention in the codebase. Editors could
 * not be expected to place asterisks correctly, and a stray one silently broke
 * the styling. Two labelled fields make the intent obvious and unbreakable.
 */
export const localeHeading = defineType({
  name: "localeHeading",
  title: "Heading",
  type: "object",
  options: { collapsible: false },
  fields: [
    defineField({
      name: "lead",
      title: "Heading",
      description: "The plain first part, for example: We produce quality,",
      type: "localeString",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "accent",
      title: "Highlighted ending",
      description:
        "Shown in gold italic at the end of the heading, for example: we deliver trust. Leave empty for no highlight.",
      type: "localeString",
    }),
  ],
});

/** Image with required alt text and hotspot cropping enabled. */
export const brandImage = defineType({
  name: "brandImage",
  title: "Image",
  type: "image",
  // Hotspot lets an editor drag the focal point so the subject stays centred
  // at every crop — the thing that had to be hand-fixed in CSS before.
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Describe this image",
      description:
        "Read aloud by screen readers and shown if the image fails to load. Describe what is happening, e.g. 'Staff packing Unic biscuits on the line'.",
      type: "string",
      validation: (R) => R.required().min(8),
    }),
  ],
});
