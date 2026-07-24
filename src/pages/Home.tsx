import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, SealCheck } from "@phosphor-icons/react";
import { usePageMeta } from "../lib/usePageMeta";
import { useHorizontalScroll } from "../lib/useHorizontalScroll";
import { STATS, CATEGORIES, CERTIFICATE, PRODUCTS, PROCESS, IMAGES, COMPANY } from "../data/site";
import { useI18n } from "../i18n/I18nProvider";
import { Accent } from "../i18n/Accent";
import Btn from "../components/Btn";
import Img from "../components/Img";
import Reveal from "../components/Reveal";
import Stat from "../components/Stat";
import FlourDust from "../components/FlourDust";
import TestimonialRotator from "../components/TestimonialRotator";
import CTABanner from "../components/CTABanner";

gsap.registerPlugin(ScrollTrigger);
const EASE = [0.16, 1, 0.3, 1] as const;

/* ---------------- Hero ---------------- */
function Hero() {
  const reduce = useReducedMotion();
  const { t } = useI18n();
  const item = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 32 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay, ease: EASE },
  });
  return (
    <section className="relative flex min-h-[100dvh] items-center overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <Img
          src={IMAGES.hero}
          alt="The Fikir Food Processing plant, fleet, and products at sunset"
          className="kenburns h-full w-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/60 to-ink/25" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-ink to-transparent" />
      </div>
      <FlourDust />
      <div className="relative mx-auto w-full max-w-[1400px] px-5 pt-24 md:px-10">
        <motion.span className="eyebrow" {...item(0.1)}>
          {t("home.hero.eyebrow", `Adama, Ethiopia · ${COMPANY.name}`)}
        </motion.span>
        <motion.h1 className="display-1 mt-6 max-w-4xl text-5xl !text-cream sm:text-6xl lg:text-8xl" {...item(0.22)}>
          <Accent text={t("home.hero.title", "We produce quality, *we deliver trust.*")} tone="dark" />
        </motion.h1>
        <motion.p className="mt-7 max-w-xl text-lg leading-relaxed text-cream/85" {...item(0.36)}>
          {t(
            "home.hero.sub",
            "For over 15 years we've made fortified flour, Unic biscuits, wafers, and chips in Adama, delivered fresh across Ethiopia by our own fleet."
          )}
        </motion.p>
        <motion.div className="mt-10 flex flex-col gap-4 sm:flex-row" {...item(0.48)}>
          <Btn to="/products" arrow>
            {t("cta.exploreProducts", "Explore products")}
          </Btn>
          <Btn to="/about" variant="outline-cream">
            {t("cta.ourStory", "Our story")}
          </Btn>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- Text marquee ---------------- */
const MARQUEE = [
  { k: "home.mq.1", en: "Since 2004 E.C." },
  { k: "home.mq.2", en: "Adama, Ethiopia" },
  { k: "home.mq.3", en: "Fortified up to Vitamin B12" },
  { k: "home.mq.4", en: "600+ team members" },
  { k: "home.mq.5", en: "Delivered nationwide" },
  { k: "home.mq.6", en: "We produce quality, we deliver trust" },
];
function MarqueeBand() {
  const { t } = useI18n();
  const strip = (h: boolean) => (
    <ul aria-hidden={h || undefined} className="animate-marquee flex shrink-0 items-center">
      {MARQUEE.map((m) => (
        <li key={m.k} className="flex shrink-0 items-center whitespace-nowrap font-display text-3xl font-medium text-cream/85 md:text-4xl">
          <span className="px-8 md:px-12">{t(m.k, m.en)}</span>
          <span className="text-2xl text-gold" aria-hidden>
            &middot;
          </span>
        </li>
      ))}
    </ul>
  );
  return (
    <section aria-label="Fikir at a glance" className="overflow-hidden border-y border-cream/10 bg-ink py-7 md:py-9">
      <div className="flex w-max">
        {strip(false)}
        {strip(true)}
      </div>
    </section>
  );
}

/* ---------------- Who we are (scroll-scrubbed reveal) ---------------- */
const WHO_EN =
  "A legally registered Ethiopian food manufacturer in Adama, making the highest-quality wheat flour, more than twelve kinds of biscuits, cream wafers, and potato chips, for *families across the country.*";

// Split a *starred* string into words, flagging which fall inside the accent.
function splitWords(s: string) {
  let inAccent = false;
  return s
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => {
      const hasStart = w.startsWith("*");
      let text = w.replace(/^\*+/, "");
      const hasEnd = text.endsWith("*");
      text = text.replace(/\*+$/, "");
      const gold = inAccent || hasStart;
      if (hasStart && !hasEnd) inAccent = true;
      if (hasEnd) inAccent = false;
      return { t: text, gold };
    });
}

