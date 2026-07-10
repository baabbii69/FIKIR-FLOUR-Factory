import { SealCheck, Handshake, Smiley, Flask, Leaf } from "@phosphor-icons/react";
import PageHero from "../components/PageHero";
import CTABanner from "../components/CTABanner";
import Reveal from "../components/Reveal";
import Btn from "../components/Btn";
import { usePageMeta } from "../lib/usePageMeta";
import { VALUES, WHY_US, CERTIFICATE, IMAGES } from "../data/site";
import { useI18n } from "../i18n/I18nProvider";
import { Accent } from "../i18n/Accent";

const VALUE_ICONS = { seal: SealCheck, handshake: Handshake, smiley: Smiley, flask: Flask, leaf: Leaf } as const;

export default function About() {
  usePageMeta(
    "About Us | FIKIR FOOD PROCESSING",
    "Fikir Food Processing: a trusted Ethiopian food manufacturer in Adama for over 15 years, built on quality, honesty, and trust."
  );
  const { t } = useI18n();

  return (
    <>
      <PageHero
        image={IMAGES.building}
        alt="The Fikir Food Processing headquarters in Adama"
        crumb={t("nav.about", "About Us")}
        title={t("about.hero.title", "Built on quality,")}
        titleAccent={t("about.hero.accent", "run on trust.")}
      />

      {/* Story */}
      <section className="bg-cream">
        <div className="mx-auto grid max-w-[1400px] gap-14 px-5 py-20 md:px-10 md:py-28 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <Reveal>
              <span className="eyebrow">{t("home.who.eyebrow", "Who we are")}</span>
              <h2 className="display-2 mt-5 text-4xl md:text-5xl">
                <Accent text={t("about.who.title", "Fikir means love. It's how we *make food.*")} />
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-8 max-w-[62ch] text-base leading-relaxed">
                {t(
                  "about.who.p1",
                  "Fikir Food Processing was established in 2004 (Ethiopian calendar) in Adama, in the Gara Lugo / Railway Station area. We are a legally registered Ethiopian manufacturer producing the highest-quality wheat flour in several grades, more than twelve kinds of sweet biscuits, cream wafers, and potato chips, all to national and international quality standards."
                )}
              </p>
              <p className="mt-5 max-w-[62ch] text-base leading-relaxed">
                {t(
                  "about.who.p2",
                  "Built on honesty, quality, and innovation, we've grown into a trusted name in the Ethiopian food industry, creating jobs for more than 600 people and delivering to every region of the country."
                )}
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="mt-10">
                <Btn to="/facility" variant="outline-ink" arrow>
                  {t("cta.seeFacility", "See our facility")}
                </Btn>
              </div>
            </Reveal>
          </div>

          <div className="relative lg:col-span-6">
            <Reveal className="relative z-0 lg:pl-8">
              <img
                src={IMAGES.lifeBiscuit}
                alt="A customer enjoying a Unic biscuit"
                loading="lazy"
                className="aspect-[4/5] w-full object-cover"
              />
            </Reveal>
            <Reveal delay={0.14} className="relative z-10">
              <div className="ml-auto -mt-16 w-fit max-w-[280px] bg-ink p-8 shadow-2xl shadow-ink/30 lg:-mt-24 lg:mr-8">
                <div className="font-display text-6xl font-semibold text-gold">600+</div>
                <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-cream/60">
                  {t("about.stat600", "Ethiopians employed")}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="bg-ink">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-20 md:px-10 md:py-24 md:grid-cols-2">
          <Reveal>
            <div className="h-full border-l-2 border-gold/60 pl-8">
              <span className="eyebrow">{t("about.vision.label", "Vision")}</span>
              <p className="mt-5 font-display text-2xl font-medium leading-snug text-cream md:text-3xl">
                {t("about.vision.text", "To be a leading food manufacturer in Ethiopia and Africa in quality and taste.")}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="h-full border-l-2 border-gold/60 pl-8">
              <span className="eyebrow">{t("about.mission.label", "Mission")}</span>
              <p className="mt-5 font-display text-2xl font-medium leading-snug text-cream md:text-3xl">
                {t("about.mission.text", "To give our customers superior quality at affordable prices, using modern technology.")}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="bg-parchment">
        <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28">
          <Reveal>
            <h2 className="display-2 max-w-2xl text-4xl md:text-5xl">{t("about.values.title", "The values behind every batch")}</h2>
          </Reveal>
          <div className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((v, i) => {
              const Icon = VALUE_ICONS[v.icon as keyof typeof VALUE_ICONS];
              return (
                <Reveal key={v.title} delay={0.05 * i}>
                  <div className="border-t border-linen pt-8">
                    <span className="flex h-12 w-12 items-center justify-center bg-gold/15 text-gold-deep">
                      <Icon size={24} weight="duotone" />
                    </span>
                    <h3 className="mt-5 font-display text-2xl font-semibold text-ink">{t(`value.${i}.title`, v.title)}</h3>
                    <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed">{t(`value.${i}.text`, v.text)}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Reveal>
                <span className="eyebrow">{t("about.why.eyebrow", "Why choose us")}</span>
                <h2 className="display-2 mt-5 text-4xl md:text-5xl">
                  <Accent text={t("about.why.title", "Reasons customers *stay with us.*")} />
                </h2>
              </Reveal>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <div className="grid gap-px border border-linen bg-linen sm:grid-cols-2">
                {WHY_US.map((w, i) => (
                  <Reveal key={w.title} delay={0.05 * i} className="h-full">
                    <div className="flex h-full min-h-[180px] flex-col justify-between bg-cream p-7">
                      <span className="font-display text-4xl font-semibold text-gold/50">0{i + 1}</span>
                      <div>
                        <h3 className="font-display text-xl font-semibold text-ink">{t(`why.${i}.title`, w.title)}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-clay/90">{t(`why.${i}.text`, w.text)}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certificate */}
      <section className="bg-parchment">
        <div className="mx-auto grid max-w-[1400px] items-center gap-14 px-5 py-20 md:px-10 md:py-28 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <Reveal>
              <span className="eyebrow">{t("about.cert.eyebrow", "Certified")}</span>
              <h2 className="display-2 mt-5 text-4xl md:text-5xl">
                <Accent text={t("about.cert.title", "The National Fortified Food mark, *earned.*")} />
              </h2>
              <p className="mt-6 max-w-[54ch] text-base leading-relaxed">{t("cert.note", CERTIFICATE.note)}</p>
            </Reveal>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal delay={0.1}>
              <div className="border border-linen bg-cream p-8 md:p-10">
                <SealCheck size={40} weight="duotone" className="text-gold-deep" />
                <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-clay/70">
                  {t("cert.authority", CERTIFICATE.authority)}
                </p>
                <h3 className="mt-2 font-display text-3xl font-semibold text-ink">{t("cert.title", CERTIFICATE.title)}</h3>
                <dl className="mt-6 space-y-3 border-t border-linen pt-6 text-sm">
                  {[
                    [t("cert.lblProduct", "Product"), t("cert.product", CERTIFICATE.product)],
                    [t("cert.lblStandard", "Standard"), CERTIFICATE.standard],
                    [t("cert.lblLicenseNo", "License no."), CERTIFICATE.license],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-6">
                      <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-clay/70">{k}</dt>
                      <dd className="text-right font-mono text-ink">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <CTABanner
        image={IMAGES.lifeMarket}
        alt="Hands holding a variety of Fikir products"
        title={t("about.cta.title", "Grow with")}
        titleAccent={t("about.cta.accent", "Fikir.")}
        text={t("about.cta.text", "Partner with a trusted Ethiopian manufacturer for reliable products and nationwide reach.")}
        primary={t("cta.talkToUs", "Talk to us")}
        primaryTo="/contact"
        secondary={t("cta.exploreProducts", "Explore products")}
        secondaryTo="/products"
      />
    </>
  );
}
