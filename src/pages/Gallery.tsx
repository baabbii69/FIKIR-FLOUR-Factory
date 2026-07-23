import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { MagnifyingGlassPlus } from "@phosphor-icons/react";
import PageHero from "../components/PageHero";
import CTABanner from "../components/CTABanner";
import Reveal from "../components/Reveal";
import Lightbox from "../components/Lightbox";
import { usePageMeta } from "../lib/usePageMeta";
import { IMAGES } from "../data/site";
import type { GalleryGroup } from "../data/site";
import { getGalleryItems } from "../content";
import { useI18n } from "../i18n/I18nProvider";

const EASE = [0.16, 1, 0.3, 1] as const;

const FILTERS: { id: GalleryGroup | "all"; label: string; tk: string }[] = [
  { id: "all", label: "All", tk: "common.all" },
  { id: "facility", label: "Facility", tk: "gal.filter.facility" },
  { id: "production", label: "Production", tk: "gal.filter.production" },
  { id: "products", label: "Products", tk: "gal.filter.products" },
  { id: "people", label: "People", tk: "gal.filter.people" },
];

export default function Gallery() {
  usePageMeta(
    "Gallery | FIKIR FOOD PROCESSING",
    "A look around Fikir Food Processing — our plant in Adama, the production lines, the range, and the people behind it."
  );
  const { t } = useI18n();
  const all = getGalleryItems();
  const [filter, setFilter] = useState<GalleryGroup | "all">("all");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const items = useMemo(() => (filter === "all" ? all : all.filter((g) => g.group === filter)), [all, filter]);
  const srcs = useMemo(() => items.map((g) => g.src), [items]);

  return (
    <>
      <PageHero
        image={IMAGES.facProductionHall}
        alt="Inside the Fikir production hall"
        crumb={t("nav.gallery", "Gallery")}
        title={t("gal.hero.title", "A look")}
        titleAccent={t("gal.hero.accent", "around.")}
      />

      <section className="bg-cream">
        <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
          <Reveal>
            <div role="tablist" aria-label="Filter gallery" className="flex flex-wrap gap-2 border-b border-linen pb-6">
              {FILTERS.map((f) => {
                const on = filter === f.id;
                return (
                  <button
                    key={f.id}
                    role="tab"
                    aria-selected={on}
                    onClick={() => setFilter(f.id)}
                    className={`px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] transition-all duration-300 active:scale-[0.98] ${
                      on ? "bg-ink text-cream" : "border border-linen text-clay hover:border-ink/40 hover:text-ink"
                    }`}
                  >
                    {t(f.tk, f.label)}
                  </button>
                );
              })}
            </div>
          </Reveal>

          <div className="mt-8 grid auto-rows-[160px] grid-cols-2 gap-3 [grid-auto-flow:dense] sm:auto-rows-[200px] sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {items.map((g, i) => (
              <motion.button
                key={g.src + i}
                type="button"
                layout
                onClick={() => setLightbox(i)}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, delay: 0.03 * Math.min(i, 10), ease: EASE }}
                className={`group relative overflow-hidden bg-linen ${g.span === "wide" ? "col-span-2" : ""} ${
                  g.span === "tall" ? "row-span-2" : ""
                }`}
              >
                <img
                  src={g.src}
                  alt={g.caption}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center bg-ink/70 text-cream opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                  <MagnifyingGlassPlus size={15} weight="bold" />
                </span>
                <figcaption className="absolute inset-x-0 bottom-0 translate-y-2 p-4 font-mono text-[10px] uppercase tracking-[0.16em] text-cream opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  {g.caption}
                </figcaption>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <CTABanner
        image={IMAGES.facTrucks}
        alt="Fikir delivery trucks at the plant"
        title={t("gal.cta.title", "Come see it")}
        titleAccent={t("gal.cta.accent", "in person.")}
        text={t("gal.cta.text", "Distributors and partners are always welcome. Reach out to arrange a visit or place an order.")}
        primary={t("cta.contactUs", "Contact us")}
        primaryTo="/contact"
      />

      <Lightbox
        images={srcs}
        open={lightbox !== null}
        initialIndex={lightbox ?? 0}
        onClose={() => setLightbox(null)}
        caption={(i) => items[i]?.caption ?? ""}
      />
    </>
  );
}
