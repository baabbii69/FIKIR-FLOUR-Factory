import { useMemo, useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { MagnifyingGlass, X, Eye } from "@phosphor-icons/react";
import PageHero from "../components/PageHero";
import CTABanner from "../components/CTABanner";
import Reveal from "../components/Reveal";
import Btn from "../components/Btn";
import { usePageMeta } from "../lib/usePageMeta";
import { PRODUCTS, CATEGORIES, FAQS, IMAGES } from "../data/site";
import type { Product, Category } from "../data/site";
import { useI18n } from "../i18n/I18nProvider";

const EASE = [0.16, 1, 0.3, 1] as const;
const isPackImg = (src: string) => src.endsWith(".png");

export default function Products() {
  usePageMeta(
    "Products | FIKIR FOOD PROCESSING",
    "Fortified flour, Unic biscuits, wafers, and chips, made in Adama, Ethiopia and distributed nationwide."
  );
  const { t } = useI18n();
  const [selected, setSelected] = useState<Product | null>(null);

  return (
    <>
      <PageHero
        image={IMAGES.hero}
        alt="Fikir products with the factory behind"
        crumb={t("nav.products", "Products")}
        title={t("prod.hero.title", "One name, a whole")}
        titleAccent={t("prod.hero.accent", "shelf.")}
      />
      <ProductBrowser onOpen={setSelected} />
      <FAQ />
      <CTABanner
        image={IMAGES.warehouse}
        alt="Fikir products stacked in the warehouse"
        title={t("prod.cta.title", "Want to stock")}
        titleAccent={t("prod.cta.accent", "Fikir?")}
        text={t(
          "prod.cta.text",
          "Tell us what you sell and where you are. We'll connect you with the nearest supplier or set you up as a distributor."
        )}
        primary={t("cta.becomeDistributor", "Become a distributor")}
        primaryTo="/contact"
      />
      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </>
  );
}

function ProductBrowser({ onOpen }: { onOpen: (p: Product) => void }) {
  const { t } = useI18n();
  const [params, setParams] = useSearchParams();
  const active = (params.get("cat") as Category | "all") ?? "all";
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const searchResults = useMemo(
    () => (q ? PRODUCTS.filter((p) => (p.name + " " + p.blurb + " " + (p.meta ?? "")).toLowerCase().includes(q)) : []),
    [q]
  );
  const shown = active === "all" ? CATEGORIES.map((c) => c.id) : [active];

  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
        <Reveal>
          <div className="flex flex-col gap-4 border-b border-linen pb-6 lg:flex-row lg:items-center lg:justify-between">
            <div role="tablist" aria-label="Filter products" className="flex flex-wrap gap-2">
              {[{ id: "all", label: "All", tk: "common.all" }, ...CATEGORIES.map((c) => ({ id: c.id, label: c.label, tk: `cat.${c.id}.label` }))].map((c) => {
                const on = active === c.id;
                return (
                  <button
                    key={c.id}
                    role="tab"
                    aria-selected={on}
                    onClick={() => setParams(c.id === "all" ? {} : { cat: c.id }, { replace: true })}
                    className={`px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] transition-all duration-300 active:scale-[0.98] ${
                      on ? "bg-ink text-cream" : "border border-linen text-clay hover:border-ink/40 hover:text-ink"
                    }`}
                  >
                    {t(c.tk, c.label)}
                  </button>
                );
              })}
            </div>
            <div className="relative w-full lg:w-72">
              <MagnifyingGlass size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-clay/60" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("prod.search.placeholder", "Search products...")}
                aria-label="Search products"
                className="w-full border border-linen bg-parchment py-2.5 pl-10 pr-9 font-mono text-[12px] tracking-wide text-ink placeholder:text-clay/50 focus:border-gold-deep focus:outline-none"
              />
              {query && (
                <button onClick={() => setQuery("")} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-clay/60 hover:text-ink">
                  <X size={15} />
                </button>
              )}
            </div>
          </div>
        </Reveal>

        {q ? (
          <div className="mt-12">
            <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.18em] text-clay/70">
              {searchResults.length} {t("prod.search.resultsFor", "results for")} &ldquo;{query}&rdquo;
            </p>
            {searchResults.length ? (
              <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
                {searchResults.map((p, i) => (
                  <ProductCard key={p.slug} product={p} index={i} onOpen={onOpen} />
                ))}
              </div>
            ) : (
              <p className="text-clay">
                {t("prod.search.noMatch", "No products match. Try another word, or browse the categories above.")}
              </p>
            )}
          </div>
        ) : (
          shown.map((cat) => <CategorySection key={cat} cat={cat} onOpen={onOpen} />)
        )}
      </div>
    </section>
  );
}

