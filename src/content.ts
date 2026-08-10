/**
 * Content access layer — the single seam between the UI and the content source.
 *
 * These now read from Sanity (via CmsProvider) and map the documents back into
 * the same shapes the components already used when the content lived in
 * `data/site.ts`. Keeping the shapes identical is what kept the swap contained:
 * components did not have to learn the CMS document model.
 *
 * Localised text is returned as its **English** value, because components
 * already pass that value as the fallback to `t("key", value)` and the CMS
 * translations reach `t()` through flattenToKeys. Display language therefore
 * stays correct without every call site changing.
 *
 * These are hooks rather than plain functions because content refreshes after
 * first paint; a plain function could not trigger the re-render.
 */
import { useMemo } from "react";
import { useCms } from "./lib/cms/CmsProvider";
import { imageUrl } from "./lib/cms/client";
import type { SanityImage } from "./lib/cms/client";
import type { Loc, CmsProduct, CmsGalleryItem } from "./lib/cms/types";
import type { Product, Category, GalleryItem, GalleryGroup } from "./data/site";

/** English value of a localised field; components hand this to t() as fallback. */
const en = (l: Loc | undefined, fallback = "") => l?.en ?? fallback;

/** Default render width for card-sized imagery. */
const CARD_W = 1200;

const toProduct = (p: CmsProduct): Product => ({
  slug: p.slug,
  name: en(p.name),
  category: p.category as Category,
  brand: p.brand,
  image: imageUrl(p.image, CARD_W) ?? "",
  gallery: (p.gallery ?? []).map((g) => imageUrl(g, CARD_W) ?? "").filter(Boolean),
  blurb: en(p.blurb),
  meta: en(p.meta) || undefined,
  badge: en(p.badge) || undefined,
  ingredients: en(p.ingredients) || undefined,
  nutrition: p.nutrition?.map((n) => ({ label: en(n.label), value: n.value ?? "" })),
});

const toGalleryItem = (g: CmsGalleryItem): GalleryItem => ({
  src: imageUrl(g.image, CARD_W) ?? "",
  group: g.group,
  caption: en(g.caption),
  span: g.span === "normal" ? undefined : g.span,
  featured: !!g.featured,
});

/* ----------------------------- Categories --------------------------- */

/**
 * Categories shown in the UI.
 *
 * Only "hidden" is filtered out. "paused" deliberately stays — a line that has
 * stopped for a season is still worth showing, so customers learn it exists and
 * that it is coming back. Deleting it instead throws away the page, its photos
 * and whatever search ranking it has earned, all of which have to be rebuilt
 * from nothing when production restarts.
 */
export function useCategories() {
  const cms = useCms();
  return useMemo(
    () =>
      (cms.categories ?? [])
        .filter((c) => c.status !== "hidden")
        .map((c) => ({
          id: c.key as Category,
          label: en(c.label),
          note: en(c.note),
          paused: c.status === "paused",
        })),
    [cms.categories]
  );
}

/** Category keys whose line is paused, for badging products. */
export function usePausedCategories(): Set<string> {
  const cms = useCms();
  return useMemo(
    () => new Set((cms.categories ?? []).filter((c) => c.status === "paused").map((c) => c.key)),
    [cms.categories]
  );
}

/* ----------------------------- Products ----------------------------- */

function useVisibleProducts() {
  const cms = useCms();
  return useMemo(() => {
    const hidden = new Set(
      (cms.categories ?? []).filter((c) => c.status === "hidden").map((c) => c.key)
    );
    const paused = new Set(
      (cms.categories ?? []).filter((c) => c.status === "paused").map((c) => c.key)
    );
    return (cms.productList ?? [])
      .filter((p) => !hidden.has(p.category))
      .map((p) => ({ ...toProduct(p), paused: paused.has(p.category) }));
  }, [cms.productList, cms.categories]);
}

export function useProducts(): Product[] {
  return useVisibleProducts();
}

export function useProductsByCategory(cat: Category): Product[] {
  const all = useVisibleProducts();
  return useMemo(() => all.filter((p) => p.category === cat), [all, cat]);
}

export function useProductBySlug(slug: string | undefined): Product | undefined {
  const all = useVisibleProducts();
  return useMemo(() => all.find((p) => p.slug === slug), [all, slug]);
}

export function useRelatedProducts(p: Product | undefined, limit = 4): Product[] {
  const all = useVisibleProducts();
  return useMemo(
    () => (p ? all.filter((x) => x.category === p.category && x.slug !== p.slug).slice(0, limit) : []),
    [all, p, limit]
  );
}

/** Main photo first, then any extra shots. */
export function getProductImages(p: Product | undefined): string[] {
  if (!p) return [];
  return [p.image, ...(p.gallery ?? [])].filter(Boolean);
}

/* ------------------------------ Gallery ----------------------------- */

export function useGalleryItems(): GalleryItem[] {
  const cms = useCms();
  return useMemo(() => (cms.galleryItems ?? []).map(toGalleryItem), [cms.galleryItems]);
}

export function useGalleryGroups(): { group: GalleryGroup; items: GalleryItem[] }[] {
  const items = useGalleryItems();
  return useMemo(() => {
    const order: GalleryGroup[] = ["facility", "production", "products", "people"];
    return order
      .map((group) => ({ group, items: items.filter((i) => i.group === group) }))
      .filter((g) => g.items.length > 0);
  }, [items]);
}

