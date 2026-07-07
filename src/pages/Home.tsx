import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, SealCheck } from "@phosphor-icons/react";
import { usePageMeta } from "../lib/usePageMeta";
import { STATS, PRODUCTS, CERTIFICATIONS, IMAGES } from "../data/site";
import Btn from "../components/Btn";
import Reveal from "../components/Reveal";
import Stat from "../components/Stat";
import FlourDust from "../components/FlourDust";
import ProcessPan from "../components/ProcessPan";
import TestimonialRotator from "../components/TestimonialRotator";
import CTABanner from "../components/CTABanner";

gsap.registerPlugin(ScrollTrigger);

const EASE = [0.16, 1, 0.3, 1] as const;

/* ---------------- Hero (unchanged) ---------------- */

function Hero() {
  const reduce = useReducedMotion();
  const item = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 32 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay, ease: EASE },
  });

  return (
    <section className="relative flex min-h-[100dvh] items-center overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <img
          src={IMAGES.heroWheat}
          alt="Golden wheat field at harvest near Adama"
          className="kenburns h-full w-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/45 to-ink/15" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink/70 to-transparent" />
      </div>
      <FlourDust />

      <div className="relative mx-auto w-full max-w-[1400px] px-5 pt-24 md:px-10">
        <motion.span className="eyebrow" {...item(0.1)}>
          Adama, Ethiopia · Since 1962
        </motion.span>
        <motion.h1
          className="display-1 mt-6 max-w-3xl text-6xl !text-cream sm:text-7xl lg:text-8xl"
          {...item(0.22)}
        >
          From grain to{" "}
          <em className="inline-block pb-2 leading-[1.1] text-gold">greatness.</em>
        </motion.h1>
        <motion.p
          className="mt-7 max-w-xl text-lg leading-relaxed text-cream/80"
          {...item(0.36)}
        >
          2,400 metric tons of premium flour milled daily in Adama, supplying bakeries and
          manufacturers across 38 countries.
        </motion.p>
        <motion.div className="mt-10 flex flex-col gap-4 sm:flex-row" {...item(0.48)}>
          <Btn to="/products" arrow>
            Explore products
          </Btn>
          <Btn to="/about" variant="outline-cream">
            Our story
          </Btn>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- Marquee band ---------------- */

const MARQUEE = [
  "Est. 1962",
  "Adama, Ethiopia",
  "2,400 MT milled daily",
  "ISO 22000 certified",
  "38 export markets",
  "From grain to greatness",
];

function MarqueeBand() {
  const strip = (hidden: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      className="animate-marquee flex shrink-0 items-center"
    >
      {MARQUEE.map((m) => (
        <li
          key={m}
          className="flex shrink-0 items-center whitespace-nowrap font-display text-3xl font-medium text-cream/85 md:text-4xl"
        >
          <span className="px-8 md:px-12">{m}</span>
          <span className="text-2xl text-gold" aria-hidden>
            &middot;
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <section
      aria-label="FIKIR FLOUR at a glance"
      className="overflow-hidden border-t border-cream/10 bg-ink py-7 md:py-9"
    >
      <div className="flex w-max">
        {strip(false)}
        {strip(true)}
      </div>
    </section>
  );
}

/* ---------------- Manifesto: scroll-scrubbed word reveal ---------------- */

const MANIFESTO: { t: string; gold?: boolean }[] =
  `Flour looks simple. It is not. Four numbers decide whether a bakery's morning succeeds: protein, moisture, ash, granulation. For six decades we have measured, milled, and |perfected| those numbers, so 850 clients in 38 countries never have to think about them.`
    .split(" ")
    .map((w) =>
      w.startsWith("|") && w.endsWith("|")
        ? { t: w.slice(1, -1), gold: true }
        : { t: w },
    );

function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const words = el.querySelectorAll<HTMLElement>("[data-w]");
      gsap.fromTo(
        words,
        { opacity: 0.14 },
        {
          opacity: 1,
          stagger: 0.04,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top 78%",
            end: "bottom 58%",
            scrub: 0.8,
          },
        },
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36">
        <div ref={ref}>
          <p className="display-2 max-w-5xl text-3xl leading-[1.2] md:text-5xl md:leading-[1.18]">
            {MANIFESTO.map((w, i) => (
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
            Our story
            <ArrowRight
              size={13}
              weight="bold"
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </Reveal>

        <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-linen pt-12 md:mt-20 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.07}>
              <Stat {...s} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- The flour index: hover-preview product list ---------------- */

const INDEX_SLUGS = ["all-purpose", "bread", "tipo-00", "whole-wheat", "semolina", "custom"];

function FlourIndex() {
  const items = INDEX_SLUGS.map((s) => PRODUCTS.find((p) => p.slug === s)!);
  const [active, setActive] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 200, damping: 26, mass: 0.7 });
  const sy = useSpring(my, { stiffness: 200, damping: 26, mass: 0.7 });

  const onMove = (e: React.MouseEvent) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(e.clientX - rect.left + 36);
    my.set(e.clientY - rect.top - 120);
  };

  return (
    <section className="bg-parchment">
      <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <span className="eyebrow">The flour index</span>
            <h2 className="display-2 mt-5 max-w-xl text-4xl md:text-5xl">
              Nine flours, milled to a{" "}
              <em className="pb-1 leading-[1.1] text-gold-deep">number.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <Link
              to="/products"
              className="group inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-gold-deep transition-colors duration-300 hover:text-ink"
            >
              See the full range
              <ArrowRight
                size={13}
                weight="bold"
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </Reveal>
        </div>

        <div
          ref={wrapRef}
          onMouseMove={reduce ? undefined : onMove}
          className="relative mt-14 border-b border-linen"
        >
          {items.map((p, i) => (
            <Reveal key={p.slug} delay={0.04 * Math.min(i, 4)}>
              <Link
                to={p.slug === "custom" ? "/products?cat=custom" : "/products"}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                className="group flex items-center gap-5 border-t border-linen py-6 md:gap-8 md:py-8"
              >
                <span className="w-7 shrink-0 font-mono text-[11px] tabular-nums text-clay/60">
                  0{i + 1}
                </span>
                <img
                  src={p.image}
                  alt=""
                  loading="lazy"
                  className="h-14 w-20 shrink-0 object-cover lg:hidden"
                />
                <h3 className="font-display text-2xl font-semibold leading-tight text-ink transition-[transform,color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 group-hover:text-gold-deep md:text-4xl">
                  {p.name}
                </h3>
                <span className="ml-auto hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-clay/70 md:block">
                  {p.categoryLabel}
                </span>
                <span className="hidden w-40 shrink-0 text-right font-mono text-sm tabular-nums text-clay/85 lg:block">
                  {p.specs[0].label} {p.specs[0].value}
                </span>
                <ArrowRight
                  size={18}
                  weight="bold"
                  className="shrink-0 -translate-x-2 text-gold opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                />
              </Link>
            </Reveal>
          ))}

          {/* Floating cursor preview, desktop pointer only */}
          {!reduce && (
            <motion.div
              aria-hidden
              style={{ x: sx, y: sy }}
              className="pointer-events-none absolute left-0 top-0 z-10 hidden lg:block"
            >
              <motion.div
                animate={{
                  opacity: active !== null ? 1 : 0,
                  scale: active !== null ? 1 : 0.92,
                }}
                transition={{ duration: 0.3, ease: EASE }}
                className="relative h-[230px] w-[320px] overflow-hidden shadow-2xl shadow-ink/30"
              >
                {items.map((p, i) => (
                  <img
                    key={p.slug}
                    src={p.image}
                    alt=""
                    loading="lazy"
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                      active === i ? "opacity-100" : "opacity-0"
                    }`}
                  />
                ))}
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Trust: rotating quote + certifications ---------------- */

function Trust() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
        <Reveal>
          <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-gold-deep">
            Trusted across the industry
          </h2>
        </Reveal>
        <div className="mt-10">
          <TestimonialRotator />
        </div>

        <Reveal delay={0.1}>
          <div className="mt-16 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-linen pt-10 md:mt-20">
            {CERTIFICATIONS.map((c) => (
              <span
                key={c.name}
                className="inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-clay/80"
              >
                <SealCheck size={18} weight="duotone" className="text-gold-deep" />
                {c.name}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Page ---------------- */

export default function Home() {
  usePageMeta(
    "FIKIR FLOUR Factory | Premium Flour Manufacturing, Ethiopia",
    "2,400 metric tons of premium flour milled daily in Adama, Ethiopia. ISO 22000 certified, exporting to 38 countries since 1962.",
  );

  return (
    <>
      <Hero />
      <MarqueeBand />
      <Manifesto />
      <FlourIndex />
      <ProcessPan />
      <Trust />
      <CTABanner
        image={IMAGES.flourPour}
        alt="Flour pouring through milling machinery"
        title="Ready to partner with"
        titleAccent="FIKIR FLOUR?"
        text="Whether you need 5 tons or 500 tons per month, our team will build a reliable, cost-effective supply agreement with you."
        primary="Request a quote"
        primaryTo="/contact"
        secondary="Tour our factory"
        secondaryTo="/factory"
      />
    </>
  );
}
