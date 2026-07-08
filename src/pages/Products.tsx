import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Truck, Package, Stack, ShoppingBagOpen, ArrowRight } from "@phosphor-icons/react";
import PageHero from "../components/PageHero";
import CTABanner from "../components/CTABanner";
import Reveal from "../components/Reveal";
import { usePageMeta } from "../lib/usePageMeta";
import { PRODUCTS, PRODUCT_FILTERS, FAQS, IMAGES } from "../data/site";
import type { Product } from "../data/site";

export default function Products() {
  usePageMeta(
    "Products | FIKIR FOOD PROCESSING",
    "Nine flour lines from all-purpose to custom R&D blends: specs, packaging formats, and answers to common questions."
  );

  return (
    <>
      <PageHero
        image={IMAGES.flourPour}
        alt="Fine flour pouring in soft light"
        crumb="Products"
        title="Nine flours. One"
        titleAccent="standard."
      />
      <ProductGrid />
      <Packaging />
      <FAQ />
      <CTABanner
        image={IMAGES.breadOven}
        alt="Fresh bread loaves emerging from a stone oven"
        title="Not sure which flour"
        titleAccent="fits your line?"
        text="Send us your spec sheet or describe your product. Our lab will recommend a match, or build one."
        primary="Request a quote"
        primaryTo="/contact"
      />
    </>
  );
}

/* ---------------- Product grid with filters ---------------- */

function ProductGrid() {
  const [params, setParams] = useSearchParams();
  const active = params.get("cat") ?? "all";
  const reduce = useReducedMotion();

  const filtered = useMemo(
    () => (active === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === active)),
    [active]
  );

  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
        <Reveal>
          <div
            role="tablist"
            aria-label="Filter products by category"
            className="flex flex-wrap gap-2 border-b border-linen pb-6"
          >
            {PRODUCT_FILTERS.map((f) => {
              const selected = active === f.id;
              return (
                <button
                  key={f.id}
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setParams(f.id === "all" ? {} : { cat: f.id }, { replace: true })}
                  className={`px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] transition-all duration-300 active:scale-[0.98] ${
                    selected
                      ? "bg-ink text-cream"
                      : "border border-linen text-clay hover:border-ink/40 hover:text-ink"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </Reveal>

        <motion.div layout={!reduce} className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((p) => (
              <motion.div
                key={p.slug}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

function ProductCard({ product: p }: { product: Product }) {
  const dark = p.category === "custom";
  return (
    <article
      className={`group flex h-full flex-col overflow-hidden border transition-colors duration-300 ${
        dark ? "border-ink bg-ink" : "border-linen bg-parchment hover:border-gold/50"
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={p.image}
          alt={p.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
        />
        <span
          className={`absolute left-4 top-4 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] ${
            dark ? "bg-gold text-ink" : "bg-cream/90 text-ink backdrop-blur-sm"
          }`}
        >
          {p.badge ?? p.categoryLabel}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-7">
        <h3
          className={`font-display text-2xl font-semibold leading-tight ${
            dark ? "text-cream" : "text-ink"
          }`}
        >
          {p.name}
        </h3>
        <p
          className={`mb-6 mt-3 text-[15px] leading-relaxed ${dark ? "text-cream/70" : "text-clay/90"}`}
        >
          {p.description}
        </p>
        <div
          className={`mt-auto flex flex-wrap gap-x-6 gap-y-2 border-t pt-5 ${
            dark ? "border-cream/15" : "border-linen"
          }`}
        >
          {p.specs.map((s) => (
            <div key={s.label}>
              <div
                className={`font-mono text-[10px] uppercase tracking-[0.16em] ${
                  dark ? "text-cream/50" : "text-clay/70"
                }`}
              >
                {s.label}
              </div>
              <div
                className={`mt-0.5 font-mono text-sm tabular-nums ${
                  dark ? "text-gold" : "text-ink"
                }`}
              >
                {s.value}
              </div>
            </div>
          ))}
        </div>
        <Link
          to="/contact"
          className={`mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors duration-300 ${
            dark ? "text-gold hover:text-gold-bright" : "text-gold-deep hover:text-ink"
          }`}
        >
          Enquire about this flour
          <ArrowRight size={13} weight="bold" />
        </Link>
      </div>
    </article>
  );
}

/* ---------------- Packaging formats ---------------- */

const PACKAGING = [
  {
    icon: Truck,
    title: "Bulk tanker",
    text: "Pneumatic tanker delivery direct to your silos, 25 MT minimum.",
  },
  {
    icon: Package,
    title: "FIBC big bags",
    text: "500 kg and 1,000 kg woven bags with food-grade liners.",
  },
  {
    icon: Stack,
    title: "Palletised sacks",
    text: "25 kg and 50 kg paper sacks, shrink-wrapped on export pallets.",
  },
  {
    icon: ShoppingBagOpen,
    title: "Retail packs",
    text: "1 kg to 5 kg consumer packs, private label available.",
  },
];

function Packaging() {
  return (
    <section className="bg-ink">
      <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <span className="eyebrow">Packaging & delivery</span>
            <h2 className="display-2 mt-5 max-w-xl text-4xl !text-cream md:text-5xl">
              From silo to shelf, your{" "}
              <em className="pb-1 leading-[1.1] text-gold">format.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="max-w-sm text-[15px] leading-relaxed text-cream/65">
              Every format ships with a certificate of analysis and full traceability back to
              the grain lot.
            </p>
          </Reveal>
        </div>
        <div className="mt-14 grid gap-px border border-cream/10 bg-cream/10 sm:grid-cols-2 lg:grid-cols-4">
          {PACKAGING.map((f, i) => (
            <Reveal key={f.title} delay={0.05 * i} className="h-full">
              <div className="group flex h-full min-h-[240px] flex-col justify-between bg-ink p-8 transition-colors duration-300 hover:bg-[#241a0d]">
                <f.icon
                  size={30}
                  weight="duotone"
                  className="text-gold transition-transform duration-300 group-hover:-translate-y-1"
                />
                <div>
                  <h3 className="font-display text-2xl font-semibold text-cream">{f.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-cream/65">{f.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- FAQ (side-by-side list, no accordion) ---------------- */

function FAQ() {
  return (
    <section className="bg-parchment">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-20 md:px-10 md:py-28 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <h2 className="display-2 text-4xl md:text-5xl">Questions buyers ask us</h2>
              <p className="mt-6 max-w-sm text-[15px] leading-relaxed">
                The answers our sales team gives most often. For anything else, write to{" "}
                <a
                  href="mailto:sales@fikirflour.com"
                  className="text-gold-deep underline decoration-gold/40 underline-offset-4 transition-colors hover:text-ink"
                >
                  sales@fikirflour.com
                </a>
                .
              </p>
            </Reveal>
          </div>
        </div>
        <div className="lg:col-span-8 lg:col-start-5">
          <dl className="divide-y divide-linen border-y border-linen">
            {FAQS.map((f, i) => (
              <Reveal key={f.q} delay={0.04 * Math.min(i, 3)}>
                <div className="grid gap-3 py-8 md:grid-cols-12 md:gap-8">
                  <dt className="font-display text-xl font-semibold text-ink md:col-span-5">
                    {f.q}
                  </dt>
                  <dd className="text-[15px] leading-relaxed text-clay/90 md:col-span-7">
                    {f.a}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
