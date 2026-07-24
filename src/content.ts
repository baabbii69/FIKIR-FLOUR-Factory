/**
 * Content access layer — the single seam between the UI and the content source.
 *
 * Today these functions read the static arrays in `data/site.ts`. When we move
 * to a CMS (Sanity), only the bodies here change to fetch/map CMS documents;
 * every component keeps importing from this module, so the swap stays contained.
 *
 * Keep the return *shapes* here identical to what a CMS query would yield.
 */
import { PRODUCTS, GALLERY, CATEGORIES } from "./data/site";
import type { Product, Category, GalleryItem, GalleryGroup } from "./data/site";

/* ----------------------------- Categories --------------------------- */

const HIDDEN_CATEGORIES = new Set(CATEGORIES.filter((c) => c.hidden).map((c) => c.id));

/** Categories shown in the UI (hidden ones — e.g. chips — are filtered out). */
export function getCategories() {
  return CATEGORIES.filter((c) => !c.hidden);
}

const isVisible = (p: Product) => !HIDDEN_CATEGORIES.has(p.category);

/* ----------------------------- Products ----------------------------- */

export function getProducts(): Product[] {
  return PRODUCTS.filter(isVisible);
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(cat: Category): Product[] {
  return PRODUCTS.filter((p) => p.category === cat && isVisible(p));
}

/** Products in the same category, excluding the given one (for "related"). */
export function getRelatedProducts(p: Product, limit = 4): Product[] {
  return PRODUCTS.filter((x) => x.category === p.category && x.slug !== p.slug && isVisible(x)).slice(0, limit);
}

/** Full image set for a product's detail gallery: primary first, then extras. */
export function getProductImages(p: Product): string[] {
  return [p.image, ...(p.gallery ?? [])].filter(Boolean);
}

/* ------------------------------ Gallery ----------------------------- */

export function getGalleryItems(): GalleryItem[] {
  return GALLERY;
}

/** Gallery grouped by section, in a stable display order. */
const GALLERY_ORDER: GalleryGroup[] = ["facility", "production", "products", "people"];

export function getGalleryGroups(): { group: GalleryGroup; items: GalleryItem[] }[] {
  return GALLERY_ORDER.map((group) => ({
    group,
    items: GALLERY.filter((g) => g.group === group),
  })).filter((g) => g.items.length > 0);
}

/** A curated subset for the homepage/facility teaser strip. */
export function getGalleryTeaser(limit = 7): GalleryItem[] {
  const featured = GALLERY.filter((g) => g.featured);
  return (featured.length ? featured : GALLERY).slice(0, limit);
}