function CategorySection({ cat, onOpen }: { cat: Category; onOpen: (p: Product) => void }) {
  const { t } = useI18n();
  const info = CATEGORIES.find((c) => c.id === cat)!;
  const items = useMemo(() => PRODUCTS.filter((p) => p.category === cat), [cat]);
  return (
    <div className="mt-14 first:mt-12">
      <Reveal>
        <div className="flex items-baseline justify-between gap-4 border-b border-linen/70 pb-4">
          <h2 className="display-2 text-3xl md:text-4xl">{t(`cat.${cat}.label`, info.label)}</h2>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-clay/70">{t(`cat.${cat}.note`, info.note)}</span>
        </div>
      </Reveal>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {items.map((p, i) => (
          <ProductCard key={p.slug} product={p} index={i} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product: p, index, onOpen }: { product: Product; index: number; onOpen: (p: Product) => void }) {
  const reduce = useReducedMotion();
  const { t } = useI18n();
  const isPack = isPackImg(p.image);
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(p)}
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: 0.04 * Math.min(index, 6), ease: EASE }}
      className="group flex h-full flex-col overflow-hidden border border-linen bg-parchment text-left transition-colors duration-300 hover:border-gold/50"
    >
      <div className="relative aspect-square overflow-hidden bg-white">
        <img
          src={p.image}
          alt={p.name}
          loading="lazy"
          className={`h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05] ${isPack ? "object-contain p-4" : "object-cover"}`}
        />
        {p.badge && (
          <span className="absolute left-3 top-3 bg-gold px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-ink">{t(`badge.${p.badge}`, p.badge)}</span>
        )}
        <span className="absolute bottom-3 right-3 inline-flex translate-y-1 items-center gap-1.5 bg-ink/90 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-cream opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Eye size={13} weight="bold" /> {t("cta.view", "View")}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl font-semibold leading-tight text-ink">{t(`prod.${p.slug}.name`, p.name)}</h3>
        <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-clay/90 line-clamp-3">{t(`prod.${p.slug}.blurb`, p.blurb)}</p>
        {p.meta && <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-gold-deep">{t(`prod.${p.slug}.meta`, p.meta)}</p>}
      </div>
    </motion.button>
  );
}

/* ---------------- Detail modal ---------------- */
function ProductModal({ product: p, onClose }: { product: Product | null; onClose: () => void }) {
  const reduce = useReducedMotion();
  const { t } = useI18n();
  useEffect(() => {
    if (!p) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [p, onClose]);

  return (
    <AnimatePresence>
      {p && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={p.name}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.98 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="relative grid max-h-[92dvh] w-full max-w-4xl overflow-y-auto bg-cream sm:grid-cols-2"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center bg-cream/80 text-ink backdrop-blur transition-colors hover:bg-ink hover:text-cream"
            >
              <X size={18} />
            </button>
            <div className={`flex aspect-square items-center justify-center ${isPackImg(p.image) ? "bg-white p-6" : "bg-white"}`}>
              <img src={p.image} alt={p.name} className={`h-full w-full ${isPackImg(p.image) ? "object-contain" : "object-cover"}`} />
            </div>
            <div className="flex flex-col p-7 md:p-9">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold-deep">
                {p.brand} · {t(`cat.${p.category}.label`, CATEGORIES.find((c) => c.id === p.category)?.label ?? "")}
              </span>
              <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-ink">{t(`prod.${p.slug}.name`, p.name)}</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-clay/90">{t(`prod.${p.slug}.blurb`, p.blurb)}</p>
              {p.meta && (
                <div className="mt-6 border-t border-linen pt-5">
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-clay/60">
                    {p.category === "flour" ? t("prod.modal.packSizes", "Pack sizes") : t("prod.modal.type", "Type")}
                  </div>
                  <div className="mt-1 font-display text-lg font-semibold text-ink">{t(`prod.${p.slug}.meta`, p.meta)}</div>
                </div>
              )}
              <div className="mt-auto flex flex-col gap-3 pt-8">
                <Btn to="/contact" arrow className="w-full">
                  {t("cta.enquireOrder", "Enquire / order")}
                </Btn>
                <Btn to={`/products?cat=${p.category}`} variant="outline-ink" className="w-full">
                  {t("prod.modal.more", "More")} {t(`cat.${p.category}.label`, CATEGORIES.find((c) => c.id === p.category)?.label ?? "").toLowerCase()}
                </Btn>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

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
