import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, Drop, Wind, Recycle } from "@phosphor-icons/react";
import PageHero from "../components/PageHero";
import CTABanner from "../components/CTABanner";
import Reveal from "../components/Reveal";
import { usePageMeta } from "../lib/usePageMeta";
import { PROCESS, IMAGES } from "../data/site";

export default function Factory() {
  usePageMeta(
    "Our Factory | FIKIR FOOD PROCESSING",
    "Inside the Adama facility: 48 acres, six milling lines, a 14-stage process, and a sustainability roadmap to 2030."
  );

  return (
    <>
      <PageHero
        image={IMAGES.millInterior}
        alt="Interior of the FIKIR FOOD PROCESSING roller milling hall"
        crumb="Our Factory"
        title="Where wheat becomes"
        titleAccent="certainty."
      />
      <Overview />
      <Gallery />
      <ProcessTabs />
      <Sustainability />
      <CTABanner
        image={IMAGES.wheatHarvest}
        alt="Combine harvester working a wheat field at dusk"
        title="See it with your"
        titleAccent="own eyes."
        text="We host client visits every month. Walk the mill floor, meet the lab team, and taste bread baked from the morning's run."
        primary="Book a visit"
        primaryTo="/contact"
      />
    </>
  );
}

/* ---------------- Overview ---------------- */

const FACILITY_TILES = [
  { value: "48", unit: "acres", label: "Production campus" },
  { value: "6", unit: "lines", label: "Independent milling lines" },
  { value: "24/7", unit: "", label: "Continuous operation" },
  { value: "480", unit: "people", label: "Skilled employees" },
];

