import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";
import { structure, isSingleton } from "./structure";

export default defineConfig({
  name: "fikir",
  title: "Fikir Food Processing",

  projectId: "ntiaycof",
  dataset: "production",

  plugins: [
    structureTool({ structure }),
    // Vision is the GROQ query playground. Useful while building; consider
    // hiding it from non-developer roles before handover.
    visionTool({ defaultApiVersion: "2024-10-01" }),
  ],

  schema: {
    types: schemaTypes,
    // Page singletons should never appear in the global "create new" menu —
    // there is only ever one Home page.
    templates: (prev) => prev.filter((t) => !isSingleton(t.schemaType)),
  },

  document: {
    // Remove delete/duplicate from singletons so an editor cannot destroy the
    // Home page document and leave the site with nothing to render.
    actions: (prev, { schemaType }) =>
      isSingleton(schemaType)
        ? prev.filter(({ action }) => action !== "delete" && action !== "duplicate")
        : prev,
  },
});
