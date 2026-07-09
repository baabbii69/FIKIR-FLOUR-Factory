import { useRef } from "react";
import { Truck, MapPin, Package, CheckCircle, ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import PageHero from "../components/PageHero";
import CTABanner from "../components/CTABanner";
import Reveal from "../components/Reveal";
import { usePageMeta } from "../lib/usePageMeta";
import { QUALITY_STEPS, IMAGES } from "../data/site";

const GALLERY = [
  { src: IMAGES.silos, cap: "Grain storage silos" },
  { src: IMAGES.building, cap: "Our headquarters, Adama" },
  { src: IMAGES.fleetAlt, cap: "The delivery fleet" },
  { src: IMAGES.warehouse, cap: "Inside the warehouse" },
  { src: IMAGES.stillMilk, cap: "Unic biscuits" },
  { src: IMAGES.lifeChipsHand, cap: "Unic chips" },
  { src: IMAGES.signageHero, cap: "At the gate" },
  { src: IMAGES.stillTea, cap: "Made for tea time" },
];

function Gallery() {
  const ref = useRef<HTMLDivElement>(null);
  const nudge = (dir: number) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.85, 640), behavior: "smooth" });
  };
  return (
    <section className="overflow-hidden bg-parchment py-20 md:py-28">
      <div className="mx-auto flex max-w-[1400px] items-end justify-between gap-6 px-5 md:px-10">
        <Reveal>
          <span className="eyebrow">Inside Fikir</span>
          <h2 className="display-2 mt-5 text-4xl md:text-5xl">
            A look <em className="pb-1 leading-[1.1] text-gold-deep">around.</em>
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="hidden gap-2 md:flex">
            {[[-1, ArrowLeft], [1, ArrowRight]].map(([d, Icon]) => {
              const Ico = Icon as typeof ArrowLeft;
              return (
                <button
                  key={d as number}
                  onClick={() => nudge(d as number)}
                  aria-label={d === -1 ? "Scroll left" : "Scroll right"}
                  className="inline-flex h-12 w-12 items-center justify-center border border-ink/20 text-ink transition-colors hover:border-ink hover:bg-ink hover:text-cream"
                >
                  <Ico size={18} weight="bold" />
                </button>
              );
            })}
          </div>
        </Reveal>
      </div>

      <div
        ref={ref}
        className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 md:px-10 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {GALLERY.map((g, i) => (
          <figure
            key={g.cap}
            className={`group relative h-[320px] shrink-0 snap-start overflow-hidden sm:h-[440px] ${
              i % 3 === 0 ? "w-[82vw] sm:w-[540px]" : "w-[70vw] sm:w-[360px]"
            }`}
          >
            <img
              src={g.src}
              alt={g.cap}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
            <figcaption className="absolute inset-x-0 bottom-0 p-5 font-mono text-[10px] uppercase tracking-[0.2em] text-cream">
              {g.cap}
            </figcaption>
          </figure>
        ))}
        <div className="w-px shrink-0" aria-hidden />
      </div>
    </section>
  );
}

