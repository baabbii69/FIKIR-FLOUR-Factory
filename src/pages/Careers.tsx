import { MapPin, Clock, Briefcase } from "@phosphor-icons/react";
import PageHero from "../components/PageHero";
import CTABanner from "../components/CTABanner";
import Reveal from "../components/Reveal";
import Btn from "../components/Btn";
import { usePageMeta } from "../lib/usePageMeta";
import { OPENINGS, VALUES, CONTACT, IMAGES } from "../data/site";
import { useI18n } from "../i18n/I18nProvider";
import { Accent } from "../i18n/Accent";

export default function Careers() {
  usePageMeta(
    "Careers | FIKIR FOOD PROCESSING",
    "Join Fikir Food Processing in Adama. Explore open positions and grow with a trusted Ethiopian manufacturer of over 600 people."
  );
  const { t } = useI18n();

  return (
    <>
      <PageHero
        image={IMAGES.warehouse}
        alt="The Fikir team at work"
        crumb={t("nav.careers", "Careers")}
        title={t("car.hero.title", "Grow your career")}
        titleAccent={t("car.hero.accent", "with us.")}
      />

      {/* Intro */}
      <section className="bg-cream">
        <div className="mx-auto grid max-w-[1400px] gap-14 px-5 py-20 md:px-10 md:py-28 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <Reveal>
              <span className="eyebrow">{t("car.intro.eyebrow", "Life at Fikir")}</span>
              <h2 className="display-2 mt-5 text-4xl md:text-5xl">
                <Accent text={t("car.intro.title", "Build a career at one of Adama's largest *employers.*")} />
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-8 max-w-[58ch] text-base leading-relaxed">
                {t(
                  "car.intro.body",
                  "Fikir Food Processing employs more than 600 Ethiopians across production, quality, sales, and logistics. We invest in our people with modern equipment, real responsibility, and room to grow, all while making products families trust."
                )}
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-6">
            <Reveal delay={0.12}>
              <img src={IMAGES.lifeBiscuit} alt="A member of the Fikir community" loading="lazy" className="aspect-[4/3] w-full object-cover" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Openings */}
      <section className="bg-parchment">
        <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28">
          <Reveal>
            <div className="flex items-baseline justify-between gap-4 border-b border-linen pb-6">
              <h2 className="display-2 text-4xl md:text-5xl">{t("car.openings.title", "Open positions")}</h2>
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-clay/70">
                {OPENINGS.length} {t("car.openings.count", "open")}
              </span>
            </div>
          </Reveal>

          {OPENINGS.length > 0 ? (
            <div className="mt-6 divide-y divide-linen border-b border-linen">
              {OPENINGS.map((o, i) => (
                <Reveal key={o.title} delay={0.04 * Math.min(i, 4)}>
                  <div className="group grid gap-4 py-8 md:grid-cols-12 md:items-center md:gap-8">
                    <div className="md:col-span-5">
                      <h3 className="font-display text-2xl font-semibold text-ink">{t(`open.${i}.title`, o.title)}</h3>
                      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11px] uppercase tracking-[0.14em] text-clay/70">
                        <span className="inline-flex items-center gap-1.5">
                          <Clock size={13} weight="bold" /> {t(`open.${i}.type`, o.type)}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin size={13} weight="bold" /> {t(`open.${i}.location`, o.location)}
                        </span>
                      </div>
                    </div>
                    <p className="text-[15px] leading-relaxed text-clay/90 md:col-span-5">{t(`open.${i}.note`, o.note)}</p>
                    <div className="md:col-span-2 md:text-right">
                      <Btn to="/contact" variant="outline-ink" className="!px-6">
                        {t("cta.apply", "Apply")}
                      </Btn>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal>
              <div className="mt-10 flex flex-col items-start gap-5 border border-linen bg-cream p-10">
                <Briefcase size={36} weight="duotone" className="text-gold-deep" />
                <p className="max-w-xl text-lg leading-relaxed text-ink">
                  {t(
                    "car.empty.text",
                    "There are no open positions right now, but we're always glad to meet talented people. Send us your CV and we'll reach out when a role opens."
                  )}
                </p>
                <Btn href={`mailto:${CONTACT.email}?subject=CV%20-%20Fikir%20Careers`} arrow>
                  {t("cta.sendCv", "Send your CV")}
                </Btn>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* Why work here */}
      <section className="bg-ink">
        <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28">
          <Reveal>
            <h2 className="display-2 max-w-2xl text-4xl !text-cream md:text-5xl">{t("car.values.title", "What we value in our team")}</h2>
          </Reveal>
          <div className="mt-12 grid gap-10 border-t border-cream/15 pt-12 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.slice(0, 3).map((v, i) => (
              <Reveal key={v.title} delay={0.06 * i}>
                <span className="font-display text-4xl font-semibold text-gold">0{i + 1}</span>
                <h3 className="mt-4 font-display text-2xl font-semibold text-cream">{t(`value.${i}.title`, v.title)}</h3>
                <p className="mt-3 max-w-[42ch] text-[15px] leading-relaxed text-cream/65">{t(`value.${i}.text`, v.text)}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTABanner
        image={IMAGES.fleetAlt}
        alt="The Fikir team and fleet"
        title={t("car.cta.title", "Don't see the right")}
        titleAccent={t("car.cta.accent", "role?")}
        text={t("car.cta.text", "We're growing fast. Send your CV and tell us what you do best, we'll keep you in mind.")}
        primary={t("cta.sendCv", "Send your CV")}
        primaryTo="/contact"
      />
    </>
  );
}
