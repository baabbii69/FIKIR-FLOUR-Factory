import { motion, useReducedMotion } from "motion/react";
import Btn from "../components/Btn";
import { usePageMeta } from "../lib/usePageMeta";
import { useI18n } from "../i18n/I18nProvider";
import { Accent } from "../i18n/Accent";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function NotFound() {
  usePageMeta("Page not found | FIKIR FOOD PROCESSING");
  const { t } = useI18n();
  const reduce = useReducedMotion();

  return (
    <section className="relative flex min-h-[100dvh] items-center overflow-hidden bg-ink">
      {/* Giant ghost numeral */}
      <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <motion.span
          initial={reduce ? false : { opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: EASE }}
          className="select-none font-display text-[46vw] font-semibold leading-none text-cream/[0.05] md:text-[34rem]"
        >
          404
        </motion.span>
      </div>
      {/* Brand glows */}
      <div aria-hidden className="pointer-events-none absolute -right-40 top-1/3 h-[560px] w-[560px] -translate-y-1/2 rounded-full bg-green/10 blur-[120px]" />
      <div aria-hidden className="pointer-events-none absolute -left-40 bottom-0 h-[420px] w-[420px] rounded-full bg-gold/10 blur-[120px]" />

      <div className="relative mx-auto w-full max-w-[1400px] px-5 py-32 md:px-10">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-gold">{t("nf.tag", "Error 404")}</p>
          <h1 className="display-1 mt-6 max-w-3xl text-5xl !text-cream sm:text-6xl md:text-7xl">
            <Accent text={t("nf.title", "This page slipped through the *sieve.*")} tone="dark" />
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-cream/65">
            {t("nf.body", "The address you followed does not exist or has moved. Everything we make is still here.")}
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Btn to="/" arrow>
              {t("nf.home", "Back to home")}
            </Btn>
            <Btn to="/products" variant="outline-cream">
              {t("cta.exploreProducts", "Explore products")}
            </Btn>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