function Overview() {
  return (
    <section className="bg-cream">
      <div className="mx-auto grid max-w-[1400px] gap-14 px-5 py-20 md:px-10 md:py-28 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <Reveal>
            <span className="eyebrow">The facility</span>
            <h2 className="display-2 mt-5 text-4xl md:text-5xl">
              A campus built around one{" "}
              <em className="pb-1 leading-[1.1] text-gold-deep">obsession.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-[58ch] text-base leading-relaxed">
              Our Adama facility runs six independent milling lines around the clock, fed by
              silos holding 45,000 tons of wheat. Independence between lines means a
              specialty run never interrupts a bulk contract, and an upgrade never stops
              production.
            </p>
            <p className="mt-5 max-w-[58ch] text-base leading-relaxed">
              The 2024 Phase III expansion added a sixth line, a second packing hall, and an
              automated warehouse, bringing daily capacity to 2,400 metric tons.
            </p>
          </Reveal>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <div className="grid gap-px border border-linen bg-linen sm:grid-cols-2">
            {FACILITY_TILES.map((t, i) => (
              <Reveal key={t.label} delay={0.05 * i} className="h-full">
                <div className="flex h-full min-h-[190px] flex-col justify-between bg-parchment p-8">
                  <div className="font-display text-5xl font-semibold text-ink">
                    {t.value}
                    {t.unit && (
                      <span className="ml-2 font-mono text-sm font-normal tracking-[0.14em] text-gold-deep">
                        {t.unit}
                      </span>
                    )}
                  </div>
                  <div className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-clay/80">
                    {t.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Gallery (asymmetric) ---------------- */

/* Spans fill every 12-col row completely: 7+5 / 7+5 / 6+6, no grid holes. */
const GALLERY = [
  {
    src: IMAGES.millInterior,
    alt: "Roller mill hall with stainless milling stands",
    span: "md:col-span-7 md:row-span-2",
    fill: true,
  },
  {
    src: "https://picsum.photos/seed/fikir-silos/1200/900",
    alt: "Wheat storage silos at dawn",
    span: "md:col-span-5",
  },
  { src: IMAGES.milling, alt: "Milling equipment in operation", span: "md:col-span-5" },
  {
    src: "https://picsum.photos/seed/fikir-packhall/1200/900",
    alt: "Automated packing hall",
    span: "md:col-span-6",
  },
  {
    src: IMAGES.flourPour,
    alt: "Finished flour being sampled for testing",
    span: "md:col-span-6",
  },
];

function Gallery() {
  return (
    <section className="bg-parchment">
      <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28">
        <Reveal>
          <h2 className="display-2 max-w-2xl text-4xl md:text-5xl">Inside the mill</h2>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-12">
          {GALLERY.map((g, i) => (
            <Reveal key={g.alt} delay={0.05 * i} className={g.span}>
              <div className="group h-full overflow-hidden">
                <img
                  src={g.src}
                  alt={g.alt}
                  loading="lazy"
                  className={`w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 ${
                    g.fill ? "aspect-[4/3] h-full md:aspect-auto" : "aspect-[4/3]"
                  }`}
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Process tabs ---------------- */

function ProcessTabs() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const step = PROCESS[active];

  return (
    <section className="bg-ink">
      <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28">
        <Reveal>
          <span className="eyebrow">Process, in depth</span>
          <h2 className="display-2 mt-5 max-w-2xl text-4xl !text-cream md:text-5xl">
            Fourteen stages, five{" "}
            <em className="pb-1 leading-[1.1] text-gold">movements.</em>
          </h2>
        </Reveal>

        <div
          role="tablist"
          aria-label="Milling process stages"
          className="mt-12 flex gap-2 overflow-x-auto border-b border-cream/15 pb-px"
        >
          {PROCESS.map((p, i) => {
            const selected = i === active;
            return (
              <button
                key={p.step}
                role="tab"
                aria-selected={selected}
                onClick={() => setActive(i)}
                className={`relative shrink-0 px-5 py-4 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors duration-300 ${
                  selected ? "text-gold" : "text-cream/50 hover:text-cream"
                }`}
              >
                <span className="mr-2 text-cream/40">0{i + 1}</span>
                {p.step}
                {selected && (
                  <motion.span
                    layoutId={reduce ? undefined : "process-tab-underline"}
                    className="absolute inset-x-0 -bottom-px h-0.5 bg-gold"
                  />
                )}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 grid gap-10 lg:grid-cols-12"
          >
            <div className="lg:col-span-5">
              <h3 className="font-display text-3xl font-semibold text-cream md:text-4xl">
                {step.title}
              </h3>
              <p className="mt-5 max-w-[56ch] text-[15px] leading-relaxed text-cream/70">
                {step.text}
              </p>
              <ul className="mt-8 space-y-4">
                {step.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-3 text-[15px] text-cream/80">
                    <Check size={18} weight="bold" className="mt-0.5 shrink-0 text-gold" />
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <img
                src={step.image}
                alt={step.title}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ---------------- Sustainability ---------------- */

const SUSTAIN = [
  {
    icon: Drop,
    value: "31%",
    label: "Less water per ton",
    text: "Closed-loop tempering systems recover and reuse process water across all six lines.",
  },
  {
    icon: Wind,
    value: "24%",
    label: "Lower CO2 emissions",
    text: "Heat recovery and high-efficiency motors cut emissions per ton over the last decade.",
  },
  {
    icon: Recycle,
    value: "98%",
    label: "Waste diverted from landfill",
    text: "Bran, germ, and screenings become animal feed; packaging waste is recycled on site.",
  },
];

function Sustainability() {
  return (
    <section className="relative overflow-hidden bg-leaf">
      <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <h2 className="display-2 max-w-xl text-4xl !text-cream md:text-5xl">
              Milling lightly on the{" "}
              <em className="pb-1 leading-[1.1] text-gold-bright">land.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="max-w-sm text-[15px] leading-relaxed text-cream/75">
              Our 2030 roadmap targets fully renewable energy across the campus. Here is
              where the last decade got us.
            </p>
          </Reveal>
        </div>
        <div className="mt-14 grid gap-10 border-t border-cream/20 pt-12 md:grid-cols-3">
          {SUSTAIN.map((s, i) => (
            <Reveal key={s.label} delay={0.06 * i}>
              <s.icon size={30} weight="duotone" className="text-gold-bright" />
              <div className="mt-6 font-display text-6xl font-semibold text-cream md:text-7xl">
                {s.value}
              </div>
              <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-cream/70">
                {s.label}
              </div>
              <p className="mt-4 max-w-[42ch] text-sm leading-relaxed text-cream/75">{s.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
