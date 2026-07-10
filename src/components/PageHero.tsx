import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { useI18n } from "../i18n/I18nProvider";

/** Interior page hero: full-bleed image, bottom-left aligned title. */
export default function PageHero({
  image,
  alt,
  crumb,
  title,
  titleAccent,
}: {
  image: string;
  alt: string;
  crumb: string;
  title: string;
  titleAccent?: string;
}) {
  const reduce = useReducedMotion();
  const { t } = useI18n();
  return (
    <section className="relative flex min-h-[52vh] items-end overflow-hidden bg-ink pt-24">
      <div className="absolute inset-0">
        <img src={image} alt={alt} className="kenburns h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/25" />
      </div>
      <div className="relative mx-auto w-full max-w-[1400px] px-5 pb-14 md:px-10 md:pb-20">
        <motion.nav
          aria-label="Breadcrumb"
          className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-cream/60"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link to="/" className="transition-colors hover:text-gold">
            {t("crumb.home", "Home")}
          </Link>
          <span className="mx-3 text-gold">/</span>
          <span className="text-cream/85">{crumb}</span>
        </motion.nav>
        <motion.h1
          className="display-1 max-w-4xl text-5xl !text-cream md:text-6xl lg:text-7xl"
          initial={reduce ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          {title}
          {titleAccent && (
            <>
              {" "}
              <em className="pb-1 leading-[1.1] text-gold">{titleAccent}</em>
            </>
          )}
        </motion.h1>
      </div>
    </section>
  );
}
