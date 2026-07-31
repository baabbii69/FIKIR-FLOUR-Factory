import { SealCheck, Handshake, Smiley, Flask, Leaf, TrendUp, UsersThree } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import PageHero from "../components/PageHero";
import CTABanner from "../components/CTABanner";
import Reveal from "../components/Reveal";
import Btn from "../components/Btn";
import Img from "../components/Img";
import CertRotator from "../components/CertRotator";
import { usePageMeta } from "../lib/usePageMeta";
import { VALUES, WHY_US, CERTIFICATE, COMPANY, MILESTONES, AWARDS, STAFF_TRAINING, IMAGES } from "../data/site";
import type { AwardGroup } from "../data/site";
import { useI18n } from "../i18n/I18nProvider";
import { Accent } from "../i18n/Accent";

const VALUE_ICONS = {
  seal: SealCheck,
  handshake: Handshake,
  smiley: Smiley,
  flask: Flask,
  leaf: Leaf,
  trend: TrendUp,
  users: UsersThree,
} as const;

const EASE = [0.16, 1, 0.3, 1] as const;

export default function About() {
  usePageMeta(
    "About Us | FIKIR FOOD PROCESSING",
    "Fikir Food Processing: a trusted Ethiopian food manufacturer in Adama for over 15 years, built on quality, honesty, and trust."
  );
  const { t } = useI18n();

  return (
    <>
      <PageHero
        image={IMAGES.wheatFarming}
        alt="Combine harvesters bringing in the wheat harvest"
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
                  "Fikir Food Processing was founded in 2011 in Adama, taking its name from the Amharic word for love. From our base on the Adama corridor we entered the wheat flour market at a time when demand for reliable, locally made staples was accelerating, and we have been building on that ever since."
                )}
              </p>
              <p className="mt-5 max-w-[62ch] text-base leading-relaxed">
                {t(
                  "about.who.p2",
                  "Today we are a legally registered Ethiopian manufacturer producing three grades of wheat flour, more than a dozen kinds of sweet biscuit, and a range of cream wafers, all to national and international quality standards, with a workforce of 1,026 people."
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
              <figure>
                <Img
                  src={IMAGES.factoryAerial}
                  alt="The Fikir Food Processing plant, silos and warehouses seen from the air"
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
                <figcaption className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-clay/70 lg:pl-8">
                  {t("about.plantCaption", "The plant in Adama, from above")}
                </figcaption>
              </figure>
            </Reveal>
            <Reveal delay={0.14} className="relative z-10">
              <div className="ml-auto -mt-12 w-fit max-w-[280px] bg-ink p-8 shadow-2xl shadow-ink/30 lg:-mt-20 lg:mr-8">
                <div className="font-display text-6xl font-semibold text-gold">1,026</div>
                <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-cream/60">
                  {t("about.statEmployed", "Ethiopians employed")}
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
                {t(
                  "about.vision.text",
                  "To be the leading food manufacturer in Ethiopia and Africa, renowned for exceptional quality and taste."
                )}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="h-full border-l-2 border-gold/60 pl-8">
              <span className="eyebrow">{t("about.mission.label", "Mission")}</span>
              <p className="mt-5 font-display text-2xl font-medium leading-snug text-cream md:text-3xl">
                {t(
                  "about.mission.text",
                  "To supply high-quality food products using modern technology, delivering superior quality at affordable prices."
                )}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <Founder />
      <Recognition />
      <Values />
      <People />
      <WhyUs />

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
            <Reveal delay={0.12}>
              <Img
                src={IMAGES.certificates}
                alt="Fikir's certifications, standards, and awards on display"
                loading="lazy"
                className="mt-8 aspect-[16/10] w-full object-cover"
              />
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
        image={IMAGES.proRange}
        alt="The full range of Unic biscuits and wafers held in both hands"
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

/* ---------------- Founder ---------------- */

function Founder() {
  const { t } = useI18n();
  const reduce = useReducedMotion();

  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Portrait */}
          <motion.figure
            className="lg:col-span-5"
            initial={reduce ? false : { opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, ease: EASE }}
          >
            <div className="group relative overflow-hidden">
              <Img
                src={IMAGES.ceo}
                alt={`${COMPANY.ceo}, founder and Chief Executive Officer of Fikir Food Processing`}
                loading="lazy"
                /* The source is 16:9 interview framing with him at ~61% of the
                   width, so a centred crop pushes him off to the right. Square
                   keeps a substantial portrait while balancing the text column,
                   and 75% horizontal focus lands him dead centre. */
                style={{ objectPosition: "75% center" }}
                className="aspect-square w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
              />
            </div>
            <figcaption className="mt-4 flex items-baseline gap-3">
              <span className="h-px w-8 shrink-0 bg-gold" aria-hidden />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-clay/70">
                {COMPANY.ceo} · {t("about.ceoRole", "Chief Executive Officer")}
              </span>
            </figcaption>
          </motion.figure>

          {/* Story */}
          <div className="flex flex-col justify-center lg:col-span-7">
            <Reveal>
              <h2 className="display-2 text-4xl md:text-5xl">
                <Accent
                  text={t("about.founder.title", "A work ethic he *inherited, not learned.*")}
                />
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-8 max-w-[60ch] text-base leading-relaxed">
                {t(
                  "about.founder.p1",
                  "Ato Fikru Garedew left school after grade twelve. What he carried instead was the working discipline he grew up with, learned from his father, and it is the thing he still credits for everything that followed."
                )}
              </p>
              <p className="mt-5 max-w-[60ch] text-base leading-relaxed">
                {t(
                  "about.founder.p2",
                  "He began on a small plot in Adama milling 420 quintals of flour a day. That figure is now 1,920, and the same plant turns out more than a dozen Unic biscuits and a full range of cream wafers alongside it. The flour that started everything still feeds the biscuit lines."
                )}
              </p>
            </Reveal>

            {/* Growth arc */}
            <Reveal delay={0.16}>
              <ol className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-linen pt-8 lg:grid-cols-4">
                {MILESTONES.map((m, i) => (
                  <li key={m.year} className="group relative">
                    <span
                      aria-hidden
                      className="absolute -top-8 left-0 h-[3px] w-0 bg-gold transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full"
                    />
                    <div className="font-display text-3xl font-semibold text-ink">
                      {t(`ms.${i}.year`, m.year)}
                    </div>
                    <div className="mt-2 font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-clay/75">
                      {t(`ms.${i}.title`, m.title)}
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Recognition ---------------- */

const AWARD_GROUPS: { id: AwardGroup; label: string; en: string }[] = [
  { id: "tax", label: "about.awards.g1", en: "Public recognition" },
  { id: "partners", label: "about.awards.g2", en: "Partners & community" },
  { id: "press", label: "about.awards.g3", en: "In the press" },
];

function Recognition() {
  const { t } = useI18n();
  const reduce = useReducedMotion();

  return (
    <section className="bg-ink">
      <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Heading + trophy shelf */}
          <div className="lg:col-span-5">
            <Reveal>
              <h2 className="display-2 text-4xl !text-cream md:text-5xl">
                <Accent
                  text={t("about.awards.title", "Recognised by *those we work with.*")}
                  tone="dark"
                />
              </h2>
              <p className="mt-6 max-w-[48ch] text-base leading-relaxed text-cream/70">
                {t(
                  "about.awards.body",
                  "Licences, certificates and awards gathered over the years from the city of Adama, the standards institute, and the institutions we work alongside. The awards were received by our founder on the company's behalf."
                )}
              </p>
            </Reveal>
            <motion.div
              className="mt-10"
              initial={reduce ? false : { opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.85, ease: EASE }}
            >
              <CertRotator />
            </motion.div>
          </div>

          {/* Grouped list */}
          <div className="lg:col-span-7">
            {AWARD_GROUPS.map((g, gi) => {
              const items = AWARDS.filter((a) => a.group === g.id);
              if (items.length === 0) return null;
              return (
                <div key={g.id} className={gi > 0 ? "mt-12" : ""}>
                  <Reveal>
                    <h3 className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">
                      {t(g.label, g.en)}
                    </h3>
                  </Reveal>
                  <ul className="mt-5 border-t border-cream/15">
                    {items.map((a, i) => {
                      const idx = AWARDS.indexOf(a);
                      return (
                        <Reveal key={a.issuer + a.year} delay={0.05 * Math.min(i, 3)}>
                          <li className="grid gap-2 border-b border-cream/10 py-6 md:grid-cols-12 md:gap-6">
                            <span className="font-mono text-[11px] tabular-nums text-gold/80 md:col-span-3">
                              {t(`award.${idx}.year`, a.year)}
                            </span>
                            <div className="md:col-span-9">
                              <h4 className="font-display text-xl font-semibold text-cream">
                                {t(`award.${idx}.issuer`, a.issuer)}
                              </h4>
                              <p className="mt-2 max-w-[58ch] text-[15px] leading-relaxed text-cream/65">
                                {t(`award.${idx}.text`, a.text)}
                              </p>
                            </div>
                          </li>
                        </Reveal>
                      );
                    })}
                  </ul>
                </div>
              );
            })}

            <Reveal delay={0.1}>
              <p className="mt-10 max-w-[60ch] text-sm leading-relaxed text-cream/45">
                {t("about.awards.training", STAFF_TRAINING)}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Values (animated) ---------------- */

function Values() {
  const { t } = useI18n();
  const reduce = useReducedMotion();

  return (
    <section className="bg-parchment">
      <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28">
        <Reveal>
          <h2 className="display-2 max-w-2xl text-4xl md:text-5xl">
            {t("about.values.title", "The values behind every batch")}
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {VALUES.map((v, i) => {
            const Icon = VALUE_ICONS[v.icon as keyof typeof VALUE_ICONS];
            const d = i * 0.09;
            return (
              <motion.div
                key={v.title}
                className="group relative"
                initial={reduce ? false : { opacity: 0, y: 34 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.75, delay: d, ease: EASE }}
              >
                {/* Static hairline with a gold rule that draws across it on entry */}
                <div className="relative h-px w-full bg-linen">
                  <motion.div
                    className="absolute inset-y-0 left-0 w-full origin-left bg-gold"
                    initial={reduce ? false : { scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 1, delay: d + 0.15, ease: EASE }}
                  />
                </div>

                <div className="pt-8 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5">
                  <div className="flex items-center gap-4">
                    <motion.span
                      className="flex h-12 w-12 items-center justify-center bg-gold/15 text-gold-deep transition-colors duration-500 group-hover:bg-gold group-hover:text-ink"
                      initial={reduce ? false : { scale: 0.4, opacity: 0, rotate: -12 }}
                      whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ type: "spring", stiffness: 240, damping: 16, delay: d + 0.22 }}
                    >
                      <Icon size={24} weight="duotone" />
                    </motion.span>
                    <span className="font-mono text-[11px] tabular-nums text-clay/45 transition-colors duration-500 group-hover:text-gold-deep">
                      0{i + 1}
                    </span>
                  </div>

                  <h3 className="mt-5 font-display text-2xl font-semibold text-ink">
                    {t(`value.${i}.title`, v.title)}
                  </h3>
                  <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed">{t(`value.${i}.text`, v.text)}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- People: the workforce behind the product ---------------- */

function People() {
  const { t } = useI18n();
  const reduce = useReducedMotion();

  return (
    <section className="overflow-hidden bg-ink">
      <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-5">
            <Reveal>
              <h2 className="display-2 text-4xl !text-cream md:text-5xl">
                <Accent text={t("about.people.title", "A thousand people make *every batch.*")} tone="dark" />
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-cream/70">
                {t(
                  "about.people.body",
                  "Our social footprint starts with employment: 1,026 jobs in Adama, with a large share of our factory floor roles held by women. Formal, steady income in a region where that still matters enormously."
                )}
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <div className="grid grid-cols-2 gap-6 sm:gap-10">
              {[
                { v: "1,026", l: t("about.people.stat1", "People employed") },
                { v: "2011", l: t("about.people.stat2", "Building this team since") },
              ].map((s, i) => (
                <Reveal key={s.l} delay={0.14 + i * 0.08}>
                  <div className="border-t border-cream/15 pt-5">
                    <div className="font-display text-4xl font-semibold text-gold md:text-5xl">{s.v}</div>
                    <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-cream/55">{s.l}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* The whole workforce, from above */}
        <motion.figure
          className="group relative mt-14 overflow-hidden"
          initial={reduce ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <Img
            src={IMAGES.teamGroup}
            alt="The Fikir Food Processing workforce assembled outside the Adama plant"
            loading="lazy"
            className="aspect-[16/9] w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/85 to-transparent" />
          <figcaption className="absolute inset-x-0 bottom-0 p-6 font-mono text-[10px] uppercase tracking-[0.2em] text-cream/80 md:p-8">
            {t("about.people.capTeam", "The team outside the Adama plant")}
          </figcaption>
        </motion.figure>

        {/* Leadership at the table */}
        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <motion.figure
            className="group relative overflow-hidden lg:col-span-7"
            initial={reduce ? false : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, delay: 0.08, ease: EASE }}
          >
            <Img
              src={IMAGES.ceoMeeting}
              alt="The management committee meeting with the CEO at the Adama head office"
              loading="lazy"
              className="aspect-[16/10] w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/85 to-transparent" />
            <figcaption className="absolute inset-x-0 bottom-0 p-6 font-mono text-[10px] uppercase tracking-[0.2em] text-cream/80 md:p-8">
              {t("about.people.capMeeting", "The management committee, with the CEO")}
            </figcaption>
          </motion.figure>

          <motion.div
            className="flex flex-col justify-center border-l-2 border-gold/60 pl-8 lg:col-span-5"
            initial={reduce ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.16, ease: EASE }}
          >
            <p className="font-display text-2xl font-medium leading-snug text-cream md:text-3xl">
              {t(
                "about.people.quote",
                "Every decision that reaches the production floor is argued out in this room first."
              )}
            </p>
            <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.2em] text-cream/50">
              {COMPANY.ceo} · {t("about.ceoRole", "Chief Executive Officer")}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Why us (animated) ---------------- */

function WhyUs() {
  const { t } = useI18n();
  const reduce = useReducedMotion();

  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <span className="eyebrow">{t("about.why.eyebrow", "Why choose us")}</span>
                <h2 className="display-2 mt-5 text-4xl md:text-5xl">
                  <Accent text={t("about.why.title", "Reasons customers *stay with us.*")} />
                </h2>
              </Reveal>
            </div>
          </div>

          <div className="lg:col-span-8 lg:col-start-5">
            <div className="grid gap-px border border-linen bg-linen sm:grid-cols-2">
              {WHY_US.map((w, i) => (
                <motion.div
                  key={w.title}
                  className="group relative isolate flex h-full min-h-[210px] flex-col justify-between overflow-hidden bg-cream p-7"
                  initial={reduce ? false : { opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.7, delay: i * 0.07, ease: EASE }}
                >
                  {/* Ink panel sweeps up on hover; text inverts to cream */}
                  <span
                    aria-hidden
                    className="absolute inset-0 -z-10 translate-y-full bg-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0"
                  />
                  <motion.span
                    className="font-display text-4xl font-semibold text-gold/50 transition-colors duration-500 group-hover:text-gold"
                    initial={reduce ? false : { opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: i * 0.07 + 0.12, ease: EASE }}
                  >
                    0{i + 1}
                  </motion.span>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-ink transition-colors duration-500 group-hover:text-cream">
                      {t(`why.${i}.title`, w.title)}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-clay/90 transition-colors duration-500 group-hover:text-cream/75">
                      {t(`why.${i}.text`, w.text)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