export default function Facility() {
  usePageMeta(
    "Facility & Distribution | FIKIR FOOD PROCESSING",
    "Inside the Fikir Food Processing plant in Adama: modern machinery, laboratory-tested quality, and nationwide distribution by our own fleet."
  );

  return (
    <>
      <PageHero
        image={IMAGES.silos}
        alt="Grain storage silos at the Fikir plant in Adama"
        crumb="Facility"
        title="Made in Adama,"
        titleAccent="delivered everywhere."
      />

      {/* Overview */}
      <section className="bg-cream">
        <div className="mx-auto grid max-w-[1400px] gap-14 px-5 py-20 md:px-10 md:py-28 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Reveal>
              <span className="eyebrow">The plant</span>
              <h2 className="display-2 mt-5 text-4xl md:text-5xl">
                Modern machinery, <em className="pb-1 leading-[1.1] text-gold-deep">real people.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-8 max-w-[58ch] text-base leading-relaxed">
                Our Adama plant runs on modern, imported machinery that meets world standards, from
                milling and fortification to baking, frying, and packing. Behind it stand more than
                600 skilled Ethiopians who make quality happen every shift.
              </p>
              <p className="mt-5 max-w-[58ch] text-base leading-relaxed">
                That mix of technology and craft is how we hold one standard across flour, biscuits,
                wafers, and chips.
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal delay={0.12}>
              <img
                src={IMAGES.warehouse}
                alt="Fikir products stacked in the warehouse"
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <Gallery />

      {/* Quality steps */}
      <section className="bg-ink">
        <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28">
          <Reveal>
            <span className="eyebrow">Quality control</span>
            <h2 className="display-2 mt-5 max-w-2xl text-4xl !text-cream md:text-5xl">
              Four checks between grain and <em className="pb-1 leading-[1.1] text-gold">shelf.</em>
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-px border border-cream/10 bg-cream/10 sm:grid-cols-2 lg:grid-cols-4">
            {QUALITY_STEPS.map((s, i) => (
              <Reveal key={s.step} delay={0.05 * i} className="h-full">
                <div className="flex h-full min-h-[260px] flex-col justify-between bg-ink p-8">
                  <span className="font-display text-5xl font-semibold text-gold/60">{s.step}</span>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-cream">{s.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-cream/65">{s.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Distribution */}
      <section id="distribution" className="bg-parchment">
        <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-6">
              <Reveal>
                <span className="eyebrow">Distribution</span>
                <h2 className="display-2 mt-5 text-4xl md:text-5xl">
                  Our own fleet, on the road <em className="pb-1 leading-[1.1] text-gold-deep">daily.</em>
                </h2>
                <p className="mt-6 max-w-[54ch] text-base leading-relaxed">
                  We distribute across every region of Ethiopia through a network of agents,
                  wholesalers, and retailers, supported by our own branded delivery fleet. That means
                  fresher products, on time, wherever you are.
                </p>
              </Reveal>
              <div className="mt-10 grid gap-px border border-linen bg-linen sm:grid-cols-3">
                {[
                  { Icon: Truck, label: "Own fleet", note: "Branded delivery trucks" },
                  { Icon: MapPin, label: "Nationwide", note: "All regions of Ethiopia" },
                  { Icon: Package, label: "Wholesale", note: "Agents & retailers" },
                ].map(({ Icon, label, note }, i) => (
                  <Reveal key={label} delay={0.05 * i} className="h-full">
                    <div className="flex h-full flex-col gap-3 bg-parchment p-6">
                      <Icon size={26} weight="duotone" className="text-gold-deep" />
                      <div>
                        <div className="font-display text-lg font-semibold text-ink">{label}</div>
                        <div className="mt-1 text-sm text-clay/80">{note}</div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
            <div className="lg:col-span-6">
              <Reveal delay={0.12}>
                <img
                  src={IMAGES.fleetAlt}
                  alt="Fikir Isuzu delivery trucks lined up at the plant"
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Future */}
      <section className="bg-leaf">
        <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28">
          <Reveal>
            <h2 className="display-2 max-w-2xl text-4xl !text-cream md:text-5xl">
              Where we're <em className="pb-1 leading-[1.1] text-gold-bright">headed.</em>
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-10 border-t border-cream/20 pt-12 md:grid-cols-3">
            {[
              "Increase our production capacity to serve more of Ethiopia.",
              "Introduce new, beneficial products with the tastes people prefer.",
              "Grow toward export markets beyond Ethiopia.",
            ].map((t, i) => (
              <Reveal key={t} delay={0.06 * i}>
                <CheckCircle size={28} weight="duotone" className="text-gold-bright" />
                <p className="mt-4 max-w-[38ch] text-lg leading-relaxed text-cream/85">{t}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTABanner
        image={IMAGES.lifeChipsHand}
        alt="A hand sharing Unic chips"
        title="Let's put Fikir on"
        titleAccent="your shelf."
        text="Reach out to become a distributor, place an order, or just ask a question."
        primary="Contact us"
        primaryTo="/contact"
      />
    </>
  );
}