function WhoWeAre() {
  const { t, lang } = useI18n();
  const words = splitWords(t("home.who.body", WHO_EN));
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        el.querySelectorAll("[data-w]"),
        { opacity: 0.14 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 60%", scrub: 0.8 },
        }
      );
    });
    return () => mm.revert();
  }, [lang]); // re-init when the words change on language switch
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36">
        <Reveal>
          <span className="eyebrow">{t("home.who.eyebrow", "Who we are")}</span>
        </Reveal>
        <div ref={ref} className="mt-8">
          <p className="display-2 max-w-5xl text-3xl leading-[1.22] md:text-5xl md:leading-[1.2]">
            {words.map((w, i) => (
              <span key={i} data-w className={w.gold ? "italic text-gold-deep" : undefined}>
                {w.t}{" "}
              </span>
            ))}
          </p>
        </div>
        <Reveal delay={0.1}>
          <Link
            to="/about"
            className="group mt-10 inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-gold-deep transition-colors duration-300 hover:text-ink"
          >
            {t("cta.ourStory", "Our story")}
            <ArrowRight size={13} weight="bold" className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>
        <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-linen pt-12 md:mt-20 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.07}>
              <Stat {...s} label={t(`stats.${i}`, s.label)} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- How Fikir is made (sticky horizontal scroll) ---------------- */
