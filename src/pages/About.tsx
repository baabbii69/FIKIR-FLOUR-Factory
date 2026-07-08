import { SealCheck, Handshake, Leaf, Flask } from "@phosphor-icons/react";
import PageHero from "../components/PageHero";
import CTABanner from "../components/CTABanner";
import Reveal from "../components/Reveal";
import Btn from "../components/Btn";
import { usePageMeta } from "../lib/usePageMeta";
import { VALUES, TIMELINE, TEAM, CERTIFICATIONS, IMAGES } from "../data/site";

const VALUE_ICONS = {
  seal: SealCheck,
  handshake: Handshake,
  leaf: Leaf,
  flask: Flask,
} as const;

export default function About() {
  usePageMeta(
    "About Us | FIKIR FOOD PROCESSING",
    "Six decades of milling excellence in Adama, Ethiopia. Our story, values, leadership, and certifications."
  );

  return (
    <>
      <PageHero
        image={IMAGES.wheatAerial}
        alt="Aerial view of golden wheat fields at harvest"
        crumb="About Us"
        title="Six decades of"
        titleAccent="devotion to grain."
      />

      {/* Mission split */}
      <section className="bg-cream">
        <div className="mx-auto grid max-w-[1400px] gap-14 px-5 py-20 md:px-10 md:py-28 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <Reveal>
              <span className="eyebrow">Who we are</span>
              <h2 className="display-2 mt-5 text-4xl md:text-5xl">
                Fikir means love. It is also how we{" "}
                <em className="pb-1 leading-[1.1] text-gold-deep">work.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-8 max-w-[62ch] text-base leading-relaxed">
                In 1962, a single stone mill began turning beside the Awash River near Adama.
                The founders had one conviction: that flour made with care behaves differently
                in the hands of a baker. Sixty-two years later, that conviction still runs
                every shift.
              </p>
              <p className="mt-5 max-w-[62ch] text-base leading-relaxed">
                Today FIKIR FOOD PROCESSING mills 2,400 metric tons a day for 850+ clients in 38
                countries, from village bakeries to industrial food manufacturers. The scale
                has changed. The standard has not: every batch is tested, every shipment is
                certified, and every client is treated as a partner.
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="mt-10">
                <Btn to="/factory" variant="outline-ink" arrow>
                  Tour our factory
                </Btn>
              </div>
            </Reveal>
          </div>

          <div className="relative lg:col-span-6">
            <Reveal className="lg:pl-8">
              <img
                src={IMAGES.factoryAbout}
                alt="Modern flour milling facility interior"
                loading="lazy"
                className="aspect-[4/5] w-full object-cover"
              />
            </Reveal>
            <Reveal delay={0.14}>
              <div className="ml-auto -mt-16 w-fit max-w-[280px] bg-ink p-8 lg:-mt-24 lg:mr-8">
                <div className="font-display text-6xl font-semibold text-gold">62</div>
                <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-cream/60">
                  Years of milling on the same ground
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-parchment">
        <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28">
          <Reveal>
            <h2 className="display-2 max-w-2xl text-4xl md:text-5xl">
              What we refuse to compromise
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-2">
            {VALUES.map((v, i) => {
              const Icon = VALUE_ICONS[v.icon as keyof typeof VALUE_ICONS];
              return (
                <Reveal key={v.title} delay={0.06 * i}>
                  <div className="border-t border-linen pt-8">
                    <div className="flex items-start gap-5">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center bg-gold/15 text-gold-deep">
                        <Icon size={24} weight="duotone" />
                      </span>
                      <div>
                        <h3 className="font-display text-2xl font-semibold text-ink">
                          {v.title}
                        </h3>
                        <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed">{v.text}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section id="history" className="bg-ink">
        <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <Reveal>
                  <span className="eyebrow">Our history</span>
                  <h2 className="display-2 mt-5 text-4xl !text-cream md:text-5xl">
                    From one stone mill to{" "}
                    <em className="pb-1 leading-[1.1] text-gold">2,400 tons a day.</em>
                  </h2>
                  <p className="mt-6 max-w-sm text-base leading-relaxed text-cream/65">
                    Six milestones that shaped who we are, each one built on the last.
                  </p>
                </Reveal>
              </div>
            </div>
            <div className="lg:col-span-8 lg:col-start-5">
              <ol className="relative border-l border-cream/15">
                {TIMELINE.map((t, i) => (
                  <Reveal key={t.year} delay={0.05 * Math.min(i, 3)}>
                    <li className="relative pb-14 pl-10 last:pb-0 md:pl-14">
                      <span className="absolute -left-[5px] top-2.5 h-[9px] w-[9px] rounded-full bg-gold" />
                      <div className="font-display text-4xl font-semibold text-gold md:text-5xl">
                        {t.year}
                      </div>
                      <h3 className="mt-3 font-display text-2xl font-semibold text-cream">
                        {t.title}
                      </h3>
                      <p className="mt-3 max-w-[58ch] text-[15px] leading-relaxed text-cream/70">
                        {t.text}
                      </p>
                    </li>
                  </Reveal>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section id="team" className="bg-cream">
        <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <Reveal>
              <h2 className="display-2 max-w-xl text-4xl md:text-5xl">
                The people behind the flour
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="max-w-sm text-[15px] leading-relaxed text-clay/90">
                A leadership team of millers, engineers, and food scientists, most of whom
                started on the production floor.
              </p>
            </Reveal>
          </div>
          <div className="mt-14 grid gap-px overflow-hidden border border-linen bg-linen sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((m, i) => (
              <Reveal key={m.name} delay={0.05 * i} className="h-full">
                <div className="group flex h-full min-h-[260px] flex-col justify-between bg-cream p-8 transition-colors duration-300 hover:bg-parchment">
                  <span className="font-display text-5xl font-semibold text-gold/50 transition-colors duration-300 group-hover:text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl font-semibold leading-tight text-ink">
                      {m.name}
                    </h3>
                    <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-clay/80">
                      {m.role}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="bg-parchment">
        <div className="mx-auto grid max-w-[1400px] gap-14 px-5 py-20 md:px-10 md:py-28 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Reveal>
              <span className="eyebrow">Certified quality</span>
              <h2 className="display-2 mt-5 text-4xl md:text-5xl">
                Audited. Certified.{" "}
                <em className="pb-1 leading-[1.1] text-gold-deep">Proven.</em>
              </h2>
              <p className="mt-6 max-w-[52ch] text-base leading-relaxed">
                Certificates are not decorations to us. They are third-party proof that the
                systems behind every bag of flour hold up under scrutiny, year after year.
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <img
                src={IMAGES.milling}
                alt="Quality control laboratory inside the mill"
                loading="lazy"
                className="mt-10 aspect-[16/10] w-full object-cover"
              />
            </Reveal>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <div className="grid gap-px border border-linen bg-linen sm:grid-cols-2">
              {CERTIFICATIONS.map((c, i) => (
                <Reveal key={c.name} delay={0.05 * i} className="h-full">
                  <div className="flex h-full min-h-[220px] flex-col justify-between bg-parchment p-8">
                    <SealCheck size={28} weight="duotone" className="text-gold-deep" />
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-clay/70">
                        {c.label}
                      </p>
                      <h3 className="mt-2 font-display text-2xl font-semibold text-ink">
                        {c.name}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-clay/90">{c.meta}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTABanner
        image={IMAGES.wheatHarvest}
        alt="Wheat harvest at golden hour"
        title="Write the next chapter"
        titleAccent="with us."
        text="Whether you bake for a neighbourhood or manufacture for a continent, our team is ready to talk."
        primary="Request a quote"
        primaryTo="/contact"
        secondary="Explore products"
        secondaryTo="/products"
      />
    </>
  );
}
