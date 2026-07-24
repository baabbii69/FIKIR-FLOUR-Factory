import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { CaretDown, MagnifyingGlassPlus, ArrowRight } from "@phosphor-icons/react";
import PageHero from "../components/PageHero";
import CTABanner from "../components/CTABanner";
import Reveal from "../components/Reveal";
import Btn from "../components/Btn";
import Lightbox from "../components/Lightbox";
import Img, { toWebp } from "../components/Img";
import { usePageMeta } from "../lib/usePageMeta";
import { useHorizontalScroll } from "../lib/useHorizontalScroll";
import { CATEGORIES, FAQS, IMAGES } from "../data/site";
import type { Product } from "../data/site";
import { getProductsByCategory, getProductImages, getCategories } from "../content";
import { useI18n } from "../i18n/I18nProvider";
import { Accent } from "../i18n/Accent";

const EASE = [0.16, 1, 0.3, 1] as const;
const isPackImg = (src: string) => src.endsWith(".png");
// Categories shown in the UI (chips is currently hidden — see data/site.ts).
const VISIBLE_CATEGORIES = getCategories();

/** Auto-advance a product's image index every few seconds when it has more
 *  than one photo, so galleries cycle on their own. Resets when the set/product
 *  changes. Returns nothing — it just drives the passed setter. */
function useAutoRotate(count: number, key: string, setIndex: (fn: (i: number) => number) => void) {
  useEffect(() => {
    if (count <= 1) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), 3400);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, key]);
}

export default function Products() {
  usePageMeta(
    "Products | FIKIR FOOD PROCESSING",
    "Fortified flour, Unic biscuits, wafers, and chips, made in Adama, Ethiopia and distributed nationwide."
  );
  const { t } = useI18n();
  return (
    <>
      <PageHero
        image={IMAGES.proRange}
        alt="The Unic range"
        crumb={t("nav.products", "Products")}
        title={t("prod.hero.title", "One name, a whole")}
        titleAccent={t("prod.hero.accent", "shelf.")}
      />
      {/* Desktop keeps the pinned horizontal scroller; mobile gets a natural
          vertical, tabbed layout (the carousel felt broken on small screens). */}
      <CategoryScroller />
      <MobileCategoryBrowser />
      <FAQ />
      <CTABanner
        image={IMAGES.warehouse}
        alt="Fikir products stacked in the warehouse"
        title={t("prod.cta.title", "Want to stock")}
        titleAccent={t("prod.cta.accent", "Fikir?")}
        text={t("prod.cta.text", "Tell us what you sell and where you are. We'll connect you with the nearest supplier or set you up as a distributor.")}
        primary={t("cta.becomeDistributor", "Become a distributor")}
        primaryTo="/contact"
      />
    </>
  );
}

/* ---------------- Horizontal category scroller ---------------- */
function CategoryScroller() {
  const { t } = useI18n();
  const { sectionRef, trackRef } = useHorizontalScroll<HTMLElement, HTMLDivElement>();

  return (
    <section ref={sectionRef} aria-label={t("prod.browse.aria", "Browse products by category")} className="relative hidden bg-ink lg:block">
      <div className="lg:sticky lg:top-24 lg:h-[calc(100dvh-7.5rem)] lg:overflow-hidden">
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 py-8 md:gap-6 md:px-6 md:py-12 lg:h-full lg:snap-none lg:items-stretch lg:overflow-visible lg:py-0 lg:pl-[9vw] lg:pr-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {/* Intro panel */}
          <div className="flex w-[80vw] shrink-0 snap-center flex-col justify-center py-10 sm:w-[56vw] lg:h-full lg:w-[30vw] lg:py-0 lg:pr-10">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-gold">{t("prod.browse.eyebrow", "The range")}</span>
            <h2 className="display-2 mt-6 text-4xl !text-cream md:text-6xl">
              <Accent text={t("prod.browse.title", "Our ranges, *one standard.*")} tone="dark" />
            </h2>
            <p className="mt-6 max-w-[40ch] text-[15px] leading-relaxed text-cream/70">
              {t("prod.browse.body", "Flour, biscuits, and wafers — pick a variety to see it up close.")}
            </p>
            <div className="mt-10 hidden items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-cream/50 lg:flex">
              {t("home.process.scrollHint", "Scroll to explore")}
              <ArrowRight size={14} weight="bold" className="text-gold" />
            </div>
          </div>

          {VISIBLE_CATEGORIES.map((c) => (
            <CategoryCard key={c.id} cat={c} />
          ))}
          {/* Trailing spacer so the last card comes to rest centred. A real element
              is required: Chrome's scrollWidth ignores a container's trailing padding. */}
          <div aria-hidden className="shrink-0 lg:w-[9vw]" />
        </div>
      </div>
    </section>
  );
}

