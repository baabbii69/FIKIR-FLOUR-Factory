import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";

/**
 * Read-only Sanity client for the public website.
 *
 * No token, ever. The dataset is public-read, so the browser needs no
 * credential — and a write token must never reach client-side code.
 *
 * `useCdn: true` points at apicdn.sanity.io, which is edge-cached. The whole
 * site's content is ~28 KB gzipped, so this is one small cached request.
 */
/**
 * Read config from Vite in the browser and from process.env in Node, since the
 * same client is used by the build-time snapshot script. `import.meta.env` does
 * not exist under plain Node, so it has to be probed rather than assumed.
 */
function env(name: string, fallback: string) {
  const viteEnv = (import.meta as { env?: Record<string, string | undefined> }).env;
  if (viteEnv?.[name]) return viteEnv[name] as string;
  const nodeEnv = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;
  if (nodeEnv?.[name]) return nodeEnv[name] as string;
  return fallback;
}

export const PROJECT_ID = env("VITE_SANITY_PROJECT_ID", "ntiaycof");
export const DATASET = env("VITE_SANITY_DATASET", "production");
const API_VERSION = env("VITE_SANITY_API_VERSION", "2024-10-01");

export const sanity = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  useCdn: true,
  perspective: "published",
});

const builder = createImageUrlBuilder({ projectId: PROJECT_ID, dataset: DATASET });

export type SanityImage = {
  alt?: string;
  hotspot?: { x: number; y: number };
  crop?: unknown;
  asset?: { _ref?: string; _id?: string };
};

/**
 * Build a CDN URL for a Sanity image at an explicit width.
 *
 * Always pass a width. The source files are up to 1600px and several slots on
 * the site render at 400px or less; serving the original there is the single
 * biggest avoidable cost on a slow connection. `auto('format')` hands back
 * WebP/AVIF where the browser supports it, which replaces the hand-generated
 * .webp siblings the old pipeline needed.
 */
export function imageUrl(src: SanityImage | undefined, width: number, quality = 75) {
  const ref = src?.asset?._ref ?? src?.asset?._id;
  if (!ref) return undefined;
  return builder.image(ref).width(width).quality(quality).auto("format").fit("max").url();
}

/** A `srcset` across sensible breakpoints for a full-width or column image. */
export function imageSrcSet(src: SanityImage | undefined, widths: number[], quality = 75) {
  const ref = src?.asset?._ref ?? src?.asset?._id;
  if (!ref) return undefined;
  return widths
    .map((w) => `${builder.image(ref).width(w).quality(quality).auto("format").fit("max").url()} ${w}w`)
    .join(", ");
}

/** Original pixel dimensions, parsed from the asset ref (…-1600x1067-jpg). */
export function imageDimensions(src: SanityImage | undefined) {
  const ref = src?.asset?._ref ?? src?.asset?._id;
  const m = ref?.match(/-(\d+)x(\d+)-/);
  return m ? { width: Number(m[1]), height: Number(m[2]) } : undefined;
}
