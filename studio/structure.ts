import type { StructureResolver } from "sanity/structure";
import { SINGLETONS } from "./schemaTypes";

const SINGLETON_IDS = SINGLETONS.map((s) => s.id) as readonly string[];

/**
 * Desk layout.
 *
 * Deliberately not the default flat list of schema types. Editors think in
 * terms of "the About page" and "our products", not document types, so the
 * sidebar is grouped that way and each page singleton opens straight into its
 * one document with no "create new" button.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Fikir website")
    .items([
      S.listItem()
        .title("Pages")
        .child(
          S.list()
            .title("Pages")
            .items(
              SINGLETONS.filter((s) => s.id !== "siteSettings").map((s) =>
                S.listItem()
                  .title(s.title)
                  .id(s.id)
                  .child(S.document().schemaType(s.id).documentId(s.id).title(s.title))
              )
            )
        ),

      S.divider(),

      S.listItem()
        .title("Products")
        .schemaType("product")
        .child(S.documentTypeList("product").title("Products").defaultOrdering([{ field: "order", direction: "asc" }])),

      S.listItem()
        .title("Product categories")
        .schemaType("category")
        .child(S.documentTypeList("category").title("Categories").defaultOrdering([{ field: "order", direction: "asc" }])),

      S.listItem()
        .title("Gallery photos")
        .schemaType("galleryItem")
        .child(
          S.list()
            .title("Gallery photos")
            .items([
              S.listItem()
                .title("All photos")
                .child(S.documentTypeList("galleryItem").title("All photos")),
              S.divider(),
              ...["facility", "production", "products", "people"].map((g) =>
                S.listItem()
                  .title(g.charAt(0).toUpperCase() + g.slice(1))
                  .id(g)
                  .child(
                    S.documentList()
                      .title(g)
                      .filter('_type == "galleryItem" && group == $g')
                      .params({ g })
                  )
              ),
            ])
        ),

      S.divider(),

      S.listItem()
        .title("Company information")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings").title("Company information")),

      S.listItem()
        .title("Company values")
        .schemaType("companyValue")
        .child(
          S.documentTypeList("companyValue")
            .title("Company values")
            .defaultOrdering([{ field: "order", direction: "asc" }])
        ),

      S.listItem()
        .title("Awards & recognition")
        .child(
          S.list()
            .title("Awards & recognition")
            .items([
              S.listItem()
                .title("Awards list")
                .id("awardList")
                .child(
                  S.documentTypeList("award")
                    .title("Awards list")
                    .defaultOrdering([{ field: "order", direction: "asc" }])
                ),
              S.listItem()
                .title("Certificate images")
                .id("credentialScans")
                .child(
                  S.documentTypeList("credentialScan")
                    .title("Certificate images")
                    .defaultOrdering([{ field: "order", direction: "asc" }])
                ),
            ])
        ),

      S.listItem()
        .title("Testimonials")
        .schemaType("testimonial")
        .child(S.documentTypeList("testimonial").title("Testimonials")),

      S.listItem()
        .title("Job openings")
        .schemaType("jobOpening")
        .child(S.documentTypeList("jobOpening").title("Job openings")),

      S.divider(),

      // Drives the translation pass: everything still missing Amharic or Afan
      // Oromo, in one place, so a translator has a work list rather than
      // clicking through every document hunting for blanks.
      S.listItem()
        .title("⚠️ Needs translation")
        .id("needsTranslation")
        .child(
          S.list()
            .title("Needs translation")
            .items([
              S.listItem()
                .title("Products missing Amharic")
                .id("prodAm")
                .child(
                  S.documentList()
                    .title("Products missing Amharic")
                    .filter('_type == "product" && (!defined(name.am) || !defined(blurb.am))')
                ),
              S.listItem()
                .title("Products missing Afan Oromo")
                .id("prodOm")
                .child(
                  S.documentList()
                    .title("Products missing Afan Oromo")
                    .filter('_type == "product" && (!defined(name.om) || !defined(blurb.om))')
                ),
              S.listItem()
                .title("Gallery captions missing Amharic")
                .id("galAm")
                .child(
                  S.documentList()
                    .title("Gallery captions missing Amharic")
                    .filter('_type == "galleryItem" && !defined(caption.am)')
                ),
              S.listItem()
                .title("Gallery captions missing Afan Oromo")
                .id("galOm")
                .child(
                  S.documentList()
                    .title("Gallery captions missing Afan Oromo")
                    .filter('_type == "galleryItem" && !defined(caption.om)')
                ),
            ])
        ),
    ]);

/** Singletons must not be creatable or deletable from the UI. */
export function isSingleton(typeName?: string) {
  return !!typeName && SINGLETON_IDS.includes(typeName);
}