/* ---------------- Mobile: vertical, tabbed browser ----------------
   Small screens get a natural top-to-bottom layout instead of the desktop
   horizontal scroller: category tabs up top, then the selected category's
   image, thumbnails, variety picker, details, and CTA — all full width. */
function MobileCategoryBrowser() {
  const { t } = useI18n();
  const [catIdx, setCatIdx] = useState(0);
  const cat = VISIBLE_CATEGORIES[catIdx];
  const products = useMemo(() => getProductsByCategory(cat.id), [cat.id]);
  const [sel, setSel] = useState(0);
  const [img, setImg] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  // Reset the selected variety/image whenever the category tab changes.
  useEffect(() => {
    setSel(0);
    setImg(0);
  }, [catIdx]);

  const product = products[Math.min(sel, products.length - 1)];
  const images = useMemo(() => getProductImages(product), [product]);
  const catLabel = t(`cat.${cat.id}.label`, cat.label);
  useAutoRotate(images.length, product.slug, setImg);
  const pick = (i: number) => {
    setSel(i);
    setImg(0);
  };

  return (
    <section aria-label={t("prod.browse.aria", "Browse products by category")} className="bg-ink lg:hidden">
      <div className="px-5 py-14 sm:px-8">
        <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-gold">{t("prod.browse.eyebrow", "The range")}</span>
        <h2 className="display-2 mt-4 text-4xl !text-cream">
          <Accent text={t("prod.browse.title", "Our ranges, *one standard.*")} tone="dark" />
        </h2>
        <p className="mt-4 max-w-[42ch] text-[15px] leading-relaxed text-cream/70">
          {t("prod.browse.body", "Flour, biscuits, and wafers — pick a variety to see it up close.")}
        </p>

        {/* Category tabs */}
        <div
          role="tablist"
          aria-label={t("prod.browse.aria", "Browse products by category")}
          className="mt-8 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {VISIBLE_CATEGORIES.map((c, i) => (
            <button
              key={c.id}
              role="tab"
              aria-selected={i === catIdx}
              onClick={() => setCatIdx(i)}
              className={`shrink-0 rounded-full border px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${
                i === catIdx ? "border-transparent bg-gold text-ink" : "border-cream/20 text-cream/70 hover:text-cream"
              }`}
            >
              {t(`cat.${c.id}.label`, c.label)}
            </button>
          ))}
        </div>

        {/* Active category card */}
        <div className="mt-6 overflow-hidden rounded-2xl bg-parchment">
          {/* Image stage */}
          <div className="flex flex-col items-center gap-3 p-5">
            <button
              type="button"
              onClick={() => setLightbox(true)}
              aria-label={t("prod.detail.view", "View full")}
              className="group relative flex aspect-square w-full items-center justify-center"
            >
              <picture className="contents">
                {toWebp(images[img]) && <source srcSet={toWebp(images[img])!} type="image/webp" />}
                <motion.img
                  key={product.slug + "-" + img}
                  src={images[img]}
                  alt={t(`prod.${product.slug}.name`, product.name)}
                  loading="lazy"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="h-full w-full object-contain"
                />
              </picture>
              <span className="absolute bottom-1 right-1 inline-flex items-center gap-1.5 bg-ink/85 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-cream">
                <MagnifyingGlassPlus size={13} weight="bold" /> {t("prod.detail.view", "View full")}
              </span>
            </button>

            {images.length > 1 && (
              <div className="flex flex-wrap justify-center gap-2">
                {images.map((src, i) => (
                  <button
                    key={src + i}
                    onClick={() => setImg(i)}
                    aria-label={`${t(`prod.${product.slug}.name`, product.name)} image ${i + 1}`}
                    aria-current={i === img}
                    className={`h-14 w-14 overflow-hidden rounded-md border bg-white p-1 transition-colors ${
                      i === img ? "border-gold-deep" : "border-linen hover:border-ink/40"
                    }`}
                  >
                    <Img src={src} alt="" loading="lazy" className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="border-t border-linen p-5">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold-deep">{t(`cat.${cat.id}.note`, cat.note)}</span>
            <h3 className="mt-2 font-display text-3xl font-semibold leading-none text-ink">{catLabel}</h3>

            <div className="mt-4 space-y-2">
              {products.map((p, i) => (
                <VarietyButton key={p.slug} product={p} active={i === sel} onClick={() => pick(i)} />
              ))}
            </div>

            <div className="mt-5 border-t border-linen pt-1">
              <ProductInfo product={product} catLabel={catLabel} />
            </div>
            <div className="mt-4">
              <Btn to="/contact" arrow className="w-full">
                {t("cta.enquireOrder", "Enquire / order")}
              </Btn>
            </div>
          </div>
        </div>
      </div>

      <Lightbox
        images={images}
        open={lightbox}
        initialIndex={img}
        onClose={() => setLightbox(false)}
        caption={t(`prod.${product.slug}.name`, product.name)}
      />
    </section>
  );
}

/* ---------------- One category card ---------------- */
function CategoryCard({ cat }: { cat: (typeof CATEGORIES)[number] }) {
  const { t } = useI18n();
  const products = useMemo(() => getProductsByCategory(cat.id), [cat.id]);
  const [sel, setSel] = useState(0);
  const [img, setImg] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const product = products[sel];
  const images = useMemo(() => getProductImages(product), [product]);
  const catLabel = t(`cat.${cat.id}.label`, cat.label);
  useAutoRotate(images.length, product.slug, setImg);

  const pick = (i: number) => {
    setSel(i);
    setImg(0);
  };

  // The variety list scrolls independently only when it's long (biscuits) AND on
  // desktop. `data-lenis-prevent` there stops the wheel from reaching Lenis (which
  // drives the horizontal scrub) — added via effect so it never blocks touch
  // scrolling on mobile, where the list isn't a scroll area.
  const varietyRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = varietyRef.current;
    if (!el) return;
    const apply = () => {
      if (products.length > 5 && window.matchMedia("(min-width: 1024px)").matches) el.setAttribute("data-lenis-prevent", "");
      else el.removeAttribute("data-lenis-prevent");
    };
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, [products.length]);

  return (
    <article className="flex w-[86vw] shrink-0 snap-center overflow-hidden rounded-2xl bg-parchment sm:w-[62vw] lg:h-full lg:w-[82vw]">
      <div className="flex w-full flex-col lg:grid lg:h-full lg:grid-cols-[minmax(300px,34%)_1fr]">
        {/* Info column — content spans the full card height */}
        <div className="order-2 flex flex-col border-t border-linen p-6 md:p-8 lg:order-1 lg:h-full lg:min-h-0 lg:border-r lg:border-t-0">
          <div className="shrink-0">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold-deep">{t(`cat.${cat.id}.note`, cat.note)}</span>
            <h2 className="mt-2 font-display text-3xl font-semibold leading-none text-ink md:text-4xl">{catLabel}</h2>
          </div>

          {/* Variety selector — grows to fill, scrolls if long */}
          <div ref={varietyRef} className="mt-5 space-y-2 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-1 [scrollbar-width:thin]">
            {products.map((p, i) => (
              <VarietyButton key={p.slug} product={p} active={i === sel} onClick={() => pick(i)} />
            ))}
          </div>

          {/* Expandable info + CTA pinned to the bottom of the card */}
          <div className="mt-5 shrink-0 border-t border-linen pt-1">
            <ProductInfo product={product} catLabel={catLabel} />
          </div>
          <div className="mt-4 shrink-0">
            <Btn to="/contact" arrow className="w-full">{t("cta.enquireOrder", "Enquire / order")}</Btn>
          </div>
        </div>

        {/* Image column — the product fills a large, uniform stage */}
        <div className="order-1 flex min-h-[54vh] flex-col items-center justify-center gap-3 p-4 md:p-6 lg:order-2 lg:h-full lg:min-h-0">
          <button
            type="button"
            onClick={() => setLightbox(true)}
            aria-label={t("prod.detail.view", "View full")}
            className="group relative mx-auto flex w-full min-h-0 flex-1 items-center justify-center lg:max-w-[640px]"
          >
            <picture className="contents">
              {toWebp(images[img]) && <source srcSet={toWebp(images[img])!} type="image/webp" />}
              <motion.img
                key={product.slug + "-" + img}
                src={images[img]}
                alt={t(`prod.${product.slug}.name`, product.name)}
                loading="lazy"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="h-full w-full object-contain"
              />
            </picture>
            <span className="absolute bottom-1 right-1 inline-flex items-center gap-1.5 bg-ink/85 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-cream opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <MagnifyingGlassPlus size={13} weight="bold" /> {t("prod.detail.view", "View full")}
            </span>
          </button>

          {/* Per-product image thumbnails */}
          {images.length > 1 && (
            <div className="flex flex-wrap justify-center gap-2">
              {images.map((src, i) => (
                <button
                  key={src + i}
                  onClick={() => setImg(i)}
                  aria-label={`${t(`prod.${product.slug}.name`, product.name)} image ${i + 1}`}
                  aria-current={i === img}
                  className={`h-14 w-14 overflow-hidden rounded-md border bg-white transition-colors ${
                    i === img ? "border-gold-deep" : "border-linen hover:border-ink/40"
                  } p-1`}
                >
                  <img src={src} alt="" loading="lazy" className="h-full w-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <Lightbox
        images={images}
        open={lightbox}
        initialIndex={img}
        onClose={() => setLightbox(false)}
        caption={t(`prod.${product.slug}.name`, product.name)}
      />
    </article>
  );
}

function VarietyButton({ product: p, active, onClick }: { product: Product; active: boolean; onClick: () => void }) {
  const { t } = useI18n();
  const pack = isPackImg(p.image);
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`flex w-full items-center gap-3 rounded-xl border p-2 pr-3 text-left transition-colors duration-200 ${
        active ? "border-transparent bg-ink text-cream" : "border-linen bg-cream text-ink hover:border-ink/30"
      }`}
    >
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white ${pack ? "p-1" : ""}`}>
        <Img src={p.image} alt="" loading="lazy" className={`h-full w-full ${pack ? "object-contain" : "object-cover"}`} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-display text-[15px] font-semibold leading-tight">{t(`prod.${p.slug}.name`, p.name)}</span>
        {p.meta && (
          <span className={`block truncate font-mono text-[9px] uppercase tracking-[0.12em] ${active ? "text-cream/60" : "text-clay/70"}`}>
            {t(`prod.${p.slug}.meta`, p.meta)}
          </span>
        )}
      </span>
      {active && <ArrowRight size={14} weight="bold" className="shrink-0 text-gold" />}
    </button>
  );
}

/* ---------------- Expandable per-product info ---------------- */
function ProductInfo({ product: p, catLabel }: { product: Product; catLabel: string }) {
  const { t } = useI18n();
  const [open, setOpen] = useState<string | null>("about");

  const qualityText =
    p.category === "flour"
      ? t("prod.acc.qualityFlour", "Milled and fortified up to Vitamin B12 in Adama, released only after laboratory testing. Our wheat flour carries the Institute of Ethiopian Standards mark.")
      : t("prod.acc.qualitySnack", "Made in Adama on modern imported lines from selected raw materials, and checked in our own laboratory before every release.");

  const sections = [
    {
      id: "about",
      label: t("prod.acc.about", "Details"),
      body: <p className="text-[13.5px] leading-relaxed text-clay/90">{t(`prod.${p.slug}.blurb`, p.blurb)}</p>,
    },
    {
      id: "specs",
      label: t("prod.acc.specs", "Specifications"),
      body: (
        <dl className="space-y-2 text-[13px]">
          <Row k={t("prod.acc.brand", "Brand")} v={p.brand} />
          <Row k={t("prod.acc.category", "Category")} v={catLabel} />
          {p.meta && <Row k={p.category === "flour" ? t("prod.modal.packSizes", "Pack sizes") : t("prod.modal.type", "Type")} v={t(`prod.${p.slug}.meta`, p.meta)} />}
        </dl>
      ),
    },
    {
      id: "quality",
      label: t("prod.acc.quality", "Quality & sourcing"),
      body: <p className="text-[13.5px] leading-relaxed text-clay/90">{qualityText}</p>,
    },
  ];

  return (
    <div className="divide-y divide-linen">
      {sections.map((s) => {
        const isOpen = open === s.id;
        return (
          <div key={s.id}>
            <button
              onClick={() => setOpen(isOpen ? null : s.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-3 py-3 text-left font-mono text-[11px] uppercase tracking-[0.14em] text-ink"
            >
              {s.label}
              <span className={`flex h-6 w-6 items-center justify-center rounded-full bg-ink/5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                <CaretDown size={13} weight="bold" />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="overflow-hidden"
                >
                  <div className="pb-4">{s.body}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-clay/70">{k}</dt>
      <dd className="font-display font-semibold text-ink">{v}</dd>
    </div>
  );
}

/* ---------------- FAQ ---------------- */
function FAQ() {
  const { t } = useI18n();
  return (
    <section className="bg-parchment">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-20 md:px-10 md:py-28 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <h2 className="display-2 text-4xl md:text-5xl">{t("prod.faq.title", "Common questions")}</h2>
              <p className="mt-6 max-w-sm text-[15px] leading-relaxed">
                {t("prod.faq.subPre", "For anything else, reach us anytime through the ")}
                <Link to="/contact" className="text-gold-deep underline decoration-gold/40 underline-offset-4 transition-colors hover:text-ink">
                  {t("prod.faq.contactPage", "contact page")}
                </Link>
                {t("prod.faq.subPost", ".")}
              </p>
            </Reveal>
          </div>
        </div>
        <div className="lg:col-span-8 lg:col-start-5">
          <dl className="divide-y divide-linen border-y border-linen">
            {FAQS.map((f, i) => (
              <Reveal key={f.q} delay={0.04 * Math.min(i, 3)}>
                <div className="grid gap-3 py-8 md:grid-cols-12 md:gap-8">
                  <dt className="font-display text-xl font-semibold text-ink md:col-span-5">{t(`faq.${i}.q`, f.q)}</dt>
                  <dd className="text-[15px] leading-relaxed text-clay/90 md:col-span-7">{t(`faq.${i}.a`, f.a)}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