export function useGalleryTeaser(limit = 7): GalleryItem[] {
  const items = useGalleryItems();
  return useMemo(() => {
    const featured = items.filter((i) => i.featured);
    return (featured.length ? featured : items).slice(0, limit);
  }, [items, limit]);
}

/* --------------------------- Other collections ---------------------- */

export function useCompanyValues() {
  const cms = useCms();
  return useMemo(
    () => (cms.values ?? []).map((v) => ({ icon: v.icon, title: en(v.title), text: en(v.text) })),
    [cms.values]
  );
}

export function useTestimonials() {
  const cms = useCms();
  return useMemo(
    () => (cms.testimonials ?? []).map((t) => ({ quote: en(t.quote), name: en(t.name), role: en(t.role) })),
    [cms.testimonials]
  );
}

export function useOpenings() {
  const cms = useCms();
  return useMemo(
    () =>
      (cms.openings ?? []).map((o) => ({
        title: en(o.title),
        type: en(o.employmentType),
        location: en(o.location),
        note: en(o.note),
      })),
    [cms.openings]
  );
}

export function useAwards() {
  const cms = useCms();
  return useMemo(
    () =>
      (cms.awards ?? []).map((a) => ({
        group: a.group,
        year: en(a.year),
        issuer: en(a.issuer),
        text: en(a.text),
      })),
    [cms.awards]
  );
}

export function useCertShots() {
  const cms = useCms();
  return useMemo(
    () => (cms.certShots ?? []).map((c) => ({ src: imageUrl(c.image, CARD_W) ?? "", caption: en(c.caption) })),
    [cms.certShots]
  );
}

/* ------------------------- Settings & page media -------------------- */

/** Company details: phones, email, address, hours, stats, certificates. */
export function useSettings() {
  const cms = useCms();
  return useMemo(() => {
    const s = cms.settings ?? {};
    return {
      name: s.companyName ?? "Fikir Food Processing",
      tagline: en(s.tagline),
      taglineAlt: en(s.taglineAlt),
      city: en(s.city),
      established: s.established ?? "",
      ceo: s.ceo ?? "",
      ceoRole: en(s.ceoRole),
      registration: s.registration ?? "",
      tin: s.tin ?? "",
      website: s.website ?? "",
      email: s.email ?? "",
      phones: s.phones ?? [],
      addressLines: (s.addressLines ?? []).map((l) => en(l)),
      hours: (s.hours ?? []).map((h) => ({ days: en(h.days), time: h.time ?? "" })),
      stats: (s.stats ?? []).map((st) => ({
        value: st.value ?? 0,
        suffix: st.suffix ?? "",
        label: en(st.label),
      })),
      certificates: (s.certificates ?? []).map((c) => ({
        authority: en(c.authority),
        title: en(c.title),
        product: en(c.product),
        standard: c.standard ?? "",
        license: c.license ?? "",
        validUntil: c.validUntil ?? "",
        note: en(c.note),
      })),
    };
  }, [cms.settings]);
}

/** The primary quality certificate. */
export function useCertificate() {
  const { certificates } = useSettings();
  return certificates[0];
}

export function useMilestones() {
  const cms = useCms();
  return useMemo(
    () => (cms.about?.milestones ?? []).map((m) => ({ year: en(m.year), title: en(m.title), text: en(m.text) })),
    [cms.about]
  );
}

export function useWhyUs() {
  const cms = useCms();
  return useMemo(
    () => (cms.about?.whyUs ?? []).map((w) => ({ title: en(w.title), text: en(w.text) })),
    [cms.about]
  );
}

export function useProcess() {
  const cms = useCms();
  return useMemo(
    () =>
      (cms.home?.process ?? []).map((p) => ({
        n: p.step ?? "",
        title: en(p.title),
        text: en(p.text),
        img: imageUrl(p.image, CARD_W) ?? "",
      })),
    [cms.home]
  );
}

export function useQualitySteps() {
  const cms = useCms();
  return useMemo(
    () =>
      (cms.facility?.qualitySteps ?? []).map((q) => ({
        step: q.step ?? "",
        title: en(q.title),
        text: en(q.text),
      })),
    [cms.facility]
  );
}

export function useFaqs() {
  const cms = useCms();
  return useMemo(() => (cms.products?.faqs ?? []).map((f) => ({ q: en(f.q), a: en(f.a) })), [cms.products]);
}

/** The company film. Both URLs are editable in the Studio. */
export function useFilm() {
  const cms = useCms();
  const f = cms.home?.film;
  return {
    loopUrl: f?.loopUrl ?? "",
    fullUrl: f?.fullUrl ?? "",
    duration: f?.duration ?? "",
  };
}

/**
 * Resolve a CMS image to a CDN URL at the width it actually renders.
 *
 * Passing a sensible width matters: sources are up to 1600px and several slots
 * display at 400–800px, so this is the cheapest performance win available.
 */
export function usePageImage(image: SanityImage | undefined, width = 1600) {
  return useMemo(() => imageUrl(image, width), [image, width]);
}