function ProcessJourney() {
  const { t } = useI18n();
  const { sectionRef, trackRef } = useHorizontalScroll<HTMLElement, HTMLDivElement>();

  return (
    <section ref={sectionRef} aria-label={t("home.process.eyebrow", "How Fikir is made")} className="relative bg-ink text-cream">
      <div className="lg:sticky lg:top-0 lg:h-screen lg:overflow-hidden">
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 py-16 md:gap-6 md:px-10 lg:h-screen lg:snap-none lg:items-stretch lg:overflow-visible lg:py-0 lg:pr-[6vw] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {/* Intro panel */}
          <div className="flex w-[82vw] shrink-0 snap-center flex-col justify-center sm:w-[60vw] lg:h-screen lg:w-[36vw] lg:justify-center lg:pr-10">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-gold">
              {t("home.process.eyebrow", "How Fikir is made")}
            </span>
            <h2 className="display-2 mt-6 text-4xl !text-cream md:text-6xl">
              <Accent text={t("home.process.title", "From grain to *your table.*")} tone="dark" />
            </h2>
            <p className="mt-6 max-w-[42ch] text-[15px] leading-relaxed text-cream/70">
              {t("home.process.body", "Six steps, one standard — inside the Adama plant, from the first grain to the truck at your door.")}
            </p>
            <div className="mt-10 hidden items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-cream/50 lg:flex">
              {t("home.process.scrollHint", "Scroll to explore")}
              <ArrowRight size={14} weight="bold" className="text-gold" />
            </div>
          </div>

          {/* Step panels */}
          {PROCESS.map((s, i) => (
            <article
              key={s.n}
              className="relative flex h-[62vh] w-[82vw] shrink-0 snap-center flex-col justify-end overflow-hidden sm:h-[70vh] sm:w-[58vw] lg:h-screen lg:w-[40vw]"
            >
              <Img
                src={s.img}
                alt={t(`proc.${i}.title`, s.title)}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/10" />
              <div className="relative p-7 md:p-10 lg:p-12">
                <span className="font-display text-6xl font-semibold text-gold/50 md:text-7xl">{s.n}</span>
                <h3 className="mt-3 font-display text-2xl font-semibold text-cream md:text-3xl">{t(`proc.${i}.title`, s.title)}</h3>
                <p className="mt-3 max-w-[40ch] text-[14px] leading-relaxed text-cream/75 md:text-[15px]">{t(`proc.${i}.text`, s.text)}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Product pack marquee ---------------- */
const PACKS = [
  "b-high-energy",
  "w-chocolate",
  "b-cappuccino",
  "w-vanilla",
  "b-apple-vanilla",
  "w-orange",
  "b-banana",
  "b-glucose",
  "b-vanilla-sandwich",
];
function PackMarquee() {
  const strip = (h: boolean) => (
    <ul aria-hidden={h || undefined} className="flex shrink-0 items-center gap-10 pr-10 md:gap-16 md:pr-16" style={{ animation: "marquee 40s linear infinite" }}>
      {PACKS.map((p) => (
        <li key={p} className="shrink-0">
          <Img src={`/media/products/${p}.png`} alt="" className="h-28 w-auto object-contain md:h-36" loading="lazy" />
        </li>
      ))}
    </ul>
  );
  return (
    <section aria-hidden className="overflow-hidden bg-parchment py-10 md:py-14">
      <div className="flex w-max">
        {strip(false)}
        {strip(true)}
      </div>
    </section>
  );
}

/* ---------------- Interactive range (hover-preview) ---------------- */
const FEATURED = ["high-energy", "wafer-chocolate", "chips-tomato", "special", "cappuccino", "wafer-orange"];
function RangeIndex() {
  const { t } = useI18n();
  const items = FEATURED.map((s) => PRODUCTS.find((p) => p.slug === s)!).filter(Boolean);
  const [active, setActive] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 220, damping: 26, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 220, damping: 26, mass: 0.6 });
  const onMove = (e: React.MouseEvent) => {
    const r = wrap.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(e.clientX - r.left + 28);
    my.set(e.clientY - r.top - 120);
  };
  return (
    <section className="bg-parchment">
      <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <span className="eyebrow">{t("home.range.eyebrow", "What we make")}</span>
            <h2 className="display-2 mt-5 max-w-xl text-4xl md:text-6xl">
              <Accent text={t("home.range.title", "Four ranges, one *standard.*")} />
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <Btn to="/products" variant="outline-ink" arrow>
              {t("cta.allProducts", "All products")}
            </Btn>
          </Reveal>
        </div>
        <div ref={wrap} onMouseMove={reduce ? undefined : onMove} className="relative mt-14 border-b border-linen">
          {items.map((p, i) => (
            <Reveal key={p.slug} delay={0.04 * Math.min(i, 4)}>
              <Link
                to={`/products?cat=${p.category}`}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                className="group flex items-center gap-5 border-t border-linen py-6 md:gap-8 md:py-8"
              >
                <span className="w-7 shrink-0 font-mono text-[11px] tabular-nums text-clay/60">0{i + 1}</span>
                <Img src={p.image} alt="" loading="lazy" className="h-14 w-20 shrink-0 object-contain lg:hidden" />
                <h3 className="font-display text-2xl font-semibold leading-tight text-ink transition-[transform,color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 group-hover:text-gold-deep md:text-4xl">
                  {p.name}
                </h3>
                <span className="ml-auto hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-clay/70 md:block">
                  {p.meta}
                </span>
                <ArrowRight size={18} weight="bold" className="shrink-0 -translate-x-2 text-gold opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
              </Link>
            </Reveal>
          ))}
          {!reduce && (
            <motion.div style={{ x: sx, y: sy }} aria-hidden className="pointer-events-none absolute left-0 top-0 z-10 hidden lg:block">
              <motion.div
                animate={{ opacity: active !== null ? 1 : 0, scale: active !== null ? 1 : 0.9 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="flex h-[240px] w-[320px] items-center justify-center overflow-hidden bg-white shadow-2xl shadow-ink/30"
              >
                {items.map((p, i) => (
                  <Img
                    key={p.slug}
                    src={p.image}
                    alt=""
                    loading="lazy"
                    className={`absolute inset-0 m-auto max-h-[85%] max-w-[85%] object-contain transition-opacity duration-300 ${active === i ? "opacity-100" : "opacity-0"}`}
                  />
                ))}
              </motion.div>
            </motion.div>
          )}
        </div>

        {/* Category cards */}
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((c, i) => (
            <Reveal key={c.id} delay={0.05 * i} className="h-full">
              <Link to={`/products?cat=${c.id}`} className="group relative block h-full min-h-[240px] overflow-hidden bg-ink">
                <Img
                  src={CAT_IMAGES[c.id]}
                  alt={c.label}
                  loading="lazy"
                  className={`absolute inset-0 h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 ${c.id === "wafers" ? "bg-white object-contain p-6" : "object-cover"}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="font-display text-xl font-semibold text-cream">{t(`cat.${c.id}.label`, c.label)}</h3>
                  <p className="mt-1 text-sm text-cream/70">{t(`cat.${c.id}.note`, c.note)}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
const CAT_IMAGES: Record<string, string> = {
  flour: "/media/flour-special.jpg",
  biscuits: IMAGES.stillMilk,
  wafers: "/media/products/w-vanilla.png",
  chips: IMAGES.chipsTomato,
};

/* ---------------- Quality ---------------- */
function Quality() {
  const { t } = useI18n();
  return (
    <section className="bg-ink">
      <div className="mx-auto grid max-w-[1400px] items-center gap-14 px-5 py-24 md:px-10 md:py-32 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <span className="eyebrow">{t("home.quality.eyebrow", "Certified quality")}</span>
          <h2 className="display-2 mt-5 text-4xl !text-cream md:text-6xl">
            <Accent text={t("home.quality.title", "Fortified, tested, *certified.*")} tone="dark" />
          </h2>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-cream/70">
            {t(
              "home.quality.body",
              "Our wheat flour is fortified up to Vitamin B12 and carries the Institute of Ethiopian Standards mark. Every batch is tested in our own laboratory before it leaves the factory."
            )}
          </p>
          <div className="mt-9">
            <Btn to="/facility" variant="outline-cream" arrow>
              {t("cta.qualityProcess", "Our quality process")}
            </Btn>
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="border border-gold/30 bg-ink-soft/40 p-8 md:p-10">
            <SealCheck size={40} weight="duotone" className="text-gold" />
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-cream/50">{t("cert.authority", CERTIFICATE.authority)}</p>
            <h3 className="mt-2 font-display text-3xl font-semibold text-cream">{t("cert.title", CERTIFICATE.title)}</h3>
            <dl className="mt-6 space-y-3 border-t border-cream/10 pt-6 text-sm">
              {[
                [t("cert.lblProduct", "Product"), t("cert.product", CERTIFICATE.product)],
                [t("cert.lblStandard", "Standard"), CERTIFICATE.standard],
                [t("cert.lblLicense", "License"), CERTIFICATE.license],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-6">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-cream/50">{k}</dt>
                  <dd className="text-right font-mono text-cream/85">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Testimonials ---------------- */
function Trusted() {
  const { t } = useI18n();
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
        <Reveal>
          <span className="eyebrow">{t("home.trusted.eyebrow", "Trusted across Ethiopia")}</span>
        </Reveal>
        <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <TestimonialRotator />
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={0.1}>
              <Img
                src={IMAGES.lifeChipsGirl}
                alt="A customer enjoying Unic chips"
                loading="lazy"
                className="aspect-[4/5] w-full object-cover"
              />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Lifestyle ---------------- */
function Lifestyle() {
  const { t } = useI18n();
  const imgs = [IMAGES.proRange, IMAGES.proWaferFace, IMAGES.proBiscuitBite, IMAGES.proCrackers, IMAGES.proVanilla];
  return (
    <section className="bg-parchment">
      <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
        <Reveal>
          <h2 className="display-2 max-w-2xl text-4xl md:text-6xl">
            <Accent text={t("home.life.title", "From our factory to *your table.*")} />
          </h2>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {imgs.map((src, i) => (
            <Reveal key={src} delay={0.05 * i} className={i === 0 ? "col-span-2 row-span-2" : ""}>
              <div className="h-full overflow-hidden">
                <Img
                  src={src}
                  alt="Fikir Food Processing"
                  loading="lazy"
                  className={`w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 ${i === 0 ? "aspect-square md:h-full" : "aspect-square"}`}
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { t } = useI18n();
  usePageMeta(
    "FIKIR FOOD PROCESSING | Flour, Biscuits, Wafers & Chips, Ethiopia",
    "Fikir Food Processing makes fortified flour, Unic biscuits, wafers, and chips in Adama, Ethiopia. Over 15 years, 600+ employees, delivered nationwide."
  );
  return (
    <>
      <Hero />
      <MarqueeBand />
      <WhoWeAre />
      <ProcessJourney />
      <PackMarquee />
      <RangeIndex />
      <Quality />
      <Trusted />
      <Lifestyle />
      <CTABanner
        image={IMAGES.fleet}
        alt="The Fikir delivery fleet"
        title={t("home.cta.titleLead", "Stock Fikir, or")}
        titleAccent={t("home.cta.titleAccent", "just say hello.")}
        text={t("home.cta.text", "Whether you're a shop, a wholesaler, or a family with a question, we'd love to hear from you.")}
        primary={t("cta.getInTouch", "Get in touch")}
        primaryTo="/contact"
        secondary={t("cta.seeFacility", "See the facility")}
        secondaryTo="/facility"
      />
    </>
  );
}
