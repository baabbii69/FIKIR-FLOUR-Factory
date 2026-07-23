import { Truck, MapPin, Package, CheckCircle, ArrowUpRight } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import CTABanner from "../components/CTABanner";
import Reveal from "../components/Reveal";
import { usePageMeta } from "../lib/usePageMeta";
import { QUALITY_STEPS, IMAGES, FEATURE_VIDEO } from "../data/site";
import { getGalleryTeaser } from "../content";
import VideoBlock from "../components/VideoBlock";
import { useI18n } from "../i18n/I18nProvider";
import { Accent } from "../i18n/Accent";

/** Teaser bento: a few featured shots that lead into the full /gallery page. */
function Gallery() {
  const { t } = useI18n();
  const shots = getGalleryTeaser(5);
  const [feature, ...rest] = shots;
  if (!feature) return null;

  return (
    <section className="bg-parchment py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="eyebrow">{t("fac.gallery.eyebrow", "Inside Fikir")}</span>
              <h2 className="display-2 mt-5 text-4xl md:text-5xl">
                <Accent text={t("fac.gallery.title", "A look *around.*")} />
              </h2>
            </div>
            <Link
              to="/gallery"
              className="group inline-flex items-center gap-2 self-start border border-ink/20 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-cream sm:self-auto"
            >
              {t("fac.gallery.viewAll", "View full gallery")}
              <ArrowUpRight size={15} weight="bold" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12 grid grid-cols-2 gap-3 md:h-[480px] md:grid-cols-4 md:grid-rows-2">
            {[feature, ...rest].map((g, i) => (
              <Link
                key={g.src}
                to="/gallery"
                aria-label={t("fac.gallery.viewAll", "View full gallery")}
                className={`group relative overflow-hidden bg-linen ${
                  i === 0 ? "col-span-2 aspect-square md:col-span-2 md:row-span-2 md:aspect-auto" : "aspect-square md:aspect-auto"
                }`}
              >
                <img
                  src={g.src}
                  alt={g.caption}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
                <figcaption className="absolute inset-x-0 bottom-0 p-4 font-mono text-[10px] uppercase tracking-[0.18em] text-cream md:p-5">
                  {g.caption}
                </figcaption>
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const DIST = [
  { Icon: Truck, lk: "fac.dist.ownFleet", label: "Own fleet", nk: "fac.dist.ownFleetNote", note: "Branded delivery trucks" },
  { Icon: MapPin, lk: "fac.dist.nationwide", label: "Nationwide", nk: "fac.dist.nationwideNote", note: "All regions of Ethiopia" },
  { Icon: Package, lk: "fac.dist.wholesale", label: "Wholesale", nk: "fac.dist.wholesaleNote", note: "Agents & retailers" },
];

const FUTURE = [
  { tk: "fac.future.1", en: "Increase our production capacity to serve more of Ethiopia." },
  { tk: "fac.future.2", en: "Introduce new, beneficial products with the tastes people prefer." },
  { tk: "fac.future.3", en: "Grow toward export markets beyond Ethiopia." },
];

export default function Facility() {
  usePageMeta(
    "Facility & Distribution | FIKIR FOOD PROCESSING",
    "Inside the Fikir Food Processing plant in Adama: modern machinery, laboratory-tested quality, and nationwide distribution by our own fleet."
  );
  const { t } = useI18n();

  return (
    <>
      <PageHero
        image={IMAGES.silos}
        alt="Grain storage silos at the Fikir plant in Adama"
        crumb={t("nav.facility", "Facility")}
        title={t("fac.hero.title", "Made in Adama,")}
        titleAccent={t("fac.hero.accent", "delivered everywhere.")}
      />

      {/* Overview */}
      <section className="bg-cream">
        <div className="mx-auto grid max-w-[1400px] gap-14 px-5 py-20 md:px-10 md:py-28 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Reveal>
              <span className="eyebrow">{t("fac.overview.eyebrow", "The plant")}</span>
              <h2 className="display-2 mt-5 text-4xl md:text-5xl">
                <Accent text={t("fac.overview.title", "Modern machinery, *real people.*")} />
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-8 max-w-[58ch] text-base leading-relaxed">
                {t(
                  "fac.overview.p1",
                  "Our Adama plant runs on modern, imported machinery that meets world standards, from milling and fortification to baking, frying, and packing. Behind it stand more than 600 skilled Ethiopians who make quality happen every shift."
                )}
              </p>
              <p className="mt-5 max-w-[58ch] text-base leading-relaxed">
                {t("fac.overview.p2", "That mix of technology and craft is how we hold one standard across flour, biscuits, wafers, and chips.")}
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal delay={0.12}>
              {FEATURE_VIDEO ? (
                <VideoBlock source={{ ...FEATURE_VIDEO, poster: FEATURE_VIDEO.poster ?? IMAGES.facMill1 }} aspect="4/3" />
              ) : (
                <img
                  src={IMAGES.facMill2}
                  alt="The flour milling line at the Fikir plant"
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
              )}
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
            <span className="eyebrow">{t("fac.qc.eyebrow", "Quality control")}</span>
            <h2 className="display-2 mt-5 max-w-2xl text-4xl !text-cream md:text-5xl">
              <Accent text={t("fac.qc.title", "Four checks between grain and *shelf.*")} tone="dark" />
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-px border border-cream/10 bg-cream/10 sm:grid-cols-2 lg:grid-cols-4">
            {QUALITY_STEPS.map((s, i) => (
              <Reveal key={s.step} delay={0.05 * i} className="h-full">
                <div className="flex h-full min-h-[260px] flex-col justify-between bg-ink p-8">
                  <span className="font-display text-5xl font-semibold text-gold/60">{s.step}</span>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-cream">{t(`qc.${i}.title`, s.title)}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-cream/65">{t(`qc.${i}.text`, s.text)}</p>
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
                <span className="eyebrow">{t("fac.dist.eyebrow", "Distribution")}</span>
                <h2 className="display-2 mt-5 text-4xl md:text-5xl">
                  <Accent text={t("fac.dist.title", "Our own fleet, on the road *daily.*")} />
                </h2>
                <p className="mt-6 max-w-[54ch] text-base leading-relaxed">
                  {t(
                    "fac.dist.body",
                    "We distribute across every region of Ethiopia through a network of agents, wholesalers, and retailers, supported by our own branded delivery fleet. That means fresher products, on time, wherever you are."
                  )}
                </p>
              </Reveal>
              <div className="mt-10 grid gap-px border border-linen bg-linen sm:grid-cols-3">
                {DIST.map(({ Icon, lk, label, nk, note }, i) => (
                  <Reveal key={lk} delay={0.05 * i} className="h-full">
                    <div className="flex h-full flex-col gap-3 bg-parchment p-6">
                      <Icon size={26} weight="duotone" className="text-gold-deep" />
                      <div>
                        <div className="font-display text-lg font-semibold text-ink">{t(lk, label)}</div>
                        <div className="mt-1 text-sm text-clay/80">{t(nk, note)}</div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
            <div className="lg:col-span-6">
              <Reveal delay={0.12}>
                <img
                  src={IMAGES.facTrucks}
                  alt="Fikir branded delivery trucks at the plant"
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
              <Accent text={t("fac.future.title", "Where we're *headed.*")} tone="dark" />
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-10 border-t border-cream/20 pt-12 md:grid-cols-3">
            {FUTURE.map((f, i) => (
              <Reveal key={f.tk} delay={0.06 * i}>
                <CheckCircle size={28} weight="duotone" className="text-gold-bright" />
                <p className="mt-4 max-w-[38ch] text-lg leading-relaxed text-cream/85">{t(f.tk, f.en)}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTABanner
        image={IMAGES.lifeChipsHand}
        alt="A hand sharing Unic chips"
        title={t("fac.cta.title", "Let's put Fikir on")}
        titleAccent={t("fac.cta.accent", "your shelf.")}
        text={t("fac.cta.text", "Reach out to become a distributor, place an order, or just ask a question.")}
        primary={t("cta.contactUs", "Contact us")}
        primaryTo="/contact"
      />
    </>
  );
}
